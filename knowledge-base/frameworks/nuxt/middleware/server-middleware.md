# Nuxt 服务端中间件安全

## 📋 概述

Nuxt 服务端中间件是运行在服务器端的中间件，用于处理 API 请求、静态文件、代理请求等。服务端中间件直接与服务器交互，需要特别注意安全问题，如未授权访问、请求注入、DoS 攻击等。

## 🎯 核心安全特性

- **服务器端执行**：服务端中间件只在服务器端执行，避免客户端暴露
- **请求处理**：服务端中间件可以处理 API 请求和静态文件
- **代理功能**：服务端中间件可以代理请求到其他服务
- **环境隔离**：服务端中间件运行在隔离的服务器环境中

## 🔍 常见安全问题

### 问题 1：未授权的 API 访问

**描述**：如果服务端中间件未实现认证和授权检查，可能导致未授权的 API 访问。

**风险**：高风险，可能导致未授权数据访问，敏感信息泄露等严重后果。

**解决方案**：

1. **实现认证中间件**：创建认证中间件验证请求
2. **使用 JWT**：使用 JWT 验证用户身份
3. **权限检查**：验证用户权限是否满足 API 要求

```javascript
// server/middleware/auth.js
export default defineEventHandler((event) => {
  // 获取 Authorization 头
  const authHeader = getHeader(event, 'authorization');
  
  // 验证 Authorization 头
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权访问'
    });
  }
  
  // 验证令牌
  const token = authHeader.split(' ')[1];
  if (!isValidToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: '无效的令牌'
    });
  }
  
  // 解码令牌并设置用户信息
  const user = decodeToken(token);
  event.context.user = user;
});
```

### 问题 2：请求注入攻击

**描述**：如果服务端中间件未验证请求参数和头部，可能导致请求注入攻击。

**风险**：高风险，可能导致 SQL 注入、命令注入、XSS 攻击等严重后果。

**解决方案**：

1. **验证请求参数**：验证所有请求参数的格式和类型
2. **清理输入**：清理和转义用户输入
3. **使用参数化查询**：使用参数化查询或 ORM 框架

```javascript
// server/api/users/[id].js
export default defineEventHandler(async (event) => {
  // 获取并验证 ID 参数
  const id = getRouterParam(event, 'id');
  if (!id || !/^[0-9a-f]{24}$/.test(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的用户 ID'
    });
  }
  
  // 使用参数化查询获取用户
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: '用户不存在'
    });
  }
  
  return user;
});
```

### 问题 3：DoS 攻击

**描述**：如果服务端中间件未实现速率限制和请求验证，可能导致 DoS 攻击。

**风险**：高风险，可能导致服务不可用，业务中断等严重后果。

**解决方案**：

1. **实现速率限制**：使用 Redis 等实现速率限制
2. **验证请求大小**：限制请求体大小，防止大请求攻击
3. **优化数据库查询**：避免慢查询，添加索引

```javascript
// server/middleware/rate-limit.js
import { createRateLimiter } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redis = new Redis();

const rateLimiter = new createRateLimiter({
  storeClient: redis,
  points: 100, // 100 个请求
  duration: 60, // 每分钟
});

export default defineEventHandler(async (event) => {
  // 获取客户端 IP
  const ip = getClientAddress(event);
  
  try {
    // 检查速率限制
    await rateLimiter.consume(ip);
  } catch (error) {
    throw createError({
      statusCode: 429,
      statusMessage: '请求过于频繁，请稍后再试'
    });
  }
});
```

### 问题 4：敏感信息泄露

**描述**：如果服务端中间件未正确处理错误和日志，可能导致敏感信息泄露。

**风险**：中风险，可能导致敏感信息泄露，系统架构暴露等后果。

**解决方案**：

1. **统一错误处理**：实现统一的错误处理中间件
2. **过滤错误信息**：过滤错误信息中的敏感内容
3. **安全日志记录**：记录安全的日志信息，避免敏感数据

```javascript
// server/middleware/error-handler.js
export default defineEventHandler(async (event) => {
  try {
    await next(event);
  } catch (error) {
    // 记录详细错误
    console.error('服务端错误:', error);
    
    // 返回安全的错误信息
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误',
      // 避免返回敏感信息
      data: process.env.NODE_ENV === 'production' ? {} : { message: error.message }
    });
  }
});
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // 配置服务端中间件
  serverMiddleware: [
    '~/server/middleware/error-handler.js',
    '~/server/middleware/rate-limit.js',
    '~/server/middleware/auth.js'
  ],
  
  // 服务器配置
  nitro: {
    // 配置安全头
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    // 配置请求限制
    requestSizeLimit: '1mb'
  },
  
  // 环境变量
  runtimeConfig: {
    // 服务器端配置
    apiSecret: process.env.API_SECRET,
    // 客户端配置
    public: {
      apiBase: process.env.API_BASE
    }
  }
});
```

### 安全检查清单

- [x] 实现认证和授权中间件
- [x] 验证所有请求参数和头部
- [x] 实现速率限制防止 DoS 攻击
- [x] 统一错误处理，避免敏感信息泄露
- [x] 配置安全头保护服务器
- [x] 限制请求体大小
- [x] 使用参数化查询避免 SQL 注入
- [x] 定期更新依赖，修复安全漏洞

## 📚 最佳实践

1. **使用 Nuxt Nitro**：使用 Nuxt Nitro 提供的安全特性
2. **分离关注点**：每个服务端中间件只负责一个职责
3. **环境变量**：使用环境变量存储敏感配置
4. **错误处理**：实现统一的错误处理，避免错误信息泄露
5. **速率限制**：实现速率限制防止 DoS 攻击
6. **安全头**：配置适当的安全头保护服务器
7. **测试中间件**：对服务端中间件进行单元测试和集成测试
8. **定期更新**：定期更新 Nuxt 和相关依赖

## 📞 安全资源

- [Nuxt 官方文档 - 服务端中间件](https://nuxt.com/docs/guide/directory-structure/server)
- [Nitro 官方文档](https://nitro.unjs.io/)
- [OWASP 服务器安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP 速率限制备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加服务端中间件安全指南