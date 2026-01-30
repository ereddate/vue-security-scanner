const vueSpecificRules = [
  {
    id: 'vue-filter',
    name: 'Vue Filter Usage',
    severity: 'Medium',
    description: 'Vue filter defined, review for potential security issues',
    recommendation: 'Ensure Vue filters properly sanitize and validate input to prevent XSS vulnerabilities.',
    patterns: [
      { key: 'filter-object', pattern: 'filters\\s*:\\s*\\{' },
      { key: 'filter-method', pattern: 'Vue\\.filter\\s*\\(' }
    ]
  },
  {
    id: 'vue-mixin',
    name: 'Vue Mixin Usage',
    severity: 'Low',
    description: 'Vue mixin usage detected',
    recommendation: 'Review mixins for potential security issues, especially those from external sources.',
    patterns: [
      { key: 'mixin-array', pattern: 'mixins\\s*:\\s*\\[' },
      { key: 'mixin-method', pattern: '\\.mixin\\s*\\(' },
      { key: 'mixin-vue', pattern: 'Vue\\.mixin\\s*\\(' },
      { key: 'extends', pattern: 'extends\\s*:\\s*' }
    ]
  },
  {
    id: 'vue-refs-dynamic',
    name: 'Vue $refs Dynamic Access',
    severity: 'Medium',
    description: 'Dynamic Vue $refs access',
    recommendation: 'Avoid dynamic $refs access with user-controlled values to prevent DOM-based vulnerabilities.',
    patterns: [
      { key: 'refs-string', pattern: "\\$refs\\[\\s*['\"`][^'\"]*['\"`]\\s*\\]" },
      { key: 'refs-variable', pattern: '\\$refs\\[\\s*\\w+\\s*\\]' }
    ]
  },
  {
    id: 'vue-composition-api',
    name: 'Vue 3 Composition API Potential Issue',
    severity: 'Medium',
    description: 'Vue 3 Composition API usage with potential security concern',
    recommendation: 'Review Composition API usage to ensure proper validation of reactive data sources.',
    patterns: [
      { key: 'composition-import', pattern: "import\\s+\\{[^}]*\\b(ref|reactive|computed|inject|provide)\\b[^}]*\\}\\s+from\\s+['\"vue['\"]" },
      { key: 'composition-ref', pattern: "ref\\s*\\(\\s*(?!('|\"|`))" },
      { key: 'composition-reactive', pattern: "reactive\\s*\\(\\s*(?!('|\"|`))" },
      { key: 'composition-inject', pattern: "inject\\s*\\(\\s*(?!('|\"|`))" },
      { key: 'composition-provide', pattern: "provide\\s*\\(\\s*(?!('|\"|`))" }
    ]
  },
  {
    id: 'vue-script-setup',
    name: 'Vue 3 Script Setup Security Issue',
    severity: 'Medium',
    description: 'Vue 3 Script Setup usage with potential security concern',
    recommendation: 'Review Script Setup usage to ensure proper validation of reactive data sources and imported components.',
    patterns: [
      { key: 'script-setup', pattern: '<script\\s+setup\\s*>' },
      { key: 'define-props', pattern: 'defineProps\\s*\\(' },
      { key: 'define-emits', pattern: 'defineEmits\\s*\\(' },
      { key: 'define-expose', pattern: 'defineExpose\\s*\\(' }
    ]
  },
  {
    id: 'vue-teleport',
    name: 'Vue 3 Teleport Security Issue',
    severity: 'Medium',
    description: 'Vue 3 Teleport usage with potential security concern',
    recommendation: 'Ensure Teleport targets are not controlled by user input to prevent DOM manipulation vulnerabilities.',
    patterns: [
      { key: 'teleport-tag', pattern: '<Teleport\\s+' },
      { key: 'teleport-to', pattern: 'to\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'vue-suspense',
    name: 'Vue 3 Suspense Security Issue',
    severity: 'Medium',
    description: 'Vue 3 Suspense usage with potential security concern',
    recommendation: 'Review Suspense usage to ensure fallback content is properly sanitized and not controlled by user input.',
    patterns: [
      { key: 'suspense-tag', pattern: '<Suspense\\s+' },
      { key: 'suspense-fallback', pattern: 'fallback\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'vue-directive',
    name: 'Vue Directive Security Issue',
    severity: 'Medium',
    description: 'Vue directive with potential security issue',
    recommendation: 'Ensure Vue directives do not bind untrusted content without proper sanitization.',
    patterns: [
      { key: 'directive-v-text', pattern: "v-text\\s*=\\s*['\"][^'\"]*['\"]" },
      { key: 'directive-v-bind', pattern: 'v-bind:inner-html\\s*=' },
      { key: 'directive-v-interpolation', pattern: "v-\\w+\\s*=\\s*['\"][\\{\\{\\s*.*?\\s*\\}\\}]['\"]" }
    ]
  },
  {
    id: 'vue-router',
    name: 'Vue Router Security Issue',
    severity: 'Medium',
    description: 'Vue router usage with potential security concern',
    recommendation: 'Validate and sanitize route parameters and destinations to prevent open redirects and parameter pollution.',
    patterns: [
      { key: 'router-before-each', pattern: 'beforeEach\\s*\\(' },
      { key: 'router-add-route', pattern: 'addRoute\\s*\\(' },
      { key: 'router-params', pattern: 'this\\.\\$route\\.params\\.([^.]|\\s)*\\.' },
      { key: 'router-push', pattern: 'router\\.push\\s*\\(\\s*\\{' },
      { key: 'router-replace', pattern: 'router\\.replace\\s*\\(\\s*\\{' },
      { key: 'router-this-push', pattern: 'this\\.\\$router\\.push\\s*\\(' },
      { key: 'router-this-replace', pattern: 'this\\.\\$router\\.replace\\s*\\(' }
    ]
  },
  {
    id: 'vue-router-4',
    name: 'Vue Router 4 Security Issue',
    severity: 'Medium',
    description: 'Vue Router 4 usage with potential security concern',
    recommendation: 'Review Vue Router 4 usage to ensure proper validation of route parameters and navigation guards.',
    patterns: [
      { key: 'router-4-create', pattern: 'createRouter\\s*\\(' },
      { key: 'router-4-history', pattern: 'createWebHistory|createWebHashHistory|createMemoryHistory' },
      { key: 'router-4-route', pattern: 'useRoute\\s*\\(' },
      { key: 'router-4-router', pattern: 'useRouter\\s*\\(' }
    ]
  },
  {
    id: 'vue-router-guard',
    name: 'Vue Router Navigation Guard Security',
    severity: 'High',
    description: 'Vue Router navigation guard usage with potential security concern',
    recommendation: 'Ensure navigation guards properly validate route transitions and user permissions to prevent unauthorized access.',
    patterns: [
      { key: 'router-before-each', pattern: 'beforeEach\\s*\\(' },
      { key: 'router-before-resolve', pattern: 'beforeResolve\\s*\\(' },
      { key: 'router-after-each', pattern: 'afterEach\\s*\\(' },
      { key: 'router-before-enter', pattern: 'beforeEnter\\s*:' }
    ]
  },
  {
    id: 'vue-router-meta',
    name: 'Vue Router Meta Security',
    severity: 'Medium',
    description: 'Vue Router meta field usage with potential security concern',
    recommendation: 'Review route meta fields to ensure they do not contain sensitive information or security-related flags that could be manipulated.',
    patterns: [
      { key: 'router-meta', pattern: 'meta\\s*:\\s*\\{' },
      { key: 'router-requires-auth', pattern: 'requiresAuth|auth|protected' }
    ]
  },
  {
    id: 'state-management',
    name: 'State Management Security Issue',
    severity: 'Medium',
    description: 'State management usage with potential security concern',
    recommendation: 'Avoid storing sensitive information in client-side state without encryption. Validate all data before committing to store.',
    patterns: [
      { key: 'state-commit', pattern: "commit\\s*\\(\\s*['\"][^'\"]*\\s*\\+\\s*['\"]" },
      { key: 'state-dispatch', pattern: "dispatch\\s*\\(\\s*['\"][^'\"]*\\s*\\+\\s*['\"]" },
      { key: 'state-access', pattern: 'store\\.state\\.' },
      { key: 'state-map', pattern: 'mapState\\s*\\(' },
      { key: 'state-define', pattern: 'defineStore' },
      { key: 'state-create', pattern: 'createStore' }
    ]
  },
  {
    id: 'pinia-security',
    name: 'Pinia State Management Security',
    severity: 'Medium',
    description: 'Pinia state management usage with potential security concern',
    recommendation: 'Review Pinia store usage to ensure proper validation of data and avoid storing sensitive information without encryption.',
    patterns: [
      { key: 'pinia-import', pattern: "import\\s+\\{[^}]*\\b(createPinia|defineStore)\\b[^}]*\\}\\s+from\\s+['\"pinia['\"]" },
      { key: 'pinia-create', pattern: 'createPinia\\s*\\(' },
      { key: 'pinia-define', pattern: 'defineStore\\s*\\(' }
    ]
  },
  {
    id: 'vue-custom-directive',
    name: 'Vue Custom Directive Usage',
    severity: 'Medium',
    description: 'Vue custom directive defined',
    recommendation: 'Review custom directives for potential DOM manipulation vulnerabilities.',
    patterns: [
      { key: 'custom-directive', pattern: 'directive\\s*\\(' },
      { key: 'vue-directive', pattern: 'Vue\\.directive\\s*\\(' },
      { key: 'app-directive', pattern: 'app\\.directive\\s*\\(' }
    ]
  },
  {
    id: 'vue-v-for',
    name: 'Vue v-for Security Issue',
    severity: 'Medium',
    description: 'Vue v-for with potential security concern',
    recommendation: 'Ensure iteration sources are validated and sanitized to prevent injection attacks.',
    patterns: [
      { key: 'v-for-in', pattern: "v-for\\s*=\\s*['\"][^'\"]* in ([^'\"]*)['\"]" },
      { key: 'v-for-of', pattern: "v-for\\s*=\\s*['\"][^'\"]* of ([^'\"]*)['\"]" }
    ]
  },
  {
    id: 'vue-dynamic-component',
    name: 'Vue Dynamic Component Usage',
    severity: 'High',
    description: 'Vue dynamic component usage',
    recommendation: 'Validate component names to prevent loading arbitrary components.',
    patterns: [
      { key: 'component-is', pattern: '<component\\s*:is\\s*=' },
      { key: 'component-v-bind', pattern: '<component\\s*v-bind:is\\s*=' },
      { key: 'create-element', pattern: "createElement\\s*\\(\\s*['\"`][^'\"`]*['\"`]" },
      { key: 'h-function', pattern: "h\\s*\\(\\s*['\"`][^'\"`]*['\"`]" }
    ]
  },
  {
    id: 'vue-slot',
    name: 'Vue Slot Security Issue',
    severity: 'Medium',
    description: 'Vue slot usage with potential security concern',
    recommendation: 'Be cautious with slot content from untrusted sources.',
    patterns: [
      { key: 'slot-tag', pattern: '<slot' },
      { key: 'slot-named', pattern: '<template\\s*#' },
      { key: 'slot-v-slot', pattern: '<template\\s+v-slot' }
    ]
  },
  {
    id: 'vue-reactive-api',
    name: 'Vue 3 Reactive API Security',
    severity: 'Medium',
    description: 'Vue 3 Reactive API usage with potential security concern',
    recommendation: 'Review Reactive API usage to ensure proper validation of reactive data sources and avoid unintended exposure of sensitive information.',
    patterns: [
      { key: 'reactive-api', pattern: 'reactive\\s*\\(|shallowReactive\\s*\\(' },
      { key: 'ref-api', pattern: 'ref\\s*\\(|shallowRef\\s*\\(' },
      { key: 'computed-api', pattern: 'computed\\s*\\(' },
      { key: 'watch-api', pattern: 'watch\\s*\\(|watchEffect\\s*\\(' }
    ]
  },
  {
    id: 'vue-plugin',
    name: 'Vue Plugin Security',
    severity: 'Medium',
    description: 'Vue plugin usage with potential security concern',
    recommendation: 'Review Vue plugins, especially third-party ones, for potential security vulnerabilities and ensure they are from trusted sources.',
    patterns: [
      { key: 'plugin-use', pattern: 'use\\s*\\(' },
      { key: 'vue-use', pattern: 'Vue\\.use\\s*\\(' },
      { key: 'app-use', pattern: 'app\\.use\\s*\\(' }
    ]
  },
  {
    id: 'vue-ssr',
    name: 'Vue SSR Security Issue',
    severity: 'High',
    description: 'Vue SSR usage with potential security concern',
    recommendation: 'Review SSR implementation to ensure proper validation of server-side data and avoid exposing sensitive information to clients.',
    patterns: [
      { key: 'ssr-create', pattern: 'createSSRApp\\s*\\(' },
      { key: 'ssr-context', pattern: 'useSSRContext\\s*\\(' },
      { key: 'ssr-hydration', pattern: 'hydrate\\s*\\(' }
    ]
  },
  {
    id: 'vue-define-model',
    name: 'Vue 3.5+ defineModel Usage',
    severity: 'Medium',
    description: 'Vue 3.5+ defineModel usage with potential security concern',
    recommendation: 'Ensure defineModel values are properly validated and sanitized to prevent injection vulnerabilities.',
    patterns: [
      { key: 'define-model', pattern: 'defineModel[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-define-async-component',
    name: 'Vue 3.5+ defineAsyncComponent Usage',
    severity: 'Medium',
    description: 'Vue 3.5+ defineAsyncComponent usage with potential security concern',
    recommendation: 'Ensure async component loading is properly secured and does not expose sensitive information.',
    patterns: [
      { key: 'define-async-component', pattern: 'defineAsyncComponent[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-v-memo',
    name: 'Vue 3.5+ v-memo Directive',
    severity: 'Low',
    description: 'Vue 3.5+ v-memo directive usage detected',
    recommendation: 'Review v-memo usage to ensure it does not bypass necessary security validations.',
    patterns: [
      { key: 'v-memo', pattern: 'v-memo[\\s]*=' }
    ]
  },
  {
    id: 'vue-define-options',
    name: 'Vue 3.5+ defineOptions Usage',
    severity: 'Low',
    description: 'Vue 3.5+ defineOptions usage detected',
    recommendation: 'Review defineOptions usage to ensure security-related options are properly configured.',
    patterns: [
      { key: 'define-options', pattern: 'defineOptions[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-composition-api-35',
    name: 'Vue 3.5+ Composition API Security',
    severity: 'Medium',
    description: 'Vue 3.5+ Composition API usage with potential security concern',
    recommendation: 'Review Vue 3.5+ Composition API usage to ensure proper validation of reactive data sources.',
    patterns: [
      { key: 'to-refs-35', pattern: 'toRefs[\\s]*\\(' },
      { key: 'to-value-35', pattern: 'toValue[\\s]*\\(' },
      { key: 'watch-effect-35', pattern: 'watchEffect[\\s]*\\(' },
      { key: 'effect-scope-35', pattern: 'effectScope[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-vapor-mode',
    name: 'Vue 3.6 Vapor Mode Security',
    severity: 'Medium',
    description: 'Vue 3.6 Vapor mode usage with potential security concern',
    recommendation: 'Review Vapor mode usage to ensure proper validation of compiled output and prevent potential injection vulnerabilities.',
    patterns: [
      { key: 'vapor-mode-config', pattern: 'vapor\\s*:\\s*true|vaporMode\\s*:\\s*true' },
      { key: 'vapor-compiler', pattern: '@vitejs/plugin-vue.*vapor|vue-loader.*vapor' },
      { key: 'vapor-build', pattern: 'vite.*vapor|webpack.*vapor' }
    ]
  },
  {
    id: 'vue-36-reactive-performance',
    name: 'Vue 3.6 Reactive Performance Security',
    severity: 'Medium',
    description: 'Vue 3.6 reactive performance optimizations with potential security concern',
    recommendation: 'Ensure reactive data sources are properly validated even with performance optimizations enabled.',
    patterns: [
      { key: 'reactive-optimization', pattern: 'reactive\\s*\\(.*\\).*effectScope|watchEffect.*reactive' },
      { key: 'performance-mode', pattern: 'performance\\s*:\\s*true|optimizeDeps.*reactive' },
      { key: 'reactive-cache', pattern: 'reactiveCache|reactiveMemo' }
    ]
  },
  {
    id: 'vue-36-internal-types',
    name: 'Vue 3.6 Internal Types Security',
    severity: 'Low',
    description: 'Vue 3.6 internal type usage detected',
    recommendation: 'Review internal type usage to ensure type safety and prevent potential runtime errors.',
    patterns: [
      { key: 'internal-types', pattern: 'InternalProps|InternalSlots|InternalEmits' },
      { key: 'type-exports', pattern: 'from.*vue.*internal|@vue.*internal' }
    ]
  },
  // uni-app 特定规则
  {
    id: 'uni-app-api',
    name: 'uni-app API Security Issue',
    severity: 'Medium',
    description: 'uni-app API usage with potential security concern',
    recommendation: 'Review uni-app API usage to ensure proper validation of user input and secure data handling.',
    patterns: [
      { key: 'uni-request', pattern: 'uni\.request\s*\(' },
      { key: 'uni-upload-file', pattern: 'uni\.uploadFile\s*\(' },
      { key: 'uni-download-file', pattern: 'uni\.downloadFile\s*\(' },
      { key: 'uni-get-storage', pattern: 'uni\.getStorage\s*\(' },
      { key: 'uni-set-storage', pattern: 'uni\.setStorage\s*\(' }
    ]
  },
  {
    id: 'uni-app-navigation',
    name: 'uni-app Navigation Security',
    severity: 'Medium',
    description: 'uni-app navigation with potential security concern',
    recommendation: 'Validate navigation parameters to prevent open redirects and injection vulnerabilities.',
    patterns: [
      { key: 'uni-navigate-to', pattern: 'uni\.navigateTo\s*\(' },
      { key: 'uni-redirect-to', pattern: 'uni\.redirectTo\s*\(' },
      { key: 'uni-reLaunch', pattern: 'uni\.reLaunch\s*\(' },
      { key: 'uni-switch-tab', pattern: 'uni\.switchTab\s*\(' }
    ]
  },
  // 微信小程序特定规则
  {
    id: 'wechat-mini-program-api',
    name: 'WeChat Mini Program API Security Issue',
    severity: 'Medium',
    description: 'WeChat Mini Program API usage with potential security concern',
    recommendation: 'Review WeChat Mini Program API usage to ensure proper validation of user input and secure data handling.',
    patterns: [
      { key: 'wx-request', pattern: 'wx\.request\s*\(' },
      { key: 'wx-upload-file', pattern: 'wx\.uploadFile\s*\(' },
      { key: 'wx-download-file', pattern: 'wx\.downloadFile\s*\(' },
      { key: 'wx-get-storage', pattern: 'wx\.getStorage\s*\(' },
      { key: 'wx-set-storage', pattern: 'wx\.setStorage\s*\(' }
    ]
  },
  {
    id: 'wechat-mini-program-navigation',
    name: 'WeChat Mini Program Navigation Security',
    severity: 'Medium',
    description: 'WeChat Mini Program navigation with potential security concern',
    recommendation: 'Validate navigation parameters to prevent open redirects and injection vulnerabilities.',
    patterns: [
      { key: 'wx-navigate-to', pattern: 'wx\.navigateTo\s*\(' },
      { key: 'wx-redirect-to', pattern: 'wx\.redirectTo\s*\(' },
      { key: 'wx-reLaunch', pattern: 'wx\.reLaunch\s*\(' },
      { key: 'wx-switch-tab', pattern: 'wx\.switchTab\s*\(' }
    ]
  },
  {
    id: 'wechat-mini-program-template',
    name: 'WeChat Mini Program Template Security',
    severity: 'Medium',
    description: 'WeChat Mini Program template usage with potential security concern',
    recommendation: 'Ensure template data is properly sanitized to prevent injection vulnerabilities.',
    patterns: [
      { key: 'wxml-interpolation', pattern: '{{[^}]*}}' },
      { key: 'wx-for', pattern: 'wx:for\s*=' },
      { key: 'wx-if', pattern: 'wx:if\s*=' }
    ]
  },
  // Taro 框架特定规则
  {
    id: 'taro-api-security',
    name: 'Taro API Security Issue',
    severity: 'Medium',
    description: 'Taro API usage with potential security concern',
    recommendation: 'Ensure Taro API calls validate all user input to prevent injection attacks and other security vulnerabilities.',
    patterns: [
      { key: 'taro-request', pattern: 'Taro\.request\s*\(' },
      { key: 'taro-upload', pattern: 'Taro\.uploadFile\s*\(' },
      { key: 'taro-download', pattern: 'Taro\.downloadFile\s*\(' },
      { key: 'taro-storage', pattern: 'Taro\.(setStorage|setStorageSync)\s*\(' }
    ]
  },
  {
    id: 'taro-navigation-security',
    name: 'Taro Navigation Security',
    severity: 'Medium',
    description: 'Taro navigation API usage with potential security concern',
    recommendation: 'Validate navigation parameters and destinations to prevent open redirects and parameter pollution.',
    patterns: [
      { key: 'taro-navigate-to', pattern: 'Taro\.navigateTo\s*\(' },
      { key: 'taro-redirect-to', pattern: 'Taro\.redirectTo\s*\(' },
      { key: 'taro-switch-tab', pattern: 'Taro\.switchTab\s*\(' },
      { key: 'taro-relaunch', pattern: 'Taro\.relaunch\s*\(' }
    ]
  },
  {
    id: 'taro-form-security',
    name: 'Taro Form Security Issue',
    severity: 'Medium',
    description: 'Taro form handling with potential security concern',
    recommendation: 'Ensure form inputs are properly validated and sanitized to prevent injection attacks.',
    patterns: [
      { key: 'taro-create-selector-query', pattern: 'Taro\.createSelectorQuery\s*\(' },
      { key: 'taro-form-submit', pattern: 'formType\s*=\s*["\']submit["\']' }
    ]
  },
  {
    id: 'taro-config-security',
    name: 'Taro Config Security Issue',
    severity: 'High',
    description: 'Taro config file with potential security concern',
    recommendation: 'Ensure Taro config files do not contain hardcoded secrets or sensitive information.',
    patterns: [
      { key: 'taro-config-app', pattern: 'app\.config\.(js|ts)' },
      { key: 'taro-config-page', pattern: '\w+\.config\.(js|ts)' }
    ]
  }
];

module.exports = vueSpecificRules;