// Vue指令安全漏洞示例文件

// 示例 1: v-text直接渲染用户输入
export default {
  name: 'DirectiveVTextComponent',
  data() {
    return {
      userText: this.$route.query.text
    };
  },
  template: `
    <div v-text="userText"></div>
  `
};

// 示例 2: v-bind:href渲染用户URL
export default {
  name: 'DirectiveVBindHrefComponent',
  data() {
    return {
      userUrl: this.$route.query.url
    };
  },
  template: `
    <a v-bind:href="userUrl">Click here</a>
  `
};

// 示例 3: v-bind:src渲染用户图片URL
export default {
  name: 'DirectiveVBindSrcComponent',
  data() {
    return {
      userImageUrl: this.$route.query.image
    };
  },
  template: `
    <img v-bind:src="userImageUrl" />
  `
};

// 示例 4: v-bind:style渲染用户样式
export default {
  name: 'DirectiveVBindStyleComponent',
  data() {
    return {
      userStyle: this.$route.query.style
    };
  },
  template: `
    <div v-bind:style="userStyle">Content</div>
  `
};

// 示例 5: v-bind:class渲染用户类名
export default {
  name: 'DirectiveVBindClassComponent',
  data() {
    return {
      userClass: this.$route.query.class
    };
  },
  template: `
    <div v-bind:class="userClass">Content</div>
  `
};

// 示例 6: v-bind:innerHTML渲染用户HTML
export default {
  name: 'DirectiveVBindInnerHTMLComponent',
  data() {
    return {
      userHtml: this.$route.query.html
    };
  },
  template: `
    <div v-bind:innerHTML="userHtml"></div>
  `
};

// 示例 7: v-bind:outerHTML渲染用户HTML
export default {
  name: 'DirectiveVBindOuterHTMLComponent',
  data() {
    return {
      userHtml: this.$route.query.html
    };
  },
  template: `
    <div v-bind:outerHTML="userHtml"></div>
  `
};

// 示例 8: v-on:click执行用户代码
export default {
  name: 'DirectiveVOnClickComponent',
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

// 示例 9: v-on:mouseover执行用户代码
export default {
  name: 'DirectiveVOnMouseoverComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  methods: {
    handleMouseover() {
      eval(this.userScript);
    }
  },
  template: `
    <div v-on:mouseover="handleMouseover">Hover me</div>
  `
};

// 示例 10: v-on:load执行用户代码
export default {
  name: 'DirectiveVOnLoadComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  methods: {
    handleLoad() {
      eval(this.userScript);
    }
  },
  template: `
    <img v-on:load="handleLoad" src="image.jpg" />
  `
};

// 示例 11: v-on:error执行用户代码
export default {
  name: 'DirectiveVOnErrorComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  methods: {
    handleError() {
      eval(this.userScript);
    }
  },
  template: `
    <img v-on:error="handleError" src="invalid.jpg" />
  `
};

