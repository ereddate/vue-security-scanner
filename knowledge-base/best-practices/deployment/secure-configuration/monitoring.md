# 安全监控配置

## 📋 概述

安全监控配置是指实施安全监控措施，及时发现和响应安全事件。本指南提供了安全监控配置的最佳实践。

## 🎯 适用场景

安全监控配置适用于以下场景：

- 应用安全监控
- 网络安全监控
- 系统安全监控
- 日志收集和分析
- 告警和通知

## 🔍 实现指南

### 1. 日志收集

实施日志收集以记录安全事件。

#### 1.1 应用日志配置

```javascript
// src/utils/logger.js
class SecureLogger {
  constructor(config) {
    this.config = config
    this.logQueue = []
    this.maxQueueSize = 1000
  }
  
  // 记录日志
  log(level, message, context = {}) {
    const logEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // 清理敏感信息
    const sanitizedEntry = this.sanitizeLogEntry(logEntry)
    
    // 添加到队列
    this.logQueue.push(sanitizedEntry)
    
    // 限制队列大小
    if (this.logQueue.length > this.maxQueueSize) {
      this.logQueue.shift()
    }
    
    // 输出到控制台
    this.outputToConsole(sanitizedEntry)
    
    // 发送到日志服务
    this.sendToLogService(sanitizedEntry)
  }
  
  // 清理日志条目
  sanitizeLogEntry(logEntry) {
    const sanitized = { ...logEntry }
    
    // 清理敏感信息
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'creditCard', 'ssn']
    
    const sanitizeObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) {
        return obj
      }
      
      const result = {}
      
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          result[key] = '[REDACTED]'
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitizeObject(value)
        } else {
          result[key] = value
        }
      }
      
      return result
    }
    
    sanitized.context = sanitizeObject(sanitized.context)
    
    return sanitized
  }
  
  // 输出到控制台
  outputToConsole(logEntry) {
    const { level, message, context } = logEntry
    
    switch (level) {
      case 'error':
        console.error(message, context)
        break
      case 'warn':
        console.warn(message, context)
        break
      case 'info':
        console.info(message, context)
        break
      case 'debug':
        console.debug(message, context)
        break
      default:
        console.log(message, context)
    }
  }
  
  // 发送到日志服务
  async sendToLogService(logEntry) {
    if (!this.config.logServiceUrl) {
      return
    }
    
    try {
      const response = await fetch(this.config.logServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      })
      
      if (!response.ok) {
        console.error('发送日志失败:', response.statusText)
      }
    } catch (error) {
      console.error('发送日志错误:', error)
    }
  }
  
  // 获取日志队列
  getLogQueue() {
    return [...this.logQueue]
  }
  
  // 清空日志队列
  clearLogQueue() {
    this.logQueue = []
  }
  
  // 错误日志
  error(message, context) {
    this.log('error', message, context)
  }
  
  // 警告日志
  warn(message, context) {
    this.log('warn', message, context)
  }
  
  // 信息日志
  info(message, context) {
    this.log('info', message, context)
  }
  
  // 调试日志
  debug(message, context) {
    this.log('debug', message, context)
  }
}

export default SecureLogger
```

#### 1.2 日志聚合配置

```bash
#!/bin/bash
# scripts/setup-log-aggregation.sh

LOG_SERVER=$1
LOG_PORT=${2:-514}

if [ -z "$LOG_SERVER" ]; then
    echo "用法: $0 <日志服务器> [端口]"
    exit 1
fi

echo "配置日志聚合..."

# 配置 rsyslog
cat > /etc/rsyslog.d/security.conf << EOF
# 发送所有日志到日志服务器
*.* @@${LOG_SERVER}:${LOG_PORT}

# 本地日志
*.* /var/log/messages
EOF

# 重启 rsyslog
systemctl restart rsyslog

# 配置 logrotate
cat > /etc/logrotate.d/security << EOF
/var/log/messages {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root adm
    sharedscripts
    postrotate
        systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}
EOF

echo "日志聚合配置完成"
```

