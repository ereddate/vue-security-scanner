// WebSocket Security 漏洞示例文件

// 示例 1: 不安全的 WebSocket 连接
export function websocketSecurityExample1() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onmessage = (event) => {
    // 危险：直接执行接收到的消息
    eval(event.data);
  };
}

// 示例 2: 缺少身份验证
export function websocketSecurityExample2() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onopen = () => {
    // 危险：没有身份验证
    ws.send(JSON.stringify({ action: 'get_sensitive_data' }));
  };
}

// 示例 3: WebSocket 消息注入
export function websocketSecurityExample3() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // 危险：直接使用消息内容
    document.getElementById('output').innerHTML = message.content;
  };
}

// 示例 4: WebSocket 数据泄露
export function websocketSecurityExample4() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onopen = () => {
    // 危险：发送敏感数据
    ws.send(JSON.stringify({
      cookies: document.cookie,
      localStorage: localStorage,
      token: localStorage.getItem('token')
    }));
  };
}

// 示例 5: WebSocket CSRF 攻击
export function websocketSecurityExample5() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onopen = () => {
    // 危险：发起 CSRF 攻击
    ws.send(JSON.stringify({
      action: 'transfer',
      amount: 1000,
      to: 'attacker'
    }));
  };
}

// 示例 6: WebSocket DoS 攻击
export function websocketSecurityExample6() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onopen = () => {
    // 危险：发送大量消息导致 DoS
    setInterval(() => {
      ws.send('ping'.repeat(10000));
    }, 10);
  };
}

// 示例 7: WebSocket 中间人攻击
export function websocketSecurityExample7() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onmessage = (event) => {
    // 危险：没有验证消息完整性
    const message = JSON.parse(event.data);
    processMessage(message);
  };
}

// 示例 8: WebSocket 持久化连接泄露
export function websocketSecurityExample8() {
  function createWebSocket() {
    const ws = new WebSocket('ws://example.com/socket');
    return ws;
  }
  
  // 危险：创建大量连接
  for (let i = 0; i < 1000; i++) {
    createWebSocket();
  }
}

// 示例 9: WebSocket 消息重放攻击
export function websocketSecurityExample9() {
  const ws = new WebSocket('ws://example.com/socket');
  const messages = [];
  
  ws.onmessage = (event) => {
    messages.push(event.data);
    
    // 危险：重放消息
    ws.send(event.data);
  };
}

// 示例 10: WebSocket 不安全协议
export function websocketSecurityExample10() {
  // 危险：使用 ws:// 而不是 wss://
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ action: 'login', credentials: 'secret' }));
  };
}
