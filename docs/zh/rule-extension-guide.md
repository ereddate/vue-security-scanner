# 规则扩展指南

本指南提供了使用自定义规则和规则模块扩展 Vue Security Scanner 的详细说明。

## 概述

规则扩展允许您：
- 为特定项目需求创建自定义安全规则
- 为专门的安全领域开发规则模块
- 集成第三方安全规则
- 实现组织特定的安全策略

## 规则架构

### 核心规则组件

每个规则由几个关键组件组成：

- **规则定义**：元数据和配置
- **检测逻辑**：规则如何识别漏洞
- **严重性评估**：问题的严重程度
- **修复建议**：如何解决问题
- **示例**：演示问题的代码示例

### 规则类型

Vue Security Scanner 支持多种类型的规则：

- **基于模式的规则**：使用正则表达式匹配模式
- **基于 AST 的规则**：分析抽象语法树以进行更深入的检查
- **语义规则**：理解代码上下文和含义
- **依赖规则**：分析包依赖项的漏洞
- **框架规则**：特定于 Vue.js 和相关框架

## 创建自定义规则

### 基本规则结构

```javascript
{
  id: 'rule-id',              // 唯一标识符
  name: 'Rule Name',          // 人类可读的名称
  description: 'Rule description', // 详细描述
  severity: 'severity',        // low, medium, high, critical
  pattern: /regex-pattern/,    // 对于基于模式的规则
  ast: true,                  // 对于基于 AST 的规则
  check: function(node) {},   // 对于基于 AST 的规则
  fix: 'Fix recommendation',   // 如何修复问题
  examples: [                  // 示例代码片段
    {
      code: 'Example code',    // 触发规则的代码
      message: 'Expected message' // 此示例的消息
    }
  ],
  tags: ['tag1', 'tag2'],      // 分类标签
  cwe: 'CWE-XXX',             // CWE 引用
  owasp: 'OWASP-XXX'           // OWASP Top 10 引用
}
```

### 基于模式的规则

基于模式的规则使用正则表达式检测漏洞：

```javascript
{
  id: 'hardcoded-password',
  name: '硬编码密码',
  description: '检测代码中的硬编码密码',
  severity: 'high',
  pattern: /password\s*[:=]\s*['"]([a-zA-Z0-9!@#$%^&*()_+]{6,})['"]/g,
  fix: '使用环境变量或安全的密码管理',
  examples: [
    {
      code: "const password = 'MySecretPassword123';",
      message: '检测到硬编码密码'
    }
  ]
}
```

### 基于 AST 的规则

基于 AST 的规则分析抽象语法树以进行更复杂的检测：

```javascript
{
  id: 'unsafe-eval',
  name: '不安全的 eval() 使用',
  description: '检测不安全的 eval() 使用',
  severity: 'high',
  ast: true,
  check: function(node) {
    if (node.type === 'CallExpression' && 
        node.callee.type === 'Identifier' && 
        node.callee.name === 'eval') {
      return {
        found: true,
        message: '检测到不安全的 eval() 使用'
      };
    }
    return { found: false };
  },
  fix: '避免使用 eval() - 使用更安全的替代方案',
  examples: [
    {
      code: "eval(userInput);",
      message: '检测到不安全的 eval() 使用'
    }
  ]
}
```

### 语义规则

语义规则理解代码上下文和含义：

```javascript
{
  id: 'insecure-cookie',
  name: '不安全的 cookie',
  description: '检测没有安全标志的 cookie',
  severity: 'medium',
  semantic: true,
  check: function(context) {
    // 分析具有上下文感知的 cookie 设置
    return {
      found: true,
      message: '检测到不安全的 cookie'
    };
  },
  fix: '在 cookie 上设置 secure 和 httpOnly 标志',
  examples: [
    {
      code: "document.cookie = 'session=123';",
      message: '检测到不安全的 cookie'
    }
  ]
}
```

## 创建规则模块

### 规则模块结构

规则模块将相关规则组织成内聚的包：

```javascript
// custom-rule-module.js
module.exports = {
  id: 'custom-module',
  name: '自定义规则模块',
  description: '包含自定义安全规则',
  rules: [
    // 规则定义在这里
  ],
  dependencies: [
    // 对其他模块的依赖
  ],
  init: function() {
    // 初始化代码
  }
};
```

### 注册规则模块

在配置中注册您的规则模块：

```json
{
  "rules": {
    "modules": {
      "custom-module": {
        "enabled": true,
        "path": "./custom-rule-module.js"
      }
    }
  }
}
```

## 高级规则功能

### 规则依赖

规则可以依赖于其他规则或模块：

```javascript
{
  id: 'dependent-rule',
  name: '依赖规则',
  description: '依赖于另一个规则的规则',
  severity: 'medium',
  dependsOn: ['base-rule'],
  check: function(node) {
    // 依赖于 base-rule 的规则逻辑
  }
}
```

### 规则配置

规则可以使用参数进行配置：

```javascript
{
  id: 'configurable-rule',
  name: '可配置规则',
  description: '带有可配置参数的规则',
  severity: 'medium',
  config: {
    maxLength: {
      type: 'number',
      default: 100,
      description: '最大允许长度'
    }
  },
  check: function(node, config) {
    // 在规则逻辑中使用 config.maxLength
  }
}
```

### 规则优化

优化规则以获得更好的性能：

