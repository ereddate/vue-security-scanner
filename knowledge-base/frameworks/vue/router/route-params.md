# Vue Router 路由参数安全

## 📋 概述

Vue Router 允许在路由中定义参数，用于传递数据。如果路由参数来自不受信任的来源或未进行验证，可能导致安全漏洞。

## 🎯 核心安全特性

- **参数验证**：Vue Router 允许在路由守卫中验证参数
- **参数类型检查**：Vue Router 支持参数类型检查和转换
- **参数编码**：Vue Router 自动对参数进行编码和解码
- **参数作用域**：路由参数只在特定路由中可用，避免全局污染

## 🔍 常见安全问题

### 问题 1：路由参数注入

**描述**：如果路由参数来自不受信任的来源，并且未进行验证，可能导致参数注入攻击。

**风险**：中风险，可能导致 XSS 攻击、SQL 注入、未授权访问等后果。

**解决方案**：

1. **验证参数格式**：在路由守卫中验证参数格式
2. **限制参数类型**：使用路由配置限制参数类型
3. **使用参数验证中间件**：创建参数验证中间件

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/views/User.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 参数验证中间件
const validateRouteParams = async (to, from, next) => {
  // 验证 ID 参数
  if (to.params.id) {
    const isValidId = await validateId(to.params.id);
    if (!isValidId) {
      next({
        name: 'not-found'
      });
      return;
    }
  }
  
  next();
};

// 验证 ID
const validateId = async (id) => {
  // 验证 ID 格式
  if (!/^[0-9a-f]{24}$/.test(id)) {
    return false;
  }
  
  // 验证 ID 是否存在
  try {
    const response = await fetch(`/api/users/${id}`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// 全局前置守卫
router.beforeEach(validateRouteParams);

export default router;
```

### 问题 2：路由参数 XSS

**描述**：如果路由参数直接插入到页面中，并且未进行转义，可能导致 XSS 攻击。

**风险**：高风险，可能导致恶意脚本执行，用户会话被劫持等严重后果。

**解决方案**：

1. **使用 Vue 的数据绑定**：使用 Vue 的数据绑定 `{{ }}`，它会自动转义
2. **避免直接操作 DOM**：避免在组件中直接操作 DOM
3. **验证参数内容**：对路由参数进行验证和清理

```vue
<template>
  <div class="user-profile">
    <!-- 安全：使用 Vue 的数据绑定 -->
    <h1>{{ userId }}</h1>
    <p>{{ userName }}</p>
    
    <!-- 不安全：直接使用参数 -->
    <div v-html="userDescription"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DOMPurify from 'dompurify';

const route = useRoute();
const userId = ref('');
const userName = ref('');
const userDescription = ref('');

onMounted(async () => {
  // 获取路由参数
  const id = route.params.id;
  
  // 验证参数
  if (!/^[0-9a-f]{24}$/.test(id)) {
    console.error('无效的用户 ID');
    return;
  }
  
  // 获取用户数据
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    
    // 使用 Vue 的响应式系统
    userId.value = user.id;
    userName.value = user.name;
    
    // 清理描述内容
    userDescription.value = DOMPurify.sanitize(user.description);
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
});
</script>
```

### 问题 3：路由参数 SQL 注入

**描述**：如果路由参数直接用于构建 SQL 查询，并且未进行参数化，可能导致 SQL 注入攻击。

**风险**：高风险，可能导致数据库被未授权访问，数据泄露等严重后果。

**解决方案**：

1. **使用参数化查询**：使用参数化查询或 ORM 框架
2. **验证参数类型**：验证参数的类型和格式
3. **限制查询范围**：限制查询的范围和返回的数据量

```javascript
// api/users.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserById = async (id) => {
  // 验证 ID 格式
  if (!/^[0-9a-f]{24}$/.test(id)) {
    throw new Error('无效的用户 ID');
  }
  
  // 使用 Prisma 的参数化查询
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      name: true,
      email: true
      // 不返回敏感信息
      // password: false
    }
  });
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  return user;
};
```

### 问题 4：路由参数信息泄露

**描述**：如果路由参数包含敏感信息，并且未进行适当保护，可能导致信息泄露。

**风险**：中风险，可能导致敏感信息泄露，用户隐私受损等后果。

**解决方案**：

1. **避免在参数中传递敏感信息**：不要在路由参数中传递敏感信息
2. **使用会话存储**：使用会话存储或状态管理存储敏感信息
3. **加密敏感参数**：如果必须传递敏感参数，对其进行加密

```javascript
// router/index.js
const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue')
    // 不安全：在参数中传递敏感信息
    // path: '/profile/:token'
  }
];

// 安全：使用会话存储
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 在登录时存储令牌
const login = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  
  // 存储令牌到状态管理
  userStore.setToken(data.token);
  
  // 跳转到个人资料页面
  router.push({
    name: 'profile'
  });
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/views/User.vue'),
    props: true,
    // 配置参数验证
    meta: {
      validateParams: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 参数验证守卫
router.beforeEach(async (to, from, next) => {
  // 检查是否需要验证参数
  if (to.meta.validateParams) {
    const isValid = await validateParams(to.params);
    if (!isValid) {
      next({
        name: 'not-found'
      });
      return;
    }
  }
  
  next();
});

// 验证参数
const validateParams = async (params) => {
  // 验证 ID 参数
  if (params.id && !/^[0-9a-f]{24}$/.test(params.id)) {
    return false;
  }
  
  return true;
};

export default router;
```

### 安全检查清单

- [x] 在路由守卫中验证路由参数
- [x] 验证参数的格式和类型
- [x] 限制参数的范围和值
- [x] 使用 Vue 的数据绑定，避免直接操作 DOM
- [x] 避免在参数中传递敏感信息
- [x] 使用参数化查询或 ORM 框架
- [x] 限制查询的范围和返回的数据量
- [x] 使用会话存储或状态管理存储敏感信息
- [x] 对参数进行清理和转义
- [x] 记录参数验证错误

## 📚 最佳实践

1. **验证参数格式**：在路由守卫中验证参数格式，确保符合预期
2. **限制参数类型**：使用路由配置限制参数类型
3. **使用参数验证中间件**：创建参数验证中间件，统一处理参数验证
4. **使用 Vue 的数据绑定**：使用 Vue 的数据绑定 `{{ }}`，它会自动转义
5. **避免在参数中传递敏感信息**：不要在路由参数中传递敏感信息
6. **使用参数化查询**：使用参数化查询或 ORM 框架，避免 SQL 注入
7. **记录参数验证错误**：记录参数验证错误，便于审计和故障排查

## 📞 安全资源

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vue Router 官方文档 - 路由参数](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [OWASP 参数验证备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP SQL 注入防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加路由参数安全指南
- 2024-02-15：更新 Vue Router 4.x 路由参数安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践