# Vue Security Scanner - 规则扩展指南

## 概述

Vue Security Scanner 使用规则引擎来检测安全漏洞。本文档详细说明如何扩展和添加新的安全规则。

## 规则结构

每条安全规则都是一个配置对象，包含以下字段：

```javascript
{
  id: 'rule-id',                    // 唯一标识符（必需）
  name: 'Rule Name',                // 规则名称（必需）
  severity: 'High',                 // 严重性：High/Medium/Low（必需）
  description: 'Description',        // 规则描述（必需）
  recommendation: 'Fix advice',     // 修复建议（必需）
  patterns: [                       // 检测模式（必需）
    {
      key: 'pattern-key',           // 模式键（用于缓存）
      pattern: 'regex-pattern',     // 正则表达式模式
      flags: 'gi'                   // 可选：正则标志
    }
  ]
}
```

## 扩展方式

### 方式1：直接添加到 security-rules.js

在 `src/rules/security-rules.js` 文件中直接添加新规则：

```javascript
const securityRules = [
  // ... 现有规则
  
  // 添加新规则
  {
    id: 'custom-rule-1',
    name: 'Custom Security Rule',
    severity: 'High',
    description: '检测自定义安全问题',
    recommendation: '修复建议',
    patterns: [
      { key: 'custom-pattern', pattern: 'your-regex-pattern' }
    ]
  }
];

module.exports = securityRules;
```

### 方式2：创建独立的规则文件

创建独立的规则文件，然后在主规则文件中导入：

#### 步骤1：创建自定义规则文件

```javascript
// src/rules/custom-rules.js
const customRules = [
  {
    id: 'custom-api-key',
    name: 'Custom API Key',
    severity: 'High',
    description: '检测自定义API密钥泄露',
    recommendation: '将API密钥移至环境变量',
    patterns: [
      { key: 'api-key', pattern: 'CUSTOM_API_KEY\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'custom-endpoint',
    name: 'Custom Endpoint',
    severity: 'Medium',
    description: '检测自定义端点使用',
    recommendation: '使用配置化的端点',
    patterns: [
      { key: 'endpoint', pattern: 'https?://api\\.example\\.com' }
    ]
  }
];

module.exports = customRules;
```

#### 步骤2：在主规则文件中导入

```javascript
// src/rules/security-rules.js
const customRules = require('./custom-rules');

const securityRules = [
  // ... 现有规则
  ...customRules  // 合并自定义规则
];

module.exports = securityRules;
```

### 方式3：使用配置文件扩展

创建 JSON 配置文件，动态加载规则：

```javascript
// src/rules/load-custom-rules.js
const fs = require('fs');
const path = require('path');

function loadCustomRules() {
  const customRulesPath = path.join(__dirname, '../../custom-rules.json');
  
  if (fs.existsSync(customRulesPath)) {
    const customRules = JSON.parse(fs.readFileSync(customRulesPath, 'utf8'));
    return customRules;
  }
  
  return [];
}

module.exports = loadCustomRules;
```

然后在 `security-rules.js` 中使用：

```javascript
const loadCustomRules = require('./load-custom-rules');

const securityRules = [
  // ... 现有规则
  ...loadCustomRules()
];
```

## 规则示例

### 示例1：检测硬编码密码

```javascript
{
  id: 'hardcoded-password',
  name: 'Hardcoded Password',
  severity: 'High',
  description: 'Possible hardcoded password',
  recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
  patterns: [
    { key: 'password', pattern: "password\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
  ]
}
```

### 示例2：检测 SQL 注入

```javascript
{
  id: 'sql-injection-sequelize',
  name: 'SQL Injection via Sequelize',
  severity: 'High',
  description: 'Potential SQL injection through user input in Sequelize queries',
  recommendation: 'Always use parameterized queries or Sequelize\'s built-in query builders.',
  patterns: [
    { key: 'sequelize-user-input', pattern: '\\b(sequelize|mysql|pg|sqlite|mssql)\\b.*(?:req\\.|params|query|body)' }
  ]
}
```

