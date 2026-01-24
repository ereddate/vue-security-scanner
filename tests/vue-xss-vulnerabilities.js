// Vue XSS漏洞示例文件

// 示例 1: v-html直接渲染用户输入
export default {
  name: 'XSSVHtmlComponent',
  data() {
    return {
      userContent: '<script>alert("XSS")<\/script>'
    };
  },
  template: `
    <div v-html="userContent"></div>
  `
};

// 示例 2: v-html渲染URL参数
export default {
  name: 'XSSVHtmlUrlComponent',
  data() {
    return {
      urlContent: this.$route.query.content
    };
  },
  template: `
    <div v-html="urlContent"></div>
  `
};

// 示例 3: v-html渲染用户评论
export default {
  name: 'XSSVHtmlCommentComponent',
  data() {
    return {
      comments: [
        { content: '<img src=x onerror=alert("XSS")>' },
        { content: '<script>alert("XSS")<\/script>' }
      ]
    };
  },
  template: `
    <div v-for="comment in comments" :key="comment.id">
      <div v-html="comment.content"></div>
    </div>
  `
};

// 示例 4: v-html渲染富文本编辑器内容
export default {
  name: 'XSSVHtmlEditorComponent',
  data() {
    return {
      editorContent: this.$route.query.html
    };
  },
  template: `
    <div v-html="editorContent"></div>
  `
};

// 示例 5: v-html渲染API返回的HTML
export default {
  name: 'XSSVHtmlAPIComponent',
  data() {
    return {
      apiHtml: ''
    };
  },
  mounted() {
    fetch('/api/content')
      .then(res => res.text())
      .then(html => {
        this.apiHtml = html;
      });
  },
  template: `
    <div v-html="apiHtml"></div>
  `
};

// 示例 6: v-html渲染localStorage数据
export default {
  name: 'XSSVHtmlStorageComponent',
  data() {
    return {
      storedHtml: localStorage.getItem('htmlContent')
    };
  },
  template: `
    <div v-html="storedHtml"></div>
  `
};

// 示例 7: v-html渲染cookie数据
export default {
  name: 'XSSVHtmlCookieComponent',
  data() {
    return {
      cookieHtml: document.cookie
    };
  },
  template: `
    <div v-html="cookieHtml"></div>
  `
};

// 示例 8: v-html渲染sessionStorage数据
export default {
  name: 'XSSVHtmlSessionComponent',
  data() {
    return {
      sessionHtml: sessionStorage.getItem('htmlContent')
    };
  },
  template: `
    <div v-html="sessionHtml"></div>
  `
};

// 示例 9: v-html渲染WebSocket消息
export default {
  name: 'XSSVHtmlWebSocketComponent',
  data() {
    return {
      wsMessage: ''
    };
  },
  mounted() {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      this.wsMessage = event.data;
    };
  },
  template: `
    <div v-html="wsMessage"></div>
  `
};

// 示例 10: v-html渲染postMessage数据
export default {
  name: 'XSSVHtmlPostMessageComponent',
  data() {
    return {
      messageHtml: ''
    };
  },
  mounted() {
    window.addEventListener('message', (event) => {
      this.messageHtml = event.data;
    });
  },
  template: `
    <div v-html="messageHtml"></div>
  `
};

// 示例 11: v-text渲染用户输入（相对安全但可能有问题）
export default {
  name: 'XSSVTextComponent',
  data() {
    return {
      userText: this.$route.query.text
    };
  },
  template: `
    <div v-text="userText"></div>
  `
};

// 示例 12: v-bind:href渲染用户URL
export default {
  name: 'XSSVBindHrefComponent',
  data() {
    return {
      userUrl: this.$route.query.url
    };
  },
  template: `
    <a v-bind:href="userUrl">Click here</a>
  `
};

// 示例 13: v-bind:src渲染用户图片URL
export default {
  name: 'XSSVBindSrcComponent',
  data() {
    return {
      userImageUrl: this.$route.query.image
    };
  },
  template: `
    <img v-bind:src="userImageUrl" />
  `
};

// 示例 14: v-bind:style渲染用户样式
export default {
  name: 'XSSVBindStyleComponent',
  data() {
    return {
      userStyle: this.$route.query.style
    };
  },
  template: `
    <div v-bind:style="userStyle">Content</div>
  `
};

// 示例 15: v-bind:class渲染用户类名
export default {
  name: 'XSSVBindClassComponent',
  data() {
    return {
      userClass: this.$route.query.class
    };
  },
  template: `
    <div v-bind:class="userClass">Content</div>
  `
};

// 示例 16: v-bind:innerHTML渲染用户HTML
export default {
  name: 'XSSVBindInnerHTMLComponent',
  data() {
    return {
      userHtml: this.$route.query.html
    };
  },
  template: `
    <div v-bind:innerHTML="userHtml"></div>
  `
};

