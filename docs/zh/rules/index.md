# Vue Security Scanner 规则文档

## 规则模块概述

Vue Security Scanner 包含以下规则模块：

| 模块名称 | 描述 | 适用场景 | 严重性 |
|---------|------|---------|--------|
| `vue` | Vue 核心安全规则 | Vue 项目 | 高 |
| `javascript` | JavaScript 安全规则 | 所有项目 | 高 |
| `china-security` | 中国安全标准规则 | 中国境内项目 | 高 |
| `china-api-security` | 中国 API 安全规则 | 使用国内 API 的项目 | 中 |
| `dependency` | 依赖项安全规则 | 所有项目 | 高 |

## 1. Vue 核心规则

### 1.1 模板安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-v-html` | 禁止使用 v-html 指令 | 高 | 使用安全的模板渲染方式 |
| `no-dangerous-template` | 禁止危险的模板表达式 | 高 | 使用计算属性或方法代替 |
| `no-unsafe-computed` | 禁止不安全的计算属性 | 中 | 确保计算属性返回安全值 |
| `no-raw-html` | 禁止直接操作 innerHTML | 高 | 使用 Vue 的数据绑定 |

### 1.2 事件安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-eval` | 禁止使用 eval | 高 | 使用函数或其他安全方式 |
| `no-new-function` | 禁止使用 new Function | 高 | 使用常规函数定义 |
| `no-set-timeout-string` | 禁止 setTimeout 字符串参数 | 中 | 使用函数参数 |
| `no-set-interval-string` | 禁止 setInterval 字符串参数 | 中 | 使用函数参数 |

### 1.3 组件安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-unsafe-props` | 禁止不安全的组件属性 | 中 | 验证属性值 |
| `no-global-mutation` | 禁止全局对象修改 | 高 | 使用局部状态管理 |
| `no-direct-dom-access` | 禁止直接 DOM 操作 | 中 | 使用 Vue 的 ref 系统 |

### 1.4 路由安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-unsafe-route-params` | 禁止不安全的路由参数 | 中 | 验证路由参数 |
| `no-path-traversal` | 禁止路径遍历攻击 | 高 | 验证路径参数 |
| `no-open-redirect` | 禁止开放重定向 | 高 | 验证重定向目标 |

## 2. JavaScript 安全规则

### 2.1 代码注入

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-eval` | 禁止使用 eval | 高 | 使用函数或其他安全方式 |
| `no-new-function` | 禁止使用 new Function | 高 | 使用常规函数定义 |
| `no-unsafe-json-parse` | 禁止不安全的 JSON.parse | 中 | 使用 try-catch 包装 |
| `no-document-write` | 禁止使用 document.write | 高 | 使用 DOM 操作方法 |

### 2.2 XSS 防护

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-innerhtml` | 禁止使用 innerHTML | 高 | 使用 textContent 或安全渲染 |
| `no-outerhtml` | 禁止使用 outerHTML | 高 | 使用 DOM 操作方法 |
| `no-insertadjacenthtml` | 禁止使用 insertAdjacentHTML | 高 | 使用安全的 DOM 操作 |
| `no-unescaped-entities` | 禁止未转义的 HTML 实体 | 中 | 正确转义 HTML 实体 |

### 2.3 网络安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-http-urls` | 禁止使用 HTTP URL | 中 | 使用 HTTPS URL |
| `no-inline-scripts` | 禁止内联脚本 | 中 | 使用外部脚本文件 |
| `no-unsafe-fetch` | 禁止不安全的 fetch 请求 | 中 | 验证请求参数 |

### 2.4 数据安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `no-hardcoded-secrets` | 禁止硬编码密钥 | 高 | 使用环境变量或配置文件 |
| `no-unsafe-storage` | 禁止不安全的存储操作 | 中 | 加密敏感数据 |
| `no-console-log-secrets` | 禁止在控制台记录密钥 | 中 | 移除敏感信息的日志 |

## 3. 中国安全标准规则

### 3.1 GB/T 28448-2019 信息安全技术 网络安全等级保护测评要求

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `gb-t-28448-authentication` | 身份认证安全要求 | 高 | 实现强密码策略和多因素认证 |
| `gb-t-28448-access-control` | 访问控制安全要求 | 高 | 实现最小权限原则 |
| `gb-t-28448-cryptography` | 密码学应用安全要求 | 高 | 使用国家密码管理局认可的算法 |
| `gb-t-28448-audit` | 审计日志安全要求 | 中 | 实现完整的日志记录 |

