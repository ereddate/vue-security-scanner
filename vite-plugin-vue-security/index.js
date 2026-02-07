const fs = require('fs');
const path = require('path');

// Import the security scanner with rule-based architecture from npm package
const { SecurityScanner } = require('vue-security-scanner');
const IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
const AdvancedReportGenerator = require('vue-security-scanner/src/reporting/advanced-report-generator');
const TraeCNIntegration = require('vue-security-scanner/src/integration/trae-cn-integration');

/**
 * Vite Plugin for Vue Security Scanning
 * Performs security scans on Vue.js projects during the build process
 * with advanced semantic analysis and enterprise-grade reporting
 */
function vueSecurityPlugin(options = {}) {
  const config = {
    // Default options
    enabled: true,
    failOnError: false, // Whether to fail the build on security issues
    reportLevel: 'warning', // 'error', 'warning', or 'info'
    outputFile: null, // Optional output file for security report
    exclude: [], // Patterns to exclude from scanning
    
    // NEW: Advanced features
    enableSemanticAnalysis: true, // Enable AST-based semantic analysis
    enableDependencyScanning: true, // Enable dependency vulnerability scanning
    enableAdvancedReport: false, // Enable advanced reporting with trends and compliance
    reportHistoryPath: '.vue-security-reports', // Path for report history
    complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law'], // Compliance standards to check
    
    // Performance Configuration
    performanceProfile: 'balanced', // 'fast', 'balanced', 'thorough'
    enableParallelScanning: true, // Enable parallel rule matching
    enableIncrementalScanning: true, // Enable incremental scanning
    memoryLimit: 512, // Memory usage limit in MB
    
    // Vue 3.6 Support
    enableVue36Features: true, // Enable Vue 3.6 specific feature detection
    enableVaporModeScanning: true, // Enable scanning for Vapor Mode specific issues
    
    // Vue 3.7+ Support
    enableVue37Features: true, // Enable Vue 3.7+ specific feature detection
    enableExperimentalFeaturesScanning: true, // Enable scanning for experimental features
    enableAdvancedCompositionAPIScanning: true, // Enable scanning for advanced Composition API
    enableReactiveOptimizationScanning: true, // Enable scanning for reactive optimization issues
    
    // GPU Acceleration
    enableGPUAcceleration: true, // Enable GPU-accelerated regex matching
    
    // Caching System
    enableCaching: true, // Enable caching system for improved performance
    
    // Cross-Framework Support
    supportedFrameworks: ['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram'], // Supported frameworks
    
    // Trae CN Integration
    enableTraeCN: false, // Enable Trae CN integration
    traeCNApiKey: null, // Trae CN API key
    traeCNProjectId: null, // Trae CN project ID
    traeCNAutoReport: true, // Auto-report vulnerabilities to Trae CN
    traeCNRealtimePush: false, // Push scan results in realtime
    
    ...options
  };

  let scanner;
  let ignoreManager;
  let advancedReportGenerator;
  let traeCNIntegration;
  let allVulnerabilities = []; // Collect all vulnerabilities for final report

  return {
    name: 'vue-security',
    enforce: 'pre', // Run before other transforms

    async buildStart() {
      // Initialize Trae CN integration if enabled
      if (config.enableTraeCN && config.traeCNApiKey) {
        try {
          traeCNIntegration = new TraeCNIntegration({
            apiKey: config.traeCNApiKey,
            projectId: config.traeCNProjectId,
            enableAutoReport: config.traeCNAutoReport,
            enableRealtimePush: config.traeCNRealtimePush
          });
          console.log('Trae CN integration enabled');
        } catch (error) {
          console.warn('Failed to initialize Trae CN integration:', error.message);
        }
      }

      // Initialize the security scanner with configuration
      const scannerConfig = {
        rules: config.rules || {},
        scan: {
          ignoreDirs: config.ignoreDirs || [],
          ignorePatterns: config.ignorePatterns || [],
          maxSize: config.maxSize || 10,
          maxDepth: config.maxDepth || 10
        },
        output: {
          showProgress: false, // Disable progress in build process
          format: 'json'
        },
        performance: {
          enableSemanticAnalysis: config.enableSemanticAnalysis,
          enableNpmAudit: config.enableDependencyScanning,
          enableVulnerabilityDB: config.enableDependencyScanning,
          enableParallelScanning: config.enableParallelScanning,
          enableIncrementalScanning: config.enableIncrementalScanning,
          performanceProfile: config.performanceProfile,
          memoryLimit: config.memoryLimit,
          enableGPUAcceleration: config.enableGPUAcceleration,
          enableCaching: config.enableCaching
        },
        compliance: {
          enabled: config.enableAdvancedReport,
          standards: config.complianceStandards
        },
        vue: {
          enableVue36Features: config.enableVue36Features,
          enableVaporModeScanning: config.enableVaporModeScanning,
          enableVue37Features: config.enableVue37Features,
          enableExperimentalFeaturesScanning: config.enableExperimentalFeaturesScanning,
          enableAdvancedCompositionAPIScanning: config.enableAdvancedCompositionAPIScanning,
          enableReactiveOptimizationScanning: config.enableReactiveOptimizationScanning
        },
        frameworks: {
          supportedFrameworks: config.supportedFrameworks
        }
      };

      // Initialize security scanner
      scanner = new SecurityScanner(scannerConfig);
      
      // Initialize ignore manager
      ignoreManager = new IgnoreManager(process.cwd());
      
      // Initialize advanced report generator if enabled
      if (config.enableAdvancedReport) {
        advancedReportGenerator = new AdvancedReportGenerator();
      }
      
      // Clear previous vulnerabilities
      allVulnerabilities = [];
    },

    async transform(code, id) {
      // Skip if disabled
      if (!config.enabled) {
        return null;
      }

      // Skip excluded files
      if (config.exclude.some(pattern => id.includes(pattern))) {
        return null;
      }

      // Skip virtual files (like vite/modulepreload-polyfill.js)
      if (id.includes('vite/') || id.includes('\x00')) {
        return null;
      }

      // Only scan Vue files and JS/TS files
      if (!id.endsWith('.vue') && !id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.jsx') && !id.endsWith('.tsx')) {
        return null;
      }

      // Check if file should be ignored
      if (ignoreManager && ignoreManager.shouldIgnoreFile(id)) {
        return null;
      }

      try {
        // Perform security scan using new scanner
        const result = await scanner.scanFile(id, code);
        const vulnerabilities = result.vulnerabilities || [];

        // Collect vulnerabilities for final report
        allVulnerabilities.push(...vulnerabilities);

        // Report vulnerabilities
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
            if (config.reportLevel === 'error' || 
                (config.reportLevel === 'warning' && vuln.severity !== 'Low')) {
              this.error(message);
            } else {
              this.warn(message);
            }

            // Report to Trae CN if enabled
            if (traeCNIntegration && config.traeCNAutoReport) {
              traeCNIntegration.reportVulnerability(vuln)
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
          if (config.failOnError) {
            const highSeverityVulns = vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical');
            if (highSeverityVulns.length > 0) {
              this.error(`Build failed due to ${highSeverityVulns.length} high severity security vulnerabilities.`);
            }
          }
        }
      } catch (error) {
        console.warn(`Security scan error for ${id}:`, error.message);
      }

      // Return of original code (we're only scanning, not modifying)
      return {
        code,
        map: null // No source map transformation
      };
    },

    // Hook to generate final report
    async buildEnd(errors) {
      if (errors && errors.length > 0) {
        console.log(`Build completed with ${errors.length} errors.`);
      }

      // Scan dependencies if enabled
      if (config.enableDependencyScanning) {
        try {
          console.log('Scanning dependencies for vulnerabilities...');
          const dependencyScanner = require('vue-security-scanner/src/analysis/dependency-scanner');
          const depScanner = new dependencyScanner({
            enableNpmAudit: true,
            enableVulnerabilityDB: true
          });
          
          const depVulns = await depScanner.scanDependencies(process.cwd());
          allVulnerabilities.push(...depVulns);
          
          console.log(`Found ${depVulns.length} dependency vulnerabilities.`);
        } catch (error) {
          console.warn('Dependency scanning failed:', error.message);
        }
      }

      // Generate report
      const scanResult = {
        summary: {
          totalVulnerabilities: allVulnerabilities.length,
          critical: allVulnerabilities.filter(v => v.severity === 'Critical').length,
          high: allVulnerabilities.filter(v => v.severity === 'High').length,
          medium: allVulnerabilities.filter(v => v.severity === 'Medium').length,
          low: allVulnerabilities.filter(v => v.severity === 'Low').length
        },
        vulnerabilities: allVulnerabilities,
        scanInfo: {
          scannerVersion: '1.7.2',
          scanDate: new Date().toISOString(),
          projectPath: process.cwd()
        }
      };

      // Generate advanced report if enabled
      if (config.enableAdvancedReport && advancedReportGenerator) {
        try {
          const advancedReport = advancedReportGenerator.generateAdvancedReport(scanResult, {
            includeTrends: true,
            includeCompliance: true,
            historyPath: config.reportHistoryPath
          });
          
          if (config.outputFile) {
            const reportPath = config.outputFile.endsWith('.html') 
              ? config.outputFile 
              : config.outputFile.replace('.json', '.html');
            
            await writeAdvancedReport(reportPath, advancedReport, 'html');
          }
        } catch (error) {
          console.warn('Advanced report generation failed:', error.message);
        }
      }

      // Write basic report
      if (config.outputFile) {
        await writeSecurityReport(config.outputFile, allVulnerabilities, scanResult);
      }

      // Report scan results to Trae CN if enabled
      if (traeCNIntegration && config.traeCNRealtimePush) {
        try {
          const pushResult = await traeCNIntegration.reportScanResults(scanResult);
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
    }
  };
}

/**
 * Write security report to file
 */
async function writeSecurityReport(outputFile, vulnerabilities, scanResult) {
  try {
    const report = {
      timestamp: new Date().toISOString(),
      totalVulnerabilities: vulnerabilities.length,
      summary: scanResult.summary,
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
    console.log(`Security report written to ${outputFile}`);
  } catch (error) {
    console.error('Error writing security report:', error.message);
  }
}

/**
 * Write advanced report to file (HTML or JSON)
 */
async function writeAdvancedReport(outputFile, advancedReport, format = 'json') {
  try {
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (format === 'html') {
      const htmlReport = generateHTMLReport(advancedReport);
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

/**
 * Generate HTML report from advanced report data
 */
function generateHTMLReport(report) {
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

module.exports = vueSecurityPlugin;
