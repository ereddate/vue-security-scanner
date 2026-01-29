// src/analysis/dast-scanner.js
// 动态应用安全检测（DAST）模块

const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const crypto = require('crypto');

class DASTScanner {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:3000',
      timeout: config.timeout || 30000,
      maxRequests: config.maxRequests || 1000,
      concurrency: config.concurrency || 5,
      auth: config.auth || {},
      headers: config.headers || {},
      scanDepth: config.scanDepth || 2,
      payloads: config.payloads || this.getDefaultPayloads(),
      ...config
    };
    
    this.visitedUrls = new Set();
    this.forms = [];
    this.links = [];
    this.vulnerabilities = [];
    this.requestCount = 0;
  }

  getDefaultPayloads() {
    return {
      xss: [
        '<script>alert(1)</script>',
        '<img src="x" onerror="alert(1)">',
        '\"><script>alert(1)</script>',
        'javascript:alert(1)',
        '<svg onload="alert(1)">'
      ],
      sql: [
        "' OR 1=1 --",
        "' OR '1'='1",
        "'; DROP TABLE users --",
        "' UNION SELECT username, password FROM users --"
      ],
      command: [
        '; ls -la',
        '| cat /etc/passwd',
        '& echo vulnerable',
        '&& whoami'
      ],
      path: [
        '../',
        '../../',
        '../../../etc/passwd',
        '../../../../windows/win.ini'
      ],
      csrf: [
        'test_csrf_token',
        'invalid_csrf',
        ''
      ],
      auth: [
        'admin\' --',
        'admin\' OR \'1\'=\'1',
        'user\' UNION SELECT \'admin\', \'password'
      ],
      ssrf: [
        'http://localhost:8080',
        'http://127.0.0.1:22',
        'file:///etc/passwd'
      ]
    };
  }

  async scan(options = {}) {
    console.log('Starting DAST scan...');
    console.log(`Base URL: ${this.config.baseUrl}`);
    console.log(`Scan depth: ${this.config.scanDepth}`);
    
    const startTime = new Date();
    
    try {
      // 1. 爬取网站
      await this.crawl(this.config.baseUrl, 0);
      
      // 2. 分析表单
      await this.analyzeForms();
      
      // 3. 测试链接
      await this.testLinks();
      
      // 4. 测试API端点
      if (options.testApi) {
        await this.testApiEndpoints();
      }
      
    } catch (error) {
      console.error('DAST scan error:', error);
    }
    
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\nDAST scan completed in ${duration}s`);
    console.log(`Visited ${this.visitedUrls.size} URLs`);
    console.log(`Found ${this.forms.length} forms`);
    console.log(`Detected ${this.vulnerabilities.length} potential vulnerabilities`);
    
    return {
      vulnerabilities: this.vulnerabilities,
      stats: {
        visitedUrls: this.visitedUrls.size,
        forms: this.forms.length,
        requests: this.requestCount,
        duration: duration
      }
    };
  }

  async crawl(url, depth) {
    if (depth > this.config.scanDepth) return;
    if (this.visitedUrls.has(url)) return;
    if (this.requestCount >= this.config.maxRequests) return;
    
    try {
      this.visitedUrls.add(url);
      this.requestCount++;
      
      console.log(`Crawling: ${url} (depth: ${depth})`);
      
      const response = await axios.get(url, {
        timeout: this.config.timeout,
        headers: this.config.headers,
        validateStatus: () => true
      });
      
      if (response.status >= 200 && response.status < 400) {
        const html = response.data;
        const $ = cheerio.load(html);
        
        // 提取链接
        const links = this.extractLinks($, url);
        this.links.push(...links);
        
        // 提取表单
        const forms = this.extractForms($, url);
        this.forms.push(...forms);
        
        // 递归爬取
        for (const link of links) {
          if (this.shouldCrawl(link)) {
            await this.crawl(link, depth + 1);
          }
        }
      }
    } catch (error) {
      console.warn(`Error crawling ${url}: ${error.message}`);
    }
  }

  extractLinks($, baseUrl) {
    const links = [];
    
    $('a[href], link[href], script[src], img[src]').each((i, element) => {
      let href = $(element).attr('href') || $(element).attr('src');
      if (href) {
        const absoluteUrl = this.resolveUrl(href, baseUrl);
        if (absoluteUrl) {
          links.push(absoluteUrl);
        }
      }
    });
    
    return [...new Set(links)];
  }

  extractForms($, baseUrl) {
    const forms = [];
    
    $('form').each((i, formElement) => {
      const $form = $(formElement);
      const action = $form.attr('action') || baseUrl;
      const method = ($form.attr('method') || 'GET').toUpperCase();
      
      const inputs = [];
      $form.find('input, textarea, select').each((j, inputElement) => {
        const $input = $(inputElement);
        inputs.push({
          name: $input.attr('name'),
          type: $input.attr('type') || 'text',
          value: $input.attr('value') || '',
          placeholder: $input.attr('placeholder') || ''
        });
      });
      
      forms.push({
        action: this.resolveUrl(action, baseUrl),
        method: method,
        inputs: inputs
      });
    });
    
    return forms;
  }

  async analyzeForms() {
    console.log(`\nAnalyzing ${this.forms.length} forms...`);
    
    for (const form of this.forms) {
      await this.testForm(form);
    }
  }

  async testForm(form) {
    console.log(`Testing form: ${form.action}`);
    
    // 测试XSS
    for (const payload of this.config.payloads.xss) {
      await this.testFormXSS(form, payload);
    }
    
    // 测试SQL注入
    for (const payload of this.config.payloads.sql) {
      await this.testFormSQL(form, payload);
    }
    
    // 测试命令注入
    for (const payload of this.config.payloads.command) {
      await this.testFormCommand(form, payload);
    }
    
    // 测试CSRF
    await this.testFormCSRF(form);
    
    // 测试认证绕过
    for (const payload of this.config.payloads.auth) {
      await this.testFormAuth(form, payload);
    }
  }

  async testFormXSS(form, payload) {
    const data = {};
    form.inputs.forEach(input => {
      data[input.name] = input.name ? payload : input.value;
    });
    
    try {
      const response = await this.sendRequest(form.method, form.action, data);
      
      if (response.data && response.data.includes(payload.replace(/'/g, "\\'")) || 
          response.data.includes(payload.replace(/"/g, '&quot;'))) {
        this.vulnerabilities.push({
          type: 'XSS',
          severity: 'High',
          url: form.action,
          method: form.method,
          payload: payload,
          evidence: 'Payload reflected in response'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testFormSQL(form, payload) {
    const data = {};
    form.inputs.forEach(input => {
      data[input.name] = input.name ? payload : input.value;
    });
    
    try {
      const response = await this.sendRequest(form.method, form.action, data);
      
      const sqlErrors = [
        'SQL syntax',
        'mysql_fetch',
        'PG::SyntaxError',
        'sqlite3.OperationalError',
        'ORA-00933'
      ];
      
      if (sqlErrors.some(error => response.data && response.data.includes(error))) {
        this.vulnerabilities.push({
          type: 'SQL Injection',
          severity: 'Critical',
          url: form.action,
          method: form.method,
          payload: payload,
          evidence: 'SQL error in response'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testFormCommand(form, payload) {
    const data = {};
    form.inputs.forEach(input => {
      data[input.name] = input.name ? payload : input.value;
    });
    
    try {
      const response = await this.sendRequest(form.method, form.action, data);
      
      const commandIndicators = [
        'bin/',
        'etc/passwd',
        'root:',
        'www-data'
      ];
      
      if (commandIndicators.some(indicator => response.data && response.data.includes(indicator))) {
        this.vulnerabilities.push({
          type: 'Command Injection',
          severity: 'Critical',
          url: form.action,
          method: form.method,
          payload: payload,
          evidence: 'Command output in response'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testLinks() {
    console.log(`\nTesting ${this.links.length} links...`);
    
    for (const link of this.links) {
      await this.testLink(link);
    }
  }

  async testLink(url) {
    // 测试路径遍历
    for (const payload of this.config.payloads.path) {
      await this.testPathTraversal(url, payload);
    }
    
    // 测试SSRF
    await this.testSSRF(url);
  }

  async testPathTraversal(baseUrl, payload) {
    const testUrl = baseUrl.includes('?') ? 
      `${baseUrl}&file=${payload}` : 
      `${baseUrl}?file=${payload}`;
    
    try {
      const response = await this.sendRequest('GET', testUrl);
      
      const pathIndicators = [
        'root:x:',
        'bin/bash',
        'Windows NT',
        '[fonts]'
      ];
      
      if (pathIndicators.some(indicator => response.data && response.data.includes(indicator))) {
        this.vulnerabilities.push({
          type: 'Path Traversal',
          severity: 'High',
          url: testUrl,
          method: 'GET',
          payload: payload,
          evidence: 'Sensitive file content in response'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testApiEndpoints() {
    console.log('\nTesting API endpoints...');
    
    const apiEndpoints = [
      '/api/users',
      '/api/auth/login',
      '/api/data',
      '/api/admin'
    ];
    
    for (const endpoint of apiEndpoints) {
      const url = this.resolveUrl(endpoint, this.config.baseUrl);
      await this.testApiEndpoint(url);
    }
  }

  async testApiEndpoint(url) {
    try {
      // 测试未授权访问
      const response = await this.sendRequest('GET', url);
      if (response.status === 200) {
        this.vulnerabilities.push({
          type: 'Unauthorized Access',
          severity: 'Medium',
          url: url,
          method: 'GET',
          evidence: 'API endpoint accessible without authentication'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testFormCSRF(form) {
    const data = {};
    form.inputs.forEach(input => {
      data[input.name] = input.name ? input.value : input.value;
    });
    
    try {
      // 移除CSRF token（如果存在）
      const csrfFields = ['csrf_token', '_token', 'authenticity_token'];
      csrfFields.forEach(field => {
        if (data[field]) {
          delete data[field];
        }
      });
      
      const response = await this.sendRequest(form.method, form.action, data);
      
      // 如果请求成功，可能存在CSRF漏洞
      if (response.status >= 200 && response.status < 400) {
        this.vulnerabilities.push({
          type: 'CSRF',
          severity: 'Medium',
          url: form.action,
          method: form.method,
          evidence: 'Request succeeded without CSRF token'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testFormAuth(form, payload) {
    const data = {};
    form.inputs.forEach(input => {
      if (input.name && (input.name.toLowerCase().includes('user') || 
          input.name.toLowerCase().includes('name') || 
          input.name.toLowerCase().includes('login'))) {
        data[input.name] = payload;
      } else {
        data[input.name] = input.value;
      }
    });
    
    try {
      const response = await this.sendRequest(form.method, form.action, data);
      
      // 检查是否成功登录的迹象
      const successIndicators = [
        'welcome',
        'dashboard',
        'profile',
        'logout',
        'success'
      ];
      
      if (response.status === 200 && 
          successIndicators.some(indicator => 
            response.data && response.data.toLowerCase().includes(indicator))) {
        this.vulnerabilities.push({
          type: 'Authentication Bypass',
          severity: 'Critical',
          url: form.action,
          method: form.method,
          payload: payload,
          evidence: 'Possible authentication bypass detected'
        });
      }
    } catch (error) {
      // 忽略错误
    }
  }

  async testSSRF(url) {
    for (const payload of this.config.payloads.ssrf) {
      const testUrl = url.includes('?') ? 
        `${url}&url=${encodeURIComponent(payload)}` : 
        `${url}?url=${encodeURIComponent(payload)}`;
      
      try {
        const response = await this.sendRequest('GET', testUrl, {}, { timeout: 5000 });
        
        // 检查是否有内部服务响应的迹象
        const ssrfIndicators = [
          'localhost',
          '127.0.0.1',
          'internal server',
          'ssh-2.0',
          '[fonts]'
        ];
        
        if (response.data && ssrfIndicators.some(indicator => 
            response.data.toLowerCase().includes(indicator))) {
          this.vulnerabilities.push({
            type: 'SSRF',
            severity: 'Critical',
            url: testUrl,
            method: 'GET',
            payload: payload,
            evidence: 'Possible SSRF vulnerability detected'
          });
        }
      } catch (error) {
        // 忽略错误
      }
    }
  }

  async sendRequest(method, url, data = {}) {
    if (this.requestCount >= this.config.maxRequests) {
      throw new Error('Max requests reached');
    }
    
    this.requestCount++;
    
    try {
      const config = {
        method: method,
        url: url,
        timeout: this.config.timeout,
        headers: this.config.headers,
        validateStatus: () => true
      };
      
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        config.data = data;
      } else if (data && Object.keys(data).length > 0) {
        config.params = data;
      }
      
      return await axios(config);
    } catch (error) {
      throw error;
    }
  }

  resolveUrl(relativeUrl, baseUrl) {
    try {
      // 处理绝对URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl;
      }
      
      // 处理协议相对URL
      if (relativeUrl.startsWith('//')) {
        const protocol = baseUrl.startsWith('https://') ? 'https:' : 'http:';
        return protocol + relativeUrl;
      }
      
      // 处理相对路径
      const url = new URL(relativeUrl, baseUrl);
      return url.href;
    } catch (error) {
      return null;
    }
  }

  shouldCrawl(url) {
    // 只爬取同一域的URL
    const baseDomain = this.getDomain(this.config.baseUrl);
    const urlDomain = this.getDomain(url);
    
    return urlDomain === baseDomain && 
           !url.includes('mailto:') && 
           !url.includes('javascript:') && 
           !url.includes('data:') &&
           url.startsWith('http');
  }

  getDomain(url) {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch (error) {
      return null;
    }
  }

  generateReport() {
    return {
      vulnerabilities: this.vulnerabilities,
      stats: {
        visitedUrls: this.visitedUrls.size,
        forms: this.forms.length,
        links: this.links.length,
        requests: this.requestCount
      },
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.vulnerabilities.some(v => v.type === 'XSS')) {
      recommendations.push('Implement proper input validation and output encoding');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'SQL Injection')) {
      recommendations.push('Use parameterized queries or ORM frameworks');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'Command Injection')) {
      recommendations.push('Avoid executing user input as commands');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'Path Traversal')) {
      recommendations.push('Validate and sanitize file path inputs');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'Unauthorized Access')) {
      recommendations.push('Implement proper authentication and authorization');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'CSRF')) {
      recommendations.push('Implement CSRF tokens and validate them on all non-GET requests');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'Authentication Bypass')) {
      recommendations.push('Implement strong authentication controls and input validation');
    }
    
    if (this.vulnerabilities.some(v => v.type === 'SSRF')) {
      recommendations.push('Validate and sanitize all URL inputs, implement network-level controls');
    }
    
    return recommendations;
  }
}

module.exports = DASTScanner;