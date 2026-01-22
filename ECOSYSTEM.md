# Vue Security Scanner Ecosystem

Comprehensive security scanning solution for Vue.js projects with multiple environment integrations.

## Overview

Vue Security Scanner provides a complete ecosystem of tools to secure Vue.js applications across different development and deployment environments. The ecosystem includes:

- **Core Scanner**: Main security scanning engine
- **Vite Plugin**: Integration with Vite build system
- **Webpack Plugin**: Integration with Webpack build system
- **Nuxt.js Module**: Specialized module for Nuxt.js applications
- **VSCode Extension**: Real-time security feedback in editor
- **Docker Integration**: Containerized scanning environment
- **Jenkins Plugin**: CI/CD integration for Jenkins

## Environment Integrations

### 1. Webpack Plugin
A Webpack plugin that performs security scans during the build process.

**Features:**
- Real-time security scanning during Webpack builds
- Comprehensive vulnerability detection
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
      reportLevel: 'warning'
    })
  ]
};
```

### 2. Nuxt.js Module
A specialized module for Nuxt.js applications that understands Nuxt-specific structures.

**Features:**
- Nuxt-aware scanning for pages, layouts, middleware
- SSR security checks
- Static generation scanning
- Module system integration

**Installation:**
```bash
npm install --save-dev @vue-security/nuxt
```

**Usage:**
```javascript
// nuxt.config.js
export default {
  modules: [
    '@vue-security/nuxt'
  ],
  vueSecurity: {
    enabled: true,
    reportLevel: 'warning'
  }
}
```

### 3. Docker Integration
Containerized scanning environment for consistent security checks.

**Features:**
- Isolated scanning environment
- Consistent results across platforms
- Easy CI/CD integration
- Multiple scanning modes

**Usage:**
```bash
# Build and run scanner
docker build -t vue-security-scanner .
docker run -v $(pwd):/workspace/project vue-security-scanner /workspace/project --level detailed
```

### 4. Jenkins Plugin
Deep integration with Jenkins CI/CD platform.

**Features:**
- Pipeline and freestyle job support
- Build failure control based on security findings
- Detailed reporting
- Plugin system compatibility

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