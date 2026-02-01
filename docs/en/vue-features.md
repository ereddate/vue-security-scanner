# Vue Security Scanner Vue Features Guide

This comprehensive guide covers Vue-specific features and security scanning capabilities.

## Table of Contents

- [Overview](#overview)
- [Vue 2 Support](#vue-2-support)
- [Vue 3 Support](#vue-3-support)
- [Vue 3.5+ Features](#vue-35-features)
- [Vue 3.6+ Features](#vue-36-features)
- [Vue Router Security](#vue-router-security)
- [State Management Security](#state-management-security)
- [Nuxt.js Security](#nuxtjs-security)
- [Cross-Framework Support](#cross-framework-support)
- [Vue-Specific Vulnerabilities](#vue-specific-vulnerabilities)

## Overview

Vue Security Scanner provides comprehensive security coverage for Vue.js applications across all major versions and frameworks:

- **Vue 2.x**: Full support for Options API and Vue 2 features
- **Vue 3.x**: Complete support for Composition API and Vue 3 features
- **Vue 3.5+**: Enhanced support for latest Vue features
- **Vue 3.6+**: Support for Vapor mode and latest optimizations
- **Nuxt.js**: SSR and static generation security
- **Vue Router**: Routing security and navigation guards
- **State Management**: Vuex and Pinia security
- **Cross-Framework**: uni-app, Taro, and mini-program support

## Vue 2 Support

### Options API Security

Comprehensive security analysis for Vue 2 Options API.

#### Data Security

```javascript
// Vulnerable
export default {
  data() {
    return {
      userInput: '',
      userContent: ''
    }
  }
}
```

**Detection**: Scans for unsafe data properties and user input handling.

#### Methods Security

```javascript
// Vulnerable
export default {
  methods: {
    handleUserInput(input) {
      eval(input); // Dangerous
    },
    processContent(content) {
      this.userContent = content; // Unsanitized
    }
  }
}
```

**Detection**: Identifies dangerous method implementations.

#### Computed Properties Security

```javascript
// Vulnerable
export default {
  computed: {
    unsafeComputed() {
      return this.userInput + this.userContent; // Unsanitized
    }
  }
}
```

**Detection**: Checks computed properties for security issues.

#### Watchers Security

```javascript
// Vulnerable
export default {
  watch: {
    userInput(newVal) {
      eval(newVal); // Dangerous
    }
  }
}
```

**Detection**: Identifies unsafe watcher implementations.

### Vue 2 Directives

#### v-html Security

```vue
<!-- Vulnerable -->
<div v-html="userInput"></div>

<!-- Secure -->
<div>{{ sanitizedInput }}</div>
```

**Vulnerability ID**: `vue:xss-v-html`
**Severity**: High

#### v-text Security

```vue
<!-- Secure -->
<div v-text="sanitizedInput"></div>
```

**Detection**: Validates safe usage of v-text.

#### v-bind Security

```vue
<!-- Vulnerable -->
<a v-bind:href="userUrl">Click</a>

<!-- Secure -->
<a :href="safeUrl">Click</a>
```

**Vulnerability ID**: `vue:xss-v-bind`
**Severity**: High

#### v-for Security

```vue
<!-- Vulnerable -->
<div v-for="item in userItems" :key="item.id">
  {{ item.content }}
</div>

<!-- Secure -->
<div v-for="item in sanitizedItems" :key="item.id">
  {{ item.content }}
</div>
```

**Detection**: Validates loop source security.

### Vue 2 Lifecycle Hooks

#### Created Hook Security

```javascript
// Vulnerable
export default {
  created() {
    eval(this.userInput); // Dangerous
  }
}
```

**Detection**: Identifies security issues in lifecycle hooks.

#### Mounted Hook Security

```javascript
// Vulnerable
export default {
  mounted() {
    document.getElementById('app').innerHTML = this.userContent; // Dangerous
  }
}
```

**Detection**: Checks for unsafe DOM manipulation.

### Vue 2 Mixins

```javascript
// Vulnerable
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

**Detection**: Identifies security issues in mixins.

## Vue 3 Support

### Composition API Security

#### ref() Security

```javascript
// Vulnerable
import { ref } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    const unsafeMethod = () => {
      eval(userInput.value); // Dangerous
    };
    return { userInput, unsafeMethod };
  }
}
```

**Detection**: Validates ref usage and reactive references.

#### reactive() Security

```javascript
// Vulnerable
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({
      userInput: '',
      userContent: ''
    });
    const unsafeMethod = () => {
      eval(state.userInput); // Dangerous
    };
    return { state, unsafeMethod };
  }
}
```

**Detection**: Checks reactive objects for security issues.

#### computed() Security

```javascript
// Vulnerable
import { ref, computed } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    const unsafeComputed = computed(() => {
      return userInput.value + ' content'; // Unsanitized
    });
    return { userInput, unsafeComputed };
  }
}
```

**Detection**: Validates computed properties in Composition API.

#### watch() Security

```javascript
// Vulnerable
import { ref, watch } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    watch(userInput, (newVal) => {
      eval(newVal); // Dangerous
    });
    return { userInput };
  }
}
```

**Detection**: Identifies unsafe watcher implementations.

#### watchEffect() Security

```javascript
// Vulnerable
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    watchEffect(() => {
      eval(userInput.value); // Dangerous
    });
    return { userInput };
  }
}
```

**Detection**: Checks watchEffect for security issues.

### Vue 3 provide/inject

```javascript
// Vulnerable
// Parent component
export default {
  setup() {
    const userInput = ref('');
    provide('userInput', userInput);
  }
}

