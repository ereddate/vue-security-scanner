const xssRules = [
  {
    id: 'xss-v-html',
    name: 'XSS via v-html',
    severity: 'High',
    description: 'Using v-html can lead to XSS vulnerabilities if not properly sanitized',
    recommendation: 'Avoid using v-html with user-provided content. If necessary, sanitize the content using a library like DOMPurify.',
    patterns: [
      { key: 'v-html', pattern: 'v-html\\s*=|v-html:' }
    ]
  },
  {
    id: 'xss-dangerously-set-inner-html',
    name: 'XSS via dangerouslySetInnerHTML',
    severity: 'High',
    description: 'Using dangerouslySetInnerHTML can lead to XSS vulnerabilities',
    recommendation: 'Avoid using dangerouslySetInnerHTML with user-provided content. Sanitize the content before use.',
    patterns: [
      { key: 'dangerously-set-inner-html', pattern: 'dangerouslySetInnerHTML' }
    ]
  },
  {
    id: 'xss-interpolation',
    name: 'Template Injection',
    severity: 'Medium',
    description: 'Potentially unsafe interpolation',
    recommendation: 'Ensure interpolated values are properly sanitized before rendering.',
    patterns: [
      { key: 'interpolation', pattern: '\\{\\{\\s*(.*?)\\s*\\}\\}', flags: 'g' }
    ]
  },
  {
    id: 'dom-xss-location',
    name: 'DOM-based XSS (Location)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'location', pattern: 'document\\.location|window\\.location|location\\.href|location\\.hash|location\\.search' }
    ]
  },
  {
    id: 'dom-xss-write',
    name: 'DOM-based XSS (Write)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'document-write', pattern: 'document\\.write\\(|document\\.writeln\\(' }
    ]
  },
  {
    id: 'dom-xss-html',
    name: 'DOM-based XSS (HTML)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'inner-html', pattern: 'innerHTML|outerHTML|insertAdjacentHTML' }
    ]
  },
  {
    id: 'dom-xss-eval',
    name: 'DOM-based XSS (Eval)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'eval-function', pattern: 'eval\\s*\\(|new\\s+Function\\s*\\(' }
    ]
  },
  {
    id: 'dom-xss-timeout',
    name: 'DOM-based XSS (Timeout)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'timeout', pattern: "setTimeout\\s*\\(\\s*[\"'`]|setInterval\\s*\\(\\s*[\"'`]" }
    ]
  },
  {
    id: 'vue3-xss-teleport',
    name: 'Vue 3 Teleport XSS',
    severity: 'Medium',
    description: 'Potential XSS vulnerability via Vue 3 Teleport component',
    recommendation: 'Ensure Teleport targets are not controlled by user input. Validate and sanitize all Teleport-related data.',
    patterns: [
      { key: 'vue-teleport', pattern: '<Teleport|to\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'vue3-xss-suspense',
    name: 'Vue 3 Suspense XSS',
    severity: 'Medium',
    description: 'Potential XSS vulnerability via Vue 3 Suspense component',
    recommendation: 'Ensure Suspense fallback content is properly sanitized. Avoid user-controllable content in Suspense components.',
    patterns: [
      { key: 'vue-suspense', pattern: '<Suspense|fallback\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'react-xss-jsx',
    name: 'React JSX XSS',
    severity: 'High',
    description: 'Potential XSS vulnerability in React JSX',
    recommendation: 'Avoid using dangerouslySetInnerHTML. Use Reacts built-in escaping for user content.',
    patterns: [
      { key: 'react-jsx', pattern: 'JSX|jsx|React\.createElement' }
    ]
  },
  {
    id: 'angular-xss-bypass',
    name: 'Angular XSS Bypass',
    severity: 'High',
    description: 'Potential XSS vulnerability in Angular templates',
    recommendation: 'Avoid using [innerHTML] with user content. Use Angulars built-in sanitization.',
    patterns: [
      { key: 'angular-innerhtml', pattern: '\[innerHTML\]|innerHTML\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'dom-xss-events',
    name: 'DOM-based XSS (Events)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability via event handlers',
    recommendation: 'Avoid setting event handlers with user-controllable data. Use addEventListener with proper validation.',
    patterns: [
      { key: 'event-handler', pattern: 'onclick|onload|onerror|onmouseover|onkeydown|onkeyup|onkeypress' }
    ]
  },
  {
    id: 'dom-xss-script-src',
    name: 'DOM-based XSS (Script Source)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability via script source manipulation',
    recommendation: 'Avoid dynamically setting script sources. Use Content Security Policy to restrict script sources.',
    patterns: [
      { key: 'script-src', pattern: 'script\\.src\\s*=|createElement\\s*\\(\\s*["\']script["\']' }
    ]
  },
  {
    id: 'dom-xss-storage',
    name: 'DOM-based XSS (Storage)',
    severity: 'Medium',
    description: 'Potential DOM-based XSS vulnerability via local/session storage',
    recommendation: 'Avoid directly using storage values in DOM manipulation. Sanitize storage data before use.',
    patterns: [
      { key: 'storage', pattern: 'localStorage\\.|sessionStorage\\.' }
    ]
  },
  {
    id: 'xss-dynamic-components',
    name: 'XSS via Dynamic Components',
    severity: 'Medium',
    description: 'Potential XSS vulnerability via dynamic component rendering',
    recommendation: 'Validate component names before rendering. Avoid user-controllable component names.',
    patterns: [
      { key: 'dynamic-component', pattern: 'component\\s*=\\s*["\'][^"\']*["\']|<component\\s+is\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'xss-route-params',
    name: 'XSS via Route Parameters',
    severity: 'Medium',
    description: 'Potential XSS vulnerability via route parameters',
    recommendation: 'Sanitize route parameters before using them in templates or DOM manipulation.',
    patterns: [
      { key: 'route-params', pattern: '\\$route\\.params|\\$route\\.query|useParams|useLocation' }
    ]
  }
];

module.exports = xssRules;