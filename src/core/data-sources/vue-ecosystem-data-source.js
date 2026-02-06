const BaseDataSource = require('./base-data-source');

class VueEcosystemDataSource extends BaseDataSource {
  constructor(config = {}) {
    super(config);
    this.baseUrl = 'https://api.github.com';
    this.token = config.token || process.env.GITHUB_TOKEN;
    this.vueRepositories = [
      'vuejs/core',
      'vuejs/router',
      'vuejs/vuex',
      'vuejs/pinia',
      'vueuse/vueuse',
      'vuejs/test-utils',
      'vuejs/devtools'
    ];
  }

  async fetchData() {
    if (!this.isEnabled()) {
      console.log('Vue Ecosystem data source is disabled');
      return [];
    }

    console.log('Fetching vulnerability data from Vue Ecosystem...');
    
    try {
      const vulnerabilities = [];
      
      for (const repo of this.vueRepositories) {
        try {
          const repoVulns = await this.fetchRepositoryVulnerabilities(repo);
          vulnerabilities.push(...repoVulns);
          
          if (vulnerabilities.length % 5 === 0) {
            console.log(`Fetched ${vulnerabilities.length} vulnerabilities from Vue Ecosystem`);
          }
          
          await this.rateLimitDelay();
        } catch (error) {
          console.warn(`Failed to fetch vulnerabilities for ${repo}:`, error.message);
        }
      }

      console.log(`Total vulnerabilities fetched from Vue Ecosystem: ${vulnerabilities.length}`);
      return vulnerabilities;
    } catch (error) {
      console.error('Failed to fetch Vue Ecosystem data:', error.message);
      throw error;
    }
  }

  async fetchRepositoryVulnerabilities(repo) {
    const url = `${this.baseUrl}/repos/${repo}/vulnerabilities`;
    const options = this.getRequestOptions();
    
    const data = await this.fetchWithRetry(url, options);
    
    if (data && Array.isArray(data)) {
      return data.map(vuln => this.normalizeVueVulnerability(vuln, repo));
    }

    return [];
  }

