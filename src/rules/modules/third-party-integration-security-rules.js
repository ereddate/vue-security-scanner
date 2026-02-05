const thirdPartyIntegrationSecurityRules = [
  {
    id: 'social-login-security',
    name: 'Social Login Security Issues',
    severity: 'High',
    description: 'Potential security issues with social login implementations',
    recommendation: 'Implement proper OAuth security measures. Validate state parameters. Use PKCE for public clients.',
    patterns: [
      { key: 'oauth-implicit-flow', pattern: 'response_type\\s*=\\s*["\']token["\']|response_type\\s*=\\s*["\']id_token["\']' },
      { key: 'missing-state-param', pattern: 'authorize\\s*\\(.*(?<!state:)client_id|(?<!state:)redirect_uri' },
      { key: 'pkce-missing', pattern: 'code_challenge|code_verifier' }
    ]
  },
  {
    id: 'sdk-security-issues',
    name: 'Third-Party SDK Security Issues',
    severity: 'Medium',
    description: 'Potential security issues with third-party SDKs',
    recommendation: 'Validate SDK permissions and capabilities. Regularly update SDKs. Audit SDK behaviors.',
    patterns: [
      { key: 'ad-sdk', pattern: 'adsbygoogle|doubleclick|googletag' },
      { key: 'analytics-sdk', pattern: 'gtag|ga\\(|analytics\\.track|trackEvent' },
      { key: 'tracking-sdk', pattern: 'fbq\\(|t\.wt|amplitude\\.' }
    ]
  },
  {
    id: 'third-party-script-security',
    name: 'Third-Party Script Security',
    severity: 'High',
    description: 'Potential security issues with third-party scripts',
    recommendation: 'Use Subresource Integrity (SRI) for external scripts. Implement strict CSP policies.',
    patterns: [
      { key: 'script-no-sri', pattern: '<script[^>]*src=["\'][^"\']*\\.js["\'][^>]*(?!integrity=)' },
      { key: 'iframe-src', pattern: '<iframe[^>]*src=["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'data-leakage-analytics',
    name: 'Analytics Data Leakage',
    severity: 'Medium',
    description: 'Potential sensitive data leakage through analytics',
    recommendation: 'Sanitize data sent to analytics services. Avoid sending sensitive information.',
    patterns: [
      { key: 'analytics-sensitive-data', pattern: '(gtag|ga|analytics)\\([^)]*password|token|key|secret|auth|credential|email|phone|address' },
      { key: 'tracking-sensitive-data', pattern: '(fbq|t\.wt|amplitude)\\([^)]*password|token|key|secret|auth|credential|email|phone|address' }
    ]
  }
];

module.exports = thirdPartyIntegrationSecurityRules;