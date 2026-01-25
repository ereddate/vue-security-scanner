// HTTP Parameter Pollution 漏洞示例文件

import express from 'express';

// 示例 1: 不安全地处理多个同名参数
export function httpParameterPollutionExample1() {
  const app = express();
  app.get('/vulnerable-endpoint', (req, res) => {
    // 危险：直接使用参数数组的第一个值，忽略其他值
    const userId = req.query.userId;
    // 如果有多个 userId 参数，req.query.userId 会是数组
    console.log('User ID:', userId);
    res.send('Processed');
  });
  return app;
}

// 示例 2: 对参数数量缺乏验证
export function httpParameterPollutionExample2() {
  const app = express();
  app.get('/login', (req, res) => {
    // 危险：没有验证参数是否唯一
    const username = Array.isArray(req.query.username) ? 
      req.query.username[0] : req.query.username;
    const password = Array.isArray(req.query.password) ? 
      req.query.password[0] : req.query.password;
    
    res.send(`Logging in as ${username}`);
  });
  return app;
}

// 示例 3: 缺乏参数污染检查的搜索功能
export function httpParameterPollutionExample3() {
  const app = express();
  app.get('/search', (req, res) => {
    // 危险：没有检查是否有多个查询参数
    const q = req.query.q || req.query.query || req.query.s;
    res.send(`Searching for: ${q}`);
  });
  return app;
}

// 示例 4: 不安全的分页参数处理
export function httpParameterPollutionExample4() {
  const app = express();
  app.get('/items', (req, res) => {
    // 危险：page 参数可能被污染
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    res.send(`Displaying page ${page} with ${limit} items`);
  });
  return app;
}

// 示例 5: 多个同名参数的累加效应
export function httpParameterPollutionExample5() {
  const app = express();
  app.get('/calculate', (req, res) => {
    // 危险：多个 amount 参数可能被当作数组处理
    const amounts = req.query.amount;
    let total = 0;
    if (Array.isArray(amounts)) {
      // 如果攻击者提供多个 amount 参数，这可能会产生意外结果
      for (const amount of amounts) {
        total += Number(amount);
      }
    } else {
      total = Number(amounts);
    }
    res.send(`Total: ${total}`);
  });
  return app;
}

// 示例 6: 缺乏参数验证的权限检查
export function httpParameterPollutionExample6() {
  const app = express();
  app.get('/admin', (req, res) => {
    // 危险：role 参数可能被污染
    const role = req.query.role;
    if (role === 'admin') {
      res.send('Admin panel');
    } else {
      res.send('Access denied');
    }
  });
  return app;
}

// 示例 7: 不安全的重定向参数处理
export function httpParameterPollutionExample7() {
  const app = express();
  app.get('/redirect', (req, res) => {
    // 危险：redirect 参数可能被污染
    const redirectUrl = req.query.redirect;
    // 如果有多个 redirect 参数，可能导致意外的重定向
    res.redirect(redirectUrl);
  });
  return app;
}

// 示例 8: 多参数污染导致的逻辑绕过
export function httpParameterPollutionExample8() {
  const app = express();
  app.get('/api/data', (req, res) => {
    // 危险：多个过滤参数可能导致逻辑绕过
    const filters = {
      user: req.query.user,
      scope: req.query.scope,
      access_level: req.query.access_level
    };
    // 多个同名参数可能导致过滤器失效
    res.send('Filtered data');
  });
  return app;
}

// 示例 9: 参数污染影响验证逻辑
export function httpParameterPollutionExample9() {
  const app = express();
  app.get('/validate', (req, res) => {
    // 危险：验证逻辑可能因参数污染而失效
    const token = req.query.token;
    const isValid = typeof token === 'string' && token.length > 0;
    if (isValid) {
      res.send('Valid token');
    } else {
      res.send('Invalid token');
    }
  });
  return app;
}

// 示例 10: 不安全的配置参数处理
export function httpParameterPollutionExample10() {
  const app = express();
  app.get('/config', (req, res) => {
    // 危险：多个配置参数可能导致配置污染
    const config = {
      theme: req.query.theme,
      lang: req.query.lang,
      region: req.query.region
    };
    res.send(`Configuration: ${JSON.stringify(config)}`);
  });
  return app;
}

