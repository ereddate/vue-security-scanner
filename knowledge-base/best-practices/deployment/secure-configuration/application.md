# 应用安全配置

## 📋 概述

应用安全配置是指安全地配置前端应用，确保应用在运行时的安全性。本指南提供了前端应用安全配置的最佳实践。

## 🎯 适用场景

应用安全配置适用于以下场景：

- Vue 3 应用安全配置
- React 应用安全配置
- 应用环境变量配置
- 应用安全头配置
- 应用错误处理配置

## 🔍 实现指南

### 1. 环境变量配置

安全地配置环境变量。

#### 1.1 环境变量验证

```javascript
// src/utils/envValidator.js
class EnvironmentValidator {
  constructor() {
    this.requiredVars = [
      'NODE_ENV',
      'VITE_API_BASE_URL',
      'VITE_APP_NAME'
    ]
    
    this.optionalVars = [
      'VITE_SENTRY_DSN',
      'VITE_GA_ID',
      'VITE_ENABLE_ANALYTICS'
    ]
    
    this.validationRules = {
      NODE_ENV: {
        allowedValues: ['development', 'production', 'test'],
        required: true
      },
      VITE_API_BASE_URL: {
        pattern: /^https?:\/\/.+/,
        required: true
      },
      VITE_APP_NAME: {
        minLength: 3,
        maxLength: 50,
        required: true
      }
    }
  }
  
  // 验证环境变量
  validate() {
    const errors = []
    const warnings = []
    
    // 验证必需的环境变量
    for (const varName of this.requiredVars) {
      if (!import.meta.env[varName]) {
        errors.push(`缺少必需的环境变量: ${varName}`)
      }
    }
    
    // 验证环境变量格式
    for (const [varName, rule] of Object.entries(this.validationRules)) {
      const value = import.meta.env[varName]
      
      if (!value && rule.required) {
        continue
      }
      
      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(`环境变量格式不正确: ${varName}`)
      }
      
      if (value && rule.allowedValues && !rule.allowedValues.includes(value)) {
        errors.push(`环境变量值不合法: ${varName} (允许值: ${rule.allowedValues.join(', ')})`)
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        warnings.push(`环境变量值过短: ${varName} (最小长度: ${rule.minLength})`)
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        warnings.push(`环境变量值过长: ${varName} (最大长度: ${rule.maxLength})`)
      }
    }
    
    // 检查生产环境配置
    if (import.meta.env.NODE_ENV === 'production') {
      const productionWarnings = this.validateProductionConfig()
      warnings.push(...productionWarnings)
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }
  
  // 验证生产环境配置
  validateProductionConfig() {
    const warnings = []
    
    // 检查是否启用了调试
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      warnings.push('生产环境不应启用调试模式')
    }
    
    // 检查是否启用了详细日志
    if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
      warnings.push('生产环境不应使用详细日志级别')
    }
    
    // 检查是否使用了开发 API
    if (import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
      warnings.push('生产环境不应使用本地 API')
    }
    
    // 检查是否缺少监控配置
    if (!import.meta.env.VITE_SENTRY_DSN) {
      warnings.push('生产环境建议配置错误监控')
    }
    
    return warnings
  }
  
  // 获取环境变量
  getVar(name, defaultValue = null) {
    return import.meta.env[name] || defaultValue
  }
  
  // 获取必需的环境变量
  getRequiredVar(name) {
    const value = import.meta.env[name]
    
    if (!value) {
      throw new Error(`缺少必需的环境变量: ${name}`)
    }
    
    return value
  }
}

export default EnvironmentValidator
```

#### 1.2 环境变量配置文件

```javascript
// src/config/env.js
import EnvironmentValidator from '../utils/envValidator'

const validator = new EnvironmentValidator()

// 验证环境变量
const validation = validator.validate()

if (!validation.valid) {
  console.error('环境变量验证失败:')
  validation.errors.forEach(error => console.error(`  - ${error}`))
  throw new Error('环境变量配置错误')
}

if (validation.warnings.length > 0) {
  console.warn('环境变量配置警告:')
  validation.warnings.forEach(warning => console.warn(`  - ${warning}`))
}

// 导出配置
export const config = {
  // 应用配置
  appName: validator.getVar('VITE_APP_NAME'),
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API 配置
  apiBaseUrl: validator.getRequiredVar('VITE_API_BASE_URL'),
  apiTimeout: parseInt(validator.getVar('VITE_API_TIMEOUT', '30000')),
  
  // 环境配置
  nodeEnv: validator.getRequiredVar('NODE_ENV'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // 功能开关
  enableAnalytics: validator.getVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
  enableDebug: validator.getVar('VITE_ENABLE_DEBUG', 'false') === 'true',
  
  // 监控配置
  sentryDsn: validator.getVar('VITE_SENTRY_DSN'),
  gaId: validator.getVar('VITE_GA_ID'),
  
  // 安全配置
  enableCSP: validator.getVar('VITE_ENABLE_CSP', 'true') === 'true',
  enableHSTS: validator.getVar('VITE_ENABLE_HSTS', 'true') === 'true',
  
  // 日志配置
  logLevel: validator.getVar('VITE_LOG_LEVEL', 'info')
}
```

