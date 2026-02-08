# Vite 源码映射安全

## 📋 概述

Vite 支持生成源码映射，帮助开发者在生产环境中调试代码。源码映射虽然提高了调试体验，但也带来了新的安全挑战。了解和配置源码映射的安全特性对于构建安全的 Vite 应用至关重要。

## 🎯 核心安全特性

- **源码映射生成**：Vite 支持生成源码映射，帮助调试生产环境代码
- **源码映射控制**：Vite 支持控制源码映射的生成和发布
- **源码映射验证**：Vite 支持验证源码映射的完整性和安全性
- **源码映射隔离**：Vite 将源码映射隔离在单独的文件中，避免影响主代码

## 🔍 常见安全问题

### 问题 1：源码映射泄露

**描述**：如果源码映射被发布到生产环境，攻击者可以获取应用的源码，可能导致源码泄露。

**风险**：高风险，可能导致源码泄露，敏感信息暴露，应用被逆向工程等严重后果。

**解决方案**：

1. **禁用源码映射**：在生产环境中禁用源码映射
2. **限制源码映射访问**：如果必须使用源码映射，限制其访问权限
3. **验证源码映射**：验证源码映射的完整性和安全性

```javascript
// vite.config.js
export default {
  build: {
    // 禁用源码映射
    sourcemap: false
  }
};
```

### 问题 2：源码映射包含敏感信息

**描述**：如果源码映射包含敏感信息，如 API 密钥、数据库凭证等，可能导致信息泄露。

**风险**：高风险，可能导致敏感信息泄露，服务被滥用等严重后果。

**解决方案**：

1. **使用环境变量**：使用环境变量存储敏感信息
2. **验证源码映射**：验证源码映射中不包含敏感信息
3. **清理源码映射**：清理源码映射中的敏感信息

```javascript
// vite.config.js
export default {
  build: {
    // 配置源码映射
    sourcemap: true,
    // 配置源码映射选项
    rollupOptions: {
      output: {
        // 配置源码映射文件名
        sourcemapFileNames: 'sourcemaps/[name]-[hash].map'
      }
    }
  },
  
  // 配置环境变量
  define: {
    // 只暴露必要的环境变量
    'import.meta.env.API_BASE': JSON.stringify(process.env.API_BASE)
  }
};
```

### 问题 3：源码映射被篡改

**描述**：如果源码映射被篡改，可能导致调试信息不准确，甚至误导开发者。

**风险**：中风险，可能导致调试困难，开发效率下降。

**解决方案**：

1. **验证源码映射**：验证源码映射的完整性和安全性
2. **使用签名验证**：对源码映射进行签名验证
3. **监控源码映射**：监控源码映射的变化，及时发现异常

```javascript
// vite.config.js
export default {
  build: {
    // 配置源码映射
    sourcemap: true,
    // 配置源码映射选项
    rollupOptions: {
      output: {
        // 配置源码映射文件名
        sourcemapFileNames: 'sourcemaps/[name]-[hash].map'
      }
    }
  },
  
  // 配置源码映射验证插件
  plugins: [
    {
      name: 'sourcemap-validator',
      generateBundle(options, bundle) {
        // 验证源码映射
        for (const fileName in bundle) {
          const file = bundle[fileName];
          if (file.type === 'asset' && fileName.endsWith('.map')) {
            // 验证源码映射
            const sourcemap = JSON.parse(file.source);
            if (!sourcemap.version || sourcemap.version !== 3) {
              throw new Error(`无效的源码映射版本: ${fileName}`);
            }
          }
        }
      }
    }
  ]
};
```

### 问题 4：源码映射性能问题

**描述**：如果源码映射配置不当，可能导致性能问题，如加载时间过长、内存占用过高等。

**风险**：低风险，主要影响用户体验，可能导致应用性能下降。

**解决方案**：

1. **禁用源码映射**：在生产环境中禁用源码映射
2. **限制源码映射范围**：限制源码映射的范围，减少映射文件的大小
3. **优化源码映射**：优化源码映射的生成过程

```javascript
// vite.config.js
export default {
  build: {
    // 配置源码映射
    sourcemap: true,
    // 配置源码映射选项
    rollupOptions: {
      output: {
        // 配置源码映射文件名
        sourcemapFileNames: 'sourcemaps/[name]-[hash].map',
        // 配置源码映射选项
        sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
          // 转换源码映射路径
          return sourcemapPath;
        }
      }
    }
  }
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// vite.config.js
export default {
  build: {
    // 生产环境禁用源码映射
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    // 配置源码映射选项
    rollupOptions: {
      output: {
        // 配置源码映射文件名
        sourcemapFileNames: 'sourcemaps/[name]-[hash].map'
      }
    }
  },
  
  // 配置环境变量
  define: {
    // 只暴露必要的环境变量
    'import.meta.env.API_BASE': JSON.stringify(process.env.API_BASE)
  },
  
  // 配置源码映射验证插件
  plugins: [
    {
      name: 'sourcemap-validator',
      generateBundle(options, bundle) {
        // 验证源码映射
        for (const fileName in bundle) {
          const file = bundle[fileName];
          if (file.type === 'asset' && fileName.endsWith('.map')) {
            // 验证源码映射
            const sourcemap = JSON.parse(file.source);
            if (!sourcemap.version || sourcemap.version !== 3) {
              throw new Error(`无效的源码映射版本: ${fileName}`);
            }
          }
        }
      }
    }
  ]
};
```

### 开发环境配置

```javascript
// vite.config.js
export default {
  build: {
    // 开发环境启用源码映射
    sourcemap: true,
    // 配置源码映射选项
    rollupOptions: {
      output: {
        // 配置源码映射文件名
        sourcemapFileNames: 'sourcemaps/[name]-[hash].map'
      }
    }
  }
};
```

### 生产环境配置

```javascript
// vite.config.js
export default {
  build: {
    // 生产环境禁用源码映射
    sourcemap: false
  }
};
```

### 安全检查清单

- [x] 在生产环境中禁用源码映射
- [x] 如果必须使用源码映射，限制其访问权限
- [x] 验证源码映射的完整性和安全性
- [x] 使用环境变量存储敏感信息
- [x] 验证源码映射中不包含敏感信息
- [x] 清理源码映射中的敏感信息
- [x] 验证源码映射的版本
- [x] 对源码映射进行签名验证
- [x] 监控源码映射的变化
- [x] 限制源码映射的范围
- [x] 优化源码映射的生成过程

## 📚 最佳实践

1. **禁用源码映射**：在生产环境中禁用源码映射，避免源码泄露
2. **限制源码映射访问**：如果必须使用源码映射，限制其访问权限
3. **验证源码映射**：验证源码映射的完整性和安全性
4. **使用环境变量**：使用环境变量存储敏感信息
5. **清理源码映射**：清理源码映射中的敏感信息
6. **监控源码映射**：监控源码映射的变化，及时发现异常
7. **测试源码映射**：在不同场景下测试源码映射，确保其稳定性和安全性

## 📞 安全资源

- [Vite 官方文档 - 源码映射](https://vitejs.dev/guide/build.html#sourcemaps)
- [OWASP 源码映射安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Source_Code_Management_Cheat_Sheet.html)
- [Mozilla 源码映射文档](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)

## 📝 更新日志

- 2026-02-08：初始版本，添加源码映射安全指南