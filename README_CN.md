# Vue 安全扫描工具

一个全面的、模块化的Vue.js项目安全扫描工具，用于识别潜在的安全漏洞和安全问题。

## 🚀 功能特性

### 核心安全功能

- **高级语义分析（新）**：基于AST的代码分析，提升检测准确性
  - 通过代码上下文理解减少误报
  - 支持 JavaScript、TypeScript、JSX 和 TSX 语法
  - 检测带有用户输入跟踪的危险函数调用
  - 识别不安全的属性访问模式
  - 提供置信度评估（高/中/低）
  - 与基于正则表达式的检测智能合并

- **增强的依赖安全（新）**：全面的依赖漏洞扫描
  - 集成 npm audit 实现实时漏洞检测
  - 内置常见软件包的已知漏洞数据库
  - 过时依赖项检测
  - 许可证合规性检查
  - 漏洞缓存以优化性能
  - 支持传递性依赖分析

- **高级报告功能（新）**：企业级报告能力
  - 基于历史数据对比的趋势分析
  - 合规性报告（OWASP、GDPR、HIPAA、PCI-DSS、SOX）
  - 漏洞分布分析
  - CWE 和 OWASP Top 10 映射
  - 修复复杂度评估
  - 基于优先级的建议
  - 带有可视化仪表板的交互式 HTML 报告

- **CI/CD 集成（新）**：与主要 CI/CD 平台无缝集成
  - GitHub Actions 工作流，支持 PR 评论
  - GitLab CI/CD 流水线，支持 MR 检查
  - Jenkins 声明式流水线
  - Azure DevOps、Bitbucket、CircleCI、Travis CI 支持
  - 自动化安全门禁和构建阻断
  - 定时安全扫描

- **XSS检测**：识别潜在的跨站脚本漏洞
  - 检查不安全的 `v-html` 使用
  - 检测内联事件处理器
  - 查找潜在的模板注入点
  - 识别不安全的路由参数使用
  - 检测基于DOM的XSS模式
  
- **依赖安全**：分析依赖项中的已知漏洞
  - 检查过时或受损的软件包
  - 识别已弃用的依赖项
  - 标记有安全公告的软件包
  - 检查 package.json 中的 Vue 特定配置
  
- **配置安全**：审查配置文件中的安全配置错误
  - 检测硬编码的密钥
  - 查找不安全的 CORS 策略
  - 识别 Vue 特定的配置错误
  - 检查缺失的安全头部（X-Frame-Options、X-XSS-Protection、HSTS、CSP）
  
- **输入验证**：检查适当的输入验证
  - 识别表单输入 (v-model) 上缺少的验证
  - 标记潜在的开放重定向漏洞
  
- **代码质量安全**：审查代码中的安全问题
  - 检测危险的 eval 使用
  - 查找潜在的原型污染
  - 识别不安全的动态导入
  - 检测URL中敏感数据的暴露
  - 识别弱随机数生成
  
- **Vue特定安全检查**：针对Vue.js特性的全面安全分析
  - **模板安全**：检查v-html、v-text、v-bind及其他指令的安全使用
  - **路由安全**：验证Vue Router使用、守卫和参数处理
  - **状态管理安全**：审查Vuex和Pinia存储实现
  - **组件安全**：检查组件通信和生命周期钩子
  - **自定义指令**：审查自定义指令实现以防止DOM操作漏洞
  - **插槽安全**：验证作用域插槽和插槽内容处理
  - **组合式API安全**：检查ref、reactive、computed、watch和provide/inject的安全使用
  - **动态组件**：验证组件加载和渲染模式
  
