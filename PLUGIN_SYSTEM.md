# 插件系统说明

## 概述

Vue Security Scanner 采用插件化架构，允许用户创建自定义安全检测规则。每个检测项都是一个独立的插件，用户可以根据需要添加或移除。

## 插件结构

每个插件应该导出一个具有以下结构的对象：

```javascript
class MySecurityPlugin {
  constructor() {
    this.name = 'My Security Plugin';           // 插件名称
    this.description = 'My security checks';    // 插件描述
    this.version = '1.0.0';                    // 插件版本
    this.enabled = true;                       // 是否启用
    this.severity = 'High';                    // 默认严重性
  }

  /**
   * 分析文件内容
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 实现安全检测逻辑
    // ...
    
    return vulnerabilities;
  }

  /**
   * 获取行号（可选辅助方法）
   * @param {string} content - 文件内容
   * @param {number} index - 字符索引
   * @returns {number} - 行号
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = new MySecurityPlugin();
```

## 漏洞对象结构

每个检测到的漏洞应该是一个对象，包含以下属性：

```javascript
{
  id: 'unique-vulnerability-id',              // 唯一ID
  type: 'Vulnerability Type',                 // 漏洞类型
  severity: 'High/Medium/Low',               // 严重性
  file: '/path/to/file',                      // 文件路径
  line: 1,                                   // 行号
  description: 'Description of vulnerability',// 描述
  codeSnippet: 'Problematic code',            // 有问题的代码片段
  recommendation: 'How to fix it',            // 修复建议
  plugin: 'Plugin Name'                       // 来源插件
}
```

## 忽略规则

可以通过 `.vue-security-ignore` 文件忽略特定文件或检测项：

```
# 忽略特定目录
node_modules/
dist/
build/

# 忽略特定文件模式
**/example-vue-app/**
**/vue-security-scanner-vscode/**

# 忽略特定漏洞类型
type:deprecated

# 忽略特定插件的检测结果
plugin:Hardcoded Secrets

# 忽略特定严重级别的漏洞
severity:low
```

## 创建自定义插件

1. 在 `plugins/` 目录下创建一个新的 `.js` 文件
2. 实现 `analyze(filePath, content)` 方法
3. 返回检测到的漏洞数组
4. 插件将自动被加载和执行

插件系统提供了极大的灵活性，允许用户根据特定需求定制安全检测规则。