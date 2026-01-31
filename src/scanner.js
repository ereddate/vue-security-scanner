// src/scanner.js
// 主扫描器模块 - 优化版本，支持大规模文件扫描和内存管理

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const VulnerabilityDetector = require('./core/vulnerability-detector');
const DependencyVulnerabilityScanner = require('./analysis/dependency-scanner');
const DASTScanner = require('./analysis/dast-scanner');
const AdvancedReportGenerator = require('./reporting/advanced-report-generator');
const defaultConfig = require('./config/default-config');
const { ErrorHandler } = require('./utils/error-handler');
const IgnoreManager = require('./utils/ignore-manager');

class SecurityScanner {
  constructor(config = {}) {
    this.config = this.mergeConfig(defaultConfig, config);
    this.detector = new VulnerabilityDetector(this.config);
    this.dependencyScanner = new DependencyVulnerabilityScanner(this.config);
    this.dastScanner = new DASTScanner(this.config.dast || {});
    this.reportGenerator = new AdvancedReportGenerator(this.config);
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
    this.optimalWorkerCount = Math.max(1, Math.min(cpuCount - 1, 4)); // 留一个核心给系统
    console.log(`Detected ${cpuCount} CPU cores, optimal worker count: ${this.optimalWorkerCount}`);
    console.log(`Performance profile: ${profile} (Memory limit: ${this.memoryLimit}MB, Batch size: ${this.batchSize})`);
    
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
   * Find all relevant files in a Vue.js project
   * @param {string} projectPath - Path to Vue.js project
   * @returns {Array<string>} - Array of file paths to scan
   */
  findVueProjectFiles(projectPath) {
    const absoluteProjectPath = path.resolve(projectPath);

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

    return [...new Set(files)];
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
        fileVulns = await this.detector.detectVulnerabilities(filePath, content, process.cwd());
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
    
    // 动态调整批处理大小，根据文件数量和内存情况
    let adjustedBatchSize = Math.min(this.batchSize, Math.max(1, Math.floor(1000 / Math.log(totalFiles + 1))));
    console.log(`Using adjusted batch size: ${adjustedBatchSize}`);
    
    for (let i = 0; i < files.length; i += adjustedBatchSize) {
      const batch = files.slice(i, i + adjustedBatchSize);
      const batchNumber = Math.floor(i / adjustedBatchSize) + 1;
      const totalBatches = Math.ceil(files.length / adjustedBatchSize);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
      
      const batchVulnerabilities = [];
      
      // 并行处理文件扫描，提高性能
      const scanPromises = batch.map(async (filePath) => {
        const fileVulns = await this.scanFile(filePath);
        this.scanStats.filesScanned++;
        processedFiles++;
        
        if (onProgress && processedFiles % 5 === 0) {
          onProgress(this.scanStats.filesScanned, totalFiles, filePath);
        }
        
        return fileVulns;
      });
      
      const fileResults = await Promise.all(scanPromises);
      fileResults.forEach(vulns => batchVulnerabilities.push(...vulns));
      
      console.log(`Batch ${batchNumber}/${totalBatches} completed. Found ${batchVulnerabilities.length} vulnerabilities in this batch.`);
      
      // 更频繁的内存检查
      this.checkMemoryAndGC();
      
      // 清除规则引擎缓存
      const ruleEngine = require('./rules/rule-engine');
      ruleEngine.clearRegexCache();
      
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
      fileResults.length = 0;
    }
    
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
