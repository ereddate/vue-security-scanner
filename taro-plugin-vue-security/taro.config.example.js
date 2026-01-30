# Taro Plugin Vue Security Example Configuration

This is an example of how to configure the Taro Plugin Vue Security in your Taro project.

## Basic Configuration

```javascript
// config/index.js
const config = {
  // ... other Taro config
  plugins: [
    // ... other plugins
    'taro-plugin-vue-security'
  ]
};

module.exports = config;
```

## Advanced Configuration

```javascript
// config/index.js
const config = {
  // ... other Taro config
  plugins: [
    // ... other plugins
    ['taro-plugin-vue-security', {
      // Basic options
      enabled: true,
      failOnError: false, // Whether to fail the build on security issues
      reportLevel: 'warning', // 'error', 'warning', or 'info'
      outputFile: './security-report.json', // Optional output file for security report
      exclude: [], // Patterns to exclude from scanning
      
      // Advanced features
      enableSemanticAnalysis: true, // Enable AST-based semantic analysis
      enableDependencyScanning: true, // Enable dependency vulnerability scanning
      enableAdvancedReport: false, // Enable advanced reporting with trends and compliance
      reportHistoryPath: '.taro-security-reports', // Path for report history
      complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'], // Compliance standards to check
      
      // Taro-specific options
      enableTaroSpecificRules: true, // Enable Taro-specific security rules
      taroApiSecurity: true, // Enable Taro API security checks
      taroNavigationSecurity: true, // Enable Taro navigation security checks
      taroFormSecurity: true, // Enable Taro form security checks
      taroConfigSecurity: true // Enable Taro config security checks
    }]
  ]
};

module.exports = config;
```

## Environment-Specific Configuration

### Development Configuration

```javascript
// config/dev.js
module.exports = {
  // ... other dev config
  plugins: [
    ['taro-plugin-vue-security', {
      enabled: true,
      failOnError: false,
      reportLevel: 'info',
      enableAdvancedReport: false
    }]
  ]
};
```

### Production Configuration

```javascript
// config/prod.js
module.exports = {
  // ... other prod config
  plugins: [
    ['taro-plugin-vue-security', {
      enabled: true,
      failOnError: true,
      reportLevel: 'error',
      outputFile: './security-report.prod.json',
      enableAdvancedReport: true
    }]
  ]
};
```

## CI/CD Configuration

For CI/CD environments, you might want to configure the plugin to fail the build on security issues:

```javascript
// config/ci.js
module.exports = {
  // ... other ci config
  plugins: [
    ['taro-plugin-vue-security', {
      enabled: true,
      failOnError: true,
      reportLevel: 'error',
      outputFile: './security-report.ci.json',
      enableAdvancedReport: true,
      complianceStandards: ['OWASP', 'PCI-DSS']
    }]
  ]
};
```

## Usage with Different Taro Frameworks

### React

```javascript
// config/index.js
const config = {
  framework: 'react',
  // ... other config
  plugins: [
    'taro-plugin-vue-security'
  ]
};
```

### Vue

```javascript
// config/index.js
const config = {
  framework: 'vue',
  // ... other config
  plugins: [
    'taro-plugin-vue-security'
  ]
};
```

### Preact

```javascript
// config/index.js
const config = {
  framework: 'preact',
  // ... other config
  plugins: [
    'taro-plugin-vue-security'
  ]
};
```

## Ignoring Specific Files or Patterns

To exclude specific files or patterns from security scanning, use the `exclude` option:

```javascript
// config/index.js
const config = {
  // ... other config
  plugins: [
    ['taro-plugin-vue-security', {
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        '**/*.test.*',
        '**/*.spec.*'
      ]
    }]
  ]
};
```

## Disabling Specific Rules

To disable specific security rules, configure the `rules` option:

```javascript
// config/index.js
const config = {
  // ... other config
  plugins: [
    ['taro-plugin-vue-security', {
      rules: {
        'taro-api-security': true,
        'taro-navigation-security': true,
        'taro-form-security': false, // Disable form security checks
        'taro-config-security': true
      }
    }]
  ]
};
```

## Conclusion

The Taro Plugin Vue Security provides flexible configuration options to suit your project's needs. Adjust the settings based on your development workflow, security requirements, and project size.