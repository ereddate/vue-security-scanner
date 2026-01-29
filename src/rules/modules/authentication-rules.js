const authenticationRules = [
  {
    id: 'jwt-algorithm-confusion',
    name: 'JWT Algorithm Confusion',
    severity: 'High',
    description: 'Potential JWT algorithm confusion attack',
    recommendation: 'Always explicitly specify algorithm in JWT verification. Do not accept "none" algorithm.',
    patterns: [
      { key: 'jwt-verify', pattern: 'jwt\\.verify\\s*\\(' },
      { key: 'jwt-none', pattern: 'algorithm\\s*[:=]\\s*["\']none["\']' }
    ]
  },
  {
    id: 'session-fixation',
    name: 'Session Fixation',
    severity: 'High',
    description: 'Potential session fixation vulnerability',
    recommendation: 'Regenerate session ID after login. Use secure session management.',
    patterns: [
      { key: 'session-set', pattern: 'req\\.session\\.(id|userId)\\s*=' },
      { key: 'session-login', pattern: '\\.login\\s*\\(|\\.authenticate\\s*\\(' }
    ]
  },
  {
    id: 'privilege-escalation',
    name: 'Privilege Escalation',
    severity: 'High',
    description: 'Potential privilege escalation vulnerability',
    recommendation: 'Always verify user permissions before performing privileged operations.',
    patterns: [
      { key: 'admin-check', pattern: 'isAdmin|isSuperAdmin|role\\s*===\\s*["\']admin["\']' },
      { key: 'role-check', pattern: 'role\\s*===\\s*["\']user["\']|role\\s*===\\s*["\']guest["\']' }
    ]
  },
  {
    id: 'insecure-password-storage',
    name: 'Insecure Password Storage',
    severity: 'High',
    description: 'Potentially insecure password storage',
    recommendation: 'Never store passwords in plain text. Use bcrypt, scrypt, or argon2 for password hashing.',
    patterns: [
      { key: 'password-store', pattern: 'password\\s*[:=]\\s*["\'][^"\']+["\']' },
      { key: 'password-hash', pattern: 'md5\\s*\\(|sha1\\s*\\(|sha256\\s*\\(' }
    ]
  },
  {
    id: 'oauth-flow-vulnerability',
    name: 'OAuth Flow Vulnerability',
    severity: 'High',
    description: 'Potential OAuth flow vulnerability',
    recommendation: 'Use PKCE for public clients. Validate state parameter to prevent CSRF.',
    patterns: [
      { key: 'oauth-implicit', pattern: 'response_type\\s*=\\s*["\']token["\']' },
      { key: 'oauth-state', pattern: 'oauth.*redirect.*state' }
    ]
  },
  {
    id: 'password-complexity',
    name: 'Password Complexity Requirements',
    severity: 'Medium',
    description: 'Missing or weak password complexity requirements',
    recommendation: 'Implement strong password complexity requirements including length, uppercase, lowercase, numbers, and special characters.',
    patterns: [
      { key: 'password-validation', pattern: 'password\\s*=\\s*[^\\(]*$' },
      { key: 'weak-password', pattern: 'password\\s*=\\s*["\'][a-zA-Z0-9]{1,7}["\']' }
    ]
  },
  {
    id: 'account-lockout',
    name: 'Missing Account Lockout',
    severity: 'Medium',
    description: 'Missing account lockout mechanism',
    recommendation: 'Implement account lockout after multiple failed login attempts to prevent brute force attacks.',
    patterns: [
      { key: 'login-attempt', pattern: 'login\\s*\\(|authenticate\\s*\\(' },
      { key: 'password-check', pattern: 'password\\s*===|password\\s*==|bcrypt\\.compare' }
    ]
  },
  {
    id: 'two-factor-auth',
    name: 'Missing Two-Factor Authentication',
    severity: 'Medium',
    description: 'Missing two-factor authentication implementation',
    recommendation: 'Implement two-factor authentication for sensitive accounts and operations.',
    patterns: [
      { key: 'login-success', pattern: 'login\\s*success|authenticate\\s*success' },
      { key: 'session-create', pattern: 'session\\s*create|req\\.session' }
    ]
  }
];

module.exports = authenticationRules;