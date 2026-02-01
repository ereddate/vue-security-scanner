# Vue 安全扫描工具开发指南

本全面指南涵盖了为 Vue 安全扫描工具做出贡献和开发所需的所有知识。

## 目录

- [项目概述](#项目概述)
- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [开发工作流程](#开发工作流程)
- [代码规范](#代码规范)
- [测试](#测试)
- [构建](#构建)
- [调试](#调试)
- [性能优化](#性能优化)
- [文档](#文档)
- [贡献](#贡献)

## 项目概述

Vue 安全扫描工具是一个针对 Vue.js 应用程序的综合安全分析工具。它提供：

- 静态应用程序安全测试（SAST）
- 动态应用程序安全测试（DAST）
- 依赖漏洞扫描
- 合规性报告（OWASP、GDPR、HIPAA、PCI-DSS、SOX、中国标准）
- 威胁情报集成
- 企业级功能（分布式扫描、仪表板等）

### 主要技术

- **Node.js**：运行时环境
- **JavaScript/TypeScript**：主要开发语言
- **AST 分析**：@babel/parser、@babel/traverse 用于代码分析
- **Vue 支持**：Vue 2/3、Nuxt.js、uni-app、Taro
- **测试**：Jest、Mocha 或其他测试框架
- **构建工具**：Webpack、Vite
- **CI/CD**：GitHub Actions、GitLab CI/CD、Jenkins 等

## 开发环境设置

### 前置条件

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本
- Git 2.x 或更高版本
- 代码编辑器（推荐 VSCode）

### 安装

1. 克隆仓库：

```bash
git clone https://github.com/your-org/vue-security-scanner.git
cd vue-security-scanner
```

2. 安装依赖：

```bash
npm install
```

3. 全局链接包（用于开发）：

```bash
npm link
```

### VSCode 设置

安装推荐的扩展：

- ESLint
- Prettier
- GitLens
- Vue Language Features (Volar)

配置 VSCode 设置：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 项目结构

```
vue-security-scanner/
├── bin/                          # CLI 可执行文件
│   ├── vue-security-scanner.js    # 主 CLI 入口点
│   └── vue-security-distributed.js # 分布式扫描器 CLI
├── src/                          # 源代码
│   ├── analysis/                 # 分析模块
│   │   ├── ast-analyzer.js       # 基于 AST 的代码分析
│   │   ├── dast-scanner.js       # 动态应用程序安全测试
│   │   └── dependency-scanner.js # 依赖漏洞扫描
│   ├── checks/                   # 安全检查
│   │   └── security-checks.js    # 安全检查实现
│   ├── config/                   # 配置
│   │   └── default-config.js     # 默认配置
│   ├── core/                     # 核心功能
│   │   └── vulnerability-detector.js # 漏洞检测
│   ├── distributed/              # 分布式扫描
│   │   ├── distributed-scanner.js
│   │   ├── result-aggregator.js
│   │   └── task-distributor.js
│   ├── integration/              # 集成
│   │   └── trae-cn-integration.js # Trae CN 集成
│   ├── reporting/                # 报告
│   │   ├── advanced-report-generator.js
│   │   ├── china-compliance-report-generator.js
│   │   └── enhanced-compliance-report-generator.js
│   ├── rules/                    # 安全规则
│   │   ├── modules/              # 规则模块
│   │   ├── custom-rules.js
│   │   ├── enhanced-rule-engine.js
│   │   ├── parallel-rule-engine.js
│   │   └── rule-engine.js
│   ├── threat-intelligence/      # 威胁情报
│   │   └── threat-intelligence-integration.js
│   ├── utils/                    # 工具
│   │   ├── error-handler.js
│   │   ├── helpers.js
│   │   ├── ignore-manager.js
│   │   ├── performance-optimizer.js
│   │   └── user-experience-optimizer.js
│   └── scanner.js                # 主扫描器
├── tests/                        # 测试文件
├── docs/                         # 文档
├── dashboard/                    # Web 仪表板
├── docker/                       # Docker 配置
├── mcp/                          # MCP 集成
├── nuxt-module-vue-security/     # Nuxt.js 模块
├── taro-plugin-vue-security/     # Taro 插件
├── jenkins-plugin-vue-security/  # Jenkins 插件
├── config/                       # 配置文件
├── .github/                      # GitHub 工作流
├── package.json                  # 包配置
└── README.md                     # 项目 README
```

## 开发工作流程

### 分支策略

- `main` - 生产就绪代码
- `develop` - 功能集成分支
- `feature/*` - 功能分支
- `bugfix/*` - 错误修复分支
- `hotfix/*` - 生产热修复

### 工作流程步骤

1. 从 `develop` 创建新分支：

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. 进行更改

3. 运行测试：

```bash
npm test
```

4. 提交更改：

```bash
git add .
git commit -m "feat: add your feature description"
```

5. 推送到远程：

```bash
git push origin feature/your-feature-name
```

6. 创建 Pull Request

### 提交消息约定

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- `feat`：新功能
- `fix`：错误修复
- `docs`：文档更改
- `style`：代码样式更改（格式化等）
- `refactor`：代码重构
- `perf`：性能改进
- `test`：测试更改
- `chore`：构建过程或辅助工具更改

示例：

```
feat(rules): 添加新的 XSS 检测规则

为 Vue 模板添加全面的 XSS 检测，包括
v-html、v-bind 和内联事件处理器。

Closes #123
```

```
fix(scanner): 修复文件扫描中的内存泄漏

修复了依赖扫描器中由未关闭文件句柄引起的
内存泄漏。在 finally 块中添加了适当的清理。

Fixes #456
```

## 代码规范

### JavaScript/TypeScript

- 使用 ES6+ 特性
- 遵循 Airbnb JavaScript 风格指南
- 使用有意义的变量和函数名
- 为函数和类添加 JSDoc 注释
- 保持函数小而专注

示例：

```javascript
/**
 * 扫描 Vue 文件是否存在安全漏洞
 * @param {string} filePath - Vue 文件路径
 * @param {Object} options - 扫描选项
 * @returns {Promise<Object>} 扫描结果
 */
async function scanVueFile(filePath, options) {
  const content = await fs.readFile(filePath, 'utf-8');
  const vulnerabilities = await detectVulnerabilities(content, options);
  return {
    filePath,
    vulnerabilities,
    timestamp: Date.now()
  };
}
```

### 安全规则

创建安全规则时：

1. 定义清晰的规则元数据：

```javascript
const rule = {
  id: 'vue:xss-v-html',
  name: '通过 v-html 的 XSS',
  severity: 'High',
  description: '检测使用 v-html 的潜在 XSS 漏洞',
  recommendation: '使用 v-text 或在使用 v-html 之前正确清理输入',
  patterns: [
    {
      key: 'v-html-usage',
      pattern: /v-html\s*=\s*["']([^"']+)["']/,
      message: '通过 v-html 指令的潜在 XSS 漏洞'
    }
  ]
};
```

2. 为每个规则包含测试用例
3. 记录漏洞类型和修复方法
4. 考虑误报并添加置信度评分

### 错误处理

始终优雅地处理错误：

```javascript
try {
  const result = await performScan();
  return result;
} catch (error) {
  logger.error('扫描失败', { error: error.message, stack: error.stack });
  throw new SecurityScanError('扫描失败', { cause: error });
}
```

## 测试

### 测试结构

```
tests/
├── unit/              # 单元测试
├── integration/       # 集成测试
├── e2e/              # 端到端测试
└── fixtures/         # 测试夹具
```

### 编写测试

使用 Jest 或 Mocha 进行测试：

```javascript
describe('XSS 检测', () => {
  it('应该检测通过 v-html 的 XSS', () => {
    const code = '<div v-html="userInput"></div>';
    const result = detectXSS(code);
    expect(result.vulnerabilities).toHaveLength(1);
    expect(result.vulnerabilities[0].ruleId).toBe('vue:xss-v-html');
  });

  it('不应标记安全的 v-text 使用', () => {
    const code = '<div v-text="sanitizedInput"></div>';
    const result = detectXSS(code);
    expect(result.vulnerabilities).toHaveLength(0);
  });
});
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- tests/unit/xss-detection.test.js

# 以监视模式运行测试
npm test -- --watch

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

### 测试覆盖率

目标至少 80% 的代码覆盖率。检查覆盖率报告：

```bash
npm test -- --coverage
```

## 构建

### 开发构建

```bash
npm run build:dev
```

### 生产构建

```bash
npm run build
```

### 构建输出

构建过程创建：
- `dist/` 中的编译 JavaScript
- 优化的包
- 源映射（在开发中）

## 调试

### 使用 VSCode 调试器

1. 创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "调试扫描器",
      "program": "${workspaceFolder}/bin/vue-security-scanner.js",
      "args": ["${workspaceFolder}/example-vue-app"],
      "console": "integratedTerminal"
    }
  ]
}
```

2. 在代码中设置断点
3. 按 F5 开始调试

### 日志记录

使用内置记录器：

```javascript
const logger = require('./src/utils/logger');

logger.debug('调试消息', { data });
logger.info('信息消息');
logger.warn('警告消息');
logger.error('错误消息', { error });
```

### 调试模式

在调试模式下运行扫描器：

```bash
vue-security-scanner . --debug
```

## 性能优化

### 性能分析

使用 Node.js 性能分析器：

```bash
node --prof bin/vue-security-scanner.js .
node --prof-process isolate-*.log > profile.txt
```

### 内存优化

- 对大文件使用流
- 实现适当的垃圾回收
- 缓存频繁使用的数据
- 使用工作线程进行并行处理

### 代码优化

- 最小化正则表达式复杂性
- 使用高效的数据结构
- 避免不必要的对象创建
- 在适当的地方实现延迟加载

## 文档

### 代码文档

为所有公共 API 添加 JSDoc 注释：

```javascript
/**
 * 扫描项目是否存在安全漏洞
 * @param {string} projectPath - 项目路径
 * @param {Object} options - 扫描选项
 * @param {string[]} [options.rules] - 要启用的规则
 * @param {string} [options.output] - 输出格式
 * @returns {Promise<Object>} 扫描结果
 */
async function scanProject(projectPath, options = {}) {
  // 实现
}
```

### 用户文档

更新 `docs/` 目录中的文档：

- `docs/en/` - 英文文档
- `docs/zh/` - 中文文档

### API 文档

保持 `docs/en/api/index.md` 和 `docs/zh/api/index.md` 中的 API 文档最新。

## 贡献

### 贡献前

1. 阅读 [贡献指南](./CONTRIBUTING.md)
2. 检查现有问题和拉取请求
3. 首先在问题中讨论您的更改

### Pull Request 流程

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 为新功能添加测试
5. 确保所有测试通过
6. 更新文档
7. 提交拉取请求

### 代码审查指南

- 保持拉取请求专注且小
- 解决所有审查评论
- 更新测试和文档
- 确保 CI/CD 通过

### 发布流程

发布由维护者管理：

1. 更新 `package.json` 中的版本
2. 更新 `CHANGELOG.md`
3. 创建 git 标签
4. 发布到 npm
5. 创建 GitHub 发布

## 其他资源

- [贡献指南](./CONTRIBUTING.md)
- [API 参考](./api/index.md)
- [配置指南](./configuration.md)
- [功能指南](./features.md)
- [FAQ](./FAQ.md)

---

如有问题或需要支持，请在 GitHub 上打开问题。
