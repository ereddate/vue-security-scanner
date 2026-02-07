# 非对称加密

## 📋 概述

非对称加密（Asymmetric Encryption）是一种加密方法，它使用一对密钥：公钥和私钥。公钥用于加密，私钥用于解密。非对称加密适合密钥交换和数字签名，但速度较慢。本指南提供了在前端应用中使用非对称加密的最佳实践。

## 🎯 适用场景

非对称加密适用于以下场景：

- 密钥交换：安全地交换对称加密的密钥
- 数字签名：验证数据的完整性和来源
- 小量数据加密：加密少量敏感数据
- 身份验证：验证用户身份

## 🔍 实现指南

### 步骤 1：选择加密算法

选择合适的非对称加密算法是确保安全性的第一步。

1. **推荐算法**：
   - **RSA-2048/4096**：广泛使用，适合密钥交换和数字签名
   - **ECDSA**：椭圆曲线数字签名算法，性能优异
   - **ECDH**：椭圆曲线密钥交换算法，适合密钥交换

2. **避免使用**：
   - RSA-1024 及以下：密钥长度不足，已被破解
   - DSA：存在安全漏洞
   - 自定义加密算法：安全性无法保证

### 步骤 2：密钥对生成

生成安全的密钥对是非对称加密的基础。

1. **密钥长度**：
   - RSA：至少 2048 位，推荐 4096 位
   - ECC：至少 256 位

2. **密钥生成**：
   - 使用密码学安全的随机数生成器
   - 在可信的环境中生成密钥对
   - 安全地存储私钥

### 步骤 3：密钥管理

密钥管理是非对称加密的关键挑战。

1. **私钥存储**：
   - 不要将私钥硬编码在代码中
   - 使用安全的存储方式，如加密的 localStorage
   - 考虑使用硬件安全模块（HSM）

2. **公钥分发**：
   - 公钥可以公开分发
   - 使用证书验证公钥的真实性
   - 建立公钥基础设施（PKI）

3. **密钥轮换**：
   - 定期轮换密钥对
   - 实现密钥版本管理
   - 确保密钥轮换不影响现有数据

### 步骤 4：实现加密功能

在前端应用中实现非对称加密功能。

1. **使用 Web Crypto API**：
   - Web Crypto API 是浏览器原生的加密 API
   - 提供安全的加密实现
   - 支持多种加密算法

2. **使用加密库**：
   - Forge：功能强大的加密库
   - JSEncrypt：专注于 RSA 加密的库
   - OpenPGP.js：实现 OpenPGP 标准的库

### 步骤 5：实现解密功能

在前端应用中实现非对称解密功能。

1. **验证密文**：
   - 检查密文的完整性
   - 验证数字签名（如果存在）

2. **处理解密错误**：
   - 提供清晰的错误信息
   - 记录解密失败事件
   - 实现重试机制

## 📚 代码示例

### 使用 Web Crypto API 实现 RSA 加密

