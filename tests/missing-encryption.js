// Missing Encryption 漏洞示例文件

// 示例 1: 明文存储密码
export function missingEncryptionExample1() {
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

// 示例 2: 明文传输敏感数据
export function missingEncryptionExample2() {
  const express = require('express');
  const app = express();
  
  app.post('/api/payment', (req, res) => {
    const { cardNumber, cvv, expiry } = req.body;
    
    // 危险：明文传输信用卡信息
    processPayment(cardNumber, cvv, expiry);
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 3: 日志中记录敏感信息
export function missingEncryptionExample3() {
  const express = require('express');
  const app = express();
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：日志中记录密码
    console.log(`Login attempt: ${username}, password: ${password}`);
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 4: Cookie 中存储敏感信息
export function missingEncryptionExample4() {
  const express = require('express');
  const app = express();
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // 危险：Cookie 中存储敏感信息
    res.cookie('user', JSON.stringify({
      username: username,
      password: password
    }));
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 5: 本地存储中存储敏感信息
export function missingEncryptionExample5() {
  function saveCredentials(username, password) {
    // 危险：本地存储中存储敏感信息
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }
  
  return saveCredentials;
}

// 示例 6: URL 中传输敏感信息
export function missingEncryptionExample6() {
  const express = require('express');
  const app = express();
  
  app.get('/reset-password', (req, res) => {
    const { token, email } = req.query;
    
    // 危险：URL 中传输敏感信息
    console.log(`Reset password for ${email} with token ${token}`);
    
    res.send('Reset password page');
  });
  
  return app;
}

// 示例 7: 数据库中存储敏感信息
export function missingEncryptionExample7() {
  const express = require('express');
  const app = express();
  
  app.post('/api/save-card', (req, res) => {
    const { cardNumber, cvv, expiry } = req.body;
    
    // 危险：数据库中存储信用卡信息
    db.cards.insert({
      cardNumber: cardNumber,
      cvv: cvv,
      expiry: expiry
    });
    
    res.json({ success: true });
  });
  
  return app;
}

// 示例 8: 配置文件中存储敏感信息
export function missingEncryptionExample8() {
  const config = {
    database: {
      host: 'localhost',
      username: 'admin',
      password: 'password123'
    },
    api: {
      key: 'sk-1234567890abcdef'
    }
  };
  
  // 危险：配置文件中存储敏感信息
  return config;
}

// 示例 9: 环境变量中存储敏感信息
export function missingEncryptionExample9() {
  const express = require('express');
  const app = express();
  
  app.get('/api/config', (req, res) => {
    // 危险：暴露环境变量
    res.json({
      dbHost: process.env.DB_HOST,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASSWORD,
      apiKey: process.env.API_KEY
    });
  });
  
  return app;
}

// 示例 10: 代码中硬编码敏感信息
export function missingEncryptionExample10() {
  const apiKey = 'sk-1234567890abcdef';
  const dbPassword = 'password123';
  const jwtSecret = 'secret-key-12345';
  
  // 危险：代码中硬编码敏感信息
  return {
    apiKey,
    dbPassword,
    jwtSecret
  };
}
