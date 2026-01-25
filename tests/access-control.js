// Access Control 漏洞示例文件

// 示例 1: 缺少身份验证中间件
export function accessControlExample1() {
  const express = require('express');
  const app = express();
  
  // 危险：管理端点没有身份验证
  app.get('/admin/users', (req, res) => {
    // 危险：任何人都可以直接访问用户列表
    const users = [
      { id: 1, username: 'admin', role: 'administrator' },
      { id: 2, username: 'user1', role: 'user' }
    ];
    res.json(users);
  });
  
  // 危险：敏感配置端点没有身份验证
  app.get('/admin/config', (req, res) => {
    // 危险：任何人都可以访问系统配置
    const config = {
      db_host: 'localhost',
      db_password: 'secretpassword',
      api_keys: ['secret_key_1', 'secret_key_2']
    };
    res.json(config);
  });
  
  // 危险：删除用户端点没有身份验证
  app.delete('/admin/users/:id', (req, res) => {
    // 危险：任何人都可以删除用户
    const userId = req.params.id;
    res.json({ message: `User ${userId} deleted` });
  });
  
  return app;
}

// 示例 2: 缺少权限检查
export function accessControlExample2() {
  const express = require('express');
  const app = express();
  
  // 假设有一个简单的认证中间件
  function isAuthenticated(req, res, next) {
    // 简单的认证检查
    if (req.headers.authorization) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  // 危险：只有基础认证，没有角色权限检查
  app.use('/api/admin', isAuthenticated);
  
  // 危险：认证用户可以访问所有管理功能
  app.get('/api/admin/dashboard', (req, res) => {
    // 危险：没有检查用户是否真的有管理员权限
    res.json({ dashboard: 'admin dashboard data' });
  });
  
  app.get('/api/admin/payroll', (req, res) => {
    // 危险：没有检查用户是否真的有财务权限
    res.json({ payroll: 'sensitive payroll data' });
  });
  
  app.put('/api/admin/system-settings', (req, res) => {
    // 危险：没有检查用户是否真的有系统管理员权限
    res.json({ message: 'System settings updated' });
  });
  
  return app;
}

// 示例 3: 水平权限提升漏洞
export function accessControlExample3() {
  const express = require('express');
  const app = express();
  
  // 假设用户已认证，但没有适当的权限检查
  app.get('/api/profile/:userId', (req, res) => {
    // 危险：用户可以访问任何人的个人资料
    const requestedUserId = req.params.userId;
    // 应该只返回当前登录用户的资料，但实际上返回任何指定用户的资料
    const profile = {
      id: requestedUserId,
      name: `User ${requestedUserId}`,
      email: `user${requestedUserId}@example.com`,
      private_data: 'This should only be accessible by the user themselves'
    };
    res.json(profile);
  });
  
  // 危险：用户可以更新任何人的资料
  app.put('/api/profile/:userId', (req, res) => {
    const requestedUserId = req.params.userId;
    const updates = req.body;
    
    // 危险：没有验证当前用户是否可以修改目标用户的数据
    res.json({ 
      message: `Profile for user ${requestedUserId} updated`, 
      updates 
    });
  });
  
  return app;
}

// 示例 4: 基于路由的访问控制不足
export function accessControlExample4() {
  const express = require('express');
  const app = express();
  
  // 简单的身份验证中间件
  function basicAuth(req, res, next) {
    if (req.headers.token) {
      next(); // 假设有任何token就算通过验证
    } else {
      res.status(401).json({ error: 'No token provided' });
    }
  }
  
  // 应用基本认证到所有API路由
  app.use('/api/', basicAuth);
  
  // 危险：即使是基本认证，也不应允许普通用户访问管理功能
  app.get('/api/admin/stats', (req, res) => {
    // 危险：所有持有token的用户都可以访问管理统计数据
    res.json({ stats: 'admin statistics' });
  });
  
  app.post('/api/admin/broadcast', (req, res) => {
    // 危险：所有持有token的用户都可以发送广播消息
    const message = req.body.message;
    res.json({ message: `Broadcast sent: ${message}` });
  });
  
  return app;
}

// 示例 5: 缺少细粒度权限控制
export function accessControlExample5() {
  const express = require('express');
  const app = express();
  
  // 假设用户已通过认证
  app.use((req, res, next) => {
    // 模拟用户对象，应该由认证中间件设置
    req.user = { id: 1, role: 'editor', permissions: ['read', 'write'] };
    next();
  });
  
  // 危险：没有根据用户的具体权限进行访问控制
  app.delete('/api/content/:id', (req, res) => {
    // 危险：编辑者不应该有删除内容的权限
    const contentId = req.params.id;
    res.json({ message: `Content ${contentId} deleted` });
  });
  
  app.patch('/api/users/:id', (req, res) => {
    // 危险：编辑者不应该有更新其他用户信息的权限
    const userId = req.params.id;
    res.json({ message: `User ${userId} updated` });
  });
  
  app.get('/api/system/logs', (req, res) => {
    // 危险：编辑者不应该有访问系统日志的权限
    res.json({ logs: 'system logs' });
  });
  
  return app;
}