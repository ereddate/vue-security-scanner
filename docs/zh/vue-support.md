# Vue 支持指南

本指南提供了关于 Vue Security Scanner 中 Vue.js 版本支持的综合信息。

## 概述

Vue Security Scanner 支持多个版本的 Vue.js，为每个版本的特定功能和潜在漏洞提供量身定制的安全扫描。

## 支持的 Vue.js 版本

| Vue 版本 | 支持状态 | 功能 |
|----------|----------|------|
| Vue 2.x | 完全支持 | Vue 2 特定功能和漏洞 |
| Vue 3.x | 完全支持 | Vue 3 Composition API、Teleport、Suspense 等 |
| Nuxt 2 | 完全支持 | Nuxt 2 特定功能和模块 |
| Nuxt 3 | 完全支持 | Nuxt 3 特定功能和应用结构 |
| Vite | 完全支持 | Vite 特定配置和优化 |
| VuePress | 部分支持 | 静态站点生成器安全 |
| Quasar | 部分支持 | Quasar 框架安全 |
| Ionic Vue | 部分支持 | 移动框架安全 |

## Vue 2.x 支持

### 主要功能

- **Options API 支持**：全面扫描 Vue 2 Options API 模式
- **Vuex 支持**：检测 Vuex 特定的安全问题
- **Vue Router 支持**：分析 Vue Router 配置
- **Mixin 分析**：检测 mixin 中的安全问题
- **Filter 分析**：扫描 Vue 2 过滤器
- **Directive 分析**：安全检查自定义指令

### Vue 2 特定规则

```javascript
{
  id: 'vue2-mixin-security',
  name: 'Vue 2 Mixin 安全',
  description: '检测 Vue 2 mixin 中的安全问题',
  severity: 'medium',
  pattern: /mixin[s]?\s*[:=]\s*\{[\s\S]*?\}/g,
  fix: '审查 mixin 代码中的安全问题',
  examples: [
    {
      code: "const authMixin = {\n  data() {\n    return {\n      token: 'hardcoded-token'\n    }\n  }\n}",
      message: '检测到 Vue 2 mixin 中的硬编码令牌'
    }
  ]
}
```

### Vue 2 扫描示例

```bash
# 扫描 Vue 2 项目
vue-security-scanner . --vue2

# 使用 Vue 2 特定规则
vue-security-scanner . --vue2 --rules vue2

# 使用遗留兼容模式
vue-security-scanner . --vue2 --compatibility legacy
```

## Vue 3.x 支持

### 主要功能

- **Composition API 支持**：分析 Composition API 模式
- **Script Setup 支持**：扫描 `<script setup>` 语法
- **Reactivity API 分析**：安全检查 Reactivity API 使用
- **Teleport 分析**：检测 Teleport 组件中的安全问题
- **Suspense 分析**：安全检查 Suspense 组件
- **Provide/Inject 分析**：检测不安全的 provide/inject 模式
- **V3 Directives**：分析 Vue 3 自定义指令

### Vue 3 特定规则

```javascript
{
  id: 'vue3-composition-api-security',
  name: 'Vue 3 Composition API 安全',
  description: '检测 Vue 3 Composition API 中的安全问题',
  severity: 'medium',
  pattern: /setup\s*\(\)\s*\{[\s\S]*?\}/g,
  fix: '审查 Composition API 代码中的安全问题',
  examples: [
    {
      code: "setup() {\n  const apiKey = 'hardcoded-api-key';\n  return { apiKey }\n}",
      message: '检测到 Vue 3 setup 函数中的硬编码 API 密钥'
    }
  ]
}
```

### Vue 3 扫描示例

```bash
# 扫描 Vue 3 项目
vue-security-scanner . --vue3

# 使用 Vue 3 特定规则
vue-security-scanner . --vue3 --rules vue3

# 支持 script setup
vue-security-scanner . --vue3 --script-setup
```

## Nuxt.js 支持

### Nuxt 2 支持

- **Page 分析**：扫描 Nuxt 2 页面
- **Layout 分析**：安全检查 Nuxt 2 布局
- **Middleware 分析**：检测中间件中的安全问题
- **Plugin 分析**：扫描 Nuxt 2 插件
- **Module 分析**：安全检查 Nuxt 2 模块

### Nuxt 3 支持

- **App 目录支持**：扫描 Nuxt 3 app 目录结构
- **Server Components 支持**：分析服务器组件
- **API Routes 分析**：安全检查 API 路由
- **Middleware 分析**：检测 Nuxt 3 中间件中的安全问题
- **Plugin 分析**：扫描 Nuxt 3 插件

