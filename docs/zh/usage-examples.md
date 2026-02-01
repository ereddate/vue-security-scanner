# 使用示例指南

本指南提供了在各种场景中使用 Vue Security Scanner 的综合示例。

## 概述

使用示例展示：
- 基本扫描技术
- 高级配置选项
- 与其他工具的集成
- 专门的扫描场景
- 实际使用案例

## 基本使用示例

### 简单扫描

```bash
# 扫描当前目录
vue-security-scanner .

# 扫描特定目录
vue-security-scanner src

# 扫描多个目录
vue-security-scanner src components views
```

### 输出格式

```bash
# 控制台输出（默认）
vue-security-scanner . --output console

# JSON 输出
vue-security-scanner . --output json --report security-report.json

# HTML 输出
vue-security-scanner . --output html --report security-report.html

# CSV 输出
vue-security-scanner . --output csv --report security-report.csv
```

### 严重性过滤

```bash
# 仅高和严重级别问题
vue-security-scanner . --severity high,critical

# 仅严重级别问题
vue-security-scanner . --severity critical

# 排除低严重性问题
vue-security-scanner . --exclude-severity low
```

## 高级使用示例

### 自定义配置

```bash
# 使用自定义配置文件
vue-security-scanner . --config vue-security-scanner.config.json

# 覆盖特定配置
vue-security-scanner . --config vue-security-scanner.config.json --level detailed
```

### 性能优化

```bash
# 使用快速性能配置文件
vue-security-scanner . --performance fast

# 使用全面性能配置文件
vue-security-scanner . --performance thorough

# 设置批处理大小
vue-security-scanner . --batch-size 10

# 启用增量扫描
vue-security-scanner . --incremental
```

### 忽略规则

```bash
# 使用忽略文件
vue-security-scanner . --ignore-file .vue-security-ignore

# 忽略特定目录
vue-security-scanner . --ignore-dir node_modules --ignore-dir dist

# 忽略特定模式
vue-security-scanner . --ignore-pattern "**/*.min.js" --ignore-pattern "**/vendor/**"
```

## 集成示例

### npm 脚本

```json
{
  "scripts": {
    "security": "vue-security-scanner . --output json --report security-report.json",
    "security:html": "vue-security-scanner . --output html --report security-report.html",
    "security:detailed": "vue-security-scanner . --level detailed --output json --report security-report-detailed.json"
  }
}
```

### Git Hooks

```bash
# pre-commit hook
#!/bin/sh
vue-security-scanner . --severity high,critical --output console
if [ $? -ne 0 ]; then
  echo "发现安全问题。请在提交前修复它们。"
  exit 1
fi
```

### 编辑器集成

#### Visual Studio Code

添加到 `tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "security-scan",
      "type": "shell",
      "command": "vue-security-scanner . --output json --report security-report.json",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

## 框架特定示例

### Vue 2

```bash
# 扫描 Vue 2 项目
vue-security-scanner . --vue2

# 使用 Vue 2 特定规则
vue-security-scanner . --vue2 --rules vue2
```

### Vue 3

```bash
# 扫描 Vue 3 项目
vue-security-scanner . --vue3

# 使用 Vue 3 特定规则
vue-security-scanner . --vue3 --rules vue3
```

### Nuxt.js

```bash
# 扫描 Nuxt.js 项目
vue-security-scanner . --nuxt

# 使用 Nuxt 特定规则
vue-security-scanner . --nuxt --rules nuxt
```

### Vite

```bash
# 扫描 Vite 项目
vue-security-scanner . --vite

# 使用 Vite 特定规则
vue-security-scanner . --vite --rules vite
```

## CI/CD 集成示例

### GitHub Actions

```yaml
# .github/workflows/vue-security-scan.yml
name: Vue Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install Vue Security Scanner
        run: npm install -g vue-security-scanner
      - name: Run Security Scan
        run: vue-security-scanner . --output json --report security-report.json
      - name: Upload Security Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.json
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
security-scan:
  image: node:18-alpine
  stage: test
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner . --output json --report security-report.json
  artifacts:
    paths:
      - security-report.json
    expire_in: 1 week
```

### Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            steps {
                sh 'npm install -g vue-security-scanner'
                sh 'vue-security-scanner . --output json --report security-report.json'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'security-report.json', fingerprint: true
        }
    }
}
```

## Docker 示例

### 在 Docker 容器中运行

```bash
# 拉取最新镜像
docker pull vuesecurityscanner/vue-security-scanner:latest

# 在容器中运行扫描
docker run --rm -v "$(pwd):/app" vuesecurityscanner/vue-security-scanner:latest /app

# 使用自定义配置运行
docker run --rm -v "$(pwd):/app" vuesecurityscanner/vue-security-scanner:latest /app --config vue-security-scanner.config.json
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  vue-security-scanner:
    image: vuesecurityscanner/vue-security-scanner:latest
    volumes:
      - .:/app
    command: ["/app", "--output", "json", "--report", "/app/security-report.json"]
```

## 分布式扫描示例

### 启动工作节点

