const performanceApisSecurityRules = [
  {
    id: 'timing-attack-leakage',
    name: 'Timing Attack Information Leakage',
    severity: 'Medium',
    description: 'Potential information leakage through timing APIs',
    recommendation: 'Be cautious with performance APIs that could reveal system information. Implement protections against timing attacks.',
    patterns: [
      { key: 'performance-now', pattern: 'performance\\.now\\s*\\(\\s*\\)' },
      { key: 'performance-timing', pattern: 'performance\\.timing' },
      { key: 'navigation-timing', pattern: 'performance\\.getEntriesByType\\s*\\(\\s*["\']navigation["\']' }
    ]
  },
  {
    id: 'resource-timing-leakage',
    name: 'Resource Timing Information Leakage',
    severity: 'Medium',
    description: 'Potential information leakage through Resource Timing API',
    recommendation: 'Be cautious when using Resource Timing API as it can reveal information about user\'s network activity and visited resources.',
    patterns: [
      { key: 'resource-timing', pattern: 'performance\\.getEntriesByType\\s*\\(\\s*["\']resource["\']' },
      { key: 'navigation-timing-api', pattern: 'performance\\.getEntriesByType\\s*\\(\\s*["\']navigation["\']' },
      { key: 'performance-entry', pattern: 'performance\\.getEntries\\s*\\(\\s*\\)' }
    ]
  },
  {
    id: 'performance-memory-leakage',
    name: 'Performance Memory Information Leakage',
    severity: 'Low',
    description: 'Potential information leakage through Performance Memory API',
    recommendation: 'Be cautious with performance.memory API as it reveals memory usage details.',
    patterns: [
      { key: 'performance-memory', pattern: 'performance\\.memory' }
    ]
  },
  {
    id: 'timing-attack-vulnerability',
    name: 'Timing Attack Vulnerability',
    severity: 'High',
    description: 'Potential vulnerability to timing attacks through precise timing',
    recommendation: 'Avoid using precise timing measurements in security-sensitive contexts. Implement constant-time algorithms.',
    patterns: [
      { key: 'high-resolution-time', pattern: 'performance\\.timeOrigin|performance\\.measure|performance\\.mark' }
    ]
  }
];

module.exports = performanceApisSecurityRules;