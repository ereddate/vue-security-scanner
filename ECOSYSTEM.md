# Vue Security Scanner Ecosystem

Comprehensive security scanning solution for Vue.js projects with multiple environment integrations.

## Overview

Vue Security Scanner provides a complete ecosystem of tools to secure Vue.js applications across different development and deployment environments. The ecosystem includes:

- **Core Scanner** (v1.2.1+): Main security scanning engine with advanced features
- **Vite Plugin** (v1.3.0): Integration with Vite build system
- **Webpack Plugin** (v1.3.0): Integration with Webpack build system
- **Nuxt.js Module** (v1.3.0): Specialized module for Nuxt.js applications
- **VSCode Extension** (v1.2.0): Real-time security feedback in editor
- **MCP Tool** (v1.1.0): AI co-pilot integration for real-time scanning
- **Docker Integration**: Containerized scanning environment
- **Jenkins Plugin** (v1.1.0): CI/CD integration for Jenkins

## 🆕 New Features (v1.2.1+)

All ecosystem components now support advanced security features:

### Advanced Semantic Analysis
- AST-based code analysis for improved accuracy
- Reduced false positives through context understanding
- User input tracking for dangerous function calls
- Confidence scoring (High/Medium/Low)

### Enhanced Dependency Security
- npm audit integration for real-time vulnerability detection
- Built-in vulnerability database for 10+ common packages
- Outdated dependency detection
- License compliance checking

### Advanced Reporting
- Trend analysis with historical data comparison
- Compliance reporting (OWASP, GDPR, HIPAA, PCI-DSS, SOX)
- Vulnerability distribution analysis
- CWE and OWASP Top 10 mapping
- HTML report generation with interactive dashboards

### CI/CD Integration
- GitHub Actions workflow templates
- GitLab CI/CD pipelines
- Jenkins plugin support
- Azure DevOps, Bitbucket, CircleCI, Travis CI support

## Environment Integrations

### 1. Vite Plugin (v1.3.0)
A Vite plugin that performs security scans during the build process with advanced features.

**Features:**
- Real-time security scanning during Vite builds
- Advanced semantic analysis (AST-based)
- Dependency vulnerability scanning with npm audit
- Advanced reporting with trends and compliance
- HTML report generation
- Flexible configuration options
- Plugin system support
- Intelligent file filtering

**Installation:**
```bash
npm install --save-dev vite-plugin-vue-security
```

**Usage:**
```javascript
import vueSecurity from 'vite-plugin-vue-security';

export default {
  plugins: [
    vueSecurity({
      enabled: true,
      failOnError: false,
      reportLevel: 'warning',
      enableSemanticAnalysis: true,      // NEW: Enable AST analysis
      enableDependencyScanning: true,     // NEW: Enable dependency scanning
      enableAdvancedReport: true,          // NEW: Enable advanced reporting
      reportHistoryPath: '.vue-security-reports',
      complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX']
    })
  ]
};
```

### 2. Webpack Plugin (v1.3.0)
A Webpack plugin that performs security scans during the build process with advanced features.

**Features:**
- Real-time security scanning during Webpack builds
- Advanced semantic analysis (AST-based)
- Dependency vulnerability scanning with npm audit
- Advanced reporting with trends and compliance
- HTML report generation
- Flexible configuration options
- Plugin system support
- Intelligent file filtering

**Installation:**
```bash
npm install --save-dev webpack-plugin-vue-security
```

**Usage:**
```javascript
const VueSecurityWebpackPlugin = require('webpack-plugin-vue-security');

module.exports = {
  plugins: [
    new VueSecurityWebpackPlugin({
      enabled: true,
      failOnError: false,
      reportLevel: 'warning',
      enableSemanticAnalysis: true,      // NEW: Enable AST analysis
      enableDependencyScanning: true,     // NEW: Enable dependency scanning
      enableAdvancedReport: true,          // NEW: Enable advanced reporting
      reportHistoryPath: '.vue-security-reports',
      complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX']
    })
  ]
};
```

### 3. Nuxt.js Module (v1.3.0)
A specialized module for Nuxt.js applications that understands Nuxt-specific structures with advanced features.

**Features:**
- Nuxt-aware scanning for pages, layouts, middleware
- SSR security checks
- Static generation scanning
- Module system integration
- Advanced semantic analysis
- Dependency vulnerability scanning
- Advanced reporting capabilities

**Installation:**
```bash
npm install --save-dev nuxt-module-vue-security
```

**Usage:**
```javascript
// nuxt.config.js
export default {
  modules: [
    ['nuxt-module-vue-security', {
      enabled: true,
      reportLevel: 'warning',
      enableSemanticAnalysis: true,      // NEW: Enable AST analysis
      enableDependencyScanning: true,     // NEW: Enable dependency scanning
      enableAdvancedReport: true,          // NEW: Enable advanced reporting
      reportHistoryPath: '.vue-security-reports',
      complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX']
    }]
  ]
}
```

### 4. VSCode Extension (v1.2.0)
Real-time security feedback in the editor with advanced features.

**Features:**
- Real-time security scanning as you code
- Advanced semantic analysis
- Dependency vulnerability scanning
- Advanced reporting with trends and compliance
- Interactive HTML reports
- Inline diagnostics with severity levels
- Quick fix suggestions
- Customizable scan triggers (on save, on open)

**New Commands:**
- `Vue Security: Scan Current Project` - Scan entire workspace
- `Vue Security: Scan Current File` - Scan active file
- `Vue Security: Scan Dependencies` - NEW: Scan npm dependencies
- `Vue Security: Show Security Report` - Show basic report
- `Vue Security: Show Advanced Report` - NEW: Show advanced report with trends
- `Vue Security: Configure Settings` - Open settings