- **VSCode 集成**：与 VSCode 完全集成，提供实时安全反馈
- **Vite 插件**：与 Vite 构建过程集成，提供编译时安全扫描
- **Webpack 插件**：与 Webpack 构建系统集成，进行全面的安全扫描
- **Nuxt.js 模块**：专为 Nuxt.js 应用设计的模块，支持 SSR 和静态生成
- **AI 辅助安全 (MCP)**：Vue 安全 MCP (多模态协同工具)，用于 AI 辅助开发期间的实时安全扫描
  - 在使用 AI 生成 Vue 代码时提供实时安全反馈
  - 与流行的 AI 编程助手集成
  - 配置支持，可自定义安全扫描行为
  - 多种报告格式（JSON、文本、HTML）
  - 批量处理多个代码片段的能力
  - 大规模扫描的内存优化
  - 命令行界面，便于集成到开发工作流程中
- **Docker 集成**：容器化扫描环境，确保安全检查的一致性
- **Jenkins 插件**：深度集成 Jenkins CI/CD 平台，实现自动化安全扫描
- **Trae CN 集成（新）**：与 Trae CN 无缝集成，实现自动化漏洞报告和跟踪
  - 自动将漏洞报告到 Trae CN 平台
  - 实时推送扫描结果以实现即时可见性
  - 为高严重性漏洞创建工单
  - 跨多个项目进行项目级漏洞跟踪
  - 完整的 REST API 集成，支持重试逻辑和错误处理
  - 支持漏洞过滤和查询

- **TypeScript 支持**：全面的 TypeScript 文件安全分析，包括类型断言、泛型问题和装饰器漏洞

- **分布式扫描（新）**：企业级分布式扫描，适用于大规模项目
  - 多个 Worker 并行处理，加快扫描速度
  - 可扩展架构，支持 10,000+ 文件
  - 实时进度监控和任务分发
  - 自动重试和容错机制
  - 多个 Worker 的结果聚合
  - 支持本地和远程 Worker

- **可视化仪表板（新）**：实时安全监控仪表板
  - 交互式 Web 仪表板，实时显示统计数据
  - 漏洞趋势图表（30天历史）
  - 严重程度分布可视化
  - 扫描结果管理和历史记录
  - RESTful API 用于集成
  - 项目级安全跟踪

## 📦 安装

### 命令行工具
```bash
# 全局安装
npm install -g vue-security-scanner

# 或直接运行，无需安装
npx vue-security-scanner [项目路径]
```

### VSCode 插件
1. 下载插件包 (.vsix 文件)
2. 在 VSCode 中，按 `Ctrl+Shift+P` (Mac 上为 `Cmd+Shift+P`)
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的 .vsix 文件

或者在发布后直接从 VSCode 商店安装。

## 🌐 生态系统与环境集成

Vue 安全扫描工具提供了一个全面的工具生态系统，可与不同的开发和部署环境无缝集成：

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

### Trae CN 集成（新）
与 Trae CN 无缝集成，实现自动化漏洞报告和跟踪：

- **自动漏洞报告**：自动将检测到的漏洞报告到 Trae CN
- **实时扫描结果**：实时推送扫描结果到 Trae CN
- **工单创建**：为高严重性漏洞创建工单
- **项目跟踪**：跨多个项目跟踪漏洞
- **API 集成**：完整的 REST API 集成，支持重试逻辑和错误处理

配置示例：
```javascript
// Vite
vueSecurity({
  enableTraeCN: true,
  traeCNApiKey: 'your-api-key',
  traeCNProjectId: 'your-project-id',
  traeCNAutoReport: true,
  traeCNRealtimePush: true
})

// Webpack
new VueSecurityWebpackPlugin({
  enableTraeCN: true,
  traeCNApiKey: 'your-api-key',
  traeCNProjectId: 'your-project-id',
  traeCNAutoReport: true,
  traeCNRealtimePush: true
})

// Nuxt
export default defineNuxtConfig({
  modules: ['nuxt-module-vue-security'],
  vueSecurity: {
    enableTraeCN: true,
    traeCNApiKey: 'your-api-key',
    traeCNProjectId: 'your-project-id',
    traeCNAutoReport: true,
    traeCNRealtimePush: true
  }
})
```

