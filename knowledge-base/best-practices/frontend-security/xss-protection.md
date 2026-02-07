# 跨站脚本攻击(XSS)防护

## 风险描述

跨站脚本攻击(XSS)是一种常见的前端安全漏洞，攻击者通过在网页中注入恶意脚本，当用户浏览该页面时，恶意脚本会在用户的浏览器中执行，从而导致以下风险：

- 窃取用户会话信息（如Cookie）
- 重定向用户到恶意网站
- 伪造用户操作
- 执行恶意代码
- 窃取用户个人信息

## 常见场景

1. **用户输入未经过滤** - 当用户输入的内容直接显示在页面上，未经过滤或转义
2. **富文本编辑器** - 允许用户输入HTML内容，但未正确处理
3. **URL参数** - 从URL参数中获取数据并直接显示
4. **第三方脚本** - 引入的第三方脚本存在安全漏洞
5. **DOM操作** - 使用不安全的DOM操作方法，如`innerHTML`、`outerHTML`等

## 防护措施

### 1. 输入验证和转义

- **HTML转义** - 对用户输入的内容进行HTML转义，防止恶意脚本执行
- **URL转义** - 对URL参数进行转义
- **JavaScript转义** - 对JavaScript中的变量进行转义
- **CSS转义** - 对CSS中的变量进行转义

### 2. 使用安全的DOM操作方法

- 优先使用`textContent`而非`innerHTML`
- 使用`createElement`和`appendChild`而非`innerHTML`
- 避免使用`eval()`和`new Function()`
- 避免使用`document.write()`

### 3. Content Security Policy (CSP)

- 设置适当的CSP头，限制脚本的执行来源
- 禁止内联脚本和内联样式
- 限制脚本加载来源
- 限制表单提交目标

### 4. 浏览器安全特性

- 使用`X-XSS-Protection`头
- 使用`X-Content-Type-Options`头
- 使用`X-Frame-Options`头
- 使用`Referrer-Policy`头

### 5. 框架安全特性

- 利用Vue、React等框架的内置XSS防护机制
- 遵循框架的安全最佳实践
- 定期更新框架版本

## 代码示例

### Vue.js 中的 XSS 防护

```vue
<template>
  <!-- 安全的方式：Vue会自动转义 -->
  <div>{{ userInput }}</div>
  
  <!-- 不安全的方式：直接使用innerHTML -->
  <div v-html="userInput"></div> <!-- 只在信任内容时使用 -->
</template>

<script>
export default {
  data() {
    return {
      userInput: '<script>alert("XSS")</script>'
    }
  },
  methods: {
    // 安全的DOM操作
    safeDomOperation() {
      const element = document.createElement('div')
      element.textContent = this.userInput
      document.body.appendChild(element)
    }
  }
}
</script>
```

### Content Security Policy 配置

```nginx
# Nginx配置
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none';" always;
```

### 手动转义函数

```javascript
// HTML转义函数
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 使用
const userInput = '<script>alert("XSS")</script>';
document.getElementById('output').textContent = escapeHtml(userInput);
```

## 测试方法

### 1. 手动测试

- 输入常见的XSS payload，如：
  - `<script>alert('XSS')</script>`
  - `<img src="x" onerror="alert('XSS')">`
  - `<div onmouseover="alert('XSS')">Hover me</div>`
- 检查是否会执行恶意脚本

### 2. 自动化测试

- 使用OWASP ZAP或Burp Suite进行XSS扫描
- 集成到CI/CD流程中
- 使用专门的XSS测试工具

### 3. 代码审查

- 检查是否使用了不安全的DOM操作方法
- 检查是否正确处理了用户输入
- 检查是否设置了适当的安全头

## 最佳实践

1. **默认拒绝** - 对所有用户输入持怀疑态度，默认拒绝，只允许明确授权的内容
2. **分层防护** - 实施多层防护措施，即使一层被突破，还有其他层保护
3. **最小权限** - 只授予必要的权限，限制脚本的执行范围
4. **定期更新** - 定期更新框架、库和依赖，修复已知安全漏洞
5. **安全意识** - 提高开发团队的安全意识，定期进行安全培训
6. **使用安全库** - 使用经过验证的安全库处理用户输入
7. **监控和响应** - 监控网站的安全状况，及时响应安全事件

## 总结

XSS是一种常见但严重的安全漏洞，通过实施上述防护措施，可以有效减少XSS攻击的风险。特别重要的是，要结合使用输入验证、输出转义、CSP、安全的DOM操作方法和框架的安全特性，构建一个全面的XSS防护体系。

记住，安全是一个持续的过程，需要定期审查和更新安全措施，以应对新出现的威胁。