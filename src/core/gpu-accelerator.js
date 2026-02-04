// src/core/gpu-accelerator.js
// GPU加速器模块 - 自动检测GPU可用性，无GPU时回退到CPU

class GPUAccelerator {
  constructor(config = {}) {
    this.config = {
      enabled: true,
      maxMemory: 1024,
      workerCount: 'auto',
      batchSize: 100,
      useGPUForRegex: true,
      useGPUForAnalysis: false,
      ...config
    };
    this.gpu = null;
    this.initialized = false;
    this.useGPU = false;
    this.initializationError = null;
  }

  async initialize() {
    try {
      // 尝试加载gpu.js
      try {
        const { GPU } = require('gpu.js');
        this.gpu = new GPU({
          mode: 'gpu',
          canvas: false,
          webWorkers: true,
          workerCount: this.config.workerCount === 'auto' ? 
            Math.max(1, require('os').cpus().length) : 
            this.config.workerCount
        });
        this.useGPU = true;
        this.initialized = true;
        console.log('GPU accelerator initialized successfully');
      } catch (error) {
        // gpu.js加载失败，回退到CPU
        console.log('GPU not available, falling back to CPU');
        this.useGPU = false;
        this.initialized = true;
      }
    } catch (error) {
      console.log('GPU initialization failed, falling back to CPU');
      this.initializationError = error;
      this.useGPU = false;
      this.initialized = true;
    }
  }

  // 检查是否可以使用GPU
  isGPUAvailable() {
    return this.useGPU;
  }

