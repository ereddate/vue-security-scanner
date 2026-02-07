# Vue Security Scanner

A comprehensive, modular security scanning tool for Vue.js projects that identifies potential vulnerabilities and security issues.

## 🚀 Quick Start

### Installation

```bash
# Global installation
npm install -g vue-security-scanner

# Or run directly without installation
npx vue-security-scanner [project-path]
```

### Basic Usage

```bash
# Scan current directory
vue-security-scanner .

# Scan with detailed output
vue-security-scanner . --level detailed

# Scan and save report
vue-security-scanner . --output json --report security-report.json

# Sync vulnerability data sources
npm run sync-vulnerability-data

# Sync specific data sources
node src/cli/sync-vulnerability-data.js --sources nvd,github

# Show vulnerability data statistics
node src/cli/sync-vulnerability-data.js --stats

# Search for vulnerabilities
node src/cli/sync-vulnerability-data.js --search "vue"

# Check specific package
node src/cli/sync-vulnerability-data.js --package vue --version 3.0.0

# Check specific CVE
node src/cli/sync-vulnerability-data.js --cve CVE-2021-12345
```

## ✨ Key Features

### Core Security
- **165+ Security Rules**: Comprehensive coverage including XSS, injection, authentication, TypeScript integration, Vue DevTools, advanced attack vectors, i18n deep security, build tools, form validation, state management plugins, Vue 3.7+ features, and ecosystem libraries
- **Advanced Semantic Analysis**: AST-based code analysis with user input tracking
- **Dynamic Application Security Testing (DAST)**: Runtime vulnerability scanning
- **Enhanced Dependency Security**: npm audit integration with built-in vulnerability database
- **Multi-Source Vulnerability Data**: Integration with NVD, GitHub Advisory, and Vue Ecosystem for comprehensive dependency security analysis
- **Modern Frontend Security**: Coverage for Web Vitals, Frontend AI/ML, CSS-in-JS, Build Tools, Testing, Monitoring, Caching, and Performance Security threats

### Vue Support
- **Vue 2.x**: Full support for Options API and Vue 2 features
- **Vue 3.x**: Complete support for Composition API and Vue 3 features
- **Vue 3.5+**: Enhanced support for defineModel, defineAsyncComponent, v-memo, defineOptions
- **Vue 3.6+**: Support for Vapor mode, toValue, toRef, effectScope, and latest optimizations
- **Vue 3.6+ API Security**: Comprehensive security rules for new Vue 3.6+ APIs including Component Compiler, Template Compiler, and Runtime Compiler
- **Vue 3.7+ Features**: Support for experimental features, advanced Composition API, Vapor mode, reactive optimization, type system, compatibility, and future-proofing
- **TypeScript Integration**: Comprehensive security rules for TypeScript type safety, any type usage, unsafe type assertions, type conversions, interfaces, generics, and nullish coalescing
- **Vue DevTools Security**: Detection of DevTools enabled in production, debug mode, time travel functionality, and performance impact
- **Advanced Attack Vectors**: Component injection, template injection, reactive system exploits, event propagation, lifecycle hook exploits, custom directive exploits, and provide/inject exploits
- **i18n Deep Security**: Message injection, message format security, locale switching, message loading, pluralization, date format, and number format security
- **Build Tool Security**: Vite configuration, Webpack configuration, build tool plugins, build output, build scripts, build cache, and build dependency security
- **Form Validation Security**: Vuelidate, VeeValidate, FormKit, Vue Formulate, form validation bypass, form field security, and form data security
- **State Management Plugin Security**: Pinia plugins, Pinia stores, Vuex plugins, Vuex stores, state persistence, state injection, and state management devtools
- **Ecosystem Library Security**: Element Plus, Ant Design Vue, Vuetify, Naive UI, Vue Router, Pinia, Vuex, Vue i18n, and VueUse security

### Enterprise Features
- **Distributed Scanning**: Scalable architecture supporting 10,000+ files
- **Visualization Dashboard**: Interactive web dashboard with live statistics
- **Advanced Reporting**: Trend analysis, compliance reports, vulnerability distribution
- **Trae CN Integration**: Automated vulnerability reporting and tracking

