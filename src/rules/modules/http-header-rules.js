const httpHeaderRules = [
  {
    id: 'http-header-injection-response',
    name: 'Response Header Injection',
    severity: 'High',
    description: 'Potential HTTP header injection vulnerability in response headers',
    recommendation: 'Validate and sanitize all user input before setting response headers. Filter out newlines and control characters.',
    patterns: [
      { key: 'response-set', pattern: 'response\\.set|res\\.header|res\\.setHeader|headers\\.append' }
    ]
  },
  {
    id: 'http-header-injection-request',
    name: 'Request Header Injection',
    severity: 'High',
    description: 'Potential HTTP header injection vulnerability in request headers',
    recommendation: 'Avoid using user-provided data directly in request headers. Use whitelist validation for input.',
    patterns: [
      { key: 'request-header', pattern: 'headers\\s*[:=][^{]*\\{|fetch\\(.*headers|axios\\.defaults\\.headers' }
    ]
  },
  {
    id: 'http-header-injection-location',
    name: 'Location Header Injection',
    severity: 'High',
    description: 'Potential HTTP header injection in Location header',
    recommendation: 'Validate redirect URLs to ensure they point to trusted domains. Avoid open redirect vulnerabilities.',
    patterns: [
      { key: 'location-header', pattern: 'location\\s*[:=]\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'http-header-cache-control',
    name: 'Cache Control Bypass',
    severity: 'Medium',
    description: 'Potential cache control header manipulation',
    recommendation: 'Fix cache control policies to prevent client input from affecting cache control headers.',
    patterns: [
      { key: 'cache-control', pattern: 'cache-control|pragma|expires' }
    ]
  },
  {
    id: 'http-header-csp',
    name: 'CSP Bypass',
    severity: 'High',
    description: 'Potential Content Security Policy header manipulation',
    recommendation: 'Fix Content Security Policy to prevent client input from affecting CSP headers.',
    patterns: [
      { key: 'csp-header', pattern: 'content-security-policy|csp' }
    ]
  },
  {
    id: 'http-header-security-override',
    name: 'Security Header Override',
    severity: 'High',
    description: 'Potential security header override by user input',
    recommendation: 'Ensure security headers are not overridden by user input. Use server-side fixed header values.',
    patterns: [
      { key: 'security-header', pattern: 'strict-transport-security|x-frame-options|x-xss-protection|x-content-type-options' }
    ]
  },
  {
    id: 'http-header-x-content-type-options',
    name: 'Missing X-Content-Type-Options',
    severity: 'Medium',
    description: 'Missing X-Content-Type-Options header',
    recommendation: 'Set X-Content-Type-Options header to "nosniff" to prevent MIME-sniffing attacks.',
    patterns: [
      { key: 'missing-x-content-type', pattern: 'headers\\s*[:=]\\s*\{[^}]*$' }
    ]
  },
  {
    id: 'http-header-x-frame-options',
    name: 'Missing X-Frame-Options',
    severity: 'Medium',
    description: 'Missing X-Frame-Options header',
    recommendation: 'Set X-Frame-Options header to "DENY" or "SAMEORIGIN" to prevent clickjacking attacks.',
    patterns: [
      { key: 'missing-x-frame', pattern: 'headers\\s*[:=]\\s*\{[^}]*$' }
    ]
  },
  {
    id: 'http-header-x-xss-protection',
    name: 'Missing X-XSS-Protection',
    severity: 'Low',
    description: 'Missing X-XSS-Protection header',
    recommendation: 'Set X-XSS-Protection header to "1; mode=block" to enable browser XSS filtering.',
    patterns: [
      { key: 'missing-x-xss', pattern: 'headers\\s*[:=]\\s*\{[^}]*$' }
    ]
  },
  {
    id: 'http-header-strict-transport-security',
    name: 'Missing Strict-Transport-Security',
    severity: 'Medium',
    description: 'Missing Strict-Transport-Security header',
    recommendation: 'Set Strict-Transport-Security header to enforce HTTPS connections.',
    patterns: [
      { key: 'missing-hsts', pattern: 'headers\\s*[:=]\\s*\{[^}]*$' }
    ]
  },
  {
    id: 'http-header-referrer-policy',
    name: 'Missing Referrer-Policy',
    severity: 'Low',
    description: 'Missing Referrer-Policy header',
    recommendation: 'Set Referrer-Policy header to control how referrer information is sent.',
    patterns: [
      { key: 'missing-referrer', pattern: 'headers\\s*[:=]\\s*\{[^}]*$' }
    ]
  }
];

module.exports = httpHeaderRules;