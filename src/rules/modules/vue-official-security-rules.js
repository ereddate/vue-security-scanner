const vueOfficialSecurityRules = [
  {
    id: 'vue-official-xss-prevention',
    name: 'Vue 官方 XSS 防护最佳实践',
    severity: 'High',
    description: '未遵循 Vue 官方 XSS 防护最佳实践',
    recommendation: '遵循 Vue 官方文档中的 XSS 防护建议：1. 使用 v-html 时要特别小心，确保内容是可信的；2. 避免使用 JavaScript 表达式中的用户输入；3. 使用 Vue 的内置指令和过滤器进行内容转义。',
    patterns: [
      { key: 'v-html', pattern: 'v-html\s*=' },
      { key: 'innerHTML', pattern: 'innerHTML\s*=' },
      { key: 'dangerouslySetInnerHTML', pattern: 'dangerouslySetInnerHTML' }
    ]
  },
  {
    id: 'vue-official-csrf-protection',
    name: 'Vue 官方 CSRF 防护最佳实践',
    severity: 'High',
    description: '未遵循 Vue 官方 CSRF 防护最佳实践',
    recommendation: '遵循 Vue 官方文档中的 CSRF 防护建议：1. 在服务器端实现 CSRF 令牌验证；2. 使用 axios 等 HTTP 客户端时配置 CSRF 令牌；3. 避免在客户端存储敏感的认证信息。',
    patterns: [
      { key: 'csrf', pattern: 'CSRF|cross-site request forgery|跨站请求伪造' },
      { key: 'axios', pattern: 'axios\.create|axios\.defaults' },
      { key: 'fetch', pattern: 'fetch\s*\(' }
    ]
  },
  {
    id: 'vue-official-dependency-management',
    name: 'Vue 官方依赖管理最佳实践',
    severity: 'Medium',
    description: '未遵循 Vue 官方依赖管理最佳实践',
    recommendation: '遵循 Vue 官方文档中的依赖管理建议：1. 定期更新 Vue 及其相关依赖到最新版本；2. 使用 npm audit 或类似工具检查依赖漏洞；3. 只从可信来源安装依赖。',
    patterns: [
      { key: 'package-json', pattern: 'package\.json' },
      { key: 'dependencies', pattern: 'dependencies\s*:\s*\{' },
      { key: 'devDependencies', pattern: 'devDependencies\s*:\s*\{' }
    ]
  },
  {
    id: 'vue-official-router-security',
    name: 'Vue Router 官方安全最佳实践',
    severity: 'Medium',
    description: '未遵循 Vue Router 官方安全最佳实践',
    recommendation: '遵循 Vue Router 官方文档中的安全建议：1. 验证和清理路由参数；2. 实现路由守卫进行权限控制；3. 避免使用动态路由匹配时的路径遍历攻击。',
    patterns: [
      { key: 'vue-router', pattern: 'vue-router|createRouter' },
      { key: 'route-params', pattern: 'route\.params|\$route\.params' },
      { key: 'dynamic-route', pattern: 'path\s*:\s*["\'].*:\w+.*["\']' }
    ]
  },
  {
    id: 'vue-official-state-management',
    name: 'Vue 状态管理官方安全最佳实践',
    severity: 'Medium',
    description: '未遵循 Vue 状态管理官方安全最佳实践',
    recommendation: '遵循 Vue 官方文档中的状态管理安全建议：1. 避免在客户端存储敏感信息；2. 验证所有提交到 store 的数据；3. 实现适当的状态管理权限控制。',
    patterns: [
      { key: 'vuex', pattern: 'vuex|createStore' },
      { key: 'pinia', pattern: 'pinia|defineStore' },
      { key: 'state', pattern: 'state\s*:\s*\{' }
    ]
  },
  {
    id: 'vue-official-ssr-security',
    name: 'Vue SSR 官方安全最佳实践',
    severity: 'High',
    description: '未遵循 Vue SSR 官方安全最佳实践',
    recommendation: '遵循 Vue SSR 官方文档中的安全建议：1. 验证所有服务器端数据；2. 避免在服务器端代码中使用客户端特定的 API；3. 实现适当的错误处理，避免向客户端暴露敏感信息。',
    patterns: [
      { key: 'ssr', pattern: 'SSR|server-side rendering|createSSRApp' },
      { key: 'nuxt', pattern: 'nuxt|@nuxt' },
      { key: 'server', pattern: 'server|node\.js|express|koa' }
    ]
  },
  {
    id: 'vue-official-build-security',
    name: 'Vue 构建官方安全最佳实践',
    severity: 'Medium',
    description: '未遵循 Vue 构建官方安全最佳实践',
    recommendation: '遵循 Vue 官方文档中的构建安全建议：1. 在生产构建中禁用调试模式；2. 配置适当的 CSP (内容安全策略)；3. 优化构建输出，减少潜在的安全风险。',
    patterns: [
      { key: 'vite', pattern: 'vite|vite.config' },
      { key: 'webpack', pattern: 'webpack|webpack.config' },
      { key: 'build', pattern: 'build|production|prod' }
    ]
  },
  {
    id: 'vue-official-security-updates',
    name: 'Vue 官方安全更新跟踪',
    severity: 'High',
    description: '未跟踪 Vue 官方安全公告',
    recommendation: '定期关注 Vue 官方安全公告，及时更新到最新的安全补丁版本。Vue 官方安全公告发布在 Vue GitHub 仓库的 Security Advisories 部分。',
    patterns: [
      { key: 'vue-version', pattern: 'vue\s*:\s*["\'].*["\']' },
      { key: 'security-advisory', pattern: 'security advisory|security notice|安全公告' }
    ]
  },
  {
    id: 'vue-official-ecosystem-security',
    name: 'Vue 生态系统官方安全最佳实践',
    severity: 'Medium',
    description: '未遵循 Vue 生态系统官方安全最佳实践',
    recommendation: '遵循 Vue 生态系统官方文档中的安全建议：1. 只使用官方推荐的 Vue 插件和库；2. 验证第三方组件的安全性；3. 遵循各生态系统组件的安全最佳实践。',
    patterns: [
      { key: 'plugin', pattern: 'plugin|use\s*\(' },
      { key: 'component', pattern: 'component|defineComponent' },
      { key: 'ecosystem', pattern: 'vue-router|vuex|pinia|axios' }
    ]
  },
  {
    id: 'vue-official-input-validation',
    name: 'Vue 官方输入验证最佳实践',
    severity: 'High',
    description: '未遵循 Vue 官方输入验证最佳实践',
    recommendation: '遵循 Vue 官方文档中的输入验证建议：1. 在客户端和服务器端都实现输入验证；2. 使用 Vuelidate、Yup 等库进行表单验证；3. 对所有用户输入进行适当的清理和转义。',
    patterns: [
      { key: 'input', pattern: '<input|v-model' },
      { key: 'form', pattern: '<form|formType' },
      { key: 'validation', pattern: 'validate|validation|验证' }
    ]
  },
  {
    id: 'vue-official-error-handling',
    name: 'Vue 官方错误处理最佳实践',
    severity: 'Medium',
    description: '未遵循 Vue 官方错误处理最佳实践',
    recommendation: '遵循 Vue 官方文档中的错误处理建议：1. 实现全局错误处理器；2. 避免在错误消息中暴露敏感信息；3. 记录错误但向用户显示友好的错误提示。',
    patterns: [
      { key: 'error', pattern: 'error|catch|try|catch' },
      { key: 'warn', pattern: 'warn|warning' },
      { key: 'console-error', pattern: 'console\.error' }
    ]
  },
  {
    id: 'vue-official-performance-security',
    name: 'Vue 官方性能与安全最佳实践',
    severity: 'Low',
    description: '未遵循 Vue 官方性能与安全最佳实践',
    recommendation: '遵循 Vue 官方文档中的性能与安全建议：1. 使用 v-memo、v-once 等指令优化性能；2. 避免在模板中使用复杂的表达式；3. 实现适当的缓存策略，同时确保安全性。',
    patterns: [
      { key: 'performance', pattern: 'performance|optimize|优化' },
      { key: 'memo', pattern: 'v-memo|v-once' },
      { key: 'cache', pattern: 'cache|keep-alive' }
    ]
  }
];

module.exports = vueOfficialSecurityRules;