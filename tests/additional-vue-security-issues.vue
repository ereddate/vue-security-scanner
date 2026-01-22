<!-- 测试新增的安全问题 -->
<template>
  <!-- 测试 v-text 指令安全问题 -->
  <div v-text="userProvidedContent"></div>
  
  <!-- 测试 v-bind 指令安全问题 -->
  <div v-bind:title="userInput">Content</div>
  
  <!-- 测试 v-for 安全问题 -->
  <li v-for="item in userInputList" :key="item.id">{{ item.content }}</li>
  
  <!-- 测试自定义指令 -->
  <div v-custom-directive="userInput">Content</div>
  
  <!-- 测试插槽安全 -->
  <my-component>
    <template v-slot:default="slotProps">
      <div>{{ slotProps.untrustedData }}</div>
    </template>
  </my-component>
</template>

<script>
// Vue 2/3 组件示例
import { mapState } from 'vuex';
import { defineStore } from 'pinia';

export default {
  name: 'SecurityTestComponent',
  computed: {
    // 测试 mapState 使用
    ...mapState(['userInput'])
  },
  
  data() {
    return {
      userInput: '',
      userInputList: []
    }
  },
  
  created() {
    // 测试动态路由参数使用
    const routeParam = this.$route.params.userInput;
    
    // 测试动态 mutation 名称
    this.$store.commit('mutation_' + routeParam, {});
    
    // 测试动态 action 名称
    this.$store.dispatch('action_' + routeParam, {});
    
    // 测试直接访问 store state
    const sensitiveData = this.$store.state.userData[routeParam];
    
    // 测试路由守卫中的潜在问题
    this.$router.beforeEach((to, from, next) => {
      // 使用用户输入进行路由判断
      if (to.path.includes(routeParam)) {
        next();
      }
    });
    
    // 测试动态路由添加
    this.$router.addRoute({
      path: '/dynamic/' + routeParam,
      component: () => import('../components/' + routeParam + '.vue')
    });
  },
  
  methods: {
    // 测试路由跳转中的安全问题
    navigateSafely(destination) {
      // 潜在的开放重定向问题
      this.$router.push({ path: destination });
    },
    
    // 测试自定义指令定义
    directives: {
      customDirective: {
        bind(el, binding) {
          // 潜在的DOM XSS问题
          el.innerHTML = binding.value; // 危险
        }
      }
    }
  }
}

// 测试 Pinia store
export const useUserStore = defineStore('user', {
  state: () => ({
    userData: {},
    sensitiveInfo: ''
  }),
  
  actions: {
    // 测试 action 中的安全问题
    updateUserInput(input) {
      // 直接使用用户输入而不验证
      this.userData = input;
    }
  }
});

// 测试路由配置中的安全问题
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id',  // 动态路由参数
      component: () => import('@/components/UserProfile.vue'),
      beforeEnter: (to, from, next) => {
        // 使用路由参数，可能存在安全问题
        const userId = to.params.id;
        next();
      }
    }
  ]
});

// 测试动态组件导入
async function loadComponent(componentName) {
  // 潜在的安全问题：根据用户输入动态导入
  const component = await import(`../components/${componentName}.vue`);
  return component;
}
</script>

<style scoped>
/* 样式中一般不会有直接的安全问题，除非动态生成样式 */
</style>