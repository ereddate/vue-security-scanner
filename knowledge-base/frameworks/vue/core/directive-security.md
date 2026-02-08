# Vue 指令安全

## 📋 概述

Vue 指令是带有 `v-` 前缀的特殊属性，用于在模板中应用特殊的响应式行为。正确使用指令可以增强应用的安全性，但不当使用也可能引入安全漏洞。

## 🎯 核心安全特性

- **内置指令**：Vue 提供了安全的内置指令，如 `v-if`、`v-for`、`v-model` 等
- **自定义指令**：Vue 允许开发者创建自定义指令，但需要注意安全性
- **指令修饰符**：Vue 提供了指令修饰符，如 `.prevent`、`.stop`、`.once` 等
- **参数验证**：自定义指令可以验证参数，增强安全性

## 🔍 常见安全问题

### 问题 1：v-model 注入

**描述**：`v-model` 指令用于创建双向数据绑定，如果绑定的数据来自不受信任的来源，可能导致数据注入。

**风险**：中风险，可能导致 XSS 攻击、数据篡改等后果。

**解决方案**：

1. **验证输入数据**：对 `v-model` 绑定的数据进行验证
2. **使用计算属性**：使用计算属性过滤和转换数据
3. **限制输入类型**：使用 `type` 属性限制输入类型

```vue
<template>
  <div class="user-form">
    <input v-model="username" type="text" placeholder="用户名" />
    <input v-model="email" type="email" placeholder="邮箱" />
    <input v-model="age" type="number" min="0" max="120" placeholder="年龄" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const username = ref('');
const email = ref('');
const age = ref('');

// 使用计算属性验证和过滤数据
const sanitizedUsername = computed({
  get: () => username.value,
  set: (value) => {
    // 验证用户名只包含字母和数字
    if (/^[a-zA-Z0-9]+$/.test(value)) {
      username.value = value;
    }
  }
});

const sanitizedEmail = computed({
  get: () => email.value,
  set: (value) => {
    // 验证邮箱格式
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      email.value = value;
    }
  }
});

const sanitizedAge = computed({
  get: () => age.value,
  set: (value) => {
    // 验证年龄范围
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 120) {
      age.value = numValue;
    }
  }
});
</script>
```

### 问题 2：v-on 事件注入

**描述**：`v-on` 指令（或简写 `@`）用于绑定事件处理器，如果事件处理器来自不受信任的来源，可能导致事件注入攻击。

**风险**：高风险，可能导致任意代码执行，未授权操作等严重后果。

**解决方案**：

1. **避免动态事件处理器**：避免使用 `v-on:[event]` 绑定动态事件
2. **使用白名单**：只允许特定的事件类型
3. **验证事件处理器**：如果必须使用动态事件处理器，验证其安全性

```vue
<template>
  <div class="event-demo">
    <!-- 安全：使用静态事件处理器 -->
    <button @click="handleClick">点击</button>
    
    <!-- 不安全：动态事件处理器 -->
    <button v-on:[eventType]="handleEvent">点击</button>
    
    <!-- 安全：使用白名单验证动态事件 -->
    <button v-on:[getSafeEvent(eventType)]="handleEvent">点击</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const eventType = ref('click');

// 使用白名单验证事件类型
const getSafeEvent = (event) => {
  const safeEvents = ['click', 'submit', 'change', 'input'];
  return safeEvents.includes(event) ? event : 'click';
};

const handleClick = () => {
  console.log('按钮被点击');
};

const handleEvent = () => {
  console.log('事件被触发');
};
</script>
```

### 问题 3：v-bind 属性注入

**描述**：`v-bind` 指令（或简写 `:`）用于动态绑定属性，如果属性值来自不受信任的来源，可能导致属性注入攻击。

**风险**：中风险，可能导致 XSS 攻击、未授权操作等后果。

**解决方案**：

1. **验证属性值**：对动态属性值进行严格验证
2. **使用白名单**：只允许特定的属性值
3. **避免危险的属性**：避免绑定 `onclick`、`onload` 等事件处理器属性