### 2. 安全监控

实施安全监控以检测异常活动。

#### 2.1 应用安全监控

```javascript
// src/utils/securityMonitor.js
class SecurityMonitor {
  constructor(config) {
    this.config = config
    this.alerts = []
    this.metrics = new Map()
    this.thresholds = {
      errorRate: 0.05, // 5%
      failedRequests: 10,
      suspiciousActivity: 5
    }
  }
  
  // 监控请求
  monitorRequest(request) {
    const metrics = {
      url: request.url,
      method: request.method,
      headers: request.headers,
      timestamp: Date.now()
    }
    
    // 检测可疑请求
    this.detectSuspiciousRequest(metrics)
    
    return metrics
  }
  
  // 监控响应
  monitorResponse(response, requestMetrics) {
    const metrics = {
      ...requestMetrics,
      status: response.status,
      responseTime: Date.now() - requestMetrics.timestamp,
      timestamp: Date.now()
    }
    
    // 检测异常响应
    this.detectAbnormalResponse(metrics)
    
    return metrics
  }
  
  // 检测可疑请求
  detectSuspiciousRequest(metrics) {
    const suspiciousPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /exec\s*\(/i,
      /eval\s*\(/i
    ]
    
    const url = metrics.url
    const suspicious = suspiciousPatterns.some(pattern => pattern.test(url))
    
    if (suspicious) {
      this.alerts.push({
        type: 'suspicious_request',
        severity: 'high',
        url,
        timestamp: Date.now()
      })
    }
  }
  
  // 检测异常响应
  detectAbnormalResponse(metrics) {
    // 检测错误率
    if (metrics.status >= 400) {
      const errorCount = this.metrics.get('errorCount') || 0
      this.metrics.set('errorCount', errorCount + 1)
      
      const totalCount = this.metrics.get('totalCount') || 0
      this.metrics.set('totalCount', totalCount + 1)
      
      const errorRate = errorCount / totalCount
      
      if (errorRate > this.thresholds.errorRate) {
        this.alerts.push({
          type: 'high_error_rate',
          severity: 'medium',
          errorRate,
          timestamp: Date.now()
        })
      }
    }
    
    // 检测慢响应
    if (metrics.responseTime > 5000) {
      this.alerts.push({
        type: 'slow_response',
        severity: 'low',
        responseTime: metrics.responseTime,
        url: metrics.url,
        timestamp: Date.now()
      })
    }
  }
  
  // 监控用户活动
  monitorUserActivity(userId, activity) {
    const userMetrics = this.metrics.get(`user_${userId}`) || {
      activities: [],
      lastActivity: null
    }
    
    userMetrics.activities.push({
      ...activity,
      timestamp: Date.now()
    })
    
    userMetrics.lastActivity = Date.now()
    
    // 检测异常活动
    this.detectAbnormalUserActivity(userId, userMetrics)
    
    this.metrics.set(`user_${userId}`, userMetrics)
  }
  
  // 检测异常用户活动
  detectAbnormalUserActivity(userId, userMetrics) {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    
    const recentActivities = userMetrics.activities.filter(
      activity => activity.timestamp > oneHourAgo
    )
    
    // 检测频繁活动
    if (recentActivities.length > 100) {
      this.alerts.push({
        type: 'excessive_user_activity',
        severity: 'medium',
        userId,
        activityCount: recentActivities.length,
        timestamp: now
      })
    }
    
    // 检测异常位置
    const locations = new Set(recentActivities.map(a => a.location))
    if (locations.size > 5) {
      this.alerts.push({
        type: 'multiple_user_locations',
        severity: 'high',
        userId,
        locations: Array.from(locations),
        timestamp: now
      })
    }
  }
  
  // 获取警报
  getAlerts() {
    return this.alerts
  }
  
  // 清除警报
  clearAlerts() {
    this.alerts = []
  }
  
  // 获取指标
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
}

export default SecurityMonitor
```

#### 2.2 网络安全监控