### CI/CD 集成（新）
Vue 安全扫描工具为主要 CI/CD 平台提供全面的集成：

- **GitHub Actions**：自动安全扫描，支持 PR 评论和定时扫描
- **GitLab CI/CD**：多阶段流水线，支持 MR 安全检查
- **Jenkins**：声明式流水线，支持 HTML 报告发布
- **Azure DevOps**：基于 YAML 的流水线，支持工件发布
- **Bitbucket Pipelines**：基于容器的安全扫描
- **CircleCI**：多版本 Node.js 测试
- **Travis CI**：自动安全检查

详细的集成指南，请参阅 [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md)。

每个集成都利用相同的核心安全扫描引擎，并支持：
- 用于自定义安全检查的规则引擎
- 类似于 `.gitignore` 的灵活忽略规则
- 全面的漏洞检测
- 详细的报告功能
- 带有趋势和合规性分析的高级报告
- 自动化安全门禁和构建阻断

## 🔧 使用方法

### 命令行界面
```bash
# 扫描当前目录
vue-security-scanner .

# 扫描特定项目
vue-security-scanner /path/to/vue-project

# 生成详细报告
vue-security-scanner . --report security-report.json

# 使用自定义配置
vue-security-scanner . --config my-config.json

# 扫描并指定输出格式
vue-security-scanner . --output json

# 详细级别扫描
vue-security-scanner . --level detailed

# 使用自定义批次大小（用于大型项目）
vue-security-scanner . --batch-size 10 --memory-threshold 80

# 使用自动垃圾回收
vue-security-scanner . --gc-interval 5

# 启用高级报告，包含趋势和合规性分析（新）
vue-security-scanner . --advanced-report --output json --report security-report.json

# 启用语义分析以提升准确性（新）
vue-security-scanner . --config config-with-semantic-analysis.json
```

### 分布式扫描（新）
对于大规模项目，使用分布式扫描在多个 Worker 之间分配工作：

```bash
# 启动分布式 Worker
vue-security-distributed worker --port 3001 --worker-id worker-1

# 创建 Worker 配置文件 (workers.json)
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

# 运行分布式扫描
vue-security-distributed scan /path/to/vue-project \
  --workers workers.json \
  --batch-size 10 \
  --output json \
  --report distributed-scan.json \
  --save-results
```

### 可视化仪表板（新）
启动基于 Web 的仪表板进行实时安全监控：

```bash
# 启动仪表板服务器
npm run dashboard

# 或直接运行
node dashboard/server.js
```

然后在浏览器中打开 `http://localhost:3000` 查看：
- 实时漏洞统计
- 30天漏洞趋势
- 严重程度分布图表
- 最近扫描历史
- 项目级安全跟踪

**仪表板 API 端点：**
- `GET /api/health` - 检查 API 健康状态
- `GET /api/scans` - 列出所有扫描
- `GET /api/scans/:scanId` - 获取特定扫描详情
- `POST /api/scans` - 触发新扫描
- `GET /api/stats` - 获取漏洞统计
- `GET /api/trend?days=30` - 获取漏洞趋势
- `GET /api/projects` - 列出项目
- `DELETE /api/scans/:scanId` - 删除扫描

有关分布式扫描和仪表板功能的详细信息，请参阅 [DISTRIBUTED_SCANNING.md](./DISTRIBUTED_SCANNING.md) 和 [DASHBOARD.md](./DASHBOARD.md)。

#### 规则引擎
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

有关创建自定义规则的详细信息，请参阅 [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) 和 [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md)。

#### 忽略规则
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

### VSCode 插件
安装后，插件提供：

- **上下文菜单选项**：右键点击 Vue 文件或文件夹进行扫描
- **集成面板**：在专用面板中查看安全报告
- **实时诊断**：在编辑器中直接查看安全警告
- **快速操作**：从命令面板访问安全命令
- **自动检测**：自动检测 Vue 项目并建议扫描

