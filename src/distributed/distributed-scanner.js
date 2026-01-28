const TaskDistributor = require('./task-distributor');
const { SecurityScanner } = require('../scanner');
const fs = require('fs');
const path = require('path');

class DistributedScanner {
  constructor(config = {}) {
    this.config = config;
    this.taskDistributor = new TaskDistributor(config.distributed || {});
    this.workers = [];
    this.scanResults = [];
    this.scanId = null;
  }

  registerWorker(worker) {
    this.workers.push({
      id: worker.id,
      url: worker.url,
      status: 'idle',
      lastSeen: new Date().toISOString()
    });
    console.log(`Worker registered: ${worker.id} (${worker.url})`);
  }

  async scanProject(projectPath, options = {}) {
    this.scanId = `scan-${Date.now()}`;
    console.log(`Starting distributed scan: ${this.scanId}`);

    const scanner = new SecurityScanner(options);
    const files = scanner.findVueProjectFiles(projectPath);
    console.log(`Found ${files.length} files to scan`);

    if (this.workers.length === 0) {
      console.warn('No workers available, falling back to local scan');
      return await scanner.scanVueProject(projectPath, options);
    }

    const tasks = this.taskDistributor.splitFilesIntoTasks(files, options);
    this.taskDistributor.taskQueue = tasks;
    console.log(`Created ${tasks.length} tasks`);
    console.log(`Task IDs: ${tasks.map(t => t.id).join(', ')}`);

    const distribution = this.taskDistributor.distributeTasks(tasks, this.workers);
    console.log(`Distributed tasks across ${this.workers.length} workers`);
    console.log(`Task distribution:`, JSON.stringify(distribution, null, 2));

    const scanPromises = Object.entries(distribution).map(([workerId, taskIds]) => {
      return this.executeTasksOnWorker(workerId, taskIds, projectPath, options);
    });

    const results = await Promise.allSettled(scanPromises);

    this.scanResults = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    const failedTasks = results.filter(r => r.status === 'rejected');
    if (failedTasks.length > 0) {
      console.warn(`${failedTasks.length} workers failed during scan`);
    }

    return this.aggregateResults(this.scanResults);
  }

  async executeTasksOnWorker(workerId, taskIds, projectPath, options) {
    const worker = this.workers.find(w => w.id === workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} not found`);
    }

    console.log(`Executing ${taskIds.length} tasks on worker ${workerId}`);
    console.log(`Looking for task IDs: ${taskIds.join(', ')}`);
    console.log(`Task queue has ${this.taskDistributor.taskQueue.length} tasks`);
    console.log(`Task queue IDs: ${this.taskDistributor.taskQueue.map(t => t.id).join(', ')}`);
    worker.status = 'busy';

    const results = [];

    for (const taskId of taskIds) {
      try {
        const task = this.taskDistributor.taskQueue.find(t => t.id === taskId);
        if (!task) {
          console.warn(`Task ${taskId} not found in queue, skipping`);
          console.log(`Available tasks: ${this.taskDistributor.taskQueue.map(t => t.id).join(', ')}`);
          continue;
        }

        const result = await this.executeTaskOnWorker(worker, task, projectPath, options);
        results.push(...result);

        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        task.result = result;
        this.taskDistributor.scanResults.set(taskId, result);
      } catch (error) {
        console.error(`Task ${taskId} failed on worker ${workerId}:`, error.message);

        task.status = 'failed';
        task.error = error.message;
        task.failedAt = new Date().toISOString();
      }
    }

    worker.status = 'idle';
    worker.lastSeen = new Date().toISOString();
    return results;
  }

  async executeTaskLocally(task, projectPath, options) {
    const scanner = new SecurityScanner(options);
    const vulnerabilities = [];

    for (const filePath of task.files) {
      try {
        const fileVulns = await scanner.scanFile(filePath);
        vulnerabilities.push(...fileVulns);
      } catch (error) {
        console.error(`Error scanning file ${filePath}:`, error.message);
      }
    }

    return vulnerabilities;
  }

  async executeTaskOnRemoteWorker(worker, task, options) {
    const response = await fetch(`${worker.url}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task: task,
        options: options
      })
    });

    if (!response.ok) {
      throw new Error(`Worker returned status ${response.status}`);
    }

    const result = await response.json();
    return result.vulnerabilities || [];
  }

  async executeTaskOnWorker(worker, task, projectPath, options) {
    if (worker.url) {
      return await this.executeTaskOnRemoteWorker(worker, task, options);
    } else {
      return await this.executeTaskLocally(task, projectPath, options);
    }
  }

  aggregateResults(results) {
    const allVulnerabilities = results.flat();
    const filesScanned = new Set(allVulnerabilities.map(v => v.file)).size;

    const summary = {
      filesScanned,
      totalVulnerabilities: allVulnerabilities.length,
      highSeverity: allVulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical').length,
      mediumSeverity: allVulnerabilities.filter(v => v.severity === 'Medium').length,
      lowSeverity: allVulnerabilities.filter(v => v.severity === 'Low').length
    };

    return {
      scanId: this.scanId,
      summary,
      vulnerabilities: allVulnerabilities,
      scannedAt: new Date().toISOString(),
      workers: this.workers.map(w => ({
        id: w.id,
        status: w.status,
        lastSeen: w.lastSeen
      })),
      progress: this.taskDistributor.getScanProgress()
    };
  }

  getScanStatus() {
    return {
      scanId: this.scanId,
      progress: this.taskDistributor.getScanProgress(),
      workers: this.workers.map(w => ({
        id: w.id,
        status: w.status,
        lastSeen: w.lastSeen
      })),
      tasks: this.taskDistributor.getAllTasks()
    };
  }

  cancelScan() {
    console.log(`Cancelling scan ${this.scanId}`);
    this.taskDistributor.reset();
    this.scanResults = [];
  }
}

module.exports = DistributedScanner;