```javascript
// src/utils/networkMonitor.js
class NetworkSecurityMonitor {
  constructor(config) {
    this.config = config
    this.alerts = []
    this.connections = new Map()
    this.thresholds = {
      maxConnectionsPerIP: 100,
      maxRequestsPerSecond: 50,
      maxFailedAttempts: 5
    }
  }
  
  // 监控连接
  monitorConnection(ip, connection) {
    const ipConnections = this.connections.get(ip) || {
      count: 0,
      requests: [],
      failedAttempts: 0,
      lastActivity: null
    }
    
    ipConnections.count++
    ipConnections.requests.push({
      ...connection,
      timestamp: Date.now()
    })
    ipConnections.lastActivity = Date.now()
    
    // 检测异常连接
    this.detectAbnormalConnection(ip, ipConnections)
    
    this.connections.set(ip, ipConnections)
  }
  
  // 检测异常连接
  detectAbnormalConnection(ip, ipConnections) {
    // 检测连接数过多
    if (ipConnections.count > this.thresholds.maxConnectionsPerIP) {
      this.alerts.push({
        type: 'excessive_connections',
        severity: 'high',
        ip,
        connectionCount: ipConnections.count,
        timestamp: Date.now()
      })
    }
    
    // 检测请求频率过高
    const now = Date.now()
    const oneSecondAgo = now - 1000
    
    const recentRequests = ipConnections.requests.filter(
      request => request.timestamp > oneSecondAgo
    )
    
    if (recentRequests.length > this.thresholds.maxRequestsPerSecond) {
      this.alerts.push({
        type: 'high_request_rate',
        severity: 'high',
        ip,
        requestRate: recentRequests.length,
        timestamp: now
      })
    }
  }
  
  // 监控失败尝试
  monitorFailedAttempt(ip, attempt) {
    const ipConnections = this.connections.get(ip) || {
      count: 0,
      requests: [],
      failedAttempts: 0,
      lastActivity: null
    }
    
    ipConnections.failedAttempts++
    ipConnections.lastActivity = Date.now()
    
    // 检测失败尝试过多
    if (ipConnections.failedAttempts > this.thresholds.maxFailedAttempts) {
      this.alerts.push({
        type: 'excessive_failed_attempts',
        severity: 'high',
        ip,
        failedAttempts: ipConnections.failedAttempts,
        timestamp: Date.now()
      })
    }
    
    this.connections.set(ip, ipConnections)
  }
  
  // 获取警报
  getAlerts() {
    return this.alerts
  }
  
  // 清除警报
  clearAlerts() {
    this.alerts = []
  }
  
  // 清除旧连接
  cleanupOldConnections(maxAge = 3600000) {
    const now = Date.now()
    
    for (const [ip, connections] of this.connections.entries()) {
      if (connections.lastActivity && now - connections.lastActivity > maxAge) {
        this.connections.delete(ip)
      }
    }
  }
}

export default NetworkSecurityMonitor
```

### 3. 告警配置

配置告警以及时通知安全事件。

#### 3.1 告警规则配置

