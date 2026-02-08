# Taro 3+ Vue 3 支持安全

## 📋 概述

Taro 3+ 完全支持 Vue 3，为开发者提供了使用 Vue 3 开发跨端应用的能力。Vue 3 的引入为 Taro 应用带来了新的安全特性和挑战。了解和正确使用 Vue 3 的安全特性对于构建安全的 Taro 应用至关重要。

## 🎯 核心安全特性

- **组合式 API**：Vue 3 的组合式 API 提供了更好的代码组织和类型安全
- **响应式系统**：Vue 3 的响应式系统提供了更高效的状态管理
- **自动转义**：Vue 3 默认对插值表达式进行 HTML 转义，防止 XSS 攻击
- **组件隔离**：Vue 3 的组件系统提供了良好的作用域隔离

## 🔍 常见安全问题

### 问题 1：v-html 滥用

**描述**：在 Taro Vue 3 应用中，如果滥用 `v-html` 指令，可能导致 XSS 攻击。

**风险**：高风险，可能导致恶意脚本执行，用户会话被劫持等严重后果。

**解决方案**：

1. **避免使用 v-html**：尽可能避免使用 `v-html`，使用 Vue 的数据绑定
2. **验证内容来源**：如果必须使用 `v-html`，确保内容来自可信来源
3. **清理 HTML 内容**：使用 DOMPurify 等工具清理 HTML 内容

```vue
<template>
  <view>
    <!-- 不安全：直接使用用户输入 -->
    <!-- <view v-html="userInput"></view> -->
    
    <!-- 安全：使用数据绑定 -->
    <view>{{ userInput }}</view>
    
    <!-- 安全：使用 DOMPurify 清理内容 -->
    <view v-html="sanitize(userInput)"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import DOMPurify from 'dompurify';

const userInput = ref('<script>alert("XSS")</script>');

const sanitize = (html) => {
  return DOMPurify.sanitize(html);
};
</script>
```

### 问题 2：组合式 API 中的内存泄漏

**描述**：如果在组合式 API 中创建了副作用（如定时器、事件监听器），但未在 `onUnmounted` 钩子中清理，可能导致内存泄漏。

**风险**：中风险，可能导致应用性能下降，内存占用持续增长，最终导致应用崩溃。

**解决方案**：

1. **在 onUnmounted 中清理**：在 `onUnmounted` 钩子中清理所有副作用
2. **使用 ref 追踪**：使用 ref 追踪需要清理的资源
3. **避免全局副作用**：避免在组件中创建全局副作用

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const timer = ref(null);
const count = ref(0);

onMounted(() => {
  timer.value = setInterval(() => {
    count.value++;
  }, 1000);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});
</script>
```

### 问题 3：Taro API 调用安全

**描述**：如果在 Taro Vue 3 应用中直接调用 Taro API 而未进行适当的验证和错误处理，可能导致安全问题。

**风险**：中风险，可能导致 API 被滥用，数据泄露，服务费用增加等后果。

**解决方案**：

1. **验证 API 参数**：验证 Taro API 的参数
2. **处理 API 错误**：正确处理 Taro API 的错误
3. **使用服务端代理**：通过服务端代理调用敏感 API

```vue
<script setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';

const user = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchUser = async (userId) => {
  try {
    loading.value = true;
    error.value = null;
    
    // 验证用户 ID
    if (!userId || !/^[0-9a-f]{24}$/.test(userId)) {
      throw new Error('无效的用户 ID');
    }
    
    const response = await Taro.request({
      url: `/api/users/${userId}`,
      method: 'GET'
    });
    
    user.value = response.data;
  } catch (err) {
    error.value = err.message;
    console.error('获取用户失败:', err);
  } finally {
    loading.value = false;
  }
};
</script>
```

### 问题 4：Props 验证不当

**描述**：如果在 Taro Vue 3 组件中未正确验证 props，可能导致组件安全漏洞。

**风险**：中风险，可能导致 XSS 攻击、数据篡改等后果。

**解决方案**：

1. **使用 Props 验证**：使用 Vue 3 的 Props 验证机制
2. **设置默认值**：为 Props 设置安全的默认值
3. **验证 Props 类型**：确保 Props 的类型符合预期

```vue
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => {
      return /^[a-zA-Z\u4e00-\u9fa5\s]+$/.test(value);
    }
  },
  age: {
    type: Number,
    default: 0,
    validator: (value) => {
      return value >= 0 && value <= 120;
    }
  }
});
</script>
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// config/index.js
export default {
  // 配置 Vue 3
  framework: 'vue3',
  // 启用严格模式
  vueLoaderOption: {
    compilerOptions: {
      // 启用作用域 CSS
      scopeId: true
    }
  },
  // 配置编译选项
  compiler: {
    // 启用类型检查
    typeCheck: true
  }
};
```

### 安全检查清单

- [x] 避免使用 `v-html`，除非内容来自可信来源
- [x] 对所有用户输入进行验证和清理
- [x] 在 `onUnmounted` 钩子中清理所有副作用
- [x] 使用 ref 追踪需要清理的资源
- [x] 验证 Taro API 的参数
- [x] 正确处理 Taro API 的错误
- [x] 使用 Props 验证机制验证组件输入
- [x] 为 Props 设置安全的默认值
- [x] 验证 Props 的类型

## 📚 最佳实践

1. **使用组合式 API**：使用 Vue 3 的组合式 API，提供更好的代码组织和类型安全
2. **避免使用 v-html**：尽可能避免使用 `v-html`，使用 Vue 的数据绑定
3. **清理副作用**：在 `onUnmounted` 钩子中清理所有副作用
4. **验证 Props**：使用 Vue 3 的 Props 验证机制验证组件输入
5. **验证 API 参数**：验证 Taro API 的参数，避免参数注入
6. **处理 API 错误**：正确处理 Taro API 的错误，避免错误信息泄露
7. **使用 TypeScript**：使用 TypeScript 提供更好的类型安全

## 📞 安全资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Taro 官方文档 - Vue 3 支持](https://docs.taro.zone/docs/vue3)
- [OWASP XSS 防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify 官方文档](https://github.com/cure53/DOMPurify)

## 📝 更新日志

- 2026-02-08：初始版本，添加 Vue 3 支持安全指南