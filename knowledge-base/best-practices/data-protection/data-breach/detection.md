# 数据泄露检测

## 📋 概述

数据泄露检测是指及时发现和识别数据泄露事件。本指南提供了在前端应用中实施数据泄露检测的最佳实践，帮助开发者及时发现数据泄露事件，减少损失。

## 🎯 适用场景

数据泄露检测适用于以下场景：

- 实时监控应用安全状态
- 检测异常的数据访问行为
- 监控敏感数据的传输
- 检测未经授权的数据访问
- 安全事件响应

## 🔍 实现指南

### 1. 异常行为检测

实现异常行为检测，及时发现可疑活动。

#### 1.1 异常行为检测类

```javascript
// 异常行为检测类
class AnomalyDetection {
  constructor() {
    this.activityLog = []
    this.thresholds = {
      maxRequestsPerMinute: 100,
      maxFailedAttempts: 5,
      maxDataAccessPerMinute: 50
    }
  }
  
  // 记录活动
  logActivity(activity) {
    this.activityLog.push({
      ...activity,
      timestamp: Date.now()
    })
    
    // 清理旧的活动日志（保留最近1小时）
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    this.activityLog = this.activityLog.filter(log => log.timestamp > oneHourAgo)
  }
  
  // 检测异常请求频率
  detectRequestAnomaly(userId) {
    const now = Date.now()
    const oneMinuteAgo = now - 60 * 1000
    
    const recentRequests = this.activityLog.filter(log => 
      log.userId === userId && 
      log.type === 'request' && 
      log.timestamp > oneMinuteAgo
    )
    
    if (recentRequests.length > this.thresholds.maxRequestsPerMinute) {
      return {
        detected: true,
        type: 'high_request_frequency',
        count: recentRequests.length,
        threshold: this.thresholds.maxRequestsPerMinute
      }
    }
    
    return { detected: false }
  }
  
  // 检测异常失败尝试
  detectFailedAttemptAnomaly(userId) {
    const now = Date.now()
    const fiveMinutesAgo = now - 5 * 60 * 1000
    
    const recentFailedAttempts = this.activityLog.filter(log => 
      log.userId === userId && 
      log.type === 'failed_attempt' && 
      log.timestamp > fiveMinutesAgo
    )
    
    if (recentFailedAttempts.length > this.thresholds.maxFailedAttempts) {
      return {
        detected: true,
        type: 'high_failed_attempts',
        count: recentFailedAttempts.length,
        threshold: this.thresholds.maxFailedAttempts
      }
    }
    
    return { detected: false }
  }
  
  // 检测异常数据访问
  detectDataAccessAnomaly(userId) {
    const now = Date.now()
    const oneMinuteAgo = now - 60 * 1000
    
    const recentDataAccess = this.activityLog.filter(log => 
      log.userId === userId && 
      log.type === 'data_access' && 
      log.timestamp > oneMinuteAgo
    )
    
    if (recentDataAccess.length > this.thresholds.maxDataAccessPerMinute) {
      return {
        detected: true,
        type: 'high_data_access',
        count: recentDataAccess.length,
        threshold: this.thresholds.maxDataAccessPerMinute
      }
    }
    
    return { detected: false }
  }
  
  // 检测异常地理位置
  detectLocationAnomaly(userId, currentLocation) {
    const userLocations = this.activityLog
      .filter(log => log.userId === userId && log.location)
      .map(log => log.location)
    
    if (userLocations.length === 0) {
      return { detected: false }
    }
    
    // 检查新位置是否与之前的位置差异过大
    const lastLocation = userLocations[userLocations.length - 1]
    const distance = this.calculateDistance(lastLocation, currentLocation)
    
    if (distance > 1000) { // 超过1000公里
      return {
        detected: true,
        type: 'location_change',
        distance: distance,
        previousLocation: lastLocation,
        currentLocation: currentLocation
      }
    }
    
    return { detected: false }
  }
  
  // 计算两个位置之间的距离（简化版）
  calculateDistance(loc1, loc2) {
    const R = 6371 // 地球半径（公里）
    const dLat = this.toRad(loc2.lat - loc1.lat)
    const dLon = this.toRad(loc2.lon - loc1.lon)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(loc1.lat)) * Math.cos(this.toRad(loc2.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  
  toRad(deg) {
    return deg * (Math.PI / 180)
  }
  
  // 检测异常设备
  detectDeviceAnomaly(userId, currentDevice) {
    const userDevices = this.activityLog
      .filter(log => log.userId === userId && log.device)
      .map(log => log.device)
    
    if (userDevices.length === 0) {
      return { detected: false }
    }
    
    // 检查新设备是否与之前的设备不同
    const knownDevices = new Set(userDevices)
    if (!knownDevices.has(currentDevice)) {
      return {
        detected: true,
        type: 'new_device',
        device: currentDevice,
        knownDevices: Array.from(knownDevices)
      }
    }
    
    return { detected: false }
  }
  
  // 综合检测
  detectAnomalies(userId, activity) {
    const anomalies = []
    
    // 记录活动
    this.logActivity({ userId, ...activity })
    
    // 检测各种异常
    const requestAnomaly = this.detectRequestAnomaly(userId)
    if (requestAnomaly.detected) {
      anomalies.push(requestAnomaly)
    }
    
    const failedAttemptAnomaly = this.detectFailedAttemptAnomaly(userId)
    if (failedAttemptAnomaly.detected) {
      anomalies.push(failedAttemptAnomaly)
    }
    
    const dataAccessAnomaly = this.detectDataAccessAnomaly(userId)
    if (dataAccessAnomaly.detected) {
      anomalies.push(dataAccessAnomaly)
    }
    
    if (activity.location) {
      const locationAnomaly = this.detectLocationAnomaly(userId, activity.location)
      if (locationAnomaly.detected) {
        anomalies.push(locationAnomaly)
      }
    }
    
    if (activity.device) {
      const deviceAnomaly = this.detectDeviceAnomaly(userId, activity.device)
      if (deviceAnomaly.detected) {
        anomalies.push(deviceAnomaly)
      }
    }
    
    return anomalies
  }
}
```

