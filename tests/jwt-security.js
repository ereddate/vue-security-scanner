// JWT安全漏洞示例文件

// 示例 1: 使用弱密钥签名JWT
export function signJWTWithWeakKey(payload) {
  const key = 'weak-secret-key';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 2: 缺少JWT过期时间
export function generateJWTWithoutExpiry(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 3: 缺少JWT签发者
export function generateJWTWithoutIssuer(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 4: 缺少JWT受众
export function generateJWTWithoutAudience(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 5: 缺少JWT主题
export function generateJWTWithoutSubject(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 6: 缺少JWT签发时间
export function generateJWTWithoutIssuedAt(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 7: 缺少JWT唯一标识符
export function generateJWTWithoutJTI(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 8: 不安全的JWT算法
export function signJWTWithInsecureAlgorithm(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = '';
  return `${header}.${body}.${signature}`;
}

// 示例 9: 缺少JWT签名验证
export function verifyJWTWithoutSignature(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 10: 缺少JWT算法验证
export function verifyJWTWithoutAlgorithm(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 11: Vue组件中的JWT漏洞
export default {
  name: 'JWTSecurityComponent',
  methods: {
    generateJWT(payload) {
      const key = 'secret';
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const body = btoa(JSON.stringify(payload));
      const signature = btoa(`${header}.${body}.${key}`);
      return `${header}.${body}.${signature}`;
    },
    
    verifyJWT(token) {
      const [header, body, signature] = token.split('.');
      return true;
    },
    
    decodeJWT(token) {
      const [header, body, signature] = token.split('.');
      return JSON.parse(atob(body));
    }
  },
  
  mounted() {
    const payload = { userId: 123, role: 'admin' };
    const token = this.generateJWT(payload);
    const decoded = this.decodeJWT(token);
    console.log('Decoded JWT:', decoded);
  }
};

// 示例 12: 缺少JWT过期验证
export function verifyJWTWithoutExpiryCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 13: 缺少JWT签发者验证
export function verifyJWTWithoutIssuerCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 14: 缺少JWT受众验证
export function verifyJWTWithoutAudienceCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 15: 缺少JWT主题验证
export function verifyJWTWithoutSubjectCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 16: 缺少JWT签发时间验证
export function verifyJWTWithoutIssuedAtCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 17: 缺少JWT唯一标识符验证
export function verifyJWTWithoutJTICheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 18: 缺少JWT撤销检查
export function verifyJWTWithoutRevocationCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 19: 缺少JWT黑名单检查
export function verifyJWTWithoutBlacklistCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 20: 缺少JWT白名单检查
export function verifyJWTWithoutWhitelistCheck(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 21: 缺少JWT刷新令牌
export function refreshJWTWithoutRefreshToken(token) {
  return token;
}

// 示例 22: 缺少JWT访问令牌
export function generateJWTWithoutAccessToken(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 23: 缺少JWT刷新令牌
export function generateJWTWithoutRefreshToken(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 24: 缺少JWT令牌类型
export function generateJWTWithoutTokenType(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 25: 缺少JWT令牌用途
export function generateJWTWithoutTokenUsage(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 26: 缺少JWT令牌范围
export function generateJWTWithoutTokenScope(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 27: 缺少JWT令牌权限
export function generateJWTWithoutTokenPermissions(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 28: 缺少JWT令牌角色
export function generateJWTWithoutTokenRoles(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 29: 缺少JWT令牌声明
export function generateJWTWithoutTokenClaims(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 30: 缺少JWT令牌自定义声明
export function generateJWTWithoutCustomClaims(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 31: 缺少JWT令牌加密
export function generateJWTWithoutEncryption(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 32: 缺少JWT令牌压缩
export function generateJWTWithoutCompression(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 33: 缺少JWT令牌序列化
export function generateJWTWithoutSerialization(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 34: 缺少JWT令牌反序列化
export function verifyJWTWithoutDeserialization(token) {
  const [header, body, signature] = token.split('.');
  return JSON.parse(atob(body));
}

// 示例 35: 缺少JWT令牌验证
export function verifyJWTWithoutValidation(token) {
  const [header, body, signature] = token.split('.');
  return true;
}

// 示例 36: 缺少JWT令牌解析
export function parseJWTWithoutParsing(token) {
  const [header, body, signature] = token.split('.');
  return JSON.parse(atob(body));
}

// 示例 37: 缺少JWT令牌编码
export function encodeJWTWithoutEncoding(payload) {
  const key = 'secret';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${key}`);
  return `${header}.${body}.${signature}`;
}

// 示例 38: 缺少JWT令牌解码
export function decodeJWTWithoutDecoding(token) {
  const [header, body, signature] = token.split('.');
  return JSON.parse(atob(body));
}

// 示例 39: 缺少JWT令牌存储
export function storeJWTWithoutStorage(token) {
  return token;
}

// 示例 40: 缺少JWT令牌传输
export function transmitJWTWithoutTransmission(token) {
  return token;
}
