// Rate Limiting 漏洞示例文件

// 示例 1: 缺少速率限制
export function rateLimitingExample1() {
  // 危险：API端点没有速率限制
  const express = require('express');
  const app = express();
  
  // 危险：登录端点没有速率限制，容易受到暴力破解攻击
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // 登录逻辑...
    res.json({ success: true });
  });
  
  // 危险：密码重置端点没有速率限制
  app.post('/reset-password', (req, res) => {
    const { email } = req.body;
    // 密码重置逻辑...
    res.json({ success: true });
  });
  
  // 危险：API端点没有速率限制
  app.get('/api/data', (req, res) => {
    res.json({ data: 'sensitive information' });
  });
  
  return app;
}

// 示例 2: API端点缺少速率限制中间件
export function rateLimitingExample2() {
  const express = require('express');
  const app = express();
  
  // 危险：没有使用速率限制中间件
  app.post('/api/user/profile', (req, res) => {
    // 用户资料更新逻辑
    res.json({ message: 'Profile updated' });
  });
  
  app.get('/api/search', (req, res) => {
    // 搜索逻辑
    const query = req.query.q;
    res.json({ results: [] });
  });
  
  return app;
}

// 示例 3: 图片上传端点缺少速率限制
export function rateLimitingExample3() {
  const express = require('express');
  const multer = require('multer');
  const app = express();
  const upload = multer({ dest: 'uploads/' });
  
  // 危险：上传端点没有速率限制
  app.post('/upload/image', upload.single('image'), (req, res) => {
    res.json({ message: 'Image uploaded successfully' });
  });
  
  return app;
}

// 示例 4: 没有针对特定IP地址的速率限制
export function rateLimitingExample4() {
  const express = require('express');
  const app = express();
  
  // 危险：没有基于IP的速率限制
  app.get('/api/public-endpoint', (req, res) => {
    res.json({ data: 'public data' });
  });
  
  app.post('/api/contact', (req, res) => {
    // 联系表单处理
    res.json({ message: 'Message sent' });
  });
  
  return app;
}

// 示例 5: 没有针对认证用户的速率限制
export function rateLimitingExample5() {
  const express = require('express');
  const app = express();
  
  // 危险：认证后的API端点没有速率限制
  app.use('/api/protected', (req, res, next) => {
    // 假设这里有一些认证中间件
    if (req.headers.authorization) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
  
  app.get('/api/protected/data', (req, res) => {
    res.json({ data: 'protected data' });
  });
  
  return app;
}