### 2. 敏感数据监控

实现对敏感数据的监控，及时发现异常访问。

#### 2.1 敏感数据监控类

```javascript
// 敏感数据监控类
class SensitiveDataMonitor {
  constructor() {
    this.accessLog = []
    this.sensitiveFields = [
      'password',
      'creditCard',
      'ssn',
      'bankAccount',
      'personalId'
    ]
  }
  
  // 记录数据访问
  logAccess(userId, dataType, action, fields) {
    const sensitiveFields = fields.filter(field => 
      this.sensitiveFields.some(sf => field.toLowerCase().includes(sf))
    )
    
    this.accessLog.push({
      userId,
      dataType,
      action,
      fields,
      sensitiveFields,
      timestamp: Date.now()
    })
  }
  
  // 检测异常数据访问
  detectAnomalousAccess(userId) {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    
    const recentAccess = this.accessLog.filter(log => 
      log.userId === userId && 
      log.timestamp > oneHourAgo
    )
    
    const sensitiveAccessCount = recentAccess.filter(log => 
      log.sensitiveFields.length > 0
    ).length
    
    if (sensitiveAccessCount > 10) {
      return {
        detected: true,
        type: 'high_sensitive_access',
        count: sensitiveAccessCount
      }
    }
    
    return { detected: false }
  }
  
  // 检测异常数据导出
  detectAnomalousExport(userId) {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    
    const recentExports = this.accessLog.filter(log => 
      log.userId === userId && 
      log.action === 'export' && 
      log.timestamp > oneHourAgo
    )
    
    if (recentExports.length > 5) {
      return {
        detected: true,
        type: 'high_export_frequency',
        count: recentExports.length
      }
    }
    
    return { detected: false }
  }
  
  // 获取访问日志
  getAccessLog(userId) {
    if (userId) {
      return this.accessLog.filter(log => log.userId === userId)
    }
    return this.accessLog
  }
}
```

### 3. 网络流量监控

实现对网络流量的监控，及时发现异常流量。

#### 3.1 网络流量监控类

