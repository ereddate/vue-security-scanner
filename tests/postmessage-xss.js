// PostMessage XSS 漏洞示例文件

// 示例 1: 不安全的 postMessage 监听
export function postmessageXssExample1() {
  window.addEventListener('message', (event) => {
    // 危险：没有验证消息来源
    eval(event.data);
  });
}

// 示例 2: 缺少来源验证
export function postmessageXssExample2() {
  window.addEventListener('message', (event) => {
    // 危险：没有检查 event.origin
    document.body.innerHTML = event.data;
  });
}

// 示例 3: postMessage 注入
export function postmessageXssExample3() {
  window.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    // 危险：直接使用消息内容
    document.getElementById('output').innerHTML = message.content;
  });
}

// 示例 4: postMessage 执行脚本
export function postmessageXssExample4() {
  window.addEventListener('message', (event) => {
    // 危险：执行 postMessage 中的脚本
    const script = document.createElement('script');
    script.textContent = event.data;
    document.body.appendChild(script);
  });
}

// 示例 5: postMessage 重定向
export function postmessageXssExample5() {
  window.addEventListener('message', (event) => {
    // 危险：使用 postMessage 进行重定向
    window.location.href = event.data.url;
  });
}

// 示例 6: postMessage Cookie 窃取
export function postmessageXssExample6() {
  window.addEventListener('message', (event) => {
    // 危险：发送 Cookie 到任意来源
    event.source.postMessage({
      cookies: document.cookie
    }, event.origin);
  });
}

// 示例 7: postMessage 本地存储窃取
export function postmessageXssExample7() {
  window.addEventListener('message', (event) => {
    // 危险：发送本地存储到任意来源
    event.source.postMessage({
      localStorage: localStorage,
      sessionStorage: sessionStorage
    }, event.origin);
  });
}

// 示例 8: postMessage DOM 操作
export function postmessageXssExample8() {
  window.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    // 危险：执行任意 DOM 操作
    const element = document.querySelector(message.selector);
    if (element) {
      element[message.action] = message.value;
    }
  });
}

// 示例 9: postMessage 表单提交
export function postmessageXssExample9() {
  window.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    // 危险：自动提交表单
    const form = document.createElement('form');
    form.action = message.action;
    form.method = 'POST';
    
    for (const [key, value] of Object.entries(message.data)) {
      const input = document.createElement('input');
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    
    document.body.appendChild(form);
    form.submit();
  });
}

// 示例 10: postMessage 动态脚本加载
export function postmessageXssExample10() {
  window.addEventListener('message', (event) => {
    // 危险：动态加载脚本
    const script = document.createElement('script');
    script.src = event.data;
    document.body.appendChild(script);
  });
}
