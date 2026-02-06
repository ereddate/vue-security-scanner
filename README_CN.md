# Vue 安全扫描工具

一个全面的、模块化的Vue.js项目安全扫描工具，用于识别潜在的安全漏洞和安全问题。

## 🚀 快速开始

### 安装

```bash
# 全局安装
npm install -g vue-security-scanner

# 或直接运行，无需安装
npx vue-security-scanner [项目路径]
```

### 基本使用

```bash
# 扫描当前目录
vue-security-scanner .

# 扫描并生成详细报告
vue-security-scanner . --level detailed

# 扫描并保存报告
vue-security-scanner . --output json --report security-report.json
```

## ✨ 核心功能

### 核心安全
- **100+ 安全规则**：全面覆盖包括 XSS、注入、身份验证等
- **高级语义分析**：基于 AST 的代码分析，具有用户输入跟踪
- **动态应用安全测试（DAST）**：运行时漏洞扫描
- **增强的依赖安全**：npm 审计集成，内置漏洞数据库
- **现代前端安全**：覆盖 Web Vitals、前端 AI/ML、CSS-in-JS、构建工具、测试、监控、缓存和性能安全威胁

### Vue 支持
- **Vue 2.x**：完全支持 Options API 和 Vue 2 功能
- **Vue 3.x**：完全支持 Composition API 和 Vue 3 功能
- **Vue 3.5+**：增强对 defineModel、defineAsyncComponent、v-memo、defineOptions 的支持
- **Vue 3.6+**：支持 Vapor 模式、toValue、toRef、effectScope 和最新优化
- **Vue 3.6+ API 安全**：全面的 Vue 3.6+ 新 API 安全规则，包括组件编译器、模板编译器和运行时编译器

### 企业级功能
- **分布式扫描**：支持 10,000+ 文件的可扩展架构
- **可视化仪表板**：带有实时统计数据的交互式 Web 仪表板
- **高级报告**：趋势分析、合规性报告、漏洞分布
- **Trae CN 集成**：自动化漏洞报告和跟踪

### 性能
- **性能配置文件**：快速、平衡和全面扫描模式
- **缓存系统**：全面缓存以提高性能
- **增量扫描**：仅扫描修改过的文件以加快后续扫描，支持文件元数据跟踪
- **并行处理**：自动 CPU 核心检测和最佳工作线程数，支持动态调整
- **GPU 加速**：GPU 加速的正则匹配，自动回退到 CPU，支持性能测试
- **动态负载均衡**：基于系统资源的自适应并发控制
- **动态内存管理**：自动内存限制调整、垃圾回收和批处理大小优化
- **细粒度控制**：用于性能调优的细粒度配置选项，支持资源监控
- **智能漏洞分析**：漏洞的风险评分和关联分析
- **规则扩展 API**：用于自定义安全规则的灵活 API
- **异步信号量**：带超时处理的智能并发控制
- **模块延迟加载**：按需加载模块以减少内存占用
- **文件类型分析器**：智能文件类型检测和安全相关性评分

### 合规性
- **中国特定标准**：GB/T 系列、网络安全法、数据安全法、个人信息保护法、密码法
- **OWASP Top 10 2021**：全面覆盖 OWASP Top 10
- **CWE 映射**：通用弱点枚举参考
- **多种报告格式**：JSON、HTML、Text、XML、SARIF

### 集成
- **VSCode 插件**：编辑器中的实时安全反馈
- **Vite 插件**：编译时安全扫描
- **Webpack 插件**：构建时安全扫描
- **Nuxt.js 模块**：SSR 和静态生成支持
- **Docker 集成**：容器化扫描环境
- **Jenkins 插件**：CI/CD 自动化
- **CI/CD 平台**：GitHub Actions、GitLab CI/CD、Azure DevOps、Bitbucket Pipelines、CircleCI、Travis CI

### 跨框架支持
- **uni-app**：uni-app 项目的安全分析
- **Taro**：Taro 框架的安全分析
- **微信小程序**：微信小程序代码的安全扫描
- **百度智能小程序**：百度智能小程序的安全扫描
- **字节跳动小程序**：字节跳动小程序的安全扫描
- **QQ 小程序**：QQ 小程序的安全扫描

### 威胁情报
- **CNCERT/CC**：访问 CNCERT/CC 威胁情报
- **CNNVD**：访问 CNNVD 漏洞数据库
- **CNVD**：访问 CNVD 漏洞数据库
- **NVD**：访问 NIST 国家漏洞数据库
- **CVE**：访问 CVE 漏洞数据库
- **OWASP**：访问 OWASP 威胁情报

### AI 辅助安全
- **Vue Security MCP**：AI 辅助开发期间的实时安全反馈
- **AI 编码助手集成**：与流行 AI 编码助手集成
- **批处理**：多个代码片段的批处理功能
- **内存优化**：大规模扫描的内存优化

## 📚 文档

