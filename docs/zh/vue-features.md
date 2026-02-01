# Vue 安全扫描工具 Vue 特性指南

本全面指南涵盖了 Vue 特定功能和安全扫描能力。

## 目录

- [概述](#概述)
- [Vue 2 支持](#vue-2-支持)
- [Vue 3 支持](#vue-3-支持)
- [Vue 3.5+ 功能](#vue-35-功能)
- [Vue 3.6+ 功能](#vue-36-功能)
- [Vue Router 安全](#vue-router-安全)
- [状态管理安全](#状态管理安全)
- [Nuxt.js 安全](#nuxtjs-安全)
- [跨框架支持](#跨框架支持)
- [Vue 特定漏洞](#vue-特定漏洞)

## 概述

Vue 安全扫描工具为所有主要版本和框架的 Vue.js 应用程序提供全面的安全覆盖：

- **Vue 2.x**：完全支持 Options API 和 Vue 2 功能
- **Vue 3.x**：完全支持 Composition API 和 Vue 3 功能
- **Vue 3.5+**：增强对最新 Vue 功能的支持
- **Vue 3.6+**：支持 Vapor 模式和最新优化
- **Nuxt.js**：SSR 和静态生成安全
- **Vue Router**：路由安全和导航守卫
- **状态管理**：Vuex 和 Pinia 安全
- **跨框架**：uni-app、Taro 和小程序支持

## Vue 2 支持

### Options API 安全

对 Vue 2 Options API 的全面安全分析。

#### 数据安全

```javascript
// 易受攻击
export default {
  data() {
    return {
      userInput: '',
      userContent: ''
    }
  }
}
```

**检测**：扫描不安全的数据属性和用户输入处理。

#### 方法安全

```javascript
// 易受攻击
export default {
  methods: {
    handleUserInput(input) {
      eval(input); // 危险
    },
    processContent(content) {
      this.userContent = content; // 未清理
    }
  }
}
```

**检测**：识别危险的方法实现。

#### 计算属性安全

```javascript
// 易受攻击
export default {
  computed: {
    unsafeComputed() {
      return this.userInput + this.userContent; // 未清理
    }
  }
}
```

**检测**：检查计算属性是否存在安全问题。

#### 监听器安全

```javascript
// 易受攻击
export default {
  watch: {
    userInput(newVal) {
      eval(newVal); // 危险
    }
  }
}
```

**检测**：识别不安全的监听器实现。

### Vue 2 指令

#### v-html 安全

```vue
<!-- 易受攻击 -->
<div v-html="userInput"></div>

<!-- 安全 -->
<div>{{ sanitizedInput }}</div>
```

**漏洞 ID**：`vue:xss-v-html`
**严重性**：高

#### v-text 安全

```vue
<!-- 安全 -->
<div v-text="sanitizedInput"></div>
```

**检测**：验证 v-text 的安全使用。

#### v-bind 安全

```vue
<!-- 易受攻击 -->
<a v-bind:href="userUrl">点击</a>

<!-- 安全 -->
<a :href="safeUrl">点击</a>
```

**漏洞 ID**：`vue:xss-v-bind`
**严重性**：高

#### v-for 安全

```vue
<!-- 易受攻击 -->
<div v-for="item in userItems" :key="item.id">
  {{ item.content }}
</div>

<!-- 安全 -->
<div v-for="item in sanitizedItems" :key="item.id">
  {{ item.content }}
</div>
```

**检测**：验证循环源安全性。

### Vue 2 生命周期钩子

#### Created 钩子安全

```javascript
// 易受攻击
export default {
  created() {
    eval(this.userInput); // 危险
  }
}
```

**检测**：识别生命周期钩子中的安全问题。

#### Mounted 钩子安全

```javascript
// 易受攻击
export default {
  mounted() {
    document.getElementById('app').innerHTML = this.userContent; // 危险
  }
}
```

**检测**：检查不安全的 DOM 操作。

### Vue 2 Mixins

```javascript
// 易受攻击
const unsafeMixin = {
  methods: {
    dangerousMethod() {
      eval(this.userInput);
    }
  }
}

export default {
  mixins: [unsafeMixin]
}
```

**检测**：识别 mixins 中的安全问题。

## Vue 3 支持

### Composition API 安全

#### ref() 安全

```javascript
// 易受攻击
import { ref } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    const unsafeMethod = () => {
      eval(userInput.value); // 危险
    };
    return { userInput, unsafeMethod };
  }
}
```

**检测**：验证 ref 使用和响应式引用。

#### reactive() 安全

```javascript
// 易受攻击
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({
      userInput: '',
      userContent: ''
    });
    const unsafeMethod = () => {
      eval(state.userInput); // 危险
    };
    return { state, unsafeMethod };
  }
}
```

**检测**：检查响应式对象是否存在安全问题。

#### computed() 安全

```javascript
// 易受攻击
import { ref, computed } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    const unsafeComputed = computed(() => {
      return userInput.value + ' content'; // 未清理
    });
    return { userInput, unsafeComputed };
  }
}
```

**检测**：验证 Composition API 中的计算属性。

#### watch() 安全

```javascript
// 易受攻击
import { ref, watch } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    watch(userInput, (newVal) => {
      eval(newVal); // 危险
    });
    return { userInput };
  }
}
```

**检测**：识别不安全的监听器实现。

#### watchEffect() 安全

```javascript
// 易受攻击
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    watchEffect(() => {
      eval(userInput.value); // 危险
    });
    return { userInput };
  }
}
```

**检测**：检查 watchEffect 是否存在安全问题。

### Vue 3 provide/inject

```javascript
// 易受攻击
// 父组件
export default {
  setup() {
    const userInput = ref('');
    provide('userInput', userInput);
  }
}

// 子组件
export default {
  setup() {
    const userInput = inject('userInput');
    const unsafeMethod = () => {
      eval(userInput.value); // 危险
    };
  }
}
```

**检测**：验证依赖注入安全性。

### Vue 3 Teleport

```vue
<!-- 易受攻击 -->
<Teleport to="body">
  <div v-html="userContent"></div>
</Teleport>

<!-- 安全 -->
<Teleport to="body">
  <div>{{ sanitizedContent }}</div>
</Teleport>
```

**检测**：验证 Teleport 目标元素安全性。

### Vue 3 Suspense

```vue
<!-- 易受攻击 -->
<Suspense>
  <template #default>
    <AsyncComponent :content="userContent" />
  </template>
</Suspense>

<!-- 安全 -->
<Suspense>
  <template #default>
    <AsyncComponent :content="sanitizedContent" />
  </template>
</Suspense>
```

**检测**：检查异步组件处理安全性。

## Vue 3.5+ 功能

### defineModel

```javascript
// 易受攻击
const userInput = defineModel();
const unsafeMethod = () => {
  eval(userInput.value); // 危险
};
```

**检测**：defineModel 的安全检测。

### defineAsyncComponent

```javascript
// 易受攻击
const AsyncComponent = defineAsyncComponent(() =>
  import('./UserComponent.vue')
);

// 安全
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./UserComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});
```

**检测**：defineAsyncComponent 的安全验证。

### v-memo

```vue
<!-- 易受攻击 -->
<div v-for="item in userItems" v-memo="item.id" :key="item.id">
  {{ item.content }}
</div>

<!-- 安全 -->
<div v-for="item in sanitizedItems" v-memo="item.id" :key="item.id">
  {{ item.content }}
</div>
```

**检测**：v-memo 的指令安全检查。

### defineOptions

```javascript
// 易受攻击
export default {
  name: 'UnsafeComponent',
  inheritAttrs: false,
  customOptions: {
    unsafeSetting: true
  }
}

// 安全
export default defineOptions({
  name: 'SafeComponent',
  inheritAttrs: false
});
```

**检测**：defineOptions 的使用安全分析。

### Composition API 3.5+

```javascript
// 对最新 Composition API 功能的增强安全检测
import { ref, computed, watch, watchEffect } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    const derived = computed(() => userInput.value);
    
    watch(userInput, (newVal) => {
      // 安全检查
    });
    
    watchEffect(() => {
      // 安全检查
    });
    
    return { userInput, derived };
  }
}
```

**检测**：最新 Composition API 功能的安全覆盖。

## Vue 3.6+ 功能

### Vapor 模式

```javascript
// 易受攻击 - Vapor 模式配置
const app = createApp(App);
app.use(VaporMode, {
  enable: true,
  optimization: 'aggressive' // 可能跳过安全检查
});

// 安全
const app = createApp(App);
app.use(VaporMode, {
  enable: true,
  optimization: 'balanced',
  securityChecks: true
});
```

**检测**：检测 Vapor 模式配置和使用，防止注入漏洞。

### 响应式性能优化

```javascript
// 易受攻击
import { reactive, shallowReactive } from 'vue';

const state = shallowReactive({
  userInput: ''
});

// 性能优化需要安全检查
const unsafeMethod = () => {
  eval(state.userInput);
};
```

**检测**：评估性能优化下的数据验证安全性。

### 内部类型安全

```javascript
// 内部类型使用的检测
import { toRaw, markRaw } from 'vue';

const rawObject = toRaw(reactiveObject);
const frozenObject = markRaw(plainObject);

// 类型安全的安全评估
```

**检测**：检测内部类型使用，评估类型安全性。

### 编译输出安全

```javascript
// 易受攻击的 Vapor 编译输出
// 可能跳过运行时安全检查

// 安全
// 确保编译输出保持安全验证
```

**检测**：验证 Vapor 编译输出安全性。

### 构建工具集成

```javascript
// 带有 Vapor 模式的 Vite
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          vapor: true
        }
      }
    })
  ]
});
```

**检测**：检查 Vapor 模式与 Vite/Webpack 集成安全性。

## Vue Router 安全

### 路由定义安全

```javascript
// 易受攻击
const routes = [
  {
    path: '/user/:id',
    component: UserComponent,
    props: true // 直接传递路由参数
  }
];

// 安全
const routes = [
  {
    path: '/user/:id',
    component: UserComponent,
    props: (route) => ({
      id: sanitizeId(route.params.id)
    })
  }
];
```

**检测**：检查路由配置安全性。

### 路由参数安全

```javascript
// 易受攻击
export default {
  mounted() {
    const userId = this.$route.params.id;
    this.userData = await fetchUser(userId); // 未验证
  }
};

// 安全
export default {
  async mounted() {
    const userId = this.$route.params.id;
    if (!isValidId(userId)) {
      throw new Error('无效的用户 ID');
    }
    this.userData = await fetchUser(userId);
  }
};
```

**检测**：验证路由参数使用。

### 路由守卫安全

```javascript
// 易受攻击
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next(); // 没有实际的身份验证检查
  } else {
    next();
  }
});

// 安全
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      next('/login');
      return;
    }
  }
  next();
});
```

**检测**：检查 beforeEach、beforeResolve、afterEach 实现。

### 动态路由安全

```javascript
// 易受攻击
router.addRoute({
  path: '/dynamic/:path',
  component: DynamicComponent
});

// 安全
router.addRoute({
  path: '/dynamic/:path',
  component: DynamicComponent,
  beforeEnter: (to, from, next) => {
    if (!isValidPath(to.params.path)) {
      next('/404');
      return;
    }
    next();
  }
});
```

**检测**：检测动态路由添加安全性。

## 状态管理安全

### Vuex 安全

#### Store 定义安全

```javascript
// 易受攻击
const store = new Vuex.Store({
  state: {
    userInput: '',
    userContent: ''
  },
  mutations: {
    setUserInput(state, input) {
      state.userInput = input; // 未清理
    }
  },
  actions: {
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId); // 未验证
      commit('setUser', user);
    }
  }
});
```

**检测**：验证 store、mutations、actions、getters 安全性。

#### Getters 安全

```javascript
// 易受攻击
const store = new Vuex.Store({
  state: {
    userInput: ''
  },
  getters: {
    unsafeGetter: (state) => {
      return state.userInput + ' content'; // 未清理
    }
  }
});
```

**检测**：检查 getter 实现是否存在安全问题。

### Pinia 安全

#### Store 定义安全

```javascript
// 易受攻击
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInput: '',
    userContent: ''
  }),
  actions: {
    setUserInput(input) {
      this.userInput = input; // 未清理
    },
    async fetchUser(userId) {
      const user = await api.getUser(userId); // 未验证
      this.userData = user;
    }
  }
});
```

**检测**：验证 stores 定义和使用安全性。

#### Setup Store 安全

```javascript
// 易受攻击
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const userInput = ref('');
  const unsafeMethod = () => {
    eval(userInput.value); // 危险
  };
  return { userInput, unsafeMethod };
});
```

**检测**：验证 setup store 实现。

### 动态模块注册

```javascript
// 易受攻击
store.registerModule('dynamicModule', {
  state: {
    userInput: ''
  }
});

// 安全
store.registerModule('dynamicModule', {
  state: {
    userInput: ''
  },
  mutations: {
    setUserInput(state, input) {
      state.userInput = sanitize(input);
    }
  }
});
```

**检测**：检查动态模块注册安全性。

## Nuxt.js 安全

### SSR 安全

```javascript
// 易受攻击
export default {
  async asyncData({ params }) {
    const userId = params.id; // 未验证
    return { userData: await fetchUser(userId) };
  }
};

// 安全
export default {
  async asyncData({ params }) {
    const userId = params.id;
    if (!isValidId(userId)) {
      throw new Error('无效的用户 ID');
    }
    return { userData: await fetchUser(userId) };
  }
};
```

**检测**：服务器端渲染的安全扫描。

### 静态生成安全

```javascript
// 易受攻击
export default {
  async generate({ params }) {
    const userId = params.id; // 未验证
    const user = await fetchUser(userId);
    return { user };
  }
};

// 安全
export default {
  async generate({ params }) {
    const userId = params.id;
    if (!isValidId(userId)) {
      return {};
    }
    const user = await fetchUser(userId);
    return { user };
  }
};
```

**检测**：静态站点生成的安全扫描。

### Nuxt 特定规则

- **Nuxt 页面安全**：检查页面组件是否存在安全问题
- **Nuxt 中间件安全**：验证中间件实现
- **Nuxt 插件安全**：检查插件安全性
- **Nuxt 模块安全**：验证模块配置

## 跨框架支持

### uni-app 支持

```vue
<!-- 易受攻击 -->
<template>
  <view v-html="userContent"></view>
</template>

<!-- 安全 -->
<template>
  <view>{{ sanitizedContent }}</view>
</template>
```

**检测**：uni-app 特定 API 和组件的安全检查。

### Taro 支持

```jsx
// 易受攻击
function App() {
  return <View dangerouslySetInnerHTML={{ __html: userContent }} />;
}

// 安全
function App() {
  return <View>{sanitizedContent}</View>;
}
```

**检测**：Taro 框架功能的安全检查。

### 小程序支持

#### 微信小程序

```javascript
// 易受攻击
Page({
  data: {
    userInput: ''
  },
  onLoad(options) {
    this.setData({
      userInput: options.id // 未验证
    });
  }
});
```

**检测**：微信小程序代码的安全扫描。

#### 百度智能小程序

```javascript
// 易受攻击
Page({
  data: {
    userInput: ''
  },
  onLoad(options) {
    this.setData({
      userInput: options.id // 未验证
    });
  }
});
```

**检测**：百度智能程序的安全扫描。

## Vue 特定漏洞

### 模板注入

```javascript
// 易受攻击
const template = userTemplate;
const compiled = Vue.compile(template);

// 安全
const template = '<div>{{ content }}</div>';
const compiled = Vue.compile(template);
```

**漏洞 ID**：`vue:template-injection`
**严重性**：严重

### 组件劫持

```javascript
// 易受攻击
const userComponent = userProvidedComponent;
Vue.component('UserComponent', userComponent);

// 安全
if (isValidComponent(userComponent)) {
  Vue.component('UserComponent', userComponent);
}
```

**检测**：识别潜在的组件劫持。

### Props 篡改

```vue
<!-- 易受攻击 -->
<template>
  <div :data-user="userData">{{ userData }}</div>
</template>

<!-- 安全 -->
<template>
  <div :data-user="sanitizedData">{{ sanitizedData }}</div>
</template>
```

**检测**：检查 props 篡改漏洞。

### 事件处理器注入

```vue
<!-- 易受攻击 -->
<template>
  <button @[eventName]="userHandler">点击</button>
</template>

<!-- 安全 -->
<template>
  <button @click="safeHandler">点击</button>
</template>
```

**检测**：识别事件处理器注入漏洞。

---

如需更多信息，请参阅：
- [功能指南](./features.md)
- [安全覆盖](./security-coverage.md)
- [配置指南](./configuration.md)
