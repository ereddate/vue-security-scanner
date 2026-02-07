# 加密实现

## 📋 概述

加密实现是指在前端应用中实际应用加密技术来保护数据安全。本指南提供了全面的加密实现指南，包括密钥管理、加密库选择、性能优化和错误处理等。

## 🎯 适用场景

加密实现适用于以下场景：

- 保护存储在本地的敏感数据
- 保护传输中的敏感数据
- 实现安全的用户认证
- 验证数据完整性
- 实现安全的通信

## 🔍 实现指南

### 1. 加密库选择

选择合适的加密库是加密实现的第一步。

#### 1.1 Web Crypto API

**优点**：
- 浏览器原生支持，无需额外依赖
- 提供安全的加密实现
- 性能优异
- 支持多种加密算法

**缺点**：
- API 相对复杂
- 浏览器兼容性问题（IE 不支持）

**适用场景**：
- 现代浏览器应用
- 需要高性能加密的场景
- 不想引入额外依赖的场景

#### 1.2 CryptoJS

**优点**：
- API 简单易用
- 支持多种加密算法
- 浏览器兼容性好

**缺点**：
- 不是浏览器原生实现
- 性能相对较差
- 需要引入额外依赖

**适用场景**：
- 需要简单 API 的场景
- 需要支持旧浏览器的场景
- 快速原型开发

#### 1.3 Forge

**优点**：
- 功能强大
- 支持多种加密算法和协议
- API 相对简单

**缺点**：
- 体积较大
- 不是浏览器原生实现
- 需要引入额外依赖

**适用场景**：
- 需要复杂加密功能的场景
- 需要支持多种协议的场景

### 2. 密钥管理

密钥管理是加密实现的关键挑战。

#### 2.1 密钥生成

```javascript
// 使用 Web Crypto API 生成密钥
async function generateKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
}

// 使用 CryptoJS 生成密钥
function generateKey(password) {
  return CryptoJS.SHA256(password).toString()
}
```

#### 2.2 密钥存储

```javascript
// 安全存储密钥
async function storeKey(key, keyName) {
  const exported = await window.crypto.subtle.exportKey('jwk', key)
  const encrypted = await encryptKey(JSON.stringify(exported))
  localStorage.setItem(keyName, encrypted)
}

// 安全加载密钥
async function loadKey(keyName) {
  const encrypted = localStorage.getItem(keyName)
  const decrypted = await decryptKey(encrypted)
  const keyData = JSON.parse(decrypted)
  return await window.crypto.subtle.importKey(
    'jwk',
    keyData,
    {
      name: 'AES-GCM'
    },
    true,
    ['encrypt', 'decrypt']
  )
}
```

#### 2.3 密钥轮换

```javascript
// 密钥轮换
async function rotateKey(oldKeyName, newKeyName) {
  // 生成新密钥
  const newKey = await generateKey()
  
  // 加载旧密钥
  const oldKey = await loadKey(oldKeyName)
  
  // 使用新密钥重新加密数据
  const data = await loadData(oldKey)
  const newData = await encryptData(data, newKey)
  
  // 存储新密钥和数据
  await storeKey(newKey, newKeyName)
  await saveData(newData, newKey)
  
  // 删除旧密钥
  localStorage.removeItem(oldKeyName)
}
```

### 3. 加密实现

#### 3.1 对称加密实现

```javascript
// 使用 Web Crypto API 实现对称加密
class SymmetricEncryption {
  constructor() {
    this.key = null
  }
  
  async init(password) {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    )
    
    this.key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    )
  }
  
  async encrypt(data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(data)
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      encoded
    )
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    }
  }
  
  async decrypt(encryptedData) {
    const iv = new Uint8Array(encryptedData.iv)
    const data = new Uint8Array(encryptedData.data)
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      data
    )
    
    return new TextDecoder().decode(decrypted)
  }
}
```

#### 3.2 非对称加密实现

```javascript
// 使用 Web Crypto API 实现非对称加密
class AsymmetricEncryption {
  constructor() {
    this.publicKey = null
    this.privateKey = null
  }
  
  async generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    )
    
    this.publicKey = keyPair.publicKey
    this.privateKey = keyPair.privateKey
    
    return keyPair
  }
  
  async encrypt(data, publicKey) {
    const encoded = new TextEncoder().encode(data)
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      publicKey || this.publicKey,
      encoded
    )
    
    return Array.from(new Uint8Array(encrypted))
  }
  
  async decrypt(encryptedData) {
    const data = new Uint8Array(encryptedData)
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
      this.privateKey,
      data
    )
    
    return new TextDecoder().decode(decrypted)
  }
  
  async exportPublicKey() {
    const exported = await window.crypto.subtle.exportKey('spki', this.publicKey)
    return btoa(String.fromCharCode(...new Uint8Array(exported)))
  }
  
  async importPublicKey(pem) {
    const binaryDerString = atob(pem)
    const binaryDer = new Uint8Array(binaryDerString.length)
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i)
    }
    
    this.publicKey = await window.crypto.subtle.importKey(
      'spki',
      binaryDer.buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['encrypt']
    )
  }
}
```

