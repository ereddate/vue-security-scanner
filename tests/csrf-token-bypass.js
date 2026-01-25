// CSRF Token Bypass 漏洞示例文件

import express from 'express';

// 示例 1: 缺少 CSRF 令牌验证
export function csrfTokenBypassExample1() {
  const app = express();
  
  // 危险：关键操作没有 CSRF 令牌验证
  app.post('/delete-account', (req, res) => {
    // 危险：直接执行删除操作，没有验证 CSRF 令牌
    const userId = req.session.userId;
    deleteAccount(userId);
    res.json({ status: 'success', message: 'Account deleted' });
  });
  
  return app;
}

// 示例 2: 不正确的令牌验证
export function csrfTokenBypassExample2() {
  const app = express();
  
  app.post('/change-email', (req, res) => {
    // 危险：令牌验证存在缺陷
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    // 危险：使用了宽松的比较，可能被绕过
    if (providedToken == expectedToken) {  // 使用了 == 而不是 ===
      updateUserEmail(req.session.userId, req.body.newEmail);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error', message: 'Invalid CSRF token' });
    }
  });
  
  return app;
}

// 示例 3: 令牌可以被预测
export function csrfTokenBypassExample3() {
  const app = express();
  
  // 危险：使用可预测的令牌生成方式
  function generatePredictableToken() {
    // 危险：基于时间戳或其他可预测因素生成令牌
    return `token_${Date.now()}`;
  }
  
  app.get('/get-form', (req, res) => {
    const token = generatePredictableToken();
    req.session.csrfToken = token;
    
    res.send(`
      <form method="POST" action="/transfer-money">
        <input type="hidden" name="csrfToken" value="${token}">
        <input type="text" name="amount" placeholder="Amount">
        <input type="text" name="recipient" placeholder="Recipient">
        <button type="submit">Transfer</button>
      </form>
    `);
  });
  
  app.post('/transfer-money', (req, res) => {
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    // 危险：由于令牌可预测，容易被绕过
    if (providedToken === expectedToken) {
      transferMoney(req.body.amount, req.body.recipient);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 4: 令牌在 URL 中传输
export function csrfTokenBypassExample4() {
  const app = express();
  
  app.get('/sensitive-operation', (req, res) => {
    // 危险：在 GET 请求中执行敏感操作，并使用 URL 传递令牌
    const token = req.query.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    if (token === expectedToken) {
      performSensitiveOperation();
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 5: 令牌没有绑定到用户会话
export function csrfTokenBypassExample5() {
  const app = express();
  
  // 危险：全局令牌，不与特定用户会话绑定
  let globalToken = 'global_csrf_token_123';
  
  app.get('/get-token', (req, res) => {
    // 危险：所有用户都收到相同的令牌
    res.json({ csrfToken: globalToken });
  });
  
  app.post('/update-profile', (req, res) => {
    // 危险：使用全局令牌验证，任何获取令牌的人都可以执行操作
    if (req.body.csrfToken === globalToken) {
      updateProfile(req.session.userId, req.body.profileData);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 6: 令牌验证被条件性跳过
export function csrfTokenBypassExample6() {
  const app = express();
  
  app.post('/update-settings', (req, res) => {
    // 危险：在某些条件下跳过 CSRF 验证
    if (req.body.skipValidation === 'true') {
      // 危险：可以通过参数跳过验证
      updateSettings(req.session.userId, req.body.settings);
      res.json({ status: 'success' });
    } else {
      // 正常验证
      const providedToken = req.body.csrfToken;
      const expectedToken = req.session.csrfToken;
      
      if (providedToken === expectedToken) {
        updateSettings(req.session.userId, req.body.settings);
        res.json({ status: 'success' });
      } else {
        res.status(403).json({ status: 'error' });
      }
    }
  });
  
  return app;
}

// 示例 7: 令牌重复使用
export function csrfTokenBypassExample7() {
  const app = express();
  
  app.post('/make-purchase', (req, res) => {
    // 危险：令牌使用后不作废，可以重复使用
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    if (providedToken === expectedToken) {
      makePurchase(req.session.userId, req.body.product);
      // 危险：没有生成新令牌，旧令牌仍可使用
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 8: 自定义 HTTP 头绕过
export function csrfTokenBypassExample8() {
  const app = express();
  
  app.post('/critical-action', (req, res) => {
    // 危险：当存在某些自定义头时跳过 CSRF 验证
    if (req.get('X-Requested-With') === 'XMLHttpRequest' || 
        req.get('X-CSRF-Token') ||
        req.get('X-API-Key')) {
      // 危险：认为带有这些头的请求是安全的
      performCriticalAction(req.session.userId);
      res.json({ status: 'success' });
    } else {
      // 正常验证
      const providedToken = req.body.csrfToken;
      const expectedToken = req.session.csrfToken;
      
      if (providedToken === expectedToken) {
        performCriticalAction(req.session.userId);
        res.json({ status: 'success' });
      } else {
        res.status(403).json({ status: 'error' });
      }
    }
  });
  
  return app;
}

// 示例 9: 令牌长度不够安全
export function csrfTokenBypassExample9() {
  const app = express();
  
  // 危险：生成过于简短的 CSRF 令牌
  function generateWeakToken() {
    // 危险：只有 4 位数字，容易暴力破解
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }
  
  app.get('/form-with-weak-token', (req, res) => {
    const token = generateWeakToken();
    req.session.csrfToken = token;
    
    res.send(`
      <form method="POST" action="/execute-action">
        <input type="hidden" name="csrfToken" value="${token}">
        <button type="submit">Execute</button>
      </form>
    `);
  });
  
  app.post('/execute-action', (req, res) => {
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    if (providedToken === expectedToken) {
      executeAction(req.session.userId);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 10: 空令牌绕过
export function csrfTokenBypassExample10() {
  const app = express();
  
  app.post('/modify-data', (req, res) => {
    const providedToken = req.body.csrfToken;
    
    // 危险：没有检查令牌是否存在
    if (!providedToken) {
      // 危险：空令牌也被视为有效
      modifyUserData(req.session.userId, req.body.data);
      res.json({ status: 'success' });
    } else {
      const expectedToken = req.session.csrfToken;
      if (providedToken === expectedToken) {
        modifyUserData(req.session.userId, req.body.data);
        res.json({ status: 'success' });
      } else {
        res.status(403).json({ status: 'error' });
      }
    }
  });
  
  return app;
}

// 示例 11: 令牌绑定到 IP 地址但验证不严格
export function csrfTokenBypassExample11() {
  const app = express();
  
  app.post('/change-password', (req, res) => {
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    const expectedIP = req.session.csrfTokenIP;
    
    // 危险：IP 地址验证不严格
    if (providedToken === expectedToken && 
        (req.ip === expectedIP || req.ip.includes(expectedIP.split(':')[0]))) {
      changePassword(req.session.userId, req.body.newPassword);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 12: 令牌验证被错误地注释掉
export function csrfTokenBypassExample12() {
  const app = express();
  
  app.post('/perform-banking-operation', (req, res) => {
    // 危险：CSRF 验证被注释掉了
    /*
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    if (providedToken !== expectedToken) {
      return res.status(403).json({ status: 'error' });
    }
    */
    
    // 危险：所有请求都被认为是合法的
    performBankingOperation(req.session.userId, req.body.operation);
    res.json({ status: 'success' });
  });
  
  return app;
}

// 示例 13: 令牌可以被反射回来
export function csrfTokenBypassExample13() {
  const app = express();
  
  app.get('/echo-back-token', (req, res) => {
    // 危险：将 CSRF 令牌作为 URL 参数返回
    const token = req.session.csrfToken || 'default_token';
    const returnUrl = req.query.returnUrl || '/dashboard';
    const returnUrlWithToken = `${returnUrl}?csrfToken=${token}`;
    
    res.send(`
      <p>Redirecting to: <a href="${returnUrlWithToken}">${returnUrlWithToken}</a></p>
      <p>Token is exposed in URL: ${token}</p>
    `);
  });
  
  return app;
}

// 示例 14: 令牌在 GET 请求中生成但在 POST 中验证
export function csrfTokenBypassExample14() {
  const app = express();
  
  app.get('/generate-token-only', (req, res) => {
    // 危险：只生成令牌，但不验证任何操作
    req.session.csrfToken = `token_${Math.random()}`;
    res.json({ message: 'Token generated', token: req.session.csrfToken });
  });
  
  app.post('/operation-no-token-check', (req, res) => {
    // 危险：不验证 CSRF 令牌，直接执行操作
    executeOperationWithoutToken(req.session.userId, req.body.data);
    res.json({ status: 'success' });
  });
  
  return app;
}

// 示例 15: 令牌验证逻辑复杂但有漏洞
export function csrfTokenBypassExample15() {
  const app = express();
  
  app.post('/complex-validation', (req, res) => {
    const token1 = req.body.csrfToken1;
    const token2 = req.body.csrfToken2;
    const token3 = req.body.csrfToken3;
    
    // 危险：复杂的验证逻辑中有漏洞
    if ((token1 && token1 === req.session.csrfToken1) ||
        (token2 && token2 === req.session.csrfToken2) ||
        (token3 && token3 === req.session.csrfToken3)) {
      // 危险：只要有一个令牌正确就通过验证
      performComplexOperation(req.session.userId);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 16: 基于 Referer 头的不安全验证
export function csrfTokenBypassExample16() {
  const app = express();
  
  app.post('/referer-based-check', (req, res) => {
    const referer = req.get('Referer');
    const origin = req.get('Origin');
    
    // 危险：依赖可能被伪造的 Referer 头
    if (referer && referer.startsWith('https://ourwebsite.com')) {
      // 危险：认为来自可信域名的请求都是合法的
      performOperation(req.session.userId);
      res.json({ status: 'success' });
    } else if (origin && origin === 'https://ourwebsite.com') {
      performOperation(req.session.userId);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 17: 令牌存储在可被 JS 访问的地方
export function csrfTokenBypassExample17() {
  const app = express();
  
  app.get('/form-with-js-accessible-token', (req, res) => {
    const token = req.session.csrfToken || (req.session.csrfToken = `token_${Date.now()}`);
    
    res.send(`
      <html>
      <body>
        <form method="POST" action="/js-accessible-operation">
          <input type="hidden" name="csrfToken" id="csrfToken" value="${token}">
          <button type="submit">Submit</button>
        </form>
        <script>
          // 危险：CSRF 令牌可通过 JavaScript 访问
          const token = document.getElementById('csrfToken').value;
          console.log('CSRF Token:', token);
          
          // 攻击者可以获取令牌并通过 AJAX 发送
          // fetch('/js-accessible-operation', {
          //   method: 'POST',
          //   body: JSON.stringify({csrfToken: token, ...}),
          //   headers: {'Content-Type': 'application/json'}
          // });
        </script>
      </body>
      </html>
    `);
  });
  
  app.post('/js-accessible-operation', (req, res) => {
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    if (providedToken === expectedToken) {
      performOperation(req.session.userId);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 18: 令牌验证在特定条件下失效
export function csrfTokenBypassExample18() {
  const app = express();
  
  app.post('/conditional-validation', (req, res) => {
    // 危险：在特定条件下验证失效
    const isDevelopment = process.env.NODE_ENV === 'development';
    const hasSpecialHeader = req.get('X-Special-CSRF-Bypass') === 'true';
    
    if (isDevelopment || hasSpecialHeader) {
      // 危险：在开发环境或有特殊头时跳过验证
      performOperation(req.session.userId, req.body.data);
      res.json({ status: 'success' });
    } else {
      const providedToken = req.body.csrfToken;
      const expectedToken = req.session.csrfToken;
      
      if (providedToken === expectedToken) {
        performOperation(req.session.userId, req.body.data);
        res.json({ status: 'success' });
      } else {
        res.status(403).json({ status: 'error' });
      }
    }
  });
  
  return app;
}

// 示例 19: 令牌可以被暴力破解的场景
export function csrfTokenBypassExample19() {
  const app = express();
  
  // 危险：使用容易猜测的令牌模式
  app.get('/sequential-tokens', (req, res) => {
    // 危险：使用序列号作为令牌的一部分
    const sequence = req.session.requestCount || 0;
    req.session.requestCount = sequence + 1;
    const token = `seq_${sequence}_fixed_suffix`;
    req.session.csrfToken = token;
    
    res.json({ csrfToken: token });
  });
  
  app.post('/sequential-operation', (req, res) => {
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.csrfToken;
    
    if (providedToken === expectedToken) {
      performOperation(req.session.userId);
      res.json({ status: 'success' });
    } else {
      res.status(403).json({ status: 'error' });
    }
  });
  
  return app;
}

// 示例 20: 复合 CSRF 绕过技术
export function csrfTokenBypassExample20() {
  const app = express();
  
  // 组合多种绕过技术
  app.use((req, res, next) => {
    // 技术1: 可预测的令牌生成
    if (!req.session.complexToken) {
      const timeBased = Math.floor(Date.now() / 1000);
      const userBased = req.session.userId || 0;
      req.session.complexToken = `ct_${timeBased}_${userBased}_suffix`;
    }
    next();
  });
  
  app.post('/multi-bypass-operation', (req, res) => {
    const providedToken = req.body.csrfToken;
    const expectedToken = req.session.complexToken;
    
    // 技术2: 多种绕过条件
    const bypassCondition1 = req.body.method === 'direct';
    const bypassCondition2 = req.get('X-Requested-With') === 'CustomApp';
    const bypassCondition3 = req.body.token === 'allow_any';
    
    // 技术3: 宽松的令牌验证
    if (bypassCondition1 || bypassCondition2 || bypassCondition3 || 
        providedToken == expectedToken) {  // 使用 == 而不是 ===
      
      // 技术4: 令牌不作废，可重复使用
      performMultiBypassOperation(req.session.userId, req.body.action);
      
      // 技术5: 操作完成后不更新令牌
      res.json({ 
        status: 'success', 
        tokenStillValid: expectedToken,
        bypassUsed: bypassCondition1 || bypassCondition2 || bypassCondition3 
      });
    } else {
      res.status(403).json({ 
        status: 'error', 
        message: 'Token validation failed',
        provided: providedToken,
        expected: expectedToken
      });
    }
  });
  
  app.get('/get-current-token', (req, res) => {
    // 技术6: 令牌可通过另一个端点获取
    res.json({ 
      currentToken: req.session.complexToken,
      isPredictable: true,
      pattern: 'ct_[timestamp]_[userId]_suffix'
    });
  });
  
  return app;
}

// 模拟辅助函数
function deleteAccount(userId) { /* 实现删除账户 */ }
function updateUserEmail(userId, newEmail) { /* 实现更新邮箱 */ }
function transferMoney(amount, recipient) { /* 实现转账 */ }
function performSensitiveOperation() { /* 实现敏感操作 */ }
function updateProfile(userId, profileData) { /* 实现更新档案 */ }
function updateSettings(userId, settings) { /* 实现更新设置 */ }
function makePurchase(userId, product) { /* 实现购买 */ }
function performCriticalAction(userId) { /* 实现关键操作 */ }
function executeAction(userId) { /* 实现执行动作 */ }
function modifyUserData(userId, data) { /* 实现修改用户数据 */ }
function changePassword(userId, newPassword) { /* 实现修改密码 */ }
function performBankingOperation(userId, operation) { /* 实现银行操作 */ }
function executeOperationWithoutToken(userId, data) { /* 实现无需令牌的操作 */ }
function performComplexOperation(userId) { /* 实现复杂操作 */ }
function performOperation(userId, data) { /* 实现操作 */ }
function performMultiBypassOperation(userId, action) { /* 实现多绕过操作 */ }
