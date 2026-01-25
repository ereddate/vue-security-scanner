// Cookie Bomb 漏洞示例文件

// 示例 1: 设置超大 Cookie 值
export function cookieBombExample1() {
  // 危险：设置非常大的 Cookie 值
  const largeValue = 'A'.repeat(100000); // 100KB 的值
  document.cookie = `largeCookie=${largeValue}; path=/;`;
}

// 示例 2: 创建大量 Cookie
export function cookieBombExample2() {
  // 危险：创建大量 Cookie
  for (let i = 0; i < 1000; i++) {
    document.cookie = `cookie${i}=value${i}; path=/;`;
  }
}

// 示例 3: 设置超长 Cookie 名称
export function cookieBombExample3() {
  // 危险：设置超长 Cookie 名称
  const longName = 'cookieName'.repeat(1000);
  document.cookie = `${longName}=value; path=/;`;
}

// 示例 4: 组合 Cookie Bomb - 大量 + 大值
export function cookieBombExample4() {
  // 危险：结合大量 Cookie 和大值
  for (let i = 0; i < 500; i++) {
    const largeValue = `data_${i}_`.repeat(1000);
    document.cookie = `bombCookie${i}=${largeValue}; path=/;`;
  }
}

// 示例 5: 嵌套路径 Cookie Bomb
export function cookieBombExample5() {
  // 危险：在不同路径下设置大量 Cookie
  const paths = ['/app', '/user', '/admin', '/api', '/static'];
  for (const path of paths) {
    for (let i = 0; i < 200; i++) {
      document.cookie = `pathCookie${i}_${path.replace(/\//g, '')}=value${i}; path=${path};`;
    }
  }
}

// 示例 6: 使用子域名 Cookie Bomb
export function cookieBombExample6(domain) {
  // 危险：在多个子域名设置 Cookie
  const subdomains = ['api.', 'cdn.', 'static.', 'user.', 'admin.'];
  for (const subdomain of subdomains) {
    const fullDomain = `${subdomain}${domain}`;
    document.cookie = `domainBomb=value; domain=.${fullDomain}; path=/`;
  }
}

// 示例 7: 递归 Cookie 设置
export function cookieBombExample7() {
  // 危险：递归设置 Cookie
  function recursiveCookie(count) {
    if (count > 0) {
      document.cookie = `recursive${count}=${'data'.repeat(count * 100)}; path=/;`;
      recursiveCookie(count - 1);
    }
  }
  recursiveCookie(100);
}

// 示例 8: 动态 Cookie 名称生成
export function cookieBombExample8() {
  // 危险：使用动态生成的 Cookie 名称
  for (let i = 0; i < 300; i++) {
    const dynamicName = Math.random().toString(36).substring(2, 15) + i;
    const dynamicValue = new Array(500).fill(Math.random().toString(36)).join('');
    document.cookie = `${dynamicName}=${dynamicValue}; path=/;`;
  }
}