  getRequestOptions() {
    const options = {
      headers: {
        'User-Agent': 'vue-security-scanner/1.0.0',
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };
    
    if (this.token) {
      options.headers['Authorization'] = `token ${this.token}`;
    }
    
    return options;
  }

  async rateLimitDelay() {
    const delay = this.token ? 100 : 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  normalizeVueVulnerability(githubVuln, repo) {
    const severity = this.normalizeSeverity(githubVuln.severity);
    const affectedVersions = this.extractAffectedVersions(githubVuln);
    const references = this.extractReferences(githubVuln, repo);
    const packageName = this.extractPackageName(repo);

    return {
      id: githubVuln.id,
      cveId: githubVuln.cve_id || null,
      title: githubVuln.summary,
      description: githubVuln.description || githubVuln.summary,
      severity: severity,
      packageName: packageName,
      version: githubVuln.vulnerable_version_range || null,
      affectedVersions: affectedVersions,
      publishedDate: githubVuln.created_at,
      modifiedDate: githubVuln.updated_at || githubVuln.closed_at,
      references: references,
      source: this.getName(),
      repository: repo,
      state: githubVuln.state
    };
  }

  extractPackageName(repo) {
    const packageMapping = {
      'vuejs/core': 'vue',
      'vuejs/router': 'vue-router',
      'vuejs/vuex': 'vuex',
      'vuejs/pinia': 'pinia',
      'vueuse/vueuse': '@vueuse/core',
      'vuejs/test-utils': '@vue/test-utils',
      'vuejs/devtools': '@vue/devtools'
    };

    return packageMapping[repo] || repo;
  }

  extractAffectedVersions(githubVuln) {
    const versions = [];
    
    if (githubVuln.vulnerable_versions && Array.isArray(githubVuln.vulnerable_versions)) {
      versions.push(...githubVuln.vulnerable_versions);
    }
    
    if (githubVuln.vulnerable_version_range) {
      versions.push(githubVuln.vulnerable_version_range);
    }

    if (githubVuln.affected_versions && Array.isArray(githubVuln.affected_versions)) {
      versions.push(...githubVuln.affected_versions);
    }

    return versions;
  }

  extractReferences(githubVuln, repo) {
    const references = [];
    
    if (githubVuln.html_url) {
      references.push({
        url: githubVuln.html_url,
        source: 'GitHub',
        type: 'vulnerability'
      });
    }
    
    if (githubVuln.url) {
      references.push({
        url: githubVuln.url,
        source: 'GitHub',
        type: 'issue'
      });
    }

    if (githubVuln.references && Array.isArray(githubVuln.references)) {
      githubVuln.references.forEach(ref => {
        references.push({
          url: ref.url,
          source: ref.type || 'Unknown',
          type: ref.type
        });
      });
    }

    references.push({
      url: `https://github.com/${repo}`,
      source: 'GitHub',
      type: 'repository'
    });

    return references;
  }

  async searchByCVEId(cveId) {
    try {
      for (const repo of this.vueRepositories) {
        const url = `${this.baseUrl}/repos/${repo}/vulnerabilities`;
        const data = await this.fetchWithRetry(url, this.getRequestOptions());
        
        if (data && Array.isArray(data)) {
          const found = data.find(vuln => vuln.cve_id === cveId);
          if (found) {
            return this.normalizeVueVulnerability(found, repo);
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`Failed to search Vue Ecosystem for CVE ${cveId}:`, error.message);
      return null;
    }
  }

  async searchByPackage(packageName) {
    try {
      const repo = this.findRepositoryByPackage(packageName);
      if (!repo) {
        return [];
      }

      const url = `${this.baseUrl}/repos/${repo}/vulnerabilities`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data)) {
        return data.map(vuln => this.normalizeVueVulnerability(vuln, repo));
      }

      return [];
    } catch (error) {
      console.error(`Failed to search Vue Ecosystem for package ${packageName}:`, error.message);
      return [];
    }
  }

  findRepositoryByPackage(packageName) {
    const packageMapping = {
      'vue': 'vuejs/core',
      'vue-router': 'vuejs/router',
      'vuex': 'vuejs/vuex',
      'pinia': 'vuejs/pinia',
      '@vueuse/core': 'vueuse/vueuse',
      '@vue/test-utils': 'vuejs/test-utils',
      '@vue/devtools': 'vuejs/devtools'
    };

    return packageMapping[packageName] || null;
  }

  async searchByKeyword(keyword) {
    try {
      const vulnerabilities = [];
      const lowerKeyword = keyword.toLowerCase();

      for (const repo of this.vueRepositories) {
        const url = `${this.baseUrl}/repos/${repo}/vulnerabilities`;
        const data = await this.fetchWithRetry(url, this.getRequestOptions());
        
        if (data && Array.isArray(data)) {
          const matchingVulns = data.filter(vuln => {
            const summary = (vuln.summary || '').toLowerCase();
            const description = (vuln.description || '').toLowerCase();
            return summary.includes(lowerKeyword) || description.includes(lowerKeyword);
          });
          
          const normalizedVulns = matchingVulns.map(vuln => this.normalizeVueVulnerability(vuln, repo));
          vulnerabilities.push(...normalizedVulns);
        }
        
        await this.rateLimitDelay();
      }

      return vulnerabilities;
    } catch (error) {
      console.error(`Failed to search Vue Ecosystem for keyword ${keyword}:`, error.message);
      return [];
    }
  }

  async getVueVersionVulnerabilities(version) {
    try {
      const url = `${this.baseUrl}/repos/vuejs/core/vulnerabilities`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data)) {
        const versionVulns = data.filter(vuln => {
          if (!vuln.vulnerable_version_range) return false;
          
          try {
            const semver = require('semver');
            return semver.satisfies(version, vuln.vulnerable_version_range);
          } catch (error) {
            return false;
          }
        });
        
        return versionVulns.map(vuln => this.normalizeVueVulnerability(vuln, 'vuejs/core'));
      }

      return [];
    } catch (error) {
      console.error(`Failed to get Vue ${version} vulnerabilities:`, error.message);
      return [];
    }
  }

  async getVueRouterVulnerabilities(version) {
    try {
      const url = `${this.baseUrl}/repos/vuejs/router/vulnerabilities`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data)) {
        const versionVulns = data.filter(vuln => {
          if (!vuln.vulnerable_version_range) return false;
          
          try {
            const semver = require('semver');
            return semver.satisfies(version, vuln.vulnerable_version_range);
          } catch (error) {
            return false;
          }
        });
        
        return versionVulns.map(vuln => this.normalizeVueVulnerability(vuln, 'vuejs/router'));
      }

      return [];
    } catch (error) {
      console.error(`Failed to get Vue Router ${version} vulnerabilities:`, error.message);
      return [];
    }
  }

  async getPiniaVulnerabilities(version) {
    try {
      const url = `${this.baseUrl}/repos/vuejs/pinia/vulnerabilities`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data)) {
        const versionVulns = data.filter(vuln => {
          if (!vuln.vulnerable_version_range) return false;
          
          try {
            const semver = require('semver');
            return semver.satisfies(version, vuln.vulnerable_version_range);
          } catch (error) {
            return false;
          }
        });
        
        return versionVulns.map(vuln => this.normalizeVueVulnerability(vuln, 'vuejs/pinia'));
      }

      return [];
    } catch (error) {
      console.error(`Failed to get Pinia ${version} vulnerabilities:`, error.message);
      return [];
    }
  }
}

module.exports = VueEcosystemDataSource;
