// 弱随机数生成漏洞示例文件

// 示例 1: 使用Math.random()生成密码
export function generateWeakPassword(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// 示例 2: 使用Math.random()生成会话ID
export function generateWeakSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

// 示例 3: 使用Math.random()生成令牌
export function generateWeakToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 示例 4: 使用Math.random()生成API密钥
export function generateWeakApiKey() {
  return 'sk-' + Math.random().toString(36).substring(2, 15);
}

// 示例 5: 使用Math.random()生成验证码
export function generateWeakOTP() {
  return Math.floor(Math.random() * 900000 + 100000).toString();
}

// 示例 6: 使用Math.random()生成CSRF令牌
export function generateWeakCSRFToken() {
  return Math.random().toString(36).substring(2, 15);
}

// 示例 7: 使用Math.random()生成随机盐值
export function generateWeakSalt() {
  return Math.random().toString(36).substring(2, 10);
}

// 示例 8: 使用Math.random()生成随机IV
export function generateWeakIV() {
  const iv = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    iv[i] = Math.floor(Math.random() * 256);
  }
  return iv;
}

// 示例 9: 使用Math.random()生成随机种子
export function generateWeakSeed() {
  return Math.floor(Math.random() * 4294967296);
}

// 示例 10: 使用Math.random()生成随机数用于加密
export function generateWeakEncryptionKey() {
  const key = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key[i] = Math.floor(Math.random() * 256);
  }
  return key;
}

// 示例 11: 使用Date.now()作为随机种子
export function generateWeakRandomWithDate() {
  const seed = Date.now();
  return (seed * 9301 + 49297) % 233280 / 233280;
}

// 示例 12: 使用时间戳生成随机数
export function generateWeakRandomWithTimestamp() {
  return Math.floor(Date.now() / 1000) % 1000000;
}

// 示例 13: 使用进程ID生成随机数
export function generateWeakRandomWithPid() {
  const pid = process.pid;
  return (pid * 9301 + 49297) % 233280 / 233280;
}

// 示例 14: 使用简单的线性同余生成器
export function generateWeakRandomLCG() {
  let seed = 12345;
  return function() {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

// 示例 15: 使用XOR移位生成器
export function generateWeakRandomXorShift() {
  let seed = 123456789;
  return function() {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return seed / 4294967296;
  };
}

// 示例 16: Vue组件中的弱随机数
export default {
  name: 'WeakRandomComponent',
  methods: {
    generatePassword() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
    
    generateSessionId() {
      return Math.random().toString(36).substring(2, 15);
    },
    
    generateToken() {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },
    
    generateOTP() {
      return Math.floor(Math.random() * 900000 + 100000).toString();
    }
  },
  
  mounted() {
    const password = this.generatePassword();
    const sessionId = this.generateSessionId();
    const token = this.generateToken();
    const otp = this.generateOTP();
    
    console.log('Password:', password);
    console.log('Session ID:', sessionId);
    console.log('Token:', token);
    console.log('OTP:', otp);
  }
};

// 示例 17: 使用Math.random()生成UUID
export function generateWeakUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 示例 18: 使用Math.random()生成哈希
export function generateWeakHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// 示例 19: 使用Math.random()生成随机字符串
export function generateWeakRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 示例 20: 使用Math.random()生成随机数组
export function generateWeakRandomArray(length, min, max) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return array;
}

// 示例 21: 使用Math.random()生成随机选择
export function weakRandomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 示例 22: 使用Math.random()生成随机洗牌
export function weakShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 示例 23: 使用Math.random()生成随机布尔值
export function weakRandomBoolean() {
  return Math.random() < 0.5;
}

// 示例 24: 使用Math.random()生成随机颜色
export function weakRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// 示例 25: 使用Math.random()生成随机坐标
export function weakRandomCoordinate(min, max) {
  return {
    x: Math.random() * (max - min) + min,
    y: Math.random() * (max - min) + min
  };
}
