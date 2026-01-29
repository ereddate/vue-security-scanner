const injectionRules = [
  {
    id: 'nosql-injection',
    name: 'NoSQL Injection',
    severity: 'High',
    description: 'Potential NoSQL injection',
    recommendation: 'Use parameterized queries or input validation. Avoid concatenating user input.',
    patterns: [
      { key: 'nosql-mongo', pattern: '\\$where|\\$ne|\\$gt|\\$lt|\\$or|\\$and|\\$regex|\\$nin|\\$in' },
      { key: 'nosql-redis', pattern: 'redis\\.eval\\s*\\(' },
      { key: 'nosql-dynamo', pattern: 'DynamoDB|dynamodb' },
      { key: 'nosql-couchbase', pattern: 'Couchbase|couchbase' }
    ]
  },
  {
    id: 'graphql-injection',
    name: 'GraphQL Injection',
    severity: 'High',
    description: 'Potential GraphQL injection',
    recommendation: 'Use parameterized queries and validate input types. Avoid string interpolation in queries.',
    patterns: [
      { key: 'graphql-query', pattern: 'query\\s*\\(\\s*["\'][^"\']+\\$' },
      { key: 'graphql-mutation', pattern: 'mutation\\s*\\(\\s*["\'][^"\']+\\$' },
      { key: 'graphql-variables', pattern: 'variables\\s*=\\s*\\{' },
      { key: 'graphql-introspection', pattern: '__schema|__type|__field|__inputValue|__enumValue|__directive' },
      { key: 'graphql-batch', pattern: 'batch\\s*query|batch\\s*mutation' }
    ]
  },
  {
    id: 'ldap-injection',
    name: 'LDAP Injection',
    severity: 'High',
    description: 'Potential LDAP injection',
    recommendation: 'Use proper LDAP escaping libraries. Avoid string concatenation.',
    patterns: [
      { key: 'ldap-search', pattern: 'search\\s*\\(\\s*["\'][^"\']*\\*' },
      { key: 'ldap-filter', pattern: 'filter\\s*=\\s*["\'][^"\']*\\(' },
      { key: 'ldap-bind', pattern: 'bind\\s*\\(|authenticate\\s*\\(' }
    ]
  },
  {
    id: 'command-injection',
    name: 'Command Injection',
    severity: 'Critical',
    description: 'Potential command injection',
    recommendation: 'Never execute commands with user input. Use safe APIs instead.',
    patterns: [
      { key: 'exec', pattern: 'exec\\s*\\(|spawn\\s*\\(|execSync\\s*\\(' },
      { key: 'child-process', pattern: 'child_process\\.(exec|spawn)' },
      { key: 'shell-exec', pattern: 'shell\\.exec|sh\\.exec' },
      { key: 'system-call', pattern: 'system\\s*\\(|popen\\s*\\(' }
    ]
  },
  {
    id: 'xpath-injection',
    name: 'XPath Injection',
    severity: 'High',
    description: 'Potential XPath injection',
    recommendation: 'Use parameterized XPath queries. Avoid string concatenation.',
    patterns: [
      { key: 'xpath-query', pattern: 'evaluate\\s*\\(|selectNodes\\s*\\(' },
      { key: 'xpath-string', pattern: '"[^"]*" \+ "' },
      { key: 'xpath-nodes', pattern: 'selectSingleNode\\s*\\(|getElementsByTagName\\s*\\(' }
    ]
  },
  {
    id: 'template-injection',
    name: 'Template Injection',
    severity: 'High',
    description: 'Potential template injection',
    recommendation: 'Use safe templating libraries. Avoid string interpolation with user input.',
    patterns: [
      { key: 'template-string', pattern: '`[^`]*\\$\\{[^}]*\\}[^`]*`' },
      { key: 'template-engine', pattern: 'render\\s*\\(|compile\\s*\\(' },
      { key: 'ejs-template', pattern: 'ejs\\.render|ejs\\.compile' },
      { key: 'pug-template', pattern: 'pug\\.render|pug\\.compile' }
    ]
  },
  {
    id: 'csv-injection',
    name: 'CSV Injection',
    severity: 'Medium',
    description: 'Potential CSV injection',
    recommendation: 'Sanitize CSV output. Avoid user input in CSV headers or cells.',
    patterns: [
      { key: 'csv-write', pattern: 'writeFile\\s*\\(\\s*["\'].*\\.csv["\']' },
      { key: 'csv-export', pattern: 'export\\s*.*\\.csv' },
      { key: 'csv-parse', pattern: 'parse\\s*\\(\\s*["\'].*\\.csv["\']' }
    ]
  },
  {
    id: 'xml-injection',
    name: 'XML Injection',
    severity: 'High',
    description: 'Potential XML injection',
    recommendation: 'Use XML parsers with proper validation. Avoid string concatenation when building XML.',
    patterns: [
      { key: 'xml-build', pattern: 'createElement\\s*\\(|createTextNode\\s*\\(' },
      { key: 'xml-parse', pattern: 'parseFromString\\s*\\(|DOMParser' }
    ]
  },
  {
    id: 'json-injection',
    name: 'JSON Injection',
    severity: 'Medium',
    description: 'Potential JSON injection',
    recommendation: 'Validate JSON input. Avoid string concatenation when building JSON.',
    patterns: [
      { key: 'json-parse', pattern: 'JSON\\.parse\\s*\\(' },
      { key: 'json-stringify', pattern: 'JSON\\.stringify\\s*\\(' }
    ]
  },
  {
    id: 'yaml-injection',
    name: 'YAML Injection',
    severity: 'High',
    description: 'Potential YAML injection',
    recommendation: 'Use safe YAML parsers. Avoid parsing untrusted YAML input.',
    patterns: [
      { key: 'yaml-parse', pattern: 'yaml\\.parse|YAML\\.parse' },
      { key: 'yaml-load', pattern: 'yaml\\.load|YAML\\.load' }
    ]
  },
  {
    id: 'deserialization-injection',
    name: 'Deserialization Injection',
    severity: 'Critical',
    description: 'Potential deserialization injection',
    recommendation: 'Avoid deserializing untrusted data. Use safe deserialization methods.',
    patterns: [
      { key: 'deserialize', pattern: 'deserialize\\s*\\(|unserialize\\s*\\(' },
      { key: 'pickle-load', pattern: 'pickle\\.load|pickle\\.loads' }
    ]
  },
  {
    id: 'xxe-injection',
    name: 'XXE (XML External Entity) Injection',
    severity: 'Critical',
    description: 'Potential XXE injection',
    recommendation: 'Disable external entity processing in XML parsers. Use secure XML parsing configurations.',
    patterns: [
      { key: 'xml-parser', pattern: 'XMLParser|DocumentBuilderFactory' },
      { key: 'external-entity', pattern: 'ENTITY|SYSTEM|PUBLIC' }
    ]
  },
  {
    id: 'ssrf-injection',
    name: 'SSRF (Server-Side Request Forgery) Injection',
    severity: 'Critical',
    description: 'Potential SSRF injection',
    recommendation: 'Validate and sanitize all URL inputs. Implement network-level controls to restrict outbound requests.',
    patterns: [
      { key: 'http-request', pattern: 'http\\.get|https\\.get|fetch\\s*\\(' },
      { key: 'url-parse', pattern: 'url\\.parse|new\\s+URL' }
    ]
  }
];

module.exports = injectionRules;