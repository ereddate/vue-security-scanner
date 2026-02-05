// src/ai/llm-integration.js
// 大语言模型集成模块 - 用于漏洞解释、修复建议生成和智能规则学习

const axios = require('axios');

class LLMIntegration {
  constructor(options = {}) {
    this.options = {
      apiKey: options.apiKey || process.env.LLM_API_KEY,
      model: options.model || 'gpt-4',
      baseURL: options.baseURL || 'https://api.openai.com/v1',
      temperature: options.temperature || 0.3,
      maxTokens: options.maxTokens || 1500,
      enableCaching: options.enableCaching !== false,
      cacheExpiry: options.cacheExpiry || 86400000, // 24小时
      ...options
    };
    
    this.cache = new Map();
    this.setupAxios();
  }

  /**
   * 设置Axios实例
   */
  setupAxios() {
    this.axios = axios.create({
      baseURL: this.options.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.options.apiKey}`
      }
    });
  }

  /**
   * 生成缓存键
   * @param {string} prompt - 提示文本
   * @returns {string} 缓存键
   */
  generateCacheKey(prompt) {
    return `llm_${Buffer.from(prompt).toString('base64')}`;
  }

  /**
   * 检查缓存
   * @param {string} prompt - 提示文本
   * @returns {string|null} 缓存的响应
   */
  checkCache(prompt) {
    if (!this.options.enableCaching) return null;
    
    const key = this.generateCacheKey(prompt);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.response;
    } else if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * 设置缓存
   * @param {string} prompt - 提示文本
   * @param {string} response - 响应文本
   */
  setCache(prompt, response) {
    if (!this.options.enableCaching) return;
    
    const key = this.generateCacheKey(prompt);
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  /**
   * 调用大语言模型
   * @param {string} prompt - 提示文本
   * @returns {Promise<string>} 模型响应
   */
  async callLLM(prompt) {
    // 检查缓存
    const cached = this.checkCache(prompt);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.axios.post('/chat/completions', {
        model: this.options.model,
        messages: [{
          role: 'system',
          content: 'You are a security expert specializing in web application vulnerabilities. Provide detailed, accurate, and actionable responses.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: this.options.temperature,
        max_tokens: this.options.maxTokens
      });

      const result = response.data.choices[0].message.content;
      
      // 设置缓存
      this.setCache(prompt, result);
      
      return result;
    } catch (error) {
      console.error('LLM API error:', error.message);
      return this.getFallbackResponse(prompt);
    }
  }

  /**
   * 获取回退响应
   * @param {string} prompt - 提示文本
   * @returns {string} 回退响应
   */
  getFallbackResponse(prompt) {
    if (prompt.includes('explain vulnerability')) {
      return 'Unable to generate vulnerability explanation at this time. Please check documentation for more information.';
    } else if (prompt.includes('fix recommendation')) {
      return 'Unable to generate fix recommendation at this time. Please follow best practices for secure coding.';
    } else if (prompt.includes('generate rule')) {
      return 'Unable to generate rule at this time. Please create rules manually based on vulnerability patterns.';
    }
    return 'Unable to process request at this time.';
  }

  /**
   * 生成漏洞解释
   * @param {Object} vulnerability - 漏洞对象
   * @param {string} codeContext - 代码上下文
   * @returns {Promise<string>} 漏洞解释
   */
  async generateVulnerabilityExplanation(vulnerability, codeContext) {
    const prompt = `Explain the following security vulnerability in detail:\n\nVulnerability Type: ${vulnerability.ruleId || 'Unknown'}\nSeverity: ${vulnerability.severity || 'Medium'}\nDescription: ${vulnerability.description || 'No description'}\nLocation: ${vulnerability.file || 'Unknown file'}:${vulnerability.line || 'Unknown line'}\n\nCode Context:\n\`\`\`\n${codeContext}\n\`\`\`\n\nPlease include:\n1. What the vulnerability is and how it works\n2. The potential impact and risks\n3. Why this code is vulnerable\n4. Common attack vectors\n5. Technical details for developers\n\nProvide a clear, comprehensive explanation suitable for both security experts and developers.`;

    return await this.callLLM(prompt);
  }

  /**
   * 生成修复建议
   * @param {Object} vulnerability - 漏洞对象
   * @param {string} codeContext - 代码上下文
   * @returns {Promise<string>} 修复建议
   */
  async generateFixRecommendation(vulnerability, codeContext) {
    const prompt = `Generate a detailed fix recommendation for the following security vulnerability:\n\nVulnerability Type: ${vulnerability.ruleId || 'Unknown'}\nSeverity: ${vulnerability.severity || 'Medium'}\nDescription: ${vulnerability.description || 'No description'}\nLocation: ${vulnerability.file || 'Unknown file'}:${vulnerability.line || 'Unknown line'}\n\nCurrent Code:\n\`\`\`\n${codeContext}\n\`\`\`\n\nPlease include:\n1. A specific, actionable fix for the vulnerable code\n2. The fixed code with explanations\n3. Best practices for preventing similar vulnerabilities\n4. Any potential side effects or considerations\n5. Alternative approaches if applicable\n\nProvide clear, step-by-step instructions that a developer can follow to implement the fix.`;

    return await this.callLLM(prompt);
  }

  /**
   * 生成智能规则
   * @param {Object} vulnerability - 漏洞对象
   * @param {string} codeContext - 代码上下文
   * @returns {Promise<Object>} 生成的规则
   */
  async generateIntelligentRule(vulnerability, codeContext) {
    const prompt = `Generate a security rule definition to detect vulnerabilities similar to the following:\n\nVulnerability Type: ${vulnerability.ruleId || 'Unknown'}\nSeverity: ${vulnerability.severity || 'Medium'}\nDescription: ${vulnerability.description || 'No description'}\nLocation: ${vulnerability.file || 'Unknown file'}:${vulnerability.line || 'Unknown line'}\n\nCode Context:\n\`\`\`\n${codeContext}\n\`\`\`\n\nPlease generate a rule in the following JSON format:\n{\n  "id": "unique-rule-id",\n  "name": "Rule Name",\n  "severity": "High|Medium|Low",\n  "description": "Rule description",\n  "recommendation": "Fix recommendation",\n  "patterns": [\n    {\n      "key": "pattern-name",\n      "pattern": "regular-expression-pattern",\n      "description": "Pattern description"
    }\n  ],\n  "contexts": ["relevant-contexts"],\n  "tags": ["relevant-tags"]\n}\n\nThe rule should:\n1. Detect similar vulnerabilities in other code\n2. Use precise regular expressions\n3. Include relevant contexts and tags\n4. Be specific enough to minimize false positives\n5. Capture the essence of the vulnerability pattern\n\nOnly return the JSON rule object, no additional explanation.`;

    const response = await this.callLLM(prompt);
    
    try {
      // 提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Failed to parse LLM rule response:', error.message);
      return null;
    }
  }

  /**
   * 学习漏洞模式
   * @param {Array} vulnerabilities - 漏洞数组
   * @returns {Promise<Array>} 学习到的模式
   */
  async learnVulnerabilityPatterns(vulnerabilities) {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return [];
    }

    const prompt = `Analyze the following vulnerabilities to identify common patterns and create generalized detection rules:\n\n${vulnerabilities.map((vuln, index) => {
  return `${index + 1}. Type: ${vuln.ruleId || 'Unknown'}\n   Severity: ${vuln.severity || 'Medium'}\n   Description: ${vuln.description || 'No description'}\n   Location: ${vuln.file || 'Unknown'}\n`;
}).join('\n')}\n\nPlease identify:\n1. Common vulnerability patterns across these examples\n2. Key indicators that suggest a vulnerability\n3. Generalized detection rules that could catch similar vulnerabilities\n4. Patterns that might indicate false positives\n\nProvide a structured analysis suitable for automated rule generation.`;

    return await this.callLLM(prompt);
  }

