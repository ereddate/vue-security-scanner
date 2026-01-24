// 输入验证漏洞示例文件

// 示例 1: v-model没有验证
export default {
  name: 'InputValidationComponent',
  data() {
    return {
      userInput: '',
      email: '',
      phone: '',
      url: ''
    };
  },
  methods: {
    submitForm() {
      // 直接使用用户输入，没有验证
      fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({
          input: this.userInput,
          email: this.email,
          phone: this.phone,
          url: this.url
        })
      });
    }
  }
};

// 示例 2: 缺少表单验证
export function processFormData(formData) {
  // 直接处理表单数据，没有验证
  return fetch('/api/process', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
}

// 示例 3: 缺少URL验证
export function navigateToUrl(url) {
  // 直接使用用户提供的URL，没有验证
  window.location.href = url;
}

// 示例 4: 缺少邮箱验证
export function sendEmail(email, message) {
  // 直接使用用户提供的邮箱，没有验证
  return fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({ email, message })
  });
}

// 示例 5: 缺少电话号码验证
export function sendSMS(phone, message) {
  // 直接使用用户提供的电话号码，没有验证
  return fetch('/api/send-sms', {
    method: 'POST',
    body: JSON.stringify({ phone, message })
  });
}

// 示例 6: 缺少数字验证
export function processNumber(number) {
  // 直接使用用户提供的数字，没有验证
  return fetch('/api/process-number', {
    method: 'POST',
    body: JSON.stringify({ number })
  });
}

// 示例 7: 缺少日期验证
export function processDate(date) {
  // 直接使用用户提供的日期，没有验证
  return fetch('/api/process-date', {
    method: 'POST',
    body: JSON.stringify({ date })
  });
}

// 示例 8: 缺少文件类型验证
export function uploadFile(file) {
  // 直接上传文件，没有验证类型
  const formData = new FormData();
  formData.append('file', file);
  return fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
}

// 示例 9: 缺少文件大小验证
export function uploadFileWithoutSizeCheck(file) {
  // 直接上传文件，没有验证大小
  const formData = new FormData();
  formData.append('file', file);
  return fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
}

// 示例 10: 缺少SQL注入防护
export function queryDatabase(query) {
  // 直接使用用户提供的查询，没有防护
  return fetch('/api/query', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
}

// 示例 11: 缺少XSS防护
export function renderHTML(html) {
  // 直接渲染HTML，没有XSS防护
  document.getElementById('content').innerHTML = html;
}

// 示例 12: 缺少CSRF防护
export function updateProfile(profileData) {
  // 直接更新用户资料，没有CSRF防护
  return fetch('/api/profile/update', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
}

// 示例 13: 缺少命令注入防护
export function executeCommand(command) {
  // 直接执行命令，没有防护
  return fetch('/api/execute', {
    method: 'POST',
    body: JSON.stringify({ command })
  });
}

// 示例 14: 缺少路径遍历防护
export function readFile(filePath) {
  // 直接读取文件，没有路径遍历防护
  return fetch('/api/read-file', {
    method: 'POST',
    body: JSON.stringify({ filePath })
  });
}

// 示例 15: 缺少SSRF防护
export function fetchUrl(url) {
  // 直接获取URL，没有SSRF防护
  return fetch('/api/fetch-url', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

// 示例 16: Vue组件中的输入验证漏洞
<template>
  <div>
    <input v-model="username" placeholder="Username">
    <input v-model="password" type="password" placeholder="Password">
    <input v-model="email" placeholder="Email">
    <button @click="submitForm">Submit</button>
  </div>
</template>

<script>
export default {
  name: 'FormValidationComponent',
  data() {
    return {
      username: '',
      password: '',
      email: ''
    };
  },
  methods: {
    submitForm() {
      // 直接提交表单，没有验证
      fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          email: this.email
        })
      });
    }
  }
};
</script>

// 示例 17: 缺少JSON验证
export function processJSON(jsonString) {
  // 直接解析JSON，没有验证
  const data = JSON.parse(jsonString);
  return fetch('/api/process-json', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 示例 18: 缺少XML验证
export function processXML(xmlString) {
  // 直接解析XML，没有验证
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  return fetch('/api/process-xml', {
    method: 'POST',
    body: xmlString
  });
}

// 示例 19: 缺少HTML验证
export function processHTML(htmlString) {
  // 直接处理HTML，没有验证
  const div = document.createElement('div');
  div.innerHTML = htmlString;
  return fetch('/api/process-html', {
    method: 'POST',
    body: htmlString
  });
}

// 示例 20: 缺少正则表达式验证
export function validateInput(input) {
  // 没有使用正则表达式验证
  return fetch('/api/validate', {
    method: 'POST',
    body: JSON.stringify({ input })
  });
}
