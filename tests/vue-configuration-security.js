// Vue配置安全漏洞示例文件

// 示例 1: Vue 2 配置 - productionTip设置为false
Vue.config.productionTip = false;

// 示例 2: Vue 2 配置 - performance设置为true
Vue.config.performance = true;

// 示例 3: Vue 2 配置 - devtools设置为false
Vue.config.devtools = false;

// 示例 4: Vue 2 配置 - silent设置为true
Vue.config.silent = true;

// 示例 5: Vue 2 配置 - errorHandler未实现
Vue.config.errorHandler = (err, vm, info) => {
  console.error(err);
};

// 示例 6: Vue 2 配置 - warnHandler未实现
Vue.config.warnHandler = (msg, vm, trace) => {
  console.warn(msg);
};

// 示例 7: Vue 2 配置 - ignoredElements未验证
Vue.config.ignoredElements = [
  'custom-element',
  'another-custom-element'
];

// 示例 8: Vue 2 配置 - keyCodes未验证
Vue.config.keyCodes = {
  v: 86,
  f1: 112,
  'media-play-pause': 179
};

// 示例 9: Vue 2 配置 - async未验证
Vue.config.async = true;

// 示例 10: Vue 2 配置 - optionMergeStrategies未验证
Vue.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    return fromVal;
  }
};

// 示例 11: Vue 3 配置 - devtools设置为false
const app = createApp(App);
app.config.devtools = false;

// 示例 12: Vue 3 配置 - performance设置为true
app.config.performance = true;

// 示例 13: Vue 3 配置 - errorHandler未实现
app.config.errorHandler = (err, vm, info) => {
  console.error(err);
};

// 示例 14: Vue 3 配置 - warnHandler未实现
app.config.warnHandler = (msg, vm, trace) => {
  console.warn(msg);
};

// 示例 15: Vue 3 配置 - globalProperties未验证
app.config.globalProperties.$http = axios;
app.config.globalProperties.$api = 'https://api.example.com';
app.config.globalProperties.$apiKey = 'sk-1234567890';

// 示例 16: Vue 3 配置 - isCustomElement未验证
app.config.isCustomElement = tag => {
  return tag.startsWith('x-');
};

// 示例 17: Vue 3 配置 - optionMergeStrategies未验证
app.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    return fromVal;
  }
};

// 示例 18: Vue 3 配置 - compilerOptions未验证
app.config.compilerOptions = {
  isCustomElement: tag => tag.startsWith('x-'),
  whitespace: 'condense'
};

// 示例 19: Vue 3 配置 - compilerOptions.delimiters未验证
app.config.compilerOptions.delimiters = ['${', '}'];

// 示例 20: Vue 3 配置 - compilerOptions.comments未验证
app.config.compilerOptions.comments = true;

// 示例 21: Vue 3 配置 - compilerOptions.whitespace未验证
app.config.compilerOptions.whitespace = 'condense';

// 示例 22: Vue 2 全局混入 - 未验证
Vue.mixin({
  data() {
    return {
      globalData: window.location.query.data
    };
  }
});

// 示例 23: Vue 2 全局混入 - 包含敏感数据
Vue.mixin({
  data() {
    return {
      apiKey: 'sk-1234567890',
      password: 'secret123'
    };
  }
});

// 示例 24: Vue 2 全局混入 - 包含eval
Vue.mixin({
  methods: {
    executeCode(code) {
      eval(code);
    }
  }
});

// 示例 25: Vue 2 全局混入 - 包含危险方法
Vue.mixin({
  methods: {
    dangerousMethod() {
      const userCode = this.$route.query.code;
      eval(userCode);
    }
  }
});

// 示例 26: Vue 3 全局混入 - 未验证
app.mixin({
  data() {
    return {
      globalData: window.location.query.data
    };
  }
});

// 示例 27: Vue 3 全局混入 - 包含敏感数据
app.mixin({
  data() {
    return {
      apiKey: 'sk-1234567890',
      password: 'secret123'
    };
  }
});

// 示例 28: Vue 3 全局混入 - 包含eval
app.mixin({
  methods: {
    executeCode(code) {
      eval(code);
    }
  }
});

