#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk').default;
const fs = require('fs');
const path = require('path');
const { scanVueProject } = require('../src/scanner');

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
  .version('1.5.1')
  .argument('[project-path]', 'path to Vue.js project', '.')
  .option('-o, --output <format>', 'output format (json, text, html)', 'text')
  .option('-r, --report <path>', 'report output file path')
  .option('-l, --level <level>', 'scan level (basic, detailed)', 'basic')
  .option('-c, --config <path>', 'configuration file path')
  .option('-b, --batch-size <size>', 'number of files to process per batch (default: 10)', '10')
  .option('-m, --memory-threshold <mb>', 'memory threshold in MB to trigger GC (default: 100)', '100')
  .option('-g, --gc-interval <files>', 'trigger GC after scanning N files (default: 10)', '10')
  .option('--advanced-report', 'enable advanced reporting with trends and compliance analysis')
  .option('--summary', 'enable summary mode (only show summary, no detailed vulnerabilities)')
  .option('--expose-gc', 'enable manual garbage collection')
  .action(async (projectPath, options) => {
    console.log(chalk.blue('Starting Vue.js Security Scan...\n'));
    
    // Enable manual GC if requested
    if (options.exposeGc && !global.gc) {
      console.log(chalk.yellow('Note: Run with node --expose-gc flag to enable manual garbage collection'));
    }
    
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
      config,
      batchSize: parseInt(options.batchSize) || 10,
      memoryThreshold: (parseInt(options.memoryThreshold) || 100) * 1024 * 1024,
      gcInterval: parseInt(options.gcInterval) || 10,
      output: {
        ...options,
        advancedReport: options.advancedReport || false
      }
    };
    
    try {
      const results = await scanVueProject(projectPath, scanOptions);
      
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
      
      if (options.report) {
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