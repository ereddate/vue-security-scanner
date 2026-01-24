// 动态导入安全漏洞示例文件

// 示例 1: 根据用户输入动态导入组件
export function loadComponentFromUserInput(componentName) {
  return import(`../components/${componentName}.vue`);
}

// 示例 2: 根据路由参数动态导入
export function loadComponentFromRouteParam() {
  const componentName = this.$route.params.component;
  return import(`../components/${componentName}.vue`);
}

// 示例 3: 根据查询参数动态导入
export function loadComponentFromQueryParam() {
  const componentName = this.$route.query.component;
  return import(`../components/${componentName}.vue`);
}

// 示例 4: 根据用户输入动态导入模块
export function loadModuleFromUserInput(moduleName) {
  return import(`../modules/${moduleName}.js`);
}

// 示例 5: 根据用户输入动态导入插件
export function loadPluginFromUserInput(pluginName) {
  return import(`../plugins/${pluginName}.js`);
}

// 示例 6: 根据用户输入动态导入工具
export function loadUtilityFromUserInput(utilityName) {
  return import(`../utils/${utilityName}.js`);
}

// 示例 7: 根据用户输入动态导入配置
export function loadConfigFromUserInput(configName) {
  return import(`../config/${configName}.js`);
}

// 示例 8: 根据用户输入动态导入服务
export function loadServiceFromUserInput(serviceName) {
  return import(`../services/${serviceName}.js`);
}

// 示例 9: 根据用户输入动态导入API
export function loadAPIFromUserInput(apiName) {
  return import(`../api/${apiName}.js`);
}

// 示例 10: 根据用户输入动态导入中间件
export function loadMiddlewareFromUserInput(middlewareName) {
  return import(`../middleware/${middlewareName}.js`);
}

// 示例 11: Vue组件中的动态导入
export default {
  name: 'DynamicImportComponent',
  methods: {
    async loadComponent(componentName) {
      const component = await import(`../components/${componentName}.vue`);
      return component.default;
    },
    
    async loadModule(moduleName) {
      const module = await import(`../modules/${moduleName}.js`);
      return module;
    },
    
    async loadPlugin(pluginName) {
      const plugin = await import(`../plugins/${pluginName}.js`);
      return plugin.default;
    }
  },
  
  async mounted() {
    const componentName = this.$route.query.component;
    const component = await this.loadComponent(componentName);
    this.currentComponent = component;
  }
};

// 示例 12: 根据用户输入动态导入路由
export function loadRouteFromUserInput(routeName) {
  return import(`../routes/${routeName}.js`);
}

// 示例 13: 根据用户输入动态导入存储
export function loadStoreFromUserInput(storeName) {
  return import(`../stores/${storeName}.js`);
}

// 示例 14: 根据用户输入动态导入视图
export function loadViewFromUserInput(viewName) {
  return import(`../views/${viewName}.vue`);
}

// 示例 15: 根据用户输入动态导入布局
export function loadLayoutFromUserInput(layoutName) {
  return import(`../layouts/${layoutName}.vue`);
}

// 示例 16: 根据用户输入动态导入页面
export function loadPageFromUserInput(pageName) {
  return import(`../pages/${pageName}.vue`);
}

// 示例 17: 根据用户输入动态导入资源
export function loadAssetFromUserInput(assetName) {
  return import(`../assets/${assetName}`);
}

// 示例 18: 根据用户输入动态导入样式
export function loadStyleFromUserInput(styleName) {
  return import(`../styles/${styleName}.css`);
}

// 示例 19: 根据用户输入动态导入脚本
export function loadScriptFromUserInput(scriptName) {
  return import(`../scripts/${scriptName}.js`);
}

// 示例 20: 根据用户输入动态导入模板
export function loadTemplateFromUserInput(templateName) {
  return import(`../templates/${templateName}.html`);
}

// 示例 21: 根据用户输入动态导入语言包
export function loadLocaleFromUserInput(locale) {
  return import(`../locales/${locale}.js`);
}

// 示例 22: 根据用户输入动态导入主题
export function loadThemeFromUserInput(themeName) {
  return import(`../themes/${themeName}.css`);
}

// 示例 23: 根据用户输入动态导入图标
export function loadIconFromUserInput(iconName) {
  return import(`../icons/${iconName}.svg`);
}

// 示例 24: 根据用户输入动态导入图片
export function loadImageFromUserInput(imageName) {
  return import(`../images/${imageName}.png`);
}

// 示例 25: 根据用户输入动态导入字体
export function loadFontFromUserInput(fontName) {
  return import(`../fonts/${fontName}.woff2`);
}

// 示例 26: 路径遍历攻击
export function loadComponentWithPathTraversal(componentName) {
  return import(`../components/${componentName}.vue`);
}

// 示例 27: 绝对路径导入
export function loadComponentWithAbsolutePath(componentName) {
  return import(`/components/${componentName}.vue`);
}

// 示例 28: 相对路径导入
export function loadComponentWithRelativePath(componentName) {
  return import(`./${componentName}.vue`);
}

// 示例 29: 动态导入外部模块
export function loadExternalModule(moduleUrl) {
  return import(moduleUrl);
}

// 示例 30: 动态导入第三方库
export function loadThirdPartyLibrary(libraryName) {
  return import(`https://cdn.jsdelivr.net/npm/${libraryName}`);
}

// 示例 31: Vue 3中的动态导入
import { defineAsyncComponent } from 'vue';

export default {
  name: 'AsyncComponentLoader',
  components: {
    DynamicComponent: defineAsyncComponent(() => {
      const componentName = this.$route.query.component;
      return import(`../components/${componentName}.vue`);
    })
  }
};

// 示例 32: Nuxt.js中的动态导入
export default {
  name: 'NuxtDynamicImport',
  async asyncData({ params }) {
    const componentName = params.component;
    const component = await import(`~/components/${componentName}.vue`);
    return { component: component.default };
  }
};

// 示例 33: Webpack中的动态导入
export function webpackDynamicImport(componentName) {
  return import(
    webpackChunkName => "dynamic-components" 
    `../components/${componentName}.vue`
  );
}

// 示例 34: Vite中的动态导入
export function viteDynamicImport(componentName) {
  return import(
    `../components/${componentName}.vue`
  );
}

// 示例 35: 条件动态导入
export function conditionalDynamicImport(condition, componentName) {
  if (condition) {
    return import(`../components/${componentName}.vue`);
  } else {
    return import(`../components/Default.vue`);
  }
}

// 示例 36: 循环动态导入
export async function loopDynamicImport(componentNames) {
  const components = [];
  for (const name of componentNames) {
    const component = await import(`../components/${name}.vue`);
    components.push(component.default);
  }
  return components;
}

// 示例 37: 异步动态导入
export async function asyncDynamicImport(componentName) {
  try {
    const component = await import(`../components/${componentName}.vue`);
    return component.default;
  } catch (error) {
    console.error('Failed to load component:', error);
  }
}

// 示例 38: 错误处理的动态导入
export async function dynamicImportWithErrorHandling(componentName) {
  try {
    const component = await import(`../components/${componentName}.vue`);
    return component.default;
  } catch (error) {
    console.error('Component not found:', componentName);
    return null;
  }
}

// 示例 39: 预加载动态导入
export function preloadDynamicImport(componentName) {
  const component = import(`../components/${componentName}.vue`);
  return component;
}

// 示例 40: 懒加载动态导入
export function lazyLoadDynamicImport(componentName) {
  return () => import(`../components/${componentName}.vue`);
}