### 3.2 GB/T 31168-2014 信息安全技术 云计算服务安全能力要求

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `gb-t-31168-isolation` | 云服务隔离安全要求 | 高 | 确保租户间隔离 |
| `gb-t-31168-data-protection` | 数据保护安全要求 | 高 | 实现数据加密和备份 |
| `gb-t-31168-monitoring` | 安全监控要求 | 中 | 实现实时安全监控 |

### 3.3 GB/T 35273-2020 信息安全技术 个人信息安全规范

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `gb-t-35273-consent` | 个人信息收集同意要求 | 高 | 实现明确的同意机制 |
| `gb-t-35273-minimization` | 最小必要原则要求 | 中 | 只收集必要的个人信息 |
| `gb-t-35273-retention` | 个人信息保存期限要求 | 中 | 明确数据保存期限 |

### 3.4 网络安全等级保护制度

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `等级保护-第一级` | 第一级安全要求 | 低 | 基本安全防护 |
| `等级保护-第二级` | 第二级安全要求 | 中 | 加强安全防护 |
| `等级保护-第三级` | 第三级安全要求 | 高 | 全面安全防护 |
| `等级保护-第四级` | 第四级安全要求 | 高 | 强化安全防护 |

### 3.5 国内框架安全

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `element-plus-security` | Element Plus 安全使用 | 中 | 遵循官方安全指南 |
| `ant-design-vue-security` | Ant Design Vue 安全使用 | 中 | 遵循官方安全指南 |
| `vue-element-admin-security` | Vue Element Admin 安全使用 | 中 | 遵循项目安全指南 |

## 4. 中国 API 安全规则

### 4.1 国内云服务提供商

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `aliyun-api-security` | 阿里云 API 安全使用 | 中 | 正确配置 API 密钥和权限 |
| `tencent-cloud-api-security` | 腾讯云 API 安全使用 | 中 | 正确配置 API 密钥和权限 |
| `huawei-cloud-api-security` | 华为云 API 安全使用 | 中 | 正确配置 API 密钥和权限 |
| `baidu-cloud-api-security` | 百度云 API 安全使用 | 中 | 正确配置 API 密钥和权限 |
| `jd-cloud-api-security` | 京东云 API 安全使用 | 中 | 正确配置 API 密钥和权限 |

### 4.2 国内支付服务

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `wechat-pay-api-security` | 微信支付 API 安全使用 | 高 | 正确验证签名和回调 |
| `alipay-api-security` | 支付宝 API 安全使用 | 高 | 正确验证签名和回调 |
| `unionpay-api-security` | 银联支付 API 安全使用 | 高 | 正确验证签名和回调 |

### 4.3 国内社交平台

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `wechat-api-security` | 微信 API 安全使用 | 中 | 正确配置和验证 |
| `weibo-api-security` | 微博 API 安全使用 | 中 | 正确配置和验证 |
| `qq-api-security` | QQ API 安全使用 | 中 | 正确配置和验证 |

### 4.4 国内地图服务

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `amap-api-security` | 高德地图 API 安全使用 | 低 | 正确配置 API 密钥 |
| `baidu-map-api-security` | 百度地图 API 安全使用 | 低 | 正确配置 API 密钥 |
| `tencent-map-api-security` | 腾讯地图 API 安全使用 | 低 | 正确配置 API 密钥 |

### 4.5 国内短信服务

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `aliyun-sms-api-security` | 阿里云短信 API 安全使用 | 中 | 防止短信轰炸 |
| `tencent-sms-api-security` | 腾讯云短信 API 安全使用 | 中 | 防止短信轰炸 |
| `huawei-sms-api-security` | 华为云短信 API 安全使用 | 中 | 防止短信轰炸 |

## 5. 依赖项安全规则

### 5.1 依赖项漏洞

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `dependency-vulnerabilities` | 依赖项漏洞检查 | 高 | 更新到安全版本 |
| `outdated-dependencies` | 过时依赖项检查 | 中 | 更新到最新版本 |
| `unsafe-dependency-versions` | 不安全的依赖项版本 | 中 | 使用固定版本或安全范围 |

### 5.2 依赖项许可证

| 规则名称 | 描述 | 严重性 | 修复建议 |
|---------|------|--------|--------|
| `license-compliance` | 许可证合规性检查 | 低 | 使用合规的许可证 |
| `restrictive-licenses` | 限制性许可证检查 | 低 | 避免使用限制性许可证 |

## 6. 规则配置

### 6.1 全局配置

在 `.vue-security-scanner.config.js` 中配置规则：