### Performance
- **Performance Profiles**: Fast, balanced, and thorough scanning modes
- **Caching System**: Comprehensive caching for improved performance
- **Incremental Scanning**: Only scan modified files for faster subsequent scans with file metadata tracking
- **Parallel Processing**: Automatic CPU core detection and optimal worker count with dynamic adjustment
- **GPU Acceleration**: GPU-accelerated regex matching with automatic CPU fallback and performance testing
- **Dynamic Load Balancing**: Adaptive concurrency based on system resources
- **Dynamic Memory Management**: Automatic memory limit adjustments, garbage collection, and batch size optimization
- **Fine-grained Control**: Granular configuration options for performance tuning with resource monitoring
- **Intelligent Vulnerability Analysis**: Risk scoring and correlation analysis for vulnerabilities
- **Rule Extension API**: Flexible API for custom security rules
- **Asynchronous Semaphore**: Smart concurrency control with timeout handling
- **Module Lazy Loading**: On-demand module loading for reduced memory footprint
- **File Type Analyzer**: Smart file type detection and security relevance scoring

### Compliance
- **China-Specific Standards**: GB/T series, Cybersecurity Law, Data Security Law, PIPL, Cryptography Law
- **OWASP Top 10 2021**: Full coverage of OWASP Top 10
- **CWE Mapping**: Common Weakness Enumeration references
- **Multiple Report Formats**: JSON, HTML, Text, XML, SARIF

### Integrations
- **VSCode Extension**: Real-time security feedback in editor
- **Vite Plugin**: Compile-time security scanning
- **Webpack Plugin**: Build-time security scanning
- **Nuxt.js Module**: SSR and static generation support
- **Docker Integration**: Containerized scanning environment
- **Jenkins Plugin**: CI/CD automation
- **CI/CD Platforms**: GitHub Actions, GitLab CI/CD, Azure DevOps, Bitbucket Pipelines, CircleCI, Travis CI

### Cross-Framework Support
- **uni-app**: Security analysis for uni-app projects
- **Taro**: Security analysis for Taro framework
- **WeChat Mini Program**: Security scanning for WeChat Mini Program code
- **Baidu Smart Program**: Security scanning for Baidu Smart Programs
- **ByteDance Mini Program**: Security scanning for ByteDance Mini Programs
- **QQ Mini Program**: Security scanning for QQ Mini Programs

### Threat Intelligence
- **CNCERT/CC**: Access to CNCERT/CC threat intelligence
- **CNNVD**: Access to CNNVD vulnerability database
- **CNVD**: Access to CNVD vulnerability database
- **NVD**: Access to NIST National Vulnerability Database
- **CVE**: Access to CVE vulnerability database
- **OWASP**: Access to OWASP threat intelligence

### Vulnerability Data Source Integration
- **Multi-Source Integration**: Comprehensive vulnerability data from NVD, GitHub Advisory, and Vue Ecosystem
- **Real-time Updates**: Regular synchronization with latest vulnerability databases
- **Version-Aware Analysis**: Intelligent version matching to identify affected dependencies
- **CVE Tracking**: Full CVE vulnerability tracking and reporting
- **Vue-Specific Vulnerabilities**: Dedicated coverage for Vue ecosystem security issues
- **Local Storage**: Offline vulnerability database support with caching
- **CLI Tools**: Command-line utilities for data synchronization and querying

### AI-Assisted Security
- **Vue Security MCP**: Real-time security feedback during AI-assisted development
- **AI Coding Assistant Integration**: Integration with popular AI coding assistants
- **Batch Processing**: Batch processing capabilities for multiple code snippets
- **Memory Optimization**: Memory optimization for large-scale scanning

## 📚 Documentation

Comprehensive documentation is available to help you get started and make the most of Vue Security Scanner:

### Quick Start
- **[Installation Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/installation.md)** - System requirements, installation methods, and configuration
- **[Usage Tutorial](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/usage.md)** - Command-line options, scanning modes, and advanced features

### Core Features
- **[Rule Documentation](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/rules/index.md)** - Complete reference for all security rule modules
- **[API Reference](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/api/index.md)** - Programming interface for scanner integration
- **[Performance Optimization](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/performance/index.md)** - Performance tuning and best practices

### Advanced Features
- **[Configuration Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/configuration.md)** - Configuration options and customization
- **[Ecosystem Integration](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/ecosystem.md)** - Integration with various tools and platforms
- **[Features Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/features.md)** - Detailed feature descriptions and capabilities
- **[Vue Features Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/vue-features.md)** - Vue-specific security features and coverage
- **[Security Coverage](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/security-coverage.md)** - Comprehensive security vulnerability coverage

