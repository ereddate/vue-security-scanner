# uni-app Plugin Vue Security Example Configuration

This is an example of how to configure the uni-app Plugin Vue Security in your uni-app project.

## Basic Configuration

```javascript
// vue.config.js
module.exports = {
  // ... other uni-app config
  uni: {
    plugins: [
      // ... other plugins
      'uni-plugin-vue-security'
    ]
  }
};
```

## Advanced Configuration

```javascript
// vue.config.js
module.exports = {
  // ... other uni-app config
  uni: {
    plugins: [
      // ... other plugins
      ['uni-plugin-vue-security', {
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
        reportHistoryPath: '.uni-security-reports', // Path for report history
        complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'], // Compliance standards to check
        
        // uni-app-specific options
        enableUniAppSpecificRules: true, // Enable uni-app-specific security rules
        uniApiSecurity: true, // Enable uni-app API security checks
        uniNavigationSecurity: true, // Enable uni-app navigation security checks
        uniStorageSecurity: true, // Enable uni-app storage security checks
        uniConfigSecurity: true // Enable uni-app config security checks
      }]
    ]
  }
};
```

## Environment-Specific Configuration

### Development Configuration

```javascript
// vue.config.js
module.exports = {
  // ... other config
  configureWebpack: process.env.NODE_ENV === 'development' ? {
    // Development specific webpack config
  } : {
    // Production specific webpack config
  },
  uni: {
    plugins: [
      ['uni-plugin-vue-security', {
        enabled: true,
        failOnError: false,
        reportLevel: 'info',
        enableAdvancedReport: false
      }]
    ]
  }
};
```

## Usage with Different uni-app Platforms

### WeChat Mini Program

```javascript
// vue.config.js
module.exports = {
  // ... other config
  uni: {
    plugins: [
      ['uni-plugin-vue-security', {
        // ... config
      }]
    ]
  }
};
```

### App Platform

```javascript
// vue.config.js
module.exports = {
  // ... other config
  uni: {
    plugins: [
      ['uni-plugin-vue-security', {
        // ... config
      }]
    ]
  }
};
```

## Ignoring Specific Files or Patterns

To exclude specific files or patterns from security scanning, use the `exclude` option:

```javascript
// vue.config.js
module.exports = {
  // ... other config
  uni: {
    plugins: [
      ['uni-plugin-vue-security', {
        exclude: [
          'node_modules/**',
          'dist/**',
          'build/**',
          '**/*.test.*',
          '**/*.spec.*'
        ]
      }]
    ]
  }
};
```

## Disabling Specific Rules

To disable specific security rules, configure the `rules` option:

```javascript
// vue.config.js
module.exports = {
  // ... other config
  uni: {
    plugins: [
      ['uni-plugin-vue-security', {
        rules: {
          'uni-app-api': true,
          'uni-app-navigation': true,
          'uni-app-storage': false, // Disable storage security checks
          'uni-app-config': true
        }
      }]
    ]
  }
};
```

## Conclusion

The uni-app Plugin Vue Security provides flexible configuration options to suit your project's needs. Adjust the settings based on your development workflow, security requirements, and project size.