# Vue Security Scanner

A comprehensive, modular security scanning tool for Vue.js projects that identifies potential vulnerabilities and security issues.

## 🚀 Features

### Core Security Features

- **Advanced Semantic Analysis (NEW)**: AST-based code analysis for enhanced accuracy
  - Reduces false positives through code context understanding
  - Supports JavaScript, TypeScript, JSX, and TSX syntax
  - Detects dangerous function calls with user input tracking
  - Identifies unsafe property access patterns
  - Provides confidence level assessment (High/Medium/Low)
  - Intelligent merging with regex-based detection

- **Enhanced Dependency Security (NEW)**: Comprehensive dependency vulnerability scanning
  - Integrated npm audit for real-time vulnerability detection
  - Built-in vulnerability database for common packages
  - Outdated dependency detection
  - License compliance checking
  - Vulnerability caching for performance optimization
  - Support for transitive dependency analysis

- **Advanced Reporting (NEW)**: Enterprise-grade reporting capabilities
  - Trend analysis with historical data comparison
  - Compliance reports (OWASP, GDPR, HIPAA, PCI-DSS, SOX)
  - Vulnerability distribution analysis
  - CWE and OWASP Top 10 mapping
  - Fix complexity assessment
  - Priority-based recommendations
  - Interactive HTML reports with visual dashboards

- **CI/CD Integration (NEW)**: Seamless integration with major CI/CD platforms
  - GitHub Actions workflows with PR comments
  - GitLab CI/CD pipelines with MR checks
  - Jenkins declarative pipelines
  - Azure DevOps, Bitbucket, CircleCI, Travis CI support
  - Automated security gates and build blocking
  - Scheduled security scans

- **XSS Detection**: Identifies potential cross-site scripting vulnerabilities
  - Checks for unsafe usage of `v-html`
  - Detects inline event handlers
  - Finds potential template injection points
  - Identifies unsafe route parameter usage
  - Detects DOM-based XSS patterns
  - Checks for unsafe usage of `v-text` and `v-bind` directives
  - Identifies unsafe v-for loop sources
  - Reviews custom directive implementations for security issues
  
- **Dependency Security**: Analyzes dependencies for known vulnerabilities
  - Checks for outdated or compromised packages
  - Identifies deprecated dependencies
  - Flags packages with security advisories
  - Reviews Vue-specific configurations in package.json
  
- **Configuration Security**: Reviews configuration files for security misconfigurations
  - Detects hardcoded secrets
  - Finds insecure CORS policies
  - Identifies Vue-specific misconfigurations
  - Checks for missing security headers (X-Frame-Options, X-XSS-Protection, HSTS, CSP)
  
- **Input Validation**: Checks for proper input validation
  - Identifies missing validation on form inputs (v-model)
  - Flags potential open redirect vulnerabilities
  
- **Code Quality Security**: Reviews code for security issues
  - Detects dangerous eval usage
  - Finds potential prototype pollution
  - Identifies unsafe dynamic imports
  - Detects sensitive data exposure in URLs
  - Identifies weak random number generation
  - **Vue-specific security checks**: Vue 2/3 specific security issues including filters, mixins, $refs dynamic access, Composition API usage, dynamic components, prototype pollution, router security issues, state management security, custom directives, and v-for loop safety

- **Vue-Specific Security Checks**: Comprehensive security analysis for Vue.js features
  - **Template Security**: Checks for safe usage of v-html, v-text, v-bind, and other directives
  - **Router Security**: Validates Vue Router usage, guards, and parameter handling
  - **State Management Security**: Reviews Vuex and Pinia store implementations
  - **Component Security**: Inspects component communication and lifecycle hooks
  - **Custom Directives**: Reviews custom directive implementations for DOM manipulation vulnerabilities
  - **Slots Security**: Validates scoped slots and slot content handling
  - **Composition API Security**: Checks for secure usage of ref, reactive, computed, watch, and provide/inject
  - **Dynamic Components**: Validates component loading and rendering patterns

- **AI-Assisted Security (MCP)**: Vue Security MCP (Multi-Modal Co-Pilot) for real-time security scanning during AI-assisted development
  - Real-time security feedback when using AI to generate Vue code
  - Integration with popular AI coding assistants
  - Configuration support for customizing security scanning behavior
  - Multiple report formats (JSON, Text, HTML)
  - Batch processing capabilities for multiple code snippets
  - Memory optimization for large-scale scanning
  - Command-line interface for easy integration into development workflows
  
