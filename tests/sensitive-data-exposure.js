// 敏感数据暴露漏洞示例文件

// 示例 1: URL中暴露敏感数据
export function exposeSensitiveDataInUrl(userId, token) {
  return fetch(`/api/user/${userId}?token=${token}`, {
    method: 'GET'
  });
}

// 示例 2: URL参数中暴露密码
export function loginWithPasswordInUrl(username, password) {
  return fetch(`/api/login?username=${username}&password=${password}`, {
    method: 'GET'
  });
}

// 示例 3: URL中暴露API密钥
export function fetchDataWithApiKey(apiKey) {
  return fetch(`/api/data?apiKey=${apiKey}`, {
    method: 'GET'
  });
}

// 示例 4: URL中暴露会话ID
export function accessSession(sessionId) {
  return fetch(`/api/session/${sessionId}`, {
    method: 'GET'
  });
}

// 示例 5: URL中暴露认证令牌
export function authenticateWithToken(accessToken) {
  return fetch(`/api/auth?token=${accessToken}`, {
    method: 'GET'
  });
}

// 示例 6: 查询参数中暴露信用卡信息
export function processPayment(cardNumber, cvv, expiry) {
  return fetch(`/api/payment?card=${cardNumber}&cvv=${cvv}&expiry=${expiry}`, {
    method: 'GET'
  });
}

// 示例 7: URL中暴露个人身份信息
export function updateProfile(ssn, dob, address) {
  return fetch(`/api/profile?ssn=${ssn}&dob=${dob}&address=${address}`, {
    method: 'GET'
  });
}

// 示例 8: URL中暴露医疗信息
export function updateMedicalRecord(patientId, diagnosis, treatment) {
  return fetch(`/api/medical/${patientId}?diagnosis=${diagnosis}&treatment=${treatment}`, {
    method: 'GET'
  });
}

// 示例 9: URL中暴露财务信息
export function getAccountBalance(accountNumber, routingNumber) {
  return fetch(`/api/balance?account=${accountNumber}&routing=${routingNumber}`, {
    method: 'GET'
  });
}

// 示例 10: URL中暴露法律信息
export function getLegalDocument(caseId, documentType) {
  return fetch(`/api/legal/${caseId}?type=${documentType}`, {
    method: 'GET'
  });
}

// 示例 11: Vue组件中的敏感数据暴露
export default {
  name: 'SensitiveDataExposureComponent',
  methods: {
    fetchUserData() {
      const userId = this.$route.query.userId;
      const token = this.$route.query.token;
      return fetch(`/api/user/${userId}?token=${token}`, {
        method: 'GET'
      });
    },
    
    fetchPaymentData() {
      const cardNumber = this.$route.query.card;
      const cvv = this.$route.query.cvv;
      return fetch(`/api/payment?card=${cardNumber}&cvv=${cvv}`, {
        method: 'GET'
      });
    },
    
    fetchProfileData() {
      const ssn = this.$route.query.ssn;
      const dob = this.$route.query.dob;
      return fetch(`/api/profile?ssn=${ssn}&dob=${dob}`, {
        method: 'GET'
      });
    }
  }
};

// 示例 12: localStorage中存储敏感数据
export function storeSensitiveDataInLocalStorage() {
  localStorage.setItem('password', 'secret123');
  localStorage.setItem('apiKey', 'sk-1234567890');
  localStorage.setItem('token', 'abc123def456');
  localStorage.setItem('creditCard', '4111111111111111');
}

// 示例 13: sessionStorage中存储敏感数据
export function storeSensitiveDataInSessionStorage() {
  sessionStorage.setItem('sessionToken', 'xyz789');
  sessionStorage.setItem('authToken', 'token123');
  sessionStorage.setItem('userPassword', 'password456');
}

// 示例 14: Cookie中存储敏感数据
export function storeSensitiveDataInCookie() {
  document.cookie = `password=secret123; path=/`;
  document.cookie = `apiKey=sk-1234567890; path=/`;
  document.cookie = `token=abc123def456; path=/`;
}

// 示例 15: IndexedDB中存储敏感数据
export function storeSensitiveDataInIndexedDB() {
  const request = indexedDB.open('SensitiveData', 1);
  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['secrets'], 'readwrite');
    const objectStore = transaction.objectStore('secrets');
    
    objectStore.add({
      type: 'password',
      value: 'secret123'
    });
    
    objectStore.add({
      type: 'apiKey',
      value: 'sk-1234567890'
    });
  };
}

// 示例 16: console.log中暴露敏感数据
export function logSensitiveData() {
  const userData = {
    username: 'admin',
    password: 'secret123',
    apiKey: 'sk-1234567890',
    token: 'abc123def456'
  };
  
  console.log('User data:', userData);
  console.log('Password:', userData.password);
  console.log('API Key:', userData.apiKey);
  console.log('Token:', userData.token);
}

// 示例 17: 错误消息中暴露敏感数据
export function handleErrorWithSensitiveData(error) {
  const sensitiveData = {
    password: 'secret123',
    apiKey: 'sk-1234567890'
  };
  
  throw new Error(`Error occurred with data: ${JSON.stringify(sensitiveData)}`);
}

// 示例 18: 响应中暴露敏感数据
export function exposeSensitiveDataInResponse() {
  return {
    user: {
      username: 'admin',
      password: 'secret123',
      email: 'admin@example.com',
      phone: '+1234567890',
      address: '123 Main St'
    },
    apiKey: 'sk-1234567890',
    token: 'abc123def456'
  };
}

// 示例 19: 日志文件中暴露敏感数据
export function logSensitiveDataToFile() {
  const fs = require('fs');
  const sensitiveData = {
    password: 'secret123',
    apiKey: 'sk-1234567890',
    token: 'abc123def456'
  };
  
  fs.appendFileSync('sensitive.log', JSON.stringify(sensitiveData) + '\n');
}

// 示例 20: 网络请求中暴露敏感数据
export function sendSensitiveDataOverNetwork(data) {
  return fetch('/api/sensitive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Sensitive-Data': JSON.stringify(data)
    },
    body: JSON.stringify(data)
  });
}

// 示例 21: URL哈希中暴露敏感数据
export function exposeSensitiveDataInHash(data) {
  window.location.hash = `#data=${encodeURIComponent(JSON.stringify(data))}`;
}

// 示例 22: URL片段中暴露敏感数据
export function exposeSensitiveDataInFragment(data) {
  window.location.href = `https://example.com/page#${encodeURIComponent(JSON.stringify(data))}`;
}

// 示例 23: URL路径中暴露敏感数据
export function exposeSensitiveDataInPath(data) {
  window.location.href = `https://example.com/${encodeURIComponent(JSON.stringify(data))}`;
}

// 示例 24: URL查询字符串中暴露敏感数据
export function exposeSensitiveDataInQueryString(data) {
  const queryString = new URLSearchParams(data).toString();
  window.location.href = `https://example.com/page?${queryString}`;
}

// 示例 25: 历史记录中暴露敏感数据
export function exposeSensitiveDataInHistory(data) {
  history.pushState(data, '', `?data=${encodeURIComponent(JSON.stringify(data))}`);
}
