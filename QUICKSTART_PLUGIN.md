# 插件开发快速入门

本指南将帮助您快速开始开发 Vue Security Scanner 插件。

## 目录结构

```
your-project/
├── plugins/
│   ├── my-first-plugin.js
│   └── another-plugin.js
├── vue-security-scanner.config.json
└── .vue-security-ignore
```

## 第一步：创建插件文件

在 `plugins/` 目录下创建一个新的 JavaScript 文件，例如 `simple-xss-detection.js`：

```javascript
// plugins/simple-xss-detection.js
class SimpleXSSDetection {
  constructor() {
    this.name = 'Simple XSS Detection';
    this.description = '基础XSS漏洞检测';
    this.version = '1.0.0';
    this.enabled = true;
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检测潜在的XSS漏洞
    const xssPatterns = [
      /{{\s*.*[^|].*}}/g,  // 未过滤的插值
      /v-html\s*=/gi,      // v-html 使用
      /innerHTML\s*=/gi    // innerHTML 使用
    ];
    
    for (const pattern of xssPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        vulnerabilities.push({
          id: 'xss-simple-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          type: 'Potential XSS Vulnerability',
          severity: this.severity,
          file: filePath,
          line: content.substring(0, match.index).split('\n').length,
          description: `Potential XSS vulnerability detected: ${match[0]}`,
          codeSnippet: match[0],
          recommendation: 'Use Vue\'s built-in XSS protection or properly sanitize user input.',
          plugin: this.name
        });
      }
    }
    
    return vulnerabilities;
  }
}

module.exports = new SimpleXSSDetection();
```

## 第二步：测试插件

创建一个包含潜在漏洞的测试文件：

```vue
<!-- test-file.vue -->
<template>
  <!-- 这里应该被检测到 -->
  <div v-html="userInput"></div>
  <div>{{ unsafeVariable }}</div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '<script>alert("xss")</script>'
    }
  }
}
</script>
```

## 第三步：运行扫描

```bash
# 运行扫描以测试您的插件
node bin/vue-security-scanner.js test-file.vue
```

## 插件开发要点

### 1. 插件结构要求

每个插件必须：

- 实现 `analyze(filePath, content)` 方法
- 返回一个包含漏洞对象的数组
- 每个漏洞对象必须包含必需字段

### 2. 漏洞对象必需字段

```javascript
{
  id: 'unique-identifier',
  type: 'Vulnerability Type',
  severity: 'High|Medium|Low',
  file: '/path/to/file',
  description: 'Description of the vulnerability',
  recommendation: 'How to fix it',
  plugin: 'Plugin Name'
}
```

### 3. 常见检测模式

```javascript
// 检测硬编码凭证
const credentialPattern = /(password|secret|token|key)\s*[:=]\s*['"`][^'"`]+['"`]/gi;

// 检测危险函数
const dangerousFunctions = /\b(eval|Function|setTimeout|setInterval)\s*\(\s*['"`]/g;

// 检测不安全的导入
const unsafeImport = /import\s+.*from\s+['"`]\.\.\/.*['"`]/g;
```

## 高级功能

### 配置支持

```javascript
class ConfigurablePlugin {
  constructor(config = {}) {
    this.name = 'Configurable Plugin';
    this.enabled = config.enabled ?? true;
    this.severity = config.severity ?? 'Medium';
    this.customSetting = config.customSetting || 'default-value';
  }
  
  // ... analyze 方法
}
```

### 异步操作

```javascript
async analyze(filePath, content) {
  // 可以进行异步操作
  await someAsyncOperation();
  
  // 实现检测逻辑
  return vulnerabilities;
}
```

## 调试技巧

1. **使用控制台输出调试**：
```javascript
console.log('Analyzing:', filePath);
console.log('Content length:', content.length);
```

2. **测试单个插件**：
   - 临时禁用其他插件，只保留你的插件进行测试

3. **验证正则表达式**：
   - 使用在线正则表达式测试器验证模式

## 分享您的插件

如果您开发了一个有用的插件，可以：

1. 在 GitHub 上分享
2. 发布到 npm
3. 提交到 Vue Security Scanner 的官方插件库

---

现在您已经准备好创建自己的安全检测插件了！记住，好的插件应该是准确、高效且用户友好的。