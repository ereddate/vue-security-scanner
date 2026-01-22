# Webpack Plugin for Vue Security Scanner

A Webpack plugin that performs security scans on Vue.js projects during the build process.

## Installation

```bash
npm install --save-dev webpack-plugin-vue-security
```

## Usage

### Webpack Configuration

```javascript
const VueSecurityWebpackPlugin = require('webpack-plugin-vue-security');

module.exports = {
  // ...
  plugins: [
    new VueSecurityWebpackPlugin({
      // Options
      enabled: true,                    // Enable/disable the plugin
      failOnError: false,               // Fail the build on security issues
      reportLevel: 'warning',          // 'error', 'warning', or 'info'
      outputFile: 'security-report.json', // Optional output file
      
      // Advanced options
      rules: {},                        // Custom security rules
      ignoreDirs: ['node_modules'],     // Directories to ignore
      ignorePatterns: ['*.min.js'],     // File patterns to ignore
      maxSize: 10,                     // Max file size in MB
      maxDepth: 10,                    // Max directory depth to scan
      pluginsDir: './custom-plugins',   // Custom plugins directory
      pluginSettings: {}                // Plugin-specific settings
    })
  ]
  // ...
};
```

## Options

- `enabled`: Enable or disable the security scanning (default: true)
- `failOnError`: Whether to fail the build on security issues (default: false)
- `reportLevel`: Reporting level ('error', 'warning', or 'info') (default: 'warning')
- `outputFile`: Optional output file for security report
- `rules`: Custom security rules configuration
- `ignoreDirs`: Directories to ignore during scanning
- `ignorePatterns`: File patterns to ignore during scanning
- `maxSize`: Maximum file size in MB to scan (default: 10)
- `maxDepth`: Maximum directory depth to scan (default: 10)
- `pluginsDir`: Directory containing custom security plugins (default: built-in plugins)
- `pluginSettings`: Settings passed to security plugins

## Features

- **Real-time Security Scanning**: Scans Vue components and JavaScript files during the Webpack build process
- **Comprehensive Detection**: Identifies XSS, SQL injection, hardcoded secrets, and other security vulnerabilities
- **Flexible Configuration**: Highly configurable with options for custom rules and ignore patterns
- **Plugin System**: Supports custom security plugins for specialized checks
- **Intelligent Filtering**: Uses ignore rules similar to .gitignore to skip unnecessary files
- **Detailed Reporting**: Provides detailed information about detected vulnerabilities
- **Build Integration**: Seamlessly integrates with Webpack build process

## License

MIT