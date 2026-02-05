const codeQualityAndMaintenanceSecurityRules = [
  {
    id: 'code-quality-security',
    name: 'Code Quality Security',
    severity: 'Low',
    description: 'Code quality issues may have security implications',
    recommendation: 'Ensure code quality to prevent security vulnerabilities.',
    patterns: [
      { key: 'code-quality-tool', pattern: 'eslint|prettier|tslint' },
      { key: 'quality-config', pattern: '\.eslintrc|\.prettierrc|tsconfig\\.json' }
    ]
  },
  {
    id: 'code-maintenance-security',
    name: 'Code Maintenance Security',
    severity: 'Low',
    description: 'Code maintenance issues may have security implications',
    recommendation: 'Ensure code maintainability to prevent security vulnerabilities.',
    patterns: [
      { key: 'maintenance-config', pattern: 'maintenance|refactoring|technical\\s*debt' },
      { key: 'code-comment', pattern: '\\/\\/|\\/\\*|\\*\\/' }
    ]
  },
  {
    id: 'component-design-security',
    name: 'Component Design Security',
    severity: 'Medium',
    description: 'Component design may have security vulnerabilities',
    recommendation: 'Ensure components are designed securely.',
    patterns: [
      { key: 'component-design', pattern: 'component|Component|Vue\\s*component' },
      { key: 'props-validation', pattern: 'props\\s*:\\s*\\{|defineProps' }
    ]
  },
  {
    id: 'code-organization-security',
    name: 'Code Organization Security',
    severity: 'Low',
    description: 'Code organization may have security implications',
    recommendation: 'Ensure code is organized securely.',
    patterns: [
      { key: 'code-organization', pattern: 'folder|directory|module|namespace' },
      { key: 'import-statement', pattern: 'import\\s+|from\\s+|require\\s*\(' }
    ]
  },
  {
    id: 'error-handling-security',
    name: 'Error Handling Security',
    severity: 'Medium',
    description: 'Error handling may have security vulnerabilities',
    recommendation: 'Implement proper error handling to prevent security issues.',
    patterns: [
      { key: 'error-handling', pattern: 'try\\s*\{|catch\\s*\(|finally\\s*\{' },
      { key: 'error-object', pattern: 'Error|error|Exception' }
    ]
  },
  {
    id: 'logging-security',
    name: 'Logging Security',
    severity: 'Medium',
    description: 'Logging may have security vulnerabilities',
    recommendation: 'Implement secure logging practices.',
    patterns: [
      { key: 'logging', pattern: 'console\\.log|console\\.error|logger' },
      { key: 'sensitive-log', pattern: 'password|token|api\\s*key' }
    ]
  },
  {
    id: 'code-review-security',
    name: 'Code Review Security',
    severity: 'Low',
    description: 'Code review practices may have security implications',
    recommendation: 'Implement secure code review practices.',
    patterns: [
      { key: 'code-review', pattern: 'code\\s*review|pull\\s*request|merge\\s*request' },
      { key: 'review-tool', pattern: 'github|gitlab|bitbucket' }
    ]
  },
  {
    id: 'documentation-security',
    name: 'Documentation Security',
    severity: 'Low',
    description: 'Documentation may have security implications',
    recommendation: 'Ensure documentation is secure and up-to-date.',
    patterns: [
      { key: 'documentation', pattern: 'readme|docs|documentation' },
      { key: 'api-doc', pattern: 'api\\s*doc|swagger|openapi' }
    ]
  },
  {
    id: 'version-control-security',
    name: 'Version Control Security',
    severity: 'Medium',
    description: 'Version control practices may have security implications',
    recommendation: 'Implement secure version control practices.',
    patterns: [
      { key: 'version-control', pattern: 'git|svn|mercurial' },
      { key: 'commit-message', pattern: 'commit|push|pull|branch' }
    ]
  },
  {
    id: 'build-process-security',
    name: 'Build Process Security',
    severity: 'Medium',
    description: 'Build processes may have security vulnerabilities',
    recommendation: 'Implement secure build processes.',
    patterns: [
      { key: 'build-process', pattern: 'build|webpack|vite|babel' },
      { key: 'build-script', pattern: 'package\\.json|scripts\\s*:\\s*\\{' }
    ]
  }
];

module.exports = codeQualityAndMaintenanceSecurityRules;