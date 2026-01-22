# Vite Plugin Vue Security

A Vite plugin that performs security scans on Vue.js projects during the build process. This plugin integrates the Vue Security Scanner directly into your Vite build pipeline, allowing you to detect security vulnerabilities in real-time during development and build.

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

## Features

- **Real-time Security Scanning**: Scans Vue, JS, and TS files during the build process
- **Multiple Vulnerability Types**: Detects XSS, dependency issues, misconfigurations, hardcoded secrets, and more
- **Enterprise Plugin Support**: Compatible with the Vue Security Scanner plugin system
- **Flexible Reporting**: Configurable reporting levels and output formats
- **Build Integration**: Option to fail builds on security issues

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