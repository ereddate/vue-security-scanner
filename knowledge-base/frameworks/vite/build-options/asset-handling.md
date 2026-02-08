# Vite 资源处理安全

## 📋 概述

Vite 提供了强大的资源处理功能，支持处理各种类型的资源，如 JavaScript、CSS、图片、字体等。资源处理虽然提高了开发体验，但也带来了新的安全挑战。了解和配置资源处理的安全特性对于构建安全的 Vite 应用至关重要。

## 🎯 核心安全特性

- **资源指纹**：Vite 为资源添加哈希指纹，确保资源的唯一性和安全性
- **资源限制**：Vite 支持限制资源的大小和类型
- **资源验证**：Vite 支持验证资源的来源和内容
- **资源隔离**：Vite 将资源隔离在不同的目录中，避免资源冲突

## 🔍 常见安全问题

### 问题 1：资源注入

**描述**：如果资源处理配置不当，攻击者可能注入恶意资源，如恶意脚本、恶意图片等。

**风险**：高风险，可能导致恶意代码执行，用户会话被劫持等严重后果。

**解决方案**：

1. **限制资源类型**：限制允许的资源类型
2. **验证资源来源**：验证资源的来源是否合法
3. **限制资源大小**：限制资源的大小，避免大文件攻击

```javascript
// vite.config.js
export default {
  build: {
    // 配置资源处理
    assetsInlineLimit: 4096,
    // 配置资源目录
    assetsDir: 'assets',
    // 配置资源文件名
    rollupOptions: {
      output: {
        // 使用哈希命名
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  
  // 配置资源插件
  plugins: [
    {
      name: 'resource-validator',
      enforce: 'pre',
      transform(code, id) {
        // 验证资源类型
        if (!id.match(/\.(js|ts|vue|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
          throw new Error(`不允许的资源类型: ${id}`);
        }
        
        return code;
      }
    }
  ]
};
```

### 问题 2：敏感资源泄露

**描述**：如果敏感资源（如 API 密钥、数据库凭证等）被错误地包含在构建产物中，可能导致信息泄露。

**风险**：高风险，可能导致敏感信息泄露，服务被滥用等严重后果。

**解决方案**：

1. **使用环境变量**：使用环境变量存储敏感信息
2. **配置资源排除**：配置排除敏感资源
3. **验证构建产物**：验证构建产物中不包含敏感信息

```javascript
// vite.config.js
export default {
  build: {
    // 配置资源排除
    rollupOptions: {
      output: {
        // 排除敏感文件
        manualChunks: {
          // 排除敏感文件
          'sensitive': []
        }
      }
    },
    // 配置资源大小限制
    chunkSizeWarningLimit: 500
  },
  
  // 配置环境变量
  define: {
    // 只暴露必要的环境变量
    'import.meta.env.API_BASE': JSON.stringify(process.env.API_BASE)
  }
};
```

### 问题 3：资源路径泄露

**描述**：如果资源路径配置不当，可能导致资源路径泄露，暴露应用的结构。

**风险**：中风险，可能导致应用结构暴露，敏感信息泄露等后果。

**解决方案**：

1. **配置资源目录**：配置安全的资源目录
2. **使用哈希命名**：使用哈希命名资源，避免路径猜测
3. **限制资源访问**：限制资源的访问权限

```javascript
// vite.config.js
export default {
  build: {
    // 配置资源目录
    assetsDir: 'assets',
    // 配置资源文件名
    rollupOptions: {
      output: {
        // 使用哈希命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  
  // 配置基础路径
  base: '/app/'
};
```

### 问题 4：资源缓存问题

**描述**：如果资源缓存配置不当，可能导致资源缓存问题，如旧资源被缓存、新资源不被更新等。

**风险**：低风险，主要影响用户体验，可能导致应用功能异常。

**解决方案**：

1. **使用哈希命名**：使用哈希命名资源，确保资源更新时缓存失效
2. **配置缓存策略**：配置适当的缓存策略
3. **配置资源版本**：配置资源版本，强制更新缓存

```javascript
// vite.config.js
export default {
  build: {
    // 配置资源文件名
    rollupOptions: {
      output: {
        // 使用哈希命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  
  // 配置资源版本
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION || '1.0.0')
  }
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// vite.config.js
export default {
  build: {
    // 配置资源处理
    assetsInlineLimit: 4096,
    // 配置资源目录
    assetsDir: 'assets',
    // 配置资源文件名
    rollupOptions: {
      output: {
        // 使用哈希命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    // 配置资源大小限制
    chunkSizeWarningLimit: 500
  },
  
  // 配置基础路径
  base: '/app/',
  
  // 配置环境变量
  define: {
    'import.meta.env.API_BASE': JSON.stringify(process.env.API_BASE)
  },
  
  // 配置资源插件
  plugins: [
    {
      name: 'resource-validator',
      enforce: 'pre',
      transform(code, id) {
        // 验证资源类型
        if (!id.match(/\.(js|ts|vue|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
          throw new Error(`不允许的资源类型: ${id}`);
        }
        
        return code;
      }
    }
  ]
};
```

### 安全检查清单

- [x] 限制允许的资源类型
- [x] 验证资源的来源是否合法
- [x] 限制资源的大小，避免大文件攻击
- [x] 使用环境变量存储敏感信息
- [x] 配置排除敏感资源
- [x] 验证构建产物中不包含敏感信息
- [x] 配置安全的资源目录
- [x] 使用哈希命名资源，避免路径猜测
- [x] 限制资源的访问权限
- [x] 使用哈希命名资源，确保资源更新时缓存失效
- [x] 配置适当的缓存策略
- [x] 配置资源版本，强制更新缓存

## 📚 最佳实践

1. **限制资源类型**：限制允许的资源类型，避免恶意资源注入
2. **验证资源来源**：验证资源的来源是否合法
3. **限制资源大小**：限制资源的大小，避免大文件攻击
4. **使用环境变量**：使用环境变量存储敏感信息
5. **配置资源排除**：配置排除敏感资源
6. **验证构建产物**：验证构建产物中不包含敏感信息
7. **使用哈希命名**：使用哈希命名资源，确保资源更新时缓存失效
8. **配置缓存策略**：配置适当的缓存策略

## 📞 安全资源

- [Vite 官方文档 - 资源处理](https://vitejs.dev/guide/assets.html)
- [OWASP 资源安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forward_Cheat_Sheet.html)
- [Mozilla 资源安全指南](https://developer.mozilla.org/en-US/docs/Web/Security)

## 📝 更新日志

- 2026-02-08：初始版本，添加资源处理安全指南