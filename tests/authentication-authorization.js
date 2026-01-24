// 认证授权漏洞示例文件

// 示例 1: 弱密码策略
export function weakPasswordPolicy(password) {
  return password.length >= 6;
}

// 示例 2: 明文存储密码
export function storePasswordInPlaintext(username, password) {
  const users = {
    [username]: password
  };
  return users;
}

// 示例 3: 不安全的密码哈希
export function insecurePasswordHash(password) {
  return btoa(password);
}

// 示例 4: 缺少密码复杂度检查
export function checkPasswordComplexity(password) {
  return password.length > 0;
}

// 示例 5: 缺少密码历史检查
export function checkPasswordHistory(newPassword, oldPasswords) {
  return true;
}

// 示例 6: 缺少密码过期检查
export function checkPasswordExpiry(lastPasswordChange) {
  return true;
}

// 示例 7: 缺少账户锁定策略
export function checkAccountLockout(failedAttempts) {
  return false;
}

// 示例 8: 缺少多因素认证
export function checkMFA(username, password) {
  return true;
}

// 示例 9: 不安全的会话管理
export function createSession(username) {
  return {
    username: username,
    token: Math.random().toString(36)
  };
}

// 示例 10: 缺少会话超时
export function checkSessionTimeout(session) {
  return true;
}

// 示例 11: 缺少会话固定保护
export function checkSessionFixation(sessionId) {
  return true;
}

// 示例 12: 不安全的令牌生成
export function generateToken() {
  return Math.random().toString(36);
}

// 示例 13: 缺少令牌刷新机制
export function refreshToken(token) {
  return token;
}

// 示例 14: 缺少令牌撤销机制
export function revokeToken(token) {
  return true;
}

// 示例 15: 不安全的OAuth实现
export function oauthLogin(provider, code) {
  return fetch(`/api/oauth/${provider}/callback?code=${code}`, {
    method: 'POST'
  });
}

// 示例 16: 缺少OAuth状态参数
export function oauthWithoutState(provider) {
  const redirectUri = 'https://example.com/callback';
  return `https://oauth.provider.com/authorize?redirect_uri=${redirectUri}`;
}

// 示例 17: 不安全的JWT实现
export function generateJWT(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.secret`);
  return `${header}.${body}.${signature}`;
}

// 示例 18: 缺少JWT过期时间
export function generateJWTWithoutExpiry(payload) {
  return generateJWT(payload);
}

// 示例 19: 缺少JWT签发者验证
export function verifyJWTWithoutIssuer(token) {
  return true;
}

// 示例 20: 缺少JWT受众验证
export function verifyJWTWithoutAudience(token) {
  return true;
}

// 示例 21: Vue组件中的认证漏洞
export default {
  name: 'AuthVulnerableComponent',
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    login() {
      return fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      });
    },
    
    register() {
      return fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      });
    },
    
    resetPassword() {
      return fetch('/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          username: this.username
        })
      });
    }
  }
};

// 示例 22: 缺少用户名枚举防护
export function checkUsernameExists(username) {
  return fetch(`/api/user/${username}/exists`, {
    method: 'GET'
  });
}

// 示例 23: 缺少暴力破解防护
export function bruteForceLogin(username, password) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
}

// 示例 24: 缺少凭证填充防护
export function credentialStuffing(username, password) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
}

// 示例 25: 缺少字典攻击防护
export function dictionaryAttack(username, password) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
}

// 示例 26: 缺少彩虹表攻击防护
export function rainbowTableAttack(hash) {
  return fetch(`/api/hash/${hash}`, {
    method: 'GET'
  });
}

// 示例 27: 缺少碰撞攻击防护
export function collisionAttack(hash1, hash2) {
  return fetch('/api/verify', {
    method: 'POST',
    body: JSON.stringify({
      hash1: hash1,
      hash2: hash2
    })
  });
}

// 示例 28: 缺少重放攻击防护
export function replayAttack(token) {
  return fetch('/api/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// 示例 29: 缺少中间人攻击防护
export function manInTheMiddleAttack(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 30: 缺少会话劫持防护
export function sessionHijacking(sessionId) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'Cookie': `session=${sessionId}`
    }
  });
}

// 示例 31: 缺少权限提升防护
export function privilegeEscalation(userId, newRole) {
  return fetch(`/api/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({
      role: newRole
    })
  });
}

// 示例 32: 缺少水平越权防护
export function horizontalPrivilegeEscalation(targetUserId, data) {
  return fetch(`/api/users/${targetUserId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 示例 33: 缺少垂直越权防护
export function verticalPrivilegeEscalation(adminEndpoint, data) {
  return fetch(`/api/admin/${adminEndpoint}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 34: 缺少不安全的直接对象引用防护
export function insecureDirectObjectReference(objectId) {
  return fetch(`/api/objects/${objectId}`, {
    method: 'GET'
  });
}

// 示例 35: 缺少不安全的间接对象引用防护
export function insecureIndirectObjectReference(referenceId) {
  return fetch(`/api/objects/reference/${referenceId}`, {
    method: 'GET'
  });
}

// 示例 36: 缺少访问控制列表防护
export function accessControlList(resource, action) {
  return fetch(`/api/${resource}/${action}`, {
    method: 'POST'
  });
}

// 示例 37: 缺少基于角色的访问控制防护
export function roleBasedAccessControl(role, resource, action) {
  return fetch(`/api/${role}/${resource}/${action}`, {
    method: 'POST'
  });
}

// 示例 38: 缺少基于属性的访问控制防护
export function attributeBasedAccessControl(user, resource, action) {
  return fetch(`/api/access`, {
    method: 'POST',
    body: JSON.stringify({
      user: user,
      resource: resource,
      action: action
    })
  });
}

// 示例 39: 缺少最小权限原则
export function leastPrivilege(user, action) {
  return fetch(`/api/${action}`, {
    method: 'POST',
    body: JSON.stringify({
      user: user
    })
  });
}

// 示例 40: 缺少职责分离
export function separationOfDuties(user, action1, action2) {
  return fetch(`/api/actions`, {
    method: 'POST',
    body: JSON.stringify({
      user: user,
      action1: action1,
      action2: action2
    })
  });
}
