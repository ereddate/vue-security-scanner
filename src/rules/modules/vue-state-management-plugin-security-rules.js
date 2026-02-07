const vueStateManagementPluginSecurityRules = [
  {
    id: 'pinia-plugin-security',
    name: 'Pinia Plugin Security',
    severity: 'Medium',
    description: 'Pinia plugin security issues',
    recommendation: 'Ensure Pinia plugins are secure and do not expose sensitive data. Use trusted plugins only.',
    patterns: [
      { key: 'pinia-plugin', pattern: 'pinia\\.use\\s*\\(' },
      { key: 'pinia-persist', pattern: 'createPersistedState|pinia-plugin-persist' },
      { key: 'pinia-plugin-import', pattern: 'from\\s*["\']pinia-plugin-[^"\']+["\']' }
    ]
  },
  {
    id: 'pinia-security',
    name: 'Pinia Store Security',
    severity: 'Medium',
    description: 'Pinia store security issues',
    recommendation: 'Validate all data before committing to Pinia stores. Use proper store architecture. Avoid exposing sensitive data.',
    patterns: [
      { key: 'pinia-define', pattern: 'defineStore\\s*\\(' },
      { key: 'pinia-commit', pattern: 'commit\\s*\\(' },
      { key: 'pinia-action', pattern: 'actions\\s*:\\s*\\{' }
    ]
  },
  {
    id: 'vuex-plugin-security',
    name: 'Vuex Plugin Security',
    severity: 'Medium',
    description: 'Vuex plugin security issues',
    recommendation: 'Ensure Vuex plugins are secure and do not expose sensitive data. Use trusted plugins only.',
    patterns: [
      { key: 'vuex-plugin', pattern: 'plugins\\s*:\\s*\\[[^\\]]*\\]' },
      { key: 'vuex-persist', pattern: 'createPersistedState|vuex-persist' },
      { key: 'vuex-plugin-import', pattern: 'from\\s*["\']vuex-plugin-[^"\']+["\']' }
    ]
  },
  {
    id: 'vuex-security',
    name: 'Vuex Store Security',
    severity: 'Medium',
    description: 'Vuex store security issues',
    recommendation: 'Validate all data before committing to Vuex stores. Use proper store architecture. Avoid exposing sensitive data.',
    patterns: [
      { key: 'vuex-define', pattern: 'new\\s+Vuex\\.Store\\s*\\(' },
      { key: 'vuex-commit', pattern: 'commit\\s*\\(' },
      { key: 'vuex-dispatch', pattern: 'dispatch\\s*\\(' }
    ]
  },
  {
    id: 'state-persistence-security',
    name: 'State Persistence Security',
    severity: 'High',
    description: 'Potential security issues with state persistence',
    recommendation: 'Encrypt sensitive data before persistence. Use secure storage mechanisms. Avoid persisting credentials.',
    patterns: [
      { key: 'local-storage', pattern: 'localStorage\\.(setItem|getItem)' },
      { key: 'session-storage', pattern: 'sessionStorage\\.(setItem|getItem)' },
      { key: 'state-persist', pattern: 'persist|persistence|storage' }
    ]
  },
  {
    id: 'state-injection-security',
    name: 'State Injection Security',
    severity: 'High',
    description: 'Potential state injection vulnerabilities',
    recommendation: 'Validate all data before adding to state. Use proper mutation patterns. Avoid direct state manipulation.',
    patterns: [
      { key: 'direct-state', pattern: 'state\\.[^=]+\\s*=\\s*[^;]+' },
      { key: 'state-user-input', pattern: 'commit\\s*\\(\\s*["\'][^"\']*["\'],\\s*[^"\'`][^)]*\\)' },
      { key: 'dispatch-user-input', pattern: 'dispatch\\s*\\(\\s*["\'][^"\']*["\'],\\s*[^"\'`][^)]*\\)' }
    ]
  },
  {
    id: 'state-management-devtools',
    name: 'State Management DevTools',
    severity: 'Medium',
    description: 'Potential security issues with state management devtools',
    recommendation: 'Disable devtools in production. Use proper logging levels. Avoid exposing sensitive data in devtools.',
    patterns: [
      { key: 'devtools-enabled', pattern: 'devtools\\s*:\\s*true' },
      { key: 'vue-devtools', pattern: 'VueDevtools|devtools' },
      { key: 'state-devtools', pattern: 'devtools.*state|state.*devtools' }
    ]
  }
];

module.exports = vueStateManagementPluginSecurityRules;