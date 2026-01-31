// src/rules/parallel-rule-engine.js
// 并行规则匹配引擎 - 使用worker_threads实现并行处理

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const os = require('os');

class ParallelRuleEngine {
  constructor() {
    this.maxWorkers = Math.max(1, os.cpus().length - 1); // 保留一个核心给主线程
    this.workers = [];
    this.workerPool = [];
    this.initialized = false;
  }

  /**
   * 初始化worker池
   */
  initialize() {
    if (this.initialized) {
      return;
    }

    console.log(`Initializing parallel rule engine with ${this.maxWorkers} workers...`);

    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(__filename, {
        workerData: { workerId: i }
      });

      this.workers.push(worker);
      this.workerPool.push({
        worker,
        busy: false,
        id: i
      });
    }

    this.initialized = true;
    console.log('Parallel rule engine initialized');
  }

  /**
   * 并行分析文件
   * @param {Array} rules - 规则数组
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {number} maxVulnerabilities - 最大漏洞数
   * @returns {Promise<Array>} - 漏洞数组
   */
  async analyzeParallel(rules, filePath, content, maxVulnerabilities = 100) {
    if (!this.initialized) {
      this.initialize();
    }

    // 将规则分成多个批次
    const batchSize = Math.ceil(rules.length / this.maxWorkers);
    const batches = [];

    for (let i = 0; i < rules.length; i += batchSize) {
      batches.push(rules.slice(i, i + batchSize));
    }

    // 并行处理每个批次
    const promises = batches.map((batch, index) => {
      return this.processBatch(batch, filePath, content, index);
    });

    const results = await Promise.all(promises);

    // 合并结果
    const allVulnerabilities = [];
    let count = 0;

    for (const batchResult of results) {
      for (const vuln of batchResult) {
        if (count >= maxVulnerabilities) break;
        allVulnerabilities.push(vuln);
        count++;
      }
      if (count >= maxVulnerabilities) break;
    }

    return allVulnerabilities;
  }

  /**
   * 处理单个规则批次
   * @param {Array} rules - 规则数组
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {number} batchId - 批次ID
   * @returns {Promise<Array>} - 漏洞数组
   */
  async processBatch(rules, filePath, content, batchId) {
    return new Promise((resolve, reject) => {
      // 获取空闲worker
      const workerInfo = this.getAvailableWorker();

      if (!workerInfo) {
        // 如果没有空闲worker，使用同步处理
        const result = this.processBatchSync(rules, filePath, content);
        resolve(result);
        return;
      }

      workerInfo.busy = true;

      // 设置超时
      const timeout = setTimeout(() => {
        workerInfo.busy = false;
        reject(new Error(`Worker timeout for batch ${batchId}`));
      }, 30000); // 30秒超时

      // 监听worker消息
      workerInfo.worker.once('message', (result) => {
        clearTimeout(timeout);
        workerInfo.busy = false;
        resolve(result);
      });

      workerInfo.worker.once('error', (error) => {
        clearTimeout(timeout);
        workerInfo.busy = false;
        console.error(`Worker error for batch ${batchId}:`, error);
        // 出错时使用同步处理
        const result = this.processBatchSync(rules, filePath, content);
        resolve(result);
      });

      // 发送任务到worker
      workerInfo.worker.postMessage({
        type: 'analyze',
        rules,
        filePath,
        content,
        batchId
      });
    });
  }

  /**
   * 获取空闲worker
   * @returns {Object|null} - worker信息
   */
  getAvailableWorker() {
    return this.workerPool.find(w => !w.busy) || null;
  }

  /**
   * 同步处理规则批次（fallback）
   * @param {Array} rules - 规则数组
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  processBatchSync(rules, filePath, content) {
    const { analyzeWithAdvancedRules } = require('./rule-engine');
    return analyzeWithAdvancedRules(filePath, content, Infinity);
  }

  /**
   * 关闭所有worker
   */
  shutdown() {
    console.log('Shutting down parallel rule engine...');

    this.workers.forEach(worker => {
      worker.terminate();
    });

    this.workers = [];
    this.workerPool = [];
    this.initialized = false;
  }

  /**
   * 获取统计信息
   * @returns {Object} - 统计信息
   */
  getStats() {
    const busyWorkers = this.workerPool.filter(w => w.busy).length;

    return {
      initialized: this.initialized,
      maxWorkers: this.maxWorkers,
      activeWorkers: busyWorkers,
      idleWorkers: this.maxWorkers - busyWorkers
    };
  }
}

// Worker线程逻辑
if (!isMainThread) {
  const { analyzeWithAdvancedRules } = require('./rule-engine');

  parentPort.on('message', (data) => {
    if (data.type === 'analyze') {
      try {
        const result = analyzeWithAdvancedRules(data.filePath, data.content, Infinity);
        parentPort.postMessage(result);
      } catch (error) {
        parentPort.postMessage([]);
        console.error(`Worker error processing batch ${data.batchId}:`, error);
      }
    }
  });
}

module.exports = new ParallelRuleEngine();