# 密钥管理

## 📋 概述

密钥管理是指在 CI/CD 管道和应用运行时安全地管理和使用密钥、密码、API 密钥等敏感信息。本指南提供了在前端应用 CI/CD 管道中实施密钥管理的最佳实践。

## 🎯 适用场景

密钥管理适用于以下场景：

- CI/CD 管道中的密钥使用
- 应用运行时的密钥管理
- 第三方服务的 API 密钥管理
- 数据库连接字符串管理
- 证书和密钥管理

## 🔍 实现指南

### 1. 密钥存储

安全地存储密钥。

#### 1.1 环境变量存储

```javascript
// .env.example
NODE_ENV=production
API_BASE_URL=https://api.example.com
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
SENTRY_DSN=your-sentry-dsn
```

#### 1.2 密钥验证类

```javascript
// src/utils/secretValidator.js
class SecretValidator {
  constructor() {
    this.requiredSecrets = [
      'NODE_ENV',
      'API_BASE_URL',
      'JWT_SECRET'
    ]
    
    this.optionalSecrets = [
      'DATABASE_URL',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'STRIPE_SECRET_KEY',
      'SENTRY_DSN'
    ]
  }
  
  // 验证必需的密钥
  validateRequired() {
    const missing = []
    
    for (const secret of this.requiredSecrets) {
      if (!process.env[secret]) {
        missing.push(secret)
      }
    }
    
    if (missing.length > 0) {
      throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`)
    }
    
    return true
  }
  
  // 验证密钥格式
  validateFormat() {
    const errors = []
    
    // 验证 JWT_SECRET
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET 长度不能少于 32 个字符')
    }
    
    // 验证 API_BASE_URL
    if (process.env.API_BASE_URL && !this.isValidUrl(process.env.API_BASE_URL)) {
      errors.push('API_BASE_URL 格式不正确')
    }
    
    // 验证 DATABASE_URL
    if (process.env.DATABASE_URL && !this.isValidDatabaseUrl(process.env.DATABASE_URL)) {
      errors.push('DATABASE_URL 格式不正确')
    }
    
    if (errors.length > 0) {
      throw new Error(`密钥格式错误: ${errors.join(', ')}`)
    }
    
    return true
  }
  
  // 验证 URL 格式
  isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }
  
  // 验证数据库 URL 格式
  isValidDatabaseUrl(url) {
    const pattern = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^/]+$/
    return pattern.test(url)
  }
  
  // 获取密钥
  getSecret(name) {
    const value = process.env[name]
    
    if (!value) {
      throw new Error(`密钥不存在: ${name}`)
    }
    
    return value
  }
  
  // 获取可选密钥
  getOptionalSecret(name, defaultValue = null) {
    return process.env[name] || defaultValue
  }
  
  // 验证所有密钥
  validateAll() {
    this.validateRequired()
    this.validateFormat()
    return true
  }
}

export default SecretValidator
```

### 2. 密钥使用

安全地使用密钥。

#### 2.1 密钥管理类

```javascript
// src/utils/secretManager.js
class SecretManager {
  constructor() {
    this.secrets = new Map()
    this.encryptionKey = null
  }
  
  // 初始化加密密钥
  async init(encryptionKey) {
    this.encryptionKey = encryptionKey
  }
  
  // 加密密钥
  async encryptSecret(secret) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(secret)
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.encryptionKey,
      encoded
    )
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    
    return btoa(String.fromCharCode(...combined))
  }
  
  // 解密密钥
  async decryptSecret(encryptedSecret) {
    const combined = Uint8Array.from(atob(encryptedSecret), c => c.charCodeAt(0))
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.encryptionKey,
      data
    )
    
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }
  
  // 存储密钥
  async storeSecret(name, secret) {
    const encrypted = await this.encryptSecret(secret)
    this.secrets.set(name, encrypted)
  }
  
  // 获取密钥
  async getSecret(name) {
    const encrypted = this.secrets.get(name)
    
    if (!encrypted) {
      throw new Error(`密钥不存在: ${name}`)
    }
    
    return await this.decryptSecret(encrypted)
  }
  
  // 删除密钥
  deleteSecret(name) {
    this.secrets.delete(name)
  }
  
  // 清空所有密钥
  clearAllSecrets() {
    this.secrets.clear()
  }
  
  // 获取所有密钥名称
  getSecretNames() {
    return Array.from(this.secrets.keys())
  }
}

