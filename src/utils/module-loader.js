const fs = require('fs');
const path = require('path');

class ModuleLoader {
  constructor(config = {}) {
    this.config = config;
    this.enabled = config.enabled !== false;
    this.moduleCache = new Map();
    this.loadingModules = new Map();
    this.performanceStats = {
      lazyLoads: 0,
      cacheHits: 0,
      loadTime: 0
    };
    this.manifest = this.buildModuleManifest();
  }

  /**
   * 构建模块清单
   * @returns {Object} 模块清单
   */
  buildModuleManifest() {
    return {
      // 核心模块（总是加载）
      core: [
        './core/vulnerability-detector',
        './analysis/file-type-analyzer',
        './rules/rule-engine'
      ],
      // 可选模块（按需加载）
      optional: {
        typescript: {
          path: './analysis/typescript-checker',
          condition: (config) => config.typescript?.enabled
        },
        dependencyScanner: {
          path: './analysis/dependency-scanner',
          condition: (config) => config.rules?.dependencies?.enabled
        },
        dastScanner: {
          path: './analysis/dast-scanner',
          condition: (config) => config.dast?.enabled
        },
        advancedReporter: {
          path: './reporting/advanced-report-generator',
          condition: (config) => config.output?.format === 'json'
        },
        astAnalyzer: {
          path: './analysis/ast-analyzer',
          condition: (config) => config.enableSemanticAnalysis
        },
        ruleOptimizer: {
          path: './rules/rule-optimizer',
          condition: (config) => true
        },
        enhancedRuleEngine: {
          path: './rules/enhanced-rule-engine',
          condition: (config) => true
        }
      }
    };
  }

  /**
   * 按需加载模块
   * @param {string} moduleName - 模块名称
   * @param {Object} context - 上下文
   * @returns {Promise<any>} 加载的模块
   */
  async load(moduleName, context = {}) {
    if (!this.enabled) {
      return this.loadSync(moduleName, context);
    }

    // 检查缓存
    if (this.moduleCache.has(moduleName)) {
      this.performanceStats.cacheHits++;
      return this.moduleCache.get(moduleName);
    }

    // 检查是否正在加载
    if (this.loadingModules.has(moduleName)) {
      return this.loadingModules.get(moduleName);
    }

    // 开始加载
    const loadPromise = this.doLoad(moduleName, context);
    this.loadingModules.set(moduleName, loadPromise);

    try {
      const module = await loadPromise;
      this.moduleCache.set(moduleName, module);
      this.performanceStats.lazyLoads++;
      return module;
    } catch (error) {
      console.error(`Error loading module ${moduleName}:`, error);
      throw error;
    } finally {
      this.loadingModules.delete(moduleName);
    }
  }

  /**
   * 实际执行模块加载
   * @param {string} moduleName - 模块名称
   * @param {Object} context - 上下文
   * @returns {Promise<any>} 加载的模块
   */
  async doLoad(moduleName, context = {}) {
    const startTime = Date.now();

    try {
      // 检查模块清单
      if (this.manifest.optional[moduleName]) {
        const moduleInfo = this.manifest.optional[moduleName];
        
        // 检查加载条件
        if (moduleInfo.condition && !moduleInfo.condition(context.config || this.config)) {
          return null;
        }

        // 动态导入模块
        const modulePath = path.resolve(__dirname, '..', moduleInfo.path);
        const module = await import(modulePath);
        
        this.performanceStats.loadTime += Date.now() - startTime;
        return module.default || module;
      } else {
        // 对于不在清单中的模块，尝试直接加载
        const modulePath = path.resolve(__dirname, '..', moduleName);
        const module = await import(modulePath);
        
        this.performanceStats.loadTime += Date.now() - startTime;
        return module.default || module;
      }
    } catch (error) {
      // 降级为同步加载
      console.warn(`Lazy loading failed for ${moduleName}, falling back to sync loading`);
      const module = this.loadSync(moduleName, context);
      this.performanceStats.loadTime += Date.now() - startTime;
      return module;
    }
  }

  /**
   * 同步加载模块
   * @param {string} moduleName - 模块名称
   * @param {Object} context - 上下文
   * @returns {any} 加载的模块
   */
  loadSync(moduleName, context = {}) {
    try {
      // 检查模块清单
      if (this.manifest.optional[moduleName]) {
        const moduleInfo = this.manifest.optional[moduleName];
        
        // 检查加载条件
        if (moduleInfo.condition && !moduleInfo.condition(context.config || this.config)) {
          return null;
        }

        // 同步加载模块
        const modulePath = path.resolve(__dirname, '..', moduleInfo.path);
        const module = require(modulePath);
        
        this.moduleCache.set(moduleName, module);
        return module;
      } else {
        // 对于不在清单中的模块，尝试直接加载
        const modulePath = path.resolve(__dirname, '..', moduleName);
        const module = require(modulePath);
        
        this.moduleCache.set(moduleName, module);
        return module;
      }
    } catch (error) {
      console.error(`Error loading module ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * 预加载模块
   * @param {Array<string>} moduleNames - 模块名称数组
   * @param {Object} context - 上下文
   * @returns {Promise<Array>} 加载结果
   */
  async preload(moduleNames, context = {}) {
    const promises = moduleNames.map(name => this.load(name, context));
    return Promise.all(promises);
  }

  /**
   * 加载核心模块
   * @param {Object} context - 上下文
   * @returns {Object} 加载的核心模块
   */
  loadCoreModules(context = {}) {
    const coreModules = {};
    
    this.manifest.core.forEach(modulePath => {
      const moduleName = path.basename(modulePath);
      try {
        const fullPath = path.resolve(__dirname, '..', modulePath);
        coreModules[moduleName] = require(fullPath);
      } catch (error) {
        console.error(`Error loading core module ${modulePath}:`, error);
      }
    });
    
    return coreModules;
  }

  /**
   * 检查模块是否可加载
   * @param {string} moduleName - 模块名称
   * @returns {boolean} 是否可加载
   */
  isModuleAvailable(moduleName) {
    if (this.manifest.optional[moduleName]) {
      const moduleInfo = this.manifest.optional[moduleName];
      const modulePath = path.resolve(__dirname, '..', moduleInfo.path) + '.js';
      return fs.existsSync(modulePath);
    }
    return false;
  }

  /**
   * 清理模块缓存
   * @param {string} moduleName - 模块名称（可选，不指定则清理所有）
   */
  clearCache(moduleName) {
    if (moduleName) {
      this.moduleCache.delete(moduleName);
      // 清理Node.js的require缓存
      const moduleInfo = this.manifest.optional[moduleName];
      if (moduleInfo) {
        const modulePath = path.resolve(__dirname, '..', moduleInfo.path) + '.js';
        delete require.cache[require.resolve(modulePath)];
      }
    } else {
      // 清理所有缓存
      this.moduleCache.clear();
      // 清理可选模块的require缓存
      Object.values(this.manifest.optional).forEach(moduleInfo => {
        const modulePath = path.resolve(__dirname, '..', moduleInfo.path) + '.js';
        if (fs.existsSync(modulePath)) {
          delete require.cache[require.resolve(modulePath)];
        }
      });
    }
  }

  /**
   * 获取性能统计
   * @returns {Object} 性能统计
   */
  getPerformanceStats() {
    return this.performanceStats;
  }

  /**
   * 重置性能统计
   */
  resetPerformanceStats() {
    this.performanceStats = {
      lazyLoads: 0,
      cacheHits: 0,
      loadTime: 0
    };
  }
}

module.exports = ModuleLoader;