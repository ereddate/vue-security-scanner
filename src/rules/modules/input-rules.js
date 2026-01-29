const inputRules = [
  {
    id: 'unsafe-dynamic-import',
    name: 'Unsafe Dynamic Import',
    severity: 'Medium',
    description: 'Potentially unsafe dynamic import',
    recommendation: 'Ensure dynamic imports use statically analyzable strings or properly validate the import path.',
    patterns: [
      { key: 'dynamic-import', pattern: "import\\s*\\(\\s*.*[^'\"].*\\s*\\)", flags: 'g' }
    ]
  },
  {
    id: 'route-params-unsafe',
    name: 'Unsafe Route Parameter Usage',
    severity: 'High',
    description: 'Route parameter used unsafely',
    recommendation: 'Sanitize and validate route parameters before using them in templates or DOM manipulation.',
    patterns: [
      { key: 'route-params', pattern: '\\$route\\.params|\\$route\\.query' }
    ]
  },
  {
    id: 'missing-input-validation',
    name: 'Missing Input Validation',
    severity: 'Medium',
    description: 'Input binding without apparent validation',
    recommendation: 'Add proper input validation and sanitization for all user inputs.',
    patterns: [
      { key: 'v-model', pattern: "v-model\\s*=\\s*[\"'][^\"']*[\"']", flags: 'g' }
    ]
  },
  {
    id: 'open-redirect',
    name: 'Potential Open Redirect',
    severity: 'Medium',
    description: 'Potential open redirect vulnerability in router navigation',
    recommendation: 'Validate redirect URLs against a whitelist of allowed domains/endpoints.',
    patterns: [
      { key: 'router-push', pattern: '(router\\.push|this\\.\\$router\\.push)\\s*\\(\\s*\\{' }
    ]
  },
  {
    id: 'sensitive-url-data',
    name: 'Sensitive Data in URL',
    severity: 'High',
    description: 'Sensitive data may be exposed in URL',
    recommendation: 'Avoid passing sensitive data in URLs as they can be logged in server logs and browser history.',
    patterns: [
      { key: 'url-location', pattern: 'location\\.href\\s*[+=].*(password|token|key|secret|auth|credential)' },
      { key: 'url-window', pattern: 'window\\.location\\s*[+=].*(password|token|key|secret|auth|credential)' },
      { key: 'url-fetch', pattern: "fetch\\s*\\(\\s*[\"'][^\"']*\\?(?=.*password|token|key|secret|auth|credential)" }
    ]
  },
  {
    id: 'input-validation-pattern',
    name: 'Missing Input Pattern Validation',
    severity: 'Low',
    description: 'Input without pattern validation',
    recommendation: 'Add pattern validation for inputs to ensure they match expected formats.',
    patterns: [
      { key: 'input', pattern: '<input\\s+[^>]*>' },
      { key: 'v-model-no-pattern', pattern: "v-model\\s*=\\s*[\"'][^\"']*[\"'][^>]*$" }
    ]
  },
  {
    id: 'input-validation-length',
    name: 'Missing Input Length Validation',
    severity: 'Low',
    description: 'Input without length validation',
    recommendation: 'Add length validation for inputs to prevent excessive data submission.',
    patterns: [
      { key: 'input-no-maxlength', pattern: '<input\\s+[^>]*[^maxlength][^>]*>' },
      { key: 'textarea-no-maxlength', pattern: '<textarea\\s+[^>]*[^maxlength][^>]*>' }
    ]
  },
  {
    id: 'input-validation-type',
    name: 'Missing Input Type Validation',
    severity: 'Low',
    description: 'Input without proper type validation',
    recommendation: 'Use appropriate input types (e.g., email, number, tel) to enable browser validation.',
    patterns: [
      { key: 'input-no-type', pattern: '<input\\s+[^type][^>]*>' },
      { key: 'input-type-text', pattern: '<input\\s+type\\s*=\\s*["\']text["\'][^>]*>' }
    ]
  },
  {
    id: 'unsafe-eval',
    name: 'Unsafe eval() Usage',
    severity: 'High',
    description: 'Potentially unsafe use of eval()',
    recommendation: 'Avoid using eval() with user input. Use safer alternatives like Function() or JSON.parse().',
    patterns: [
      { key: 'eval', pattern: 'eval\\s*\\(' },
      { key: 'new-function', pattern: 'new\\s+Function\\s*\\(' }
    ]
  },
  {
    id: 'unsafe-json-parse',
    name: 'Unsafe JSON.parse() Usage',
    severity: 'Medium',
    description: 'Potentially unsafe use of JSON.parse()',
    recommendation: 'Validate and sanitize input before parsing with JSON.parse().',
    patterns: [
      { key: 'json-parse', pattern: 'JSON\\.parse\\s*\\(' }
    ]
  }
];

module.exports = inputRules;