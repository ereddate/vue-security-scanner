// Insecure HTTP Method 漏洞示例文件

// 示例 1: 使用 GET 修改数据
export function insecureHttpMethodExample1() {
  const app = express();
  
  app.get('/delete-user', (req, res) => {
    const userId = req.query.id;
    // 危险：使用 GET 方法删除数据
    deleteUser(userId);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 2: 允许不安全的 HTTP 方法
export function insecureHttpMethodExample2() {
  const app = express();
  
  app.all('/api/data', (req, res) => {
    // 危险：允许所有 HTTP 方法
    const data = req.body;
    processData(data);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 3: 缺少方法验证
export function insecureHttpMethodExample3() {
  const app = express();
  
  app.post('/transfer', (req, res) => {
    // 危险：没有验证请求方法
    const { from, to, amount } = req.body;
    transferMoney(from, to, amount);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 4: 使用 TRACE 方法
export function insecureHttpMethodExample4() {
  const app = express();
  
  app.trace('/debug', (req, res) => {
    // 危险：使用 TRACE 方法可能泄露信息
    res.send(req.headers);
  });
  
  return app;
}

// 示例 5: 使用 PUT 创建资源
export function insecureHttpMethodExample5() {
  const app = express();
  
  app.put('/users', (req, res) => {
    // 危险：应该使用 POST 创建资源
    const user = req.body;
    createUser(user);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 6: 使用 DELETE 查询数据
export function insecureHttpMethodExample6() {
  const app = express();
  
  app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    // 危险：使用 DELETE 方法查询数据
    const user = getUser(userId);
    res.json(user);
  });
  
  return app;
}

// 示例 7: 缺少 CSRF 保护
export function insecureHttpMethodExample7() {
  const app = express();
  
  app.post('/change-password', (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // 危险：没有 CSRF 保护
    changePassword(oldPassword, newPassword);
    res.json({ success: true });
  });
  
  return app;
}

// 示例 8: 允许 OPTIONS 方法
export function insecureHttpMethodExample8() {
  const app = express();
  
  app.options('/api/*', (req, res) => {
    // 危险：允许 OPTIONS 方法可能泄露信息
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.send('OK');
  });
  
  return app;
}

// 示例 9: 使用 GET 传递敏感数据
export function insecureHttpMethodExample9() {
  const app = express();
  
  app.get('/login', (req, res) => {
    const { username, password } = req.query;
    // 危险：使用 GET 传递密码
    const user = authenticate(username, password);
    res.json({ token: user.token });
  });
  
  return app;
}

// 示例 10: 缺少方法限制
export function insecureHttpMethodExample10() {
  const app = express();
  
  app.use('/admin', (req, res, next) => {
    // 危险：没有限制 HTTP 方法
    if (req.path === '/delete') {
      deleteAllData();
    }
    next();
  });
  
  return app;
}