// Child component
export default {
  setup() {
    const userInput = inject('userInput');
    const unsafeMethod = () => {
      eval(userInput.value); // Dangerous
    };
  }
}
```

**Detection**: Validates dependency injection security.

### Vue 3 Teleport

```vue
<!-- Vulnerable -->
<Teleport to="body">
  <div v-html="userContent"></div>
</Teleport>

<!-- Secure -->
<Teleport to="body">
  <div>{{ sanitizedContent }}</div>
</Teleport>
```

**Detection**: Validates Teleport target element security.

### Vue 3 Suspense

```vue
<!-- Vulnerable -->
<Suspense>
  <template #default>
    <AsyncComponent :content="userContent" />
  </template>
</Suspense>

<!-- Secure -->
<Suspense>
  <template #default>
    <AsyncComponent :content="sanitizedContent" />
  </template>
</Suspense>
```

**Detection**: Checks async component handling security.

## Vue 3.5+ Features

### defineModel

```javascript
// Vulnerable
const userInput = defineModel();
const unsafeMethod = () => {
  eval(userInput.value); // Dangerous
};
```

**Detection**: Security detection for defineModel.

### defineAsyncComponent

```javascript
// Vulnerable
const AsyncComponent = defineAsyncComponent(() =>
  import('./UserComponent.vue')
);

// Secure
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./UserComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});
```

**Detection**: Security validation for defineAsyncComponent.

### v-memo

```vue
<!-- Vulnerable -->
<div v-for="item in userItems" v-memo="item.id" :key="item.id">
  {{ item.content }}
</div>

<!-- Secure -->
<div v-for="item in sanitizedItems" v-memo="item.id" :key="item.id">
  {{ item.content }}
</div>
```

**Detection**: Directive security checks for v-memo.

### defineOptions

```javascript
// Vulnerable
export default {
  name: 'UnsafeComponent',
  inheritAttrs: false,
  customOptions: {
    unsafeSetting: true
  }
}

// Secure
export default defineOptions({
  name: 'SafeComponent',
  inheritAttrs: false
});
```

**Detection**: Usage security analysis for defineOptions.

### Composition API 3.5+

```javascript
// Enhanced security detection for latest Composition API features
import { ref, computed, watch, watchEffect } from 'vue';