export default SecretManager
```

#### 2.2 API 密钥管理

```javascript
// src/utils/apiKeyManager.js
class ApiKeyManager {
  constructor() {
    this.apiKeys = new Map()
    this.keyRotationInterval = 30 * 24 * 60 * 60 * 1000 // 30天
  }
  
  // 生成 API 密钥
  generateApiKey() {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  
  // 添加 API 密钥
  addApiKey(service, apiKey) {
    this.apiKeys.set(service, {
      key: apiKey,
      createdAt: Date.now(),
      lastRotated: Date.now()
    })
  }
  
  // 获取 API 密钥
  getApiKey(service) {
    const apiKeyData = this.apiKeys.get(service)
    
    if (!apiKeyData) {
      throw new Error(`API 密钥不存在: ${service}`)
    }
    
    // 检查是否需要轮换
    const now = Date.now()
    if (now - apiKeyData.lastRotated > this.keyRotationInterval) {
      console.warn(`API 密钥需要轮换: ${service}`)
    }
    
    return apiKeyData.key
  }
  
  // 轮换 API 密钥
  rotateApiKey(service) {
    const newKey = this.generateApiKey()
    this.apiKeys.set(service, {
      key: newKey,
      createdAt: this.apiKeys.get(service)?.createdAt || Date.now(),
      lastRotated: Date.now()
    })
    
    return newKey
  }
  
  // 删除 API 密钥
  deleteApiKey(service) {
    this.apiKeys.delete(service)
  }
  
  // 获取所有服务
  getServices() {
    return Array.from(this.apiKeys.keys())
  }
  
  // 检查 API 密钥是否需要轮换
  needsRotation(service) {
    const apiKeyData = this.apiKeys.get(service)
    
    if (!apiKeyData) {
      return false
    }
    
    const now = Date.now()
    return now - apiKeyData.lastRotated > this.keyRotationInterval
  }
  
  // 获取 API 密钥信息
  getApiKeyInfo(service) {
    const apiKeyData = this.apiKeys.get(service)
    
    if (!apiKeyData) {
      throw new Error(`API 密钥不存在: ${service}`)
    }
    
    return {
      service,
      createdAt: apiKeyData.createdAt,
      lastRotated: apiKeyData.lastRotated,
      needsRotation: this.needsRotation(service)
    }
  }
}

export default ApiKeyManager
```

### 3. 密钥轮换

定期轮换密钥以提高安全性。

#### 3.1 密钥轮换策略

```javascript
// src/utils/keyRotation.js
class KeyRotation {
  constructor() {
    this.rotationSchedule = new Map()
    this.rotationHistory = []
  }
  
  // 添加轮换计划
  addRotationSchedule(service, interval) {
    this.rotationSchedule.set(service, {
      interval,
      lastRotated: Date.now()
    })
  }
  
  // 检查是否需要轮换
  needsRotation(service) {
    const schedule = this.rotationSchedule.get(service)
    
    if (!schedule) {
      return false
    }
    
    const now = Date.now()
    return now - schedule.lastRotated > schedule.interval
  }
  
  // 执行轮换
  async rotate(service, rotationFn) {
    if (!this.needsRotation(service)) {
      console.log(`密钥不需要轮换: ${service}`)
      return null
    }
    
    console.log(`开始轮换密钥: ${service}`)
    
    try {
      const newKey = await rotationFn()
      
      // 更新轮换时间
      this.rotationSchedule.set(service, {
        interval: this.rotationSchedule.get(service).interval,
        lastRotated: Date.now()
      })
      
      // 记录轮换历史
      this.rotationHistory.push({
        service,
        rotatedAt: Date.now(),
        success: true
      })
      
      console.log(`密钥轮换成功: ${service}`)
      return newKey
    } catch (error) {
      console.error(`密钥轮换失败: ${service}`, error)
      
      // 记录失败历史
      this.rotationHistory.push({
        service,
        rotatedAt: Date.now(),
        success: false,
        error: error.message
      })
      
      throw error
    }
  }
  
