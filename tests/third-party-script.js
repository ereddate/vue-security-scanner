// Third-Party Script 漏洞示例文件

// 示例 1: 从不可信 CDN 加载脚本
export function thirdPartyScriptExample1() {
  const script = document.createElement('script');
  script.src = 'http://untrusted-cdn.com/script.js';
  document.head.appendChild(script);
}

// 示例 2: 加载未验证的第三方库
export function thirdPartyScriptExample2() {
  const script = document.createElement('script');
  script.src = 'https://example.com/library.js';
  document.head.appendChild(script);
}

// 示例 3: 使用过时的第三方库
export function thirdPartyScriptExample3() {
  const script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-1.6.0.min.js';
  document.head.appendChild(script);
}

// 示例 4: 加载包含已知漏洞的脚本
export function thirdPartyScriptExample4() {
  const script = document.createElement('script');
  script.src = 'https://example.com/vulnerable-library.js';
  document.head.appendChild(script);
}

// 示例 5: 从 HTTP 加载脚本
export function thirdPartyScriptExample5() {
  const script = document.createElement('script');
  script.src = 'http://example.com/script.js';
  document.head.appendChild(script);
}

// 示例 6: 动态加载第三方脚本
export function thirdPartyScriptExample6() {
  function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  }
  
  loadScript(userProvidedUrl);
}

// 示例 7: 加载分析脚本
export function thirdPartyScriptExample7() {
  const script = document.createElement('script');
  script.src = 'https://analytics.example.com/tracker.js';
  document.head.appendChild(script);
}

// 示例 8: 加载广告脚本
export function thirdPartyScriptExample8() {
  const script = document.createElement('script');
  script.src = 'https://ads.example.com/ad.js';
  document.head.appendChild(script);
}

// 示例 9: 加载社交插件脚本
export function thirdPartyScriptExample9() {
  const script = document.createElement('script');
  script.src = 'https://social.example.com/widget.js';
  document.head.appendChild(script);
}

// 示例 10: 加载聊天脚本
export function thirdPartyScriptExample10() {
  const script = document.createElement('script');
  script.src = 'https://chat.example.com/widget.js';
  document.head.appendChild(script);
}