```javascript
// src/utils/rsa-encryption.js

// 生成 RSA 密钥对
export async function generateRSAKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  )
}

// 导出公钥
export async function exportPublicKey(publicKey) {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey)
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

// 导出私钥
export async function exportPrivateKey(privateKey) {
  const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey)
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

// 导入公钥
export async function importPublicKey(pem) {
  const binaryDerString = atob(pem)
  const binaryDer = new Uint8Array(binaryDerString.length)
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i)
  }
  
  return await window.crypto.subtle.importKey(
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

// 导入私钥
export async function importPrivateKey(pem) {
  const binaryDerString = atob(pem)
  const binaryDer = new Uint8Array(binaryDerString.length)
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i)
  }
  
  return await window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  )
}

// 使用公钥加密
export async function encryptWithPublicKey(data, publicKey) {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    publicKey,
    encodedData
  )
  
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

// 使用私钥解密
export async function decryptWithPrivateKey(encryptedData, privateKey) {
  const binaryString = atob(encryptedData)
  const binary = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    binary[i] = binaryString.charCodeAt(i)
  }
  
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    privateKey,
    binary.buffer
  )
  
  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

// Vue 3 组合式函数示例
// src/composables/useRSAEncryption.js
import { ref, onMounted } from 'vue'
import {
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  encryptWithPublicKey,
  decryptWithPrivateKey
} from '../utils/rsa-encryption'

export function useRSAEncryption() {
  const publicKey = ref(null)
  const privateKey = ref(null)
  const isReady = ref(false)
  
  // 初始化密钥对
  const initKeyPair = async () => {
    // 尝试从存储中加载密钥对
    const storedPublicKey = localStorage.getItem('rsaPublicKey')
    const storedPrivateKey = localStorage.getItem('rsaPrivateKey')
    
    if (storedPublicKey && storedPrivateKey) {
      publicKey.value = await importPublicKey(storedPublicKey)
      privateKey.value = await importPrivateKey(storedPrivateKey)
    } else {
      const keyPair = await generateRSAKeyPair()
      publicKey.value = keyPair.publicKey
      privateKey.value = keyPair.privateKey
      
      const exportedPublicKey = await exportPublicKey(publicKey.value)
      const exportedPrivateKey = await exportPrivateKey(privateKey.value)
      
      localStorage.setItem('rsaPublicKey', exportedPublicKey)
      localStorage.setItem('rsaPrivateKey', exportedPrivateKey)
    }
    
    isReady.value = true
  }
  
  // 获取公钥（用于分享）
  const getPublicKey = async () => {
    if (!publicKey.value) {
      throw new Error('公钥未初始化')
    }
    return await exportPublicKey(publicKey.value)
  }
  
  // 加密数据
  const encryptData = async (data, recipientPublicKey) => {
    if (!isReady.value) {
      throw new Error('加密未初始化')
    }
    
    let key = recipientPublicKey
    if (typeof recipientPublicKey === 'string') {
      key = await importPublicKey(recipientPublicKey)
    }
    
    return await encryptWithPublicKey(data, key)
  }
  
  // 解密数据
  const decryptData = async (encryptedData) => {
    if (!isReady.value) {
      throw new Error('加密未初始化')
    }
    return await decryptWithPrivateKey(encryptedData, privateKey.value)
  }
  
  onMounted(() => {
    initKeyPair()
  })
  
  return {
    isReady,
    getPublicKey,
    encryptData,
    decryptData
  }
}

// 使用示例
// src/components/SecureMessaging.vue
<template>
  <div>
    <h2>安全消息</h2>
    <div v-if="isReady">
      <div>
        <h3>我的公钥</h3>
        <textarea v-model="myPublicKey" readonly></textarea>
        <button @click="copyPublicKey">复制公钥</button>
      </div>
      <div>
        <h3>加密消息</h3>
        <input v-model="recipientPublicKey" placeholder="输入接收者的公钥" />
        <input v-model="message" placeholder="输入要加密的消息" />
        <button @click="encryptMessage">加密</button>
        <div v-if="encryptedMessage">
          <p>加密后的消息:</p>
          <textarea v-model="encryptedMessage" readonly></textarea>
        </div>
      </div>
      <div>
        <h3>解密消息</h3>
        <textarea v-model="encryptedMessageToDecrypt" placeholder="输入要解密的消息"></textarea>
        <button @click="decryptMessage">解密</button>
        <div v-if="decryptedMessage">
          <p>解密后的消息: {{ decryptedMessage }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>正在初始化加密...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRSAEncryption } from '../composables/useRSAEncryption'

const recipientPublicKey = ref('')
const message = ref('')
const encryptedMessage = ref('')
const encryptedMessageToDecrypt = ref('')
const decryptedMessage = ref('')
const myPublicKey = ref('')

const { isReady, getPublicKey, encryptData, decryptData } = useRSAEncryption()

const copyPublicKey = async () => {
  const publicKey = await getPublicKey()
  await navigator.clipboard.writeText(publicKey)
  alert('公钥已复制到剪贴板')
}

const encryptMessage = async () => {
  try {
    encryptedMessage.value = await encryptData(message.value, recipientPublicKey.value)
    alert('消息已加密')
  } catch (error) {
    console.error('加密错误:', error)
    alert('加密失败')
  }
}

const decryptMessage = async () => {
  try {
    decryptedMessage.value = await decryptData(encryptedMessageToDecrypt.value)
  } catch (error) {
    console.error('解密错误:', error)
    alert('解密失败')
  }
}

// 获取并显示公钥
const loadPublicKey = async () => {
  myPublicKey.value = await getPublicKey()
}

loadPublicKey()
</script>
```

