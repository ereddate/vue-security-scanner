#!/usr/bin/env node

const DistributedScanner = require('../src/distributed/distributed-scanner');
const ResultAggregator = require('../src/distributed/result-aggregator');
const fs = require('fs');
const path = require('path');

const program = require('commander');

program
  .version('1.3.1')
  .description('Vue Security Scanner - Distributed Mode');

program
  .command('scan <project-path>')
  .description('Scan a Vue project using distributed workers')
  .option('-w, --workers <workers>', 'Number of workers or worker config file', '1')
  .option('-b, --batch-size <size>', 'Batch size for task distribution', '10')
  .option('-o, --output <format>', 'Output format (json, text)', 'json')
  .option('-r, --report <path>', 'Report file path', 'security-report.json')
  .option('--save-results', 'Save scan results to database', false)
  .action(async (projectPath, options) => {
    try {
      console.log('Starting distributed security scan...');

      const scanner = new DistributedScanner({
        distributed: {
          batchSize: parseInt(options.batchSize),
          taskTimeout: 300000,
          maxRetries: 3
        }
      });

      let workers = [];

      if (fs.existsSync(options.workers)) {
        const workerConfig = JSON.parse(fs.readFileSync(options.workers, 'utf8'));
        workers = workerConfig.workers || [];
      } else {
        const numWorkers = parseInt(options.workers);
        for (let i = 0; i < numWorkers; i++) {
          workers.push({
            id: `worker-${i}`,
            url: null
          });
        }
      }

      workers.forEach(worker => scanner.registerWorker(worker));

      const result = await scanner.scanProject(projectPath, {
        output: {
          format: options.output,
          showProgress: true
        }
      });

      if (options.output === 'json') {
        fs.writeFileSync(options.report, JSON.stringify(result, null, 2));
        console.log(`\nScan report saved to: ${options.report}`);
      } else {
        console.log('\n=== Scan Results ===');
        console.log(`Scan ID: ${result.scanId}`);
        console.log(`Files Scanned: ${result.summary.filesScanned}`);
        console.log(`Total Vulnerabilities: ${result.summary.totalVulnerabilities}`);
        console.log(`High Severity: ${result.summary.highSeverity}`);
        console.log(`Medium Severity: ${result.summary.mediumSeverity}`);
        console.log(`Low Severity: ${result.summary.lowSeverity}`);
      }

      if (options.saveResults) {
        const aggregator = new ResultAggregator();
        await aggregator.saveScanResult(result.scanId, result);
        console.log(`\nScan result saved to database: ${result.scanId}`);
      }

      process.exit(0);
    } catch (error) {
      console.error('Error during distributed scan:', error.message);
      process.exit(1);
    }
  });

program
  .command('worker')
  .description('Start a distributed scan worker')
  .option('-p, --port <port>', 'Worker port', '3001')
  .option('-i, --worker-id <id>', 'Worker ID', 'worker-1')
  .action(async (options) => {
    const express = require('express');
    const app = express();
    const { SecurityScanner } = require('../src/scanner');

    app.use(express.json());

    const scanner = new SecurityScanner();

    app.post('/api/scan', async (req, res) => {
      try {
        const { task, options } = req.body;
        console.log(`Received task: ${task.id} with ${task.files.length} files`);

        const vulnerabilities = [];

        for (const filePath of task.files) {
          try {
            const fileVulns = await scanner.scanFile(filePath);
            vulnerabilities.push(...fileVulns);
          } catch (error) {
            console.error(`Error scanning file ${filePath}:`, error.message);
          }
        }

        res.json({
          success: true,
          taskId: task.id,
          vulnerabilities,
          scannedAt: new Date().toISOString()
        });

        console.log(`Task ${task.id} completed: ${vulnerabilities.length} vulnerabilities found`);
      } catch (error) {
        console.error('Error processing scan task:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        workerId: options.workerId,
        timestamp: new Date().toISOString()
      });
    });

    app.listen(options.port, () => {
      console.log(`Distributed scan worker started: ${options.workerId}`);
      console.log(`Listening on port: ${options.port}`);
      console.log(`Health check: http://localhost:${options.port}/health`);
    });
  });

program
  .command('status <scan-id>')
  .description('Get status of a distributed scan')
  .action(async (scanId) => {
    try {
      const aggregator = new ResultAggregator();
      const result = await aggregator.getScanResult(scanId);

      console.log('\n=== Scan Status ===');
      console.log(`Scan ID: ${result.scanId}`);
      console.log(`Scanned At: ${result.scannedAt}`);
      console.log(`Files Scanned: ${result.summary.filesScanned}`);
      console.log(`Total Vulnerabilities: ${result.summary.totalVulnerabilities}`);
      console.log(`High Severity: ${result.summary.highSeverity}`);
      console.log(`Medium Severity: ${result.summary.mediumSeverity}`);
      console.log(`Low Severity: ${result.summary.lowSeverity}`);
      console.log(`Workers: ${result.workers.length}`);
      console.log(`Progress: ${result.progress.progress}%`);
    } catch (error) {
      console.error('Error getting scan status:', error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all scan results')
  .option('-l, --limit <limit>', 'Limit results', '10')
  .option('-o, --offset <offset>', 'Offset results', '0')
  .action(async (options) => {
    try {
      const aggregator = new ResultAggregator();
      const results = await aggregator.getAllScanResults(
        parseInt(options.limit),
        parseInt(options.offset)
      );

      console.log('\n=== Scan Results ===');
      console.log(`Total: ${results.length} results\n`);

      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.scanId}`);
        console.log(`   Date: ${result.scannedAt}`);
        console.log(`   Vulnerabilities: ${result.summary.totalVulnerabilities}`);
        console.log(`   Project: ${result.projectPath}`);
        console.log('');
      });
    } catch (error) {
      console.error('Error listing scan results:', error.message);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Get vulnerability statistics')
  .action(async () => {
    try {
      const aggregator = new ResultAggregator();
      const stats = await aggregator.getVulnerabilityStatistics();

      console.log('\n=== Vulnerability Statistics ===');
      console.log(`Total Scans: ${stats.totalScans}`);
      console.log(`Total Vulnerabilities: ${stats.totalVulnerabilities}`);
      console.log(`High Severity: ${stats.totalHighSeverity}`);
      console.log(`Medium Severity: ${stats.totalMediumSeverity}`);
      console.log(`Low Severity: ${stats.totalLowSeverity}`);
      console.log(`Average per Scan: ${stats.avgVulnerabilitiesPerScan}`);

      console.log('\n=== Most Vulnerable Projects ===');
      stats.mostVulnerableProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.projectPath}: ${project.count} vulnerabilities`);
      });

      console.log('\n=== 30-Day Trend ===');
      stats.vulnerabilityTrend.slice(-7).forEach(entry => {
        console.log(`${entry.date}: ${entry.totalVulnerabilities} vulnerabilities (${entry.scans} scans)`);
      });
    } catch (error) {
      console.error('Error getting statistics:', error.message);
      process.exit(1);
    }
  });

program
  .command('cleanup')
  .description('Clean up old scan results')
  .option('-d, --days <days>', 'Days to keep', '90')
  .action(async (options) => {
    try {
      const aggregator = new ResultAggregator();
      const deleted = await aggregator.cleanupOldResults(parseInt(options.days));
      console.log(`Cleaned up ${deleted} old scan results`);
    } catch (error) {
      console.error('Error cleaning up:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
