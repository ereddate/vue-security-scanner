// Blind XSS 漏洞示例文件

// 示例 1: 存储日志中的盲 XSS 攻击载荷
export function blindXssExample1(logMessage, userAgent, referer) {
  // 危险：服务器端日志记录可能包含盲 XSS 载荷
  const logEntry = {
    timestamp: new Date(),
    message: logMessage,  // 可能包含盲 XSS 载荷
    userAgent: userAgent, // 可能包含盲 XSS 载荷
    referer: referer      // 可能包含盲 XSS 载荷
  };
  
  // 记录到服务器日志 - 管理员查看日志时可能触发
  console.log(JSON.stringify(logEntry));
  
  return logEntry;
}

// 示例 2: 在管理面板可访问的地方存储盲 XSS
export function blindXssExample2(reportData) {
  // 危险：错误报告可能包含盲 XSS 载荷
  const report = {
    userId: reportData.userId,
    issue: reportData.issue,
    details: reportData.details,  // 可能包含盲 XSS 载荷
    contactInfo: reportData.contactInfo  // 可能包含盲 XSS 载荷
  };
  
  // 存储到数据库，管理员稍后会在管理界面查看
  storeReport(report);
  
  return report;
}

// 示例 3: 用户反馈表单中的盲 XSS
export function blindXssExample3(feedback) {
  // 危险：用户反馈可能包含盲 XSS 载荷
  const feedbackEntry = {
    name: feedback.name,
    email: feedback.email,
    subject: feedback.subject,
    message: feedback.message,  // 可能包含盲 XSS 载荷
    ip: feedback.ip,
    timestamp: new Date()
  };
  
  // 存储到数据库，客服人员会在后台查看
  storeFeedback(feedbackEntry);
  
  return feedbackEntry;
}

// 示例 4: 在 HTTP 头中插入盲 XSS
export function blindXssExample4(requestHeaders) {
  // 危险：请求头信息可能被记录并显示在管理界面
  const headerInfo = {
    'x-forwarded-for': requestHeaders['x-forwarded-for'],  // 可能包含盲 XSS 载荷
    'user-agent': requestHeaders['user-agent'],            // 可能包含盲 XSS 载荷
    'referer': requestHeaders['referer'],                  // 可能包含盲 XSS 载荷
    'x-custom-header': requestHeaders['x-custom-header']   // 可能包含盲 XSS 载荷
  };
  
  // 将头部信息记录到管理可见的日志
  logRequestHeaders(headerInfo);
  
  return headerInfo;
}

// 示例 5: 在联系表单中隐藏盲 XSS
export function blindXssExample5(contactForm) {
  // 危险：联系表单数据可能包含盲 XSS 载荷
  const contactSubmission = {
    fullName: contactForm.fullName,
    emailAddress: contactForm.emailAddress,
    phone: contactForm.phone,
    company: contactForm.company,     // 可能包含盲 XSS 载荷
    message: contactForm.message,     // 可能包含盲 XSS 载荷
    preferredContact: contactForm.preferredContact
  };
  
  // 存储到数据库，销售团队会在 CRM 中查看
  storeContactSubmission(contactSubmission);
  
  return contactSubmission;
}

// 示例 6: 在系统监控数据中植入盲 XSS
export function blindXssExample6(monitoringData) {
  // 危险：监控数据可能包含盲 XSS 载荷
  const metric = {
    endpoint: monitoringData.endpoint,    // 可能包含盲 XSS 载荷
    userAgent: monitoringData.userAgent,  // 可能包含盲 XSS 载荷
    responseTime: monitoringData.responseTime,
    statusCode: monitoringData.statusCode,
    timestamp: new Date()
  };
  
  // 存储监控数据，运维人员会在监控面板查看
  storeMonitoringMetric(metric);
  
  return metric;
}

// 示例 7: 在审计日志中嵌入盲 XSS
export function blindXssExample7(auditEvent) {
  // 危险：审计日志可能包含盲 XSS 载荷
  const auditRecord = {
    userId: auditEvent.userId,
    action: auditEvent.action,
    resource: auditEvent.resource,        // 可能包含盲 XSS 载荷
    details: auditEvent.details,          // 可能包含盲 XSS 载荷
    ipAddress: auditEvent.ipAddress,
    timestamp: new Date()
  };
  
  // 记录审计事件，安全团队会在审计面板查看
  logAuditEvent(auditRecord);
  
  return auditRecord;
}

// 示例 8: 在用户行为追踪中埋藏盲 XSS
export function blindXssExample8(behaviorData) {
  // 危险：行为数据可能包含盲 XSS 载荷
  const behavior = {
    userId: behaviorData.userId,
    pageUrl: behaviorData.pageUrl,        // 可能包含盲 XSS 载荷
    referrer: behaviorData.referrer,      // 可能包含盲 XSS 载荷
    userAgent: behaviorData.userAgent,    // 可能包含盲 XSS 载荷
    events: behaviorData.events,          // 可能包含盲 XSS 载荷
    timestamp: new Date()
  };
  
  // 存储行为数据，分析人员会在分析面板查看
  storeBehaviorData(behavior);
  
  return behavior;
}

