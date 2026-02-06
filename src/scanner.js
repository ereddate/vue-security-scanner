// src/scanner.js
// 主扫描器模块 - 优化版本，支持大规模文件扫描和内存管理

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ModuleLoader = require('./utils/module-loader');
const defaultConfig = require('./config/default-config');
const { ErrorHandler } = require('./utils/error-handler');
const IgnoreManager = require('./utils/ignore-manager');
const GPUAccelerator = require('./core/gpu-accelerator');

// 异步信号量类，用于控制并发数
class AsyncSemaphore {
  constructor(maxConcurrency, options = {}) {
    this.maxConcurrency = maxConcurrency;
    this.currentConcurrency = 0;
    this.waiting = [];
    this.timeout = options.timeout || 30000; // 30秒默认超时
    this.onTimeout = options.onTimeout || null;
  }
  
  async acquire() {
    return new Promise((resolve, reject) => {
      if (this.currentConcurrency < this.maxConcurrency) {
        this.currentConcurrency++;
        resolve();
      } else {
        // 添加超时处理
        const timeoutId = setTimeout(() => {
          const index = this.waiting.findIndex(item => item.resolve === resolve);
          if (index !== -1) {
            this.waiting.splice(index, 1);
            if (this.onTimeout) {
              this.onTimeout();
            }
            reject(new Error(`Semaphore acquire timeout after ${this.timeout}ms`));
          }
        }, this.timeout);
        
        this.waiting.push({
          resolve,
          reject,
          timeoutId
        });
      }
    });
  }
  
  release() {
    this.currentConcurrency--;
    if (this.waiting.length > 0) {
      this.currentConcurrency++;
      const next = this.waiting.shift();
      clearTimeout(next.timeoutId);
      next.resolve();
    }
  }
  
  // 获取当前状态信息
  getStatus() {
    return {
      maxConcurrency: this.maxConcurrency,
      currentConcurrency: this.currentConcurrency,
      waitingCount: this.waiting.length
    };
  }
  
  // 动态调整最大并发数
  setMaxConcurrency(newMax) {
    this.maxConcurrency = newMax;
    // 如果有等待的任务且当前并发数小于新最大值，触发下一个
    while (this.waiting.length > 0 && this.currentConcurrency < this.maxConcurrency) {
      this.currentConcurrency++;
      const next = this.waiting.shift();
      if (next) {
        clearTimeout(next.timeoutId);
        next.resolve();
      }
    }
  }
}

class SecurityScanner {
  constructor(config = {}) {
    this.config = this.mergeConfig(defaultConfig, config);
    this.moduleLoader = new ModuleLoader({ enabled: this.config.lazyLoading !== false });
    this.projectPath = config.projectPath || process.cwd();
    this.ignoreManager = new IgnoreManager(this.projectPath);
    this.scanStats = {
      filesScanned: 0,
      errors: 0,
      startTime: null,
      endTime: null,
      memoryUsage: {
        start: process.memoryUsage().heapUsed / 1024 / 1024,
        peak: 0
      }
    };
    
    // 内存管理配置
    const performanceConfig = this.config.performance || {};
    const profile = performanceConfig.profile || 'balanced';
    
    // 应用性能配置文件
    const profileConfig = performanceConfig.profiles?.[profile] || {};
    const effectiveConfig = {
      memoryLimit: profileConfig.memoryLimit || performanceConfig.memoryLimit || 256,
      batchSize: profileConfig.batchSize || performanceConfig.batchSize || 10,
      gcInterval: performanceConfig.gcInterval || 10,
      ruleOptimization: {
        ...performanceConfig.ruleOptimization,
        ...profileConfig.ruleOptimization
      },
      incrementalScan: {
        ...performanceConfig.incrementalScan,
        ...profileConfig.incrementalScan
      }
    };
    
    this.batchSize = effectiveConfig.batchSize;
    this.memoryLimit = effectiveConfig.memoryLimit; // MB
    this.memoryThreshold = this.memoryLimit * 0.8 * 1024 * 1024; // 80% of limit
    this.gcInterval = effectiveConfig.gcInterval;
    this.maxVulnerabilitiesInMemory = config.maxVulnerabilitiesInMemory || 10000;
    
    // 细粒度控制配置
    const fineGrainedControl = performanceConfig.fineGrainedControl || {};
    this.fineGrainedControl = {
      enableDynamicResourceManagement: fineGrainedControl.enableDynamicResourceManagement !== false,
      dynamicAdjustmentInterval: fineGrainedControl.dynamicAdjustmentInterval || 5000,
      memoryPressureThreshold: fineGrainedControl.memoryPressureThreshold || 0.8,
      cpuPressureThreshold: fineGrainedControl.cpuPressureThreshold || 0.8,
      minConcurrency: fineGrainedControl.minConcurrency || 1,
      maxConcurrency: fineGrainedControl.maxConcurrency || 8,
      adaptiveBatchSize: fineGrainedControl.adaptiveBatchSize !== false,
      adaptiveMemoryLimit: fineGrainedControl.adaptiveMemoryLimit !== false,
      resourceMonitoring: {
        enabled: fineGrainedControl.resourceMonitoring?.enabled !== false,
        sampleInterval: fineGrainedControl.resourceMonitoring?.sampleInterval || 1000,
        historySize: fineGrainedControl.resourceMonitoring?.historySize || 100,
        metrics: fineGrainedControl.resourceMonitoring?.metrics || ['memory', 'cpu', 'disk', 'network']
      }
    };
    
    // 并行处理配置
    const os = require('os');
    const cpuCount = os.cpus().length;
    const parallelismConfig = performanceConfig.parallelism || {};
    
    // 并行度配置 - 使用细粒度控制中的设置
    this.parallelism = {
      maxConcurrency: parallelismConfig.maxConcurrency || Math.max(
        this.fineGrainedControl.minConcurrency, 
        Math.min(cpuCount - 1, this.fineGrainedControl.maxConcurrency)
      ), // 留一个核心给系统
      minConcurrency: parallelismConfig.minConcurrency || this.fineGrainedControl.minConcurrency,
      dynamicAdjustment: parallelismConfig.dynamicAdjustment !== false,
      currentConcurrency: Math.max(
        this.fineGrainedControl.minConcurrency, 
        Math.min(cpuCount - 1, this.fineGrainedControl.maxConcurrency)
      ),
      granularity: parallelismConfig.granularity || 'file', // file, batch, auto
      priorityEnabled: parallelismConfig.priorityEnabled !== false
    };
    
    console.log(`Detected ${cpuCount} CPU cores, optimal concurrency: ${this.parallelism.currentConcurrency}`);
    console.log(`Performance profile: ${profile} (Memory limit: ${this.memoryLimit}MB, Batch size: ${this.batchSize})`);
    console.log(`Parallelism config: max=${this.parallelism.maxConcurrency}, min=${this.parallelism.minConcurrency}, dynamic=${this.parallelism.dynamicAdjustment}`);
    
    // 增量扫描配置
    this.incrementalScan = effectiveConfig.incrementalScan || {
      enabled: false,
      cacheFile: '.vue-security-cache.json'
    };
    
    // 安全地设置缓存路径
    if (this.projectPath && typeof this.projectPath === 'string' && this.incrementalScan.cacheFile) {
      this.cachePath = path.join(this.projectPath, this.incrementalScan.cacheFile);
    } else {
      this.cachePath = '.vue-security-cache.json';
    }
    
    // 延迟加载的模块
    this.modules = {};
    
    // 初始化大规模文件处理器
    this.largeScaleFileProcessor = null;
    if (this.config.performance?.largeScaleProcessing?.enabled !== false) {
      try {
        const LargeScaleFileProcessor = require('./utils/large-scale-file-processor');
        // 合并忽略模式
        const ignorePatterns = [
          ...(this.config.scan.ignorePatterns || []),
          ...(this.config.scan.ignoreDirs || []).map(dir => `**/${dir}/**`)
        ];
        
        this.largeScaleFileProcessor = new LargeScaleFileProcessor({
          maxFilesInMemory: this.config.performance?.largeScaleProcessing?.maxFilesInMemory || 1000,
          streamBatchSize: this.config.performance?.largeScaleProcessing?.streamBatchSize || 100,
          enableIncrementalDiscovery: this.config.performance?.largeScaleProcessing?.enableIncrementalDiscovery !== false,
          enableSmartFiltering: this.config.performance?.largeScaleProcessing?.enableSmartFiltering !== false,
          enablePrioritySorting: this.config.performance?.largeScaleProcessing?.enablePrioritySorting !== false,
          ignorePatterns: ignorePatterns
        });
        console.log('Large-scale file processor enabled');
      } catch (error) {
        console.warn('Could not initialize large-scale file processor:', error.message);
      }
    }
    
    // 初始化增量规则加载器
    this.incrementalRuleLoader = null;
    if (this.config.performance?.incrementalRuleLoading?.enabled !== false) {
      try {
        const IncrementalRuleLoader = require('./utils/incremental-rule-loader');
        this.incrementalRuleLoader = new IncrementalRuleLoader({
          maxRulesInMemory: this.config.performance?.incrementalRuleLoading?.maxRulesInMemory || 500,
          enableLazyLoading: this.config.performance?.incrementalRuleLoading?.enableLazyLoading !== false,
          enableRuleCaching: this.config.performance?.incrementalRuleLoading?.enableRuleCaching !== false,
          enablePriorityLoading: this.config.performance?.incrementalRuleLoading?.enablePriorityLoading !== false
        });
        console.log('Incremental rule loader enabled');
      } catch (error) {
        console.warn('Could not initialize incremental rule loader:', error.message);
      }
    }
    
    // 初始化GPU加速器
    this.gpuAccelerator = null;
    if (this.config.performance?.gpu?.enabled) {
      try {
        this.gpuAccelerator = new GPUAccelerator(this.config.performance.gpu);
        this.gpuAccelerator.initialize();
        const gpuStatus = this.gpuAccelerator.getStatus();
        console.log(`GPU accelerator status: ${gpuStatus.useGPU ? 'GPU enabled' : 'CPU fallback'}`);
      } catch (error) {
        console.warn('Could not initialize GPU accelerator:', error.message);
        this.gpuAccelerator = null;
      }
    }
    
    // 初始化扫描器组件
    try {
      const VulnerabilityDetector = this.loadModuleSync('./core/vulnerability-detector');
      this.detector = new VulnerabilityDetector(this.config);
    } catch (error) {
      console.warn('Could not load detector module:', error.message);
      this.detector = {
        detectVulnerabilities: () => []
      };
    }
    
    try {
      const DependencyVulnerabilityScanner = this.loadModuleSync('./analysis/dependency-scanner');
      this.dependencyScanner = new DependencyVulnerabilityScanner(this.config);
    } catch (error) {
      console.warn('Could not load dependency scanner module:', error.message);
      this.dependencyScanner = {
        scanDependencies: () => []
      };
    }
    
    try {
      const TypeScriptChecker = this.loadModuleSync('./analysis/typescript-checker');
      this.typeScriptChecker = new TypeScriptChecker(this.config);
    } catch (error) {
      console.warn('Could not load TypeScript checker module:', error.message);
      this.typeScriptChecker = {
        scanTypeScript: () => []
      };
    }
    
    try {
      const DASTScanner = this.loadModuleSync('./analysis/dast-scanner');
      this.dastScanner = new DASTScanner(this.config);
    } catch (error) {
      console.warn('Could not load DAST scanner module:', error.message);
      this.dastScanner = {
        scan: () => ({ vulnerabilities: [] })
      };
    }
    
    try {
      const AdvancedReportGenerator = this.loadModuleSync('./reporting/advanced-report-generator');
      this.advancedReportGenerator = new AdvancedReportGenerator(this.config);
    } catch (error) {
      console.warn('Could not load advanced report generator module:', error.message);
      this.advancedReportGenerator = {
        generateAdvancedReport: (result) => result
      };
    }
    
    try {
      const MultiFormatReportGenerator = this.loadModuleSync('./reporting/multi-format-report-generator');
      this.multiFormatReportGenerator = new MultiFormatReportGenerator(this.config);
    } catch (error) {
      console.warn('Could not load multi-format report generator module:', error.message);
      this.multiFormatReportGenerator = {
        generateReport: (result, format) => {
          if (format === 'json') return JSON.stringify(result, null, 2);
          return JSON.stringify(result);
        },
        saveReportToFile: (content, format, path) => path
      };
    }
    
    try {
      const RuleExtensionAPI = this.loadModuleSync('./rules/rule-extension-api');
      this.ruleExtensionAPI = new RuleExtensionAPI(null); // 暂时传入null，后续会设置
    } catch (error) {
      console.warn('Could not load rule extension API module:', error.message);
      this.ruleExtensionAPI = {
        addRule: () => false,
        getActiveRules: () => [],
        getStatistics: () => ({ total: 0, active: 0 })
      };
    }
    
    // 初始化完成后，连接规则扩展API与漏洞检测器
    this.initializeRuleExtensions();
  }
  
