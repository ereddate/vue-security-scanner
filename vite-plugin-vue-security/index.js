const fs = require('fs');
const path = require('path');

// Import the security checks from the main scanner
const { 
  checkForXSS, 
  checkForInsecureDependencies, 
  checkForMisconfigurations 
} = require('../src/checks/security-checks');
const VulnerabilityDetector = require('../src/core/vulnerability-detector');
const pluginManager = require('../src/plugin-system/plugin-manager');

/**
 * Vite Plugin for Vue Security Scanning
 * Performs security scans on Vue.js projects during the build process
 */
function vueSecurityPlugin(options = {}) {
  const config = {
    // Default options
    enabled: true,
    failOnError: false, // Whether to fail the build on security issues
    reportLevel: 'warning', // 'error', 'warning', or 'info'
    outputFile: null, // Optional output file for security report
    exclude: [], // Patterns to exclude from scanning
    ...options
  };

  let detector;

  return {
    name: 'vue-security',
    enforce: 'pre', // Run before other transforms

    async buildStart() {
      // Initialize the vulnerability detector
      detector = new VulnerabilityDetector(config);
      
      // Load plugins if available
      try {
        await pluginManager.loadPluginsFromDirectory(path.join(__dirname, '../plugins'));
      } catch (error) {
        console.warn('Could not load security plugins:', error.message);
      }
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

      // Only scan Vue files and JS/TS files
      if (!id.endsWith('.vue') && !id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.jsx') && !id.endsWith('.tsx')) {
        return null;
      }

      try {
        // Perform security scan
        const vulnerabilities = await detector.detectVulnerabilities(id, code);

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

            // Log based on report level
            if (config.reportLevel === 'error' || 
                (config.reportLevel === 'warning' && vuln.severity !== 'Low')) {
              this.error(message);
            } else {
              this.warn(message);
            }
          });

          // Optionally write to output file
          if (config.outputFile) {
            await writeSecurityReport(config.outputFile, vulnerabilities);
          }

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

      // Return the original code (we're only scanning, not modifying)
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
    }
  };
}

/**
 * Write security report to file
 */
async function writeSecurityReport(outputFile, vulnerabilities) {
  try {
    const report = {
      timestamp: new Date().toISOString(),
      totalVulnerabilities: vulnerabilities.length,
      vulnerabilities: vulnerabilities.map(v => ({
        type: v.type,
        severity: v.severity,
        file: v.file,
        line: v.line,
        description: v.description,
        recommendation: v.recommendation,
        plugin: v.plugin
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

module.exports = vueSecurityPlugin;