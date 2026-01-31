# Vite Plugin Vue Security

A Vite plugin that performs security scans on Vue.js projects during the build process. This plugin integrates the Vue Security Scanner directly into your Vite build pipeline, allowing you to detect security vulnerabilities in real-time during development and build.

## Vue 3.6 Support

This plugin fully supports Vue 3.6, including the experimental Vapor Mode and other new features. It can detect security issues specific to Vue 3.6's enhanced reactivity system and optimized rendering pipeline.

## Installation

```bash
npm install vite-plugin-vue-security --save-dev
```

## Usage

### Basic Usage

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSecurityPlugin from 'vite-plugin-vue-security';

export default defineConfig({
  plugins: [
    vueSecurityPlugin(), // Add security scanning
    vue() // Vue plugin
  ]
});
```

### Advanced Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSecurityPlugin from 'vite-plugin-vue-security';

export default defineConfig({
  plugins: [
    vueSecurityPlugin({
      enabled: true,           // Enable/disable security scanning (default: true)
      failOnError: false,      // Fail build on security issues (default: false)
      reportLevel: 'warning',  // 'error', 'warning', or 'info' (default: 'warning')
      outputFile: './security-report.json', // Optional output file for security report
      exclude: [              // Patterns to exclude from scanning
        'node_modules',
        'dist',
        'public'
      ]
    }),
    vue()
  ]
});
```

## Configuration Options

- `enabled`: Boolean to enable/disable the security scanning (default: true)
- `failOnError`: Boolean to make the build fail when high severity vulnerabilities are detected (default: false)
- `reportLevel`: Sets the level of reporting ('error', 'warning', or 'info'; default: 'warning')
- `outputFile`: Optional path to write a JSON security report (default: null)
- `exclude`: Array of patterns to exclude from scanning (default: [])

### Advanced Configuration Options

- `enableSemanticAnalysis`: Boolean to enable AST-based semantic analysis (default: true)
- `enableDependencyScanning`: Boolean to enable dependency vulnerability scanning (default: true)
- `enableAdvancedReport`: Boolean to enable advanced reporting with trends and compliance (default: false)
- `reportHistoryPath`: Path for report history (default: '.vue-security-reports')
- `complianceStandards`: Array of compliance standards to check (default: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'])

### Performance Configuration

- `performanceProfile`: Performance profile to use ('fast', 'balanced', 'thorough'; default: 'balanced')
- `enableParallelScanning`: Boolean to enable parallel rule matching (default: true)
- `enableIncrementalScanning`: Boolean to enable incremental scanning (default: true)
- `memoryLimit`: Memory usage limit in MB (default: 512)

### Trae CN Integration

- `enableTraeCN`: Boolean to enable Trae CN integration (default: false)
- `traeCNApiKey`: Trae CN API key
- `traeCNProjectId`: Trae CN project ID
- `traeCNAutoReport`: Boolean to auto-report vulnerabilities to Trae CN (default: true)
- `traeCNRealtimePush`: Boolean to push scan results in realtime (default: false)

## Features

- **Real-time Security Scanning**: Scans Vue, JS, and TS files during the build process
- **Vue 3.6 Support**: Fully supports Vue 3.6 including experimental Vapor Mode
- **Multiple Vulnerability Types**: Detects XSS, dependency issues, misconfigurations, hardcoded secrets, and more
- **Enterprise Plugin Support**: Compatible with the Vue Security Scanner plugin system
- **Flexible Reporting**: Configurable reporting levels and output formats
- **Build Integration**: Option to fail builds on security issues
- **Performance Optimizations**: Leverages the latest performance improvements from Vue Security Scanner 1.6.0
  - Parallel rule matching using worker threads
  - Incremental scanning with file change detection
  - Rule classification and pre-filtering for faster scanning
  - Memory usage optimization and automatic garbage collection
- **Advanced Configuration**: Support for performance profiles (fast, balanced, thorough)

## Detected Vulnerabilities

The plugin can detect various security issues including:

- Cross-Site Scripting (XSS) vulnerabilities
- Insecure dependencies
- Hardcoded secrets and credentials
- Misconfigurations
- Potential code injection issues
- DOM-based XSS patterns
- Missing security headers
- Sensitive data exposure in URLs
- Weak random number generation

## License

MIT