**New Configuration Options:**
```json
{
  "vueSecurityScanner.enableSemanticAnalysis": true,
  "vueSecurityScanner.enableDependencyScanning": true,
  "vueSecurityScanner.enableAdvancedReport": false,
  "vueSecurityScanner.reportHistoryPath": ".vue-security-reports",
  "vueSecurityScanner.complianceStandards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
}
```

### 5. MCP Tool (v1.1.0)
AI co-pilot integration for real-time security scanning with advanced features.

**Features:**
- Real-time security scanning during AI-assisted development
- Advanced semantic analysis
- Dependency vulnerability scanning
- Advanced reporting capabilities
- Support for multiple AI platforms
- Configurable scanning options

**New Methods:**
- `scanCode(code, fileName)` - Scan code string
- `scanDependencies(projectPath)` - NEW: Scan project dependencies
- `generateAdvancedReport(scanResults, options)` - NEW: Generate advanced report
- `enableSemanticAnalysis(enabled)` - NEW: Enable/disable semantic analysis
- `enableDependencyScanning(enabled)` - NEW: Enable/disable dependency scanning
- `enableAdvancedReport(enabled)` - NEW: Enable/disable advanced reporting
- `setComplianceStandards(standards)` - NEW: Set compliance standards

**Usage:**
```javascript
const VueSecurityMCP = require('vue-security-mcp');

const scanner = new VueSecurityMCP({
  enableSemanticAnalysis: true,
  enableDependencyScanning: true,
  enableAdvancedReport: true
});

// Scan code
const result = await scanner.scanCode(code, 'component.vue');

// Scan dependencies
const depResult = await scanner.scanDependencies('/path/to/project');

// Generate advanced report
const advancedReport = await scanner.generateAdvancedReport(scanResults, {
  includeTrends: true,
  includeCompliance: true
});
```

### 6. Docker Integration
Containerized scanning environment with advanced features support.

**Features:**
- Isolated scanning environment
- Consistent results across platforms
- Easy CI/CD integration
- Multiple scanning modes
- Support for advanced features
- Volume mounting for reports and history

**New Environment Variables:**
```yaml
environment:
  - ENABLE_SEMANTIC_ANALYSIS=true  # NEW: Enable AST analysis
  - ENABLE_DEPENDENCY_SCANNING=true  # NEW: Enable dependency scanning
  - ENABLE_ADVANCED_REPORT=true  # NEW: Enable advanced reporting
  - COMPLIANCE_STANDARDS=OWASP,GDPR,HIPAA,PCI-DSS,SOX  # NEW: Compliance standards
```

**New Services:**
- `vue-security-scanner` - Standard scanning with advanced features
- `vue-security-scanner-light` - Lightweight mode (semantic analysis disabled)
- `vue-security-scanner-advanced` - NEW: Advanced mode with all features enabled
- `vue-security-api` - API server with advanced features

**Usage:**
```bash
# Build and run scanner
docker build -t vue-security-scanner .
docker run -v $(pwd):/workspace/project \
  -v $(pwd)/reports:/home/scanner/reports \
  -v $(pwd)/report-history:/home/scanner/.vue-security-reports \
  vue-security-scanner \
  /workspace/project \
  --level detailed \
  --advanced-report \
  --report-history-path /home/scanner/.vue-security-reports
```

### 7. Jenkins Plugin (v1.1.0)
Deep integration with Jenkins CI/CD platform with advanced features.

**Features:**
- Pipeline and freestyle job support
- Build failure control based on security findings
- Detailed reporting
- Plugin system compatibility
- Advanced semantic analysis support
- Dependency vulnerability scanning
- Advanced reporting with trends and compliance

**New Configuration Options:**
- Enable Semantic Analysis - Enable AST-based analysis
- Enable Dependency Scanning - Enable npm audit integration
- Enable Advanced Report - Generate advanced reports with trends
- Report History Path - Path for storing report history
- Compliance Standards - List of compliance standards to check

**Usage:**
```groovy
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            steps {
                vueSecurityScanner(
                    projectPath: '.',
                    scanLevel: 'detailed',
                    failBuildOnVulnerabilities: true,
                    reportOutputPath: 'security-report.json',
                    enableSemanticAnalysis: true,      // NEW
                    enableDependencyScanning: true,     // NEW
                    enableAdvancedReport: true,          // NEW
                    reportHistoryPath: '.vue-security-reports',  // NEW
                    complianceStandards: 'OWASP,GDPR,HIPAA,PCI-DSS,SOX'  // NEW
                )
            }
        }
    }
}
```

**Installation:**
Install through Jenkins plugin manager or manually deploy the `.hpi` file.

## Core Features

All integrations leverage the powerful core features:

### Plugin System
- Extensible architecture for custom security checks
- Pre-built plugins for common vulnerabilities
- Easy creation of organization-specific checks

### Smart Ignore Rules
- Git-like ignore patterns
- File, directory, and vulnerability type filtering
- Flexible configuration options

### Comprehensive Detection
- XSS prevention
- SQL injection protection
- Hardcoded secrets detection
- Dependency vulnerability scanning
- Configuration security checks

## Getting Started

Choose the integration that fits your development workflow:

1. **Development Time**: Use VSCode extension for real-time feedback
2. **Build Process**: Integrate with your build system (Vite, Webpack, Nuxt)
3. **CI/CD**: Use Docker or Jenkins integration for automated scanning
4. **Manual Scanning**: Use the command-line tool directly

## Configuration

All tools support similar configuration options through:

- Configuration files (`vue-security-scanner.config.json`)
- Command-line options
- Environment variables
- Platform-specific configuration (webpack config, nuxt config, etc.)

## Contributing

We welcome contributions to the Vue Security Scanner ecosystem. Please see our contributing guide for more details.

## License

MIT