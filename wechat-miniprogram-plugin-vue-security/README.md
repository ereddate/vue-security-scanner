# WeChat Mini Program Plugin for Vue Security Scanning

A WeChat Mini Program plugin that performs security scans on WeChat Mini Program projects during the development and build process with advanced semantic analysis and enterprise-grade reporting.

## Vue 3.7+ 支持

本插件完全支持 Vue 3.7，包括实验性功能、高级 Composition API、Vapor 模式、响应式优化和其他新特性。它可以检测 Vue 3.7 增强的响应式系统和优化渲染管道中特定的安全问题。

## 🚀 Features

### Core Security Features

- **Advanced Semantic Analysis**: AST-based code analysis for enhanced accuracy
  - Reduces false positives through code context understanding
  - Supports JavaScript, TypeScript syntax
  - Detects dangerous function calls with user input tracking
  - Identifies unsafe property access patterns
  - Provides confidence level assessment (High/Medium/Low)
  - Intelligent merging with regex-based detection

- **WeChat Mini Program-Specific Security Checks**: Comprehensive security analysis for WeChat Mini Program features
  - **WeChat API Security**: Checks for safe usage of wx.request, wx.uploadFile, etc.
  - **Navigation Security**: Validates wx.navigateTo, wx.redirectTo, etc.
  - **Storage Security**: Inspects wx.setStorage, wx.getStorage usage
  - **Template Security**: Reviews WXML templates for injection vulnerabilities
  - **Config Security**: Analyzes app.json, project.config.json for security issues

- **Enhanced Dependency Security**: Comprehensive dependency vulnerability scanning
  - Integrated npm audit for real-time vulnerability detection
  - Built-in vulnerability database for common packages
  - Outdated dependency detection
  - License compliance checking
  - Vulnerability caching for performance optimization
  - Support for transitive dependency analysis

- **Advanced Reporting**: Enterprise-grade reporting capabilities
  - Trend analysis with historical data comparison
  - Compliance reports (OWASP, GDPR, HIPAA, PCI-DSS, SOX, GB/T, Cybersecurity Law, Data Security Law, PIPL, Cryptography Law)
  - Vulnerability distribution analysis
  - CWE and OWASP Top 10 mapping
  - Fix complexity assessment
  - Priority-based recommendations
  - Interactive HTML reports with visual dashboards

- **Performance Optimization**: Advanced performance features for large-scale projects
  - GPU-accelerated regex matching for faster pattern detection
  - Intelligent caching system for improved scan performance
  - Parallel processing for multi-core CPU utilization
  - Incremental scanning for faster subsequent scans
  - Memory-efficient processing with configurable limits
  - Performance profiles (fast, balanced, thorough)

- **Cross-Framework Support**: Support for multiple frontend frameworks
  - Vue.js (2.x, 3.x, 3.6+, 3.7+)
  - uni-app
  - Taro
  - WeChat Mini Program
  - Baidu Smart Program
  - ByteDance Mini Program
  - QQ Mini Program

### Integration Features

- **Development Process Integration**: Seamlessly integrates with WeChat Mini Program development workflow
  - Runs security scans during development and build
  - Configurable scan timing (pre-build, post-build, or both)
  - Build failure options based on security issue severity

- **Developer Experience**: Designed for a smooth developer workflow
  - Clear and concise security issue reports
  - Integration with WeChat Developer Tools
  - Configurable reporting levels
  - Ignore patterns for false positives

## 📦 Installation

```bash
# Using npm
npm install --save-dev wechat-miniprogram-plugin-vue-security

# Using yarn
yarn add --dev wechat-miniprogram-plugin-vue-security

# Using pnpm
pnpm add --dev wechat-miniprogram-plugin-vue-security
```

## 🔧 Configuration

### Basic Configuration

Add the plugin to your `project.config.json` or create a `security.config.js` file:

```javascript
// security.config.js
module.exports = {
  enabled: true,
  failOnError: false,
  reportLevel: 'warning',
  outputFile: './security-report.json'
};
```

