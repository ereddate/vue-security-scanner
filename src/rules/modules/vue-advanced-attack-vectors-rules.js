const vueAdvancedAttackVectorsRules = [
  {
    id: 'vue-component-injection',
    name: 'Vue Component Injection',
    severity: 'Critical',
    description: 'Potential Vue component injection vulnerability',
    recommendation: 'Validate and whitelist dynamic component imports. Never use user input for component loading.',
    patterns: [
      { key: 'dynamic-component', pattern: 'defineAsyncComponent\s*\(\s*[^)]*\w+\s*\)' },
      { key: 'component-import', pattern: 'import\s*\(\s*[^"\'`][^)]*\)' },
      { key: 'component-is', pattern: ':is\s*=\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'vue-template-injection',
    name: 'Vue Template Injection',
    severity: 'Critical',
    description: 'Potential Vue template injection vulnerability',
    recommendation: 'Never use user input as template strings. Use computed properties and proper data binding.',
    patterns: [
      { key: 'template-string', pattern: 'template\s*:\s*[`\'][^`\']*\$\{[^}]+\}[^`\']*[`\']' },
      { key: 'compile-template', pattern: 'compile\s*\(\s*[^"\'`][^)]*\)' },
      { key: 'render-function', pattern: 'render\s*:\s*function\s*\([^)]*\)\s*\{' }
    ]
  },
  {
    id: 'vue-reactive-system-exploit',
    name: 'Vue Reactive System Exploit',
    severity: 'High',
    description: 'Potential exploitation of Vue reactive system',
    recommendation: 'Validate all reactive data sources. Use shallowRef for large objects. Avoid reactive objects with user input.',
    patterns: [
      { key: 'reactive-user-input', pattern: 'reactive\s*\(\s*[^)]*\w+[^)]*\)' },
      { key: 'ref-user-input', pattern: 'ref\s*\(\s*[^"\'`][^)]*\)' },
      { key: 'computed-exploit', pattern: 'computed\s*\(\s*[^)]*\$\{[^}]+\}[^)]*\)' }
    ]
  },
  {
    id: 'vue-event-propagation',
    name: 'Vue Event Propagation Exploit',
    severity: 'Medium',
    description: 'Potential event propagation exploitation',
    recommendation: 'Use event modifiers properly. Validate event sources. Avoid using native DOM events without validation.',
    patterns: [
      { key: 'event-propagation', pattern: '@click\.stop|@click\.prevent|@click\.capture' },
      { key: 'native-event', pattern: 'v-on:[^=]+\.native|@[^=]+\.native' },
      { key: 'event-bus', pattern: 'EventBus|eventBus|$emit\s*\(' }
    ]
  },
  {
    id: 'vue-lifecycle-hook-exploit',
    name: 'Vue Lifecycle Hook Exploit',
    severity: 'Medium',
    description: 'Potential exploitation of Vue lifecycle hooks',
    recommendation: 'Validate data in lifecycle hooks. Avoid user input in created, mounted, and beforeMount hooks.',
    patterns: [
      { key: 'created-hook', pattern: 'created\s*:\s*function|created\s*\(\)\s*\{' },
      { key: 'mounted-hook', pattern: 'mounted\s*:\s*function|mounted\s*\(\)\s*\{' },
      { key: 'before-mount', pattern: 'beforeMount\s*:\s*function|beforeMount\s*\(\)\s*\{' }
    ]
  },
  {
    id: 'vue-directive-exploit',
    name: 'Vue Custom Directive Exploit',
    severity: 'High',
    description: 'Potential exploitation of custom directives',
    recommendation: 'Validate all input to custom directives. Use proper sanitization for DOM manipulation.',
    patterns: [
      { key: 'custom-directive', pattern: 'directives\s*:\s*\{' },
      { key: 'directive-def', pattern: 'Vue\.directive\s*\(' },
      { key: 'directive-binding', pattern: 'binding\.value|vnode\.context' }
    ]
  },
  {
    id: 'vue-mixin-exploit',
    name: 'Vue Mixin Exploit',
    severity: 'High',
    description: 'Potential exploitation of Vue mixins',
    recommendation: 'Validate mixin sources. Avoid dynamic mixin loading. Use proper mixin composition.',
    patterns: [
      { key: 'dynamic-mixin', pattern: 'mixins\s*:\s*\[\s*[^\[\]]*\w+[^\[\]]*\]' },
      { key: 'mixin-import', pattern: 'import\s*.*\s*from\s*["\'][^"\']*["\'].*mixin' },
      { key: 'global-mixin', pattern: 'Vue\.mixin\s*\(' }
    ]
  },
  {
    id: 'vue-provide-inject-exploit',
    name: 'Vue Provide/Inject Exploit',
    severity: 'Medium',
    description: 'Potential exploitation of Vue provide/inject API',
    recommendation: 'Validate injected values. Use Symbol keys for provide/inject. Avoid providing sensitive data.',
    patterns: [
      { key: 'provide-user-input', pattern: 'provide\s*\(\s*[^"\'][^,]+,\s*[^)]*\)' },
      { key: 'inject-unvalidated', pattern: 'inject\s*\(\s*[^"\'][^)]*\)' },
      { key: 'provide-object', pattern: 'provide\s*\(\s*\{[^}]+\}\s*\)' }
    ]
  }
];

module.exports = vueAdvancedAttackVectorsRules;