# Vue Security MCP (Multi-Modal Co-Pilot) Tool

Vue Security MCP 是一个用于在使用AI时对Vue代码进行实时安全扫描的工具。它集成了Vue Security Scanner的强大功能，为AI生成的代码提供即时安全反馈。

## 安装

```bash
npm install vue-security-mcp vue-security-scanner
```

或者使用yarn：

```bash
yarn add vue-security-mcp vue-security-scanner
```

## 快速开始

### 基本用法

```javascript
const VueSecurityMCP = require('vue-security-mcp');

const mcp = new VueSecurityMCP();

const vueCode = `
<template>
  <div v-html="userInput"></div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '<script>alert("XSS")</script>'
    }
  }
}
</script>
`;

// 扫描代码
const results = await mcp.scanCode(vueCode, 'my-component.vue');
console.log(mcp.generateSecurityReport(results, 'text'));
```

### 与AI集成

```javascript
const { generateWithSecurity } = await mcp.generateWithSecurity(
  async (prompt) => {
    // 这里集成您的AI生成逻辑
    return generatedCode;
  }, 
  'Create a Vue component'
);

console.log(`代码安全: ${generateWithSecurity.isSafe}`);
console.log(`发现漏洞: ${generateWithSecurity.securityScan.summary.totalVulnerabilities}`);
```

## 功能特点

- **实时安全扫描**：在AI生成代码时即时进行安全检测
- **智能修复建议**：基于安全规则提供修复建议
- **风险等级分类**：按严重程度分类显示安全漏洞
- **多格式报告**：支持JSON、文本和HTML格式的安全报告
- **批量处理**：支持批量扫描多个代码片段
- **AI集成**：易于与各种AI模型集成

## API参考

### VueSecurityMCP类

#### 构造函数

```javascript
const mcp = new VueSecurityMCP(options);
```

**选项:**
- `batchSize`: 批量处理大小 (默认: 5)
- `enableMemoryOptimization`: 启用内存优化 (默认: true)
- `reportFormat`: 报告格式 ('json', 'text', 'html') (默认: 'json')
- `outputDir`: 输出目录 (默认: './output')
- `tempDir`: 临时目录 (默认: './temp')
- `gcThreshold`: 垃圾回收阈值 (默认: 100)
- `maxBuffer`: 最大缓冲区大小 (默认: 10485760)

#### 方法

- `scanCode(code, fileName)`: 扫描代码字符串
- `generateWithSecurity(aiGenerateFn, prompt, options)`: 与AI集成生成安全代码
- `batchScan(codeSnippets)`: 批量扫描代码片段
- `generateSecurityReport(scanResults, format)`: 生成安全报告

## 配置

Vue Security MCP 支持多种配置方式：

### 1. 代码中配置

你可以通过配置对象自定义MCP的行为：

```javascript
const mcp = new VueSecurityMCP({
  batchSize: 10,
  enableMemoryOptimization: true,
  reportFormat: 'json',
  outputDir: './reports',
  tempDir: './temp-files',
  gcThreshold: 100,
  maxBuffer: 10 * 1024 * 1024  // 10MB
});
```

### 2. 配置文件

MCP会自动查找并加载以下配置文件之一：

- `mcp-config.json`
- `vue-security-mcp.config.json`

配置文件示例 (`mcp-config.json`)：

```json
{
  "batchSize": 5,
  "enableMemoryOptimization": true,
  "reportFormat": "json",
  "outputDir": "./output",
  "tempDir": "./temp",
  "gcThreshold": 100,
  "maxBuffer": 10485760
}
```

配置加载优先级：
1. 代码中传入的配置参数
2. 配置文件中的设置
3. 默认值

## 许可证

MIT