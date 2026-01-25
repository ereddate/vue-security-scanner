// Insecure Certificate 漏洞示例文件

// 示例 1: 使用自签名证书
export function insecureCertificateExample1() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('self-signed.key'),
    cert: fs.readFileSync('self-signed.crt')
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 2: 使用过期证书
export function insecureCertificateExample2() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('expired.key'),
    cert: fs.readFileSync('expired.crt')
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 3: 使用弱证书
export function insecureCertificateExample3() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('weak.key'),
    cert: fs.readFileSync('weak.crt'),
    // 危险：使用弱加密算法
    ciphers: 'RC4:MD5:DES'
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 4: 缺少证书验证
export function insecureCertificateExample4() {
  const https = require('https');
  
  const options = {
    // 危险：不验证证书
    rejectUnauthorized: false
  };
  
  https.get('https://example.com/api/data', options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(data);
    });
  });
}

// 示例 5: 使用通配符证书
export function insecureCertificateExample5() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('wildcard.key'),
    cert: fs.readFileSync('wildcard.crt')
    // 危险：通配符证书可能被滥用
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 6: 缺少证书链
export function insecureCertificateExample6() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
    // 危险：缺少中间证书链
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 7: 使用 SHA-1 证书
export function insecureCertificateExample7() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('sha1.key'),
    cert: fs.readFileSync('sha1.crt')
    // 危险：SHA-1 已不安全
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 8: 证书私钥泄露
export function insecureCertificateExample8() {
  const privateKey = `
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
    -----END PRIVATE KEY-----
  `;
  
  // 危险：私钥硬编码在代码中
  const https = require('https');
  const options = {
    key: privateKey,
    cert: fs.readFileSync('server.crt')
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 9: 证书域名不匹配
export function insecureCertificateExample9() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('wrong-domain.key'),
    cert: fs.readFileSync('wrong-domain.crt')
    // 危险：证书域名与实际域名不匹配
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
}

// 示例 10: 缺少证书更新机制
export function insecureCertificateExample10() {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
    // 危险：没有证书更新机制
  };
  
  const server = https.createServer(options, (req, res) => {
    res.end('Hello World');
  });
  
  server.listen(443);
  
  // 证书过期后继续使用
}