// 示例 9: 在错误跟踪系统中植入盲 XSS
export function blindXssExample9(errorReport) {
  // 危险：错误报告可能包含盲 XSS 载荷
  const error = {
    errorType: errorReport.errorType,
    errorMessage: errorReport.errorMessage,    // 可能包含盲 XSS 载荷
    stackTrace: errorReport.stackTrace,       // 可能包含盲 XSS 载荷
    url: errorReport.url,                     // 可能包含盲 XSS 载荷
    userAgent: errorReport.userAgent,         // 可能包含盲 XSS 载荷
    timestamp: new Date()
  };
  
  // 记录错误，开发人员会在错误跟踪系统中查看
  logErrorReport(error);
  
  return error;
}

// 示例 10: 在评论审核队列中隐藏盲 XSS
export function blindXssExample10(comment) {
  // 危险：评论内容可能包含盲 XSS 载荷
  const commentEntry = {
    postId: comment.postId,
    author: comment.author,
    content: comment.content,                 // 可能包含盲 XSS 载荷
    moderationQueue: true,
    submittedAt: new Date()
  };
  
  // 添加到审核队列，版主会在审核界面查看
  addToModerationQueue(commentEntry);
  
  return commentEntry;
}

// 示例 11: 在 API 调用日志中埋入盲 XSS
export function blindXssExample11(apiCall) {
  // 危险：API 调用详情可能包含盲 XSS 载荷
  const callLog = {
    endpoint: apiCall.endpoint,
    method: apiCall.method,
    queryParams: apiCall.queryParams,         // 可能包含盲 XSS 载荷
    requestBody: apiCall.requestBody,         // 可能包含盲 XSS 载荷
    responseCode: apiCall.responseCode,
    callerIp: apiCall.callerIp,
    timestamp: new Date()
  };
  
  // 记录 API 调用，开发人员会在 API 监控面板查看
  logApiCall(callLog);
  
  return callLog;
}

// 示例 12: 在支付事务日志中植入盲 XSS
export function blindXssExample12(transaction) {
  // 危险：支付事务详情可能包含盲 XSS 载荷
  const payment = {
    transactionId: transaction.transactionId,
    amount: transaction.amount,
    currency: transaction.currency,
    customerInfo: transaction.customerInfo,   // 可能包含盲 XSS 载荷
    billingAddress: transaction.billingAddress, // 可能包含盲 XSS 载荷
    paymentMethod: transaction.paymentMethod,
    timestamp: new Date()
  };
  
  // 记录支付事务，财务人员会在财务系统中查看
  logPaymentTransaction(payment);
  
  return payment;
}

// 示例 13: 在用户配置备份中隐藏盲 XSS
export function blindXssExample13(configBackup) {
  // 危险：配置备份可能包含盲 XSS 载荷
  const backup = {
    userId: configBackup.userId,
    configType: configBackup.configType,
    configData: configBackup.configData,     // 可能包含盲 XSS 载荷
    backupDate: new Date()
  };
  
  // 存储备份，管理员会在配置管理界面查看
  storeConfigBackup(backup);
  
  return backup;
}

// 示例 14: 在第三方集成回调中植入盲 XSS
export function blindXssExample14(integrationCallback) {
  // 危险：集成回调数据可能包含盲 XSS 载荷
  const callback = {
    integrationId: integrationCallback.integrationId,
    eventType: integrationCallback.eventType,
    payload: integrationCallback.payload,     // 可能包含盲 XSS 载荷
    signature: integrationCallback.signature,
    receivedAt: new Date()
  };
  
  // 记录集成回调，开发人员会在集成管理面板查看
  logIntegrationCallback(callback);
  
  return callback;
}

// 示例 15: 在文件上传元数据中隐藏盲 XSS
export function blindXssExample15(fileUpload) {
  // 危险：文件元数据可能包含盲 XSS 载荷
  const file = {
    fileId: fileUpload.fileId,
    originalName: fileUpload.originalName,   // 可能包含盲 XSS 载荷
    mimeType: fileUpload.mimeType,
    uploader: fileUpload.uploader,
    metadata: fileUpload.metadata,           // 可能包含盲 XSS 载荷
    uploadTime: new Date()
  };
  
  // 记录文件上传，管理员会在文件管理界面查看
  logFileUpload(file);
  
  return file;
}

// 示例 16: 在会话数据中植入盲 XSS
export function blindXssExample16(sessionData) {
  // 危险：会话数据可能包含盲 XSS 载荷
  const session = {
    sessionId: sessionData.sessionId,
    userId: sessionData.userId,
    userAgent: sessionData.userAgent,        // 可能包含盲 XSS 载荷
    ip: sessionData.ip,
    sessionData: sessionData.sessionData,    // 可能包含盲 XSS 载荷
    createdAt: new Date()
  };
  
  // 记录会话数据，安全团队会在会话管理面板查看
  logSessionData(session);
  
  return session;
}

