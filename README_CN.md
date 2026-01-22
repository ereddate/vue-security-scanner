# Vue 安全扫描工具

一个全面的、模块化的Vue.js项目安全扫描工具，用于识别潜在的安全漏洞和安全问题。

## 🚀 功能特性

- **XSS检测**：识别潜在的跨站脚本漏洞
  - 检查不安全的 `v-html` 使用
  - 检测内联事件处理器
  - 查找潜在的模板注入点
  - 识别不安全的路由参数使用
  
- **依赖安全**：分析依赖项中的已知漏洞
  - 检查过时或受损的软件包
  - 识别已弃用的依赖项
  - 标记有安全公告的软件包
  - 检查 package.json 中的 Vue 特定配置
  
- **配置安全**：审查配置文件中的安全配置错误
  - 检测硬编码的密钥
  - 查找不安全的 CORS 策略
  - 识别 Vue 特定的配置错误
  
- **输入验证**：检查适当的输入验证
  - 识别表单输入 (v-model) 上缺少的验证
  - 标记潜在的开放重定向漏洞
  
- **代码质量安全**：审查代码中的安全问题
  - 检测危险的 eval 使用
  - 查找潜在的原型污染
  - 识别不安全的动态导入

- **VSCode 集成**：与 VSCode 完全集成，提供实时安全反馈

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
- `vueSecurityScanner.scanOnSave`: 在保存 Vue 文件时扫描（默认值：true）
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
    "reportPath": "./security-report.json"
  },
  "plugins": {
    "enabled": true,
    "directory": "./plugins",
    "settings": {
      "sql-injection-plugin": {
        "enabled": true,
        "severityThreshold": "High"
      }
    }
  }
}
```

## 🏢 企业功能

### 插件系统
该工具包含强大的插件系统，允许企业：

- **扩展安全检查**：为组织创建特定的安全规则
- **合规要求**：实施监管合规检查 (SOX, GDPR, HIPAA)
- **自定义威胁模型**：定义组织特定的威胁模式
- **集成能力**：连接现有的安全基础设施

### 企业配置选项
- 高级威胁检测模型
- 合规报告格式
- 自定义严重性阈值
- 与 SIEM 系统集成
- 自动警报功能

### 可用的企业插件
- **SQL注入检测插件**：扫描潜在的SQL注入漏洞
- **敏感数据泄漏插件**：识别硬编码凭据和敏感信息
- **第三方库安全插件**：检查依赖项中的已知漏洞
- **自定义企业规则模板**：开发组织特定规则的基础模板

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

### 创建自定义插件
1. 在 `plugins/` 目录中创建新的 JavaScript 文件
2. 实现所需的接口，包含 `analyze(filePath, content)` 方法
3. 导出插件对象
4. 将插件放在插件目录中时会自动加载

示例插件：
```javascript
class CustomSecurityPlugin {
  constructor() {
    this.name = 'Custom Security Plugin';
    this.description = 'Custom security checks for specific requirements';
    this.version = '1.0.0';
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 在此处实现您的安全检查
    if (content.includes('dangerous-pattern')) {
      vulnerabilities.push({
        id: 'custom-issue-1',
        type: 'Custom Security Issue',
        severity: 'High',
        file: filePath,
        line: 1, // 计算实际行号
        description: '问题描述',
        codeSnippet: '有问题的代码',
        recommendation: '如何修复',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

module.exports = new CustomSecurityPlugin();
```

## 📊 输出格式

扫描器可以多种格式输出结果：
- **JSON**：详细的结构化数据，用于与其他工具集成
- **控制台**：人类可读的输出，用于快速分析
- **HTML**：格式化的报告，用于与利益相关者共享
- **合规性**：符合企业标准的格式

## 🔒 安全覆盖

该工具解决了OWASP Top 10和其他安全标准：
- 注入缺陷
- 破解的身份验证
- 敏感数据暴露
- XML外部实体 (XXE)
- 安全配置错误
- 易受攻击的组件
- 日志记录和监控不足

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