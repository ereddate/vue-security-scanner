# Vue 安全扫描工具安全覆盖指南

本全面指南详细介绍了 Vue 安全扫描工具可以检测的所有安全漏洞和问题。

## 目录

- [概述](#概述)
- [漏洞类别](#漏洞类别)
- [XSS 漏洞](#xss-漏洞)
- [注入攻击](#注入攻击)
- [身份验证和授权](#身份验证和授权)
- [会话管理](#会话管理)
- [输入验证](#输入验证)
- [配置安全](#配置安全)
- [依赖安全](#依赖安全)
- [API 安全](#api-安全)
- [数据保护](#数据保护)
- [网络安全](#网络安全)
- [内存和性能](#内存和性能)
- [业务逻辑](#业务逻辑)
- [合规性](#合规性)

## 概述

Vue 安全扫描工具为 Vue.js 应用程序提供全面的安全覆盖，检测多个类别的漏洞：

- **100+ 安全规则**：涵盖常见和高级漏洞的广泛规则集
- **Vue 特定检测**：Vue 2/3、Nuxt.js、uni-app、Taro 的专用规则
- **中国特定标准**：符合中国安全标准
- **OWASP Top 10**：全面覆盖 OWASP 2021 Top 10
- **CWE 映射**：通用弱点枚举参考
- **框架支持**：Element Plus、Ant Design Vue 等

## 漏洞类别

### 1. 跨站脚本（XSS）
- 存储 XSS
- 反射 XSS
- 基于 DOM 的 XSS
- 模板注入
- v-html XSS
- v-bind XSS

### 2. 注入攻击
- SQL 注入
- NoSQL 注入
- 命令注入
- LDAP 注入
- GraphQL 注入
- XPath 注入

### 3. 身份验证和授权
- 弱身份验证
- 授权绕过
- 会话固定
- JWT 漏洞
- OAuth 流漏洞

### 4. 输入验证
- 缺失验证
- 类型混淆
- 缓冲区溢出
- 整数溢出

### 5. 配置安全
- 硬编码密钥
- CORS 配置错误
- 缺失安全标头
- 不安全设置

### 6. 依赖安全
- 已知漏洞
- 过期软件包
- 许可证问题
- 供应链攻击

### 7. API 安全
- 身份验证损坏
- 速率限制不当
- 敏感数据暴露
- API 密钥泄漏

### 8. 数据保护
- 缺失加密
- 弱加密
- 数据泄漏
- 隐私违规

### 9. 网络安全
- 缺失 HTTPS
- 不安全协议
- 中间人攻击
- DNS 重绑定

### 10. 内存和性能
- 内存泄漏
- 拒绝服务
- 资源耗尽
- 低效算法

### 11. 业务逻辑
- 权限提升
- 竞争条件
- 逻辑缺陷
- 参数篡改

## XSS 漏洞

### v-html XSS

检测 `v-html` 指令的不安全使用。

**漏洞 ID**：`vue:xss-v-html`
**严重性**：高
**CWE**：CWE-79

**检测模式**：
```vue
<!-- 易受攻击 -->
<div v-html="userInput"></div>
<div v-html="userContent"></div>

<!-- 安全 -->
<div>{{ sanitizedInput }}</div>
<div v-text="sanitizedInput"></div>
```

**建议**：使用 `v-text` 或在使用 `v-html` 之前正确清理输入。

### v-bind XSS

检测不安全的属性绑定。

**漏洞 ID**：`vue:xss-v-bind`
**严重性**：高
**CWE**：CWE-79

**检测模式**：
```vue
<!-- 易受攻击 -->
<a v-bind:href="userUrl">点击</a>
<img v-bind:src="userImage">

<!-- 安全 -->
<a :href="safeUrl">点击</a>
<img :src="safeImage">
```

**建议**：在绑定之前验证和清理 URL。

### 内联事件处理器 XSS

检测危险的内联事件处理器。

**漏洞 ID**：`vue:xss-inline-handler`
**严重性**：高
**CWE**：CWE-79

**检测模式**：
```vue
<!-- 易受攻击 -->
<button @click="eval(userInput)">点击</button>
<div @mouseover="userFunction">悬停</div>

<!-- 安全 -->
<button @click="safeFunction">点击</button>
<div @mouseover="safeHandler">悬停</div>
```

**建议**：避免在事件处理器中使用 `eval` 或用户输入。

### 模板注入

检测模板注入漏洞。

**漏洞 ID**：`vue:template-injection`
**严重性**：严重
**CWE**：CWE-94

**检测模式**：
```javascript
// 易受攻击
const template = userTemplate;
const compiled = Vue.compile(template);

// 安全
const template = '<div>{{ content }}</div>';
const compiled = Vue.compile(template);
```

**建议**：永远不要编译用户提供的模板。

## 注入攻击

### SQL 注入

检测 SQL 注入漏洞。

**漏洞 ID**：`sql-injection`
**严重性**：严重
**CWE**：CWE-89

**检测模式**：
```javascript
// 易受攻击
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);

// 安全
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

**建议**：使用参数化查询或预处理语句。

### NoSQL 注入

检测 NoSQL 注入漏洞。

**漏洞 ID**：`nosql-injection`
**严重性**：严重
**CWE**：CWE-943

**检测模式**：
```javascript
// 易受攻击
const query = { $where: `this.username == '${username}'` };
db.find(query);

// 安全
const query = { username: username };
db.find(query);
```

**建议**：使用适当的查询构建器并避免 `$where` 运算符。

### 命令注入

检测命令注入漏洞。

**漏洞 ID**：`command-injection`
**严重性**：严重
**CWE**：CWE-78

**检测模式**：
```javascript
// 易受攻击
const { exec } = require('child_process');
exec(`ls ${userPath}`);

// 安全
const { exec } = require('child_process');
exec('ls', [sanitizedPath]);
```

**建议**：使用参数化执行或适当的转义。

### LDAP 注入

检测 LDAP 注入漏洞。

**漏洞 ID**：`ldap-injection`
**严重性**：高
**CWE**：CWE-90

**检测模式**：
```javascript
// 易受攻击
const filter = `(uid=${username})`;
ldap.search(filter);

// 安全
const filter = ldap.escapeFilter(username);
ldap.search(`(uid=${filter})`);
```

**建议**：使用 LDAP 转义函数和适当的过滤。

### GraphQL 注入

检测 GraphQL 注入漏洞。

**漏洞 ID**：`graphql-injection`
**严重性**：高
**CWE**：CWE-943

**检测模式**：
```javascript
// 易受攻击
const query = `{ user(id: "${userId}") { name } }`;
graphql(query);

// 安全
const query = 'query($id: ID!) { user(id: $id) { name } }';
graphql(query, { variables: { id: userId } });
```

**建议**：使用参数化 GraphQL 查询。

## 身份验证和授权

### 弱身份验证

检测弱身份验证机制。

**漏洞 ID**：`authentication-weak`
**严重性**：高
**CWE**：CWE-287

**检测模式**：
```javascript
// 易受攻击
function authenticate(username, password) {
  return users.find(u => u.username === username && u.password === password);
}

// 安全
function authenticate(username, password) {
  const user = users.find(u => u.username === username);
  return user && bcrypt.compare(password, user.passwordHash);
}
```

**建议**：使用强密码哈希（bcrypt、argon2）。

### 授权绕过

检测授权绕过漏洞。

**漏洞 ID**：`authorization-bypass`
**严重性**：严重
**CWE**：CWE-285

**检测模式**：
```javascript
// 易受攻击
app.get('/admin', (req, res) => {
  res.send('管理面板');
});

// 安全
app.get('/admin', requireAdmin, (req, res) => {
  res.send('管理面板');
});
```

**建议**：在所有受保护的路由上实施适当的授权检查。

### JWT 漏洞

检测 JWT 安全问题。

**漏洞 ID**：`jwt-vulnerability`
**严重性**：高
**CWE**：CWE-347

**检测模式**：
```javascript
// 易受攻击 - None 算法
const token = jwt.sign({ data: 'payload' }, 'secret', { algorithm: 'none' });

// 安全
const token = jwt.sign({ data: 'payload' }, 'secret', { algorithm: 'HS256' });
```

**建议**：使用强算法并正确验证 JWT。

### OAuth 流漏洞

检测 OAuth 实现问题。

**漏洞 ID**：`oauth-vulnerability`
**严重性**：高
**CWE**：CWE-287

**检测模式**：
```javascript
// 易受攻击 - 缺失状态参数
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const token = await exchangeCodeForToken(code);
});

// 安全
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.oauthState) {
    return res.status(400).send('无效状态');
  }
  const token = await exchangeCodeForToken(code);
});
```

**建议**：使用状态参数并验证重定向 URI。

## 会话管理

### 会话固定

检测会话固定漏洞。

**漏洞 ID**：`session-fixation`
**严重性**：高
**CWE**：CWE-384

**检测模式**：
```javascript
// 易受攻击
app.post('/login', (req, res) => {
  req.session.userId = userId;
  res.send('已登录');
});

// 安全
app.post('/login', (req, res) => {
  req.session.regenerate(() => {
    req.session.userId = userId;
    res.send('已登录');
  });
});
```

**建议**：身份验证后重新生成会话 ID。

### 会话超时

检测缺失会话超时。

**漏洞 ID**：`session-timeout-missing`
**严重性**：中
**CWE**：CWE-613

**检测模式**：
```javascript
// 易受攻击
app.use(session({
  secret: 'secret'
}));

// 安全
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 3600000 }, // 1 小时
  resave: false,
  saveUninitialized: false
}));
```

**建议**：实施会话超时和安全 cookie 设置。

## 输入验证

### 缺失验证

检测缺失的输入验证。

**漏洞 ID**：`input-validation-missing`
**严重性**：高
**CWE**：CWE-20

**检测模式**：
```vue
<!-- 易受攻击 -->
<input v-model="userInput" />
<button @click="submit(userInput)">提交</button>

<!-- 安全 -->
<input v-model="userInput" @input="validate" />
<button @click="submit(userInput)" :disabled="!isValid">提交</button>
```

**建议**：实施客户端和服务器端验证。

### 类型混淆

检测类型混淆漏洞。

**漏洞 ID**：`type-confusion`
**严重性**：中
**CWE**：CWE-843

**检测模式**：
```javascript
// 易受攻击
function processInput(input) {
  if (input === 'true') {
    return true;
  }
  return input;
}

// 安全
function processInput(input) {
  if (typeof input === 'boolean') {
    return input;
  }
  if (input === 'true') {
    return true;
  }
  return input;
}
```

**建议**：在处理之前验证输入类型。

## 配置安全

### 硬编码密钥

检测代码中的硬编码密钥。

**漏洞 ID**：`hardcoded-secret`
**严重性**：严重
**CWE**：CWE-798

**检测模式**：
```javascript
// 易受攻击
const apiKey = 'sk-1234567890abcdef';
const dbPassword = 'password123';

// 安全
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;
```

**建议**：使用环境变量或密钥管理服务。

### CORS 配置错误

检测不安全的 CORS 配置。

**漏洞 ID**：`cors-misconfiguration`
**严重性**：中
**CWE**：CWE-942

**检测模式**：
```javascript
// 易受攻击
app.use(cors({ origin: '*' }));

// 安全
app.use(cors({
  origin: ['https://example.com'],
  credentials: true
}));
```

**建议**：将 CORS 限制为受信任的来源。

### 缺失安全标头

检测缺失的安全标头。

**漏洞 ID**：`missing-security-headers`
**严重性**：中
**CWE**：CWE-693

**检测模式**：
```javascript
// 易受攻击
app.use((req, res, next) => {
  res.send('你好');
});

// 安全
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

**建议**：实施所有推荐的安全标头。

## 依赖安全

### 已知漏洞

检测具有已知 CVE 的依赖项。

**漏洞 ID**：`dependency-vulnerability`
**严重性**：各异
**CWE**：CWE-1104

**检测模式**：
```json
// 易受攻击
{
  "dependencies": {
    "lodash": "4.17.15",
    "axios": "0.19.0"
  }
}

// 安全
{
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^1.0.0"
  }
}
```

**建议**：保持依赖项更新并使用 `npm audit`。

### 过期软件包

检测过期的依赖项。

**漏洞 ID**：`outdated-dependency`
**严重性**：低
**CWE**：CWE-1104

**检测模式**：
```json
// 易受攻击
{
  "dependencies": {
    "vue": "2.6.0"
  }
}

// 安全
{
  "dependencies": {
    "vue": "^3.0.0"
  }
}
```

**建议**：定期将依赖项更新到最新版本。

## API 安全

### API 密钥泄漏

检测代码中的 API 密钥暴露。

**漏洞 ID**：`api-key-leakage`
**严重性**：高
**CWE**：CWE-798

**检测模式**：
```javascript
// 易受攻击
const apiKey = 'AIzaSyBdVl-cTcSwYa9Y8fkpBdFg';
fetch(`https://api.example.com?key=${apiKey}`);

// 安全
const apiKey = process.env.API_KEY;
fetch('https://api.example.com', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

**建议**：使用环境变量，永远不要在客户端代码中暴露 API 密钥。

### 速率限制不当

检测缺失的速率限制。

**漏洞 ID**：`missing-rate-limiting`
**严重性**：中
**CWE**：CWE-770

**检测模式**：
```javascript
// 易受攻击
app.post('/api/data', (req, res) => {
  res.json({ data: '敏感' });
});

// 安全
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 将每个 IP 限制为每个 windowMs 100 个请求
});
app.post('/api/data', limiter, (req, res) => {
  res.json({ data: '敏感' });
});
```

**建议**：在所有公共 API 上实施速率限制。

## 数据保护

### 缺失加密

检测敏感数据缺失加密。

**漏洞 ID**：`missing-encryption`
**严重性**：高
**CWE**：CWE-311

**检测模式**：
```javascript
// 易受攻击
const sensitiveData = '信用卡号';
localStorage.setItem('data', sensitiveData);

// 安全
const encryptedData = encrypt(sensitiveData, key);
localStorage.setItem('data', encryptedData);
```

**建议**：加密静态和传输中的敏感数据。

### 弱加密

检测弱加密实现。

**漏洞 ID**：`weak-cryptography`
**严重性**：高
**CWE**：CWE-327

**检测模式**：
```javascript
// 易受攻击
const hash = md5(password);

// 安全
const hash = await bcrypt.hash(password, 10);
```

**建议**：使用强加密算法（bcrypt、argon2、AES-256）。

## 网络安全

### 缺失 HTTPS

检测不安全的 HTTP 使用。

**漏洞 ID**：`missing-https`
**严重性**：中
**CWE**：CWE-319

**检测模式**：
```javascript
// 易受攻击
fetch('http://api.example.com/data');

// 安全
fetch('https://api.example.com/data');
```

**建议**：始终对所有通信使用 HTTPS。

### 不安全证书

检测不安全的 SSL/TLS 配置。

**漏洞 ID**：`insecure-certificate`
**严重性**：中
**CWE**：CWE-295

**检测模式**：
```javascript
// 易受攻击
const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app);

// 安全
const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  minVersion: 'TLSv1.2',
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384'
}, app);
```

**建议**：使用强 TLS 配置和有效证书。

## 内存和性能

### 内存泄漏

检测内存泄漏漏洞。

**漏洞 ID**：`memory-leak`
**严重性**：中
**CWE**：CWE-401

**检测模式**：
```javascript
// 易受攻击
const cache = new Map();
function addToCache(key, value) {
  cache.set(key, value);
  // 永不删除旧条目
}

// 安全
const cache = new Map();
const MAX_CACHE_SIZE = 1000;
function addToCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}
```

**建议**：实施适当的缓存管理和清理。

### 拒绝服务

检测 DoS 漏洞。

**漏洞 ID**：`denial-of-service`
**严重性**：高
**CWE**：CWE-400

**检测模式**：
```javascript
// 易受攻击
app.post('/api/process', (req, res) => {
  const data = req.body.data;
  const result = heavyComputation(data); // 无超时或限制
  res.json({ result });
});

// 安全
app.post('/api/process', async (req, res) => {
  const data = req.body.data;
  if (data.length > 10000) {
    return res.status(400).send('数据太大');
  }
  const result = await heavyComputationWithTimeout(data, 5000);
  res.json({ result });
});
```

**建议**：实施超时、大小限制和速率限制。

## 业务逻辑

### 权限提升

检测权限提升漏洞。

**漏洞 ID**：`privilege-escalation`
**严重性**：严重
**CWE**：CWE-269

**检测模式**：
```javascript
// 易受攻击
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  user.role = req.body.role; // 任何人都可以更改角色
  res.json(user);
});

// 安全
app.put('/users/:id', requireAdmin, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (req.body.role && !isValidRole(req.body.role)) {
    return res.status(400).send('无效角色');
  }
  user.role = req.body.role;
  res.json(user);
});
```

**建议**：对敏感操作实施适当的授权检查。

### 竞争条件

检测竞争条件漏洞。

**漏洞 ID**：`race-condition`
**严重性**：高
**CWE**：CWE-362

**检测模式**：
```javascript
// 易受攻击
app.post('/transfer', async (req, res) => {
  const fromAccount = await getAccount(req.body.from);
  const toAccount = await getAccount(req.body.to);
  fromAccount.balance -= req.body.amount;
  toAccount.balance += req.body.amount;
  await saveAccount(fromAccount);
  await saveAccount(toAccount);
});

// 安全
app.post('/transfer', async (req, res) => {
  await db.transaction(async (trx) => {
    const fromAccount = await getAccount(req.body.from, trx);
    const toAccount = await getAccount(req.body.to, trx);
    fromAccount.balance -= req.body.amount;
    toAccount.balance += req.body.amount;
    await saveAccount(fromAccount, trx);
    await saveAccount(toAccount, trx);
  });
});
```

**建议**：使用数据库事务和适当的锁定。

## 合规性

### OWASP Top 10 2021

Vue 安全扫描工具提供 OWASP Top 10 2021 的全面覆盖：

1. **A01: 访问控制损坏** - 授权绕过、权限提升
2. **A02: 加密故障** - 缺失加密、弱加密
3. **A03: 注入** - SQL、NoSQL、命令注入
4. **A04: 不安全设计** - 业务逻辑缺陷
5. **A05: 安全配置错误** - CORS、标头、密钥
6. **A06: 易受攻击和过时的组件** - 依赖漏洞
7. **A07: 身份验证失败** - 弱身份验证、会话问题
8. **A08: 软件和数据完整性故障** - 供应链攻击
9. **A09: 安全日志和监控故障** - 缺失日志记录
10. **A10: 服务器端请求伪造（SSRF）** - SSRF 漏洞

### 中国特定标准

符合中国安全标准：

- **GB/T 28448**：信息安全技术 - 信息系统安全等级保护测评要求
- **GB/T 31168**：信息安全技术 - 信息安全管理体系要求
- **GB/T 35273**：信息安全技术 - 个人信息安全规范
- **网络安全法**：中国网络安全法要求
- **数据安全法**：中国数据安全法要求
- **个人信息保护法**：中国个人信息保护法要求

### CWE 映射

所有漏洞都映射到通用弱点枚举（CWE）ID，用于标准化报告。

---

如需更多信息，请参阅：
- [功能指南](./features.md)
- [规则文档](./rules/index.md)
- [合规性指南](./compliance/index.md)
