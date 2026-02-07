# 前端敏感数据保护

## 风险描述

前端应用中存储和处理敏感数据存在多种安全风险，包括：

- **数据泄露** - 敏感数据被未授权访问或窃取
- **本地存储风险** - 本地存储的数据可能被恶意脚本读取
- **网络传输风险** - 数据在传输过程中可能被截获
- **内存泄露** - 敏感数据可能残留在内存中
- **第三方脚本风险** - 第三方脚本可能窃取敏感数据
- **浏览器扩展风险** - 恶意浏览器扩展可能读取敏感数据

## 常见场景

1. **用户凭证** - 用户名、密码、令牌等
2. **个人身份信息** - 姓名、身份证号、电话号码、邮箱等
3. **财务信息** - 信用卡号、银行账号、交易记录等
4. **健康信息** - 医疗记录、健康状况等
5. **地理位置信息** - 实时位置、位置历史等
6. **行为数据** - 浏览历史、搜索记录、购物偏好等
7. **企业数据** - 商业机密、内部文档等

## 防护措施

### 1. 本地存储安全

- **避免使用localStorage存储敏感数据** - localStorage是明文存储，可被JavaScript访问
- **使用sessionStorage存储临时数据** - sessionStorage在会话结束后自动清除
- **使用IndexedDB配合加密** - 对存储在IndexedDB中的数据进行加密
- **使用安全的Cookie属性** - 设置`Secure`、`HttpOnly`、`SameSite`属性
- **定期清理本地数据** - 及时清理不再需要的敏感数据

### 2. 内存安全

- **避免在内存中存储敏感数据** - 及时清除不再需要的敏感数据
- **使用临时变量** - 使用临时变量存储敏感数据，使用后立即清除
- **避免字符串拼接** - 避免将敏感数据与其他字符串拼接
- **使用Symbol** - 使用Symbol存储敏感数据，减少被意外访问的风险
- **浏览器隐私模式** - 建议用户在处理敏感数据时使用隐私模式

### 3. 网络传输安全

- **使用HTTPS** - 确保所有数据传输都通过HTTPS
- **使用TLS 1.2+** - 使用最新版本的TLS协议
- **证书验证** - 验证服务器证书的有效性
- **避免明文传输** - 避免在URL中传输敏感数据
- **使用安全的API** - 使用HTTPS的API，避免使用HTTP的API

### 4. 输入输出安全

- **输入验证** - 验证用户输入的敏感数据
- **输出编码** - 对输出的敏感数据进行适当的编码
- **掩码处理** - 对显示的敏感数据进行掩码处理，如信用卡号、密码等
- **最小化显示** - 只显示必要的敏感数据，避免过度显示

### 5. 第三方脚本安全

- **审核第三方脚本** - 审核引入的第三方脚本的安全性
- **使用Subresource Integrity (SRI)** - 为第三方脚本添加SRI哈希，确保脚本未被篡改
- **限制第三方脚本权限** - 使用Content Security Policy限制第三方脚本的权限
- **隔离第三方脚本** - 使用iframe或Web Workers隔离第三方脚本
- **定期更新第三方脚本** - 定期更新第三方脚本，修复已知安全漏洞

### 6. 浏览器安全设置

- **使用Content Security Policy** - 设置适当的CSP，限制脚本执行
- **使用安全的HTTP头** - 设置`X-Content-Type-Options`、`X-Frame-Options`等安全头
- **禁用不必要的浏览器功能** - 禁用不必要的浏览器功能，如自动填充、地理位置等
- **使用现代浏览器** - 建议用户使用最新版本的现代浏览器

## 代码示例

### 1. 本地存储安全

```javascript
// 不安全的方式：使用localStorage存储敏感数据
localStorage.setItem('userToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'); // 不安全

// 安全的方式：使用sessionStorage存储临时数据
sessionStorage.setItem('userToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'); // 相对安全

// 更安全的方式：使用加密存储
function encryptData(data, key) {
  // 加密实现
  return encryptedData;
}

function decryptData(encryptedData, key) {
  // 解密实现
  return decryptedData;
}

// 存储加密数据
const encryptedToken = encryptData('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'secretKey');
sessionStorage.setItem('encryptedToken', encryptedToken);

// 使用后清除数据
function clearSensitiveData() {
  sessionStorage.removeItem('userToken');
  sessionStorage.removeItem('encryptedToken');
  // 清除其他敏感数据
}
```

