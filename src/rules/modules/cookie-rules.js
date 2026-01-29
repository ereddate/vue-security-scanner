const cookieRules = [
  {
    id: 'cookie-missing-secure',
    name: 'Cookie Without Secure Flag',
    severity: 'Medium',
    description: 'Cookie missing Secure flag',
    recommendation: 'Set the Secure flag on cookies to ensure they are only transmitted over HTTPS.',
    patterns: [
      { key: 'cookie-no-secure', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*secure\\b)["\'])' }
    ]
  },
  {
    id: 'cookie-missing-httponly',
    name: 'Cookie Without HttpOnly Flag',
    severity: 'High',
    description: 'Cookie missing HttpOnly flag',
    recommendation: 'Set the HttpOnly flag on cookies to prevent JavaScript access.',
    patterns: [
      { key: 'cookie-no-httponly', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*httponly\\b)["\'])' }
    ]
  },
  {
    id: 'cookie-missing-samesite-flag',
    name: 'Cookie Without SameSite Flag',
    severity: 'Medium',
    description: 'Cookie missing SameSite flag',
    recommendation: 'Set the SameSite attribute on cookies to prevent CSRF attacks.',
    patterns: [
      { key: 'cookie-no-samesite-flag', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*samesite\\b)["\'])' }
    ]
  },
  {
    id: 'cookie-missing-max-age',
    name: 'Cookie Without Max-Age or Expires',
    severity: 'Low',
    description: 'Cookie missing Max-Age or Expires attribute',
    recommendation: 'Set appropriate Max-Age or Expires attributes on cookies to control their lifetime.',
    patterns: [
      { key: 'cookie-no-expiry', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*(max-age|expires)\\b)["\'])', flags: 'i' }
    ]
  },
  {
    id: 'cookie-path-attribute',
    name: 'Cookie Path Attribute Issue',
    severity: 'Low',
    description: 'Cookie with overly broad Path attribute',
    recommendation: 'Set restrictive Path attributes on cookies to limit their scope to necessary paths.',
    patterns: [
      { key: 'cookie-path', pattern: 'path\\s*=\\s*["\']\/["\']' }
    ]
  },
  {
    id: 'cookie-domain-attribute',
    name: 'Cookie Domain Attribute Issue',
    severity: 'Low',
    description: 'Cookie with overly broad Domain attribute',
    recommendation: 'Avoid setting Domain attributes on cookies unless necessary, as it broadens their scope.',
    patterns: [
      { key: 'cookie-domain', pattern: 'domain\\s*=\\s*["\'][^"\']+["\']' }
    ]
  }
];

module.exports = cookieRules;