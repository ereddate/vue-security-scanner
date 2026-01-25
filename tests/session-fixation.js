// Session Fixation 漏洞示例文件

import express from 'express';

// 示例 1: 直接在登录前设置会话 ID
export function sessionFixationExample1() {
  const app = express();
  
  // 危险：在身份验证之前允许设置会话ID
  app.get('/login', (req, res) => {
    const requestedSessionId = req.query.sessionId || req.cookies.sessionId;
    if (requestedSessionId) {
      // 危险：直接使用用户提供的会话ID
      req.sessionID = requestedSessionId;
      req.session.regenerate(err => {
        if (err) {
          console.error('Session regeneration error:', err);
        }
      });
    }
    
    res.render('login');
  });
  
  app.post('/authenticate', (req, res) => {
    // 登录逻辑
    const { username, password } = req.body;
    if (isValidCredentials(username, password)) {
      // 危险：未重新生成会话ID，继续使用用户指定的ID
      req.session.authenticated = true;
      req.session.user = username;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login?error=invalid');
    }
  });
  
  return app;
}

// 示例 2: 在登录成功后未更换会话ID
export function sessionFixationExample2() {
  const app = express();
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (isValidCredentials(username, password)) {
      // 危险：在验证成功后未更换会话ID
      // 攻击者如果已知会话ID，可以继续使用它
      req.session.loggedIn = true;
      req.session.userId = getUserId(username);
      req.session.username = username;
      
      res.redirect('/home');
    } else {
      res.redirect('/login?failed=true');
    }
  });
  
  return app;
}

// 示例 3: 通过URL参数传播会话ID
export function sessionFixationExample3() {
  const app = express();
  
  app.get('/public-page', (req, res) => {
    // 危险：将会话ID暴露在URL中
    const sessionId = req.sessionID;
    const returnUrl = req.query.returnUrl || '/dashboard';
    
    // 危险：在重定向URL中包含会话ID
    const redirectWithSession = `${returnUrl}?session=${sessionId}`;
    
    res.send(`
      <p>Click <a href="${redirectWithSession}">here</a> to continue</p>
      <p>Or <a href="/login?sessionId=${sessionId}">login here</a> with this session</p>
    `);
  });
  
  return app;
}

// 示例 4: 允许通过请求参数设置会话ID
export function sessionFixationExample4() {
  const app = express();
  
  // 中间件：允许通过参数设置会话ID
  app.use((req, res, next) => {
    if (req.query.sessionId) {
      // 危险：允许通过URL参数指定会话ID
      req.sessionID = req.query.sessionId;
    }
    next();
  });
  
  app.get('/any-page', (req, res) => {
    // 页面内容
    res.send('Page content');
  });
  
  return app;
}

// 示例 5: 登录前后使用相同的会话对象
export function sessionFixationExample5() {
  const app = express();
  
  // 访问网站时即创建会话
  app.use((req, res, next) => {
    if (!req.session.visitCount) {
      req.session.visitCount = 1;
    } else {
      req.session.visitCount++;
    }
    next();
  });
  
  app.get('/login', (req, res) => {
    // 危险：登录前已经存在会话，登录后继续使用同一会话
    res.render('login', { 
      sessionId: req.sessionID,  // 暴露会话ID给用户
    });
  });
  
  app.post('/do-login', (req, res) => {
    const { username, password } = req.body;
    if (authenticateUser(username, password)) {
      // 危险：未更换会话ID，继续使用访问时创建的会话
      req.session.authenticated = true;
      req.session.user = { username, id: getUserId(username) };
      res.redirect('/secure-area');
    } else {
      res.redirect('/login?error=auth_failed');
    }
  });
  
  return app;
}

// 示例 6: 在多个身份验证状态下保留相同会话
export function sessionFixationExample6() {
  const app = express();
  
  app.get('/set-session', (req, res) => {
    // 危险：允许设置预定义的会话ID
    const targetSessionId = req.query.targetSessionId;
    if (targetSessionId) {
      req.session.predefinedId = targetSessionId;
    }
    res.send('Session may be set');
  });
  
  app.post('/verify-login', (req, res) => {
    // 危险：验证后未更换会话ID
    if (verifyCredentials(req.body)) {
      req.session.level = 'authenticated';
      req.session.privilege = 'user';
      // 危险：此处未重新生成会话ID
    }
    res.redirect('/account');
  });
  
  return app;
}

