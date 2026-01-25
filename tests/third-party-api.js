// Third-Party API 漏洞示例文件

// 示例 1: 不安全的 API 调用
export function thirdPartyApiExample1() {
  fetch('https://api.example.com/data', {
    method: 'POST',
    body: JSON.stringify({
      apiKey: 'sk-1234567890abcdef',
      sensitiveData: 'secret'
    })
  });
}

// 示例 2: 泄露 API 密钥
export function thirdPartyApiExample2() {
  const apiKey = 'sk-1234567890abcdef';
  
  fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
}

// 示例 3: 不验证 API 响应
export function thirdPartyApiExample3() {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      // 危险：不验证 API 响应
      document.body.innerHTML = data.content;
    });
}

// 示例 4: 使用不安全的 API 端点
export function thirdPartyApiExample4() {
  fetch('http://api.example.com/data', {
    method: 'POST',
    body: JSON.stringify({
      username: 'user',
      password: 'pass'
    })
  });
}

// 示例 5: API 调用缺少错误处理
export function thirdPartyApiExample5() {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      processData(data);
    });
}

// 示例 6: 第三方 API 数据泄露
export function thirdPartyApiExample6() {
  fetch('https://api.example.com/submit', {
    method: 'POST',
    body: JSON.stringify({
      userData: {
        name: 'John',
        email: 'john@example.com',
        ssn: '123-45-6789'
      }
    })
  });
}

// 示例 7: API 重放攻击
export function thirdPartyApiExample7() {
  const request = {
    url: 'https://api.example.com/transfer',
    data: { amount: 1000, to: 'attacker' }
  };
  
  fetch(request.url, {
    method: 'POST',
    body: JSON.stringify(request.data)
  });
}

// 示例 8: API 注入攻击
export function thirdPartyApiExample8() {
  const userInput = '<script>alert("XSS")</script>';
  
  fetch('https://api.example.com/search', {
    method: 'POST',
    body: JSON.stringify({ query: userInput })
  });
}

// 示例 9: API 速率限制绕过
export function thirdPartyApiExample9() {
  for (let i = 0; i < 10000; i++) {
    fetch('https://api.example.com/data');
  }
}

// 示例 10: 第三方 API 权限提升
export function thirdPartyApiExample10() {
  fetch('https://api.example.com/admin/delete-user', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer user-token'
    },
    body: JSON.stringify({ userId: 'admin' })
  });
}
