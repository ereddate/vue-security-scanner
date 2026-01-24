// 网络请求安全漏洞示例文件

// 示例 1: 缺少HTTPS
export function httpRequest(url) {
  return fetch(`http://${url}`);
}

// 示例 2: 缺少证书验证
export function requestWithoutCertVerification(url) {
  return fetch(url, {
    rejectUnauthorized: false
  });
}

// 示例 3: 缺少主机名验证
export function requestWithoutHostnameVerification(url) {
  return fetch(url);
}

// 示例 4: 缺少超时设置
export function requestWithoutTimeout(url) {
  return fetch(url);
}

// 示例 5: 缺少重试机制
export function requestWithoutRetry(url) {
  return fetch(url);
}

// 示例 6: 缺少错误处理
export function requestWithoutErrorHandling(url) {
  return fetch(url);
}

// 示例 7: 缺少请求验证
export function requestWithoutValidation(url, data) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 8: 缺少响应验证
export function requestWithoutResponseValidation(url) {
  return fetch(url).then(response => response.json());
}

// 示例 9: 缺少请求签名
export function requestWithoutSignature(url, data) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 10: 缺少响应签名验证
export function requestWithoutResponseSignatureValidation(url) {
  return fetch(url).then(response => response.json());
}

// 示例 11: Vue组件中的网络请求漏洞
export default {
  name: 'NetworkRequestVulnerableComponent',
  methods: {
    fetchData(url) {
      return fetch(url);
    },
    
    postData(url, data) {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    putData(url, data) {
      return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },
  
  mounted() {
    const url = this.$route.query.url;
    this.fetchData(url);
  }
};

// 示例 12: 缺少请求头验证
export function requestWithoutHeaderValidation(url, headers) {
  return fetch(url, {
    headers: headers
  });
}

// 示例 13: 缺少响应头验证
export function requestWithoutResponseHeaderValidation(url) {
  return fetch(url);
}

// 示例 14: 缺少请求体验证
export function requestWithoutBodyValidation(url, body) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

// 示例 15: 缺少响应体验证
export function requestWithoutResponseBodyValidation(url) {
  return fetch(url).then(response => response.json());
}

// 示例 16: 缺少请求方法验证
export function requestWithoutMethodValidation(url, method) {
  return fetch(url, {
    method: method
  });
}

// 示例 17: 缺少响应方法验证
export function requestWithoutResponseMethodValidation(url) {
  return fetch(url);
}

// 示例 18: 缺少请求URL验证
export function requestWithoutURLValidation(url) {
  return fetch(url);
}

// 示例 19: 缺少响应URL验证
export function requestWithoutResponseURLValidation(url) {
  return fetch(url);
}

// 示例 20: 缺少请求协议验证
export function requestWithoutProtocolValidation(url) {
  return fetch(url);
}

// 示例 21: 缺少响应协议验证
export function requestWithoutResponseProtocolValidation(url) {
  return fetch(url);
}

// 示例 22: 缺少请求端口验证
export function requestWithoutPortValidation(url) {
  return fetch(url);
}

// 示例 23: 缺少响应端口验证
export function requestWithoutResponsePortValidation(url) {
  return fetch(url);
}

// 示例 24: 缺少请求IP验证
export function requestWithoutIPValidation(url) {
  return fetch(url);
}

// 示例 25: 缺少响应IP验证
export function requestWithoutResponseIPValidation(url) {
  return fetch(url);
}

// 示例 26: 缺少请求DNS验证
export function requestWithoutDNSValidation(url) {
  return fetch(url);
}

// 示例 27: 缺少响应DNS验证
export function requestWithoutResponseDNSValidation(url) {
  return fetch(url);
}

// 示例 28: 缺少请求代理验证
export function requestWithoutProxyValidation(url, proxy) {
  return fetch(url, {
    proxy: proxy
  });
}

// 示例 29: 缺少响应代理验证
export function requestWithoutResponseProxyValidation(url) {
  return fetch(url);
}

// 示例 30: 缺少请求防火墙验证
export function requestWithoutFirewallValidation(url) {
  return fetch(url);
}

// 示例 31: 缺少响应防火墙验证
export function requestWithoutResponseFirewallValidation(url) {
  return fetch(url);
}

// 示例 32: 缺少请求IDS验证
export function requestWithoutIDSValidation(url) {
  return fetch(url);
}

// 示例 33: 缺少响应IDS验证
export function requestWithoutResponseIDSValidation(url) {
  return fetch(url);
}

// 示例 34: 缺少请求IPS验证
export function requestWithoutIPSValidation(url) {
  return fetch(url);
}

// 示例 35: 缺少响应IPS验证
export function requestWithoutResponseIPSValidation(url) {
  return fetch(url);
}

// 示例 36: 缺少请求WAF验证
export function requestWithoutWAFValidation(url) {
  return fetch(url);
}

// 示例 37: 缺少响应WAF验证
export function requestWithoutResponseWAFValidation(url) {
  return fetch(url);
}

// 示例 38: 缺少请求DDoS防护
export function requestWithoutDDoSProtection(url) {
  return fetch(url);
}

// 示例 39: 缺少响应DDoS防护
export function requestWithoutResponseDDoSProtection(url) {
  return fetch(url);
}

// 示例 40: 缺少请求速率限制
export function requestWithoutRateLimit(url) {
  return fetch(url);
}

// 示例 41: 缺少响应速率限制
export function requestWithoutResponseRateLimit(url) {
  return fetch(url);
}

// 示例 42: 缺少请求连接限制
export function requestWithoutConnectionLimit(url) {
  return fetch(url);
}

// 示例 43: 缺少响应连接限制
export function requestWithoutResponseConnectionLimit(url) {
  return fetch(url);
}

// 示例 44: 缺少请求带宽限制
export function requestWithoutBandwidthLimit(url) {
  return fetch(url);
}

// 示例 45: 缺少响应带宽限制
export function requestWithoutResponseBandwidthLimit(url) {
  return fetch(url);
}

// 示例 46: 缺少请求缓存控制
export function requestWithoutCacheControl(url) {
  return fetch(url);
}

// 示例 47: 缺少响应缓存控制
export function requestWithoutResponseCacheControl(url) {
  return fetch(url);
}

// 示例 48: 缺少请求压缩
export function requestWithoutCompression(url) {
  return fetch(url);
}

// 示例 49: 缺少响应压缩
export function requestWithoutResponseCompression(url) {
  return fetch(url);
}

// 示例 50: 缺少请求加密
export function requestWithoutEncryption(url, data) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
