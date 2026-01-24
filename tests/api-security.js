// API安全漏洞示例文件

// 示例 1: 缺少速率限制的API
export function apiWithoutRateLimit(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 2: 缺少认证的API
export function apiWithoutAuth(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 3: 缺少授权的API
export function apiWithoutAuthorization(userId, data) {
  return fetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 示例 4: 缺少输入验证的API
export function apiWithoutValidation(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 5: 缺少输出编码的API
export function apiWithoutEncoding(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(response => response.text());
}

// 示例 6: 缺少CORS配置的API
export function apiWithoutCORS(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 7: 缺少HTTPS的API
export function apiWithoutHTTPS(data) {
  return fetch('http://api.example.com/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 8: 缺少版本控制的API
export function apiWithoutVersion(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 9: 缺少错误处理的API
export function apiWithoutErrorHandling(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 10: 缺少日志记录的API
export function apiWithoutLogging(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 11: 缺少监控的API
export function apiWithoutMonitoring(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 12: 缺少文档的API
export function apiWithoutDocumentation(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 13: 缺少测试的API
export function apiWithoutTesting(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 14: 缺少备份的API
export function apiWithoutBackup(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 15: 缺少恢复的API
export function apiWithoutRecovery(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 16: Vue组件中的API安全漏洞
export default {
  name: 'APISecurityComponent',
  methods: {
    fetchData() {
      return fetch('/api/data', {
        method: 'GET'
      });
    },
    
    submitData(data) {
      return fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    updateData(id, data) {
      return fetch(`/api/data/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    deleteData(id) {
      return fetch(`/api/data/${id}`, {
        method: 'DELETE'
      });
    }
  }
};

// 示例 17: 缺少请求验证的API
export function apiWithoutRequestValidation(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 18: 缺少响应验证的API
export function apiWithoutResponseValidation(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(response => response.json());
}

// 示例 19: 缺少数据验证的API
export function apiWithoutDataValidation(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 20: 缺少业务逻辑验证的API
export function apiWithoutBusinessLogicValidation(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 21: 缺少权限检查的API
export function apiWithoutPermissionCheck(userId, data) {
  return fetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 示例 22: 缺少角色检查的API
export function apiWithoutRoleCheck(data) {
  return fetch('/api/admin/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 23: 缺少资源检查的API
export function apiWithoutResourceCheck(resourceId, data) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 示例 24: 缺少操作检查的API
export function apiWithoutOperationCheck(data) {
  return fetch('/api/data/delete', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 25: 缺少上下文检查的API
export function apiWithoutContextCheck(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 26: 缺少时间检查的API
export function apiWithoutTimeCheck(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 27: 缺少位置检查的API
export function apiWithoutLocationCheck(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 28: 缺少设备检查的API
export function apiWithoutDeviceCheck(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 29: 缺少IP检查的API
export function apiWithoutIPCheck(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 30: 缺少用户代理检查的API
export function apiWithoutUserAgentCheck(data) {
  return fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
