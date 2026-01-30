const fs = require('fs');
const path = require('path');
const commander = require('commander');

// Import the security scanner from npm package
const { SecurityScanner } = require('vue-security-scanner');
const IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
const AdvancedReportGenerator = require('vue-security-scanner/src/reporting/advanced-report-generator');

/**
 * WeChat Mini Program Plugin for Vue Security Scanning
 * Performs security scans on WeChat Mini Program projects during the development and build process
 * with advanced semantic analysis and enterprise-grade reporting
 */
function wechatMiniProgramSecurityPlugin(options = {}) {
  const config = {
    // Default options
    enabled: true,
    failOnError: false, // Whether to fail the build on security issues
    reportLevel: 'warning', // 'error', 'warning', or 'info'
    outputFile: null, // Optional output file for security report
    exclude: [], // Patterns to exclude from scanning
    
    // Advanced features
    enableSemanticAnalysis: true, // Enable AST-based semantic analysis
    enableDependencyScanning: true, // Enable dependency vulnerability scanning
    enableAdvancedReport: false, // Enable advanced reporting with trends and compliance
    reportHistoryPath: '.wechat-security-reports', // Path for report history
    complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'], // Compliance standards to check
    
    // WeChat Mini Program-specific options
    enableWeChatSpecificRules: true, // Enable WeChat-specific security rules
    wechatApiSecurity: true, // Enable WeChat API security checks
    wechatNavigationSecurity: true, // Enable WeChat navigation security checks
    wechatStorageSecurity: true, // Enable WeChat storage security checks
    wechatTemplateSecurity: true, // Enable WeChat template security checks
    wechatConfigSecurity: true, // Enable WeChat config security checks
    
    ...options
  };

  let scanner;
  let ignoreManager;
  let advancedReportGenerator;
  let allVulnerabilities = []; // Collect all vulnerabilities for final report

  return {
    name: 'wechat-miniprogram-plugin-vue-security',
    
    // Run security scan
    async runScan() {
      if (!config.enabled) {
        console.log('WeChat Mini Program Security Plugin: Disabled');
        return;
      }

      console.log('WeChat Mini Program Security Plugin: Initializing...');

      // Create report history directory if needed
      if (config.enableAdvancedReport && !fs.existsSync(config.reportHistoryPath)) {
        fs.mkdirSync(config.reportHistoryPath, { recursive: true });
      }

      await runSecurityScan();
    }
  };

  async function runSecurityScan() {
    try {
      // Initialize scanner if not already initialized
      if (!scanner) {
        const scannerConfig = {
          rules: {
            // Enable/disable WeChat-specific rules
            'wechat-mini-program-api': config.wechatApiSecurity,
            'wechat-mini-program-navigation': config.wechatNavigationSecurity,
            'wechat-mini-program-template': config.wechatTemplateSecurity
          },
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
            enableVulnerabilityDB: config.enableDependencyScanning
          },
          compliance: {
            enabled: config.enableAdvancedReport,
            standards: config.complianceStandards
          }
        };

        scanner = new SecurityScanner(scannerConfig);
        ignoreManager = new IgnoreManager(process.cwd());
        
        if (config.enableAdvancedReport) {
          advancedReportGenerator = new AdvancedReportGenerator();
        }
      }

      // Run security scan
      console.log('WeChat Mini Program Security Plugin: Scanning project for security vulnerabilities...');
      
      const scanResults = await scanner.scanVueProject(process.cwd());
      allVulnerabilities.push(...scanResults.vulnerabilities);

      // Filter vulnerabilities by report level
      const filteredVulnerabilities = filterVulnerabilitiesByLevel(allVulnerabilities, config.reportLevel);

      // Generate report
      if (filteredVulnerabilities.length > 0) {
        console.log(`\nWeChat Mini Program Security Plugin: Found ${filteredVulnerabilities.length} security issues\n`);
        
        // Print vulnerabilities
        printVulnerabilities(filteredVulnerabilities);

        // Write report to file if specified
        if (config.outputFile) {
          writeReportToFile(filteredVulnerabilities, config.outputFile);
        }

        // Generate advanced report if enabled
        if (config.enableAdvancedReport) {
          generateAdvancedReport(filteredVulnerabilities);
        }

        // Fail build if needed
        if (config.failOnError && hasErrors(filteredVulnerabilities)) {
          throw new Error('WeChat Mini Program Security Plugin: Build failed due to security issues');
        }
      } else {
        console.log('WeChat Mini Program Security Plugin: No security issues found\n');
      }

    } catch (error) {
      console.error('WeChat Mini Program Security Plugin Error:', error.message);
      if (config.failOnError) {
        throw error;
      }
    }
  }

  function filterVulnerabilitiesByLevel(vulnerabilities, level) {
    const levelPriority = {
      error: 3,
      warning: 2,
      info: 1
    };
    
    const minPriority = levelPriority[level] || levelPriority.warning;
    
    return vulnerabilities.filter(vuln => {
      const vulnPriority = levelPriority[vuln.severity.toLowerCase()] || 0;
      return vulnPriority >= minPriority;
    });
  }

  function hasErrors(vulnerabilities) {
    return vulnerabilities.some(vuln => vuln.severity.toLowerCase() === 'error');
  }

  function printVulnerabilities(vulnerabilities) {
    vulnerabilities.forEach((vuln, index) => {
      console.log(`${index + 1}. [${vuln.severity}] ${vuln.title}`);
      console.log(`   File: ${vuln.file}`);
      if (vuln.line) {
        console.log(`   Line: ${vuln.line}`);
      }
      console.log(`   Description: ${vuln.description}`);
      console.log(`   Recommendation: ${vuln.recommendation}`);
      console.log('');
    });
  }

  function writeReportToFile(vulnerabilities, outputFile) {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        vulnerabilities: vulnerabilities,
        summary: {
          total: vulnerabilities.length,
          errors: vulnerabilities.filter(v => v.severity.toLowerCase() === 'error').length,
          warnings: vulnerabilities.filter(v => v.severity.toLowerCase() === 'warning').length,
          info: vulnerabilities.filter(v => v.severity.toLowerCase() === 'info').length
        }
      };

      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
      console.log(`WeChat Mini Program Security Plugin: Report written to ${outputFile}`);
    } catch (error) {
      console.error('WeChat Mini Program Security Plugin: Failed to write report:', error.message);
    }
  }

  function generateAdvancedReport(vulnerabilities) {
    try {
      if (advancedReportGenerator) {
        const report = advancedReportGenerator.generate({
          vulnerabilities: vulnerabilities,
          projectPath: process.cwd(),
          standards: config.complianceStandards
        });

        const reportFile = path.join(config.reportHistoryPath, `report-${Date.now()}.json`);
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        console.log(`WeChat Mini Program Security Plugin: Advanced report written to ${reportFile}`);
      }
    } catch (error) {
      console.error('WeChat Mini Program Security Plugin: Failed to generate advanced report:', error.message);
    }
  }
}

// CLI entry point
if (require.main === module) {
  const program = commander
    .version('1.0.0')
    .option('-c, --config <path>', 'Path to config file')
    .option('-o, --output-file <path>', 'Output file for security report')
    .option('--fail-on-error', 'Fail on security errors')
    .option('--report-level <level>', 'Minimum report level (error, warning, info)')
    .parse(process.argv);

  // Load config
  let config = {};
  if (program.config && fs.existsSync(program.config)) {
    config = require(path.resolve(program.config));
  }

  // Override with CLI options
  if (program.outputFile) {
    config.outputFile = program.outputFile;
  }
  if (program.failOnError) {
    config.failOnError = true;
  }
  if (program.reportLevel) {
    config.reportLevel = program.reportLevel;
  }

  // Run scan
  const plugin = wechatMiniProgramSecurityPlugin(config);
  plugin.runScan().catch(console.error);
}

module.exports = wechatMiniProgramSecurityPlugin;