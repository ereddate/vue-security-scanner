# Vue Security Scanner API Reference

## 1. Core API

### 1.1 VueSecurityScanner Class

**Description**: The main class of Vue Security Scanner, providing complete security scanning functionality.

**Constructor**:

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

const scanner = new VueSecurityScanner(options);
```

**Parameters**:
- `options` (Object): Configuration options
  - `scanPath` (String): Scan path, default is `'.'`
  - `exclude` (Array): Exclude paths, default is `['node_modules', 'dist', 'build', '.git']`
  - `rules` (Object): Rules configuration
  - `performance` (Object): Performance configuration
  - `reporting` (Object): Reporting configuration

**Example**:

```javascript
const scanner = new VueSecurityScanner({
  scanPath: './src',
  exclude: ['node_modules', 'dist', '.git'],
  rules: {
    enabled: ['vue', 'javascript', 'china-security']
  },
  performance: {
    enableCache: true
  }
});
```

### 1.2 scan() Method

**Description**: Execute security scan.

**Signature**:

```javascript
async function scan() {}
```

**Return Value**:
- `Object`: Scan results
  - `vulnerabilities` (Array): Discovered vulnerabilities
  - `statistics` (Object): Scan statistics
  - `duration` (Number): Scan duration (milliseconds)
  - `timestamp` (String): Scan timestamp

**Example**:

```javascript
const results = await scanner.scan();
console.log('Number of vulnerabilities found:', results.vulnerabilities.length);
console.log('Scan time:', results.duration, 'ms');
```

### 1.3 generateReport() Method

**Description**: Generate security report.

**Signature**:

```javascript
async function generateReport(results, options) {}
```

**Parameters**:
- `results` (Object): Scan results
- `options` (Object): Report options
  - `format` (String): Output format (`'json'`, `'text'`, `'html'`)
  - `outputPath` (String): Output file path
  - `title` (String): Report title

**Return Value**:
- `Object`: Report generation result

**Example**:

```javascript
await scanner.generateReport(results, {
  format: 'html',
  outputPath: './security-report.html',
  title: 'Vue Application Security Report'
});
```

### 1.4 generateComplianceReport() Method

**Description**: Generate compliance report.

**Signature**:

```javascript
async function generateComplianceReport(results, options) {}
```

**Parameters**:
- `results` (Object): Scan results
- `options` (Object): Compliance report options
  - `type` (String): Report type (`'china'`, `'enhanced'`)
  - `format` (String): Output format
  - `outputPath` (String): Output file path
  - `application` (String): Application name
  - `environment` (String): Environment name

**Return Value**:
- `Object`: Report generation result

**Example**:

```javascript
await scanner.generateComplianceReport(results, {
  type: 'china',
  format: 'html',
  outputPath: './china-compliance-report.html',
  application: 'My Vue App',
  environment: 'Production'
});
```

## 2. Advanced API

### 2.1 EnhancedRuleEngine Class

**Description**: Enhanced rule engine providing advanced rule matching functionality.

**Constructor**:

```javascript
const { EnhancedRuleEngine } = require('vue-security-scanner/src/rules/enhanced-rule-engine');

