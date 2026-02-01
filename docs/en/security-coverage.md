# Vue Security Scanner Security Coverage Guide

This comprehensive guide details all security vulnerabilities and issues that Vue Security Scanner can detect.

## Table of Contents

- [Overview](#overview)
- [Vulnerability Categories](#vulnerability-categories)
- [XSS Vulnerabilities](#xss-vulnerabilities)
- [Injection Attacks](#injection-attacks)
- [Authentication & Authorization](#authentication--authorization)
- [Session Management](#session-management)
- [Input Validation](#input-validation)
- [Configuration Security](#configuration-security)
- [Dependency Security](#dependency-security)
- [API Security](#api-security)
- [Data Protection](#data-protection)
- [Network Security](#network-security)
- [Memory & Performance](#memory--performance)
- [Business Logic](#business-logic)
- [Compliance](#compliance)

## Overview

Vue Security Scanner provides comprehensive security coverage for Vue.js applications, detecting vulnerabilities across multiple categories:

- **100+ Security Rules**: Extensive rule set covering common and advanced vulnerabilities
- **Vue-Specific Detection**: Specialized rules for Vue 2/3, Nuxt.js, uni-app, Taro
- **China-Specific Standards**: Compliance with Chinese security standards
- **OWASP Top 10**: Full coverage of OWASP 2021 Top 10
- **CWE Mapping**: Common Weakness Enumeration references
- **Framework Support**: Element Plus, Ant Design Vue, and more

## Vulnerability Categories

### 1. Cross-Site Scripting (XSS)
- Stored XSS
- Reflected XSS
- DOM-based XSS
- Template injection
- v-html XSS
- v-bind XSS

### 2. Injection Attacks
- SQL Injection
- NoSQL Injection
- Command Injection
- LDAP Injection
- GraphQL Injection
- XPath Injection

### 3. Authentication & Authorization
- Weak authentication
- Authorization bypass
- Session fixation
- JWT vulnerabilities
- OAuth flow vulnerabilities

### 4. Input Validation
- Missing validation
- Type confusion
- Buffer overflow
- Integer overflow

### 5. Configuration Security
- Hardcoded secrets
- CORS misconfiguration
- Missing security headers
- Insecure settings

### 6. Dependency Security
- Known vulnerabilities
- Outdated packages
- License issues
- Supply chain attacks

### 7. API Security
- Broken authentication
- Improper rate limiting
- Sensitive data exposure
- API key leakage

### 8. Data Protection
- Missing encryption
- Weak cryptography
- Data leakage
- Privacy violations

### 9. Network Security
- Missing HTTPS
- Insecure protocols
- Man-in-the-middle attacks
- DNS rebinding

### 10. Memory & Performance
- Memory leaks
- Denial of service
- Resource exhaustion
- Inefficient algorithms

### 11. Business Logic
- Privilege escalation
- Race conditions
- Logic flaws
- Parameter tampering

## XSS Vulnerabilities

### v-html XSS

Detects unsafe usage of `v-html` directive.

**Vulnerability ID**: `vue:xss-v-html`
**Severity**: High
**CWE**: CWE-79

**Detection Patterns**:
```vue
<!-- Vulnerable -->
<div v-html="userInput"></div>
<div v-html="userContent"></div>

<!-- Secure -->
<div>{{ sanitizedInput }}</div>
<div v-text="sanitizedInput"></div>
```

**Recommendation**: Use `v-text` or properly sanitize input before using `v-html`.

### v-bind XSS

Detects unsafe attribute binding.

**Vulnerability ID**: `vue:xss-v-bind`
**Severity**: High
**CWE**: CWE-79

**Detection Patterns**:
```vue
<!-- Vulnerable -->
<a v-bind:href="userUrl">Click</a>
<img v-bind:src="userImage">

<!-- Secure -->
<a :href="safeUrl">Click</a>
<img :src="safeImage">
```

**Recommendation**: Validate and sanitize URLs before binding.

### Inline Event Handler XSS

Detects dangerous inline event handlers.

**Vulnerability ID**: `vue:xss-inline-handler`
**Severity**: High
**CWE**: CWE-79

**Detection Patterns**:
```vue
<!-- Vulnerable -->
<button @click="eval(userInput)">Click</button>
<div @mouseover="userFunction">Hover</div>

<!-- Secure -->
<button @click="safeFunction">Click</button>
<div @mouseover="safeHandler">Hover</div>
```

**Recommendation**: Avoid using `eval` or user input in event handlers.

### Template Injection

Detects template injection vulnerabilities.

**Vulnerability ID**: `vue:template-injection`
**Severity**: Critical
**CWE**: CWE-94

**Detection Patterns**:
```javascript
// Vulnerable
const template = userTemplate;
const compiled = Vue.compile(template);

// Secure
const template = '<div>{{ content }}</div>';
const compiled = Vue.compile(template);
```

**Recommendation**: Never compile user-provided templates.

## Injection Attacks

### SQL Injection

Detects SQL injection vulnerabilities.

**Vulnerability ID**: `sql-injection`
**Severity**: Critical
**CWE**: CWE-89

**Detection Patterns**:
```javascript
// Vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);

// Secure
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

**Recommendation**: Use parameterized queries or prepared statements.

### NoSQL Injection

Detects NoSQL injection vulnerabilities.

**Vulnerability ID**: `nosql-injection`
**Severity**: Critical
**CWE**: CWE-943

**Detection Patterns**:
```javascript
// Vulnerable
const query = { $where: `this.username == '${username}'` };
db.find(query);

// Secure
const query = { username: username };
db.find(query);
```

**Recommendation**: Use proper query builders and avoid `$where` operators.

### Command Injection

Detects command injection vulnerabilities.

**Vulnerability ID**: `command-injection`
**Severity**: Critical
**CWE**: CWE-78

**Detection Patterns**:
```javascript
// Vulnerable
const { exec } = require('child_process');
exec(`ls ${userPath}`);

// Secure
const { exec } = require('child_process');
exec('ls', [sanitizedPath]);
```

**Recommendation**: Use parameterized execution or proper escaping.

### LDAP Injection

Detects LDAP injection vulnerabilities.

**Vulnerability ID**: `ldap-injection`
**Severity**: High
**CWE**: CWE-90

**Detection Patterns**:
```javascript
// Vulnerable
const filter = `(uid=${username})`;
ldap.search(filter);

// Secure
const filter = ldap.escapeFilter(username);
ldap.search(`(uid=${filter})`);
```

**Recommendation**: Use LDAP escape functions and proper filtering.

### GraphQL Injection

Detects GraphQL injection vulnerabilities.

**Vulnerability ID**: `graphql-injection`
**Severity**: High
**CWE**: CWE-943

**Detection Patterns**:
```javascript
// Vulnerable
const query = `{ user(id: "${userId}") { name } }`;
graphql(query);

// Secure
const query = 'query($id: ID!) { user(id: $id) { name } }';
graphql(query, { variables: { id: userId } });
```

**Recommendation**: Use parameterized GraphQL queries.

## Authentication & Authorization

### Weak Authentication

Detects weak authentication mechanisms.

**Vulnerability ID**: `authentication-weak`
**Severity**: High
**CWE**: CWE-287

**Detection Patterns**:
```javascript
// Vulnerable
function authenticate(username, password) {
  return users.find(u => u.username === username && u.password === password);
}

// Secure
function authenticate(username, password) {
  const user = users.find(u => u.username === username);
  return user && bcrypt.compare(password, user.passwordHash);
}
```

**Recommendation**: Use strong password hashing (bcrypt, argon2).

### Authorization Bypass

Detects authorization bypass vulnerabilities.

**Vulnerability ID**: `authorization-bypass`
**Severity**: Critical
**CWE**: CWE-285

**Detection Patterns**:
```javascript
// Vulnerable
app.get('/admin', (req, res) => {
  res.send('Admin panel');
});

// Secure
app.get('/admin', requireAdmin, (req, res) => {
  res.send('Admin panel');
});
```

**Recommendation**: Implement proper authorization checks on all protected routes.

### JWT Vulnerabilities

Detects JWT security issues.

**Vulnerability ID**: `jwt-vulnerability`
**Severity**: High
**CWE**: CWE-347

**Detection Patterns**:
```javascript
// Vulnerable - None algorithm
const token = jwt.sign({ data: 'payload' }, 'secret', { algorithm: 'none' });

// Secure
const token = jwt.sign({ data: 'payload' }, 'secret', { algorithm: 'HS256' });
```

**Recommendation**: Use strong algorithms and validate JWT properly.

### OAuth Flow Vulnerabilities

Detects OAuth implementation issues.

**Vulnerability ID**: `oauth-vulnerability`
**Severity**: High
**CWE**: CWE-287

**Detection Patterns**:
```javascript
// Vulnerable - Missing state parameter
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const token = await exchangeCodeForToken(code);
});

// Secure
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state');
  }
  const token = await exchangeCodeForToken(code);
});
```

**Recommendation**: Use state parameter and validate redirect URIs.

## Session Management

### Session Fixation

Detects session fixation vulnerabilities.

**Vulnerability ID**: `session-fixation`
**Severity**: High
**CWE**: CWE-384

**Detection Patterns**:
```javascript
// Vulnerable
app.post('/login', (req, res) => {
  req.session.userId = userId;
  res.send('Logged in');
});

// Secure
app.post('/login', (req, res) => {
  req.session.regenerate(() => {
    req.session.userId = userId;
    res.send('Logged in');
  });
});
```

**Recommendation**: Regenerate session ID after authentication.

### Session Timeout

Detects missing session timeout.

**Vulnerability ID**: `session-timeout-missing`
**Severity**: Medium
**CWE**: CWE-613

**Detection Patterns**:
```javascript
// Vulnerable
app.use(session({
  secret: 'secret'
}));

// Secure
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 3600000 }, // 1 hour
  resave: false,
  saveUninitialized: false
}));
```

**Recommendation**: Implement session timeout and secure cookie settings.

## Input Validation

### Missing Validation

Detects missing input validation.

**Vulnerability ID**: `input-validation-missing`
**Severity**: High
**CWE**: CWE-20

**Detection Patterns**:
```vue
<!-- Vulnerable -->
<input v-model="userInput" />
<button @click="submit(userInput)">Submit</button>

<!-- Secure -->
<input v-model="userInput" @input="validate" />
<button @click="submit(userInput)" :disabled="!isValid">Submit</button>
```

**Recommendation**: Implement client-side and server-side validation.

### Type Confusion

Detects type confusion vulnerabilities.

**Vulnerability ID**: `type-confusion`
**Severity**: Medium
**CWE**: CWE-843

**Detection Patterns**:
```javascript
// Vulnerable
function processInput(input) {
  if (input === 'true') {
    return true;
  }
  return input;
}

// Secure
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

**Recommendation**: Validate input types before processing.

## Configuration Security

### Hardcoded Secrets

Detects hardcoded secrets in code.

**Vulnerability ID**: `hardcoded-secret`
**Severity**: Critical
**CWE**: CWE-798

**Detection Patterns**:
```javascript
// Vulnerable
const apiKey = 'sk-1234567890abcdef';
const dbPassword = 'password123';

// Secure
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;
```

**Recommendation**: Use environment variables or secret management services.

### CORS Misconfiguration

Detects insecure CORS configuration.

**Vulnerability ID**: `cors-misconfiguration`
**Severity**: Medium
**CWE**: CWE-942

**Detection Patterns**:
```javascript
// Vulnerable
app.use(cors({ origin: '*' }));

// Secure
app.use(cors({
  origin: ['https://example.com'],
  credentials: true
}));
```

**Recommendation**: Restrict CORS to trusted origins.

### Missing Security Headers

Detects missing security headers.

**Vulnerability ID**: `missing-security-headers`
**Severity**: Medium
**CWE**: CWE-693

**Detection Patterns**:
```javascript
// Vulnerable
app.use((req, res, next) => {
  res.send('Hello');
});

// Secure
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

**Recommendation**: Implement all recommended security headers.

## Dependency Security

### Known Vulnerabilities

Detects dependencies with known CVEs.

**Vulnerability ID**: `dependency-vulnerability`
**Severity**: Varies
**CWE**: CWE-1104

**Detection Patterns**:
```json
// Vulnerable
{
  "dependencies": {
    "lodash": "4.17.15",
    "axios": "0.19.0"
  }
}

// Secure
{
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^1.0.0"
  }
}
```

**Recommendation**: Keep dependencies updated and use `npm audit`.

### Outdated Packages

Detects outdated dependencies.

**Vulnerability ID**: `outdated-dependency`
**Severity**: Low
**CWE**: CWE-1104

**Detection Patterns**:
```json
// Vulnerable
{
  "dependencies": {
    "vue": "2.6.0"
  }
}

// Secure
{
  "dependencies": {
    "vue": "^3.0.0"
  }
}
```

**Recommendation**: Regularly update dependencies to latest versions.

## API Security

### API Key Leakage

Detects API key exposure in code.

**Vulnerability ID**: `api-key-leakage`
**Severity**: High
**CWE**: CWE-798

**Detection Patterns**:
```javascript
// Vulnerable
const apiKey = 'AIzaSyBdVl-cTcSwYa9Y8fkpBdFg';
fetch(`https://api.example.com?key=${apiKey}`);

// Secure
const apiKey = process.env.API_KEY;
fetch('https://api.example.com', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

**Recommendation**: Use environment variables and never expose API keys in client-side code.

### Improper Rate Limiting

Detects missing rate limiting.

**Vulnerability ID**: `missing-rate-limiting`
**Severity**: Medium
**CWE**: CWE-770

**Detection Patterns**:
```javascript
// Vulnerable
app.post('/api/data', (req, res) => {
  res.json({ data: 'sensitive' });
});

// Secure
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.post('/api/data', limiter, (req, res) => {
  res.json({ data: 'sensitive' });
});
```

**Recommendation**: Implement rate limiting on all public APIs.

## Data Protection

### Missing Encryption

Detects missing encryption for sensitive data.

**Vulnerability ID**: `missing-encryption`
**Severity**: High
**CWE**: CWE-311

**Detection Patterns**:
```javascript
// Vulnerable
const sensitiveData = 'credit-card-number';
localStorage.setItem('data', sensitiveData);

// Secure
const encryptedData = encrypt(sensitiveData, key);
localStorage.setItem('data', encryptedData);
```

**Recommendation**: Encrypt sensitive data at rest and in transit.

### Weak Cryptography

Detects weak cryptographic implementations.

**Vulnerability ID**: `weak-cryptography`
**Severity**: High
**CWE**: CWE-327

**Detection Patterns**:
```javascript
// Vulnerable
const hash = md5(password);

// Secure
const hash = await bcrypt.hash(password, 10);
```

**Recommendation**: Use strong cryptographic algorithms (bcrypt, argon2, AES-256).

## Network Security

### Missing HTTPS

Detects insecure HTTP usage.

**Vulnerability ID**: `missing-https`
**Severity**: Medium
**CWE**: CWE-319

**Detection Patterns**:
```javascript
// Vulnerable
fetch('http://api.example.com/data');

// Secure
fetch('https://api.example.com/data');
```

**Recommendation**: Always use HTTPS for all communications.

### Insecure Certificate

Detects insecure SSL/TLS configuration.

**Vulnerability ID**: `insecure-certificate`
**Severity**: Medium
**CWE**: CWE-295

**Detection Patterns**:
```javascript
// Vulnerable
const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app);

// Secure
const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  minVersion: 'TLSv1.2',
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384'
}, app);
```

**Recommendation**: Use strong TLS configuration and valid certificates.

## Memory & Performance

### Memory Leaks

Detects memory leak vulnerabilities.

**Vulnerability ID**: `memory-leak`
**Severity**: Medium
**CWE**: CWE-401

**Detection Patterns**:
```javascript
// Vulnerable
const cache = new Map();
function addToCache(key, value) {
  cache.set(key, value);
  // Never removes old entries
}

// Secure
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

**Recommendation**: Implement proper cache management and cleanup.

### Denial of Service

Detects DoS vulnerabilities.

**Vulnerability ID**: `denial-of-service`
**Severity**: High
**CWE**: CWE-400

**Detection Patterns**:
```javascript
// Vulnerable
app.post('/api/process', (req, res) => {
  const data = req.body.data;
  const result = heavyComputation(data); // No timeout or limits
  res.json({ result });
});

// Secure
app.post('/api/process', async (req, res) => {
  const data = req.body.data;
  if (data.length > 10000) {
    return res.status(400).send('Data too large');
  }
  const result = await heavyComputationWithTimeout(data, 5000);
  res.json({ result });
});
```

**Recommendation**: Implement timeouts, size limits, and rate limiting.

## Business Logic

### Privilege Escalation

Detects privilege escalation vulnerabilities.

**Vulnerability ID**: `privilege-escalation`
**Severity**: Critical
**CWE**: CWE-269

**Detection Patterns**:
```javascript
// Vulnerable
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  user.role = req.body.role; // Anyone can change role
  res.json(user);
});

// Secure
app.put('/users/:id', requireAdmin, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (req.body.role && !isValidRole(req.body.role)) {
    return res.status(400).send('Invalid role');
  }
  user.role = req.body.role;
  res.json(user);
});
```

**Recommendation**: Implement proper authorization checks for sensitive operations.

### Race Conditions

Detects race condition vulnerabilities.

**Vulnerability ID**: `race-condition`
**Severity**: High
**CWE**: CWE-362

**Detection Patterns**:
```javascript
// Vulnerable
app.post('/transfer', async (req, res) => {
  const fromAccount = await getAccount(req.body.from);
  const toAccount = await getAccount(req.body.to);
  fromAccount.balance -= req.body.amount;
  toAccount.balance += req.body.amount;
  await saveAccount(fromAccount);
  await saveAccount(toAccount);
});

// Secure
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

**Recommendation**: Use database transactions and proper locking.

## Compliance

### OWASP Top 10 2021

Vue Security Scanner provides full coverage of OWASP Top 10 2021:

1. **A01: Broken Access Control** - Authorization bypass, privilege escalation
2. **A02: Cryptographic Failures** - Missing encryption, weak cryptography
3. **A03: Injection** - SQL, NoSQL, command injection
4. **A04: Insecure Design** - Business logic flaws
5. **A05: Security Misconfiguration** - CORS, headers, secrets
6. **A06: Vulnerable Components** - Dependency vulnerabilities
7. **A07: Authentication Failures** - Weak authentication, session issues
8. **A08: Software and Data Integrity Failures** - Supply chain attacks
9. **A09: Security Logging Failures** - Missing logging
10. **A10: Server-Side Request Forgery (SSRF)** - SSRF vulnerabilities

### China-Specific Standards

Compliance with Chinese security standards:

- **GB/T 28448**: Information security technology - Information system security level protection evaluation requirement
- **GB/T 31168**: Information security technology - Information security management system requirements
- **GB/T 35273**: Information security technology - Personal information security specification
- **Cybersecurity Law**: China's Cybersecurity Law requirements
- **Data Security Law**: China's Data Security Law requirements
- **Personal Information Protection Law**: China's PIPL requirements

### CWE Mapping

All vulnerabilities are mapped to Common Weakness Enumeration (CWE) IDs for standardized reporting.

---

For more information, see:
- [Features Guide](./features.md)
- [Rules Documentation](./rules/index.md)
- [Compliance Guide](./compliance/index.md)
