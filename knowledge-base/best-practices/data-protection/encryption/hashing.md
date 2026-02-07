# 哈希算法

## 📋 概述

哈希算法（Hashing）是一种将任意长度的数据转换为固定长度数据的算法。哈希算法广泛用于密码存储、数据完整性验证和数字签名等场景。本指南提供了在前端应用中使用哈希算法的最佳实践。

## 🎯 适用场景

哈希算法适用于以下场景：

- 密码存储：安全地存储用户密码
- 数据完整性验证：验证数据是否被篡改
- 数字签名：生成数字签名
- 快速查找：使用哈希表进行快速查找
- 文件校验：验证文件的完整性

## 🔍 实现指南

### 步骤 1：选择哈希算法

选择合适的哈希算法是确保安全性的第一步。

1. **推荐算法**：
   - **SHA-256**：广泛使用，安全性高
   - **SHA-384**：比 SHA-256 更安全
   - **SHA-512**：安全性最高
   - **Argon2**：专门为密码哈希设计，抗暴力破解

2. **避免使用**：
   - MD5：已被破解，不安全
   - SHA-1：已被破解，不安全
   - 自定义哈希算法：安全性无法保证

### 步骤 2：密码哈希

密码哈希需要特别注意，因为密码是敏感信息。

1. **使用加盐**：
   - 为每个密码生成唯一的盐值
   - 将盐值与密码一起哈希
   - 存储盐值和哈希值

2. **使用慢哈希**：
   - 使用计算密集型的哈希算法
   - 增加暴力破解的难度
   - 如 Argon2、bcrypt、PBKDF2

3. **避免可逆哈希**：
   - 不要使用可逆的哈希算法
   - 不要使用加密算法代替哈希算法
   - 确保哈希是不可逆的

### 步骤 3：数据完整性验证

使用哈希算法验证数据的完整性。

1. **生成哈希**：
   - 为数据生成哈希值
   - 存储哈希值和数据
   - 使用安全的哈希算法

2. **验证哈希**：
   - 重新计算数据的哈希值
   - 与存储的哈希值比较
   - 如果匹配，数据未被篡改

### 步骤 4：实现哈希功能

在前端应用中实现哈希功能。

1. **使用 Web Crypto API**：
   - Web Crypto API 是浏览器原生的加密 API
   - 提供安全的哈希实现
   - 支持多种哈希算法

2. **使用哈希库**：
   - CryptoJS：流行的 JavaScript 加密库
   - Forge：功能强大的加密库
   - argon2-browser：Argon2 的浏览器实现

## 📚 代码示例

### 使用 Web Crypto API 实现 SHA-256 哈希

