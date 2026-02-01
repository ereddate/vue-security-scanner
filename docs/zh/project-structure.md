# 项目结构指南

本指南解释了 Vue Security Scanner 项目的目录结构和组织。

## 概述

了解项目结构对于以下方面至关重要：
- 为代码库做出贡献
- 使用自定义规则扩展扫描器
- 与其他工具和框架集成
- 调试和解决问题

## 根目录结构

```
vue-security-scanner/
├── .github/                # GitHub 工作流和配置
├── .vue-security-data/     # 扫描器数据存储
├── bin/                    # CLI 可执行文件
├── config/                 # 配置文件
├── dashboard/              # 安全仪表板
├── docker/                 # Docker 配置
├── docs/                   # 文档
│   ├── en/                 # 英文文档
│   └── zh/                 # 中文文档
├── examples/               # 示例文件和配置
├── jenkins-plugin-vue-security/  # Jenkins 插件
├── mcp/                    # MCP 集成
├── nuxt-module-vue-security/     # Nuxt 模块
├── src/                    # 源代码
├── taro-plugin-vue-security/     # Taro 插件
├── tests/                  # 测试文件
├── .gitignore              # Git 忽略规则
├── .gitlab-ci.yml          # GitLab CI 配置
├── .npmignore              # npm 忽略规则
├── Jenkinsfile             # Jenkins 管道配置
├── LICENSE                 # 许可证文件
├── README.md               # 主 README
├── README_CN.md            # 中文 README
├── package.json            # npm 包配置
└── security-report.json    # 示例安全报告
```

## 关键目录

### bin/

包含 CLI 可执行文件：

- `vue-security-scanner.js`：主扫描器可执行文件
- `vue-security-distributed.js`：分布式扫描可执行文件

### config/

不同环境的配置文件：

- `enterprise-config.json`：企业版配置

### dashboard/

安全仪表板实现：

- `public/`：仪表板前端文件
- `server.js`：仪表板后端服务器

### docker/

Docker 相关文件：

- `Dockerfile`：Docker 镜像定义
- `README.md`：Docker 使用文档
- `docker-compose.yml`：Docker Compose 配置

### docs/

综合文档：

- `en/`：英文文档
- `zh/`：中文文档
- 特定主题的子目录（api、compliance、performance、rules、threat-intelligence）

### examples/

示例文件和配置：

- `.vue-security-ignore.example`：示例忽略文件

### jenkins-plugin-vue-security/

Vue Security Scanner 的 Jenkins 插件：

- `src/`：插件源代码
- `README.md`：插件文档
- `pom.xml`：Maven 配置

### mcp/

MCP（模块控制平面）集成：

- 各种 MCP 相关文件和示例

### nuxt-module-vue-security/

Vue Security Scanner 的 Nuxt.js 模块：

- `index.js`：模块实现
- `README.md`：模块文档
- `package.json`：模块配置

### src/

主要源代码目录：

- `analysis/`：代码分析工具
- `checks/`：安全检查实现
- `config/`：默认配置
- `core/`：核心扫描器功能
- `distributed/`：分布式扫描实现
- `integration/`：第三方集成
- `reporting/`：报告生成工具
- `rules/`：安全规则实现
- `threat-intelligence/`：威胁情报集成
- `utils/`：实用函数
- `scanner.js`：主扫描器模块

### taro-plugin-vue-security/

Vue Security Scanner 的 Taro 插件：

- `index.js`：插件实现
- `README.md`：插件文档
- `package.json`：插件配置

### tests/

测试文件和测试数据：

- 各种不同漏洞类型的测试文件
- 测试配置和示例

## 源代码结构

### src/analysis/

代码分析工具：

- `ast-analyzer.js`：抽象语法树分析器
- `dast-scanner.js`：动态应用安全测试
- `dependency-scanner.js`：依赖漏洞扫描器

### src/checks/

安全检查实现：

- `security-checks.js`：核心安全检查

### src/config/

默认配置：

- `default-config.json`：默认扫描器配置

### src/core/

核心扫描器功能：

- `vulnerability-detector.js`：漏洞检测引擎

### src/distributed/

分布式扫描实现：

- `distributed-scanner.js`：分布式扫描协调器
- `result-aggregator.js`：来自多个工作节点的结果聚合
- `task-distributor.js`：任务分配给工作节点

### src/integration/

第三方集成：

- `trae-cn-integration.js`：Trae CN 集成

### src/reporting/

报告生成工具：

- `advanced-report-generator.js`：高级报告生成器
- `china-compliance-report-generator.js`：中国合规报告生成器
- `enhanced-compliance-report-generator.js`：增强合规报告生成器

### src/rules/

安全规则实现：

- `modules/`：按安全类别组织的规则模块
- `custom-rules.js`：自定义规则支持
- `enhanced-rule-engine.js`：增强规则引擎
- `parallel-rule-engine.js`：并行规则执行引擎
- `regex-optimizer.js`：正则表达式优化器
- `rule-engine.js`：核心规则引擎
- `rule-optimizer.js`：规则优化工具
- `security-rules.js`：主要安全规则集合