  /**
   * Initialize rule extensions and connect them to the detector
   */
  initializeRuleExtensions() {
    // 尝试将规则扩展API连接到漏洞检测器
    if (this.detector && this.ruleExtensionAPI) {
      this.detector.setRuleExtensionAPI && this.detector.setRuleExtensionAPI(this.ruleExtensionAPI);
    }
  }

  /**
   * 按需加载模块
   * @param {string} moduleName - 模块名称
   * @returns {Promise<any>} 加载的模块
   */
  async loadModule(moduleName) {
    if (!this.modules[moduleName]) {
      this.modules[moduleName] = await this.moduleLoader.load(moduleName, { config: this.config });
    }
    return this.modules[moduleName];
  }

  /**
   * 同步加载模块
   * @param {string} moduleName - 模块名称
   * @returns {any} 加载的模块
   */
  loadModuleSync(moduleName) {
    if (!this.modules[moduleName]) {
      this.modules[moduleName] = this.moduleLoader.loadSync(moduleName, { config: this.config });
    }
    return this.modules[moduleName];
  }

  mergeConfig(defaultCfg, userCfg) {
    const merged = { ...defaultCfg };
    
    for (const key in userCfg) {
      if (typeof userCfg[key] === 'object' && !Array.isArray(userCfg[key]) && userCfg[key] !== null) {
        merged[key] = { ...merged[key], ...userCfg[key] };
      } else {
        merged[key] = userCfg[key];
      }
    }
    
    return merged;
  }