#### 3.3 哈希实现

```javascript
// 使用 Web Crypto API 实现哈希
class Hashing {
  static async sha256(data) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(data)
    
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex
  }
  
  static async sha512(data) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(data)
    
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex
  }
  
  static async hashPassword(password, salt, iterations = 100000) {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const saltBuffer = encoder.encode(salt)
    
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    )
    
    const hashBuffer = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    )
    
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex
  }
}
```

### 4. 性能优化

#### 4.1 使用 Web Workers

```javascript
// 加密 Web Worker
// workers/encryption.worker.js
self.onmessage = async (e) => {
  const { type, data, key, iv } = e.data
  
  try {
    let result
    if (type === 'encrypt') {
      result = await encryptData(data, key, iv)
    } else if (type === 'decrypt') {
      result = await decryptData(data, key, iv)
    }
    
    self.postMessage({ success: true, result })
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  }
}

async function encryptData(data, key, iv) {
  const encoder = new TextEncoder()
  const encoded = encoder.encode(data)
  
  const encrypted = await self.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encoded
  )
  
  return Array.from(new Uint8Array(encrypted))
}

async function decryptData(data, key, iv) {
  const decrypted = await self.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    new Uint8Array(data)
  )
  
  return new TextDecoder().decode(decrypted)
}

// 主线程使用 Web Worker
class EncryptionWorker {
  constructor() {
    this.worker = new Worker(new URL('./workers/encryption.worker.js', import.meta.url))
  }
  
  async encrypt(data, key, iv) {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.success) {
          resolve(e.data.result)
        } else {
          reject(new Error(e.data.error))
        }
      }
      
      this.worker.postMessage({ type: 'encrypt', data, key, iv })
    })
  }
  
  async decrypt(data, key, iv) {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.success) {
          resolve(e.data.result)
        } else {
          reject(new Error(e.data.error))
        }
      }
      
      this.worker.postMessage({ type: 'decrypt', data, key, iv })
    })
  }
}
```

#### 4.2 批量加密优化

```javascript
// 批量加密优化
class BatchEncryption {
  constructor(key) {
    this.key = key
    this.batchSize = 100
  }
  
  async encryptBatch(dataArray) {
    const results = []
    
    for (let i = 0; i < dataArray.length; i += this.batchSize) {
      const batch = dataArray.slice(i, i + this.batchSize)
      const batchResults = await Promise.all(
        batch.map(data => this.encrypt(data))
      )
      results.push(...batchResults)
    }
    
    return results
  }
  
  async encrypt(data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(data)
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      encoded
    )
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    }
  }
}
```

### 5. 错误处理

```javascript
// 加密错误处理
class EncryptionError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
    this.name = 'EncryptionError'
  }
}

class SecureEncryption {
  async encrypt(data) {
    try {
      // 加密逻辑
      return await this.doEncrypt(data)
    } catch (error) {
      if (error.name === 'OperationError') {
        throw new EncryptionError('加密操作失败', 'ENCRYPTION_FAILED')
      } else if (error.name === 'InvalidAccessError') {
        throw new EncryptionError('无效的密钥访问', 'INVALID_KEY_ACCESS')
      } else {
        throw new EncryptionError('未知错误', 'UNKNOWN_ERROR')
      }
    }
  }
  
  async decrypt(data) {
    try {
      // 解密逻辑
      return await this.doDecrypt(data)
    } catch (error) {
      if (error.name === 'OperationError') {
        throw new EncryptionError('解密操作失败', 'DECRYPTION_FAILED')
      } else if (error.name === 'InvalidAccessError') {
        throw new EncryptionError('无效的密钥访问', 'INVALID_KEY_ACCESS')
      } else {
        throw new EncryptionError('未知错误', 'UNKNOWN_ERROR')
      }
    }
  }
}
```

## 📚 代码示例

### Vue 3 完整示例