// 示例 7: 会话ID重置但未正确实现
export function sessionFixationExample7() {
  const app = express();
  
  app.post('/login-action', (req, res) => {
    if (validateLogin(req.body.username, req.body.password)) {
      // 尝试重置会话但实现不当
      const oldSessionId = req.sessionID;
      req.session.destroy(() => {
        // 危险：这种做法并不能有效防止会话固定
        // 因为中间件可能已经设置了新的会话
        req.session = {};
        req.session.authenticated = true;
        req.session.userId = req.body.username;
        // 会话ID可能仍然是可预测的或已泄露的
      });
      
      res.redirect('/protected');
    } else {
      res.redirect('/login?error=bad_credentials');
    }
  });
  
  return app;
}

// 示例 8: 通过Cookie设置会话ID
export function sessionFixationExample8() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：允许通过特殊Cookie设置会话ID
    if (req.cookies['temp-session']) {
      // 攻击者可以设置这个Cookie来指定会话ID
      req.sessionID = req.cookies['temp-session'];
    }
    next();
  });
  
  app.get('/track-user', (req, res) => {
    req.session.tracked = true;
    res.send('User tracking enabled');
  });
  
  return app;
}

// 示例 9: 登录流程中部分重新生成会话
export function sessionFixationExample9() {
  const app = express();
  
  app.post('/step1-verify', (req, res) => {
    if (simpleValidation(req.body.token)) {
      // 危险：只保存部分认证状态，未完全重新生成会话
      req.session.partialAuth = true;
      req.session.tempUser = req.body.user;
      res.redirect(`/step2-confirm?session=${req.sessionID}`);
    }
  });
  
  app.post('/step2-finalize', (req, res) => {
    if (req.session.partialAuth) {
      // 危险：在此阶段仍未重新生成会话ID
      req.session.fullyAuthenticated = true;
      req.session.level = 'premium';
      delete req.session.partialAuth;
    }
    res.redirect('/premium-content');
  });
  
  return app;
}

// 示例 10: 复杂的会话固定场景
export function sessionFixationExample10() {
  const app = express();
  
  // 攻击者可以利用的初始化会话
  app.get('/init-session', (req, res) => {
    const forcedSessionId = req.query.forceId || req.headers['x-session-force'];
    if (forcedSessionId) {
      // 危险：强制使用指定的会话ID
      req.session.forcedId = forcedSessionId;
    }
    
    // 暴露当前会话信息给用户
    res.json({
      currentSessionId: req.sessionID,
      forced: !!req.session.forcedId
    });
  });
  
  app.get('/authenticate', (req, res) => {
    // 危险：认证过程中未改变会话ID
    if (req.query.token && verifyToken(req.query.token)) {
      req.session.authenticated = true;
      req.session.userId = extractUserId(req.query.token);
      req.session.loginTime = new Date();
      
      // 危险：这里没有重新生成会话ID
    }
    res.redirect('/user-panel');
  });
  
  app.get('/user-panel', (req, res) => {
    if (req.session.authenticated) {
      res.send(`Welcome user ${req.session.userId}. Session ID: ${req.sessionID}`);
    } else {
      res.redirect('/login');
    }
  });
  
  return app;
}

// 示例 11: 社交媒体登录的会话固定
export function sessionFixationExample11() {
  const app = express();
  
  app.get('/auth/social/callback', (req, res) => {
    // 危险：社交媒体回调中未重新生成会话ID
    const userData = extractUserData(req.query);
    
    // 直接将在回调中获得的数据附加到现有会话
    req.session.socialAuth = true;
    req.session.userId = userData.id;
    req.session.userName = userData.name;
    req.session.provider = userData.provider;
    
    // 危险：未重新生成会话ID，攻击者可能已经知道当前会话ID
    res.redirect('/social-dashboard');
  });
  
  return app;
}

// 示例 12: 多步骤认证中的会话固定
export function sessionFixationExample12() {
  const app = express();
  
  app.post('/start-auth', (req, res) => {
    // 开始认证过程，创建初始会话状态
    req.session.authStep = 1;
    req.session.userId = req.body.userId;
    res.json({ sessionId: req.sessionID, step: 1 });
  });
  
  app.post('/continue-auth', (req, res) => {
    // 危险：在多步骤认证中未更换会话ID
    if (req.session.authStep === 1 && validateSecondFactor(req.body.factor)) {
      req.session.authStep = 2;
      req.session.secondFactorVerified = true;
    }
    res.json({ step: req.session.authStep });
  });
  
  app.post('/finalize-auth', (req, res) => {
    // 危险：最终认证完成时仍未重新生成会话ID
    if (req.session.authStep === 2 && validateFinalCheck(req.body.check)) {
      req.session.authStep = 3;
      req.session.fullyAuthenticated = true;
      req.session.accessLevel = 'admin';
      // 危险：整个认证过程都没有重新生成会话ID
    }
    res.redirect('/admin-panel');
  });
  
  return app;
}