可用命令：
- `Vue Security: Scan Current Project`（Vue 安全：扫描当前项目）- 扫描整个工作区的安全问题
- `Vue Security: Scan Current File`（Vue 安全：扫描当前文件）- 扫描当前打开的 Vue 文件
- `Vue Security: Show Security Report`（Vue 安全：显示安全报告）- 打开安全报告面板
- `Vue Security: Configure Settings`（Vue 安全：配置设置）- 打开扩展设置

#### 配置选项
插件提供了多个可在 VSCode 设置中配置的选项：

- `vueSecurityScanner.enableOnOpen`: 在打开 Vue 文件时启用安全扫描（默认值：false）
- `vueSecurityScanner.scanOnSave`: 在保存 Vue 文件时扫描（默认值：false）
- `vueSecurityScanner.maxFileSize`: 要扫描的最大文件大小（MB）（默认值：10）
- `vueSecurityScanner.ignoredFolders`: 扫描期间忽略的文件夹（默认值：["node_modules", "dist", "build", ".git"]）
- `vueSecurityScanner.reportOutputPath`: 保存安全报告的路径（默认值："./security-report.html"）

这些可以在 VSCode 的 `settings.json` 文件中配置：

```json
{
  "vueSecurityScanner.enableOnOpen": false,
  "vueSecurityScanner.scanOnSave": true,
  "vueSecurityScanner.maxFileSize": 10,
  "vueSecurityScanner.ignoredFolders": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ],
  "vueSecurityScanner.reportOutputPath": "./security-report.html"
}
```

## ⚙️ 配置

创建 `vue-security-config.json` 文件来自定义扫描行为：

