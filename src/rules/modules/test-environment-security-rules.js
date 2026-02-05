const testEnvironmentSecurityRules = [
  {
    id: 'test-data-security',
    name: 'Test Data Security',
    severity: 'Medium',
    description: 'Test data may contain sensitive information',
    recommendation: 'Do not use real sensitive data in test environments.',
    patterns: [
      { key: 'test-data', pattern: 'test\\s*data|mock\\s*data|fixture' },
      { key: 'sensitive-data', pattern: 'credit\\s*card|ssn|password|api\\s*key' }
    ]
  },
  {
    id: 'test-configuration-security',
    name: 'Test Configuration Security',
    severity: 'Low',
    description: 'Test configuration may have security implications',
    recommendation: 'Review test configuration for security best practices.',
    patterns: [
      { key: 'test-config', pattern: 'jest\\.config|cypress\\.json|test\\s*config' },
      { key: 'test-env', pattern: 'test\\s*environment|NODE_ENV\\s*=\\s*["\\\']test["\\\']' }
    ]
  },
  {
    id: 'mock-service-security',
    name: 'Mock Service Security',
    severity: 'Low',
    description: 'Mock services may have security vulnerabilities',
    recommendation: 'Review mock services for security best practices.',
    patterns: [
      { key: 'mock-service', pattern: 'mock|stub|fake|simulate' },
      { key: 'mock-server', pattern: 'mock\\s*server|msw|nock' }
    ]
  },
  {
    id: 'testing-framework-security',
    name: 'Testing Framework Security',
    severity: 'Low',
    description: 'Testing frameworks may have security vulnerabilities',
    recommendation: 'Use secure testing frameworks and keep them updated.',
    patterns: [
      { key: 'testing-framework', pattern: 'jest|cypress|mocha|chai|vue-test-utils' },
      { key: 'test-script', pattern: 'test|spec|e2e|unit' }
    ]
  },
  {
    id: 'test-coverage-security',
    name: 'Test Coverage Security',
    severity: 'Low',
    description: 'Test coverage configuration may have security implications',
    recommendation: 'Review test coverage configuration for security best practices.',
    patterns: [
      { key: 'coverage-config', pattern: 'coverage|istanbul|nyc' },
      { key: 'coverage-threshold', pattern: 'threshold|min\\s*coverage' }
    ]
  },
  {
    id: 'integration-test-security',
    name: 'Integration Test Security',
    severity: 'Medium',
    description: 'Integration tests may have security vulnerabilities',
    recommendation: 'Review integration tests for security best practices.',
    patterns: [
      { key: 'integration-test', pattern: 'integration|e2e|end-to-end' },
      { key: 'api-test', pattern: 'api\\s*test|http\\s*request' }
    ]
  },
  {
    id: 'security-testing',
    name: 'Security Testing',
    severity: 'Medium',
    description: 'Security testing may not be implemented',
    recommendation: 'Implement security testing in your test suite.',
    patterns: [
      { key: 'security-test', pattern: 'security\\s*test|penetration\\s*test|vulnerability\\s*test' },
      { key: 'security-tool', pattern: 'owasp|zap|burp|nmap' }
    ]
  },
  {
    id: 'test-environment-isolation',
    name: 'Test Environment Isolation',
    severity: 'Medium',
    description: 'Test environments may not be properly isolated',
    recommendation: 'Ensure test environments are properly isolated from production.',
    patterns: [
      { key: 'environment-isolation', pattern: 'isolation|separation|segregation' },
      { key: 'test-database', pattern: 'test\\s*database|mock\\s*database' }
    ]
  },
  {
    id: 'test-credential-security',
    name: 'Test Credential Security',
    severity: 'Medium',
    description: 'Test credentials may be exposed',
    recommendation: 'Do not hardcode test credentials in source code.',
    patterns: [
      { key: 'test-credential', pattern: 'username|password|token|api\\s*key' },
      { key: 'hardcoded-cred', pattern: 'testuser|testpass|password123' }
    ]
  },
  {
    id: 'test-logging-security',
    name: 'Test Logging Security',
    severity: 'Low',
    description: 'Test logging may expose sensitive information',
    recommendation: 'Ensure test logging does not expose sensitive information.',
    patterns: [
      { key: 'test-logging', pattern: 'console\\.log|logger|debug' },
      { key: 'sensitive-log', pattern: 'password|token|api\\s*key' }
    ]
  }
];

module.exports = testEnvironmentSecurityRules;