全面的文档帮助您快速上手并充分利用 Vue 安全扫描工具：

### 快速开始
- **[安装指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/installation.md)** - 系统要求、安装方法和配置
- **[使用教程](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/usage.md)** - 命令行选项、扫描模式和高级功能

### 核心功能
- **[规则文档](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/rules/index.md)** - 所有安全规则模块的完整参考
- **[API 参考](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/api/index.md)** - 扫描器集成的编程接口
- **[性能优化](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/performance/index.md)** - 性能调优和最佳实践

### 高级功能
- **[配置指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/configuration.md)** - 配置选项和自定义
- **[生态系统集成](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/ecosystem.md)** - 与各种工具和平台的集成
- **[功能特性详解](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/features.md)** - 详细的功能描述和特性
- **[Vue 特性指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/vue-features.md)** - Vue 特定的安全功能和覆盖范围
- **[安全覆盖](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/security-coverage.md)** - 全面的安全漏洞覆盖

### 开发与测试
- **[开发指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/development.md)** - 开发设置和贡献指南
- **[测试指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/testing.md)** - 测试策略和示例

### 合规性与威胁情报
- **[合规性指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/compliance/index.md)** - 合规性要求和报告（中国法律、GB/T 标准等）
- **[威胁情报集成](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/threat-intelligence/index.md)** - 威胁情报源和配置

### 社区
- **[贡献指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/CONTRIBUTING.md)** - 如何为项目做出贡献
- **[常见问题](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/FAQ.md)** - 常见问题和故障排除
- **[发布说明](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/release-notes.md)** - 版本历史和更新日志

## 🌐 生态系统与环境集成

### Vite 插件
```bash
npm install --save-dev vite-plugin-vue-security
```

### Webpack 插件
```bash
npm install --save-dev webpack-plugin-vue-security
```

### Nuxt.js 模块
```bash
npm install --save-dev @vue-security/nuxt
```

### Docker 集成
```bash
# 构建并运行扫描容器
docker build -t vue-security-scanner .
docker run -v $(pwd):/workspace/project vue-security-scanner /workspace/project --level detailed
```

### Jenkins 插件
通过 Jenkins 插件管理器安装或手动部署 `.hpi` 文件。

### Trae CN 集成
与 Trae CN 无缝集成，实现自动化漏洞报告和跟踪：

```javascript
// Vite
vueSecurity({
  enableTraeCN: true,
  traeCNApiKey: 'your-api-key',
  traeCNProjectId: 'your-project-id',
  traeCNAutoReport: true,
  traeCNRealtimePush: true
})
```

### VSCode 插件
1. 下载插件包 (.vsix 文件)
2. 在 VSCode 中，按 `Ctrl+Shift+P` (Mac 上为 `Cmd+Shift+P`)
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的 .vsix 文件

## 🏢 企业级功能

### 分布式扫描
对于大规模项目，使用分布式扫描在多个 Worker 之间分配工作：

```bash
# 启动分布式 Worker
vue-security-distributed worker --port 3001 --worker-id worker-1

# 运行分布式扫描
vue-security-distributed scan /path/to/vue-project \
  --workers workers.json \
  --batch-size 10 \
  --output json \
  --report distributed-scan.json \
  --save-results
```

### 可视化仪表板
启动基于 Web 的仪表板进行实时安全监控：

```bash
# 启动仪表板服务器
npm run dashboard

# 或使用 vue-security-distributed 命令
vue-security-distributed dashboard

# 使用自定义端口
vue-security-distributed dashboard --port 8080
```

然后在浏览器中打开 `http://localhost:3000`（或自定义端口）查看：
- 实时漏洞统计
- 30天漏洞趋势
- 严重程度分布图表
- 最近扫描历史
- 项目级安全跟踪

有关分布式扫描和仪表板功能的详细信息，请参阅 [分布式扫描指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/distributed-scanning.md) 和 [仪表板指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/dashboard.md)。

### 规则引擎
扫描器使用强大的规则引擎进行安全检测。您可以通过创建自定义规则文件来扩展安全规则：

```javascript
// src/rules/my-custom-rules.js
const myCustomRules = [
  {
    id: 'my-rule',
    name: 'My Security Rule',
    severity: 'High',
    description: 'Detects my security issue',
    recommendation: 'Fix recommendation',
    patterns: [
      { key: 'my-pattern', pattern: 'your-regex-pattern' }
    ]
  }
];

module.exports = myCustomRules;
```

有关创建自定义规则的详细信息，请参阅 [规则扩展指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/rule-extension-guide.md) 和 [自定义规则快速开始](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/quickstart-custom-rules.md)。

### 忽略规则
在项目根目录创建 `.vue-security-ignore` 文件以忽略特定文件、目录或漏洞：

```bash
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

# 按严重级别忽略
severity:low
```

更多忽略方案和详细说明，请参阅 [忽略规则指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/ignore-guide.md)

## ⚙️ 配置