```javascript
// src/utils/alertManager.js
class AlertManager {
  constructor(config) {
    this.config = config
    this.alerts = []
    this.alertRules = new Map()
    this.notificationChannels = new Map()
  }
  
  // 添加告警规则
  addAlertRule(name, rule) {
    this.alertRules.set(name, rule)
  }
  
  // 添加通知渠道
  addNotificationChannel(name, channel) {
    this.notificationChannels.set(name, channel)
  }
  
  // 评估告警规则
  async evaluateAlertRules(metrics) {
    const triggeredAlerts = []
    
    for (const [name, rule] of this.alertRules.entries()) {
      const triggered = await this.evaluateRule(rule, metrics)
      
      if (triggered) {
        const alert = {
          id: this.generateAlertId(),
          ruleName: name,
          severity: rule.severity,
          message: rule.message,
          metrics: triggered.metrics,
          timestamp: Date.now()
        }
        
        this.alerts.push(alert)
        triggeredAlerts.push(alert)
        
        // 发送通知
        await this.sendNotification(alert)
      }
    }
    
    return triggeredAlerts
  }
  
  // 评估规则
  async evaluateRule(rule, metrics) {
    switch (rule.type) {
      case 'threshold':
        return this.evaluateThresholdRule(rule, metrics)
      case 'rate':
        return this.evaluateRateRule(rule, metrics)
      case 'pattern':
        return this.evaluatePatternRule(rule, metrics)
      default:
        return null
    }
  }
  
  // 评估阈值规则
  evaluateThresholdRule(rule, metrics) {
    const value = metrics[rule.metric]
    
    if (value === undefined) {
      return null
    }
    
    const triggered = rule.operator === '>'
      ? value > rule.threshold
      : value < rule.threshold
    
    return triggered ? { metrics: { [rule.metric]: value } } : null
  }
  
  // 评估速率规则
  evaluateRateRule(rule, metrics) {
    const values = metrics[rule.metric]
    
    if (!Array.isArray(values) || values.length === 0) {
      return null
    }
    
    const now = Date.now()
    const windowStart = now - rule.window
    
    const recentValues = values.filter(v => v.timestamp > windowStart)
    const rate = recentValues.length / (rule.window / 1000)
    
    const triggered = rate > rule.threshold
    
    return triggered ? { metrics: { [rule.metric]: rate } } : null
  }
  
  // 评估模式规则
  evaluatePatternRule(rule, metrics) {
    const value = metrics[rule.metric]
    
    if (value === undefined) {
      return null
    }
    
    const triggered = rule.pattern.test(value)
    
    return triggered ? { metrics: { [rule.metric]: value } } : null
  }
  
  // 发送通知
  async sendNotification(alert) {
    const channels = this.config.notificationChannels || []
    
    for (const channelName of channels) {
      const channel = this.notificationChannels.get(channelName)
      
      if (!channel) {
        console.warn(`通知渠道不存在: ${channelName}`)
        continue
      }
      
      try {
        await this.sendToChannel(channel, alert)
      } catch (error) {
        console.error(`发送通知到 ${channelName} 失败:`, error)
      }
    }
  }
  
  // 发送到渠道
  async sendToChannel(channel, alert) {
    switch (channel.type) {
      case 'email':
        await this.sendEmail(channel, alert)
        break
      case 'slack':
        await this.sendSlack(channel, alert)
        break
      case 'webhook':
        await this.sendWebhook(channel, alert)
        break
      default:
        throw new Error(`不支持的渠道类型: ${channel.type}`)
    }
  }
  
  // 发送邮件
  async sendEmail(channel, alert) {
    const response = await fetch(channel.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: channel.recipients,
        subject: `[${alert.severity.toUpperCase()}] ${alert.message}`,
        body: this.formatAlertMessage(alert)
      })
    })
    
    if (!response.ok) {
      throw new Error('发送邮件失败')
    }
  }
  
  // 发送 Slack
  async sendSlack(channel, alert) {
    const color = {
      low: '#36a64f',
      medium: '#ff9900',
      high: '#ff0000'
    }[alert.severity]
    
    const response = await fetch(channel.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        attachments: [{
          color,
          title: `[${alert.severity.toUpperCase()}] ${alert.message}`,
          text: this.formatAlertMessage(alert),
          ts: alert.timestamp / 1000
        }]
      })
    })
    
    if (!response.ok) {
      throw new Error('发送 Slack 失败')
    }
  }
  
  // 发送 Webhook
  async sendWebhook(channel, alert) {
    const response = await fetch(channel.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...channel.headers
      },
      body: JSON.stringify({
        alert,
        timestamp: alert.timestamp
      })
    })
    
    if (!response.ok) {
      throw new Error('发送 Webhook 失败')
    }
  }
  
  // 格式化告警消息
  formatAlertMessage(alert) {
    return `