- **VSCode Integration**: Full integration with VSCode for real-time security feedback
- **Vite Plugin**: Integration with Vite build process for compile-time security scanning
- **Webpack Plugin**: Integration with Webpack build system for comprehensive security scanning
- **Nuxt.js Module**: Specialized module for Nuxt.js applications with SSR and static generation support
- **Docker Integration**: Containerized scanning environment for consistent security checks
- **Jenkins Plugin**: Deep integration with Jenkins CI/CD platform for automated security scanning
- **TypeScript Support**: Comprehensive security analysis for TypeScript files including type assertions, generic issues, and decorator vulnerabilities

## 📦 Installation

### Command Line Tool
```bash
# Global installation
npm install -g vue-security-scanner

# Or run directly without installation
npx vue-security-scanner [project-path]
```

### VSCode Extension
1. Download the packaged extension (.vsix file)
2. In VSCode, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Extensions: Install from VSIX..."
4. Select the downloaded .vsix file

Or install directly from the VSCode Marketplace once published.

## 🌐 Ecosystem & Environment Integrations

Vue Security Scanner provides a comprehensive ecosystem of tools that integrate seamlessly with different development and deployment environments:

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

### CI/CD Integration (NEW)
Vue Security Scanner provides comprehensive CI/CD integration for major platforms:

- **GitHub Actions**: Automated security scanning with PR comments and scheduled scans
- **GitLab CI/CD**: Multi-stage pipelines with MR security checks
- **Jenkins**: Declarative pipelines with HTML report publishing
- **Azure DevOps**: YAML-based pipelines with artifact publishing
- **Bitbucket Pipelines**: Container-based security scanning
- **CircleCI**: Multi-version Node.js testing
- **Travis CI**: Automated security checks

For detailed integration guides, see [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md).

Each integration leverages the same core security scanning engine and supports:
- Rule engine for custom security checks
- Flexible ignore rules similar to `.gitignore`
- Comprehensive vulnerability detection
- Detailed reporting capabilities
- Advanced reporting with trends and compliance analysis
- Automated security gates and build blocking

## 🔧 Usage

### Command Line Interface
```bash
# Scan current directory
vue-security-scanner .

# Scan specific project
vue-security-scanner /path/to/vue-project

# Generate detailed report
vue-security-scanner . --report security-report.json

# Use custom configuration
vue-security-scanner . --config my-config.json

# Scan with specific output format
vue-security-scanner . --output json

# Scan with detailed level
vue-security-scanner . --level detailed

# Scan with custom batch size (for large projects)
vue-security-scanner . --batch-size 10 --memory-threshold 80

# Scan with automatic garbage collection
vue-security-scanner . --gc-interval 5

# Enable advanced reporting with trends and compliance analysis (NEW)
vue-security-scanner . --advanced-report --output json --report security-report.json

# Enable semantic analysis for enhanced accuracy (NEW)
vue-security-scanner . --config config-with-semantic-analysis.json
```

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

For detailed information on creating custom rules, see [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) and [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md).

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

### VSCode Extension
Once installed, the extension provides:

- **Context Menu Options**: Right-click on Vue files or folders to scan
- **Integrated Panel**: View security reports in a dedicated panel
- **Real-time Diagnostics**: See security warnings directly in the editor
- **Quick Actions**: Access security commands from the command palette
- **Automatic Detection**: Automatically detects Vue projects and suggests scanning

Available commands:
- `Vue Security: Scan Current Project` - Scans the entire workspace for security issues
- `Vue Security: Scan Current File` - Scans the currently open Vue file
- `Vue Security: Show Security Report` - Opens the security report panel
- `Vue Security: Configure Settings` - Opens the extension settings

#### Configuration Options
The extension provides several configuration options that can be set in VSCode settings:

- `vueSecurityScanner.enableOnOpen`: Enable security scanning when opening Vue files (default: false)
- `vueSecurityScanner.scanOnSave`: Scan file when saving Vue files (default: false)
- `vueSecurityScanner.maxFileSize`: Maximum file size to scan in MB (default: 10)
- `vueSecurityScanner.ignoredFolders`: Folders to ignore during scanning (default: ["node_modules", "dist", "build", ".git"])
- `vueSecurityScanner.reportOutputPath`: Path to save security report (default: "./security-report.html")

