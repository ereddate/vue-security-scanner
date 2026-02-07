# REST API 安全最佳实践

## 📋 概述

REST API 是现代前端应用与后端通信的主要方式。本指南提供了在前端应用中安全使用 REST API 的最佳实践。

## 🎯 适用场景

- 前后端分离的应用
- SPA（单页应用）
- 移动应用
- 微服务架构

## 🔍 核心实践

### 1. 使用 HTTPS

```javascript
// ✅ 正确：使用 HTTPS
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
});

// ❌ 错误：使用 HTTP
const insecureClient = axios.create({
  baseURL: 'http://api.example.com'
});
```

### 2. 认证令牌管理

#### JWT 令牌存储

```javascript
const tokenManager = {
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },
  
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },
  
  isTokenExpired: (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  }
};
```

#### Axios 拦截器

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com/api',
  timeout: 10000
});

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        tokenManager.setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenManager.removeToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 3. 输入验证

#### 前端输入验证

```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const validateInput = (data, rules) => {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && !value) {
      errors[field] = `${field} 是必填项`;
      continue;
    }
    
    if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = '邮箱格式不正确';
    }
    
    if (rule.type === 'phone' && value && !validatePhoneNumber(value)) {
      errors[field] = '手机号格式不正确';
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} 长度不能少于 ${rule.minLength} 个字符`;
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} 长度不能超过 ${rule.maxLength} 个字符`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

#### Vue 3 Composition API 实现

```vue
<script setup>
import { ref, computed } from 'vue';
import { validateInput } from '@/utils/validation';

const formData = ref({
  email: '',
  password: ''
});

const validationRules = {
  email: {
    required: true,
    type: 'email'
  },
  password: {
    required: true,
    minLength: 8
  }
};

const validationErrors = ref({});

const isValid = computed(() => {
  const result = validateInput(formData.value, validationRules);
  validationErrors.value = result.errors;
  return result.isValid;
});

const submitForm = async () => {
  if (!isValid.value) {
    return;
  }
  
  try {
    await apiClient.post('/auth/login', formData.value);
  } catch (error) {
    console.error('登录失败:', error);
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div>
      <label>邮箱</label>
      <input v-model="formData.email" type="email" />
      <span v-if="validationErrors.email" class="error">
        {{ validationErrors.email }}
      </span>
    </div>
    
    <div>
      <label>密码</label>
      <input v-model="formData.password" type="password" />
      <span v-if="validationErrors.password" class="error">
        {{ validationErrors.password }}
      </span>
    </div>
    
    <button type="submit">登录</button>
  </form>
</template>
```

### 4. 错误处理

#### 安全的错误处理

```javascript
const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.error('请求错误:', error.response.data.message);
        break;
      case 401:
        console.error('未授权，请重新登录');
        tokenManager.removeToken();
        window.location.href = '/login';
        break;
      case 403:
        console.error('拒绝访问');
        break;
      case 404:
        console.error('资源不存在');
        break;
      case 500:
        console.error('服务器错误');
        break;
      default:
        console.error('未知错误');
    }
  } else if (error.request) {
    console.error('网络错误，请检查网络连接');
  } else {
    console.error('请求配置错误');
  }
};
```

### 5. 速率限制

#### 实现请求节流

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
  
  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );
    return this.maxRequests - this.requests.length;
  }
}

const loginLimiter = new RateLimiter(5, 60000);

const login = async (username, password) => {
  if (!loginLimiter.canMakeRequest()) {
    throw new Error('请求过于频繁，请稍后再试');
  }
  
  const response = await apiClient.post('/auth/login', {
    username,
    password
  });
  
  return response.data;
};
```

### 6. CORS 配置

#### 正确的 CORS 配置

```javascript
// 前端配置
const apiClient = axios.create({
  baseURL: 'https://api.example.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 后端 CORS 配置（示例）
// app.use(cors({
//   origin: 'https://your-frontend.com',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
```

## 🛠️ 工具推荐

- **Axios**: HTTP 客户端库
- **ky**: 现代化的 HTTP 客户端
- **fetch-intercept**: Fetch API 拦截器
- **lodash.debounce**: 防抖函数库

## 📝 验证方法

### API 安全检查清单

- [ ] 所有 API 请求都使用 HTTPS
- [ ] 实施认证令牌管理
- [ ] 实施输入验证
- [ ] 实施错误处理
- [ ] 实施速率限制
- [ ] 正确配置 CORS
- [ ] 实施请求签名（如需要）
- [ ] 实施请求加密（如需要）

## ⚠️ 常见错误

### 错误 1：在前端存储敏感令牌

**问题**：localStorage 不安全，可以被 XSS 攻击读取

**解决方案**：使用 HttpOnly Cookie 或短期令牌

```javascript
// ❌ 错误
localStorage.setItem('authToken', token);

// ✅ 正确
document.cookie = `authToken=${token}; HttpOnly; Secure; SameSite=Strict`;
```

### 错误 2：不验证 API 响应

**问题**：不验证响应可能导致安全漏洞

**解决方案**：验证响应数据和状态码

```javascript
// ❌ 错误
const response = await apiClient.get('/user');
console.log(response.data);

// ✅ 正确
const response = await apiClient.get('/user');
if (response.status === 200 && response.data) {
  console.log(response.data);
} else {
  throw new Error('无效的响应');
}
```

### 错误 3：暴露敏感信息

**问题**：在 URL 中暴露敏感信息

**解决方案**：使用请求体或头部传递敏感信息

```javascript
// ❌ 错误
const response = await apiClient.get(`/user?token=${token}`);

// ✅ 正确
const response = await apiClient.get('/user', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## 📚 参考资料

- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)