// 示例 13: 会话令牌复制
export function sessionFixationExample13() {
  const app = express();
  
  app.get('/replicate-session', (req, res) => {
    // 危险：允许创建当前会话的副本
    const targetSessionId = req.query.targetId;
    if (targetSessionId) {
      // 攻击者可以创建一个他们知道ID的新会话，
      // 然后诱使用户在该会话上进行身份验证
      req.session.replicatedTo = targetSessionId;
      req.session.needsAuth = true;
    }
    res.send('Session replication requested');
  });
  
  app.post('/confirm-auth', (req, res) => {
    if (req.session.needsAuth && verifyCredentials(req.body)) {
      // 危险：未重新生成会话ID，攻击者可能知道目标会话ID
      req.session.authenticated = true;
      req.session.privileges = 'user';
    }
    res.redirect('/user-home');
  });
  
  return app;
}

// 示例 14: 通过Referer进行会话关联
export function sessionFixationExample14() {
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：基于Referer设置会话关联
    const referer = req.get('Referer');
    if (referer && referer.includes('known-session=')) {
      // 从Referer中提取会话ID
      const url = new URL(referer);
      const knownSession = url.searchParams.get('known-session');
      if (knownSession) {
        // 危险：将当前会话与已知会话关联
        req.session.associatedWith = knownSession;
      }
    }
    next();
  });
  
  app.get('/accept-invitation', (req, res) => {
    // 危险：接受邀请时可能使用与攻击者共享的会话
    if (req.session.associatedWith) {
      req.session.acceptedFrom = req.session.associatedWith;
    }
    res.send('Invitation accepted');
  });
  
  return app;
}

// 示例 15: 会话升级时的固定
export function sessionFixationExample15() {
  const app = express();
  
  app.get('/request-upgrade', (req, res) => {
    // 用户请求权限升级
    req.session.upgradeRequested = true;
    req.session.initialLevel = req.session.level || 'guest';
    res.send(`Upgrade requested. Current level: ${req.session.initialLevel}`);
  });
  
  app.get('/admin/approve-upgrade/:userId', (req, res) => {
    // 管理员批准升级
    // 危险：批准操作可能影响用户的现有会话
    // 而没有重新生成会话ID
    const targetSessionId = req.query.sessionId; // 危险参数
    
    // 模拟对特定会话的权限提升
    req.session.approvedUpgrade = true;
    req.session.level = 'admin';
    req.session.privileges = getAllPrivileges();
    
    // 危险：未重新生成会话ID，攻击者可能知道会话ID
    res.send('Upgrade approved');
  });
  
  return app;
}

// 示例 16: 预先设置会话数据
export function sessionFixationExample16() {
  const app = express();
  
  app.get('/prepare-session', (req, res) => {
    // 危险：允许外部设置会话的预期状态
    const presetData = req.query.preset || req.headers['x-session-preset'];
    if (presetData) {
      try {
        const parsed = JSON.parse(atob(presetData)); // 危险的解码
        // 危险：允许预设会话数据
        Object.assign(req.session, parsed);
      } catch (e) {
        console.error('Failed to parse preset session data');
      }
    }
    res.send('Session prepared');
  });
  
  app.post('/complete-auth', (req, res) => {
    // 完成认证，但会话已经被预先设置
    if (req.session.expectingAuth) {
      req.session.authenticated = true;
      // 危险：未重新生成会话ID，而是继续使用预设的会话
    }
    res.redirect('/profile');
  });
  
  return app;
}

// 示例 17: 会话克隆
export function sessionFixationExample17() {
  const app = express();
  
  app.get('/clone-session', (req, res) => {
    // 危险：允许克隆会话到新的ID
    const newSessionId = req.query.newId;
    if (newSessionId) {
      // 攻击者可以创建一个他们知道ID的会话，
      // 并将当前（可能是认证的）会话数据复制过去
      req.session.cloneTarget = newSessionId;
      req.session.cloneRequested = true;
    }
    res.json({ originalId: req.sessionID });
  });
  
  app.get('/activate-clone', (req, res) => {
    if (req.session.cloneRequested) {
      // 危险：激活克隆会话，这可能是一个攻击者知道ID的会话
      req.session.cloned = true;
      req.session.activationTime = new Date();
      // 危险：未重新生成会话ID
    }
    res.redirect('/cloned-area');
  });
  
  return app;
}

