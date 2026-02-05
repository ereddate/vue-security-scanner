const dependencySecurityRules = [
  {
    id: 'dependency-vulnerability',
    name: 'Dependency Vulnerability Check',
    severity: 'High',
    description: 'Project dependencies may have known security vulnerabilities',
    recommendation: 'Run npm audit or yarn audit to identify and fix vulnerable dependencies.',
    patterns: [
      { key: 'package-json', pattern: 'package\\.json' },
      { key: 'yarn-lock', pattern: 'yarn\\.lock' },
      { key: 'package-lock', pattern: 'package-lock\\.json' }
    ]
  },
  {
    id: 'outdated-dependencies',
    name: 'Outdated Dependencies',
    severity: 'Medium',
    description: 'Project dependencies are outdated and may have security issues',
    recommendation: 'Update dependencies to their latest secure versions.',
    patterns: [
      { key: 'package-json-deps', pattern: '"dependencies"\\s*:\\s*\\{' },
      { key: 'package-json-dev-deps', pattern: '"devDependencies"\\s*:\\s*\\{' }
    ]
  },
  {
    id: 'vue-version-compatibility',
    name: 'Vue Version Compatibility',
    severity: 'Medium',
    description: 'Vue version may have compatibility issues with other dependencies',
    recommendation: 'Ensure Vue version is compatible with all other dependencies.',
    patterns: [
      { key: 'vue-dependency', pattern: '"vue"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'vue-plugin-security',
    name: 'Vue Plugin Security',
    severity: 'Medium',
    description: 'Vue plugins may have security vulnerabilities',
    recommendation: 'Review Vue plugins from trusted sources and keep them updated.',
    patterns: [
      { key: 'vue-router', pattern: '"vue-router"\\s*:\\s*"[^"]+"' },
      { key: 'vuex', pattern: '"vuex"\\s*:\\s*"[^"]+"' },
      { key: 'pinia', pattern: '"pinia"\\s*:\\s*"[^"]+"' },
      { key: 'vue-i18n', pattern: '"vue-i18n"\\s*:\\s*"[^"]+"' },
      { key: 'vueuse', pattern: '@vueuse\\/core|@vueuse\\/.*' }
    ]
  },
  {
    id: 'build-tool-security',
    name: 'Build Tool Security',
    severity: 'Medium',
    description: 'Build tools may have security vulnerabilities',
    recommendation: 'Update build tools to their latest secure versions.',
    patterns: [
      { key: 'webpack', pattern: '"webpack"\\s*:\\s*"[^"]+"' },
      { key: 'vite', pattern: '"vite"\\s*:\\s*"[^"]+"' },
      { key: 'babel', pattern: '"@babel\\/.*"\\s*:\\s*"[^"]+"' },
      { key: 'eslint', pattern: '"eslint"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'http-client-security',
    name: 'HTTP Client Security',
    severity: 'Medium',
    description: 'HTTP client libraries may have security vulnerabilities',
    recommendation: 'Use secure HTTP client libraries and keep them updated.',
    patterns: [
      { key: 'axios', pattern: '"axios"\\s*:\\s*"[^"]+"' },
      { key: 'fetch-api', pattern: 'fetch\\(' },
      { key: 'xmlhttprequest', pattern: 'XMLHttpRequest' }
    ]
  },
  {
    id: 'third-party-scripts',
    name: 'Third-Party Scripts',
    severity: 'High',
    description: 'Third-party scripts may introduce security vulnerabilities',
    recommendation: 'Review and whitelist third-party scripts, use Subresource Integrity (SRI).',
    patterns: [
      { key: 'script-src', pattern: '<script\\s+src' },
      { key: 'external-script', pattern: 'https?:\\/\\/.*\\.js' }
    ]
  },
  {
    id: 'dependency-license',
    name: 'Dependency License Compliance',
    severity: 'Low',
    description: 'Dependencies may have license compliance issues',
    recommendation: 'Review dependencies for license compliance issues.',
    patterns: [
      { key: 'license-field', pattern: '"license"\\s*:\\s*"[^"]+"' },
      { key: 'licenses-field', pattern: '"licenses"\\s*:\\s*\\[' }
    ]
  },
  {
    id: 'vue-cli-plugin-security',
    name: 'Vue CLI Plugin Security',
    severity: 'Medium',
    description: 'Vue CLI plugins may have security vulnerabilities',
    recommendation: 'Review Vue CLI plugins from trusted sources and keep them updated.',
    patterns: [
      { key: 'vue-cli-plugin', pattern: '@vue\\/cli-plugin-.*' },
      { key: 'vue-cli-service', pattern: '@vue\\/cli-service' }
    ]
  },
  {
    id: 'bundler-audit',
    name: 'Bundler Audit',
    severity: 'Medium',
    description: 'Bundler configuration may have security issues',
    recommendation: 'Review bundler configuration for security best practices.',
    patterns: [
      { key: 'webpack-config', pattern: 'webpack\\.config\\.' },
      { key: 'vite-config', pattern: 'vite\\.config\\.' },
      { key: 'rollup-config', pattern: 'rollup\\.config\\.' }
    ]
  }
];

module.exports = dependencySecurityRules;