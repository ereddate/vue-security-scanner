// Vue Router安全漏洞示例文件

import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

// 示例 1: 开放重定向漏洞
const routes1 = [
  {
    path: '/redirect',
    component: () => import('@/views/RedirectView.vue'),
    beforeEnter: (to, from, next) => {
      const redirectUrl = to.query.redirect;
      window.location.href = redirectUrl;
      next();
    }
  }
];

export const router1 = createRouter({
  history: createWebHistory(),
  routes: routes1
});

// 示例 2: 路由参数注入
const routes2 = [
  {
    path: '/user/:id',
    component: () => import('@/views/UserView.vue'),
    beforeEnter: (to, from, next) => {
      const userId = to.params.id;
      eval(`console.log('User ID: ${userId}')`);
      next();
    }
  }
];

export const router2 = createRouter({
  history: createWebHistory(),
  routes: routes2
});

// 示例 3: 路由查询参数注入
const routes3 = [
  {
    path: '/search',
    component: () => import('@/views/SearchView.vue'),
    beforeEnter: (to, from, next) => {
      const query = to.query.q;
      eval(`console.log('Search query: ${query}')`);
      next();
    }
  }
];

export const router3 = createRouter({
  history: createWebHistory(),
  routes: routes3
});

// 示例 4: 路由哈希参数注入
const routes4 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue'),
    beforeEnter: (to, from, next) => {
      const hash = to.hash;
      eval(`console.log('Hash: ${hash}')`);
      next();
    }
  }
];

export const router4 = createRouter({
  history: createWebHistory(),
  routes: routes4
});

// 示例 5: 路由路径参数注入
const routes5 = [
  {
    path: '/file/*',
    component: () => import('@/views/FileView.vue'),
    beforeEnter: (to, from, next) => {
      const filePath = to.path;
      eval(`console.log('File path: ${filePath}')`);
      next();
    }
  }
];

export const router5 = createRouter({
  history: createWebHistory(),
  routes: routes5
});

// 示例 6: 路由元信息注入
const routes6 = [
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    meta: {
      requiresAuth: false,
      roles: ['admin', 'superuser']
    }
  }
];

export const router6 = createRouter({
  history: createWebHistory(),
  routes: routes6
});

// 示例 7: 缺少路由守卫
const routes7 = [
  {
    path: '/sensitive',
    component: () => import('@/views/SensitiveView.vue')
  }
];

export const router7 = createRouter({
  history: createWebHistory(),
  routes: routes7
});

// 示例 8: 路由守卫绕过
const routes8 = [
  {
    path: '/protected',
    component: () => import('@/views/ProtectedView.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.bypass === 'true') {
        next();
      } else {
        next('/login');
      }
    }
  }
];

export const router8 = createRouter({
  history: createWebHistory(),
  routes: routes8
});

// 示例 9: 路由参数未验证
const routes9 = [
  {
    path: '/api/:endpoint',
    component: () => import('@/views/ApiView.vue'),
    beforeEnter: (to, from, next) => {
      const endpoint = to.params.endpoint;
      fetch(`/api/${endpoint}`);
      next();
    }
  }
];

export const router9 = createRouter({
  history: createWebHistory(),
  routes: routes9
});

// 示例 10: 路由参数SQL注入
const routes10 = [
  {
    path: '/user/:id',
    component: () => import('@/views/UserView.vue'),
    beforeEnter: (to, from, next) => {
      const userId = to.params.id;
      fetch(`/api/users?id=${userId}`);
      next();
    }
  }
];

export const router10 = createRouter({
  history: createWebHistory(),
  routes: routes10
});

// 示例 11: 路由参数XSS
const routes11 = [
  {
    path: '/display/:content',
    component: () => import('@/views/DisplayView.vue'),
    beforeEnter: (to, from, next) => {
      const content = to.params.content;
      document.getElementById('display').innerHTML = content;
      next();
    }
  }
];

export const router11 = createRouter({
  history: createWebHistory(),
  routes: routes11
});