### src/threat-intelligence/

威胁情报集成：

- `threat-intelligence-integration.js`：威胁情报集成模块

### src/utils/

实用函数：

- `error-handler.js`：错误处理工具
- `helpers.js`：通用辅助函数
- `ignore-manager.js`：忽略规则管理
- `performance-optimizer.js`：性能优化工具
- `user-experience-optimizer.js`：用户体验优化

## 插件结构

### Jenkins 插件

```
jenkins-plugin-vue-security/
├── src/                    # 源代码
├── README.md               # 文档
└── pom.xml                 # Maven 配置
```

### Nuxt 模块

```
nuxt-module-vue-security/
├── index.js                # 模块实现
├── README.md               # 文档
└── package.json            # npm 配置
```

### Taro 插件

```
taro-plugin-vue-security/
├── index.js                # 插件实现
├── README.md               # 文档
└── package.json            # npm 配置
```

## Docker 结构

```
docker/
├── Dockerfile              # Docker 镜像定义
├── README.md               # 文档
└── docker-compose.yml      # Docker Compose 配置
```

## 仪表板结构

```
dashboard/
├── public/                 # 前端文件
│   └── index.html          # 仪表板 HTML
└── server.js               # 后端服务器
```

## 文档结构

### 英文文档

```
docs/en/
├── api/                    # API 文档
├── compliance/             # 合规文档
├── performance/            # 性能文档
├── rules/                  # 规则文档
├── threat-intelligence/    # 威胁情报文档
├── CONTRIBUTING.md         # 贡献指南
├── FAQ.md                  # 常见问题
├── changelog.md            # 更新日志
├── ci-cd-integration.md    # CI/CD 集成
├── configuration.md        # 配置指南
├── dashboard.md            # 仪表板指南
├── development.md          # 开发指南
├── distributed-scanning.md # 分布式扫描指南
├── ecosystem.md            # 生态系统集成
├── features.md             # 功能文档
├── ignore-guide.md         # 忽略规则指南
├── installation.md         # 安装指南
├── memory-optimization.md  # 内存优化
├── quickstart.md           # 快速开始指南
├── release-notes.md        # 发布说明
├── security-coverage.md    # 安全覆盖
├── testing.md              # 测试指南
├── usage.md                # 使用指南
└── vue-features.md         # Vue 功能支持
```

### 中文文档

```
docs/zh/
├── api/                    # API 文档
├── compliance/             # 合规文档
├── performance/            # 性能文档
├── rules/                  # 规则文档
├── threat-intelligence/    # 威胁情报文档
├── CONTRIBUTING.md         # 贡献指南
├── FAQ.md                  # 常见问题
├── configuration.md        # 配置指南
├── development.md          # 开发指南
├── ecosystem.md            # 生态系统集成
├── features.md             # 功能文档
├── installation.md         # 安装指南
├── quickstart.md           # 快速开始指南
├── release-notes.md        # 发布说明
├── security-coverage.md    # 安全覆盖
├── testing.md              # 测试指南
├── usage.md                # 使用指南
└── vue-features.md         # Vue 功能支持
```

## 配置文件

### package.json

主 package.json 文件包含：
- 项目元数据
- 依赖管理
- 开发和测试脚本
- CLI 配置

### 配置文件

- `config/enterprise-config.json`：企业特定配置
- `.vue-security-data/index.json`：扫描器数据和状态

## 测试结构

tests 目录包含：
- 各种不同漏洞类型的测试文件
- 测试数据和示例
- 合规测试数据

## 项目结构最佳实践

### 对于贡献者

1. **遵循现有模式**：与现有代码库保持一致
2. **按功能组织**：将相关代码分组在一起
3. **使用清晰的命名约定**：为文件和目录选择描述性名称
4. **记录新增内容**：为任何新功能更新文档
5. **彻底测试**：为新功能添加测试

### 对于扩展者

1. **使用插件架构**：创建插件而不是修改核心代码
2. **遵循 API 契约**：遵守已建立的插件 API
3. **记录扩展**：为您的扩展提供清晰的文档
4. **测试兼容性**：确保与不同扫描器版本的兼容性
5. **遵循安全最佳实践**：在您的扩展中维护安全性

## 故障排除

### 查找文件

使用以下命令查找文件：

```bash
# 按名称查找文件
find . -name "*.js" | grep "rule"

# 按内容查找文件
grep -r "vulnerability" src/ --include="*.js"

# 列出目录结构
tree -L 2
```

### 理解模块关系

要了解模块如何交互：

1. **从主入口点开始**：`bin/vue-security-scanner.js`
2. **跟随导入链**：跟踪导入以了解依赖关系
3. **检查测试文件**：测试通常显示如何使用模块
4. **阅读文档**：文档解释模块用途

## 支持

关于项目结构的问题：

1. **检查文档**：本指南和其他文档文件
2. **打开问题**：在 GitHub 仓库中提问
3. **联系维护者**：获取企业支持