### Nuxt 扫描示例

```bash
# 扫描 Nuxt 2 项目
vue-security-scanner . --nuxt

# 扫描 Nuxt 3 项目
vue-security-scanner . --nuxt3

# 使用 Nuxt 特定规则
vue-security-scanner . --nuxt --rules nuxt
```

## Vite 支持

### 主要功能

- **Vite 配置分析**：扫描 vite.config.js
- **Plugin 分析**：安全检查 Vite 插件
- **依赖分析**：检测易受攻击的依赖
- **环境变量分析**：安全检查 .env 文件
- **优化分析**：检测不安全的优化设置

### Vite 扫描示例

```bash
# 扫描 Vite 项目
vue-security-scanner . --vite

# 使用 Vite 特定规则
vue-security-scanner . --vite --rules vite

# 在扫描中包含 vite.config.js
vue-security-scanner . --vite --include "vite.config.js"
```

## 框架特定配置

### Vue 2 配置

```json
{
  "scan": {
    "vue": {
      "version": 2,
      "features": {
        "optionsApi": true,
        "vuex": true,
        "vueRouter": true,
        "mixins": true,
        "filters": true,
        "directives": true
      }
    }
  }
}
```

### Vue 3 配置

```json
{
  "scan": {
    "vue": {
      "version": 3,
      "features": {
        "compositionApi": true,
        "scriptSetup": true,
        "reactivityApi": true,
        "teleport": true,
        "suspense": true,
        "provideInject": true,
        "v3Directives": true
      }
    }
  }
}
```

### Nuxt 配置

```json
{
  "scan": {
    "nuxt": {
      "version": 3,
      "features": {
        "appDirectory": true,
        "serverComponents": true,
        "apiRoutes": true,
        "middleware": true,
        "plugins": true
      }
    }
  }
}
```

## Vue 特定漏洞

### Options API 漏洞

```javascript
// 不安全：data() 中的硬编码密钥
export default {
  data() {
    return {
      secret: 'hardcoded-secret' // 易受攻击
    }
  }
}

// 安全：使用环境变量
export default {
  data() {
    return {
      secret: process.env.VUE_APP_SECRET // 安全
    }
  }
}
```

### Composition API 漏洞

```javascript
// 不安全：setup() 中的硬编码 API 密钥
export default {
  setup() {
    const apiKey = 'hardcoded-api-key' // 易受攻击
    return { apiKey }
  }
}

// 安全：使用带有安全源的 provide/inject
export default {
  setup() {
    const apiKey = inject('apiKey') // 安全
    return { apiKey }
  }
}
```

### Vuex 漏洞

```javascript
// 不安全：允许任意状态更改的 mutation
const store = new Vuex.Store({
  mutations: {
    updateState(state, payload) {
      Object.assign(state, payload) // 易受攻击
    }
  }
})

// 安全：显式 mutation
const store = new Vuex.Store({
  mutations: {
    updateUser(state, user) {
      state.user = { ...state.user, ...user } // 安全
    }
  }
})
```

### Vue Router 漏洞

```javascript
// 不安全：没有验证的动态路由
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: UserComponent } // 易受攻击
  ]
})

// 安全：带有 props 验证的动态路由
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: UserComponent,
      props: (route) => ({ id: parseInt(route.params.id) }) // 安全
    }
  ]
})
```

## 按 Vue 版本的扫描策略

### Vue 2 项目

```bash
# 全面的 Vue 2 扫描
vue-security-scanner . --vue2 --level detailed

# 用于 CI 的快速 Vue 2 扫描
vue-security-scanner . --vue2 --performance fast --severity high,critical

# 带有 Vuex 和 Vue Router 的 Vue 2
vue-security-scanner . --vue2 --rules vue2,vuex,vue-router
```

### Vue 3 项目

```bash
# 全面的 Vue 3 扫描
vue-security-scanner . --vue3 --level detailed

# 用于 CI 的快速 Vue 3 扫描
vue-security-scanner . --vue3 --performance fast --severity high,critical

# 以 Composition API 为重点的 Vue 3
vue-security-scanner . --vue3 --rules vue3,composition-api
```

### Nuxt 项目

```bash
# Nuxt 2 扫描
vue-security-scanner . --nuxt --level detailed

# Nuxt 3 扫描
vue-security-scanner . --nuxt3 --level detailed

# 带有 API 路由的 Nuxt 扫描
vue-security-scanner . --nuxt3 --include "server/api/**/*.js"
```

## Vue 项目的性能优化

### Vue 2 性能

