// HTTP头注入漏洞示例文件

// 示例 1: User-Agent头注入
export function setCustomUserAgent(userAgent) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'User-Agent': userAgent
    }
  });
}

// 示例 2: Referer头注入
export function trackVisit(referer) {
  return fetch('/api/track', {
    method: 'POST',
    headers: {
      'Referer': referer
    }
  });
}

// 示例 3: Location头注入（开放重定向）
export function redirectUser(redirectUrl) {
  return fetch('/api/redirect', {
    method: 'GET',
    headers: {
      'Location': redirectUrl
    }
  });
}

// 示例 4: Set-Cookie头注入
export function setCookie(cookieValue) {
  return fetch('/api/set-cookie', {
    method: 'POST',
    headers: {
      'Set-Cookie': cookieValue
    }
  });
}

// 示例 5: Content-Type头注入
export function uploadFile(contentType, fileData) {
  return fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': contentType
    },
    body: fileData
  });
}

// 示例 6: X-Forwarded-For头注入
export function getClientIp(clientIp) {
  return fetch('/api/client-info', {
    method: 'GET',
    headers: {
      'X-Forwarded-For': clientIp
    }
  });
}

// 示例 7: Host头注入
export function setCustomHost(host) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'Host': host
    }
  });
}

// 示例 8: Authorization头注入
export function authenticate(authHeader) {
  return fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Authorization': authHeader
    }
  });
}

// 示例 9: X-Real-IP头注入
export function getRealIp(realIp) {
  return fetch('/api/ip', {
    method: 'GET',
    headers: {
      'X-Real-IP': realIp
    }
  });
}

// 示例 10: 自定义头注入
export function setCustomHeader(headerName, headerValue) {
  return fetch('/api/custom', {
    method: 'POST',
    headers: {
      [headerName]: headerValue
    }
  });
}

// 示例 11: Vue组件中的HTTP头注入
export default {
  name: 'HTTPHeaderInjectionComponent',
  methods: {
    fetchData() {
      const userAgent = this.$route.query.userAgent;
      return fetch('/api/data', {
        method: 'GET',
        headers: {
          'User-Agent': userAgent
        }
      });
    },
    
    trackUser() {
      const referer = this.$route.query.referer;
      return fetch('/api/track', {
        method: 'POST',
        headers: {
          'Referer': referer
        }
      });
    },
    
    redirect() {
      const redirectUrl = this.$route.query.redirect;
      return fetch('/api/redirect', {
        method: 'GET',
        headers: {
          'Location': redirectUrl
        }
      });
    }
  }
};

// 示例 12: CRLF注入（HTTP响应拆分）
export function injectCRLF(input) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'X-Custom-Header': input + '\r\n' + 'Injected-Header: malicious'
    }
  });
}

// 示例 13: HTTP响应头注入
export function setResponseHeader(headerName, headerValue) {
  return fetch('/api/set-header', {
    method: 'POST',
    headers: {
      'X-Response-Header': `${headerName}: ${headerValue}`
    }
  });
}

// 示例 14: Cache-Control头注入
export function setCacheControl(cacheControl) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'Cache-Control': cacheControl
    }
  });
}

// 示例 15: Accept头注入
export function setAcceptHeader(acceptType) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'Accept': acceptType
    }
  });
}
