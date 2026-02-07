const vue37FeaturesSecurityRules = [
  {
    id: 'vue-37-experimental-features',
    name: 'Vue 3.7 Experimental Features Security',
    severity: 'Medium',
    description: 'Vue 3.7 experimental features usage',
    recommendation: 'Review experimental features for stability and security before using in production.',
    patterns: [
      { key: 'experimental-import', pattern: 'from\\s*["\']vue/experimental["\']' },
      { key: 'experimental-flag', pattern: 'experimental\\s*:\\s*true' },
      { key: 'experimental-feature', pattern: 'useExperimental|experimental\\.' }
    ]
  },
  {
    id: 'vue-37-composition-api',
    name: 'Vue 3.7 Composition API Security',
    severity: 'Medium',
    description: 'Vue 3.7 Composition API usage with potential security concerns',
    recommendation: 'Review Composition API usage to ensure proper validation of reactive data sources.',
    patterns: [
      { key: 'to-value', pattern: 'toValue\\s*\\(' },
      { key: 'to-ref', pattern: 'toRef\\s*\\(' },
      { key: 'effect-scope', pattern: 'effectScope\\s*\\(' },
      { key: 'watch-effect', pattern: 'watchEffect\\s*\\(' }
    ]
  },
  {
    id: 'vue-37-vapor-mode',
    name: 'Vue 3.7 Vapor Mode Security',
    severity: 'Medium',
    description: 'Vue 3.7 Vapor mode usage with potential security concerns',
    recommendation: 'Review Vapor mode usage to ensure proper validation of compiled output and prevent potential injection vulnerabilities.',
    patterns: [
      { key: 'vapor-mode', pattern: 'vapor\\s*:\\s*true|vaporMode\\s*:\\s*true' },
      { key: 'vapor-compiler', pattern: '@vitejs/plugin-vue.*vapor|vue-loader.*vapor' },
      { key: 'vapor-build', pattern: 'vite.*vapor|webpack.*vapor' }
    ]
  },
  {
    id: 'vue-37-reactive-optimization',
    name: 'Vue 3.7 Reactive Optimization Security',
    severity: 'Medium',
    description: 'Vue 3.7 reactive optimization usage with potential security concerns',
    recommendation: 'Ensure reactive data sources are properly validated even with performance optimizations enabled.',
    patterns: [
      { key: 'reactive-optimization', pattern: 'reactive\\s*\\(.*\\).*effectScope|watchEffect.*reactive' },
      { key: 'performance-mode', pattern: 'performance\\s*:\\s*true|optimizeDeps.*reactive' },
      { key: 'reactive-cache', pattern: 'reactiveCache|reactiveMemo' }
    ]
  },
  {
    id: 'vue-37-types',
    name: 'Vue 3.7 Type Security',
    severity: 'Low',
    description: 'Vue 3.7 type system usage with potential security concerns',
    recommendation: 'Review type usage to ensure type safety and prevent potential runtime errors.',
    patterns: [
      { key: 'internal-types', pattern: 'InternalProps|InternalSlots|InternalEmits' },
      { key: 'type-exports', pattern: 'from.*vue.*internal|@vue.*internal' },
      { key: 'type-helpers', pattern: 'TypeHelpers|type\\.helpers' }
    ]
  },
  {
    id: 'vue-37-compatibility',
    name: 'Vue 3.7 Compatibility Security',
    severity: 'Medium',
    description: 'Vue 3.7 compatibility issues with potential security concerns',
    recommendation: 'Ensure Vue 3.7 is compatible with all dependencies and plugins.',
    patterns: [
      { key: 'vue-version', pattern: '"vue"\\s*:\\s*"[^"]+"' },
      { key: 'compatibility-flag', pattern: 'compatibility\\s*:\\s*\\{[^}]+\\}' },
      { key: 'legacy-mode', pattern: 'legacy\\s*:\\s*true|compat\\s*:\\s*true' }
    ]
  },
  {
    id: 'vue-37-future-proofing',
    name: 'Vue 3.7 Future Proofing',
    severity: 'Low',
    description: 'Vue 3.7 future-proofing considerations',
    recommendation: 'Design code to be compatible with future Vue versions. Follow Vue best practices.',
    patterns: [
      { key: 'future-api', pattern: 'useFuture|future\\.|next\\.' },
      { key: 'deprecation-warning', pattern: 'deprecated|deprecation' },
      { key: 'migration-guide', pattern: 'migration|migrate' }
    ]
  }
];

module.exports = vue37FeaturesSecurityRules;