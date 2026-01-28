const express = require('express');
const cors = require('cors');
const path = require('path');
const ResultAggregator = require('../src/distributed/result-aggregator');
const DistributedScanner = require('../src/distributed/distributed-scanner');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const aggregator = new ResultAggregator();
const scanner = new DistributedScanner();

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.3.1'
  });
});

app.get('/api/scans', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const results = await aggregator.getAllScanResults(limit, offset);
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/scans/:scanId', async (req, res) => {
  try {
    const result = await aggregator.getScanResult(req.params.scanId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/scans', async (req, res) => {
  try {
    const { projectPath, options } = req.body;

    scanner.registerWorker({
      id: 'api-worker',
      url: null
    });

    const result = await scanner.scanProject(projectPath, options);

    await aggregator.saveScanResult(result.scanId, result);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await aggregator.getVulnerabilityStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/trend', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const trend = await aggregator.getTrendAnalysis(days);
    res.json({
      success: true,
      data: trend
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const index = await aggregator.getAllScanResults(10000);
    const projects = {};

    index.forEach(entry => {
      const projectPath = entry.projectPath || 'unknown';
      if (!projects[projectPath]) {
        projects[projectPath] = {
          projectPath,
          scans: 0,
          totalVulnerabilities: 0,
          highSeverity: 0,
          mediumSeverity: 0,
          lowSeverity: 0,
          lastScan: entry.scannedAt
        };
      }

      projects[projectPath].scans++;
      projects[projectPath].totalVulnerabilities += entry.summary.totalVulnerabilities;
      projects[projectPath].highSeverity += entry.summary.highSeverity;
      projects[projectPath].mediumSeverity += entry.summary.mediumSeverity;
      projects[projectPath].lowSeverity += entry.summary.lowSeverity;

      if (new Date(entry.scannedAt) > new Date(projects[projectPath].lastScan)) {
        projects[projectPath].lastScan = entry.scannedAt;
      }
    });

    const projectList = Object.values(projects).sort((a, b) => {
      return new Date(b.lastScan) - new Date(a.lastScan);
    });

    res.json({
      success: true,
      data: projectList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/scans/:scanId', async (req, res) => {
  try {
    await aggregator.deleteScanResult(req.params.scanId);
    res.json({
      success: true,
      message: `Scan ${req.params.scanId} deleted`
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/cleanup', async (req, res) => {
  try {
    const days = parseInt(req.body.days) || 90;
    const deleted = await aggregator.cleanupOldResults(days);
    res.json({
      success: true,
      message: `Cleaned up ${deleted} old scan results`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Vue Security Dashboard API running on port ${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
