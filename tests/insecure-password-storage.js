// Insecure Password Storage 漏洞示例文件

// 示例 1: 明文存储密码
export function insecurePasswordStorageExample1() {
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：明文存储密码
    db.users.insert({
      username: username,
      password: password
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 2: 使用 MD5 存储密码
export function insecurePasswordStorageExample2() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：使用 MD5 存储密码
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    
    db.users.insert({
      username: username,
      password: hashedPassword
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 3: 使用 SHA1 存储密码
export function insecurePasswordStorageExample3() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：使用 SHA1 存储密码
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    
    db.users.insert({
      username: username,
      password: hashedPassword
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 4: 不加盐存储密码
export function insecurePasswordStorageExample4() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：不加盐存储密码
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    db.users.insert({
      username: username,
      password: hashedPassword
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 5: 使用固定盐
export function insecurePasswordStorageExample5() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const salt = 'fixed-salt';
    
    // 危险：使用固定盐
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
    
    db.users.insert({
      username: username,
      password: hashedPassword
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 6: 使用快速哈希算法
export function insecurePasswordStorageExample6() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：使用快速哈希算法
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    db.users.insert({
      username: username,
      password: hashedPassword
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 7: 迭代次数不足
export function insecurePasswordStorageExample7() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    
    let hash = password + salt;
    // 危险：迭代次数不足
    for (let i = 0; i < 1; i++) {
      hash = crypto.createHash('sha256').update(hash).digest('hex');
    }
    
    db.users.insert({
      username: username,
      password: hash,
      salt: salt
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 8: 存储可逆加密的密码
export function insecurePasswordStorageExample8() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const algorithm = 'aes-256-cbc';
    const key = 'secret-key-1234567890123456';
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // 危险：存储可逆加密的密码
    db.users.insert({
      username: username,
      password: encrypted,
      iv: iv.toString('hex')
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 9: 密码哈希可预测
export function insecurePasswordStorageExample9() {
  const crypto = require('crypto');
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const timestamp = Date.now();
    
    // 危险：密码哈希可预测
    const hashedPassword = crypto.createHash('sha256').update(password + timestamp).digest('hex');
    
    db.users.insert({
      username: username,
      password: hashedPassword,
      timestamp: timestamp
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 10: 使用 Base64 编码存储密码
export function insecurePasswordStorageExample10() {
  const express = require('express');
  const app = express();
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：使用 Base64 编码存储密码
    const encodedPassword = Buffer.from(password).toString('base64');
    
    db.users.insert({
      username: username,
      password: encodedPassword
    });
    
    res.json({ success: true });
  });
  
  return app;
}