```javascript
{
  id: 'optimized-rule',
  name: '优化规则',
  description: '性能优化的规则',
  severity: 'medium',
  pattern: /optimized-pattern/g,
  optimize: true, // 启用优化
  cacheResults: true, // 缓存相同模式的结果
  check: function(node) {
    // 优化的规则逻辑
  }
}
```

## 测试规则

### 规则测试框架

使用内置测试框架测试您的规则：

```javascript
const scanner = require('vue-security-scanner');

async function testRule() {
  const rule = {
    id: 'test-rule',
    name: '测试规则',
    description: '测试规则',
    severity: 'medium',
    pattern: /test-pattern/g,
    fix: '测试修复'
  };

  const testCode = 'const test = "test-pattern";';
  const result = await scanner.testRule(rule, testCode);
  
  console.log('测试结果:', result);
}

testRule();
```

### 测试用例

为您的规则创建全面的测试用例：

```javascript
const testCases = [
  {
    name: '正面测试',
    code: 'const password = "MyPassword123";',
    expected: true,
    message: '应该检测到硬编码密码'
  },
  {
    name: '负面测试',
    code: 'const username = "user";',
    expected: false,
    message: '不应该检测到非密码'
  },
  {
    name: '边缘情况测试',
    code: 'const pass = "";',
    expected: false,
    message: '不应该检测到空字符串'
  }
];

// 运行测试
for (const testCase of testCases) {
  const result = await scanner.testRule(rule, testCase.code);
  console.log(`${testCase.name}: ${result.found === testCase.expected ? '通过' : '失败'} - ${testCase.message}`);
}
```

## 规则模块开发

### 创建规则模块

```javascript
// my-rule-module.js
module.exports = {
  id: 'my-module',
  name: '我的规则模块',
  description: '针对特定安全问题的自定义规则模块',
  rules: [
    {
      id: 'my-rule-1',
      name: '我的规则 1',
      description: '第一个自定义规则',
      severity: 'medium',
      pattern: /pattern1/g,
      fix: '模式 1 的修复方法'
    },
    {
      id: 'my-rule-2',
      name: '我的规则 2',
      description: '第二个自定义规则',
      severity: 'high',
      pattern: /pattern2/g,
      fix: '模式 2 的修复方法'
    }
  ],
  init: function() {
    console.log('我的规则模块已初始化');
  },
  dependencies: ['core']
};
```

### 集成规则模块

将您的模块添加到扫描器配置中：

```json
{
  "rules": {
    "modules": {
      "my-module": {
        "enabled": true,
        "path": "./my-rule-module.js"
      }
    }
  }
}
```

## 最佳实践

### 规则开发

1. **从简单开始**：在转向基于 AST 的规则之前，先从基于模式的规则开始
2. **彻底测试**：为每个规则创建全面的测试用例
3. **优化性能**：确保规则不会减慢扫描速度
4. **具体明确**：针对特定漏洞而非一般模式
5. **提供明确的修复方法**：给出可操作的建议

### 规则组织

1. **分类规则**：将相关规则分组到模块中
2. **使用一致的命名**：遵循规则 ID 和名称的命名约定
3. **彻底文档化**：解释每个规则的作用及其重要性
4. **版本规则**：跟踪规则随时间的变化
5. **重用逻辑**：在规则之间共享通用检测逻辑

### 性能优化

1. **使用高效模式**：优化正则表达式
2. **限制 AST 遍历**：尽可能避免深度 AST 遍历
3. **缓存结果**：缓存昂贵的操作
4. **批处理**：一起处理多个模式
5. **优先排序规则**：先运行高严重性规则

## 故障排除

### 规则问题

如果您的规则未按预期工作：

1. **检查模式语法**：确保正则表达式正确
2. **使用简单案例测试**：从基本测试用例开始
3. **验证 AST 结构**：检查代码的 AST 结构
4. **启用调试**：使用 `--debug` 标志查看规则执行
5. **检查依赖项**：确保所有依赖项都已满足

### 性能问题

如果您的规则导致性能问题：

1. **优化正则表达式**：避免复杂的正则表达式模式
2. **限制范围**：将规则限制为特定文件类型或目录
3. **减少 AST 深度**：限制 AST 遍历的深度
4. **添加缓存**：缓存重复模式的结果
5. **拆分复杂规则**：将大型规则分解为更小的规则

## 部署

### 共享规则

与社区共享您的自定义规则：

1. **作为 npm 包发布**：为您的规则创建 npm 包
2. **贡献到核心**：向主存储库提交有用的规则
3. **文档使用**：提供使用规则的明确说明
4. **维护兼容性**：确保规则适用于多个扫描器版本

### 企业部署

对于企业环境：

1. **中央规则存储库**：维护规则的中央存储库
2. **版本控制**：使用 Git 跟踪规则更改
3. **自动化测试**：定期针对代码库测试规则
4. **访问控制**：限制谁可以修改规则
5. **审计日志**：跟踪规则何时被更改以及由谁更改

## 支持

如需规则扩展的其他帮助：

1. **文档**：查阅官方文档
2. **社区论坛**：在社区论坛中提问
3. **GitHub Issues**：报告错误并请求功能
4. **企业支持**：联系企业支持以获取高级帮助

## 后续步骤

- **探索现有规则**：研究内置规则以理解模式
- **从小处着手**：首先创建简单规则
- **严格测试**：确保您的规则正确工作
- **优化性能**：确保您的规则不会减慢扫描速度
- **分享您的工作**：向社区贡献有用的规则