# Vite 自定义插件安全

## 📋 概述

Vite 支持开发自定义插件，为开发者提供了扩展 Vite 功能的能力。自定义插件虽然提供了灵活性，但也带来了新的安全挑战。了解和开发安全的自定义插件对于构建安全的 Vite 应用至关重要。

## 🎯 核心安全特性

- **插件钩子**：Vite 提供了丰富的插件钩子，允许开发者在构建过程的各个阶段介入
- **插件隔离**：Vite 将插件隔离在不同的环境中，避免插件冲突
- **插件验证**：Vite 支持验证插件的配置和输出
- **插件权限**：Vite 支持限制插件的权限，避免插件滥用

## 🔍 常见安全问题

### 问题 1：代码注入

**描述**：如果自定义插件未正确验证输入，可能导致代码注入攻击。

**风险**：高风险，可能导致恶意代码执行，应用被控制等严重后果。

**解决方案**：

1. **验证输入**：验证插件的所有输入，确保其合法性
2. **使用安全的 API**：使用安全的 API 处理代码
3. **限制插件权限**：限制插件的权限，避免滥用

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'secure-plugin',
      enforce: 'pre',
      transform(code, id) {
        // 验证文件路径
        if (!id.startsWith(process.cwd())) {
          throw new Error(`不允许的文件路径: ${id}`);
        }
        
        // 验证代码内容
        if (code.includes('eval(')) {
          throw new Error(`检测到不安全的代码: ${id}`);
        }
        
        return code;
      }
    }
  ]
});
```

### 问题 2：路径遍历

**描述**：如果自定义插件未正确验证文件路径，可能导致路径遍历攻击。

**风险**：高风险，可能导致敏感文件泄露，系统被控制等严重后果。

**解决方案**：

1. **验证文件路径**：验证文件路径是否合法
2. **使用绝对路径**：使用绝对路径，避免路径遍历
3. **限制文件访问**：限制插件的文件访问权限

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve, normalize } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'secure-plugin',
      enforce: 'pre',
      resolveId(source, importer) {
        // 验证文件路径
        const resolvedPath = resolve(process.cwd(), source);
        const normalizedPath = normalize(resolvedPath);
        
        // 检查路径是否在项目目录内
        if (!normalizedPath.startsWith(normalize(process.cwd()))) {
          throw new Error(`路径遍历攻击: ${source}`);
        }
        
        return null;
      }
    }
  ]
});
```

### 问题 3：依赖注入

**描述**：如果自定义插件未正确验证依赖，可能导致依赖注入攻击。

**风险**：中风险，可能导致恶意依赖被加载，代码被篡改等后果。

**解决方案**：

1. **验证依赖来源**：验证依赖的来源是否合法
2. **使用白名单**：使用白名单机制管理允许的依赖
3. **验证依赖完整性**：验证依赖的完整性

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'secure-plugin',
      enforce: 'pre',
      resolveId(source) {
        // 验证依赖来源
        if (source.startsWith('node_modules/')) {
          const allowedDependencies = ['vue', 'vue-router', 'pinia'];
          const dependencyName = source.split('/')[1];
          
          if (!allowedDependencies.includes(dependencyName)) {
            throw new Error(`不允许的依赖: ${dependencyName}`);
          }
        }
        
        return null;
      }
    }
  ]
});
```

### 问题 4：资源泄露

**描述**：如果自定义插件未正确清理资源，可能导致资源泄露，如文件句柄、内存等。

**风险**：中风险，可能导致应用性能下降，内存占用持续增长，最终导致应用崩溃。

**解决方案**：

1. **清理资源**：在插件卸载时清理所有资源
2. **使用弱引用**：使用弱引用存储对象，避免内存泄漏
3. **监控资源使用**：监控资源使用情况，及时发现异常

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'secure-plugin',
      buildStart() {
        // 初始化资源
        this.resources = [];
      },
      transform(code, id) {
        // 使用资源
        const resource = openResource(id);
        this.resources.push(resource);
        
        return code;
      },
      buildEnd() {
        // 清理资源
        this.resources.forEach(resource => {
          closeResource(resource);
        });
        this.resources = [];
      }
    }
  ]
});
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve, normalize } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'secure-plugin',
      enforce: 'pre',
      buildStart() {
        // 初始化资源
        this.resources = [];
      },
      resolveId(source, importer) {
        // 验证文件路径
        const resolvedPath = resolve(process.cwd(), source);
        const normalizedPath = normalize(resolvedPath);
        
        // 检查路径是否在项目目录内
        if (!normalizedPath.startsWith(normalize(process.cwd()))) {
          throw new Error(`路径遍历攻击: ${source}`);
        }
        
        // 验证依赖来源
        if (source.startsWith('node_modules/')) {
          const allowedDependencies = ['vue', 'vue-router', 'pinia'];
          const dependencyName = source.split('/')[1];
          
          if (!allowedDependencies.includes(dependencyName)) {
            throw new Error(`不允许的依赖: ${dependencyName}`);
          }
        }
        
        return null;
      },
      transform(code, id) {
        // 验证文件路径
        if (!id.startsWith(process.cwd())) {
          throw new Error(`不允许的文件路径: ${id}`);
        }
        
        // 验证代码内容
        if (code.includes('eval(')) {
          throw new Error(`检测到不安全的代码: ${id}`);
        }
        
        return code;
      },
      buildEnd() {
        // 清理资源
        this.resources.forEach(resource => {
          closeResource(resource);
        });
        this.resources = [];
      }
    }
  ]
});
```

