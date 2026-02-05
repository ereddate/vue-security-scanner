const backendIntegrationSecurityRules = [
  {
    id: 'api-communication-security',
    name: 'API Communication Security',
    severity: 'High',
    description: 'API communication may have security vulnerabilities',
    recommendation: 'Use HTTPS for all API requests and implement proper authentication.',
    patterns: [
      { key: 'http-request', pattern: 'http://[^"\']+' },
      { key: 'api-call', pattern: 'axios\\.get|axios\\.post|axios\\.put|axios\\.delete|fetch' }
    ]
  },
  {
    id: 'api-endpoint-validation',
    name: 'API Endpoint Validation',
    severity: 'Medium',
    description: 'API endpoints may not be properly validated',
    recommendation: 'Validate all API endpoints and parameters to prevent injection attacks.',
    patterns: [
      { key: 'dynamic-endpoint', pattern: 'api/[^"\']*\\+\\s*[^"\']+' }
    ]
  },
  {
    id: 'authentication-security',
    name: 'Authentication Security',
    severity: 'High',
    description: 'Authentication mechanism may have security vulnerabilities',
    recommendation: 'Implement secure authentication with proper password hashing and session management.',
    patterns: [
      { key: 'login-request', pattern: 'login|signin|authenticate' },
      { key: 'password-field', pattern: 'password|pass|pwd' }
    ]
  },
  {
    id: 'token-management',
    name: 'Token Management Security',
    severity: 'High',
    description: 'Token management may have security vulnerabilities',
    recommendation: 'Implement secure token management with proper storage and expiration.',
    patterns: [
      { key: 'token-storage', pattern: 'localStorage\\.setItem|sessionStorage\\.setItem' },
      { key: 'token-retrieval', pattern: 'localStorage\\.getItem|sessionStorage\\.getItem' },
      { key: 'jwt-token', pattern: 'jwt|token|accessToken|authToken' }
    ]
  },
  {
    id: 'api-error-handling',
    name: 'API Error Handling',
    severity: 'Medium',
    description: 'API error handling may expose sensitive information',
    recommendation: 'Implement proper error handling that does not expose sensitive information.',
    patterns: [
      { key: 'error-logging', pattern: 'console\\.error|console\\.log' },
      { key: 'error-throwing', pattern: 'throw new Error|throw error' }
    ]
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    severity: 'Medium',
    description: 'Data validation may not be properly implemented',
    recommendation: 'Implement client-side data validation as a complement to server-side validation.',
    patterns: [
      { key: 'form-submission', pattern: 'form.*submit|submit.*form' },
      { key: 'input-field', pattern: '<input|v-model' }
    ]
  },
  {
    id: 'cors-configuration',
    name: 'CORS Configuration',
    severity: 'Medium',
    description: 'CORS configuration may have security implications',
    recommendation: 'Configure CORS properly to allow only trusted origins.',
    patterns: [
      { key: 'cors-setup', pattern: 'headers\\s*:\\s*\\{[^}]*Access-Control-Allow-Origin' }
    ]
  },
  {
    id: 'csrf-protection',
    name: 'CSRF Protection',
    severity: 'High',
    description: 'CSRF protection may not be implemented',
    recommendation: 'Implement CSRF protection for all state-changing requests.',
    patterns: [
      { key: 'csrf-token', pattern: 'csrf|X-CSRF-Token' }
    ]
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting',
    severity: 'Medium',
    description: 'Rate limiting may not be implemented',
    recommendation: 'Implement rate limiting to prevent brute force attacks and DoS.',
    patterns: [
      { key: 'api-request', pattern: 'axios|fetch|http' }
    ]
  },
  {
    id: 'secure-headers',
    name: 'Secure Headers',
    severity: 'Medium',
    description: 'Secure headers may not be properly configured',
    recommendation: 'Implement secure headers to protect against various attacks.',
    patterns: [
      { key: 'headers-setup', pattern: 'headers\\s*:\\s*\\{' }
    ]
  },
  {
    id: 'session-management',
    name: 'Session Management',
    severity: 'High',
    description: 'Session management may have security vulnerabilities',
    recommendation: 'Implement secure session management with proper expiration and regeneration.',
    patterns: [
      { key: 'session-storage', pattern: 'sessionStorage|session' },
      { key: 'cookie-setting', pattern: 'document\\.cookie' }
    ]
  },
  {
    id: 'data-encryption',
    name: 'Data Encryption',
    severity: 'High',
    description: 'Sensitive data may not be properly encrypted',
    recommendation: 'Encrypt sensitive data both in transit and at rest.',
    patterns: [
      { key: 'sensitive-data', pattern: 'credit|card|ssn|social|security|number' }
    ]
  },
  {
    id: 'third-party-api-integration',
    name: 'Third-Party API Integration',
    severity: 'Medium',
    description: 'Third-party API integration may have security vulnerabilities',
    recommendation: 'Review third-party APIs for security issues and implement proper error handling.',
    patterns: [
      { key: 'third-party-api', pattern: 'api\\.github\\.com|api\\.google\\.com|api\\.facebook\\.com' }
    ]
  },
  {
    id: 'api-versioning',
    name: 'API Versioning',
    severity: 'Low',
    description: 'API versioning may not be properly implemented',
    recommendation: 'Implement proper API versioning to maintain backward compatibility.',
    patterns: [
      { key: 'api-version', pattern: 'v1/|v2/|version/' }
    ]
  },
  {
    id: 'backend-logging',
    name: 'Backend Logging Security',
    severity: 'Medium',
    description: 'Backend logging may expose sensitive information',
    recommendation: 'Implement secure logging that does not expose sensitive information.',
    patterns: [
      { key: 'logging', pattern: 'console\\.log|logger\\.|log\\(' }
    ]
  }
];

module.exports = backendIntegrationSecurityRules;