// 示例 29: Vue 3 全局混入 - 包含危险方法
app.mixin({
  methods: {
    dangerousMethod() {
      const userCode = this.$route.query.code;
      eval(userCode);
    }
  }
});

// 示例 30: Vue 2 全局指令 - 未验证
Vue.directive('unsafe-html', {
  inserted(el, binding) {
    el.innerHTML = binding.value;
  }
});

// 示例 31: Vue 2 全局指令 - 包含eval
Vue.directive('eval-directive', {
  inserted(el, binding) {
    eval(binding.value);
  }
});

// 示例 32: Vue 2 全局指令 - 包含危险操作
Vue.directive('dangerous-directive', {
  inserted(el, binding) {
    const userCode = binding.value;
    eval(userCode);
  }
});

// 示例 33: Vue 3 全局指令 - 未验证
app.directive('unsafe-html', {
  mounted(el, binding) {
    el.innerHTML = binding.value;
  }
});

// 示例 34: Vue 3 全局指令 - 包含eval
app.directive('eval-directive', {
  mounted(el, binding) {
    eval(binding.value);
  }
});

// 示例 35: Vue 3 全局指令 - 包含危险操作
app.directive('dangerous-directive', {
  mounted(el, binding) {
    const userCode = binding.value;
    eval(userCode);
  }
});

// 示例 36: Vue 2 全局组件 - 未验证
Vue.component('UnsafeComponent', {
  template: '<div v-html="userContent"></div>',
  data() {
    return {
      userContent: window.location.query.html
    };
  }
});

// 示例 37: Vue 2 全局组件 - 包含敏感数据
Vue.component('SensitiveComponent', {
  data() {
    return {
      apiKey: 'sk-1234567890',
      password: 'secret123'
    };
  }
});

// 示例 38: Vue 2 全局组件 - 包含eval
Vue.component('EvalComponent', {
  methods: {
    executeCode() {
      const userCode = this.$route.query.code;
      eval(userCode);
    }
  }
});

// 示例 39: Vue 3 全局组件 - 未验证
app.component('UnsafeComponent', {
  template: '<div v-html="userContent"></div>',
  data() {
    return {
      userContent: window.location.query.html
    };
  }
});

// 示例 40: Vue 3 全局组件 - 包含敏感数据
app.component('SensitiveComponent', {
  data() {
    return {
      apiKey: 'sk-1234567890',
      password: 'secret123'
    };
  }
});

// 示例 41: Vue 3 全局组件 - 包含eval
app.component('EvalComponent', {
  methods: {
    executeCode() {
      const userCode = this.$route.query.code;
      eval(userCode);
    }
  }
});

// 示例 42: Vue 2 全局过滤器 - 未验证
Vue.filter('unsafe', function(value) {
  return value;
});

// 示例 43: Vue 2 全局过滤器 - 包含eval
Vue.filter('eval-filter', function(value) {
  return eval(value);
});

// 示例 44: Vue 2 全局过滤器 - 包含危险操作
Vue.filter('dangerous-filter', function(value) {
  const userCode = value;
  return eval(userCode);
});

// 示例 45: Vue 2 全局过滤器 - 处理敏感数据
Vue.filter('sensitive-filter', function(value) {
  const apiKey = 'sk-1234567890';
  return value + apiKey;
});

// 示例 46: Vue 2 全局属性 - 未验证
Vue.prototype.$http = axios;
Vue.prototype.$api = 'https://api.example.com';
Vue.prototype.$apiKey = 'sk-1234567890';

// 示例 47: Vue 2 全局属性 - 包含敏感数据
Vue.prototype.$credentials = {
  username: 'admin',
  password: 'admin123',
  apiKey: 'sk-1234567890'
};

// 示例 48: Vue 2 全局属性 - 包含危险方法
Vue.prototype.$dangerousMethod = function(code) {
  eval(code);
};

// 示例 49: Vue 2 全局属性 - 包含eval
Vue.prototype.$eval = function(code) {
  return eval(code);
};

// 示例 50: Vue 2 全局属性 - 包含Function
Vue.prototype.$function = function(code) {
  return new Function(code)();
};

