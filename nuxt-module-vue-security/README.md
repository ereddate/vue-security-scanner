# Nuxt.js Module for Vue Security Scanner

A Nuxt.js module that provides security scanning for Nuxt.js applications during development and build process.

## Vue 3.7+ Support

This module fully supports Vue 3.7, including experimental features, advanced Composition API, Vapor mode, reactive optimization, and other new features. It can detect security issues specific to Vue 3.7's enhanced reactivity system and optimized rendering pipeline.

## Installation

```bash
npm install --save-dev nuxt-module-vue-security
```

## Usage

### Nuxt 2 Configuration

Add the module to your `nuxt.config.js`:

```javascript
export default {
  modules: [
    // Simple usage
    'nuxt-module-vue-security'
  ],
  
  // Or with options
  vueSecurity: {
    enabled: true,
    failOnError: false,
    reportLevel: 'warning',
    outputFile: 'security-report.json',
    
    // Advanced options
    rules: {},
    ignoreDirs: ['node_modules'],
    ignorePatterns: ['*.min.js'],
    maxSize: 10,
    maxDepth: 10,
    pluginsDir: './custom-plugins',
    pluginSettings: {}
  }
}
```

### Nuxt 3 Configuration

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    // Simple usage
    'nuxt-module-vue-security'
  ],
  
  // Or with options
  vueSecurity: {
    enabled: true,
    failOnError: false,
    reportLevel: 'warning',
    outputFile: 'security-report.json',
    
    // Advanced options
    rules: {},
    ignoreDirs: ['node_modules'],
    ignorePatterns: ['*.min.js'],
    maxSize: 10,
    maxDepth: 10,
    pluginsDir: './custom-plugins',
    pluginSettings: {}
  }
})
```

## Options

### Basic Options

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

### Advanced Configuration Options

- `enableSemanticAnalysis`: Boolean to enable AST-based semantic analysis (default: true)
- `enableDependencyScanning`: Boolean to enable dependency vulnerability scanning (default: true)
- `enableAdvancedReport`: Boolean to enable advanced reporting with trends and compliance (default: false)
- `reportHistoryPath`: Path for report history (default: '.vue-security-reports')
- `complianceStandards`: Array of compliance standards to check (default: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law'])

### Performance Configuration

- `performanceProfile`: Performance profile to use ('fast', 'balanced', 'thorough'; default: 'balanced')
- `enableParallelScanning`: Boolean to enable parallel rule matching (default: true)
- `enableIncrementalScanning`: Boolean to enable incremental scanning (default: true)
- `memoryLimit`: Memory usage limit in MB (default: 512)
- `enableGPUAcceleration`: Boolean to enable GPU-accelerated regex matching (default: true)
- `enableCaching`: Boolean to enable caching system for improved performance (default: true)

### Vue 3.6 Support

- `enableVue36Features`: Boolean to enable Vue 3.6 specific feature detection (default: true)
- `enableVaporModeScanning`: Boolean to enable scanning for Vapor Mode specific issues (default: true)

### Vue 3.7+ Support

- `enableVue37Features`: Boolean to enable Vue 3.7+ specific feature detection (default: true)
- `enableExperimentalFeaturesScanning`: Boolean to enable scanning for experimental features (default: true)
- `enableAdvancedCompositionAPIScanning`: Boolean to enable scanning for advanced Composition API (default: true)
- `enableReactiveOptimizationScanning`: Boolean to enable scanning for reactive optimization issues (default: true)

### Cross-Framework Support

- `supportedFrameworks`: Array of supported frameworks (default: ['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram'])

### Trae CN Integration

- `enableTraeCN`: Boolean to enable Trae CN integration (default: false)
- `traeCNApiKey`: Trae CN API key
- `traeCNProjectId`: Trae CN project ID
- `traeCNAutoReport`: Boolean to auto-report vulnerabilities to Trae CN (default: true)
- `traeCNRealtimePush`: Boolean to push scan results in realtime (default: false)

## Features

- **Nuxt-aware Scanning**: Understands Nuxt.js specific structures (pages, layouts, middleware, plugins)
- **SSR Security**: Scans server-side rendered components for security issues
- **Vue 3.7+ Support**: Fully supports Vue 3.7 including experimental features, advanced Composition API, Vapor mode, and reactive optimization
- **Route Protection**: Checks routing configurations for security vulnerabilities
- **Module Integration**: Seamlessly integrates with Nuxt.js module system
- **Static Generation**: Scans statically generated pages during `nuxt generate`
- **Comprehensive Detection**: Identifies XSS, SQL injection, hardcoded secrets, and other security vulnerabilities
- **Plugin System**: Supports custom security plugins for specialized checks
- **Intelligent Filtering**: Uses ignore rules similar to .gitignore to skip unnecessary files
- **Detailed Reporting**: Provides detailed information about detected vulnerabilities
- **Performance Optimizations**: Leverages the latest performance improvements from Vue Security Scanner 1.7.2
  - Parallel rule matching using worker threads
  - Incremental scanning with file change detection
  - Rule classification and pre-filtering for faster scanning
  - Memory usage optimization and automatic garbage collection
  - GPU-accelerated regex matching
  - Comprehensive caching system
- **Advanced Configuration**: Support for performance profiles (fast, balanced, thorough)
- **Cross-Framework Support**: Supports Vue, uni-app, Taro, and various mini-program frameworks
- **Comprehensive Compliance**: Supports international and China-specific compliance standards

## Detected Vulnerabilities

The module can detect various security issues including:

- Cross-Site Scripting (XSS) vulnerabilities
- Insecure dependencies
- Hardcoded secrets and credentials
- Misconfigurations
- Potential code injection issues
- DOM-based XSS patterns
- Missing security headers
- Sensitive data exposure in URLs
- Weak random number generation
- Vue 3.7+ specific security issues
- Experimental features security issues
- Advanced Composition API security issues
- Reactive optimization security issues

## License

MIT