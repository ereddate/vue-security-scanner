// src/rules/modules/third-party/eslint-rules.js
// ESLint 安全规则集集成

const eslintSecurityRules = [
  // ESLint 核心安全规则
  {
    id: 'eslint-no-eval',
    name: 'ESLint no-eval',
    severity: 'High',
    description: 'The use of eval() is a potential security risk.',
    recommendation: 'Avoid using eval() whenever possible. If you must use it, ensure the input is properly validated and sanitized.',
    patterns: [
      { key: 'eval-call', pattern: 'eval\s*\(' }
    ]
  },
  {
    id: 'eslint-no-new-func',
    name: 'ESLint no-new-func',
    severity: 'High',
    description: 'The use of new Function() is a potential security risk.',
    recommendation: 'Avoid using new Function() whenever possible. If you must use it, ensure the input is properly validated and sanitized.',
    patterns: [
      { key: 'new-function', pattern: 'new\\s+Function\\s*\\(' }
    ]
  },
  {
    id: 'eslint-no-implied-eval',
    name: 'ESLint no-implied-eval',
    severity: 'Medium',
    description: 'The use of setTimeout(), setInterval(), or execScript() with a string argument is a potential security risk.',
    recommendation: 'Avoid passing string arguments to setTimeout(), setInterval(), or execScript(). Use function arguments instead.',
    patterns: [
      { key: 'settimeout-string', pattern: 'setTimeout\s*\(\s*["\']' },
      { key: 'setinterval-string', pattern: 'setInterval\s*\(\s*["\']' },
      { key: 'execscript', pattern: 'execScript\s*\(' }
    ]
  },
  {
    id: 'eslint-no-script-url',
    name: 'ESLint no-script-url',
    severity: 'Medium',
    description: 'The use of javascript: URLs is a potential security risk.',
    recommendation: 'Avoid using javascript: URLs. Use event handlers instead.',
    patterns: [
      { key: 'script-url', pattern: 'javascript:' }
    ]
  },
  {
    id: 'eslint-no-dangerous-redirect',
    name: 'ESLint no-dangerous-redirect',
    severity: 'High',
    description: 'Dangerous redirect detected (using window.location with user input).',
    recommendation: 'Validate and sanitize redirect URLs to prevent open redirect vulnerabilities.',
    patterns: [
      { key: 'dangerous-redirect', pattern: 'window\.location\s*=\s*.*[+]' },
      { key: 'location-assign', pattern: 'window\.location\.assign\s*\(.*[+].*\)' },
      { key: 'location-replace', pattern: 'window\.location\.replace\s*\(.*[+].*\)' }
    ]
  },
  
  // ESLint Security Plugin Rules
  {
    id: 'eslint-security-no-xss',
    name: 'ESLint Security no-xss',
    severity: 'High',
    description: 'Potential XSS vulnerability detected.',
    recommendation: 'Ensure all user input is properly sanitized before being inserted into the DOM.',
    patterns: [
      { key: 'innerHTML-assign', pattern: 'innerHTML\s*=' },
      { key: 'outerHTML-assign', pattern: 'outerHTML\s*=' },
      { key: 'insertAdjacentHTML', pattern: 'insertAdjacentHTML\s*\(' },
      { key: 'document-write', pattern: 'document\.write\s*\(' },
      { key: 'document-writeln', pattern: 'document\.writeln\s*\(' }
    ]
  },
  {
    id: 'eslint-security-no-path-traversal',
    name: 'ESLint Security no-path-traversal',
    severity: 'High',
    description: 'Potential path traversal vulnerability detected.',
    recommendation: 'Validate and sanitize file paths to prevent path traversal attacks.',
    patterns: [
      { key: 'path-traversal', pattern: '\.\.\/' },
      { key: 'fs-read', pattern: 'fs\.read' },
      { key: 'fs-write', pattern: 'fs\.write' }
    ]
  },
  {
    id: 'eslint-security-no-unsafe-regex',
    name: 'ESLint Security no-unsafe-regex',
    severity: 'Medium',
    description: 'Potentially unsafe regular expression detected.',
    recommendation: 'Avoid using regular expressions that may cause catastrophic backtracking.',
    patterns: [
      { key: 'unsafe-regex', pattern: '\\(\\[\\^\\]]\\*\\)\\+' },
      { key: 'regex-literal', pattern: '/.*\\(.*\\*.*\\).*/' }
    ]
  },
  {
    id: 'eslint-security-no-http-url',
    name: 'ESLint Security no-http-url',
    severity: 'Medium',
    description: 'Non-secure HTTP URL detected.',
    recommendation: 'Use HTTPS URLs instead of HTTP to ensure secure communication.',
    patterns: [
      { key: 'http-url', pattern: 'http://[^"\'\\s]+' }
    ]
  },
  
  // ESLint React 安全规则
  {
    id: 'eslint-react-no-danger',
    name: 'ESLint React no-danger',
    severity: 'High',
    description: 'The use of dangerouslySetInnerHTML is a potential security risk.',
    recommendation: 'Avoid using dangerouslySetInnerHTML whenever possible. If you must use it, ensure the content is properly sanitized.',
    patterns: [
      { key: 'dangerously-set-inner-html', pattern: 'dangerouslySetInnerHTML' }
    ]
  },
  {
    id: 'eslint-react-no-script-urls',
    name: 'ESLint React no-script-urls',
    severity: 'Medium',
    description: 'The use of javascript: URLs in React is a potential security risk.',
    recommendation: 'Avoid using javascript: URLs in React. Use event handlers instead.',
    patterns: [
      { key: 'react-script-url', pattern: 'href=["\']javascript:' }
    ]
  },
  
  // ESLint Vue 安全规则
  {
    id: 'eslint-vue-no-v-html',
    name: 'ESLint Vue no-v-html',
    severity: 'High',
    description: 'The use of v-html is a potential security risk.',
    recommendation: 'Avoid using v-html whenever possible. If you must use it, ensure the content is properly sanitized.',
    patterns: [
      { key: 'v-html', pattern: 'v-html\s*=' }
    ]
  }
];

module.exports = eslintSecurityRules;