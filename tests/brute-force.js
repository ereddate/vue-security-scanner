// Brute Force Attack 漏洞示例文件

// 示例 1: 缺少登录失败尝试计数
export function bruteForceExample1() {
  // 危险：登录功能没有失败尝试计数
  function login(username, password) {
    // 危险：没有记录失败尝试次数
    if (username === 'admin' && password === 'correctpassword') {
      return { success: true, user: 'admin' };
    }
    
    // 危险：没有锁定账户机制
    return { success: false, message: 'Invalid credentials' };
  }

  return login;
}

// 示例 2: 缺少账户锁定机制
export function bruteForceExample2() {
  // 危险：认证函数没有账户锁定逻辑
  const users = {
    admin: 'password123',
    user: 'userpass'
  };

  const failedAttempts = {}; // 存储失败尝试次数

  function authenticate(username, password) {
    // 危险：没有检查失败尝试次数
    if (users[username] && users[username] === password) {
      // 成功登录，但没有重置失败次数
      return { success: true, user: username };
    } else {
      // 危险：只记录失败次数，但没有锁定账户
      failedAttempts[username] = (failedAttempts[username] || 0) + 1;
      return { success: false, message: 'Authentication failed' };
    }
  }

  return authenticate;
}

// 示例 3: 没有验证码机制
export function bruteForceExample3() {
  // 危险：密码重置功能没有验证码机制
  const express = require('express');
  const app = express();

  app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    
    // 危险：没有速率限制或验证码，攻击者可以无限次请求
    // 发送密码重置邮件
    console.log(`Password reset email sent to: ${email}`);
    
    res.json({ message: 'Password reset email sent if account exists' });
  });

  app.post('/verify-code', (req, res) => {
    const { code, newPassword } = req.body;
    
    // 危险：没有限制验证码验证尝试次数
    // 验证码检查逻辑
    res.json({ message: 'Password reset successful' });
  });

  return app;
}

// 示例 4: 没有基于IP的暴力破解防护
export function bruteForceExample4() {
  // 危险：API没有基于IP的暴力破解防护
  const apiRequests = {};

  function handleApiRequest(ip, endpoint, data) {
    // 危险：没有跟踪来自同一IP的请求数量
    if (endpoint === '/api/login') {
      // 登录逻辑
      const { username, password } = data;
      
      // 危险：没有IP级别的速率限制
      if (isValidCredentials(username, password)) {
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    }
  }

  function isValidCredentials(username, password) {
    // 简单的凭据验证
    return username === 'admin' && password === 'password';
  }

  return handleApiRequest;
}

// 示例 5: 没有失败尝试锁定机制
export function bruteForceExample5() {
  // 危险：密码验证函数没有锁定机制
  const accounts = {
    'user1': { password: 'pass1', locked: false, attempts: 0 },
    'user2': { password: 'pass2', locked: false, attempts: 0 }
  };

  function validatePassword(username, password) {
    const account = accounts[username];
    
    if (!account) {
      return { success: false, message: 'Account not found' };
    }
    
    // 危险：没有检查账户是否被锁定
    if (account.password === password) {
      // 登录成功，但没有重置尝试次数
      return { success: true, message: 'Login successful' };
    } else {
      // 危险：增加尝试次数，但没有达到阈值时锁定账户
      account.attempts += 1;
      console.log(`Failed attempt #${account.attempts} for user ${username}`);
      
      return { success: false, message: 'Invalid password' };
    }
  }

  return validatePassword;
}