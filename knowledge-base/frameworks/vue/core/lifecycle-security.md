# Vue 生命周期安全

## 📋 概述

Vue 组件的生命周期钩子提供了在组件不同阶段执行代码的能力。正确使用生命周期钩子可以避免内存泄漏、未授权操作等安全问题。

## 🎯 核心安全特性

- **生命周期钩子**：Vue 提供了完整的生命周期钩子，如 `onMounted`、`onUpdated`、`onUnmounted` 等
- **清理机制**：`onUnmounted` 钩子提供了清理副作用的机制
- **响应式追踪**：Vue 的响应式系统自动追踪依赖，避免不必要的更新
- **错误处理**：Vue 提供了错误处理钩子，如 `onErrorCaptured`

## 🔍 常见安全问题

### 问题 1：内存泄漏

**描述**：如果在生命周期钩子中创建了副作用（如定时器、事件监听器），但未在组件卸载时清理，可能导致内存泄漏。

**风险**：中风险，可能导致应用性能下降，内存占用持续增长，最终导致应用崩溃。

**解决方案**：

1. **在 onUnmounted 中清理**：在 `onUnmounted` 钩子中清理所有副作用
2. **使用 ref 追踪**：使用 ref 追踪需要清理的资源
3. **避免全局副作用**：避免在组件中创建全局副作用

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const timer = ref(null);
const eventListener = ref(null);

onMounted(() => {
  // 创建定时器
  timer.value = setInterval(() => {
    console.log('定时任务');
  }, 1000);
  
  // 添加事件监听器
  eventListener.value = (event) => {
    console.log('事件:', event);
  };
  window.addEventListener('resize', eventListener.value);
});

onUnmounted(() => {
  // 清理定时器
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  
  // 移除事件监听器
  if (eventListener.value) {
    window.removeEventListener('resize', eventListener.value);
    eventListener.value = null;
  }
});
</script>
```

### 问题 2：未授权的数据获取

**描述**：如果在生命周期钩子中执行未授权的数据获取操作，可能导致数据泄露或未授权访问。

**风险**：高风险，可能导致敏感信息泄露，未授权访问等严重后果。

**解决方案**：

1. **验证用户权限**：在获取数据前验证用户权限
2. **使用路由守卫**：使用路由守卫控制数据获取
3. **避免在 onMounted 中获取敏感数据**：将敏感数据获取移到用户操作触发

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userData = ref(null);

onMounted(async () => {
  // 验证用户是否登录
  if (!isAuthenticated()) {
    return;
  }
  
  // 验证用户是否有权限访问此数据
  if (!hasPermission(route.params.id)) {
    console.warn('无权限访问此数据');
    return;
  }
  
  // 获取数据
  try {
    const response = await fetch(`/api/users/${route.params.id}`);
    userData.value = await response.json();
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const hasPermission = (userId) => {
  const currentUser = getCurrentUser();
  return currentUser.id === userId || currentUser.role === 'admin';
};
</script>
```

### 问题 3：生命周期钩子中的 XSS

**描述**：如果在生命周期钩子中直接操作 DOM 并插入不受信任的内容，可能导致 XSS 攻击。

**风险**：高风险，可能导致恶意脚本执行，用户会话被劫持等严重后果。

**解决方案**：

1. **避免直接操作 DOM**：使用 Vue 的模板系统和响应式系统
2. **清理插入的内容**：如果必须操作 DOM，使用 DOMPurify 等工具清理内容
3. **使用 Vue 的方法**：使用 Vue 提供的方法，如 `nextTick`、`watch` 等

```vue
<script setup>
import { onMounted, ref } from 'vue';
import DOMPurify from 'dompurify';

const container = ref(null);

onMounted(() => {
  // 不安全：直接插入不受信任的内容
  // container.value.innerHTML = userInput;
  
  // 安全：使用 DOMPurify 清理内容
  const sanitizedHtml = DOMPurify.sanitize(userInput);
  container.value.innerHTML = sanitizedHtml;
});
</script>
```

### 问题 4：生命周期钩子中的竞态条件

**描述**：如果在生命周期钩子中执行异步操作，但未正确处理竞态条件，可能导致数据不一致或未授权操作。

**风险**：中风险，可能导致数据不一致，未授权操作等后果。

**解决方案**：

1. **使用 loading 状态**：使用 loading 状态防止重复操作
2. **使用 AbortController**：使用 AbortController 取消未完成的请求
3. **验证操作结果**：在操作完成后验证结果

```vue
<script setup>
import { onMounted, ref } from 'vue';

const isLoading = ref(false);
const data = ref(null);
const abortController = ref(null);

onMounted(async () => {
  // 检查是否已经在加载
  if (isLoading.value) {
    return;
  }
  
  // 创建 AbortController
  abortController.value = new AbortController();
  
  try {
    isLoading.value = true;
    const response = await fetch('/api/data', {
      signal: abortController.value.signal
    });
    data.value = await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('获取数据失败:', error);
    }
  } finally {
    isLoading.value = false;
  }
});

// 在组件卸载时取消请求
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
  }
});
</script>
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// main.js 或 main.ts
import { createApp } from 'vue';

const app = createApp(App);

// 配置全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err);
  console.error('组件实例:', instance);
  console.error('错误信息:', info);
  
  // 上报错误到监控系统
  reportErrorToMonitoring(err, info);
};

app.mount('#app');
```

### 安全检查清单

- [x] 在 `onUnmounted` 钩子中清理所有副作用
- [x] 使用 ref 追踪需要清理的资源
- [x] 避免在组件中创建全局副作用
- [x] 在获取数据前验证用户权限
- [x] 使用路由守卫控制数据获取
- [x] 避免在 `onMounted` 中获取敏感数据
- [x] 避免直接操作 DOM
- [x] 使用 DOMPurify 等工具清理插入的内容
- [x] 使用 loading 状态防止重复操作
- [x] 使用 AbortController 取消未完成的请求

## 📚 最佳实践

1. **清理副作用**：在 `onUnmounted` 钩子中清理所有副作用，包括定时器、事件监听器、网络请求等
2. **验证权限**：在执行敏感操作前验证用户权限
3. **避免全局副作用**：避免在组件中创建全局副作用，使用组件级别的副作用
4. **使用 loading 状态**：使用 loading 状态防止重复操作和竞态条件
5. **使用 AbortController**：使用 AbortController 取消未完成的请求，避免内存泄漏
6. **避免直接操作 DOM**：使用 Vue 的模板系统和响应式系统，避免直接操作 DOM
7. **配置全局错误处理**：配置全局错误处理，捕获和处理所有错误

## 📞 安全资源

- [Vue 官方文档 - 生命周期](https://vuejs.org/guide/essentials/lifecycle.html)
- [Vue 官方文档 - 组合式 API](https://vuejs.org/guide/composition-api-lifecycle.html)
- [OWASP 内存管理备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Memory_Management_Cheat_Sheet.html)
- [OWASP 权限管理备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加生命周期安全指南
- 2024-02-15：更新 Vue 3.7+ 生命周期安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践