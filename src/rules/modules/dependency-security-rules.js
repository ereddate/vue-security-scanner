const dependencySecurityRules = [
  {
    id: 'dependency-vulnerability',
    name: 'Dependency Vulnerability Check',
    severity: 'High',
    description: 'Project dependencies may have known security vulnerabilities. Vue Security Scanner integrates multiple vulnerability data sources (NVD, GitHub Advisory, Vue Ecosystem) to provide comprehensive dependency security analysis.',
    recommendation: 'Run npm audit or yarn audit to identify and fix vulnerable dependencies. Additionally, use Vue Security Scanner\'s vulnerability data integration for comprehensive dependency analysis. Run "npm run sync-vulnerability-data" to update vulnerability database.',
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
  },
  {
    id: 'vulnerability-data-source-check',
    name: 'Vulnerability Data Source Check',
    severity: 'Low',
    description: 'Vulnerability data sources may need to be synchronized for up-to-date security information',
    recommendation: 'Regularly run "npm run sync-vulnerability-data" to keep vulnerability database updated with the latest security information from NVD, GitHub Advisory, and Vue Ecosystem.',
    patterns: [
      { key: 'package-json', pattern: 'package\\.json' }
    ]
  },
  {
    id: 'vue-ecosystem-vulnerability',
    name: 'Vue Ecosystem Vulnerability Check',
    severity: 'High',
    description: 'Vue ecosystem dependencies (vue, vue-router, vuex, pinia, etc.) may have known security vulnerabilities',
    recommendation: 'Use Vue Security Scanner\'s Vue Ecosystem data source integration to check for Vue-specific vulnerabilities. Ensure all Vue ecosystem dependencies are updated to secure versions.',
    patterns: [
      { key: 'vue-core', pattern: '"vue"\\s*:\\s*"[^"]+"' },
      { key: 'vue-router', pattern: '"vue-router"\\s*:\\s*"[^"]+"' },
      { key: 'vuex', pattern: '"vuex"\\s*:\\s*"[^"]+"' },
      { key: 'pinia', pattern: '"pinia"\\s*:\\s*"[^"]+"' },
      { key: 'vueuse', pattern: '@vueuse\\/.*' }
    ]
  },
  {
    id: 'cve-vulnerability-check',
    name: 'CVE Vulnerability Check',
    severity: 'Critical',
    description: 'Dependencies may have published CVE vulnerabilities',
    recommendation: 'Use Vue Security Scanner\'s integrated vulnerability data sources (NVD, GitHub Advisory) to identify CVE vulnerabilities in dependencies. Review and update affected dependencies immediately.',
    patterns: [
      { key: 'dependency', pattern: '"[a-zA-Z0-9@/_-]+"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'dependency-version-range-vulnerability',
    name: 'Dependency Version Range Vulnerability',
    severity: 'High',
    description: 'Dependency version ranges may include vulnerable versions',
    recommendation: 'Use Vue Security Scanner\'s version-aware vulnerability detection to identify if dependency version ranges include vulnerable versions. Consider pinning to specific secure versions.',
    patterns: [
      { key: 'version-range', pattern: '"[a-zA-Z0-9@/_-]+"\\s*:\\s*"[^"]*\\^[^"]*"' },
      { key: 'version-range-tilde', pattern: '"[a-zA-Z0-9@/_-]+"\\s*:\\s*"[^"]*~[^"]*"' },
      { key: 'version-range-wildcard', pattern: '"[a-zA-Z0-9@/_-]+"\\s*:\\s*"[^"]*\\*[^"]*"' }
    ]
  },
  {
    id: 'transitive-dependency-vulnerability',
    name: 'Transitive Dependency Vulnerability',
    severity: 'High',
    description: 'Transitive dependencies (dependencies of dependencies) may have security vulnerabilities',
    recommendation: 'Use Vue Security Scanner with npm audit or yarn audit to check transitive dependencies. Regularly update lock files to ensure transitive dependencies are secure.',
    patterns: [
      { key: 'lock-file', pattern: 'package-lock\\.json|yarn\\.lock|pnpm-lock\\.yaml' }
    ]
  }
];

module.exports = dependencySecurityRules;