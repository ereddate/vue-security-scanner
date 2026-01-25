// Privilege Escalation 漏洞示例文件

// 示例 1: 缺少权限检查
export function privilegeEscalationExample1() {
  const express = require('express');
  const app = express();
  
  app.post('/admin/delete-user', (req, res) => {
    const userId = req.body.userId;
    // 危险：没有检查用户权限
    deleteUser(userId);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 2: 权限提升通过参数
export function privilegeEscalationExample2() {
  const express = require('express');
  const app = express();
  
  app.post('/update-profile', (req, res) => {
    const { userId, role } = req.body;
    // 危险：允许用户修改自己的角色
    updateUser(userId, { role });
    res.json({ success: true });
  });
  
  return app;
}

// 示例 3: 会话固定
export function privilegeEscalationExample3() {
  const express = require('express');
  const app = express();
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticate(username, password);
    
    // 危险：使用用户提供的会话 ID
    const sessionId = req.body.sessionId || generateSessionId();
    req.session.id = sessionId;
    req.session.user = user;
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 4: JWT 权限提升
export function privilegeEscalationExample4() {
  const jwt = require('jsonwebtoken');
  
  function verifyToken(token) {
    const decoded = jwt.verify(token, 'secret');
    // 危险：没有验证权限
    return decoded;
  }
  
  return verifyToken;
}

// 示例 5: IDOR 漏洞
export function privilegeEscalationExample5() {
  const express = require('express');
  const app = express();
  
  app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    // 危险：没有检查用户是否有权限访问该用户数据
    const user = getUser(userId);
    res.json(user);
  });
  
  return app;
}

// 示例 6: 水平权限提升
export function privilegeEscalationExample6() {
  const express = require('express');
  const app = express();
  
  app.get('/user/:id/orders', (req, res) => {
    const userId = req.params.id;
    // 危险：用户可以访问其他用户的订单
    const orders = getOrders(userId);
    res.json(orders);
  });
  
  return app;
}

// 示例 7: 垂直权限提升
export function privilegeEscalationExample7() {
  const express = require('express');
  const app = express();
  
  app.post('/admin/settings', (req, res) => {
    const settings = req.body;
    // 危险：普通用户可以访问管理员设置
    updateAdminSettings(settings);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 8: 缺少角色验证
export function privilegeEscalationExample8() {
  const express = require('express');
  const app = express();
  
  app.post('/delete-all', (req, res) => {
    // 危险：没有验证用户角色
    deleteAllData();
    res.json({ success: true });
  });
  
  return app;
}

// 示例 9: 权限绕过
export function privilegeEscalationExample9() {
  const express = require('express');
  const app = express();
  
  app.get('/admin/dashboard', (req, res) => {
    if (req.query.bypass === 'true') {
      // 危险：允许绕过权限检查
      return res.send('Admin Dashboard');
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).send('Forbidden');
    }
    
    res.send('Admin Dashboard');
  });
  
  return app;
}

// 示例 10: 弱权限控制
export function privilegeEscalationExample10() {
  const express = require('express');
  const app = express();
  
  app.use((req, res, next) => {
    // 危险：弱权限控制
    if (req.headers['x-admin'] === 'true') {
      req.user = { isAdmin: true };
    }
    next();
  });
  
  return app;
}