const ruleEngine = new EnhancedRuleEngine(options);
```

**Parameters**:
- `options` (Object): Configuration options
  - `ruleCache` (Boolean): Enable rule caching
  - `contextCache` (Boolean): Enable context caching

**Methods**:

- `enhancedPatternMatch(content, pattern, filePath, lineNumber)`: Enhanced pattern matching
- `calculateConfidence(match, context, line, filePath)`: Calculate match confidence
- `getContext(lines, index, contextSize)`: Get code context

**Example**:

```javascript
const matches = ruleEngine.enhancedPatternMatch(
  codeContent,
  /eval\(/g,
  'file.js',
  10
);
```

### 2.2 PerformanceOptimizer Class

**Description**: Performance optimizer providing caching and incremental scanning functionality.

**Constructor**:

```javascript
const { PerformanceOptimizer } = require('vue-security-scanner/src/utils/performance-optimizer');

const optimizer = new PerformanceOptimizer(options);
```

**Parameters**:
- `options` (Object): Configuration options
  - `cacheDir` (String): Cache directory
  - `maxCacheSize` (Number): Maximum cache size (bytes)
  - `cacheTTL` (Number): Cache expiration time (milliseconds)
  - `enableCache` (Boolean): Enable caching
  - `enableIncremental` (Boolean): Enable incremental scanning

**Methods**:

- `getFilesToScan(allFiles, scanHistory)`: Get files to scan
- `isFileModified(filePath, lastHash)`: Check if file is modified
- `getCacheKey(filePath)`: Get cache key
- `getCachedResult(filePath)`: Get cached result
- `setCachedResult(filePath, result)`: Set cached result

**Example**:

```javascript
const filesToScan = optimizer.getFilesToScan(
  allProjectFiles,
  previousScanHistory
);
```

### 2.3 ThreatIntelligenceIntegration Class

**Description**: Threat intelligence integration providing threat data collection and analysis functionality.

**Constructor**:

```javascript
const { ThreatIntelligenceIntegration } = require('vue-security-scanner/src/threat-intelligence/threat-intelligence-integration');

const threatIntel = new ThreatIntelligenceIntegration(options);
```

**Parameters**:
- `options` (Object): Configuration options
  - `cacheDir` (String): Cache directory
  - `cacheTTL` (Number): Cache expiration time (milliseconds)
  - `enableCache` (Boolean): Enable caching
  - `threatSources` (Object): Threat intelligence sources configuration

**Methods**:

- `checkDependenciesAgainstThreats(dependencies)`: Check if dependencies are affected by threats
- `searchThreats(query)`: Search threat intelligence
- `getAllThreats()`: Get all threat intelligence
- `updateThreatDatabase()`: Update threat database
- `getThreatStatistics()`: Get threat statistics

**Example**:

```javascript
const affectedDependencies = await threatIntel.checkDependenciesAgainstThreats(
  projectDependencies
);
```

### 2.4 UserExperienceOptimizer Class

**Description**: User experience optimizer providing detailed error information and fix suggestions.

**Constructor**:

```javascript
const { UserExperienceOptimizer } = require('vue-security-scanner/src/utils/user-experience-optimizer');

const uxOptimizer = new UserExperienceOptimizer(options);
```

**Parameters**:
- `options` (Object): Configuration options

**Methods**:

- `generateUserFriendlyReport(vulnerabilities)`: Generate user-friendly report
- `getDetailedError(errorType)`: Get detailed error information
- `getFixSuggestions(errorType)`: Get fix suggestions
- `inferErrorType(vulnerability)`: Infer error type
- `generateRecommendations(vulnerabilities)`: Generate recommendations

**Example**:

```javascript
const userFriendlyReport = uxOptimizer.generateUserFriendlyReport(
  scanResults.vulnerabilities
);
```

### 2.5 EnhancedComplianceReportGenerator Class

**Description**: Enhanced compliance report generator providing visualization and multi-format export functionality.

**Constructor**:

```javascript
const { EnhancedComplianceReportGenerator } = require('vue-security-scanner/src/reporting/enhanced-compliance-report-generator');

const reportGenerator = new EnhancedComplianceReportGenerator();
```

**Methods**:

- `generateEnhancedReport(scanResults, options)`: Generate enhanced report
- `generateExecutiveSummary(scanResults)`: Generate executive summary
- `assessComplianceStandards(scanResults)`: Assess compliance standards
- `generateVisualizations(scanResults)`: Generate visualization data
- `saveReport(report, outputPath, format)`: Save report

**Example**:

```javascript
const enhancedReport = reportGenerator.generateEnhancedReport(
  scanResults, {
    application: 'My App',
    environment: 'Production'
  }
);
```

## 3. Utility API

### 3.1 File Utilities

**Description**: File operation related utility functions.

**Import**:

```javascript
const { fileUtils } = require('vue-security-scanner/src/utils/file-utils');
```

**Methods**:

- `getFilesToScan(basePath, exclude)`: Get files to scan
- `readFile(filePath)`: Read file content
- `writeFile(filePath, content)`: Write file content
- `getRelativePath(filePath, basePath)`: Get relative path
- `isIgnored(filePath, ignorePatterns)`: Check if file is ignored

**Example**:

```javascript
const files = fileUtils.getFilesToScan('./src', ['node_modules']);
```

### 3.2 Rule Utilities

**Description**: Rule related utility functions.

**Import**:

```javascript
const { ruleUtils } = require('vue-security-scanner/src/utils/rule-utils');
```

**Methods**:

- `loadRules(ruleModules)`: Load rule modules
- `validateRule(rule)`: Validate rule format
- `normalizeRuleSeverity(severity)`: Normalize rule severity
- `filterRulesBySeverity(rules, severity)`: Filter rules by severity

**Example**:

```javascript
const rules = ruleUtils.loadRules(['vue', 'javascript']);
```

### 3.3 Report Utilities

**Description**: Report related utility functions.

**Import**:

```javascript
const { reportUtils } = require('vue-security-scanner/src/utils/report-utils');
```

**Methods**:

- `formatVulnerability(vulnerability)`: Format vulnerability information
- `calculateSeverityScore(vulnerabilities)`: Calculate severity score
- `groupVulnerabilitiesByType(vulnerabilities)`: Group vulnerabilities by type
- `generateSummary(vulnerabilities)`: Generate summary

**Example**:

```javascript
const summary = reportUtils.generateSummary(vulnerabilities);
```

### 3.4 Security Utilities

**Description**: Security related utility functions.

**Import**:

```javascript
const { securityUtils } = require('vue-security-scanner/src/utils/security-utils');
```

**Methods**:

- `detectHardcodedSecrets(content)`: Detect hardcoded secrets
- `validatePasswordStrength(password)`: Validate password strength
- `sanitizeHtml(input)`: Sanitize HTML input
- `generateRandomToken(length)`: Generate random token

**Example**:

```javascript
const secrets = securityUtils.detectHardcodedSecrets(codeContent);
```

## 4. Configuration API

### 4.1 Configuration Loading

**Description**: Load and parse configuration files.

**Import**:

```javascript
const { loadConfig } = require('vue-security-scanner/src/config/config-loader');
```

**Usage**:

```javascript
const config = loadConfig(configPath);
```

**Parameters**:
- `configPath` (String): Configuration file path

**Return Value**:
- `Object`: Loaded configuration

### 4.2 Default Configuration

**Description**: Get default configuration.

**Import**:

```javascript
const { getDefaultConfig } = require('vue-security-scanner/src/config/default-config');
```

**Usage**:

```javascript
const defaultConfig = getDefaultConfig();
```

**Return Value**:
- `Object`: Default configuration

## 5. Error Handling API

### 5.1 Error Classes

**Description**: Custom error classes.

**Import**:

```javascript
const { 
  ScannerError, 
  ConfigError, 
  RuleError, 
  ReportError 
} = require('vue-security-scanner/src/errors');
```

**Usage**:

```javascript
try {
  // Scanning code
} catch (error) {
  if (error instanceof ScannerError) {
    console.error('Scanning error:', error.message);
  } else if (error instanceof ConfigError) {
    console.error('Configuration error:', error.message);
  }
}
```

### 5.2 Error Handling Utilities

**Description**: Error handling utility functions.

**Import**:

```javascript
const { errorUtils } = require('vue-security-scanner/src/utils/error-utils');
```

**Methods**:

- `handleError(error, options)`: Handle error
- `formatError(error)`: Format error information
- `logError(error)`: Log error
- `exitWithError(error, code)`: Exit with error

**Example**:

```javascript
try {
  // Operation
} catch (error) {
  errorUtils.handleError(error, {
    verbose: true
  });
}
```

## 6. Command Line API

### 6.1 CLI Parser

**Description**: Command line argument parser.

**Import**:

```javascript
const { parseCLIArgs } = require('vue-security-scanner/src/cli/cli-parser');
```

**Usage**:

```javascript
const args = parseCLIArgs(process.argv);
```

**Return Value**:
- `Object`: Parsed command line arguments

### 6.2 CLI Executor

**Description**: Command line command executor.

**Import**:

```javascript
const { executeCLI } = require('vue-security-scanner/src/cli/cli-executor');
```

**Usage**:

```javascript
executeCLI(args);
```

**Parameters**:
- `args` (Object): Command line arguments

## 7. Module API

### 7.1 Rule Modules

**Description**: Rule module loading and management.

**Import**:

```javascript
const { loadRuleModule } = require('vue-security-scanner/src/rules/rule-loader');
```

**Usage**:

```javascript
const ruleModule = loadRuleModule('vue');
```

**Parameters**:
- `moduleName` (String): Module name

**Return Value**:
- `Object`: Rule module

### 7.2 Report Modules

**Description**: Report module loading and management.

**Import**:

```javascript
const { loadReportModule } = require('vue-security-scanner/src/reporting/report-loader');
```

**Usage**:

```javascript
const reportModule = loadReportModule('china');
```

**Parameters**:
- `moduleName` (String): Module name

**Return Value**:
- `Object`: Report module

## 8. Programming Examples

### 8.1 Basic Scan

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function basicScan() {
  try {
    const scanner = new VueSecurityScanner({
      scanPath: './src',
      exclude: ['node_modules', 'dist']
    });
    
    console.log('Starting scan...');
    const results = await scanner.scan();
    console.log('Scan completed!');
    
    console.log('=== Scan Results ===');
    console.log(`Number of vulnerabilities: ${results.vulnerabilities.length}`);
    console.log(`Scan time: ${results.duration} ms`);
    console.log(`Critical vulnerabilities: ${results.vulnerabilities.filter(v => v.severity === 'Critical').length}`);
    console.log(`High vulnerabilities: ${results.vulnerabilities.filter(v => v.severity === 'High').length}`);
    console.log(`Medium vulnerabilities: ${results.vulnerabilities.filter(v => v.severity === 'Medium').length}`);
    console.log(`Low vulnerabilities: ${results.vulnerabilities.filter(v => v.severity === 'Low').length}`);
    
    // Generate report
    console.log('\nGenerating report...');
    await scanner.generateReport(results, {
      format: 'html',
      outputPath: './security-report.html',
      title: 'Vue Application Security Scan Report'
    });
    console.log('Report generated: ./security-report.html');
    
  } catch (error) {
    console.error('Scan failed:', error.message);
  }
}

basicScan();
```

### 8.2 Advanced Scan

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function advancedScan() {
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    exclude: ['node_modules', 'dist'],
    rules: {
      enabled: ['vue', 'javascript', 'china-security', 'china-api-security', 'dependency'],
      severity: {
        critical: true,
        high: true,
        medium: true,
        low: false
      }
    },
    performance: {
      enableCache: true,
      enableIncremental: true,
      maxCacheSize: 100 * 1024 * 1024 // 100MB
    }
  });
  
  // Execute scan
  const results = await scanner.scan();
  
  // Generate multiple reports
  await Promise.all([
    // Basic security report
    scanner.generateReport(results, {
      format: 'html',
      outputPath: './security-report.html'
    }),
    
    // China compliance report
    scanner.generateComplianceReport(results, {
      type: 'china',
      format: 'html',
      outputPath: './china-compliance-report.html'
    }),
    
    // Enhanced compliance report
    scanner.generateComplianceReport(results, {
      type: 'enhanced',
      format: 'html',
      outputPath: './enhanced-compliance-report.html'
    }),
    
    // JSON format report (for integration)
    scanner.generateReport(results, {
      format: 'json',
      outputPath: './security-report.json'
    })
  ]);
  
  console.log('All reports generated!');
}

