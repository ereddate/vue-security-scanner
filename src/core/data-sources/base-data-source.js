class BaseDataSource {
  constructor(config = {}) {
    this.config = config;
    this.name = this.constructor.name;
    this.enabled = config.enabled !== false;
    this.syncInterval = config.syncInterval || '24h';
  }

  async fetchData() {
    throw new Error('fetchData() must be implemented by subclass');
  }

  isEnabled() {
    return this.enabled;
  }

  getName() {
    return this.name;
  }

  getSyncInterval() {
    return this.syncInterval;
  }

  normalizeVulnerability(rawVuln) {
    return {
      id: rawVuln.id || rawVuln.cveId,
      cveId: rawVuln.cveId || rawVuln.id,
      title: rawVuln.title || rawVuln.summary,
      description: rawVuln.description || rawVuln.summary,
      severity: this.normalizeSeverity(rawVuln.severity),
      packageName: rawVuln.packageName || rawVuln.module,
      version: rawVuln.version,
      affectedVersions: rawVuln.affectedVersions || [],
      publishedDate: rawVuln.publishedDate || rawVuln.published,
      modifiedDate: rawVuln.modifiedDate || rawVuln.modified,
      references: rawVuln.references || [],
      source: this.getName()
    };
  }

  normalizeSeverity(severity) {
    if (!severity) return 'Medium';
    
    const severityMap = {
      'CRITICAL': 'Critical',
      'HIGH': 'High',
      'MEDIUM': 'Medium',
      'LOW': 'Low',
      'NONE': 'Low'
    };
    
    const upperSeverity = severity.toUpperCase();
    return severityMap[upperSeverity] || 'Medium';
  }

  async fetchWithRetry(url, options = {}, retries = 3) {
    const fetch = require('node-fetch');
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

module.exports = BaseDataSource;
