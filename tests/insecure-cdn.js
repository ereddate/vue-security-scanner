// Insecure CDN 漏洞示例文件

// 示例 1: 使用 HTTP CDN
export function insecureCdnExample1() {
  const script = document.createElement('script');
  script.src = 'http://cdn.example.com/library.js';
  document.head.appendChild(script);
}

// 示例 2: 使用不可信 CDN
export function insecureCdnExample2() {
  const script = document.createElement('script');
  script.src = 'https://untrusted-cdn.com/library.js';
  document.head.appendChild(script);
}

// 示例 3: 缺少 CDN 完整性验证
export function insecureCdnExample3() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/library.js';
  document.head.appendChild(script);
}

// 示例 4: 使用过时的 CDN 版本
export function insecureCdnExample4() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/library@1.0.0.js';
  document.head.appendChild(script);
}

// 示例 5: 使用公共 CDN 加载敏感资源
export function insecureCdnExample5() {
  const script = document.createElement('script');
  script.src = 'https://public-cdn.com/secure-script.js';
  document.head.appendChild(script);
}

// 示例 6: CDN 缓存中毒
export function insecureCdnExample6() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/poisoned.js';
  document.head.appendChild(script);
}

// 示例 7: CDN 依赖注入
export function insecureCdnExample7() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/dependency.js';
  document.head.appendChild(script);
}

// 示例 8: CDN 版本回退攻击
export function insecureCdnExample8() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/library@0.1.0.js';
  document.head.appendChild(script);
}

// 示例 9: CDN 中间人攻击
export function insecureCdnExample9() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/library.js';
  document.head.appendChild(script);
}

// 示例 10: CDN 资源劫持
export function insecureCdnExample10() {
  const script = document.createElement('script');
  script.src = 'https://cdn.example.com/hijacked.js';
  document.head.appendChild(script);
}
