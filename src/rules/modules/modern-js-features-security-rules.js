const modernJsFeaturesSecurityRules = [
  {
    id: 'proxy-reflection-security',
    name: 'Proxy and Reflection API Security',
    severity: 'High',
    description: 'Potential security issues with Proxy and Reflection APIs',
    recommendation: 'Be cautious when using Proxy for object virtualization. Validate handler traps to prevent unexpected behavior.',
    patterns: [
      { key: 'proxy-api', pattern: 'new\\s+Proxy\\s*\\(' },
      { key: 'reflect-api', pattern: 'Reflect\\.[a-zA-Z]+' },
      { key: 'proxy-handler-traps', pattern: 'get:\\s*function|set:\\s*function|apply:\\s*function|construct:\\s*function' }
    ]
  },
  {
    id: 'dynamic-import-security',
    name: 'Dynamic Import Security',
    severity: 'High',
    description: 'Potential security issues with dynamic imports',
    recommendation: 'Validate dynamic import paths. Avoid importing from user-controlled sources.',
    patterns: [
      { key: 'dynamic-import', pattern: 'import\\s*\\(\\s*[^"\'`][^)]*\\)' },  // Dynamic import with variable
      { key: 'dynamic-import-template', pattern: 'import\\s*\\(\\s*`[^`]*${[^}]+}[^`]*`\\s*\\)' }  // Template literal with interpolation
    ]
  },
  {
    id: 'eval-equivalent-security',
    name: 'Eval-like Functions Security',
    severity: 'Critical',
    description: 'Usage of eval-like functions that can execute arbitrary code',
    recommendation: 'Avoid using eval, Function constructor, setTimeout/setInterval with string arguments, and similar functions with user input.',
    patterns: [
      { key: 'function-constructor', pattern: 'new\\s+Function\\s*\\(' },
      { key: 'settimeout-string', pattern: 'setTimeout\\s*\\(\\s*["\'][^"\']*["\']\\s*,\\s*\\d+\\s*\\)' },
      { key: 'setinterval-string', pattern: 'setInterval\\s*\\(\\s*["\'][^"\']*["\']\\s*,\\s*\\d+\\s*\\)' },
      { key: 'execscript', pattern: 'execScript' }
    ]
  },
  {
    id: 'prototype-pollution-prevention',
    name: 'Prototype Pollution Prevention',
    severity: 'High',
    description: 'Potential for prototype pollution vulnerabilities',
    recommendation: 'Validate and sanitize object property assignments. Avoid deep merging of untrusted objects.',
    patterns: [
      { key: 'prototype-assignment', pattern: '\\.__proto__\\s*=|\\.constructor\\.prototype\\s*=' },
      { key: 'deep-merge', pattern: 'Object\\.assign\\s*\\(\\s*this|\\.extend\\s*\\(|\\.merge\\s*\\(' }
    ]
  },
  {
    id: 'module-import-security',
    name: 'Module Import Security',
    severity: 'Medium',
    description: 'Potential security issues with module imports',
    recommendation: 'Verify imported modules are from trusted sources. Be cautious with import maps.',
    patterns: [
      { key: 'import-map', pattern: '<script[^>]*type=["\']importmap["\'][^>]*>' },
      { key: 'dynamic-module-resolution', pattern: 'import\\.meta\\.resolve' }
    ]
  }
];

module.exports = modernJsFeaturesSecurityRules;