告警详情:
- 严重程度: ${alert.severity}
- 消息: ${alert.message}
- 时间: ${new Date(alert.timestamp).toISOString()}
- 指标: ${JSON.stringify(alert.metrics, null, 2)}
    `.trim()
  }
  
  // 生成告警 ID
  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 获取告警
  getAlerts() {
    return this.alerts
  }
  
  // 清除告警
  clearAlerts() {
    this.alerts = []
  }
}

export default AlertManager
```

## 📚 代码示例

### Vue 3 完整示例

```vue
<!-- src/composables/useSecurityMonitoring.js -->
<script>
import { ref, onMounted } from 'vue'
import SecureLogger from '../utils/logger'
import SecurityMonitor from '../utils/securityMonitor'
import AlertManager from '../utils/alertManager'

export function useSecurityMonitoring(config) {
  const logger = ref(null)
  const securityMonitor = ref(null)
  const alertManager = ref(null)
  const alerts = ref([])
  
  onMounted(() => {
    // 初始化日志记录器
    logger.value = new SecureLogger(config.logger)
    
    // 初始化安全监控
    securityMonitor.value = new SecurityMonitor(config.security)
    
    // 初始化告警管理器
    alertManager.value = new AlertManager(config.alerts)
    
    // 添加告警规则
    alertManager.value.addAlertRule('high_error_rate', {
      type: 'rate',
      metric: 'errors',
      threshold: 10,
      window: 60000,
      severity: 'high',
      message: '错误率过高'
    })
    
    alertManager.value.addAlertRule('suspicious_activity', {
      type: 'pattern',
      metric: 'url',
      pattern: /<script[^>]*>/i,
      severity: 'high',
      message: '检测到可疑活动'
    })
    
    // 添加通知渠道
    if (config.alerts.notificationChannels) {
      config.alerts.notificationChannels.forEach(channel => {
        alertManager.value.addNotificationChannel(channel.name, channel)
      })
    }
    
    // 定期检查告警
    setInterval(async () => {
      const securityAlerts = securityMonitor.value.getAlerts()
      const metrics = securityMonitor.value.getMetrics()
      
      const triggeredAlerts = await alertManager.value.evaluateAlertRules(metrics)
      
      alerts.value = [...securityAlerts, ...triggeredAlerts]
    }, 60000)
  })
  
  return {
    logger,
    securityMonitor,
    alertManager,
    alerts
  }
}
</script>
```

## 🛠️ 工具推荐

- **Prometheus**：监控和告警系统
- **Grafana**：可视化监控数据
- **ELK Stack**：日志收集和分析平台
- **Splunk**：日志分析和监控平台
- **Datadog**：云监控和分析平台

## 📝 验证方法

验证安全监控是否正确实施的方法：

1. **日志测试**：测试日志是否正确记录
2. **监控测试**：测试监控是否正常工作
3. **告警测试**：测试告警是否及时触发
4. **通知测试**：测试通知是否正常发送

## ⚠️ 常见错误

1. **日志信息泄露**：
   - **错误描述**：日志包含敏感信息
   - **风险**：敏感信息可能被泄露
   - **解决方案**：清理日志中的敏感信息

2. **监控规则过于敏感**：
   - **错误描述**：监控规则过于敏感
   - **风险**：产生大量误报
   - **解决方案**：调整监控规则阈值

3. **缺少告警**：
   - **错误描述**：没有配置告警
   - **风险**：无法及时发现安全事件
   - **解决方案**：配置告警规则和通知渠道

4. **缺少日志聚合**：
   - **错误描述**：没有聚合日志
   - **风险**：难以全面分析安全事件
   - **解决方案**：实施日志聚合

## 📚 参考资料

- [OWASP Monitoring and Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Monitoring_and_Logging_Cheat_Sheet.html)
- [NIST SP 800-92](https://csrc.nist.gov/publications/detail/sp/800-92/rev-1/final)
- [Prometheus 最佳实践](https://prometheus.io/docs/practices/)
- [Grafana 最佳实践](https://grafana.com/docs/grafana/latest/best-practices/)