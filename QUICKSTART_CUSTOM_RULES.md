# 快速入门 - 添加自定义安全规则

## 1. 创建自定义规则文件

在 `src/rules/` 目录下创建你的规则文件：

```javascript
// src/rules/my-custom-rules.js
const myCustomRules = [
  {
    id: 'my-custom-rule',
    name: 'My Custom Security Rule',
    severity: 'High',
    description: '检测我的自定义安全问题',
    recommendation: '修复建议',
    patterns: [
      { key: 'my-pattern', pattern: 'your-regex-pattern' }
    ]
  }
];

module.exports = myCustomRules;
```

## 2. 在主规则文件中导入

编辑 `src/rules/security-rules.js`：

```javascript
const customRules = require('./custom-rules');
const myCustomRules = require('./my-custom-rules');

const securityRules = [
  // ... 现有规则
  ...customRules,
  ...myCustomRules  // 添加你的自定义规则
];

module.exports = securityRules;
```

## 3. 运行扫描

```bash
node bin/vue-security-scanner.js .
```

## 示例：检测硬编码密码

```javascript
// src/rules/my-custom-rules.js
const myCustomRules = [
  {
    id: 'my-password',
    name: 'My Password Detection',
    severity: 'High',
    description: '检测硬编码密码',
    recommendation: '使用环境变量存储密码',
    patterns: [
      { key: 'password', pattern: "password\\s*=\\s*['\"`][^'\"`]+['\"`]" }
    ]
  }
];

module.exports = myCustomRules;
```

## 内置的自定义规则

项目已包含 `src/rules/custom-rules.js`，提供20条常用安全规则：

- **API密钥检测**：检测各种API密钥泄露
- **密钥检测**：检测JWT、加密密钥等
- **令牌检测**：检测OAuth、GitHub、Slack等令牌
- **第三方服务密钥**：检测AWS、Stripe、Firebase等
- **代码质量**：检测console.log、TODO、FIXME等

## 测试你的规则

创建测试文件 `tests/my-test.js`：

```javascript
const password = "mySecretPassword";
const API_KEY = "sk-1234567890";
console.log("Testing my custom rules");
```

运行扫描：

```bash
node bin/vue-security-scanner.js tests
```

## 规则模式示例

### 检测特定字符串
```javascript
{ key: 'v-html', pattern: 'v-html' }
```

### 检测变量赋值
```javascript
{ key: 'password', pattern: "password\\s*=\\s*['\"`][^'\"`]+['\"`]" }
```

### 检测函数调用
```javascript
{ key: 'console-log', pattern: 'console\\.log\\s*\\(' }
```

### 检测特定格式
```javascript
{ key: 'aws-key', pattern: 'AKIA[0-9A-Z]{16}' }
```

### 检测注释
```javascript
{ key: 'todo', pattern: '//\\s*TODO' }
```

## 更多信息

查看完整的规则扩展指南：[RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md)

## 常见问题

### Q: 如何禁用某个规则？
A: 在规则对象中添加 `enabled: false`

### Q: 如何限制规则匹配次数？
A: 使用 `analyzeWithRulesLimited` 函数

### Q: 如何测试正则表达式？
A: 使用 https://regex101.com/ 或 https://regexr.com/

开始创建你的自定义规则吧！🚀
