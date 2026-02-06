const BaseDataSource = require('./base-data-source');

class GitHubAdvisoryDataSource extends BaseDataSource {
  constructor(config = {}) {
    super(config);
    this.baseUrl = 'https://api.github.com';
    this.token = config.token || process.env.GITHUB_TOKEN;
    this.ecosystem = config.ecosystem || 'npm';
  }

  async fetchData() {
    if (!this.isEnabled()) {
      console.log('GitHub Advisory data source is disabled');
      return [];
    }

    console.log('Fetching vulnerability data from GitHub Advisory Database...');
    
    try {
      const vulnerabilities = [];
      const vuePackages = await this.getVuePackages();
      
      for (const packageName of vuePackages) {
        try {
          const packageVulns = await this.fetchPackageVulnerabilities(packageName);
          vulnerabilities.push(...packageVulns);
          
          if (vulnerabilities.length % 10 === 0) {
            console.log(`Fetched ${vulnerabilities.length} vulnerabilities from GitHub Advisory`);
          }
          
          await this.rateLimitDelay();
        } catch (error) {
          console.warn(`Failed to fetch vulnerabilities for ${packageName}:`, error.message);
        }
      }

      console.log(`Total vulnerabilities fetched from GitHub Advisory: ${vulnerabilities.length}`);
      return vulnerabilities;
    } catch (error) {
      console.error('Failed to fetch GitHub Advisory data:', error.message);
      throw error;
    }
  }

  async getVuePackages() {
    const packages = [
      'vue',
      'vue-router',
      'vuex',
      'pinia',
      '@vue/core',
      '@vue/compiler-core',
      '@vue/compiler-dom',
      '@vue/runtime-core',
      '@vue/runtime-dom',
      '@vue/server-renderer',
      '@vueuse/core',
      '@vueuse/integrations',
      '@vueuse/components',
      'element-plus',
      'ant-design-vue',
      'vuetify',
      'naive-ui',
      'primevue',
      'quasar',
      'bootstrap-vue',
      'buefy',
      'vuesax',
      'vue-i18n',
      'axios',
      'vue-axios'
    ];

    return packages;
  }

  async fetchPackageVulnerabilities(packageName) {
    const url = `${this.baseUrl}/advisories?ecosystem=${this.ecosystem}&package=${encodeURIComponent(packageName)}`;
    const options = this.getRequestOptions();
    
    const data = await this.fetchWithRetry(url, options);
    
    if (data && Array.isArray(data)) {
      return data.map(vuln => this.normalizeGitHubVulnerability(vuln));
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
    const delay = this.token ? 100 : 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  normalizeGitHubVulnerability(githubVuln) {
    const severity = this.normalizeSeverity(githubVuln.severity);
    const affectedVersions = this.extractAffectedVersions(githubVuln);
    const references = this.extractReferences(githubVuln);

    return {
      id: githubVuln.ghsaId,
      cveId: githubVuln.cveId || null,
      title: githubVuln.summary,
      description: githubVuln.description || githubVuln.summary,
      severity: severity,
      packageName: githubVuln.package.name,
      version: githubVuln.package.ecosystem_specifics?.[this.ecosystem]?.[0] || null,
      affectedVersions: affectedVersions,
      publishedDate: githubVuln.published_at,
      modifiedDate: githubVuln.updated_at || githubVuln.withdrawn_at,
      references: references,
      source: this.getName(),
      withdrawn: githubVuln.withdrawn_at !== null
    };
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

    if (githubVuln.package && githubVuln.package.ecosystem_specifics) {
      const ecosystemData = githubVuln.package.ecosystem_specifics[this.ecosystem];
      if (ecosystemData && Array.isArray(ecosystemData)) {
        ecosystemData.forEach(item => {
          if (item.version) versions.push(item.version);
        });
      }
    }

    return versions;
  }

  extractReferences(githubVuln) {
    const references = [];
    
    if (githubVuln.html_url) {
      references.push({
        url: githubVuln.html_url,
        source: 'GitHub Advisory',
        type: 'advisory'
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

    return references;
  }

  async searchByCVEId(cveId) {
    try {
      const url = `${this.baseUrl}/advisories?cve_id=${encodeURIComponent(cveId)}`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data) && data.length > 0) {
        return this.normalizeGitHubVulnerability(data[0]);
      }

      return null;
    } catch (error) {
      console.error(`Failed to search GitHub Advisory for CVE ${cveId}:`, error.message);
      return null;
    }
  }

  async searchByPackage(packageName) {
    try {
      const url = `${this.baseUrl}/advisories?ecosystem=${this.ecosystem}&package=${encodeURIComponent(packageName)}`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data)) {
        return data.map(vuln => this.normalizeGitHubVulnerability(vuln));
      }

      return [];
    } catch (error) {
      console.error(`Failed to search GitHub Advisory for package ${packageName}:`, error.message);
      return [];
    }
  }

  async searchByKeyword(keyword) {
    try {
      const url = `${this.baseUrl}/advisories?ecosystem=${this.ecosystem}&keyword=${encodeURIComponent(keyword)}`;
      const data = await this.fetchWithRetry(url, this.getRequestOptions());
      
      if (data && Array.isArray(data)) {
        return data.map(vuln => this.normalizeGitHubVulnerability(vuln));
      }

      return [];
    } catch (error) {
      console.error(`Failed to search GitHub Advisory for keyword ${keyword}:`, error.message);
      return [];
    }
  }

  async getVueSecurityAdvisories() {
    try {
      const vulnerabilities = [];
      const vueRepos = [
        'vuejs/core',
        'vuejs/router',
        'vuejs/vuex',
        'vuejs/pinia',
        'vueuse/vueuse'
      ];

      for (const repo of vueRepos) {
        try {
          const url = `${this.baseUrl}/repos/${repo}/security-advisories`;
          const data = await this.fetchWithRetry(url, this.getRequestOptions());
          
          if (data && Array.isArray(data)) {
            const repoVulns = data.map(vuln => this.normalizeGitHubVulnerability(vuln));
            vulnerabilities.push(...repoVulns);
          }
          
          await this.rateLimitDelay();
        } catch (error) {
          console.warn(`Failed to fetch security advisories for ${repo}:`, error.message);
        }
      }

      return vulnerabilities;
    } catch (error) {
      console.error('Failed to fetch Vue security advisories:', error.message);
      return [];
    }
  }
}

module.exports = GitHubAdvisoryDataSource;