### 2. 安全头配置

在应用中设置安全头。

#### 2.1 安全头中间件

```javascript
// src/middleware/securityHeaders.js
export function createSecurityHeaders(config) {
  const headers = new Headers()
  
  // X-Content-Type-Options
  headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-Frame-Options
  headers.set('X-Frame-Options', 'DENY')
  
  // X-XSS-Protection
  headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer-Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy
  const permissionsPolicy = [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'fullscreen=(self)',
    'picture-in-picture=(self)'
  ]
  headers.set('Permissions-Policy', permissionsPolicy.join(', '))
  
  // Content-Security-Policy
  if (config.enableCSP) {
    const csp = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: https:`,
      `font-src 'self' data:`,
      `connect-src 'self' ${config.apiBaseUrl}`,
      `object-src 'none'`,
      `frame-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`
    ]
    headers.set('Content-Security-Policy', csp.join('; '))
  }
  
  // Strict-Transport-Security
  if (config.enableHSTS && config.isProduction) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  return headers
}

export function applySecurityHeaders(config) {
  const headers = createSecurityHeaders(config)
  
  for (const [name, value] of headers.entries()) {
    document.head.querySelector(`meta[http-equiv="${name}"]`)?.remove()
    
    const meta = document.createElement('meta')
    meta.httpEquiv = name
    meta.content = value
    document.head.appendChild(meta)
  }
}
```

#### 2.2 Vue 3 安全头配置

```vue
<!-- src/App.vue -->
<script setup>
import { onMounted } from 'vue'
import { config } from './config/env'
import { applySecurityHeaders } from './middleware/securityHeaders'

onMounted(() => {
  if (typeof window !== 'undefined') {
    applySecurityHeaders(config)
  }
})
</script>

<template>
  <router-view />
</template>
```

#### 2.3 React 安全头配置

```jsx
// src/App.jsx
import { useEffect } from 'react'
import { config } from './config/env'
import { applySecurityHeaders } from './middleware/securityHeaders'

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      applySecurityHeaders(config)
    }
  }, [])
  
  return (
    <div className="app">
      {/* 应用内容 */}
    </div>
  )
}

export default App
```

### 3. 错误处理配置

安全地处理应用错误。

#### 3.1 错误处理器

```javascript
// src/utils/errorHandler.js
class SecureErrorHandler {
  constructor(config) {
    this.config = config
    this.errorQueue = []
    this.maxQueueSize = 100
  }
  
  // 处理错误
  handleError(error, context = {}) {
    // 清理敏感信息
    const sanitizedError = this.sanitizeError(error)
    
    // 记录错误
    this.logError(sanitizedError, context)
    
    // 发送到监控服务
    this.sendToMonitoring(sanitizedError, context)
    
    // 返回用户友好的错误消息
    return this.getUserFriendlyMessage(sanitizedError)
  }
  
  // 清理错误信息
  sanitizeError(error) {
    const sanitized = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    
    // 移除敏感信息
    if (sanitized.message) {
      sanitized.message = this.removeSensitiveInfo(sanitized.message)
    }
    
    if (sanitized.stack) {
      sanitized.stack = this.removeSensitiveInfo(sanitized.stack)
    }
    
    return sanitized
  }
  
  // 移除敏感信息
  removeSensitiveInfo(text) {
    const sensitivePatterns = [
      /password\s*[:=]\s*[^\s,}]+/gi,
      /token\s*[:=]\s*[^\s,}]+/gi,
      /secret\s*[:=]\s*[^\s,}]+/gi,
      /key\s*[:=]\s*[^\s,}]+/gi,
      /authorization\s*[:=]\s*[^\s,}]+/gi,
      /bearer\s+[^\s,}]+/gi
    ]
    
    let sanitized = text
    
    for (const pattern of sensitivePatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]')
    }
    
    return sanitized
  }
  
  // 记录错误
  logError(error, context) {
    const logEntry = {
      error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    this.errorQueue.push(logEntry)
    
    // 限制队列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }
    
    // 根据日志级别记录
    if (this.config.logLevel === 'debug') {
      console.error('错误详情:', logEntry)
    } else {
      console.error('错误:', error.message)
    }
  }
  
  // 发送到监控服务
  async sendToMonitoring(error, context) {
    if (!this.config.sentryDsn) {
      return
    }
    
    try {
      // 使用 Sentry 发送错误
      if (window.Sentry) {
        window.Sentry.withScope(scope => {
          scope.setContext('custom', context)
          window.Sentry.captureException(error)
        })
      }
    } catch (e) {
      console.error('发送错误到监控服务失败:', e)
    }
  }
  
  // 获取用户友好的错误消息
  getUserFriendlyMessage(error) {
    const errorMessages = {
      'NetworkError': '网络连接失败，请检查您的网络连接',
      'TimeoutError': '请求超时，请稍后重试',
      'ValidationError': '输入数据不正确，请检查后重试',
      'AuthenticationError': '认证失败，请重新登录',
      'AuthorizationError': '您没有权限执行此操作',
      'NotFoundError': '请求的资源不存在',
      'ServerError': '服务器错误，请稍后重试'
    }
    
    return errorMessages[error.name] || '发生错误，请稍后重试'
  }
  
  // 获取错误队列
  getErrorQueue() {
    return [...this.errorQueue]
  }
  
  // 清空错误队列
  clearErrorQueue() {
    this.errorQueue = []
  }
}

