# Taro Plugin for Vue Security Scanning

A Taro plugin that performs security scans on Taro projects during the build process with advanced semantic analysis and enterprise-grade reporting.

## Vue 3.7+ 支持

本插件完全支持 Vue 3.7，包括实验性功能、高级 Composition API、Vapor 模式、响应式优化和其他新特性。它可以检测 Vue 3.7 增强的响应式系统和优化渲染管道中特定的安全问题。

## 🚀 Features

### Core Security Features

- **Advanced Semantic Analysis**: AST-based code analysis for enhanced accuracy
  - Reduces false positives through code context understanding
  - Supports JavaScript, TypeScript, JSX, and TSX syntax
  - Detects dangerous function calls with user input tracking
  - Identifies unsafe property access patterns
  - Provides confidence level assessment (High/Medium/Low)
  - Intelligent merging with regex-based detection

- **Taro-Specific Security Checks**: Comprehensive security analysis for Taro features
  - **Taro API Security**: Checks for safe usage of Taro.request, Taro.uploadFile, etc.
  - **Navigation Security**: Validates Taro navigation API usage and parameter handling
  - **Form Security**: Inspects form handling and selector query usage
  - **Config Security**: Reviews Taro config files for security issues

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

- **Build Process Integration**: Seamlessly integrates with Taro's build process
  - Runs security scans during development and production builds
  - Configurable scan timing (pre-build, post-build, or both)
  - Build failure options based on security issue severity

- **Developer Experience**: Designed for a smooth developer workflow
  - Clear and concise security issue reports
  - Integration with Taro CLI output
  - Configurable reporting levels
  - Ignore patterns for false positives

## 📦 Installation

```bash
# Using npm
npm install --save-dev taro-plugin-vue-security

# Using yarn
yarn add --dev taro-plugin-vue-security

# Using pnpm
pnpm add --save-dev taro-plugin-vue-security
```

## 🔧 Configuration

### Basic Configuration

Add the plugin to your `config/index.js` or `config/dev.js` file:

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

### Advanced Configuration

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

## 🎯 Usage

### During Development

When running `taro dev`, the plugin will automatically scan your codebase and report any security issues:

```bash
taro dev
```

### During Build

When running `taro build`, the plugin will scan your codebase before the build process:

```bash
taro build --type weapp
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

The plugin includes the following security rules specifically for Taro:

### Taro API Security
- Detects insecure usage of Taro.request
- Checks for unsafe Taro.uploadFile usage
- Identifies insecure Taro.downloadFile usage
- Verifies safe usage of Taro storage APIs

### Navigation Security
- Detects unsafe Taro.navigateTo usage
- Checks for insecure Taro.redirectTo usage
- Identifies unsafe Taro.switchTab usage
- Verifies safe parameter passing in navigation

### Form Security
- Detects insecure Taro.createSelectorQuery usage
- Checks for unsafe form submission handling
- Identifies potential DOM manipulation vulnerabilities

### Config Security
- Detects hardcoded secrets in Taro config files
- Checks for insecure configuration settings
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
| `reportHistoryPath` | string | `'.taro-security-reports'` | Path for report history |
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
| `enableTaroSpecificRules` | boolean | `true` | Enable Taro-specific security rules |
| `taroApiSecurity` | boolean | `true` | Enable Taro API security checks |
| `taroNavigationSecurity` | boolean | `true` | Enable Taro navigation security checks |
| `taroFormSecurity` | boolean | `true` | Enable Taro form security checks |
| `taroConfigSecurity` | boolean | `true` | Enable Taro config security checks |

## 🔄 Integration with Other Tools

### CI/CD Integration

The plugin can be integrated with CI/CD pipelines to automatically scan for security issues during builds:

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
        run: taro build --type weapp
```

### IDE Integration

For better developer experience, consider using the Vue Security Scanner VS Code extension alongside this plugin.

## 📁 Project Structure

```
taro-project/
├── config/
│   ├── index.js          # Taro config with plugin setup
│   └── dev.js            # Development config
├── src/
│   ├── pages/
│   │   └── index/
│   │       ├── index.tsx # Page component
│   │       └── index.config.ts # Page config
│   └── app.tsx           # App entry
├── package.json
└── .taro-security-reports/ # Generated security reports
```

## 🚀 Getting Started

1. **Install the plugin**:
   ```bash
   npm install --save-dev taro-plugin-vue-security
   ```

2. **Configure the plugin** in your Taro config:
   ```javascript
   // config/index.js
   const config = {
     plugins: [
       'taro-plugin-vue-security'
     ]
   };
   ```

3. **Run your Taro project**:
   ```bash
   taro dev
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
- Added Taro API security checks
- Added navigation security checks
- Added form security checks
- Added config security checks
- Added dependency scanning
- Added advanced reporting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Related Links

- [Vue Security Scanner](https://github.com/ereddate/vue-security-scanner)
- [Taro Documentation](https://taro-docs.jd.com/taro)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)