创建 `vue-security-scanner.config.json` 文件来自定义扫描行为：

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
    "enableVulnerabilityDB": true
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

有关详细的配置选项，请参阅 [配置指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/configuration.md)。

## 🛠️ 开发

### 项目设置
```bash
# 克隆仓库
git clone <repository-url>
cd vue-security-scanner

# 安装依赖
npm install

# 运行扫描器（启用垃圾回收）
node --expose-gc bin/vue-security-scanner.js [项目路径]

# 使用脚本运行
npm start [项目路径]
npm run scan [项目路径]
npm run scan-with-gc [项目路径]
```

### 分布式扫描
```bash
# 启动分布式 Worker
npm run distributed:worker

# 运行分布式扫描
npm run distributed:scan [项目路径]
```

### 仪表板
```bash
# 启动可视化仪表板
npm run dashboard
```

### GPU 测试
```bash
# 测试 GPU 加速
npm run test:gpu

# 运行 GPU 演示
npm run demo:gpu
```

有关详细的开发信息，请参阅 [开发指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/development.md)。

## 📊 输出格式

扫描器可以多种格式输出结果：
- **JSON**：详细的结构化数据，用于与其他工具集成
- **控制台**：人类可读的输出，用于快速分析
- **HTML**：格式化的报告，用于与利益相关者共享
- **Text**：纯文本格式，用于简单报告
- **XML**：结构化的 XML 格式，用于集成
- **SARIF**：静态分析结果交换格式，用于工具集成

## 🧪 测试示例与漏洞覆盖

Vue 安全扫描工具包含全面的测试示例，涵盖 41 个测试文件中的 1000+ 个漏洞场景：

### 测试覆盖
- **测试文件**：41 个文件
- **漏洞示例**：1000+ 个示例
- **安全规则**：319+ 条规则
- **Vue 特定覆盖率**：95%+
- **通用安全覆盖率**：90%+

有关详细的测试示例和漏洞覆盖，请参阅 [测试指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/testing.md) 和 [安全覆盖](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/security-coverage.md)。

## 🛡️ 安全覆盖

该工具解决了 OWASP Top 10 和其他安全标准：
- 注入漏洞
- 破解的身份验证
- 敏感数据暴露
- XML 外部实体 (XXE)
- 安全配置错误
- 易受攻击的组件
- 日志记录和监控不足

有关全面的安全覆盖信息，请参阅 [安全覆盖指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/security-coverage.md)。

## Vue 特性验证

我们的扫描器提供对 Vue.js 特性的全面验证：

### Vue 2/3 组件系统
- 组件定义安全
- Props 验证
- 事件系统安全
- 生命周期钩子安全

### Vue 模板系统
- 指令安全（v-html、v-text、v-bind、v-for 等）
- 自定义指令安全

### Vue 响应式系统
- 数据绑定安全
- 计算属性安全
- 观察器安全

### Vue 2 特性
- 选项 API 安全
- 过滤器安全
- 混入安全
- 插件系统安全

### Vue 3 特性
- 组合式 API 安全（ref、reactive、computed、watch、provide/inject）
- Teleport 安全
- Suspense 安全

### Vue Router 安全
- 路由定义安全
- 路由参数安全
- 路由守卫安全
- 动态路由安全

### 状态管理安全
- Vuex 安全
- Pinia 安全
- 动态模块安全

有关详细的 Vue 特定安全信息，请参阅 [Vue 特性指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/vue-features.md)。

## 🆕 新功能

### 1. 高级语义分析
基于 AST 的代码分析，显著提升检测准确性：
- 减少误报
- 用户输入跟踪
- 置信度评分
- 智能合并

### 2. 增强的依赖安全
全面的依赖漏洞扫描：
- npm 审计集成
- 内置漏洞数据库
- 过时依赖检测
- 许可证合规性

### 3. 高级报告功能
企业级报告，具有全面分析：
- 趋势分析
- 合规性报告
- 漏洞分布
- CWE 映射
- OWASP Top 10 映射

### 4. CI/CD 集成
与主要 CI/CD 平台无缝集成：
- GitHub Actions
- GitLab CI/CD
- Jenkins
- Azure DevOps
- Bitbucket Pipelines
- CircleCI
- Travis CI

有关新功能的详细信息，请参阅 [功能特性详解](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/features.md) 和 [发布说明](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/release-notes.md)。

## 🤝 贡献

欢迎贡献！请参阅我们的 [贡献指南](https://github.com/ereddate/vue-security-scanner/blob/master/docs/zh/CONTRIBUTING.md)，了解如何：
- 提交错误报告
- 提出新功能
- 贡献代码
- 改进文档

## 📄 许可证

该项目根据 MIT 许可证授权 - 详见 LICENSE 文件。

## 🆘 支持

如需支持，请在 GitHub 仓库中开一个问题或联系维护者。

---

用心 ❤️ 为 Vue.js 社区打造
