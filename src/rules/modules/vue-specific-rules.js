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
      { key: 'uni-request', pattern: 'uni\.request\s*\\(' },
      { key: 'uni-upload-file', pattern: 'uni\.uploadFile\s*\\(' },
      { key: 'uni-download-file', pattern: 'uni\.downloadFile\s*\\(' },
      { key: 'uni-get-storage', pattern: 'uni\.getStorage\s*\\(' },
      { key: 'uni-set-storage', pattern: 'uni\.setStorage\s*\\(' }
    ]
  },
  {
    id: 'uni-app-navigation',
    name: 'uni-app Navigation Security',
    severity: 'Medium',
    description: 'uni-app navigation with potential security concern',
    recommendation: 'Validate navigation parameters to prevent open redirects and injection vulnerabilities.',
    patterns: [
      { key: 'uni-navigate-to', pattern: 'uni\.navigateTo\s*\\(' },
      { key: 'uni-redirect-to', pattern: 'uni\.redirectTo\s*\\(' },
      { key: 'uni-reLaunch', pattern: 'uni\.reLaunch\s*\\(' },
      { key: 'uni-switch-tab', pattern: 'uni\.switchTab\s*\\(' }
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
      { key: 'wx-request', pattern: 'wx\.request\s*\\(' },
      { key: 'wx-upload-file', pattern: 'wx\.uploadFile\s*\\(' },
      { key: 'wx-download-file', pattern: 'wx\.downloadFile\s*\\(' },
      { key: 'wx-get-storage', pattern: 'wx\.getStorage\s*\\(' },
      { key: 'wx-set-storage', pattern: 'wx\.setStorage\s*\\(' }
    ]
  },
  {
    id: 'wechat-mini-program-navigation',
    name: 'WeChat Mini Program Navigation Security',
    severity: 'Medium',
    description: 'WeChat Mini Program navigation with potential security concern',
    recommendation: 'Validate navigation parameters to prevent open redirects and injection vulnerabilities.',
    patterns: [
      { key: 'wx-navigate-to', pattern: 'wx\.navigateTo\s*\\(' },
      { key: 'wx-redirect-to', pattern: 'wx\.redirectTo\s*\\(' },
      { key: 'wx-reLaunch', pattern: 'wx\.reLaunch\s*\\(' },
      { key: 'wx-switch-tab', pattern: 'wx\.switchTab\s*\\(' }
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
      { key: 'taro-request', pattern: 'Taro\.request\s*\\(' },
      { key: 'taro-upload', pattern: 'Taro\.uploadFile\s*\\(' },
      { key: 'taro-download', pattern: 'Taro\.downloadFile\s*\\(' },
      { key: 'taro-storage', pattern: 'Taro\.(setStorage|setStorageSync)\s*\\(' }
    ]
  },
  {
    id: 'taro-navigation-security',
    name: 'Taro Navigation Security',
    severity: 'Medium',
    description: 'Taro navigation API usage with potential security concern',
    recommendation: 'Validate navigation parameters and destinations to prevent open redirects and parameter pollution.',
    patterns: [
      { key: 'taro-navigate-to', pattern: 'Taro\.navigateTo\s*\\(' },
      { key: 'taro-redirect-to', pattern: 'Taro\.redirectTo\s*\\(' },
      { key: 'taro-switch-tab', pattern: 'Taro\.switchTab\s*\\(' },
      { key: 'taro-relaunch', pattern: 'Taro\.relaunch\s*\\(' }
    ]
  },
  {
    id: 'taro-form-security',
    name: 'Taro Form Security Issue',
    severity: 'Medium',
    description: 'Taro form handling with potential security concern',
    recommendation: 'Ensure form inputs are properly validated and sanitized to prevent injection attacks.',
    patterns: [
      { key: 'taro-create-selector-query', pattern: 'Taro\.createSelectorQuery\s*\\(' },
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
      { key: 'taro-config-page', pattern: '\\w+\.config\.(js|ts)' }
    ]
  },
  // Vue 3.6+ Specific Rules
  {
    id: 'vue-36-define-slots',
    name: 'Vue 3.6+ defineSlots Usage',
    severity: 'Medium',
    description: 'Vue 3.6+ defineSlots usage with potential security concern',
    recommendation: 'Ensure slot content is properly validated and sanitized to prevent injection vulnerabilities.',
    patterns: [
      { key: 'define-slots', pattern: 'defineSlots[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-define-emits-typed',
    name: 'Vue 3.6+ Typed defineEmits',
    severity: 'Medium',
    description: 'Vue 3.6+ typed defineEmits usage with potential security concern',
    recommendation: 'Ensure emit values are properly validated according to their types to prevent type-related vulnerabilities.',
    patterns: [
      { key: 'define-emits-typed', pattern: 'defineEmits[\\s]*<[^>]*>[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-script-setup-ref',
    name: 'Vue 3.6+ Script Setup Ref Forwarding',
    severity: 'Medium',
    description: 'Vue 3.6+ script setup ref forwarding with potential security concern',
    recommendation: 'Ensure forwarded refs are properly validated to prevent DOM-based vulnerabilities.',
    patterns: [
      { key: 'script-setup-ref', pattern: '<script\\s+setup\\s+ref' },
      { key: 'define-expose-refs', pattern: 'defineExpose[\\s]*\\(\\s*\{[^}]*ref[^}]*\}' }
    ]
  },
  {
    id: 'vue-36-vapor-ssr',
    name: 'Vue 3.6+ Vapor SSR Security',
    severity: 'High',
    description: 'Vue 3.6+ Vapor SSR usage with potential security concern',
    recommendation: 'Review Vapor SSR implementation to ensure proper validation of server-side data and prevent exposing sensitive information.',
    patterns: [
      { key: 'vapor-ssr', pattern: 'createVaporSSRApp|vapor.*ssr|ssr.*vapor' },
      { key: 'vapor-hydration', pattern: 'vapor.*hydrate|hydrate.*vapor' }
    ]
  },
  {
    id: 'vue-36-reactive-keys',
    name: 'Vue 3.6+ Reactive Key Security',
    severity: 'Medium',
    description: 'Vue 3.6+ reactive key management with potential security concern',
    recommendation: 'Ensure reactive keys are properly validated to prevent prototype pollution and other key-based vulnerabilities.',
    patterns: [
      { key: 'reactive-keys', pattern: 'reactive[\\s]*\\(.*\\{[^}]*\\}\)' },
      { key: 'shallow-reactive-keys', pattern: 'shallowReactive[\\s]*\\(.*\\{[^}]*\\}\)' }
    ]
  },
  {
    id: 'vue-36-composition-api-enhancements',
    name: 'Vue 3.6+ Composition API Enhancements',
    severity: 'Medium',
    description: 'Vue 3.6+ Composition API enhancements with potential security concern',
    recommendation: 'Review enhanced Composition API usage to ensure proper validation of reactive data sources.',
    patterns: [
      { key: 'composition-enhancements', pattern: 'use.*Ref|use.*Reactive|use.*Computed' },
      { key: 'effect-scope-enhancements', pattern: 'effectScope[\\s]*\\(.*detached|detached.*effectScope' }
    ]
  },
  {
    id: 'vue-36-compiler-options',
    name: 'Vue 3.6+ Compiler Options Security',
    severity: 'Medium',
    description: 'Vue 3.6+ compiler options with potential security concern',
    recommendation: 'Review compiler options to ensure they do not disable security-related checks or optimizations.',
    patterns: [
      { key: 'compiler-options', pattern: 'compilerOptions\\s*:\\s*\\{' },
      { key: 'vapor-compiler-options', pattern: 'vapor.*compilerOptions|compilerOptions.*vapor' }
    ]
  },
  {
    id: 'vue-36-ssr-context',
    name: 'Vue 3.6+ SSR Context Security',
    severity: 'High',
    description: 'Vue 3.6+ SSR context usage with potential security concern',
    recommendation: 'Ensure SSR context does not contain sensitive information and is properly sanitized before being exposed to clients.',
    patterns: [
      { key: 'ssr-context', pattern: 'useSSRContext[\\s]*\\(' },
      { key: 'ssr-context-props', pattern: 'ssrContext\\s*\.|SSRContext\\s*\.' }
    ]
  },
  {
    id: 'vue-36-v-model-enhancements',
    name: 'Vue 3.6+ v-model Enhancements',
    severity: 'Medium',
    description: 'Vue 3.6+ v-model enhancements with potential security concern',
    recommendation: 'Ensure v-model values are properly validated and sanitized to prevent injection vulnerabilities.',
    patterns: [
      { key: 'v-model-enhancements', pattern: 'v-model:[^=]+\\s*=' },
      { key: 'define-model-enhanced', pattern: 'defineModel[\\s]*<[^>]*>[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-async-components',
    name: 'Vue 3.6+ Async Components Security',
    severity: 'Medium',
    description: 'Vue 3.6+ async components usage with potential security concern',
    recommendation: 'Ensure async component loading is properly secured and does not expose sensitive information.',
    patterns: [
      { key: 'async-components', pattern: 'defineAsyncComponent[\\s]*\\(' },
      { key: 'suspense-async', pattern: '<Suspense[\\s>].*<component[^>]*:is' }
    ]
  },
  {
    id: 'vue-36-to-value',
    name: 'Vue 3.6+ toValue API Security',
    severity: 'Medium',
    description: 'Vue 3.6+ toValue API usage with potential security concern',
    recommendation: 'Ensure toValue is not used with untrusted data sources to prevent injection vulnerabilities.',
    patterns: [
      { key: 'to-value', pattern: 'toValue[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-to-ref',
    name: 'Vue 3.6+ toRef API Security',
    severity: 'Medium',
    description: 'Vue 3.6+ toRef API usage with potential security concern',
    recommendation: 'Ensure toRef is used with proper validation to prevent reactive data vulnerabilities.',
    patterns: [
      { key: 'to-ref', pattern: 'toRef[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-effect-scope',
    name: 'Vue 3.6+ effectScope Security',
    severity: 'Medium',
    description: 'Vue 3.6+ effectScope usage with potential security concern',
    recommendation: 'Ensure effectScope lifecycle management is properly handled to prevent memory leaks and security issues.',
    patterns: [
      { key: 'effect-scope', pattern: 'effectScope[\\s]*\\(' },
      { key: 'effect-scope-run', pattern: 'effectScope[\\s]*\\([^)]*\\)\\.run' }
    ]
  },
  {
    id: 'vue-36-shallow-reactive',
    name: 'Vue 3.6+ Shallow Reactive Security',
    severity: 'Medium',
    description: 'Vue 3.6+ shallowReactive/shallowRef usage with potential security concern',
    recommendation: 'Ensure shallow reactive APIs are used with proper validation as they do not deeply reactive nested objects.',
    patterns: [
      { key: 'shallow-reactive', pattern: 'shallowReactive[\\s]*\\(' },
      { key: 'shallow-ref', pattern: 'shallowRef[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-computed-security',
    name: 'Vue 3.6+ Computed Security',
    severity: 'Medium',
    description: 'Vue 3.6+ computed usage with potential security concern',
    recommendation: 'Ensure computed properties do not execute untrusted code or access sensitive information.',
    patterns: [
      { key: 'computed', pattern: 'computed[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-watch-security',
    name: 'Vue 3.6+ Watch Security',
    severity: 'Medium',
    description: 'Vue 3.6+ watch/watchEffect usage with potential security concern',
    recommendation: 'Ensure watch functions do not execute untrusted code or access sensitive information.',
    patterns: [
      { key: 'watch', pattern: 'watch[\\s]*\\(' },
      { key: 'watch-effect', pattern: 'watchEffect[\\s]*\\(' }
    ]
  },
  {
    id: 'vue-36-component-compiler',
    name: 'Vue 3.6+ Component Compiler Security',
    severity: 'High',
    description: 'Vue 3.6+ component compiler options with potential security concern',
    recommendation: 'Review component compiler options to ensure they do not disable security-related checks.',
    patterns: [
      { key: 'component-compiler', pattern: 'componentCompilerOptions' },
      { key: 'compiler-dom', pattern: '@vue/compiler-dom' }
    ]
  },
  {
    id: 'vue-36-template-compiler',
    name: 'Vue 3.6+ Template Compiler Security',
    severity: 'High',
    description: 'Vue 3.6+ template compiler usage with potential security concern',
    recommendation: 'Ensure template compilation is properly secured and does not allow injection of malicious templates.',
    patterns: [
      { key: 'compile-template', pattern: 'compile[\\s]*\\(' },
      { key: 'template-compiler', pattern: '@vue/compiler-sfc' }
    ]
  },
  {
    id: 'vue-36-runtime-compiler',
    name: 'Vue 3.6+ Runtime Compiler Security',
    severity: 'High',
    description: 'Vue 3.6+ runtime compiler usage with potential security concern',
    recommendation: 'Avoid using runtime compiler with untrusted templates to prevent injection vulnerabilities.',
    patterns: [
      { key: 'runtime-compiler', pattern: 'runtimeCompiler[\\s]*:[\\s]*true' },
      { key: 'compile', pattern: 'Vue\\.compile' }
    ]
  },
  // Vue 组件库安全规则
  {
    id: 'vue-component-library-security',
    name: 'Vue Component Library Security',
    severity: 'Medium',
    description: 'Vue component library usage with potential security concern',
    recommendation: 'Ensure component libraries are from trusted sources and properly configured to prevent security vulnerabilities.',
    patterns: [
      { key: 'element-plus', pattern: 'from\\s*["\']element-plus["\']' },
      { key: 'ant-design-vue', pattern: 'from\\s*["\']ant-design-vue["\']' },
      { key: 'vuetify', pattern: 'from\\s*["\']vuetify["\']' },
      { key: 'naive-ui', pattern: 'from\\s*["\']naive-ui["\']' }
    ]
  },
  // Vue 动画和过渡安全规则
  {
    id: 'vue-animation-security',
    name: 'Vue Animation and Transition Security',
    severity: 'Low',
    description: 'Vue animation and transition usage with potential security concern',
    recommendation: 'Ensure animation and transition effects do not contain malicious code or cause performance issues.',
    patterns: [
      { key: 'transition', pattern: '<transition[^>]*>' },
      { key: 'transition-group', pattern: '<transition-group[^>]*>' },
      { key: 'animate-css', pattern: 'from\\s*["\']animate.css["\']' }
    ]
  },
  // Vue 预渲染安全规则
  {
    id: 'vue-prerender-security',
    name: 'Vue Prerender Security',
    severity: 'Medium',
    description: 'Vue prerender implementation with potential security concern',
    recommendation: 'Ensure prerendered content is properly validated and does not expose sensitive information.',
    patterns: [
      { key: 'prerender-spa-plugin', pattern: 'from\\s*["\']prerender-spa-plugin["\']' },
      { key: 'vue-prerender', pattern: 'prerender|预渲染' }
    ]
  },
  // Vue 代码分割安全规则
  {
    id: 'vue-code-splitting-security',
    name: 'Vue Code Splitting Security',
    severity: 'Medium',
    description: 'Vue code splitting implementation with potential security concern',
    recommendation: 'Ensure code splitting boundaries are properly secured and do not expose sensitive code.',
    patterns: [
      { key: 'import-dynamic', pattern: 'import\\s*\\(\\s*["\'][^"\']*["\']\\s*\\)' },
      { key: 'define-async-component', pattern: 'defineAsyncComponent\\s*\\(' }
    ]
  },
  // Vue 事件处理安全规则
  {
    id: 'vue-event-handling-security',
    name: 'Vue Event Handling Security',
    severity: 'Medium',
    description: 'Vue event handling with potential security concern',
    recommendation: 'Ensure event handlers properly validate all user input to prevent injection attacks and other security vulnerabilities.',
    patterns: [
      { key: 'v-on', pattern: 'v-on:[^=]+\\s*=' },
      { key: '@event', pattern: '@[a-zA-Z]+\\s*=' },
      { key: 'emit', pattern: 'this\\.\\$emit\\s*\\(|emit\\s*\\(' }
    ]
  },
  // Nuxt.js 特定安全规则
  {
    id: 'nuxt-security',
    name: 'Nuxt.js Security',
    severity: 'High',
    description: 'Nuxt.js implementation with potential security concern',
    recommendation: 'Ensure Nuxt.js configuration is properly secured and follows security best practices.',
    patterns: [
      { key: 'nuxt', pattern: 'from\\s*["\']nuxt["\']' },
      { key: 'nuxt-config', pattern: 'nuxt.config\\.(js|ts|mjs)' },
      { key: 'nuxt-app', pattern: 'useNuxtApp\\s*\\(' }
    ]
  },
  // Vue 缓存策略安全规则
  {
    id: 'vue-caching-security',
    name: 'Vue Caching Strategy Security',
    severity: 'Medium',
    description: 'Vue caching strategy with potential security concern',
    recommendation: 'Ensure caching strategies do not expose sensitive data or allow cache poisoning.',
    patterns: [
      { key: 'vue-cache', pattern: 'keep-alive|KeepAlive' },
      { key: 'cache-control', pattern: 'cache-control|Cache-Control' }
    ]
  }
];

module.exports = vueSpecificRules;