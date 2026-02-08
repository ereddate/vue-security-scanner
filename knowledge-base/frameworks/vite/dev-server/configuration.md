# Vite 开发服务器配置安全

## 📋 概述

Vite 的开发服务器提供了快速的开发体验，但需要注意配置安全，避免开发环境中的安全漏洞。

## 🎯 核心安全特性

- **HTTPS 支持**：Vite 开发服务器支持 HTTPS，提供安全的开发环境
- **代理配置**：Vite 提供了代理配置，可以安全地转发请求
- **CORS 配置**：Vite 提供了 CORS 配置，控制跨域访问
- **HMR 安全**：Vite 的热模块替换 (HMR) 提供了安全的更新机制

## 🔍 常见安全问题

### 问题 1：开发服务器未启用 HTTPS

**描述**：如果开发服务器未启用 HTTPS，可能导致中间人攻击、数据泄露等安全问题。

**风险**：中风险，可能导致数据泄露，会话劫持等后果。

**解决方案**：

1. **启用 HTTPS**：在开发服务器配置中启用 HTTPS
2. **使用自签名证书**：在开发环境中使用自签名证书
3. **配置证书信任**：在浏览器中信任自签名证书

```javascript
// vite.config.js
import fs from 'fs';
import path from 'path';

export default {
  server: {
    // 启用 HTTPS
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
    }
  }
};
```

### 问题 2：开发服务器暴露到公网

**描述**：如果开发服务器配置为暴露到公网，可能导致未授权访问、数据泄露等安全问题。

**风险**：高风险，可能导致未授权访问，数据泄露等严重后果。

**解决方案**：

1. **限制访问地址**：配置开发服务器只监听本地地址
2. **使用防火墙**：使用防火墙限制对开发服务器的访问
3. **添加认证**：为开发服务器添加认证机制

```javascript
// vite.config.js
export default {
  server: {
    // 只监听本地地址
    host: 'localhost',
    // 或使用 127.0.0.1
    // host: '127.0.0.1'
  }
};
```

### 问题 3：开发服务器代理配置不当

**描述**：如果开发服务器的代理配置不当，可能导致未授权访问、数据泄露等安全问题。

**风险**：中风险，可能导致未授权访问，数据泄露等后果。

**解决方案**：

1. **验证代理目标**：只代理到可信的目标服务器
2. **限制代理路径**：只代理必要的路径
3. **添加认证**：为代理请求添加认证头

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      // 代理 API 请求
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 限制代理路径
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 代理静态资源
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
```

### 问题 4：开发服务器 CORS 配置不当

**描述**：如果开发服务器的 CORS 配置不当，可能导致跨域攻击、数据泄露等安全问题。

**风险**：中风险，可能导致跨域攻击，数据泄露等后果。

**解决方案**：

1. **限制允许的来源**：只允许受信任的来源
2. **限制允许的方法**：只允许必要的 HTTP 方法
3. **限制允许的头**：只允许必要的 HTTP 头

```javascript
// vite.config.js
export default {
  server: {
    cors: {
      // 限制允许的来源
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      // 限制允许的方法
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      // 限制允许的头
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// vite.config.js
import fs from 'fs';
import path from 'path';

export default {
  server: {
    // 启用 HTTPS
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
    },
    // 只监听本地地址
    host: 'localhost',
    // 配置代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // 配置 CORS
    cors: {
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
};
```

### 安全检查清单

- [x] 启用 HTTPS，使用自签名证书
- [x] 限制开发服务器只监听本地地址
- [x] 使用防火墙限制对开发服务器的访问
- [x] 验证代理目标，只代理到可信的目标服务器
- [x] 限制代理路径，只代理必要的路径
- [x] 为代理请求添加认证头
- [x] 限制 CORS 允许的来源
- [x] 限制 CORS 允许的方法
- [x] 限制 CORS 允许的头
- [x] 定期更新 Vite 和相关依赖

## 📚 最佳实践

1. **启用 HTTPS**：在开发服务器中启用 HTTPS，提供安全的开发环境
2. **限制访问地址**：配置开发服务器只监听本地地址，避免暴露到公网
3. **使用防火墙**：使用防火墙限制对开发服务器的访问
4. **验证代理配置**：验证代理目标，只代理到可信的目标服务器
5. **限制 CORS 配置**：限制 CORS 允许的来源、方法和头
6. **添加认证**：为开发服务器添加认证机制，防止未授权访问
7. **定期更新**：定期更新 Vite 和相关依赖，修复已知安全漏洞

## 📞 安全资源

- [Vite 官方文档 - 开发服务器](https://vitejs.dev/config/server-options.html)
- [Vite 官方文档 - 代理](https://vitejs.dev/config/server-options.html#server-proxy)
- [OWASP 服务器安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Server_Security_Cheat_Sheet.html)
- [OWASP CORS 备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加开发服务器配置安全指南
- 2024-02-15：更新 Vite 5.x 开发服务器安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践