```bash
# 启动工作节点 1
vue-security-distributed worker --port 3001 --worker-id worker-1

# 启动工作节点 2
vue-security-distributed worker --port 3002 --worker-id worker-2

# 启动具有自定义内存限制的工作节点
vue-security-distributed worker --port 3003 --worker-id worker-3 --memory-limit 2048
```

### 运行分布式扫描

```bash
# 创建工作节点配置
cat > workers.json << EOF
{
  "workers": [
    {
      "id": "worker-1",
      "url": "http://localhost:3001"
    },
    {
      "id": "worker-2",
      "url": "http://localhost:3002"
    }
  ]
}
EOF

# 运行分布式扫描
vue-security-distributed scan . --workers workers.json --batch-size 10 --output json --report distributed-security-report.json
```

## 企业使用示例

### 企业配置

```bash
# 使用企业配置
vue-security-scanner . --config config/enterprise-config.json

# 带有合规检查的企业扫描
vue-security-scanner . --config config/enterprise-config.json --compliance pci-dss,gdpr
```

### 许可证激活

```bash
# 激活企业许可证
vue-security-scanner . --license activate --license-key "YOUR_LICENSE_KEY"

# 检查许可证状态
vue-security-scanner . --license status
```

## 专门的扫描示例

### 增量扫描

```bash
# 启用增量扫描
vue-security-scanner . --incremental

# 使用自定义缓存目录
vue-security-scanner . --incremental --cache-dir .vue-security-cache

# 强制完全扫描
vue-security-scanner . --incremental --force-full
```

### 依赖扫描

```bash
# 启用依赖扫描
vue-security-scanner . --dependencies

# 更新漏洞数据库
vue-security-scanner . --dependencies --update-db

# 仅依赖扫描
vue-security-scanner . --dependencies --only-dependencies
```

### TypeScript 扫描

```bash
# 启用 TypeScript 扫描
vue-security-scanner . --typescript

# 使用 tsconfig.json
vue-security-scanner . --typescript --tsconfig tsconfig.json

# TypeScript 特定规则
vue-security-scanner . --typescript --rules typescript
```

## 实际使用案例

### 大型单体仓库

```bash
# 扫描大型单体仓库
vue-security-scanner . --batch-size 5 --memory-threshold 70 --performance fast

# 单体仓库的分布式扫描
vue-security-distributed scan . --workers workers.json --batch-size 10 --output json --report monorepo-security-report.json
```

### 微服务架构

```bash
# 扫描多个微服务
for service in services/*; do
  echo "Scanning $service..."
  vue-security-scanner $service --output json --report "security-report-${service##*/}.json"
done

# 聚合结果
vue-security-scanner . --aggregate-reports "security-report-*.json" --output json --report aggregated-security-report.json
```

### 遗留应用程序

```bash
# 扫描遗留 Vue 2 应用程序
vue-security-scanner . --vue2 --level basic

# 使用遗留兼容模式
vue-security-scanner . --vue2 --compatibility legacy
```

## 故障排除示例

### 调试模式

```bash
# 启用调试输出
vue-security-scanner . --debug

# 详细输出
vue-security-scanner . --verbose

# 跟踪级别输出
vue-security-scanner . --trace
```

### 验证

```bash
# 验证配置文件
vue-security-scanner . --config vue-security-scanner.config.json --validate-config

# 验证自定义规则
vue-security-scanner . --config vue-security-scanner.config.json --validate-rules

# 测试特定规则
vue-security-scanner . --test-rule hardcoded-password
```

## 最佳实践示例

### 开发工作流

```bash
# 提交前扫描（快速）
vue-security-scanner . --performance fast --severity high,critical

# 每日扫描（全面）
vue-security-scanner . --performance thorough --output json --report daily-security-report.json

# 每周合规扫描
vue-security-scanner . --compliance all --output html --report weekly-compliance-report.html
```

### CI/CD 流水线

```bash
# 拉取请求扫描（快速）
vue-security-scanner . --performance fast --severity high,critical --output json --report pr-security-report.json

# 主分支扫描（全面）
vue-security-scanner . --performance thorough --output json --report master-security-report.json

# 发布扫描（综合）
vue-security-scanner . --performance thorough --compliance all --output html --report release-security-report.html
```

## 集成示例

### 与 ESLint 集成

```bash
# 先运行 ESLint，然后运行安全扫描
eslint . && vue-security-scanner .

# 合并结果
vue-security-scanner . --output json --report security-report.json && eslint . --format json > eslint-report.json && node scripts/combine-reports.js
```

### 与 Prettier 集成

```bash
# 使用 Prettier 格式化代码，然后扫描
prettier --write . && vue-security-scanner .
```

### 与 Jest 集成

```bash
# 运行测试，然后运行安全扫描
jest && vue-security-scanner .

# 安全扫描作为测试套件的一部分
# 添加到 package.json 脚本
"scripts": {
  "test": "jest",
  "security": "vue-security-scanner .",
  "test:all": "npm run test && npm run security"
}
```

## 支持

如需其他使用示例和帮助：

1. **文档**：查阅官方文档
2. **GitHub Issues**：提问并分享示例
3. **社区论坛**：加入 Vue Security 社区
4. **企业支持**：联系企业支持获取自定义示例