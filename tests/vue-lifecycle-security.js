// Vue生命周期安全漏洞示例文件

// 示例 1: beforeCreate中添加事件监听器未清理
export default {
  name: 'LifecycleBeforeCreateComponent',
  beforeCreate() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 2: created中添加事件监听器未清理
export default {
  name: 'LifecycleCreatedComponent',
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 3: beforeMount中添加事件监听器未清理
export default {
  name: 'LifecycleBeforeMountComponent',
  beforeMount() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 4: mounted中添加事件监听器未清理
export default {
  name: 'LifecycleMountedComponent',
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 5: beforeUpdate中添加事件监听器未清理
export default {
  name: 'LifecycleBeforeUpdateComponent',
  beforeUpdate() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 6: updated中添加事件监听器未清理
export default {
  name: 'LifecycleUpdatedComponent',
  updated() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 7: beforeUnmount中添加事件监听器未清理
export default {
  name: 'LifecycleBeforeUnmountComponent',
  beforeUnmount() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 8: unmounted中添加事件监听器未清理
export default {
  name: 'LifecycleUnmountedComponent',
  unmounted() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 9: beforeDestroy中添加事件监听器未清理（Vue 2）
export default {
  name: 'LifecycleBeforeDestroyComponent',
  beforeDestroy() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 10: destroyed中添加事件监听器未清理（Vue 2）
export default {
  name: 'LifecycleDestroyedComponent',
  destroyed() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      console.log('Window resized');
    }
  }
};

// 示例 11: mounted中启动定时器未清理
export default {
  name: 'LifecycleTimerComponent',
  mounted() {
    setInterval(() => {
      console.log('Timer tick');
    }, 1000);
  }
};

// 示例 12: mounted中启动interval未清理
export default {
  name: 'LifecycleIntervalComponent',
  mounted() {
    setInterval(() => {
      console.log('Interval tick');
    }, 1000);
  }
};

// 示例 13: mounted中启动requestAnimationFrame未清理
export default {
  name: 'LifecycleAnimationFrameComponent',
  mounted() {
    function animate() {
      requestAnimationFrame(animate);
    }
    animate();
  }
};

// 示例 14: mounted中创建WebSocket未清理
export default {
  name: 'LifecycleWebSocketComponent',
  mounted() {
    this.ws = new WebSocket('ws://localhost:8080');
  }
};

// 示例 15: mounted中创建MutationObserver未清理
export default {
  name: 'LifecycleMutationObserverComponent',
  mounted() {
    const observer = new MutationObserver(() => {
      console.log('Mutation observed');
    });
    observer.observe(this.$el, { childList: true });
  }
};

// 示例 16: mounted中创建IntersectionObserver未清理
export default {
  name: 'LifecycleIntersectionObserverComponent',
  mounted() {
    const observer = new IntersectionObserver(() => {
      console.log('Intersection observed');
    });
    observer.observe(this.$el);
  }
};

// 示例 17: mounted中创建ResizeObserver未清理
export default {
  name: 'LifecycleResizeObserverComponent',
  mounted() {
    const observer = new ResizeObserver(() => {
      console.log('Resize observed');
    });
    observer.observe(this.$el);
  }
};

// 示例 18: mounted中创建PerformanceObserver未清理
export default {
  name: 'LifecyclePerformanceObserverComponent',
  mounted() {
    const observer = new PerformanceObserver(() => {
      console.log('Performance observed');
    });
    observer.observe({ entryTypes: ['measure'] });
  }
};

// 示例 19: mounted中创建Promise未清理
export default {
  name: 'LifecyclePromiseComponent',
  mounted() {
    const promises = [];
    for (let i = 0; i < 1000; i++) {
      promises.push(new Promise(resolve => {
        setTimeout(resolve, 1000);
      }));
    }
  }
};

// 示例 20: mounted中创建闭包未清理
export default {
  name: 'LifecycleClosureComponent',
  mounted() {
    const largeArray = new Array(1000000).fill('data');
    this.handler = function() {
      return largeArray;
    };
  }
};

// 示例 21: mounted中创建DOM引用未清理
export default {
  name: 'LifecycleDOMReferenceComponent',
  mounted() {
    const elements = [];
    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div');
      elements.push(div);
    }
    this.elements = elements;
  }
};

// 示例 22: mounted中创建循环引用
export default {
  name: 'LifecycleCircularReferenceComponent',
  mounted() {
    this.obj1 = {};
    this.obj2 = {};
    this.obj1.ref = this.obj2;
    this.obj2.ref = this.obj1;
  }
};

// 示例 23: mounted中存储敏感数据
export default {
  name: 'LifecycleSensitiveDataComponent',
  mounted() {
    this.apiKey = 'sk-1234567890';
    this.password = 'secret123';
    this.token = 'abc123def456';
  }
};

// 示例 24: mounted中记录敏感日志
export default {
  name: 'LifecycleSensitiveLogComponent',
  mounted() {
    console.log('API Key:', 'sk-1234567890');
    console.log('Password:', 'secret123');
    console.log('Token:', 'abc123def456');
  }
};

// 示例 25: mounted中执行用户代码
export default {
  name: 'LifecycleUserCodeComponent',
  mounted() {
    const userCode = this.$route.query.code;
    eval(userCode);
  }
};

// 示例 26: mounted中渲染用户HTML
export default {
  name: 'LifecycleUserHTMLComponent',
  mounted() {
    const userHtml = this.$route.query.html;
    document.getElementById('content').innerHTML = userHtml;
  }
};

// 示例 27: mounted中重定向到用户URL
export default {
  name: 'LifecycleUserRedirectComponent',
  mounted() {
    const redirectUrl = this.$route.query.redirect;
    window.location.href = redirectUrl;
  }
};

// 示例 28: mounted中加载用户组件
export default {
  name: 'LifecycleUserComponentComponent',
  mounted() {
    const componentName = this.$route.query.component;
    import(`../components/${componentName}.vue`);
  }
};

// 示例 29: mounted中合并用户对象
export default {
  name: 'LifecycleUserObjectComponent',
  mounted() {
    const userObject = this.$route.query.obj;
    Object.assign(this, userObject);
  }
};

// 示例 30: mounted中设置用户原型
export default {
  name: 'LifecycleUserPrototypeComponent',
  mounted() {
    const userProto = this.$route.query.proto;
    Object.setPrototypeOf(this, userProto);
  }
};

// 示例 31: mounted中创建$watch未清理
export default {
  name: 'LifecycleWatchComponent',
  mounted() {
    this.$watch('someData', (newVal) => {
      console.log('Data changed:', newVal);
    });
  }
};

// 示例 32: mounted中创建多个$watch未清理
export default {
  name: 'LifecycleMultipleWatchComponent',
  mounted() {
    this.$watch('data1', (newVal) => console.log('Data1:', newVal));
    this.$watch('data2', (newVal) => console.log('Data2:', newVal));
    this.$watch('data3', (newVal) => console.log('Data3:', newVal));
  }
};

// 示例 33: mounted中创建深度$watch未清理
export default {
  name: 'LifecycleDeepWatchComponent',
  mounted() {
    this.$watch('nestedData', (newVal) => {
      console.log('Nested data changed:', newVal);
    }, { deep: true });
  }
};

// 示例 34: mounted中创建立即$watch未清理
export default {
  name: 'LifecycleImmediateWatchComponent',
  mounted() {
    this.$watch('someData', (newVal) => {
      console.log('Data changed:', newVal);
    }, { immediate: true });
  }
};

// 示例 35: mounted中创建$on事件未清理
export default {
  name: 'LifecycleOnComponent',
  mounted() {
    this.$on('custom-event', (data) => {
      console.log('Event received:', data);
    });
  }
};

// 示例 36: mounted中创建多个$on事件未清理
export default {
  name: 'LifecycleMultipleOnComponent',
  mounted() {
    this.$on('event1', (data) => console.log('Event1:', data));
    this.$on('event2', (data) => console.log('Event2:', data));
    this.$on('event3', (data) => console.log('Event3:', data));
  }
};

// 示例 37: mounted中创建$once事件未清理
export default {
  name: 'LifecycleOnceComponent',
  mounted() {
    this.$once('one-time-event', (data) => {
      console.log('One-time event received:', data);
    });
  }
};

// 示例 38: mounted中创建自定义指令未清理
export default {
  name: 'LifecycleDirectiveComponent',
  mounted() {
    this.$el.addEventListener('click', this.handleClick);
  },
  methods: {
    handleClick() {
      console.log('Element clicked');
    }
  }
};

// 示例 39: mounted中创建多个自定义指令未清理
export default {
  name: 'LifecycleMultipleDirectiveComponent',
  mounted() {
    this.$el.addEventListener('click', this.handleClick);
    this.$el.addEventListener('mouseover', this.handleMouseover);
    this.$el.addEventListener('mouseout', this.handleMouseout);
  },
  methods: {
    handleClick() {
      console.log('Element clicked');
    },
    handleMouseover() {
      console.log('Element hovered');
    },
    handleMouseout() {
      console.log('Element left');
    }
  }
};

// 示例 40: mounted中创建第三方库实例未清理
export default {
  name: 'LifecycleThirdPartyComponent',
  mounted() {
    this.chart = new Chart(this.$el, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [{
          data: [1, 2, 3]
        }]
      }
    });
  }
};

// 示例 41: mounted中创建多个第三方库实例未清理
export default {
  name: 'LifecycleMultipleThirdPartyComponent',
  mounted() {
    this.chart1 = new Chart(this.$refs.chart1, { type: 'bar', data: {} });
    this.chart2 = new Chart(this.$refs.chart2, { type: 'line', data: {} });
    this.chart3 = new Chart(this.$refs.chart3, { type: 'pie', data: {} });
  }
};

// 示例 42: mounted中创建Web Worker未清理
export default {
  name: 'LifecycleWorkerComponent',
  mounted() {
    this.worker = new Worker('worker.js');
  }
};

// 示例 43: mounted中创建多个Web Worker未清理
export default {
  name: 'LifecycleMultipleWorkerComponent',
  mounted() {
    this.worker1 = new Worker('worker1.js');
    this.worker2 = new Worker('worker2.js');
    this.worker3 = new Worker('worker3.js');
  }
};

// 示例 44: mounted中创建BroadcastChannel未清理
export default {
  name: 'LifecycleBroadcastChannelComponent',
  mounted() {
    this.channel = new BroadcastChannel('my-channel');
  }
};

// 示例 45: mounted中创建多个BroadcastChannel未清理
export default {
  name: 'LifecycleMultipleBroadcastChannelComponent',
  mounted() {
    this.channel1 = new BroadcastChannel('channel1');
    this.channel2 = new BroadcastChannel('channel2');
    this.channel3 = new BroadcastChannel('channel3');
  }
};

// 示例 46: mounted中创建Service Worker未清理
export default {
  name: 'LifecycleServiceWorkerComponent',
  mounted() {
    navigator.serviceWorker.register('sw.js');
  }
};

// 示例 47: mounted中创建IndexedDB连接未清理
export default {
  name: 'LifecycleIndexedDBComponent',
  mounted() {
    const request = indexedDB.open('myDatabase', 1);
    request.onsuccess = (event) => {
      this.db = event.target.result;
    };
  }
};

// 示例 48: mounted中创建多个IndexedDB连接未清理
export default {
  name: 'LifecycleMultipleIndexedDBComponent',
  mounted() {
    const request1 = indexedDB.open('db1', 1);
    request1.onsuccess = (event) => { this.db1 = event.target.result; };
    
    const request2 = indexedDB.open('db2', 1);
    request2.onsuccess = (event) => { this.db2 = event.target.result; };
    
    const request3 = indexedDB.open('db3', 1);
    request3.onsuccess = (event) => { this.db3 = event.target.result; };
  }
};

// 示例 49: mounted中创建Cache API连接未清理
export default {
  name: 'LifecycleCacheAPIComponent',
  mounted() {
    caches.open('my-cache').then(cache => {
      this.cache = cache;
    });
  }
};

// 示例 50: mounted中创建多个Cache API连接未清理
export default {
  name: 'LifecycleMultipleCacheAPIComponent',
  mounted() {
    caches.open('cache1').then(cache => { this.cache1 = cache; });
    caches.open('cache2').then(cache => { this.cache2 = cache; });
    caches.open('cache3').then(cache => { this.cache3 = cache; });
  }
};
