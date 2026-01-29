const devopsSecurityRules = [
  {
    id: 'cicd-pipeline-security',
    name: 'CI/CD Pipeline Security',
    severity: 'High',
    description: 'Potential CI/CD pipeline security issue',
    recommendation: 'Secure CI/CD pipelines with proper authentication and authorization. Use secrets management for credentials.',
    patterns: [
      { key: 'cicd', pattern: 'Jenkins|GitHub Actions|GitLab CI|CircleCI|Travis CI|CI/CD|ci/cd' },
      { key: 'pipeline', pattern: 'pipeline|workflow|job|stage|step' }
    ]
  },
  {
    id: 'cicd-secrets-management',
    name: 'CI/CD Secrets Management',
    severity: 'Critical',
    description: 'Potential CI/CD secrets management issue',
    recommendation: 'Use secure secrets management in CI/CD pipelines. Avoid hardcoding credentials in pipeline files.',
    patterns: [
      { key: 'secrets', pattern: 'secret|token|key|password|credential|auth' },
      { key: 'cicd-file', pattern: 'Jenkinsfile|.github/workflows/|.gitlab-ci.yml|circle.yml|travis.yml' }
    ]
  },
  {
    id: 'infrastructure-as-code-security',
    name: 'Infrastructure as Code Security',
    severity: 'High',
    description: 'Potential Infrastructure as Code security issue',
    recommendation: 'Scan IaC files for security vulnerabilities. Use secure defaults and least privilege principles.',
    patterns: [
      { key: 'iac', pattern: 'Terraform|terraform|CloudFormation|cloudformation|Ansible|ansible|Pulumi|pulumi|Chef|chef|Puppet|puppet' },
      { key: 'iac-file', pattern: '\.tf$|\.yml$|\.yaml$|\.json$' }
    ]
  },
  {
    id: 'automated-deployment-security',
    name: 'Automated Deployment Security',
    severity: 'Medium',
    description: 'Potential automated deployment security issue',
    recommendation: 'Implement secure deployment practices. Use deployment keys with limited scope. Validate deployments.',
    patterns: [
      { key: 'deployment', pattern: 'deploy|deployment|publish|release|rollout' },
      { key: 'automation', pattern: 'automate|automation|script|bash|sh|powershell|ps1' }
    ]
  },
  {
    id: 'build-environment-security',
    name: 'Build Environment Security',
    severity: 'Medium',
    description: 'Potential build environment security issue',
    recommendation: 'Secure build environments. Use isolated containers. Clean up build artifacts and credentials.',
    patterns: [
      { key: 'build', pattern: 'build|compile|assemble|package' },
      { key: 'environment', pattern: 'environment|env|build|ci|cd' }
    ]
  },
  {
    id: 'code-quality-security',
    name: 'Code Quality and Security Scanning',
    severity: 'Low',
    description: 'Missing code quality or security scanning',
    recommendation: 'Integrate code quality tools and security scanners into CI/CD pipelines.',
    patterns: [
      { key: 'code-quality', pattern: 'ESLint|eslint|Prettier|prettier|SonarQube|sonarqube|Quality|quality' },
      { key: 'security-scan', pattern: 'Scan|scan|Security|security|Vulnerability|vulnerability' }
    ]
  },
  {
    id: 'version-control-security',
    name: 'Version Control Security',
    severity: 'Medium',
    description: 'Potential version control security issue',
    recommendation: 'Implement branch protection. Require code reviews. Use signed commits. Limit repository access.',
    patterns: [
      { key: 'version-control', pattern: 'Git|git|GitHub|github|GitLab|gitlab|Bitbucket|bitbucket' },
      { key: 'repository', pattern: 'repository|repo|branch|commit|pull request|merge request' }
    ]
  },
  {
    id: 'devops-permissions',
    name: 'DevOps Permissions Management',
    severity: 'High',
    description: 'Potential DevOps permissions management issue',
    recommendation: 'Implement least privilege principle. Regularly review and rotate access credentials.',
    patterns: [
      { key: 'permissions', pattern: 'permission|role|access|auth|login|credential' },
      { key: 'devops-tool', pattern: 'Jenkins|GitHub|GitLab|CircleCI|AWS|Azure|GCP' }
    ]
  },
  {
    id: 'devops-audit-logging',
    name: 'DevOps Audit Logging',
    severity: 'Medium',
    description: 'Potential DevOps audit logging issue',
    recommendation: 'Enable audit logging for all DevOps tools and activities. Monitor for suspicious actions.',
    patterns: [
      { key: 'audit', pattern: 'audit|log|logging|monitor|monitoring' },
      { key: 'devops-tool', pattern: 'Jenkins|GitHub|GitLab|CircleCI|AWS|Azure|GCP' }
    ]
  },
  {
    id: 'devops-security-gates',
    name: 'DevOps Security Gates',
    severity: 'Medium',
    description: 'Missing security gates in DevOps pipeline',
    recommendation: 'Implement security gates at each stage of the CI/CD pipeline. Block deployments with security issues.',
    patterns: [
      { key: 'security-gate', pattern: 'gate|check|validate|verify|test|scan' },
      { key: 'pipeline', pattern: 'pipeline|workflow|stage|step' }
    ]
  }
];

module.exports = devopsSecurityRules;