// 示例 12: v-if渲染用户内容
export default {
  name: 'DirectiveVIfComponent',
  data() {
    return {
      showContent: true,
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-if="showContent" v-html="userContent"></div>
  `
};

// 示例 13: v-else渲染用户内容
export default {
  name: 'DirectiveVElseComponent',
  data() {
    return {
      showContent: false,
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-if="showContent">Safe content</div>
    <div v-else v-html="userContent"></div>
  `
};

// 示例 14: v-else-if渲染用户内容
export default {
  name: 'DirectiveVElseIfComponent',
  data() {
    return {
      condition: false,
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-if="condition">Safe content</div>
    <div v-else-if="!condition" v-html="userContent"></div>
  `
};

// 示例 15: v-show渲染用户内容
export default {
  name: 'DirectiveVShowComponent',
  data() {
    return {
      showContent: true,
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-show="showContent" v-html="userContent"></div>
  `
};

// 示例 16: v-for渲染用户列表
export default {
  name: 'DirectiveVForComponent',
  data() {
    return {
      userItems: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="item in userItems" :key="item.id" v-html="item.content"></div>
  `
};

// 示例 17: v-for-of渲染用户列表
export default {
  name: 'DirectiveVForOfComponent',
  data() {
    return {
      userItems: JSON.parse(this.$route.query.items)
    };
  },
  template: `
    <div v-for="(item, index) of userItems" :key="index" v-html="item.content"></div>
  `
};

// 示例 18: v-for-in渲染用户对象
export default {
  name: 'DirectiveVForInComponent',
  data() {
    return {
      userObject: JSON.parse(this.$route.query.object)
    };
  },
  template: `
    <div v-for="(value, key) in userObject" :key="key" v-html="value"></div>
  `
};

// 示例 19: v-model绑定用户输入
export default {
  name: 'DirectiveVModelComponent',
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

// 示例 20: v-model.lazy绑定用户输入
export default {
  name: 'DirectiveVModelLazyComponent',
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

// 示例 21: v-model.number绑定用户输入
export default {
  name: 'DirectiveVModelNumberComponent',
  data() {
    return {
      userNumber: this.$route.query.number
    };
  },
  template: `
    <input v-model.number="userNumber" />
    <div v-html="userNumber"></div>
  `
};

// 示例 22: v-model.trim绑定用户输入
export default {
  name: 'DirectiveVModelTrimComponent',
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

// 示例 23: v-slot渲染用户内容
export default {
  name: 'DirectiveVSlotComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <slot name="default" :content="userContent"></slot>
  `
};

// 示例 24: v-slot:default渲染用户内容
export default {
  name: 'DirectiveVSlotDefaultComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <template v-slot:default="slotProps">
      <div v-html="slotProps.content"></div>
    </template>
  `
};

// 示例 25: v-slot:header渲染用户内容
export default {
  name: 'DirectiveVSlotHeaderComponent',
  data() {
    return {
      headerContent: this.$route.query.header
    };
  },
  template: `
    <template v-slot:header="slotProps">
      <div v-html="slotProps.headerContent"></div>
    </template>
  `
};

// 示例 26: v-slot:footer渲染用户内容
export default {
  name: 'DirectiveVSlotFooterComponent',
  data() {
    return {
      footerContent: this.$route.query.footer
    };
  },
  template: `
    <template v-slot:footer="slotProps">
      <div v-html="slotProps.footerContent"></div>
    </template>
  `
};

// 示例 27: v-once渲染用户内容
export default {
  name: 'DirectiveVOnceComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-once v-html="userContent"></div>
  `
};

// 示例 28: v-pre渲染用户内容
export default {
  name: 'DirectiveVPreComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-pre>{{ userContent }}</div>
  `
};

// 示例 29: v-cloak渲染用户内容
export default {
  name: 'DirectiveVCloakComponent',
  data() {
    return {
      userContent: this.$route.query.content
    };
  },
  template: `
    <div v-cloak v-html="userContent"></div>
  `
};

// 示例 30: 自定义指令v-unsafe-html
export default {
  name: 'CustomDirectiveUnsafeHTMLComponent',
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

// 示例 31: 自定义指令v-unsafe-text
export default {
  name: 'CustomDirectiveUnsafeTextComponent',
  directives: {
    unsafeText: {
      inserted(el, binding) {
        el.textContent = binding.value;
      }
    }
  },
  data() {
    return {
      userText: this.$route.query.text
    };
  },
  template: `
    <div v-unsafe-text="userText"></div>
  `
};

// 示例 32: 自定义指令v-unsafe-href
export default {
  name: 'CustomDirectiveUnsafeHrefComponent',
  directives: {
    unsafeHref: {
      inserted(el, binding) {
        el.href = binding.value;
      }
    }
  },
  data() {
    return {
      userUrl: this.$route.query.url
    };
  },
  template: `
    <a v-unsafe-href="userUrl">Click here</a>
  `
};

// 示例 33: 自定义指令v-unsafe-src
export default {
  name: 'CustomDirectiveUnsafeSrcComponent',
  directives: {
    unsafeSrc: {
      inserted(el, binding) {
        el.src = binding.value;
      }
    }
  },
  data() {
    return {
      userImageUrl: this.$route.query.image
    };
  },
  template: `
    <img v-unsafe-src="userImageUrl" />
  `
};

// 示例 34: 自定义指令v-unsafe-style
export default {
  name: 'CustomDirectiveUnsafeStyleComponent',
  directives: {
    unsafeStyle: {
      inserted(el, binding) {
        el.style.cssText = binding.value;
      }
    }
  },
  data() {
    return {
      userStyle: this.$route.query.style
    };
  },
  template: `
    <div v-unsafe-style="userStyle">Content</div>
  `
};

// 示例 35: 自定义指令v-unsafe-class
export default {
  name: 'CustomDirectiveUnsafeClassComponent',
  directives: {
    unsafeClass: {
      inserted(el, binding) {
        el.className = binding.value;
      }
    }
  },
  data() {
    return {
      userClass: this.$route.query.class
    };
  },
  template: `
    <div v-unsafe-class="userClass">Content</div>
  `
};

// 示例 36: 自定义指令v-unsafe-onclick
export default {
  name: 'CustomDirectiveUnsafeOnclickComponent',
  directives: {
    unsafeOnclick: {
      inserted(el, binding) {
        el.onclick = () => {
          eval(binding.value);
        };
      }
    }
  },
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <button v-unsafe-onclick="userScript">Click me</button>
  `
};

// 示例 37: 自定义指令v-unsafe-onmouseover
export default {
  name: 'CustomDirectiveUnsafeOnmouseoverComponent',
  directives: {
    unsafeOnmouseover: {
      inserted(el, binding) {
        el.onmouseover = () => {
          eval(binding.value);
        };
      }
    }
  },
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <div v-unsafe-onmouseover="userScript">Hover me</div>
  `
};

// 示例 38: 自定义指令v-unsafe-onload
export default {
  name: 'CustomDirectiveUnsafeOnloadComponent',
  directives: {
    unsafeOnload: {
      inserted(el, binding) {
        el.onload = () => {
          eval(binding.value);
        };
      }
    }
  },
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <img v-unsafe-onload="userScript" src="image.jpg" />
  `
};

// 示例 39: 自定义指令v-unsafe-onerror
export default {
  name: 'CustomDirectiveUnsafeOnerrorComponent',
  directives: {
    unsafeOnerror: {
      inserted(el, binding) {
        el.onerror = () => {
          eval(binding.value);
        };
      }
    }
  },
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <img v-unsafe-onerror="userScript" src="invalid.jpg" />
  `
};

// 示例 40: 自定义指令v-unsafe-attr
export default {
  name: 'CustomDirectiveUnsafeAttrComponent',
  directives: {
    unsafeAttr: {
      inserted(el, binding) {
        el.setAttribute(binding.arg, binding.value);
      }
    }
  },
  data() {
    return {
      userAttr: this.$route.query.attr
    };
  },
  template: `
    <div v-unsafe-attr:data-content="userAttr">Content</div>
  `
};

// 示例 41: 全局自定义指令v-unsafe-html
Vue.directive('unsafe-html', {
  inserted(el, binding) {
    el.innerHTML = binding.value;
  }
});

export default {
  name: 'GlobalCustomDirectiveComponent',
  data() {
    return {
      userContent: this.$route.query.html
    };
  },
  template: `
    <div v-unsafe-html="userContent"></div>
  `
};

// 示例 42: 全局自定义指令v-unsafe-text
Vue.directive('unsafe-text', {
  inserted(el, binding) {
    el.textContent = binding.value;
  }
});

export default {
  name: 'GlobalCustomDirectiveTextComponent',
  data() {
    return {
      userText: this.$route.query.text
    };
  },
  template: `
    <div v-unsafe-text="userText"></div>
  `
};

// 示例 43: 全局自定义指令v-unsafe-href
Vue.directive('unsafe-href', {
  inserted(el, binding) {
    el.href = binding.value;
  }
});

export default {
  name: 'GlobalCustomDirectiveHrefComponent',
  data() {
    return {
      userUrl: this.$route.query.url
    };
  },
  template: `
    <a v-unsafe-href="userUrl">Click here</a>
  `
};

// 示例 44: 全局自定义指令v-unsafe-src
Vue.directive('unsafe-src', {
  inserted(el, binding) {
    el.src = binding.value;
  }
});

export default {
  name: 'GlobalCustomDirectiveSrcComponent',
  data() {
    return {
      userImageUrl: this.$route.query.image
    };
  },
  template: `
    <img v-unsafe-src="userImageUrl" />
  `
};

// 示例 45: 全局自定义指令v-unsafe-style
Vue.directive('unsafe-style', {
  inserted(el, binding) {
    el.style.cssText = binding.value;
  }
});

export default {
  name: 'GlobalCustomDirectiveStyleComponent',
  data() {
    return {
      userStyle: this.$route.query.style
    };
  },
  template: `
    <div v-unsafe-style="userStyle">Content</div>
  `
};

// 示例 46: 全局自定义指令v-unsafe-class
Vue.directive('unsafe-class', {
  inserted(el, binding) {
    el.className = binding.value;
  }
});

export default {
  name: 'GlobalCustomDirectiveClassComponent',
  data() {
    return {
      userClass: this.$route.query.class
    };
  },
  template: `
    <div v-unsafe-class="userClass">Content</div>
  `
};

// 示例 47: 全局自定义指令v-unsafe-onclick
Vue.directive('unsafe-onclick', {
  inserted(el, binding) {
    el.onclick = () => {
      eval(binding.value);
    };
  }
});

export default {
  name: 'GlobalCustomDirectiveOnclickComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <button v-unsafe-onclick="userScript">Click me</button>
  `
};

// 示例 48: 全局自定义指令v-unsafe-onmouseover
Vue.directive('unsafe-onmouseover', {
  inserted(el, binding) {
    el.onmouseover = () => {
      eval(binding.value);
    };
  }
});

export default {
  name: 'GlobalCustomDirectiveOnmouseoverComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <div v-unsafe-onmouseover="userScript">Hover me</div>
  `
};

// 示例 49: 全局自定义指令v-unsafe-onload
Vue.directive('unsafe-onload', {
  inserted(el, binding) {
    el.onload = () => {
      eval(binding.value);
    };
  }
});

export default {
  name: 'GlobalCustomDirectiveOnloadComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <img v-unsafe-onload="userScript" src="image.jpg" />
  `
};

// 示例 50: 全局自定义指令v-unsafe-onerror
Vue.directive('unsafe-onerror', {
  inserted(el, binding) {
    el.onerror = () => {
      eval(binding.value);
    };
  }
});

export default {
  name: 'GlobalCustomDirectiveOnerrorComponent',
  data() {
    return {
      userScript: this.$route.query.script
    };
  },
  template: `
    <img v-unsafe-onerror="userScript" src="invalid.jpg" />
  `
};