export default {
  setup() {
    const userInput = ref('');
    const derived = computed(() => userInput.value);
    
    watch(userInput, (newVal) => {
      // Security check
    });
    
    watchEffect(() => {
      // Security check
    });
    
    return { userInput, derived };
  }
}
```

**Detection**: Security coverage for latest Composition API features.

## Vue 3.6+ Features

### Vapor Mode

```javascript
// Vulnerable - Vapor mode configuration
const app = createApp(App);
app.use(VaporMode, {
  enable: true,
  optimization: 'aggressive' // May skip security checks
});

// Secure
const app = createApp(App);
app.use(VaporMode, {
  enable: true,
  optimization: 'balanced',
  securityChecks: true
});
```

**Detection**: Detects Vapor mode configuration and usage, prevents injection vulnerabilities.

### Reactive Performance Optimization

```javascript
// Vulnerable
import { reactive, shallowReactive } from 'vue';

const state = shallowReactive({
  userInput: ''
});

// Security check needed for performance optimizations
const unsafeMethod = () => {
  eval(state.userInput);
};
```

**Detection**: Evaluates data validation security under performance optimizations.

### Internal Type Safety

```javascript
// Detection of internal type usage
import { toRaw, markRaw } from 'vue';

const rawObject = toRaw(reactiveObject);
const frozenObject = markRaw(plainObject);

// Security assessment for type safety
```

**Detection**: Detects internal type usage, assesses type safety.

### Compiled Output Security

```javascript
// Vulnerable Vapor compiled output
// May skip runtime security checks

// Secure
// Ensure compiled output maintains security validations
```

**Detection**: Verifies Vapor compiled output security.

### Build Tool Integration

```javascript
// Vite with Vapor mode
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

**Detection**: Checks Vapor mode integration with Vite/Webpack security.

## Vue Router Security

### Route Definition Security

```javascript
// Vulnerable
const routes = [
  {
    path: '/user/:id',
    component: UserComponent,
    props: true // Passes route params directly
  }
];

// Secure
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

**Detection**: Inspects route configuration security.

### Route Parameters Security

```javascript
// Vulnerable
export default {
  mounted() {
    const userId = this.$route.params.id;
    this.userData = await fetchUser(userId); // Unvalidated
  }
};

// Secure
export default {
  async mounted() {
    const userId = this.$route.params.id;
    if (!isValidId(userId)) {
      throw new Error('Invalid user ID');
    }
    this.userData = await fetchUser(userId);
  }
};
```

**Detection**: Validates route parameter usage.

### Route Guards Security

```javascript
// Vulnerable
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next(); // No actual auth check
  } else {
    next();
  }
});

// Secure
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

**Detection**: Checks beforeEach, beforeResolve, afterEach implementations.

### Dynamic Routes Security

```javascript
// Vulnerable
router.addRoute({
  path: '/dynamic/:path',
  component: DynamicComponent
});

// Secure
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

**Detection**: Detects dynamic route addition security.

## State Management Security

### Vuex Security

#### Store Definition Security

```javascript
// Vulnerable
const store = new Vuex.Store({
  state: {
    userInput: '',
    userContent: ''
  },
  mutations: {
    setUserInput(state, input) {
      state.userInput = input; // Unsanitized
    }
  },
  actions: {
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId); // Unvalidated
      commit('setUser', user);
    }
  }
});
```

**Detection**: Validates store, mutations, actions, getters security.

#### Getters Security

```javascript
// Vulnerable
const store = new Vuex.Store({
  state: {
    userInput: ''
  },
  getters: {
    unsafeGetter: (state) => {
      return state.userInput + ' content'; // Unsanitized
    }
  }
});
```

**Detection**: Checks getter implementations for security.

### Pinia Security

#### Store Definition Security

```javascript
// Vulnerable
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInput: '',
    userContent: ''
  }),
  actions: {
    setUserInput(input) {
      this.userInput = input; // Unsanitized
    },
    async fetchUser(userId) {
      const user = await api.getUser(userId); // Unvalidated
      this.userData = user;
    }
  }
});
```

**Detection**: Verifies stores definition and usage security.

#### Setup Store Security

```javascript
// Vulnerable
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const userInput = ref('');
  const unsafeMethod = () => {
    eval(userInput.value); // Dangerous
  };
  return { userInput, unsafeMethod };
});
```

**Detection**: Validates setup store implementations.

### Dynamic Module Registration

```javascript
// Vulnerable
store.registerModule('dynamicModule', {
  state: {
    userInput: ''
  }
});

