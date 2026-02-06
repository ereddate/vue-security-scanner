const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const EventEmitter = require('events');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

class LargeScaleFileProcessor extends EventEmitter {
  constructor(options = {}) {
    super();
    this.batchSize = options.batchSize || 100;
    this.concurrentLimit = options.concurrentLimit || 5;
    this.fileFilter = options.fileFilter || this.defaultFileFilter;
    this.stats = {
      totalFilesDiscovered: 0,
      filesProcessed: 0,
      filesSkipped: 0,
      bytesProcessed: 0,
      bytesProcessedMB: 0,
      memoryPeak: 0,
      memoryPeakMB: 0,
      processingTime: 0,
      processingTimeSeconds: 0
    };
  }

  defaultFileFilter(filePath) {
    const extensions = ['.vue', '.js', '.jsx', '.ts', '.tsx', '.json', '.html'];
    return extensions.some(ext => filePath.endsWith(ext));
  }

  async processDirectory(directory, processor, options = {}) {
    try {
      this.emit('start', { directory, options });
      const files = await this.findAllFiles(directory);
      this.stats.totalFilesDiscovered = files.length;
      this.emit('filesFound', { count: files.length });
      console.log(`Found ${files.length} files to process`);
      
      const startTime = Date.now();
      const results = await this.processFilesInBatches(files, processor, options);
      this.stats.processingTime = Date.now() - startTime;
      this.stats.processingTimeSeconds = (this.stats.processingTime / 1000).toFixed(2);
      
      this.emit('complete', { results });
      return results;
    } catch (error) {
      this.emit('error', error);
      console.error('Failed to process directory:', error.message);
      return [];
    }
  }

  async findAllFiles(directory) {
    const files = [];
    const self = this;
    
    async function traverse(currentPath) {
      try {
        const entries = await readdir(currentPath);
        
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry);
          const entryStat = await stat(fullPath);
          
          if (entryStat.isDirectory()) {
            // Skip node_modules and other common directories
            if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === 'build') {
              continue;
            }
            await traverse(fullPath);
          } else if (entryStat.isFile() && self.fileFilter(fullPath)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
        console.warn(`Skipping ${currentPath}:`, error.message);
      }
    }
    
    await traverse(directory);
    return files;
  }

  async processFilesInBatches(files, processor, options = {}) {
    const results = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i += this.batchSize) {
      const batch = files.slice(i, i + this.batchSize);
      const batchNumber = Math.floor(i / this.batchSize) + 1;
      const totalBatches = Math.ceil(totalFiles / this.batchSize);
      
      this.emit('batchStart', { batchNumber, totalBatches, count: batch.length, batchSize: this.batchSize });
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
      
      const batchResults = await this.processBatch(batch, processor, options);
      results.push(...batchResults);
      this.stats.filesProcessed += batchResults.length;
      
      this.emit('batchComplete', { batchNumber, totalBatches, count: batchResults.length, filesProcessed: batchResults.length });
      
      // Add delay between batches if needed
      if (options.batchDelay) {
        await new Promise(resolve => setTimeout(resolve, options.batchDelay));
      }
    }
    
    return results;
  }

  async processBatch(files, processor, options = {}) {
    const results = [];
    const processingQueue = [];
    
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      this.emit('fileStart', { filePath, index: i });
      
      processingQueue.push(this.processFileWithRetry(filePath, processor, options));
      
      if (processingQueue.length >= this.concurrentLimit || i === files.length - 1) {
        const batchResults = await Promise.all(processingQueue);
        const validResults = batchResults.filter(result => result !== null);
        results.push(...validResults);
        processingQueue.length = 0;
      }
    }
    
    return results;
  }

  async processFileWithRetry(filePath, processor, options = {}) {
    const maxRetries = options.maxRetries || 3;
    const retryDelay = options.retryDelay || 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await processor(filePath);
        this.emit('fileComplete', { filePath, result });
        return result;
      } catch (error) {
        this.emit('fileError', { filePath, error, attempt, maxRetries });
        console.warn(`Failed to process ${filePath} (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        } else {
          this.stats.filesSkipped++;
          this.emit('fileSkipped', { filePath, reason: 'Max retries exceeded' });
          return null;
        }
      }
    }
  }

  getStats() {
    return {
      ...this.stats,
      batchSize: this.batchSize,
      concurrentLimit: this.concurrentLimit
    };
  }

  updateConfig(config) {
    if (config.batchSize) {
      this.batchSize = config.batchSize;
    }
    if (config.concurrentLimit) {
      this.concurrentLimit = config.concurrentLimit;
    }
    if (config.fileFilter) {
      this.fileFilter = config.fileFilter;
    }
  }

  async processProject(projectPath, processor, options = {}) {
    try {
      this.emit('projectStart', { projectPath, options });
      
      const results = await this.processDirectory(projectPath, processor, options);
      
      this.emit('projectComplete', { results });
      return {
        success: true,
        results,
        count: results.length,
        ...this.stats
      };
    } catch (error) {
      this.emit('projectError', error);
      console.error('Failed to process project:', error.message);
      return {
        success: false,
        error: error.message,
        results: [],
        ...this.stats
      };
    }
  }

  resetStats() {
    this.stats = {
      totalFilesDiscovered: 0,
      filesProcessed: 0,
      filesSkipped: 0,
      bytesProcessed: 0,
      bytesProcessedMB: 0,
      memoryPeak: 0,
      memoryPeakMB: 0,
      processingTime: 0,
      processingTimeSeconds: 0
    };
  }
}

module.exports = LargeScaleFileProcessor;