advancedScan();
```

### 8.3 Custom Rule Scan

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function customRuleScan() {
  // Create custom rules
  const customRules = {
    rules: [
      {
        id: 'custom-no-console-log',
        name: 'Disallow console.log',
        description: 'Disallow console.log in production',
        severity: 'medium',
        pattern: /console\.log\(/g,
        fix: 'Use professional logging system',
        test: (content, filePath) => {
          return content.includes('console.log(');
        }
      },
      {
        id: 'custom-no-hardcoded-api-key',
        name: 'Disallow hardcoded API keys',
        description: 'Disallow hardcoded API keys in code',
        severity: 'high',
        pattern: /api[_-]?key|api[_-]?secret|access[_-]?token/gi,
        fix: 'Use environment variables or configuration files',
        test: (content, filePath) => {
          return /api[_-]?key|api[_-]?secret|access[_-]?token/gi.test(content);
        }
      }
    ]
  };
  
  // Create scanner
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    rules: {
      enabled: ['vue', 'javascript', customRules]
    }
  });
  
  // Execute scan
  const results = await scanner.scan();
  
  // Generate report
  await scanner.generateReport(results, {
    format: 'html',
    outputPath: './custom-rules-report.html',
    title: 'Custom Rules Scan Report'
  });
  
  console.log('Custom rule scan completed!');
}

customRuleScan();
```

