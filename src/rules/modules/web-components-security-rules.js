const webComponentsSecurityRules = [
  {
    id: 'web-components-security',
    name: 'Web Components Security Issues',
    severity: 'Medium',
    description: 'Potential security issues with Web Components',
    recommendation: 'Implement proper validation for custom elements. Use secure shadow DOM practices. Sanitize template content.',
    patterns: [
      { key: 'custom-element', pattern: 'customElements\\.define\\s*\\(' },
      { key: 'shadow-dom', pattern: 'attachShadow\\s*\\(\\s*\\{[^}]*closed[^}]*\\}' },  // Closed shadow DOM can hide malicious content
      { key: 'template-element', pattern: '<template[^>]*>' }
    ]
  },
  {
    id: 'web-components-input-validation',
    name: 'Web Components Input Validation',
    severity: 'Medium',
    description: 'Missing input validation in Web Components',
    recommendation: 'Validate and sanitize all inputs to custom elements. Implement proper attribute observers.',
    patterns: [
      { key: 'observed-attributes', pattern: 'static\\s+get\\s+observedAttributes' },
      { key: 'attribute-change', pattern: 'attributeChangedCallback' }
    ]
  },
  {
    id: 'web-components-xss',
    name: 'Web Components XSS',
    severity: 'High',
    description: 'Potential XSS in Web Components',
    recommendation: 'Properly sanitize content inserted into shadow DOM. Use safe DOM manipulation methods.',
    patterns: [
      { key: 'shadow-dom-innerhtml', pattern: 'shadowRoot\\.innerHTML|shadowRoot\\.outerHTML' },
      { key: 'shadow-dom-insertadjacent', pattern: 'shadowRoot\\.insertAdjacentHTML' }
    ]
  }
];

module.exports = webComponentsSecurityRules;