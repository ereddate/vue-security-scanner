// Insecure Hash 漏洞示例文件

// 示例 1: 使用 MD5 哈希密码
export function insecureHashExample1() {
  const crypto = require('crypto');
  
  function hashPassword(password) {
    // 危险：使用 MD5 哈希密码
    return crypto.createHash('md5').update(password).digest('hex');
  }
  
  return hashPassword('password123');
}

// 示例 2: 使用 SHA1 哈希密码
export function insecureHashExample2() {
  const crypto = require('crypto');
  
  function hashPassword(password) {
    // 危险：使用 SHA1 哈希密码
    return crypto.createHash('sha1').update(password).digest('hex');
  }
  
  return hashPassword('password123');
}

// 示例 3: 不加盐哈希
export function insecureHashExample3() {
  const crypto = require('crypto');
  
  function hashPassword(password) {
    // 危险：不加盐哈希
    return crypto.createHash('sha256').update(password).digest('hex');
  }
  
  return hashPassword('password123');
}

// 示例 4: 使用固定盐
export function insecureHashExample4() {
  const crypto = require('crypto');
  
  function hashPassword(password) {
    const salt = 'fixed-salt';
    // 危险：使用固定盐
    return crypto.createHash('sha256').update(password + salt).digest('hex');
  }
  
  return hashPassword('password123');
}

// 示例 5: 使用快速哈希算法
export function insecureHashExample5() {
  const crypto = require('crypto');
  
  function hashPassword(password) {
    // 危险：使用快速哈希算法
    return crypto.createHash('sha256').update(password).digest('hex');
  }
  
  return hashPassword('password123');
}

// 示例 6: 迭代次数不足
export function insecureHashExample6() {
  const crypto = require('crypto');
  
  function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    let hash = password + salt;
    
    // 危险：迭代次数不足
    for (let i = 0; i < 1; i++) {
      hash = crypto.createHash('sha256').update(hash).digest('hex');
    }
    
    return hash;
  }
  
  return hashPassword('password123');
}

// 示例 7: 使用 MD5 验证文件完整性
export function insecureHashExample7() {
  const crypto = require('crypto');
  const fs = require('fs');
  
  function verifyFile(filePath, expectedHash) {
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5').update(content).digest('hex');
    
    // 危险：使用 MD5 验证文件完整性
    return hash === expectedHash;
  }
  
  return verifyFile;
}

// 示例 8: 使用 SHA1 验证文件完整性
export function insecureHashExample8() {
  const crypto = require('crypto');
  const fs = require('fs');
  
  function verifyFile(filePath, expectedHash) {
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha1').update(content).digest('hex');
    
    // 危险：使用 SHA1 验证文件完整性
    return hash === expectedHash;
  }
  
  return verifyFile;
}

// 示例 9: 使用 MD5 生成 Token
export function insecureHashExample9() {
  const crypto = require('crypto');
  
  function generateToken(userId) {
    const timestamp = Date.now();
    // 危险：使用 MD5 生成 Token
    return crypto.createHash('md5').update(userId + timestamp).digest('hex');
  }
  
  return generateToken('user123');
}

// 示例 10: 使用 SHA1 生成 Token
export function insecureHashExample10() {
  const crypto = require('crypto');
  
  function generateToken(userId) {
    const timestamp = Date.now();
    // 危险：使用 SHA1 生成 Token
    return crypto.createHash('sha1').update(userId + timestamp).digest('hex');
  }
  
  return generateToken('user123');
}
