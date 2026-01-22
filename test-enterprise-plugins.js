// test-enterprise-plugins.js
// 测试企业级插件功能

const { SecurityScanner } = require('./src/scanner');
const fs = require('fs');
const path = require('path');

async function testEnterprisePlugins() {
  console.log('🔍 Testing Enterprise Vue Security Scanner with Plugins...\n');
  
  // 创建一个临时测试项目
  const testProjectPath = './test-enterprise-project';
  
  // 如果测试目录不存在则创建
  if (!fs.existsSync(testProjectPath)) {
    fs.mkdirSync(testProjectPath, { recursive: true });
  }
  
  // 创建一个带有潜在安全问题的Vue文件
  const vulnerableVueFile = `
<template>
  <div>
    <!-- 潜在的XSS漏洞 -->
    <div v-html="userData"></div>
    
    <!-- 潜在的敏感数据暴露 -->
    <div>{{ apiKey }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: '',
      apiKey: 'sk-1234567890abcdef', // 潜在的敏感数据
      password: 'hardcoded_password'   // 硬编码密码
    }
  },
  methods: {
    // 潜在的SQL注入
    async fetchUserData(userId) {
      // 直接拼接SQL查询，存在SQL注入风险
      const query = 'SELECT * FROM users WHERE id = ' + userId;
      // 执行查询...
    },
    
    // 潜在的日志泄露
    logUserCredentials(credentials) {
      console.log('User credentials:', credentials); // 日志中可能泄露敏感信息
    }
  }
}
</script>

<style>
/* 样式文件 */
</style>
`;

  const vueFilePath = path.join(testProjectPath, 'vulnerable-component.vue');
  fs.writeFileSync(vueFilePath, vulnerableVueFile);
  
  // 创建一个包含潜在问题的package.json
  const vulnerablePackageJson = {
    "name": "test-app",
    "version": "1.0.0",
    "dependencies": {
      "lodash": "4.17.20",  // 已知存在安全问题的版本
      "moment": "2.29.1",   // 已知存在安全问题的版本
      "axios": "0.21.1",    // 已知存在安全问题的版本
      "express": "4.17.1"   // 已知存在安全问题的版本
    },
    "devDependencies": {
      "jest": "^26.0.0"
    }
  };
  
  const packageJsonPath = path.join(testProjectPath, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(vulnerablePackageJson, null, 2));
  
  // 创建一个JS文件，模拟服务器端代码中的安全问题
  const serverJsFile = `
// 模拟服务器端代码中的潜在安全问题

const express = require('express');
const app = express();

// 潜在的SQL注入
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // 直接拼接SQL查询，存在SQL注入风险
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  db.query(query, (err, results) => {
    res.send(results);
  });
});

// 潜在的敏感数据日志记录
app.post('/login', (req, res) => {
  const credentials = req.body;
  console.log('Login attempt:', credentials); // 可能泄露敏感登录信息
  // 认证逻辑...
});

module.exports = app;
`;

  const serverJsPath = path.join(testProjectPath, 'server.js');
  fs.writeFileSync(serverJsPath, serverJsFile);
  
  console.log('✅ Created test project with potential security issues');
  console.log('📁 Test files:');
  console.log(`   - ${vueFilePath}`);
  console.log(`   - ${packageJsonPath}`);
  console.log(`   - ${serverJsPath}\n`);
  
  // 初始化扫描器
  const scanner = new SecurityScanner({
    rules: {
      xss: { enabled: true },
      dependencies: { enabled: true },
      configSecurity: { enabled: true }
    }
  });
  
  console.log('🚀 Running security scan with enterprise plugins...\n');
  
  try {
    // 执行扫描
    const results = await scanner.scanVueProject(testProjectPath);
    
    console.log('📊 Scan Results:');
    console.log(`   - Files scanned: ${results.scanStats.filesScanned}`);
    console.log(`   - Total vulnerabilities found: ${results.vulnerabilities.length}`);
    console.log(`   - Scan duration: ${results.scanStats.durationMs}ms\n`);
    
    if (results.vulnerabilities.length > 0) {
      console.log('⚠️  Vulnerabilities detected:');
      results.vulnerabilities.forEach((vuln, index) => {
        console.log(`\n${index + 1}. Type: ${vuln.type}`);
        console.log(`   Severity: ${vuln.severity}`);
        console.log(`   File: ${vuln.file}`);
        console.log(`   Line: ${vuln.line || 'N/A'}`);
        console.log(`   Description: ${vuln.description}`);
        console.log(`   Recommendation: ${vuln.recommendation}`);
        if (vuln.plugin) {
          console.log(`   Detected by plugin: ${vuln.plugin}`);
        }
      });
    } else {
      console.log('✅ No vulnerabilities detected.');
    }
    
    // 显示插件信息
    console.log('\n🔌 Loaded Plugins:');
    const pluginsInfo = scanner.detector.getPluginsInfo();
    if (pluginsInfo.length > 0) {
      pluginsInfo.forEach(plugin => {
        console.log(`   - ${plugin.name} (Enabled: ${plugin.enabled})`);
      });
    } else {
      console.log('   No plugins loaded.');
    }
    
  } catch (error) {
    console.error('❌ Error during scan:', error.message);
  } finally {
    // 清理测试文件
    console.log('\n🧹 Cleaning up test files...');
    try {
      fs.unlinkSync(vueFilePath);
      fs.unlinkSync(packageJsonPath);
      fs.unlinkSync(serverJsPath);
      fs.rmdirSync(testProjectPath);
      console.log('✅ Test files cleaned up successfully');
    } catch (cleanupError) {
      console.error('⚠️  Could not clean up test files:', cleanupError.message);
    }
  }
}

// 运行测试
testEnterprisePlugins().catch(console.error);