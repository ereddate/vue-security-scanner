const fs = require('fs');
const path = require('path');

// Load from npm package
const { SecurityScanner } = require('vue-security-scanner');
const IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
const AdvancedReportGenerator = require('vue-security-scanner/src/reporting/advanced-report-generator');
const TraeCNIntegration = require('vue-security-scanner/src/integration/trae-cn-integration');

class VueSecurityWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      enabled: true,
      failOnError: false,
      reportLevel: 'warning', // 'error', 'warning', or 'info'
      outputFile: null,
      exclude: [], // Patterns to exclude from scanning
      
      // NEW: Advanced features
      enableSemanticAnalysis: true, // Enable AST-based semantic analysis
      enableDependencyScanning: true, // Enable dependency vulnerability scanning
      enableAdvancedReport: false, // Enable advanced reporting with trends and compliance
      reportHistoryPath: '.vue-security-reports', // Path for report history
      complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'], // Compliance standards to check
      
      // Performance Configuration
      performanceProfile: 'balanced', // 'fast', 'balanced', 'thorough'
      enableParallelScanning: true, // Enable parallel rule matching
      enableIncrementalScanning: true, // Enable incremental scanning
      memoryLimit: 512, // Memory usage limit in MB
      
      // Vue 3.6 Support
      enableVue36Features: true, // Enable Vue 3.6 specific feature detection
      enableVaporModeScanning: true, // Enable scanning for Vapor Mode specific issues
      
      // Trae CN Integration
      enableTraeCN: false, // Enable Trae CN integration
      traeCNApiKey: null, // Trae CN API key
      traeCNProjectId: null, // Trae CN project ID
      traeCNAutoReport: true, // Auto-report vulnerabilities to Trae CN
      traeCNRealtimePush: false, // Push scan results in realtime
      
      ...options
    };
    
    this.scanner = null;
    this.ignoreManager = null;
    this.advancedReportGenerator = null;
    this.traeCNIntegration = null;
    this.allVulnerabilities = []; // Collect all vulnerabilities for final report
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }

    // Initialize Trae CN integration if enabled
    if (this.options.enableTraeCN && this.options.traeCNApiKey) {
      try {
        this.traeCNIntegration = new TraeCNIntegration({
          apiKey: this.options.traeCNApiKey,
          projectId: this.options.traeCNProjectId,
          enableAutoReport: this.options.traeCNAutoReport,
          enableRealtimePush: this.options.traeCNRealtimePush
        });
        console.log('Trae CN integration enabled');
      } catch (error) {
        console.warn('Failed to initialize Trae CN integration:', error.message);
      }
    }

    // Initialize scanner
    const scannerConfig = {
      rules: this.options.rules || {},
      scan: {
        ignoreDirs: this.options.ignoreDirs || [],
        ignorePatterns: this.options.ignorePatterns || [],
        maxSize: this.options.maxSize || 10,
        maxDepth: this.options.maxDepth || 10
      },
      output: {
        showProgress: false, // Disable progress in build process
        format: 'json'
      },
      performance: {
        enableSemanticAnalysis: this.options.enableSemanticAnalysis,
        enableNpmAudit: this.options.enableDependencyScanning,
        enableVulnerabilityDB: this.options.enableDependencyScanning,
        enableParallelScanning: this.options.enableParallelScanning,
        enableIncrementalScanning: this.options.enableIncrementalScanning,
        performanceProfile: this.options.performanceProfile,
        memoryLimit: this.options.memoryLimit
      },
      compliance: {
        enabled: this.options.enableAdvancedReport,
        standards: this.options.complianceStandards
      },
      vue: {
        enableVue36Features: this.options.enableVue36Features,
        enableVaporModeScanning: this.options.enableVaporModeScanning
      }
    };

    this.scanner = new SecurityScanner(scannerConfig);
    this.ignoreManager = new IgnoreManager(process.cwd());
    
    // Initialize advanced report generator if enabled
    if (this.options.enableAdvancedReport) {
      this.advancedReportGenerator = new AdvancedReportGenerator();
    }
    
    // Clear previous vulnerabilities
    this.allVulnerabilities = [];

    // Hook into webpack compilation
    compiler.hooks.initialize.tap('VueSecurityWebpackPlugin', () => {
      console.log('Vue Security Webpack Plugin initialized');
    });

    // Scan modules during compilation
    compiler.hooks.normalModuleFactory.tap('VueSecurityWebpackPlugin', (nmf) => {
      nmf.hooks.afterResolve.tapAsync('VueSecurityWebpackPlugin', (data, callback) => {
        const resource = data.resource;
        
        if (resource && this.shouldScanFile(resource)) {
          fs.readFile(resource, 'utf-8', (err, content) => {
            if (err) {
              console.warn(`Failed to read file for security scan: ${resource}`, err.message);
              return callback();
            }

            this.performSecurityScan(resource, content, compiler)
              .then(() => callback())
              .catch(error => {
                console.warn(`Security scan error for ${resource}:`, error.message);
                callback();
              });
          });
        } else {
          callback();
        }
      });
    });

    // Generate final report after compilation
    compiler.hooks.done.tapAsync('VueSecurityWebpackPlugin', async (stats, callback) => {
      // Scan dependencies if enabled
      if (this.options.enableDependencyScanning) {
        try {
          console.log('Scanning dependencies for vulnerabilities...');
          const dependencyScanner = require('vue-security-scanner/src/analysis/dependency-scanner');
          const depScanner = new dependencyScanner({
            enableNpmAudit: true,
            enableVulnerabilityDB: true
          });
          
          const depVulns = await depScanner.scanDependencies(process.cwd());
          this.allVulnerabilities.push(...depVulns);
          
          console.log(`Found ${depVulns.length} dependency vulnerabilities.`);
        } catch (error) {
          console.warn('Dependency scanning failed:', error.message);
        }
      }

      // Generate report
      const scanResult = {
        summary: {
          totalVulnerabilities: this.allVulnerabilities.length,
          critical: this.allVulnerabilities.filter(v => v.severity === 'Critical').length,
          high: this.allVulnerabilities.filter(v => v.severity === 'High').length,
          medium: this.allVulnerabilities.filter(v => v.severity === 'Medium').length,
          low: this.allVulnerabilities.filter(v => v.severity === 'Low').length
        },
        vulnerabilities: this.allVulnerabilities,
        scanInfo: {
          scannerVersion: '1.6.0',
          scanDate: new Date().toISOString(),
          projectPath: process.cwd()
        }
      };

      // Generate advanced report if enabled
      if (this.options.enableAdvancedReport && this.advancedReportGenerator) {
        try {
          const advancedReport = this.advancedReportGenerator.generateAdvancedReport(scanResult, {
            includeTrends: true,
            includeCompliance: true,
            historyPath: this.options.reportHistoryPath
          });
          
          if (this.options.outputFile) {
            const reportPath = this.options.outputFile.endsWith('.html') 
              ? this.options.outputFile 
              : this.options.outputFile.replace('.json', '.html');
            
            await this.writeAdvancedReport(reportPath, advancedReport, 'html');
          }
        } catch (error) {
          console.warn('Advanced report generation failed:', error.message);
        }
      }

      // Write basic report
      if (this.options.outputFile) {
        await this.writeSecurityReport(this.options.outputFile, this.allVulnerabilities, scanResult, stats);
      }

      // Report scan results to Trae CN if enabled
      if (this.traeCNIntegration && this.options.traeCNRealtimePush) {
        try {
          const pushResult = await this.traeCNIntegration.reportScanResults(scanResult);
          if (pushResult.success) {
            console.log('Scan results pushed to Trae CN');
          } else {
            console.warn(`Failed to push scan results to Trae CN: ${pushResult.message}`);
          }
        } catch (error) {
          console.warn(`Trae CN push error: ${error.message}`);
        }
      }

      // Release resources
      try {
        // Shutdown parallel rule engine if it exists
        const parallelRuleEngine = require('vue-security-scanner/src/rules/parallel-rule-engine');
        if (parallelRuleEngine && parallelRuleEngine.shutdown) {
          parallelRuleEngine.shutdown();
          console.log('Parallel rule engine shutdown completed');
        }
      } catch (error) {
        // Ignore shutdown errors
      }
      
      callback();
    });
  }

  shouldScanFile(filePath) {
    // Skip excluded files
    if (this.options.exclude.some(pattern => filePath.includes(pattern))) {
      return false;
    }

    // Check if file should be scanned
    if (this.ignoreManager && this.ignoreManager.shouldIgnoreFile(filePath)) {
      return false;
    }

    // Only scan Vue, JS, TS, JSX, TSX files
    const supportedExtensions = ['.vue', '.js', '.ts', '.jsx', '.tsx'];
    return supportedExtensions.some(ext => filePath.endsWith(ext));
  }

  async performSecurityScan(filePath, content, compiler) {
    try {
      const result = await this.scanner.scanFile(filePath, content);
      const vulnerabilities = result.vulnerabilities || [];

      // Collect vulnerabilities for final report
      this.allVulnerabilities.push(...vulnerabilities);

      if (vulnerabilities.length > 0) {
        vulnerabilities.forEach(vuln => {
          let message = `[VUE-SECURITY] ${vuln.type} - ${vuln.severity} SEVERITY\n`;
          message += `File: ${vuln.file}\n`;
          if (vuln.line !== 'N/A') {
            message += `Line: ${vuln.line}\n`;
          }
          message += `Description: ${vuln.description}\n`;
          message += `Recommendation: ${vuln.recommendation}\n`;
          if (vuln.ruleId) {
            message += `Rule: ${vuln.ruleId}\n`;
          }
          if (vuln.confidence) {
            message += `Confidence: ${vuln.confidence}\n`;
          }

          // Log based on report level
          if (this.options.reportLevel === 'error' || 
              (this.options.reportLevel === 'warning' && vuln.severity !== 'Low')) {
            compiler.getInfrastructureLogger('VueSecurityWebpackPlugin').error(message);
          } else {
            compiler.getInfrastructureLogger('VueSecurityWebpackPlugin').warn(message);
          }

          // Report to Trae CN if enabled
          if (this.traeCNIntegration && this.options.traeCNAutoReport) {
            this.traeCNIntegration.reportVulnerability(vuln)
              .then(result => {
                if (result.success) {
                  console.log(`Vulnerability reported to Trae CN: ${vuln.type}`);
                } else {
                  console.warn(`Failed to report vulnerability to Trae CN: ${result.message}`);
                }
              })
              .catch(error => {
                console.warn(`Trae CN reporting error: ${error.message}`);
              });
          }
        });

        // Fail build if configured to do so
        if (this.options.failOnError) {
          const highSeverityVulns = vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical');
          if (highSeverityVulns.length > 0) {
            throw new Error(`Build failed due to ${highSeverityVulns.length} high severity security vulnerabilities.`);
          }
        }
      }
    } catch (error) {
      console.warn(`Security scan error for ${filePath}:`, error.message);
    }
  }

  async writeSecurityReport(outputFile, vulnerabilities, scanResult, stats) {
    // Generate security report
    const report = {
      timestamp: new Date().toISOString(),
      totalVulnerabilities: vulnerabilities.length,
      summary: scanResult.summary,
      webpackStats: {
        startTime: stats.startTime,
        endTime: stats.endTime,
        hash: stats.hash,
        assets: stats.compilation ? Object.keys(stats.compilation.assets).length : 0,
        chunks: stats.chunks ? stats.chunks.length : 0
      },
      vulnerabilities: vulnerabilities.map(v => ({
        type: v.type,
        severity: v.severity,
        file: v.file,
        line: v.line,
        description: v.description,
        recommendation: v.recommendation,
        ruleId: v.ruleId,
        confidence: v.confidence
      }))
    };

    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`Webpack security report written to ${outputFile}`);
  }

  async writeAdvancedReport(outputFile, advancedReport, format = 'json') {
    try {
      const dir = path.dirname(outputFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (format === 'html') {
        const htmlReport = this.generateHTMLReport(advancedReport);
        await fs.promises.writeFile(outputFile, htmlReport);
        console.log(`Advanced HTML report written to ${outputFile}`);
      } else {
        await fs.promises.writeFile(outputFile, JSON.stringify(advancedReport, null, 2));
        console.log(`Advanced JSON report written to ${outputFile}`);
      }
    } catch (error) {
      console.error('Error writing advanced report:', error.message);
    }
  }

  generateHTMLReport(report) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Security Scanner Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { padding: 15px; border-radius: 5px; color: white; }
        .critical { background: #d32f2f; }
        .high { background: #f57c00; }
        .medium { background: #fbc02d; }
        .low { background: #388e3c; }
        .vulnerability { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .vulnerability.critical { border-left: 5px solid #d32f2f; }
        .vulnerability.high { border-left: 5px solid #f57c00; }
        .vulnerability.medium { border-left: 5px solid #fbc02d; }
        .vulnerability.low { border-left: 5px solid #388e3c; }
        .compliance { margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Vue Security Scanner Report</h1>
        <p><strong>Generated:</strong> ${report.metadata.generatedAt}</p>
        <p><strong>Scanner Version:</strong> ${report.metadata.scannerVersion}</p>
        
        <div class="summary">
            <div class="summary-card critical">
                <h3>Critical</h3>
                <p>${report.summary.critical || 0}</p>
            </div>
            <div class="summary-card high">
                <h3>High</h3>
                <p>${report.summary.high || 0}</p>
            </div>
            <div class="summary-card medium">
                <h3>Medium</h3>
                <p>${report.summary.medium || 0}</p>
            </div>
            <div class="summary-card low">
                <h3>Low</h3>
                <p>${report.summary.low || 0}</p>
            </div>
        </div>
        
        ${report.compliance ? `
        <div class="compliance">
            <h2>📋 Compliance Status</h2>
            ${Object.entries(report.compliance).map(([standard, status]) => `
                <p><strong>${standard}:</strong> ${status.status === 'compliant' ? '✅ Compliant' : '⚠️ Non-compliant'}</p>
            `).join('')}
        </div>
        ` : ''}
        
        <h2>Vulnerabilities (${report.vulnerabilities.length})</h2>
        ${report.vulnerabilities.map(vuln => `
            <div class="vulnerability ${vuln.severity.toLowerCase()}">
                <h3>${vuln.type} - ${vuln.severity}</h3>
                <p><strong>File:</strong> ${vuln.file}</p>
                <p><strong>Line:</strong> ${vuln.line}</p>
                <p><strong>Description:</strong> ${vuln.description}</p>
                <p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
                ${vuln.confidence ? `<p><strong>Confidence:</strong> ${vuln.confidence}</p>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
}

module.exports = VueSecurityWebpackPlugin;