export default SecureErrorHandler
```

#### 3.2 Vue 3 错误处理

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { config } from './config/env'
import SecureErrorHandler from './utils/errorHandler'

const errorHandler = new SecureErrorHandler(config)

// 全局错误处理
app.config.errorHandler = (error, instance, info) => {
  errorHandler.handleError(error, {
    component: instance?.$options.name,
    info
  })
}

// 未捕获的 Promise 错误
window.addEventListener('unhandledrejection', event => {
  event.preventDefault()
  errorHandler.handleError(event.reason, {
    type: 'unhandledrejection'
  })
})

// 未捕获的错误
window.addEventListener('error', event => {
  event.preventDefault()
  errorHandler.handleError(event.error, {
    type: 'error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
})
```

#### 3.3 React 错误处理

```jsx
// src/ErrorBoundary.jsx
import React, { Component } from 'react'
import SecureErrorHandler from './utils/errorHandler'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.errorHandler = new SecureErrorHandler(props.config)
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    this.errorHandler.handleError(error, {
      componentStack: errorInfo.componentStack
    })
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h1>出错了</h1>
          <p>抱歉，应用遇到了错误</p>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      )
    }
    
    return this.props.children
  }
}

export default ErrorBoundary
```

## 📚 代码示例

### Vue 3 完整示例

```vue
<!-- src/App.vue -->
<script setup>
import { onMounted } from 'vue'
import { config } from './config/env'
import { applySecurityHeaders } from './middleware/securityHeaders'
import SecureErrorHandler from './utils/errorHandler'

const errorHandler = new SecureErrorHandler(config)

onMounted(() => {
  if (typeof window !== 'undefined') {
    applySecurityHeaders(config)
  }
})

// 全局错误处理
window.addEventListener('error', event => {
  errorHandler.handleError(event.error, {
    type: 'error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
})

window.addEventListener('unhandledrejection', event => {
  errorHandler.handleError(event.reason, {
    type: 'unhandledrejection'
  })
})
</script>

<template>
  <router-view />
</template>
```

### React 完整示例

```jsx
// src/App.jsx
import { useEffect } from 'react'
import { config } from './config/env'
import { applySecurityHeaders } from './middleware/securityHeaders'
import SecureErrorHandler from './utils/errorHandler'
import ErrorBoundary from './ErrorBoundary'

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      applySecurityHeaders(config)
    }
    
    const errorHandler = new SecureErrorHandler(config)
    
    window.addEventListener('error', event => {
      errorHandler.handleError(event.error, {
        type: 'error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })
    
    window.addEventListener('unhandledrejection', event => {
      errorHandler.handleError(event.reason, {
        type: 'unhandledrejection'
      })
    })
  }, [])
  
  return (
    <ErrorBoundary config={config}>
      <div className="app">
        {/* 应用内容 */}
      </div>
    </ErrorBoundary>
  )
}

export default App
```

## 🛠️ 工具推荐

- **dotenv**：环境变量加载工具
- **config**：配置管理工具
- **convict**：配置验证工具
- **Sentry**：错误监控工具
- **LogRocket**：错误监控和会话回放工具

## 📝 验证方法

验证应用安全配置是否正确实施的方法：

1. **环境变量测试**：测试环境变量是否正确配置
2. **安全头测试**：使用 securityheaders.io 测试安全头
3. **错误处理测试**：测试错误处理是否正常工作
4. **渗透测试**：进行渗透测试，测试应用安全性

## ⚠️ 常见错误

1. **环境变量泄露**：
   - **错误描述**：敏感信息通过环境变量泄露
   - **风险**：敏感信息可能被攻击者获取
   - **解决方案**：使用环境变量验证和清理

2. **缺少安全头**：
   - **错误描述**：没有设置安全头
   - **风险**：可能被 XSS、CSRF 等攻击
   - **解决方案**：设置完整的安全头

3. **错误信息泄露**：
   - **错误描述**：错误信息包含敏感信息
   - **风险**：敏感信息可能被泄露
   - **解决方案**：清理错误信息中的敏感数据

4. **缺少错误监控**：
   - **错误描述**：没有监控应用错误
   - **风险**：无法及时发现和修复错误
   - **解决方案**：实施错误监控

## 📚 参考资料

- [OWASP Application Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Application_Security_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Vue 3 安全指南](https://vuejs.org/guide/best-practices/security.html)
- [React 安全指南](https://react.dev/learn/keeping-components-pure)