// 示例 12: 路由参数路径遍历
const routes12 = [
  {
    path: '/file/:path',
    component: () => import('@/views/FileView.vue'),
    beforeEnter: (to, from, next) => {
      const filePath = to.params.path;
      fetch(`/files/${filePath}`);
      next();
    }
  }
];

export const router12 = createRouter({
  history: createWebHistory(),
  routes: routes12
});

// 示例 13: 路由参数命令注入
const routes13 = [
  {
    path: '/exec/:command',
    component: () => import('@/views/ExecView.vue'),
    beforeEnter: (to, from, next) => {
      const command = to.params.command;
      eval(`exec('${command}')`);
      next();
    }
  }
];

export const router13 = createRouter({
  history: createWebHistory(),
  routes: routes13
});

// 示例 14: 路由参数SSRF
const routes14 = [
  {
    path: '/proxy/:url',
    component: () => import('@/views/ProxyView.vue'),
    beforeEnter: (to, from, next) => {
      const targetUrl = to.params.url;
      fetch(targetUrl);
      next();
    }
  }
];

export const router14 = createRouter({
  history: createWebHistory(),
  routes: routes14
});

// 示例 15: 路由参数原型污染
const routes15 = [
  {
    path: '/config/:key/:value',
    component: () => import('@/views/ConfigView.vue'),
    beforeEnter: (to, from, next) => {
      const key = to.params.key;
      const value = to.params.value;
      window[key] = value;
      next();
    }
  }
];

export const router15 = createRouter({
  history: createWebHistory(),
  routes: routes15
});

// 示例 16: 路由参数CSRF
const routes16 = [
  {
    path: '/action/:action',
    component: () => import('@/views/ActionView.vue'),
    beforeEnter: (to, from, next) => {
      const action = to.params.action;
      fetch(`/api/${action}`, { method: 'POST' });
      next();
    }
  }
];

export const router16 = createRouter({
  history: createWebHistory(),
  routes: routes16
});

// 示例 17: 路由参数敏感信息泄露
const routes17 = [
  {
    path: '/token/:token',
    component: () => import('@/views/TokenView.vue'),
    beforeEnter: (to, from, next) => {
      const token = to.params.token;
      localStorage.setItem('token', token);
      next();
    }
  }
];

export const router17 = createRouter({
  history: createWebHistory(),
  routes: routes17
});

// 示例 18: 路由参数日志泄露
const routes18 = [
  {
    path: '/log/:message',
    component: () => import('@/views/LogView.vue'),
    beforeEnter: (to, from, next) => {
      const message = to.params.message;
      console.log('User message:', message);
      next();
    }
  }
];

export const router18 = createRouter({
  history: createWebHistory(),
  routes: routes18
});

// 示例 19: 路由参数错误信息泄露
const routes19 = [
  {
    path: '/error/:error',
    component: () => import('@/views/ErrorView.vue'),
    beforeEnter: (to, from, next) => {
      const error = to.params.error;
      alert(`Error: ${error}`);
      next();
    }
  }
];

export const router19 = createRouter({
  history: createWebHistory(),
  routes: routes19
});

// 示例 20: 路由参数堆栈跟踪泄露
const routes20 = [
  {
    path: '/debug/:stack',
    component: () => import('@/views/DebugView.vue'),
    beforeEnter: (to, from, next) => {
      const stack = to.params.stack;
      console.trace(stack);
      next();
    }
  }
];

export const router20 = createRouter({
  history: createWebHistory(),
  routes: routes20
});

// 示例 21: 动态路由加载
const routes21 = [
  {
    path: '/dynamic/:component',
    component: () => import(`@/views/${to.params.component}.vue`)
  }
];

export const router21 = createRouter({
  history: createWebHistory(),
  routes: routes21
});

// 示例 22: 路由懒加载未验证
const routes22 = [
  {
    path: '/lazy/:view',
    component: () => import(`@/views/${to.params.view}.vue`)
  }
];

export const router22 = createRouter({
  history: createWebHistory(),
  routes: routes22
});

