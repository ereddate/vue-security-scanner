// 错误处理漏洞示例文件

// 示例 1: 在错误消息中暴露敏感信息
export function exposeSensitiveInfoInError(error) {
  throw new Error(`Failed to connect to database with user: admin and password: secret123`);
}

// 示例 2: 在错误消息中暴露堆栈跟踪
export function exposeStackTraceInError(error) {
  throw new Error(`Error occurred: ${error.stack}`);
}

// 示例 3: 在错误消息中暴露文件路径
export function exposeFilePathInError(filePath) {
  throw new Error(`Failed to read file: /var/www/html/config/database.json`);
}

// 示例 4: 在错误消息中暴露SQL查询
export function exposeSQLInError(query) {
  throw new Error(`Failed to execute query: SELECT * FROM users WHERE username = 'admin'`);
}

// 示例 5: 在错误消息中暴露API密钥
export function exposeAPIKeyInError(apiKey) {
  throw new Error(`Failed to authenticate with API key: sk-1234567890`);
}

// 示例 6: 缺少错误处理
export function noErrorHandling() {
  const result = riskyOperation();
  return result;
}

// 示例 7: 吞噬错误
export function swallowError() {
  try {
    riskyOperation();
  } catch (error) {
  }
}

// 示例 8: 忽略错误
export function ignoreError() {
  try {
    riskyOperation();
  } catch (error) {
    console.log('Ignoring error');
  }
}

// 示例 9: 记录错误但不处理
export function logOnlyError() {
  try {
    riskyOperation();
  } catch (error) {
    console.error(error);
  }
}

// 示例 10: 返回通用错误消息
export function genericErrorMessage() {
  try {
    riskyOperation();
  } catch (error) {
    throw new Error('An error occurred');
  }
}

// 示例 11: Vue组件中的错误处理漏洞
export default {
  name: 'ErrorHandlingVulnerableComponent',
  methods: {
    riskyOperation() {
      throw new Error(`Failed with sensitive data: ${this.sensitiveData}`);
    },
    
    handleError(error) {
      console.error('Error:', error);
      throw new Error(`Error: ${error.message}`);
    },
    
    catchError() {
      try {
        this.riskyOperation();
      } catch (error) {
        console.log('Caught error:', error);
      }
    }
  },
  
  mounted() {
    this.catchError();
  }
};

// 示例 12: 在错误中暴露用户数据
export function exposeUserDataInError(userData) {
  throw new Error(`Failed to process user: ${JSON.stringify(userData)}`);
}

// 示例 13: 在错误中暴露会话数据
export function exposeSessionDataInError(sessionData) {
  throw new Error(`Failed to process session: ${JSON.stringify(sessionData)}`);
}

// 示例 14: 在错误中暴露请求数据
export function exposeRequestDataInError(requestData) {
  throw new Error(`Failed to process request: ${JSON.stringify(requestData)}`);
}

// 示例 15: 在错误中暴露响应数据
export function exposeResponseDataInError(responseData) {
  throw new Error(`Failed to process response: ${JSON.stringify(responseData)}`);
}

// 示例 16: 缺少错误分类
export function noErrorClassification(error) {
  throw error;
}

// 示例 17: 缺少错误优先级
export function noErrorPriority(error) {
  throw error;
}

// 示例 18: 缺少错误严重性
export function noErrorSeverity(error) {
  throw error;
}

// 示例 19: 缺少错误上下文
export function noErrorContext(error) {
  throw error;
}

// 示例 20: 缺少错误追踪
export function noErrorTracking(error) {
  throw error;
}

// 示例 21: 缺少错误恢复
export function noErrorRecovery(error) {
  throw error;
}

// 示例 22: 缺少错误重试
export function noErrorRetry(error) {
  throw error;
}

// 示例 23: 缺少错误回退
export function noErrorFallback(error) {
  throw error;
}

// 示例 24: 缺少错误降级
export function noErrorDegradation(error) {
  throw error;
}

// 示例 25: 缺少错误隔离
export function noErrorIsolation(error) {
  throw error;
}

// 示例 26: 缺少错误遏制
export function noErrorContainment(error) {
  throw error;
}

// 示例 27: 缺少错误预防
export function noErrorPrevention(error) {
  throw error;
}

// 示例 28: 缺少错误检测
export function noErrorDetection(error) {
  throw error;
}

// 示例 29: 缺少错误诊断
export function noErrorDiagnosis(error) {
  throw error;
}

// 示例 30: 缺少错误修复
export function noErrorRemediation(error) {
  throw error;
}

// 示例 31: 缺少错误通知
export function noErrorNotification(error) {
  throw error;
}

// 示例 32: 缺少错误报告
export function noErrorReporting(error) {
  throw error;
}

// 示例 33: 缺少错误分析
export function noErrorAnalysis(error) {
  throw error;
}

// 示例 34: 缺少错误统计
export function noErrorStatistics(error) {
  throw error;
}

// 示例 35: 缺少错误指标
export function noErrorMetrics(error) {
  throw error;
}

// 示例 36: 缺少错误监控
export function noErrorMonitoring(error) {
  throw error;
}

// 示例 37: 缺少错误告警
export function noErrorAlerting(error) {
  throw error;
}

// 示例 38: 缺少错误日志
export function noErrorLogging(error) {
  throw error;
}

// 示例 39: 缺少错误审计
export function noErrorAuditing(error) {
  throw error;
}

// 示例 40: 缺少错误归档
export function noErrorArchiving(error) {
  throw error;
}

// 示例 41: 缺少错误保留
export function noErrorRetention(error) {
  throw error;
}

// 示例 42: 缺少错误清理
export function noErrorCleanup(error) {
  throw error;
}

// 示例 43: 缺少错误压缩
export function noErrorCompression(error) {
  throw error;
}

// 示例 44: 缺少错误加密
export function noErrorEncryption(error) {
  throw error;
}

// 示例 45: 缺少错误签名
export function noErrorSignature(error) {
  throw error;
}

// 示例 46: 缺少错误哈希
export function noErrorHash(error) {
  throw error;
}

// 示例 47: 缺少错误完整性
export function noErrorIntegrity(error) {
  throw error;
}

// 示例 48: 缺少错误一致性
export function noErrorConsistency(error) {
  throw error;
}

// 示例 49: 缺少错误可用性
export function noErrorAvailability(error) {
  throw error;
}

// 示例 50: 缺少错误可靠性
export function noErrorReliability(error) {
  throw error;
}
