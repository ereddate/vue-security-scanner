const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class PerformanceOptimizer {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.join(process.cwd(), '.vue-security-cache');
    this.maxCacheSize = options.maxCacheSize || 100 * 1024 * 1024; // 100MB
    this.cacheTTL = options.cacheTTL || 3600000; // 1小时
    this.enableCache = options.enableCache !== false;
    this.enableIncremental = options.enableIncremental !== false;
    this.scanHistory = new Map();
    this.fileHashCache = new Map();
    
    this.ensureCacheDir();
  }

  /**
   * 确保缓存目录存在
   */
  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * 计算文件内容的哈希值
   * @param {string} content - 文件内容
   * @returns {string} 哈希值
   */
  calculateHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * 获取文件的哈希值（带缓存）
   * @param {string} filePath - 文件路径
   * @returns {string|null} 哈希值
   */
  getFileHash(filePath) {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    const cacheKey = `${filePath}:${stats.mtimeMs}`;
    
    if (this.fileHashCache.has(cacheKey)) {
      return this.fileHashCache.get(cacheKey);
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hash = this.calculateHash(content);
      this.fileHashCache.set(cacheKey, hash);
      return hash;
    } catch (error) {
      console.warn(`Failed to read file ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 检查文件是否已修改
   * @param {string} filePath - 文件路径
   * @param {string} lastHash - 上次扫描的哈希值
   * @returns {boolean} 是否已修改
   */
  isFileModified(filePath, lastHash) {
    const currentHash = this.getFileHash(filePath);
    return currentHash !== lastHash;
  }

  /**
   * 获取需要扫描的文件列表（增量扫描）
   * @param {Array} allFiles - 所有文件列表
   * @param {Object} scanHistory - 扫描历史记录
   * @returns {Array} 需要扫描的文件列表
   */
  getFilesToScan(allFiles, scanHistory) {
    if (!this.enableIncremental || !scanHistory) {
      return allFiles;
    }
    
    const filesToScan = [];
    
    allFiles.forEach(filePath => {
      const lastScan = scanHistory[filePath];
      
      // 如果文件从未扫描过，需要扫描
      if (!lastScan) {
        filesToScan.push(filePath);
        return;
      }
      
      // 如果文件已修改，需要扫描
      if (this.isFileModified(filePath, lastScan.hash)) {
        filesToScan.push(filePath);
        return;
      }
      
      // 如果文件未修改，跳过扫描
      console.log(`Skipping unchanged file: ${filePath}`);
    });
    
    return filesToScan;
  }

  /**
   * 获取扫描缓存
   * @param {string} key - 缓存键
   * @returns {Object|null} 缓存数据
   */
  getScanCache(key) {
    if (!this.enableCache) {
      return null;
    }
    
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    
    if (!fs.existsSync(cacheFile)) {
      return null;
    }
    
    try {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      
      // 检查缓存是否过期
      if (Date.now() - cacheData.timestamp > this.cacheTTL) {
        this.deleteScanCache(key);
        return null;
      }
      
      return cacheData;
    } catch (error) {
      console.warn(`Failed to read cache ${key}:`, error.message);
      return null;
    }
  }

  /**
   * 设置扫描缓存
   * @param {string} key - 缓存键
   * @param {Object} data - 缓存数据
   */
  setScanCache(key, data) {
    if (!this.enableCache) {
      return;
    }
    
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    
    try {
      const cacheData = {
        ...data,
        timestamp: Date.now()
      };
      
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData), 'utf8');
      
      // 检查缓存大小
      this.checkCacheSize();
    } catch (error) {
      console.warn(`Failed to write cache ${key}:`, error.message);
    }
  }

  /**
   * 删除扫描缓存
   * @param {string} key - 缓存键
   */
  deleteScanCache(key) {
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    
    if (fs.existsSync(cacheFile)) {
      try {
        fs.unlinkSync(cacheFile);
      } catch (error) {
        console.warn(`Failed to delete cache ${key}:`, error.message);
      }
    }
  }

  /**
   * 清理所有缓存
   */
  clearAllCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      files.forEach(file => {
        const filePath = path.join(this.cacheDir, file);
        fs.unlinkSync(filePath);
      });
      console.log(`Cleared ${files.length} cache files`);
    } catch (error) {
      console.warn('Failed to clear cache:', error.message);
    }
  }

  /**
   * 检查缓存大小
   */
  checkCacheSize() {
    try {
      let totalSize = 0;
      const files = fs.readdirSync(this.cacheDir);
      
      files.forEach(file => {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
      
      // 如果超过最大缓存大小，清理最旧的缓存
      if (totalSize > this.maxCacheSize) {
        this.cleanOldCache(files, totalSize);
      }
    } catch (error) {
      console.warn('Failed to check cache size:', error.message);
    }
  }

  /**
   * 清理最旧的缓存
   * @param {Array} files - 缓存文件列表
   * @param {number} currentSize - 当前缓存大小
   */
  cleanOldCache(files, currentSize) {
    try {
      const fileStats = files.map(file => {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        return {
          file,
          filePath,
          mtime: stats.mtimeMs,
          size: stats.size
        };
      });
      
      // 按修改时间排序
      fileStats.sort((a, b) => a.mtime - b.mtime);
      
      // 删除最旧的文件，直到缓存大小降到限制以下
      let newSize = currentSize;
      for (const stat of fileStats) {
        if (newSize <= this.maxCacheSize * 0.8) {
          break;
        }
        
        fs.unlinkSync(stat.filePath);
        newSize -= stat.size;
        console.log(`Deleted old cache: ${stat.file}`);
      }
    } catch (error) {
      console.warn('Failed to clean old cache:', error.message);
    }
  }

  /**
   * 保存扫描历史记录
   * @param {Object} history - 扫描历史记录
   */
  saveScanHistory(history) {
    const historyFile = path.join(this.cacheDir, 'scan-history.json');
    
    try {
      fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf8');
    } catch (error) {
      console.warn('Failed to save scan history:', error.message);
    }
  }

  /**
   * 加载扫描历史记录
   * @returns {Object} 扫描历史记录
   */
  loadScanHistory() {
    const historyFile = path.join(this.cacheDir, 'scan-history.json');
    
    if (!fs.existsSync(historyFile)) {
      return {};
    }
    
    try {
      return JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    } catch (error) {
      console.warn('Failed to load scan history:', error.message);
      return {};
    }
  }

  /**
   * 更新扫描历史记录
   * @param {string} filePath - 文件路径
   * @param {string} hash - 文件哈希值
   * @param {Object} scanResult - 扫描结果
   */
  updateScanHistory(filePath, hash, scanResult) {
    const history = this.loadScanHistory();
    
    history[filePath] = {
      hash,
      lastScan: Date.now(),
      result: scanResult
    };
    
    this.saveScanHistory(history);
  }

  /**
   * 获取性能统计信息
   * @returns {Object} 性能统计
   */
  getPerformanceStats() {
    const history = this.loadScanHistory();
    const stats = {
      totalScans: Object.keys(history).length,
      cacheHits: 0,
      cacheMisses: 0,
      avgScanTime: 0,
      totalScanTime: 0
    };
    
    Object.values(history).forEach(entry => {
      if (entry.result) {
        stats.totalScanTime += entry.result.scanTime || 0;
        if (entry.result.fromCache) {
          stats.cacheHits++;
        } else {
          stats.cacheMisses++;
        }
      }
    });
    
    if (stats.totalScans > 0) {
      stats.avgScanTime = stats.totalScanTime / stats.totalScans;
    }
    
    return stats;
  }

  /**
   * 优化正则表达式编译
   * @param {Array} rules - 规则数组
   * @returns {Array} 优化后的规则数组
   */
  optimizeRegexPatterns(rules) {
    const optimizedRules = [];
    
    rules.forEach(rule => {
      if (!rule.patterns) {
        optimizedRules.push(rule);
        return;
      }
      
      const optimizedPatterns = [];
      
      rule.patterns.forEach(patternConfig => {
        const pattern = patternConfig.pattern;
        
        try {
          // 优化正则表达式
          const optimizedPattern = this.optimizeRegex(pattern);
          
          // 编译正则表达式以提升性能
          const compiledRegex = new RegExp(optimizedPattern, 'gi');
          
          optimizedPatterns.push({
            ...patternConfig,
            pattern: optimizedPattern,
            compiled: compiledRegex
          });
        } catch (error) {
          console.warn(`Failed to optimize pattern in rule ${rule.id}:`, error.message);
          optimizedPatterns.push(patternConfig);
        }
      });
      
      optimizedRules.push({
        ...rule,
        patterns: optimizedPatterns
      });
    });
    
    return optimizedRules;
  }

  /**
   * 优化正则表达式
   * @param {string} pattern - 原始正则表达式
   * @returns {string} 优化后的正则表达式
   */
  optimizeRegex(pattern) {
    let optimized = pattern;
    
    // 移除不必要的捕获组
    optimized = optimized.replace(/\(\?:([^)]+)\)/g, '($1)');
    
    // 使用非捕获组代替捕获组（如果不需要引用）
    optimized = optimized.replace(/\(([^?])/g, '(?:$1');
    
    // 优化字符类
    optimized = optimized.replace(/\[([a-z])\]\[([a-z])\]/gi, '[$1$2]');
    
    // 使用原子组代替分支
    optimized = optimized.replace(/(\w+)\|(\1)/g, '(?:$1|$2)');
    
    // 移除不必要的转义
    optimized = optimized.replace(/\\([^\\w\s])/g, '$1');
    
    return optimized;
  }

  /**
   * 并行处理文件
   * @param {Array} files - 文件列表
   * @param {Function} processor - 处理函数
   * @param {number} concurrency - 并发数
   * @returns {Promise<Array>} 处理结果
   */
  async processFilesInParallel(files, processor, concurrency = 4) {
    const results = [];
    const chunks = [];
    
    // 将文件分成多个块
    for (let i = 0; i < files.length; i += concurrency) {
      chunks.push(files.slice(i, i + concurrency));
    }
    
    // 并行处理每个块
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(file => processor(file))
      );
      results.push(...chunkResults);
    }
    
    return results;
  }

  /**
   * 获取内存使用情况
   * @returns {Object} 内存使用情况
   */
  getMemoryUsage() {
    const usage = process.memoryUsage();
    
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
      rss: Math.round(usage.rss / 1024 / 1024) // MB
    };
  }

  /**
   * 强制垃圾回收
   */
  forceGarbageCollection() {
    if (global.gc) {
      global.gc();
    } else {
      console.warn('Garbage collection not available. Start node with --expose-gc flag.');
    }
  }

  /**
   * 监控性能
   * @param {string} operation - 操作名称
   * @param {Function} fn - 要执行的函数
   * @returns {*} 函数执行结果
   */
  async monitorPerformance(operation, fn) {
    const startTime = Date.now();
    const startMemory = this.getMemoryUsage();
    
    try {
      const result = await fn();
      const endTime = Date.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
      
      console.log(`[Performance] ${operation}:`);
      console.log(`  Duration: ${duration}ms`);
      console.log(`  Memory Delta: ${memoryDelta}MB`);
      console.log(`  Heap Used: ${endMemory.heapUsed}MB`);
      
      return {
        result,
        duration,
        memoryDelta,
        memoryUsage: endMemory
      };
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`[Performance] ${operation}: FAILED`);
      console.log(`  Duration: ${duration}ms`);
      console.log(`  Error: ${error.message}`);
      
      throw error;
    }
  }
}

module.exports = PerformanceOptimizer;