### 使用 JSEncrypt 实现 RSA 加密

```javascript
// src/utils/jsencrypt-encryption.js
import JSEncrypt from 'jsencrypt'

// 生成密钥对
export function generateKeyPair() {
  const crypt = new JSEncrypt({ default_key_size: 2048 })
  return {
    publicKey: crypt.getPublicKey(),
    privateKey: crypt.getPrivateKey()
  }
}

// 使用公钥加密
export function encryptWithPublicKey(data, publicKey) {
  const crypt = new JSEncrypt()
  crypt.setPublicKey(publicKey)
  return crypt.encrypt(data)
}

// 使用私钥解密
export function decryptWithPrivateKey(encryptedData, privateKey) {
  const crypt = new JSEncrypt()
  crypt.setPrivateKey(privateKey)
  return crypt.decrypt(encryptedData)
}

// React Hook 示例
// src/hooks/useJSEncrypt.js
import { useState, useEffect } from 'react'
import { generateKeyPair, encryptWithPublicKey, decryptWithPrivateKey } from '../utils/jsencrypt-encryption'

export function useJSEncrypt() {
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const initKeyPair = () => {
      // 尝试从存储中加载密钥对
      const storedPublicKey = localStorage.getItem('jsencryptPublicKey')
      const storedPrivateKey = localStorage.getItem('jsencryptPrivateKey')
      
      if (storedPublicKey && storedPrivateKey) {
        setPublicKey(storedPublicKey)
        setPrivateKey(storedPrivateKey)
      } else {
        const keyPair = generateKeyPair()
        setPublicKey(keyPair.publicKey)
        setPrivateKey(keyPair.privateKey)
        
        localStorage.setItem('jsencryptPublicKey', keyPair.publicKey)
        localStorage.setItem('jsencryptPrivateKey', keyPair.privateKey)
      }
      
      setIsReady(true)
    }
    
    initKeyPair()
  }, [])
  
  const encryptData = (data, recipientPublicKey) => {
    if (!isReady) {
      throw new Error('加密未初始化')
    }
    return encryptWithPublicKey(data, recipientPublicKey)
  }
  
  const decryptData = (encryptedData) => {
    if (!isReady) {
      throw new Error('加密未初始化')
    }
    return decryptWithPrivateKey(encryptedData, privateKey)
  }
  
  return {
    isReady,
    publicKey,
    encryptData,
    decryptData
  }
}

// 使用示例
// src/components/SecureMessaging.jsx
import React, { useState } from 'react'
import { useJSEncrypt } from '../hooks/useJSEncrypt'

const SecureMessaging = () => {
  const [recipientPublicKey, setRecipientPublicKey] = useState('')
  const [message, setMessage] = useState('')
  const [encryptedMessage, setEncryptedMessage] = useState('')
  const [encryptedMessageToDecrypt, setEncryptedMessageToDecrypt] = useState('')
  const [decryptedMessage, setDecryptedMessage] = useState('')
  
  const { isReady, publicKey, encryptData, decryptData } = useJSEncrypt()
  
  const copyPublicKey = async () => {
    await navigator.clipboard.writeText(publicKey)
    alert('公钥已复制到剪贴板')
  }
  
  const encryptMessage = () => {
    try {
      setEncryptedMessage(encryptData(message, recipientPublicKey))
      alert('消息已加密')
    } catch (error) {
      console.error('加密错误:', error)
      alert('加密失败')
    }
  }
  
  const decryptMessage = () => {
    try {
      setDecryptedMessage(decryptData(encryptedMessageToDecrypt))
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
      <h2>安全消息</h2>
      <div>
        <h3>我的公钥</h3>
        <textarea value={publicKey} readOnly />
        <button onClick={copyPublicKey}>复制公钥</button>
      </div>
      <div>
        <h3>加密消息</h3>
        <input
          value={recipientPublicKey}
          onChange={(e) => setRecipientPublicKey(e.target.value)}
          placeholder="输入接收者的公钥"
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入要加密的消息"
        />
        <button onClick={encryptMessage}>加密</button>
        {encryptedMessage && (
          <div>
            <p>加密后的消息:</p>
            <textarea value={encryptedMessage} readOnly />
          </div>
        )}
      </div>
      <div>
        <h3>解密消息</h3>
        <textarea
          value={encryptedMessageToDecrypt}
          onChange={(e) => setEncryptedMessageToDecrypt(e.target.value)}
          placeholder="输入要解密的消息"
        />
        <button onClick={decryptMessage}>解密</button>
        {decryptedMessage && <p>解密后的消息: {decryptedMessage}</p>}
      </div>
    </div>
  )
}

export default SecureMessaging
```

