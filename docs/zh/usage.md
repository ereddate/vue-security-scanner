# Vue Security Scanner 使用教程

## 基本使用

### 1. 命令行扫描

**基本扫描**：扫描当前目录

```bash
vue-security-scanner
```

**指定路径扫描**：扫描特定目录

```bash
vue-security-scanner ./src
```

**使用简写命令**：

```bash
vsc ./src
```

### 2. 常用命令选项

| 选项 | 描述 | 示例 |
|------|------|------|
| `--version, -v` | 显示版本信息 | `vsc -v` |
| `--help, -h` | 显示帮助信息 | `vsc -h` |
| `--config, -c` | 指定配置文件 | `vsc -c config.js` |
| `--format, -f` | 输出格式 (json/text/html) | `vsc -f html` |
| `--output, -o` | 输出文件 | `vsc -o report.json` |
| `--severity, -s` | 严重性级别 (critical/high/medium/low) | `vsc -s high` |
| `--rules, -r` | 指定规则模块 | `vsc -r vue,china-security` |
| `--exclude, -e` | 排除路径 | `vsc -e node_modules,dist` |
| `--quiet, -q` | 安静模式 | `vsc -q` |
| `--verbose, -V` | 详细模式 | `vsc -V` |

### 3. 扫描模式

#### 3.1 完整扫描

扫描整个项目：

```bash
vue-security-scanner --verbose
```

#### 3.2 增量扫描

只扫描修改过的文件（默认启用）：

```bash
vue-security-scanner --incremental
```

#### 3.3 快速扫描

只扫描关键规则：

```bash
vue-security-scanner --quick
```

#### 3.4 自定义扫描

指定规则和严重性：

```bash
vue-security-scanner --rules vue,china-security --severity high
```

## 高级功能

### 1. 合规性报告

生成合规性报告：

```bash
# 生成中文合规性报告
vue-security-scanner --compliance china --format html --output compliance-report.html

# 生成增强版合规性报告
vue-security-scanner --compliance enhanced --format html --output enhanced-report.html
```

### 2. 威胁情报检查

检查依赖项的安全威胁：

```bash
# 检查依赖项威胁
vue-security-scanner --threat-intelligence

# 更新威胁情报数据库
vue-security-scanner --threat-intelligence --update

# 搜索特定威胁
vue-security-scanner --threat-intelligence --search "vue"
```

### 3. 性能优化

配置性能选项：

```bash
# 启用缓存
vue-security-scanner --cache

# 禁用增量扫描
vue-security-scanner --no-incremental

# 设置缓存大小
vue-security-scanner --cache-size 200
```

### 4. 规则管理

#### 4.1 查看规则

```bash
# 查看所有规则
vue-security-scanner --list-rules

# 查看特定模块规则
vue-security-scanner --list-rules --rules vue
```

#### 4.2 规则配置

在 `.vue-security-scanner.config.js` 中配置规则：

```javascript
module.exports = {
  rules: {
    // 启用的规则
    enabled: [
      'vue',
      'javascript',
      'china-security',
      'china-api-security',
      'dependency'
    ],
    
    // 自定义规则设置
    custom: {
      // Vue 规则设置
      vue: {
        no-v-html: 'error',
        no-dangerous-template: 'error',
        no-unsafe-computed: 'warning'
      },
      
      // 中国安全规则设置
      'china-security': {
        'gb-t-28448': 'error',
        'gb-t-31168': 'warning',
        '等级保护': 'error'
      }
    }
  }
};
```

### 5. 集成到构建流程

#### 5.1 集成到 package.json

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "security": "vue-security-scanner",
    "security:report": "vue-security-scanner --format html --output security-report.html",
    "security:compliance": "vue-security-scanner --compliance china --format html --output compliance-report.html"
  }
}
```

运行安全扫描：

```bash
npm run security
```

#### 5.2 集成到 CI/CD

**GitHub Actions** 示例：

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm install -g vue-security-scanner
      - run: vue-security-scanner --format json --output security-report.json
      - name: Upload security report
        uses: actions/upload-artifact@v2
        with:
          name: security-report
          path: security-report.json
```

**GitLab CI** 示例：

```yaml
security_scan:
  stage: test
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner --format html --output security-report.html
  artifacts:
    paths:
      - security-report.html
  only:
    - merge_requests
    - main
```

## 项目集成

### 1. 作为开发依赖使用

在项目中安装并使用：

```bash
npm install vue-security-scanner --save-dev
```

在 `package.json` 中添加：

```json
{
  "scripts": {
    "test:security": "vue-security-scanner"
  }
}
```

### 2. 编程方式使用

在代码中使用：

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function scan() {
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    exclude: ['node_modules', 'dist']
  });
  
  const results = await scanner.scan();
  console.log('扫描结果:', results);
  
  // 生成报告
  await scanner.generateReport(results, {
    format: 'html',
    outputPath: './security-report.html'
  });
}

