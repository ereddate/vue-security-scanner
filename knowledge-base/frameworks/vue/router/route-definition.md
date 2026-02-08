# Vue Router 路由定义安全

## 📋 概述

Vue Router 是 Vue.js 的官方路由管理器，用于管理应用的路由。正确的路由定义可以防止未授权访问、信息泄露等安全问题。

## 🎯 核心安全特性

- **路由守卫**：Vue Router 提供了全局、路由级和组件级路由守卫
- **路由元信息**：路由元信息可以用于权限控制和页面配置
- **动态路由**：Vue Router 支持动态路由，但需要注意安全性
- **路由懒加载**：Vue Router 支持路由懒加载，提高性能和安全性

## 🔍 常见安全问题

### 问题 1：未授权的路由访问

**描述**：如果路由未正确配置权限控制，用户可能访问未授权的路由。

**风险**：高风险，可能导致未授权访问，敏感信息泄露等严重后果。

**解决方案**：

1. **使用路由守卫**：使用全局路由守卫控制路由访问
2. **验证用户权限**：在路由守卫中验证用户权限
3. **使用路由元信息**：使用路由元信息定义访问权限

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, hasPermission } from '@/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      permission: 'dashboard:access'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin:access'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
    return;
  }
  
  // 检查用户是否有权限访问此路由
  if (to.meta.permission && !hasPermission(to.meta.permission)) {
    next({
      name: 'forbidden'
    });
    return;
  }
  
  next();
});

export default router;
```

### 问题 2：动态路由注入

**描述**：如果动态路由的参数来自不受信任的来源，可能导致路由注入攻击。

**风险**：中风险，可能导致未授权访问，信息泄露等后果。

**解决方案**：

1. **验证路由参数**：在路由守卫中验证路由参数
2. **使用路由参数验证**：使用路由参数验证中间件
3. **限制动态路由**：限制动态路由的范围和类型

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

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 验证路由参数
  if (to.params.id) {
    const isValidId = await validateUserId(to.params.id);
    if (!isValidId) {
      next({
        name: 'not-found'
      });
      return;
    }
  }
  
  next();
});

// 验证用户 ID
const validateUserId = async (id) => {
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

export default router;
```

### 问题 3：路由元信息泄露

**描述**：如果路由元信息包含敏感信息，并且未进行适当保护，可能导致信息泄露。

**风险**：中风险，可能导致敏感信息泄露，用户隐私受损等后果。

**解决方案**：

1. **避免在元信息中存储敏感数据**：不要在路由元信息中存储敏感信息
2. **使用权限标识**：使用权限标识而不是敏感数据
3. **验证元信息访问**：在访问元信息时验证权限

```javascript
// router/index.js
const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      requiresAuth: true,
      permission: 'profile:access'
      // 不安全：存储敏感信息
      // secret: 'secret-key'
    }
  }
];
```

### 问题 4：路由历史劫持

**描述**：如果应用的路由历史可以被未授权访问或篡改，可能导致安全漏洞。

**风险**：中风险，可能导致未授权访问，用户会话被劫持等后果。

**解决方案**：

1. **使用安全的路由模式**：使用 HTML5 History 模式，避免使用 Hash 模式
2. **配置服务器重定向**：配置服务器正确处理路由
3. **验证路由跳转**：在路由跳转前验证目标路由

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  // 使用安全的路由模式
  history: createWebHistory(),
  routes
});

// 配置路由跳转验证
const originalPush = router.push;
router.push = function(location) {
  // 验证目标路由
  if (typeof location === 'string' && location.startsWith('javascript:')) {
    console.warn('检测到不安全的路由跳转');
    return Promise.reject(new Error('不安全的路由跳转'));
  }
  
  return originalPush.call(this, location);
};

export default router;
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 安全配置
  scrollBehavior(to, from, savedPosition) {
    // 只在相同路由时恢复滚动位置
    if (to.path === from.path) {
      return savedPosition;
    }
    // 否则滚动到顶部
    return { top: 0 };
  }
});

// 全局后置钩子
router.afterEach((to, from) => {
  // 记录路由访问
  logRouteAccess(to, from);
  
  // 更新页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
```

### 安全检查清单

- [x] 为需要认证的路由配置 `requiresAuth` 元信息
- [x] 为需要特定权限的路由配置 `permission` 元信息
- [x] 在全局路由守卫中验证用户认证状态
- [x] 在全局路由守卫中验证用户权限
- [x] 验证动态路由参数的格式和有效性
- [x] 避免在路由元信息中存储敏感信息
- [x] 使用安全的路由模式（HTML5 History 模式）
- [x] 配置服务器正确处理路由
- [x] 验证路由跳转的目标
- [x] 记录路由访问日志

## 📚 最佳实践

1. **使用路由守卫**：使用全局、路由级和组件级路由守卫控制路由访问
2. **验证路由参数**：在路由守卫中验证路由参数，确保其有效性
3. **使用路由元信息**：使用路由元信息定义访问权限和页面配置
4. **避免在元信息中存储敏感数据**：不要在路由元信息中存储敏感信息
5. **使用安全的路由模式**：使用 HTML5 History 模式，避免使用 Hash 模式
6. **配置服务器重定向**：配置服务器正确处理路由，避免 404 错误
7. **记录路由访问**：记录路由访问日志，便于审计和故障排查

## 📞 安全资源

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vue Router 官方文档 - 导航守卫](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [OWASP 访问控制备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)
- [OWASP 路由安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加路由定义安全指南
- 2024-02-15：更新 Vue Router 4.x 安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践