// 示例 17: 在系统性能指标中隐藏盲 XSS
export function blindXssExample17(performanceMetrics) {
  // 危险：性能指标可能包含盲 XSS 载荷
  const metrics = {
    serverId: performanceMetrics.serverId,
    cpuUsage: performanceMetrics.cpuUsage,
    memoryUsage: performanceMetrics.memoryUsage,
    requestPath: performanceMetrics.requestPath,  // 可能包含盲 XSS 载荷
    clientInfo: performanceMetrics.clientInfo,    // 可能包含盲 XSS 载荷
    timestamp: new Date()
  };
  
  // 记录性能指标，运维人员会在性能监控面板查看
  logPerformanceMetrics(metrics);
  
  return metrics;
}

// 示例 18: 在用户权限变更日志中植入盲 XSS
export function blindXssExample18(permissionChange) {
  // 危险：权限变更详情可能包含盲 XSS 载荷
  const permissionLog = {
    adminId: permissionChange.adminId,
    userId: permissionChange.userId,
    action: permissionChange.action,
    resource: permissionChange.resource,          // 可能包含盲 XSS 载荷
    oldPermissions: permissionChange.oldPermissions, // 可能包含盲 XSS 载荷
    newPermissions: permissionChange.newPermissions,
    timestamp: new Date()
  };
  
  // 记录权限变更，安全管理员会在权限管理界面查看
  logPermissionChange(permissionLog);
  
  return permissionLog;
}

// 示例 19: 在系统配置更改日志中隐藏盲 XSS
export function blindXssExample19(configChange) {
  // 危险：配置更改详情可能包含盲 XSS 载荷
  const changeLog = {
    adminId: configChange.adminId,
    configKey: configChange.configKey,
    oldValue: configChange.oldValue,              // 可能包含盲 XSS 载荷
    newValue: configChange.newValue,              // 可能包含盲 XSS 载荷
    changeReason: configChange.changeReason,      // 可能包含盲 XSS 载荷
    timestamp: new Date()
  };
  
  // 记录配置更改，系统管理员会在配置管理界面查看
  logConfigChange(changeLog);
  
  return changeLog;
}

// 示例 20: 复杂的盲 XSS 场景 - 多层嵌套的数据结构
export function blindXssExample20(complexData) {
  // 危险：复杂数据结构中可能多处包含盲 XSS 载荷
  const complexRecord = {
    id: complexData.id,
    metadata: {
      createdBy: complexData.metadata.createdBy,
      userAgent: complexData.metadata.userAgent,      // 可能包含盲 XSS 载荷
      source: complexData.metadata.source,            // 可能包含盲 XSS 载荷
      tags: complexData.metadata.tags.map(tag => ({   // 数组元素可能包含盲 XSS 载荷
        name: tag.name,
        value: tag.value
      }))
    },
    data: {
      content: complexData.data.content,              // 可能包含盲 XSS 载荷
      attributes: complexData.data.attributes,        // 可能包含盲 XSS 载荷
      references: complexData.data.references.map(ref => ({ // 引用可能包含盲 XSS 载荷
        id: ref.id,
        type: ref.type,
        value: ref.value
      }))
    },
    processingHistory: complexData.processingHistory.map(entry => ({
      processor: entry.processor,
      action: entry.action,
      details: entry.details,                          // 可能包含盲 XSS 载荷
      timestamp: entry.timestamp
    })),
    timestamp: new Date()
  };
  
  // 存储复杂记录，不同角色的用户会在不同界面查看
  storeComplexRecord(complexRecord);
  
  return complexRecord;
}

// 模拟存储和日志函数
function storeReport(report) { /* 实现报告存储 */ }
function storeFeedback(feedbackEntry) { /* 实现反馈存储 */ }
function logRequestHeaders(headers) { /* 实现请求头日志记录 */ }
function storeContactSubmission(submission) { /* 实现联系提交存储 */ }
function storeMonitoringMetric(metric) { /* 实现监控指标存储 */ }
function logAuditEvent(event) { /* 实现审计事件日志 */ }
function storeBehaviorData(behavior) { /* 实现行为数据存储 */ }
function logErrorReport(error) { /* 实现错误报告日志 */ }
function addToModerationQueue(comment) { /* 实现审核队列添加 */ }
function logApiCall(call) { /* 实现 API 调用日志 */ }
function logPaymentTransaction(payment) { /* 实现支付事务日志 */ }
function storeConfigBackup(backup) { /* 实现配置备份存储 */ }
function logIntegrationCallback(callback) { /* 实现集成回调日志 */ }
function logFileUpload(file) { /* 实现文件上传日志 */ }
function logSessionData(session) { /* 实现会话数据日志 */ }
function logPerformanceMetrics(metrics) { /* 实现性能指标日志 */ }
function logPermissionChange(change) { /* 实现权限变更日志 */ }
function logConfigChange(change) { /* 实现配置变更日志 */ }
function storeComplexRecord(record) { /* 实现复杂记录存储 */ }
