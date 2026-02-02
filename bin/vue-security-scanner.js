#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk').default;
const fs = require('fs');
const path = require('path');
const { scanVueProject } = require('../src/scanner');

// Memory management utilities
class MemoryManager {
  constructor(options) {
    this.options = options;
    this.memoryStats = {
      start: process.memoryUsage(),
      peak: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 },
      current: null,
      history: [],
      gcCount: 0,
      gcTime: 0
    };
    this.fileCount = 0;
    this.batchCount = 0;
    this.lastGcTime = Date.now();
    this.enabled = true;
  }

  updateStats() {
    if (!this.enabled) return;
    
    const usage = process.memoryUsage();
    this.memoryStats.current = usage;
    this.memoryStats.history.push({
      timestamp: Date.now(),
      usage: { ...usage },
      fileCount: this.fileCount,
      batchCount: this.batchCount
    });

    // Update peak memory usage
    if (usage.rss > this.memoryStats.peak.rss) {
      this.memoryStats.peak = { ...usage };
    }

    // Keep history size manageable
    if (this.memoryStats.history.length > 100) {
      this.memoryStats.history = this.memoryStats.history.slice(-50);
    }
  }

  shouldTriggerGC() {
    if (!this.enabled || !global.gc) return false;

    const usage = process.memoryUsage();
    const heapUsedMB = usage.heapUsed / (1024 * 1024);
    const rssMB = usage.rss / (1024 * 1024);

    // Check memory threshold
    if (heapUsedMB > this.options.memoryThreshold / 1024 / 1024) {
      return true;
    }

    // Check GC interval
    if (this.fileCount > 0 && this.fileCount % this.options.gcInterval === 0) {
      return true;
    }

    // Check memory growth rate
    if (this.memoryStats.history.length > 5) {
      const recent = this.memoryStats.history.slice(-5);
      const growthRate = recent[recent.length - 1].usage.heapUsed - recent[0].usage.heapUsed;
      if (growthRate > 50 * 1024 * 1024) { // 50MB growth in recent scans
        return true;
      }
    }

    return false;
  }

  triggerGC() {
    if (!this.enabled || !global.gc) return false;

    const before = process.memoryUsage();
    const startTime = Date.now();

    try {
      global.gc();
      this.memoryStats.gcCount++;
      this.memoryStats.gcTime += (Date.now() - startTime);
      this.lastGcTime = Date.now();

      const after = process.memoryUsage();
      const freed = (before.heapUsed - after.heapUsed) / (1024 * 1024);

      if (freed > 10) { // Only log if freed more than 10MB
        console.log(chalk.green(`[Memory] GC triggered: Freed ${freed.toFixed(2)} MB`));
      }

      return true;
    } catch (error) {
      console.warn(chalk.yellow(`[Memory] GC failed: ${error.message}`));
      return false;
    }
  }

  recordFileProcessed() {
    this.fileCount++;
    this.updateStats();

    if (this.shouldTriggerGC()) {
      this.triggerGC();
    }
  }

  recordBatchProcessed() {
    this.batchCount++;
    this.updateStats();
  }

  getStats() {
    this.updateStats();
    return {
      ...this.memoryStats,
      current: process.memoryUsage(),
      elapsed: Date.now() - (this.memoryStats.startTime || Date.now())
    };
  }

  getSummary() {
    const stats = this.getStats();
    const current = stats.current;
    const peak = stats.peak;

    return {
      current: {
        rss: (current.rss / (1024 * 1024)).toFixed(2),
        heapTotal: (current.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsed: (current.heapUsed / (1024 * 1024)).toFixed(2),
        external: (current.external / (1024 * 1024)).toFixed(2)
      },
      peak: {
        rss: (peak.rss / (1024 * 1024)).toFixed(2),
        heapTotal: (peak.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsed: (peak.heapUsed / (1024 * 1024)).toFixed(2),
        external: (peak.external / (1024 * 1024)).toFixed(2)
      },
      gc: {
        count: stats.gcCount,
        time: stats.gcTime
      },
      files: this.fileCount,
      batches: this.batchCount
    };
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

// Global memory manager instance
let memoryManager = null;

// Helper function to load custom configuration
function loadConfig(projectPath) {
  const configPaths = [
    path.join(projectPath, 'vue-security-scanner.config.json'),
    path.join(projectPath, '.vue-security.json'),
    path.join(process.cwd(), 'vue-security-scanner.config.json'),
    path.join(process.cwd(), '.vue-security.json')
  ];
  
  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      try {
        console.log(chalk.blue(`Loading configuration from: ${configPath}`));
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config;
      } catch (error) {
        console.warn(chalk.yellow(`Could not load config from ${configPath}: ${error.message}`));
      }
    }
  }
  
  return null;
}

const program = new Command();

program
  .name('vue-security-scanner')
  .description('CLI tool for scanning Vue.js projects for security vulnerabilities')
  .version('1.7.0')
  .argument('[project-path]', 'path to Vue.js project', '.')
  .option('-o, --output <format>', 'output format (json, text, html)', 'text')
  .option('-r, --report <path>', 'report output file path')
  .option('-l, --level <level>', 'scan level (basic, detailed)', 'basic')
  .option('-c, --config <path>', 'configuration file path')
  .option('-b, --batch-size <size>', 'number of files to process per batch (default: 10)', '10')
  .option('-m, --memory-threshold <mb>', 'memory threshold in MB to trigger GC (default: 100)', '100')
  .option('-g, --gc-interval <files>', 'trigger GC after scanning N files (default: 10)', '10')
  .option('--memory-monitor', 'enable memory usage monitoring and reporting')
  .option('--memory-limit <mb>', 'maximum memory limit in MB before scan abortion (default: 4096)', '4096')
  .option('--auto-memory-adjust', 'enable automatic memory threshold adjustment based on usage patterns')
  .option('--performance <profile>', 'performance profile (fast, balanced, thorough)', 'balanced')
  .option('--incremental', 'enable incremental scan (only scan changed files)')
  .option('--advanced-report', 'enable advanced reporting with trends and compliance analysis')
  .option('--summary', 'enable summary mode (only show summary, no detailed vulnerabilities)')
  .option('--expose-gc', 'enable manual garbage collection')
  .option('--memory-report', 'generate detailed memory usage report at the end of scan')
  .action(async (projectPath, options) => {
    console.log(chalk.blue('Starting Vue.js Security Scan...\n'));
    
    // Enable manual GC if requested
    if (options.exposeGc && !global.gc) {
      console.log(chalk.yellow('Note: Run with node --expose-gc flag to enable manual garbage collection'));
    }
    
    // Initialize memory manager
    const memoryOptions = {
      memoryThreshold: (parseInt(options.memoryThreshold) || 100) * 1024 * 1024,
      gcInterval: parseInt(options.gcInterval) || 10,
      memoryLimit: (parseInt(options.memoryLimit) || 4096) * 1024 * 1024,
      memoryMonitor: options.memoryMonitor || false,
      autoMemoryAdjust: options.autoMemoryAdjust || false,
      memoryReport: options.memoryReport || false
    };
    
    memoryManager = new MemoryManager(memoryOptions);
    
    // Load custom configuration
    let config = null;
    
    if (options.config) {
      if (fs.existsSync(options.config)) {
        try {
          console.log(chalk.blue(`Loading configuration from: ${options.config}`));
          config = JSON.parse(fs.readFileSync(options.config, 'utf8'));
        } catch (error) {
          console.warn(chalk.yellow(`Could not load config from ${options.config}: ${error.message}`));
        }
      } else {
        console.warn(chalk.yellow(`Configuration file does not exist: ${options.config}`));
      }
    } else {
      config = loadConfig(projectPath);
    }
    
    // Merge memory management options
    const scanOptions = {
      ...options,
      config: {
        ...config,
        performance: {
          ...config?.performance,
          profile: options.performance,
          incrementalScan: {
            ...config?.performance?.incrementalScan,
            enabled: options.incremental || config?.performance?.incrementalScan?.enabled
          },
          memory: {
            ...config?.performance?.memory,
            ...memoryOptions
          }
        }
      },
      batchSize: parseInt(options.batchSize) || 10,
      memoryThreshold: memoryOptions.memoryThreshold,
      gcInterval: memoryOptions.gcInterval,
      memoryLimit: memoryOptions.memoryLimit,
      memoryMonitor: memoryOptions.memoryMonitor,
      autoMemoryAdjust: memoryOptions.autoMemoryAdjust,
      memoryReport: memoryOptions.memoryReport,
      output: {
        ...options,
        advancedReport: options.advancedReport || false
      },
      memoryManager: memoryManager
    };
    
    // Start memory monitoring if enabled
    if (memoryOptions.memoryMonitor) {
      console.log(chalk.blue(`[Memory] Monitoring enabled with threshold: ${options.memoryThreshold}MB, limit: ${options.memoryLimit}MB`));
    }
    
    try {
      // 确保projectPath是有效的字符串
      if (!projectPath || typeof projectPath !== 'string') {
        projectPath = '.';
      }
      
      // Memory limit check interval
      let memoryCheckInterval = null;
      if (options.memoryMonitor) {
        memoryCheckInterval = setInterval(() => {
          const usage = process.memoryUsage();
          const rssMB = usage.rss / (1024 * 1024);
          const heapUsedMB = usage.heapUsed / (1024 * 1024);
          
          if (options.memoryMonitor) {
            console.log(chalk.cyan(`[Memory] Usage: RSS ${rssMB.toFixed(2)}MB, Heap ${heapUsedMB.toFixed(2)}MB`));
          }
          
          // Check memory limit
          if (usage.rss > memoryOptions.memoryLimit) {
            console.error(chalk.red(`[Memory] FATAL: Memory limit exceeded (${rssMB.toFixed(2)}MB > ${options.memoryLimit}MB)`));
            if (memoryCheckInterval) {
              clearInterval(memoryCheckInterval);
            }
            process.exit(1);
          }
        }, 5000); // Check every 5 seconds
      }
      
      const results = await scanVueProject(projectPath, scanOptions);
      
      // Clear memory check interval
      if (memoryCheckInterval) {
        clearInterval(memoryCheckInterval);
      }
      
      // Generate memory usage report if requested
      if (options.memoryReport && memoryManager) {
        const memorySummary = memoryManager.getSummary();
        console.log(chalk.blue('\n=== Memory Usage Report ==='));
        console.log(chalk.blue(`Current Memory Usage:`));
        console.log(chalk.cyan(`  RSS: ${memorySummary.current.rss} MB`));
        console.log(chalk.cyan(`  Heap Total: ${memorySummary.current.heapTotal} MB`));
        console.log(chalk.cyan(`  Heap Used: ${memorySummary.current.heapUsed} MB`));
        console.log(chalk.cyan(`  External: ${memorySummary.current.external} MB`));
        console.log(chalk.blue(`Peak Memory Usage:`));
        console.log(chalk.cyan(`  RSS: ${memorySummary.peak.rss} MB`));
        console.log(chalk.cyan(`  Heap Total: ${memorySummary.peak.heapTotal} MB`));
        console.log(chalk.cyan(`  Heap Used: ${memorySummary.peak.heapUsed} MB`));
        console.log(chalk.cyan(`  External: ${memorySummary.peak.external} MB`));
        console.log(chalk.blue(`Garbage Collection:`));
        console.log(chalk.cyan(`  Count: ${memorySummary.gc.count}`));
        console.log(chalk.cyan(`  Total Time: ${memorySummary.gc.time} ms`));
        console.log(chalk.blue(`Scan Statistics:`));
        console.log(chalk.cyan(`  Files Processed: ${memorySummary.files}`));
        console.log(chalk.cyan(`  Batches Processed: ${memorySummary.batches}`));
        console.log(chalk.blue('==========================\n'));
      }
      
      // Format and output results based on options
      let output;
      switch (options.output) {
        case 'json':
          output = JSON.stringify(results, null, 2);
          break;
        case 'html':
          output = generateHTMLOutput(results, options.summary);
          break;
        default:
          output = generateTextOutput(results, options.summary);
      }
      
      if (options.report && typeof options.report === 'string') {
        fs.writeFileSync(options.report, output);
        console.log(chalk.green(`Report saved to ${options.report}`));
      } else {
        console.log(output);
      }
      
      // Exit with error code if vulnerabilities found
      const totalVulnerabilities = results.summary.totalVulnerabilities;
      if (totalVulnerabilities > 0) {
        console.log(chalk.red(`\n${totalVulnerabilities} vulnerabilities found!`));
        process.exit(1);
      } else {
        console.log(chalk.green('\nNo vulnerabilities found.'));
      }
    } catch (error) {
      console.error(chalk.red(`Error during scan: ${error.message}`));
      console.error(chalk.red(`Stack trace: ${error.stack}`));
      process.exit(1);
    }
  });

program.parse();

function generateTextOutput(results, summaryMode = false) {
  let output = '';
  
  output += chalk.yellow('Security Scan Results\n');
  output += chalk.yellow('=====================\n\n');
  
  output += chalk.bold('Summary:\n');
  output += `- Total Files Scanned: ${results.summary.filesScanned}\n`;
  output += `- Critical Severity: ${results.summary.criticalSeverity || 0}\n`;
  output += `- High Severity: ${results.summary.highSeverity}\n`;
  output += `- Medium Severity: ${results.summary.mediumSeverity}\n`;
  output += `- Low Severity: ${results.summary.lowSeverity}\n`;
  output += `- Total Vulnerabilities: ${results.summary.totalVulnerabilities}\n\n`;
  
  // Display vulnerability classifications if available
  if (results.summary.classifications && Object.keys(results.summary.classifications).length > 0) {
    output += chalk.bold('Vulnerability Classifications:\n');
    const classifications = Object.entries(results.summary.classifications);
    classifications.forEach(([type, stats]) => {
      output += `   ${type}: ${stats.count}\n`;
      if (stats.severity) {
        Object.entries(stats.severity).forEach(([severity, count]) => {
          if (count > 0) {
            output += `     ${severity}: ${count}\n`;
          }
        });
      }
    });
    output += '\n';
  }
  
  if (!summaryMode && results.vulnerabilities.length > 0) {
    output += chalk.bold('Vulnerabilities Found:\n');
    results.vulnerabilities.forEach((vuln, index) => {
      output += `\n${index + 1}. ${chalk.red(vuln.type)} - ${vuln.severity.toUpperCase()} SEVERITY\n`;
      output += `   File: ${vuln.file}\n`;
      output += `   Line: ${vuln.line || 'N/A'}\n`;
      output += `   Description: ${vuln.description}\n`;
      output += `   Recommendation: ${vuln.recommendation}\n`;
    });
  } else if (summaryMode && results.vulnerabilities.length > 0) {
    output += chalk.yellow('(Summary mode enabled - detailed vulnerabilities not shown)\n');
  } else {
    output += chalk.green('No vulnerabilities detected!\n');
  }
  
  return output;
}

function generateHTMLOutput(results, summaryMode = false) {
  // Generate classifications HTML if available
  let classificationsHTML = '';
  if (results.summary.classifications && Object.keys(results.summary.classifications).length > 0) {
    classificationsHTML = `
    <h2>Vulnerability Classifications</h2>
    <div class="classifications">
      ${Object.entries(results.summary.classifications).map(([type, stats]) => `
        <div class="classification">
          <h3>${type}: ${stats.count}</h3>
          ${Object.entries(stats.severity).map(([severity, count]) => 
            count > 0 ? `<p>${severity}: ${count}</p>` : ''
          ).join('')}
        </div>
      `).join('')}
    </div>
    `;
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Vue.js Security Scan Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
    .vulnerability { border: 1px solid #ddd; margin: 10px 0; padding: 10px; border-radius: 5px; }
    .high { background-color: #ffebee; }
    .medium { background-color: #fff3e0; }
    .low { background-color: #e8f5e8; }
    .critical { background-color: #ffcdd2; }
    .note { background-color: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .classifications { margin: 20px 0; }
    .classification { border: 1px solid #ddd; margin: 10px 0; padding: 10px; border-radius: 5px; background-color: #f9f9f9; }
    .classification h3 { margin-top: 0; }
  </style>
</head>
<body>
  <h1>Vue.js Security Scan Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p>Total Files Scanned: ${results.summary.filesScanned}</p>
    <p>Critical Severity: ${results.summary.criticalSeverity || 0}</p>
    <p>High Severity: ${results.summary.highSeverity}</p>
    <p>Medium Severity: ${results.summary.mediumSeverity}</p>
    <p>Low Severity: ${results.summary.lowSeverity}</p>
    <p>Total Vulnerabilities: ${results.summary.totalVulnerabilities}</p>
  </div>
  
  ${classificationsHTML}
  
  <h2>Vulnerabilities Found</h2>
  ${!summaryMode && results.vulnerabilities.length > 0 
    ? results.vulnerabilities.map(vuln => `
      <div class="vulnerability ${vuln.severity.toLowerCase()}">
        <h3>${vuln.type} - ${vuln.severity.toUpperCase()} SEVERITY</h3>
        <p><strong>File:</strong> ${vuln.file}</p>
        <p><strong>Line:</strong> ${vuln.line || 'N/A'}</p>
        <p><strong>Description:</strong> ${vuln.description}</p>
        <p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
      </div>
    `).join('')
    : summaryMode && results.vulnerabilities.length > 0
    ? '<div class="note"><p>Summary mode enabled - detailed vulnerabilities not shown.</p></div>'
    : '<p>No vulnerabilities detected!</p>'
  }
</body>
</html>`;
}