# 对称加密

## 📋 概述

对称加密（Symmetric Encryption）是一种加密方法，它使用相同的密钥进行加密和解密。对称加密速度快，适合加密大量数据，但密钥管理是主要挑战。本指南提供了在前端应用中使用对称加密的最佳实践。

## 🎯 适用场景

对称加密适用于以下场景：

- 加密存储在本地的敏感数据
- 加密传输中的大量数据
- 需要高性能加密的场景
- 密钥管理相对简单的场景

## 🔍 实现指南

### 步骤 1：选择加密算法

选择合适的对称加密算法是确保安全性的第一步。

1. **推荐算法**：
   - **AES-256-GCM**：当前最推荐的选择，提供认证加密
   - **AES-256-CBC**：广泛使用，但需要额外的认证机制
   - **ChaCha20-Poly1305**：在移动设备上性能优异

2. **避免使用**：
   - DES、3DES：密钥长度不足，已被破解
   - RC4：存在严重的安全漏洞
   - 自定义加密算法：安全性无法保证

### 步骤 2：密钥管理

密钥管理是对称加密的关键挑战。

1. **密钥生成**：
   - 使用密码学安全的随机数生成器生成密钥
   - 密钥长度应符合算法要求（如 AES-256 需要 256 位密钥）

2. **密钥存储**：
   - 不要将密钥硬编码在代码中
   - 使用安全的存储方式，如加密的 localStorage
   - 考虑使用密钥管理服务（KMS）

3. **密钥轮换**：
   - 定期轮换密钥
   - 实现密钥版本管理
   - 确保密钥轮换不影响现有数据

### 步骤 3：实现加密功能

在前端应用中实现对称加密功能。

1. **使用 Web Crypto API**：
   - Web Crypto API 是浏览器原生的加密 API
   - 提供安全的加密实现
   - 支持多种加密算法

2. **使用加密库**：
   - CryptoJS：流行的 JavaScript 加密库
   - Forge：功能强大的加密库
   - Sodium：现代的加密库

### 步骤 4：实现解密功能

在前端应用中实现对称解密功能。

1. **验证密文**：
   - 检查密文的完整性
   - 验证认证标签（如果使用 GCM 模式）

2. **处理解密错误**：
   - 提供清晰的错误信息
   - 记录解密失败事件
   - 实现重试机制

## 📚 代码示例

### 使用 Web Crypto API 实现 AES-GCM 加密

