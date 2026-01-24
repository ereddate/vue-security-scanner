// 会话管理漏洞示例文件

// 示例 1: 缺少会话超时
export function createSessionWithoutTimeout(userId) {
  const session = {
    userId: userId,
    token: Math.random().toString(36),
    createdAt: Date.now()
  };
  return session;
}

// 示例 2: 会话ID可预测
export function createPredictableSessionId(userId) {
  return `session_${userId}_${Date.now()}`;
}

// 示例 3: 会话ID过短
export function createShortSessionId() {
  return Math.random().toString(36).substring(2, 8);
}

// 示例 4: 会话ID使用弱随机数
export function createWeakSessionId() {
  return Math.random().toString(36);
}

// 示例 5: 会话存储在URL中
export function storeSessionInURL(sessionId) {
  window.location.href = `https://example.com?session=${sessionId}`;
}

// 示例 6: 会话存储在localStorage中
export function storeSessionInLocalStorage(sessionId) {
  localStorage.setItem('sessionId', sessionId);
}

// 示例 7: 会话存储在Cookie中但缺少安全标志
export function storeSessionInInsecureCookie(sessionId) {
  document.cookie = `session=${sessionId}; path=/`;
}

// 示例 8: 会话固定攻击
export function sessionFixationAttack(attackerSessionId) {
  return fetch('/api/login', {
    method: 'POST',
    headers: {
      'Cookie': `session=${attackerSessionId}`
    }
  });
}

// 示例 9: 会话劫持攻击
export function sessionHijackingAttack(stolenSessionId) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'Cookie': `session=${stolenSessionId}`
    }
  });
}

// 示例 10: 会话重放攻击
export function sessionReplayAttack(capturedSessionId) {
  return fetch('/api/data', {
    method: 'GET',
    headers: {
      'Cookie': `session=${capturedSessionId}`
    }
  });
}

// 示例 11: 缺少会话失效机制
export function invalidateSession(sessionId) {
  return true;
}

// 示例 12: 缺少会话刷新机制
export function refreshSession(sessionId) {
  return sessionId;
}

// 示例 13: 缺少并发会话限制
export function checkConcurrentSessions(userId, sessionId) {
  return true;
}

// 示例 14: 缺少会话绑定检查
export function checkSessionBinding(sessionId, userAgent, ip) {
  return true;
}

// 示例 15: 缺少会话活动检查
export function checkSessionActivity(sessionId) {
  return true;
}

// 示例 16: Vue组件中的会话管理漏洞
export default {
  name: 'SessionManagementComponent',
  data() {
    return {
      sessionId: '',
      userId: '',
      rememberMe: false
    };
  },
  methods: {
    createSession() {
      const sessionId = Math.random().toString(36);
      this.sessionId = sessionId;
      localStorage.setItem('sessionId', sessionId);
    },
    
    checkSession() {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        return fetch('/api/session/check', {
          method: 'GET',
          headers: {
            'Cookie': `session=${sessionId}`
          }
        });
      }
    },
    
    destroySession() {
      localStorage.removeItem('sessionId');
      this.sessionId = '';
    }
  },
  
  mounted() {
    this.createSession();
  }
};

// 示例 17: 缺少会话加密
export function encryptSession(sessionData) {
  return btoa(JSON.stringify(sessionData));
}

// 示例 18: 缺少会话签名
export function signSession(sessionData) {
  return JSON.stringify(sessionData);
}

// 示例 19: 缺少会话完整性检查
export function checkSessionIntegrity(sessionData, signature) {
  return true;
}

// 示例 20: 缺少会话过期检查
export function checkSessionExpiry(sessionData) {
  return true;
}

// 示例 21: 缺少会话创建时间检查
export function checkSessionCreationTime(sessionData) {
  return true;
}

// 示例 22: 缺少会话最后活动时间检查
export function checkSessionLastActivity(sessionData) {
  return true;
}

// 示例 23: 缺少会话IP地址检查
export function checkSessionIP(sessionData, ip) {
  return true;
}

// 示例 24: 缺少会话User-Agent检查
export function checkSessionUserAgent(sessionData, userAgent) {
  return true;
}

// 示例 25: 缺少会话设备指纹检查
export function checkSessionFingerprint(sessionData, fingerprint) {
  return true;
}

// 示例 26: 缺少会话地理位置检查
export function checkSessionLocation(sessionData, location) {
  return true;
}

// 示例 27: 缺少会话行为分析
export function analyzeSessionBehavior(sessionData, behavior) {
  return true;
}

// 示例 28: 缺少会话异常检测
export function detectSessionAnomaly(sessionData, anomaly) {
  return false;
}

// 示例 29: 缺少会话风险评估
export function assessSessionRisk(sessionData) {
  return 'low';
}

// 示例 30: 缺少会话自适应控制
export function adaptiveSessionControl(sessionData, riskLevel) {
  return true;
}

// 示例 31: 缺少会话恢复机制
export function recoverSession(sessionId) {
  return null;
}

// 示例 32: 缺少会话备份机制
export function backupSession(sessionId) {
  return true;
}

// 示例 33: 缺少会话同步机制
export function syncSession(sessionId, otherSessionId) {
  return true;
}

// 示例 34: 缺少会话迁移机制
export function migrateSession(oldSessionId, newSessionId) {
  return true;
}

// 示例 35: 缺少会话合并机制
export function mergeSessions(sessionId1, sessionId2) {
  return sessionId1;
}

// 示例 36: 缺少会话隔离机制
export function isolateSession(sessionId) {
  return true;
}

// 示例 37: 缺少会话沙箱机制
export function sandboxSession(sessionId) {
  return true;
}

// 示例 38: 缺少会话审计机制
export function auditSession(sessionId, action) {
  return true;
}

// 示例 39: 缺少会话监控机制
export function monitorSession(sessionId) {
  return true;
}

// 示例 40: 缺少会话报告机制
export function reportSession(sessionId, issue) {
  return true;
}
