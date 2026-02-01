# 快速开始：自定义规则

本指南提供了为 Vue Security Scanner 创建自定义安全规则的快速入门。

## 概述

自定义规则允许您：
- 定义项目特定的安全策略
- 使用自己的安全检查扩展扫描器
- 实现组织特定的合规要求
- 添加自定义漏洞检测逻辑

## 开始使用

### 1. 创建自定义规则文件

在项目根目录创建一个名为 `custom-rules.js` 的文件：

```javascript
module.exports = {
  rules: [
    {
      id: 'custom-api-key',
      name: '自定义 API 密钥检查',
      description: '检测自定义模式中的硬编码 API 密钥',
      severity: 'high',
      pattern: /api[_-]key\s*[:=]\s*['"]([a-zA-Z0-9]{20,})['"]/g,
      fix: '使用环境变量存储 API 密钥',
      examples: [
        {
          code: "const api_key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';",
          message: '检测到硬编码的 API 密钥'
        }
      ]
    },
    {
      id: 'custom-secret-check',
      name: '自定义密钥检查',
      description: '检测自定义密钥模式',
      severity: 'medium',
      pattern: /secret[_-]token\s*[:=]\s*['"]([a-zA-Z0-9]{15,})['"]/g,
      fix: '使用安全的密钥管理',
      examples: [
        {
          code: "const secret_token = 'SECRET123456789';",
          message: '检测到硬编码的密钥令牌'
        }
      ]
    }
  ]
};
```

### 2. 配置扫描器使用自定义规则

创建一个名为 `vue-security-scanner.config.json` 的配置文件：

```json
{
  "rules": {
    "custom": {
      "enabled": true,
      "path": "./custom-rules.js"
    }
  }
}
```

### 3. 使用自定义规则运行扫描器

```bash
vue-security-scanner . --config vue-security-scanner.config.json
```

输出：
```
🔍 Starting Vue Security Scanner v1.3.1
📁 Scanning directory: /path/to/project
📝 Using configuration: vue-security-scanner.config.json
🔧 Loading custom rules from: ./custom-rules.js
✅ Custom rules loaded: 2 rules

📊 Scan Results:

┌───────────────┬──────────┬─────────────┬──────────────────────────────┐
│ Severity      │ Count    │ Rule ID     │ Description                  │
├───────────────┼──────────┼─────────────┼──────────────────────────────┤
│ high          │ 1        │ custom-api-key │ Hardcoded API key detected  │
│ medium        │ 1        │ custom-secret-check │ Hardcoded secret token     │
└───────────────┴──────────┴─────────────┴──────────────────────────────┘

🔒 Total vulnerabilities found: 2
📋 Detailed report saved to: security-report.json
✨ Scan completed in 2.4 seconds
```

## 规则结构

### 基本规则结构

```javascript
{
  id: 'rule-id',              // 唯一规则标识符
  name: 'Rule Name',          // 人类可读的规则名称
  description: 'Rule description', // 详细规则描述
  severity: 'severity',        // 严重性：low, medium, high, critical
  pattern: /regex-pattern/,    // 要匹配的正则表达式
  fix: 'Fix recommendation',   // 建议的修复方法
  examples: [                  // 示例代码片段
    {
      code: 'Example code',    // 触发规则的代码
      message: 'Expected message' // 此示例的消息
    }
  ]
}
```

### 支持的属性

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | ✅ | 唯一规则标识符 |
| name | string | ✅ | 人类可读的规则名称 |
| description | string | ✅ | 详细规则描述 |
| severity | string | ✅ | 严重性级别 |
| pattern | RegExp | ✅ | 要匹配的正则表达式 |
| fix | string | ✅ | 建议的修复方法 |
| examples | array | ❌ | 示例代码片段 |
| tags | array | ❌ | 规则分类标签 |
| cwe | string | ❌ | CWE 引用 |
| owasp | string | ❌ | OWASP Top 10 引用 |
| enabled | boolean | ❌ | 启用/禁用规则 |

## 高级规则功能

### 基于 AST 的规则

对于更复杂的规则，您可以使用基于 AST 的分析：

```javascript
{
  id: 'custom-ast-rule',
  name: '自定义 AST 规则',
  description: '使用 AST 分析检测自定义模式',
  severity: 'medium',
  ast: true,
  check: (node, filename) => {
    if (node.type === 'VariableDeclaration') {
      // 自定义 AST 分析逻辑
      return {
        found: true,
        message: '检测到自定义 AST 模式'
      };
    }
    return { found: false };
  },
  fix: '修复建议',
  examples: [
    {
      code: 'const unsafe = true;',
      message: '检测到自定义 AST 模式'
    }
  ]
}
```

### 文件特定规则

