// Insecure Random 漏洞示例文件

// 示例 1: 使用 Math.random() 生成密钥
export function insecureRandomExample1() {
  const key = Math.random().toString(36).substring(2);
  return key;
}

// 示例 2: 使用 Math.random() 生成 Token
export function insecureRandomExample2() {
  const token = Math.random().toString(36).substring(2) + Date.now();
  return token;
}

// 示例 3: 使用 Math.random() 生成 Session ID
export function insecureRandomExample3() {
  const sessionId = 'session_' + Math.random().toString(36).substring(2);
  return sessionId;
}

// 示例 4: 使用 Math.random() 生成密码
export function insecureRandomExample4() {
  const password = Math.random().toString(36).substring(2, 10);
  return password;
}

// 示例 5: 使用 Math.random() 生成 OTP
export function insecureRandomExample5() {
  const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return otp;
}

// 示例 6: 使用时间戳作为随机数
export function insecureRandomExample6() {
  const random = Date.now();
  return random;
}

// 示例 7: 使用进程 ID 作为随机数
export function insecureRandomExample7() {
  const random = process.pid;
  return random;
}

// 示例 8: 使用线性同余生成器
export function insecureRandomExample8() {
  let seed = 12345;
  const a = 1103515245;
  const c = 12345;
  const m = 2147483648;
  
  seed = (a * seed + c) % m;
  return seed;
}

// 示例 9: 使用伪随机数生成器
export function insecureRandomExample9() {
  function lcg(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  
  const random = lcg(12345);
  return random();
}

// 示例 10: 使用可预测的随机数
export function insecureRandomExample10() {
  const random = Math.floor(Math.random() * 1000);
  return random;
}
