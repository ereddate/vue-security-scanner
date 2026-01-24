// Cookie安全配置漏洞示例文件

// 示例 1: 缺少HttpOnly属性的Cookie
export function setCookieWithoutHttpOnly(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

// 示例 2: 缺少Secure属性的Cookie
export function setCookieWithoutSecure(name, value) {
  document.cookie = `${name}=${value}; path=/; HttpOnly`;
}

// 示例 3: 缺少SameSite属性的Cookie
export function setCookieWithoutSameSite(name, value) {
  document.cookie = `${name}=${value}; path=/; HttpOnly; Secure`;
}

// 示例 4: SameSite设置为None（不安全）
export function setCookieWithSameSiteNone(name, value) {
  document.cookie = `${name}=${value}; path=/; SameSite=None`;
}

// 示例 5: Cookie中存储敏感信息
export function setSensitiveCookie() {
  document.cookie = `session_token=abc123def456; path=/`;
  document.cookie = `user_password=secret123; path=/`;
  document.cookie = `api_key=sk-1234567890; path=/`;
}

// 示例 6: Cookie过期时间过长
export function setLongLivedCookie(name, value) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 10);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

// 示例 7: Cookie域设置过宽
export function setWideDomainCookie(name, value) {
  document.cookie = `${name}=${value}; domain=.example.com; path=/`;
}

// 示例 8: Cookie路径设置过宽
export function setWidePathCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

// 示例 9: 未验证的Cookie读取
export function readCookieWithoutValidation(cookieName) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${cookieName}=`))
    ?.split('=')[1];
  return value;
}

// 示例 10: Vue组件中的不安全Cookie设置
export default {
  name: 'CookieSecurityComponent',
  methods: {
    setSessionCookie(token) {
      document.cookie = `session=${token}; path=/`;
    },
    
    setUserCookie(userData) {
      document.cookie = `user=${JSON.stringify(userData)}; path=/`;
    },
    
    setPreferenceCookie(preference) {
      document.cookie = `preference=${preference}; path=/`;
    }
  },
  
  mounted() {
    const token = this.$route.query.token;
    this.setSessionCookie(token);
  }
};

// 示例 11: Cookie中存储JSON数据
export function setJsonCookie(name, data) {
  document.cookie = `${name}=${JSON.stringify(data)}; path=/`;
}

// 示例 12: Cookie中存储认证信息
export function setAuthCookie(username, password) {
  const auth = btoa(`${username}:${password}`);
  document.cookie = `auth=${auth}; path=/`;
}

// 示例 13: 未加密的Cookie
export function setUnencryptedCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

// 示例 14: Cookie在URL中传输
export function sendCookieInUrl(cookieValue) {
  return fetch(`/api/data?cookie=${encodeURIComponent(cookieValue)}`, {
    method: 'GET'
  });
}

// 示例 15: Cookie未设置过期时间
export function setCookieWithoutExpiry(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

// 示例 16: Cookie在JavaScript中可访问（缺少HttpOnly）
export function setAccessibleCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; Secure`;
}

// 示例 17: Cookie在HTTP和HTTPS中都可用（缺少Secure）
export function setHttpAndHttpsCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; HttpOnly`;
}

// 示例 18: Cookie在跨站请求中可用（缺少SameSite）
export function setCrossSiteCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; HttpOnly; Secure`;
}

// 示例 19: Cookie中存储CSRF Token
export function setCSRFTokenCookie(token) {
  document.cookie = `csrf_token=${token}; path=/`;
}

// 示例 20: Cookie中存储会话ID
export function setSessionIdCookie(sessionId) {
  document.cookie = `session_id=${sessionId}; path=/`;
}