```vue
<template>
  <div class="link-demo">
    <!-- 安全：使用静态属性 -->
    <a href="/home">首页</a>
    
    <!-- 不安全：动态属性 -->
    <a :href="userProvidedUrl">点击</a>
    
    <!-- 安全：验证 URL -->
    <a :href="sanitizeUrl(userProvidedUrl)">点击</a>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userProvidedUrl = ref('javascript:alert("XSS")');

// 验证 URL
const sanitizeUrl = (url) => {
  if (!url) return '';
  
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const parsedUrl = new URL(url, window.location.origin);
    if (allowedProtocols.includes(parsedUrl.protocol)) {
      return parsedUrl.href;
    }
  } catch (error) {
    // 无效的 URL
  }
  
  return '';
};
</script>
```

### 问题 4：自定义指令漏洞

**描述**：自定义指令如果未正确实现，可能引入安全漏洞，如 XSS、DOM 注入等。

**风险**：中风险，取决于自定义指令的实现，可能导致各种安全问题。

**解决方案**：

1. **验证指令参数**：对自定义指令的参数进行验证
2. **避免直接操作 DOM**：使用 Vue 的响应式系统，避免直接操作 DOM
3. **清理插入的内容**：如果指令插入 HTML 内容，使用 DOMPurify 等工具清理

```javascript
// directives/safe-html.js
import DOMPurify from 'dompurify';

export const safeHtml = {
  mounted(el, binding) {
    // 验证绑定值
    if (typeof binding.value !== 'string') {
      console.warn('safe-html 指令需要一个字符串值');
      return;
    }
    
    // 清理 HTML 内容
    const sanitizedHtml = DOMPurify.sanitize(binding.value);
    
    // 插入清理后的内容
    el.innerHTML = sanitizedHtml;
  },
  
  updated(el, binding) {
    // 更新时重新清理
    if (typeof binding.value !== 'string') {
      return;
    }
    
    const sanitizedHtml = DOMPurify.sanitize(binding.value);
    el.innerHTML = sanitizedHtml;
  }
};
```

```vue
<template>
  <div>
    <!-- 使用自定义指令 -->
    <div v-safe-html="userProvidedHtml"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userProvidedHtml = ref('<script>alert("XSS")</script>');
</script>
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// main.js 或 main.ts
import { createApp } from 'vue';
import { safeHtml } from './directives/safe-html';

const app = createApp(App);

// 注册自定义指令
app.directive('safe-html', safeHtml);

app.mount('#app');
```

### 安全检查清单

- [x] 验证 `v-model` 绑定的数据
- [x] 使用计算属性过滤和转换数据
- [x] 限制输入类型，使用 `type` 属性
- [x] 避免使用动态事件处理器
- [x] 使用白名单验证动态事件
- [x] 验证动态属性的值
- [x] 避免绑定危险的属性
- [x] 验证自定义指令的参数
- [x] 避免在自定义指令中直接操作 DOM
- [x] 清理自定义指令插入的 HTML 内容

## 📚 最佳实践

1. **使用内置指令**：优先使用 Vue 的内置指令，它们经过充分测试和优化
2. **验证输入数据**：对所有指令绑定的数据进行验证，确保符合预期格式
3. **使用计算属性**：使用计算属性过滤和转换数据，避免在模板中执行复杂逻辑
4. **避免动态指令**：避免使用 `v-bind:[attr]`、`v-on:[event]` 等动态指令
5. **实现安全的自定义指令**：如果必须创建自定义指令，确保其安全性
6. **使用指令修饰符**：使用指令修饰符增强指令的安全性，如 `.prevent`、`.stop` 等
7. **定期更新**：定期更新 Vue 和相关依赖，修复已知安全漏洞

## 📞 安全资源

- [Vue 官方文档 - 指令](https://vuejs.org/guide/essentials/template-syntax.html#directives)
- [Vue 官方文档 - 自定义指令](https://vuejs.org/guide/reusability/custom-directives.html)
- [OWASP XSS 防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify 官方文档](https://github.com/cure53/DOMPurify)

## 📝 更新日志

- 2024-01-01：初始版本，添加指令安全指南
- 2024-02-15：更新 Vue 3.7+ 指令安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践