### 8.4 Threat Intelligence Check

```javascript
const { ThreatIntelligenceIntegration } = require('vue-security-scanner/src/threat-intelligence/threat-intelligence-integration');

async function checkThreatIntelligence() {
  const threatIntel = new ThreatIntelligenceIntegration({
    enableCache: true,
    cacheTTL: 86400000 // 24 hours
  });
  
  // Update threat database
  console.log('Updating threat database...');
  await threatIntel.updateThreatDatabase();
  console.log('Threat database updated!');
  
  // Check dependencies
  const dependencies = {
    'vue': '3.2.0',
    'axios': '0.27.2',
    'lodash': '4.17.21'
  };
  
  console.log('Checking dependencies against threats...');
  const affectedDependencies = await threatIntel.checkDependenciesAgainstThreats(dependencies);
  
  console.log('Affected dependencies:');
  affectedDependencies.forEach(dep => {
    console.log(`- ${dep.dependency}@${dep.version}: ${dep.threat.title} (${dep.severity})`);
  });
  
  // Get threat statistics
  const stats = await threatIntel.getThreatStatistics();
  console.log('\nThreat statistics:');
  console.log(`Total threats: ${stats.total}`);
  console.log(`Critical threats: ${stats.severity.critical}`);
  console.log(`High threats: ${stats.severity.high}`);
  console.log(`Medium threats: ${stats.severity.medium}`);
  console.log(`Low threats: ${stats.severity.low}`);
}

checkThreatIntelligence();
```

