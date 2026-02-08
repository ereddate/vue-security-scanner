# 微信小程序存储安全

## 📋 概述

微信小程序提供了多种存储 API，包括 `wx.setStorageSync`、`wx.setStorage` 等。正确使用存储 API 可以避免数据泄露、未授权访问等安全问题。

## 🎯 核心安全特性

- **本地存储**：微信小程序提供了本地存储功能，可以存储键值对数据
- **存储限制**：微信小程序对存储大小有限制，避免滥用
- **数据隔离**：微信小程序的存储是隔离的，不同小程序之间不能互相访问
- **加密存储**：微信小程序支持数据加密存储

## 🔍 常见安全问题

### 问题 1：敏感数据泄露

**描述**：如果在小程序中存储敏感信息，并且未进行适当保护，可能导致数据泄露。

**风险**：中风险，可能导致敏感信息泄露，用户隐私受损等后果。

**解决方案**：

1. **避免存储敏感信息**：不要在小程序中存储敏感信息
2. **加密存储数据**：对存储的数据进行加密
3. **使用云存储**：使用微信云存储，避免本地存储

```javascript
// utils/storage.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export const setSecureData = (key, value) => {
  // 加密数据
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
  wx.setStorageSync(key, encrypted);
};

export const getSecureData = (key) => {
  const encrypted = wx.getStorageSync(key);
  if (!encrypted) return null;
  
  try {
    // 解密数据
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
};
```

### 问题 2：存储注入

**描述**：如果存储的数据来自用户输入，并且未进行验证，可能导致存储注入攻击。

**风险**：中风险，可能导致数据篡改，未授权操作等后果。

**解决方案**：

1. **验证存储数据**：验证存储数据的格式和类型
2. **转义特殊字符**：转义存储数据中的特殊字符
3. **使用数据验证**：使用数据验证机制确保数据的安全性

```javascript
// utils/validator.js
export const validateStorageData = (data, schema) => {
  for (const key in schema) {
    const value = data[key];
    const rules = schema[key];
    
    // 验证必填
    if (rules.required && !value) {
      throw new Error(`${key} 是必填项`);
    }
    
    // 验证类型
    if (rules.type && typeof value !== rules.type) {
      throw new Error(`${key} 类型错误`);
    }
    
    // 验证格式
    if (rules.pattern && !rules.pattern.test(value)) {
      throw new Error(`${key} 格式错误`);
    }
  }
  
  return true;
};
```

### 问题 3：存储容量溢出

**描述**：如果存储的数据超过微信小程序的存储限制，可能导致存储失败或应用异常。

**风险**：低风险，主要影响应用功能，但也可能导致安全问题。

**解决方案**：

1. **监控存储使用**：监控存储的使用情况
2. **清理过期数据**：定期清理过期的存储数据
3. **限制存储大小**：限制单个数据项的大小

```javascript
// utils/storage.js
export const getStorageInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getStorageInfo({
      success: (res) => {
        resolve({
          keys: res.keys,
          currentSize: res.currentSize,
          limitSize: res.limitSize
        });
      },
      fail: reject
    });
  });
};

export const cleanExpiredData = (maxAge) => {
  const now = Date.now();
  const keys = wx.getStorageInfoSync().keys;
  
  keys.forEach(key => {
    const data = wx.getStorageSync(key);
    if (data && data.timestamp && now - data.timestamp > maxAge) {
      wx.removeStorageSync(key);
    }
  });
};
```

### 问题 4：存储数据篡改

**描述**：如果存储的数据被篡改，可能导致应用行为异常或安全问题。

**风险**：中风险，可能导致数据篡改，未授权操作等后果。

**解决方案**：

1. **使用数据签名**：对存储的数据进行签名，验证数据完整性
2. **验证数据签名**：在读取数据时验证数据签名
3. **使用加密存储**：对存储的数据进行加密

```javascript
// utils/storage.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export const signData = (data) => {
  const signature = CryptoJS.HmacSHA256(JSON.stringify(data), SECRET_KEY).toString();
  return {
    data: data,
    signature: signature
  };
};

export const verifyData = (signedData) => {
  const { data, signature } = signedData;
  const computedSignature = CryptoJS.HmacSHA256(JSON.stringify(data), SECRET_KEY).toString();
  return signature === computedSignature;
};

export const setSignedData = (key, value) => {
  const signedData = signData(value);
  wx.setStorageSync(key, signedData);
};

export const getSignedData = (key) => {
  const signedData = wx.getStorageSync(key);
  if (!signedData) return null;
  
  if (!verifyData(signedData)) {
    console.warn('数据签名验证失败');
    return null;
  }
  
  return signedData.data;
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// utils/storage.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export const setSecureData = (key, value) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
  wx.setStorageSync(key, encrypted);
};

export const getSecureData = (key) => {
  const encrypted = wx.getStorageSync(key);
  if (!encrypted) return null;
  
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
};

export const setSignedData = (key, value) => {
  const signature = CryptoJS.HmacSHA256(JSON.stringify(value), SECRET_KEY).toString();
  wx.setStorageSync(key, {
    data: value,
    signature: signature
  });
};

export const getSignedData = (key) => {
  const signedData = wx.getStorageSync(key);
  if (!signedData) return null;
  
  const computedSignature = CryptoJS.HmacSHA256(JSON.stringify(signedData.data), SECRET_KEY).toString();
  if (signedData.signature !== computedSignature) {
    console.warn('数据签名验证失败');
    return null;
  }
  
  return signedData.data;
};
```

### 安全检查清单

- [x] 避免在小程序中存储敏感信息
- [x] 对存储的数据进行加密
- [x] 使用微信云存储，避免本地存储
- [x] 验证存储数据的格式和类型
- [x] 转义存储数据中的特殊字符
- [x] 使用数据验证机制确保数据的安全性
- [x] 监控存储的使用情况
- [x] 定期清理过期的存储数据
- [x] 限制单个数据项的大小
- [x] 对存储的数据进行签名
- [x] 在读取数据时验证数据签名
- [x] 对存储的数据进行加密

## 📚 最佳实践

1. **避免存储敏感信息**：不要在小程序中存储敏感信息，如密码、令牌等
2. **加密存储数据**：对存储的数据进行加密，增加安全性
3. **使用云存储**：使用微信云存储，避免本地存储
4. **验证存储数据**：验证存储数据的格式和类型，防止存储注入
5. **监控存储使用**：监控存储的使用情况，避免存储溢出
6. **清理过期数据**：定期清理过期的存储数据，释放存储空间
7. **使用数据签名**：对存储的数据进行签名，验证数据完整性
8. **定期更新**：定期更新微信小程序和相关依赖，修复已知安全漏洞

## 📞 安全资源

- [微信小程序官方文档 - 数据存储](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)
- [微信小程序官方文档 - 本地存储](https://developers.weixin.qq.com/miniprogram/dev/framework/storage.html)
- [OWASP 数据存储备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Data_Storage_Cheat_Sheet.html)
- [OWASP 加密备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加存储安全指南
- 2024-02-15：更新微信小程序存储安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践