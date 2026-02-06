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
      { key: 'dynamic-import-template', pattern: 'import\\s*\\(\\s*`[^`]*\\${[^}]+}[^`]*`\\s*\\)' }  // Template literal with interpolation
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
  },
  {
    id: 'web-vitals-security',
    name: 'Web Vitals Security',
    severity: 'Medium',
    description: 'Potential security issues with Web Vitals monitoring',
    recommendation: 'Ensure Web Vitals monitoring does not expose sensitive performance data or user information.',
    patterns: [
      { key: 'web-vitals', pattern: 'getCLS|getFID|getFCP|getLCP|getTTFB' },
      { key: 'web-vitals-import', pattern: 'from\\s*["\']web-vitals["\']' }
    ]
  },
  {
    id: 'frontend-ai-ml-security',
    name: 'Frontend AI/ML Security',
    severity: 'High',
    description: 'Potential security issues with frontend AI/ML integration',
    recommendation: 'Ensure frontend AI/ML models are properly secured and do not expose sensitive data or intellectual property.',
    patterns: [
      { key: 'tensorflow-js', pattern: 'import\\s*.*from\\s*["\']@tensorflow/[^"]+["\']' },
      { key: 'ml5-js', pattern: 'ml5\\.' },
      { key: 'brain-js', pattern: 'new\\s+brain|brain\\.' },
      { key: 'onnx-js', pattern: 'from\\s*["\']onnxruntime["\']' }
    ]
  },
  {
    id: 'css-in-js-security',
    name: 'CSS-in-JS Security',
    severity: 'Medium',
    description: 'Potential security issues with CSS-in-JS libraries',
    recommendation: 'Ensure CSS-in-JS libraries are used safely and do not allow injection of malicious CSS.',
    patterns: [
      { key: 'styled-components', pattern: 'styled\\.[a-zA-Z]+|import\\s*.*from\\s*["\']styled-components["\']' },
      { key: 'emotion', pattern: 'import\\s*.*from\\s*["\']@emotion/[^"]+["\']' },
      { key: 'jss', pattern: 'import\\s*.*from\\s*["\']jss["\']' },
      { key: 'css-module-injection', pattern: '\\.styles\\.|:global\(|\\.css\\(' }
    ]
  },
  {
    id: 'frontend-build-tools-security',
    name: 'Frontend Build Tools Security',
    severity: 'High',
    description: 'Potential security issues with frontend build tools',
    recommendation: 'Ensure build tools are properly configured and do not expose sensitive information in build outputs.',
    patterns: [
      { key: 'webpack', pattern: 'webpack\\.config|from\\s*["\']webpack["\']' },
      { key: 'vite', pattern: 'vite\\.config|from\\s*["\']vite["\']' },
      { key: 'rollup', pattern: 'rollup\\.config|from\\s*["\']rollup["\']' },
      { key: 'esbuild', pattern: 'from\\s*["\']esbuild["\']' }
    ]
  },
  {
    id: 'frontend-testing-security',
    name: 'Frontend Testing Security',
    severity: 'Medium',
    description: 'Potential security issues with frontend testing frameworks',
    recommendation: 'Ensure test files do not contain hardcoded credentials or sensitive information.',
    patterns: [
      { key: 'jest', pattern: 'jest\\.|from\\s*["\']jest["\']' },
      { key: 'cypress', pattern: 'cypress\\.|from\\s*["\']cypress["\']' },
      { key: 'playwright', pattern: 'playwright\\.|from\\s*["\']playwright["\']' },
      { key: 'testing-library', pattern: 'from\\s*["\']@testing-library/[^"]+["\']' }
    ]
  },
  {
    id: 'modern-css-security',
    name: 'Modern CSS Security',
    severity: 'Medium',
    description: 'Potential security issues with modern CSS features',
    recommendation: 'Ensure modern CSS features are used safely and do not introduce security vulnerabilities.',
    patterns: [
      { key: 'css-variables', pattern: '--[a-zA-Z0-9-]+\\s*:' },
      { key: 'css-grid', pattern: 'display\\s*:\\s*grid' },
      { key: 'css-flexbox', pattern: 'display\\s*:\\s*flex' },
      { key: 'css-custom-properties', pattern: 'var\\(\\s*--[a-zA-Z0-9-]+' }
    ]
  },
  {
    id: 'frontend-monitoring-security',
    name: 'Frontend Monitoring Security',
    severity: 'Medium',
    description: 'Potential security issues with frontend monitoring tools',
    recommendation: 'Ensure frontend monitoring tools do not expose sensitive user data or application information.',
    patterns: [
      { key: 'sentry', pattern: 'Sentry\\.|from\\s*["\']@sentry/[^"]+["\']' },
      { key: 'new-relic', pattern: 'NewRelic\\.|from\\s*["\']newrelic["\']' },
      { key: 'datadog', pattern: 'DD_RUM\\.|from\\s*["\']@datadog/[^"]+["\']' },
      { key: 'segment', pattern: 'analytics\\.|from\\s*["\']analytics.js["\']' }
    ]
  },
  {
    id: 'frontend-caching-security',
    name: 'Frontend Caching Security',
    severity: 'High',
    description: 'Potential security issues with frontend caching strategies',
    recommendation: 'Ensure frontend caching strategies do not expose sensitive data or allow cache poisoning.',
    patterns: [
      { key: 'service-worker-cache', pattern: 'caches\\.|CacheStorage' },
      { key: 'local-storage', pattern: 'localStorage\\.|sessionStorage\\.' },
      { key: 'indexeddb', pattern: 'indexedDB\\.|IDBFactory' },
      { key: 'cache-api', pattern: 'Cache\\.|caches\\.' }
    ]
  },
  {
    id: 'frontend-performance-security',
    name: 'Frontend Performance Security',
    severity: 'Medium',
    description: 'Potential security issues with frontend performance optimization',
    recommendation: 'Ensure performance optimization techniques do not compromise security or expose sensitive information.',
    patterns: [
      { key: 'code-splitting', pattern: 'React\\.lazy|loadable\\(|dynamic\\(' },
      { key: 'tree-shaking', pattern: 'sideEffects\\s*:\\s*false' },
      { key: 'bundle-analyzer', pattern: 'webpack-bundle-analyzer|rollup-plugin-visualizer' },
      { key: 'prefetch', pattern: '<link[^>]*rel=["\']prefetch["\']' }
    ]
  }
];

module.exports = modernJsFeaturesSecurityRules;