## 9. Integration Examples

### 9.1 Integration with Express

```javascript
const express = require('express');
const { VueSecurityScanner } = require('vue-security-scanner');

const app = express();
const port = 3000;

app.use(express.json());

// Security scan API
app.post('/api/security-scan', async (req, res) => {
  try {
    const { scanPath, options } = req.body;
    
    const scanner = new VueSecurityScanner({
      scanPath: scanPath || './src',
      ...options
    });
    
    const results = await scanner.scan();
    
    res.json({
      success: true,
      results: {
        vulnerabilities: results.vulnerabilities,
        statistics: results.statistics,
        duration: results.duration
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Report generation API
app.post('/api/generate-report', async (req, res) => {
  try {
    const { results, reportOptions } = req.body;
    
    const scanner = new VueSecurityScanner();
    await scanner.generateReport(results, reportOptions);
    
    res.json({
      success: true,
      message: 'Report generated successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Security scan service running at http://localhost:${port}`);
});
```

### 9.2 Integration with Electron

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const { VueSecurityScanner } = require('vue-security-scanner');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Scan handler
ipcMain.handle('scan', async (event, options) => {
  const scanner = new VueSecurityScanner(options);
  return await scanner.scan();
});

// Report generation handler
ipcMain.handle('generate-report', async (event, { results, reportOptions }) => {
  const scanner = new VueSecurityScanner();
  return await scanner.generateReport(results, reportOptions);
});

// Compliance report generation handler
ipcMain.handle('generate-compliance-report', async (event, { results, reportOptions }) => {
  const scanner = new VueSecurityScanner();
  return await scanner.generateComplianceReport(results, reportOptions);
});
```

## 10. API Version Compatibility

### 10.1 Version Changes

| Version | Changes |
|---------|---------|
| 1.8.0 | Added enhanced rule engine, performance optimization, threat intelligence integration APIs |
| 1.7.0 | Added China compliance report API |
| 1.6.0 | Added batch scanning API |
| 1.5.0 | Added programmatic API |
| 1.0.0 | Initial version |

### 10.2 Backward Compatibility

Vue Security Scanner API maintains backward compatibility. New versions will:

- Preserve all existing APIs
- Add new functionality through new methods
- Mark deprecated APIs in documentation
- Make breaking changes only in major version upgrades

### 10.3 Error Handling Best Practices

```javascript
try {
  // API call
} catch (error) {
  // Distinguish error types
  if (error.code === 'E_CONFIG') {
    console.error('Configuration error:', error.message);
  } else if (error.code === 'E_SCAN') {
    console.error('Scan error:', error.message);
  } else if (error.code === 'E_REPORT') {
    console.error('Report error:', error.message);
  } else {
    console.error('Unknown error:', error.message);
  }
  
  // Log error details
  if (error.stack) {
    console.debug(error.stack);
  }
}
```

## 11. Performance Best Practices

### 11.1 Scan Performance Optimization

```javascript
// Optimized configuration
const scanner = new VueSecurityScanner({
  // Limit scan scope
  scanPath: './src',
  
  // Exclude unnecessary directories
  exclude: ['node_modules', 'dist', 'build', '.git', 'tests'],
  
  // Enable performance optimizations
  performance: {
    enableCache: true,
    enableIncremental: true,
    maxCacheSize: 200 * 1024 * 1024 // 200MB
  },
  
  // Only enable necessary rules
  rules: {
    enabled: ['vue', 'javascript'],
    severity: {
      critical: true,
      high: true,
      medium: false,
      low: false
    }
  }
});
```