### 示例3：检测内存泄漏

```javascript
{
  id: 'memory-leak-event-listener',
  name: 'Event Listener Memory Leak',
  severity: 'Medium',
  description: 'Potential memory leak from event listeners',
  recommendation: 'Ensure event listeners are removed when no longer needed using removeEventListener.',
  patterns: [
    { key: 'event-listener', pattern: '\\.(addEventListener|attachEvent)' }
  ]
}
```

### 示例4：检测不安全的 Cookie

```javascript
{
  id: 'cookie-missing-httponly',
  name: 'Cookie Without HttpOnly Flag',
  severity: 'High',
  description: 'Cookie missing HttpOnly flag',
  recommendation: 'Set the HttpOnly flag on cookies to prevent JavaScript access.',
  patterns: [
    { key: 'cookie-no-httponly', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*httponly\\b)["\'])' }
  ]
}
```

### 示例5：检测第三方库漏洞

```javascript
{
  id: 'vulnerable-lodash',
  name: 'Vulnerable Lodash Version',
  severity: 'High',
  description: 'Lodash version has known security vulnerabilities',
  recommendation: 'Update Lodash to version 4.17.21 or later.',
  patterns: [
    { key: 'lodash-version', pattern: '"lodash"\\s*:\\s*"[~^]?[0-3]\\.' }
  ]
}
```

## 正则表达式编写指南

### 基本语法

```javascript
// 匹配特定字符串
'v-html'                    // 匹配 "v-html"

// 匹配任意字符
'v-html\\s*=\\s*["\']'      // 匹配 "v-html = '"

// 匹配数字
'\\d+'                      // 匹配一个或多个数字

// 匹配字母
'[a-zA-Z]+'                 // 匹配一个或多个字母

// 匹配特定字符集
'[\'"`]'                    // 匹配单引号、双引号或反引号
```

### 高级语法

```javascript
// 匹配重复
'\\s*'                      // 匹配零个或多个空白字符
'\\s+'                      // 匹配一个或多个空白字符

// 匹配分组
'(req|params|query|body)'   // 匹配 req、params、query 或 body

// 匹配边界
'\\bword\\b'                // 匹配完整的单词 "word"

// 匹配否定
'(?!.httponly)'             // 不匹配包含 "httponly" 的字符串

// 匹配可选
'[~^]?'                     // 可选匹配 ~ 或 ^
```

### 正则表达式测试

使用在线工具测试正则表达式：
- https://regex101.com/
- https://regexr.com/

## 规则最佳实践

### 1. 规则ID命名

使用 kebab-case 命名规则ID：

```javascript
// ✅ 好的命名
id: 'xss-v-html'
id: 'sql-injection-sequelize'
id: 'memory-leak-event-listener'

