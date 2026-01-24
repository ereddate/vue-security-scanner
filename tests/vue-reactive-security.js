// Vue响应式安全漏洞示例文件

import { ref, reactive, computed, watch, watchEffect, toRef, toRefs, shallowRef, shallowReactive, readonly, shallowReadonly } from 'vue';

// 示例 1: ref存储用户输入
export function useUserInputRef() {
  const userInput = ref(window.location.search);
  return { userInput };
}

// 示例 2: reactive存储用户输入
export function useUserInputReactive() {
  const userState = reactive({
    data: window.location.hash
  });
  return { userState };
}

// 示例 3: computed中使用eval
export function useUnsafeComputed() {
  const expression = ref(window.location.query.expr);
  const result = computed(() => {
    return eval(expression.value);
  });
  return { result };
}

// 示例 4: computed中使用Function
export function useUnsafeFunctionComputed() {
  const code = ref(window.location.query.code);
  const result = computed(() => {
    return new Function(code.value)();
  });
  return { result };
}

// 示例 5: watch中使用eval
export function useUnsafeWatch() {
  const data = ref('');
  const expression = ref(window.location.query.expr);
  
  watch(expression, (newExpr) => {
    eval(newExpr);
  });
  
  return { data };
}

// 示例 6: watchEffect中使用eval
export function useUnsafeWatchEffect() {
  const expression = ref(window.location.query.expr);
  
  watchEffect(() => {
    eval(expression.value);
  });
}

// 示例 7: ref存储敏感数据
export function useSensitiveRef() {
  const apiKey = ref('sk-1234567890');
  const password = ref('secret123');
  return { apiKey, password };
}

// 示例 8: reactive存储敏感数据
export function useSensitiveReactive() {
  const credentials = reactive({
    username: 'admin',
    password: 'admin123',
    apiKey: 'sk-1234567890'
  });
  return { credentials };
}

// 示例 9: computed暴露敏感数据
export function useSensitiveComputed() {
  const apiKey = ref('sk-1234567890');
  const exposedKey = computed(() => apiKey.value);
  return { exposedKey };
}

// 示例 10: watch记录敏感数据
export function useSensitiveWatch() {
  const password = ref('secret123');
  
  watch(password, (newPass) => {
    console.log('Password changed:', newPass);
  });
}

// 示例 11: watchEffect记录敏感数据
export function useSensitiveWatchEffect() {
  const token = ref('abc123def456');
  
  watchEffect(() => {
    console.log('Token:', token.value);
  });
}

// 示例 12: ref存储大对象导致内存泄漏
export function useLargeRef() {
  const largeArray = ref(new Array(1000000).fill('data'));
  return { largeArray };
}

// 示例 13: reactive存储大对象导致内存泄漏
export function useLargeReactive() {
  const largeObject = reactive({
    data: new Array(1000000).fill('data')
  });
  return { largeObject };
}

// 示例 14: computed创建循环引用
export function useCircularComputed() {
  const data = ref({});
  
  const computed1 = computed(() => {
    return { value: data.value };
  });
  
  const computed2 = computed(() => {
    return { ref: computed1.value };
  });
  
  return { computed1, computed2 };
}

// 示例 15: watch创建循环依赖
export function useCircularWatch() {
  const data1 = ref('');
  const data2 = ref('');
  
  watch(data1, (newVal) => {
    data2.value = newVal;
  });
  
  watch(data2, (newVal) => {
    data1.value = newVal;
  });
  
  return { data1, data2 };
}

// 示例 16: ref使用不安全的随机数
export function useWeakRandomRef() {
  const sessionId = ref(Math.random().toString(36));
  const token = ref(Math.random().toString(36));
  return { sessionId, token };
}

// 示例 17: reactive使用不安全的随机数
export function useWeakRandomReactive() {
  const credentials = reactive({
    sessionId: Math.random().toString(36),
    token: Math.random().toString(36)
  });
  return { credentials };
}

// 示例 18: computed使用不安全的随机数
export function useWeakRandomComputed() {
  const randomValue = computed(() => {
    return Math.random().toString(36);
  });
  return { randomValue };
}

// 示例 19: ref存储未验证的URL
export function useUnsafeURLRef() {
  const redirectUrl = ref(window.location.query.redirect);
  const imageUrl = ref(window.location.query.image);
  return { redirectUrl, imageUrl };
}

// 示例 20: reactive存储未验证的URL
export function useUnsafeURLReactive() {
  const urls = reactive({
    redirect: window.location.query.redirect,
    image: window.location.query.image,
    api: window.location.query.api
  });
  return { urls };
}

// 示例 21: computed构建未验证的URL
export function useUnsafeURLComputed() {
  const baseUrl = ref('https://api.example.com');
  const endpoint = ref(window.location.query.endpoint);
  
  const fullUrl = computed(() => {
    return `${baseUrl.value}/${endpoint.value}`;
  });
  
  return { fullUrl };
}

