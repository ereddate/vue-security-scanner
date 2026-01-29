const ssrRules = [
  {
    id: 'ssr-injection',
    name: 'SSR Injection',
    severity: 'High',
    description: 'Potential Server-Side Rendering injection',
    recommendation: 'Sanitize all user-provided data before rendering on the server.',
    patterns: [
      { key: 'ssr-render', pattern: 'renderToString|renderToStaticMarkup|renderToNodeStream' },
      { key: 'ssr-context', pattern: 'context\\.(req|res|url|query|params)' }
    ]
  },
  {
    id: 'ssr-template-injection',
    name: 'SSR Template Injection',
    severity: 'High',
    description: 'Potential template injection in SSR',
    recommendation: 'Avoid using user input in template strings. Use proper templating libraries.',
    patterns: [
      { key: 'template-literal', pattern: '`\\s*\\$\\{.*req\\.|params|query|body.*\\}\\s*`' },
      { key: 'template-concat', pattern: '\\+\\s*req\\.|params|query|body' }
    ]
  },
  {
    id: 'hydration-mismatch',
    name: 'Hydration Mismatch',
    severity: 'Medium',
    description: 'Potential hydration mismatch vulnerability',
    recommendation: 'Ensure server-rendered and client-rendered content match exactly.',
    patterns: [
      { key: 'hydration-mount', pattern: 'hydrate\\s*\\(|createSSRApp\\s*\\(' }
    ]
  }
];

module.exports = ssrRules;