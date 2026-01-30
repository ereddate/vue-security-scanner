# 忽略规则完整指南

Vue Security Scanner 提供了多种灵活的忽略方案，让您可以根据项目需求精确控制扫描行为。

## 目录

- [4种忽略方案概述](#4种忽略方案概述)
- [方案1：配置文件忽略](#方案1配置文件忽略)
- [方案2：规则启用/禁用](#方案2规则启用禁用)
- [方案3：.vue-security-ignore 文件](#方案3vue-security-ignore-文件)
- [方案4：命令行参数](#方案4命令行参数)
- [推荐使用方式](#推荐使用方式)
- [忽略方案对比](#忽略方案对比)
- [使用场景和案例](#使用场景和案例)
- [常见问题](#常见问题)

## 4种忽略方案概述

Vue Security Scanner 提供以下4种忽略方案：

| 方案 | 适用场景 | 灵活性 | 推荐度 |
|------|---------|--------|--------|
| **配置文件** | 项目级别的忽略配置 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **规则启用/禁用** | 精细控制规则行为 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **.vue-security-ignore** | 类似gitignore的忽略方式 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **命令行参数** | 临时或环境特定配置 | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 方案1：配置文件忽略

### 概述

通过 `vue-security-scanner.config.json` 配置文件进行项目级别的忽略配置。这是最常用的方式，适合团队协作和版本控制。

### 配置文件优先级

工具支持以下配置文件（按优先级顺序）：

1. `vue-security-scanner.config.json` (项目根目录)
2. `.vue-security.json` (项目根目录)
3. `vue-security-scanner.config.json` (当前工作目录)
4. `.vue-security.json` (当前工作目录)

### 配置示例

```json
{
  "scan": {
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
    "maxDepth": 10,
    "maxSize": 10
  }
}
```

### 配置选项说明

| 选项 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `ignoreDirs` | Array | 要忽略的目录列表 | `["node_modules", "dist"]` |
| `ignorePatterns` | Array | 要忽略的文件模式（glob格式） | `["**/*.min.js"]` |
| `maxDepth` | Number | 最大扫描深度 | `10` |
| `maxSize` | Number | 单个文件最大大小（MB） | `10` |

### 使用场景

- ✅ 需要版本控制的忽略规则
- ✅ 团队协作项目
- ✅ 需要忽略大量文件和目录
- ✅ 需要精确控制扫描范围

### 优点

- 版本控制友好
- 易于团队协作
- 配置集中管理
- 支持复杂的glob模式

### 缺点

- 需要创建配置文件
- 不支持按漏洞类型或规则ID忽略

---

## 方案2：规则启用/禁用

### 概述

通过配置文件精确控制特定规则的启用/禁用状态，以及调整规则的行为选项。

### 配置示例

```json
{
  "rules": {
    "xss": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkVHtml": true,
        "checkTemplateInterpolation": true,
        "checkEventHandlers": true
      }
    },
    "dependencies": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkKnownVulnerabilities": true,
        "checkDeprecated": false,
        "checkOutdated": false
      }
    },
    "secrets": {
      "enabled": true,
      "severity": "high",
      "options": {
        "patterns": [
          "/password\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/secret\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/token\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi",
          "/api[_-]?key\\s*[:=]\\s*[\'\"`][^\'\"`]+[\'\"`]/gi"
        ]
      }
    },
    "codeSecurity": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkEvalUsage": true,
        "checkPrototypePollution": true,
        "checkDynamicImports": true,
        "checkRouteParams": true
      }
    },
    "configSecurity": {
      "enabled": true,
      "severity": "medium",
      "options": {
        "checkCorsSettings": true,
        "checkVueConfigs": true
      }
    }
  }
}
```

### 配置选项说明

| 选项 | 类型 | 说明 |
|------|------|------|
| `enabled` | Boolean | 是否启用该规则类别 |
| `severity` | String | 严重级别（high/medium/low） |
| `options` | Object | 规则特定的选项 |

### 使用场景

- ✅ 需要精确控制规则行为
- ✅ 需要调整规则严重级别
- ✅ 需要自定义规则选项
- ✅ 需要禁用特定类型的检测

### 优点

- 最灵活的控制方式
- 可以调整规则严重级别
- 可以自定义规则选项
- 可以禁用整个规则类别

### 缺点

- 配置相对复杂
- 需要了解规则选项

---

## 方案3：.vue-security-ignore 文件

### 概述

创建 `.vue-security-ignore` 文件，使用类似 `.gitignore` 的语法来忽略文件、目录和漏洞。这是最简单直观的方式。

### 文件位置

在项目根目录创建 `.vue-security-ignore` 文件。工具会自动查找并加载该文件。

### 语法说明

#### 1. 忽略目录

```bash
# 忽略目录
node_modules/
dist/
build/
```

#### 2. 忽略文件模式（glob）

```bash
# 忽略所有 .min.js 文件
**/*.min.js

# 忽略 vendor 目录下的所有文件
**/vendor/**

# 忽略 lib 目录下的所有文件
**/lib/**

# 忽略特定目录
**/example-vue-app/**
```

#### 3. 忽略特定漏洞类型

```bash
# 忽略 XSS 漏洞
type:XSS

# 忽略内存泄漏
type:Memory Leak

# 忽略 SQL 注入
type:SQL Injection
```

#### 4. 忽略特定规则ID

```bash
# 忽略自定义 API 密钥规则
rule:custom-api-key

# 忽略硬编码密码规则
rule:hardcoded-password

# 忽略特定 Vue 规则
rule:vue-html
```

#### 5. 按严重级别忽略

```bash
# 忽略低严重级别的漏洞
severity:low

# 忽略中严重级别的漏洞
severity:medium
```

#### 6. 注释

```bash
# 这是注释
# 忽略 node_modules 目录
node_modules/
```

### 完整示例

```bash
# ========================================
# 目录忽略
# ========================================
node_modules/
dist/
build/
.git/
coverage/
public/

# ========================================
# 文件模式忽略
# ========================================
**/*.min.js
**/vendor/**
**/lib/**
**/example-vue-app/**

# ========================================
# 漏洞类型忽略
# ========================================
type:XSS
type:Memory Leak
type:SQL Injection

# ========================================
# 规则ID忽略
# ========================================
rule:custom-api-key
rule:hardcoded-password
rule:vue-html

# ========================================
# 严重级别忽略
# ========================================
severity:low
```

### 支持的忽略语法

| 语法 | 说明 | 示例 |
|------|------|------|
| **文件路径** | 直接忽略文件或目录 | `node_modules/`, `**/*.min.js` |
| **type:** | 忽略特定漏洞类型 | `type:XSS`, `type:SQL Injection` |
| **rule:** | 忽略特定规则ID | `rule:custom-api-key`, `rule:vue-html` |
| **plugin:** | 忽略特定插件（向后兼容） | `plugin:xss` |
| **severity:** | 按严重级别忽略 | `severity:low`, `severity:medium` |
| **#** | 注释 | `# 这是注释` |

### Glob模式说明

| 模式 | 说明 | 示例 |
|------|------|------|
| `*` | 匹配任意数量的字符（不包括路径分隔符） | `*.js` 匹配 `test.js` 但不匹配 `src/test.js` |
| `**` | 匹配任意数量的目录 | `**/*.js` 匹配所有 `.js` 文件 |
| `?` | 匹配单个字符 | `test?.js` 匹配 `test1.js` 但不匹配 `test12.js` |
| `[]` | 匹配字符集合 | `test[0-9].js` 匹配 `test1.js` 到 `test9.js` |

### 使用场景

- ✅ 需要简单直观的忽略方式
- ✅ 需要按漏洞类型或规则ID忽略
- ✅ 需要按严重级别忽略
- ✅ 需要快速配置忽略规则

### 优点

- 语法简单直观
- 类似 `.gitignore`，易于理解
- 支持多种忽略维度
- 不需要复杂的配置

### 缺点

- 不支持规则选项配置
- 不支持调整严重级别

---

## 方案4：命令行参数

### 概述

通过命令行参数指定配置文件，适合临时或环境特定的配置需求。

### 使用方法

```bash
# 使用自定义配置文件
vue-security-scanner . --config /path/to/custom-config.json

# 简写形式
vue-security-scanner . -c /path/to/custom-config.json

# 扫描特定项目
vue-security-scanner /path/to/vue-project -c /path/to/config.json
```

### 使用场景

- ✅ 需要临时使用不同配置
- ✅ 需要为不同环境使用不同配置
- ✅ 需要在CI/CD中使用特定配置
- ✅ 需要测试不同的配置方案

### 优点

- 灵活指定配置文件
- 可以覆盖默认配置
- 适合不同环境使用不同配置

### 缺点

- 不适合日常使用
- 需要记住配置文件路径

---

## 推荐使用方式

### 最佳实践组合

根据项目需求，推荐以下组合方式：

#### 1. 标准项目配置

**推荐组合：** 配置文件 + .vue-security-ignore

```bash
# vue-security-scanner.config.json - 主要配置
{
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build"],
    "ignorePatterns": ["**/*.min.js"]
  },
  "rules": {
    "xss": { "enabled": true },
    "dependencies": { "enabled": true }
  }
}

# .vue-security-ignore - 快速忽略
type:low
severity:low
```

**适用场景：**
- 大多数Vue项目
- 团队协作项目
- 需要版本控制的项目

#### 2. 精细控制配置

**推荐组合：** 配置文件 + 规则启用/禁用 + .vue-security-ignore

```bash
# vue-security-scanner.config.json - 精细控制
{
  "rules": {
    "xss": {
      "enabled": true,
      "severity": "high",
      "options": {
        "checkVHtml": true,
        "checkTemplateInterpolation": false
      }
    },
    "dependencies": {
      "enabled": true,
      "options": {
        "checkDeprecated": false,
        "checkOutdated": false
      }
    }
  }
}

# .vue-security-ignore - 补充忽略
rule:custom-api-key
type:Memory Leak
```

**适用场景：**
- 需要精确控制规则行为
- 需要调整规则严重级别
- 需要自定义规则选项

#### 3. CI/CD 配置

**推荐组合：** 命令行参数 + 专用配置文件

```bash
# .github/workflows/security-scan.yml
- name: Run security scan
  run: |
    vue-security-scanner . -c .github/security-config.json

# .github/security-config.json - CI/CD专用配置
{
  "rules": {
    "xss": { "enabled": true },
    "dependencies": { "enabled": true }
  },
  "output": {
    "format": "json",
    "reportPath": "security-report.json"
  }
}
```

**适用场景：**
- CI/CD流水线
- 自动化安全扫描
- 多环境部署

#### 4. 开发环境配置

**推荐组合：** 配置文件 + .vue-security-ignore + 命令行参数

```bash
# vue-security-scanner.config.json - 开发配置
{
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build", "tests"]
  },
  "rules": {
    "xss": { "enabled": true },
    "dependencies": { "enabled": false }
  }
}

# .vue-security-ignore - 开发忽略
severity:low
type:Memory Leak

# 开发时使用
vue-security-scanner . -c vue-security-scanner.config.json
```

**适用场景：**
- 本地开发环境
- 需要快速反馈
- 需要忽略非关键问题

---

## 忽略方案对比

### 详细对比表

| 特性 | 配置文件 | 规则启用/禁用 | .vue-security-ignore | 命令行参数 |
|------|---------|--------------|-------------------|------------|
| **忽略目录** | ✅ | ❌ | ✅ | ✅ |
| **忽略文件** | ✅ | ❌ | ✅ | ✅ |
| **忽略漏洞类型** | ❌ | ❌ | ✅ | ❌ |
| **忽略规则ID** | ❌ | ✅ | ✅ | ❌ |
| **按严重级别忽略** | ❌ | ✅ | ✅ | ❌ |
| **启用/禁用规则** | ✅ | ✅ | ❌ | ✅ |
| **调整严重级别** | ❌ | ✅ | ❌ | ❌ |
| **自定义规则选项** | ❌ | ✅ | ❌ | ❌ |
| **版本控制友好** | ✅ | ✅ | ✅ | ❌ |
| **配置复杂度** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ |
| **灵活性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 选择建议

| 需求 | 推荐方案 |
|------|---------|
| 忽略大量文件和目录 | 配置文件 + .vue-security-ignore |
| 精确控制规则行为 | 规则启用/禁用 |
| 快速配置忽略规则 | .vue-security-ignore |
| 团队协作 | 配置文件 + .vue-security-ignore |
| CI/CD集成 | 命令行参数 + 专用配置 |
| 多环境配置 | 命令行参数 + 多个配置文件 |

---

## 使用场景和案例

### 场景1：忽略第三方库

**需求：** 忽略 `node_modules` 和 `vendor` 目录，不扫描第三方库。

**解决方案：**

```bash
# .vue-security-ignore
node_modules/
**/vendor/**
**/lib/**
```

或

```json
{
  "scan": {
    "ignoreDirs": ["node_modules"],
    "ignorePatterns": ["**/vendor/**", "**/lib/**"]
  }
}
```

---

### 场景2：忽略低严重级别问题

**需求：** 只关注高和中严重级别的问题，忽略低严重级别。

**解决方案：**

```bash
# .vue-security-ignore
severity:low
```

---

### 场景3：禁用过时依赖检查

**需求：** 检查已知漏洞，但不关心依赖是否过时。

**解决方案：**

```json
{
  "rules": {
    "dependencies": {
      "enabled": true,
      "options": {
        "checkKnownVulnerabilities": true,
        "checkDeprecated": false,
        "checkOutdated": false
      }
    }
  }
}
```

---

### 场景4：忽略特定规则

**需求：** 项目中有一些已知的假阳性，需要忽略特定规则。

**解决方案：**

```bash
# .vue-security-ignore
rule:custom-api-key
rule:hardcoded-password
rule:vue-html
```

---

### 场景5：多环境配置

**需求：** 开发环境和生产环境使用不同的配置。

**解决方案：**

```bash
# vue-security-scanner.dev.json - 开发环境
{
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build", "tests"]
  },
  "rules": {
    "dependencies": { "enabled": false }
  }
}

# vue-security-scanner.prod.json - 生产环境
{
  "scan": {
    "ignoreDirs": ["node_modules"]
  },
  "rules": {
    "dependencies": { "enabled": true }
  }
}

# 使用
vue-security-scanner . -c vue-security-scanner.dev.json  # 开发环境
vue-security-scanner . -c vue-security-scanner.prod.json # 生产环境
```

---

### 场景6：CI/CD集成

**需求：** 在GitHub Actions中运行安全扫描，只关注高严重级别问题。

**解决方案：**

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run security scan
        run: |
          npm install -g vue-security-scanner
          vue-security-scanner . -c .github/security-ci.json
```

```json
{
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build"]
  },
  "rules": {
    "xss": { "enabled": true, "severity": "high" },
    "dependencies": { "enabled": true, "severity": "high" }
  },
  "output": {
    "format": "json",
    "reportPath": "security-report.json"
  }
}
```

---

## 常见问题

### Q1：.vue-security-ignore 和配置文件的 ignoreDirs 有什么区别？

**A：**
- `.vue-security-ignore`：类似 `.gitignore`，语法简单，支持按漏洞类型和规则ID忽略
- 配置文件的 `ignoreDirs`：更正式的配置方式，适合版本控制

两者可以同时使用，建议：
- 使用配置文件管理目录和文件忽略
- 使用 `.vue-security-ignore` 管理漏洞类型和规则ID忽略

---

### Q2：如何忽略某个特定文件？

**A：** 有两种方式：

```bash
# 方式1：.vue-security-ignore
src/components/MyComponent.vue

# 方式2：配置文件
{
  "scan": {
    "ignorePatterns": ["src/components/MyComponent.vue"]
  }
}
```

---

### Q3：如何临时禁用某个规则？

**A：** 使用 `.vue-security-ignore`：

```bash
# 临时禁用某个规则
rule:vue-html

# 添加注释说明原因
# TODO: 修复后移除此忽略
rule:custom-api-key
```

---

### Q4：配置文件的优先级是什么？

**A：** 按以下优先级加载：

1. `vue-security-scanner.config.json` (项目根目录)
2. `.vue-security.json` (项目根目录)
3. `vue-security-scanner.config.json` (当前工作目录)
4. `.vue-security.json` (当前工作目录)

命令行参数指定的配置文件优先级最高。

---

### Q5：如何在团队中共享忽略规则？

**A：** 推荐方式：

1. 将 `vue-security-scanner.config.json` 提交到版本控制
2. 将 `.vue-security-ignore` 提交到版本控制
3. 团队成员使用相同的配置

```bash
# .gitignore
# 不要忽略配置文件
!vue-security-scanner.config.json
!.vue-security-ignore
```

---

### Q6：如何调试忽略规则？

**A：** 使用详细模式：

```bash
vue-security-scanner . --level detailed --show-progress
```

查看扫描输出，确认哪些文件被忽略。

---

### Q7：忽略规则会影响所有扫描吗？

**A：** 是的，忽略规则会影响：
- 命令行扫描
- VSCode插件扫描
- Vite/Webpack插件扫描
- CI/CD扫描

确保忽略规则适合所有使用场景。

---

### Q8：如何恢复默认配置？

**A：** 删除或重命名配置文件：

```bash
# 备份当前配置
mv vue-security-scanner.config.json vue-security-scanner.config.json.backup

# 使用默认配置扫描
vue-security-scanner .
```

---

## 相关文档

- [配置说明 (CONFIGURATION.md)](./CONFIGURATION.md) - 详细的配置选项说明
- [README.md](./README.md) - 项目概述和快速开始
- [README_CN.md](./README_CN.md) - 中文版项目概述
- [规则扩展指南 (RULE_EXTENSION_GUIDE.md)](./RULE_EXTENSION_GUIDE.md) - 自定义规则开发

---

## 总结

Vue Security Scanner 提供了4种灵活的忽略方案：

1. **配置文件** - 项目级别的忽略配置，适合团队协作
2. **规则启用/禁用** - 精细控制规则行为，最灵活
3. **.vue-security-ignore** - 类似gitignore，最简单直观
4. **命令行参数** - 临时或环境特定配置

**推荐使用方式：**
- 标准项目：配置文件 + .vue-security-ignore
- 精细控制：配置文件 + 规则启用/禁用 + .vue-security-ignore
- CI/CD：命令行参数 + 专用配置文件
- 开发环境：配置文件 + .vue-security-ignore + 命令行参数

根据项目需求选择合适的组合方式，可以高效地控制扫描行为！