### Development & Testing
- **[Development Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/development.md)** - Development setup and contribution guide
- **[Testing Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/testing.md)** - Testing strategies and examples

### Compliance & Threat Intelligence
- **[Compliance Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/compliance/index.md)** - Compliance requirements and reporting (China laws, GB/T standards, etc.)
- **[Threat Intelligence Integration](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/threat-intelligence/index.md)** - Threat intelligence sources and configuration

### Community
- **[Contributing Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/CONTRIBUTING.md)** - How to contribute to the project
- **[FAQ](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/FAQ.md)** - Frequently asked questions and troubleshooting
- **[Release Notes](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/release-notes.md)** - Version history and changelog

## 🌐 Ecosystem & Environment Integrations

### Vite Plugin
```bash
npm install --save-dev vite-plugin-vue-security
```

### Webpack Plugin
```bash
npm install --save-dev webpack-plugin-vue-security
```

### Nuxt.js Module
```bash
npm install --save-dev @vue-security/nuxt
```

### Docker Integration
```bash
# Build and run scanner container
docker build -t vue-security-scanner .
docker run -v $(pwd):/workspace/project vue-security-scanner /workspace/project --level detailed
```

### Jenkins Plugin
Install through Jenkins plugin manager or manually deploy the `.hpi` file.

### Trae CN Integration
Seamless integration with Trae CN for automated vulnerability reporting and tracking:

```javascript
// Vite
vueSecurity({
  enableTraeCN: true,
  traeCNApiKey: 'your-api-key',
  traeCNProjectId: 'your-project-id',
  traeCNAutoReport: true,
  traeCNRealtimePush: true
})
```

### VSCode Extension
1. Download the packaged extension (.vsix file)
2. In VSCode, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Extensions: Install from VSIX..."
4. Select the downloaded .vsix file

## 🏢 Enterprise Features

### Distributed Scanning
For large-scale projects, use distributed scanning to distribute work across multiple workers:

```bash
# Start a distributed worker
vue-security-distributed worker --port 3001 --worker-id worker-1

# Run distributed scan
vue-security-distributed scan /path/to/vue-project \
  --workers workers.json \
  --batch-size 10 \
  --output json \
  --report distributed-scan.json \
  --save-results
```

### Visualization Dashboard
Start the web-based dashboard for real-time security monitoring:

```bash
# Start the dashboard server
npm run dashboard

# Or using vue-security-distributed command
vue-security-distributed dashboard

# With custom port
vue-security-distributed dashboard --port 8080
```

Then open your browser to `http://localhost:3000` (or custom port) to view:
- Real-time vulnerability statistics
- 30-day vulnerability trends
- Severity distribution charts
- Recent scan history
- Project-level security tracking

For detailed information on distributed scanning and dashboard features, see [Distributed Scanning Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/distributed-scanning.md) and [Dashboard Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/dashboard.md).

### Rule Engine
The scanner uses a powerful rule-based engine for security detection. You can extend security rules by creating custom rule files:

```javascript
// src/rules/my-custom-rules.js
const myCustomRules = [
  {
    id: 'my-rule',
    name: 'My Security Rule',
    severity: 'High',
    description: 'Detects my security issue',
    recommendation: 'Fix recommendation',
    patterns: [
      { key: 'my-pattern', pattern: 'your-regex-pattern' }
    ]
  }
];

module.exports = myCustomRules;
```

For detailed information on creating custom rules, see [Rule Extension Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/rule-extension-guide.md) and [Quickstart: Custom Rules](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/quickstart-custom-rules.md).

### Ignore Rules
Create a `.vue-security-ignore` file in your project root to ignore specific files, directories, or vulnerabilities:

```bash
# Ignore directories
node_modules/
dist/
build/

# Ignore file patterns
**/*.min.js
**/vendor/**

# Ignore specific vulnerability types
type:XSS
type:Memory Leak

# Ignore specific rules
rule:custom-api-key
rule:hardcoded-password

# Ignore by severity
severity:low
```

For more ignore options and detailed instructions, see [Ignore Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/ignore-guide.md)

## ⚙️ Configuration

Create a `vue-security-scanner.config.json` file to customize scanning behavior:

```json
{
  "rules": {
    "xss": { 
      "enabled": true,
      "severity": "high"
    },
    "dependencies": { 
      "enabled": true,
      "severity": "high"
    }
  },
  "scan": {
    "maxSize": 10,
    "maxDepth": 10,
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git"
    ]
  },
  "output": {
    "showProgress": true,
    "format": "json",
    "showDetails": true,
    "maxIssuesToShow": 100,
    "advancedReport": true,
    "reportPath": "security-report.json"
  },
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

For detailed configuration options, see [Configuration Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/configuration.md).

## 🛠️ Development

#### Setting Up the Project
```bash
# Clone the repository
git clone <repository-url>
cd vue-security-scanner

# Install dependencies
npm install

# Run the scanner with garbage collection
node --expose-gc bin/vue-security-scanner.js [project-path]

# Run with scripts
npm start [project-path]
npm run scan [project-path]
npm run scan-with-gc [project-path]
```

#### Distributed Scanning
```bash
# Start a distributed worker
npm run distributed:worker

# Run distributed scan
npm run distributed:scan [project-path]
```

#### Dashboard
```bash
# Start the visualization dashboard
npm run dashboard
```

#### GPU Testing
```bash
# Test GPU acceleration
npm run test:gpu

# Run GPU demo
npm run demo:gpu
```

For detailed development information, see [Development Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/development.md).

## 📊 Output Formats

The scanner can output results in multiple formats:
- **JSON**: Detailed structured data for integration with other tools
- **Console**: Human-readable output for quick analysis
- **HTML**: Formatted reports for sharing with stakeholders
- **Text**: Plain text format for simple reporting
- **XML**: Structured XML format for integration
- **SARIF**: Static Analysis Results Interchange Format for tool integration

## 🧪 Test Examples & Vulnerability Coverage

The Vue Security Scanner includes comprehensive test examples covering 1000+ vulnerability scenarios across 36 test files:

### Test Coverage
- **Test Files**: 41 files
- **Vulnerability Examples**: 1000+ examples
- **Security Rules**: 220+ rules
- **Vue-Specific Coverage**: 95%+
- **General Security Coverage**: 90%+

For detailed test examples and vulnerability coverage, see [Testing Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/testing.md) and [Security Coverage](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/security-coverage.md).

## 🛡️ Security Coverage

The tool addresses the OWASP Top 10 and other security standards:
- Injection flaws
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Security Misconfigurations
- Vulnerable Components
- Insufficient Logging & Monitoring

For comprehensive security coverage information, see [Security Coverage Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/security-coverage.md).

## Vue-Specific Feature Verification

Our scanner provides comprehensive verification of Vue.js-specific features:

### Vue 2/3 Component System
- Component Definition Security
- Props Validation
- Event System Security
- Lifecycle Hooks Security

### Vue Template System
- Directive Security (v-html, v-text, v-bind, v-for, etc.)
- Custom Directives Security

### Vue Reactive System
- Data Binding Security
- Computed Properties Security
- Watchers Security

### Vue 2 Features
- Options API Security
- Filters Security
- Mixins Security
- Plugin System Security

### Vue 3 Features
- Composition API Security (ref, reactive, computed, watch, provide/inject)
- Teleport Security
- Suspense Security

### Vue Router Security
- Route Definition Security
- Route Parameters Security
- Route Guards Security
- Dynamic Routes Security

### State Management Security
- Vuex Security
- Pinia Security
- Dynamic Modules Security

For detailed Vue-specific security information, see [Vue Features Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/vue-features.md).

## 🆕 New Features

### 1. Advanced Semantic Analysis
AST-based code analysis that significantly improves detection accuracy:
- Reduced False Positives
- User Input Tracking
- Confidence Scoring
- Smart Merging

### 2. Enhanced Dependency Security
Comprehensive dependency vulnerability scanning:
- npm Audit Integration
- Built-in Vulnerability Database
- Outdated Dependency Detection
- License Compliance

### 3. Advanced Reporting
Enterprise-grade reporting with comprehensive analysis:
- Trend Analysis
- Compliance Reports
- Vulnerability Distribution
- CWE Mapping
- OWASP Top 10 Mapping

### 4. CI/CD Integration
Seamless integration with major CI/CD platforms:
- GitHub Actions
- GitLab CI/CD
- Jenkins
- Azure DevOps
- Bitbucket Pipelines
- CircleCI
- Travis CI

For detailed information on new features, see [Features Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/features.md) and [Release Notes](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/release-notes.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/ereddate/vue-security-scanner/blob/master/docs/en/CONTRIBUTING.md) for details on how to:
- Submit bug reports
- Propose new features
- Contribute code
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for the Vue.js community