// Secure
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

**Detection**: Checks dynamic module registration security.

## Nuxt.js Security

### SSR Security

```javascript
// Vulnerable
export default {
  async asyncData({ params }) {
    const userId = params.id; // Unvalidated
    return { userData: await fetchUser(userId) };
  }
};

// Secure
export default {
  async asyncData({ params }) {
    const userId = params.id;
    if (!isValidId(userId)) {
      throw new Error('Invalid user ID');
    }
    return { userData: await fetchUser(userId) };
  }
};
```

**Detection**: Security scanning for server-side rendering.

### Static Generation Security

```javascript
// Vulnerable
export default {
  async generate({ params }) {
    const userId = params.id; // Unvalidated
    const user = await fetchUser(userId);
    return { user };
  }
};

// Secure
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

**Detection**: Security scanning for static site generation.

### Nuxt-specific Rules

- **Nuxt Page Security**: Checks page components for security issues
- **Nuxt Middleware Security**: Validates middleware implementations
- **Nuxt Plugin Security**: Checks plugin security
- **Nuxt Module Security**: Validates module configurations

## Cross-Framework Support

### uni-app Support

```vue
<!-- Vulnerable -->
<template>
  <view v-html="userContent"></view>
</template>

<!-- Secure -->
<template>
  <view>{{ sanitizedContent }}</view>
</template>
```

**Detection**: Security checks for uni-app specific APIs and components.

### Taro Support

```jsx
// Vulnerable
function App() {
  return <View dangerouslySetInnerHTML={{ __html: userContent }} />;
}

// Secure
function App() {
  return <View>{sanitizedContent}</View>;
}
```

**Detection**: Security checks for Taro framework features.

### Mini Program Support

#### WeChat Mini Program

```javascript
// Vulnerable
Page({
  data: {
    userInput: ''
  },
  onLoad(options) {
    this.setData({
      userInput: options.id // Unvalidated
    });
  }
});
```

**Detection**: Security scanning for WeChat Mini Program code.

#### Baidu Smart Program

```javascript
// Vulnerable
Page({
  data: {
    userInput: ''
  },
  onLoad(options) {
    this.setData({
      userInput: options.id // Unvalidated
    });
  }
});
```

**Detection**: Security scanning for Baidu Smart Programs.

## Vue-Specific Vulnerabilities

### Template Injection

```javascript
// Vulnerable
const template = userTemplate;
const compiled = Vue.compile(template);

// Secure
const template = '<div>{{ content }}</div>';
const compiled = Vue.compile(template);
```

**Vulnerability ID**: `vue:template-injection`
**Severity**: Critical

### Component Hijacking

```javascript
// Vulnerable
const userComponent = userProvidedComponent;
Vue.component('UserComponent', userComponent);

// Secure
if (isValidComponent(userComponent)) {
  Vue.component('UserComponent', userComponent);
}
```

**Detection**: Identifies potential component hijacking.

### Props Tampering

```vue
<!-- Vulnerable -->
<template>
  <div :data-user="userData">{{ userData }}</div>
</template>

<!-- Secure -->
<template>
  <div :data-user="sanitizedData">{{ sanitizedData }}</div>
</template>
```

**Detection**: Checks for props tampering vulnerabilities.

### Event Handler Injection

```vue
<!-- Vulnerable -->
<template>
  <button @[eventName]="userHandler">Click</button>
</template>

<!-- Secure -->
<template>
  <button @click="safeHandler">Click</button>
</template>
```

**Detection**: Identifies event handler injection vulnerabilities.

---

For more information, see:
- [Features Guide](./features.md)
- [Security Coverage](./security-coverage.md)
- [Configuration Guide](./configuration.md)