```vue
// src/composables/useSecureEncryption.js
import { ref, onMounted } from 'vue'

class SecureEncryption {
  constructor() {
    this.key = null
    this.isReady = false
  }
  
  async init(password) {
    try {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      )
      
      this.key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('vue-security-scanner-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      )
      
      this.isReady = true
    } catch (error) {
      console.error('加密初始化失败:', error)
      throw error
    }
  }
  
  async encrypt(data) {
    if (!this.isReady) {
      throw new Error('加密未初始化')
    }
    
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const encoded = new TextEncoder().encode(data)
      
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        encoded
      )
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)
      
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error('加密失败:', error)
      throw error
    }
  }
  
  async decrypt(encryptedData) {
    if (!this.isReady) {
      throw new Error('加密未初始化')
    }
    
    try {
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
      const iv = combined.slice(0, 12)
      const data = combined.slice(12)
      
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        data
      )
      
      return new TextDecoder().decode(decrypted)
    } catch (error) {
      console.error('解密失败:', error)
      throw error
    }
  }
}

export function useSecureEncryption(password) {
  const encryption = ref(null)
  const isReady = ref(false)
  const error = ref(null)
  
  onMounted(async () => {
    try {
      encryption.value = new SecureEncryption()
      await encryption.value.init(password)
      isReady.value = true
    } catch (err) {
      error.value = err.message
    }
  })
  
  const encrypt = async (data) => {
    if (!encryption.value) {
      throw new Error('加密未初始化')
    }
    return await encryption.value.encrypt(data)
  }
  
  const decrypt = async (encryptedData) => {
    if (!encryption.value) {
      throw new Error('加密未初始化')
    }
    return await encryption.value.decrypt(encryptedData)
  }
  
  return {
    isReady,
    error,
    encrypt,
    decrypt
  }
}
```

### React 完整示例

```jsx
// src/hooks/useSecureEncryption.js
import { useState, useEffect } from 'react'

class SecureEncryption {
  constructor() {
    this.key = null
    this.isReady = false
  }
  
  async init(password) {
    try {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      )
      
      this.key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('vue-security-scanner-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      )
      
      this.isReady = true
    } catch (error) {
      console.error('加密初始化失败:', error)
      throw error
    }
  }
  
  async encrypt(data) {
    if (!this.isReady) {
      throw new Error('加密未初始化')
    }
    
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const encoded = new TextEncoder().encode(data)
      
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        encoded
      )
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)
      
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error('加密失败:', error)
      throw error
    }
  }
  
  async decrypt(encryptedData) {
    if (!this.isReady) {
      throw new Error('加密未初始化')
    }
    
    try {
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
      const iv = combined.slice(0, 12)
      const data = combined.slice(12)
      
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        data
      )
      
      return new TextDecoder().decode(decrypted)
    } catch (error) {
      console.error('解密失败:', error)
      throw error
    }
  }
}

export function useSecureEncryption(password) {
  const [encryption, setEncryption] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const init = async () => {
      try {
        const enc = new SecureEncryption()
        await enc.init(password)
        setEncryption(enc)
        setIsReady(true)
      } catch (err) {
        setError(err.message)
      }
    }
    
    init()
  }, [password])
  
  const encrypt = async (data) => {
    if (!encryption) {
      throw new Error('加密未初始化')
    }
    return await encryption.encrypt(data)
  }
  
  const decrypt = async (encryptedData) => {
    if (!encryption) {
      throw new Error('加密未初始化')
    }
    return await encryption.decrypt(encryptedData)
  }
  
  return {
    isReady,
    error,
    encrypt,
    decrypt
  }
}
```

## 🛠️ 工具推荐

- **Web Crypto API**：浏览器原生的加密 API
- **CryptoJS**：流行的 JavaScript 加密库
- **Forge**：功能强大的加密库
- **Sodium**：现代的加密库
- **OpenPGP.js**：实现 OpenPGP 标准的库

## 📝 验证方法

验证加密实现是否正确的方法：

1. **加密解密测试**：测试加密和解密功能是否正常工作
2. **密钥管理测试**：测试密钥生成、存储和轮换是否安全
3. **性能测试**：测试加密和解密的性能是否满足要求
4. **安全性测试**：测试加密实现是否存在安全漏洞
5. **互操作性测试**：测试不同平台和浏览器之间的互操作性

## ⚠️ 常见错误

1. **密钥管理不当**：
   - **错误描述**：密钥管理不当，如硬编码密钥、密钥存储不安全等
   - **风险**：密钥可能被窃取，导致数据泄露
   - **解决方案**：使用安全的密钥管理方法

2. **使用不安全的加密算法**：
   - **错误描述**：使用已被破解或存在安全漏洞的加密算法
   - **风险**：数据可能被破解，导致信息泄露
   - **解决方案**：使用推荐的安全加密算法

3. **错误处理不当**：
   - **错误描述**：错误处理不当，如暴露敏感信息、记录密钥等
   - **风险**：可能泄露敏感信息或密钥
   - **解决方案**：正确处理错误，避免暴露敏感信息

4. **性能问题**：
   - **错误描述**：加密解密性能差，影响用户体验
   - **风险**：用户体验差，应用性能下降
   - **解决方案**：使用 Web Workers、批量加密等优化方法

## 📚 参考资料

- [Web Crypto API 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [CryptoJS 官方文档](https://cryptojs.gitbook.io/docs/)
- [Forge 官方文档](https://github.com/digitalbazaar/forge)
- [OWASP 加密备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [NIST 加密标准](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)