```javascript
// 网络流量监控类
class NetworkTrafficMonitor {
  constructor() {
    this.requestLog = []
    this.responseLog = []
  }
  
  // 拦截请求
  interceptRequest(request) {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
      timestamp: Date.now()
    }
    
    this.requestLog.push(requestData)
    
    // 检测可疑请求
    return this.detectSuspiciousRequest(requestData)
  }
  
  // 拦截响应
  interceptResponse(response) {
    const responseData = {
      url: response.url,
      status: response.status,
      headers: response.headers,
      body: response.body,
      timestamp: Date.now()
    }
    
    this.responseLog.push(responseData)
    
    // 检测可疑响应
    return this.detectSuspiciousResponse(responseData)
  }
  
  // 检测可疑请求
  detectSuspiciousRequest(request) {
    const suspicious = []
    
    // 检查是否包含敏感数据
    if (request.body) {
      const sensitivePatterns = [
        /password/i,
        /credit.?card/i,
        /ssn/i,
        /social.?security/i
      ]
      
      sensitivePatterns.forEach(pattern => {
        if (pattern.test(request.body)) {
          suspicious.push({
            type: 'sensitive_data_in_request',
            pattern: pattern.source
          })
        }
      })
    }
    
    // 检查是否发送到可疑域名
    const suspiciousDomains = [
      'example.com',
      'suspicious.com'
    ]
    
    suspiciousDomains.forEach(domain => {
      if (request.url.includes(domain)) {
        suspicious.push({
          type: 'suspicious_domain',
          domain: domain
        })
      }
    })
    
    return suspicious
  }
  
  // 检测可疑响应
  detectSuspiciousResponse(response) {
    const suspicious = []
    
    // 检查响应状态
    if (response.status >= 400 && response.status < 500) {
      suspicious.push({
        type: 'client_error',
        status: response.status
      })
    } else if (response.status >= 500) {
      suspicious.push({
        type: 'server_error',
        status: response.status
      })
    }
    
    // 检查响应大小
    if (response.body && response.body.length > 1000000) { // 超过1MB
      suspicious.push({
        type: 'large_response',
        size: response.body.length
      })
    }
    
    return suspicious
  }
  
  // 获取请求日志
  getRequestLog() {
    return this.requestLog
  }
  
  // 获取响应日志
  getResponseLog() {
    return this.responseLog
  }
}
```

## 📚 代码示例

### Vue 3 完整示例

```vue
<!-- src/composables/useSecurityMonitoring.js -->
<script>
import { ref, onMounted } from 'vue'

class SecurityMonitoring {
  constructor() {
    this.anomalyDetection = new AnomalyDetection()
    this.sensitiveDataMonitor = new SensitiveDataMonitor()
    this.networkTrafficMonitor = new NetworkTrafficMonitor()
    this.alerts = []
  }
  
  // 监控用户活动
  monitorUserActivity(userId, activity) {
    const anomalies = this.anomalyDetection.detectAnomalies(userId, activity)
    
    if (anomalies.length > 0) {
      this.alerts.push({
        type: 'anomaly',
        userId,
        anomalies,
        timestamp: Date.now()
      })
    }
    
    return anomalies
  }
  
  // 监控数据访问
  monitorDataAccess(userId, dataType, action, fields) {
    this.sensitiveDataMonitor.logAccess(userId, dataType, action, fields)
    
    const accessAnomaly = this.sensitiveDataMonitor.detectAnomalousAccess(userId)
    const exportAnomaly = this.sensitiveDataMonitor.detectAnomalousExport(userId)
    
    const anomalies = []
    if (accessAnomaly.detected) {
      anomalies.push(accessAnomaly)
    }
    if (exportAnomaly.detected) {
      anomalies.push(exportAnomaly)
    }
    
    if (anomalies.length > 0) {
      this.alerts.push({
        type: 'data_access',
        userId,
        anomalies,
        timestamp: Date.now()
      })
    }
    
    return anomalies
  }
  
  // 监控网络流量
  monitorNetworkRequest(request) {
    const suspicious = this.networkTrafficMonitor.interceptRequest(request)
    
    if (suspicious.length > 0) {
      this.alerts.push({
        type: 'network',
        suspicious,
        timestamp: Date.now()
      })
    }
    
    return suspicious
  }
  
  // 监控网络响应
  monitorNetworkResponse(response) {
    const suspicious = this.networkTrafficMonitor.interceptResponse(response)
    
    if (suspicious.length > 0) {
      this.alerts.push({
        type: 'network',
        suspicious,
        timestamp: Date.now()
      })
    }
    
    return suspicious
  }
  
  // 获取所有警报
  getAlerts() {
    return this.alerts
  }
  
  // 清除警报
  clearAlerts() {
    this.alerts = []
  }
}

export function useSecurityMonitoring() {
  const monitoring = ref(null)
  const alerts = ref([])
  
  onMounted(() => {
    monitoring.value = new SecurityMonitoring()
    
    // 定期检查警报
    setInterval(() => {
      if (monitoring.value) {
        alerts.value = monitoring.value.getAlerts()
      }
    }, 5000)
  })
  
  return {
    monitoring,
    alerts
  }
}
</script>
```

### React 完整示例

