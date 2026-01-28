import { defineNuxtModule } from '@nuxt/kit';
import fs from 'fs';
import path from 'path';

// Nuxt 3 module definition
export default defineNuxtModule({
  meta: {
    name: 'vue-security-nuxt-module',
    configKey: 'vueSecurity',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  
  defaults: {
    enabled: true,
    failOnError: false,
    reportLevel: 'warning',
    outputFile: null,
    enableSemanticAnalysis: true,
    enableDependencyScanning: true,
    enableAdvancedReport: false,
    reportHistoryPath: '.vue-security-reports',
    complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'],
    ignoreDirs: [],
    ignorePatterns: [],
    maxSize: 10,
    maxDepth: 10
  },
  
  async setup(options, nuxt) {
    if (!options.enabled) {
      return;
    }

    // Load dependencies dynamically
    const { SecurityScanner } = await import('vue-security-scanner');
    const IgnoreManager = (await import('vue-security-scanner/src/utils/ignore-manager.js')).default;
    const AdvancedReportGenerator = (await import('vue-security-scanner/src/reporting/advanced-report-generator.js')).default;

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
        showProgress: false,
        format: 'json'
      },
      performance: {
        enableSemanticAnalysis: options.enableSemanticAnalysis,
        enableNpmAudit: options.enableDependencyScanning,
        enableVulnerabilityDB: options.enableDependencyScanning
      },
      compliance: {
        enabled: options.enableAdvancedReport,
        standards: options.complianceStandards
      }
    };

    const scanner = new SecurityScanner(scannerConfig);
    const srcDir = nuxt.options.srcDir || process.cwd();
    const ignoreManager = new IgnoreManager(srcDir);
    let advancedReportGenerator = null;
    
    if (options.enableAdvancedReport) {
      advancedReportGenerator = new AdvancedReportGenerator();
    }
    
    const allVulnerabilities = [];

    // Register hooks during Nuxt build process
    nuxt.hook('build:before', async () => {
      console.log('Vue Security Nuxt Module: Starting security scan...');
      allVulnerabilities.length = 0;
    });

    // Scan page files
    nuxt.hook('builder:extendRoutes', (routes) => {
      routes.forEach(route => {
        if (route.component) {
          const componentPath = route.component;
          if (shouldScanFile(componentPath, ignoreManager)) {
            scanFile(componentPath, scanner, options, allVulnerabilities);
          }
        }
      });
    });

    // Scan components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.forEach(dir => {
        scanDirectory(dir.path, scanner, options, ignoreManager, allVulnerabilities);
      });
    });

    // Scan layout files
    nuxt.hook('generate:page', async (page) => {
      if (shouldScanFile(page.route, ignoreManager)) {
        try {
          const content = await fs.promises.readFile(page.dst, 'utf-8');
          await performSecurityScan(page.dst, content, scanner, options, nuxt, allVulnerabilities);
        } catch (error) {
          console.warn(`Could not scan generated page: ${page.dst}`, error.message);
        }
      }
    });

    // Scan middleware
    nuxt.hook('modules:before', async () => {
      const middlewareDir = path.join(srcDir, 'middleware');
      if (fs.existsSync(middlewareDir)) {
        await scanDirectory(middlewareDir, scanner, options, ignoreManager, allVulnerabilities);
      }
    });

    // Scan plugins
    nuxt.hook('build:compile', async ({ name, compilers }) => {
      if (name === 'client' || name === 'server') {
        const pluginsDir = path.join(srcDir, 'plugins');
        if (fs.existsSync(pluginsDir)) {
          await scanDirectory(pluginsDir, scanner, options, ignoreManager, allVulnerabilities);
        }
      }
    });

    // Generate final report after compilation
    nuxt.hook('build:done', async () => {
      // Scan dependencies if enabled
      if (options.enableDependencyScanning) {
        try {
          console.log('Scanning dependencies for vulnerabilities...');
          const dependencyScanner = (await import('vue-security-scanner/src/analysis/dependency-scanner.js')).default;
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
      if (allVulnerabilities.length > 0) {
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
            scannerVersion: '1.4.0',
            scanDate: new Date().toISOString(),
            projectPath: process.cwd()
          }
        };

        // Generate advanced report if enabled
        if (options.enableAdvancedReport && advancedReportGenerator) {
          try {
            const advancedReport = advancedReportGenerator.generateAdvancedReport(scanResult, {
              includeTrends: true,
              includeCompliance: true,
              historyPath: options.reportHistoryPath
            });
            
            if (options.outputFile) {
              const reportPath = options.outputFile.endsWith('.html') 
                ? options.outputFile 
                : options.outputFile.replace('.json', '.html');
              
              await writeAdvancedReport(reportPath, advancedReport, 'html');
            }
          } catch (error) {
            console.warn('Advanced report generation failed:', error.message);
          }
        }

        // Write basic report
        if (options.outputFile) {
          await writeSecurityReport(options.outputFile, allVulnerabilities, scanResult);
        }
      }
      
      // Fail build if configured to do so
      if (options.failOnError) {
        const highSeverityVulns = allVulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical');
        if (highSeverityVulns.length > 0) {
          throw new Error(`Build failed due to ${highSeverityVulns.length} high severity security vulnerabilities.`);
        }
      }
    });
  }
});

async function writeSecurityReport(outputFile, vulnerabilities, scanResult) {
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
  console.log(`Nuxt security report written to ${outputFile}`);
}

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

function shouldScanFile(filePath, ignoreManager) {
  if (ignoreManager && ignoreManager.shouldIgnoreFile(filePath)) {
    return false;
  }

  const supportedExtensions = ['.vue', '.js', '.ts'];
  return supportedExtensions.some(ext => filePath.endsWith(ext));
}

async function scanFile(filePath, scanner, options, allVulnerabilities) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    await performSecurityScan(filePath, content, scanner, options, null, allVulnerabilities);
  } catch (error) {
    console.warn(`Could not scan file: ${filePath}`, error.message);
  }
}

async function scanDirectory(dirPath, scanner, options, ignoreManager, allVulnerabilities) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = await fs.promises.readdir(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      await scanDirectory(fullPath, scanner, options, ignoreManager, allVulnerabilities);
    } else if (shouldScanFile(fullPath, ignoreManager)) {
      await scanFile(fullPath, scanner, options, allVulnerabilities);
    }
  }
}

async function performSecurityScan(filePath, content, scanner, options, nuxtInstance, allVulnerabilities) {
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
        if (vuln.confidence) {
          message += `Confidence: ${vuln.confidence}\n`;
        }

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

      allVulnerabilities.push(...vulnerabilities);
    }
  } catch (error) {
    console.warn(`Security scan error for ${filePath}:`, error.message);
  }
}
