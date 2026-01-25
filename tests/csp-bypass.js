// CSP Bypass 漏洞示例文件

// 示例 1: 使用 unsafe-inline
export function cspBypassExample1() {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'";
  document.head.appendChild(meta);
}

// 示例 2: 使用 unsafe-eval
export function cspBypassExample2() {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self'; script-src 'self' 'unsafe-eval'";
  document.head.appendChild(meta);
}

// 示例 3: 使用通配符
export function cspBypassExample3() {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "script-src *";
  document.head.appendChild(meta);
}

// 示例 4: 缺少 CSP 头
export function cspBypassExample4() {
  const express = require('express');
  const app = express();
  
  app.get('/', (req, res) => {
    // 危险：没有设置 CSP 头
    res.send('<script>alert("XSS")</script>');
  });
  
  return app;
}

// 示例 5: CSP 配置过于宽松
export function cspBypassExample5() {
  const express = require('express');
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：CSP 配置过于宽松
    res.setHeader('Content-Security-Policy', "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'");
    next();
  });
  
  return app;
}

// 示例 6: 通过 data: URL 绕过
export function cspBypassExample6() {
  const script = document.createElement('script');
  script.src = 'data:text/javascript,alert("XSS")';
  document.body.appendChild(script);
}

// 示例 7: 通过 blob: URL 绕过
export function cspBypassExample7() {
  const blob = new Blob(['alert("XSS")'], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

// 示例 8: 通过 iframe 绕过
export function cspBypassExample8() {
  const iframe = document.createElement('iframe');
  iframe.src = 'javascript:alert("XSS")';
  document.body.appendChild(iframe);
}

// 示例 9: 通过 link 标签绕过
export function cspBypassExample9() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'data:text/css,body{background:url(data:image/svg+xml,<svg onload=alert("XSS")>)}';
  document.head.appendChild(link);
}

// 示例 10: 通过 object 标签绕过
export function cspBypassExample10() {
  const object = document.createElement('object');
  object.data = 'data:text/html,<script>alert("XSS")</script>';
  document.body.appendChild(object);
}