// 示例 51: Vue 3 全局属性 - 未验证
app.config.globalProperties.$http = axios;
app.config.globalProperties.$api = 'https://api.example.com';
app.config.globalProperties.$apiKey = 'sk-1234567890';

// 示例 52: Vue 3 全局属性 - 包含敏感数据
app.config.globalProperties.$credentials = {
  username: 'admin',
  password: 'admin123',
  apiKey: 'sk-1234567890'
};

// 示例 53: Vue 3 全局属性 - 包含危险方法
app.config.globalProperties.$dangerousMethod = function(code) {
  eval(code);
};

// 示例 54: Vue 3 全局属性 - 包含eval
app.config.globalProperties.$eval = function(code) {
  return eval(code);
};

// 示例 55: Vue 3 全局属性 - 包含Function
app.config.globalProperties.$function = function(code) {
  return new Function(code)();
};

// 示例 56: Vue 2 use - 未验证的插件
Vue.use(UnsafePlugin);

// 示例 57: Vue 2 use - 包含敏感数据的插件
Vue.use(SensitivePlugin, {
  apiKey: 'sk-1234567890',
  password: 'secret123'
});

// 示例 58: Vue 2 use - 包含eval的插件
Vue.use(EvalPlugin, {
  evalCode: true
});

// 示例 59: Vue 3 use - 未验证的插件
app.use(UnsafePlugin);

// 示例 60: Vue 3 use - 包含敏感数据的插件
app.use(SensitivePlugin, {
  apiKey: 'sk-1234567890',
  password: 'secret123'
});

// 示例 61: Vue 3 use - 包含eval的插件
app.use(EvalPlugin, {
  evalCode: true
});

// 示例 62: Vue 2 全局配置 - 未验证的选项
Vue.config.silent = true;
Vue.config.async = true;
Vue.config.devtools = false;

// 示例 63: Vue 2 全局配置 - 包含敏感数据
Vue.config.apiKey = 'sk-1234567890';
Vue.config.password = 'secret123';

// 示例 64: Vue 2 全局配置 - 包含危险选项
Vue.config.dangerousOption = true;
Vue.config.evalEnabled = true;

// 示例 65: Vue 3 全局配置 - 未验证的选项
app.config.silent = true;
app.config.async = true;
app.config.devtools = false;

// 示例 66: Vue 3 全局配置 - 包含敏感数据
app.config.apiKey = 'sk-1234567890';
app.config.password = 'secret123';

// 示例 67: Vue 3 全局配置 - 包含危险选项
app.config.dangerousOption = true;
app.config.evalEnabled = true;

// 示例 68: Vue 2 编译选项 - 未验证
Vue.config.compilerOptions = {
  delimiters: ['${', '}'],
  comments: true,
  whitespace: 'condense'
};

// 示例 69: Vue 2 编译选项 - 包含敏感数据
Vue.config.compilerOptions = {
  apiKey: 'sk-1234567890',
  password: 'secret123'
};

// 示例 70: Vue 2 编译选项 - 包含危险选项
Vue.config.compilerOptions = {
  evalEnabled: true,
  dangerousOption: true
};

// 示例 71: Vue 3 编译选项 - 未验证
app.config.compilerOptions = {
  delimiters: ['${', '}'],
  comments: true,
  whitespace: 'condense'
};

// 示例 72: Vue 3 编译选项 - 包含敏感数据
app.config.compilerOptions = {
  apiKey: 'sk-1234567890',
  password: 'secret123'
};

// 示例 73: Vue 3 编译选项 - 包含危险选项
app.config.compilerOptions = {
  evalEnabled: true,
  dangerousOption: true
};

// 示例 74: Vue 2 自定义元素 - 未验证
Vue.config.ignoredElements = [
  'custom-element',
  'another-custom-element',
  'user-provided-element'
];

// 示例 75: Vue 2 自定义元素 - 包含敏感数据
Vue.config.ignoredElements = [
  'api-key-element',
  'password-element'
];

// 示例 76: Vue 2 自定义元素 - 包含危险元素
Vue.config.ignoredElements = [
  'eval-element',
  'script-element',
  'iframe-element'
];

