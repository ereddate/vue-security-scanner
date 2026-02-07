# Vue Security Scanner 使用指南

## 📋 工具概述

Vue Security Scanner 是一个全面的 Vue.js 项目安全扫描工具，能够识别潜在的安全漏洞和问题。它支持 Vue 2.x、Vue 3.x、Vue 3.6+ 和 Vue 3.7+ 版本，并提供 165+ 安全规则。

## 🎯 适用场景

- Vue.js 项目的安全审计
- CI/CD 流程中的安全检查
- 代码审查和漏洞检测
- 合规性检查
- 安全教育和培训

## 🔍 核心功能

- **165+ 安全规则**：覆盖 XSS、注入、身份验证、TypeScript 集成等
- **高级语义分析**：基于 AST 的代码分析
- **动态应用安全测试 (DAST)**：运行时漏洞扫描
- **增强的依赖安全**：npm audit 集成和内置漏洞数据库
- **多源漏洞数据**：集成 NVD、GitHub Advisory 和 Vue 生态系统
- **性能优化**：快速、平衡和彻底扫描模式
- **GPU 加速**：GPU 加速的正则表达式匹配
- **缓存系统**：智能缓存以提高性能
- **并行处理**：自动 CPU 核心检测和最优工作线程数

## 🛠️ 安装与配置

### 安装

```bash
# 全局安装
npm install -g vue-security-scanner

# 或直接运行而不安装
npx vue-security-scanner [project-path]

# 项目本地安装
npm install --save-dev vue-security-scanner
```

### 配置

创建 `vue-security-scanner.config.json` 文件：

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
    "maxSize": 10,
    "maxDepth": 10,
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git"
    ]
  },
  "output": {
    "showProgress": true,
    "format": "json",
    "showDetails": true,
    "maxIssuesToShow": 100,
    "advancedReport": true,
    "reportPath": "security-report.json"
  },
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true,
    "performanceProfile": "balanced",
    "enableParallelScanning": true,
    "enableIncrementalScanning": true,
    "memoryLimit": 2048,
    "enableGPUAcceleration": true,
    "enableCaching": true
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX", "GB/T", "Cybersecurity Law", "Data Security Law", "PIPL", "Cryptography Law"]
  }
}
```

## 📚 使用示例

### 示例 1：基本扫描

```bash
# 扫描当前目录
vue-security-scanner .

# 扫描特定目录
vue-security-scanner ./src

# 扫描并显示详细输出
vue-security-scanner . --level detailed

# 扫描并保存报告
vue-security-scanner . --output json --report security-report.json
```

### 示例 2：性能优化扫描

```bash
# 快速扫描模式
vue-security-scanner . --performance-profile fast

# 平衡扫描模式（默认）
vue-security-scanner . --performance-profile balanced

# 彻底扫描模式
vue-security-scanner . --performance-profile thorough

# 启用 GPU 加速
vue-security-scanner . --enable-gpu-acceleration

# 启用缓存
vue-security-scanner . --enable-caching
```

### 示例 3：合规性扫描

```bash
# 扫描 OWASP 合规性
vue-security-scanner . --compliance OWASP

# 扫描 GDPR 合规性
vue-security-scanner . --compliance GDPR

# 扫描 PIPL 合规性
vue-security-scanner . --compliance PIPL

# 扫描多个合规性标准
vue-security-scanner . --compliance OWASP,GDPR,PIPL
```

### 示例 4：依赖安全扫描

```bash
# 同步漏洞数据源
npm run sync-vulnerability-data

# 同步特定数据源
node src/cli/sync-vulnerability-data.js --sources nvd,github

# 显示漏洞数据统计
node src/cli/sync-vulnerability-data.js --stats

# 搜索漏洞
node src/cli/sync-vulnerability-data.js --search "vue"

# 检查特定包
node src/cli/sync-vulnerability-data.js --package vue --version 3.0.0

# 检查特定 CVE
node src/cli/sync-vulnerability-data.js --cve CVE-2021-12345
```

### 示例 5：CI/CD 集成

```yaml
# GitHub Actions
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run security scan
        run: npx vue-security-scanner . --output json --report security-report.json
      - name: Upload report
        uses: actions/upload-artifact@v2
        with:
          name: security-report
          path: security-report.json
```

```yaml
# GitLab CI/CD
security-scan:
  stage: test
  script:
    - npm install
    - npx vue-security-scanner . --output json --report security-report.json
  artifacts:
    paths:
      - security-report.json
    expire_in: 1 week
```

```yaml
# Jenkins
pipeline {
  agent any
  stages {
    stage('Security Scan') {
      steps {
        sh 'npm install'
        sh 'npx vue-security-scanner . --output json --report security-report.json'
        archiveArtifacts artifacts: 'security-report.json'
      }
    }
  }
}
```

## ⚠️ 注意事项

- 扫描大型项目可能需要较长时间
- 某些规则可能产生误报，需要人工审查
- GPU 加速需要支持 WebGL 的浏览器或环境
- 缓存功能会占用一定的磁盘空间
- 并行扫描会占用更多的系统资源

## 📚 参考资料

- [Vue Security Scanner GitHub](https://github.com/ereddate/vue-security-scanner)
- [Vue Security Scanner Gitee](https://gitee.com/ereddate2017/vue-security-scanner)
- [完整文档](docs/en/usage.md)
- [配置指南](docs/en/configuration.md)
- [API 参考](docs/en/api/index.md)