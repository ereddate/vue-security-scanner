# 密码安全最佳实践

## 📋 概述

密码安全是前端应用安全的基础。本指南提供了在前端应用中处理密码的最佳实践，包括密码存储、传输和验证。

## 🎯 适用场景

- 用户注册和登录系统
- 密码修改和重置功能
- 多因素认证系统
- 会话管理系统

## 🔍 核心实践

### 1. 密码传输安全

#### 使用 HTTPS

```javascript
// 确保所有密码传输都通过 HTTPS
const login = async (username, password) => {
  const response = await fetch('https://api.example.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  return response.json();
};
```

#### 避免在 URL 中传输密码

```javascript
// ❌ 错误：密码在 URL 中
const login = (username, password) => {
  window.location.href = `https://api.example.com/login?username=${username}&password=${password}`;
};

// ✅ 正确：密码在请求体中
const login = async (username, password) => {
  const response = await fetch('https://api.example.com/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

### 2. 密码验证

#### 实施密码强度检查

```javascript
const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('密码长度至少为 8 个字符');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密码必须包含至少一个数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

#### Vue 3 Composition API 实现

```vue
<script setup>
import { ref, computed } from 'vue';

const password = ref('');
const passwordErrors = ref([]);

const passwordStrength = computed(() => {
  const result = validatePasswordStrength(password.value);
  passwordErrors.value = result.errors;
  return result.isValid;
});

const submitPassword = async () => {
  if (!passwordStrength.value) {
    return;
  }
  
  await login(username.value, password.value);
};
</script>

<template>
  <div>
    <input v-model="password" type="password" placeholder="输入密码" />
    <div v-if="passwordErrors.length > 0" class="errors">
      <p v-for="error in passwordErrors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>
```

### 3. 密码存储

#### 前端不存储明文密码

```javascript
// ❌ 错误：存储明文密码
localStorage.setItem('password', password);

// ✅ 正确：只存储认证令牌
localStorage.setItem('authToken', authToken);
```

#### 使用安全的令牌存储

```javascript
const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};
```

### 4. 密码重置

#### 安全的密码重置流程

```javascript
const requestPasswordReset = async (email) => {
  const response = await fetch('https://api.example.com/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });
  
  if (!response.ok) {
    throw new Error('密码重置请求失败');
  }
  
  return response.json();
};

const resetPassword = async (token, newPassword) => {
  const response = await fetch('https://api.example.com/password-reset/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword })
  });
  
  if (!response.ok) {
    throw new Error('密码重置失败');
  }
  
  return response.json();
};
```

### 5. 密码显示/隐藏

#### 实现密码可见性切换

```vue
<script setup>
import { ref } from 'vue';

const password = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div>
    <input
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="输入密码"
    />
    <button @click="togglePasswordVisibility">
      {{ showPassword ? '隐藏' : '显示' }}
    </button>
  </div>
</template>
```

## 🛠️ 工具推荐

- **zxcvbn**: 密码强度评估库
- **bcryptjs**: 密码哈希库（后端使用）
- **crypto-js**: 加密库

### 使用 zxcvbn 评估密码强度

```javascript
import zxcvbn from 'zxcvbn';

const evaluatePasswordStrength = (password) => {
  const result = zxcvbn(password);
  
  return {
    score: result.score,
    feedback: result.feedback.warning || result.feedback.suggestions[0],
    crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
  };
};
```

## 📝 验证方法

### 密码安全检查清单

- [ ] 所有密码传输都使用 HTTPS
- [ ] 密码不在 URL 中传输
- [ ] 实施密码强度检查
- [ ] 前端不存储明文密码
- [ ] 使用安全的令牌存储
- [ ] 密码重置流程安全
- [ ] 提供密码可见性切换
- [ ] 实施密码过期策略
- [ ] 防止密码重用

## ⚠️ 常见错误

### 错误 1：在前端验证密码强度

**问题**：前端验证可以被绕过

**解决方案**：前端验证作为用户体验优化，后端必须进行验证

```javascript
// 前端验证（用户体验）
if (!validatePasswordStrength(password).isValid) {
  showError('密码强度不足');
  return;
}

// 后端验证（安全保证）
await submitPassword(password);
```

### 错误 2：存储密码在 localStorage

**问题**：localStorage 不安全，可以被 XSS 攻击读取

**解决方案**：使用 HttpOnly Cookie 或短期令牌

```javascript
// ❌ 错误
localStorage.setItem('password', password);

// ✅ 正确
document.cookie = `authToken=${token}; HttpOnly; Secure; SameSite=Strict`;
```

### 错误 3：密码在控制台输出

**问题**：密码可能被记录在日志中

**解决方案**：避免在日志中输出敏感信息

```javascript
// ❌ 错误
console.log('User login:', { username, password });

// ✅ 正确
console.log('User login attempt:', { username });
```

## 📚 参考资料

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [zxcvbn Documentation](https://github.com/dropbox/zxcvbn)