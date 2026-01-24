# Vue Security Scanner - 项目结构说明

## 项目概述
这是一个专门用于扫描Vue.js项目安全漏洞的静态分析工具。它能够检测多种常见的安全问题，包括XSS、硬编码密钥、依赖漏洞等。

## 目录结构
```
vue-security-scanner/
├── bin/
│   └── vue-security-scanner.js          # CLI入口文件
├── src/
│   ├── scanner.js                       # 主扫描器逻辑
│   ├── checks/
│   │   └── security-checks.js           # 安全检查规则
│   └── utils/
│       └── helpers.js                   # 辅助函数
├── tests/                               # 测试文件
│   ├── vulnerable-component.vue         # 包含漏洞的Vue组件
│   ├── more-vulnerabilities.js          # 更多漏洞示例
│   └── advanced-vulnerabilities.js      # 高级漏洞示例
├── example-vue-app/                     # 示例Vue应用
│   ├── package.json                     # 示例项目的依赖配置
│   └── src/
│       └── HomeView.vue                 # 示例Vue组件
├── package.json                         # 项目配置
├── README.md                            # 项目说明文档
└── USAGE_EXAMPLES.md                    # 使用示例文档
```

## 核心功能模块

### 1. CLI入口 (bin/vue-security-scanner.js)
- 命令行参数解析
- 输出格式化
- 结果报告生成

### 2. 主扫描器 (src/scanner.js)
- 文件发现和遍历
- 扫描流程控制
- 结果汇总

### 3. 安全检查规则 (src/checks/security-checks.js)
- XSS漏洞检测
- 依赖安全检查
- 配置安全检查
- 输入验证检查
- 路由安全检查

## 检测的安全漏洞类型

### 高危漏洞 (High Severity)
- XSS漏洞（通过v-html、模板插值等）
- 硬编码敏感信息（API密钥、密码、令牌等）
- 不安全的eval使用
- 不安全的路由参数使用
- 已知存在漏洞的依赖包

### 中危漏洞 (Medium Severity)
- 内联事件处理器
- 过时的依赖包
- 缺少输入验证
- 潜在的开放重定向漏洞

### 低危漏洞 (Low Severity)
- Vue配置不当（productionTip、performance等）
- 弃用的依赖包

## 使用方法

### 1. 基础扫描
```bash
node bin/vue-security-scanner.js [项目路径]
```

### 2. 输出格式
- 文本格式（默认）：人类可读的输出
- JSON格式：程序可解析的输出
- HTML格式：带样式的报告

### 3. 保存报告
```bash
node bin/vue-security-scanner.js [项目路径] -o html -r report.html
```

## 扩展性设计

该工具采用模块化设计，可以轻松添加新的安全检查规则：
1. 在`security-checks.js`中添加新的检查函数
2. 在主扫描器中调用新的检查函数
3. 更新文档说明

## 集成建议

推荐将此工具集成到CI/CD流水线中，在每次代码提交时自动进行安全扫描，以尽早发现潜在的安全问题。