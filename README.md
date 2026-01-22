# Vue Security Scanner

A comprehensive, modular security scanning tool for Vue.js projects that identifies potential vulnerabilities and security issues.

## 🚀 Features

- **XSS Detection**: Identifies potential cross-site scripting vulnerabilities
  - Checks for unsafe usage of `v-html`
  - Detects inline event handlers
  - Finds potential template injection points
  - Identifies unsafe route parameter usage
  
- **Dependency Security**: Analyzes dependencies for known vulnerabilities
  - Checks for outdated or compromised packages
  - Identifies deprecated dependencies
  - Flags packages with security advisories
  - Reviews Vue-specific configurations in package.json
  
- **Configuration Security**: Reviews configuration files for security misconfigurations
  - Detects hardcoded secrets
  - Finds insecure CORS policies
  - Identifies Vue-specific misconfigurations
  
- **Input Validation**: Checks for proper input validation
  - Identifies missing validation on form inputs (v-model)
  - Flags potential open redirect vulnerabilities
  
- **Code Quality Security**: Reviews code for security issues
  - Detects dangerous eval usage
  - Finds potential prototype pollution
  - Identifies unsafe dynamic imports

- **VSCode Integration**: Full integration with VSCode for real-time security feedback

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

Available commands:
- `Vue Security: Scan Current Project`
- `Vue Security: Scan Current File`
- `Vue Security: Show Security Report`
- `Vue Security: Configure Settings`

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

## 🔒 Security Coverage

The tool addresses the OWASP Top 10 and other security standards:
- Injection flaws
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Security Misconfigurations
- Vulnerable Components
- Insufficient Logging & Monitoring

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