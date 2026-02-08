# Vue 模板安全

## 📋 概述

Vue 的模板系统是构建用户界面的核心部分，它提供了一种声明式的方式来描述 UI 结构。虽然 Vue 的模板系统在默认情况下提供了良好的安全保护，但仍需注意一些潜在的安全问题。

## 🎯 核心安全特性

- **自动转义**：Vue 默认对插值表达式进行 HTML 转义，防止 XSS 攻击
- **指令系统**：Vue 的指令系统提供了安全的 DOM 操作方式
- **编译时优化**：Vue 在编译时对模板进行优化，提高性能和安全性
- **沙箱环境**：Vue 在某些版本中使用了沙箱环境来执行表达式

## 🔍 常见安全问题

### 问题 1：v-html 滥用

**描述**：`v-html` 指令允许直接插入 HTML 内容，但如果内容来自不受信任的来源，可能导致 XSS 攻击。

**风险**：高风险，可能导致恶意脚本执行，用户会话被劫持，敏感信息泄露等后果。

**解决方案**：

1. **避免使用 v-html**：尽可能避免使用 `v-html`，使用 Vue 的数据绑定和指令系统
2. **验证内容来源**：如果必须使用 `v-html`，确保内容来自可信来源
3. **清理 HTML 内容**：使用 DOMPurify 等工具清理 HTML 内容

```vue
<template>
  <div>
    <!-- 不安全：直接使用用户输入 -->
    <div v-html="userInput"></div>
    
    <!-- 安全：使用数据绑定 -->
    <div>{{ userInput }}</div>
    
    <!-- 安全：使用 DOMPurify 清理内容 -->
    <div v-html="sanitize(userInput)"></div>
  </div>
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

### 问题 2：模板表达式注入

**描述**：在模板表达式中使用不受信任的数据，可能导致代码注入攻击。

**风险**：中风险，可能导致未授权的代码执行，数据泄露等后果。

**解决方案**：

1. **限制表达式复杂度**：避免在模板表达式中使用复杂的逻辑
2. **验证表达式输入**：对用于表达式计算的数据进行严格验证
3. **使用计算属性**：将复杂逻辑移到计算属性中，便于管理和测试

```vue
<template>
  <div>
    <!-- 不安全：直接使用用户输入 -->
    <div>{{ userProvidedExpression }}</div>
    
    <!-- 安全：使用计算属性 -->
    <div>{{ computedValue }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const userInput = ref('alert("XSS")');

// 不安全：直接使用用户输入作为表达式
const userProvidedExpression = ref(eval(userInput.value));

// 安全：使用计算属性
const computedValue = computed(() => {
  // 验证输入
  if (typeof userInput.value !== 'string') {
    return '';
  }
  // 只允许安全的操作
  return userInput.value.toUpperCase();
});
</script>
```

### 问题 3：动态属性注入

**描述**：使用 `v-bind` 或简写 `:` 绑定动态属性时，如果属性值来自不受信任的来源，可能导致安全漏洞。

**风险**：中风险，可能导致 XSS 攻击、未授权操作等后果。

**解决方案**：

1. **验证属性值**：对动态属性值进行严格验证
2. **使用白名单**：只允许特定的属性值
3. **避免危险的属性**：避免绑定 `onclick`、`onload` 等事件处理器属性

```vue
<template>
  <div>
    <!-- 不安全：直接使用用户输入 -->
    <a :href="userProvidedUrl">点击</a>
    
    <!-- 安全：验证 URL -->
    <a :href="sanitizeUrl(userProvidedUrl)">点击</a>
    
    <!-- 安全：使用白名单 -->
    <a :href="getSafeUrl(userProvidedUrl)">点击</a>
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

// 使用白名单
const getSafeUrl = (url) => {
  const safeUrls = {
    'home': '/home',
    'about': '/about',
    'contact': '/contact'
  };
  
  return safeUrls[url] || '/';
};
</script>
```

### 问题 4：模板注入攻击

**描述**：如果模板本身来自不受信任的来源，攻击者可能注入恶意模板代码。

**风险**：高风险，可能导致任意代码执行，数据泄露等严重后果。

**解决方案**：

1. **避免动态模板**：不要从不受信任的来源加载模板
2. **使用静态模板**：使用编译时确定的静态模板
3. **验证模板来源**：如果必须使用动态模板，验证模板的来源和内容

```javascript
// 不安全：从不受信任的来源加载模板
const loadTemplate = async (url) => {
  const response = await fetch(url);
  const template = await response.text();
  // 直接使用模板
  return { template };
};

// 安全：使用静态模板或验证模板来源
const loadTemplate = async (url) => {
  // 验证 URL 是否在白名单中
  if (!isAllowedUrl(url)) {
    throw new Error('不允许的模板来源');
  }
  
  const response = await fetch(url);
  const template = await response.text();
  
  // 验证模板内容
  if (!isValidTemplate(template)) {
    throw new Error('无效的模板');
  }
  
  return { template };
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// vite.config.js 或 vue.config.js
export default {
  // 启用模板编译器选项
  template: {
    // 启用编译时优化
    compilerOptions: {
      // 启用作用域提升
      hoistStatic: true,
      // 启用静态提升
      staticHoisted: true
    }
  },
  
  // 配置安全头
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    }
  }
};
```

### 安全检查清单

- [x] 避免使用 `v-html`，除非内容来自可信来源
- [x] 对所有用户输入进行验证和清理
- [x] 避免在模板表达式中使用复杂的逻辑
- [x] 验证动态属性的值
- [x] 避免绑定危险的事件处理器属性
- [x] 避免从不受信任的来源加载模板
- [x] 使用 DOMPurify 等工具清理 HTML 内容
- [x] 配置内容安全策略 (CSP)
- [x] 定期更新 Vue 和相关依赖

## 📚 最佳实践

1. **使用数据绑定**：优先使用 Vue 的数据绑定 `{{ }}`，它会自动转义内容
2. **验证用户输入**：对所有用户输入进行严格验证，确保符合预期格式
3. **清理 HTML 内容**：如果必须使用 `v-html`，使用 DOMPurify 等工具清理内容
4. **使用计算属性**：将复杂逻辑移到计算属性中，便于管理和测试
5. **避免动态模板**：不要从不受信任的来源加载模板
6. **配置 CSP**：配置内容安全策略，限制脚本执行
7. **定期更新**：定期更新 Vue 和相关依赖，修复已知安全漏洞

## 📞 安全资源

- [Vue 官方文档 - 安全](https://vuejs.org/guide/best-practices/security.html)
- [OWASP XSS 防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify 官方文档](https://github.com/cure53/DOMPurify)
- [Mozilla CSP 指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 📝 更新日志

- 2024-01-01：初始版本，添加模板安全指南
- 2024-02-15：更新 Vue 3.7+ 模板安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践