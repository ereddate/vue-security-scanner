# uni-app 微信小程序适配安全

## 📋 概述

uni-app 支持编译到微信小程序，为开发者提供了跨端开发的能力。微信小程序的安全特性与 Web 应用有所不同，需要特别关注。了解和正确使用微信小程序的安全特性对于构建安全的 uni-app 应用至关重要。

## 🎯 核心安全特性

- **小程序沙箱**：微信小程序运行在沙箱环境中，限制了部分 Web API 的使用
- **域名白名单**：微信小程序要求所有网络请求的域名必须在白名单中
- **数据加密**：微信小程序提供了数据加密 API，保护敏感数据
- **权限管理**：微信小程序提供了细粒度的权限管理机制

## 🔍 常见安全问题

### 问题 1：网络请求域名未在白名单中

**描述**：如果网络请求的域名未在微信小程序后台配置白名单，请求将被拦截。

**风险**：中风险，可能导致应用功能异常，用户体验受损。

**解决方案**：

1. **配置域名白名单**：在微信小程序后台配置网络请求域名白名单
2. **使用合法域名**：使用合法的域名进行网络请求
3. **验证域名配置**：在开发前验证域名配置是否正确

```javascript
// manifest.json
{
  "mp-weixin": {
    "appid": "your-appid",
    "setting": {
      "urlCheck": true
    },
    "networkTimeout": {
      "request": 10000,
      "downloadFile": 10000
    }
  }
}
```

### 问题 2：敏感信息泄露

**描述**：如果在微信小程序中硬编码敏感信息，如 API 密钥、数据库凭证等，可能导致信息泄露。

**风险**：高风险，可能导致敏感信息泄露，服务被滥用等严重后果。

**解决方案**：

1. **使用环境变量**：使用环境变量存储敏感信息
2. **使用云开发**：使用微信小程序云开发，避免在客户端存储敏感信息
3. **加密敏感信息**：如果必须在客户端存储敏感信息，对其进行加密

```javascript
// utils/crypto.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

### 问题 3：存储安全

**描述**：如果在微信小程序中不安全地使用存储 API，可能导致敏感信息泄露。

**风险**：中风险，可能导致敏感信息被其他小程序访问，信息泄露等后果。

**解决方案**：

1. **使用加密存储**：对敏感信息进行加密后再存储
2. **限制存储范围**：使用不同的存储 key 隔离不同类型的信息
3. **定期清理存储**：定期清理不再需要的存储信息

```javascript
// utils/storage.js
import { encrypt, decrypt } from './crypto';

const STORAGE_PREFIX = 'app_';

export const setStorage = (key, value) => {
  const encryptedValue = encrypt(value);
  uni.setStorageSync(STORAGE_PREFIX + key, encryptedValue);
};

export const getStorage = (key) => {
  const encryptedValue = uni.getStorageSync(STORAGE_PREFIX + key);
  if (!encryptedValue) {
    return null;
  }
  return decrypt(encryptedValue);
};

export const removeStorage = (key) => {
  uni.removeStorageSync(STORAGE_PREFIX + key);
};
```

### 问题 4：用户信息获取不当

**描述**：如果在微信小程序中不当获取用户信息，可能导致用户隐私泄露。

**风险**：高风险，可能导致用户隐私泄露，违反微信小程序规范等严重后果。

**解决方案**：

1. **使用官方 API**：使用微信小程序官方 API 获取用户信息
2. **获取用户授权**：在获取用户信息前获取用户授权
3. **最小化信息收集**：只收集必要的用户信息

```javascript
// utils/user.js
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        resolve(res.userInfo);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

export const getUserPhone = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
      method: 'POST',
      data: {
        code: ''
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// manifest.json
{
  "mp-weixin": {
    "appid": "your-appid",
    "setting": {
      "urlCheck": true,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "networkTimeout": {
      "request": 10000,
      "downloadFile": 10000
    },
    "permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于小程序位置接口的效果展示"
      }
    },
    "requiredPrivateInfos": [
      "getLocation",
      "chooseLocation"
    ]
  }
}
```

### 安全检查清单

- [x] 在微信小程序后台配置网络请求域名白名单
- [x] 使用合法的域名进行网络请求
- [x] 避免在客户端硬编码敏感信息
- [x] 使用环境变量存储敏感信息
- [x] 使用微信小程序云开发，避免在客户端存储敏感信息
- [x] 对敏感信息进行加密后再存储
- [x] 限制存储范围，隔离不同类型的信息
- [x] 定期清理不再需要的存储信息
- [x] 使用微信小程序官方 API 获取用户信息
- [x] 在获取用户信息前获取用户授权
- [x] 只收集必要的用户信息

## 📚 最佳实践

1. **使用域名白名单**：在微信小程序后台配置网络请求域名白名单
2. **使用云开发**：使用微信小程序云开发，避免在客户端存储敏感信息
3. **加密敏感信息**：对敏感信息进行加密后再存储
4. **获取用户授权**：在获取用户信息前获取用户授权
5. **最小化信息收集**：只收集必要的用户信息
6. **使用官方 API**：使用微信小程序官方 API，避免使用不安全的第三方库
7. **定期更新**：定期更新 uni-app 和微信小程序 SDK，获取最新的安全修复

## 📞 安全资源

- [微信小程序官方文档 - 安全](https://developers.weixin.qq.com/miniprogram/dev/framework/security.html)
- [微信小程序官方文档 - 网络请求](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)
- [微信小程序官方文档 - 数据存储](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)
- [微信小程序官方文档 - 用户信息](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加微信小程序适配安全指南