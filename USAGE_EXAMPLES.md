# Vue Security Scanner - 使用示例

## 快速开始

```bash
# 安装
npm install -g vue-security-scanner

# 或者直接运行
npx vue-security-scanner [项目路径]
```

## 扫描示例

### 1. 基础扫描
```bash
# 扫描当前目录
vue-security-scanner

# 扫描指定目录
vue-security-scanner /path/to/vue-project
```

### 2. 输出格式
```bash
# JSON 格式输出
vue-security-scanner -o json

# HTML 报告
vue-security-scanner -o html -r report.html

# 文本格式（默认）
vue-security-scanner -o text
```

### 3. 保存报告
```bash
# 生成报告文件
vue-security-scanner -r security-report.txt
vue-security-scanner -o json -r report.json
```

## 检测到的安全问题示例

### 1. XSS 漏洞
```vue
<template>
  <!-- 检测到：使用 v-html 可能导致 XSS -->
  <div v-html="userInput"></div>
  
  <!-- 检测到：内联事件处理器 -->
  <button onclick="doAction()">Click</button>
</template>
```

### 2. 硬编码密钥
```javascript
// 检测到：硬编码的 API 密钥
const config = {
  apiKey: 'sk-1234567890abcdef',
  password: 'admin123',
  token: 'Bearer xyz789'
};
```

### 3. 依赖安全问题
```json
{
  "dependencies": {
    // 检测到：已知存在漏洞的包
    "lodash": "^3.0.0",
    "vue": "^2.0.0"
  }
}
```

### 4. 路由安全问题
```javascript
// 检测到：不安全的路由参数使用
const userId = this.$route.params.id;
document.innerHTML = userId; // 潜在 XSS
```

### 5. 输入验证缺失
```vue
<template>
  <!-- 检测到：缺少输入验证的表单 -->
  <input v-model="userInput" />
</template>
```

## 安全建议

### 针对 XSS 漏洞
- 避免使用 `v-html`，除非内容经过严格验证
- 使用 `v-text` 替代直接插值
- 对用户输入进行适当的转义和过滤

### 针对硬编码密钥
- 将敏感信息存储在环境变量中
- 使用 `.env` 文件管理密钥
- 在生产环境中使用密钥管理系统

### 针对依赖安全
- 定期更新依赖包
- 使用 `npm audit` 检查安全漏洞
- 移除不必要的依赖

### 针对路由安全
- 验证和清理路由参数
- 避免直接使用用户输入
- 实施适当的访问控制

## 集成到 CI/CD

```yaml
# GitHub Actions 示例
- name: Vue Security Scan
  run: |
    npx vue-security-scanner .
```

工具会在检测到漏洞时返回非零退出码，使 CI/CD 流程失败。