  // GPU加速的正则匹配
  async matchRegexPatterns(content, patterns) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.useGPU && this.config.useGPUForRegex) {
      try {
        // 这里是GPU实现的占位符
        // 实际项目中，这里会调用GPU.js的API
        console.log('Using GPU for regex matching');
        return this.gpuMatchRegexPatterns(content, patterns);
      } catch (error) {
        console.warn('GPU regex matching failed, falling back to CPU:', error.message);
        return this.cpuMatchRegexPatterns(content, patterns);
      }
    } else {
      // 使用CPU实现
      return this.cpuMatchRegexPatterns(content, patterns);
    }
  }

  // GPU匹配实现
  gpuMatchRegexPatterns(content, patterns) {
    if (!this.gpu) {
      return this.cpuMatchRegexPatterns(content, patterns);
    }

    try {
      // 将字符串内容和模式转换为适合GPU处理的格式
      // 创建一个简单的字符串匹配内核
      const matchKernel = this.gpu.createKernel(function(text, patterns) {
        const idx = this.thread.x;
        if (idx >= patterns.length) return 0;
        
        // 在GPU上执行简单的子串匹配
        // 注意：对于复杂的正则表达式，这只是一个近似实现
        let matchFound = 0;
        const pattern = patterns[idx];
        const textLen = text.length;
        const patLen = pattern.length;
        
        if (patLen > textLen) return 0;
        
        for (let i = 0; i <= textLen - patLen; i++) {
          let matches = 1;
          for (let j = 0; j < patLen; j++) {
            if (text.charCodeAt(i + j) !== pattern.charCodeAt(j)) {
              matches = 0;
              break;
            }
          }
          if (matches === 1) {
            matchFound = 1;
            break;
          }
        }
        
        return matchFound;
      }).setOutput([patterns.length]);

      // 准备数据用于GPU计算
      const textArray = Array.from(content).map(c => c.charCodeAt(0));
      const patternArrays = patterns.map(pattern => {
        // 简化模式，只考虑纯文本匹配作为GPU加速的基础
        // 对于实际的正则表达式，我们使用简化的文本匹配
        return Array.from(pattern.toLowerCase()).map(c => c.charCodeAt(0));
      });

      // 执行GPU计算
      const result = matchKernel(textArray, patternArrays);
      
      // 清理kernel资源
      matchKernel.destroy();
      
      return result;
    } catch (error) {
      console.warn('GPU string matching failed, falling back to CPU:', error.message);
      return this.cpuMatchRegexPatterns(content, patterns);
    }
  }

  // CPU匹配实现
  cpuMatchRegexPatterns(content, patterns) {
    return patterns.map(pattern => {
      try {
        const regex = new RegExp(pattern, 'gi');
        return regex.test(content) ? 1 : 0;
      } catch (error) {
        console.warn('Invalid regex pattern:', pattern, error.message);
        return 0;
      }
    });
  }

  // GPU加速的文件扫描
  async scanFilesInParallel(files, scanFunction) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.useGPU) {
      try {
        console.log('Using GPU for parallel file scanning');
        // 这里是GPU并行扫描的占位符
        // 实际项目中，这里会使用GPU.js的并行能力
        return this.gpuScanFiles(files, scanFunction);
      } catch (error) {
        console.warn('GPU parallel scanning failed, falling back to CPU:', error.message);
        return this.cpuScanFiles(files, scanFunction);
      }
    } else {
      // 使用CPU并行扫描
      return this.cpuScanFiles(files, scanFunction);
    }
  }

  // GPU文件扫描实现
  async gpuScanFiles(files, scanFunction) {
    if (!this.gpu) {
      return this.cpuScanFiles(files, scanFunction);
    }

    try {
      // 使用GPU加速并行处理多个文件
      // 将扫描任务分布到GPU的不同核心上
      
      // 创建一个处理函数，用于在GPU上执行扫描
      const scanKernel = this.gpu.createKernel(function(fileContents, scanParams) {
        const idx = this.thread.x;
        if (idx >= fileContents.length) return 0;
        
        // 这里定义一个简化的扫描逻辑，实际应用中可能需要更复杂的实现
        // 每个GPU线程处理一个文件
        const content = fileContents[idx];
        let result = 0;
        
        // 简化的扫描逻辑 - 实际应用中这里应该是具体的扫描函数
        // 这只是一个概念验证，表明如何在GPU上并行处理多个文件
        for (let i = 0; i < content.length; i++) {
          if (content.charCodeAt(i) === 60) { // 检查是否有HTML标签起始字符 '<'
            result = 1;
            break;
          }
        }
        
        return result;
      }).setOutput([files.length]);

      // 读取文件内容
      const fs = require('fs');
      const fileContents = files.map(file => {
        try {
          return fs.readFileSync(file, 'utf8');
        } catch (error) {
          console.warn(`Could not read file ${file}:`, error.message);
          return '';
        }
      });

      // 准备数据
      const contentArrays = fileContents.map(content => 
        Array.from(content || '').map(c => c.charCodeAt(0))
      );

      // 执行GPU计算
      const results = scanKernel(contentArrays, []);

      // 清理kernel资源
      scanKernel.destroy();

      // 处理结果
      const processedResults = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i] > 0) {
          // 对于实际扫描，我们需要调用原始的scanFunction
          const result = await scanFunction(files[i]);
          processedResults.push(result);
        }
      }

      return processedResults.flat();
    } catch (error) {
      console.warn('GPU file scanning failed, falling back to CPU:', error.message);
      return this.cpuScanFiles(files, scanFunction);
    }
  }

  // CPU文件扫描实现
  async cpuScanFiles(files, scanFunction) {
    const results = [];
    const batchSize = Math.min(this.config.batchSize, 10);
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(file => scanFunction(file))
      );
      results.push(...batchResults.flat());
    }
    
    return results;
  }

  // 释放资源
  dispose() {
    if (this.gpu) {
      try {
        this.gpu.destroy();
      } catch (error) {
        // 忽略销毁错误
      }
    }
    this.initialized = false;
    this.useGPU = false;
  }

  // 获取状态信息
  getStatus() {
    return {
      initialized: this.initialized,
      useGPU: this.useGPU,
      error: this.initializationError?.message || null,
      config: this.config
    };
  }
}

module.exports = GPUAccelerator;