### 11.2 Memory Usage Optimization

```javascript
// Batch process large projects
async function scanLargeProject() {
  const pathsToScan = [
    './src/components',
    './src/views',
    './src/utils',
    './src/api'
  ];
  
  const allResults = {
    vulnerabilities: [],
    statistics: {
      filesScanned: 0,
      linesScanned: 0
    }
  };
  
  for (const path of pathsToScan) {
    const scanner = new VueSecurityScanner({ scanPath: path });
    const results = await scanner.scan();
    
    // Merge results
    allResults.vulnerabilities.push(...results.vulnerabilities);
    allResults.statistics.filesScanned += results.statistics.filesScanned;
    allResults.statistics.linesScanned += results.statistics.linesScanned;
    
    // Clean up memory
    scanner.clearCache();
  }
  
  return allResults;
}
```

### 11.3 Concurrent Processing

```javascript
// Concurrent scanning of multiple projects
async function scanMultipleProjects() {
  const projects = [
    { name: 'project1', path: './project1/src' },
    { name: 'project2', path: './project2/src' },
    { name: 'project3', path: './project3/src' }
  ];
  
  const scanPromises = projects.map(project => {
    const scanner = new VueSecurityScanner({ scanPath: project.path });
    return scanner.scan().then(results => ({
      project: project.name,
      results
    }));
  });
  
  const results = await Promise.all(scanPromises);
  return results;
}
```

## 12. Troubleshooting

### 12.1 Common API Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `E_CONFIG` | Configuration error | Check configuration format and parameters |
| `E_SCAN` | Scan error | Check scan path and file permissions |
| `E_REPORT` | Report error | Check output path permissions and format |
| `E_RULE` | Rule error | Check rule configuration and format |
| `E_PERM` | Permission error | Ensure sufficient file system permissions |
| `E_MEMORY` | Insufficient memory | Reduce scan scope or increase memory |

### 12.2 Debugging Tips

```javascript
// Enable debug mode
const scanner = new VueSecurityScanner({
  debug: true
});

// Detailed logging
console.log('Starting scan:', new Date().toISOString());
try {
  const results = await scanner.scan();
  console.log('Scan completed:', {
    vulnerabilities: results.vulnerabilities.length,
    duration: results.duration
  });
} catch (error) {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    code: error.code
  });
}
```

### 12.3 Performance Issue Troubleshooting

```javascript
// Performance monitoring
const startTime = Date.now();
const scanner = new VueSecurityScanner({
  performance: {
    enableCache: true,
    enableIncremental: true
  }
});

const results = await scanner.scan();
const endTime = Date.now();

console.log('Performance analysis:');
console.log(`Total time: ${endTime - startTime} ms`);
console.log(`Scan time: ${results.duration} ms`);
console.log(`Files scanned: ${results.statistics.filesScanned}`);
console.log(`Lines scanned: ${results.statistics.linesScanned}`);
console.log(`Average speed: ${(results.statistics.linesScanned / (results.duration / 1000)).toFixed(2)} lines/sec`);
```

## 13. Summary

Vue Security Scanner provides a rich API that supports:

- **Core Scanning**: Complete security scanning and report generation
- **Advanced Features**: Enhanced rule engine, performance optimization, threat intelligence integration
- **Utilities**: File operations, rule management, report generation
- **Configuration**: Flexible configuration loading and defaults
- **Error Handling**: Comprehensive error types and handling mechanisms
- **Command Line**: Command line argument parsing and execution
- **Modules**: Extensible rule and report modules

Through these APIs, you can:

1. **Integrate with Existing Systems**: CI/CD, monitoring systems, etc.
2. **Build Custom Tools**: Specialized tools based on core functionality
3. **Extend Functionality**: Add custom rules and report formats
4. **Automate Workflows**: Implement automated security scanning

Vue Security Scanner API design follows these principles:

- **Usability**: Simple and intuitive interfaces
- **Flexibility**: Rich configuration options
- **Extensibility**: Modular architecture
- **Performance**: Optimized implementation
- **Reliability**: Comprehensive error handling

Whether you're building small applications or large enterprise systems, Vue Security Scanner API can meet your security scanning needs.