  /**
   * 生成详细的安全报告
   * @param {Array} vulnerabilities - 漏洞数组
   * @param {Object} projectInfo - 项目信息
   * @returns {Promise<string>} 安全报告
   */
  async generateSecurityReport(vulnerabilities, projectInfo) {
    const severityCounts = vulnerabilities.reduce((acc, vuln) => {
      const severity = vuln.severity || 'Medium';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    const typeCounts = vulnerabilities.reduce((acc, vuln) => {
      const type = vuln.ruleId || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const prompt = `Generate a comprehensive security report based on the following scan results:\n\nProject: ${projectInfo.name || 'Unknown'}\nScan Date: ${new Date().toISOString()}\nTotal Vulnerabilities: ${vulnerabilities.length}\n\nVulnerabilities by Severity:\n${Object.entries(severityCounts).map(([severity, count]) => `${severity}: ${count}`).join('\n')}\n\nVulnerabilities by Type:\n${Object.entries(typeCounts).map(([type, count]) => `${type}: ${count}`).join('\n')}\n\nTop 5 Vulnerabilities:\n${vulnerabilities.slice(0, 5).map((vuln, index) => {
  return `${index + 1}. ${vuln.ruleId || 'Unknown'} (${vuln.severity || 'Medium'}) - ${vuln.file || 'Unknown'}:${vuln.line || 'Unknown'}\n   ${vuln.description || 'No description'}`;
}).join('\n')}\n\nPlease include:\n1. Executive Summary\n2. Detailed Findings\n3. Risk Assessment\n4. Prioritized Recommendations\n5. Security Best Practices\n6. Conclusion\n\nThe report should be professional, detailed, and actionable for both technical and non-technical stakeholders.`;

    return await this.callLLM(prompt);
  }
}

module.exports = LLMIntegration;