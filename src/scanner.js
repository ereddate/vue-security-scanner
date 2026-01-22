// src/scanner.js
// 主扫描器模块

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const VulnerabilityDetector = require('./core/vulnerability-detector');
const defaultConfig = require('./config/default-config');
const { ErrorHandler } = require('./utils/error-handler');

class SecurityScanner {
  constructor(config = {}) {
    // 合并用户配置和默认配置
    this.config = this.mergeConfig(defaultConfig, config);
    this.detector = new VulnerabilityDetector(this.config);
    this.scanStats = {
      filesScanned: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };
  }

  mergeConfig(defaultCfg, userCfg) {
    // 深度合并配置
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
   * @param {string} projectPath - Path to the Vue.js project
   * @returns {Array<string>} - Array of file paths to scan
   */
  findVueProjectFiles(projectPath) {
    // Resolve the project path to an absolute path
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
            '**/public/**/*.*', // Exclude static assets
            '**/*.min.js'       // Exclude minified files
          ].concat(this.config.scan.ignorePatterns.map(p => `**/${p}`)),
          nodir: true
        });

        // Convert relative paths to absolute paths
        const absoluteMatches = matches.map(match => path.join(absoluteProjectPath, match));
        files.push(...absoluteMatches);
      } catch (error) {
        console.warn(`Error finding files with pattern ${pattern}:`, error.message);
      }
    });

    // Remove duplicates
    return [...new Set(files)];
  }

  /**
   * Main function to scan a Vue.js project for security vulnerabilities
   * @param {string} projectPath - Path to the Vue.js project
   * @param {Object} options - Scan options
   * @returns {Promise<Object>} - Scan results
   */
  async scanVueProject(projectPath, options = {}) {
    console.log(`Scanning project at: ${projectPath}`);
    
    this.scanStats.startTime = new Date();
    
    // Find all relevant files in the project
    const files = this.findVueProjectFiles(projectPath);
    console.log(`Found ${files.length} files to scan`);
    
    let vulnerabilities = [];
    let filesScanned = 0;
    
    // Scan each file for vulnerabilities
    for (const filePath of files) {
      try {
        const stats = fs.statSync(filePath);
        
        // Skip files that are too large
        if (stats.size > (this.config.scan.maxSize * 1024 * 1024)) {
          console.log(`Skipping large file: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          continue;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Run vulnerability detection
        const fileVulns = await this.detector.detectVulnerabilities(filePath, content, projectPath);
        vulnerabilities.push(...fileVulns);
        filesScanned++;
        
        if (this.config.output.showProgress && filesScanned % 10 === 0) {
          console.log(`Scanned ${filesScanned}/${files.length} files...`);
        }
      } catch (error) {
        this.scanStats.errors++;
        const handledError = ErrorHandler.handleFileError(filePath, error);
        console.warn(`Could not process file ${filePath}: ${handledError.message}`);
      }
    }
    
    this.scanStats.endTime = new Date();
    this.scanStats.filesScanned = filesScanned;
    
    // Generate summary
    const summary = this.generateSummary(vulnerabilities, filesScanned);
    
    return {
      summary,
      vulnerabilities,
      scannedAt: new Date().toISOString(),
      projectPath,
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

  // 允许动态更新配置
  updateConfig(newConfig) {
    this.config = this.mergeConfig(this.config, newConfig);
    this.detector.updateConfig(this.config);
  }

  // 获取当前配置
  getConfig() {
    return this.config;
  }
}

module.exports = {
  SecurityScanner,
  scanVueProject: async (projectPath, options = {}) => {
    const scanner = new SecurityScanner(options.config || {});
    return await scanner.scanVueProject(projectPath, options);
  }
};