# Vue Security Scanner

A comprehensive, modular security scanning tool for Vue.js projects that identifies potential vulnerabilities and security issues.

## 🚀 Features

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
  
- **VSCode Integration**: Full integration with VSCode for real-time security feedback
- **Vite Plugin**: Integration with Vite build process for compile-time security scanning
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
- `vueSecurityScanner.scanOnSave`: Scan file when saving Vue files (default: true)
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

Create a `vue-security-config.json` file to customize scanning behavior:

```json
{
  "rules": {
    "xss": { "enabled": true },
    "dependencies": { "enabled": true },
    "configSecurity": { "enabled": true }
  },
  "scan": {
    "maxSize": 10,
    "ignorePatterns": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ]
  },
  "output": {
    "showProgress": true,
    "format": "json",
    "reportPath": "./security-report.json"
  },
  "plugins": {
    "enabled": true,
    "directory": "./plugins",
    "settings": {
      "sql-injection-plugin": {
        "enabled": true,
        "severityThreshold": "High"
      }
    }
  }
}
```

## 🏢 Enterprise Features

### Plugin System
The tool includes a powerful plugin system that allows enterprises to:

- **Extend Security Checks**: Create custom security rules specific to your organization
- **Compliance Requirements**: Implement checks for regulatory compliance (SOX, GDPR, HIPAA)
- **Custom Threat Models**: Define organization-specific threat patterns
- **Integration Capabilities**: Connect with existing security infrastructure

### Enterprise Configuration Options
- Advanced threat detection models
- Compliance reporting formats
- Custom severity thresholds
- Integration with SIEM systems
- Automated alerting capabilities

### Available Enterprise Plugins
- **SQL Injection Detection Plugin**: Scans for potential SQL injection vulnerabilities
- **Sensitive Data Leakage Plugin**: Identifies hardcoded credentials and sensitive information
- **Third-Party Library Security Plugin**: Checks dependencies for known vulnerabilities
- **Custom Enterprise Rules Template**: Base template for developing organization-specific rules

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

### Creating Custom Plugins
1. Create a new JavaScript file in the `plugins/` directory
2. Implement the required interface with an `analyze(filePath, content)` method
3. Export the plugin object
4. The plugin will be automatically loaded when placed in the plugins directory

Example plugin:
```javascript
class CustomSecurityPlugin {
  constructor() {
    this.name = 'Custom Security Plugin';
    this.description = 'Custom security checks for specific requirements';
    this.version = '1.0.0';
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // Implement your security checks here
    if (content.includes('dangerous-pattern')) {
      vulnerabilities.push({
        id: 'custom-issue-1',
        type: 'Custom Security Issue',
        severity: 'High',
        file: filePath,
        line: 1, // Calculate actual line number
        description: 'Description of the issue',
        codeSnippet: 'The problematic code',
        recommendation: 'How to fix it',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

module.exports = new CustomSecurityPlugin();
```

## 📊 Output Formats

The scanner can output results in multiple formats:
- **JSON**: Detailed structured data for integration with other tools
- **Console**: Human-readable output for quick analysis
- **HTML**: Formatted reports for sharing with stakeholders
- **Compliance**: Format compliant with enterprise standards

## 馃敀 Security Coverage

The tool addresses the OWASP Top 10 and other security standards:
- Injection flaws
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Security Misconfigurations
- Vulnerable Components
- Insufficient Logging & Monitoring

## 馃挋 Vue-Specific Feature Verification

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