const cloudDeploymentSecurityRules = [
  {
    id: 'cloud-configuration',
    name: 'Cloud Configuration Security',
    severity: 'Medium',
    description: 'Cloud deployment configuration may have security vulnerabilities',
    recommendation: 'Review cloud deployment configuration for security best practices.',
    patterns: [
      { key: 'cloud-config', pattern: 'cloud\\.config|serverless\\.yml|terraform\\.tf|docker-compose\\.yml' }
    ]
  },
  {
    id: 'container-security',
    name: 'Container Security',
    severity: 'Medium',
    description: 'Container configuration may have security vulnerabilities',
    recommendation: 'Review container configuration for security best practices.',
    patterns: [
      { key: 'dockerfile', pattern: 'Dockerfile' },
      { key: 'docker-compose', pattern: 'docker-compose\\.yml|docker-compose\\.yaml' }
    ]
  },
  {
    id: 'cdn-security',
    name: 'CDN Security',
    severity: 'Medium',
    description: 'CDN configuration may have security vulnerabilities',
    recommendation: 'Review CDN configuration for security best practices.',
    patterns: [
      { key: 'cdn-config', pattern: 'cdn|content\\s*delivery\\s*network' },
      { key: 'cdn-url', pattern: 'https?:\\/\\/[^"\']*\\.cloudfront\\.net|https?:\\/\\/[^"\']*\\.akamai\\.net|https?:\\/\\/[^"\']*\\.cloudflare\\.com' }
    ]
  },
  {
    id: 'serverless-security',
    name: 'Serverless Security',
    severity: 'Medium',
    description: 'Serverless configuration may have security vulnerabilities',
    recommendation: 'Review serverless configuration for security best practices.',
    patterns: [
      { key: 'serverless-config', pattern: 'serverless\\.yml|serverless\\.json|serverless\\.js' },
      { key: 'lambda-function', pattern: 'lambda|Lambda' }
    ]
  },
  {
    id: 'kubernetes-security',
    name: 'Kubernetes Security',
    severity: 'Medium',
    description: 'Kubernetes configuration may have security vulnerabilities',
    recommendation: 'Review Kubernetes configuration for security best practices.',
    patterns: [
      { key: 'kubernetes-config', pattern: 'k8s|kubernetes|kubeconfig' },
      { key: 'pod-config', pattern: 'pod|deployment|service' }
    ]
  },
  {
    id: 'database-security',
    name: 'Database Security',
    severity: 'High',
    description: 'Database configuration may have security vulnerabilities',
    recommendation: 'Review database configuration for security best practices.',
    patterns: [
      { key: 'database-connection', pattern: 'database|db|mysql|postgres|mongodb|redis' },
      { key: 'database-url', pattern: 'mysql://|postgres://|mongodb://|redis://' }
    ]
  },
  {
    id: 'api-gateway-security',
    name: 'API Gateway Security',
    severity: 'Medium',
    description: 'API Gateway configuration may have security vulnerabilities',
    recommendation: 'Review API Gateway configuration for security best practices.',
    patterns: [
      { key: 'api-gateway', pattern: 'api\\s*gateway|gateway' },
      { key: 'api-endpoint', pattern: 'api\\.|/api/' }
    ]
  },
  {
    id: 'identity-access-management',
    name: 'Identity and Access Management',
    severity: 'High',
    description: 'Identity and access management may have security vulnerabilities',
    recommendation: 'Implement proper identity and access management practices.',
    patterns: [
      { key: 'iam-config', pattern: 'iam|identity\\s*access\\s*management' },
      { key: 'role-config', pattern: 'role|permission|policy' }
    ]
  },
  {
    id: 'secret-management',
    name: 'Secret Management',
    severity: 'High',
    description: 'Secret management may have security vulnerabilities',
    recommendation: 'Implement secure secret management practices.',
    patterns: [
      { key: 'secret-config', pattern: 'secret|SecretsManager|KeyVault' },
      { key: 'env-variable', pattern: 'process\\.env|environment\\s*variable' }
    ]
  },
  {
    id: 'monitoring-security',
    name: 'Monitoring Security',
    severity: 'Medium',
    description: 'Monitoring configuration may have security vulnerabilities',
    recommendation: 'Review monitoring configuration for security best practices.',
    patterns: [
      { key: 'monitoring-config', pattern: 'monitoring|logs|metrics|alert' },
      { key: 'logging-config', pattern: 'log|Logging' }
    ]
  }
];

module.exports = cloudDeploymentSecurityRules;