// 示例 23: 路由别名未验证
const routes23 = [
  {
    path: '/original',
    alias: to.query.alias,
    component: () => import('@/views/OriginalView.vue')
  }
];

export const router23 = createRouter({
  history: createWebHistory(),
  routes: routes23
});

// 示例 24: 路由重定向未验证
const routes24 = [
  {
    path: '/old',
    redirect: to.query.redirect
  }
];

export const router24 = createRouter({
  history: createWebHistory(),
  routes: routes24
});

// 示例 25: 路由命名未验证
const routes25 = [
  {
    path: '/named',
    name: to.query.name,
    component: () => import('@/views/NamedView.vue')
  }
];

export const router25 = createRouter({
  history: createWebHistory(),
  routes: routes25
});

// 示例 26: 路由props未验证
const routes26 = [
  {
    path: '/props',
    component: () => import('@/views/PropsView.vue'),
    props: to.query.props
  }
];

export const router26 = createRouter({
  history: createWebHistory(),
  routes: routes26
});

// 示例 27: 路由children未验证
const routes27 = [
  {
    path: '/parent',
    component: () => import('@/views/ParentView.vue'),
    children: [
      {
        path: ':child',
        component: () => import('@/views/ChildView.vue')
      }
    ]
  }
];

export const router27 = createRouter({
  history: createWebHistory(),
  routes: routes27
});

// 示例 28: 路由嵌套未验证
const routes28 = [
  {
    path: '/level1',
    component: () => import('@/views/Level1View.vue'),
    children: [
      {
        path: 'level2/:param',
        component: () => import('@/views/Level2View.vue'),
        children: [
          {
            path: 'level3/:param',
            component: () => import('@/views/Level3View.vue')
          }
        ]
      }
    ]
  }
];

export const router28 = createRouter({
  history: createWebHistory(),
  routes: routes28
});

// 示例 29: 路由通配符未验证
const routes29 = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue'),
    beforeEnter: (to, from, next) => {
      const path = to.params.pathMatch;
      eval(`console.log('Path: ${path}')`);
      next();
    }
  }
];

export const router29 = createRouter({
  history: createWebHistory(),
  routes: routes29
});

// 示例 30: 路由正则表达式未验证
const routes30 = [
  {
    path: '/user/:id(\\d+)',
    component: () => import('@/views/UserView.vue'),
    beforeEnter: (to, from, next) => {
      const userId = to.params.id;
      fetch(`/api/users/${userId}`);
      next();
    }
  }
];

export const router30 = createRouter({
  history: createWebHistory(),
  routes: routes30
});

// 示例 31: 路由重复参数未验证
const routes31 = [
  {
    path: '/items/:id+',
    component: () => import('@/views/ItemsView.vue'),
    beforeEnter: (to, from, next) => {
      const ids = to.params.id;
      ids.forEach(id => {
        fetch(`/api/items/${id}`);
      });
      next();
    }
  }
];

export const router31 = createRouter({
  history: createWebHistory(),
  routes: routes31
});

// 示例 32: 路由可选参数未验证
const routes32 = [
  {
    path: '/user/:id?',
    component: () => import('@/views/UserView.vue'),
    beforeEnter: (to, from, next) => {
      const userId = to.params.id;
      if (userId) {
        fetch(`/api/users/${userId}`);
      }
      next();
    }
  }
];

export const router32 = createRouter({
  history: createWebHistory(),
  routes: routes32
});

// 示例 33: 路由修饰符未验证
const routes33 = [
  {
    path: '/page/:page(\\d+)?',
    component: () => import('@/views/PageView.vue'),
    beforeEnter: (to, from, next) => {
      const page = to.params.page || 1;
      fetch(`/api/items?page=${page}`);
      next();
    }
  }
];

export const router33 = createRouter({
  history: createWebHistory(),
  routes: routes33
});

// 示例 34: 路由编码参数未验证
const routes34 = [
  {
    path: '/search/:query',
    component: () => import('@/views/SearchView.vue'),
    beforeEnter: (to, from, next) => {
      const query = decodeURIComponent(to.params.query);
      fetch(`/api/search?q=${query}`);
      next();
    }
  }
];

