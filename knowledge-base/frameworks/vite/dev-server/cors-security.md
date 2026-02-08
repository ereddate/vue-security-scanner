# Vite 开发服务器 CORS 安全

## 📋 概述

Vite 开发服务器支持跨域资源共享 (CORS) 配置，允许开发者在开发环境中处理跨域请求。CORS 配置虽然方便了开发，但也带来了新的安全挑战。了解和配置 CORS 的安全特性对于构建安全的开发环境至关重要。

## 🎯 核心安全特性

- **CORS 预检**：Vite 支持 CORS 预检请求，验证跨域请求的合法性
- **源验证**：Vite 支持配置允许的源，限制跨域请求的来源
- **方法限制**：Vite 支持配置允许的 HTTP 方法，限制跨域请求的类型
- **头部限制**：Vite 支持配置允许的请求头，限制跨域请求的头部

## 🔍 常见安全问题

### 问题 1：CORS 配置过于宽松

**描述**：如果 CORS 配置过于宽松，如允许所有源 (`*`)，可能导致跨域安全问题。

**风险**：高风险，可能导致未授权的跨域请求，数据泄露等严重后果。

**解决方案**：

1. **限制允许的源**：只允许特定的源进行跨域请求
2. **使用白名单**：使用白名单机制管理允许的源
3. **验证请求来源**：验证跨域请求的来源是否合法

```javascript
// vite.config.js
export default {
  server: {
    // 配置 CORS
    cors: {
      // 只允许特定的源
      origin: ['http://localhost:3000', 'https://example.com'],
      // 允许的方法
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      // 允许的请求头
      allowedHeaders: ['Content-Type', 'Authorization'],
      // 暴露的响应头
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      // 允许携带凭证
      credentials: true,
      // 预检请求的缓存时间
      maxAge: 600
    }
  }
};
```

### 问题 2：CORS 凭证泄露

**描述**：如果 CORS 配置允许携带凭证，但未正确配置允许的源，可能导致凭证泄露。

**风险**：高风险，可能导致用户凭证泄露，会话被劫持等严重后果。

**解决方案**：

1. **限制允许的源**：只允许特定的源携带凭证
2. **验证请求来源**：验证跨域请求的来源是否合法
3. **使用 SameSite Cookie**：使用 SameSite Cookie 属性限制 Cookie 的发送

```javascript
// vite.config.js
export default {
  server: {
    cors: {
      // 只允许特定的源携带凭证
      origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000', 'https://example.com'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('不允许的源'));
        }
      },
      // 允许携带凭证
      credentials: true
    }
  }
};
```

### 问题 3：CORS 预检请求滥用

**描述**：如果 CORS 预检请求未正确配置，可能导致预检请求被滥用，影响服务器性能。

**风险**：中风险，可能导致服务器性能下降，服务不可用等后果。

**解决方案**：

1. **配置预检请求缓存**：配置预检请求的缓存时间，减少预检请求的数量
2. **限制预检请求的方法**：限制预检请求允许的方法
3. **监控预检请求**：监控预检请求的数量和来源，及时发现异常

```javascript
// vite.config.js
export default {
  server: {
    cors: {
      // 配置预检请求的缓存时间
      maxAge: 600,
      // 允许的方法
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      // 允许的请求头
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
};
```

### 问题 4：CORS 头部注入

**描述**：如果 CORS 配置未正确验证请求头，可能导致头部注入攻击。

**风险**：中风险，可能导致请求头被篡改，数据泄露等后果。

**解决方案**：

1. **验证请求头**：验证跨域请求的请求头是否合法
2. **使用白名单**：使用白名单机制管理允许的请求头
3. **过滤危险的请求头**：过滤危险的请求头，如 `Authorization` 等

```javascript
// vite.config.js
export default {
  server: {
    cors: {
      // 使用白名单管理允许的请求头
      allowedHeaders: ['Content-Type', 'Authorization'],
      // 过滤危险的请求头
      exposedHeaders: ['Content-Range', 'X-Content-Range']
    }
  }
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// vite.config.js
export default {
  server: {
    // 配置 CORS
    cors: {
      // 只允许特定的源
      origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000', 'https://example.com'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('不允许的源'));
        }
      },
      // 允许的方法
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      // 允许的请求头
      allowedHeaders: ['Content-Type', 'Authorization'],
      // 暴露的响应头
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      // 允许携带凭证
      credentials: true,
      // 预检请求的缓存时间
      maxAge: 600
    }
  }
};
```

### 开发环境配置

```javascript
// vite.config.js
export default {
  server: {
    // 配置 CORS
    cors: {
      // 开发环境允许本地源
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      // 允许的方法
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      // 允许的请求头
      allowedHeaders: ['Content-Type', 'Authorization'],
      // 允许携带凭证
      credentials: true,
      // 预检请求的缓存时间
      maxAge: 600
    }
  }
};
```

### 生产环境配置

```javascript
// vite.config.js
export default {
  server: {
    // 配置 CORS
    cors: {
      // 生产环境只允许特定的源
      origin: ['https://example.com'],
      // 允许的方法
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      // 允许的请求头
      allowedHeaders: ['Content-Type', 'Authorization'],
      // 允许携带凭证
      credentials: true,
      // 预检请求的缓存时间
      maxAge: 600
    }
  }
};
```

### 安全检查清单

- [x] 只允许特定的源进行跨域请求
- [x] 使用白名单机制管理允许的源
- [x] 验证跨域请求的来源是否合法
- [x] 只允许特定的源携带凭证
- [x] 使用 SameSite Cookie 属性限制 Cookie 的发送
- [x] 配置预检请求的缓存时间
- [x] 限制预检请求允许的方法
- [x] 监控预检请求的数量和来源
- [x] 验证跨域请求的请求头是否合法
- [x] 使用白名单机制管理允许的请求头
- [x] 过滤危险的请求头

## 📚 最佳实践

1. **限制允许的源**：只允许特定的源进行跨域请求
2. **使用白名单**：使用白名单机制管理允许的源和请求头
3. **验证请求来源**：验证跨域请求的来源是否合法
4. **配置预检请求缓存**：配置预检请求的缓存时间，减少预检请求的数量
5. **监控 CORS 请求**：监控 CORS 请求的数量和来源，及时发现异常
6. **使用 HTTPS**：确保所有跨域请求都使用 HTTPS 协议
7. **测试 CORS 配置**：在不同场景下测试 CORS 配置，确保其稳定性和安全性

## 📞 安全资源

- [Vite 官方文档 - CORS](https://vitejs.dev/config/server-options.html#server-cors)
- [OWASP CORS 备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [Mozilla CORS 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 📝 更新日志

- 2026-02-08：初始版本，添加 CORS 安全指南