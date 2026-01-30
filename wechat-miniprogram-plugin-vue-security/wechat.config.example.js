# WeChat Mini Program Plugin Vue Security Example Configuration

This is an example of how to configure the WeChat Mini Program Plugin Vue Security in your WeChat Mini Program project.

## Basic Configuration

```javascript
// security.config.js
module.exports = {
  enabled: true,
  failOnError: false,
  reportLevel: 'warning',
  outputFile: './security-report.json'
};
```

## Advanced Configuration

```javascript
// security.config.js
module.exports = {
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
  reportHistoryPath: '.wechat-security-reports', // Path for report history
  complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'], // Compliance standards to check
  
  // WeChat Mini Program-specific options
  enableWeChatSpecificRules: true, // Enable WeChat-specific security rules
  wechatApiSecurity: true, // Enable WeChat API security checks
  wechatNavigationSecurity: true, // Enable WeChat navigation security checks
  wechatStorageSecurity: true, // Enable WeChat storage security checks
  wechatTemplateSecurity: true, // Enable WeChat template security checks
  wechatConfigSecurity: true // Enable WeChat config security checks
};
```

## Usage with package.json Scripts

```json
{
  "scripts": {
    "security:scan": "npx wechat-miniprogram-security-scan",
    "security:report": "npx wechat-miniprogram-security-scan --output-file security-report.json",
    "security:strict": "npx wechat-miniprogram-security-scan --fail-on-error --report-level error"
  }
}
```

## CI/CD Configuration

For CI/CD environments, you might want to configure the plugin to fail the build on security issues:

```javascript
// security.ci.js
module.exports = {
  enabled: true,
  failOnError: true,
  reportLevel: 'error',
  outputFile: './security-report.ci.json',
  enableAdvancedReport: true,
  complianceStandards: ['OWASP', 'PCI-DSS']
};
```

## Ignoring Specific Files or Patterns

To exclude specific files or patterns from security scanning, use the `exclude` option:

```javascript
// security.config.js
module.exports = {
  // ... other config
  exclude: [
    'node_modules/**',
    'miniprogram_npm/**',
    '**/*.test.*',
    '**/*.spec.*'
  ]
};
```

## Disabling Specific Rules

To disable specific security rules, configure the `rules` option:

```javascript
// security.config.js
module.exports = {
  // ... other config
  rules: {
    'wechat-mini-program-api': true,
    'wechat-mini-program-navigation': true,
    'wechat-mini-program-template': false, // Disable template security checks
    'wechat-mini-program-config': true
  }
};
```

## Conclusion

The WeChat Mini Program Plugin Vue Security provides flexible configuration options to suit your project's needs. Adjust the settings based on your development workflow, security requirements, and project size.