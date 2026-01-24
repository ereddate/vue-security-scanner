// Vue组件安全漏洞示例文件

// 示例 1: 动态组件加载
export default {
  name: 'DynamicComponentComponent',
  data() {
    return {
      componentName: this.$route.query.component
    };
  },
  template: `
    <component :is="componentName"></component>
  `
};

// 示例 2: 动态组件使用v-bind:is
export default {
  name: 'DynamicComponentVBindComponent',
  data() {
    return {
      componentName: this.$route.query.component
    };
  },
  template: `
    <component v-bind:is="componentName"></component>
  `
};

// 示例 3: 动态组件使用:is
export default {
  name: 'DynamicComponentColonIsComponent',
  data() {
    return {
      componentName: this.$route.query.component
    };
  },
  template: `
    <component :is="componentName"></component>
  `
};

// 示例 4: 动态组件使用v-if
export default {
  name: 'DynamicComponentVIfComponent',
  data() {
    return {
      showComponent: true,
      componentName: this.$route.query.component
    };
  },
  template: `
    <div v-if="showComponent">
      <component :is="componentName"></component>
    </div>
  `
};

// 示例 5: 动态组件使用v-for
export default {
  name: 'DynamicComponentVForComponent',
  data() {
    return {
      components: JSON.parse(this.$route.query.components)
    };
  },
  template: `
    <div v-for="comp in components" :key="comp.name">
      <component :is="comp.name"></component>
    </div>
  `
};

// 示例 6: 动态$refs访问
export default {
  name: 'DynamicRefsComponent',
  methods: {
    accessRef() {
      const refName = this.$route.query.ref;
      this.$refs[refName].focus();
    }
  }
};

// 示例 7: 动态$refs访问使用字符串
export default {
  name: 'DynamicRefsStringComponent',
  methods: {
    accessRef() {
      const refName = this.$route.query.ref;
      this.$refs[refName].focus();
    }
  }
};

// 示例 8: 动态$refs访问使用变量
export default {
  name: 'DynamicRefsVariableComponent',
  methods: {
    accessRef() {
      const refName = this.$route.query.ref;
      this.$refs[refName].focus();
    }
  }
};

