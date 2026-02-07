# 漏洞数据库

## 📚 漏洞数据库概述

漏洞数据库是 Vue Security Scanner 安全知识库的核心组件，旨在提供全面的前端相关漏洞信息，帮助开发者和安全专家识别、理解和修复潜在的安全问题。

## 📁 目录结构

```
vulnerabilities/
├── vue/               # Vue 相关漏洞
│   ├── v2.x/          # Vue 2.x 漏洞
│   ├── v3.x/          # Vue 3.x 漏洞
│   ├── v3.6+/         # Vue 3.6+ 漏洞
│   ├── v3.7+/         # Vue 3.7+ 漏洞
│   ├── ecosystem/     # Vue 生态系统漏洞
│   └── CVE-Index.md   # CVE 索引
├── react/             # React 相关漏洞
│   ├── v16.x/         # React 16.x 漏洞
│   ├── v17.x/         # React 17.x 漏洞
│   ├── v18.x/         # React 18.x 漏洞
│   ├── ecosystem/     # React 生态系统漏洞
│   └── CVE-Index.md   # CVE 索引
├── angular/           # Angular 相关漏洞
│   ├── v10.x/         # Angular 10.x 漏洞
│   ├── v11.x/         # Angular 11.x 漏洞
│   ├── v12.x/         # Angular 12.x 漏洞
│   ├── v13.x/         # Angular 13.x 漏洞
│   ├── v14.x/         # Angular 14.x 漏洞
│   ├── ecosystem/     # Angular 生态系统漏洞
│   └── CVE-Index.md   # CVE 索引
├── nodejs/            # Node.js 相关漏洞
│   ├── v12.x/         # Node.js 12.x 漏洞
│   ├── v14.x/         # Node.js 14.x 漏洞
│   ├── v16.x/         # Node.js 16.x 漏洞
│   ├── v18.x/         # Node.js 18.x 漏洞
│   ├── v20.x/         # Node.js 20.x 漏洞
│   └── CVE-Index.md   # CVE 索引
└── general/           # 通用前端漏洞
    ├── xss/           # 跨站脚本漏洞
    ├── csrf/          # 跨站请求伪造漏洞
    ├── injection/     # 注入漏洞
    ├── DoS/           # 拒绝服务漏洞
    ├── supply-chain/  # 供应链漏洞
    └── CVE-Index.md   # CVE 索引
```

## 📄 漏洞记录格式

每个漏洞记录应包含以下信息：

```markdown
# [CVE-ID] 漏洞名称

## 📋 漏洞信息

- **漏洞类型**：[类型]（如 XSS、CSRF、注入等）
- **影响版本**：[版本范围]（如 Vue 2.6.0 - 2.6.14）
- **严重性**：[严重/高/中/低]
- **CVSS 评分**：[评分]
- **发布日期**：[YYYY-MM-DD]
- **更新日期**：[YYYY-MM-DD]

## 🎯 漏洞描述

[详细描述漏洞的技术细节和影响]

## 🔍 漏洞检测

### 代码示例

```javascript
// 漏洞代码示例
```

### 检测方法

[如何检测此漏洞]

## 🛠️ 修复方案

### 推荐修复

```javascript
// 修复后的代码
```

### 临时缓解措施

[临时缓解措施]

## 📚 参考资料

- [参考链接 1]
- [参考链接 2]
```

## 🚀 如何使用

1. **按技术栈查找**：根据您使用的技术栈导航到相应目录
2. **按版本查找**：根据技术的版本导航到相应子目录
3. **按类型查找**：根据漏洞类型导航到相应子目录
4. **使用 CVE 索引**：通过 `CVE-Index.md` 快速查找特定 CVE
5. **查看修复方案**：每个漏洞记录都包含详细的修复建议

## 🤝 贡献指南

我们欢迎社区贡献来丰富这个漏洞数据库：

1. **添加新漏洞**：按照标准格式添加新的漏洞记录
2. **更新现有漏洞**：提供最新的修复信息和缓解措施
3. **添加检测方法**：分享有效的漏洞检测技术
4. **翻译漏洞信息**：将漏洞信息翻译成其他语言
5. **维护 CVE 索引**：确保 CVE 索引的完整性和准确性

## 📞 联系方式

如有问题或建议，请通过以下方式联系我们：
- GitHub Issues: https://github.com/ereddate/vue-security-scanner/issues
- Gitee Issues: https://gitee.com/ereddate2017/vue-security-scanner/issues