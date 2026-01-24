// 权限管理漏洞示例文件

// 示例 1: 缺少权限检查
export function accessResourceWithoutPermission(resourceId) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 2: 缺少角色检查
export function accessAdminResource(resourceId) {
  return fetch(`/api/admin/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 3: 缺少用户检查
export function accessUserResource(userId, resourceId) {
  return fetch(`/api/users/${userId}/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 4: 缺少资源所有权检查
export function modifyResourceWithoutOwnership(resourceId, data) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 示例 5: 缺少操作权限检查
export function performOperationWithoutPermission(operation, resourceId) {
  return fetch(`/api/resources/${resourceId}/${operation}`, {
    method: 'POST'
  });
}

// 示例 6: 缺少上下文权限检查
export function accessResourceWithoutContext(resourceId, context) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 7: 缺少时间权限检查
export function accessResourceWithoutTimeCheck(resourceId) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 8: 缺少位置权限检查
export function accessResourceWithoutLocationCheck(resourceId, location) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 9: 缺少设备权限检查
export function accessResourceWithoutDeviceCheck(resourceId, device) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 10: 缺少IP权限检查
export function accessResourceWithoutIPCheck(resourceId, ip) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 11: Vue组件中的权限管理漏洞
export default {
  name: 'PermissionManagementComponent',
  methods: {
    accessResource(resourceId) {
      return fetch(`/api/resources/${resourceId}`, {
        method: 'GET'
      });
    },
    
    modifyResource(resourceId, data) {
      return fetch(`/api/resources/${resourceId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    deleteResource(resourceId) {
      return fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE'
      });
    }
  },
  
  mounted() {
    const resourceId = this.$route.query.resourceId;
    this.accessResource(resourceId);
  }
};

// 示例 12: 缺少权限继承检查
export function accessResourceWithoutInheritanceCheck(resourceId) {
  return fetch(`/api/resources/${resourceId}`, {
    method: 'GET'
  });
}

// 示例 13: 缺少权限委托检查
export function delegatePermissionWithoutCheck(resourceId, delegatee) {
  return fetch(`/api/resources/${resourceId}/delegate`, {
    method: 'POST',
    body: JSON.stringify({ delegatee: delegatee })
  });
}

// 示例 14: 缺少权限撤销检查
export function revokePermissionWithoutCheck(resourceId, revokee) {
  return fetch(`/api/resources/${resourceId}/revoke`, {
    method: 'POST',
    body: JSON.stringify({ revokee: revokee })
  });
}

// 示例 15: 缺少权限授予检查
export function grantPermissionWithoutCheck(resourceId, grantee) {
  return fetch(`/api/resources/${resourceId}/grant`, {
    method: 'POST',
    body: JSON.stringify({ grantee: grantee })
  });
}

// 示例 16: 缺少权限拒绝检查
export function denyPermissionWithoutCheck(resourceId, denyee) {
  return fetch(`/api/resources/${resourceId}/deny`, {
    method: 'POST',
    body: JSON.stringify({ denyee: denyee })
  });
}

// 示例 17: 缺少权限允许检查
export function allowPermissionWithoutCheck(resourceId, allowee) {
  return fetch(`/api/resources/${resourceId}/allow`, {
    method: 'POST',
    body: JSON.stringify({ allowee: allowee })
  });
}

// 示例 18: 缺少权限限制检查
export function restrictPermissionWithoutCheck(resourceId, restriction) {
  return fetch(`/api/resources/${resourceId}/restrict`, {
    method: 'POST',
    body: JSON.stringify({ restriction: restriction })
  });
}

// 示例 19: 缺少权限扩展检查
export function extendPermissionWithoutCheck(resourceId, extension) {
  return fetch(`/api/resources/${resourceId}/extend`, {
    method: 'POST',
    body: JSON.stringify({ extension: extension })
  });
}

// 示例 20: 缺少权限修改检查
export function modifyPermissionWithoutCheck(resourceId, modification) {
  return fetch(`/api/resources/${resourceId}/modify`, {
    method: 'POST',
    body: JSON.stringify({ modification: modification })
  });
}

// 示例 21: 缺少权限验证
export function verifyPermissionWithoutCheck(resourceId, permission) {
  return true;
}

// 示例 22: 缺少权限审计
export function auditPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 23: 缺少权限监控
export function monitorPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 24: 缺少权限告警
export function alertPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 25: 缺少权限日志
export function logPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 26: 缺少权限报告
export function reportPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 27: 缺少权限分析
export function analyzePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 28: 缺少权限统计
export function statisticsPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 29: 缺少权限指标
export function metricsPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 30: 缺少权限追踪
export function trackPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 31: 缺少权限历史
export function historyPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 32: 缺少权限记录
export function recordPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 33: 缺少权限归档
export function archivePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 34: 缺少权限备份
export function backupPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 35: 缺少权限恢复
export function restorePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 36: 缺少权限清理
export function cleanupPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 37: 缺少权限保留
export function retainPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 38: 缺少权限删除
export function deletePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 39: 缺少权限更新
export function updatePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 40: 缺少权限创建
export function createPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 41: 缺少权限读取
export function readPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 42: 缺少权限写入
export function writePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 43: 缺少权限执行
export function executePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 44: 缺少权限管理
export function managePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 45: 缺少权限控制
export function controlPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 46: 缺少权限策略
export function policyPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 47: 缺少权限规则
export function rulePermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 48: 缺少权限配置
export function configPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 49: 缺少权限设置
export function settingPermissionWithoutCheck(resourceId, action) {
  return true;
}

// 示例 50: 缺少权限选项
export function optionPermissionWithoutCheck(resourceId, action) {
  return true;
}