### 安全插件模板

```javascript
// plugins/secure-plugin.js
import { resolve, normalize } from 'path';

export function createSecurePlugin(options = {}) {
  return {
    name: 'secure-plugin',
    enforce: 'pre',
    
    // 插件选项
    ...options,
    
    // 构建开始
    buildStart() {
      // 初始化资源
      this.resources = [];
      console.log('插件启动');
    },
    
    // 解析 ID
    resolveId(source, importer) {
      // 验证文件路径
      const resolvedPath = resolve(process.cwd(), source);
      const normalizedPath = normalize(resolvedPath);
      
      // 检查路径是否在项目目录内
      if (!normalizedPath.startsWith(normalize(process.cwd()))) {
        throw new Error(`路径遍历攻击: ${source}`);
      }
      
      return null;
    },
    
    // 转换代码
    transform(code, id) {
      // 验证文件路径
      if (!id.startsWith(process.cwd())) {
        throw new Error(`不允许的文件路径: ${id}`);
      }
      
      // 验证代码内容
      if (code.includes('eval(')) {
        throw new Error(`检测到不安全的代码: ${id}`);
      }
      
      return code;
    },
    
    // 构建结束
    buildEnd() {
      // 清理资源
      this.resources.forEach(resource => {
        closeResource(resource);
      });
      this.resources = [];
      console.log('插件结束');
    }
  };
}
```

### 安全检查清单

- [x] 验证插件的所有输入，确保其合法性
- [x] 使用安全的 API 处理代码
- [x] 限制插件的权限，避免滥用
- [x] 验证文件路径是否合法
- [x] 使用绝对路径，避免路径遍历
- [x] 限制插件的文件访问权限
- [x] 验证依赖的来源是否合法
- [x] 使用白名单机制管理允许的依赖
- [x] 验证依赖的完整性
- [x] 在插件卸载时清理所有资源
- [x] 使用弱引用存储对象，避免内存泄漏
- [x] 监控资源使用情况

## 📚 最佳实践

1. **验证输入**：验证插件的所有输入，确保其合法性
2. **使用安全的 API**：使用安全的 API 处理代码
3. **限制插件权限**：限制插件的权限，避免滥用
4. **验证文件路径**：验证文件路径是否合法
5. **使用绝对路径**：使用绝对路径，避免路径遍历
6. **验证依赖来源**：验证依赖的来源是否合法
7. **使用白名单**：使用白名单机制管理允许的依赖
8. **清理资源**：在插件卸载时清理所有资源

## 📞 安全资源

- [Vite 官方文档 - 插件 API](https://vitejs.dev/guide/api-plugin.html)
- [OWASP 代码注入备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Code_Injection_Prevention_Cheat_Sheet.html)
- [OWASP 路径遍历备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Path_Traversal_Cheat_Sheet.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加自定义插件安全指南