// 示例 9: v-for注入
export default {
  name: 'VForInjectionComponent',
  data() {
    return {
      items: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="item in items" :key="item.id" v-html="item.content"></div>
  `
};

// 示例 10: v-for-of注入
export default {
  name: 'VForOfInjectionComponent',
  data() {
    return {
      items: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="(item, index) of items" :key="index" v-html="item.content"></div>
  `
};

// 示例 11: v-for-in注入
export default {
  name: 'VForInInjectionComponent',
  data() {
    return {
      object: JSON.parse(this.$route.query.object)
    };
  },
  template: `
    <div v-for="(value, key) in object" :key="key" v-html="value"></div>
  `
};

// 示例 12: v-for嵌套注入
export default {
  name: 'VForNestedInjectionComponent',
  data() {
    return {
      nestedItems: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="group in nestedItems" :key="group.id">
      <div v-for="item in group.items" :key="item.id" v-html="item.content"></div>
    </div>
  `
};

// 示例 13: v-for使用用户提供的key
export default {
  name: 'VForKeyInjectionComponent',
  data() {
    return {
      items: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="item in items" :key="item.userKey" v-html="item.content"></div>
  `
};

// 示例 14: v-for使用用户提供的索引
export default {
  name: 'VForIndexInjectionComponent',
  data() {
    return {
      items: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="(item, index) in items" :key="index" v-html="item.content"></div>
  `
};

// 示例 15: 插槽注入
export default {
  name: 'SlotInjectionComponent',
  template: `
    <slot></slot>
  `
};

// 示例 16: 作用域插槽注入
export default {
  name: 'ScopedSlotInjectionComponent',
  data() {
    return {
      items: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="item in items" :key="item.id">
      <slot :content="item.content"></slot>
    </div>
  `
};

// 示例 17: 具名插槽注入
export default {
  name: 'NamedSlotInjectionComponent',
  data() {
    return {
      headerContent: this.$route.query.header,
      bodyContent: this.$route.query.body,
      footerContent: this.$route.query.footer
    };
  },
  template: `
    <slot name="header" :content="headerContent"></slot>
    <slot name="body" :content="bodyContent"></slot>
    <slot name="footer" :content="footerContent"></slot>
  `
};

// 示例 18: 动态插槽注入
export default {
  name: 'DynamicSlotInjectionComponent',
  data() {
    return {
      slotName: this.$route.query.slot,
      slotContent: this.$route.query.content
    };
  },
  template: `
    <slot :name="slotName" :content="slotContent"></slot>
  `
};

// 示例 19: 插槽v-html注入
export default {
  name: 'SlotVHtmlInjectionComponent',
  data() {
    return {
      slotContent: this.$route.query.content
    };
  },
  template: `
    <slot :content="slotContent"></slot>
  `
};

// 示例 20: 插槽v-text注入
export default {
  name: 'SlotVTextInjectionComponent',
  data() {
    return {
      slotContent: this.$route.query.content
    };
  },
  template: `
    <slot :content="slotContent"></slot>
  `
};

// 示例 21: Teleport注入（Vue 3）
export default {
  name: 'TeleportInjectionComponent',
  data() {
    return {
      teleportContent: this.$route.query.content
    };
  },
  template: `
    <Teleport to="body">
      <div v-html="teleportContent"></div>
    </Teleport>
  `
};

// 示例 22: 动态Teleport目标
export default {
  name: 'DynamicTeleportTargetComponent',
  data() {
    return {
      teleportTarget: this.$route.query.target,
      teleportContent: this.$route.query.content
    };
  },
  template: `
    <Teleport :to="teleportTarget">
      <div v-html="teleportContent"></div>
    </Teleport>
  `
};

// 示例 23: Suspense注入（Vue 3）
export default {
  name: 'SuspenseInjectionComponent',
  data() {
    return {
      suspenseContent: this.$route.query.content
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

// 示例 24: Suspense fallback注入
export default {
  name: 'SuspenseFallbackInjectionComponent',
  data() {
    return {
      fallbackContent: this.$route.query.content
    };
  },
  template: `
    <Suspense>
      <template #default>
        <div>Loading...</div>
      </template>
      <template #fallback>
        <div v-html="fallbackContent"></div>
      </template>
    </Suspense>
  `
};

// 示例 25: Fragment注入（Vue 3）
export default {
  name: 'FragmentInjectionComponent',
  data() {
    return {
      fragmentContent: this.$route.query.content
    };
  },
  template: `
    <div v-html="fragmentContent"></div>
  `
};

// 示例 26: Provide/Inject注入
export default {
  name: 'ProvideInjectionComponent',
  provide() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <ChildComponent />
  `
};

// 示例 27: 动态Provide
export default {
  name: 'DynamicProvideComponent',
  data() {
    return {
      provideKey: this.$route.query.key,
      provideValue: this.$route.query.value
    };
  },
  provide() {
    return {
      [this.provideKey]: this.provideValue
    };
  },
  template: `
    <ChildComponent />
  `
};

// 示例 28: Inject注入
export default {
  name: 'InjectInjectionComponent',
  inject: ['userContent'],
  template: `
    <div v-html="userContent"></div>
  `
};

// 示例 29: 动态Inject
export default {
  name: 'DynamicInjectComponent',
  inject: {
    userContent: {
      from: this.$route.query.key
    }
  },
  template: `
    <div v-html="userContent"></div>
  `
};

// 示例 30: 组件props注入
export default {
  name: 'PropsInjectionComponent',
  props: {
    userContent: {
      type: String,
      default: this.$route.query.content
    }
  },
  template: `
    <div v-html="userContent"></div>
  `
};

// 示例 31: 组件emits注入
export default {
  name: 'EmitsInjectionComponent',
  emits: ['userEvent'],
  methods: {
    emitUserEvent() {
      const eventData = this.$route.query.data;
      this.$emit('userEvent', eventData);
    }
  }
};

// 示例 32: 组件attrs注入
export default {
  name: 'AttrsInjectionComponent',
  inheritAttrs: false,
  template: `
    <div v-bind="$attrs"></div>
  `
};

// 示例 33: 组件slots注入
export default {
  name: 'SlotsInjectionComponent',
  template: `
    <slot></slot>
  `
};

// 示例 34: 组件setup注入
export default {
  name: 'SetupInjectionComponent',
  setup() {
    const userContent = window.location.query.content;
    return { userContent };
  },
  template: `
    <div v-html="userContent"></div>
  `
};

// 示例 35: 组件render函数注入
export default {
  name: 'RenderInjectionComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  render(h) {
    return h('div', { domProps: { innerHTML: this.userContent } });
  }
};

// 示例 36: 组件JSX注入
export default {
  name: 'JSXInjectionComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.userContent }} />;
  }
};

// 示例 37: 组件template编译注入
export default {
  name: 'TemplateCompileInjectionComponent',
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

// 示例 38: 组件动态template注入
export default {
  name: 'DynamicTemplateInjectionComponent',
  data() {
    return {
      dynamicTemplate: this.$route.query.template
    };
  },
  template: `
    <component :is="dynamicTemplate"></component>
  `
};

// 示例 39: 组件递归注入
export default {
  name: 'RecursiveInjectionComponent',
  props: ['item'],
  template: `
    <div v-if="item" v-html="item.content"></div>
  `
};

// 示例 40: 组件异步注入
export default {
  name: 'AsyncInjectionComponent',
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

// 示例 41: 组件keep-alive注入
export default {
  name: 'KeepAliveInjectionComponent',
  data() {
    return {
      keepAliveContent: this.$route.query.content
    };
  },
  template: `
    <keep-alive>
      <div v-html="keepAliveContent"></div>
    </keep-alive>
  `
};

// 示例 42: 组件transition注入
export default {
  name: 'TransitionInjectionComponent',
  data() {
    return {
      transitionContent: this.$route.query.content
    };
  },
  template: `
    <transition>
      <div v-html="transitionContent"></div>
    </transition>
  `
};

// 示例 43: 组件transition-group注入
export default {
  name: 'TransitionGroupInjectionComponent',
  data() {
    return {
      items: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <transition-group>
      <div v-for="item in items" :key="item.id" v-html="item.content"></div>
    </transition-group>
  `
};

// 示例 44: 组件v-model注入
export default {
  name: 'VModelInjectionComponent',
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

// 示例 45: 组件v-model.lazy注入
export default {
  name: 'VModelLazyInjectionComponent',
  data() {
    return {
      userInput: this.$route.query.input
    };
  },
  template: `
    <input v-model.lazy="userInput" />
    <div v-html="userInput"></div>
  `
};

// 示例 46: 组件v-model.number注入
export default {
  name: 'VModelNumberInjectionComponent',
  data() {
    return {
      userInput: this.$route.query.input
    };
  },
  template: `
    <input v-model.number="userInput" />
    <div v-html="userInput"></div>
  `
};

// 示例 47: 组件v-model.trim注入
export default {
  name: 'VModelTrimInjectionComponent',
  data() {
    return {
      userInput: this.$route.query.input
    };
  },
  template: `
    <input v-model.trim="userInput" />
    <div v-html="userInput"></div>
  `
};

// 示例 48: 组件v-model修饰符注入
export default {
  name: 'VModelModifierInjectionComponent',
  data() {
    return {
      userInput: this.$route.query.input
    };
  },
  template: `
    <input v-model.lazy.trim="userInput" />
    <div v-html="userInput"></div>
  `
};

// 示例 49: 组件自定义v-model注入
export default {
  name: 'CustomVModelInjectionComponent',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  `
};

// 示例 50: 组件多个v-model注入
export default {
  name: 'MultipleVModelInjectionComponent',
  props: ['modelValue', 'title'],
  emits: ['update:modelValue', 'update:title'],
  template: `
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    <input :value="title" @input="$emit('update:title', $event.target.value)" />
  `
};