// 示例 77: Vue 3 自定义元素 - 未验证
app.config.isCustomElement = tag => {
  return tag.startsWith('x-') || tag.startsWith('user-');
};

// 示例 78: Vue 3 自定义元素 - 包含敏感数据
app.config.isCustomElement = tag => {
  return tag.includes('api-key') || tag.includes('password');
};

// 示例 79: Vue 3 自定义元素 - 包含危险元素
app.config.isCustomElement = tag => {
  return tag.includes('eval') || tag.includes('script') || tag.includes('iframe');
};

// 示例 80: Vue 2 键码 - 未验证
Vue.config.keyCodes = {
  v: 86,
  f1: 112,
  'media-play-pause': 179,
  'user-defined-key': 999
};

// 示例 81: Vue 2 键码 - 包含敏感数据
Vue.config.keyCodes = {
  'api-key': 123,
  'password': 456
};

// 示例 82: Vue 2 键码 - 包含危险键码
Vue.config.keyCodes = {
  'eval-key': 999,
  'dangerous-key': 888
};

// 示例 83: Vue 2 错误处理 - 未验证
Vue.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info);
};

// 示例 84: Vue 2 错误处理 - 泄露敏感信息
Vue.config.errorHandler = (err, vm, info) => {
  alert(`Error: ${err.message}\nAPI Key: ${vm.$apiKey}`);
};

// 示例 85: Vue 2 错误处理 - 包含eval
Vue.config.errorHandler = (err, vm, info) => {
  eval(`console.error('${err.message}')`);
};

// 示例 86: Vue 3 错误处理 - 未验证
app.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info);
};

// 示例 87: Vue 3 错误处理 - 泄露敏感信息
app.config.errorHandler = (err, vm, info) => {
  alert(`Error: ${err.message}\nAPI Key: ${vm.$apiKey}`);
};

// 示例 88: Vue 3 错误处理 - 包含eval
app.config.errorHandler = (err, vm, info) => {
  eval(`console.error('${err.message}')`);
};

// 示例 89: Vue 2 警告处理 - 未验证
Vue.config.warnHandler = (msg, vm, trace) => {
  console.warn(msg, vm, trace);
};

// 示例 90: Vue 2 警告处理 - 泄露敏感信息
Vue.config.warnHandler = (msg, vm, trace) => {
  alert(`Warning: ${msg}\nAPI Key: ${vm.$apiKey}`);
};

// 示例 91: Vue 2 警告处理 - 包含eval
Vue.config.warnHandler = (msg, vm, trace) => {
  eval(`console.warn('${msg}')`);
};

// 示例 92: Vue 3 警告处理 - 未验证
app.config.warnHandler = (msg, vm, trace) => {
  console.warn(msg, vm, trace);
};

// 示例 93: Vue 3 警告处理 - 泄露敏感信息
app.config.warnHandler = (msg, vm, trace) => {
  alert(`Warning: ${msg}\nAPI Key: ${vm.$apiKey}`);
};

// 示例 94: Vue 3 警告处理 - 包含eval
app.config.warnHandler = (msg, vm, trace) => {
  eval(`console.warn('${msg}')`);
};

// 示例 95: Vue 2 选项合并策略 - 未验证
Vue.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    return fromVal;
  }
};

// 示例 96: Vue 2 选项合并策略 - 包含敏感数据
Vue.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    return { ...toVal, ...fromVal, apiKey: 'sk-1234567890' };
  }
};

// 示例 97: Vue 2 选项合并策略 - 包含eval
Vue.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    eval('console.log("Merging options")');
    return fromVal;
  }
};

// 示例 98: Vue 3 选项合并策略 - 未验证
app.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    return fromVal;
  }
};

// 示例 99: Vue 3 选项合并策略 - 包含敏感数据
app.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    return { ...toVal, ...fromVal, apiKey: 'sk-1234567890' };
  }
};

// 示例 100: Vue 3 选项合并策略 - 包含eval
app.config.optionMergeStrategies = {
  created: function (toVal, fromVal) {
    eval('console.log("Merging options")');
    return fromVal;
  }
};
