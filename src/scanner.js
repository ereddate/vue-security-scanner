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
    
    // 并行处理配置
    const os = require('os');
    const cpuCount = os.cpus().length;
    const parallelismConfig = performanceConfig.parallelism || {};
    
    // 并行度配置
    this.parallelism = {
      maxConcurrency: parallelismConfig.maxConcurrency || Math.max(1, Math.min(cpuCount - 1, 4)), // 留一个核心给系统
      minConcurrency: parallelismConfig.minConcurrency || 1,
      dynamicAdjustment: parallelismConfig.dynamicAdjustment !== false,
      currentConcurrency: Math.max(1, Math.min(cpuCount - 1, 4)),
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
      this.reportGenerator = new AdvancedReportGenerator(this.config);
    } catch (error) {
      console.warn('Could not load report generator module:', error.message);
      this.reportGenerator = {
        generateAdvancedReport: (result) => result,
        generateHTMLReport: () => {}
      };
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
    
    // 更新内存使用峰值
    if (usedMemoryMB > this.scanStats.memoryUsage.peak) {
      this.scanStats.memoryUsage.peak = usedMemoryMB;
    }
    
    if (usedMemory > this.memoryThreshold) {
      console.warn(`Memory usage high: ${usedMemoryMB.toFixed(2)}MB, triggering garbage collection...`);
      
      if (global.gc) {
        global.gc();
        const afterGC = process.memoryUsage().heapUsed;
        const afterGCMB = afterGC / 1024 / 1024;
        console.log(`After GC: ${afterGCMB.toFixed(2)}MB (freed ${((usedMemoryMB - afterGCMB)).toFixed(2)}MB)`);
      } else {
        console.warn('Garbage collection not available. Run with --expose-gc flag to enable manual GC.');
      }
    }
    
    return usedMemory;
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
        console.log(`Ignoring file: ${filePath}`);
        return [];
      }
      
      const stats = fs.statSync(filePath);
      
      if (stats.size > (this.config.scan.maxSize * 1024 * 1024)) {
        console.log(`Skipping large file: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        return [];
      }
      
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch (readError) {
        console.warn(`Could not read file ${filePath}: ${readError.message}`);
        return [];
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
        return [];
      }
      
      // 过滤掉应该被忽略的漏洞
      const filteredVulns = fileVulns.filter(vuln => !this.ignoreManager.shouldIgnoreVulnerability(vuln));
      
      // 立即释放文件内容引用
      content = null;
      
      // 立即触发垃圾回收
      if (global.gc) {
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
      return [];
    }
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
    
    console.log(`Starting batch processing of ${totalFiles} files with batch size ${this.batchSize}`);
    console.log(`Parallelism: ${this.parallelism.currentConcurrency} concurrent processes, granularity: ${this.parallelism.granularity}`);
    
    // 动态调整批处理大小，根据文件数量和内存情况
    let adjustedBatchSize = Math.min(this.batchSize, Math.max(1, Math.floor(1000 / Math.log(totalFiles + 1))));
    console.log(`Using adjusted batch size: ${adjustedBatchSize}`);
    
    // 准备文件队列（可选：按优先级排序）
    let fileQueue = [...files];
    if (this.parallelism.priorityEnabled) {
      console.log('Sorting files by priority...');
      const fileTypeAnalyzer = SecurityScanner.getFileTypeAnalyzer();
      fileQueue.sort((a, b) => {
        const scoreA = fileTypeAnalyzer.scoreFileImportance(a);
        const scoreB = fileTypeAnalyzer.scoreFileImportance(b);
        return scoreB - scoreA; // 降序排列，优先级高的在前
      });
    }
    
    for (let i = 0; i < fileQueue.length; i += adjustedBatchSize) {
      const batch = fileQueue.slice(i, i + adjustedBatchSize);
      const batchNumber = Math.floor(i / adjustedBatchSize) + 1;
      const totalBatches = Math.ceil(fileQueue.length / adjustedBatchSize);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
      
      const batchVulnerabilities = [];
      
      // 动态调整并行度
      if (this.parallelism.dynamicAdjustment) {
        this.adjustParallelism();
        console.log(`Current parallelism: ${this.parallelism.currentConcurrency}`);
      }
      
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
      
      processedFiles += batch.length;
      
      console.log(`Batch ${batchNumber}/${totalBatches} completed. Found ${batchVulnerabilities.length} vulnerabilities in this batch.`);
      
      // 更频繁的内存检查
      this.checkMemoryAndGC();
      
      // 清除规则引擎缓存
      try {
        const ruleEngine = require('./rules/rule-engine');
        ruleEngine.clearRegexCache();
      } catch (error) {
        // 忽略错误
      }
      
      // 优化漏洞存储，实时去重
      const uniqueBatchVulnerabilities = this.deduplicateVulnerabilities(batchVulnerabilities);
      console.log(`Removed ${batchVulnerabilities.length - uniqueBatchVulnerabilities.length} duplicates in this batch`);
      
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
    }
    
    return allVulnerabilities;
  }
  
  // 文件级并行处理
  async processFilesInParallel(batch, batchVulnerabilities, onProgress, processedFiles, totalFiles) {
    const concurrencyLimit = this.parallelism.currentConcurrency;
    
    // 使用并发限制处理文件
    for (let i = 0; i < batch.length; i += concurrencyLimit) {
      const chunk = batch.slice(i, i + concurrencyLimit);
      
      const scanPromises = chunk.map(async (filePath) => {
        const fileVulns = await this.scanFile(filePath);
        this.scanStats.filesScanned++;
        
        if (onProgress && (this.scanStats.filesScanned % 5 === 0)) {
          onProgress(this.scanStats.filesScanned, totalFiles, filePath);
        }
        
        return fileVulns;
      });
      
      const chunkResults = await Promise.all(scanPromises);
      chunkResults.forEach(vulns => batchVulnerabilities.push(...vulns));
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
    
    let files = this.findVueProjectFiles(projectPath);
    console.log(`Found ${files.length} files to scan`);
    
    // 应用增量扫描过滤
    files = this.filterFilesForIncrementalScan(files);
    
    let vulnerabilities = [];
    
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
    
    try {
      vulnerabilities = await this.processFilesInBatches(files, onProgress);
      
      // 扫描依赖漏洞
      console.log('\nScanning dependencies for vulnerabilities...');
      const dependencyVulns = await this.dependencyScanner.scanDependencies(projectPath);
      vulnerabilities.push(...dependencyVulns);
      console.log(`Found ${dependencyVulns.length} dependency vulnerabilities`);
      
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
    
    // 生成高级报告（如果启用）
    if (this.config.output.advancedReport) {
      console.log('\nGenerating advanced report...');
      const advancedReport = this.reportGenerator.generateAdvancedReport(result);
      
      if (this.config.output.format === 'html') {
        const htmlPath = this.config.output.reportPath || path.join(projectPath, 'security-report-advanced.html');
        this.reportGenerator.generateHTMLReport(advancedReport, htmlPath);
        console.log(`Advanced HTML report saved to: ${htmlPath}`);
      }
      
      result.advancedReport = advancedReport;
    }
    
    console.log(`\nScan completed in ${((this.scanStats.endTime - this.scanStats.startTime) / 1000).toFixed(2)}s`);
    console.log(`Files scanned: ${result.summary.filesScanned}`);
    console.log(`Vulnerabilities found: ${result.summary.totalVulnerabilities}`);
    console.log(`Errors: ${this.scanStats.errors}`);
    console.log(`Memory usage: Start ${this.scanStats.memoryUsage.start.toFixed(2)}MB, Peak ${this.scanStats.memoryUsage.peak.toFixed(2)}MB`);
    
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
