const vueDevtoolsSecurityRules = [
  {
    id: 'vue-devtools-security',
    name: 'Vue DevTools Security',
    severity: 'High',
    description: 'Vue DevTools security issues in production',
    recommendation: 'Disable Vue DevTools in production environments to prevent data exposure.',
    patterns: [
      { key: 'devtools-enabled', pattern: 'config\.devtools\s*=\s*true' },
      { key: 'devtools-production', pattern: 'production.*devtools.*true' }
    ]
  },
  {
    id: 'vue-devtools-production',
    name: 'Vue DevTools Enabled in Production',
    severity: 'Critical',
    description: 'Vue DevTools is enabled in production environment, which can expose sensitive data',
    recommendation: 'Ensure Vue DevTools is disabled in production. Use environment-specific configurations.',
    patterns: [
      { key: 'prod-devtools', pattern: 'process\.env\.NODE_ENV\s*===\s*["\']production["\'].*devtools\s*=\s*true' },
      { key: 'prod-env-devtools', pattern: 'NODE_ENV.*production.*devtools.*true' }
    ]
  },
  {
    id: 'vue-devtools-debug',
    name: 'Vue DevTools Debug Mode',
    severity: 'Medium',
    description: 'Vue DevTools debug mode detected',
    recommendation: 'Disable debug mode in production. Use logging frameworks with proper levels.',
    patterns: [
      { key: 'debug-enabled', pattern: 'debug\s*:\s*true|config\.debug\s*=\s*true' },
      { key: 'devtools-debug', pattern: 'devtools.*debug|debug.*devtools' }
    ]
  },
  {
    id: 'vue-devtools-time-travel',
    name: 'Vue DevTools Time Travel',
    severity: 'Medium',
    description: 'Vue DevTools time travel functionality detected',
    recommendation: 'Be cautious with time travel functionality in production. Ensure it cannot be used to manipulate sensitive state.',
    patterns: [
      { key: 'time-travel', pattern: 'timeTravel|time-travel|devtools.*time' },
      { key: 'state-history', pattern: 'stateHistory|history.*state' }
    ]
  },
  {
    id: 'vue-devtools-performance',
    name: 'Vue DevTools Performance Impact',
    severity: 'Low',
    description: 'Vue DevTools can impact application performance',
    recommendation: 'Disable Vue DevTools in production to improve performance and security.',
    patterns: [
      { key: 'performance-devtools', pattern: 'performance.*devtools|devtools.*performance' },
      { key: 'devtools-enabled', pattern: 'devtools\s*=\s*true' }
    ]
  }
];

module.exports = vueDevtoolsSecurityRules;