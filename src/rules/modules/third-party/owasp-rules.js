// src/rules/modules/third-party/owasp-rules.js
// OWASP 安全规则集集成

const owaspSecurityRules = [
  // OWASP Top 10 - Injection
  {
    id: 'owasp-injection',
    name: 'OWASP Top 10 - Injection',
    severity: 'Critical',
    description: 'Injection vulnerability detected.',
    recommendation: 'Use parameterized queries or prepared statements for all database operations. Validate and sanitize all user input.',
    patterns: [
      { key: 'sql-injection', pattern: 'SELECT.*FROM.*WHERE.*[+]' },
      { key: 'no-sql-injection', pattern: '\$where|find' },
      { key: 'command-injection', pattern: 'exec\(\)|spawn\(\)|execSync\(\)' }
    ]
  },
  
  // OWASP Top 10 - Broken Authentication
  {
    id: 'owasp-broken-auth',
    name: 'OWASP Top 10 - Broken Authentication',
    severity: 'Critical',
    description: 'Broken authentication vulnerability detected.',
    recommendation: 'Implement strong authentication mechanisms, use secure session management, and enforce password policies.',
    patterns: [
      { key: 'weak-password', pattern: 'password\s*=\s*["\'][^"\']{1,7}["\']' },
      { key: 'hardcoded-credentials', pattern: 'username\s*=\s*["\'][^"\']*["\'].*password\s*=\s*["\'][^"\']*["\']' },
      { key: 'session-fixation', pattern: 'sessionId\s*=\s*' }
    ]
  },
  
  // OWASP Top 10 - Sensitive Data Exposure
  {
    id: 'owasp-sensitive-data',
    name: 'OWASP Top 10 - Sensitive Data Exposure',
    severity: 'Critical',
    description: 'Sensitive data exposure vulnerability detected.',
    recommendation: 'Encrypt sensitive data at rest and in transit. Use secure storage mechanisms and avoid storing sensitive information unnecessarily.',
    patterns: [
      { key: 'credit-card', pattern: '4[0-9]{12}(?:[0-9]{3})?' },
      { key: 'ssn', pattern: '[0-9]{3}-[0-9]{2}-[0-9]{4}' },
      { key: 'password-storage', pattern: "password\\s*=\\s*[^eE].*['\"\\`]" }
    ]
  },
  
  // OWASP Top 10 - XML External Entities (XXE)
  {
    id: 'owasp-xxe',
    name: 'OWASP Top 10 - XML External Entities (XXE)',
    severity: 'High',
    description: 'XML External Entities (XXE) vulnerability detected.',
    recommendation: 'Disable XML external entity processing. Use modern XML parsers with secure configurations.',
    patterns: [
      { key: 'xml-parser', pattern: 'DOMParser|XMLParser|parseXML' },
      { key: 'xxe-payload', pattern: '<!ENTITY.*SYSTEM|<!ENTITY.*PUBLIC' }
    ]
  },
  
  // OWASP Top 10 - Broken Access Control
  {
    id: 'owasp-access-control',
    name: 'OWASP Top 10 - Broken Access Control',
    severity: 'High',
    description: 'Broken access control vulnerability detected.',
    recommendation: 'Implement proper access control mechanisms, enforce least privilege, and validate user permissions for all operations.',
    patterns: [
      { key: 'direct-object-reference', pattern: 'id\s*=\s*[+]' },
      { key: 'missing-auth-check', pattern: 'if\s*\(.*user.*\)|if\s*\(.*auth.*\)' }
    ]
  },
  
  // OWASP Top 10 - Security Misconfiguration
  {
    id: 'owasp-security-misconfig',
    name: 'OWASP Top 10 - Security Misconfiguration',
    severity: 'High',
    description: 'Security misconfiguration detected.',
    recommendation: 'Follow secure configuration best practices. Remove unnecessary features and services. Keep software up to date.',
    patterns: [
      { key: 'debug-mode', pattern: 'debug\s*:\s*true' },
      { key: 'dev-mode', pattern: 'NODE_ENV\s*=\s*["\']development["\']' },
      { key: 'cors-wildcard', pattern: 'Access-Control-Allow-Origin:\s*[*]' }
    ]
  },
  
  // OWASP Top 10 - Cross-Site Scripting (XSS)
  {
    id: 'owasp-xss',
    name: 'OWASP Top 10 - Cross-Site Scripting (XSS)',
    severity: 'High',
    description: 'Cross-Site Scripting (XSS) vulnerability detected.',
    recommendation: 'Validate and sanitize all user input. Use Content Security Policy (CSP) and avoid dynamic HTML generation.',
    patterns: [
      { key: 'xss-script', pattern: '<script[^>]*>[^<]*<\\/script>' },
      { key: 'xss-event', pattern: 'on[\w]+\s*=\s*["\'][^"\']*["\']' },
      { key: 'xss-javascript', pattern: 'javascript:' }
    ]
  },
  
  // OWASP Top 10 - Insecure Deserialization
  {
    id: 'owasp-deserialization',
    name: 'OWASP Top 10 - Insecure Deserialization',
    severity: 'High',
    description: 'Insecure deserialization vulnerability detected.',
    recommendation: 'Avoid deserializing untrusted data. Use secure deserialization libraries or implement data validation.',
    patterns: [
      { key: 'unserialize', pattern: 'unserialize' },
      { key: 'eval-deserialize', pattern: 'eval\(JSON\.stringify\)' }
    ]
  },
  
  // OWASP Top 10 - Using Components with Known Vulnerabilities
  {
    id: 'owasp-vulnerable-components',
    name: 'OWASP Top 10 - Using Components with Known Vulnerabilities',
    severity: 'High',
    description: 'Using components with known vulnerabilities detected.',
    recommendation: 'Regularly update dependencies, use vulnerability scanners, and implement a software bill of materials (SBOM).',
    patterns: [
      { key: 'package-json', pattern: 'package\.json' },
      { key: 'dependencies', pattern: 'dependencies\s*:\s*\{' },
      { key: 'dev-dependencies', pattern: 'devDependencies\s*:\s*\{' }
    ]
  },
  
  // OWASP Top 10 - Insufficient Logging & Monitoring
  {
    id: 'owasp-logging-monitoring',
    name: 'OWASP Top 10 - Insufficient Logging & Monitoring',
    severity: 'Medium',
    description: 'Insufficient logging and monitoring detected.',
    recommendation: 'Implement comprehensive logging, monitor for security events, and establish incident response procedures.',
    patterns: [
      { key: 'no-logging', pattern: 'try\s*{[^}]*}\s*catch\s*{[^}]*}' },
      { key: 'incomplete-logging', pattern: 'console\.log\(|console\.error\(' }
    ]
  },
  
  // OWASP API Security Top 10 - Broken Object Level Authorization
  {
    id: 'owasp-api-bola',
    name: 'OWASP API Security Top 10 - Broken Object Level Authorization',
    severity: 'Critical',
    description: 'Broken Object Level Authorization vulnerability detected.',
    recommendation: 'Implement proper authorization checks for all API endpoints that access objects.',
    patterns: [
      { key: 'api-object-access', pattern: '\/api\/[^\/]+\/[0-9]+' },
      { key: 'missing-auth-check', pattern: 'app\.' },
    ]
  },
  
  // OWASP API Security Top 10 - Broken Authentication
  {
    id: 'owasp-api-auth',
    name: 'OWASP API Security Top 10 - Broken Authentication',
    severity: 'Critical',
    description: 'Broken authentication in API detected.',
    recommendation: 'Implement secure API authentication mechanisms, use tokens with proper validation, and enforce rate limiting.',
    patterns: [
      { key: 'api-auth', pattern: 'Authorization:.*Bearer' },
      { key: 'weak-token', pattern: 'token\s*=\s*["\'][^"\']{1,15}["\']' }
    ]
  },
  
  // OWASP API Security Top 10 - Excessive Data Exposure
  {
    id: 'owasp-api-data-exposure',
    name: 'OWASP API Security Top 10 - Excessive Data Exposure',
    severity: 'High',
    description: 'Excessive data exposure in API detected.',
    recommendation: 'Implement proper data filtering and only return necessary information in API responses.',
    patterns: [
      { key: 'excessive-data', pattern: 'res\.json\(.*user.*\)|return\s*{.*password.*}' },
      { key: 'select-all', pattern: 'SELECT\s*[*]\s*FROM' }
    ]
  }
];

module.exports = owaspSecurityRules;