// 示例 9: 时间戳 Cookie Bomb
export function cookieBombExample9() {
  // 危险：使用时间戳创建大量唯一 Cookie
  for (let i = 0; i < 400; i++) {
    const timestamp = Date.now() + i;
    const value = `timestamp_value_${'X'.repeat(200)}`;
    document.cookie = `ts_${timestamp}=${value}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
  }
}

// 示例 10: URL 参数驱动的 Cookie Bomb
export function cookieBombExample10() {
  // 危险：根据 URL 参数设置 Cookie
  const urlParams = new URLSearchParams(window.location.search);
  for (const [param, value] of urlParams) {
    // 如果参数值很大或者参数很多，可能造成 Cookie Bomb
    const safeValue = value.toString().substring(0, 1000); // 截断以避免太大
    for (let i = 0; i < 50; i++) {
      document.cookie = `${param}_${i}=${safeValue}_${i}; path=/;`;
    }
  }
}

// 示例 11: 存储用户输入作为 Cookie
export function cookieBombExample11(userData) {
  // 危险：直接将用户输入存储为 Cookie 值
  const userInput = userData || new URLSearchParams(window.location.search).get('input');
  if (userInput) {
    // 如果 userInput 很大，会造成 Cookie Bomb
    document.cookie = `userInput=${encodeURIComponent(userInput)}; path=/;`;
  }
}

// 示例 12: 多属性 Cookie Bomb
export function cookieBombExample12() {
  // 危险：设置带有多个属性的大 Cookie
  for (let i = 0; i < 100; i++) {
    const largeValue = `data_${'A'.repeat(4000)}`;
    document.cookie = `multiAttr${i}=${largeValue}; ` +
                      `path=/; ` +
                      `domain=${document.domain}; ` +
                      `expires=Fri, 31 Dec 9999 23:59:59 GMT; ` +
                      `secure; ` +
                      `SameSite=Strict`;
  }
}

// 示例 13: 本地存储同步 Cookie Bomb
export function cookieBombExample13() {
  // 危险：从本地存储同步数据到 Cookie
  const storedData = localStorage.getItem('largeUserData');
  if (storedData && storedData.length > 1000) {
    // 如果本地存储的数据很大，同步到 Cookie 会造成问题
    document.cookie = `syncedData=${storedData}; path=/;`;
  }
}

// 示例 14: 会话数据 Cookie Bomb
export function cookieBombExample14() {
  // 危险：将会话数据存储为 Cookie
  const sessionData = {
    userId: 'user123',
    permissions: Array.from({length: 1000}, (_, i) => `perm_${i}`),
    preferences: {theme: 'dark', lang: 'en', layout: 'standard'},
    history: Array.from({length: 500}, (_, i) => ({page: `/page${i}`, time: Date.now()}))
  };
  
  const serializedData = JSON.stringify(sessionData);
  document.cookie = `session=${serializedData}; path=/;`;
}

// 示例 15: 图像数据 Cookie Bomb
export function cookieBombExample15(imageDataUrl) {
  // 危险：将图像数据存储为 Cookie
  if (imageDataUrl && imageDataUrl.startsWith('data:image')) {
    // 图像的 Data URL 通常很大
    document.cookie = `imageData=${imageDataUrl}; path=/;`;
  }
}

// 示例 16: 批量 Cookie 设置函数
export function cookieBombExample16(prefix = 'bomb', count = 200, valueSize = 1000) {
  // 危险：批量设置 Cookie 的函数
  for (let i = 0; i < count; i++) {
    const cookieName = `${prefix}_${i}`;
    const cookieValue = 'x'.repeat(valueSize);
    document.cookie = `${cookieName}=${cookieValue}; path=/;`;
  }
}

// 示例 17: 基于浏览器指纹的 Cookie Bomb
export function cookieBombExample17() {
  // 危险：收集浏览器指纹信息并存储为 Cookie
  const fingerprint = {
    userAgent: navigator.userAgent.repeat(10),
    plugins: Array.from(navigator.plugins).map(p => p.name).join('|').repeat(5),
    mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type).join('|').repeat(5),
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform
  };
  
  const fingerprintStr = JSON.stringify(fingerprint);
  document.cookie = `fingerprint=${fingerprintStr}; path=/;`;
}

// 示例 18: 状态同步 Cookie Bomb
export function cookieBombExample18(appState) {
  // 危险：将整个应用状态存储为 Cookie
  if (!appState) {
    // 模拟一个大的应用状态对象
    appState = {
      users: Array.from({length: 500}, (_, i) => ({id: i, name: `User${i}`, data: 'x'.repeat(100)})),
      settings: {theme: 'dark', lang: 'en', notifications: true},
      cache: Array.from({length: 300}, (_, i) => ({id: i, content: `cached_content_${i}`.repeat(50)})),
      history: Array.from({length: 1000}, (_, i) => ({action: `action_${i}`, timestamp: Date.now() - i}))
    };
  }
  
  const stateStr = JSON.stringify(appState);
  document.cookie = `appState=${stateStr}; path=/;`;
}

// 示例 19: 事件驱动的 Cookie Bomb
export function cookieBombExample19() {
  // 危险：通过事件监听器不断设置 Cookie
  let eventCount = 0;
  document.addEventListener('mousemove', () => {
    eventCount++;
    if (eventCount % 50 === 0) {  // 每50次事件设置一个 Cookie
      document.cookie = `mouseTrack_${eventCount}=${'track_data_'.repeat(200)}; path=/;`;
    }
  });
  
  document.addEventListener('keypress', () => {
    eventCount++;
    if (eventCount % 50 === 0) {
      document.cookie = `keyTrack_${eventCount}=${'key_data_'.repeat(200)}; path=/;`;
    }
  });
}

// 示例 20: 复合 Cookie Bomb - 综合多种技术
export function cookieBombExample20() {
  // 危险：综合多种技术的 Cookie Bomb
  try {
    // 步骤1: 设置基础 Cookie
    for (let i = 0; i < 100; i++) {
      document.cookie = `basic_${i}=${'a'.repeat(500)}; path=/;`;
    }
    
    // 步骤2: 设置带属性的 Cookie
    for (let i = 0; i < 50; i++) {
      document.cookie = `attribute_${i}=${'b'.repeat(1000)}; path=/; domain=${document.domain}; secure; SameSite=Lax`;
    }
    
    // 步骤3: 设置跨路径 Cookie
    const paths = Array.from({length: 20}, (_, i) => `/path${i}`);
    for (const path of paths) {
      for (let i = 0; i < 10; i++) {
        document.cookie = `path_${path.replace(/\//g, '')}_${i}=${'c'.repeat(800)}; path=${path};`;
      }
    }
    
    // 步骤4: 设置时间敏感 Cookie
    for (let i = 0; i < 30; i++) {
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 10);
      document.cookie = `time_${i}=${'d'.repeat(600)}; path=/; expires=${expireDate.toUTCString()};`;
    }
    
  } catch (e) {
    // 即使出现错误也继续尝试
    console.error('Cookie setting failed, but continuing...');
    // 继续设置更多 Cookie
    for (let i = 0; i < 20; i++) {
      document.cookie = `error_${i}=${'e'.repeat(700)}; path=/;`;
    }
  }
}
