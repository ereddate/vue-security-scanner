// HTTP Response Splitting 漏洞示例文件

import express from 'express';

// 示例 1: 直接将用户输入写入 HTTP 响应头
export function httpResponseSplittingExample1(userInput) {
  const app = express();
  app.get('/vulnerable', (req, res) => {
    // 危险：用户输入直接用于响应头
    res.setHeader('X-Custom-Header', userInput);
    res.send('Response body');
  });
  return app;
}

// 示例 2: 不安全的重定向，用户输入影响 Location 头
export function httpResponseSplittingExample2(redirectUrl) {
  const app = express();
  app.get('/redirect', (req, res) => {
    // 危险：用户输入直接影响重定向位置
    res.redirect(redirectUrl);
  });
  return app;
}

// 示例 3: 使用用户输入设置 Cookie
export function httpResponseSplittingExample3(cookieValue) {
  const app = express();
  app.get('/set-cookie', (req, res) => {
    // 危险：Cookie 值来自用户输入
    res.cookie('userPref', cookieValue, { secure: true });
    res.send('Cookie set');
  });
  return app;
}

// 示例 4: 用户输入影响 Set-Cookie 头
export function httpResponseSplittingExample4(cookieName, cookieData) {
  const app = express();
  app.get('/dynamic-cookie', (req, res) => {
    // 危险：Cookie 名称和数据都来自用户输入
    res.set('Set-Cookie', `${cookieName}=${cookieData}; HttpOnly; Secure`);
    res.send('Dynamic cookie set');
  });
  return app;
}

// 示例 5: 不安全的 Cache-Control 设置
export function httpResponseSplittingExample5(cacheDirective) {
  const app = express();
  app.get('/cache-control', (req, res) => {
    // 危险：缓存指令来自用户输入
    res.set('Cache-Control', cacheDirective);
    res.send('Cached response');
  });
  return app;
}

// 示例 6: 用户输入影响 Content-Type 头
export function httpResponseSplittingExample6(contentType) {
  const app = express();
  app.get('/content-type', (req, res) => {
    // 危险：内容类型来自用户输入
    res.set('Content-Type', contentType);
    res.send('Content with dynamic type');
  });
  return app;
}

// 示例 7: 不安全的响应头拼接
export function httpResponseSplittingExample7(headerName, headerValue) {
  const app = express();
  app.get('/custom-header', (req, res) => {
    // 危险：头名称和值都来自用户输入
    res.set(headerName, headerValue);
    res.send('Response with custom header');
  });
  return app;
}

// 示例 8: 用户输入影响 WWW-Authenticate 头
export function httpResponseSplittingExample8(authRealm) {
  const app = express();
  app.get('/auth-required', (req, res) => {
    // 危险：认证领域来自用户输入
    res.set('WWW-Authenticate', `Basic realm="${authRealm}"`);
    res.status(401).send('Authentication required');
  });
  return app;
}

// 示例 9: 不安全的 Vary 头设置
export function httpResponseSplittingExample9(varyFields) {
  const app = express();
  app.get('/vary', (req, res) => {
    // 危险：Vary 字段来自用户输入
    res.set('Vary', varyFields);
    res.send('Response with vary header');
  });
  return app;
}

// 示例 10: 用户输入影响 Access-Control-Allow-Origin 头
export function httpResponseSplittingExample10(origin) {
  const app = express();
  app.get('/cors', (req, res) => {
    // 危险：CORS 源来自用户输入
    res.set('Access-Control-Allow-Origin', origin);
    res.send('CORS enabled response');
  });
  return app;
}

// 示例 11: 不安全的响应头设置，可能导致 CRLF 注入
export function httpResponseSplittingExample11(userAgentLike) {
  const app = express();
  app.get('/user-agent-like', (req, res) => {
    // 危险：可能包含换行符的用户输入用于响应头
    res.set('X-Processed-By', userAgentLike);
    res.send('Processed response');
  });
  return app;
}

// 示例 12: 用户输入影响 Content-Disposition 头
export function httpResponseSplittingExample12(dispositionValue) {
  const app = express();
  app.get('/download', (req, res) => {
    // 危险：处置值来自用户输入
    res.set('Content-Disposition', dispositionValue);
    res.send('Download ready');
  });
  return app;
}

// 示例 13: 不安全的 Expires 头设置
export function httpResponseSplittingExample13(expiryDate) {
  const app = express();
  app.get('/expires', (req, res) => {
    // 危险：过期日期来自用户输入
    res.set('Expires', expiryDate);
    res.send('Expiring response');
  });
  return app;
}

// 示例 14: 用户输入影响 Pragma 头
export function httpResponseSplittingExample14(pragmaValue) {
  const app = express();
  app.get('/pragma', (req, res) => {
    // 危险：Pragma 值来自用户输入
    res.set('Pragma', pragmaValue);
    res.send('Pragma controlled response');
  });
  return app;
}

// 示例 15: 不安全的响应头批量设置
export function httpResponseSplittingExample15(headerObj) {
  const app = express();
  app.get('/batch-headers', (req, res) => {
    // 危险：头对象来自用户输入
    res.set(headerObj);
    res.send('Response with batch headers');
  });
  return app;
}

// 示例 16: 用户输入影响多个响应头
export function httpResponseSplittingExample16(customHeaders) {
  const app = express();
  app.get('/multi-headers', (req, res) => {
    // 危险：多个头值来自用户输入
    for (const [header, value] of Object.entries(customHeaders)) {
      res.set(header, value);
    }
    res.send('Multi-header response');
  });
  return app;
}

// 示例 17: 不安全的响应状态文本设置
export function httpResponseSplittingExample17(statusText) {
  const app = express();
  app.get('/custom-status', (req, res) => {
    // 危险：状态文本来自用户输入
    res.statusMessage = statusText;
    res.status(200).send('Custom status response');
  });
  return app;
}

// 示例 18: 用户输入影响 Server 头
export function httpResponseSplittingExample18(serverInfo) {
  const app = express();
  app.get('/server-info', (req, res) => {
    // 危险：服务器信息来自用户输入
    res.set('Server', serverInfo);
    res.send('Server identified response');
  });
  return app;
}

// 示例 19: 不安全的响应头链式设置
export function httpResponseSplittingExample19(headerChain) {
  const app = express();
  app.get('/chain-headers', (req, res) => {
    // 危险：头链来自用户输入
    let chainRes = res;
    for (const [header, value] of Object.entries(headerChain)) {
      chainRes = chainRes.set(header, value);
    }
    chainRes.send('Chained headers response');
  });
  return app;
}

// 示例 20: 复杂的用户输入驱动响应头设置
export function httpResponseSplittingExample20(responseConfig) {
  const app = express();
  app.get('/complex-response', (req, res) => {
    // 危险：整个响应配置来自用户输入
    if (responseConfig.headers) {
      res.set(responseConfig.headers);
    }
    if (responseConfig.statusCode) {
      res.status(responseConfig.statusCode);
    }
    res.send(responseConfig.body || 'Complex response');
  });
  return app;
}
