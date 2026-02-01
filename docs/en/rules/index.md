# Vue Security Scanner Rules Documentation

## Rule Modules Overview

Vue Security Scanner includes the following rule modules:

| Module Name | Description | Applicable Scenario | Severity |
|-------------|-------------|---------------------|----------|
| `vue` | Vue core security rules | Vue projects | High |
| `javascript` | JavaScript security rules | All projects | High |
| `china-security` | China security standard rules | Projects in China | High |
| `china-api-security` | China API security rules | Projects using domestic APIs | Medium |
| `dependency` | Dependency security rules | All projects | High |

## 1. Vue Core Rules

### 1.1 Template Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-v-html` | Disallow v-html directive | High | Use safe template rendering |
| `no-dangerous-template` | Disallow dangerous template expressions | High | Use computed properties or methods |
| `no-unsafe-computed` | Disallow unsafe computed properties | Medium | Ensure computed properties return safe values |
| `no-raw-html` | Disallow direct innerHTML manipulation | High | Use Vue's data binding |

### 1.2 Event Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-eval` | Disallow eval usage | High | Use functions or other safe methods |
| `no-new-function` | Disallow new Function usage | High | Use regular function definitions |
| `no-set-timeout-string` | Disallow setTimeout string parameter | Medium | Use function parameter |
| `no-set-interval-string` | Disallow setInterval string parameter | Medium | Use function parameter |

### 1.3 Component Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-unsafe-props` | Disallow unsafe component props | Medium | Validate prop values |
| `no-global-mutation` | Disallow global object modification | High | Use local state management |
| `no-direct-dom-access` | Disallow direct DOM manipulation | Medium | Use Vue's ref system |

### 1.4 Router Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-unsafe-route-params` | Disallow unsafe route parameters | Medium | Validate route parameters |
| `no-path-traversal` | Disallow path traversal attacks | High | Validate path parameters |
| `no-open-redirect` | Disallow open redirects | High | Validate redirect targets |

## 2. JavaScript Security Rules

### 2.1 Code Injection

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-eval` | Disallow eval usage | High | Use functions or other safe methods |
| `no-new-function` | Disallow new Function usage | High | Use regular function definitions |
| `no-unsafe-json-parse` | Disallow unsafe JSON.parse | Medium | Use try-catch wrapper |
| `no-document-write` | Disallow document.write usage | High | Use DOM manipulation methods |

### 2.2 XSS Protection

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-innerhtml` | Disallow innerHTML usage | High | Use textContent or safe rendering |
| `no-outerhtml` | Disallow outerHTML usage | High | Use DOM manipulation methods |
| `no-insertadjacenthtml` | Disallow insertAdjacentHTML usage | High | Use safe DOM operations |
| `no-unescaped-entities` | Disallow unescaped HTML entities | Medium | Properly escape HTML entities |

### 2.3 Network Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-http-urls` | Disallow HTTP URLs | Medium | Use HTTPS URLs |
| `no-inline-scripts` | Disallow inline scripts | Medium | Use external script files |
| `no-unsafe-fetch` | Disallow unsafe fetch requests | Medium | Validate request parameters |

### 2.4 Data Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `no-hardcoded-secrets` | Disallow hardcoded secrets | High | Use environment variables or config files |
| `no-unsafe-storage` | Disallow unsafe storage operations | Medium | Encrypt sensitive data |
| `no-console-log-secrets` | Disallow logging secrets in console | Medium | Remove sensitive information from logs |

## 3. China Security Standard Rules

### 3.1 GB/T 28448-2019 Information Security Technology - Network Security Level Protection Assessment Requirements

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `gb-t-28448-authentication` | Identity authentication security requirements | High | Implement strong password policies and multi-factor authentication |
| `gb-t-28448-access-control` | Access control security requirements | High | Implement least privilege principle |
| `gb-t-28448-cryptography` | Cryptography application security requirements | High | Use algorithms approved by the State Cryptography Administration |
| `gb-t-28448-audit` | Audit log security requirements | Medium | Implement complete log recording |

### 3.2 GB/T 31168-2014 Information Security Technology - Cloud Computing Service Security Capability Requirements

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `gb-t-31168-isolation` | Cloud service isolation security requirements | High | Ensure tenant isolation |
| `gb-t-31168-data-protection` | Data protection security requirements | High | Implement data encryption and backup |
| `gb-t-31168-monitoring` | Security monitoring requirements | Medium | Implement real-time security monitoring |

