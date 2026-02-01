# Vue 安全扫描工具配置指南

本全面指南涵盖了 Vue 安全扫描工具中所有可用的配置选项。

## 目录

- [配置文件](#配置文件)
- [配置优先级](#配置优先级)
- [完整配置示例](#完整配置示例)
- [配置部分](#配置部分)
  - [规则配置](#规则配置)
  - [扫描配置](#扫描配置)
  - [输出配置](#输出配置)
  - [性能配置](#性能配置)
  - [报告历史配置](#报告历史配置)
  - [合规性配置](#合规性配置)
  - [威胁情报配置](#威胁情报配置)
  - [分布式扫描配置](#分布式扫描配置)
  - [仪表板配置](#仪表板配置)
- [忽略规则](#忽略规则)
- [环境变量](#环境变量)
- [最佳实践](#最佳实践)

## 配置文件

### 文件位置

扫描器按以下顺序查找配置文件：

1. 项目根目录中的 `vue-security-scanner.config.json`
2. 项目根目录中的 `.vue-security.json`
3. 当前工作目录中的 `vue-security-scanner.config.json`
4. 当前工作目录中的 `.vue-security.json`
5. 命令行参数（最高优先级）

### 文件格式

扫描器支持多种配置文件格式：

- **JSON**：`vue-security-scanner.config.json`
- **JavaScript**：`vue-security-scanner.config.js`（用于动态配置）
- **TypeScript**：`vue-security-scanner.config.ts`（需要 TypeScript）

### 指定自定义配置

使用 `--config` 选项指定自定义配置文件：

```bash
vue-security-scanner . --config /path/to/my-config.json
```

## 配置优先级

配置选项按以下顺序应用（后面的选项覆盖前面的选项）：

1. 默认配置
2. 全局配置文件（`~/.vue-security-scanner/config.json`）
3. 项目配置文件（`./vue-security-scanner.config.json`）
4. 命令行参数

## 完整配置示例

这是一个包含所有可用选项的完整配置文件：

```json
{
  "rules": {
    "enabled": ["vue", "javascript", "dependency", "china-security"],
    "severity": {
      "critical": true,
      "high": true,
      "medium": true,
      "low": false
    },
    "customRules": ["./custom-rules.js"],
    "disabled": ["rule-id-1", "rule-id-2"]
  },
  "scan": {
    "maxSize": 10,
    "maxDepth": 10,
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**"
    ],
    "excludePatterns": [
      "src/test/**",
      "src/mock/**"
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
    "enableCache": true,
    "enableIncremental": true,
    "threads": 4,
    "memoryLimit": 512 * 1024 * 1024,
    "batchSize": 10
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX", "china"]
  },
  "threatIntelligence": {
    "enabled": true,
    "sources": {
      "cncert": true,
      "cnnvd": true,
      "cnvd": true,
      "nvd": true,
      "cve": true,
      "owasp": true
    },
    "severityThreshold": "high",
    "updateInterval": 86400000
  },
  "distributed": {
    "enabled": false,
    "workers": [
      {
        "id": "worker-1",
        "url": "http://localhost:3001"
      }
    ],
    "batchSize": 10,
    "timeout": 30000
  },
  "dashboard": {
    "enabled": false,
    "port": 3000,
    "host": "localhost"
  }
}
```

## 配置部分

### 规则配置

控制启用哪些安全规则及其严重性。

#### 基本规则配置

```json
{
  "rules": {
    "enabled": ["vue", "javascript", "dependency", "china-security"],
    "severity": {
      "critical": true,
      "high": true,
      "medium": true,
      "low": false
    }
  }
}
```

#### 可用的规则模块

- **vue**：Vue.js 特定安全规则
- **javascript**：JavaScript 安全规则
- **dependency**：依赖漏洞规则
- **china-security**：中国特定安全规则
- **api**：API 安全规则
- **authentication**：身份验证和授权规则
- **file-upload**：文件上传安全规则
- **environment**：环境变量安全规则

#### 自定义规则

添加您自己的安全规则：

```json
{
  "rules": {
    "customRules": ["./custom-rules.js", "./company-rules.js"]
  }
}
```

自定义规则文件格式：

```javascript
// custom-rules.js
const customRules = [
  {
    id: 'my-custom-rule',
    name: '我的自定义安全规则',
    severity: 'High',
    description: '检测我的安全问题',
    recommendation: '修复建议',
    patterns: [
      { key: 'pattern-key', pattern: 'regex-pattern' }
    ]
  }
];

module.exports = customRules;
```

#### 禁用特定规则

按 ID 禁用特定规则：

```json
{
  "rules": {
    "disabled": [
      "vue:no-raw-html",
      "javascript:eval",
      "rule-id-3"
    ]
  }
}
```

### 扫描配置

控制扫描行为和范围。

#### 基本扫描配置

```json
{
  "scan": {
    "maxSize": 10,
    "maxDepth": 10,
    "ignoreDirs": ["node_modules", "dist", "build"],
    "ignorePatterns": ["**/*.min.js", "**/vendor/**"]
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `maxSize` | 数字 | 10 | 要扫描的最大文件大小（MB） |
| `maxDepth` | 数字 | 10 | 要扫描的最大目录深度 |
| `ignoreDirs` | 数组 | `["node_modules", "dist", "build"]` | 要忽略的目录 |
| `ignorePatterns` | 数组 | `[]` | 要忽略的 glob 模式 |
| `excludePatterns` | 数组 | `[]` | 额外的排除模式 |

#### 忽略目录

指定扫描期间要跳过的目录：

```json
{
  "scan": {
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public",
      "test",
      "mock"
    ]
  }
}
```

#### 忽略文件模式

使用 glob 模式忽略特定文件：

```json
{
  "scan": {
    "ignorePatterns": [
      "**/*.min.js",
      "**/*.min.css",
      "**/vendor/**",
      "**/lib/**",
      "**/dist/**",
      "**/*.test.js",
      "**/*.spec.js"
    ]
  }
}
```

### 输出配置

控制扫描结果的显示和保存方式。

#### 基本输出配置

```json
{
  "output": {
    "showProgress": true,
    "format": "json",
    "showDetails": true,
    "maxIssuesToShow": 100,
    "advancedReport": true,
    "reportPath": "security-report.json"
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `showProgress` | 布尔值 | `true` | 显示扫描进度 |
| `format` | 字符串 | `"json"` | 输出格式：`json`、`html`、`text`、`xml`、`sarif` |
| `showDetails` | 布尔值 | `true` | 显示详细的问题信息 |
| `maxIssuesToShow` | 数字 | `100` | 要显示的最大问题数 |
| `advancedReport` | 布尔值 | `false` | 启用带有趋势的高级报告 |
| `reportPath` | 字符串 | `"security-report.json"` | 保存报告的路径 |

#### 输出格式

**JSON 格式**：
```json
{
  "summary": {
    "totalIssues": 15,
    "critical": 2,
    "high": 5,
    "medium": 6,
    "low": 2
  },
  "issues": [...]
}
```

**HTML 格式**：
- 交互式仪表板
- 可视化指示器
- 颜色编码的严重性
- 响应式设计

**文本格式**：
- 人类可读的输出
- 颜色编码的严重性
- 易于在终端中阅读

**XML 格式**：
- 结构化的 XML 输出
- 与 CI/CD 工具兼容
- 机器可读

**SARIF 格式**：
- 静态分析结果交换格式
- 与 GitHub 高级安全兼容
- 标准化格式

### 性能配置

根据项目大小和要求优化扫描性能。

#### 基本性能配置

```json
{
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true,
    "enableCache": true,
    "enableIncremental": true,
    "threads": 4,
    "memoryLimit": 512 * 1024 * 1024,
    "batchSize": 10
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `maxConcurrentFiles` | 数字 | `10` | 最大并发文件处理数 |
| `timeout` | 数字 | `30000` | 超时时间（毫秒） |
| `enableSemanticAnalysis` | 布尔值 | `true` | 启用基于 AST 的语义分析 |
| `enableNpmAudit` | 布尔值 | `true` | 启用 npm audit 集成 |
| `enableVulnerabilityDB` | 布尔值 | `true` | 启用漏洞数据库 |
| `enableCache` | 布尔值 | `true` | 启用规则缓存 |
| `enableIncremental` | 布尔值 | `true` | 启用增量扫描 |
| `threads` | 数字 | `4` | 并行处理的线程数 |
| `memoryLimit` | 数字 | `512MB` | 内存限制（字节） |
| `batchSize` | 数字 | `10` | 大型项目的批处理大小 |

#### 性能配置文件

使用预定义的性能配置文件：

```bash
# 快速模式 - 开发快速扫描
vue-security-scanner . --performance fast

# 平衡模式 - 默认，适用于大多数用例
vue-security-scanner . --performance balanced

# 全面模式 - 生产全面扫描
vue-security-scanner . --performance thorough
```

#### 语义分析

启用基于 AST 的代码分析以提高准确性：

```json
{
  "performance": {
    "enableSemanticAnalysis": true
  }
}
```

**优势**：
- 减少误报
- 用户输入跟踪
- 置信度评分
- 与正则表达式检测智能合并

#### 依赖安全

启用全面的依赖漏洞扫描：

```json
{
  "performance": {
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  }
}
```

#### 缓存

启用缓存以提高性能：

```json
{
  "performance": {
    "enableCache": true,
    "cache": {
      "ttl": 3600000,
      "maxSize": 100 * 1024 * 1024
    }
  }
}
```

#### 增量扫描

只扫描修改过的文件以加快后续扫描：

```json
{
  "performance": {
    "enableIncremental": true
  }
}
```

### 报告历史配置

启用历史数据以进行趋势分析。

#### 基本报告历史配置

```json
{
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enabled` | 布尔值 | `true` | 启用报告历史 |
| `path` | 字符串 | `".vue-security-reports"` | 存储报告的目录 |
| `maxSize` | 数字 | `100` | 要保留的最大报告数 |

### 合规性配置

为监管要求生成合规性报告。

#### 基本合规性配置

```json
{
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX", "china"]
  }
}
```

#### 可用标准

- **OWASP**：OWASP Top 10 安全标准
- **GDPR**：通用数据保护条例
- **HIPAA**：健康保险流通与责任法案
- **PCI-DSS**：支付卡行业数据安全标准
- **SOX**：萨班斯-奥克斯利法案
- **china**：中国安全标准（GB/T、网络安全法等）

#### 中国特定标准

```json
{
  "compliance": {
    "standards": ["china"],
    "china": {
      "cybersecurityLaw": true,
      "dataSecurityLaw": true,
      "personalInformationProtectionLaw": true,
      "cryptographyLaw": true,
      "gbtStandards": ["GB/T 28448", "GB/T 31168", "GB/T 35273"]
    }
  }
}
```

### 威胁情报配置

与威胁情报源集成。

#### 基本威胁情报配置

```json
{
  "threatIntelligence": {
    "enabled": true,
    "sources": {
      "cncert": true,
      "cnnvd": true,
      "cnvd": true,
      "nvd": true,
      "cve": true,
      "owasp": true
    },
    "severityThreshold": "high",
    "updateInterval": 86400000
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enabled` | 布尔值 | `true` | 启用威胁情报 |
| `sources` | 对象 | `{}` | 要启用的威胁情报源 |
| `severityThreshold` | 字符串 | `"high"` | 最低严重性级别 |
| `updateInterval` | 数字 | `86400000` | 更新间隔（毫秒） |

#### 可用源

- **cncert**：CNCERT/CC 威胁情报
- **cnnvd**：CNNVD 漏洞数据库
- **cnvd**：CNVD 漏洞数据库
- **nvd**：NIST 国家漏洞数据库
- **cve**：CVE 漏洞数据库
- **owasp**：OWASP 威胁情报

### 分布式扫描配置

为大规模项目配置分布式扫描。

#### 基本分布式扫描配置

```json
{
  "distributed": {
    "enabled": false,
    "workers": [
      {
        "id": "worker-1",
        "url": "http://localhost:3001"
      },
      {
        "id": "worker-2",
        "url": "http://localhost:3002"
      }
    ],
    "batchSize": 10,
    "timeout": 30000
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enabled` | 布尔值 | `false` | 启用分布式扫描 |
| `workers` | 数组 | `[]` | Worker 配置列表 |
| `batchSize` | 数字 | `10` | 分布式扫描的批处理大小 |
| `timeout` | 数字 | `30000` | 超时时间（毫秒） |

### 仪表板配置

配置基于 Web 的仪表板。

#### 基本仪表板配置

```json
{
  "dashboard": {
    "enabled": false,
    "port": 3000,
    "host": "localhost"
  }
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enabled` | 布尔值 | `false` | 启用仪表板 |
| `port` | 数字 | `3000` | 仪表板端口 |
| `host` | 字符串 | `"localhost"` | 仪表板主机 |

## 忽略规则

创建 `.vue-security-ignore` 文件以忽略特定文件、目录或漏洞。

### 忽略文件格式

```
# 忽略目录
node_modules/
dist/
build/

# 忽略文件模式
**/*.min.js
**/vendor/**

# 忽略特定漏洞类型
type:XSS
type:Memory Leak

# 忽略特定规则
rule:custom-api-key
rule:hardcoded-password

# 按严重性忽略
severity:low
```

### 忽略目录

```
node_modules/
dist/
build/
public/
coverage/
```

### 忽略文件模式

```
**/*.min.js
**/*.min.css
**/vendor/**
**/lib/**
**/dist/**
```

### 忽略漏洞类型

```
type:XSS
type:SQL Injection
type:CSRF
type:Memory Leak
```

### 忽略特定规则

```
rule:vue:no-raw-html
rule:javascript:eval
rule:custom-api-key
```

### 按严重性忽略

```
severity:low
severity:medium
```

## 环境变量

使用环境变量覆盖配置。

### 可用环境变量

| 变量 | 描述 | 示例 |
|-----------|-------------|----------|
| `VUE_SECURITY_CONFIG` | 配置文件路径 | `/path/to/config.json` |
| `VUE_SECURITY_OUTPUT_FORMAT` | 输出格式 | `json` |
| `VUE_SECURITY_REPORT_PATH` | 报告文件路径 | `./report.json` |
| `VUE_SECURITY_THREADS` | 线程数 | `4` |
| `VUE_SECURITY_MEMORY_LIMIT` | 内存限制（MB） | `512` |
| `VUE_SECURITY_CACHE_DIR` | 缓存目录 | `./.vue-security-cache` |
| `VUE_SECURITY_LOG_LEVEL` | 日志级别 | `debug`、`info`、`warn`、`error` |

### 使用环境变量

```bash
# 设置环境变量
export VUE_SECURITY_THREADS=8
export VUE_SECURITY_MEMORY_LIMIT=1024
export VUE_SECURITY_LOG_LEVEL=debug

# 运行扫描器
vue-security-scanner .
```

### 特定环境配置

```bash
# 开发环境
export VUE_SECURITY_PERFORMANCE=fast
vue-security-scanner .

# 生产环境
export VUE_SECURITY_PERFORMANCE=thorough
vue-security-scanner .
```

## 最佳实践

### 1. 使用版本控制

将配置文件提交到版本控制：

```bash
git add vue-security-scanner.config.json
git add .vue-security-ignore
git commit -m "添加安全扫描器配置"
```

### 2. 特定环境配置

为不同环境使用不同的配置：

```bash
# 开发环境
vue-security-scanner . --config config-dev.json

# 预发布环境
vue-security-scanner . --config config-staging.json

# 生产环境
vue-security-scanner . --config config-prod.json
```

### 3. 启用增量扫描

加快后续扫描速度：

```json
{
  "performance": {
    "enableIncremental": true
  }
}
```

### 4. 使用语义分析

提高准确性：

```json
{
  "performance": {
    "enableSemanticAnalysis": true
  }
}
```

### 5. 启用合规性报告

满足监管要求：

```json
{
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "china"]
  }
}
```

### 6. 配置忽略规则

通过忽略误报减少噪音：

```
# .vue-security-ignore
severity:low
rule:deprecated-dependency
```

### 7. 使用性能配置文件

为您的用例选择合适的性能配置文件：

```bash
# 开发环境 - 快速
vue-security-scanner . --performance fast

# CI/CD - 平衡
vue-security-scanner . --performance balanced

# 生产环境 - 全面
vue-security-scanner . --performance thorough
```

### 8. 启用威胁情报

获取最新的漏洞信息：

```json
{
  "threatIntelligence": {
    "enabled": true,
    "sources": {
      "cncert": true,
      "cnnvd": true,
      "nvd": true
    }
  }
}
```

### 9. 监控性能

跟踪扫描性能并调整配置：

```bash
# 启用性能监控
vue-security-scanner . --verbose
```

### 10. 定期更新

保持配置和扫描器最新：

```bash
# 更新扫描器
npm update vue-security-scanner

# 更新威胁情报
vue-security-scanner . --threat-intelligence --update
```

---

如需更多信息，请参阅：
- [快速入门指南](./quickstart.md)
- [使用教程](./usage.md)
- [性能优化](./performance/index.md)
- [API 参考](./api/index.md)