将规则目标指定为特定文件类型：

```javascript
{
  id: 'custom-file-rule',
  name: '自定义文件规则',
  description: '仅在特定文件中检测问题',
  severity: 'low',
  pattern: /unsafe-pattern/g,
  files: ['*.js', '*.vue'], // 仅适用于 JavaScript 和 Vue 文件
  fix: '修复建议'
}
```

### 路径特定规则

将规则限制为特定目录：

```javascript
{
  id: 'custom-path-rule',
  name: '自定义路径规则',
  description: '仅在特定路径中检测问题',
  severity: 'medium',
  pattern: /path-specific-pattern/g,
  paths: ['src/components/', 'src/views/'], // 仅适用于这些路径
  fix: '修复建议'
}
```

## 测试自定义规则

### 测试您的规则

创建测试文件以验证您的自定义规则是否正常工作：

```javascript
const scanner = require('vue-security-scanner');

async function testCustomRules() {
  const result = await scanner.scan('.', {
    config: './vue-security-scanner.config.json',
    output: 'json'
  });
  
  console.log('测试结果:', result);
  console.log('发现', result.totalIssues, '个问题');
}

testCustomRules();
```

### 验证规则语法

使用扫描器的内置验证：

```bash
vue-security-scanner . --config vue-security-scanner.config.json --validate-rules
```

输出：
```
🔍 Validating custom rules...
✅ Custom rules syntax is valid
✅ All required properties present
✅ Regular expressions are valid
✅ Severity levels are correct

📋 Rule Validation Results:

┌─────────────┬───────────┬──────────┐
│ Rule ID     │ Status    │ Message  │
├─────────────┼───────────┼──────────┤
│ custom-api-key │ Valid     │ OK       │
│ custom-secret-check │ Valid     │ OK       │
└─────────────┴───────────┴──────────┘
```

## 最佳实践

### 规则设计

- **具体明确**：针对特定模式而非一般模式
- **设置适当的严重性**：使用与实际风险匹配的严重性级别
- **提供清晰的修复方法**：给出可操作的修复建议
- **包含示例**：提供代码示例以更好地理解
- **彻底测试**：验证规则按预期工作

### 性能

- **优化正则表达式**：使用高效的正则表达式
- **限制范围**：将规则目标指定为特定文件或路径
- **避免回溯**：尽可能使用非贪婪量词
- **测试性能**：监控规则执行时间

### 维护

- **记录规则**：添加注释解释规则逻辑
- **版本控制**：在版本控制中存储自定义规则
- **定期更新**：根据需要审查和更新规则
- **跨项目共享**：在多个项目中重用规则

## 示例：综合自定义规则

```javascript
module.exports = {
  rules: [
    {
      id: 'custom-api-key',
      name: '自定义 API 密钥检查',
      description: '检测自定义模式中的硬编码 API 密钥',
      severity: 'high',
      pattern: /api[_-]key\s*[:=]\s*['"]([a-zA-Z0-9]{20,})['"]/g,
      fix: '使用环境变量存储 API 密钥',
      examples: [
        {
          code: "const api_key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';",
          message: '检测到硬编码的 API 密钥'
        }
      ]
    },
    {
      id: 'custom-secret-check',
      name: '自定义密钥检查',
      description: '检测自定义密钥模式',
      severity: 'medium',
      pattern: /secret[_-]token\s*[:=]\s*['"]([a-zA-Z0-9]{15,})['"]/g,
      fix: '使用安全的密钥管理',
      examples: [
        {
          code: "const secret_token = 'SECRET123456789';",
          message: '检测到硬编码的密钥令牌'
        }
      ]
    },
    {
      id: 'custom-ast-rule',
      name: '自定义 AST 规则',
      description: '使用 AST 分析检测自定义模式',
      severity: 'medium',
      ast: true,
      check: (node, filename) => {
        if (node.type === 'VariableDeclaration') {
          // 自定义 AST 分析逻辑
          return {
            found: true,
            message: '检测到自定义 AST 模式'
          };
        }
        return { found: false };
      },
      fix: '修复建议',
      examples: [
        {
          code: 'const unsafe = true;',
          message: '检测到自定义 AST 模式'
        }
      ]
    }
  ]
};
```

## 支持

如需自定义规则的其他帮助：

1. **查看文档**：查阅官方文档
2. **使用示例**：从提供的示例开始
3. **增量测试**：一次构建和测试一个规则
4. **向社区寻求帮助**：从社区寻求帮助

## 后续步骤

- **探索规则类型**：尝试不同类型的规则
- **构建规则库**：创建可重用规则库
- **分享规则**：向社区贡献有用的规则
- **自动化规则测试**：为您的规则设置自动化测试