These can be configured in your VSCode `settings.json` file:

```json
{
  "vueSecurityScanner.enableOnOpen": false,
  "vueSecurityScanner.scanOnSave": true,
  "vueSecurityScanner.maxFileSize": 10,
  "vueSecurityScanner.ignoredFolders": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ],
  "vueSecurityScanner.reportOutputPath": "./security-report.html"
}
```

## ⚙️ Configuration

Create a `vue-security-scanner.config.json` file to customize scanning behavior and ignore specific detection items:

```json
{
  "rules": {
    "xss": { 
      "enabled": true,
      "severity": "high",
      "options": {
        "checkVHtml": true,
        "checkTemplateInterpolation": true,
        "checkEventHandlers": true
      }
    },
    "dependencies": { 
      "enabled": true,
      "severity": "high",
      "options": {
        "checkKnownVulnerabilities": true,
        "checkDeprecated": true,
        "checkOutdated": false  // Disable outdated check
      }
    },
    "secrets": { 
      "enabled": true,
      "severity": "high",
      "options": {
        "patterns": [
          "/password\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/secret\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/token\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/api[_-]?key\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi"
        ]
      }
    },
    "codeSecurity": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkEvalUsage": true,
        "checkPrototypePollution": true,
        "checkDynamicImports": true,
        "checkRouteParams": true
      }
    },
    "configSecurity": { 
      "enabled": true,
      "severity": "medium",
      "options": {
        "checkCorsSettings": true,
        "checkVueConfigs": true
      }
    }
  },
  "scan": {
    "maxSize": 10,
    "maxDepth": 10,
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**"
    ]
  },
  "output": {
    "showProgress": true,
    "format": "json",
    "showDetails": true,
    "maxIssuesToShow": 100,
    "advancedReport": false, // Enable advanced reporting (trends, compliance)
    "reportPath": "security-report.json"
  },
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true, // Enable AST semantic analysis (NEW)
    "enableNpmAudit": true, // Enable npm audit integration (NEW)
    "enableVulnerabilityDB": true // Enable vulnerability database (NEW)
  },
  "reportHistory": {
    "enabled": true, // Enable historical data for trend analysis (NEW)
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true, // Enable compliance checking (NEW)
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

### Ignoring Specific Detection Items

You can customize the scanner to ignore certain types of vulnerabilities or specific files:

1. **Disable Rule Categories**: Set `"enabled": false` for any rule category in the `rules` section
2. **Ignore Directories**: Add directories to the `ignoreDirs` array
3. **Ignore File Patterns**: Add glob patterns to the `ignorePatterns` array
4. **Adjust Severity Threshold**: Modify the `severity` value to filter results

### Using Configuration Files

The scanner looks for configuration files in this order:
1. `vue-security-scanner.config.json` in the project root
2. `.vue-security.json` in the project root
3. `vue-security-scanner.config.json` in the current working directory
4. `.vue-security.json` in the current working directory

Alternatively, specify a configuration file using the `--config` option:

```bash
vue-security-scanner . --config /path/to/my-config.json
```

## 🏢 Enterprise Features

### Rule Engine
The tool includes a powerful rule-based engine that allows enterprises to:

- **Flexible Extensibility**: Add custom security detection rules by creating rule configuration files
- **Precise Control**: Control scanning behavior through multiple configuration methods
- **Personalized Customization**: Enable or disable specific detection items based on project needs
- **Intelligent Ignoring**: Use `.gitignore`-like mechanisms to ignore specific files, directories, or vulnerability types
- **Extend Security Checks**: Create custom security rules specific to your organization
- **Compliance Requirements**: Implement checks for regulatory compliance (SOX, GDPR, HIPAA)
- **Custom Threat Models**: Define organization-specific threat patterns
- **Integration Capabilities**: Connect with existing security infrastructure

The rule engine includes 149+ security checks for common vulnerabilities such as XSS, SQL injection, CSRF, HTTP header injection, insecure cookie configurations, memory leaks, hardcoded secrets, and third-party library vulnerabilities.

Each security check is implemented as a rule configuration, making the system highly modular and customizable. Users can create their own security detection rules by following a simple configuration format.

### Custom Rules Development

Users can easily create custom security detection rules. For detailed development guidelines, please refer to [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) and [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md).

Basic rule template:

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

### Rule Structure
Every security detection rule is a configuration object with the following structure:

```javascript
{
  id: 'rule-id',                    // Unique identifier
  name: 'Rule Name',                // Rule name
  severity: 'High',                 // Severity: High/Medium/Low
  description: 'Description',        // Rule description
  recommendation: 'Fix advice',     // Fix recommendation
  patterns: [                       // Detection patterns
    {
      key: 'pattern-key',           // Pattern key (for caching)
      pattern: 'regex-pattern',     // Regular expression pattern
      flags: 'gi'                   // Optional: regex flags
    }
  ]
}
```


### Flexible Ignore Rules
The tool supports flexible ignore rules similar to `.gitignore`, allowing you to:

- **Ignore Specific Files/Directories**: Specify files or directories to skip during scanning
- **Ignore Vulnerability Types**: Skip specific types of vulnerabilities
- **Ignore by Rule**: Disable specific rule checks
- **Ignore by Severity**: Skip vulnerabilities of certain severity levels

Create a `.vue-security-ignore` file in your project root with rules like:

```
# Ignore specific directories
node_modules/
dist/
build/
public/