### 3.3 GB/T 35273-2020 Information Security Technology - Personal Information Security Specification

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `gb-t-35273-consent` | Personal information collection consent requirements | High | Implement clear consent mechanism |
| `gb-t-35273-minimization` | Minimum necessary principle requirements | Medium | Only collect necessary personal information |
| `gb-t-35273-retention` | Personal information retention period requirements | Medium | Specify clear data retention periods |

### 3.4 Network Security Level Protection System

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `等级保护-第一级` | Level 1 security requirements | Low | Basic security protection |
| `等级保护-第二级` | Level 2 security requirements | Medium | Enhanced security protection |
| `等级保护-第三级` | Level 3 security requirements | High | Comprehensive security protection |
| `等级保护-第四级` | Level 4 security requirements | High | Strengthened security protection |

### 3.5 Domestic Framework Security

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `element-plus-security` | Element Plus safe usage | Medium | Follow official security guidelines |
| `ant-design-vue-security` | Ant Design Vue safe usage | Medium | Follow official security guidelines |
| `vue-element-admin-security` | Vue Element Admin safe usage | Medium | Follow project security guidelines |

## 4. China API Security Rules

### 4.1 Domestic Cloud Service Providers

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `aliyun-api-security` | Alibaba Cloud API safe usage | Medium | Correctly configure API keys and permissions |
| `tencent-cloud-api-security` | Tencent Cloud API safe usage | Medium | Correctly configure API keys and permissions |
| `huawei-cloud-api-security` | Huawei Cloud API safe usage | Medium | Correctly configure API keys and permissions |
| `baidu-cloud-api-security` | Baidu Cloud API safe usage | Medium | Correctly configure API keys and permissions |
| `jd-cloud-api-security` | JD Cloud API safe usage | Medium | Correctly configure API keys and permissions |

### 4.2 Domestic Payment Services

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `wechat-pay-api-security` | WeChat Pay API safe usage | High | Correctly verify signatures and callbacks |
| `alipay-api-security` | Alipay API safe usage | High | Correctly verify signatures and callbacks |
| `unionpay-api-security` | UnionPay API safe usage | High | Correctly verify signatures and callbacks |

### 4.3 Domestic Social Platforms

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `wechat-api-security` | WeChat API safe usage | Medium | Correctly configure and verify |
| `weibo-api-security` | Weibo API safe usage | Medium | Correctly configure and verify |
| `qq-api-security` | QQ API safe usage | Medium | Correctly configure and verify |

### 4.4 Domestic Map Services

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `amap-api-security` | Amap API safe usage | Low | Correctly configure API keys |
| `baidu-map-api-security` | Baidu Map API safe usage | Low | Correctly configure API keys |
| `tencent-map-api-security` | Tencent Map API safe usage | Low | Correctly configure API keys |

### 4.5 Domestic SMS Services

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `aliyun-sms-api-security` | Alibaba Cloud SMS API safe usage | Medium | Prevent SMS bombing |
| `tencent-sms-api-security` | Tencent Cloud SMS API safe usage | Medium | Prevent SMS bombing |
| `huawei-sms-api-security` | Huawei Cloud SMS API safe usage | Medium | Prevent SMS bombing |

## 5. Dependency Security Rules

### 5.1 Dependency Vulnerabilities

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `dependency-vulnerabilities` | Dependency vulnerability check | High | Update to secure versions |
| `outdated-dependencies` | Outdated dependency check | Medium | Update to latest versions |
| `unsafe-dependency-versions` | Unsafe dependency versions | Medium | Use fixed versions or secure ranges |

### 5.2 Dependency Licenses

| Rule Name | Description | Severity | Fix Suggestion |
|-----------|-------------|----------|----------------|
| `license-compliance` | License compliance check | Low | Use compliant licenses |
| `restrictive-licenses` | Restrictive license check | Low | Avoid using restrictive licenses |

## 6. Rule Configuration

### 6.1 Global Configuration

Configure rules in `.vue-security-scanner.config.js`:

```javascript
module.exports = {
  rules: {
    // Enabled rule modules
    enabled: [
      'vue',
      'javascript',
      'china-security',
      'china-api-security',
      'dependency'
    ],
    
    // Severity level configuration
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: false
    },
    
    // Custom rule settings
    custom: {
      // Vue rule settings
      vue: {
        'no-v-html': 'error',
        'no-dangerous-template': 'error',
        'no-unsafe-computed': 'warning'
      },
      
      // JavaScript rule settings
      javascript: {
        'no-eval': 'error',
        'no-innerhtml': 'error'
      },
      
      // China security rule settings
      'china-security': {
        'gb-t-28448': 'error',
        'gb-t-35273': 'warning'
      }
    }
  }
};
```

