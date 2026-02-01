# Vue 安全扫描工具快速入门指南

欢迎使用 Vue 安全扫描工具！本指南将帮助您快速开始扫描 Vue.js 项目的安全漏洞。

## 目录

- [前置要求](#前置要求)
- [安装](#安装)
- [基本使用](#基本使用)
- [理解结果](#理解结果)
- [常见场景](#常见场景)
- [下一步](#下一步)

## 前置要求

在开始之前，请确保您具备：

- **Node.js**：版本 14.0.0 或更高
- **npm**：版本 6.0.0 或更高
- **Vue.js 项目**：任何 Vue 2.x 或 Vue 3.x 项目

检查您的版本：

```bash
node -v
npm -v
```

## 安装

### 选项 1：全局安装（推荐）

全局安装以便从任何目录访问：

```bash
npm install -g vue-security-scanner
```

验证安装：

```bash
vue-security-scanner --version
```

### 选项 2：本地安装

在项目中本地安装：

```bash
npm install --save-dev vue-security-scanner
```

使用 npx 运行：

```bash
npx vue-security-scanner
```

### 选项 3：无需安装运行

使用 npx 无需安装即可运行：

```bash
npx vue-security-scanner [项目路径]
```

## 基本使用

### 扫描当前目录

扫描项目最简单的方法：

```bash
vue-security-scanner .
```

这将：
- 扫描当前目录中的所有 Vue 文件
- 使用默认配置
- 在控制台显示结果
- 生成基本安全报告

### 扫描特定项目

扫描特定的项目目录：

```bash
vue-security-scanner /path/to/your-vue-project
```

### 生成详细报告

生成 JSON 格式的详细报告：

```bash
vue-security-scanner . --report security-report.json --output json
```

### 使用详细级别扫描

获取更详细的信息：

```bash
vue-security-scanner . --level detailed
```

### 使用自定义配置

使用自定义配置文件：

```bash
vue-security-scanner . --config my-config.json
```

## 理解结果

### 控制台输出

扫描器在控制台显示结果，使用颜色编码的严重性级别：

```
🔴 严重：component.vue:15 中的 XSS 漏洞
  - 使用 v-html 而未对用户输入进行清理
  - 建议：使用清理库如 DOMPurify

🟡 中等：config.js:10 中的硬编码 API 密钥
  - API 密钥暴露在源代码中
  - 建议：移动到环境变量
```

### 严重性级别

- **🔴 严重（CRITICAL）**：需要立即采取行动
- **🟠 高（HIGH）**：应该尽快修复
- **🟡 中等（MEDIUM）**：应该处理
- **🟢 低（LOW）**：修复更好，但不紧急

### JSON 报告结构

```json
{
  "summary": {
    "totalIssues": 15,
    "critical": 2,
    "high": 5,
    "medium": 6,
    "low": 2
  },
  "issues": [
    {
      "id": "xss-v-html",
      "severity": "CRITICAL",
      "file": "src/components/UserInput.vue",
      "line": 15,
      "description": "使用 v-html 而未对用户输入进行清理",
      "recommendation": "使用清理库如 DOMPurify"
    }
  ]
}
```

## 常见场景

### 场景 1：新 Vue 项目

刚刚创建了新的 Vue 项目？在添加功能之前扫描它：

```bash
# 创建新项目
vue create my-project
cd my-project

# 扫描安全问题
vue-security-scanner .
```

### 场景 2：CI/CD 集成

将安全扫描添加到您的 CI/CD 流水线：

```yaml
# .github/workflows/security.yml
name: 安全扫描

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: 安装扫描器
        run: npm install -g vue-security-scanner
      - name: 运行安全扫描
        run: vue-security-scanner . --output json --report security-report.json
      - name: 上传结果
        uses: actions/upload-artifact@v2
        with:
          name: security-results
          path: security-report.json
```

### 场景 3：开发工作流

在开发期间定期扫描：

```bash
# 提交更改之前
vue-security-scanner .

# 或使用 git pre-commit 钩子
# .git/hooks/pre-commit
#!/bin/bash
vue-security-scanner . --output json --report security-report.json
if [ $? -ne 0 ]; then
  echo "安全扫描失败。请在提交之前修复问题。"
  exit 1
fi
```

### 场景 4：大型项目优化

对于大型项目，使用性能优化：

```bash
# 使用增量扫描（只扫描更改的文件）
vue-security-scanner . --incremental

# 使用快速模式
vue-security-scanner . --performance fast

# 结合两者
vue-security-scanner . --performance fast --incremental
```

### 场景 5：合规性报告

为监管要求生成合规性报告：

```bash
# 生成合规性报告
vue-security-scanner . --compliance OWASP --report compliance-report.html
```

## 配置

### 基本配置文件

在项目根目录创建 `vue-security-scanner.config.json` 文件：

```json
{
  "rules": {
    "xss": {
      "enabled": true,
      "severity": "high"
    },
    "dependencies": {
      "enabled": true,
      "severity": "high"
    }
  },
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build"],
    "maxSize": 10
  },
  "output": {
    "format": "json",
    "showDetails": true
  }
}
```

### 忽略特定问题

创建 `.vue-security-ignore` 文件：

```
# 忽略目录
node_modules/
dist/

# 忽略特定规则
rule:deprecated-dependency

# 按严重性忽略
severity:low
```

## 命令行选项

### 基本选项

| 选项 | 描述 | 示例 |
|--------|-------------|----------|
| `--help` | 显示帮助信息 | `vue-security-scanner --help` |
| `--version` | 显示版本信息 | `vue-security-scanner --version` |
| `--config` | 使用自定义配置文件 | `--config my-config.json` |
| `--output` | 输出格式（json, html, text） | `--output json` |
| `--report` | 报告文件路径 | `--report report.json` |
| `--level` | 扫描级别（basic, detailed） | `--level detailed` |

### 性能选项

| 选项 | 描述 | 示例 |
|--------|-------------|----------|
| `--performance` | 性能配置文件（fast, balanced, thorough） | `--performance fast` |
| `--incremental` | 启用增量扫描 | `--incremental` |
| `--threads` | 并行处理的线程数 | `--threads 4` |
| `--batch-size` | 大型项目的批处理大小 | `--batch-size 10` |

### 高级选项

| 选项 | 描述 | 示例 |
|--------|-------------|----------|
| `--advanced-report` | 启用带有趋势的高级报告 | `--advanced-report` |
| `--semantic-analysis` | 启用基于 AST 的语义分析 | `--semantic-analysis` |
| `--compliance` | 合规性标准（OWASP, GDPR 等） | `--compliance OWASP` |
| `--threat-intelligence` | 启用威胁情报集成 | `--threat-intelligence` |

## 故障排除

### 常见问题

#### 问题：命令未找到

**问题**：`vue-security-scanner: command not found`

**解决方案**：
- 确保全局安装：`npm install -g vue-security-scanner`
- 检查 npm 全局 bin 目录是否在 PATH 中
- 尝试使用 npx：`npx vue-security-scanner`

#### 问题：扫描缓慢

**问题**：扫描时间太长

**解决方案**：
- 使用增量扫描：`--incremental`
- 使用快速模式：`--performance fast`
- 增加线程数：`--threads 8`
- 排除不必要的目录：`--exclude node_modules,dist`

#### 问题：误报过多

**问题**：扫描器报告的问题不是真正的漏洞

**解决方案**：
- 启用语义分析：`--semantic-analysis`
- 在配置中调整严重性阈值
- 使用 `.vue-security-ignore` 忽略误报
- 向项目维护者报告误报以帮助改进扫描器

#### 问题：内存问题

**问题**：扫描器内存不足

**解决方案**：
- 减少批处理大小：`--batch-size 5`
- 减少线程数：`--threads 2`
- 使用快速模式：`--performance fast`
- 增加 Node.js 内存限制：`NODE_OPTIONS="--max-old-space-size=4096" vue-security-scanner .`

## 下一步

### 了解更多

- **[安装指南](./installation.md)** - 详细的安装说明
- **[使用教程](./usage.md)** - 全面的使用指南
- **[配置指南](./configuration.md)** - 高级配置选项
- **[规则文档](./rules/index.md)** - 所有可用的安全规则

### 高级功能

- **[性能优化](./performance/index.md)** - 优化扫描性能
- **[合规性指南](./compliance/index.md)** - 生成合规性报告
- **[威胁情报](./threat-intelligence/index.md)** - 集成威胁情报
- **[API 参考](./api/index.md)** - 编程使用

### 集成

- **[CI/CD 集成](../usage.md#ci/cd-集成)** - 与 CI/CD 流水线集成
- **[VSCode 插件](../usage.md#vscode-插件)** - 与 VSCode 一起使用
- **[Vite 插件](../usage.md#vite-插件)** - 与 Vite 集成
- **[Webpack 插件](../usage.md#webpack-插件)** - 与 Webpack 集成

### 社区

- **[贡献指南](./CONTRIBUTING.md)** - 如何为项目做出贡献
- **[常见问题](./FAQ.md)** - 常见问题解答
- **[GitHub Issues](https://github.com/vue-security-scanner/vue-security-scanner/issues)** - 报告问题和请求功能

## 快速参考

### 基本命令

```bash
# 基本扫描
vue-security-scanner .

# 带报告的详细扫描
vue-security-scanner . --level detailed --report security-report.json

# 开发快速扫描
vue-security-scanner . --performance fast

# 增量扫描（只扫描更改的文件）
vue-security-scanner . --incremental

# 合规性报告
vue-security-scanner . --compliance OWASP --report compliance-report.html
```

### 配置文件

- `vue-security-scanner.config.json` - 主配置文件
- `.vue-security-ignore` - 忽略规则和文件
- `.vue-security-reports/` - 报告历史目录

### 常见配置

```json
{
  "rules": {
    "xss": { "enabled": true, "severity": "high" },
    "dependencies": { "enabled": true, "severity": "high" }
  },
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build"]
  },
  "output": {
    "format": "json",
    "showDetails": true
  }
}
```

---

**准备好保护您的 Vue.js 应用程序了吗？** 立即开始扫描，使您的应用程序更安全！

如需更详细的信息，请查看我们的全面[文档](../README.md#-文档)。