## 🛠️ 工具推荐

- **Web Crypto API**：浏览器原生的加密 API，提供安全的加密实现
- **JSEncrypt**：专注于 RSA 加密的 JavaScript 库
- **Forge**：功能强大的加密库，支持多种加密算法和协议
- **OpenPGP.js**：实现 OpenPGP 标准的库
- **AWS KMS**：AWS 密钥管理服务，提供安全的密钥管理
- **Azure Key Vault**：Azure 密钥管理服务，提供安全的密钥管理

## 📝 验证方法

验证非对称加密实现是否正确的方法：

1. **加密解密测试**：测试加密和解密功能是否正常工作
2. **密钥管理测试**：测试密钥生成、存储和轮换是否安全
3. **性能测试**：测试加密和解密的性能是否满足要求
4. **安全性测试**：测试加密实现是否存在安全漏洞
5. **互操作性测试**：测试不同平台和浏览器之间的互操作性

## ⚠️ 常见错误

1. **使用不安全的加密算法**：
   - **错误描述**：使用已被破解或存在安全漏洞的加密算法
   - **风险**：数据可能被破解，导致信息泄露
   - **解决方案**：使用推荐的安全加密算法，如 RSA-2048/4096

2. **密钥长度不足**：
   - **错误描述**：使用密钥长度不足的密钥对
   - **风险**：密钥可能被破解，导致数据泄露
   - **解决方案**：使用足够的密钥长度，如 RSA-2048 或更高

3. **私钥管理不当**：
   - **错误描述**：私钥管理不当，如硬编码私钥、私钥存储不安全等
   - **风险**：私钥可能被窃取，导致数据泄露
   - **解决方案**：使用安全的私钥管理方法，如硬件安全模块（HSM）

4. **加密大量数据**：
   - **错误描述**：使用非对称加密加密大量数据
   - **风险**：性能差，效率低
   - **解决方案**：使用非对称加密加密对称密钥，然后使用对称加密加密数据

5. **错误处理不当**：
   - **错误描述**：错误处理不当，如暴露敏感信息、记录私钥等
   - **风险**：可能泄露敏感信息或私钥
   - **解决方案**：正确处理错误，避免暴露敏感信息

## 📚 参考资料

- [Web Crypto API 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [JSEncrypt 官方文档](https://travistidwell.com/jsencrypt/)
- [Forge 官方文档](https://github.com/digitalbazaar/forge)
- [OpenPGP.js 官方文档](https://openpgpjs.org/)
- [OWASP 加密备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [NIST 加密标准](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [PKCS #1: RSA Cryptography Specifications](https://tools.ietf.org/html/rfc8017)