  // 获取轮换历史
  getRotationHistory(service) {
    if (service) {
      return this.rotationHistory.filter(h => h.service === service)
    }
    return this.rotationHistory
  }
  
  // 获取轮换计划
  getRotationSchedule(service) {
    if (service) {
      return this.rotationSchedule.get(service)
    }
    return Object.fromEntries(this.rotationSchedule)
  }
}

export default KeyRotation
```

### 4. 密钥监控

监控密钥的使用情况。

#### 4.1 密钥使用监控

```javascript
// src/utils/secretMonitor.js
class SecretMonitor {
  constructor() {
    this.usageLog = []
    this.alerts = []
  }
  
  // 记录密钥使用
  logUsage(secretName, usage) {
    this.usageLog.push({
      secretName,
      ...usage,
      timestamp: Date.now()
    })
    
    // 检查异常使用
    this.checkAnomalousUsage(secretName)
  }
  
  // 检查异常使用
  checkAnomalousUsage(secretName) {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    
    const recentUsage = this.usageLog.filter(log => 
      log.secretName === secretName && 
      log.timestamp > oneHourAgo
    )
    
    // 检查使用频率
    if (recentUsage.length > 100) {
      this.alerts.push({
        type: 'high_usage_frequency',
        secretName,
        count: recentUsage.length,
        timestamp: now
      })
    }
    
    // 检查异常位置
    const uniqueLocations = new Set(recentUsage.map(log => log.location))
    if (uniqueLocations.size > 5) {
      this.alerts.push({
        type: 'multiple_locations',
        secretName,
        locations: Array.from(uniqueLocations),
        timestamp: now
      })
    }
  }
  
  // 获取使用日志
  getUsageLog(secretName) {
    if (secretName) {
      return this.usageLog.filter(log => log.secretName === secretName)
    }
    return this.usageLog
  }
  
  // 获取警报
  getAlerts(secretName) {
    if (secretName) {
      return this.alerts.filter(alert => alert.secretName === secretName)
    }
    return this.alerts
  }
  
  // 清除旧日志
  clearOldLogs(daysToKeep = 7) {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    this.usageLog = this.usageLog.filter(log => log.timestamp > cutoffTime)
  }
  
  // 清除旧警报
  clearOldAlerts(daysToKeep = 7) {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime)
  }
}

export default SecretMonitor
```

## 📚 代码示例

### Vue 3 完整示例

```vue
<!-- src/composables/useSecretManager.js -->
<script>
import { ref, onMounted } from 'vue'
import SecretValidator from '../utils/secretValidator'
import SecretManager from '../utils/secretManager'
import ApiKeyManager from '../utils/apiKeyManager'
import KeyRotation from '../utils/keyRotation'
import SecretMonitor from '../utils/secretMonitor'

export function useSecretManager() {
  const secretValidator = ref(new SecretValidator())
  const secretManager = ref(null)
  const apiKeyManager = ref(new ApiKeyManager())
  const keyRotation = ref(new KeyRotation())
  const secretMonitor = ref(new SecretMonitor())
  
  const isReady = ref(false)
  const alerts = ref([])
  
  onMounted(async () => {
    // 验证环境变量
    secretValidator.value.validateAll()
    
    // 初始化密钥管理器
    const encryptionKey = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    )
    
    secretManager.value = new SecretManager()
    await secretManager.value.init(encryptionKey)
    
    // 添加 API 密钥
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      apiKeyManager.value.addApiKey('aws', process.env.AWS_SECRET_ACCESS_KEY)
    }
    
    if (process.env.STRIPE_SECRET_KEY) {
      apiKeyManager.value.addApiKey('stripe', process.env.STRIPE_SECRET_KEY)
    }
    
    // 添加轮换计划
    keyRotation.value.addRotationSchedule('aws', 30 * 24 * 60 * 60 * 1000) // 30天
    keyRotation.value.addRotationSchedule('stripe', 90 * 24 * 60 * 60 * 1000) // 90天
    
    // 定期检查警报
    setInterval(() => {
      alerts.value = secretMonitor.value.getAlerts()
    }, 60000)
    
    isReady.value = true
  })
  
  return {
    secretValidator,
    secretManager,
    apiKeyManager,
    keyRotation,
    secretMonitor,
    isReady,
    alerts
  }
}
</script>
```

### React 完整示例

```jsx
// src/hooks/useSecretManager.js
import { useState, useEffect, useRef } from 'react'
import SecretValidator from '../utils/secretValidator'
import SecretManager from '../utils/secretManager'
import ApiKeyManager from '../utils/apiKeyManager'
import KeyRotation from '../utils/keyRotation'
import SecretMonitor from '../utils/secretMonitor'

