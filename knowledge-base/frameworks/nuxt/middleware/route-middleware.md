# Nuxt 路由中间件安全

## 📋 概述

Nuxt 路由中间件是在特定路由上运行的中间件，用于执行路由级别的逻辑，如权限检查、数据预加载等。正确配置和实现路由中间件可以增强应用的安全性，但不当使用也可能引入安全漏洞。

## 🎯 核心安全特性

- **路由级别控制**：路由中间件只在特定路由上执行，提供细粒度的安全控制
- **参数验证**：路由中间件可以验证路由参数，防止参数注入
- **权限检查**：路由中间件可以执行路由级别的权限检查
- **数据预加载**：路由中间件可以预加载数据，确保数据安全

## 🔍 常见安全问题

### 问题 1：路由权限绕过

**描述**：如果路由中间件未正确实现权限检查，可能导致权限绕过攻击。

**风险**：高风险，可能导致未授权访问，敏感信息泄露等严重后果。

**解决方案**：

1. **实现细粒度权限检查**：在路由中间件中验证用户权限
2. **使用路由元信息**：使用路由元信息定义权限要求
3. **验证用户角色**：验证用户角色是否满足路由要求

```javascript
// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 获取用户角色
  const user = useUserStore().user;
  
  // 检查用户是否为管理员
  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: '无权限访问此页面'
    });
  }
});
```

### 问题 2：路由参数注入

**描述**：如果路由中间件未验证路由参数，可能导致参数注入攻击。

**风险**：中风险，可能导致 XSS 攻击、SQL 注入、未授权访问等后果。

**解决方案**：

1. **验证参数格式**：在路由中间件中验证参数格式
2. **限制参数类型**：使用正则表达式限制参数类型
3. **参数清理**：清理和转义参数值

```javascript
// middleware/validate-id.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 验证 ID 参数
  const id = to.params.id;
  if (id && !/^[0-9a-f]{24}$/.test(id as string)) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的 ID 参数'
    });
  }
});
```

### 问题 3：敏感数据泄露

**描述**：如果路由中间件在未授权的情况下预加载敏感数据，可能导致数据泄露。

**风险**：高风险，可能导致敏感信息泄露，用户隐私受损等严重后果。

**解决方案**：

1. **先验证权限**：在预加载数据前验证用户权限
2. **限制数据范围**：只预加载必要的数据
3. **加密敏感数据**：对敏感数据进行加密

```javascript
// middleware/load-user-data.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const id = to.params.id;
  
  // 验证用户权限
  const user = useUserStore().user;
  if (!user || (user.id !== id && user.role !== 'admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: '无权限访问此数据'
    });
  }
  
  // 预加载用户数据
  const { data: userData } = await useAsyncData('user', () => {
    return $fetch(`/api/users/${id}`);
  });
  
  // 存储数据到状态管理
  useUserStore().setUserData(userData.value);
});
```

### 问题 4：路由重定向循环

**描述**：如果路由中间件的重定向逻辑不当，可能导致重定向循环，影响应用可用性。

**风险**：中风险，可能导致应用不可用，用户体验下降。

**解决方案**：

1. **检查重定向条件**：确保重定向条件不会导致循环
2. **使用 from 参数**：使用 from 参数检查来源路由
3. **设置重定向标志**：使用状态管理设置重定向标志

```javascript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore().user;
  
  // 检查用户是否认证
  if (!user) {
    // 避免重定向循环
    if (to.path === '/login') {
      return;
    }
    
    return navigateTo('/login');
  }
});
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // 配置路由
  router: {
    // 全局中间件
    middleware: ['auth'],
    // 路由配置
    routes: [
      {
        path: '/admin',
        component: () => import('~/pages/admin.vue'),
        // 路由中间件
        middleware: ['admin']
      },
      {
        path: '/user/:id',
        component: () => import('~/pages/user.vue'),
        // 路由中间件
        middleware: ['validate-id', 'load-user-data']
      }
    ]
  }
});
```

### 安全检查清单

- [x] 为敏感路由配置路由中间件
- [x] 实现细粒度权限检查
- [x] 验证路由参数格式
- [x] 在预加载数据前验证权限
- [x] 避免路由重定向循环
- [x] 测试路由中间件在不同场景下的行为
- [x] 确保路由中间件不会泄露敏感信息
- [x] 优化路由中间件性能

## 📚 最佳实践

1. **使用类型安全**：使用 TypeScript 增强路由中间件的类型安全
2. **分离关注点**：每个路由中间件只负责一个职责
3. **先验证后执行**：先验证权限和参数，再执行业务逻辑
4. **使用 async/await**：使用 async/await 处理异步操作
5. **错误处理**：正确处理中间件中的错误，避免错误信息泄露
6. **测试中间件**：对路由中间件进行单元测试和集成测试
7. **文档化**：文档化路由中间件的功能和权限要求

## 📞 安全资源

- [Nuxt 官方文档 - 路由中间件](https://nuxt.com/docs/guide/directory-structure/middleware#route-middleware)
- [Vue Router 官方文档 - 导航守卫](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [OWASP 访问控制备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)
- [OWASP 输入验证备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加路由中间件安全指南