### 6.2 Command Line Configuration

Configure rules using command line parameters:

```bash
# Enable specific rule modules
vue-security-scanner --rules vue,china-security

# Set severity level
vue-security-scanner --severity high

# Exclude specific rules
vue-security-scanner --exclude-rules no-v-html,no-eval
```

### 6.3 Code-Level Configuration

Disable specific rules using comments in code:

```javascript
// vue-security-disable-next-line no-v-html
<div v-html="content"></div>

// vue-security-disable-line no-eval
const result = eval('1 + 1'); // Temporarily allowed

/* vue-security-disable */
// Code here won't be scanned
const unsafe = eval('alert("test")');
/* vue-security-enable */
```

## 7. Rule Priority

Rule priority from highest to lowest:

1. **Code-level comments**: Highest priority, can override other configurations
2. **Command line parameters**: Secondary, temporary configuration
3. **Configuration file**: Default configuration, long-term effective
4. **Built-in defaults**: Lowest priority

## 8. Rule Updates

Vue Security Scanner regularly updates the rule library, including:

- New security vulnerability rules
- National security standard updates
- Domestic API changes
- Dependency vulnerability database updates

### 8.1 Update Rule Library

```bash
# Update threat intelligence and rule library
vue-security-scanner --update
```

### 8.2 View Rule Updates

```bash
# View rule update logs
vue-security-scanner --rule-updates
```

## 9. Custom Rules

### 9.1 Add Custom Rules

Create custom rule file in project:

```javascript
// custom-rules.js
module.exports = {
  rules: [
    {
      id: 'custom-no-console-log',
      name: 'Disallow console.log',
      description: 'Disallow console.log in production',
      severity: 'medium',
      pattern: /console\.log\(/g,
      fix: 'Use professional logging system',
      test: (content, filePath) => {
        return content.includes('console.log(');
      }
    }
  ]
};
```

Reference in configuration file:

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

### 9.2 Rule Testing

Test custom rules:

```bash
vue-security-scanner --test-rules ./custom-rules.js
```

## 10. Rule Best Practices

### 10.1 Recommended Rule Combinations

**Basic Security**:
- `vue` + `javascript`

**China Compliance**:
- `vue` + `javascript` + `china-security` + `china-api-security`

**Comprehensive Security**:
- `vue` + `javascript` + `china-security` + `china-api-security` + `dependency`

### 10.2 Rule Usage Suggestions

1. **Development Environment**: Enable all rules, including low severity
2. **Testing Environment**: Enable medium and high severity rules
3. **Production Environment**: Only enable high severity rules
4. **CI/CD**: Enable all rules as quality gate

### 10.3 Rule Optimization

- **Reduce False Positives**: Adjust rule configuration based on project characteristics
- **Improve Accuracy**: Use code-level comments for special cases
- **Balance Performance**: For large projects, only enable critical rules

## 11. Common Issues

### 11.1 False Positives

**Issue**: Some security rules produce false positives

**Solutions**:
- Use code-level comments to disable rules for specific lines
- Adjust rule severity in configuration file
- Report false positives to improve rules

### 11.2 False Negatives

**Issue**: Some security issues are not detected

**Solutions**:
- Ensure relevant rule modules are enabled
- Check rule configuration is correct
- Report false negatives to improve rules

### 11.3 Performance Issues

**Issue**: Rule scanning is slow

**Solutions**:
- Only enable necessary rule modules
- Use incremental scanning
- Exclude unnecessary directories

## 12. Rule Contribution

If you discover new security issues or have rule improvement suggestions, please:

1. Submit an Issue on GitHub
2. Submit a Pull Request to improve rules
3. Provide test cases

## 13. References

- [Vue Official Security Guide](https://vuejs.org/guide/best-practices/security.html)
- [GB/T 28448-2019 Information Security Technology - Network Security Level Protection Assessment Requirements](https://www.cnstd.gov.cn/)
- [GB/T 31168-2014 Information Security Technology - Cloud Computing Service Security Capability Requirements](https://www.cnstd.gov.cn/)
- [GB/T 35273-2020 Information Security Technology - Personal Information Security Specification](https://www.cnstd.gov.cn/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [China Network Security Level Protection System](https://www.cac.gov.cn/)