// 示例 22: ref存储未验证的HTML
export function useUnsafeHTMLRef() {
  const userContent = ref(window.location.query.html);
  return { userContent };
}

// 示例 23: reactive存储未验证的HTML
export function useUnsafeHTMLReactive() {
  const content = reactive({
    header: window.location.query.header,
    body: window.location.query.body,
    footer: window.location.query.footer
  });
  return { content };
}

// 示例 24: computed处理未验证的HTML
export function useUnsafeHTMLComputed() {
  const rawContent = ref(window.location.query.content);
  const processedContent = computed(() => {
    return rawContent.value;
  });
  return { processedContent };
}

// 示例 25: ref存储未验证的SQL
export function useUnsafeSQLRef() {
  const query = ref(window.location.query.sql);
  return { query };
}

// 示例 26: reactive存储未验证的SQL
export function useUnsafeSQLReactive() {
  const queries = reactive({
    select: window.location.query.select,
    insert: window.location.query.insert,
    update: window.location.query.update,
    delete: window.location.query.delete
  });
  return { queries };
}

// 示例 27: toRef创建用户输入引用
export function useUnsafeToRef() {
  const userState = reactive({
    input: window.location.query.input
  });
  const userInput = toRef(userState, 'input');
  return { userInput };
}

// 示例 28: toRefs创建用户输入引用
export function useUnsafeToRefs() {
  const userState = reactive({
    input1: window.location.query.input1,
    input2: window.location.query.input2,
    input3: window.location.query.input3
  });
  return toRefs(userState);
}

// 示例 29: shallowRef存储用户输入
export function useShallowRef() {
  const userObject = shallowRef({
    data: window.location.query.data
  });
  return { userObject };
}

// 示例 30: shallowReactive存储用户输入
export function useShallowReactive() {
  const userState = shallowReactive({
    data: window.location.query.data
  });
  return { userState };
}

// 示例 31: readonly暴露敏感数据
export function useReadonlySensitive() {
  const apiKey = ref('sk-1234567890');
  const readonlyKey = readonly(apiKey);
  return { readonlyKey };
}

// 示例 32: shallowReadonly暴露敏感数据
export function useShallowReadonlySensitive() {
  const credentials = reactive({
    apiKey: 'sk-1234567890',
    password: 'secret123'
  });
  const readonlyCredentials = shallowReadonly(credentials);
  return { readonlyCredentials };
}

// 示例 33: computed中执行用户代码
export function useUserCodeComputed() {
  const userCode = ref(window.location.query.code);
  const result = computed(() => {
    return eval(userCode.value);
  });
  return { result };
}

// 示例 34: watch中执行用户代码
export function useUserCodeWatch() {
  const userCode = ref(window.location.query.code);
  
  watch(userCode, (newCode) => {
    eval(newCode);
  });
}

// 示例 35: watchEffect中执行用户代码
export function useUserCodeWatchEffect() {
  const userCode = ref(window.location.query.code);
  
  watchEffect(() => {
    eval(userCode.value);
  });
}

// 示例 36: ref存储原型污染数据
export function usePrototypePollutionRef() {
  const userObject = ref(window.location.query.obj);
  return { userObject };
}

// 示例 37: reactive存储原型污染数据
export function usePrototypePollutionReactive() {
  const pollutedData = reactive({
    __proto__: window.location.query.proto,
    constructor: window.location.query.constructor
  });
  return { pollutedData };
}

// 示例 38: computed处理原型污染数据
export function usePrototypePollutionComputed() {
  const pollutedData = ref(window.location.query.data);
  const processedData = computed(() => {
    return pollutedData.value;
  });
  return { processedData };
}

// 示例 39: watch合并原型污染数据
export function usePrototypePollutionWatch() {
  const target = ref({});
  const source = ref(window.location.query.source);
  
  watch(source, (newSource) => {
    Object.assign(target.value, newSource);
  });
}

// 示例 40: ref存储路径遍历数据
export function usePathTraversalRef() {
  const filePath = ref(window.location.query.path);
  return { filePath };
}

// 示例 41: reactive存储路径遍历数据
export function usePathTraversalReactive() {
  const paths = reactive({
    upload: window.location.query.upload,
    download: window.location.query.download,
    delete: window.location.query.delete
  });
  return { paths };
}

// 示例 42: computed构建路径遍历URL
export function usePathTraversalComputed() {
  const basePath = ref('/api/files');
  const fileName = ref(window.location.query.file);
  
  const fullPath = computed(() => {
    return `${basePath.value}/${fileName.value}`;
  });
  
  return { fullPath };
}

