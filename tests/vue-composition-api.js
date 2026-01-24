// Vue Composition API安全漏洞示例文件

import { ref, reactive, computed, watch, watchEffect, onMounted, onUnmounted, provide, inject } from 'vue';

// 示例 1: ref使用用户输入
export function useUserInput() {
  const userInput = ref(window.location.search);
  return { userInput };
}

// 示例 2: reactive使用用户输入
export function useUserReactive() {
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

// 示例 7: provide提供用户输入
export function useUnsafeProvide() {
  const userContent = ref(window.location.query.content);
  provide('userContent', userContent);
  return { userContent };
}

// 示例 8: inject注入用户输入
export function useUnsafeInject() {
  const userContent = inject('userContent');
  return { userContent };
}

// 示例 9: onMounted中添加事件监听器未清理
export function useUnsafeMounted() {
  onMounted(() => {
    window.addEventListener('resize', () => {
      console.log('Window resized');
    });
  });
}

// 示例 10: onUnmounted中未清理事件监听器
export function useUnsafeUnmounted() {
  const handler = () => console.log('Handler');
  
  onMounted(() => {
    window.addEventListener('click', handler);
  });
  
  onUnmounted(() => {
    // 缺少 removeEventListener
  });
}

// 示例 11: ref存储敏感数据
export function useSensitiveRef() {
  const apiKey = ref('sk-1234567890');
  const password = ref('secret123');
  return { apiKey, password };
}

// 示例 12: reactive存储敏感数据
export function useSensitiveReactive() {
  const credentials = reactive({
    username: 'admin',
    password: 'admin123',
    apiKey: 'sk-1234567890'
  });
  return { credentials };
}

// 示例 13: computed暴露敏感数据
export function useSensitiveComputed() {
  const apiKey = ref('sk-1234567890');
  const exposedKey = computed(() => apiKey.value);
  return { exposedKey };
}

// 示例 14: watch记录敏感数据
export function useSensitiveWatch() {
  const password = ref('secret123');
  
  watch(password, (newPass) => {
    console.log('Password changed:', newPass);
  });
}

// 示例 15: watchEffect记录敏感数据
export function useSensitiveWatchEffect() {
  const token = ref('abc123def456');
  
  watchEffect(() => {
    console.log('Token:', token.value);
  });
}

// 示例 16: ref存储大对象导致内存泄漏
export function useLargeRef() {
  const largeArray = ref(new Array(1000000).fill('data'));
  return { largeArray };
}

// 示例 17: reactive存储大对象导致内存泄漏
export function useLargeReactive() {
  const largeObject = reactive({
    data: new Array(1000000).fill('data')
  });
  return { largeObject };
}

// 示例 18: computed创建循环引用
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

// 示例 19: watch创建循环依赖
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

// 示例 20: ref使用不安全的随机数
export function useWeakRandomRef() {
  const sessionId = ref(Math.random().toString(36));
  const token = ref(Math.random().toString(36));
  return { sessionId, token };
}

// 示例 21: reactive使用不安全的随机数
export function useWeakRandomReactive() {
  const credentials = reactive({
    sessionId: Math.random().toString(36),
    token: Math.random().toString(36)
  });
  return { credentials };
}

// 示例 22: computed使用不安全的随机数
export function useWeakRandomComputed() {
  const randomValue = computed(() => {
    return Math.random().toString(36);
  });
  return { randomValue };
}

// 示例 23: ref存储未验证的URL
export function useUnsafeURLRef() {
  const redirectUrl = ref(window.location.query.redirect);
  const imageUrl = ref(window.location.query.image);
  return { redirectUrl, imageUrl };
}

// 示例 24: reactive存储未验证的URL
export function useUnsafeURLReactive() {
  const urls = reactive({
    redirect: window.location.query.redirect,
    image: window.location.query.image,
    api: window.location.query.api
  });
  return { urls };
}

// 示例 25: computed构建未验证的URL
export function useUnsafeURLComputed() {
  const baseUrl = ref('https://api.example.com');
  const endpoint = ref(window.location.query.endpoint);
  
  const fullUrl = computed(() => {
    return `${baseUrl.value}/${endpoint.value}`;
  });
  
  return { fullUrl };
}

// 示例 26: ref存储未验证的HTML
export function useUnsafeHTMLRef() {
  const userContent = ref(window.location.query.html);
  return { userContent };
}

// 示例 27: reactive存储未验证的HTML
export function useUnsafeHTMLReactive() {
  const content = reactive({
    header: window.location.query.header,
    body: window.location.query.body,
    footer: window.location.query.footer
  });
  return { content };
}

// 示例 28: computed处理未验证的HTML
export function useUnsafeHTMLComputed() {
  const rawContent = ref(window.location.query.content);
  const processedContent = computed(() => {
    return rawContent.value;
  });
  return { processedContent };
}

// 示例 29: ref存储未验证的SQL
export function useUnsafeSQLRef() {
  const query = ref(window.location.query.sql);
  return { query };
}

// 示例 30: reactive存储未验证的SQL
export function useUnsafeSQLReactive() {
  const queries = reactive({
    select: window.location.query.select,
    insert: window.location.query.insert,
    update: window.location.query.update,
    delete: window.location.query.delete
  });
  return { queries };
}

// 示例 31: watch执行未验证的代码
export function useUnsafeCodeWatch() {
  const code = ref(window.location.query.code);
  
  watch(code, (newCode) => {
    eval(newCode);
  });
}

// 示例 32: watchEffect执行未验证的代码
export function useUnsafeCodeWatchEffect() {
  const code = ref(window.location.query.code);
  
  watchEffect(() => {
    eval(code.value);
  });
}

// 示例 33: onMounted执行未验证的代码
export function useUnsafeCodeMounted() {
  onMounted(() => {
    const code = window.location.query.code;
    eval(code);
  });
}

// 示例 34: provide提供未验证的数据
export function useUnsafeProvideData() {
  const userData = reactive({
    name: window.location.query.name,
    email: window.location.query.email,
    role: window.location.query.role
  });
  
  provide('userData', userData);
  return { userData };
}

// 示例 35: inject注入未验证的数据
export function useUnsafeInjectData() {
  const userData = inject('userData');
  return { userData };
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