// ❌ 不好的命名
id: 'XSS_V_HTML'
id: 'sqlInjection'
id: 'MemoryLeak'
```

### 2. 严重性分级

根据风险程度设置适当的严重性：

- **High**: 可能导致严重安全漏洞（如XSS、SQL注入、硬编码密钥）
- **Medium**: 中等风险（如内存泄漏、配置错误）
- **Low**: 低风险（如代码风格、最佳实践）

### 3. 描述和建议

提供清晰、可操作的描述和建议：

```javascript
{
  description: 'Using v-html can lead to XSS vulnerabilities if not properly sanitized',
  recommendation: 'Avoid using v-html with user-provided content. If necessary, sanitize the content using a library like DOMPurify.'
}
```

### 4. 模式键命名

使用描述性的模式键，便于调试：

```javascript
patterns: [
  { key: 'v-html', pattern: 'v-html\\s*=|v-html:' },
  { key: 'password', pattern: "password\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
]
```

### 5. 正则表达式优化

- 使用具体的模式而非通配符
- 避免使用贪婪匹配（.*）
- 使用非捕获组 (?:...) 提高性能

```javascript
// ✅ 优化的正则
pattern: 'v-html\\s*=\\s*["\'][^"\']+["\']'

// ❌ 不优化的正则
pattern: 'v-html.*'
```

## 测试新规则

### 1. 创建测试文件

创建包含目标漏洞的测试文件：

```javascript
// tests/custom-rule-test.js
const testContent = `
const password = "secret123";
const apiKey = "sk-1234567890";
`;

console.log(testContent);
```

### 2. 运行扫描

```bash
node bin/vue-security-scanner.js tests/custom-rule-test.js
```

### 3. 验证结果

检查是否正确检测到漏洞。

## 规则分类建议

### Web 安全
- XSS 跨站脚本
- CSRF 跨站请求伪造
- SQL 注入
- HTTP 头注入

### 数据安全
- 硬编码密钥
- 敏感数据泄露
- 不安全的数据存储

### 代码质量
- 内存泄漏
- 不安全的动态导入
- 循环引用

### 依赖安全
- 已知漏洞的库
- 过时的依赖
- 废弃的包

### 配置安全
- 不安全的 Cookie
- CORS 配置
- CSP 配置

## 当前规则统计

当前系统包含 **68 条安全规则**，涵盖：

- XSS 检测（3条）
- 硬编码密钥（8条）
- SQL 注入（5条）
- CSRF 检测（4条）
- 内存泄漏（5条）
- Cookie 安全（3条）
- HTTP 头注入（6条）
- 第三方库安全（8条）
- Vue 特定问题（15条）
- 其他安全问题（11条）

## 常见问题

### Q: 如何调试规则？

A: 在规则中添加 console.log 调试：

```javascript
{
  id: 'debug-rule',
  name: 'Debug Rule',
  severity: 'High',
  description: 'Debug rule',
  recommendation: 'Fix it',
  patterns: [
    { 
      key: 'debug', 
      pattern: 'your-pattern',
      flags: 'gi'
    }
  ]
}
```

### Q: 如何禁用某个规则？

A: 在规则对象中添加 `enabled: false`：

```javascript
{
  id: 'disabled-rule',
  name: 'Disabled Rule',
  severity: 'High',
  enabled: false,  // 禁用此规则
  description: 'Disabled rule',
  recommendation: 'Fix it',
  patterns: [
    { key: 'disabled', pattern: 'pattern' }
  ]
}
```

### Q: 如何限制规则的匹配次数？

A: 使用 `analyzeWithRulesLimited` 函数：

```javascript
const { analyzeWithRulesLimited } = require('./rules/rule-engine');
const vulnerabilities = analyzeWithRulesLimited(filePath, content, 100);
```

### Q: 如何为特定文件类型创建规则？

A: 在规则描述中说明适用的文件类型：

```javascript
{
  id: 'vue-specific',
  name: 'Vue Specific Rule',
  severity: 'High',
  description: 'Vue.js specific security issue (applies to .vue files)',
  recommendation: 'Fix Vue specific issue',
  patterns: [
    { key: 'vue-pattern', pattern: 'v-html' }
  ]
}
```

## 贡献指南

如果你创建了新的安全规则，欢迎贡献到项目中：

1. Fork 项目
2. 创建新规则
3. 添加测试用例
4. 提交 Pull Request

## 相关资源

- [正则表达式教程](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue.js 安全指南](https://v2.vuejs.org/v2/guide/security.html)
- [Node.js 安全最佳实践](https://nodejs.org/en/docs/guides/security/)

## 总结

通过规则引擎，你可以轻松扩展 Vue Security Scanner 的安全检测能力。只需定义规则配置对象，无需编写复杂的插件代码。

规则引擎的优势：
- ✅ 简单易用（配置驱动）
- ✅ 高性能（正则缓存）
- ✅ 易维护（集中管理）
- ✅ 可扩展（支持自定义规则）

开始创建你的自定义规则吧！🚀
