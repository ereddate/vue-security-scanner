// Weak Encryption 漏洞示例文件

// 示例 1: 使用 DES 加密
export function weakEncryptionExample1() {
  const crypto = require('crypto');
  
  const algorithm = 'des';
  const key = 'secretkey';
  const iv = crypto.randomBytes(8);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// 示例 2: 使用 RC4 加密
export function weakEncryptionExample2() {
  const crypto = require('crypto');
  
  const algorithm = 'rc4';
  const key = 'secretkey';
  
  const cipher = crypto.createCipheriv(algorithm, key, '');
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// 示例 3: 使用弱密钥
export function weakEncryptionExample3() {
  const crypto = require('crypto');
  
  const algorithm = 'aes-256-cbc';
  const key = '1234567890123456';
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// 示例 4: 使用 ECB 模式
export function weakEncryptionExample4() {
  const crypto = require('crypto');
  
  const algorithm = 'aes-256-ecb';
  const key = '12345678901234567890123456789012';
  
  const cipher = crypto.createCipheriv(algorithm, key, '');
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// 示例 5: 缺少 IV
export function weakEncryptionExample5() {
  const crypto = require('crypto');
  
  const algorithm = 'aes-256-cbc';
  const key = '12345678901234567890123456789012';
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// 示例 6: 使用固定 IV
export function weakEncryptionExample6() {
  const crypto = require('crypto');
  
  const algorithm = 'aes-256-cbc';
  const key = '12345678901234567890123456789012';
  const iv = Buffer.from('0123456789012345');
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// 示例 7: 使用 MD5 加密
export function weakEncryptionExample7() {
  const crypto = require('crypto');
  
  const data = 'sensitive data';
  const hash = crypto.createHash('md5').update(data).digest('hex');
  
  return hash;
}

// 示例 8: 使用 SHA1 加密
export function weakEncryptionExample8() {
  const crypto = require('crypto');
  
  const data = 'sensitive data';
  const hash = crypto.createHash('sha1').update(data).digest('hex');
  
  return hash;
}

// 示例 9: 不安全的密钥派生
export function weakEncryptionExample9() {
  const crypto = require('crypto');
  
  const password = 'password123';
  const salt = 'salt';
  
  const key = crypto.pbkdf2Sync(password, salt, 1, 32, 'md5');
  
  return key;
}

// 示例 10: 使用短密钥
export function weakEncryptionExample10() {
  const crypto = require('crypto');
  
  const algorithm = 'aes-128-cbc';
  const key = 'shortkey';
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update('sensitive data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}