// 示例 17: 插值表达式渲染用户输入
export default {
  name: 'XSSInterpolationComponent',
  data() {
    return {
      userInput: this.$route.query.input
    };
  },
  template: `
    <div>{{ userInput }}</div>
  `
};

// 示例 18: 计算属性中的XSS
export default {
  name: 'XSSComputedComponent',
  data() {
    return {
      rawContent: this.$route.query.content
    };
  },
  computed: {
    processedContent() {
      return this.rawContent;
    }
  },
  template: `
    <div v-html="processedContent"></div>
  `
};

// 示例 19: 方法中的XSS
export default {
  name: 'XSSMethodComponent',
  data() {
    return {
      content: ''
    };
  },
  methods: {
    loadContent() {
      this.content = this.$route.query.html;
    }
  },
  template: `
    <div v-html="content"></div>
  `
};

// 示例 20: Watch中的XSS
export default {
  name: 'XSSWatchComponent',
  data() {
    return {
      content: '',
      userInput: ''
    };
  },
  watch: {
    userInput(newVal) {
      this.content = newVal;
    }
  },
  template: `
    <div v-html="content"></div>
  `
};

// 示例 21: 插槽中的XSS
export default {
  name: 'XSSSlotComponent',
  template: `
    <div>
      <slot></slot>
    </div>
  `
};

// 示例 22: 作用域插槽中的XSS
export default {
  name: 'XSSScopedSlotComponent',
  data() {
    return {
      items: [
        { content: '<script>alert("XSS")<\/script>' }
      ]
    };
  },
  template: `
    <div v-for="item in items" :key="item.id">
      <slot :content="item.content"></slot>
    </div>
  `
};

// 示例 23: 动态组件中的XSS
export default {
  name: 'XSSDynamicComponent',
  data() {
    return {
      componentName: this.$route.query.component
    };
  },
  template: `
    <component :is="componentName"></component>
  `
};

// 示例 24: v-for中的XSS
export default {
  name: 'XSSVForComponent',
  data() {
    return {
      items: this.$route.query.items
    };
  },
  template: `
    <div v-for="item in items" :key="item.id" v-html="item.content"></div>
  `
};

// 示例 25: v-if中的XSS
export default {
  name: 'XSSVIfComponent',
  data() {
    return {
      showContent: true,
      content: this.$route.query.html
    };
  },
  template: `
    <div v-if="showContent" v-html="content"></div>
  `
};

// 示例 26: v-show中的XSS
export default {
  name: 'XSSVShowComponent',
  data() {
    return {
      showContent: true,
      content: this.$route.query.html
    };
  },
  template: `
    <div v-show="showContent" v-html="content"></div>
  `
};

// 示例 27: v-on:click中的XSS
export default {
  name: 'XSSVOnClickComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  methods: {
    handleClick() {
      eval(this.userScript);
    }
  },
  template: `
    <button v-on:click="handleClick">Click me</button>
  `
};

// 示例 28: v-model中的XSS
export default {
  name: 'XSSVModelComponent',
  data() {
    return {
      userInput: this.$route.query.input
    };
  },
  template: `
    <input v-model="userInput" />
    <div v-html="userInput"></div>
  `
};

