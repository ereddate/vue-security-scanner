# 跨站请求伪造(CSRF)防护

## 风险描述

跨站请求伪造(CSRF)是一种攻击方式，攻击者诱导用户在已登录的Web应用上执行非预期的操作。例如，攻击者可能通过邮件、论坛等方式，诱导用户点击一个链接，该链接会向用户已登录的银行网站发送转账请求。由于用户已经登录，银行网站会认为这是用户的合法操作，从而执行转账。

CSRF攻击的危害包括：

- 未授权的数据修改
- 资金转账
- 密码修改
- 个人信息修改
- 发表恶意内容
- 执行恶意操作

## 常见场景

1. **表单提交** - 攻击者创建一个表单，当用户提交时，向目标网站发送请求
2. **图片标签** - 使用`<img>`标签的`src`属性发送GET请求
3. **链接点击** - 诱导用户点击链接，发送请求
4. **JavaScript** - 使用JavaScript自动发送请求
5. **第三方网站** - 在第三方网站上嵌入恶意代码，当用户访问时发送请求

## 防护措施

### 1. CSRF Token

- **生成Token** - 服务器为每个用户会话生成唯一的CSRF Token
- **嵌入Token** - 将Token嵌入到表单中或作为HTTP头
- **验证Token** - 服务器验证请求中的Token是否有效
- **Token过期** - 设置Token的过期时间
- **Token绑定** - 将Token与用户会话绑定

### 2. SameSite Cookie 属性

- 设置Cookie的`SameSite`属性为`Strict`或`Lax`
- `Strict` - 完全禁止跨站Cookie传输
- `Lax` - 允许部分跨站GET请求
- `None` - 允许跨站Cookie传输（需要同时设置`Secure`属性）

### 3. 双重提交防护

- 在Cookie中存储CSRF Token
- 在请求体或头部中也发送相同的Token
- 服务器验证两者是否匹配

### 4. 验证Origin和Referer头

- 验证请求的`Origin`头
- 验证请求的`Referer`头
- 限制请求来源

### 5. 要求用户交互

- 对于敏感操作，要求用户再次输入密码
- 使用验证码
- 使用双因素认证

### 6. 安全的会话管理

- 使用HTTPS
- 设置适当的Cookie属性（`Secure`、`HttpOnly`、`SameSite`）
- 定期轮换会话ID
- 及时销毁过期会话

## 代码示例

### 前端实现

#### Vue.js 中的 CSRF Token 实现

```vue
<template>
  <form @submit.prevent="submitForm">
    <!-- 隐藏字段存储CSRF Token -->
    <input type="hidden" name="_csrf" :value="csrfToken">
    <input type="text" v-model="username" placeholder="用户名">
    <input type="password" v-model="password" placeholder="密码">
    <button type="submit">提交</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      csrfToken: '',
      username: '',
      password: ''
    }
  },
  mounted() {
    // 从Cookie或API获取CSRF Token
    this.csrfToken = this.getCsrfTokenFromCookie();
  },
  methods: {
    getCsrfTokenFromCookie() {
      // 从Cookie中获取CSRF Token
      const cookieValue = document.cookie
        .split('; ') 
        .find(row => row.startsWith('_csrf='))
        ?.split('=')[1];
      return cookieValue || '';
    },
    async submitForm() {
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.csrfToken // 在头部也发送Token
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            _csrf: this.csrfToken // 在请求体中发送Token
          })
        });
        
        const data = await response.json();
        console.log('提交成功:', data);
      } catch (error) {
        console.error('提交失败:', error);
      }
    }
  }
}
</script>
```

#### Fetch API 中的 CSRF Token 实现

```javascript
// 获取CSRF Token
function getCsrfToken() {
  const cookieValue = document.cookie
    .split('; ') 
    .find(row => row.startsWith('_csrf='))
    ?.split('=')[1];
  return cookieValue || '';
}

// 发送请求
async function sendRequest(url, data) {
  const csrfToken = getCsrfToken();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'same-origin', // 包含Cookie
    body: JSON.stringify({
      ...data,
      _csrf: csrfToken
    })
  });
  
  return response.json();
}

// 使用
sendRequest('/api/transfer', {
  amount: 1000,
  recipient: 'attacker'
}).then(data => {
  console.log(data);
});
```

### 后端验证

#### Express.js 中的 CSRF 防护

```javascript
const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// 配置CSRF防护
const csrfProtection = csrf({ cookie: true });

// 生成CSRF Token
app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// 验证CSRF Token
app.post('/submit', csrfProtection, (req, res) => {
  res.send('数据提交成功');
});

app.listen(3000);
```

## 测试方法

### 1. 手动测试

- **创建测试页面** - 创建一个页面，包含向目标网站发送请求的代码
- **模拟攻击** - 访问测试页面，尝试执行CSRF攻击
- **验证防护** - 检查攻击是否成功，验证防护措施是否有效

### 2. 自动化测试

- 使用OWASP ZAP或Burp Suite进行CSRF扫描
- 集成到CI/CD流程中
- 使用专门的CSRF测试工具

### 3. 代码审查

- 检查是否实现了CSRF Token
- 检查是否设置了SameSite Cookie属性
- 检查是否验证了Origin和Referer头
- 检查是否使用了安全的会话管理

## 最佳实践

1. **使用多种防护措施** - 结合使用CSRF Token、SameSite Cookie、Origin验证等多种防护措施
2. **对所有修改操作进行防护** - 对所有修改数据的操作（POST、PUT、DELETE）实施CSRF防护
3. **使用HTTPS** - 确保所有请求都通过HTTPS传输
4. **定期更新** - 定期更新框架和库，修复已知安全漏洞
5. **安全意识** - 提高开发团队的安全意识，定期进行安全培训
6. **测试覆盖** - 确保安全测试覆盖所有功能点
7. **监控异常** - 监控异常请求模式，及时发现潜在攻击

## 总结

CSRF攻击是一种常见的安全威胁，通过实施上述防护措施，可以有效减少CSRF攻击的风险。特别重要的是，要结合使用CSRF Token、SameSite Cookie属性和其他防护措施，构建一个全面的CSRF防护体系。

记住，安全是一个持续的过程，需要定期审查和更新安全措施，以应对新出现的威胁。