```json
{
  "rules": {
    "xss": { "enabled": true },
    "dependencies": { "enabled": true },
    "configSecurity": { "enabled": true }
  },
  "scan": {
    "maxSize": 10,
    "ignorePatterns": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ]
  },
  "output": {
    "showProgress": true,
    "format": "json",
    "reportPath": "./security-report.json",
    "advancedReport": false, // 启用高级报告（趋势、合规性）
    "showDetails": true,
    "maxIssuesToShow": 100
  },
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true, // 启用 AST 语义分析（新）
    "enableNpmAudit": true, // 启用 npm audit 集成（新）
    "enableVulnerabilityDB": true // 启用漏洞数据库（新）
  },
  "reportHistory": {
    "enabled": true, // 启用历史数据用于趋势分析（新）
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true, // 启用合规性检查（新）
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

## 🏢 企业功能

### 规则引擎
该工具包含强大的规则引擎，允许企业：

- **灵活扩展**：通过创建规则配置文件来添加自定义安全检测规则
- **精确控制**：通过多种配置方式控制扫描行为
- **个性化定制**：根据项目需求开启或关闭特定检测项
- **智能忽略**：使用类似 `.gitignore` 的机制忽略特定文件、目录或漏洞类型
- **扩展安全检查**：为组织创建特定的安全规则
- **合规要求**：实施监管合规检查 (SOX, GDPR, HIPAA)
- **自定义威胁模型**：定义组织特定的威胁模式
- **集成能力**：连接现有的安全基础设施

规则引擎包含 220+ 条安全检查，涵盖常见漏洞，如XSS、SQL注入、CSRF、HTTP头注入、不安全Cookie配置、内存泄漏、硬编码密钥和第三方库漏洞。

每项安全检查都实现为规则配置，使系统高度模块化和可定制。用户可以通过简单的配置格式创建自己的安全检测规则。

#### 内置安全规则
Vue 安全扫描工具包含 220+ 条内置安全规则：

##### 核心安全规则（200条）
- **XSS检测**：针对Vue模板和JavaScript代码的高级跨站脚本检测
- **CSRF检测**：识别HTTP请求中潜在的跨站请求伪造漏洞
- **硬编码密钥**：增强的敏感信息检测，包括密码、令牌和API密钥
- **SQL注入**：扫描数据库查询中的潜在SQL注入漏洞
- **HTTP头注入**：检测潜在的HTTP头注入漏洞
- **不安全Cookie配置**：检查Cookie设置中缺失的安全属性
- **内存泄漏检测**：识别Vue组件中的潜在内存泄漏模式
- **Vue特定安全**：全面的Vue.js安全检查，包括过滤器、混入、$refs、组合式API、动态组件、路由安全、状态管理、自定义指令和插槽
- **高级Web安全**（24条规则）：
  - DOM Clobbering
  - SVG XSS
  - PostMessage XSS
  - Worker XSS
  - SSR注入
  - 水合不匹配
  - JWT算法混淆
  - 会话固定
  - 权限提升
  - 不安全密码存储
  - OAuth流程漏洞
  - NoSQL注入
  - GraphQL注入
  - LDAP注入
  - 命令注入
  - 路径遍历
  - 不安全文件上传
  - 文件包含
  - WebSocket安全
  - 不安全HTTP方法
  - 社会工程学
  - 恶意文件上传
  - WebAssembly安全
  - WebRTC安全
  - CSP绕过
  - 网络钓鱼
  - 点击劫持
  - UI重定向
  - 标签劫持
  - Cookie炸弹
  - CSRF令牌绕过
  - 会话劫持
  - 主机头注入
  - HTTP参数污染
  - HTTP响应拆分
- **新增安全规则**（51条）：
  - **依赖安全**（10条规则）：
    - 过时软件包版本检测
    - 已知漏洞检测
    - 不再维护的软件包识别
    - 大型软件包大小警告
    - 已弃用软件包检测
    - 不安全协议使用
    - Git依赖风险
    - 本地依赖问题
    - 缺失对等依赖
    - 生产环境中的开发依赖
  - **环境变量安全**（5条规则）：
    - 环境文件暴露检测
    - 环境变量中的敏感数据
    - 客户端环境变量暴露
    - 敏感变量的默认值
    - 环境变量日志记录
  - **认证和授权安全**（10条规则）：
    - 弱密码检测
    - 不安全哈希算法
    - 缺失认证检查
    - 硬编码凭据
    - 会话固定漏洞
    - 弱令牌生成
    - 缺失登出功能
    - 暴力破解漏洞
    - 权限绕过风险
    - JWT安全问题
    - OAuth安全问题
  - **文件上传安全**（10条规则）：
    - 文件上传无验证
    - 路径遍历漏洞
    - 可执行文件上传
    - 恶意文件检测
    - Webshell检测
    - 大小限制违规
    - 不安全存储位置
    - 文件名验证问题
    - 扩展名验证问题
    - MIME类型验证缺口
    - 病毒扫描要求
  - **API安全**（16条规则）：
    - 不安全HTTP使用
    - API密钥暴露
    - 缺失认证
    - 不安全SSL/TLS配置
    - 速率限制问题
    - 输入验证缺口
    - 错误处理问题
    - CORS配置错误
    - API版本问题
    - 分页漏洞
    - GraphQL注入风险
    - Webhook安全问题
    - 缓存控制问题
    - 幂等性问题

#### 自定义规则开发

用户可以轻松创建自定义安全检测规则。详细开发指南请参阅 [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) 和 [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md)。

基本规则模板：

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

#### 规则结构
每项安全检测规则都是配置对象，具有以下结构：

```javascript
{
  id: 'rule-id',                    // 唯一标识符
  name: 'Rule Name',                // 规则名称
  severity: 'High',                 // 严重性：High/Medium/Low
  description: 'Description',        // 规则描述
  recommendation: 'Fix advice',     // 修复建议
  patterns: [                       // 检测模式
    {
      key: 'pattern-key',           // 模式键（用于缓存）
      pattern: 'regex-pattern',     // 正则表达式模式
      flags: 'gi'                   // 可选：正则标志
    }
  ]
}
```


### 企业配置选项
- 高级威胁检测模型
- 合规报告格式
- 自定义严重性阈值
- 与 SIEM 系统集成
- 自动警报功能

## 🛠️ 开发

### 项目设置
```bash
# 克隆仓库
git clone <repository-url>
cd vue-security-scanner

