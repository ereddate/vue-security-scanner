// 日志安全漏洞示例文件

// 示例 1: 在日志中记录敏感密码
export function logPassword(password) {
  console.log('Password:', password);
}

// 示例 2: 在日志中记录API密钥
export function logAPIKey(apiKey) {
  console.log('API Key:', apiKey);
}

// 示例 3: 在日志中记录令牌
export function logToken(token) {
  console.log('Token:', token);
}

// 示例 4: 在日志中记录会话ID
export function logSessionId(sessionId) {
  console.log('Session ID:', sessionId);
}

// 示例 5: 在日志中记录用户数据
export function logUserData(userData) {
  console.log('User Data:', userData);
}

// 示例 6: 在日志中记录信用卡信息
export function logCreditCard(cardNumber, cvv, expiry) {
  console.log('Credit Card:', cardNumber, cvv, expiry);
}

// 示例 7: 在日志中记录个人身份信息
export function logPII(ssn, dob, address) {
  console.log('PII:', ssn, dob, address);
}

// 示例 8: 在日志中记录医疗信息
export function logMedicalInfo(patientId, diagnosis, treatment) {
  console.log('Medical Info:', patientId, diagnosis, treatment);
}

// 示例 9: 在日志中记录财务信息
export function logFinancialInfo(accountNumber, balance) {
  console.log('Financial Info:', accountNumber, balance);
}

// 示例 10: 在日志中记录法律信息
export function logLegalInfo(caseId, documentType) {
  console.log('Legal Info:', caseId, documentType);
}

// 示例 11: Vue组件中的日志漏洞
export default {
  name: 'LoggingVulnerableComponent',
  methods: {
    logUserAction(action, data) {
      console.log('User Action:', action, data);
    },
    
    logError(error) {
      console.error('Error:', error);
    },
    
    logDebug(message) {
      console.debug('Debug:', message);
    }
  },
  
  mounted() {
    const userData = this.$route.query.userData;
    this.logUserAction('login', userData);
  }
};

// 示例 12: 在生产环境中使用console.log
export function productionConsoleLog(message) {
  console.log(message);
}

// 示例 13: 在生产环境中使用console.error
export function productionConsoleError(error) {
  console.error(error);
}

// 示例 14: 在生产环境中使用console.warn
export function productionConsoleWarn(warning) {
  console.warn(warning);
}

// 示例 15: 在生产环境中使用console.debug
export function productionConsoleDebug(message) {
  console.debug(message);
}

// 示例 16: 缺少日志级别控制
export function logWithoutLevelControl(message) {
  console.log(message);
}

// 示例 17: 缺少日志过滤
export function logWithoutFilter(message) {
  console.log(message);
}

// 示例 18: 缺少日志脱敏
export function logWithoutSanitization(data) {
  console.log('Data:', data);
}

// 示例 19: 缺少日志加密
export function logWithoutEncryption(data) {
  console.log('Data:', data);
}

// 示例 20: 缺少日志访问控制
export function logWithoutAccessControl(data) {
  console.log('Data:', data);
}

// 示例 21: 缺少日志审计
export function logWithoutAudit(data) {
  console.log('Data:', data);
}

// 示例 22: 缺少日志监控
export function logWithoutMonitoring(data) {
  console.log('Data:', data);
}

// 示例 23: 缺少日志告警
export function logWithoutAlert(data) {
  console.log('Data:', data);
}

// 示例 24: 缺少日志归档
export function logWithoutArchive(data) {
  console.log('Data:', data);
}

// 示例 25: 缺少日志备份
export function logWithoutBackup(data) {
  console.log('Data:', data);
}

// 示例 26: 缺少日志恢复
export function logWithoutRecovery(data) {
  console.log('Data:', data);
}

// 示例 27: 缺少日志保留策略
export function logWithoutRetention(data) {
  console.log('Data:', data);
}

// 示例 28: 缺少日志清理
export function logWithoutCleanup(data) {
  console.log('Data:', data);
}

// 示例 29: 缺少日志压缩
export function logWithoutCompression(data) {
  console.log('Data:', data);
}

// 示例 30: 缺少日志加密传输
export function logWithoutSecureTransport(data) {
  console.log('Data:', data);
}

// 示例 31: 缺少日志完整性检查
export function logWithoutIntegrityCheck(data) {
  console.log('Data:', data);
}

// 示例 32: 缺少日志签名
export function logWithoutSignature(data) {
  console.log('Data:', data);
}

// 示例 33: 缺少日志哈希
export function logWithoutHash(data) {
  console.log('Data:', data);
}

// 示例 34: 缺少日志时间戳
export function logWithoutTimestamp(data) {
  console.log('Data:', data);
}

// 示例 35: 缺少日志用户标识
export function logWithoutUserId(data) {
  console.log('Data:', data);
}

// 示例 36: 缺少日志会话标识
export function logWithoutSessionId(data) {
  console.log('Data:', data);
}

// 示例 37: 缺少日志请求标识
export function logWithoutRequestId(data) {
  console.log('Data:', data);
}

// 示例 38: 缺少日志事务标识
export function logWithoutTransactionId(data) {
  console.log('Data:', data);
}

// 示例 39: 缺少日志追踪标识
export function logWithoutTraceId(data) {
  console.log('Data:', data);
}

// 示例 40: 缺少日志关联标识
export function logWithoutCorrelationId(data) {
  console.log('Data:', data);
}

// 示例 41: 缺少日志来源标识
export function logWithoutSourceId(data) {
  console.log('Data:', data);
}

// 示例 42: 缺少日志目标标识
export function logWithoutDestinationId(data) {
  console.log('Data:', data);
}

// 示例 43: 缺少日志操作标识
export function logWithoutOperationId(data) {
  console.log('Data:', data);
}

// 示例 44: 缺少日志结果标识
export function logWithoutResultId(data) {
  console.log('Data:', data);
}

// 示例 45: 缺少日志错误标识
export function logWithoutErrorId(data) {
  console.log('Data:', data);
}

// 示例 46: 缺少日志警告标识
export function logWithoutWarningId(data) {
  console.log('Data:', data);
}

// 示例 47: 缺少日志信息标识
export function logWithoutInfoId(data) {
  console.log('Data:', data);
}

// 示例 48: 缺少日志调试标识
export function logWithoutDebugId(data) {
  console.log('Data:', data);
}

// 示例 49: 缺少日志跟踪标识
export function logWithoutTraceId(data) {
  console.log('Data:', data);
}

// 示例 50: 缺少日志性能标识
export function logWithoutPerformanceId(data) {
  console.log('Data:', data);
}