```bash
# 优化的 Vue 2 扫描
vue-security-scanner . --vue2 --batch-size 10 --performance fast

# 增量 Vue 2 扫描
vue-security-scanner . --vue2 --incremental
```

### Vue 3 性能

```bash
# 优化的 Vue 3 扫描
vue-security-scanner . --vue3 --batch-size 10 --performance fast

# 增量 Vue 3 扫描
vue-security-scanner . --vue3 --incremental
```

## Vue 特定最佳实践

### 通用 Vue 最佳实践

1. **使用环境变量**：用于 API 密钥和密钥
2. **验证 Props**：始终验证组件 props
3. **净化输入**：在使用前清理用户输入
4. **使用 HTTPS**：始终使用安全连接
5. **实现 CSP**：使用内容安全策略
6. **安全的 Vuex Store**：验证 mutations 和 actions
7. **保护路由**：实现路由守卫
8. **使用安全依赖**：定期更新包
9. **实现速率限制**：防止暴力攻击
10. **监控安全问题**：定期安全扫描

### Vue 2 特定最佳实践

1. **避免修改 Props**：使用 data 或 computed 属性代替
2. **使用适当的键管理**：对于 v-for 指令
3. **安全实现生命周期钩子**：特别是 beforeDestroy
4. **仔细审查 Mixins**：它们可能引入安全问题
5. **安全的事件处理程序**：验证事件数据

### Vue 3 特定最佳实践

1. **安全使用 Script Setup**：避免暴露敏感数据
2. **安全实现 Provide/Inject**：不要暴露密钥
3. **负责任地使用 Teleport**：只传送到受信任的元素
4. **安全的 Suspense 组件**：正确处理错误
5. **安全使用 Reactive API**：避免反应式密钥

## 排查 Vue 扫描问题

### Vue 2 问题

如果您在扫描 Vue 2 项目时遇到问题：

1. **启用 Vue 2 模式**：使用 `--vue2` 标志
2. **检查 Vue 版本**：确保扫描器检测到正确的 Vue 版本
3. **审查 Mixins**：复杂的 mixins 可能导致解析问题
4. **检查 Filters**：自定义过滤器可能需要特殊处理
5. **更新扫描器**：确保您使用的是最新版本

### Vue 3 问题

如果您在扫描 Vue 3 项目时遇到问题：

1. **启用 Vue 3 模式**：使用 `--vue3` 标志
2. **检查 Script Setup**：确保支持 script setup 语法
3. **审查 Composition API**：复杂的 Composition API 使用可能需要调整
4. **检查 Teleport/Suspense**：这些功能可能需要特殊处理
5. **更新扫描器**：确保您使用的是最新版本

### Nuxt 问题

如果您在扫描 Nuxt 项目时遇到问题：

1. **指定 Nuxt 版本**：对于 Nuxt 2 使用 `--nuxt`，对于 Nuxt 3 使用 `--nuxt3`
2. **检查服务器文件**：确保正确扫描服务器端文件
3. **审查模块**：Nuxt 模块可能引入安全复杂性
4. **检查中间件**：自定义中间件可能需要特别注意
5. **更新扫描器**：确保您使用的是最新版本

## 企业 Vue 支持

### 企业功能

- **自定义 Vue 规则**：创建 Vue 特定的自定义规则
- **框架集成**：与 Vue 生态系统深度集成
- **合规扫描**：Vue 特定的合规检查
- **高级报告**：以 Vue 为重点的安全报告
- **优先支持**：专门支持 Vue 安全问题

### 企业配置

```json
{
  "enterprise": {
    "vue": {
      "customRules": {
        "enabled": true,
        "path": "./vue-custom-rules.js"
      },
      "compliance": {
        "enabled": true,
        "standards": ["pci-dss", "gdpr", "iso27001"]
      }
    }
  }
}
```

## 支持

如需其他 Vue 特定支持：

1. **Vue 文档**：查阅 Vue 的官方安全文档
2. **GitHub Issues**：报告 Vue 特定的扫描问题
3. **企业支持**：联系企业支持获取 Vue 特定的帮助
4. **社区论坛**：在 Vue Security 社区中提问

## 后续步骤

- **为您的 Vue 版本配置**：为特定的 Vue 版本设置扫描器
- **启用框架特定规则**：激活 Vue 特定的安全规则
- **实现定期扫描**：为 Vue 项目设置常规安全扫描
- **审查 Vue 特定最佳实践**：遵循 Vue 安全最佳实践
- **保持更新**：同时保持 Vue 和扫描器的更新以获取最新的安全功能