# uni-app App 性能优化安全

## 📋 概述

uni-app 支持编译到 App 平台（iOS 和 Android），为开发者提供了跨端开发的能力。App 平台的性能优化不仅可以提高应用性能，还可以减少安全风险。了解和正确使用 uni-app App 平台的性能优化特性对于构建安全且高效的 uni-app 应用至关重要。

## 🎯 核心安全特性

- **原生性能**：App 平台使用原生渲染，提供更好的性能和安全性
- **权限管理**：App 平台提供了细粒度的权限管理机制
- **原生 API**：App 平台支持原生 API，提供更强大的功能
- **沙箱环境**：App 平台运行在沙箱环境中，限制部分系统 API 的使用

## 🔍 常见安全问题

### 问题 1：内存泄漏

**描述**：如果在 App 平台中未正确清理资源，可能导致内存泄漏。

**风险**：中风险，可能导致应用性能下降，内存占用持续增长，最终导致应用崩溃。

**解决方案**：

1. **在页面卸载时清理资源**：在 `onUnload` 生命周期中清理资源
2. **避免全局变量**：避免使用全局变量存储数据
3. **使用弱引用**：使用弱引用存储对象，避免内存泄漏

```javascript
// pages/index/index.js
export default {
  data() {
    return {
      timer: null,
      eventListener: null
    };
  },
  
  onLoad() {
    // 创建定时器
    this.timer = setInterval(() => {
      console.log('定时任务');
    }, 1000);
    
    // 添加事件监听器
    this.eventListener = (event) => {
      console.log('事件:', event);
    };
    uni.$on('custom-event', this.eventListener);
  },
  
  onUnload() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // 移除事件监听器
    if (this.eventListener) {
      uni.$off('custom-event', this.eventListener);
      this.eventListener = null;
    }
  }
};
```

### 问题 2：敏感信息泄露

**描述**：如果在 App 平台中不当存储敏感信息，可能导致信息泄露。

**风险**：高风险，可能导致敏感信息被其他应用访问，信息泄露等严重后果。

**解决方案**：

1. **使用加密存储**：对敏感信息进行加密后再存储
2. **使用原生存储 API**：使用原生存储 API，如 `uni.setStorage`、`uni.setStorageSync`
3. **限制存储范围**：使用不同的存储 key 隔离不同类型的信息

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

```javascript
// utils/storage.js
import { encrypt, decrypt } from './crypto';

const STORAGE_PREFIX = 'app_';

export const setSecureStorage = (key, value) => {
  const encryptedValue = encrypt(value);
  uni.setStorageSync(STORAGE_PREFIX + key, encryptedValue);
};

export const getSecureStorage = (key) => {
  const encryptedValue = uni.getStorageSync(STORAGE_PREFIX + key);
  if (!encryptedValue) {
    return null;
  }
  return decrypt(encryptedValue);
};

export const removeSecureStorage = (key) => {
  uni.removeStorageSync(STORAGE_PREFIX + key);
};
```

### 问题 3：网络请求安全

**描述**：如果在 App 平台中网络请求配置不当，可能导致安全问题，如中间人攻击、数据泄露等。

**风险**：中风险，可能导致数据泄露，服务被滥用等后果。

**解决方案**：

1. **使用 HTTPS**：确保所有网络请求都使用 HTTPS 协议
2. **验证证书**：验证 SSL 证书，避免中间人攻击
3. **配置超时**：配置网络请求超时，避免请求挂起

```javascript
// utils/request.js
export const request = (url, options = {}) => {
  // 验证 URL 是否使用 HTTPS
  if (!url.startsWith('https://')) {
    throw new Error('只允许使用 HTTPS 协议');
  }
  
  // 配置默认选项
  const defaultOptions = {
    timeout: 10000,
    header: {
      'Content-Type': 'application/json'
    }
  };
  
  // 发送请求
  return uni.request({
    url,
    ...defaultOptions,
    ...options
  });
};
```

### 问题 4：权限滥用

**描述**：如果在 App 平台中不当申请和使用权限，可能导致用户隐私泄露。

**风险**：高风险，可能导致用户隐私泄露，违反应用商店规范等严重后果。

**解决方案**：

1. **最小化权限申请**：只申请必要的权限
2. **动态申请权限**：在需要时动态申请权限
3. **解释权限用途**：向用户解释权限的用途

```javascript
// utils/permission.js
export const requestPermission = (permission) => {
  return new Promise((resolve, reject) => {
    // 检查权限
    const result = uni.getSystemSettingSync().authSetting;
    if (result[permission]) {
      resolve(true);
      return;
    }
    
    // 申请权限
    uni.authorize({
      scope: permission,
      success: () => {
        resolve(true);
      },
      fail: () => {
        reject(new Error('权限申请失败'));
      }
    });
  });
};

export const requestLocationPermission = async () => {
  try {
    await requestPermission('scope.userLocation');
    return true;
  } catch (error) {
    console.error('位置权限申请失败:', error);
    return false;
  }
};
```

## 🛠️ 安全配置

### 推荐配置

```javascript
// manifest.json
{
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    },
    "modules": {},
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.INTERNET\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>"
        ],
        "abiFilters": ["armeabi-v7a", "arm64-v8a"]
      },
      "ios": {
        "idfa": false,
        "privacyDescription": {
          "NSPhotoLibraryUsageDescription": "需要访问您的相册",
          "NSCameraUsageDescription": "需要访问您的相机"
        }
      }
    }
  }
}
```

### 安全检查清单

- [x] 在页面卸载时清理资源
- [x] 避免使用全局变量存储数据
- [x] 使用弱引用存储对象
- [x] 对敏感信息进行加密后再存储
- [x] 使用原生存储 API
- [x] 限制存储范围，隔离不同类型的信息
- [x] 确保所有网络请求都使用 HTTPS 协议
- [x] 验证 SSL 证书
- [x] 配置网络请求超时
- [x] 只申请必要的权限
- [x] 在需要时动态申请权限
- [x] 向用户解释权限的用途

## 📚 最佳实践

1. **清理资源**：在页面卸载时清理所有资源，包括定时器、事件监听器等
2. **加密敏感信息**：对敏感信息进行加密后再存储
3. **使用原生存储 API**：使用原生存储 API，如 `uni.setStorage`、`uni.setStorageSync`
4. **使用 HTTPS**：确保所有网络请求都使用 HTTPS 协议
5. **最小化权限申请**：只申请必要的权限
6. **动态申请权限**：在需要时动态申请权限
7. **解释权限用途**：向用户解释权限的用途
8. **定期更新**：定期更新 uni-app 和相关依赖，获取最新的安全修复

## 📞 安全资源

- [uni-app 官方文档 - App](https://uniapp.dcloud.net.cn/tutorial/app.html)
- [uni-app 官方文档 - 权限](https://uniapp.dcloud.net.cn/api/permissions/permissions.html)
- [uni-app 官方文档 - 存储](https://uniapp.dcloud.net.cn/api/storage/storage.html)
- [OWASP 移动应用安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html)

## 📝 更新日志

- 2026-02-08：初始版本，添加 App 性能优化安全指南