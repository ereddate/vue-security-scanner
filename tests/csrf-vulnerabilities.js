// CSRF (Cross-Site Request Forgery) 漏洞示例文件

// 示例 1: 缺少CSRF Token的表单提交
export function submitFormWithoutCSRFToken(formData) {
  fetch('/api/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
}

// 示例 2: 缺少CSRF Token的AJAX请求
export function updateUserData(userId, userData) {
  return fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
}

// 示例 3: 缺少CSRF Token的DELETE请求
export function deleteUser(userId) {
  return fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// 示例 4: 缺少CSRF Header的API调用
export function createPost(postData) {
  return fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
}

// 示例 5: 缺少SameSite Cookie配置的请求
export function performAction(actionData) {
  return fetch('/api/action', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(actionData)
  });
}

// 示例 6: Vue组件中的CSRF漏洞
export default {
  name: 'CSRFVulnerableComponent',
  methods: {
    submitForm() {
      fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      });
    },
    
    updateProfile() {
      fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.profileData)
      });
    },
    
    deleteAccount() {
      fetch('/api/account/delete', {
        method: 'DELETE'
      });
    }
  }
};

// 示例 7: 缺少Referer检查的请求
export function sensitiveOperation(data) {
  return fetch('/api/sensitive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

// 示例 8: 缺少Origin检查的请求
export function transferFunds(fromAccount, toAccount, amount) {
  return fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromAccount,
      to: toAccount,
      amount: amount
    })
  });
}

// 示例 9: 使用GET请求修改状态（易受CSRF攻击）
export function changePassword(oldPassword, newPassword) {
  return fetch(`/api/change-password?old=${oldPassword}&new=${newPassword}`, {
    method: 'GET'
  });
}

// 示例 10: 缺少双重提交Cookie的请求
export function updateEmail(email) {
  return fetch('/api/update-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
}