// 示例 29: 混合指令中的XSS
export default {
  name: 'XSSMixedDirectiveComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-if="userContent" v-html="userContent"></div>
  `
};

// 示例 30: 嵌套组件中的XSS
export default {
  name: 'XSSNestedComponent',
  components: {
    ChildComponent: {
      props: ['content'],
      template: '<div v-html="content"></div>'
    }
  },
  data() {
    return {
      userContent: this.$route.query.html
    };
  },
  template: `
    <ChildComponent :content="userContent" />
  `
};

// 示例 31: 递归组件中的XSS
export default {
  name: 'XSSRecursiveComponent',
  props: ['item'],
  template: `
    <div v-if="item" v-html="item.content"></div>
  `
};

// 示例 32: 异步组件中的XSS
export default {
  name: 'XSSAsyncComponent',
  data() {
    return {
      asyncContent: ''
    };
  },
  mounted() {
    setTimeout(() => {
      this.asyncContent = this.$route.query.html;
    }, 1000);
  },
  template: `
    <div v-html="asyncContent"></div>
  `
};

// 示例 33: Teleport中的XSS（Vue 3）
export default {
  name: 'XSSTeleportComponent',
  data() {
    return {
      teleportContent: this.$route.query.html
    };
  },
  template: `
    <Teleport to="body">
      <div v-html="teleportContent"></div>
    </Teleport>
  `
};

// 示例 34: Suspense中的XSS（Vue 3）
export default {
  name: 'XSSSuspenseComponent',
  data() {
    return {
      suspenseContent: this.$route.query.html
    };
  },
  template: `
    <Suspense>
      <template #default>
        <div v-html="suspenseContent"></div>
      </template>
    </Suspense>
  `
};

// 示例 35: Fragment中的XSS（Vue 3）
export default {
  name: 'XSSFragmentComponent',
  data() {
    return {
      fragmentContent: this.$route.query.html
    };
  },
  template: `
    <div v-html="fragmentContent"></div>
  `
};

// 示例 36: Provide/Inject中的XSS
export default {
  name: 'XSSProvideComponent',
  provide() {
    return {
      userContent: this.$route.query.html
    };
  },
  template: `
    <ChildComponent />
  `
};

// 示例 37: 自定义事件中的XSS
export default {
  name: 'XSSEventComponent',
  data() {
    return {
      eventContent: ''
    };
  },
  mounted() {
    this.$on('user-event', (data) => {
      this.eventContent = data;
    });
  },
  template: `
    <div v-html="eventContent"></div>
  `
};

// 示例 38: 插件中的XSS
export default {
  name: 'XSSPluginComponent',
  data() {
    return {
      pluginContent: ''
    };
  },
  mounted() {
    this.$xssPlugin.loadContent(this.$route.query.html);
  },
  template: `
    <div v-html="pluginContent"></div>
  `
};

// 示例 39: 混入中的XSS
export default {
  name: 'XSSMixinComponent',
  mixins: [
    {
      data() {
        return {
          mixinContent: ''
        };
      },
      mounted() {
        this.mixinContent = this.$route.query.html;
      }
    }
  ],
  template: `
    <div v-html="mixinContent"></div>
  `
};

// 示例 40: 全局混入中的XSS
export default {
  name: 'XSSGlobalMixinComponent',
  template: `
    <div v-html="globalContent"></div>
  `
};

// 示例 41: 自定义指令中的XSS
export default {
  name: 'XSSDirectiveComponent',
  directives: {
    unsafeHtml: {
      inserted(el, binding) {
        el.innerHTML = binding.value;
      }
    }
  },
  data() {
    return {
      userContent: this.$route.query.html
    };
  },
  template: `
    <div v-unsafe-html="userContent"></div>
  `
};

// 示例 42: 过滤器中的XSS（Vue 2）
export default {
  name: 'XSSFilterComponent',
  data() {
    return {
      userContent: this.$route.query.html
    };
  },
  template: `
    <div>{{ userContent | unsafe }}</div>
  `
};

// 示例 43: 渲染函数中的XSS
export default {
  name: 'XSSRenderFunctionComponent',
  data() {
    return {
      userContent: this.$route.query.html
    };
  },
  render(h) {
    return h('div', { domProps: { innerHTML: this.userContent } });
  }
};

// 示例 44: JSX中的XSS
export default {
  name: 'XSSJSXComponent',
  data() {
    return {
      userContent: this.$route.query.html
    };
  },
  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.userContent }} />;
  }
};

// 示例 45: 模板编译中的XSS
export default {
  name: 'XSSTemplateCompileComponent',
  data() {
    return {
      templateString: this.$route.query.template
    };
  },
  computed: {
    compiledTemplate() {
      return Vue.compile(this.templateString);
    }
  }
};

// 示例 46: 动态模板中的XSS
export default {
  name: 'XSSDynamicTemplateComponent',
  data() {
    return {
      dynamicTemplate: this.$route.query.template
    };
  },
  template: `
    <component :is="dynamicTemplate"></component>
  `
};

// 示例 47: SSR中的XSS
export default {
  name: 'XSSSRComponent',
  data() {
    return {
      ssrContent: this.$route.query.html
    };
  },
  serverPrefetch() {
    return fetch('/api/content')
      .then(res => res.text())
      .then(html => {
        this.ssrContent = html;
      });
  },
  template: `
    <div v-html="ssrContent"></div>
  `
};

// 示例 48: Nuxt.js中的XSS
export default {
  name: 'XSSNuxtComponent',
  async asyncData({ query }) {
    return {
      nuxtContent: query.html
    };
  },
  template: `
    <div v-html="nuxtContent"></div>
  `
};

// 示例 49: Vuex中的XSS
export default {
  name: 'XSSVuexComponent',
  computed: {
    vuexContent() {
      return this.$store.state.userContent;
    }
  },
  template: `
    <div v-html="vuexContent"></div>
  `
};

// 示例 50: Vue Router中的XSS
export default {
  name: 'XSSRouterComponent',
  data() {
    return {
      routerContent: this.$route.query.html
    };
  },
  template: `
    <div v-html="routerContent"></div>
  `
};
