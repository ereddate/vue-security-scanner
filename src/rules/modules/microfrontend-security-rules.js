const microfrontendSecurityRules = [
  {
    id: 'microfrontend-architecture',
    name: 'Microfrontend Architecture Security',
    severity: 'Medium',
    description: 'Microfrontend architecture may have security vulnerabilities',
    recommendation: 'Implement proper isolation between microfrontends and secure communication channels.',
    patterns: [
      { key: 'microfrontend-framework', pattern: 'single-spa|qiankun|module-federation|webpack\\.container' }
    ]
  },
  {
    id: 'microfrontend-isolation',
    name: 'Microfrontend Isolation',
    severity: 'High',
    description: 'Microfrontends may not be properly isolated',
    recommendation: 'Implement proper isolation between microfrontends to prevent cross-contamination.',
    patterns: [
      { key: 'iframe-usage', pattern: '<iframe' },
      { key: 'web-components', pattern: 'customElements|defineCustomElement' }
    ]
  },
  {
    id: 'microfrontend-communication',
    name: 'Microfrontend Communication Security',
    severity: 'Medium',
    description: 'Microfrontend communication may have security vulnerabilities',
    recommendation: 'Implement secure communication between microfrontends.',
    patterns: [
      { key: 'event-bus', pattern: 'EventBus|eventBus|pubsub|publish|subscribe' },
      { key: 'shared-state', pattern: 'sharedState|shared\\s*state' }
    ]
  },
  {
    id: 'microfrontend-routing',
    name: 'Microfrontend Routing Security',
    severity: 'Medium',
    description: 'Microfrontend routing may have security vulnerabilities',
    recommendation: 'Implement secure routing between microfrontends.',
    patterns: [
      { key: 'route-configuration', pattern: 'routes\\s*:\\s*\\[' },
      { key: 'router-link', pattern: '<router-link' }
    ]
  },
  {
    id: 'microfrontend-auth',
    name: 'Microfrontend Authentication',
    severity: 'High',
    description: 'Microfrontend authentication may have security vulnerabilities',
    recommendation: 'Implement consistent authentication across all microfrontends.',
    patterns: [
      { key: 'auth-service', pattern: 'AuthService|authService|authentication' },
      { key: 'login-component', pattern: 'Login|login' }
    ]
  },
  {
    id: 'microfrontend-deployment',
    name: 'Microfrontend Deployment Security',
    severity: 'Medium',
    description: 'Microfrontend deployment may have security vulnerabilities',
    recommendation: 'Implement secure deployment practices for microfrontends.',
    patterns: [
      { key: 'deployment-config', pattern: 'deploy|deployment' },
      { key: 'ci-cd', pattern: 'CI|CD|GitHub Actions|Jenkins|Travis CI' }
    ]
  },
  {
    id: 'microfrontend-versioning',
    name: 'Microfrontend Versioning',
    severity: 'Low',
    description: 'Microfrontend versioning may have security implications',
    recommendation: 'Implement proper versioning for microfrontends to prevent compatibility issues.',
    patterns: [
      { key: 'version-field', pattern: 'version\\s*:\\s*["\\\']' }
    ]
  },
  {
    id: 'microfrontend-dependencies',
    name: 'Microfrontend Dependencies Security',
    severity: 'Medium',
    description: 'Microfrontend dependencies may have security vulnerabilities',
    recommendation: 'Review and update dependencies for all microfrontends.',
    patterns: [
      { key: 'dependencies', pattern: 'dependencies\\s*:\\s*\\{' },
      { key: 'package-json', pattern: 'package\\.json' }
    ]
  },
  {
    id: 'microfrontend-build',
    name: 'Microfrontend Build Security',
    severity: 'Low',
    description: 'Microfrontend build process may have security vulnerabilities',
    recommendation: 'Implement secure build processes for microfrontends.',
    patterns: [
      { key: 'build-script', pattern: 'build\\s*:\\s*["\\\']' },
      { key: 'webpack-config', pattern: 'webpack\\.config' }
    ]
  },
  {
    id: 'microfrontend-testing',
    name: 'Microfrontend Testing Security',
    severity: 'Low',
    description: 'Microfrontend testing may have security vulnerabilities',
    recommendation: 'Implement secure testing practices for microfrontends.',
    patterns: [
      { key: 'test-script', pattern: 'test\\s*:\\s*["\\\']' },
      { key: 'jest|mocha|cypress', pattern: 'jest|mocha|cypress' }
    ]
  }
];

module.exports = microfrontendSecurityRules;