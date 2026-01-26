const fs = require('fs');
const path = require('path');

// Load from npm package
const { SecurityScanner } = require('vue-security-scanner');
const IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
const AdvancedReportGenerator = require('vue-security-scanner/src/reporting/advanced-report-generator');

// Nuxt.js module definition
module.exports = function VueSecurityNuxtModule(moduleOptions) {
  const options = {
    enabled: true,
    failOnError: false,
    reportLevel: 'warning',
    outputFile: null,
    ...this.options.vueSecurity,
    ...moduleOptions
  };

  if (!options.enabled) {
    return;
  }

  // Initialize scanner
  const scannerConfig = {
    rules: options.rules || {},
    scan: {
      ignoreDirs: options.ignoreDirs || [],
      ignorePatterns: options.ignorePatterns || [],
      maxSize: options.maxSize || 10,
      maxDepth: options.maxDepth || 10
    },
    output: {
      showProgress: false, // Disable progress in build process
      format: 'json'
    }
  };

  const scanner = new SecurityScanner(scannerConfig);
  const ignoreManager = new IgnoreManager(this.options.srcDir || process.cwd());

  // Register hooks during Nuxt build process
  this.nuxt.hook('build:before', async (builder) => {
    console.log('Vue Security Nuxt Module: Starting security scan...');
  });

  // Scan page files
  this.nuxt.hook('builder:extendRoutes', (routes) => {
    // Scan routes for security issues
    routes.forEach(route => {
      if (route.component) {
        const componentPath = route.component;
        if (shouldScanFile(componentPath, ignoreManager)) {
          scanFile(componentPath, scanner, options);
        }
      }
    });
  });

  // Scan components
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.forEach(dir => {
      scanDirectory(dir.path, scanner, options, ignoreManager);
    });
  });

  // Scan layout files
  this.nuxt.hook('generate:page', async (page) => {
    if (shouldScanFile(page.route, ignoreManager)) {
      // Scan generated pages
      try {
        const content = await fs.promises.readFile(page.dst, 'utf-8');
        await performSecurityScan(page.dst, content, scanner, options, this.nuxt);
      } catch (error) {
        console.warn(`Could not scan generated page: ${page.dst}`, error.message);
      }
    }
  });

  // Scan middleware
  this.nuxt.hook('modules:before', async (moduleContainer) => {
    const middlewareDir = path.join(this.options.srcDir, 'middleware');
    if (fs.existsSync(middlewareDir)) {
      await scanDirectory(middlewareDir, scanner, options, ignoreManager);
    }
  });

  // Scan plugins
  this.nuxt.hook('build:compile', async ({ name, compilers }) => {
    if (name === 'client' || name === 'server') {
      // Scan files during compilation
      const pluginsDir = path.join(this.options.srcDir, 'plugins');
      if (fs.existsSync(pluginsDir)) {
        await scanDirectory(pluginsDir, scanner, options, ignoreManager);
      }
    }
  });
};

// Helper function: Check if file should be scanned
function shouldScanFile(filePath, ignoreManager) {
  if (ignoreManager && ignoreManager.shouldIgnoreFile(filePath)) {
    return false;
  }

  // Only scan Vue, JS, TS files
  const supportedExtensions = ['.vue', '.js', '.ts'];
  return supportedExtensions.some(ext => filePath.endsWith(ext));
}

// Helper function: Scan single file
async function scanFile(filePath, scanner, options) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    await performSecurityScan(filePath, content, scanner, options);
  } catch (error) {
    console.warn(`Could not scan file: ${filePath}`, error.message);
  }
}

// Helper function: Scan directory
async function scanDirectory(dirPath, scanner, options, ignoreManager) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = await fs.promises.readdir(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      await scanDirectory(fullPath, scanner, options, ignoreManager); // Recursive scan
    } else if (shouldScanFile(fullPath, ignoreManager)) {
      await scanFile(fullPath, scanner, options);
    }
  }
}

// Helper function: Perform security scan
async function performSecurityScan(filePath, content, scanner, options, nuxtInstance = null) {
  try {
    const result = await scanner.scanFile(filePath, content);
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
        if (options.reportLevel === 'error' || 
            (options.reportLevel === 'warning' && vuln.severity !== 'Low')) {
          if (nuxtInstance) {
            nuxtInstance.callHook('vue-security:error', message);
          }
          console.error(message);
        } else {
          if (nuxtInstance) {
            nuxtInstance.callHook('vue-security:warning', message);
          }
          console.warn(message);
        }
      });

      // Fail build if configured to do so
      if (options.failOnError) {
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

// Module metadata
module.exports.meta = require('./package.json');
