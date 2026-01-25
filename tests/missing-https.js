// Missing HTTPS 漏洞示例文件

// 示例 1: 使用 HTTP 而不是 HTTPS
export function missingHttpsExample1() {
  const app = express();
  
  app.get('/login', (req, res) => {
    // 危险：使用 HTTP 传输敏感数据
    res.send(`
      <form action="http://example.com/authenticate" method="POST">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Login</button>
      </form>
    `);
  });
  
  return app;
}

// 示例 2: 混合内容
export function missingHttpsExample2() {
  const app = express();
  
  app.get('/', (req, res) => {
    // 危险：HTTPS 页面包含 HTTP 资源
    res.send(`
      <html>
      <head>
        <script src="http://example.com/script.js"></script>
        <link rel="stylesheet" href="http://example.com/style.css">
      </head>
      <body>
        <img src="http://example.com/image.jpg">
      </body>
      </html>
    `);
  });
  
  return app;
}

// 示例 3: 缺少 HSTS 头
export function missingHttpsExample3() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：没有设置 HSTS 头
    next();
  });
  
  return app;
}

// 示例 4: HTTP 重定向不安全
export function missingHttpsExample4() {
  const app = express();
  
  app.use((req, res, next) => {
    if (!req.secure) {
      // 危险：HTTP 重定向到 HTTPS 可能被中间人攻击
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
  
  return app;
}

// 示例 5: Cookie 缺少 Secure 标志
export function missingHttpsExample5() {
  const app = express();
  
  app.get('/login', (req, res) => {
    res.cookie('session', 'session123', {
      // 危险：没有设置 secure 标志
      httpOnly: true
    });
    res.send('Logged in');
  });
  
  return app;
}

// 示例 6: API 端点使用 HTTP
export function missingHttpsExample6() {
  const app = express();
  
  app.post('/api/payment', (req, res) => {
    // 危险：支付 API 使用 HTTP
    const { cardNumber, cvv, expiry } = req.body;
    processPayment(cardNumber, cvv, expiry);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 7: WebSocket 使用 ws://
export function missingHttpsExample7() {
  const ws = new WebSocket('ws://example.com/socket');
  
  ws.onopen = () => {
    // 危险：WebSocket 使用不安全协议
    ws.send(JSON.stringify({ action: 'login', credentials: 'secret' }));
  };
}

// 示例 8: 缺少 SSL/TLS 配置
export function missingHttpsExample8() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    // 危险：没有配置 SSL/TLS
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 9: 使用弱加密算法
export function missingHttpsExample9() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    // 危险：使用弱加密算法
    ciphers: 'RC4:MD5'
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 10: 缺少证书验证
export function missingHttpsExample10() {
  const https = require('https');
  
  const options = {
    // 危险：没有验证证书
    rejectUnauthorized: false
  };
  
  https.get('https://example.com/api/data', options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(data);
    });
  });
}