# 安装依赖
npm install

# 运行扫描器
node bin/vue-security-scanner.js [项目路径]
```

### 创建自定义规则
1. 在 `src/rules/` 目录中创建新的 JavaScript 文件
2. 将规则定义为配置对象
3. 导出规则数组
4. 在 `src/rules/security-rules.js` 中导入并合并规则

示例规则文件：
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

然后在 `src/rules/security-rules.js` 中导入：
```javascript
const myCustomRules = require('./my-custom-rules');

const securityRules = [
  // ... 现有规则
  ...myCustomRules
];
```

更多详细信息，请参阅 [RULE_EXTENSION_GUIDE.md](./RULE_EXTENSION_GUIDE.md) 和 [QUICKSTART_CUSTOM_RULES.md](./QUICKSTART_CUSTOM_RULES.md)。

## 🧪 测试示例与漏洞覆盖

Vue 安全扫描工具包含全面的测试示例，涵盖41个测试文件中的1000+个漏洞场景：

### 新增安全规则测试示例（5个文件，51条规则）
- **new-rules-dependency-security.json**：依赖安全测试示例，包含易受攻击的软件包
- **new-rules-env-security.js**：环境变量安全测试示例，包含不安全模式
- **new-rules-auth-security.js**：认证和授权安全测试示例
- **new-rules-file-upload-security.js**：文件上传安全测试示例
- **new-rules-api-security.js**：API安全测试示例

### Vue特定安全示例（9个文件，510个示例）
- **vue-xss-vulnerabilities.js**（50个示例）：Vue模板、指令和组件中的XSS漏洞
- **vue-composition-api.js**（50个示例）：Vue 3 Composition API安全问题（ref、reactive、computed、watch、provide/inject）
- **vue-directive-security.js**（50个示例）：Vue指令安全漏洞（v-html、v-text、v-bind、v-on、v-model等）
- **vue-router-security.js**（50个示例）：路由安全问题，包括参数注入、开放重定向和守卫绕过
- **vue-lifecycle-security.js**（50个示例）：Vue生命周期钩子中的内存泄漏和安全问题
- **vue-reactive-security.js**（60个示例）：Vue响应式系统安全漏洞
- **vue-component-security.js**（50个示例）：组件安全问题，包括动态组件、插槽和provide/inject
- **vue-configuration-security.js**（100个示例）：Vue 2/3配置安全问题
- **vue-dependency-vulnerabilities.js**（100个示例）：Vue生态系统依赖中的已知漏洞

### 通用安全示例（20个文件，490个示例）
- **api-security.js**（30个示例）：API安全漏洞
- **authentication-authorization.js**（40个示例）：认证和授权问题
- **session-management.js**（40个示例）：会话管理漏洞
- **data-encryption.js**（50个示例）：数据加密安全问题
- **logging-security.js**（50个示例）：日志安全漏洞
- **error-handling.js**（50个示例）：错误处理安全问题
- **file-operations.js**（40个示例）：文件操作安全漏洞
- **network-requests.js**（50个示例）：网络请求安全问题
- **jwt-security.js**（40个示例）：JWT安全漏洞
- **permission-management.js**（50个示例）：权限管理安全问题
- **csrf-vulnerabilities.js**（10个示例）：CSRF攻击场景
- **http-header-injection.js**（15个示例）：HTTP头注入漏洞
- **cookie-security.js**（20个示例）：Cookie安全配置问题
- **memory-leaks.js**（20个示例）：内存泄漏模式
- **dependency-vulnerabilities.js**（20个示例）：依赖漏洞示例
- **input-validation.js**（20个示例）：输入验证漏洞
- **sensitive-data-exposure.js**（25个示例）：敏感数据暴露场景
- **weak-random-number.js**（25个示例）：弱随机数生成
- **dynamic-import-security.js**（15个示例）：动态导入安全问题
- **prototype-pollution.js**（15个示例）：原型污染漏洞

### 原始测试文件（7个文件，123个示例）
- **vue23-security-issues.vue**：Vue 2/3特定安全问题
- **vulnerable-component.vue**：易受攻击的Vue组件示例
- **additional-vue-security-issues.vue**：额外的Vue安全问题
- **typescript-security-issues.ts**：TypeScript安全漏洞
- **advanced-vulnerabilities.js**：高级安全漏洞模式
- **basic-vulnerabilities.js**：基本安全漏洞示例
- **xss-vulnerabilities.js**：XSS漏洞示例

### 总覆盖情况
- **测试文件**：41个文件
- **漏洞示例**：1000+个示例
- **安全规则**：220+条规则
- **Vue特定覆盖率**：95%+
- **通用安全覆盖率**：90%+

## 📊 输出格式

扫描器可以多种格式输出结果：
- **JSON**：详细的结构化数据，用于与其他工具集成
- **控制台**：人类可读的输出，用于快速分析
- **HTML**：格式化的报告，用于与利益相关者共享
- **合规性**：符合企业标准的格式

## 🛡️ 安全覆盖

该工具解决了OWASP Top 10和其他安全标准：
- 注入漏洞
- 破解的身份验证
- 敏感数据暴露
- XML外部实体 (XXE)
- 安全配置错误
- 易受攻击的组件
- 日志记录和监控不足

## Vue 特性验证

我们的扫描器提供对Vue.js特性的全面验证：

### Vue 2/3 组件系统
- **组件定义安全**：验证组件选项的安全问题
- **Props 验证**：检查 props 定义和使用的安全性
- **事件系统安全**：验证事件发射和监听的安全性
- **生命周期钩子安全**：检查生命周期钩子中的安全问题

### Vue 模板系统
- **指令安全**：验证Vue指令的安全使用
  - `v-html` - 检查潜在的XSS问题
  - `v-text` - 验证文本绑定安全
  - `v-bind` - 确保属性绑定安全
  - `v-for` - 验证循环源的安全性
  - 自定义指令 - 审查实现安全性

### Vue 响应式系统
- **数据绑定安全**：检查双向绑定 (v-model) 的安全性
- **计算属性安全**：验证计算属性的依赖关系和输出
- **观察器安全**：检查观察器实现的安全性

### Vue 2 特性
- **选项 API 安全**：检查 data、methods、computed、watch 选项的安全性
- **过滤器安全**：验证过滤器实现
- **混入安全**：检查混入使用的安全性
- **插件系统安全**：验证 Vue.use() 和插件安全性

### Vue 3 特性
- **组合式 API 安全**：
  - `ref()` - 验证响应式引用使用
  - `reactive()` - 确保响应式对象安全
  - `computed()` - 检查计算属性安全
  - `watch()` 和 `watchEffect()` - 检查观察器安全
  - `provide/inject` - 验证依赖注入安全
- **Teleport 安全**：验证 Teleport 目标元素安全
- **Suspense 安全**：检查异步组件处理安全

### Vue 路由安全
- **路由定义安全**：检查路由配置安全
- **路由参数安全**：验证路由参数使用
- **路由守卫安全**：检查 beforeEach、beforeResolve、afterEach 实现
- **动态路由安全**：检测动态路由添加安全

### 状态管理安全
- **Vuex 安全**：验证 store、mutations、actions、getters 安全性
- **Pinia 安全**：验证 stores 定义和使用的安全性
- **动态模块安全**：检查动态模块注册安全

### 其他Vue特定安全检查
- **原型污染防护**：检测不安全的 `__proto__` 和 `constructor.prototype` 使用
- **XSS防护**：专门针对Vue的XSS预防机制的向量
- **动态组件安全**：验证 `:is` 属性和动态组件加载
- **插槽安全**：检查插槽和作用域插槽使用安全
- **TypeScript集成**：验证类型定义和断言的安全性

## 🆕 新功能 (v1.2.1+)

### 1. 高级语义分析
扫描器现在包含基于AST的代码分析，显著提升检测准确性：

**主要优势：**
- **减少误报**：理解代码上下文而不仅仅是模式匹配
- **用户输入跟踪**：识别危险函数何时接收用户输入
- **置信度评分**：为每个发现提供高/中/低置信度级别
- **智能合并**：智能合并正则表达式和AST分析结果

**支持的功能：**
- 危险函数调用检测（eval、Function、setTimeout等）
- 不安全属性访问检测（innerHTML、__proto__等）
- JSX元素安全分析
- 赋值表达式安全检查
- 变量声明敏感数据检测
- 对象属性安全分析

**使用方法：**
```json
{
  "performance": {
    "enableSemanticAnalysis": true
  }
}
```

### 2. 增强的依赖安全
全面的依赖漏洞扫描，具有多个数据源：

**功能：**
- **npm audit 集成**：使用npm官方审计进行实时漏洞检测
- **内置漏洞数据库**：10+常见软件包的已知漏洞
- **过时依赖检测**：识别需要更新的软件包
- **许可证合规性**：检查有问题的许可证（GPL、AGPL等）
- **漏洞缓存**：1小时TTL以优化性能

**支持的软件包：**
- lodash、axios、node-fetch、moment、ejs、handlebars
- webpack、jquery、express、vuex等

**使用方法：**
```json
{
  "performance": {
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  }
}
```

### 3. 高级报告功能
企业级报告，具有全面分析：

**功能：**
- **趋势分析**：历史数据对比和漏洞趋势
- **合规性报告**：OWASP、GDPR、HIPAA、PCI-DSS、SOX合规性
- **漏洞分布**：按类型、严重程度和文件分析
- **CWE映射**：通用弱点枚举参考
- **OWASP Top 10映射**：OWASP 2021分类
- **修复复杂度评估**：低/中/高复杂度评级
- **优先级建议**：基于严重程度的可操作建议

**HTML报告：**
- 带有可视化指示器的交互式仪表板
- 彩色编码的严重程度级别
- 合规性状态卡片
- 趋势指示器（增加/减少/稳定）
- 适用于所有设备的响应式设计

**使用方法：**
```bash
vue-security-scanner . --advanced-report --output html --report security-report.html
```

**配置：**
```json
{
  "output": {
    "advancedReport": true,
    "reportPath": "security-report.html"
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  }
}
```

### 4. CI/CD 集成
与主要CI/CD平台无缝集成：

**支持的平台：**
- **GitHub Actions**：支持PR评论和定时扫描的工作流
- **GitLab CI/CD**：支持MR检查的多阶段流水线
- **Jenkins**：支持HTML报告发布的声明式流水线
- **Azure DevOps**：支持工件发布的基于YAML的流水线
- **Bitbucket Pipelines**：基于容器的安全扫描
- **CircleCI**：多版本Node.js测试
- **Travis CI**：自动安全检查

**功能：**
- 自动化安全门禁
- 关键漏洞时阻断构建
- PR/MR评论包含扫描结果
- 定时每日扫描
- 工件上传和保留
- 多版本测试

**快速开始：**
```yaml
# GitHub Actions
- name: 运行安全扫描
  run: |
    vue-security-scanner . \
      --output json \
      --report security-report.json \
      --level detailed \
      --advanced-report
```

详细的集成指南，请参阅 [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md)。

## 🤝 贡献

欢迎贡献！请参阅我们的贡献指南，了解如何：
- 提交错误报告
- 提出新功能
- 贡献代码
- 改进文档

## 📄 许可证

该项目根据MIT许可证授权 - 详见LICENSE文件。

## 🆘 支持

如需支持，请在GitHub仓库中开一个问题或联系维护者。

---

用心 ❤️ 为Vue.js社区打造