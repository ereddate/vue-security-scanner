const fs = require('fs');
const path = require('path');

// Import the security scanner from npm package
const { SecurityScanner } = require('vue-security-scanner');
const IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
const AdvancedReportGenerator = require('vue-security-scanner/src/reporting/advanced-report-generator');

/**
 * uni-app Plugin for Vue Security Scanning
 * Performs security scans on uni-app projects during the build process
 * with advanced semantic analysis and enterprise-grade reporting
 */
function uniSecurityPlugin(options = {}) {
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
    reportHistoryPath: '.uni-security-reports', // Path for report history
    complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law'], // Compliance standards to check
    
    // Performance options
    performanceProfile: 'balanced', // Performance profile ('fast', 'balanced', 'thorough')
    enableParallelScanning: true, // Enable parallel scanning
    enableIncrementalScanning: true, // Enable incremental scanning
    memoryLimit: 2048, // Memory limit in MB
    enableGPUAcceleration: true, // Enable GPU-accelerated regex matching
    enableCaching: true, // Enable caching system
    
    // Vue 3.6+ support
    enableVue36Features: true, // Enable Vue 3.6 features
    enableVaporModeScanning: true, // Enable Vapor mode scanning
    
    // Vue 3.7+ support
    enableVue37Features: true, // Enable Vue 3.7+ specific feature detection
    enableExperimentalFeaturesScanning: true, // Enable scanning for experimental features
    enableAdvancedCompositionAPIScanning: true, // Enable scanning for advanced Composition API
    enableReactiveOptimizationScanning: true, // Enable scanning for reactive optimization issues
    
    // Cross-framework support
    supportedFrameworks: ['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram'], // Supported frameworks
    
    // uni-app-specific options
    enableUniAppSpecificRules: true, // Enable uni-app-specific security rules
    uniApiSecurity: true, // Enable uni-app API security checks
    uniNavigationSecurity: true, // Enable uni-app navigation security checks
    uniStorageSecurity: true, // Enable uni-app storage security checks
    uniConfigSecurity: true, // Enable uni-app config security checks
    
    ...options
  };

  let scanner;
  let ignoreManager;
  let advancedReportGenerator;
  let allVulnerabilities = []; // Collect all vulnerabilities for final report

  return {
    name: 'uni-plugin-vue-security',
    
    // Apply the plugin
    apply(compiler) {
      if (!config.enabled) {
        console.log('uni-app Security Plugin: Disabled');
        return;
      }

      console.log('uni-app Security Plugin: Initializing...');

      // Create report history directory if needed
      if (config.enableAdvancedReport && !fs.existsSync(config.reportHistoryPath)) {
        fs.mkdirSync(config.reportHistoryPath, { recursive: true });
      }

      // Run before compilation
      compiler.hooks.beforeCompile.tapAsync('UniSecurityPlugin', async (params, callback) => {
        console.log('uni-app Security Plugin: Running security scan before compilation...');
        
        try {
          await runSecurityScan();
          callback();
        } catch (error) {
          console.error('uni-app Security Plugin Error:', error.message);
          if (config.failOnError) {
            callback(error);
          } else {
            callback();
          }
        }
      });

      // Run after compilation
      compiler.hooks.afterEmit.tapAsync('UniSecurityPlugin', async (compilation, callback) => {
        console.log('uni-app Security Plugin: Running security scan after compilation...');
        
        try {
          // Run scan again if needed (e.g., to check built files)
          if (config.scanAfterBuild) {
            await runSecurityScan();
          }
          callback();
        } catch (error) {
          console.error('uni-app Security Plugin Error:', error.message);
          if (config.failOnError) {
            callback(error);
          } else {
            callback();
          }
        }
      });
    }
  };

  async function runSecurityScan() {
    try {
      // Initialize scanner if not already initialized
      if (!scanner) {
        const scannerConfig = {
          rules: {
            // Enable/disable uni-app-specific rules
            'uni-app-api': config.uniApiSecurity,
            'uni-app-navigation': config.uniNavigationSecurity
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
            enableVulnerabilityDB: config.enableDependencyScanning,
            performanceProfile: config.performanceProfile,
            enableParallelScanning: config.enableParallelScanning,
            enableIncrementalScanning: config.enableIncrementalScanning,
            memoryLimit: config.memoryLimit,
            enableGPUAcceleration: config.enableGPUAcceleration,
            enableCaching: config.enableCaching
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
      console.log('uni-app Security Plugin: Scanning project for security vulnerabilities...');
      
      const scanResults = await scanner.scanVueProject(process.cwd());
      allVulnerabilities.push(...scanResults.vulnerabilities);

      // Filter vulnerabilities by report level
      const filteredVulnerabilities = filterVulnerabilitiesByLevel(allVulnerabilities, config.reportLevel);

      // Generate report
      if (filteredVulnerabilities.length > 0) {
        console.log(`\nuni-app Security Plugin: Found ${filteredVulnerabilities.length} security issues\n`);
        
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
          throw new Error('uni-app Security Plugin: Build failed due to security issues');
        }
      } else {
        console.log('uni-app Security Plugin: No security issues found\n');
      }

    } catch (error) {
      console.error('uni-app Security Plugin Error:', error.message);
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
      console.log(`uni-app Security Plugin: Report written to ${outputFile}`);
    } catch (error) {
      console.error('uni-app Security Plugin: Failed to write report:', error.message);
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
        console.log(`uni-app Security Plugin: Advanced report written to ${reportFile}`);
      }
    } catch (error) {
      console.error('uni-app Security Plugin: Failed to generate advanced report:', error.message);
    }
  }
}

module.exports = uniSecurityPlugin;