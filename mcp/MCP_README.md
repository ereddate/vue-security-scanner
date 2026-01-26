# Vue Security MCP (Multi-Modal Co-Pilot) Tool

Vue Security MCP 是一个用于在使用AI时对Vue代码进行实时安全扫描的工具。它集成了Vue Security Scanner的强大功能，为AI生成的代码提供即时安全反馈。

## 功能特点

- **实时安全扫描**：在AI生成代码时即时进行安全检测
- **智能修复建议**：基于安全规则提供修复建议
- **风险等级分类**：按严重程度分类显示安全漏洞
- **多格式报告**：支持JSON、文本和HTML格式的安全报告
- **批量处理**：支持批量扫描多个代码片段
- **AI集成**：易于与各种AI模型集成

## 安装

确保你已经安装了Vue Security Scanner：

```bash
npm install vue-security-scanner
```

## 使用方法

### 1. 基本代码扫描

```javascript
const VueSecurityMCP = require('vue-security-scanner/mcp-vue-security-scanner.js');

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

### 2. 与AI集成

```javascript
// 模拟AI生成函数
const mockAIGenerate = async (prompt) => {
  // 在实际应用中，这里会调用真实的AI API
  return `/* generated code */`;
};

// 生成带安全扫描的代码
const result = await mcp.generateWithSecurity(mockAIGenerate, 'Create a Vue component');
console.log(`代码安全: ${result.isSafe}`);
console.log(`发现漏洞: ${result.securityScan.summary.totalVulnerabilities}`);
```

### 3. 批量扫描

```javascript
const codeSnippets = [
  { code: '<template><div v-html="danger"></div></template>', fileName: 'snippet1.vue' },
  { code: '<template><p>{{ safe }}</p></template>', fileName: 'snippet2.vue' }
];

const results = await mcp.batchScan(codeSnippets);
```

### 4. 命令行工具

```bash
# 扫描单个文件
node mcp-cli.js scan mycomponent.vue

# 批量扫描多个文件
node mcp-cli.js batch *.vue

# 交互模式
node mcp-cli.js interactive
```

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

#### 方法

- `scanCode(code, fileName)`: 扫描代码字符串
- `scanFile(filePath)`: 扫描文件
- `generateWithSecurity(aiGenerateFn, prompt, options)`: 与AI集成生成安全代码
- `batchScan(codeSnippets)`: 批量扫描代码片段
- `generateSecurityReport(scanResults, format)`: 生成安全报告

## 集成示例

以下是一个在VS Code扩展中集成MCP工具的简单示例：

```javascript
const vscode = require('vscode');
const VueSecurityMCP = require('vue-security-scanner/mcp-vue-security-scanner.js');

class VueSecurityProvider {
  constructor() {
    this.mcp = new VueSecurityMCP();
  }
  
  async provideSecurityFeedback(document) {
    const code = document.getText();
    const results = await this.mcp.scanCode(code, document.fileName);
    
    // 显示安全警告
    if (results.summary.totalVulnerabilities > 0) {
      vscode.window.showWarningMessage(
        `发现 ${results.summary.totalVulnerabilities} 个安全漏洞`
      );
    }
    
    return results;
  }
}
```

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