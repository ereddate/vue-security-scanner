# Nuxt 全局中间件安全

## 📋 概述

Nuxt 全局中间件是在每个请求上运行的中间件，用于执行全局逻辑，如认证、日志记录、错误处理等。正确配置和实现全局中间件可以增强应用的安全性，但不当使用也可能引入安全漏洞。

## 🎯 核心安全特性

- **全局执行**：全局中间件在每个请求上执行，确保一致的安全检查
- **顺序控制**：中间件执行顺序可配置，确保安全检查先于业务逻辑
- **错误处理**：中间件可以捕获和处理错误，防止错误信息泄露
- **环境隔离**：中间件可以根据环境（客户端/服务器）执行不同逻辑

## 🔍 常见安全问题

### 问题 1：未授权访问

**描述**：如果全局中间件未正确实现认证和授权检查，可能导致未授权访问。

**风险**：高风险，可能导致未授权访问，敏感信息泄露等严重后果。

**解决方案**：

1. **实现认证检查**：在全局中间件中验证用户认证状态
2. **使用 Nuxt Auth**：使用 Nuxt Auth 模块处理认证
3. **验证令牌**：验证 JWT 等令牌的有效性

```javascript
// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  // 检查用户是否认证
  const user = useUserStore().user;
  if (!user) {
    // 重定向到登录页面
    return navigateTo('/login');
  }
  
  // 验证令牌有效性
  const token = useCookie('token').value;
  if (!token || !isValidToken(token)) {
    return navigateTo('/login');
  }
});
```

### 问题 2：CSRF 攻击

**描述**：如果全局中间件未实现 CSRF 保护，可能导致 CSRF 攻击。

**风险**：高风险，可能导致未授权操作，数据篡改等严重后果。

**解决方案**：

1. **使用 CSRF 令牌**：实现 CSRF 令牌验证
2. **验证请求来源**：验证请求的 Origin 和 Referer 头
3. **使用 SameSite Cookie**：配置 Cookie 的 SameSite 属性

```javascript
// middleware/csrf.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  // 只在服务器端执行
  if (process.server) {
    const event = useRequestEvent();
    const csrfToken = event.node.req.headers['x-csrf-token'];
    
    // 验证 CSRF 令牌
    if (!csrfToken || !validateCsrfToken(csrfToken)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'CSRF 验证失败'
      });
    }
  }
});
```

### 问题 3：敏感信息泄露

**描述**：如果全局中间件未正确处理错误，可能导致敏感信息通过错误响应泄露。

**风险**：中风险，可能导致敏感信息泄露，系统架构暴露等后果。

**解决方案**：

1. **统一错误处理**：实现统一的错误处理中间件
2. **过滤错误信息**：过滤错误响应中的敏感信息
3. **记录错误**：将详细错误信息记录到日志，而非返回给客户端

```javascript
// middleware/error-handling.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  // 捕获和处理错误
  try {
    // 执行后续中间件和路由
  } catch (error) {
    // 记录详细错误
    console.error('错误:', error);
    
    // 返回安全的错误信息
    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    });
  }
});
```

### 问题 4：性能和 DoS 风险

**描述**：如果全局中间件执行耗时操作或未限制请求频率，可能导致性能问题和 DoS 风险。

**风险**：中风险，可能导致应用性能下降，甚至服务不可用。

**解决方案**：

1. **优化中间件执行**：避免在中间件中执行耗时操作
2. **实现速率限制**：限制请求频率，防止 DoS 攻击
3. **缓存结果**：缓存中间件执行结果，减少重复计算

```javascript
// middleware/rate-limit.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  // 只在服务器端执行
  if (process.server) {
    const event = useRequestEvent();
    const ip = event.node.req.ip;
    
    // 检查请求频率
    if (isRateLimited(ip)) {
      throw createError({
        statusCode: 429,
        statusMessage: '请求过于频繁'
      });
    }
  }
});
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // 配置中间件
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/security'
  ],
  
  // 安全配置
  security: {
    // 启用 CSRF 保护
    csrf: {
      enabled: true,
      methods: ['POST', 'PUT', 'PATCH', 'DELETE']
    },
    // 配置速率限制
    rateLimiter: {
      enabled: true,
      tokensPerInterval: 100,
      interval: '1m'
    }
  },
  
  // 配置中间件执行顺序
  router: {
    middleware: ['auth', 'csrf', 'rate-limit', 'error-handling']
  }
});
```

### 安全检查清单

- [x] 实现全局认证中间件
- [x] 实现 CSRF 保护中间件
- [x] 实现统一错误处理中间件
- [x] 实现速率限制中间件
- [x] 验证中间件执行顺序
- [x] 测试中间件在不同环境下的行为
- [x] 确保中间件不会泄露敏感信息
- [x] 优化中间件性能

## 📚 最佳实践

1. **使用 Nuxt 官方模块**：使用 Nuxt Auth、Nuxt Security 等官方模块处理安全
2. **分离关注点**：每个中间件只负责一个安全职责
3. **环境隔离**：使用 `process.server` 和 `process.client` 隔离环境
4. **错误处理**：实现统一的错误处理，避免错误信息泄露
5. **性能优化**：避免在中间件中执行耗时操作，使用缓存
6. **测试中间件**：对中间件进行单元测试和集成测试
7. **定期更新**：定期更新 Nuxt 和相关安全模块

## 📞 安全资源

- [Nuxt 官方文档 - 中间件](https://nuxt.com/docs/guide/directory-structure/middleware)
- [Nuxt Auth 模块](https://sidebase.io/nuxt-auth/)
- [Nuxt Security 模块](https://nuxt.com/modules/security)
- [OWASP 认证备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP CSRF 防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加全局中间件安全指南