# Taro 微信小程序适配安全

## 📋 概述

Taro 支持编译到微信小程序平台，但需要注意微信小程序平台特有的安全限制和最佳实践。

## 🎯 核心安全特性

- **小程序沙箱**：微信小程序运行在沙箱环境中，限制了部分 API 的访问
- **域名白名单**：微信小程序需要配置合法域名白名单
- **权限控制**：微信小程序提供了细粒度的权限控制
- **代码审核**：微信小程序需要经过审核才能发布

## 🔍 常见安全问题

### 问题 1：域名白名单配置不当

**描述**：如果域名白名单配置不当，可能导致无法访问后端服务或被恶意域名利用。

**风险**：高风险，可能导致服务不可用，未授权访问等严重后果。

**解决方案**：

1. **配置合法域名**：在微信公众平台配置合法的域名白名单
2. **使用 HTTPS**：只配置 HTTPS 域名，确保传输安全
3. **定期更新白名单**：定期更新域名白名单，移除不再使用的域名

```javascript
// project.config.json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "postcss": true,
    "minified": true
  },
  "appid": "your-appid",
  "projectname": "your-project",
  "libVersion": "2.19.4",
  "compileType": "miniprogram",
  "condition": false
}
```

### 问题 2：权限滥用

**描述**：如果小程序申请了不必要的权限，可能导致隐私泄露或被拒绝审核。

**风险**：中风险，可能导致隐私泄露，审核失败等后果。

**解决方案**：

1. **最小权限原则**：只申请必要的权限
2. **说明权限用途**：在审核时详细说明权限的用途
3. **用户授权**：在需要时请求用户授权

```json
{
  "pages": [
    "pages/index/index",
    "pages/user/user"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口效果展示"
    },
    "scope.userLocationBackground": {
      "desc": "你的位置信息将用于小程序位置接口效果展示"
    },
    "scope.writePhotosAlbum": {
      "desc": "你的相册将用于小程序保存图片"
    }
  }
}
```

### 问题 3：数据存储泄露

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
  
  // 解密数据
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};
```

### 问题 4：网络请求安全

**描述**：如果网络请求未进行适当的安全处理，可能导致数据泄露或中间人攻击。

**风险**：中风险，可能导致数据泄露，会话劫持等后果。

**解决方案**：

1. **使用 HTTPS**：所有网络请求必须使用 HTTPS
2. **验证响应**：验证网络请求的响应，确保数据完整性
3. **添加请求头**：添加必要的请求头，如认证信息

```javascript
// utils/request.js
export const secureRequest = (url, data, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://api.example.com${url}`,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// project.config.json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "postcss": true,
    "minified": true,
    "enhance": true
  },
  "appid": "your-appid",
  "projectname": "your-project",
  "compileType": "miniprogram",
  "condition": false
}
```

### 安全检查清单

- [x] 在微信公众平台配置合法的域名白名单
- [x] 只配置 HTTPS 域名
- [x] 定期更新域名白名单
- [x] 只申请必要的权限
- [x] 在审核时详细说明权限的用途
- [x] 在需要时请求用户授权
- [x] 避免在小程序中存储敏感信息
- [x] 对存储的数据进行加密
- [x] 使用微信云存储，避免本地存储
- [x] 所有网络请求使用 HTTPS
- [x] 验证网络请求的响应
- [x] 添加必要的请求头

## 📚 最佳实践

1. **配置域名白名单**：在微信公众平台配置合法的域名白名单，只配置 HTTPS 域名
2. **最小权限原则**：只申请必要的权限，避免权限滥用
3. **用户授权**：在需要时请求用户授权，说明权限用途
4. **加密存储数据**：对存储的数据进行加密，避免数据泄露
5. **使用 HTTPS**：所有网络请求必须使用 HTTPS，确保传输安全
6. **验证响应**：验证网络请求的响应，确保数据完整性
7. **添加请求头**：添加必要的请求头，如认证信息
8. **定期更新**：定期更新 Taro 和相关依赖，修复已知安全漏洞

## 📞 安全资源

- [Taro 官方文档 - 微信小程序](https://taro-docs.jd.com/docs/docs/platforms/weapp)
- [微信小程序官方文档 - 安全](https://developers.weixin.qq.com/miniprogram/dev/framework/security/)
- [OWASP 移动应用安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html)
- [OWASP API 安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/API_Security_Cheat_Sheet.html)

## 📝 更新日志

- 2024-01-01：初始版本，添加微信小程序适配安全指南
- 2024-02-15：更新 Taro 3.x 微信小程序安全特性
- 2024-03-20：添加更多安全配置示例和最佳实践