```javascript
// src/utils/hashing.js

// 使用 SHA-256 哈希数据
export async function sha256(data) {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

// 使用 SHA-384 哈希数据
export async function sha384(data) {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-384', encodedData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

// 使用 SHA-512 哈希数据
export async function sha512(data) {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-512', encodedData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

// 生成随机盐值
export function generateSalt(length = 16) {
  const salt = window.crypto.getRandomValues(new Uint8Array(length))
  return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
}

// 使用 PBKDF2 哈希密码
export async function hashPassword(password, salt, iterations = 100000) {
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

// 验证密码
export async function verifyPassword(password, salt, hash) {
  const computedHash = await hashPassword(password, salt)
  return computedHash === hash
}

// Vue 3 组合式函数示例
// src/composables/useHashing.js
import { sha256, sha384, sha512, generateSalt, hashPassword, verifyPassword } from '../utils/hashing'

export function useHashing() {
  // 哈希数据
  const hashData = async (data, algorithm = 'sha256') => {
    switch (algorithm) {
      case 'sha256':
        return await sha256(data)
      case 'sha384':
        return await sha384(data)
      case 'sha512':
        return await sha512(data)
      default:
        throw new Error('不支持的哈希算法')
    }
  }
  
  // 哈希密码
  const hashUserPassword = async (password) => {
    const salt = generateSalt()
    const hash = await hashPassword(password, salt)
    return {
      salt,
      hash
    }
  }
  
  // 验证密码
  const verifyUserPassword = async (password, salt, hash) => {
    return await verifyPassword(password, salt, hash)
  }
  
  return {
    hashData,
    hashUserPassword,
    verifyUserPassword
  }
}

// 使用示例
// src/components/PasswordManager.vue
<template>
  <div>
    <h2>密码管理</h2>
    <div>
      <h3>注册</h3>
      <input v-model="registerPassword" type="password" placeholder="输入密码" />
      <button @click="register">注册</button>
      <div v-if="registeredUser">
        <p>盐值: {{ registeredUser.salt }}</p>
        <p>哈希值: {{ registeredUser.hash }}</p>
      </div>
    </div>
    <div>
      <h3>登录</h3>
      <input v-model="loginPassword" type="password" placeholder="输入密码" />
      <input v-model="loginSalt" placeholder="输入盐值" />
      <input v-model="loginHash" placeholder="输入哈希值" />
      <button @click="login">登录</button>
      <div v-if="loginResult">
        <p>{{ loginResult }}</p>
      </div>
    </div>
    <div>
      <h3>数据哈希</h3>
      <input v-model="dataToHash" placeholder="输入要哈希的数据" />
      <button @click="hashData">哈希</button>
      <div v-if="hashedData">
        <p>SHA-256: {{ hashedData.sha256 }}</p>
        <p>SHA-384: {{ hashedData.sha384 }}</p>
        <p>SHA-512: {{ hashedData.sha512 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHashing } from '../composables/useHashing'

const registerPassword = ref('')
const registeredUser = ref(null)
const loginPassword = ref('')
const loginSalt = ref('')
const loginHash = ref('')
const loginResult = ref('')
const dataToHash = ref('')
const hashedData = ref(null)

const { hashData: hashDataFunc, hashUserPassword, verifyUserPassword } = useHashing()

const register = async () => {
  registeredUser.value = await hashUserPassword(registerPassword.value)
}

const login = async () => {
  const isValid = await verifyUserPassword(loginPassword.value, loginSalt.value, loginHash.value)
  loginResult.value = isValid ? '登录成功' : '密码错误'
}

const hashData = async () => {
  hashedData.value = {
    sha256: await hashDataFunc(dataToHash.value, 'sha256'),
    sha384: await hashDataFunc(dataToHash.value, 'sha384'),
    sha512: await hashDataFunc(dataToHash.value, 'sha512')
  }
}
</script>
```

### 使用 CryptoJS 实现 SHA 哈希

```javascript
// src/utils/cryptojs-hashing.js
import CryptoJS from 'crypto-js'

// 使用 SHA-256 哈希数据
export function sha256(data) {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex)
}

// 使用 SHA-384 哈希数据
export function sha384(data) {
  return CryptoJS.SHA384(data).toString(CryptoJS.enc.Hex)
}

// 使用 SHA-512 哈希数据
export function sha512(data) {
  return CryptoJS.SHA512(data).toString(CryptoJS.enc.Hex)
}

// 生成随机盐值
export function generateSalt(length = 16) {
  return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex)
}

// 使用 PBKDF2 哈希密码
export function hashPassword(password, salt, iterations = 100000) {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: iterations
  }).toString(CryptoJS.enc.Hex)
}

// 验证密码
export function verifyPassword(password, salt, hash) {
  const computedHash = hashPassword(password, salt)
  return computedHash === hash
}

// React Hook 示例
// src/hooks/useCryptoJSHashing.js
import { sha256, sha384, sha512, generateSalt, hashPassword, verifyPassword } from '../utils/cryptojs-hashing'

export function useCryptoJSHashing() {
  // 哈希数据
  const hashData = (data, algorithm = 'sha256') => {
    switch (algorithm) {
      case 'sha256':
        return sha256(data)
      case 'sha384':
        return sha384(data)
      case 'sha512':
        return sha512(data)
      default:
        throw new Error('不支持的哈希算法')
    }
  }
  
  // 哈希密码
  const hashUserPassword = (password) => {
    const salt = generateSalt()
    const hash = hashPassword(password, salt)
    return {
      salt,
      hash
    }
  }
  
  // 验证密码
  const verifyUserPassword = (password, salt, hash) => {
    return verifyPassword(password, salt, hash)
  }
  
  return {
    hashData,
    hashUserPassword,
    verifyUserPassword
  }
}

// 使用示例
// src/components/PasswordManager.jsx
import React, { useState } from 'react'
import { useCryptoJSHashing } from '../hooks/useCryptoJSHashing'

const PasswordManager = () => {
  const [registerPassword, setRegisterPassword] = useState('')
  const [registeredUser, setRegisteredUser] = useState(null)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginSalt, setLoginSalt] = useState('')
  const [loginHash, setLoginHash] = useState('')
  const [loginResult, setLoginResult] = useState('')
  const [dataToHash, setDataToHash] = useState('')
  const [hashedData, setHashedData] = useState(null)
  
  const { hashData: hashDataFunc, hashUserPassword, verifyUserPassword } = useCryptoJSHashing()
  
  const register = () => {
    setRegisteredUser(hashUserPassword(registerPassword))
  }
  
  const login = () => {
    const isValid = verifyUserPassword(loginPassword, loginSalt, loginHash)
    setLoginResult(isValid ? '登录成功' : '密码错误')
  }
  
  const handleHashData = () => {
    setHashedData({
      sha256: hashDataFunc(dataToHash, 'sha256'),
      sha384: hashDataFunc(dataToHash, 'sha384'),
      sha512: hashDataFunc(dataToHash, 'sha512')
    })
  }
  
  return (
    <div>
      <h2>密码管理</h2>
      <div>
        <h3>注册</h3>
        <input
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          placeholder="输入密码"
        />
        <button onClick={register}>注册</button>
        {registeredUser && (
          <div>
            <p>盐值: {registeredUser.salt}</p>
            <p>哈希值: {registeredUser.hash}</p>
          </div>
        )}
      </div>
      <div>
        <h3>登录</h3>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="输入密码"
        />
        <input
          value={loginSalt}
          onChange={(e) => setLoginSalt(e.target.value)}
          placeholder="输入盐值"
        />
        <input
          value={loginHash}
          onChange={(e) => setLoginHash(e.target.value)}
          placeholder="输入哈希值"
        />
        <button onClick={login}>登录</button>
        {loginResult && <p>{loginResult}</p>}
      </div>
      <div>
        <h3>数据哈希</h3>
        <input
          value={dataToHash}
          onChange={(e) => setDataToHash(e.target.value)}
          placeholder="输入要哈希的数据"
        />
        <button onClick={handleHashData}>哈希</button>
        {hashedData && (
          <div>
            <p>SHA-256: {hashedData.sha256}</p>
            <p>SHA-384: {hashedData.sha384}</p>
            <p>SHA-512: {hashedData.sha512}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PasswordManager
```