```javascript
module.exports = {
  rules: {
    // 启用的规则模块
    enabled: [
      'vue',
      'javascript',
      'china-security',
      'china-api-security',
      'dependency'
    ],
    
    // 严重性级别配置
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: false
    },
    
    // 自定义规则设置
    custom: {
      // Vue 规则设置
      vue: {
        'no-v-html': 'error',
        'no-dangerous-template': 'error',
        'no-unsafe-computed': 'warning'
      },
      
      // JavaScript 规则设置
      javascript: {
        'no-eval': 'error',
        'no-innerhtml': 'error'
      },
      
      // 中国安全规则设置
      'china-security': {
        'gb-t-28448': 'error',
        'gb-t-35273': 'warning'
      }
    }
  }
};
```

### 6.2 命令行配置

使用命令行参数配置规则：

```bash
# 启用特定规则模块
vue-security-scanner --rules vue,china-security

# 设置严重性级别
vue-security-scanner --severity high

# 排除特定规则
vue-security-scanner --exclude-rules no-v-html,no-eval
```

### 6.3 代码级配置

在代码中使用注释禁用特定规则：

```javascript
// vue-security-disable-next-line no-v-html
<div v-html="content"></div>

// vue-security-disable-line no-eval
const result = eval('1 + 1'); // 暂时允许

/* vue-security-disable */
// 这里的代码不会被扫描
const unsafe = eval('alert("test")');
/* vue-security-enable */
```

## 7. 规则优先级

规则优先级从高到低：

1. **代码级注释**：最优先，可覆盖其他配置
2. **命令行参数**：其次，临时配置
3. **配置文件**：默认配置，长期有效
4. **内置默认值**：最低优先级

## 8. 规则更新

Vue Security Scanner 会定期更新规则库，包括：

- 新的安全漏洞规则
- 国家安全标准更新
- 国内 API 变更
- 依赖项漏洞数据库更新

### 8.1 更新规则库

```bash
# 更新威胁情报和规则库
vue-security-scanner --update
```

### 8.2 查看规则更新

```bash
# 查看规则更新日志
vue-security-scanner --rule-updates
```

## 9. 规则自定义

### 9.1 添加自定义规则

在项目中创建自定义规则文件：

```javascript
// custom-rules.js
module.exports = {
  rules: [
    {
      id: 'custom-no-console-log',
      name: '禁止使用 console.log',
      description: '生产环境中禁止使用 console.log',
      severity: 'medium',
      pattern: /console\.log\(/g,
      fix: '使用专业的日志系统',
      test: (content, filePath) => {
        return content.includes('console.log(');
      }
    }
  ]
};
```

在配置文件中引用：

```javascript
module.exports = {
  rules: {
    enabled: [
      'vue',
      'javascript',
      './custom-rules.js'
    ]
  }
};
```

### 9.2 规则测试

测试自定义规则：

```bash
vue-security-scanner --test-rules ./custom-rules.js
```

## 10. 规则最佳实践

### 10.1 推荐规则组合

**基础安全**：
- `vue` + `javascript`

**中国合规**：
- `vue` + `javascript` + `china-security` + `china-api-security`

**完整安全**：
- `vue` + `javascript` + `china-security` + `china-api-security` + `dependency`

### 10.2 规则使用建议

1. **开发环境**：启用所有规则，包括低严重性
2. **测试环境**：启用中高严重性规则
3. **生产环境**：只启用高严重性规则
4. **CI/CD**：启用所有规则，作为质量 gate

### 10.3 规则调优

- **减少误报**：根据项目特点调整规则配置
- **提高准确性**：使用代码级注释处理特殊情况
- **平衡性能**：对于大型项目，只启用关键规则

## 11. 常见问题

### 11.1 误报问题

**问题**：某些安全规则产生误报

**解决方案**：
- 使用代码级注释禁用特定行的规则
- 在配置文件中调整规则严重性
- 报告误报情况以改进规则

### 11.2 漏报问题

**问题**：某些安全问题未被检测到

**解决方案**：
- 确保启用了相关规则模块
- 检查规则配置是否正确
- 报告漏报情况以改进规则

### 11.3 性能问题

**问题**：规则扫描速度慢

**解决方案**：
- 只启用必要的规则模块
- 使用增量扫描
- 排除不必要的目录

## 12. 规则贡献

如果您发现新的安全问题或有规则改进建议，请：

1. 在 GitHub 上提交 Issue
2. 提交 Pull Request 改进规则
3. 提供测试用例

## 13. 参考资料

- [Vue 官方安全指南](https://vuejs.org/guide/best-practices/security.html)
- [GB/T 28448-2019 信息安全技术 网络安全等级保护测评要求](https://www.cnstd.gov.cn/)
- [GB/T 31168-2014 信息安全技术 云计算服务安全能力要求](https://www.cnstd.gov.cn/)
- [GB/T 35273-2020 信息安全技术 个人信息安全规范](https://www.cnstd.gov.cn/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [中国网络安全等级保护制度](https://www.cac.gov.cn/)