# Vue Security Scanner - 开发者指南

## 目录
1. [插件系统概述](#插件系统概述)
2. [创建自定义插件](#创建自定义插件)
3. [插件开发规范](#插件开发规范)
4. [漏洞对象格式](#漏洞对象格式)
5. [高级插件示例](#高级插件示例)
6. [配置和管理插件](#配置和管理插件)
7. [测试自定义插件](#测试自定义插件)
8. [最佳实践](#最佳实践)

## 插件系统概述

Vue Security Scanner 采用插件化架构，每个安全检测项都是一个独立的插件。这种设计允许：

- **模块化开发**：每个检测项独立开发和维护
- **灵活扩展**：轻松添加新的安全检测功能
- **可配置性**：按需启用或禁用特定检测项
- **社区贡献**：开发者可以共享自定义插件

## 创建自定义插件

### 基础插件模板

在 `plugins/` 目录下创建一个新的 JavaScript 文件：

```javascript
// plugins/my-custom-plugin.js
class MyCustomSecurityPlugin {
  constructor() {
    this.name = 'My Custom Security Plugin';      // 插件名称
    this.description = '我的自定义安全检测';      // 插件描述
    this.version = '1.0.0';                      // 插件版本
    this.enabled = true;                         // 是否启用
    this.severity = 'High';                      // 默认严重性
  }

  /**
   * 分析文件内容，返回发现的漏洞
   * @param {string} filePath - 要分析的文件路径
   * @param {string} content - 文件内容
   * @returns {Array} 发现的漏洞数组
   */
  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 在这里实现你的安全检测逻辑
    // 示例：检测硬编码的敏感信息
    const sensitivePattern = /(password|secret|token|key)\s*[:=]\s*['"`][^'"`]+['"`]/gi;
    let match;
    while ((match = sensitivePattern.exec(content)) !== null) {
      vulnerabilities.push({
        id: 'custom-sensitive-' + Date.now() + Math.random().toString(36).substr(2, 5),
        type: 'Sensitive Information Disclosure',
        severity: this.severity,
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        description: `Sensitive information found: ${match[0]}`,
        codeSnippet: match[0],
        recommendation: 'Move sensitive information to environment variables or secure storage.',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

// 导出插件实例
module.exports = new MyCustomSecurityPlugin();
```

### 异步检测插件

如果需要进行异步操作（如网络请求、外部API调用等）：

```javascript
// plugins/async-security-check.js
class AsyncSecurityPlugin {
  constructor() {
    this.name = 'Async Security Check';
    this.description = '异步安全检测插件';
    this.enabled = true;
    this.severity = 'Medium';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 示例：模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 10)); // 模拟延迟
    
    // 实现检测逻辑
    if (content.includes('dangerous-function-call')) {
      vulnerabilities.push({
        id: 'async-check-' + Date.now(),
        type: 'Dangerous Function Call',
        severity: this.severity,
        file: filePath,
        description: 'Potentially dangerous function call detected',
        codeSnippet: 'dangerous-function-call',
        recommendation: 'Review and validate this function call',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

module.exports = new AsyncSecurityPlugin();
```

## 插件开发规范

### 必需方法

每个插件必须实现以下方法：

1. **`analyze(filePath, content)`** - 分析文件的核心方法
   - 参数: `filePath` (string) - 文件路径, `content` (string) - 文件内容
   - 返回: Array - 漏洞对象数组

### 推荐属性

插件类应包含以下属性：

- `name` - 插件名称
- `description` - 插件描述
- `version` - 插件版本
- `enabled` - 是否启用
- `severity` - 默认严重性等级

### 错误处理

```javascript
// plugins/error-handling-plugin.js
class ErrorHandlingPlugin {
  constructor() {
    this.name = 'Error Handling Plugin';
    this.enabled = true;
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    try {
      const vulnerabilities = [];
      
      // 实现检测逻辑
      // ...
      
      return vulnerabilities;
    } catch (error) {
      console.error(`Error in plugin ${this.name}:`, error.message);
      return []; // 返回空数组而不是抛出错误
    }
  }
}

module.exports = new ErrorHandlingPlugin();
```

## 漏洞对象格式

每个检测到的漏洞必须是一个对象，包含以下字段：

### 必需字段

- `id` (string) - 唯一的漏洞ID
- `type` (string) - 漏洞类型
- `severity` (string) - 严重性 ('High', 'Medium', 'Low')
- `file` (string) - 文件路径
- `description` (string) - 漏洞描述
- `recommendation` (string) - 修复建议
- `plugin` (string) - 插件名称

### 可选字段

- `line` (number) - 发现漏洞的行号
- `column` (number) - 发现漏洞的列号
- `codeSnippet` (string) - 相关的代码片段
- `category` (string) - 漏洞类别
- `cweId` (string) - CWE编号（如果适用）

### 漏洞对象示例

```javascript
{
  id: 'xss-reflected-12345',
  type: 'Reflected XSS',
  severity: 'High',
  file: '/path/to/file.vue',
  line: 25,
  column: 10,
  description: 'Potential reflected XSS vulnerability in user input handling',
  codeSnippet: '<div>{{ userInput }}</div>',
  recommendation: 'Use proper sanitization or Vue\'s built-in XSS protection',
  category: 'Injection',
  cweId: 'CWE-79',
  plugin: 'XSS Detection Plugin'
}
```

## 高级插件示例

### Vue 特定安全检测插件

```javascript
// plugins/vue-specific-security.js
class VueSpecificSecurity {
  constructor() {
    this.name = 'Vue Specific Security';
    this.description = 'Vue.js 特定安全问题检测';
    this.enabled = true;
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检测不安全的 v-html 使用
    const vHtmlPattern = /<[^>]*v-html\s*=\s*["'][^"']*["'][^>]*>/gi;
    let match;
    while ((match = vHtmlPattern.exec(content)) !== null) {
      vulnerabilities.push({
        id: 'unsafe-vhtml-' + Date.now(),
        type: 'Unsafe v-html Usage',
        severity: this.severity,
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        description: `Unsafe v-html usage detected: ${match[0].substring(0, 50)}...`,
        codeSnippet: match[0],
        recommendation: 'Avoid using v-html with user-provided content. Sanitize input or use alternative approaches.',
        plugin: this.name
      });
    }
    
    // 检测潜在的原型污染
    const protoPollutionPattern = /(?:this\.|\w+\.)prototype\s*\.?\s*(?:__proto__|constructor)/gi;
    while ((match = protoPollutionPattern.exec(content)) !== null) {
      vulnerabilities.push({
        id: 'proto-pollution-' + Date.now(),
        type: 'Prototype Pollution',
        severity: 'High',
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        description: `Potential prototype pollution: ${match[0]}`,
        codeSnippet: match[0],
        recommendation: 'Avoid modifying object prototypes directly. Validate and sanitize object keys.',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

module.exports = new VueSpecificSecurity();
```

### 依赖安全性检测插件

```javascript
// plugins/dependency-security.js
const fs = require('fs');
const path = require('path');

class DependencySecurityPlugin {
  constructor() {
    this.name = 'Dependency Security';
    this.description = '依赖包安全检测';
    this.enabled = true;
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检测 package.json 文件
    if (path.basename(filePath) === 'package.json') {
      try {
        const packageJson = JSON.parse(content);
        
        // 检查过时的依赖
        if (packageJson.dependencies) {
          for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
            // 检查是否为已知的不安全版本
            if (this.isKnownVulnerable(depName, depVersion)) {
              vulnerabilities.push({
                id: `vulnerable-dep-${depName}-${Date.now()}`,
                type: 'Vulnerable Dependency',
                severity: this.severity,
                file: filePath,
                description: `${depName}@${depVersion} has known security vulnerabilities`,
                recommendation: `Update ${depName} to a secure version`,
                plugin: this.name
              });
            }
          }
        }
      } catch (error) {
        console.error('Error parsing package.json:', error.message);
      }
    }
    
    return vulnerabilities;
  }
  
  isKnownVulnerable(name, version) {
    // 这里可以集成外部漏洞数据库
    // 示例：检查一些已知的不安全包
    const vulnerablePackages = {
      'axios': '<0.27.0',
      'vue': '<3.2.0'
    };
    
    return vulnerablePackages[name] && this.versionCompare(version, vulnerablePackages[name]);
  }
  
  versionCompare(version1, version2) {
    // 简单的版本比较逻辑
    return version1.localeCompare(version2, undefined, { numeric: true }) < 0;
  }
}

module.exports = new DependencySecurityPlugin();
```

## 配置和管理插件

### 通过配置文件管理

在 `vue-security-scanner.config.json` 中配置插件：

```json
{
  "plugins": {
    "enabled": true,
    "directory": "./plugins",
    "settings": {
      "my-custom-plugin": {
        "enabled": true,
        "severityThreshold": "High",
        "options": {
          "customOption": "value"
        }
      }
    }
  }
}
```

### 插件配置访问

插件可以访问配置选项：

```javascript
// plugins/configurable-plugin.js
class ConfigurablePlugin {
  constructor(config = {}) {
    this.name = 'Configurable Plugin';
    this.description = '可配置的插件';
    this.enabled = config.enabled ?? true;
    this.severity = config.severityThreshold ?? 'Medium';
    this.customOptions = config.options || {};
  }

  async analyze(filePath, content) {
    // 使用自定义配置
    if (!this.enabled) {
      return [];
    }
    
    const vulnerabilities = [];
    // 实现检测逻辑...
    
    return vulnerabilities;
  }
}

// 注意：在配置插件时，构造函数参数由扫描器传递
module.exports = new ConfigurablePlugin();
```

## 测试自定义插件

### 1. 创建测试文件

创建包含已知问题的测试文件来验证插件：

```javascript
// test-files/test-vulnerabilities.js
const password = 'hardcoded_password_123'; // 应该被检测到
const secret = 'api_secret_key_here';      // 应该被检测到
const safeVar = 'normal_variable';         // 不应该被检测到
```

### 2. 运行扫描

```bash
# 扫描包含测试文件的目录
node bin/vue-security-scanner.js test-files/
```

### 3. 验证结果

检查输出中是否包含你的插件检测到的漏洞。

## 最佳实践

### 1. 性能优化

- 避免在大文件上使用复杂的正则表达式
- 使用高效的字符串搜索算法
- 考虑缓存检测结果

```javascript
// plugins/performance-optimized.js
class PerformanceOptimizedPlugin {
  constructor() {
    this.name = 'Performance Optimized Plugin';
    this.cache = new Map(); // 简单缓存
  }

  async analyze(filePath, content) {
    // 对于大文件跳过检测
    if (content.length > 100000) { // 100KB
      return [];
    }
    
    // 检查缓存
    const cacheKey = `${filePath}:${content.length}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const vulnerabilities = this.performAnalysis(filePath, content);
    
    // 缓存结果
    this.cache.set(cacheKey, vulnerabilities);
    
    return vulnerabilities;
  }
  
  performAnalysis(filePath, content) {
    // 实现分析逻辑
    return [];
  }
}

module.exports = new PerformanceOptimizedPlugin();
```

### 2. 准确性保证

- 避免过度匹配导致误报
- 使用精确的正则表达式模式
- 添加上下文验证

### 3. 用户友好

- 提供清晰的漏洞描述
- 给出具体的修复建议
- 包含相关的安全资源链接

### 4. 文档和注释

```javascript
/**
 * SQL注入检测插件
 * 
 * 检测可能的SQL注入漏洞，特别关注：
 * - 直接拼接到SQL查询中的用户输入
 * - 不安全的数据库查询构建
 * 
 * @example
 * // 这样的代码会被检测到
 * const query = `SELECT * FROM users WHERE id = ${userId}`;
 * 
 * @author Your Name
 * @version 1.0.0
 */
class SQLInjectionPlugin {
  // 插件实现
}
```

## 贡献插件

如果你想与社区分享你的插件：

1. 确保插件经过充分测试
2. 添加详细的文档和使用示例
3. 遵循代码质量标准
4. 考虑开源许可证

你可以将插件发布到 npm 或在项目仓库中创建 PR 来分享给其他用户。

通过遵循这些指南，你可以轻松地为 Vue Security Scanner 创建强大的自定义安全检测插件。