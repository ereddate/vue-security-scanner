const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class ThreatIntelligenceIntegration {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.join(process.cwd(), '.vue-security-cache', 'threat-intelligence');
    this.cacheTTL = options.cacheTTL || 86400000; // 24小时
    this.enableCache = options.enableCache !== false;
    this.threatSources = {
      cncert: {
        name: 'CNCERT/CC',
        url: 'https://www.cn-cert.org.cn',
        enabled: true
      },
      cnnvd: {
        name: 'CNNVD',
        url: 'https://www.cnnvd.org.cn',
        enabled: true
      },
      cnvd: {
        name: 'CNVD',
        url: 'https://www.cnvd.org.cn',
        enabled: true
      }
    };
    
    this.ensureCacheDir();
    this.loadThreatDatabase();
  }

  /**
   * 确保缓存目录存在
   */
  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * 加载威胁数据库
   */
  loadThreatDatabase() {
    const dbPath = path.join(this.cacheDir, 'threat-database.json');
    
    if (fs.existsSync(dbPath)) {
      try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        this.threatDatabase = db;
        console.log(`Loaded ${Object.keys(db).length} threat entries from database`);
      } catch (error) {
        console.warn('Failed to load threat database:', error.message);
        this.threatDatabase = {};
      }
    } else {
      this.threatDatabase = {};
    }
  }

  /**
   * 保存威胁数据库
   */
  saveThreatDatabase() {
    const dbPath = path.join(this.cacheDir, 'threat-database.json');
    
    try {
      fs.writeFileSync(dbPath, JSON.stringify(this.threatDatabase, null, 2), 'utf8');
    } catch (error) {
      console.warn('Failed to save threat database:', error.message);
    }
  }

  /**
   * 获取CNCERT威胁情报
   * @returns {Promise<Array>} 威胁情报列表
   */
  async getCNCERTThreats() {
    const cacheKey = 'cncert-threats';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    try {
      const threats = await this.fetchCNCERTData();
      this.saveToCache(cacheKey, threats);
      return threats;
    } catch (error) {
      console.warn('Failed to fetch CNCERT threats:', error.message);
      return this.getFromCache(cacheKey, true) || [];
    }
  }

  /**
   * 获取CNNVD漏洞信息
   * @returns {Promise<Array>} 漏洞信息列表
   */
  async getCNNVDVulnerabilities() {
    const cacheKey = 'cnnvd-vulnerabilities';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    try {
      const vulnerabilities = await this.fetchCNNVDData();
      this.saveToCache(cacheKey, vulnerabilities);
      return vulnerabilities;
    } catch (error) {
      console.warn('Failed to fetch CNNVD vulnerabilities:', error.message);
      return this.getFromCache(cacheKey, true) || [];
    }
  }

  /**
   * 获取CNVD漏洞信息
   * @returns {Promise<Array>} 漏洞信息列表
   */
  async getCNVDVulnerabilities() {
    const cacheKey = 'cnvd-vulnerabilities';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    try {
      const vulnerabilities = await this.fetchCNVDData();
      this.saveToCache(cacheKey, vulnerabilities);
      return vulnerabilities;
    } catch (error) {
      console.warn('Failed to fetch CNVD vulnerabilities:', error.message);
      return this.getFromCache(cacheKey, true) || [];
    }
  }

  /**
   * 从缓存获取数据
   * @param {string} key - 缓存键
   * @param {boolean} ignoreExpiry - 是否忽略过期时间
   * @returns {Object|null} 缓存数据
   */
  getFromCache(key, ignoreExpiry = false) {
    if (!this.enableCache) {
      return null;
    }
    
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    
    if (!fs.existsSync(cacheFile)) {
      return null;
    }
    
    try {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      
      if (!ignoreExpiry && (Date.now() - cacheData.timestamp) > this.cacheTTL) {
        return null;
      }
      
      return cacheData.data;
    } catch (error) {
      console.warn(`Failed to read cache ${key}:`, error.message);
      return null;
    }
  }

  /**
   * 保存数据到缓存
   * @param {string} key - 缓存键
   * @param {Object} data - 数据
   */
  saveToCache(key, data) {
    if (!this.enableCache) {
      return;
    }
    
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData), 'utf8');
    } catch (error) {
      console.warn(`Failed to write cache ${key}:`, error.message);
    }
  }

  /**
   * 获取CNCERT数据（模拟实现）
   * @returns {Promise<Array>} CNCERT数据
   */
  async fetchCNCERTData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'CNCERT-2024-001',
            title: '高危漏洞预警：某Web框架存在远程代码执行漏洞',
            severity: 'Critical',
            cve: 'CVE-2024-XXXX',
            publishDate: '2024-01-15',
            description: '某Web框架存在远程代码执行漏洞，攻击者可通过特制请求执行任意代码。',
            affectedComponents: ['vue', 'express', 'koa'],
            solution: '升级到最新版本',
            references: ['https://www.cn-cert.org.cn']
          },
          {
            id: 'CNCERT-2024-002',
            title: '安全公告：某JavaScript库存在XSS漏洞',
            severity: 'High',
            cve: 'CVE-2024-YYYY',
            publishDate: '2024-01-10',
            description: '某JavaScript库存在XSS漏洞，可能导致用户信息泄露。',
            affectedComponents: ['jquery', 'lodash', 'axios'],
            solution: '升级到安全版本',
            references: ['https://www.cn-cert.org.cn']
          }
        ]);
      }, 1000);
    });
  }

  /**
   * 获取CNNVD数据（模拟实现）
   * @returns {Promise<Array>} CNNVD数据
   */
  async fetchCNNVDData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'CNNVD-202401-001',
            title: '某前端框架存在原型污染漏洞',
            severity: 'High',
            cve: 'CVE-2024-ZZZZ',
            publishDate: '2024-01-05',
            description: '某前端框架存在原型污染漏洞，可能导致应用程序被劫持。',
            affectedComponents: ['vue', 'react', 'angular'],
            solution: '升级到修复版本',
            references: ['https://www.cnnvd.org.cn']
          },
          {
            id: 'CNNVD-202401-002',
            title: '某HTTP客户端库存在SSRF漏洞',
            severity: 'Medium',
            cve: 'CVE-2024-WWWW',
            publishDate: '2024-01-03',
            description: '某HTTP客户端库存在SSRF漏洞，可能导致内网信息泄露。',
            affectedComponents: ['axios', 'fetch', 'request'],
            solution: '限制请求目标',
            references: ['https://www.cnnvd.org.cn']
          }
        ]);
      }, 1000);
    });
  }

  /**
   * 获取CNVD数据（模拟实现）
   * @returns {Promise<Array>} CNVD数据
   */
  async fetchCNVDData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'CNVD-2024-001',
            title: '某UI组件库存在点击劫持漏洞',
            severity: 'Medium',
            cve: 'CNVD-2024-001',
            publishDate: '2024-01-08',
            description: '某UI组件库存在点击劫持漏洞，可能导致用户被诱导执行非预期操作。',
            affectedComponents: ['element-ui', 'ant-design', 'iview'],
            solution: '添加X-Frame-Options响应头',
            references: ['https://www.cnvd.org.cn']
          },
          {
            id: 'CNVD-2024-002',
            title: '某状态管理库存在敏感信息泄露漏洞',
            severity: 'High',
            cve: 'CNVD-2024-002',
            publishDate: '2024-01-06',
            description: '某状态管理库存在敏感信息泄露漏洞，可能导致用户数据泄露。',
            affectedComponents: ['vuex', 'redux', 'mobx'],
            solution: '避免在状态中存储敏感信息',
            references: ['https://www.cnvd.org.cn']
          }
        ]);
      }, 1000);
    });
  }

  /**
   * 检查依赖项是否受威胁影响
   * @param {Object} dependencies - 依赖项列表
   * @returns {Promise<Array>} 受影响的依赖项
   */
  async checkDependenciesAgainstThreats(dependencies) {
    const threats = await this.getAllThreats();
    const affectedDependencies = [];
    
    Object.entries(dependencies).forEach(([name, version]) => {
      threats.forEach(threat => {
        if (threat.affectedComponents && threat.affectedComponents.includes(name)) {
          affectedDependencies.push({
            dependency: name,
            version,
            threat: threat,
            severity: threat.severity
          });
        }
      });
    });
    
    return affectedDependencies;
  }

  /**
   * 获取所有威胁情报
   * @returns {Promise<Array>} 所有威胁情报
   */
  async getAllThreats() {
    const [cncertThreats, cnnvdVulns, cnvdVulns] = await Promise.all([
      this.getCNCERTThreats(),
      this.getCNNVDVulnerabilities(),
      this.getCNVDVulnerabilities()
    ]);
    
    return [
      ...cncertThreats.map(t => ({ ...t, source: 'CNCERT' })),
      ...cnnvdVulns.map(t => ({ ...t, source: 'CNNVD' })),
      ...cnvdVulns.map(t => ({ ...t, source: 'CNVD' }))
    ];
  }

  /**
   * 更新威胁数据库
   * @returns {Promise<boolean>} 是否更新成功
   */
  async updateThreatDatabase() {
    try {
      const threats = await this.getAllThreats();
      
      threats.forEach(threat => {
        this.threatDatabase[threat.id] = threat;
      });
      
      this.saveThreatDatabase();
      console.log(`Threat database updated with ${threats.length} entries`);
      return true;
    } catch (error) {
      console.error('Failed to update threat database:', error.message);
      return false;
    }
  }

  /**
   * 搜索威胁情报
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async searchThreats(keyword) {
    const threats = await this.getAllThreats();
    const lowerKeyword = keyword.toLowerCase();
    
    return threats.filter(threat => 
      threat.title.toLowerCase().includes(lowerKeyword) ||
      threat.description.toLowerCase().includes(lowerKeyword) ||
      threat.cve?.toLowerCase().includes(lowerKeyword) ||
      threat.affectedComponents?.some(comp => comp.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 获取威胁统计信息
   * @returns {Promise<Object>} 威胁统计信息
   */
  async getThreatStatistics() {
    const threats = await this.getAllThreats();
    
    const stats = {
      total: threats.length,
      bySeverity: {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
      },
      bySource: {
        CNCERT: 0,
        CNNVD: 0,
        CNVD: 0
      },
      byComponent: {},
      recentThreats: threats
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 10)
    };
    
    threats.forEach(threat => {
      if (stats.bySeverity[threat.severity] !== undefined) {
        stats.bySeverity[threat.severity]++;
      }
      
      if (stats.bySource[threat.source] !== undefined) {
        stats.bySource[threat.source]++;
      }
      
      if (threat.affectedComponents) {
        threat.affectedComponents.forEach(comp => {
          stats.byComponent[comp] = (stats.byComponent[comp] || 0) + 1;
        });
      }
    });
    
    return stats;
  }

  /**
   * 生成威胁情报报告
   * @returns {Promise<Object>} 威胁情报报告
   */
  async generateThreatReport() {
    const threats = await this.getAllThreats();
    const stats = await this.getThreatStatistics();
    
    return {
      reportInfo: {
        title: '威胁情报报告',
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      summary: {
        totalThreats: stats.total,
        criticalThreats: stats.bySeverity.Critical,
        highThreats: stats.bySeverity.High,
        mediumThreats: stats.bySeverity.Medium,
        lowThreats: stats.bySeverity.Low
      },
      threatsBySource: stats.bySource,
      threatsByComponent: stats.byComponent,
      recentThreats: stats.recentThreats,
      recommendations: this.generateRecommendations(threats)
    };
  }

  /**
   * 生成建议
   * @param {Array} threats - 威胁列表
   * @returns {Array} 建议列表
   */
  generateRecommendations(threats) {
    const recommendations = [];
    
    const criticalThreats = threats.filter(t => t.severity === 'Critical');
    if (criticalThreats.length > 0) {
      recommendations.push({
        priority: 'P0',
        action: '立即修复高危漏洞',
        description: `发现 ${criticalThreats.length} 个高危漏洞，需要立即修复`,
        affectedComponents: [...new Set(criticalThreats.flatMap(t => t.affectedComponents || []))]
      });
    }
    
    const highThreats = threats.filter(t => t.severity === 'High');
    if (highThreats.length > 0) {
      recommendations.push({
        priority: 'P1',
        action: '尽快修复高危漏洞',
        description: `发现 ${highThreats.length} 个高危漏洞，建议尽快修复`,
        affectedComponents: [...new Set(highThreats.flatMap(t => t.affectedComponents || []))]
      });
    }
    
    recommendations.push({
      priority: 'P2',
      action: '定期更新依赖项',
      description: '建议定期检查并更新依赖项到最新安全版本',
      affectedComponents: []
    });
    
    recommendations.push({
      priority: 'P3',
      action: '订阅威胁情报源',
      description: '建议订阅CNCERT、CNNVD、CNVD等威胁情报源，及时获取安全信息',
      affectedComponents: []
    });
    
    return recommendations;
  }

  /**
   * 清理过期缓存
   */
  clearExpiredCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      const now = Date.now();
      
      files.forEach(file => {
        if (!file.endsWith('.json')) return;
        
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        
        if ((now - stats.mtimeMs) > this.cacheTTL) {
          fs.unlinkSync(filePath);
          console.log(`Deleted expired cache: ${file}`);
        }
      });
    } catch (error) {
      console.warn('Failed to clear expired cache:', error.message);
    }
  }

  /**
   * 清理所有缓存
   */
  clearAllCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      
      files.forEach(file => {
        const filePath = path.join(this.cacheDir, file);
        fs.unlinkSync(filePath);
      });
      
      console.log(`Cleared ${files.length} cache files`);
    } catch (error) {
      console.warn('Failed to clear all cache:', error.message);
    }
  }
}

module.exports = ThreatIntelligenceIntegration;