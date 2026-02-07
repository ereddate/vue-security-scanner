# Vue Security MCP (Multi-Modal Co-Pilot) Tool

Vue Security MCP 是一个用于在使用AI时对Vue代码进行实时安全扫描的工具。它集成了Vue Security Scanner的强大功能，为AI生成的代码提供即时安全反馈。

## Vue 3.7+ 支持

本工具完全支持 Vue 3.7，包括实验性功能、高级 Composition API、Vapor 模式、响应式优化和其他新特性。它可以检测 Vue 3.7 增强的响应式系统和优化渲染管道中特定的安全问题。

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
- **Vue 3.7+ 支持**：完全支持 Vue 3.7 的所有新特性
- **性能优化**：支持 GPU 加速、缓存系统和并行处理
- **跨框架支持**：支持 Vue、uni-app、Taro 和各种小程序框架
- **全面合规性**：支持国际和中国特定的合规性标准

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
- `performanceProfile`: 性能配置文件 ('fast', 'balanced', 'thorough'; 默认: 'balanced')
- `enableParallelScanning`: 启用并行扫描 (默认: true)
- `enableIncrementalScanning`: 启用增量扫描 (默认: true)
- `memoryLimit`: 内存限制 (MB; 默认: 2048)
- `enableVue36Features`: 启用 Vue 3.6 特性 (默认: true)
- `enableVaporModeScanning`: 启用 Vapor 模式扫描 (默认: true)
- `enableVue37Features`: 启用 Vue 3.7+ 特性 (默认: true)
- `enableExperimentalFeaturesScanning`: 启用实验性功能扫描 (默认: true)
- `enableAdvancedCompositionAPIScanning`: 启用高级 Composition API 扫描 (默认: true)
- `enableReactiveOptimizationScanning`: 启用响应式优化扫描 (默认: true)
- `enableGPUAcceleration`: 启用 GPU 加速 (默认: true)
- `enableCaching`: 启用缓存系统 (默认: true)
- `supportedFrameworks`: 支持的框架 (默认: ['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram'])
- `complianceStandards`: 合规性标准 (默认: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law'])

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
  maxBuffer: 10 * 1024 * 1024,  // 10MB
  performanceProfile: 'balanced',
  enableParallelScanning: true,
  enableIncrementalScanning: true,
  memoryLimit: 2048,
  enableVue36Features: true,
  enableVaporModeScanning: true,
  enableVue37Features: true,
  enableExperimentalFeaturesScanning: true,
  enableAdvancedCompositionAPIScanning: true,
  enableReactiveOptimizationScanning: true,
  enableGPUAcceleration: true,
  enableCaching: true,
  supportedFrameworks: ['vue', 'uni-app', 'taro', 'wechat-miniprogram', 'baidu-smartprogram', 'bytedance-miniprogram', 'qq-miniprogram'],
  complianceStandards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX', 'GB/T', 'Cybersecurity Law', 'Data Security Law', 'PIPL', 'Cryptography Law']
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
  "maxBuffer": 10485760,
  "performanceProfile": "balanced",
  "enableParallelScanning": true,
  "enableIncrementalScanning": true,
  "memoryLimit": 2048,
  "enableVue36Features": true,
  "enableVaporModeScanning": true,
  "enableVue37Features": true,
  "enableExperimentalFeaturesScanning": true,
  "enableAdvancedCompositionAPIScanning": true,
  "enableReactiveOptimizationScanning": true,
  "enableGPUAcceleration": true,
  "enableCaching": true,
  "supportedFrameworks": ["vue", "uni-app", "taro", "wechat-miniprogram", "baidu-smartprogram", "bytedance-miniprogram", "qq-miniprogram"],
  "complianceStandards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX", "GB/T", "Cybersecurity Law", "Data Security Law", "PIPL", "Cryptography Law"]
}
```

配置加载优先级：
1. 代码中传入的配置参数
2. 配置文件中的设置
3. 默认值

## 检测的漏洞

本工具可以检测各种安全问题，包括：

- 跨站脚本攻击（XSS）漏洞
- 不安全的依赖项
- 硬编码的密钥和凭据
- 配置错误
- 潜在的代码注入问题
- 基于 DOM 的 XSS 模式
- 缺少安全头
- URL 中暴露的敏感数据
- 弱随机数生成
- Vue 3.7+ 特定的安全问题
- 实验性功能的安全问题
- 高级 Composition API 的安全问题
- 响应式优化的安全问题

## 许可证

MIT