scan();
```

### 3. 与其他工具集成

#### 3.1 与 ESLint 集成

在 ESLint 配置中添加：

```javascript
module.exports = {
  // ...
  plugins: [
    // ...
  ],
  extends: [
    // ...
  ],
  // 添加 Vue Security Scanner 脚本
  scripts: {
    "lint": "eslint .",
    "security": "vue-security-scanner"
  }
};
```

#### 3.2 与 Prettier 集成

在 `package.json` 中添加：

```json
{
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint .",
    "security": "vue-security-scanner",
    "check": "npm run format && npm run lint && npm run security"
  }
}
```

## 最佳实践

### 1. 扫描策略

- **开发阶段**：使用快速扫描，关注关键问题
- **提交前**：使用完整扫描，确保代码质量
- **构建前**：使用合规性扫描，确保符合法规要求
- **定期扫描**：每周或每月进行全面扫描

### 2. 结果处理

**分析报告**：
1. 优先处理严重级别高的问题
2. 关注影响范围大的问题
3. 建立问题跟踪和修复计划

**修复流程**：
1. 分析问题原因
2. 实施修复方案
3. 验证修复效果
4. 记录修复过程

### 3. 自定义配置

根据项目特点自定义配置：

```javascript
// 适合大型项目的配置
module.exports = {
  scanPath: './src',
  exclude: [
    'node_modules',
    'dist',
    'build',
    '.git',
    'test',
    'coverage'
  ],
  rules: {
    enabled: ['vue', 'javascript', 'china-security'],
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: false
    }
  },
  performance: {
    enableCache: true,
    enableIncremental: true,
    maxCacheSize: 200 * 1024 * 1024 // 200MB
  },
  reporting: {
    formats: ['json', 'html'],
    outputDir: './security-reports'
  }
};
```

## 常见场景

### 1. Vue 项目扫描

```bash
# 扫描 Vue 项目
vue-security-scanner ./src --rules vue,javascript

# 生成 Vue 安全报告
vue-security-scanner ./src --format html --output vue-security-report.html
```

### 2. 中国合规性扫描

```bash
# 扫描中国合规性
vue-security-scanner ./src --rules china-security,china-api-security

# 生成中国合规性报告
vue-security-scanner ./src --compliance china --format html --output china-compliance-report.html
```

### 3. 依赖项安全检查

```bash
# 检查依赖项安全
vue-security-scanner --rules dependency

# 结合威胁情报检查
vue-security-scanner --rules dependency --threat-intelligence
```

### 4. 紧急安全检查

```bash
# 快速检查关键漏洞
vue-security-scanner --quick --severity critical

# 详细检查特定模块
vue-security-scanner --rules vue --verbose
```

## 故障排除

### 1. 扫描速度慢

**解决方案**：
- 启用缓存：`vue-security-scanner --cache`
- 使用增量扫描：`vue-security-scanner --incremental`
- 排除不必要的目录：`vue-security-scanner --exclude node_modules,dist`

### 2. 误报问题

**解决方案**：
- 调整规则配置：在配置文件中设置规则级别
- 使用白名单：在代码中添加 `// vue-security-disable-next-line` 注释
- 报告误报：提交 GitHub Issue

### 3. 扫描失败

**解决方案**：
- 检查 Node.js 版本
- 检查依赖项是否完整
- 查看详细错误：`vue-security-scanner --verbose`

### 4. 报告生成失败

**解决方案**：
- 检查输出目录权限
- 确保磁盘空间充足
- 使用不同格式：`vue-security-scanner --format json`

## 高级技巧

### 1. 批量扫描

创建扫描脚本：

```bash
#!/bin/bash

# 扫描多个项目
projects=("project1" "project2" "project3")

for project in "${projects[@]}"; do
  echo "Scanning $project..."
  vue-security-scanner "$project/src" --format html --output "$project-security-report.html"
done

echo "All scans completed!"
```

### 2. 自动化监控

设置定时任务：

**Linux/macOS** (crontab)：

```bash
# 每天凌晨 2 点扫描
0 2 * * * cd /path/to/project && vue-security-scanner --format html --output daily-security-report.html
```

**Windows** (任务计划程序)：

创建任务，执行：
```
npm run security:report
```

### 3. 集成到开发工具

**VS Code 集成**：
1. 安装 Vue Security Scanner 扩展
2. 在 VS Code 中使用快捷键触发扫描
3. 查看实时安全建议

**WebStorm 集成**：
1. 在 WebStorm 中添加 npm 脚本
2. 使用工具栏按钮触发扫描
3. 查看扫描结果

## 下一步

- 查看 [规则文档](./rules/index.md) 了解详细规则
- 查看 [API 参考](./api/index.md) 了解编程接口
- 查看 [合规性指南](./compliance/index.md) 了解合规要求