### 2. 内存安全

```javascript
// 不安全的方式：使用全局变量存储敏感数据
let userPassword = ''; // 不安全

function login(password) {
  userPassword = password; // 不安全
  // 登录逻辑
}

// 安全的方式：使用临时变量，使用后清除
function secureLogin(password) {
  const tempPassword = password; // 临时变量
  // 登录逻辑
  // 使用后清除
  tempPassword = '';
  password = '';
}

// 使用Symbol存储敏感数据
const sensitiveData = Symbol('sensitiveData');

class User {
  constructor() {
    this[sensitiveData] = {};
  }
  
  setPassword(password) {
    this[sensitiveData].password = password;
  }
  
  getPassword() {
    return this[sensitiveData].password;
  }
  
  clearPassword() {
    this[sensitiveData].password = '';
  }
}
```

### 3. 输入输出安全

```vue
<template>
  <div>
    <!-- 掩码处理：密码输入 -->
    <input type="password" v-model="password" placeholder="密码">
    
    <!-- 掩码处理：信用卡号 -->
    <input type="text" v-model="creditCard" placeholder="信用卡号">
    <div>显示: {{ maskedCreditCard }}</div>
    
    <!-- 最小化显示：邮箱 -->
    <div>邮箱: {{ maskedEmail }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      creditCard: '',
      email: 'user@example.com'
    }
  },
  computed: {
    // 信用卡号掩码
    maskedCreditCard() {
      if (!this.creditCard) return '';
      const length = this.creditCard.length;
      if (length <= 4) return this.creditCard;
      return '*'.repeat(length - 4) + this.creditCard.slice(-4);
    },
    // 邮箱掩码
    maskedEmail() {
      if (!this.email) return '';
      const [username, domain] = this.email.split('@');
      if (username.length <= 2) return this.email;
      return username.slice(0, 2) + '*'.repeat(username.length - 2) + '@' + domain;
    }
  },
  beforeUnmount() {
    // 组件卸载前清除敏感数据
    this.password = '';
    this.creditCard = '';
  }
}
</script>
```

### 4. 第三方脚本安全

```html
<!-- 使用Subresource Integrity (SRI) -->
<script src="https://example.com/script.js" integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" crossorigin="anonymous"></script>

<!-- Content Security Policy (CSP) -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://example.com; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none';">
```

## 测试方法

### 1. 本地存储测试

- **检查localStorage和sessionStorage** - 检查是否存储了敏感数据
- **检查Cookie** - 检查Cookie的设置是否安全
- **检查IndexedDB** - 检查IndexedDB中是否存储了未加密的敏感数据

### 2. 网络传输测试

- **使用HTTPS** - 检查所有网络请求是否使用HTTPS
- **检查请求参数** - 检查是否在URL或请求体中传输敏感数据
- **检查响应数据** - 检查响应中是否包含敏感数据

### 3. 内存测试

- **检查内存快照** - 使用浏览器开发者工具检查内存快照，查找敏感数据
- **检查变量** - 检查全局变量和闭包中是否存储了敏感数据
- **检查事件监听器** - 检查事件监听器中是否存储了敏感数据

### 4. 第三方脚本测试

- **审查第三方脚本** - 审查引入的第三方脚本的代码
- **检查SRI** - 检查是否为第三方脚本添加了SRI哈希
- **检查CSP** - 检查是否设置了适当的CSP

## 最佳实践

1. **最小化敏感数据** - 只收集和存储必要的敏感数据
2. **加密存储** - 对存储的敏感数据进行加密
3. **及时清理** - 及时清理不再需要的敏感数据
4. **使用HTTPS** - 确保所有数据传输都通过HTTPS
5. **掩码处理** - 对显示的敏感数据进行掩码处理
6. **权限控制** - 实施严格的权限控制，限制敏感数据的访问
7. **安全审计** - 定期进行安全审计，检查敏感数据的处理情况
8. **用户教育** - 教育用户如何保护自己的敏感数据
9. **合规性** - 确保敏感数据的处理符合相关法规要求
10. **定期更新** - 定期更新前端库和框架，修复已知安全漏洞

## 总结

前端敏感数据保护是一个复杂的问题，需要从多个层面实施防护措施。通过遵循上述最佳实践，可以显著减少敏感数据泄露的风险。

特别重要的是，要始终记住：前端安全只是整体安全体系的一部分，必须与后端安全措施相结合，才能构建一个真正安全的应用。