```jsx
// src/hooks/useSecurityMonitoring.js
import { useState, useEffect, useRef } from 'react'

class SecurityMonitoring {
  constructor() {
    this.anomalyDetection = new AnomalyDetection()
    this.sensitiveDataMonitor = new SensitiveDataMonitor()
    this.networkTrafficMonitor = new NetworkTrafficMonitor()
    this.alerts = []
  }
  
  // 监控用户活动
  monitorUserActivity(userId, activity) {
    const anomalies = this.anomalyDetection.detectAnomalies(userId, activity)
    
    if (anomalies.length > 0) {
      this.alerts.push({
        type: 'anomaly',
        userId,
        anomalies,
        timestamp: Date.now()
      })
    }
    
    return anomalies
  }
  
  // 监控数据访问
  monitorDataAccess(userId, dataType, action, fields) {
    this.sensitiveDataMonitor.logAccess(userId, dataType, action, fields)
    
    const accessAnomaly = this.sensitiveDataMonitor.detectAnomalousAccess(userId)
    const exportAnomaly = this.sensitiveDataMonitor.detectAnomalousExport(userId)
    
    const anomalies = []
    if (accessAnomaly.detected) {
      anomalies.push(accessAnomaly)
    }
    if (exportAnomaly.detected) {
      anomalies.push(exportAnomaly)
    }
    
    if (anomalies.length > 0) {
      this.alerts.push({
        type: 'data_access',
        userId,
        anomalies,
        timestamp: Date.now()
      })
    }
    
    return anomalies
  }
  
  // 监控网络流量
  monitorNetworkRequest(request) {
    const suspicious = this.networkTrafficMonitor.interceptRequest(request)
    
    if (suspicious.length > 0) {
      this.alerts.push({
        type: 'network',
        suspicious,
        timestamp: Date.now()
      })
    }
    
    return suspicious
  }
  
  // 监控网络响应
  monitorNetworkResponse(response) {
    const suspicious = this.networkTrafficMonitor.interceptResponse(response)
    
    if (suspicious.length > 0) {
      this.alerts.push({
        type: 'network',
        suspicious,
        timestamp: Date.now()
      })
    }
    
    return suspicious
  }
  
  // 获取所有警报
  getAlerts() {
    return this.alerts
  }
  
  // 清除警报
  clearAlerts() {
    this.alerts = []
  }
}

export function useSecurityMonitoring() {
  const [monitoring, setMonitoring] = useState(null)
  const [alerts, setAlerts] = useState([])
  const intervalRef = useRef(null)
  
  useEffect(() => {
    const m = new SecurityMonitoring()
    setMonitoring(m)
    
    // 定期检查警报
    intervalRef.current = setInterval(() => {
      setAlerts(m.getAlerts())
    }, 5000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return {
    monitoring,
    alerts
  }
}
```

## 🛠️ 工具推荐

- **Sentry**：错误监控和性能监控平台
- **LogRocket**：会话回放和错误监控工具
- **Datadog**：云监控和分析平台
- **New Relic**：应用性能监控平台
- **Elastic Stack**：日志分析和监控平台

## 📝 验证方法

验证数据泄露检测是否有效的方法：

1. **模拟攻击**：模拟各种攻击场景，测试检测能力
2. **性能测试**：测试检测系统的性能是否满足要求
3. **误报测试**：测试是否存在过多的误报
4. **漏报测试**：测试是否存在漏报的情况

## ⚠️ 常见错误

1. **检测规则过于严格**：
   - **错误描述**：检测规则设置过于严格，导致大量误报
   - **风险**：误报过多，影响正常使用
   - **解决方案**：调整检测规则，平衡误报和漏报

2. **检测规则过于宽松**：
   - **错误描述**：检测规则设置过于宽松，导致漏报
   - **风险**：无法及时发现数据泄露
   - **解决方案**：调整检测规则，提高检测准确率

3. **缺少实时监控**：
   - **错误描述**：没有实时监控，无法及时发现异常
   - **风险**：数据泄露可能持续较长时间
   - **解决方案**：实现实时监控，及时发现异常

4. **缺少告警机制**：
   - **错误描述**：检测到异常但没有及时告警
   - **风险**：无法及时响应数据泄露事件
   - **解决方案**：实现告警机制，及时通知相关人员

## 📚 参考资料

- [OWASP 异常检测备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Anomaly_Detection_Cheat_Sheet.html)
- [NIST 网络安全框架](https://www.nist.gov/cyberframework)
- [Sentry 官方文档](https://docs.sentry.io/)
- [LogRocket 官方文档](https://docs.logrocket.com/)