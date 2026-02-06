const BaseDataSource = require('./base-data-source');

class NVDataSource extends BaseDataSource {
  constructor(config = {}) {
    super(config);
    this.baseUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
    this.apiKey = config.apiKey || process.env.NVD_API_KEY;
    this.rateLimitDelay = this.apiKey ? 200 : 6000;
  }

  async fetchData() {
    if (!this.isEnabled()) {
      console.log('NVD data source is disabled');
      return [];
    }

    console.log('Fetching vulnerability data from NVD...');
    
    try {
      const vulnerabilities = [];
      let startIndex = 0;
      let hasMore = true;
      const maxResults = 2000;
      const daysToFetch = 30;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);
      const startDateStr = startDate.toISOString().split('T')[0];

      while (hasMore) {
        const url = this.buildUrl(startIndex, maxResults, startDateStr);
        const data = await this.fetchWithRetry(url, this.getRequestOptions());
        
        if (data.vulnerabilities && Array.isArray(data.vulnerabilities)) {
          const normalizedVulns = data.vulnerabilities.map(vuln => this.normalizeNVDVulnerability(vuln));
          vulnerabilities.push(...normalizedVulns);
          
          console.log(`Fetched ${normalizedVulns.length} vulnerabilities from NVD (total: ${vulnerabilities.length})`);
        }

        if (data.totalResults > startIndex + maxResults) {
          startIndex += maxResults;
          hasMore = true;
          await this.rateLimitDelay();
        } else {
          hasMore = false;
        }
      }

      return vulnerabilities;
    } catch (error) {
      console.error('Failed to fetch NVD data:', error.message);
      throw error;
    }
  }

  buildUrl(startIndex, resultsPerPage, startDate) {
    let url = `${this.baseUrl}?resultsPerPage=${resultsPerPage}&startIndex=${startIndex}`;
    
    if (startDate) {
      url += `&pubStartDate=${startDate}T00:00:00.000`;
    }
    
    if (this.apiKey) {
      url += `&apiKey=${this.apiKey}`;
    }
    
    return url;
  }

  getRequestOptions() {
    const options = {
      headers: {
        'User-Agent': 'vue-security-scanner/1.0.0',
        'Accept': 'application/json'
      }
    };
    
    return options;
  }

  async rateLimitDelay() {
    await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
  }

  normalizeNVDVulnerability(nvdVuln) {
    const cve = nvdVuln.cve;
    const metrics = cve.metrics;
    
    let severity = 'Medium';
    if (metrics && metrics.cvssMetricV31) {
      const score = metrics.cvssMetricV31.baseScore;
      if (score >= 9.0) severity = 'Critical';
      else if (score >= 7.0) severity = 'High';
      else if (score >= 4.0) severity = 'Medium';
      else severity = 'Low';
    } else if (metrics && metrics.cvssMetricV2) {
      const score = metrics.cvssMetricV2.baseScore;
      if (score >= 9.0) severity = 'Critical';
      else if (score >= 7.0) severity = 'High';
      else if (score >= 4.0) severity = 'Medium';
      else severity = 'Low';
    }

    const descriptions = cve.descriptions || [];
    const primaryDescription = descriptions.find(desc => desc.lang === 'en') || descriptions[0];

    const references = (cve.references || []).map(ref => ({
      url: ref.url,
      source: ref.source,
      tags: ref.tags || []
    }));

    const affectedPackages = this.extractAffectedPackages(cve);

    return {
      id: cve.id,
      cveId: cve.id,
      title: primaryDescription ? primaryDescription.value : cve.id,
      description: primaryDescription ? primaryDescription.value : 'No description available',
      severity: severity,
      cvssScore: metrics?.cvssMetricV31?.baseScore || metrics?.cvssMetricV2?.baseScore,
      publishedDate: cve.published,
      modifiedDate: cve.lastModified,
      references: references,
      packageName: affectedPackages[0] || null,
      affectedVersions: affectedPackages,
      source: this.getName()
    };
  }

  extractAffectedPackages(cve) {
    const packages = [];
    const configurations = cve.configurations || [];
    
    configurations.forEach(config => {
      if (config.nodes) {
        config.nodes.forEach(node => {
          if (node.cpeMatch) {
            node.cpeMatch.forEach(match => {
              const cpeString = match.cpe23Uri || match.cpe22Uri;
              if (cpeString) {
                const packageInfo = this.parseCPE(cpeString);
                if (packageInfo && packageInfo.package) {
                  packages.push(packageInfo.package);
                }
              }
            });
          }
        });
      }
    });

    return packages;
  }

  parseCPE(cpeString) {
    try {
      const parts = cpeString.split(':');
      if (parts.length < 5) return null;

      const vendor = parts[3];
      const product = parts[4];
      const version = parts[5];

      const npmPackages = {
        'vue': 'vue',
        'vue.js': 'vue',
        'vuejs': 'vue',
        'vue-router': 'vue-router',
        'vuex': 'vuex',
        'pinia': 'pinia',
        'axios': 'axios',
        'element-plus': 'element-plus',
        'ant-design-vue': 'ant-design-vue',
        'vuetify': 'vuetify'
      };

      const lowerVendor = vendor.toLowerCase();
      const lowerProduct = product.toLowerCase();

      for (const [key, packageName] of Object.entries(npmPackages)) {
        if (lowerVendor.includes(key) || lowerProduct.includes(key)) {
          return {
            package: packageName,
            version: version
          };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async searchByCVEId(cveId) {
    try {
      const url = `${this.baseUrl}?cveId=${cveId}`;
      if (this.apiKey) {
        url += `&apiKey=${this.apiKey}`;
      }

      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data.vulnerabilities && data.vulnerabilities.length > 0) {
        return this.normalizeNVDVulnerability(data.vulnerabilities[0]);
      }

      return null;
    } catch (error) {
      console.error(`Failed to search NVD for CVE ${cveId}:`, error.message);
      return null;
    }
  }

  async searchByKeyword(keyword) {
    try {
      const url = `${this.baseUrl}?keywordPattern=${encodeURIComponent(keyword)}`;
      if (this.apiKey) {
        url += `&apiKey=${this.apiKey}`;
      }

      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data.vulnerabilities && Array.isArray(data.vulnerabilities)) {
        return data.vulnerabilities.map(vuln => this.normalizeNVDVulnerability(vuln));
      }

      return [];
    } catch (error) {
      console.error(`Failed to search NVD for keyword ${keyword}:`, error.message);
      return [];
    }
  }
}

module.exports = NVDataSource;
