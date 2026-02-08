# uni-app 网络请求安全

## 📋 概述

uni-app 提供了跨平台的网络请求 API，但需要注意网络请求的安全问题，避免数据泄露、中间人攻击等安全威胁。

## 🎯 核心安全特性

- **跨平台支持**：uni-app 支持多端网络请求，包括 H5、小程序、App 等
- **请求拦截**：uni-app 支持请求拦截器，可以统一处理请求
- **响应拦截**：uni-app 支持响应拦截器，可以统一处理响应
- **错误处理**：uni-app 提供了完善的错误处理机制

## 🔍 常见安全问题

### 问题 1：HTTP 请求

**描述**：如果使用 HTTP 而不是 HTTPS，可能导致中间人攻击、数据泄露等安全问题。

**风险**：高风险，可能导致数据泄露，会话劫持等严重后果。

**解决方案**：

1. **使用 HTTPS**：所有网络请求必须使用 HTTPS
2. **配置域名白名单**：在小程序平台配置域名白名单
3. **验证证书**：验证 SSL/TLS 证书的有效性

```javascript
// utils/request.js
export const secureRequest = (url, data, method = 'GET') => {
  return uni.request({
    url: `https://api.example.com${url}`,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${uni.getStorageSync('token')}`
    }
  });
};
```

### 问题 2：请求参数注入

**描述**：如果请求参数来自用户输入，并且未进行验证，可能导致参数注入攻击。

**风险**：中风险，可能导致 SQL 注入、XSS 攻击等后果。

**解决方案**：

1. **验证参数格式**：验证请求参数的格式和类型
2. **转义特殊字符**：转义请求参数中的特殊字符
3. **使用参数化查询**：使用参数化查询或 ORM 框架

```javascript
// utils/validator.js
export const validateParams = (params, schema) => {
  for (const key in schema) {
    const value = params[key];
    const rules = schema[key];
    
    // 验证必填
    if (rules.required && !value) {
      throw new Error(`${key} 是必填项`);
    }
    
    // 验证类型
    if (rules.type && typeof value !== rules.type) {
      throw new Error(`${key} 类型错误`);
    }
    
    // 验证格式
    if (rules.pattern && !rules.pattern.test(value)) {
      throw new Error(`${key} 格式错误`);
    }
  }
  
  return true;
};
```

### 问题 3：响应数据泄露

**描述**：如果响应数据包含敏感信息，并且未进行适当保护，可能导致数据泄露。

**风险**：中风险，可能导致敏感信息泄露，用户隐私受损等后果。

**解决方案**：

1. **过滤敏感信息**：过滤响应中的敏感信息
2. **加密敏感数据**：对敏感数据进行加密
3. **限制响应范围**：限制响应的数据范围

```javascript
// utils/response.js
export const filterSensitiveData = (data, sensitiveFields) => {
  const filtered = { ...data };
  
  for (const field of sensitiveFields) {
    if (filtered[field]) {
      filtered[field] = '***';
    }
  }
  
  return filtered;
};

export const handleResponse = (response) => {
  // 过滤敏感信息
  const filteredData = filterSensitiveData(response.data, ['password', 'token']);
  
  return {
    success: true,
    data: filteredData
  };
};
```

### 问题 4：CSRF 攻击

**描述**：如果网络请求未进行 CSRF 防护，可能导致跨站请求伪造攻击。

**风险**：中风险，可能导致未授权操作，数据篡改等后果。

**解决方案**：

1. **使用 CSRF Token**：在请求中添加 CSRF Token
2. **验证 Referer**：验证请求的 Referer 头
3. **使用 SameSite Cookie**：设置 Cookie 的 SameSite 属性

```javascript
// utils/csrf.js
export const getCsrfToken = () => {
  return uni.getStorageSync('csrfToken');
};

export const setCsrfToken = (token) => {
  uni.setStorageSync('csrfToken', token);
};

export const secureRequest = (url, data, method = 'POST') => {
  return uni.request({
    url: `https://api.example.com${url}`,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json',
      'X-CSRF-Token': getCsrfToken()
    }
  });
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// utils/request.js
const BASE_URL = 'https://api.example.com';

export const request = (url, data, method = 'GET') => {
  return uni.request({
    url: `${BASE_URL}${url}`,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${uni.getStorageSync('token')}`,
      'X-CSRF-Token': uni.getStorageSync('csrfToken')
    }
  });
};

export const get = (url, data) => request(url, data, 'GET');
export const post = (url, data) => request(url, data, 'POST');
export const put = (url, data) => request(url, data, 'PUT');
export const del = (url, data) => request(url, data, 'DELETE');
```

### 安全检查清单

- [x] 所有网络请求使用 HTTPS
- [x] 配置域名白名单（小程序平台）
- [x] 验证请求参数的格式和类型
- [x] 转义请求参数中的特殊字符
- [x] 使用参数化查询或 ORM 框架
- [x] 过滤响应中的敏感信息
- [x] 对敏感数据进行加密
- [x] 限制响应的数据范围
- [x] 在请求中添加 CSRF Token
- [x] 验证请求的 Referer 头
- [x] 设置 Cookie 的 SameSite 属性

## 📚 最佳实践

1. **使用 HTTPS**：所有网络请求必须使用 HTTPS，确保传输安全
2. **验证参数**：验证请求参数的格式和类型，防止参数注入
3. **过滤敏感信息**：过滤响应中的敏感信息，避免数据泄露
4. **使用 CSRF Token**：在请求中添加 CSRF Token，防止 CSRF 攻击
5. **添加请求头**：添加必要的请求头，如认证信息
6. **错误处理**：完善错误处理机制，及时发现异常
7. **定期更新**：定期更新 uni-app 和相关依赖，修复已知安全漏洞

## 📞 安全资源

- [uni-app 官方文档 - 网络请求](https://uniapp.dcloud.net.cn/api/request/request.html)
- [OWASP CSRF 防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP 参数验证备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP API 安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/API_Security_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加网络请求安全指南
- 2024-02-15：更新 uni-app 3.x 网络请求安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践