```javascript
// src/utils/encryption.js

// 生成随机密钥
export async function generateKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
}

// 导出密钥
export async function exportKey(key) {
  const exported = await window.crypto.subtle.exportKey('jwk', key)
  return JSON.stringify(exported)
}

// 导入密钥
export async function importKey(keyData) {
  const key = JSON.parse(keyData)
  return await window.crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: 'AES-GCM'
    },
    true,
    ['encrypt', 'decrypt']
  )
}

// 生成随机 IV
export function generateIV() {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

// 加密数据
export async function encrypt(data, key, iv) {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encodedData
  )
  
  return encrypted
}

// 解密数据
export async function decrypt(encryptedData, key, iv) {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encryptedData
  )
  
  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

// 加密并序列化（用于存储）
export async function encryptAndSerialize(data, key) {
  const iv = generateIV()
  const encrypted = await encrypt(data, key, iv)
  
  // 将 IV 和加密数据合并
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  // 转换为 Base64
  return btoa(String.fromCharCode(...combined))
}

// 反序列化并解密（用于读取）
export async function deserializeAndDecrypt(serializedData, key) {
  // 从 Base64 转换
  const combined = Uint8Array.from(atob(serializedData), c => c.charCodeAt(0))
  
  // 提取 IV 和加密数据
  const iv = combined.slice(0, 12)
  const encryptedData = combined.slice(12)
  
  return await decrypt(encryptedData, key, iv)
}

// Vue 3 组合式函数示例
// src/composables/useEncryption.js
import { ref, onMounted } from 'vue'
import { generateKey, exportKey, importKey, encryptAndSerialize, deserializeAndDecrypt } from '../utils/encryption'

export function useEncryption() {
  const key = ref(null)
  const isReady = ref(false)
  
  // 初始化密钥
  const initKey = async () => {
    // 尝试从存储中加载密钥
    const storedKey = localStorage.getItem('encryptionKey')
    
    if (storedKey) {
      key.value = await importKey(storedKey)
    } else {
      key.value = await generateKey()
      const exportedKey = await exportKey(key.value)
      localStorage.setItem('encryptionKey', exportedKey)
    }
    
    isReady.value = true
  }
  
  // 加密数据
  const encryptData = async (data) => {
    if (!isReady.value) {
      throw new Error('加密未初始化')
    }
    return await encryptAndSerialize(data, key.value)
  }
  
  // 解密数据
  const decryptData = async (encryptedData) => {
    if (!isReady.value) {
      throw new Error('加密未初始化')
    }
    return await deserializeAndDecrypt(encryptedData, key.value)
  }
  
  onMounted(() => {
    initKey()
  })
  
  return {
    isReady,
    encryptData,
    decryptData
  }
}

// 使用示例
// src/components/SecureStorage.vue
<template>
  <div>
    <h2>安全存储</h2>
    <div v-if="isReady">
      <input v-model="inputData" placeholder="输入要加密的数据" />
      <button @click="saveData">保存</button>
      <button @click="loadData">加载</button>
      <div v-if="decryptedData">
        <p>解密后的数据: {{ decryptedData }}</p>
      </div>
    </div>
    <div v-else>
      <p>正在初始化加密...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEncryption } from '../composables/useEncryption'

const inputData = ref('')
const decryptedData = ref('')
const { isReady, encryptData, decryptData } = useEncryption()

const saveData = async () => {
  try {
    const encrypted = await encryptData(inputData.value)
    localStorage.setItem('secureData', encrypted)
    alert('数据已加密保存')
  } catch (error) {
    console.error('加密错误:', error)
    alert('加密失败')
  }
}

const loadData = async () => {
  try {
    const encrypted = localStorage.getItem('secureData')
    if (encrypted) {
      decryptedData.value = await decryptData(encrypted)
    }
  } catch (error) {
    console.error('解密错误:', error)
    alert('解密失败')
  }
}
</script>
```

### 使用 CryptoJS 实现 AES 加密

```javascript
// src/utils/cryptojs-encryption.js
import CryptoJS from 'crypto-js'

// 生成密钥
export function generateKey(password) {
  return CryptoJS.SHA256(password).toString()
}

// 加密数据
export function encrypt(data, key) {
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  
  // 将 IV 和加密数据合并
  const combined = iv.concat(encrypted.ciphertext)
  
  // 转换为 Base64
  return combined.toString(CryptoJS.enc.Base64)
}

// 解密数据
export function decrypt(encryptedData, key) {
  // 从 Base64 转换
  const combined = CryptoJS.enc.Base64.parse(encryptedData)
  
  // 提取 IV 和加密数据
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4))
  const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4))
  
  // 解密
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext },
    CryptoJS.enc.Hex.parse(key),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// React Hook 示例
// src/hooks/useCryptoJSEncryption.js
import { useState, useEffect } from 'react'
import { generateKey, encrypt, decrypt } from '../utils/cryptojs-encryption'

export function useCryptoJSEncryption(password) {
  const [key, setKey] = useState(null)
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const initKey = () => {
      const newKey = generateKey(password)
      setKey(newKey)
      setIsReady(true)
    }
    
    initKey()
  }, [password])
  
  const encryptData = (data) => {
    if (!isReady) {
      throw new Error('加密未初始化')
    }
    return encrypt(data, key)
  }
  
  const decryptData = (encryptedData) => {
    if (!isReady) {
      throw new Error('加密未初始化')
    }
    return decrypt(encryptedData, key)
  }
  
  return {
    isReady,
    encryptData,
    decryptData
  }
}

// 使用示例
// src/components/SecureStorage.jsx
import React, { useState } from 'react'
import { useCryptoJSEncryption } from '../hooks/useCryptoJSEncryption'

const SecureStorage = () => {
  const [inputData, setInputData] = useState('')
  const [decryptedData, setDecryptedData] = useState('')
  const { isReady, encryptData, decryptData } = useCryptoJSEncryption('my-secret-password')
  
  const saveData = () => {
    try {
      const encrypted = encryptData(inputData)
      localStorage.setItem('secureData', encrypted)
      alert('数据已加密保存')
    } catch (error) {
      console.error('加密错误:', error)
      alert('加密失败')
    }
  }
  
  const loadData = () => {
    try {
      const encrypted = localStorage.getItem('secureData')
      if (encrypted) {
        const decrypted = decryptData(encrypted)
        setDecryptedData(decrypted)
      }
    } catch (error) {
      console.error('解密错误:', error)
      alert('解密失败')
    }
  }
  
  if (!isReady) {
    return <p>正在初始化加密...</p>
  }
  
  return (
    <div>
      <h2>安全存储</h2>
      <input
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="输入要加密的数据"
      />
      <button onClick={saveData}>保存</button>
      <button onClick={loadData}>加载</button>
      {decryptedData && <p>解密后的数据: {decryptedData}</p>}
    </div>
  )
}

export default SecureStorage
```