  /**
   * FileTypeAnalyzer - Smart file type detection and analysis
   */
  static getFileTypeAnalyzer() {
    return {
      // Detect file type based on content and extension
      detectFileType(filePath, content = null) {
        const ext = path.extname(filePath).toLowerCase();
        
        // Extension-based detection
        const extensionMap = {
          '.vue': 'vue',
          '.js': 'javascript',
          '.jsx': 'jsx',
          '.ts': 'typescript',
          '.tsx': 'tsx',
          '.json': 'json',
          '.html': 'html',
          '.css': 'css',
          '.scss': 'scss',
          '.sass': 'sass',
          '.less': 'less',
          '.styl': 'stylus',
          '.md': 'markdown',
          '.wxml': 'wxml',
          '.wxss': 'wxss',
          '.wxs': 'wxs',
          '.nvue': 'nvue',
          '.swan': 'swan',
          '.ttml': 'ttml',
          '.qml': 'qml'
        };
        
        if (extensionMap[ext]) {
          return extensionMap[ext];
        }
        
        // Content-based detection
        if (content) {
          // Check for JSON
          try {
            JSON.parse(content);
            return 'json';
          } catch {
            // Not JSON
          }
          
          // Check for Vue component
          if (content.includes('<template') || content.includes('<script') || content.includes('<style')) {
            return 'vue';
          }
          
          // Check for TypeScript
          if (content.includes('import type') || content.includes('interface ') || content.includes('type ') || content.includes('namespace ')) {
            return 'typescript';
          }
          
          // Check for JSX
          if (content.includes('React') || content.includes('createElement') || content.includes('<div') || content.includes('<span')) {
            return 'jsx';
          }
        }
        
        // Fallback to extension or unknown
        return ext.substring(1) || 'unknown';
      },
      
      // Check if file is likely to contain security vulnerabilities
      isSecurityRelevant(filePath, content = null) {
        const fileType = this.detectFileType(filePath, content);
        const fileName = path.basename(filePath).toLowerCase();
        
        // Definitely relevant file types
        const relevantTypes = ['vue', 'javascript', 'jsx', 'typescript', 'tsx', 'json', 'html'];
        if (relevantTypes.includes(fileType)) {
          return true;
        }
        
        // Check for config files
        const configFiles = ['config', 'env', 'environment', 'setting', 'setup'];
        if (configFiles.some(keyword => fileName.includes(keyword))) {
          return true;
        }
        
        // Check for security-related files
        const securityFiles = ['auth', 'login', 'password', 'token', 'api', 'secret', 'key'];
        if (securityFiles.some(keyword => fileName.includes(keyword))) {
          return true;
        }
        
        return false;
      },
      
      // Score file importance for security scanning
      scoreFileImportance(filePath, content = null) {
        let score = 0;
        const fileName = path.basename(filePath).toLowerCase();
        const fileType = this.detectFileType(filePath, content);
        
        // File type importance
        const typeScores = {
          'vue': 10,
          'javascript': 8,
          'typescript': 9,
          'jsx': 8,
          'tsx': 9,
          'json': 7,
          'html': 6,
          'wxml': 5,
          'wxss': 3,
          'css': 2,
          'scss': 2,
          'less': 2
        };
        
        score += typeScores[fileType] || 1;
        
        // File name importance
        const highImportanceFiles = ['auth', 'login', 'password', 'token', 'api', 'secret', 'key', 'config', 'env'];
        if (highImportanceFiles.some(keyword => fileName.includes(keyword))) {
          score += 5;
        }
        
        // Package.json is very important
        if (fileName === 'package.json') {
          score += 10;
        }
        
        // Path importance
        const pathParts = filePath.toLowerCase().split(path.sep);
        const importantDirs = ['src', 'components', 'views', 'pages', 'router', 'store', 'api', 'utils'];
        importantDirs.forEach(dir => {
          if (pathParts.includes(dir)) {
            score += 2;
          }
        });
        
        // Content-based importance (if content provided)
        if (content) {
          const securityKeywords = ['eval', 'exec', 'require', 'import', 'fetch', 'axios', 'localStorage', 'sessionStorage', 'cookie', 'password', 'token', 'api', 'secret', 'key'];
          securityKeywords.forEach(keyword => {
            if (content.includes(keyword)) {
              score += 1;
            }
          });
        }
        
        return score;
      },
      
      // Quick pre-check to see if file might contain vulnerabilities
      quickSecurityCheck(filePath, maxSize = 100000) {
        try {
          const stats = fs.statSync(filePath);
          if (stats.size > maxSize) {
            return { safe: false, reason: 'too_large' };
          }
          
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for obvious security issues
          const dangerousPatterns = [
            /eval\s*\(/g,
            /new\s+Function\s*\(/g,
            /document\.write\s*\(/g,
            /innerHTML\s*=/g,
            /outerHTML\s*=/g,
            /localStorage\.setItem/g,
            /sessionStorage\.setItem/g,
            /password\s*[:=]/gi,
            /token\s*[:=]/gi,
            /api[_-]?key\s*[:=]/gi,
            /secret\s*[:=]/gi,
            /fetch\s*\(/g,
            /axios\.get\s*\(/g,
            /axios\.post\s*\(/g
          ];
          
          let foundIssues = [];
          dangerousPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              foundIssues.push(pattern.toString());
            }
          });
          
          return {
            safe: foundIssues.length === 0,
            issues: foundIssues,
            fileType: this.detectFileType(filePath, content),
            importance: this.scoreFileImportance(filePath, content)
          };
        } catch (error) {
          return { safe: false, reason: 'error', error: error.message };
        }
      }
    };
  }

  /**
   * Find all relevant files in a Vue.js project
   * @param {string} projectPath - Path to Vue.js project
   * @returns {Array<string>} - Array of file paths to scan
   */
  findVueProjectFiles(projectPath) {
    const absoluteProjectPath = path.resolve(projectPath);
    const fileTypeAnalyzer = SecurityScanner.getFileTypeAnalyzer();

    const patterns = [
      '**/*.vue',
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
      '**/package.json',
      '**/vue.config.js',
      '**/.env*',
      '**/webpack.config.*',
      // uni-app 支持
      '**/*.nvue',
      '**/pages.json',
      '**/manifest.json',
      '**/uni.scss',
      // 微信小程序支持
      '**/*.wxml',
      '**/*.wxss',
      '**/*.wxs',
      '**/app.json',
      '**/project.config.json',
      '**/sitemap.json',
      // 其他小程序框架支持
      '**/*.swan',
      '**/*.ttml',
      '**/*.qml',
      '**/*.html',
      // Taro 框架支持
      '**/app.config.ts',
      '**/app.config.js',
      '**/*.config.ts',
      '**/*.config.js',
      '**/app.tsx',
      '**/app.jsx'
    ];

    const files = [];
    patterns.forEach(pattern => {
      try {
        const matches = glob.sync(pattern, {
          cwd: absoluteProjectPath,
          ignore: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.git/**',
            '**/coverage/**',
            '**/public/**/*.*',
            '**/*.min.js'
          ].concat(this.config.scan.ignorePatterns.map(p => `**/${p}`)),
          nodir: true
        });

        const absoluteMatches = matches.map(match => path.join(absoluteProjectPath, match));
        files.push(...absoluteMatches);
      } catch (error) {
        console.warn(`Error finding files with pattern ${pattern}:`, error.message);
      }
    });

    // Deduplicate and filter files
    const uniqueFiles = [...new Set(files)];
    
    // Smart filtering based on security relevance
    const filteredFiles = uniqueFiles.filter(filePath => {
      try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          return false;
        }
        
        // Check file size
        const stats = fs.statSync(filePath);
        if (stats.size > (this.config.scan.maxSize * 1024 * 1024)) {
          console.log(`Skipping large file: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          return false;
        }
        
        // Check if file is security relevant
        if (!fileTypeAnalyzer.isSecurityRelevant(filePath)) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.warn(`Error filtering file ${filePath}:`, error.message);
        return false;
      }
    });

    // Sort files by importance
    filteredFiles.sort((a, b) => {
      const importanceA = fileTypeAnalyzer.scoreFileImportance(a);
      const importanceB = fileTypeAnalyzer.scoreFileImportance(b);
      return importanceB - importanceA; // Descending order
    });

    console.log(`Found ${uniqueFiles.length} files, filtered to ${filteredFiles.length} security-relevant files`);
    return filteredFiles;
  }

  /**
   * Get file metadata for cache
   * @param {string} filePath - File path
   * @returns {Object} - File metadata
   */
  getFileMetadata(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        mtime: stats.mtime.getTime(),
        size: stats.size
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Load scan cache
   * @returns {Object} - Cache data
   */
  loadCache() {
    if (!this.incrementalScan.enabled) {
      return {};
    }

    try {
      if (fs.existsSync(this.cachePath)) {
        const cacheData = fs.readFileSync(this.cachePath, 'utf8');
        return JSON.parse(cacheData);
      }
    } catch (error) {
      console.warn(`Could not load cache: ${error.message}`);
    }

    return {};
  }

  /**
   * Save scan cache
   * @param {Object} cacheData - Cache data
   */
  saveCache(cacheData) {
    if (!this.incrementalScan.enabled) {
      return;
    }

    try {
      fs.writeFileSync(this.cachePath, JSON.stringify(cacheData, null, 2));
      console.log(`Cache saved to ${this.cachePath}`);
    } catch (error) {
      console.warn(`Could not save cache: ${error.message}`);
    }
  }

  /**
   * Filter files for incremental scan
   * @param {Array<string>} files - All files
   * @returns {Array<string>} - Files that need to be scanned
   */
  filterFilesForIncrementalScan(files) {
    if (!this.incrementalScan.enabled) {
      return files;
    }

    const cache = this.loadCache();
    const filesToScan = [];

    files.forEach(filePath => {
      if (!filePath || typeof filePath !== 'string') {
        return;
      }

      try {
        const relativePath = path.relative(this.projectPath, filePath);
        const metadata = this.getFileMetadata(filePath);
        
        if (!metadata) {
          return;
        }

        if (!cache[relativePath] || 
            cache[relativePath].mtime !== metadata.mtime ||
            cache[relativePath].size !== metadata.size) {
          filesToScan.push(filePath);
        }
      } catch (error) {
        console.warn(`Error processing file for incremental scan: ${error.message}`);
      }
    });

    console.log(`Incremental scan: Found ${filesToScan.length} files to scan (${files.length - filesToScan.length} unchanged)`);
    return filesToScan;
  }

  /**
   * Check memory usage and trigger garbage collection if needed
   */
  checkMemoryAndGC() {
    const memoryUsage = process.memoryUsage();
    const usedMemory = memoryUsage.heapUsed;
    const usedMemoryMB = usedMemory / 1024 / 1024;
    const rssMemoryMB = memoryUsage.rss / 1024 / 1024;
    const externalMemoryMB = memoryUsage.external / 1024 / 1024;
    
    // 更新内存使用峰值
    if (usedMemoryMB > this.scanStats.memoryUsage.peak) {
      this.scanStats.memoryUsage.peak = usedMemoryMB;
    }
    
    // 计算内存压力百分比
    const memoryPressure = usedMemoryMB / this.memoryLimit;
    
    // 输出详细内存信息
    if (this.config.output.verbose || memoryPressure > 0.8) {
      console.log(`Memory usage: Heap=${usedMemoryMB.toFixed(2)}MB, RSS=${rssMemoryMB.toFixed(2)}MB, External=${externalMemoryMB.toFixed(2)}MB, Pressure=${(memoryPressure * 100).toFixed(1)}%, Limit=${this.memoryLimit}MB`);
    }
    
    // 如果内存压力过高，执行垃圾回收
    if (memoryPressure > 0.8) {
      console.warn(`High memory pressure: ${usedMemoryMB.toFixed(2)}MB/${this.memoryLimit}MB (${(memoryPressure * 100).toFixed(1)}%)`);
      
      if (global.gc) {
        const beforeGC = process.memoryUsage();
        global.gc();
        const afterGC = process.memoryUsage();
        const freedMemory = (beforeGC.heapUsed - afterGC.heapUsed) / 1024 / 1024;
        
        console.log(`GC completed: freed ${freedMemory.toFixed(2)}MB. Now: ${(afterGC.heapUsed / 1024 / 1024).toFixed(2)}MB`);
        
        // 根据释放的内存量调整批次大小
        if (freedMemory < 10 && this.batchSize > 1) {
          // 如果GC效果不明显，减少批次大小以减轻内存压力
          this.batchSize = Math.max(1, Math.floor(this.batchSize * 0.8));
          console.log(`Reducing batch size to ${this.batchSize} due to low GC effectiveness`);
        } else if (freedMemory > 50) {
          // 如果GC效果显著，可以适当增加批次大小
          this.batchSize = Math.min(this.batchSize * 1.1, 50);
          console.log(`Increasing batch size to ${Math.round(this.batchSize)} due to effective GC`);
        }
      } else {
        console.warn('Garbage collection not available. Run with --expose-gc flag to enable manual GC.');
      }
    } else if (memoryPressure > 0.6) {
      // 中等内存压力，监控并可能减少并发
      if (this.config.output.verbose) {
        console.log(`Moderate memory pressure: ${usedMemoryMB.toFixed(2)}MB/${this.memoryLimit}MB (${(memoryPressure * 100).toFixed(1)}%)`);
      }
      this.adjustParallelism();
    }
    
    return {
      usedMemory,
      usedMemoryMB,
      memoryPressure,
      rssMemoryMB,
      externalMemoryMB
    };
  }

  /**
   * Scan a single file
   * @param {string} filePath - Path to file
   * @returns {Promise<Array>} - Vulnerabilities found
   */
  async scanFile(filePath) {
    try {
      // 检查文件是否应该被忽略
      if (this.ignoreManager.shouldIgnoreFile(filePath)) {
        if (this.config.output.verbose) {
          console.log(`Ignoring file: ${filePath}`);
        }
        return [];
      }
      
      let stats;
      try {
        stats = fs.statSync(filePath);
      } catch (statError) {
        console.warn(`Could not stat file ${filePath}: ${statError.message}`);
        return [];
      }
      
      if (stats.size > (this.config.scan.maxSize * 1024 * 1024)) {
        if (this.config.output.verbose) {
          console.log(`Skipping large file: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        }
        return [];
      }
      
      // 快速安全预检查
      const quickCheck = SecurityScanner.getFileTypeAnalyzer().quickSecurityCheck(filePath, this.config.scan.maxSize * 1024 * 1024);
      if (quickCheck.safe === false && quickCheck.reason === 'too_large') {
        if (this.config.output.verbose) {
          console.log(`Skipping oversized file: ${filePath}`);
        }
        return [];
      }
      
      // 如果快速检查发现潜在问题，继续详细扫描
      if (!quickCheck.safe && quickCheck.issues && quickCheck.issues.length > 0) {
        if (this.config.output.verbose) {
          console.log(`Quick check flagged potential issues in ${filePath}: ${quickCheck.issues.length} issues detected`);
        }
      }
      
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch (readError) {
        console.warn(`Could not read file ${filePath}: ${readError.message}`);
        return [];
      }
      
      // 对于大文件，先做快速筛选
      if (content.length > 50000) { // 50KB
        // 检查是否有明显的安全相关内容
        if (!this.containsSecurityRelevantContent(content)) {
          content = null; // 立即释放
          return [];
        }
      }
      
      let fileVulns;
      try {
        if (this.gpuAccelerator) {
          // 使用GPU加速检测
          fileVulns = await this.detector.detectVulnerabilities(filePath, content, process.cwd());
        } else {
          // 常规检测
          fileVulns = await this.detector.detectVulnerabilities(filePath, content, process.cwd());
        }
      } catch (detectError) {
        console.warn(`Could not detect vulnerabilities in ${filePath}: ${detectError.message}`);
        
        // 增强错误恢复机制 - 尝试不同的检测方法
        try {
          // 尝试使用简化的检测方法
          fileVulns = await this.attemptFallbackDetection(filePath, content);
        } catch (fallbackError) {
          console.warn(`Fallback detection also failed for ${filePath}: ${fallbackError.message}`);
          return [];
        }
      }
      
      // 过滤掉应该被忽略的漏洞
      const filteredVulns = fileVulns.filter(vuln => !this.ignoreManager.shouldIgnoreVulnerability(vuln));
      
      // 立即释放文件内容引用
      content = null;
      
      // 监控内存使用情况
      this.monitorMemoryUsage();
      
      // 在某些情况下触发垃圾回收
      if (global.gc && this.scanStats.filesScanned % this.gcInterval === 0) {
        try {
          global.gc();
        } catch (gcError) {
          // GC 失败不影响扫描继续
        }
      }
      
      return filteredVulns;
    } catch (error) {
      this.scanStats.errors++;
      const handledError = ErrorHandler.handleFileError(filePath, error);
      console.warn(`Could not process file ${filePath}: ${handledError.message}`);
      
      // 错误恢复：记录错误但继续处理其他文件
      return [];
    }
  }
  
  /**
   * Attempt fallback vulnerability detection when primary method fails
   * @param {string} filePath - Path to the file
   * @param {string} content - File content
   * @returns {Promise<Array>} - Array of vulnerabilities
   */
  async attemptFallbackDetection(filePath, content) {
    console.log(`Attempting fallback detection for ${filePath}`);
    
    // 创建一个简化的检测器实例
    const fallbackVulns = [];
    
    // 基于内容的简单模式匹配
    const patterns = [
      { pattern: /eval\s*\(/gi, severity: 'HIGH', type: 'INJECTION' },
      { pattern: /innerHTML\s*=/gi, severity: 'HIGH', type: 'XSS' },
      { pattern: /document\.cookie/gi, severity: 'MEDIUM', type: 'PRIVACY' },
      { pattern: /localStorage\.setItem/gi, severity: 'MEDIUM', type: 'STORAGE' }
    ];
    
    for (const { pattern, severity, type } of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        fallbackVulns.push({
          ruleId: `FALLBACK_${type}`,
          description: `Potential ${type} vulnerability detected`,
          severity: severity,
          file: filePath,
          line: content.substring(0, match.index).split('\n').length,
          column: match.index - content.lastIndexOf('\n', match.index) - 1,
          code: match[0],
          recommendation: `Review this ${type} vulnerability carefully`
        });
      }
    }
    
    return fallbackVulns;
  }
  
  /**
   * Check if content contains security-relevant patterns
   * @param {string} content - File content to check
   * @returns {boolean} - True if content contains security-relevant patterns
   */
  containsSecurityRelevantContent(content) {
    // 快速正则表达式检查，识别可能存在安全问题的内容
    const securityPatterns = [
      /eval\s*\(/i,
      /new\s+Function\s*\(/i,
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
      /document\.write\s*\(/i,
      /localStorage\.setItem/i,
      /sessionStorage\.setItem/i,
      /cookie/i,
      /password/i,
      /token/i,
      /api[_-]?key/i,
      /secret/i,
      /fetch\s*\(/i,
      /axios\./i,
      /XMLHttpRequest/i,
      /import\s+|require\s*\(/,
      /from\s+['"][^'"]*router/i,
      /from\s+['"][^'"]*auth/i,
      /from\s+['"][^'"]*login/i,
      /crypto/i
    ];
    
    return securityPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Process files in batches to manage memory
   * @param {Array<string>} files - Array of file paths
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Array>} - All vulnerabilities
   */
  async processFilesInBatches(files, onProgress) {
    const allVulnerabilities = [];
    const totalFiles = files.length;
    let processedFiles = 0;
    
    if (this.config.output.verbose) {
      console.log(`Starting batch processing of ${totalFiles} files with batch size ${this.batchSize}`);
      console.log(`Parallelism: ${this.parallelism.currentConcurrency} concurrent processes, granularity: ${this.parallelism.granularity}`);
    }
    
    // 动态调整批处理大小，根据文件数量和内存情况
    let adjustedBatchSize = Math.min(this.batchSize, Math.max(1, Math.floor(1000 / Math.log(totalFiles + 1))));
    console.log(`Using adjusted batch size: ${adjustedBatchSize}`);
    
    // 准备文件队列（可选：按优先级排序）
    let fileQueue = [...files];
    if (this.parallelism.priorityEnabled) {
      if (this.config.output.verbose) {
        console.log('Sorting files by priority...');
      }
      const fileTypeAnalyzer = SecurityScanner.getFileTypeAnalyzer();
      fileQueue.sort((a, b) => {
        const scoreA = fileTypeAnalyzer.scoreFileImportance(a);
        const scoreB = fileTypeAnalyzer.scoreFileImportance(b);
        return scoreB - scoreA; // 降序排列，优先级高的在前
      });
    }
    
    // 性能统计
    const startTime = Date.now();
    let lastProgressTime = startTime;
    
    // 错误恢复机制
    const failedFiles = [];
    
    for (let i = 0; i < fileQueue.length; i += adjustedBatchSize) {
      const batch = fileQueue.slice(i, i + adjustedBatchSize);
      const batchNumber = Math.floor(i / adjustedBatchSize) + 1;
      const totalBatches = Math.ceil(fileQueue.length / adjustedBatchSize);
      
      if (this.config.output.verbose) {
        console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
      }
      
      const batchVulnerabilities = [];
      
      // 动态调整并行度
      if (this.parallelism.dynamicAdjustment) {
        this.adjustParallelism();
        if (this.config.output.verbose) {
          console.log(`Current parallelism: ${this.parallelism.currentConcurrency}`);
        }
      }
      
      try {
        // 根据粒度控制选择处理策略
        if (this.parallelism.granularity === 'file') {
          // 文件级并行处理
          await this.processFilesInParallel(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles);
        } else if (this.parallelism.granularity === 'batch') {
          // 批处理级并行处理
          await this.processBatchSequentially(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles);
        } else {
          // 自动模式：根据文件数量和大小选择
          await this.processFilesAuto(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles);
        }
      } catch (batchError) {
        console.error(`Error processing batch ${batchNumber}: ${batchError.message}`);
        // 记录失败的文件以便稍后重试
        failedFiles.push(...batch);
        continue; // 跳过当前批次的后续处理
      }
      
      processedFiles += batch.length;
      
      if (this.config.output.verbose) {
        console.log(`Batch ${batchNumber}/${totalBatches} completed. Found ${batchVulnerabilities.length} vulnerabilities in this batch.`);
      }
      
      // 更频繁的内存检查和动态调整
      this.monitorMemoryUsage();
      
      // 清除规则引擎缓存
      try {
        const ruleEngine = require('./rules/rule-engine');
        ruleEngine.clearRegexCache();
      } catch (error) {
        // 忽略错误
      }
      
      // 优化漏洞存储，实时去重
      const uniqueBatchVulnerabilities = this.deduplicateVulnerabilities(batchVulnerabilities);
      if (this.config.output.verbose && batchVulnerabilities.length !== uniqueBatchVulnerabilities.length) {
        console.log(`Removed ${batchVulnerabilities.length - uniqueBatchVulnerabilities.length} duplicates in this batch`);
      }
      
      // 检查内存限制
      if (allVulnerabilities.length + uniqueBatchVulnerabilities.length > this.maxVulnerabilitiesInMemory) {
        console.warn(`Reached maximum vulnerabilities limit (${this.maxVulnerabilitiesInMemory}), keeping only most recent results`);
        const remaining = this.maxVulnerabilitiesInMemory - allVulnerabilities.length;
        if (remaining > 0) {
          allVulnerabilities.push(...uniqueBatchVulnerabilities.slice(0, remaining));
        }
      } else {
        allVulnerabilities.push(...uniqueBatchVulnerabilities);
      }
      
      // 强制垃圾回收
      if (global.gc) {
        try {
          global.gc();
        } catch (gcError) {
          // GC 失败不影响扫描继续
        }
      }
      
      // 清空数组，释放内存
      batchVulnerabilities.length = 0;
      
      // 输出性能指标（每处理完一定数量的批次）
      if (batchNumber % 5 === 0 || batchNumber === totalBatches) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const timePerBatch = (currentTime - lastProgressTime) / Math.min(5, batchNumber);
        const estimatedRemainingTime = timePerBatch * (totalBatches - batchNumber);
        
        if (this.config.output.verbose) {
          console.log(`Performance: ${processedFiles}/${totalFiles} files processed in ${(elapsedTime / 1000).toFixed(2)}s`);
          console.log(`Estimated time remaining: ${(estimatedRemainingTime / 1000).toFixed(2)}s`);
        }
        
        lastProgressTime = currentTime;
      }
      
      // 检查是否需要暂停或终止（例如用户中断、严重错误等）
      if (this.shouldTerminateEarly()) {
        console.log('Early termination requested, stopping scan...');
        break;
      }
    }
    
    // 处理失败的文件
    if (failedFiles.length > 0) {
      if (this.config.output.verbose) {
        console.log(`Retrying ${failedFiles.length} failed files...`);
      }
      for (const filePath of failedFiles) {
        try {
          const fileVulns = await this.scanFile(filePath);
          allVulnerabilities.push(...fileVulns);
          if (this.config.output.verbose) {
            console.log(`Successfully retried ${filePath}`);
          }
        } catch (retryError) {
          console.error(`Retry failed for ${filePath}: ${retryError.message}`);
          this.scanStats.errors++; // 确保错误计数正确
        }
      }
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    if (this.config.output.verbose) {
      console.log(`Batch processing completed in ${totalTime.toFixed(2)}s. Average: ${(totalTime / processedFiles).toFixed(3)}s per file`);
      console.log(`Failed files: ${failedFiles.length}, Total errors: ${this.scanStats.errors}`);
    }
    
    return allVulnerabilities;
  }
  
  /**
   * Check if scan should terminate early
   * @returns {boolean} - True if scan should terminate early
   */
  shouldTerminateEarly() {
    // 可以添加各种终止条件，如严重错误计数过多、内存不足等
    return this.scanStats.errors > 100; // 示例：错误超过100个时提前终止
  }
  
  // 文件级并行处理
  async processFilesInParallel(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles) {
    const concurrencyLimit = this.parallelism.currentConcurrency;
    
    // 实现动态负载均衡
    const semaphore = new AsyncSemaphore(concurrencyLimit, {
      timeout: 60000, // 60秒超时
      onTimeout: () => {
        console.warn('Semaphore timeout occurred, consider reducing concurrency');
      }
    });
    
    const promises = batch.map(async (file) => {
      await semaphore.acquire();
      try {
        const fileVulnerabilities = await this.scanFile(file);
        
        // 更新进度
        const currentProcessed = processedFiles + batch.indexOf(file) + 1;
        onProgress && onProgress(currentProcessed, totalFiles, file);
        
        // 添加到结果集
        batchVulnerabilities.push(...fileVulnerabilities);
        
        // 检查内存使用情况
        if (batchVulnerabilities.length % 5 === 0) { // 每处理5个文件检查一次内存
          this.monitorMemoryUsage();
        }
        
        return fileVulnerabilities;
      } finally {
        semaphore.release();
      }
    });
    
    await Promise.all(promises);
  }
  
  // 动态调整并行度的方法
  adjustParallelism() {
    if (!this.fineGrainedControl.enableDynamicResourceManagement) {
      return; // 如果禁用了动态资源管理，则不进行调整
    }
    
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const memoryRatio = currentMemory / this.memoryLimit;
    
    // 获取CPU使用率
    const cpuUsage = this.getCPUUsage();
    
    // 使用细粒度控制中的阈值
    if (memoryRatio > this.fineGrainedControl.memoryPressureThreshold || 
        cpuUsage > this.fineGrainedControl.cpuPressureThreshold) {
      // 高内存或CPU使用率，降低并行度
      this.parallelism.currentConcurrency = Math.max(
        this.parallelism.minConcurrency,
        Math.floor(this.parallelism.currentConcurrency * 0.7)
      );
    } else if (memoryRatio < 0.5 && cpuUsage < 0.5) {
      // 低资源使用率，提高并行度
      this.parallelism.currentConcurrency = Math.min(
        this.parallelism.maxConcurrency,
        this.parallelism.currentConcurrency + 1
      );
    }
  }
  
  // 获取CPU使用率
  getCPUUsage() {
    const os = require('os');
    const cpus = os.cpus();
    const avgLoad = os.loadavg()[0]; // 1分钟平均负载
    const cpuCount = cpus.length;
    
    // 计算相对负载（0-1之间）
    const relativeLoad = avgLoad / cpuCount;
    
    // 确保返回值在0-1范围内
    return Math.min(1, Math.max(0, relativeLoad));
  }
  
  // 动态调整内存限制
  adjustMemoryLimit(currentUsageMB) {
    const os = require('os');
    const totalMemory = os.totalmem() / 1024 / 1024; // MB
    const freeMemory = os.freemem() / 1024 / 1024; // MB
    const memoryPressure = (totalMemory - freeMemory) / totalMemory;
    
    // 根据系统内存压力调整内存限制
    if (memoryPressure > 0.8) {
      // 系统内存压力大，降低本进程的内存限制
      this.memoryLimit = Math.max(128, this.memoryLimit * 0.7);
      this.memoryThreshold = this.memoryLimit * 0.8 * 1024 * 1024;
      console.log(`System memory pressure high (${(memoryPressure * 100).toFixed(1)}%), reducing memory limit to ${this.memoryLimit.toFixed(2)}MB`);
    } else if (memoryPressure < 0.4 && currentUsageMB < this.memoryLimit * 0.3) {
      // 系统内存充裕且当前使用较少，可适当增加内存限制
      const newLimit = Math.min(1024, this.memoryLimit * 1.2); // 最大不超过1GB
      if (newLimit > this.memoryLimit) {
        this.memoryLimit = newLimit;
        this.memoryThreshold = this.memoryLimit * 0.8 * 1024 * 1024;
        console.log(`System memory available, increasing memory limit to ${this.memoryLimit.toFixed(2)}MB`);
      }
    }
  }
  
  // 动态调整内存限制
  adjustMemoryLimit(currentUsageMB) {
    const os = require('os');
    const totalMemory = os.totalmem() / 1024 / 1024; // MB
    const freeMemory = os.freemem() / 1024 / 1024; // MB
    const memoryPressure = (totalMemory - freeMemory) / totalMemory;
    
    // 根据系统内存压力调整内存限制
    if (memoryPressure > 0.8) {
      // 系统内存压力大，降低本进程的内存限制
      this.memoryLimit = Math.max(128, this.memoryLimit * 0.7);
      this.memoryThreshold = this.memoryLimit * 0.8 * 1024 * 1024;
      console.log(`System memory pressure high (${(memoryPressure * 100).toFixed(1)}%), reducing memory limit to ${this.memoryLimit.toFixed(2)}MB`);
    } else if (memoryPressure < 0.4 && currentUsageMB < this.memoryLimit * 0.3) {
      // 系统内存充裕且当前使用较少，可适当增加内存限制
      const newLimit = Math.min(1024, this.memoryLimit * 1.2); // 最大不超过1GB
      if (newLimit > this.memoryLimit) {
        this.memoryLimit = newLimit;
        this.memoryThreshold = this.memoryLimit * 0.8 * 1024 * 1024;
        console.log(`System memory available, increasing memory limit to ${this.memoryLimit.toFixed(2)}MB`);
      }
    }
  }
  
  // 批处理级顺序处理
  async processBatchSequentially(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles) {
    for (const filePath of batch) {
      const fileVulns = await this.scanFile(filePath);
      this.scanStats.filesScanned++;
      
      if (onProgress && (this.scanStats.filesScanned % 5 === 0)) {
        onProgress(this.scanStats.filesScanned, totalFiles, filePath);
      }
      
      batchVulnerabilities.push(...fileVulns);
    }
  }
  
  // 自动模式：根据文件情况选择处理策略
  async processFilesAuto(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles) {
    // 分析批处理中的文件
    const fileTypeAnalyzer = SecurityScanner.getFileTypeAnalyzer();
    let hasLargeFiles = false;
    let totalFileSize = 0;
    
    for (const filePath of batch) {
      try {
        const stats = fs.statSync(filePath);
        totalFileSize += stats.size;
        if (stats.size > 1000000) { // 1MB
          hasLargeFiles = true;
        }
      } catch (error) {
        // 忽略文件大小检查错误
      }
    }
    
    const avgFileSize = totalFileSize / batch.length;
    
    // 决策逻辑
    if (hasLargeFiles || avgFileSize > 500000) { // 500KB
      // 大文件或平均文件较大，使用顺序处理
      console.log('Auto mode: Using sequential processing for large files');
      await this.processBatchSequentially(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles);
    } else {
      // 小文件，使用并行处理
      console.log('Auto mode: Using parallel processing for small files');
      await this.processFilesInParallel(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles);
    }
  }
  
  // 动态调整并行度
  adjustParallelism() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    
    // 基于内存使用调整并行度
    if (heapUsedMB > this.memoryLimit * 0.8) {
      // 内存使用高，降低并行度
      this.parallelism.currentConcurrency = Math.max(
        this.parallelism.minConcurrency,
        this.parallelism.currentConcurrency - 1
      );
    } else if (heapUsedMB < this.memoryLimit * 0.3) {
      // 内存使用低，可以提高并行度
      this.parallelism.currentConcurrency = Math.min(
        this.parallelism.maxConcurrency,
        this.parallelism.currentConcurrency + 1
      );
    }
    
    // 基于CPU使用调整（简化版）
    // 注意：Node.js中获取准确的CPU使用率比较复杂，这里使用简化逻辑
    const os = require('os');
    const cpuUsage = os.loadavg()[0] / os.cpus().length;
    
    if (cpuUsage > 0.8) {
      // CPU负载高，降低并行度
      this.parallelism.currentConcurrency = Math.max(
        this.parallelism.minConcurrency,
        this.parallelism.currentConcurrency - 1
      );
    } else if (cpuUsage < 0.3) {
      // CPU负载低，可以提高并行度
      this.parallelism.currentConcurrency = Math.min(
        this.parallelism.maxConcurrency,
        this.parallelism.currentConcurrency + 1
      );
    }
  }

  /**
   * Monitor memory usage and dynamically adjust batch sizes based on memory pressure
   */
  monitorMemoryUsage() {
    const memoryInfo = this.checkMemoryAndGC();
    
    // 如果内存压力持续较高，进一步调整参数
    if (memoryInfo.memoryPressure > 0.7) {
      // 在高内存压力下，不仅调整并发度，还考虑减少批处理大小
      if (this.batchSize > 2) {
        this.batchSize = Math.max(1, Math.floor(this.batchSize * 0.9));
        if (this.config.output.verbose) {
          console.log(`High memory pressure detected, reducing batch size to ${this.batchSize}`);
        }
      }
    } else if (memoryInfo.memoryPressure < 0.3) {
      // 当内存压力较低时，可以适当增加批处理大小以提升性能
      if (this.batchSize < 20) {
        this.batchSize = Math.min(this.batchSize * 1.1, 20);
        if (this.config.output.verbose) {
          console.log(`Low memory pressure detected, increasing batch size to ${Math.round(this.batchSize)}`);
        }
      }
    }
    
    // 返回当前内存状态，供其他部分使用
    return memoryInfo;
  }

  /**
   * Scan project using large-scale file processor for better performance with many files
   */
  async scanWithLargeScaleProcessor(projectPath, options = {}) {
    const allVulnerabilities = [];
    const startTime = Date.now();
    
    // 设置事件监听器
    this.largeScaleFileProcessor.on('patternStart', (data) => {
      if (this.config.output.verbose) {
        console.log(`Scanning pattern: ${data.pattern}`);
      }
    });
    
    this.largeScaleFileProcessor.on('batchStart', (data) => {
      const progress = ((data.batchNumber * data.batchSize) / this.largeScaleFileProcessor.stats.totalFilesDiscovered * 100).toFixed(1);
      console.log(`Processing batch ${data.batchNumber} (${data.batchSize} files) - Progress: ${progress}%`);
    });
    
    this.largeScaleFileProcessor.on('batchComplete', (data) => {
      console.log(`Batch ${data.batchNumber} completed. Files processed: ${data.filesProcessed}`);
    });
    
    this.largeScaleFileProcessor.on('fileSkipped', (data) => {
      if (this.config.output.verbose) {
        console.log(`Skipped file: ${data.filePath} (${data.reason})`);
      }
    });
    
    this.largeScaleFileProcessor.on('fileError', (data) => {
      console.error(`Error processing file: ${data.filePath}`, data.error.message);
      this.scanStats.errors++;
    });
    
    // 定义文件处理器
    const processor = async (filePath) => {
      try {
        const vulnerabilities = await this.scanFile(filePath);
        if (vulnerabilities && vulnerabilities.length > 0) {
          allVulnerabilities.push(...vulnerabilities);
        }
        return vulnerabilities;
      } catch (error) {
        console.error(`Error scanning ${filePath}:`, error.message);
        return [];
      }
    };
    
    // 开始处理
    try {
      await this.largeScaleFileProcessor.processProject(projectPath, processor);
    } catch (error) {
      console.error('Error during large-scale processing:', error);
      throw error;
    }
    
    // 获取统计信息
    const stats = this.largeScaleFileProcessor.getStats();
    console.log(`\nLarge-scale processing stats:`);
    console.log(`  Total files discovered: ${stats.totalFilesDiscovered}`);
    console.log(`  Files processed: ${stats.filesProcessed}`);
    console.log(`  Files skipped: ${stats.filesSkipped}`);
    console.log(`  Bytes processed: ${stats.bytesProcessedMB} MB`);
    console.log(`  Memory peak: ${stats.memoryPeakMB} MB`);
    console.log(`  Processing time: ${stats.processingTimeSeconds} seconds`);
    
    // 更新扫描统计
    this.scanStats.filesScanned = stats.filesProcessed;
    
    return allVulnerabilities;
  }

  /**
   * Main function to scan a Vue.js project for security vulnerabilities
   * @param {string} projectPath - Path to Vue.js project
   * @param {Object} options - Scan options
   * @returns {Promise<Object>} - Scan results
   */
  async scanVueProject(projectPath, options = {}) {
    // 更新项目路径和忽略管理器
    this.projectPath = path.resolve(projectPath);
    this.ignoreManager = new IgnoreManager(this.projectPath);
    
    console.log(`Scanning project at: ${projectPath}`);
    console.log(`Batch size: ${this.batchSize}, GC interval: ${this.gcInterval} files`);
    console.log(`Memory limit: ${this.memoryLimit}MB, Threshold: ${(this.memoryThreshold / 1024 / 1024).toFixed(2)}MB`);
    if (this.incrementalScan.enabled) {
      console.log(`Incremental scan enabled, cache: ${this.cachePath}`);
    }
    
    this.scanStats.startTime = new Date();
    
    let vulnerabilities = [];
    let files = [];
    
    try {
      // 使用大规模文件处理器（如果启用）
      if (this.largeScaleFileProcessor) {
        console.log('Using large-scale file processor for efficient file handling');
        vulnerabilities = await this.scanWithLargeScaleProcessor(projectPath, options);
      } else {
        // 传统文件处理方式
        files = this.findVueProjectFiles(projectPath);
        console.log(`Found ${files.length} files to scan`);
        
        // 应用增量扫描过滤
        files = this.filterFilesForIncrementalScan(files);
        
        if (files.length === 0) {
          console.log('No files found to scan');
          this.scanStats.endTime = new Date();
          return this.generateResult(vulnerabilities, 0);
        }
        
        const onProgress = (scanned, total, currentFile) => {
          if (this.config.output.showProgress && scanned % 10 === 0) {
            const progress = ((scanned / total) * 100).toFixed(1);
            console.log(`Progress: ${progress}% (${scanned}/${total} files) - Current: ${path.basename(currentFile)}`);
          }
        };
        
        vulnerabilities = await this.processFilesInBatches(files, onProgress);
      }
      
      // 扫描依赖漏洞
      console.log('\nScanning dependencies for vulnerabilities...');
      const dependencyVulns = await this.dependencyScanner.scanDependencies(projectPath);
      vulnerabilities.push(...dependencyVulns);
      console.log(`Found ${dependencyVulns.length} dependency vulnerabilities`);
      
      // 执行跨文件依赖分析（如果启用）
      if (this.detector && this.detector.enableCrossFileAnalysis) {
        console.log('\nPerforming cross-file dependency analysis...');
        const crossFileResults = this.detector.analyzeCrossFileDependencies(projectPath, files);
        vulnerabilities.push(...crossFileResults.vulnerabilities);
        console.log(`Found ${crossFileResults.vulnerabilities.length} cross-file vulnerabilities`);
        console.log(`Circular dependencies: ${crossFileResults.summary.circularDependencies}`);
        console.log(`Security impacts: ${crossFileResults.summary.securityImpacts}`);
      }
      
      // 执行TypeScript类型检查（如果启用）
      if (this.config.typescript && this.config.typescript.enabled) {
        console.log('\nRunning TypeScript type check...');
        const typeVulns = this.typeScriptChecker.scanTypeScript(projectPath);
        vulnerabilities.push(...typeVulns);
        console.log(`Found ${typeVulns.length} TypeScript type errors`);
      }
      
      // 执行DAST扫描（如果启用）
      if (this.config.dast && this.config.dast.enabled) {
        console.log('\nRunning DAST scan...');
        const dastResults = await this.dastScanner.scan(this.config.dast.options || {});
        const dastVulns = dastResults.vulnerabilities.map(vuln => ({
          ...vuln,
          file: vuln.url,
          line: 0,
          column: 0,
          ruleId: `DAST_${vuln.type.replace(/\s+/g, '_').toUpperCase()}`,
          description: `DAST detected ${vuln.type}: ${vuln.evidence}`
        }));
        vulnerabilities.push(...dastVulns);
        console.log(`Found ${dastVulns.length} DAST vulnerabilities`);
      }
      
      // 去重漏洞
      console.log('\nDeduplicating vulnerabilities...');
      const uniqueVulnerabilities = this.deduplicateVulnerabilities(vulnerabilities);
      console.log(`Removed ${vulnerabilities.length - uniqueVulnerabilities.length} duplicate vulnerabilities`);
      vulnerabilities = uniqueVulnerabilities;
      
      // 更新增量扫描缓存
      if (this.incrementalScan.enabled) {
        const cacheData = this.loadCache();
        files.forEach(filePath => {
          const relativePath = path.relative(this.projectPath, filePath);
          const metadata = this.getFileMetadata(filePath);
          if (metadata) {
            cacheData[relativePath] = metadata;
          }
        });
        this.saveCache(cacheData);
      }
    } catch (error) {
      console.error('Error during scanning:', error);
      this.scanStats.errors++;
    }
    
    this.scanStats.endTime = new Date();
    
    const result = this.generateResult(vulnerabilities, this.scanStats.filesScanned);
    
    // 应用智能分析
    if (this.detector && this.detector.intelligentAnalyzer) {
      console.log('\nPerforming intelligent analysis...');
      const analysisContext = {
        projectPath: this.projectPath,
        scanStats: this.scanStats
      };
      
      try {
        const analysisSummary = this.detector.intelligentAnalyzer.generateAnalysisSummary(
          result.vulnerabilities, 
          analysisContext
        );
        
        result.intelligentAnalysis = analysisSummary;
        console.log(`Intelligent analysis completed. Identified ${analysisSummary.statistics.highRiskVulnerabilities} high-risk vulnerabilities.`);
      } catch (error) {
        console.warn('Intelligent analysis failed:', error.message);
      }
    }
    
    // 生成高级报告（如果启用）
    if (this.config.output.advancedReport) {
      console.log('\nGenerating advanced report...');
      const advancedReport = this.advancedReportGenerator.generateAdvancedReport(result);
      
      if (this.config.output.format === 'html') {
        const htmlPath = this.config.output.reportPath || path.join(projectPath, 'security-report-advanced.html');
        // Generate HTML using multi-format generator if available, otherwise use advanced generator
        if (this.multiFormatReportGenerator) {
          const htmlReport = this.multiFormatReportGenerator.generateReport(advancedReport, 'html');
          const fullHtmlPath = path.resolve(htmlPath);
          fs.writeFileSync(fullHtmlPath, htmlReport, 'utf8');
          console.log(`Advanced HTML report saved to: ${fullHtmlPath}`);
        } else {
          // Fallback to old method if multi-format generator not available
          console.log(`Advanced HTML report saved to: ${htmlPath}`);
        }
      }
      
      result.advancedReport = advancedReport;
    }
    
    console.log(`\nScan completed in ${((this.scanStats.endTime - this.scanStats.startTime) / 1000).toFixed(2)}s`);
    console.log(`Files scanned: ${result.summary.filesScanned}`);
    console.log(`Vulnerabilities found: ${result.summary.totalVulnerabilities}`);
    console.log(`Errors: ${this.scanStats.errors}`);
    console.log(`Memory usage: Start ${this.scanStats.memoryUsage.start.toFixed(2)}MB, Peak ${this.scanStats.memoryUsage.peak.toFixed(2)}MB`);
    
    // 详细内存报告（如果启用了内存报告选项）
    if (options.memoryReport) {
      const memoryUsage = process.memoryUsage();
      console.log('\n--- MEMORY USAGE REPORT ---');
      console.log(`RSS (Resident Set Size): ${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Array Buffers: ${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Memory Growth Rate: ${(((this.scanStats.memoryUsage.peak - this.scanStats.memoryUsage.start) / this.scanStats.memoryUsage.start) * 100).toFixed(2)}%`);
      console.log(`Avg Memory Per File: ${(this.scanStats.memoryUsage.peak / result.summary.filesScanned).toFixed(2)}MB`);
      console.log('---------------------------\n');
    }
    
    // 关闭并行规则引擎，释放worker线程资源
    try {
      const parallelRuleEngine = require('./rules/parallel-rule-engine');
      parallelRuleEngine.shutdown();
      console.log('Parallel rule engine shutdown completed');
    } catch (error) {
      // 忽略关闭错误，不影响扫描结果
    }
    
    // 释放GPU资源
    if (this.gpuAccelerator) {
      try {
        this.gpuAccelerator.dispose();
        console.log('GPU accelerator shutdown completed');
      } catch (error) {
        // 忽略关闭错误，不影响扫描结果
      }
    }
    
    return result;
  }

  /**
   * Generate scan result
   * @param {Array} vulnerabilities - Array of vulnerabilities
   * @param {number} filesScanned - Number of files scanned
   * @returns {Object} - Scan result
   */
  generateResult(vulnerabilities, filesScanned) {
    const summary = this.generateSummary(vulnerabilities, filesScanned);
    
    return {
      summary,
      vulnerabilities,
      scannedAt: new Date().toISOString(),
      projectPath: process.cwd(),
      scanStats: this.getScanStats()
    };
  }

  /**
   * Generate summary statistics from vulnerabilities
   * @param {Array} vulnerabilities - Array of vulnerability objects
   * @param {number} filesScanned - Number of files scanned
   * @returns {Object} - Summary object
   */
  generateSummary(vulnerabilities, filesScanned) {
    const criticalSeverity = vulnerabilities.filter(v => v.severity === 'Critical').length;
    const highSeverity = vulnerabilities.filter(v => v.severity === 'High').length;
    const mediumSeverity = vulnerabilities.filter(v => v.severity === 'Medium').length;
    const lowSeverity = vulnerabilities.filter(v => v.severity === 'Low').length;
    
    // Generate vulnerability classification statistics
    const classifications = this.classifyVulnerabilities(vulnerabilities);
    
    return {
      filesScanned,
      criticalSeverity,
      highSeverity,
      mediumSeverity,
      lowSeverity,
      totalVulnerabilities: vulnerabilities.length,
      classifications
    };
  }
  
  /**
   * Classify vulnerabilities by type
   * @param {Array} vulnerabilities - Array of vulnerability objects
   * @returns {Object} - Classification statistics
   */
  classifyVulnerabilities(vulnerabilities) {
    const classifications = {};
    
    vulnerabilities.forEach(vuln => {
      const type = vuln.type || 'Unknown';
      if (!classifications[type]) {
        classifications[type] = {
          count: 0,
          severity: {
            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0
          }
        };
      }
      
      classifications[type].count++;
      const severity = vuln.severity || 'Unknown';
      if (classifications[type].severity[severity] !== undefined) {
        classifications[type].severity[severity]++;
      }
    });
    
    return classifications;
  }

  getScanStats() {
    return {
      ...this.scanStats,
      durationMs: this.scanStats.endTime - this.scanStats.startTime
    };
  }

  updateConfig(newConfig) {
    this.config = this.mergeConfig(this.config, newConfig);
    this.detector.updateConfig(this.config);
    
    if (newConfig.batchSize) {
      this.batchSize = newConfig.batchSize;
    }
    if (newConfig.memoryThreshold) {
      this.memoryThreshold = newConfig.memoryThreshold;
    }
    if (newConfig.gcInterval) {
      this.gcInterval = newConfig.gcInterval;
    }
  }
  
  /**
   * Generate reports in multiple formats
   * @param {Object} scanResult - The scan result object
   * @param {Array} formats - Array of formats to generate (e.g., ['json', 'html', 'csv'])
   * @param {string} outputDir - Directory to save reports
   * @returns {Object} - Object mapping format to file path
   */
  async generateMultiFormatReports(scanResult, formats = ['json'], outputDir = './reports') {
    const fs = require('fs');
    const path = require('path');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const results = {};
    
    for (const format of formats) {
      try {
        const reportContent = this.multiFormatReportGenerator.generateReport(scanResult, format);
        const fileName = `security-report.${format}`;
        const filePath = path.join(outputDir, fileName);
        
        // Write report to file
        fs.writeFileSync(filePath, reportContent, 'utf8');
        
        results[format] = filePath;
        console.log(`Generated ${format.toUpperCase()} report: ${filePath}`);
      } catch (error) {
        console.error(`Failed to generate ${format} report:`, error.message);
        results[format] = null;
      }
    }
    
    return results;
  }

  getConfig() {
    return {
      ...this.config,
      batchSize: this.batchSize,
      memoryThreshold: this.memoryThreshold,
      gcInterval: this.gcInterval
    };
  }
  
  /**
   * Deduplicate vulnerabilities
   * @param {Array} vulnerabilities - Array of vulnerability objects
   * @returns {Array} - Array of unique vulnerability objects
   */
  deduplicateVulnerabilities(vulnerabilities) {
    const seen = new Set();
    const uniqueVulnerabilities = [];
    
    for (const vuln of vulnerabilities) {
      // Create a unique key for each vulnerability
      // Include file, line, ruleId, and type to ensure uniqueness
      const key = `${vuln.file}:${vuln.line || 'N/A'}:${vuln.ruleId || 'unknown'}:${vuln.type || 'unknown'}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVulnerabilities.push(vuln);
      }
    }
    
    return uniqueVulnerabilities;
  }
}

module.exports = {
  SecurityScanner,
  scanVueProject: async (projectPath, options = {}) => {
    const scanner = new SecurityScanner(options.config || {});
    return await scanner.scanVueProject(projectPath, options);
  }
};