// 示例 18: 外部会话ID绑定
export function sessionFixationExample18() {
  const app = express();
  
  app.get('/bind-session', (req, res) => {
    // 危险：允许绑定到外部指定的会话ID
    const externalSessionId = req.query.externalId;
    if (externalSessionId) {
      req.session.boundToExternal = externalSessionId;
      req.session.bindingTime = new Date();
    }
    res.send(`Bound to external session: ${externalSessionId}`);
  });
  
  app.post('/auth-bound-session', (req, res) => {
    if (req.session.boundToExternal) {
      // 危险：在已绑定的会话上进行认证
      if (verifyUser(req.body.credentials)) {
        req.session.authenticated = true;
        req.session.boundAuth = true;
        // 危险：未重新生成会话ID，攻击者可能知道绑定的ID
      }
    }
    res.redirect('/bound-area');
  });
  
  return app;
}

// 示例 19: 会话预分配
export function sessionFixationExample19() {
  const app = express();
  
  app.get('/allocate-session', (req, res) => {
    // 危险：允许预分配会话ID
    const desiredId = req.query.desiredId;
    if (desiredId) {
      // 将期望的ID存储在临时位置
      req.session.desiredId = desiredId;
      req.session.preAllocationTime = new Date();
    }
    res.json({ allocated: !!req.session.desiredId });
  });
  
  app.post('/claim-session', (req, res) => {
    if (req.session.desiredId) {
      // 危险：认领预分配的会话
      // 实际上我们不能真正"设置"会话ID，但可以模拟这种意图
      req.session.claimedDesiredId = req.session.desiredId;
      delete req.session.desiredId;
      
      if (authenticateClaim(req.body)) {
        req.session.authenticated = true;
        // 危险：未重新生成会话ID
      }
    }
    res.redirect('/claimed-area');
  });
  
  return app;
}

// 示例 20: 复杂的会话固定组合攻击
export function sessionFixationExample20() {
  const app = express();
  
  // 组合多种会话固定技术
  app.use((req, res, next) => {
    // 技术1: URL参数设置
    if (req.query.sessionId) {
      req.session.urlParamId = req.query.sessionId;
    }
    
    // 技术2: Header设置
    if (req.headers['x-custom-session']) {
      req.session.headerId = req.headers['x-custom-session'];
    }
    
    // 技术3: Cookie设置
    if (req.cookies['custom-session']) {
      req.session.cookieId = req.cookies['custom-session'];
    }
    
    // 技术4: Referer关联
    const referer = req.get('Referer');
    if (referer && referer.includes('shared-session=')) {
      const url = new URL(referer);
      req.session.sharedWith = url.searchParams.get('shared-session');
    }
    
    next();
  });
  
  app.get('/complex-auth-start', (req, res) => {
    // 启动复杂的认证过程
    req.session.complexAuth = true;
    req.session.steps = ['start'];
    res.json({ 
      sessionId: req.sessionID, 
      urlParamId: req.session.urlParamId,
      headerId: req.session.headerId,
      cookieId: req.session.cookieId,
      sharedWith: req.session.sharedWith
    });
  });
  
  app.post('/complex-auth-step2', (req, res) => {
    if (req.session.complexAuth) {
      req.session.steps.push('step2');
      req.session.userData = req.body;
      // 危险：每个步骤都未重新生成会话ID
    }
    res.json({ step: 'step2', completed: req.session.steps });
  });
  
  app.post('/complex-auth-finalize', (req, res) => {
    if (req.session.steps && req.session.steps.length >= 2) {
      // 最终认证完成
      req.session.authenticated = true;
      req.session.level = 'premium';
      req.session.privileges = 'all';
      req.session.finalStep = 'completed';
      // 危险：整个复杂过程都没有重新生成会话ID
    }
    res.redirect('/complex-protected-area');
  });
  
  return app;
}

// 模拟辅助函数
function isValidCredentials(username, password) { return true; }
function getUserId(username) { return 123; }
function authenticateUser(username, password) { return true; }
function verifyCredentials(body) { return true; }
function validateLogin(username, password) { return true; }
function simpleValidation(token) { return true; }
function verifyToken(token) { return true; }
function extractUserId(token) { return 123; }
function extractUserData(query) { return { id: 123, name: 'user', provider: 'social' }; }
function validateSecondFactor(factor) { return true; }
function validateFinalCheck(check) { return true; }
function getAllPrivileges() { return ['read', 'write', 'admin']; }
function verifyUser(credentials) { return true; }
function authenticateClaim(credentials) { return true; }