# Ignore specific file patterns
**/example-vue-app/**
**/vue-security-scanner-vscode/**

# Ignore specific vulnerability types
type:deprecated

# Ignore specific rules
rule:custom-api-key
rule:hardcoded-password

# Ignore specific severity levels
severity:low
```

### Enterprise Configuration Options
- Advanced threat detection models
- Compliance reporting formats
- Custom severity thresholds
- Integration with SIEM systems
- Automated alerting capabilities
- Flexible ignore rules system

### Built-in Security Rules
The Vue Security Scanner comes with 149+ built-in security rules:

#### Core Security Rules (129 rules)
- **XSS Detection**: Advanced cross-site scripting detection for Vue templates and JavaScript code
- **CSRF Detection**: Identifies potential cross-site request forgery vulnerabilities in HTTP requests
- **Hardcoded Secrets**: Enhanced sensitive information detection for passwords, tokens, and API keys
- **SQL Injection**: Scans for potential SQL injection vulnerabilities in database queries
- **HTTP Header Injection**: Detects potential HTTP header injection vulnerabilities
- **Insecure Cookie Configuration**: Checks for missing security attributes in cookie settings
- **Memory Leak Detection**: Identifies potential memory leak patterns in Vue components
- **Vue-Specific Security**: Comprehensive Vue.js security checks including filters, mixins, $refs, Composition API, dynamic components, router security, state management, custom directives, and slots
- **Advanced Web Security** (24 rules):
  - DOM Clobbering
  - SVG XSS
  - PostMessage XSS
  - Worker XSS
  - SSR Injection
  - Hydration Mismatch
  - JWT Algorithm Confusion
  - Session Fixation
  - Privilege Escalation
  - Insecure Password Storage
  - OAuth Flow Vulnerability
  - NoSQL Injection
  - GraphQL Injection
  - LDAP Injection
  - Command Injection
  - Path Traversal
  - Insecure File Upload
  - File Inclusion
  - WebSocket Security
  - Insecure HTTP Methods
  - Social Engineering
  - Malicious File Upload
  - WebAssembly Security
  - WebRTC Security
  - CSP Bypass
  - Phishing
  - Clickjacking
  - UI Redress
  - Tabnabbing
  - Cookie Bomb
  - CSRF Token Bypass
  - Session Hijacking
  - Host Header Injection
  - HTTP Parameter Pollution
  - HTTP Response Splitting
  - JSON Injection
  - HTML Injection
  - CSS Injection
  - XPath Injection
  - XXE
  - ReDoS
  - Rate Limiting
  - Brute Force Attack
  - Access Control
  - Business Logic Flaw
  - API Security
  - Insecure File Download
  - Mass Assignment
  - Insecure Deserialization

#### Custom Security Rules (20 rules)
- **API Key Detection**: Detects various API keys (AWS, Stripe, Firebase, GitHub, Slack, Twilio, SendGrid, Heroku)
- **Secret Detection**: Detects JWT secrets, encryption keys, private keys
- **Token Detection**: Detects OAuth tokens
- **Code Quality**: Detects console.log, TODO, FIXME comments
- **Internal Endpoints**: Detects hardcoded internal endpoints
- **Debug Mode**: Detects enabled debug mode

### Rule Engine Benefits
- **Modular Design**: Each security check runs independently, making the system robust and maintainable
- **Easy Extension**: Users can create custom rules by following the simple configuration format
- **Flexible Configuration**: Enable/disable specific rules based on your project's needs
- **Performance Optimized**: Regex caching and efficient pattern matching

## 🎯 Flexibility & Extensibility

Vue Security Scanner uses a highly modular rule-based architecture that enables users to:

- **Flexible Extension**: Add custom security detection rules by creating rule configuration files
- **Precise Control**: Control scanning behavior through multiple configuration methods
- **Personalized Customization**: Enable or disable specific detection items based on project needs
- **Intelligent Ignoring**: Use `.gitignore`-like mechanisms to ignore specific files, directories, or vulnerability types

### Rule System

Each security detection item is implemented as a rule configuration with the following characteristics:

- **Modular**: Each detection item is developed, tested, and maintained independently
- **Standardized**: Follows a unified rule configuration specification
- **Extensible**: Users can easily create their own detection rules
- **Comprehensive**: Includes advanced security checks for common vulnerabilities such as CSRF, HTTP header injection, insecure cookie configurations, and memory leaks

The rule engine also includes enhanced XSS detection and hardcoded secrets detection, providing comprehensive security coverage for enterprises.

### Configuration System

Supports multi-level configuration:

- **Command Line Arguments**: Temporarily override default settings
- **Configuration Files**: Project-level persistent configuration (`vue-security-scanner.config.json`)
- **Ignore Files**: Flexible ignore rule management (`.vue-security-ignore`)

### Ignore Rules

The system implements `.gitignore`-like functionality, allowing users to:

- **File/Directory Ignoring**: Ignore specific files or directories
- **Vulnerability Type Ignoring**: Ignore specific types of vulnerabilities
- **Rule Ignoring**: Disable specific rule detection results
- **Severity Ignoring**: Ignore vulnerabilities of certain severity levels

### Custom Rules Development

Users can easily create custom security detection rules. For detailed development guidelines, please refer to [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) and [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md).

Basic rule template:

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

Then import in `src/rules/security-rules.js`:

```javascript
const myCustomRules = require('./my-custom-rules');

const securityRules = [
  // ... existing rules
  ...myCustomRules
];
```

For more detailed information, please refer to [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) and [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md).

## 🛠️ Development

### Setting Up the Project
```bash
# Clone the repository
git clone <repository-url>
cd vue-security-scanner

# Install dependencies
npm install

# Run the scanner
node bin/vue-security-scanner.js [project-path]
```

### Creating Custom Rules
1. Create a new JavaScript file in the `src/rules/` directory
2. Define your rules as configuration objects
3. Export the rules array
4. Import and merge rules in `src/rules/security-rules.js`

Example rule file:
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

Then import in `src/rules/security-rules.js`:
```javascript
const myCustomRules = require('./my-custom-rules');

const securityRules = [
  // ... existing rules
  ...myCustomRules
];
```

For more details, see [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) and [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md).

## 📊 Output Formats

The scanner can output results in multiple formats:
- **JSON**: Detailed structured data for integration with other tools
- **Console**: Human-readable output for quick analysis
- **HTML**: Formatted reports for sharing with stakeholders
- **Compliance**: Format compliant with enterprise standards

## 🧪 Test Examples & Vulnerability Coverage

The Vue Security Scanner includes comprehensive test examples covering 1000+ vulnerability scenarios across 36 test files:

### Vue-Specific Security Examples (9 files, 510 examples)
- **vue-xss-vulnerabilities.js** (50 examples): XSS vulnerabilities in Vue templates, directives, and components
- **vue-composition-api.js** (50 examples): Security issues in Vue 3 Composition API (ref, reactive, computed, watch, provide/inject)
- **vue-directive-security.js** (50 examples): Security vulnerabilities in Vue directives (v-html, v-text, v-bind, v-on, v-model, etc.)
- **vue-router-security.js** (50 examples): Router security issues including parameter injection, open redirects, and guard bypass
- **vue-lifecycle-security.js** (50 examples): Memory leaks and security issues in Vue lifecycle hooks
- **vue-reactive-security.js** (60 examples): Security vulnerabilities in Vue reactive system
- **vue-component-security.js** (50 examples): Component security issues including dynamic components, slots, and provide/inject
- **vue-configuration-security.js** (100 examples): Vue configuration security issues in Vue 2/3
- **vue-dependency-vulnerabilities.js** (100 examples): Known vulnerabilities in Vue ecosystem dependencies

### General Security Examples (20 files, 490 examples)
- **api-security.js** (30 examples): API security vulnerabilities
- **authentication-authorization.js** (40 examples): Authentication and authorization issues
- **session-management.js** (40 examples): Session management vulnerabilities
- **data-encryption.js** (50 examples): Data encryption security issues
- **logging-security.js** (50 examples): Logging security vulnerabilities
- **error-handling.js** (50 examples): Error handling security issues
- **file-operations.js** (40 examples): File operation security vulnerabilities
- **network-requests.js** (50 examples): Network request security issues
- **jwt-security.js** (40 examples): JWT security vulnerabilities
- **permission-management.js** (50 examples): Permission management security issues
- **csrf-vulnerabilities.js** (10 examples): CSRF attack scenarios
- **http-header-injection.js** (15 examples): HTTP header injection vulnerabilities
- **cookie-security.js** (20 examples): Cookie security configuration issues
- **memory-leaks.js** (20 examples): Memory leak patterns
- **dependency-vulnerabilities.js** (20 examples): Dependency vulnerability examples
- **input-validation.js** (20 examples): Input validation vulnerabilities
- **sensitive-data-exposure.js** (25 examples): Sensitive data exposure scenarios
- **weak-random-number.js** (25 examples): Weak random number generation
- **dynamic-import-security.js** (15 examples): Dynamic import security issues
- **prototype-pollution.js** (15 examples): Prototype pollution vulnerabilities

### Original Test Files (7 files, 123 examples)
- **vue23-security-issues.vue**: Vue 2/3 specific security issues
- **vulnerable-component.vue**: Vulnerable Vue component examples
- **additional-vue-security-issues.vue**: Additional Vue security issues
- **typescript-security-issues.ts**: TypeScript security vulnerabilities
- **advanced-vulnerabilities.js**: Advanced security vulnerability patterns
- **basic-vulnerabilities.js**: Basic security vulnerability examples
- **xss-vulnerabilities.js**: XSS vulnerability examples

### Total Coverage
- **Test Files**: 36 files
- **Vulnerability Examples**: 1000+ examples
- **Vue-Specific Coverage**: 95%+
- **General Security Coverage**: 90%+

## 🛡️ Security Coverage

The tool addresses the OWASP Top 10 and other security standards:
- Injection flaws
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Security Misconfigurations
- Vulnerable Components
- Insufficient Logging & Monitoring

## Vue-Specific Feature Verification

Our scanner provides comprehensive verification of Vue.js-specific features:

### Vue 2/3 Component System
- **Component Definition Security**: Validates component options for security issues
- **Props Validation**: Checks props definitions and usage for security
- **Event System Security**: Verifies event emission and listening security
- **Lifecycle Hooks Security**: Inspects security issues in lifecycle hooks

### Vue Template System
- **Directive Security**: Validates safe usage of Vue directives
  - `v-html` - Checks for potential XSS issues
  - `v-text` - Validates text binding security
  - `v-bind` - Ensures attribute binding security
  - `v-for` - Verifies loop source security
  - Custom directives - Reviews implementation for security

### Vue Reactive System
- **Data Binding Security**: Inspects two-way binding (v-model) security
- **Computed Properties Security**: Validates computed property dependencies and outputs
- **Watchers Security**: Checks watcher implementations for security

### Vue 2 Features
- **Options API Security**: Inspects data, methods, computed, watch options for security
- **Filters Security**: Validates filter implementations
- **Mixins Security**: Checks mixin usage for security issues
- **Plugin System Security**: Validates Vue.use() and plugin security

### Vue 3 Features
- **Composition API Security**:
  - `ref()` - Validates reactive reference usage
  - `reactive()` - Ensures reactive object security
  - `computed()` - Checks computed property security
  - `watch()` and `watchEffect()` - Inspects watcher security
  - `provide/inject` - Verifies dependency injection security
- **Teleport Security**: Validates Teleport target element security
- **Suspense Security**: Checks async component handling security

### Vue Router Security
- **Route Definition Security**: Inspects route configuration security
- **Route Parameters Security**: Validates route parameter usage
- **Route Guards Security**: Checks beforeEach, beforeResolve, afterEach implementations
- **Dynamic Routes Security**: Detects dynamic route addition security

### State Management Security
- **Vuex Security**: Validates store, mutations, actions, getters security
- **Pinia Security**: Verifies stores definition and usage security
- **Dynamic Modules Security**: Checks dynamic module registration security

### Additional Vue-Specific Security Checks
- **Prototype Pollution Protection**: Detects unsafe `__proto__` and `constructor.prototype` usage
- **XSS Protection**: Specialized vectors targeting Vue's XSS prevention mechanisms
- **Dynamic Components Security**: Validates `:is` attribute and dynamic component loading
- **Slots Security**: Inspects slot and scoped slot usage security
- **TypeScript Integration**: Validates type definitions and assertions for security

## 🆕 New Features (v1.2.1+)

### 1. Advanced Semantic Analysis
The scanner now includes AST-based code analysis that significantly improves detection accuracy:

**Key Benefits:**
- **Reduced False Positives**: Understands code context rather than just pattern matching
- **User Input Tracking**: Identifies when dangerous functions receive user input
- **Confidence Scoring**: Provides High/Medium/Low confidence levels for each finding
- **Smart Merging**: Intelligently combines regex and AST analysis results

**Supported Features:**
- Dangerous function call detection (eval, Function, setTimeout, etc.)
- Unsafe property access detection (innerHTML, __proto__, etc.)
- JSX element security analysis
- Assignment expression security checks
- Variable declaration sensitive data detection
- Object property security analysis

**Usage:**
```json
{
  "performance": {
    "enableSemanticAnalysis": true
  }
}
```

### 2. Enhanced Dependency Security
Comprehensive dependency vulnerability scanning with multiple data sources:

**Features:**
- **npm Audit Integration**: Real-time vulnerability detection using npm's official audit
- **Built-in Vulnerability Database**: 10+ common packages with known vulnerabilities
- **Outdated Dependency Detection**: Identifies packages that need updates
- **License Compliance**: Checks for problematic licenses (GPL, AGPL, etc.)
- **Vulnerability Caching**: 1-hour TTL for performance optimization

**Supported Packages:**
- lodash, axios, node-fetch, moment, ejs, handlebars
- webpack, jquery, express, vuex, and more

**Usage:**
```json
{
  "performance": {
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  }
}
```

### 3. Advanced Reporting
Enterprise-grade reporting with comprehensive analysis:

**Features:**
- **Trend Analysis**: Historical data comparison and vulnerability trends
- **Compliance Reports**: OWASP, GDPR, HIPAA, PCI-DSS, SOX compliance
- **Vulnerability Distribution**: Analysis by type, severity, and file
- **CWE Mapping**: Common Weakness Enumeration references
- **OWASP Top 10 Mapping**: OWASP 2021 categorization
- **Fix Complexity Assessment**: Low/Medium/High complexity ratings
- **Priority Recommendations**: Actionable recommendations based on severity

**HTML Reports:**
- Interactive dashboards with visual indicators
- Color-coded severity levels
- Compliance status cards
- Trend indicators (increasing/decreasing/stable)
- Responsive design for all devices

**Usage:**
```bash
vue-security-scanner . --advanced-report --output html --report security-report.html
```

**Configuration:**
```json
{
  "output": {
    "advancedReport": true,
    "reportPath": "security-report.html"
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  }
}
```

### 4. CI/CD Integration
Seamless integration with major CI/CD platforms:

**Supported Platforms:**
- **GitHub Actions**: Workflows with PR comments and scheduled scans
- **GitLab CI/CD**: Multi-stage pipelines with MR checks
- **Jenkins**: Declarative pipelines with HTML report publishing
- **Azure DevOps**: YAML-based pipelines with artifact publishing
- **Bitbucket Pipelines**: Container-based security scanning
- **CircleCI**: Multi-version Node.js testing
- **Travis CI**: Automated security checks

**Features:**
- Automated security gates
- Build blocking on critical vulnerabilities
- PR/MR comments with scan results
- Scheduled daily scans
- Artifact upload and retention
- Multi-version testing

**Quick Start:**
```yaml
# GitHub Actions
- name: Run security scan
  run: |
    vue-security-scanner . \
      --output json \
      --report security-report.json \
      --level detailed \
      --advanced-report
```

For detailed integration guides, see [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md).

## 🤝 Contributing

We welcome contributions! Please see our contributing guide for details on how to:
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