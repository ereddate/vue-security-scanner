// DOM-based XSS 漏洞示例文件

// 示例 1: 直接使用 URL 参数更新 DOM
export function domBasedXssExample1() {
  // 危险：直接使用 URL 参数更新页面内容
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  document.getElementById('welcome').innerHTML = 'Welcome, ' + name + '!';
}

// 示例 2: 使用 document.write 造成 DOM XSS
export function domBasedXssExample2() {
  // 危险：使用 document.write 输出 URL 参数
  const param = new URLSearchParams(window.location.search).get('msg');
  document.write('<h1>' + param + '</h1>');
}

// 示例 3: 通过 location.hash 更新页面内容
export function domBasedXssExample3() {
  // 危险：直接使用 hash 值更新页面
  const hash = window.location.hash.substring(1);
  document.getElementById('content').innerText = hash;
}

// 示例 4: 使用 eval 处理用户输入
export function domBasedXssExample4() {
  // 危险：使用 eval 执行用户输入
  const userInput = localStorage.getItem('userScript');
  eval(userInput);  // 非常危险！
}

// 示例 5: 动态创建并执行脚本
export function domBasedXssExample5() {
  // 危险：动态创建并执行脚本
  const scriptContent = sessionStorage.getItem('dynamicScript');
  const script = document.createElement('script');
  script.textContent = scriptContent;
  document.body.appendChild(script);
}

// 示例 6: 使用 innerHTML 插入用户控制的内容
export function domBasedXssExample6() {
  // 危险：使用 innerHTML 插入用户控制的内容
  const userContent = document.URL.split('?')[1];
  if (userContent) {
    document.getElementById('output').innerHTML = userContent;
  }
}

// 示例 7: 通过 DOM 方法设置属性
export function domBasedXssExample7() {
  // 危险：设置可能包含 JavaScript 的属性
  const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
  const link = document.getElementById('redirect-link');
  link.href = redirectUrl;  // 可能包含 javascript: 协议
}

// 示例 8: 使用 setTimeout 执行用户输入
export function domBasedXssExample8() {
  // 危险：使用 setTimeout 执行用户输入的字符串
  const timerCode = localStorage.getItem('timerFunction');
  setTimeout(timerCode, 1000);  // 危险！
}

// 示例 9: 通过正则表达式替换造成 XSS
export function domBasedXssExample9() {
  // 危险：使用 replace 函数可能引入 XSS
  const userString = new URLSearchParams(window.location.search).get('search');
  const content = document.getElementById('original').innerHTML;
  const modified = content.replace(/SEARCH/g, userString);
  document.getElementById('result').innerHTML = modified;
}

// 示例 10: 使用 Function 构造器执行用户代码
export function domBasedXssExample10() {
  // 危险：使用 Function 构造器执行用户输入
  const userFunc = localStorage.getItem('userFunction');
  const dynamicFunc = new Function(userFunc);
  dynamicFunc();
}

// 示例 11: 通过 DOM 操作修改事件处理器
export function domBasedXssExample11() {
  // 危险：设置可能包含恶意代码的事件处理器
  const eventHandler = sessionStorage.getItem('customHandler');
  const button = document.getElementById('myButton');
  button.onclick = new Function(eventHandler);
}

// 示例 12: 使用 outerHTML 进行 DOM 修改
export function domBasedXssExample12() {
  // 危险：使用 outerHTML 插入用户控制的内容
  const userHtml = new URLSearchParams(window.location.search).get('content');
  const element = document.getElementById('replace-me');
  element.outerHTML = userHtml;
}

// 示例 13: 通过 insertAdjacentHTML 插入内容
export function domBasedXssExample13() {
  // 危险：使用 insertAdjacentHTML 插入用户控制的内容
  const userContent = localStorage.getItem('insertContent');
  document.body.insertAdjacentHTML('beforeend', userContent);
}

// 示例 14: 使用模板字符串造成的 XSS
export function domBasedXssExample14() {
  // 危险：使用模板字符串直接插入用户输入
  const userInput = new URLSearchParams(window.location.search).get('data');
  document.getElementById('container').innerHTML = `<div>${userInput}</div>`;
}

// 示例 15: 通过 JSON 解析和渲染造成 XSS
export function domBasedXssExample15() {
  // 危险：解析并渲染用户提供的 JSON 数据
  const jsonString = localStorage.getItem('userData');
  const data = JSON.parse(jsonString);
  document.getElementById('profile').innerHTML = data.displayInfo;
}

// 示例 16: 使用 postMessage 接收并处理不受信数据
export function domBasedXssExample16() {
  // 危险：处理来自任意来源的消息
  window.addEventListener('message', function(event) {
    // 没有验证 event.origin
    document.getElementById('message-display').innerHTML = event.data;
  });
}

// 示例 17: 通过 cookie 读取并显示内容
export function domBasedXssExample17() {
  // 危险：从 cookie 读取并显示可能被污染的内容
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('userPref='))
    ?.split('=')[1];
    
  if (cookieValue) {
    document.getElementById('preferences').innerHTML = cookieValue;
  }
}

// 示例 18: 使用 parent 或 opener 对象造成 XSS
export function domBasedXssExample18() {
  // 危险：通过父窗口或打开者窗口传递数据
  if (window.opener) {
    const message = window.opener.message || '';
    document.getElementById('opener-content').innerHTML = message;
  }
}

// 示例 19: 通过 DOM 查询参数更新多个元素
export function domBasedXssExample19() {
  // 危险：批量更新多个元素使用 URL 参数
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    const element = document.getElementById(key);
    if (element) {
      element.innerHTML = value;  // 危险！
    }
  }
}

// 示例 20: 复杂的 DOM XSS 场景 - 多步骤操作
export function domBasedXssExample20() {
  // 危险：多步骤的 DOM 操作，每步都可能引入 XSS
  const urlParams = new URLSearchParams(window.location.search);
  
  // 步骤 1: 获取用户输入
  const userInput = urlParams.get('payload');
  
  // 步骤 2: 在内存中构建 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = userInput;  // 第一个风险点
  
  // 步骤 3: 提取特定内容
  const extractedContent = tempDiv.querySelector('[data-extract]')?.innerHTML;
  
  // 步骤 4: 更新页面内容
  if (extractedContent) {
    document.getElementById('dynamic-content').appendChild(
      document.createRange().createContextualFragment(extractedContent)
    );  // 第二个风险点
  }
}

// 辅助函数：模拟安全的 DOM 操作
function safeInnerHTML(element, content) {
  // 清理内容以防止 XSS
  const div = document.createElement('div');
  div.textContent = content;
  element.innerHTML = div.innerHTML;
}
