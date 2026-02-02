// src/rules/modules/third-party/sonarqube-rules.js
// SonarQube 安全规则集集成

const sonarQubeSecurityRules = [
  // SonarQube - Security Hotspots
  {
    id: 'sonarqube-sql-injection',
    name: 'SonarQube - SQL Injection',
    severity: 'Critical',
    description: 'SQL injection vulnerability detected.',
    recommendation: 'Use parameterized queries or prepared statements for all database operations.',
    patterns: [
      { key: 'sql-injection', pattern: 'SELECT.*FROM.*WHERE.*[+]' },
      { key: 'sql-query-string', pattern: 'query\s*=\s*["\'][^"\']*[+][^"\']*["\']' }
    ]
  },
  
  // SonarQube - Cross-Site Scripting (XSS)
  {
    id: 'sonarqube-xss',
    name: 'SonarQube - Cross-Site Scripting (XSS)',
    severity: 'High',
    description: 'Cross-Site Scripting (XSS) vulnerability detected.',
    recommendation: 'Validate and sanitize all user input before displaying it in the UI.',
    patterns: [
      { key: 'xss-innerhtml', pattern: 'innerHTML\s*=' },
      { key: 'xss-insertadjacent', pattern: 'insertAdjacentHTML\s*\(' },
      { key: 'xss-document-write', pattern: 'document\.write\s*\(' }
    ]
  },
  
  // SonarQube - Hardcoded Credentials
  {
    id: 'sonarqube-hardcoded-creds',
    name: 'SonarQube - Hardcoded Credentials',
    severity: 'Critical',
    description: 'Hardcoded credentials detected.',
    recommendation: 'Do not hardcode credentials. Use environment variables or secure configuration management.',
    patterns: [
      { key: 'hardcoded-password', pattern: 'password\s*=\s*["\'][^"\']*["\']' },
      { key: 'hardcoded-api-key', pattern: 'apiKey\s*=\s*["\'][^"\']*["\']' },
      { key: 'hardcoded-token', pattern: 'token\s*=\s*["\'][^"\']*["\']' }
    ]
  },
  
  // SonarQube - Insecure Randomness
  {
    id: 'sonarqube-insecure-random',
    name: 'SonarQube - Insecure Randomness',
    severity: 'Medium',
    description: 'Insecure randomness detected.',
    recommendation: 'Use cryptographically secure random number generators.',
    patterns: [
      { key: 'math-random', pattern: 'Math\.random\(\)' },
      { key: 'insecure-random', pattern: 'random\(\)|rand\(\)' }
    ]
  },
  
  // SonarQube - Command Injection
  {
    id: 'sonarqube-command-injection',
    name: 'SonarQube - Command Injection',
    severity: 'Critical',
    description: 'Command injection vulnerability detected.',
    recommendation: 'Avoid executing shell commands with user input. If necessary, use parameterized commands.',
    patterns: [
      { key: 'exec', pattern: 'exec|spawn|execSync' },
      { key: 'command-injection', pattern: 'child_process\.' },
    ]
  },
  
  // SonarQube - Path Traversal
  {
    id: 'sonarqube-path-traversal',
    name: 'SonarQube - Path Traversal',
    severity: 'High',
    description: 'Path traversal vulnerability detected.',
    recommendation: 'Validate and sanitize file paths to prevent path traversal attacks.',
    patterns: [
      { key: 'path-traversal', pattern: 'fs\.readFile\(\s*["\'][^"\']*\.\.\/[^"\']*["\']' },
      { key: 'unsafe-path', pattern: 'path\.join\(.*[+].*\)' }
    ]
  },
  
  // SonarQube - Unvalidated Redirect
  {
    id: 'sonarqube-unvalidated-redirect',
    name: 'SonarQube - Unvalidated Redirect',
    severity: 'Medium',
    description: 'Unvalidated redirect detected.',
    recommendation: 'Validate redirect URLs against a whitelist to prevent open redirect vulnerabilities.',
    patterns: [
      { key: 'unvalidated-redirect', pattern: 'window\.location\s*=\s*.*[+].*' },
      { key: 'redirect-param', pattern: 'redirect\s*=\s*.*[+].*' }
    ]
  },
  
  // SonarQube - Sensitive Data Exposure
  {
    id: 'sonarqube-sensitive-data',
    name: 'SonarQube - Sensitive Data Exposure',
    severity: 'High',
    description: 'Sensitive data exposure detected.',
    recommendation: 'Encrypt sensitive data and avoid logging or exposing it unnecessarily.',
    patterns: [
      { key: 'credit-card', pattern: '4[0-9]{12}(?:[0-9]{3})?' },
      { key: 'ssn', pattern: '[0-9]{3}-[0-9]{2}-[0-9]{4}' },
      { key: 'password-logging', pattern: 'console\.log\(.*password.*\)' }
    ]
  },
  
  // SonarQube - CSRF Vulnerability
  {
    id: 'sonarqube-csrf',
    name: 'SonarQube - CSRF Vulnerability',
    severity: 'Medium',
    description: 'CSRF vulnerability detected.',
    recommendation: 'Implement CSRF tokens for all state-changing operations.',
    patterns: [
      { key: 'csrf-missing', pattern: 'app\.(post|put|delete)\(.*function\(' },
      { key: 'csrf-token-missing', pattern: 'form\s+action=' }
    ]
  },
  
  // SonarQube - Insecure Cryptography
  {
    id: 'sonarqube-insecure-crypto',
    name: 'SonarQube - Insecure Cryptography',
    severity: 'High',
    description: 'Insecure cryptography detected.',
    recommendation: 'Use strong cryptographic algorithms and proper key management.',
    patterns: [
      { key: 'md5', pattern: 'md5' },
      { key: 'sha1', pattern: 'sha1' },
      { key: 'insecure-cipher', pattern: 'DES|3DES|RC4' }
    ]
  },
  
  // SonarQube - Null Dereference
  {
    id: 'sonarqube-null-dereference',
    name: 'SonarQube - Null Dereference',
    severity: 'Medium',
    description: 'Null dereference detected.',
    recommendation: 'Check for null values before accessing object properties or methods.',
    patterns: [
      { key: 'null-dereference', pattern: '\.\w+\s*=\s*.*\|\|\s*null' },
      { key: 'unsafe-property-access', pattern: '\.\w+\s*=\s*.*[+].*' }
    ]
  },
  
  // SonarQube - Resource Leak
  {
    id: 'sonarqube-resource-leak',
    name: 'SonarQube - Resource Leak',
    severity: 'Medium',
    description: 'Resource leak detected.',
    recommendation: 'Ensure all resources are properly closed or released after use.',
    patterns: [
      { key: 'resource-leak', pattern: 'fs\.createReadStream\(|fs\.createWriteStream\(' },
      { key: 'unclosed-connection', pattern: 'createConnection\(|connect\(' }
    ]
  }
];

module.exports = sonarQubeSecurityRules;