const supplyChainRules = [
  {
    id: 'third-party-service-security',
    name: 'Third-Party Service Security',
    severity: 'High',
    description: 'Potential third-party service security issue',
    recommendation: 'Evaluate third-party services for security risks. Implement proper access controls and monitoring.',
    patterns: [
      { key: 'third-party-api', pattern: 'fetch\\(\\s*["\']https:\\/\\/[^"\']*["\']' },
      { key: 'external-service', pattern: 'axios\\.(get|post|put|delete|patch)\\(\\s*["\']https:\\/\\/[^"\']*["\']' }
    ]
  },
  {
    id: 'third-party-sdk-security',
    name: 'Third-Party SDK Security',
    severity: 'High',
    description: 'Potential third-party SDK security issue',
    recommendation: 'Verify third-party SDKs for security vulnerabilities. Keep SDKs updated to latest versions.',
    patterns: [
      { key: 'sdk-import', pattern: 'import\\s+.*from\\s+["\'][^"\']*sdk["\']' },
      { key: 'sdk-require', pattern: 'require\\(\\s*["\'][^"\']*sdk["\']\\s*\\)' }
    ]
  },
  {
    id: 'third-party-api-security',
    name: 'Third-Party API Security',
    severity: 'Medium',
    description: 'Potential third-party API security issue',
    recommendation: 'Securely store third-party API keys. Implement rate limiting and error handling.',
    patterns: [
      { key: 'api-key', pattern: 'api_key|apiKey|apikey|API_KEY|API_KEYS' },
      { key: 'third-party-auth', pattern: 'Authorization|auth|token|secret' }
    ]
  },
  {
    id: 'supply-chain-attack',
    name: 'Supply Chain Attack Protection',
    severity: 'Critical',
    description: 'Potential supply chain attack vulnerability',
    recommendation: 'Implement software composition analysis (SCA). Verify package integrity and signatures.',
    patterns: [
      { key: 'npm-install', pattern: 'npm\\s+install|yarn\\s+add|pnpm\\s+add' },
      { key: 'package-json', pattern: 'package\\.json|package-lock\\.json|yarn\\.lock|pnpm-lock\\.yaml' }
    ]
  },
  {
    id: 'transitive-dependency-vulnerability',
    name: 'Transitive Dependency Vulnerability',
    severity: 'High',
    description: 'Potential transitive dependency vulnerability',
    recommendation: 'Regularly audit transitive dependencies. Use dependency locking and security scanners.',
    patterns: [
      { key: 'dependency-lock', pattern: 'package-lock\\.json|yarn\\.lock|pnpm-lock\\.yaml' },
      { key: 'dependency-audit', pattern: 'npm\\s+audit|yarn\\s+audit|pnpm\\s+audit' }
    ]
  },
  {
    id: 'build-process-security',
    name: 'Build Process Security',
    severity: 'Medium',
    description: 'Potential build process security issue',
    recommendation: 'Secure build environments. Implement build artifact signing and verification.',
    patterns: [
      { key: 'build-script', pattern: 'build|webpack|vite|rollup|parcel' },
      { key: 'ci-cd', pattern: 'CI|CD|Jenkins|GitHub Actions|GitLab CI|CircleCI' }
    ]
  },
  {
    id: 'deployment-process-security',
    name: 'Deployment Process Security',
    severity: 'Medium',
    description: 'Potential deployment process security issue',
    recommendation: 'Secure deployment pipelines. Implement environment isolation and access controls.',
    patterns: [
      { key: 'deploy-script', pattern: 'deploy|publish|release|push' },
      { key: 'environment-variables', pattern: 'process\\.env|ENV|env\\.' }
    ]
  },
  {
    id: 'dependency-license-security',
    name: 'Dependency License Security',
    severity: 'Low',
    description: 'Potential dependency license security issue',
    recommendation: 'Verify dependency licenses for compliance. Use license scanning tools.',
    patterns: [
      { key: 'license', pattern: 'license|licenses|LICENSE|LICENSES' },
      { key: 'dependency-list', pattern: 'dependencies|devDependencies|peerDependencies|optionalDependencies' }
    ]
  },
  {
    id: 'code-signing',
    name: 'Missing Code Signing',
    severity: 'Medium',
    description: 'Potential missing code signing',
    recommendation: 'Implement code signing for build artifacts. Verify signatures during deployment.',
    patterns: [
      { key: 'signing', pattern: 'sign|signature|verify|certificate|cert' },
      { key: 'artifact', pattern: 'build|dist|artifact|release' }
    ]
  },
  {
    id: 'source-code-integrity',
    name: 'Source Code Integrity',
    severity: 'High',
    description: 'Potential source code integrity issue',
    recommendation: 'Implement Git commit signing. Use branch protection and merge request reviews.',
    patterns: [
      { key: 'git', pattern: 'git\\s+commit|git\\s+push|git\\s+pull|git\\s+merge' },
      { key: 'repository', pattern: 'GitHub|GitLab|Bitbucket|Gitee' }
    ]
  }
];

module.exports = supplyChainRules;