// 示例 11: 参数污染影响计算逻辑
export function httpParameterPollutionExample11() {
  const app = express();
  app.get('/calculate-discount', (req, res) => {
    // 危险：折扣计算可能受到多个参数的影响
    const price = parseFloat(req.query.price);
    const discount = parseFloat(req.query.discount);
    const finalPrice = price - (price * discount / 100);
    res.send(`Final price: ${finalPrice}`);
  });
  return app;
}

// 示例 12: 多个认证参数导致的安全问题
export function httpParameterPollutionExample12() {
  const app = express();
  app.get('/secure-resource', (req, res) => {
    // 危险：多个认证参数可能导致安全检查失效
    const apiKey = req.query.apiKey;
    const authToken = req.query.authToken;
    if (apiKey || authToken) {
      res.send('Secure resource accessed');
    } else {
      res.status(401).send('Unauthorized');
    }
  });
  return app;
}

// 示例 13: 参数污染影响数据查询
export function httpParameterPollutionExample13() {
  const app = express();
  app.get('/query-data', (req, res) => {
    // 危险：查询参数可能被污染
    const dbQuery = {
      table: req.query.table,
      columns: req.query.columns,
      conditions: req.query.conditions
    };
    res.send('Query executed');
  });
  return app;
}

// 示例 14: 不安全的过滤参数处理
export function httpParameterPollutionExample14() {
  const app = express();
  app.get('/filter-content', (req, res) => {
    // 危险：过滤参数可能被污染
    const category = req.query.category;
    const exclude = req.query.exclude;
    const include = req.query.include;
    res.send('Content filtered');
  });
  return app;
}

// 示例 15: 多个时间参数导致的问题
export function httpParameterPollutionExample15() {
  const app = express();
  app.get('/time-sensitive', (req, res) => {
    // 危险：时间参数可能被污染
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    const currentTime = new Date().getTime();
    res.send('Time sensitive operation');
  });
  return app;
}

// 示例 16: 参数污染影响会话管理
export function httpParameterPollutionExample16() {
  const app = express();
  app.get('/session-info', (req, res) => {
    // 危险：会话参数可能被污染
    const sessionId = req.query.sessionId;
    const userId = req.query.userId;
    res.send(`Session: ${sessionId}, User: ${userId}`);
  });
  return app;
}

// 示例 17: 多个同名参数影响业务逻辑
export function httpParameterPollutionExample17() {
  const app = express();
  app.get('/process-order', (req, res) => {
    // 危险：订单处理可能受到多个参数的影响
    const orderId = req.query.orderId;
    const productId = req.query.productId;
    const quantity = req.query.quantity;
    res.send('Order processed');
  });
  return app;
}

// 示例 18: 参数污染绕过输入验证
export function httpParameterPollutionExample18() {
  const app = express();
  app.get('/submit-form', (req, res) => {
    // 危险：输入验证可能被多个参数绕过
    const email = req.query.email;
    // 简单的验证可能无法处理数组形式的参数
    const isValidEmail = typeof email === 'string' && 
                         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    res.send(isValidEmail ? 'Valid email' : 'Invalid email');
  });
  return app;
}

// 示例 19: 多个授权参数导致的问题
export function httpParameterPollutionExample19() {
  const app = express();
  app.get('/authorize', (req, res) => {
    // 危险：授权逻辑可能受到多个参数的影响
    const permissions = req.query.permissions;
    const scopes = req.query.scopes;
    const roles = req.query.roles;
    res.send('Authorization processed');
  });
  return app;
}

// 示例 20: 复杂的参数污染场景
export function httpParameterPollutionExample20() {
  const app = express();
  app.get('/complex-operation', (req, res) => {
    // 危险：多个参数同时被污染可能导致复杂的逻辑错误
    const params = {
      action: req.query.action,
      target: req.query.target,
      method: req.query.method,
      data: req.query.data,
      format: req.query.format,
      encoding: req.query.encoding
    };
    
    // 处理复杂操作
    res.send('Complex operation completed');
  });
  return app;
}
