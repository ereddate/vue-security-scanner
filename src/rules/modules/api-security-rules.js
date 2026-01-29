const apiSecurityRules = [
  {
    id: 'api-rate-limiting-bypass',
    name: 'API Rate Limiting Bypass',
    severity: 'High',
    description: 'Potential API rate limiting bypass vulnerability',
    recommendation: 'Implement proper rate limiting with consistent identifiers (e.g., IP, API key) and verify implementation.',
    patterns: [
      { key: 'rate-limit-bypass', pattern: 'X-Forwarded-For|X-Real-IP|X-Originating-IP' },
      { key: 'api-key-rotation', pattern: 'api_key|apiKey|token|auth.*=.*[a-zA-Z0-9]{32,}' }
    ]
  },
  {
    id: 'api-version-control',
    name: 'API Version Control Security',
    severity: 'Medium',
    description: 'Potential API version control security issue',
    recommendation: 'Implement secure API versioning (e.g., URL path, header) and maintain consistent security across versions.',
    patterns: [
      { key: 'api-version', pattern: 'api/v[0-9]+|/v[0-9]+/api|Accept-Version' },
      { key: 'version-header', pattern: 'X-API-Version|Api-Version' }
    ]
  },
  {
    id: 'api-data-leakage',
    name: 'API Response Data Leakage',
    severity: 'High',
    description: 'Potential API response data leakage',
    recommendation: 'Return only necessary data in API responses. Implement proper data filtering and masking.',
    patterns: [
      { key: 'sensitive-data', pattern: 'password|token|key|secret|auth|credential|ssn|credit|card' },
      { key: 'api-response', pattern: 'res\.json|res\.send|response\.json|response\.send' }
    ]
  },
  {
    id: 'api-auth-bypass',
    name: 'API Authentication Bypass',
    severity: 'Critical',
    description: 'Potential API authentication bypass vulnerability',
    recommendation: 'Implement strong authentication for all API endpoints. Use secure token validation and session management.',
    patterns: [
      { key: 'auth-check', pattern: 'if\\s*\\(!.*auth|if\\s*\\(!.*token|if\\s*\\(!.*user' },
      { key: 'api-endpoint', pattern: 'app\\.(get|post|put|delete|patch)\\s*\\(\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'api-authorization-bypass',
    name: 'API Authorization Bypass',
    severity: 'Critical',
    description: 'Potential API authorization bypass vulnerability',
    recommendation: 'Implement proper authorization checks for all API endpoints. Verify user permissions before granting access.',
    patterns: [
      { key: 'role-check', pattern: 'if\\s*\\(!.*role|if\\s*\\(!.*permission|if\\s*\\(!.*admin' },
      { key: 'resource-access', pattern: 'req\\.params\\.id|req\\.body\\.id|req\\.query\\.id' }
    ]
  },
  {
    id: 'api-input-validation',
    name: 'API Input Validation',
    severity: 'High',
    description: 'Potential API input validation issue',
    recommendation: 'Validate all API inputs thoroughly. Use schema validation and parameter sanitization.',
    patterns: [
      { key: 'api-input', pattern: 'req\\.body|req\\.params|req\\.query' },
      { key: 'missing-validation', pattern: 'req\\.body\\.[a-zA-Z0-9_]+|req\\.params\\.[a-zA-Z0-9_]+|req\\.query\\.[a-zA-Z0-9_]+' }
    ]
  },
  {
    id: 'api-error-handling',
    name: 'API Error Handling Leakage',
    severity: 'Medium',
    description: 'Potential API error handling information leakage',
    recommendation: 'Implement generic error messages for API responses. Log detailed errors internally only.',
    patterns: [
      { key: 'error-response', pattern: 'res\\.status\\(500\\)|res\\.status\\(400\\)|throw\\s+new\\s+Error' },
      { key: 'stack-trace', pattern: 'error\\.stack|err\\.stack' }
    ]
  },
  {
    id: 'api-cache-security',
    name: 'API Cache Security',
    severity: 'Medium',
    description: 'Potential API cache security issue',
    recommendation: 'Implement proper cache control for API responses. Avoid caching sensitive data.',
    patterns: [
      { key: 'cache-control', pattern: 'Cache-Control|cache-control|max-age|s-maxage' },
      { key: 'api-cache', pattern: 'cache\\s*\\(|set\\s*Cache|cacheable' }
    ]
  },
  {
    id: 'api-log-security',
    name: 'API Log Security',
    severity: 'Medium',
    description: 'Potential API log security issue',
    recommendation: 'Implement proper log masking for sensitive data. Use secure logging practices.',
    patterns: [
      { key: 'logging', pattern: 'console\\.log|console\\.error|logger\\.|log\\(' },
      { key: 'sensitive-log', pattern: 'password|token|key|secret|auth|credential' }
    ]
  },
  {
    id: 'api-cors-security',
    name: 'API CORS Security',
    severity: 'Medium',
    description: 'Potential API CORS security misconfiguration',
    recommendation: 'Configure CORS properly. Avoid using wildcard origins in production.',
    patterns: [
      { key: 'cors-config', pattern: 'cors\\(|Access-Control-Allow-Origin' },
      { key: 'cors-wildcard', pattern: 'origin\\s*[:=]\\s*["\']\\*["\']' }
    ]
  },
  {
    id: 'api-timeout',
    name: 'API Timeout Handling',
    severity: 'Low',
    description: 'Potential API timeout handling issue',
    recommendation: 'Implement proper timeout handling for API requests to prevent DoS attacks.',
    patterns: [
      { key: 'timeout', pattern: 'timeout\\s*[:=]|setTimeout|clearTimeout' },
      { key: 'api-request', pattern: 'fetch\\(|axios\\.|http\\.|https\\.' }
    ]
  },
  {
    id: 'api-pagination',
    name: 'API Pagination Security',
    severity: 'Low',
    description: 'Potential API pagination security issue',
    recommendation: 'Implement proper pagination for large datasets. Validate pagination parameters to prevent DoS attacks.',
    patterns: [
      { key: 'pagination', pattern: 'page|limit|offset|skip|take' },
      { key: 'query-params', pattern: 'req\\.query\\.page|req\\.query\\.limit' }
    ]
  }
];

module.exports = apiSecurityRules;