## 🛠️ 工具推荐

- **Web Crypto API**：浏览器原生的加密 API，提供安全的哈希实现
- **CryptoJS**：流行的 JavaScript 加密库，支持多种哈希算法
- **Forge**：功能强大的加密库，支持多种哈希算法
- **argon2-browser**：Argon2 的浏览器实现
- **bcryptjs**：bcrypt 的 JavaScript 实现

## 📝 验证方法

验证哈希算法实现是否正确的方法：

1. **哈希一致性测试**：测试相同数据的哈希值是否一致
2. **哈希唯一性测试**：测试不同数据的哈希值是否不同
3. **性能测试**：测试哈希算法的性能是否满足要求
4. **安全性测试**：测试哈希算法是否存在安全漏洞
5. **密码哈希测试**：测试密码哈希的抗暴力破解能力

## ⚠️ 常见错误

1. **使用不安全的哈希算法**：
   - **错误描述**：使用已被破解或存在安全漏洞的哈希算法
   - **风险**：哈希可能被破解，导致信息泄露
   - **解决方案**：使用推荐的安全哈希算法，如 SHA-256、SHA-384、SHA-512

2. **密码哈希不加盐**：
   - **错误描述**：密码哈希不加盐或使用固定的盐值
   - **风险**：容易受到彩虹表攻击
   - **解决方案**：为每个密码生成唯一的盐值

3. **使用快速哈希算法哈希密码**：
   - **错误描述**：使用快速的哈希算法哈希密码
   - **风险**：容易被暴力破解
   - **解决方案**：使用慢哈希算法，如 Argon2、bcrypt、PBKDF2

4. **哈希算法选择不当**：
   - **错误描述**：哈希算法选择不当，如使用 MD5 或 SHA-1
   - **风险**：哈希可能被破解，导致信息泄露
   - **解决方案**：使用推荐的安全哈希算法

5. **错误处理不当**：
   - **错误描述**：错误处理不当，如暴露敏感信息、记录密码等
   - **风险**：可能泄露敏感信息或密码
   - **解决方案**：正确处理错误，避免暴露敏感信息

## 📚 参考资料

- [Web Crypto API 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [CryptoJS 官方文档](https://cryptojs.gitbook.io/docs/)
- [Forge 官方文档](https://github.com/digitalbazaar/forge)
- [OWASP 密码存储备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [NIST 哈希标准](https://csrc.nist.gov/projects/hash-functions)
- [Argon2 官方文档](https://github.com/P-H-C/phc-winner-argon2)