### Advanced Configuration

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
  complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law'], // Compliance standards to check
  
  // Performance options
  performanceProfile: 'balanced', // Performance profile ('fast', 'balanced', 'thorough')
  enableParallelScanning: true, // Enable parallel scanning
  enableIncrementalScanning: true, // Enable incremental scanning
  memoryLimit: 2048, // Memory limit in MB
  enableGPUAcceleration: true, // Enable GPU-accelerated regex matching
  enableCaching: true, // Enable caching system
  
  // Vue 3.6+ support
  enableVue36Features: true, // Enable Vue 3.6 features
  enableVaporModeScanning: true, // Enable Vapor mode scanning
  
  // Vue 3.7+ support
  enableVue37Features: true, // Enable Vue 3.7+ specific feature detection
  enableExperimentalFeaturesScanning: true, // Enable scanning for experimental features
  enableAdvancedCompositionAPIScanning: true, // Enable scanning for advanced Composition API
  enableReactiveOptimizationScanning: true, // Enable scanning for reactive optimization issues
  
  // Cross-framework support
  supportedFrameworks: ['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram'], // Supported frameworks
  
  // WeChat Mini Program-specific options
  enableWeChatSpecificRules: true, // Enable WeChat-specific security rules
  wechatApiSecurity: true, // Enable WeChat API security checks
  wechatNavigationSecurity: true, // Enable WeChat navigation security checks
  wechatStorageSecurity: true, // Enable WeChat storage security checks
  wechatTemplateSecurity: true, // Enable WeChat template security checks
  wechatConfigSecurity: true // Enable WeChat config security checks
};
```

## 🎯 Usage

### With WeChat Developer Tools

1. **Install the plugin** in your WeChat Mini Program project
2. **Create a security.config.js** file in your project root
3. **Run the security scan** using the CLI:

```bash
# Run security scan
npx wechat-miniprogram-security-scan

# Run with custom config
npx wechat-miniprogram-security-scan --config security.config.js

# Run and fail on error
npx wechat-miniprogram-security-scan --fail-on-error
```

### With CI/CD

```yaml
# GitHub Actions example
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run security scan
        run: npx wechat-miniprogram-security-scan --fail-on-error
