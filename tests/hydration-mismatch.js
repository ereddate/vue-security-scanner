// Hydration Mismatch 漏洞示例文件

// 示例 1: 服务端渲染与客户端不一致
export function hydrationMismatchExample1() {
  const app = createSSRApp({
    data() {
      return {
        date: new Date()
      };
    },
    template: '<div>{{ date }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 2: 随机数导致不匹配
export function hydrationMismatchExample2() {
  const app = createSSRApp({
    data() {
      return {
        random: Math.random()
      };
    },
    template: '<div>{{ random }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 3: 条件渲染不一致
export function hydrationMismatchExample3() {
  const app = createSSRApp({
    data() {
      return {
        isMobile: false
      };
    },
    mounted() {
      this.isMobile = window.innerWidth < 768;
    },
    template: '<div v-if="isMobile">Mobile</div><div v-else>Desktop</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 4: 异步数据加载不一致
export function hydrationMismatchExample4() {
  const app = createSSRApp({
    data() {
      return {
        user: null
      };
    },
    async mounted() {
      this.user = await fetchUser();
    },
    template: '<div>{{ user ? user.name : 'Loading...' }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 5: 浏览器特定 API
export function hydrationMismatchExample5() {
  const app = createSSRApp({
    data() {
      return {
        userAgent: ''
      };
    },
    mounted() {
      this.userAgent = navigator.userAgent;
    },
    template: '<div>{{ userAgent }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 6: 本地存储不一致
export function hydrationMismatchExample6() {
  const app = createSSRApp({
    data() {
      return {
        theme: 'light'
      };
    },
    mounted() {
      this.theme = localStorage.getItem('theme') || 'light';
    },
    template: '<div :class="theme">Content</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 7: Cookie 不一致
export function hydrationMismatchExample7() {
  const app = createSSRApp({
    data() {
      return {
        username: ''
      };
    },
    mounted() {
      this.username = document.cookie.match(/username=([^;]+)/)?.[1] || '';
    },
    template: '<div>{{ username }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 8: 时间戳不一致
export function hydrationMismatchExample8() {
  const app = createSSRApp({
    data() {
      return {
        timestamp: Date.now()
      };
    },
    template: '<div>{{ timestamp }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 9: 环境变量不一致
export function hydrationMismatchExample9() {
  const app = createSSRApp({
    data() {
      return {
        env: process.env.NODE_ENV
      };
    },
    template: '<div>{{ env }}</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}

// 示例 10: 动态类名不一致
export function hydrationMismatchExample10() {
  const app = createSSRApp({
    data() {
      return {
        classes: []
      };
    },
    mounted() {
      this.classes = ['class1', 'class2'];
    },
    template: '<div :class="classes">Content</div>'
  });
  
  renderToString(app);
  
  app.mount('#app');
}
