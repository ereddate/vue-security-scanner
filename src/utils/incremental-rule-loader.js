const fs = require('fs');
const path = require('path');

class IncrementalRuleLoader {
  constructor(options = {}) {
    this.rulesDirectory = options.rulesDirectory || path.join(__dirname, '../rules');
    this.cacheFile = options.cacheFile || path.join(__dirname, '../../.rule-cache.json');
    this.cache = this.loadCache();
  }

  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const cacheData = fs.readFileSync(this.cacheFile, 'utf8');
        return JSON.parse(cacheData);
      }
    } catch (error) {
      console.warn('Failed to load rule cache:', error.message);
    }
    return {
      rules: {},
      lastModified: {}
    };
  }

  saveCache() {
    try {
      const cacheDir = path.dirname(this.cacheFile);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('Failed to save rule cache:', error.message);
    }
  }

  async loadRules() {
    try {
      const rules = await this.loadRulesFromDirectory(this.rulesDirectory);
      this.saveCache();
      return rules;
    } catch (error) {
      console.error('Failed to load rules:', error.message);
      return [];
    }
  }

  async loadRulesFromDirectory(directory) {
    const rules = [];
    
    async function traverse(currentPath) {
      try {
        const entries = fs.readdirSync(currentPath);
        
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry);
          const entryStat = fs.statSync(fullPath);
          
          if (entryStat.isDirectory()) {
            await traverse(fullPath);
          } else if (entryStat.isFile() && entry.endsWith('.js')) {
            const ruleModule = await this.loadRuleModule(fullPath);
            if (ruleModule) {
              rules.push(...ruleModule);
            }
          }
        }
      } catch (error) {
        console.warn(`Skipping ${currentPath}: ${error.message}`);
      }
    }
    
    await traverse.bind(this)(directory);
    return rules;
  }

  async loadRuleModule(filePath) {
    try {
      const fileStat = fs.statSync(filePath);
      const fileModifiedTime = fileStat.mtime.getTime();
      const cacheModifiedTime = this.cache.lastModified[filePath];
      
      if (cacheModifiedTime && cacheModifiedTime >= fileModifiedTime) {
        // Use cached rules
        return this.cache.rules[filePath] || [];
      }
      
      // Clear module cache and reload
      delete require.cache[require.resolve(filePath)];
      const rules = require(filePath);
      
      // Update cache
      this.cache.rules[filePath] = rules;
      this.cache.lastModified[filePath] = fileModifiedTime;
      
      return rules;
    } catch (error) {
      console.warn(`Failed to load rule module ${filePath}:`, error.message);
      return [];
    }
  }

  clearCache() {
    this.cache = {
      rules: {},
      lastModified: {}
    };
    
    try {
      if (fs.existsSync(this.cacheFile)) {
        fs.unlinkSync(this.cacheFile);
      }
    } catch (error) {
      console.warn('Failed to clear rule cache:', error.message);
    }
  }

  getCacheInfo() {
    const ruleCount = Object.values(this.cache.rules).reduce((total, rules) => total + rules.length, 0);
    const moduleCount = Object.keys(this.cache.rules).length;
    
    return {
      ruleCount,
      moduleCount,
      cachedModules: Object.keys(this.cache.rules)
    };
  }

  invalidateModule(filePath) {
    delete this.cache.rules[filePath];
    delete this.cache.lastModified[filePath];
    this.saveCache();
  }

  invalidateAll() {
    this.clearCache();
  }
}

module.exports = IncrementalRuleLoader;
