const sqlInjectionRules = [
  {
    id: 'sql-injection-sequelize',
    name: 'SQL Injection via Sequelize',
    severity: 'High',
    description: 'Potential SQL injection through user input in Sequelize queries',
    recommendation: 'Always use parameterized queries or Sequelize\'s built-in query builders. Never concatenate user input directly into SQL queries.',
    patterns: [
      { key: 'sequelize-user-input', pattern: '\\b(sequelize|mysql|pg|sqlite|mssql)\\b.*(?:req\\.|params|query|body)' }
    ]
  },
  {
    id: 'sql-injection-dynamic-query',
    name: 'Dynamic SQL Query',
    severity: 'High',
    description: 'Dynamic SQL query construction',
    recommendation: 'Use parameterized queries or prepared statements instead of dynamic query construction.',
    patterns: [
      { key: 'dynamic-query', pattern: 'query\\s*\\(\\s*["\'][^"\']*["\']\\s*\\+' }
    ]
  },
  {
    id: 'sql-injection-dynamic-execute',
    name: 'Dynamic SQL Execution',
    severity: 'High',
    description: 'Dynamic SQL execution',
    recommendation: 'Use parameterized queries or prepared statements instead of dynamic execution.',
    patterns: [
      { key: 'dynamic-execute', pattern: 'execute\\s*\\(\\s*["\'][^"\']*["\']\\s*\\+' }
    ]
  },
  {
    id: 'sql-injection-where-clause',
    name: 'SQL WHERE Clause User Input',
    severity: 'High',
    description: 'Direct user input in SQL WHERE clause',
    recommendation: 'Use parameterized queries or prepared statements. Never concatenate user input directly into WHERE clauses.',
    patterns: [
      { key: 'where-clause-user-input', pattern: 'SELECT\\s+.*\\s+FROM\\s+.*\\s+WHERE\\s+.*\\s*=.*(?:req\\.|params|query|body)', flags: 'i' }
    ]
  },
  {
    id: 'sql-injection-insert',
    name: 'SQL INSERT Statement',
    severity: 'Medium',
    description: 'SQL INSERT statement - review for input sanitization',
    recommendation: 'Use parameterized queries or prepared statements for INSERT operations.',
    patterns: [
      { key: 'insert-statement', pattern: 'INSERT\\s+INTO\\s+.*VALUES\\s*\\(', flags: 'i' }
    ]
  }
];

module.exports = sqlInjectionRules;