```

### Security Report

The plugin generates a security report that includes:

- Summary of scanned files and found vulnerabilities
- Detailed list of security issues with severity levels
- Code snippets showing the vulnerable code
- Recommendations for fixing each issue
- Dependency vulnerability information (if enabled)
- Compliance status (if advanced reporting is enabled)

## 🛡️ Security Rules

The plugin includes the following security rules specifically for WeChat Mini Program:

### WeChat API Security
- Detects insecure usage of wx.request
- Checks for unsafe wx.uploadFile usage
- Identifies insecure wx.downloadFile usage
- Verifies safe usage of wx storage APIs

### Navigation Security
- Detects unsafe wx.navigateTo usage
- Checks for insecure wx.redirectTo usage
- Identifies unsafe wx.switchTab usage
- Verifies safe parameter passing in navigation

### Storage Security
- Detects insecure usage of wx.setStorage
- Checks for unsafe storage key names
- Identifies potential sensitive data exposure in storage

### Template Security
- Detects unsafe WXML template interpolation
- Checks for insecure wx:for usage
- Identifies potential template injection vulnerabilities

### Config Security
- Detects hardcoded secrets in app.json
- Checks for insecure project.config.json settings
- Identifies potential security misconfigurations

## 📋 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Whether to enable the plugin |
| `failOnError` | boolean | `false` | Whether to fail the build on security issues |
| `reportLevel` | string | `'warning'` | Minimum severity level to report (`'error'`, `'warning'`, or `'info'`) |
| `outputFile` | string | `null` | Optional output file for security report |
| `exclude` | array | `[]` | Patterns to exclude from scanning |
| `enableSemanticAnalysis` | boolean | `true` | Enable AST-based semantic analysis |
| `enableDependencyScanning` | boolean | `true` | Enable dependency vulnerability scanning |
| `enableAdvancedReport` | boolean | `false` | Enable advanced reporting with trends and compliance |
| `reportHistoryPath` | string | `'.wechat-security-reports'` | Path for report history |
| `complianceStandards` | array | `['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law']` | Compliance standards to check |
| `performanceProfile` | string | `'balanced'` | Performance profile (`'fast'`, `'balanced'`, or `'thorough'`) |
| `enableParallelScanning` | boolean | `true` | Enable parallel scanning |
| `enableIncrementalScanning` | boolean | `true` | Enable incremental scanning |
| `memoryLimit` | number | `2048` | Memory limit in MB |
| `enableGPUAcceleration` | boolean | `true` | Enable GPU-accelerated regex matching |
| `enableCaching` | boolean | `true` | Enable caching system |
| `enableVue36Features` | boolean | `true` | Enable Vue 3.6 features |
| `enableVaporModeScanning` | boolean | `true` | Enable Vapor mode scanning |
| `enableVue37Features` | boolean | `true` | Enable Vue 3.7+ features |
| `enableExperimentalFeaturesScanning` | boolean | `true` | Enable scanning for experimental features |
| `enableAdvancedCompositionAPIScanning` | boolean | `true` | Enable scanning for advanced Composition API |
| `enableReactiveOptimizationScanning` | boolean | `true` | Enable scanning for reactive optimization issues |
| `supportedFrameworks` | array | `['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram']` | Supported frameworks |
| `enableWeChatSpecificRules` | boolean | `true` | Enable WeChat-specific security rules |
| `wechatApiSecurity` | boolean | `true` | Enable WeChat API security checks |
| `wechatNavigationSecurity` | boolean | `true` | Enable WeChat navigation security checks |
| `wechatStorageSecurity` | boolean | `true` | Enable WeChat storage security checks |
| `wechatTemplateSecurity` | boolean | `true` | Enable WeChat template security checks |
| `wechatConfigSecurity` | boolean | `true` | Enable WeChat config security checks |

## 🔄 Integration with Other Tools

### WeChat Developer Tools Integration

For better integration with WeChat Developer Tools, you can add a script to your package.json:

```json
{
  "scripts": {
    "security:scan": "npx wechat-miniprogram-security-scan",
    "security:report": "npx wechat-miniprogram-security-scan --output-file security-report.json"
  }
}
```

### IDE Integration

For better developer experience, consider using the Vue Security Scanner VS Code extension alongside this plugin.

## 📁 Project Structure

```
wechat-miniprogram-project/
├── pages/
│   └── index/
│       ├── index.js
│       ├── index.wxml
│       ├── index.wxss
│       └── index.json
├── utils/
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── package.json
└── .wechat-security-reports/ # Generated security reports
```

## 🚀 Getting Started

1. **Install the plugin**:
   ```bash
   npm install --save-dev wechat-miniprogram-plugin-vue-security
   ```

2. **Create a security.config.js** file:
   ```javascript
   // security.config.js
   module.exports = {
     enabled: true,
     failOnError: false,
     reportLevel: 'warning'
   };
   ```

3. **Run the security scan**:
   ```bash
   npx wechat-miniprogram-security-scan
   ```

4. **Check the security report** in your console output or specified output file.

## 📝 Changelog

### v1.2.0
- Added Vue 3.7+ support with experimental features, advanced Composition API, Vapor mode, and reactive optimization
- Added GPU acceleration for regex matching
- Added caching system for improved performance
- Added parallel processing and incremental scanning
- Added performance profiles (fast, balanced, thorough)
- Added cross-framework support (Vue, uni-app, Taro, WeChat Mini Program, Baidu Smart Program, ByteDance Mini Program, QQ Mini Program)
- Extended compliance standards to include China-specific standards (GB/T, Cybersecurity Law, Data Security Law, PIPL, Cryptography Law)
- Updated configuration options with new performance and framework settings

### v1.0.0
- Initial release
- Added WeChat API security checks
- Added navigation security checks
- Added storage security checks
- Added template security checks
- Added config security checks
- Added dependency scanning
- Added advanced reporting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Related Links

- [Vue Security Scanner](https://github.com/ereddate/vue-security-scanner)
- [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/en/dev/framework/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)