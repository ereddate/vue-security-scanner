const csrfRules = [
  {
    id: 'csrf-missing-token',
    name: 'Missing CSRF Token',
    severity: 'High',
    description: 'HTTP request missing CSRF protection token',
    recommendation: 'Add CSRF token validation mechanism to HTTP requests. Ensure server-side CSRF token verification.',
    patterns: [
      { key: 'fetch-post', pattern: '(fetch|axios|XMLHttpRequest|\\$\\.ajax)\\s*\\([^)]*method\\s*[:=]\\s*["\'](POST|PUT|DELETE|PATCH)["\']' }
    ]
  },
  {
    id: 'csrf-insecure-form',
    name: 'Insecure Form Submission',
    severity: 'Medium',
    description: 'Form submission may be missing CSRF protection',
    recommendation: 'Add CSRF hidden field to forms and validate tokens on the server side.',
    patterns: [
      { key: 'form-post', pattern: '<form[^>]*(action\\s*=\\s*["\'][^"\']*["\'][^>]*method\\s*=\\s*["\']post["\'])' }
    ]
  },
  {
    id: 'csrf-axios-no-token',
    name: 'Axios Without CSRF',
    severity: 'Medium',
    description: 'Using Axios to send requests may be missing CSRF protection',
    recommendation: 'Configure Axios to automatically include CSRF tokens, or manually add CSRF tokens in request headers.',
    patterns: [
      { key: 'axios-post', pattern: 'axios\\.(post|put|delete|patch)\\s*\\(' }
    ]
  },
  {
    id: 'csrf-missing-samesite',
    name: 'Missing SameSite Cookie Attribute',
    severity: 'Medium',
    description: 'Cookie setting missing SameSite attribute',
    recommendation: 'Set the SameSite attribute of cookies to "Strict" or "Secure" to prevent CSRF attacks.',
    patterns: [
      { key: 'cookie-no-samesite', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*SameSite\\b))' }
    ]
  },
  {
    id: 'csrf-token-reuse',
    name: 'CSRF Token Reuse',
    severity: 'Medium',
    description: 'Potential CSRF token reuse across multiple requests',
    recommendation: 'Generate unique CSRF tokens for each session or request.',
    patterns: [
      { key: 'csrf-token-static', pattern: 'csrfToken\\s*=\\s*["\'][^"\']+["\']' },
      { key: 'csrf-token-global', pattern: 'window\\.csrfToken|global\\.csrfToken' }
    ]
  },
  {
    id: 'csrf-token-in-header',
    name: 'CSRF Token in Header',
    severity: 'Low',
    description: 'CSRF token in header without proper validation',
    recommendation: 'Ensure CSRF tokens in headers are properly validated on the server side.',
    patterns: [
      { key: 'csrf-header', pattern: 'headers\\s*:.*X-CSRF-Token|headers\\s*:.*csrf-token' }
    ]
  },
  {
    id: 'csrf-token-in-body',
    name: 'CSRF Token in Request Body',
    severity: 'Low',
    description: 'CSRF token in request body without proper validation',
    recommendation: 'Ensure CSRF tokens in request bodies are properly validated on the server side.',
    patterns: [
      { key: 'csrf-body', pattern: 'csrfToken\\s*:|_csrf\\s*:' }
    ]
  }
];

module.exports = csrfRules;