export function useSecretManager() {
  const [secretValidator] = useState(() => new SecretValidator())
  const [secretManager, setSecretManager] = useState(null)
  const [apiKeyManager] = useState(() => new ApiKeyManager())
  const [keyRotation] = useState(() => new KeyRotation())
  const [secretMonitor] = useState(() => new SecretMonitor())
  
  const [isReady, setIsReady] = useState(false)
  const [alerts, setAlerts] = useState([])
  const intervalRef = useRef(null)
  
  useEffect(() => {
    const init = async () => {
      // 验证环境变量
      secretValidator.validateAll()
      
      // 初始化密钥管理器
      const encryptionKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      )
      
      const sm = new SecretManager()
      await sm.init(encryptionKey)
      setSecretManager(sm)
      
      // 添加 API 密钥
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        apiKeyManager.addApiKey('aws', process.env.AWS_SECRET_ACCESS_KEY)
      }
      
      if (process.env.STRIPE_SECRET_KEY) {
        apiKeyManager.addApiKey('stripe', process.env.STRIPE_SECRET_KEY)
      }
      
      // 添加轮换计划
      keyRotation.addRotationSchedule('aws', 30 * 24 * 60 * 60 * 1000) // 30天
      keyRotation.addRotationSchedule('stripe', 90 * 24 * 60 * 60 * 1000) // 90天
      
      // 定期检查警报
      intervalRef.current = setInterval(() => {
        setAlerts(secretMonitor.getAlerts())
      }, 60000)
      
      setIsReady(true)
    }
    
    init()
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return {
    secretValidator,
    secretManager,
    apiKeyManager,
    keyRotation,
    secretMonitor,
    isReady,
    alerts
  }
}
```

## 🛠️ 工具推荐

- **HashiCorp Vault**：密钥管理解决方案
- **AWS Secrets Manager**：AWS 密钥管理服务
- **Azure Key Vault**：Azure 密钥管理服务
- **Google Secret Manager**：Google 密钥管理服务
- **Doppler**：跨平台的密钥管理解决方案

## 📝 验证方法

验证密钥管理是否正确实施的方法：

1. **密钥扫描**：扫描代码库中是否存在硬编码的密钥
2. **访问控制**：验证密钥的访问控制是否正确
3. **轮换测试**：测试密钥轮换是否正常工作
4. **监控测试**：测试密钥监控是否正常工作

## ⚠️ 常见错误

1. **硬编码密钥**：
   - **错误描述**：密钥被硬编码在代码中
   - **风险**：密钥可能被泄露
   - **解决方案**：使用环境变量或密钥管理服务

2. **缺少密钥轮换**：
   - **错误描述**：没有定期轮换密钥
   - **风险**：密钥可能被长期使用，增加泄露风险
   - **解决方案**：实施密钥轮换策略

3. **密钥泄露到日志**：
   - **错误描述**：密钥被记录到日志中
   - **风险**：日志可能被访问，导致密钥泄露
   - **解决方案**：过滤日志中的敏感信息

4. **缺少密钥监控**：
   - **错误描述**：没有监控密钥的使用情况
   - **风险**：无法及时发现异常使用
   - **解决方案**：实施密钥监控，及时发现异常

## 📚 参考资料

- [OWASP 密钥管理备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [NIST 密钥管理指南](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [HashiCorp Vault 官方文档](https://www.vaultproject.io/docs)
- [GitHub Secrets 官方文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)