const fs = require('fs');
const path = require('path');

// Try to load from main project first, fallback to peer dependency
let SecurityScanner, IgnoreManager;

try {
  // Attempt to load from main project structure
  const scannerModule = require('../src/scanner');
  SecurityScanner = scannerModule.SecurityScanner || require('../src/scanner').default || require('../src/scanner');
  IgnoreManager = require('../src/utils/ignore-manager');
} catch (e) {
  // Fallback to attempting to load from vue-security-scanner package
  try {
    const scannerModule = require('vue-security-scanner/src/scanner');
    SecurityScanner = scannerModule.SecurityScanner || require('vue-security-scanner/src/scanner').default || require('vue-security-scanner/src/scanner');
    IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
  } catch (e2) {
    console.error('Warning: Could not load Vue Security Scanner core modules.');
    console.error('Please ensure vue-security-scanner is installed as a dependency or peer dependency.');
    throw e2;
  }
}

class VueSecurityWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      enabled: true,
      failOnError: false,
      reportLevel: 'warning', // 'error', 'warning', or 'info'
      outputFile: null,
      ...options
    };
    
    this.scanner = null;
    this.ignoreManager = null;
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
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
      }
    };

    this.scanner = new SecurityScanner(scannerConfig);
    this.ignoreManager = new IgnoreManager(process.cwd());

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
              return callback(null, data);
            }

            this.performSecurityScan(resource, content, compiler)
              .then(() => callback(null, data))
              .catch(error => {
                console.warn(`Security scan error for ${resource}:`, error.message);
                callback(null, data);
              });
          });
        } else {
          callback(null, data);
        }
      });
    });

    // Generate final report after compilation
    compiler.hooks.done.tapAsync('VueSecurityWebpackPlugin', async (stats, callback) => {
      if (this.options.outputFile) {
        await this.writeSecurityReport(this.options.outputFile, stats);
      }
      callback();
    });
  }

  shouldScanFile(filePath) {
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

          // Log based on report level
          if (this.options.reportLevel === 'error' || 
              (this.options.reportLevel === 'warning' && vuln.severity !== 'Low')) {
            compiler.getInfrastructureLogger('VueSecurityWebpackPlugin').error(message);
          } else {
            compiler.getInfrastructureLogger('VueSecurityWebpackPlugin').warn(message);
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

  async writeSecurityReport(outputFile, stats) {
    // Generate security report
    const report = {
      timestamp: new Date().toISOString(),
      webpackStats: {
        startTime: stats.startTime,
        endTime: stats.endTime,
        hash: stats.hash,
        assets: Object.keys(stats.compilation.assets).length,
        chunks: stats.chunks.length
      }
    };

    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`Webpack security report written to ${outputFile}`);
  }
}

module.exports = VueSecurityWebpackPlugin;
