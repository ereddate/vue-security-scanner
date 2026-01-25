// Host Header Injection 漏洞示例文件

import express from 'express';

// 示例 1: 直接使用 Host 头进行重定向
export function hostHeaderInjectionExample1() {
  const app = express();
  app.get('/redirect-via-host', (req, res) => {
    // 危险：直接使用 Host 头进行重定向
    const host = req.get('Host');
    res.redirect(`https://${host}/dashboard`);
  });
  return app;
}

// 示例 2: 使用 Host 头构建绝对 URL
export function hostHeaderInjectionExample2() {
  const app = express();
  app.get('/generate-url', (req, res) => {
    // 危险：使用 Host 头构建 URL
    const host = req.get('Host');
    const returnUrl = `https://${host}/return`;
    res.send(`Return URL: ${returnUrl}`);
  });
  return app;
}

// 示例 3: Host 头用于密码重置链接
export function hostHeaderInjectionExample3() {
  const app = express();
  app.post('/forgot-password', (req, res) => {
    // 危险：在密码重置邮件中使用 Host 头
    const host = req.get('Host');
    const resetLink = `https://${host}/reset-password?token=abc123`;
    // 发送包含恶意重置链接的邮件
    res.send(`Reset link would be sent: ${resetLink}`);
  });
  return app;
}

// 示例 4: 使用 Host 头进行认证验证
export function hostHeaderInjectionExample4() {
  const app = express();
  app.get('/validate-callback', (req, res) => {
    // 危险：使用 Host 头验证回调 URL
    const host = req.get('Host');
    const callbackUrl = req.query.callback;
    if (callbackUrl && callbackUrl.includes(host)) {
      res.send('Valid callback');
    } else {
      res.status(400).send('Invalid callback');
    }
  });
  return app;
}

// 示例 5: Host 头用于构建确认链接
export function hostHeaderInjectionExample5() {
  const app = express();
  app.post('/register', (req, res) => {
    // 危险：使用 Host 头构建账户确认链接
    const host = req.get('Host');
    const confirmLink = `https://${host}/confirm-account?token=xyz789`;
    res.send(`Confirmation link: ${confirmLink}`);
  });
  return app;
}

// 示例 6: 不安全的 Host 头用于白名单检查
export function hostHeaderInjectionExample6() {
  const app = express();
  app.get('/whitelist-check', (req, res) => {
    // 危险：基于 Host 头的不安全白名单检查
    const host = req.get('Host');
    const allowedHosts = ['trusted-site.com', 'another-trusted.com'];
    if (allowedHosts.some(allowed => host.includes(allowed))) {
      res.send('Access granted');
    } else {
      res.status(403).send('Access denied');
    }
  });
  return app;
}

// 示例 7: Host 头用于构建 OAuth 回调
export function hostHeaderInjectionExample7() {
  const app = express();
  app.get('/oauth-init', (req, res) => {
    // 危险：使用 Host 头构建 OAuth 回调 URL
    const host = req.get('Host');
    const oauthUrl = `https://oauth-provider.com/auth?redirect_uri=https://${host}/oauth-callback`;
    res.redirect(oauthUrl);
  });
  return app;
}

// 示例 8: Host 头用于构建邮件中的链接
export function hostHeaderInjectionExample8() {
  const app = express();
  app.get('/email-template', (req, res) => {
    // 危险：使用 Host 头构建邮件模板中的链接
    const host = req.get('Host');
    const template = `
      <p>Click here to access your account:</p>
      <a href="https://${host}/account">My Account</a>
    `;
    res.send(template);
  });
  return app;
}

// 示例 9: Host 头用于会话固定防护
export function hostHeaderInjectionExample9() {
  const app = express();
  app.use((req, res, next) => {
    // 危险：基于 Host 头的会话固定防护
    const host = req.get('Host');
    if (req.session && req.session.host !== host) {
      req.session.host = host;
    }
    next();
  });
  return app;
}

// 示例 10: Host 头用于构建 API 基础 URL
export function hostHeaderInjectionExample10() {
  const app = express();
  app.get('/api-config', (req, res) => {
    // 危险：使用 Host 头构建 API 基础 URL
    const host = req.get('Host');
    const apiBaseUrl = `https://${host}/api/v1`;
    res.json({ apiBaseUrl });
  });
  return app;
}

