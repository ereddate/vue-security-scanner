const vueCliSecurityRules = [
  {
    id: 'vue-cli-config',
    name: 'Vue CLI Configuration Security',
    severity: 'Medium',
    description: 'Vue CLI configuration may have security issues',
    recommendation: 'Review Vue CLI configuration for security best practices.',
    patterns: [
      { key: 'vue-config', pattern: 'vue\\.config\\.js' }
    ]
  },
  {
    id: 'webpack-dev-server',
    name: 'Webpack Dev Server Security',
    severity: 'Medium',
    description: 'Webpack Dev Server configuration may have security issues',
    recommendation: 'Review Webpack Dev Server configuration for security best practices, especially in production.',
    patterns: [
      { key: 'dev-server', pattern: 'devServer\\s*:\\s*\\{' },
      { key: 'webpack-dev-server', pattern: 'webpack-dev-server' }
    ]
  },
  {
    id: 'hot-module-replacement',
    name: 'Hot Module Replacement Security',
    severity: 'Low',
    description: 'Hot Module Replacement may have security implications',
    recommendation: 'Ensure Hot Module Replacement is only enabled in development environment.',
    patterns: [
      { key: 'hmr', pattern: 'hotOnly\\s*:\\s*true|hot\\s*:\\s*true' }
    ]
  },
  {
    id: 'public-path-config',
    name: 'Public Path Configuration',
    severity: 'Medium',
    description: 'Public path configuration may have security implications',
    recommendation: 'Ensure public path is configured correctly for your deployment environment.',
    patterns: [
      { key: 'public-path', pattern: 'publicPath\\s*:\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'output-path-config',
    name: 'Output Path Configuration',
    severity: 'Low',
    description: 'Output path configuration may have security implications',
    recommendation: 'Ensure output path is secure and not accessible to unauthorized users.',
    patterns: [
      { key: 'output-path', pattern: 'outputDir\\s*:\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'production-source-map',
    name: 'Production Source Map Configuration',
    severity: 'Medium',
    description: 'Production source maps may expose sensitive code',
    recommendation: 'Disable source maps in production to protect your source code.',
    patterns: [
      { key: 'production-source-map', pattern: 'productionSourceMap\\s*:\\s*true' }
    ]
  },
  {
    id: 'css-extract-plugin',
    name: 'CSS Extract Plugin Configuration',
    severity: 'Low',
    description: 'CSS extract plugin configuration may have security implications',
    recommendation: 'Review CSS extract plugin configuration for security best practices.',
    patterns: [
      { key: 'css-extract', pattern: 'MiniCssExtractPlugin' }
    ]
  },
  {
    id: 'babel-loader-config',
    name: 'Babel Loader Configuration',
    severity: 'Low',
    description: 'Babel loader configuration may have security implications',
    recommendation: 'Review Babel loader configuration for security best practices.',
    patterns: [
      { key: 'babel-loader', pattern: 'babel-loader' }
    ]
  },
  {
    id: 'eslint-loader-config',
    name: 'ESLint Loader Configuration',
    severity: 'Low',
    description: 'ESLint loader configuration may have security implications',
    recommendation: 'Review ESLint loader configuration for security best practices.',
    patterns: [
      { key: 'eslint-loader', pattern: 'eslint-loader' }
    ]
  },
  {
    id: 'html-webpack-plugin',
    name: 'HTML Webpack Plugin Configuration',
    severity: 'Low',
    description: 'HTML Webpack Plugin configuration may have security implications',
    recommendation: 'Review HTML Webpack Plugin configuration for security best practices.',
    patterns: [
      { key: 'html-webpack-plugin', pattern: 'HtmlWebpackPlugin' }
    ]
  },
  {
    id: 'webpack-bundle-analyzer',
    name: 'Webpack Bundle Analyzer Configuration',
    severity: 'Low',
    description: 'Webpack Bundle Analyzer may have security implications',
    recommendation: 'Ensure Webpack Bundle Analyzer is only enabled when needed.',
    patterns: [
      { key: 'webpack-bundle-analyzer', pattern: 'webpack-bundle-analyzer' }
    ]
  },
  {
    id: 'cross-env-config',
    name: 'Cross-Env Configuration',
    severity: 'Low',
    description: 'Cross-env configuration may have security implications',
    recommendation: 'Review cross-env configuration for security best practices.',
    patterns: [
      { key: 'cross-env', pattern: 'cross-env' }
    ]
  },
  {
    id: 'vue-cli-service-config',
    name: 'Vue CLI Service Configuration',
    severity: 'Medium',
    description: 'Vue CLI Service configuration may have security implications',
    recommendation: 'Review Vue CLI Service configuration for security best practices.',
    patterns: [
      { key: 'vue-cli-service', pattern: 'vue-cli-service' }
    ]
  },
  {
    id: 'webpack-optimization',
    name: 'Webpack Optimization Configuration',
    severity: 'Low',
    description: 'Webpack optimization configuration may have security implications',
    recommendation: 'Review Webpack optimization configuration for security best practices.',
    patterns: [
      { key: 'webpack-optimization', pattern: 'optimization\\s*:\\s*\\{' }
    ]
  },
  {
    id: 'webpack-plugins',
    name: 'Webpack Plugins Configuration',
    severity: 'Low',
    description: 'Webpack plugins configuration may have security implications',
    recommendation: 'Review Webpack plugins configuration for security best practices.',
    patterns: [
      { key: 'webpack-plugins', pattern: 'plugins\\s*:\\s*\\[' }
    ]
  }
];

module.exports = vueCliSecurityRules;