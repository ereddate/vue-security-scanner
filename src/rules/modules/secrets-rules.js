const secretsRules = [
  {
    id: 'hardcoded-password',
    name: 'Hardcoded Password',
    severity: 'High',
    description: 'Possible hardcoded password',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'password', pattern: "password\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-secret',
    name: 'Hardcoded Secret',
    severity: 'High',
    description: 'Possible hardcoded secret',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'secret', pattern: "secret\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-token',
    name: 'Hardcoded Token',
    severity: 'High',
    description: 'Possible hardcoded token',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'token', pattern: "token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-api-key',
    name: 'Hardcoded API Key',
    severity: 'High',
    description: 'Possible hardcoded API key',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'api-key', pattern: "api[_-]?key\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-private-key',
    name: 'Hardcoded Private Key',
    severity: 'High',
    description: 'Possible hardcoded private key',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'private-key', pattern: "private[_-]?key\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-auth-token',
    name: 'Hardcoded Auth Token',
    severity: 'High',
    description: 'Possible hardcoded auth token',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'auth-token', pattern: "auth[_-]?token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-access-token',
    name: 'Hardcoded Access Token',
    severity: 'High',
    description: 'Possible hardcoded access token',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'access-token', pattern: "access[_-]?token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-client-secret',
    name: 'Hardcoded Client Secret',
    severity: 'High',
    description: 'Possible hardcoded client secret',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'client-secret', pattern: "client[_-]?secret\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  }
];

module.exports = secretsRules;