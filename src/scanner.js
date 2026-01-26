// src/scanner.js
// 主扫描器模块 - 优化版本，支持大规模文件扫描和内存管理

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const VulnerabilityDetector = require('./core/vulnerability-detector');
const DependencyVulnerabilityScanner = require('./analysis/dependency-scanner');
const AdvancedReportGenerator = require('./reporting/advanced-report-generator');
const defaultConfig = require('./config/default-config');
const { ErrorHandler } = require('./utils/error-handler');
const IgnoreManager = require('./utils/ignore-manager');

class SecurityScanner {
  constructor(config = {}) {
    this.config = this.mergeConfig(defaultConfig, config);
    this.detector = new VulnerabilityDetector(this.config);
    this.dependencyScanner = new DependencyVulnerabilityScanner(this.config);
    this.reportGenerator = new AdvancedReportGenerator(this.config);
    this.projectPath = config.projectPath || process.cwd();
    this.ignoreManager = new IgnoreManager(this.projectPath);
    this.scanStats = {
      filesScanned: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };
    
    // 内存管理配置
    this.batchSize = config.batchSize || 5;
    this.memoryThreshold = config.memoryThreshold || 80 * 1024 * 1024; // 80MB
    this.gcInterval = config.gcInterval || 5; // 每5个文件触发一次GC
    this.maxVulnerabilitiesInMemory = config.maxVulnerabilitiesInMemory || 10000;
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
      '**/webpack.config.*'
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
   * Check memory usage and trigger garbage collection if needed
   */
  checkMemoryAndGC() {
    const memoryUsage = process.memoryUsage();
    const usedMemory = memoryUsage.heapUsed;
    
    if (usedMemory > this.memoryThreshold) {
      console.warn(`Memory usage high: ${(usedMemory / 1024 / 1024).toFixed(2)}MB, triggering garbage collection...`);
      
      if (global.gc) {
        global.gc();
        const afterGC = process.memoryUsage().heapUsed;
        console.log(`After GC: ${(afterGC / 1024 / 1024).toFixed(2)}MB (freed ${((usedMemory - afterGC) / 1024 / 1024).toFixed(2)}MB)`);
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
    
    for (let i = 0; i < files.length; i += this.batchSize) {
      const batch = files.slice(i, i + this.batchSize);
      const batchNumber = Math.floor(i / this.batchSize) + 1;
      const totalBatches = Math.ceil(files.length / this.batchSize);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
      
      const batchVulnerabilities = [];
      
      for (const filePath of batch) {
        const fileVulns = await this.scanFile(filePath);
        batchVulnerabilities.push(...fileVulns);
        this.scanStats.filesScanned++;
        
        if (onProgress) {
          onProgress(this.scanStats.filesScanned, totalFiles, filePath);
        }
      }
      
      console.log(`Batch ${batchNumber}/${totalBatches} completed. Found ${batchVulnerabilities.length} vulnerabilities in this batch.`);
      
      this.checkMemoryAndGC();
      
      const ruleEngine = require('./rules/rule-engine');
      ruleEngine.clearRegexCache();
      
      if (allVulnerabilities.length + batchVulnerabilities.length > this.maxVulnerabilitiesInMemory) {
        console.warn(`Reached maximum vulnerabilities limit (${this.maxVulnerabilitiesInMemory}), keeping only most recent results`);
        const remaining = this.maxVulnerabilitiesInMemory - allVulnerabilities.length;
        if (remaining > 0) {
          allVulnerabilities.push(...batchVulnerabilities.slice(0, remaining));
        }
      } else {
        allVulnerabilities.push(...batchVulnerabilities);
      }
      
      batchVulnerabilities.length = 0;
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
    
    this.scanStats.startTime = new Date();
    
    const files = this.findVueProjectFiles(projectPath);
    console.log(`Found ${files.length} files to scan`);
    
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
    const highSeverity = vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical').length;
    const mediumSeverity = vulnerabilities.filter(v => v.severity === 'Medium').length;
    const lowSeverity = vulnerabilities.filter(v => v.severity === 'Low').length;
    
    return {
      filesScanned,
      highSeverity,
      mediumSeverity,
      lowSeverity,
      totalVulnerabilities: vulnerabilities.length
    };
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
}

module.exports = {
  SecurityScanner,
  scanVueProject: async (projectPath, options = {}) => {
    const scanner = new SecurityScanner(options.config || {});
    return await scanner.scanVueProject(projectPath, options);
  }
};