// 示例 11: Host 头用于构建信任域验证
export function hostHeaderInjectionExample11() {
  const app = express();
  app.get('/trust-domain', (req, res) => {
    // 危险：使用 Host 头进行信任域验证
    const host = req.get('Host');
    const origin = req.get('Origin');
    if (origin && origin.includes(host)) {
      res.send('Trusted domain');
    } else {
      res.status(400).send('Untrusted domain');
    }
  });
  return app;
}

// 示例 12: Host 头用于构建支付回调 URL
export function hostHeaderInjectionExample12() {
  const app = express();
  app.post('/init-payment', (req, res) => {
    // 危险：使用 Host 头构建支付回调 URL
    const host = req.get('Host');
    const paymentData = {
      amount: req.body.amount,
      callbackUrl: `https://${host}/payment-complete`,
      cancelUrl: `https://${host}/payment-cancel`
    };
    res.json(paymentData);
  });
  return app;
}

// 示例 13: 不安全的 Host 头用于 CORS 验证
export function hostHeaderInjectionExample13() {
  const app = express();
  app.use((req, res, next) => {
    // 危险：基于 Host 头的 CORS 验证
    const host = req.get('Host');
    res.header('Access-Control-Allow-Origin', `https://${host}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  return app;
}

// 示例 14: Host 头用于构建安全令牌 URL
export function hostHeaderInjectionExample14() {
  const app = express();
  app.get('/generate-token-url', (req, res) => {
    // 危险：使用 Host 头构建安全令牌 URL
    const host = req.get('Host');
    const tokenId = req.query.tokenId;
    const tokenUrl = `https://${host}/verify-token?id=${tokenId}`;
    res.send(`Token verification URL: ${tokenUrl}`);
  });
  return app;
}

// 示例 15: Host 头用于构建登出重定向
export function hostHeaderInjectionExample15() {
  const app = express();
  app.get('/logout', (req, res) => {
    // 危险：使用 Host 头构建登出后的重定向 URL
    const host = req.get('Host');
    req.logout(); // 假设使用 passport.js
    res.redirect(`https://${host}/logged-out`);
  });
  return app;
}

// 示例 16: Host 头用于构建动态脚本加载
export function hostHeaderInjectionExample16() {
  const app = express();
  app.get('/dynamic-script', (req, res) => {
    // 危险：使用 Host 头构建动态脚本加载 URL
    const host = req.get('Host');
    const scriptTag = `<script src="https://${host}/dynamic.js"></script>`;
    res.send(scriptTag);
  });
  return app;
}

// 示例 17: Host 头用于构建下载链接
export function hostHeaderInjectionExample17() {
  const app = express();
  app.get('/download-link', (req, res) => {
    // 危险：使用 Host 头构建下载链接
    const host = req.get('Host');
    const fileId = req.query.fileId;
    const downloadUrl = `https://${host}/download/${fileId}`;
    res.json({ downloadUrl });
  });
  return app;
}

// 示例 18: Host 头用于构建 Webhook URL
export function hostHeaderInjectionExample18() {
  const app = express();
  app.post('/setup-webhook', (req, res) => {
    // 危险：使用 Host 头构建 Webhook URL
    const host = req.get('Host');
    const webhookUrl = `https://${host}/webhook/receive`;
    // 在外部服务上注册 webhookUrl
    res.json({ webhookUrl, status: 'registered' });
  });
  return app;
}

// 示例 19: Host 头用于构建通知回调
export function hostHeaderInjectionExample19() {
  const app = express();
  app.get('/notification-setup', (req, res) => {
    // 危险：使用 Host 头构建通知回调 URL
    const host = req.get('Host');
    const notificationCallback = `https://${host}/notifications/callback`;
    res.json({ callback: notificationCallback });
  });
  return app;
}

// 示例 20: 复杂的 Host 头使用场景
export function hostHeaderInjectionExample20() {
  const app = express();
  app.use('/complex-handler', (req, res) => {
    // 危险：多种方式使用 Host 头的复杂场景
    const host = req.get('Host');
    const forwardedHost = req.get('X-Forwarded-Host') || host;
    const effectiveHost = req.get('X-Real-IP') ? req.get('X-Real-IP') : forwardedHost;
    
    // 构建多个基于 Host 的 URL
    const urls = {
      dashboard: `https://${effectiveHost}/dashboard`,
      profile: `https://${effectiveHost}/profile`,
      settings: `https://${effectiveHost}/settings`,
      logout: `https://${effectiveHost}/logout`,
      api: `https://${effectiveHost}/api/v1`
    };
    
    res.json(urls);
  });
  return app;
}
