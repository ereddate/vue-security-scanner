# 忽略规则指南

本指南解释了如何使用忽略规则来排除 Vue Security Scanner 扫描中的特定文件、目录或漏洞类型。

## 忽略文件格式

在项目根目录创建 `.vue-security-ignore` 文件，以指定扫描期间要忽略的内容。

文件格式类似于 `.gitignore`，但增加了对忽略特定漏洞类型和规则的支持。

## 基本用法

### 忽略目录

```bash
# 忽略 node_modules 目录
node_modules/

# 忽略 dist 目录
dist/

# 忽略 build 目录
build/

# 忽略 .git 目录
.git/

# 忽略 coverage 目录
coverage/

# 忽略 public 目录
public/
```

### 忽略文件模式

```bash
# 忽略所有压缩的 JavaScript 文件
**/*.min.js

# 忽略 vendor 目录中的所有文件
**/vendor/**

# 忽略 lib 目录中的所有文件
**/lib/**

# 忽略特定文件
config/secret.js

# 忽略特定模式的文件
src/**/*test*.js
```

### 忽略漏洞类型

```bash
# 忽略 XSS 漏洞
type:XSS

# 忽略内存泄漏漏洞
type:Memory Leak

# 忽略 CSRF 漏洞
type:CSRF

# 忽略 SQL 注入漏洞
type:SQL Injection
```

### 忽略特定规则

```bash
# 忽略自定义 API 密钥规则
rule:custom-api-key

# 忽略硬编码密码规则
rule:hardcoded-password

# 忽略不安全的 JWT 规则
rule:insecure-jwt

# 忽略缺失 CSP 规则
rule:missing-csp
```

### 按严重性忽略

```bash
# 忽略低严重性漏洞
severity:low

# 忽略中严重性漏洞
severity:medium

# 忽略低和中严重性漏洞
severity:low
severity:medium
```

## 高级模式

### 通配符模式

忽略文件支持通配符模式：

- `*` 匹配除 `/` 之外的任何字符
- `**` 匹配包括 `/` 在内的任何字符
- `?` 匹配单个字符
- `[abc]` 匹配集合中的任何字符
- `[!abc]` 匹配不在集合中的任何字符

### 否定模式

您可以使用 `!` 否定模式：

```bash
# 忽略所有 JavaScript 文件，除了 app.js
**/*.js
!app.js

# 忽略 src 中的所有文件，除了 src/utils
src/**
!src/utils/**
```

### 目录与文件模式

- 以 `/` 结尾的模式仅匹配目录
- 不以 `/` 结尾的模式既匹配文件也匹配目录

### 大小写不敏感

要使模式大小写不敏感，请在末尾添加 `i`：

```bash
# 忽略文件，不区分大小写
**/*.JS

# 大小写不敏感模式
**/*.js
```

## 多个忽略文件

您可以使用多个忽略文件：

1. 项目根目录中的 `.vue-security-ignore`
2. 子目录中的 `.vue-security-ignore`
3. 使用 `--ignore-file` 指定的自定义忽略文件

## 命令行选项

您还可以通过命令行指定忽略模式：

```bash
# 忽略特定目录
vue-security-scanner . --ignore-dir node_modules --ignore-dir dist

# 忽略特定文件模式
vue-security-scanner . --ignore-pattern "**/*.min.js" --ignore-pattern "**/vendor/**"

# 使用自定义忽略文件
vue-security-scanner . --ignore-file custom-ignore.txt
```

## 配置文件选项

您可以在配置文件中配置忽略模式：

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
    ]
  }
}
```

## 最佳实践

### 开发环境

```bash
# 忽略测试文件
test/
__tests__/
**/*test*.js
**/*spec*.js

# 忽略开发工具
.vscode/
.idea/
*.swp
*.swo
*~

# 忽略环境文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 生产环境

```bash
# 忽略开发依赖
node_modules/

# 忽略构建产物
dist/
build/

# 忽略源码映射
**/*.map

# 忽略文档
docs/
README.md
CHANGELOG.md
```

### 安全考虑

```bash
# 永远不要忽略安全关键目录
src/

# 仅在必要时忽略特定漏洞类型
# severity:low

# 定期审查忽略规则
```

## 故障排除

### 模式不工作

如果您的忽略模式不起作用：

1. 检查模式语法
2. 确保使用正确的通配符模式
3. 验证模式是否匹配正确的路径
4. 检查否定模式是否覆盖了您的规则

### 特定文件仍被扫描

如果特定文件仍被扫描：

1. 检查文件是否被多个模式匹配
2. 验证文件路径是否正确
3. 检查文件是否在带有自己的忽略文件的子目录中
4. 使用 `--verbose` 查看哪些文件正在被扫描

### 误报太多

要减少误报：

1. 忽略导致误报的特定规则
2. 使用严重性过滤器关注重要问题
3. 创建更具体的模式，只忽略有问题的代码

## 示例

### 示例 1：基本忽略文件

```bash
# 依赖
node_modules/

# 构建产物
dist/
build/

# 版本控制
.git/

# 覆盖率报告
coverage/

# 环境文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE 文件
.vscode/
.idea/
*.swp
*.swo
*~

# 压缩文件
**/*.min.js

# 测试文件
**/*test*.js
**/*spec*.js
test/
__tests__/

# 低严重性问题
severity:low
```

### 示例 2：高级忽略文件

```bash
# 目录
node_modules/
dist/
build/
.git/
coverage/
public/

# 文件模式
**/*.min.js
**/vendor/**
**/lib/**
**/*.map

# 环境文件
.env
.env.local
.env.*.local

# IDE 文件
.vscode/
.idea/
*.swp
*.swo
*~

# 测试文件
test/
__tests__/
**/*test*.js
**/*spec*.js

# 漏洞类型
type:Memory Leak

# 特定规则
rule:custom-api-key
rule:hardcoded-password

# 严重性
severity:low

# 否定模式
!src/utils/security.js
!src/components/auth/
```

## 支持

如需忽略规则的其他帮助，请在 GitHub 仓库中打开问题。