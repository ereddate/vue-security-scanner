const https = require('https');
const http = require('http');
const { URL } = require('url');

class TraeCNIntegration {
  constructor(config = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'https://api.trae.cn/v1',
      apiKey: config.apiKey || process.env.TRAE_CN_API_KEY,
      projectId: config.projectId || process.env.TRAE_CN_PROJECT_ID,
      enableAutoReport: config.enableAutoReport !== false,
      enableRealtimePush: config.enableRealtimePush !== false,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      timeout: config.timeout || 30000,
      ...config
    };

    if (!this.config.apiKey) {
      console.warn('Trae CN API key not provided. Auto-reporting will be disabled.');
      this.config.enableAutoReport = false;
    }
  }

  async reportVulnerability(vulnerability) {
    if (!this.config.enableAutoReport || !this.config.apiKey) {
      return { success: false, message: 'Auto-reporting disabled or API key not provided' };
    }

    const data = {
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      vulnerability: {
        type: vulnerability.type,
        severity: vulnerability.severity,
        file: vulnerability.file,
        line: vulnerability.line,
        description: vulnerability.description,
        recommendation: vulnerability.recommendation,
        ruleId: vulnerability.ruleId,
        confidence: vulnerability.confidence,
        timestamp: new Date().toISOString()
      }
    };

    return this._makeRequest('/vulnerabilities/report', 'POST', data);
  }

  async reportScanResults(scanResults) {
    if (!this.config.enableAutoReport || !this.config.apiKey) {
      return { success: false, message: 'Auto-reporting disabled or API key not provided' };
    }

    const data = {
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      scanResults: {
        summary: scanResults.summary,
        vulnerabilities: scanResults.vulnerabilities,
        scanInfo: scanResults.scanInfo || {
          scannerVersion: '1.4.0',
          scanDate: new Date().toISOString(),
          projectPath: process.cwd()
        }
      }
    };

    return this._makeRequest('/scan-results', 'POST', data);
  }

  async pushRealtimeResult(result) {
    if (!this.config.enableRealtimePush || !this.config.apiKey) {
      return { success: false, message: 'Realtime push disabled or API key not provided' };
    }

    const data = {
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      realtime: {
        type: 'security-scan',
        timestamp: new Date().toISOString(),
        data: result
      }
    };

    return this._makeRequest('/realtime/push', 'POST', data);
  }

  async getProjectVulnerabilities(filters = {}) {
    if (!this.config.apiKey) {
      throw new Error('API key not provided');
    }

    const queryParams = new URLSearchParams({
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      ...filters
    });

    return this._makeRequest(`/vulnerabilities?${queryParams}`, 'GET');
  }

  async getScanHistory(limit = 50, offset = 0) {
    if (!this.config.apiKey) {
      throw new Error('API key not provided');
    }

    const queryParams = new URLSearchParams({
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      limit,
      offset
    });

    return this._makeRequest(`/scan-history?${queryParams}`, 'GET');
  }

  async createTicket(vulnerability, ticketData = {}) {
    if (!this.config.apiKey) {
      throw new Error('API key not provided');
    }

    const data = {
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      ticket: {
        title: ticketData.title || `Security Issue: ${vulnerability.type}`,
        description: ticketData.description || vulnerability.description,
        severity: vulnerability.severity,
        file: vulnerability.file,
        line: vulnerability.line,
        vulnerabilityId: vulnerability.ruleId,
        priority: this._mapSeverityToPriority(vulnerability.severity),
        tags: ['security', 'vue', 'vulnerability', ...(ticketData.tags || [])]
      }
    };

    return this._makeRequest('/tickets/create', 'POST', data);
  }

  async updateTicket(ticketId, updates) {
    if (!this.config.apiKey) {
      throw new Error('API key not provided');
    }

    const data = {
      apiKey: this.config.apiKey,
      projectId: this.config.projectId,
      updates
    };

    return this._makeRequest(`/tickets/${ticketId}/update`, 'PUT', data);
  }

  _mapSeverityToPriority(severity) {
    const priorityMap = {
      'Critical': 'P0',
      'High': 'P1',
      'Medium': 'P2',
      'Low': 'P3'
    };
    return priorityMap[severity] || 'P3';
  }

  _makeRequest(path, method, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.config.apiUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'vue-security-scanner/1.4.0'
        },
        timeout: this.config.timeout
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const req = client.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({
                success: true,
                data: parsedData,
                statusCode: res.statusCode
              });
            } else {
              resolve({
                success: false,
                error: parsedData.error || 'Request failed',
                statusCode: res.statusCode,
                data: parsedData
              });
            }
          } catch (error) {
            resolve({
              success: false,
              error: 'Failed to parse response',
              statusCode: res.statusCode,
              rawData: responseData
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async _makeRequestWithRetry(path, method, data = null) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const result = await this._makeRequest(path, method, data);
        
        if (result.success) {
          return result;
        }
        
        if (attempt < this.config.retryAttempts) {
          await this._sleep(this.config.retryDelay * attempt);
        }
        
        lastError = result;
      } catch (error) {
        if (attempt < this.config.retryAttempts) {
          await this._sleep(this.config.retryDelay * attempt);
        }
        lastError = error;
      }
    }
    
    return {
      success: false,
      error: lastError.message || 'Max retry attempts reached',
      attempts: this.config.retryAttempts
    };
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  enableAutoReport(enabled = true) {
    this.config.enableAutoReport = enabled;
  }

  enableRealtimePush(enabled = true) {
    this.config.enableRealtimePush = enabled;
  }

  setApiConfig(apiKey, projectId) {
    this.config.apiKey = apiKey;
    this.config.projectId = projectId;
  }
}

module.exports = TraeCNIntegration;
