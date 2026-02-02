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

const aggregator = new ResultAggregator({
  storagePath: path.join(__dirname, '..', '.vue-security-data')
});
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

app.get('/api/scans/:scanId/details', async (req, res) => {
  try {
    const result = await aggregator.getScanResult(req.params.scanId);
    
    // Enhance the scan result with additional details
    const enhancedResult = {
      ...result,
      detailedStats: {
        bySeverity: {
          high: result.summary.highSeverity,
          medium: result.summary.mediumSeverity,
          low: result.summary.lowSeverity
        },
        byType: result.vulnerabilities ? 
          result.vulnerabilities.reduce((acc, vuln) => {
            const type = vuln.type || 'Unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {}) : {},
        totalFilesScanned: result.filesScanned || 0,
        scanDuration: result.scanDuration || 0,
        falsePositives: result.falsePositives || 0
      }
    };
    
    res.json({
      success: true,
      data: enhancedResult
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
          lastScan: entry.scannedAt,
          averageVulnerabilities: 0
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

    // Calculate average vulnerabilities per project
    Object.values(projects).forEach(project => {
      project.averageVulnerabilities = project.scans > 0 ? 
        Math.round(project.totalVulnerabilities / project.scans * 10) / 10 : 0;
    });

    const projectList = Object.values(projects).sort((a, b) => {
      return new Date(b.lastScan) - new Date(a.lastScan);
    });

    res.json({
      success: true,
      data: projectList,
      total: projectList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/projects/:projectPath', async (req, res) => {
  try {
    const projectPath = decodeURIComponent(req.params.projectPath);
    const index = await aggregator.getAllScanResults(10000);
    
    const projectScans = index.filter(entry => entry.projectPath === projectPath);
    
    if (projectScans.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Calculate project statistics
    const stats = projectScans.reduce((acc, scan) => {
      acc.scans++;
      acc.totalVulnerabilities += scan.summary.totalVulnerabilities;
      acc.highSeverity += scan.summary.highSeverity;
      acc.mediumSeverity += scan.summary.mediumSeverity;
      acc.lowSeverity += scan.summary.lowSeverity;
      return acc;
    }, {
      scans: 0,
      totalVulnerabilities: 0,
      highSeverity: 0,
      mediumSeverity: 0,
      lowSeverity: 0
    });

    stats.averageVulnerabilities = stats.scans > 0 ? 
      Math.round(stats.totalVulnerabilities / stats.scans * 10) / 10 : 0;
    stats.lastScan = projectScans.sort((a, b) => 
      new Date(b.scannedAt) - new Date(a.scannedAt)
    )[0].scannedAt;

    res.json({
      success: true,
      data: {
        projectPath,
        ...stats,
        recentScans: projectScans.slice(0, 10).map(scan => ({
          scanId: scan.scanId,
          scannedAt: scan.scannedAt,
          summary: scan.summary
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/projects/:projectPath/trend', async (req, res) => {
  try {
    const projectPath = decodeURIComponent(req.params.projectPath);
    const days = parseInt(req.query.days) || 30;
    
    const index = await aggregator.getAllScanResults(10000);
    const projectScans = index.filter(entry => entry.projectPath === projectPath);
    
    if (projectScans.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Calculate trend data
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const trendData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayScans = projectScans.filter(scan => 
        scan.scannedAt.startsWith(dateStr)
      );
      
      if (dayScans.length > 0) {
        const dayStats = dayScans.reduce((acc, scan) => {
          acc.totalVulnerabilities += scan.summary.totalVulnerabilities;
          acc.highSeverity += scan.summary.highSeverity;
          acc.mediumSeverity += scan.summary.mediumSeverity;
          acc.lowSeverity += scan.summary.lowSeverity;
          return acc;
        }, {
          totalVulnerabilities: 0,
          highSeverity: 0,
          mediumSeverity: 0,
          lowSeverity: 0
        });
        
        trendData.push({
          date: dateStr,
          ...dayStats
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: trendData
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
