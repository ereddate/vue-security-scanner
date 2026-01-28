# Nuxt.js Module for Vue Security Scanner

A Nuxt.js module that provides security scanning for Nuxt.js applications during development and build process.

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

- **Nuxt-aware Scanning**: Understands Nuxt.js specific structures (pages, layouts, middleware, plugins)
- **SSR Security**: Scans server-side rendered components for security issues
- **Route Protection**: Checks routing configurations for security vulnerabilities
- **Module Integration**: Seamlessly integrates with Nuxt.js module system
- **Static Generation**: Scans statically generated pages during `nuxt generate`
- **Comprehensive Detection**: Identifies XSS, SQL injection, hardcoded secrets, and other security vulnerabilities
- **Plugin System**: Supports custom security plugins for specialized checks
- **Intelligent Filtering**: Uses ignore rules similar to .gitignore to skip unnecessary files
- **Detailed Reporting**: Provides detailed information about detected vulnerabilities

## License

MIT