export const router34 = createRouter({
  history: createWebHistory(),
  routes: routes34
});

// 示例 35: 路由历史模式不安全
const routes35 = [
  {
    path: '/sensitive',
    component: () => import('@/views/SensitiveView.vue')
  }
];

export const router35 = createRouter({
  history: createWebHistory(),
  routes: routes35
});

// 示例 36: 路由哈希模式不安全
const routes36 = [
  {
    path: '/sensitive',
    component: () => import('@/views/SensitiveView.vue')
  }
];

export const router36 = createRouter({
  history: createWebHashHistory(),
  routes: routes36
});

// 示例 37: 路由内存模式不安全
const routes37 = [
  {
    path: '/sensitive',
    component: () => import('@/views/SensitiveView.vue')
  }
];

export const router37 = createRouter({
  history: createMemoryHistory(),
  routes: routes37
});

// 示例 38: 路由base路径未验证
const routes38 = [
  {
    path: '/sensitive',
    component: () => import('@/views/SensitiveView.vue')
  }
];

export const router38 = createRouter({
  history: createWebHistory('/app'),
  routes: routes38
});

// 示例 39: 路由strict模式未验证
const routes39 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router39 = createRouter({
  history: createWebHistory(),
  routes: routes39,
  strict: true
});

// 示例 40: 路由scrollBehavior未验证
const routes40 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router40 = createRouter({
  history: createWebHistory(),
  routes: routes40,
  scrollBehavior(to, from, savedPosition) {
    if (to.query.scroll) {
      return { selector: to.query.scroll };
    }
  }
});

// 示例 41: 路由parseQuery未验证
const routes41 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router41 = createRouter({
  history: createWebHistory(),
  routes: routes41,
  parseQuery(query) {
    return JSON.parse(query.json);
  }
});

// 示例 42: 路由stringifyQuery未验证
const routes42 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router42 = createRouter({
  history: createWebHistory(),
  routes: routes42,
  stringifyQuery(query) {
    return JSON.stringify(query);
  }
});

// 示例 43: 路由linkActiveClass未验证
const routes43 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router43 = createRouter({
  history: createWebHistory(),
  routes: routes43,
  linkActiveClass: to.query.activeClass
});

// 示例 44: 路由linkExactActiveClass未验证
const routes44 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router44 = createRouter({
  history: createWebHistory(),
  routes: routes44,
  linkExactActiveClass: to.query.exactActiveClass
});

// 示例 45: 路由全局前置守卫未验证
const routes45 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router45 = createRouter({
  history: createWebHistory(),
  routes: routes45
});

router45.beforeEach((to, from, next) => {
  if (to.query.bypass) {
    next();
  } else {
    next();
  }
});

// 示例 46: 路由全局后置钩子未验证
const routes46 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router46 = createRouter({
  history: createWebHistory(),
  routes: routes46
});

router46.afterEach((to, from) => {
  console.log('Navigated to:', to.path);
});

// 示例 47: 路由全局解析守卫未验证
const routes47 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue')
  }
];

export const router47 = createRouter({
  history: createWebHistory(),
  routes: routes47
});

router47.beforeResolve((to, from, next) => {
  next();
});

// 示例 48: 路由beforeEnter守卫未验证
const routes48 = [
  {
    path: '/page',
    component: () => import('@/views/PageView.vue'),
    beforeEnter: (to, from, next) => {
      next();
    }
  }
];

export const router48 = createRouter({
  history: createWebHistory(),
  routes: routes48
});

// 示例 49: 路由beforeRouteEnter守卫未验证
export default {
  name: 'RouteGuardComponent',
  beforeRouteEnter(to, from, next) {
    next();
  }
};

// 示例 50: 路由beforeRouteUpdate守卫未验证
export default {
  name: 'RouteUpdateComponent',
  beforeRouteUpdate(to, from, next) {
    next();
  }
};
