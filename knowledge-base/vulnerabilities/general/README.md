# 通用前端漏洞数据库

## 📚 概述

本目录包含通用的前端安全漏洞信息，这些漏洞可能影响多种前端技术和框架。

## 📁 目录结构

```
general/
├── xss/            # 跨站脚本漏洞
│   ├── stored/     # 存储型 XSS
│   ├── reflected/  # 反射型 XSS
│   ├── dom-based/  # DOM 型 XSS
│   └── other/      # 其他 XSS 漏洞
├── csrf/           # 跨站请求伪造漏洞
│   ├── basic/      # 基本 CSRF
│   ├── token/      # 令牌相关 CSRF
│   └── other/      # 其他 CSRF 漏洞
├── injection/      # 注入漏洞
│   ├── sql/        # SQL 注入
│   ├── no-sql/     # NoSQL 注入
│   ├── command/    # 命令注入
│   └── other/      # 其他注入漏洞
├── DoS/            # 拒绝服务漏洞
│   ├── resource/   # 资源耗尽 DoS
│   ├── algorithmic/ # 算法 DoS
│   └── other/      # 其他 DoS 漏洞
├── supply-chain/   # 供应链漏洞
│   ├── npm/        # npm 包漏洞
│   ├── cdn/        # CDN 漏洞
│   ├── build/      # 构建过程漏洞
│   └── other/      # 其他供应链漏洞
└── CVE-Index.md    # CVE 索引
```

## 📄 漏洞记录格式

每个漏洞记录应包含以下信息：

```markdown
# [CVE-ID] 漏洞名称

## 📋 漏洞信息

- **漏洞类型**：[类型]（如 XSS、CSRF、注入等）
- **影响范围**：[受影响的技术或框架]
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

1. **按类型查找**：根据漏洞类型导航到相应目录
2. **按子类型查找**：根据漏洞子类型导航到相应子目录
3. **使用 CVE 索引**：通过 `CVE-Index.md` 快速查找特定 CVE
4. **查看修复方案**：每个漏洞记录都包含详细的修复建议

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