// Reflected XSS 漏洞示例文件

// 示例 1: 直接将用户输入反射到页面
export function reflectedXssExample1(userInput) {
  // 危险：用户输入直接输出到页面
  return `<div>Welcome, ${userInput}!</div>`;
}

// 示例 2: URL 参数反射到页面
export function reflectedXssExample2() {
  // 危险：从 URL 获取参数并直接输出
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  document.body.innerHTML = `<h1>Hello ${name}</h1>`;
}

// 示例 3: 搜索结果中的反射 XSS
export function reflectedXssExample3(searchTerm) {
  // 危险：搜索词直接显示在结果页面
  return `<p>You searched for: ${searchTerm}</p>`;
}

// 示例 4: 错误消息中的反射 XSS
export function reflectedXssExample4(errorMsg) {
  // 危险：错误消息直接输出到页面
  return `<div class="error">Error: ${errorMsg}</div>`;
}

// 示例 5: 表单提交后的反射 XSS
export function reflectedXssExample5(formData) {
  // 危险：表单数据直接反射回页面
  return `<p>Submitted data: ${formData}</p>`;
}

// 示例 6: 使用 innerHTML 的反射 XSS
export function reflectedXssExample6(content) {
  // 危险：内容直接设置为 innerHTML
  const element = document.getElementById('content');
  element.innerHTML = content;
}

// 示例 7: URL 片段标识符反射
export function reflectedXssExample7() {
  // 危险：URL 片段直接用于页面内容
  const fragment = window.location.hash.substring(1);
  document.title = fragment;
}

// 示例 8: POST 请求数据反射
export function reflectedXssExample8(postData) {
  // 危险：POST 数据直接显示在页面
  return `<pre>Received data: ${postData}</pre>`;
}

// 示例 9: 反射用户代理字符串
export function reflectedXssExample9(userAgent) {
  // 危险：用户代理字符串直接输出
  return `<p>Your browser: ${userAgent}</p>`;
}

// 示例 10: 反射查询参数到 JavaScript
export function reflectedXssExample10(category) {
  // 危险：查询参数直接用于 JavaScript 字符串
  return `<script>var category = "${category}";</script>`;
}

// 示例 11: 反射到属性值
export function reflectedXssExample11(bgColor) {
  // 危险：背景色直接用于样式属性
  return `<div style="background-color: ${bgColor};">Content</div>`;
}

// 示例 12: 反射到事件处理器
export function reflectedXssExample12(handler) {
  // 危险：事件处理器直接来自用户输入
  return `<button onclick="${handler}">Click me</button>`;
}

// 示例 13: 反射到表单 action
export function reflectedXssExample13(actionUrl) {
  // 危险：表单 action 来自用户输入
  return `<form action="${actionUrl}"><input type="submit" value="Submit" /></form>`;
}

// 示例 14: 反射到链接 href
export function reflectedXssExample14(linkUrl) {
  // 危险：链接 URL 来自用户输入
  return `<a href="${linkUrl}">Click here</a>`;
}

// 示例 15: 反射到框架 src
export function reflectedXssExample15(frameSrc) {
  // 危险：框架源来自用户输入
  return `<iframe src="${frameSrc}"></iframe>`;
}

// 示例 16: 反射到 meta 标签
export function reflectedXssExample16(refreshUrl) {
  // 危险：meta 刷新 URL 来自用户输入
  return `<meta http-equiv="refresh" content="0; url=${refreshUrl}" />`;
}

// 示例 17: 反射到样式表链接
export function reflectedXssExample17(cssUrl) {
  // 危险：CSS URL 来自用户输入
  return `<link rel="stylesheet" href="${cssUrl}" />`;
}

// 示例 18: 反射到脚本源
export function reflectedXssExample18(jsUrl) {
  // 危险：JavaScript URL 来自用户输入
  return `<script src="${jsUrl}"></script>`;
}

// 示例 19: 反射到图片源
export function reflectedXssExample19(imgUrl) {
  // 危险：图片 URL 来自用户输入
  return `<img src="${imgUrl}" alt="User image" />`;
}

// 示例 20: 复杂的反射 XSS 场景
export function reflectedXssExample20(userData) {
  // 危险：多个用户数据点反射到页面
  const { name, email, message, template } = userData;
  return `
    <div class="user-profile">
      <h2>${name}</h2>
      <p>Email: ${email}</p>
      <div class="message">${message}</div>
      <div class="template">${template}</div>
    </div>
  `;
}

// 示例 21: 反射到 JSONP 回调
export function reflectedXssExample21(callback) {
  // 危险：JSONP 回调函数名来自用户输入
  return `<script>function ${callback}(data) { /* handle data */ }</script>`;
}

// 示例 22: 反射到 CSS 内容
export function reflectedXssExample22(cssProperty, cssValue) {
  // 危险：CSS 属性和值来自用户输入
  return `<style>body { ${cssProperty}: ${cssValue}; }</style>`;
}

// 示例 23: 反射到数据 URI
export function reflectedXssExample23(dataContent) {
  // 危险：数据 URI 内容来自用户输入
  return `<iframe src="data:text/html,${dataContent}"></iframe>`;
}

// 示例 24: 反射到锚点链接
export function reflectedXssExample24(anchor) {
  // 危险：锚点名称来自用户输入
  return `<a href="#${anchor}">Go to section</a>`;
}

// 示例 25: 反射到表单方法
export function reflectedXssExample25(method) {
  // 危险：表单方法来自用户输入
  return `<form method="${method}" action="/submit">...</form>`;
}

// 示例 26: 反射到输入框值
export function reflectedXssExample26(defaultValue) {
  // 危险：输入框默认值来自用户输入
  return `<input type="text" value="${defaultValue}" />`;
}

// 示例 27: 反射到选项值
export function reflectedXssExample27(optionValue) {
  // 危险：选项值来自用户输入
  return `<select><option value="${optionValue}">Selected option</option></select>`;
}

// 示例 28: 反射到数据属性
export function reflectedXssExample28(dataValue) {
  // 危险：数据属性值来自用户输入
  return `<div data-value="${dataValue}">Content</div>`;
}

// 示例 29: 反射到自定义属性
export function reflectedXssExample29(customAttr, attrValue) {
  // 危险：自定义属性和值来自用户输入
  return `<div ${customAttr}="${attrValue}">Content</div>`;
}

// 示例 30: 反射到模板字面量
export function reflectedXssExample30(placeholders) {
  // 危险：模板占位符来自用户输入
  return `Welcome ${placeholders.name}, your email is ${placeholders.email}`;
}