// 示例 43: ref存储命令注入数据
export function useCommandInjectionRef() {
  const command = ref(window.location.query.cmd);
  return { command };
}

// 示例 44: reactive存储命令注入数据
export function useCommandInjectionReactive() {
  const commands = reactive({
    exec: window.location.query.exec,
    spawn: window.location.query.spawn,
    fork: window.location.query.fork
  });
  return { commands };
}

// 示例 45: computed构建命令注入字符串
export function useCommandInjectionComputed() {
  const baseCommand = ref('ls');
  const argument = ref(window.location.query.arg);
  
  const fullCommand = computed(() => {
    return `${baseCommand.value} ${argument.value}`;
  });
  
  return { fullCommand };
}

// 示例 46: ref存储SSRF数据
export function useSSRFRef() {
  const targetUrl = ref(window.location.query.url);
  return { targetUrl };
}

// 示例 47: reactive存储SSRF数据
export function useSSRFReactive() {
  const urls = reactive({
    internal: window.location.query.internal,
    external: window.location.query.external,
    metadata: window.location.query.metadata
  });
  return { urls };
}

// 示例 48: computed构建SSRF URL
export function useSSRFComputed() {
  const baseUrl = ref('http://api.example.com');
  const endpoint = ref(window.location.query.endpoint);
  
  const fullUrl = computed(() => {
    return `${baseUrl.value}/${endpoint.value}`;
  });
  
  return { fullUrl };
}

// 示例 49: ref存储开放重定向数据
export function useOpenRedirectRef() {
  const redirectUrl = ref(window.location.query.redirect);
  return { redirectUrl };
}

// 示例 50: reactive存储开放重定向数据
export function useOpenRedirectReactive() {
  const redirects = reactive({
    login: window.location.query.login,
    logout: window.location.query.logout,
    callback: window.location.query.callback
  });
  return { redirects };
}

// 示例 51: watch创建内存泄漏
export function useWatchMemoryLeak() {
  const data = ref('');
  const handlers = [];
  
  watch(data, (newVal) => {
    handlers.push(() => console.log(newVal));
  });
}

// 示例 52: watchEffect创建内存泄漏
export function useWatchEffectMemoryLeak() {
  const data = ref('');
  const effects = [];
  
  effects.push(watchEffect(() => {
    console.log(data.value);
  }));
}

// 示例 53: computed缓存导致内存泄漏
export function useComputedMemoryLeak() {
  const largeData = ref(new Array(1000000).fill('data'));
  const computedData = computed(() => {
    return largeData.value.map(item => item.toUpperCase());
  });
  return { computedData };
}

// 示例 54: ref嵌套导致内存泄漏
export function useNestedRefMemoryLeak() {
  const level1 = ref({});
  const level2 = ref({});
  const level3 = ref({});
  
  level1.value.level2 = level2;
  level2.value.level3 = level3;
  level3.value.level1 = level1;
}

// 示例 55: reactive嵌套导致内存泄漏
export function useNestedReactiveMemoryLeak() {
  const level1 = reactive({});
  const level2 = reactive({});
  const level3 = reactive({});
  
  level1.level2 = level2;
  level2.level3 = level3;
  level3.level1 = level1;
}

// 示例 56: watch深度监听大对象
export function useDeepWatchMemoryLeak() {
  const largeObject = reactive({
    data: new Array(100000).fill({ nested: { value: 'data' } })
  });
  
  watch(largeObject, (newVal) => {
    console.log('Object changed');
  }, { deep: true });
}

// 示例 57: watchEffect频繁触发
export function useFrequentWatchEffect() {
  const data = ref('');
  
  watchEffect(() => {
    console.log('Data:', data.value);
  });
  
  data.value = 'a';
  data.value = 'ab';
  data.value = 'abc';
  data.value = 'abcd';
}

// 示例 58: computed依赖链过长
export function useLongComputedChain() {
  const data = ref('data');
  
  const computed1 = computed(() => data.value + '1');
  const computed2 = computed(() => computed1.value + '2');
  const computed3 = computed(() => computed2.value + '3');
  const computed4 = computed(() => computed3.value + '4');
  const computed5 = computed(() => computed4.value + '5');
  const computed6 = computed(() => computed5.value + '6');
  const computed7 = computed(() => computed6.value + '7');
  const computed8 = computed(() => computed7.value + '8');
  const computed9 = computed(() => computed8.value + '9');
  const computed10 = computed(() => computed9.value + '10');
}

// 示例 59: ref存储DOM引用
export function useDOMRef() {
  const elementRef = ref(null);
  
  return { elementRef };
}

// 示例 60: reactive存储DOM引用
export function useDOMReactive() {
  const elements = reactive({
    header: null,
    footer: null,
    sidebar: null
  });
  
  return { elements };
}
