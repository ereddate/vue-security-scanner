<!-- Vue 2/3 兼容的安全问题测试文件 -->
<template>
  <!-- Vue 2/3 都有的问题：v-html 使用 -->
  <div v-html="userContent"></div>
  
  <!-- Vue 2/3 都有的问题：内联事件处理器 -->
  <button onclick="executeUserFunction()">Click me</button>
  
  <!-- Vue 2 特有的：过滤器中的潜在问题 -->
  <p>{{ message | upperCaseFilter }}</p>
  
  <!-- Vue 3 Composition API 的潜在问题 -->
  <div>{{ dynamicComponent }}</div>
</template>

<script>
// Vue 2 Options API
export default {
  name: 'SecurityTestComponent',
  data() {
    return {
      userContent: '<script>alert("XSS")</script>', // 硬编码的潜在危险内容
      message: 'Hello Vue'
    }
  },
  
  // Vue 2 过滤器定义
  filters: {
    upperCaseFilter: function(value) {
      // 潜在的过滤器安全问题
      if (!value) return ''
      return value.toString()
    }
  },
  
  methods: {
    executeUserFunction() {
      // 危险的 eval 使用
      eval(this.userInput);
    },
    
    // Vue 2 和 Vue 3 都可能有的路由参数问题
    handleRouteParams() {
      // 不安全的路由参数使用
      const param = this.$route.params.userInput;
      document.getElementById(param); // 潜在DOM XSS
    },
    
    // Vue 2/3 都有的动态组件问题
    loadComponent(componentName) {
      // 动态组件加载 - 潜在安全问题
      this.dynamicComponent = componentName;
    }
  },
  
  // Vue 2 生命周期钩子
  mounted() {
    // 直接操作DOM - 潜在XSS
    const div = document.createElement('div');
    div.innerHTML = this.userContent; // 危险
    
    // 不安全的路由使用
    this.$router.push({ path: this.$route.query.redirect }); // 潜在开放重定向
  }
}

// Vue 3 Composition API 示例
import { ref, reactive, computed } from 'vue';

export function useSecurityTest() {
  const userInput = ref('');
  const state = reactive({
    data: {}
  });
  
  // Vue 3 Composition API 中的潜在问题
  const processedData = computed(() => {
    // 危险的动态属性访问
    return state[userInput.value]; // 潜在原型污染
  });
  
  // Vue 3 中使用 v-html 的方式
  function renderUserContent(content) {
    // 直接操作DOM - 潜在XSS
    const el = document.querySelector('#content');
    el.innerHTML = content; // 危险
  }
  
  // Vue 3 Teleport 使用中的潜在问题
  function unsafeTeleport(target) {
    // 不安全的teleport目标
    return `<teleport to="${target}">Content</teleport>`;
  }
  
  return {
    userInput,
    processedData,
    renderUserContent,
    unsafeTeleport
  };
}

// Vue 2/3 都可能有的混入(Mixin)问题
export const securityMixin = {
  methods: {
    unsafeMixinMethod(data) {
      // 在混入中使用eval - 危险
      return eval(data);
    }
  }
};

// Vue 3 的 provide/inject 潜在问题
import { provide, inject } from 'vue';

// 不安全的provide/inject使用
export function setupProvideInject() {
  // 提供可能被污染的数据
  provide('userData', window.location.href); // 从不可信源获取数据
  
  const injectedData = inject('userData');
  // 注入后直接使用 - 潜在问题
  document.write(injectedData); // 危险
}
</script>

<style scoped>
/* 样式标签中一般不会有安全问题，但如果动态生成样式则可能有 */
.dangerous-style {
  /* 通常不会直接在这里造成安全问题 */
}
</style>