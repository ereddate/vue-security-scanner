# Vue Security Scanner - 插件化架构与灵活配置系统

## 架构概述

Vue Security Scanner 采用了高度模块化的插件化架构，使用户能够：

- **灵活扩展**：通过创建新的插件来添加自定义安全检测规则
- **精确控制**：通过多种配置方式控制扫描行为
- **个性化定制**：根据项目需求开启或关闭特定检测项

## 核心功能

### 1. 插件化检测项

每个安全检测项都被实现为一个独立的插件，具有以下特点：

- **模块化**：每个检测项独立开发、测试和维护
- **标准化**：遵循统一的插件接口规范
- **可扩展**：用户可以轻松创建自己的检测插件

### 2. 灵活的忽略规则

系统实现了类似 .gitignore 的功能，允许用户：

- **文件/目录忽略**：忽略特定的文件或目录
- **漏洞类型忽略**：忽略特定类型的漏洞
- **插件忽略**：禁用特定插件的检测结果
- **严重性忽略**：忽略特定严重性的漏洞

### 3. 多层次配置系统

支持多层级的配置方式：

- **命令行参数**：临时覆盖默认设置
- **配置文件**：项目级别的持久化配置
- **忽略文件**：灵活的忽略规则管理

## 使用指南

### 创建自定义插件

在 `plugins/` 目录下创建新的 JavaScript 文件：

```javascript
class MySecurityPlugin {
  constructor() {
    this.name = 'My Security Plugin';
    this.description = 'My custom security checks';
    this.version = '1.0.0';
    this.enabled = true;
    this.severity = 'High';
  }

  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 实现安全检测逻辑
    if (content.includes('potential-risk-pattern')) {
      vulnerabilities.push({
        id: 'my-custom-issue-' + Date.now(),
        type: 'Custom Security Issue',
        severity: this.severity,
        file: filePath,
        line: 1,
        description: 'Custom issue description',
        codeSnippet: 'Risk code snippet',
        recommendation: 'How to fix it',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

module.exports = new MySecurityPlugin();
```

### 配置忽略规则

创建 `.vue-security-ignore` 文件：

```
# 忽略特定目录
node_modules/
dist/
build/

# 忽略特定文件模式
**/example-vue-app/**

# 忽略特定漏洞类型
type:deprecated

# 忽略特定插件
plugin:UnwantedPlugin

# 忽略特定严重级别
severity:low
```

### 高级配置

使用 `vue-security-scanner.config.json` 进行详细配置：

```json
{
  "rules": {
    "xss": { 
      "enabled": true,
      "severity": "high",
      "options": {
        "checkVHtml": true,
        "checkTemplateInterpolation": true
      }
    }
  },
  "scan": {
    "maxSize": 10,
    "maxDepth": 10,
    "ignoreDirs": ["node_modules", "dist"],
    "ignorePatterns": ["**/*.min.js"]
  }
}
```

## 优势

1. **高度可扩展**：新检测项可通过插件形式轻松添加
2. **灵活控制**：用户可根据需要定制扫描范围和规则
3. **易于维护**：模块化设计便于单独维护各组件
4. **性能优化**：可忽略不必要的文件和检测项，提高扫描效率
5. **适应性强**：适用于不同类型和规模的 Vue.js 项目

这种架构使得 Vue Security Scanner 成为一个真正灵活、可扩展的安全检测工具，能够满足不同组织和项目的特定需求。