## 🛠️ 工具推荐

- **Web Crypto API**：浏览器原生的加密 API，提供安全的加密实现
- **CryptoJS**：流行的 JavaScript 加密库，支持多种加密算法
- **Forge**：功能强大的加密库，支持多种加密算法和协议
- **Sodium**：现代的加密库，提供简单易用的 API
- **AWS KMS**：AWS 密钥管理服务，提供安全的密钥管理
- **Azure Key Vault**：Azure 密钥管理服务，提供安全的密钥管理

## 📝 验证方法

验证对称加密实现是否正确的方法：

1. **加密解密测试**：测试加密和解密功能是否正常工作
2. **密钥管理测试**：测试密钥生成、存储和轮换是否安全
3. **性能测试**：测试加密和解密的性能是否满足要求
4. **安全性测试**：测试加密实现是否存在安全漏洞
5. **互操作性测试**：测试不同平台和浏览器之间的互操作性

## ⚠️ 常见错误

1. **使用不安全的加密算法**：
   - **错误描述**：使用已被破解或存在安全漏洞的加密算法
   - **风险**：数据可能被破解，导致信息泄露
   - **解决方案**：使用推荐的安全加密算法，如 AES-256-GCM

2. **密钥管理不当**：
   - **错误描述**：密钥管理不当，如硬编码密钥、密钥存储不安全等
   - **风险**：密钥可能被窃取，导致数据泄露
   - **解决方案**：使用安全的密钥管理方法，如密钥管理服务

3. **IV 重复使用**：
   - **错误描述**：重复使用相同的 IV 进行加密
   - **风险**：可能泄露加密模式，降低加密安全性
   - **解决方案**：每次加密都使用新的随机 IV

4. **缺少认证**：
   - **错误描述**：使用不提供认证的加密模式，如 CBC 模式
   - **风险**：密文可能被篡改而不被发现
   - **解决方案**：使用提供认证的加密模式，如 GCM 模式

5. **错误处理不当**：
   - **错误描述**：错误处理不当，如暴露敏感信息、记录密钥等
   - **风险**：可能泄露敏感信息或密钥
   - **解决方案**：正确处理错误，避免暴露敏感信息

## 📚 参考资料

- [Web Crypto API 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [CryptoJS 官方文档](https://cryptojs.gitbook.io/docs/)
- [Forge 官方文档](https://github.com/digitalbazaar/forge)
- [OWASP 加密备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [NIST 加密标准](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [AES 加密标准](https://csrc.nist.gov/publications/detail/fips/197/final)