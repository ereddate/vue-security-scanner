const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class TaskDistributor {
  constructor(config = {}) {
    this.config = config;
    this.taskQueue = [];
    this.workers = new Map();
    this.scanResults = new Map();
    this.taskTimeout = config.taskTimeout || 300000; // 5分钟超时
    this.maxRetries = config.maxRetries || 3;
    this.taskIdCounter = 0;
  }

  generateTaskId() {
    return `task-${Date.now()}-${this.taskIdCounter++}`;
  }

  splitFilesIntoTasks(files, options = {}) {
    const batchSize = options.batchSize || 10;
    const tasks = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const task = {
        id: this.generateTaskId(),
        files: files.slice(i, i + batchSize),
        status: 'pending',
        retries: 0,
        createdAt: new Date().toISOString()
      };
      tasks.push(task);
    }

    return tasks;
  }

  distributeTasks(tasks, workers) {
    const distribution = {};
    const workerIds = workers.map(w => w.id);

    tasks.forEach((task, index) => {
      const workerId = workerIds[index % workerIds.length];
      if (!distribution[workerId]) {
        distribution[workerId] = [];
      }
      distribution[workerId].push(task.id);
      task.assignedWorker = workerId;
      task.status = 'assigned';
    });

    return distribution;
  }

  async assignTaskToWorker(task, worker) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Task ${task.id} timeout`));
      }, this.taskTimeout);

      this.workers.set(task.id, {
        worker,
        timeout,
        resolve,
        reject,
        startTime: Date.now()
      });

      task.status = 'running';
      task.startedAt = new Date().toISOString();
    });
  }

  completeTask(taskId, result) {
    const taskData = this.workers.get(taskId);
    if (!taskData) {
      throw new Error(`Task ${taskId} not found`);
    }

    clearTimeout(taskData.timeout);
    taskData.resolve(result);
    this.workers.delete(taskId);

    const task = this.taskQueue.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in queue`);
    }

    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.result = result;

    this.scanResults.set(taskId, result);
  }

  failTask(taskId, error) {
    const taskData = this.workers.get(taskId);
    if (!taskData) {
      throw new Error(`Task ${taskId} not found`);
    }

    clearTimeout(taskData.timeout);
    taskData.reject(error);
    this.workers.delete(taskId);

    const task = this.taskQueue.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in queue`);
    }

    task.status = 'failed';
    task.error = error.message;
    task.failedAt = new Date().toISOString();
  }

  retryTask(taskId) {
    const task = this.taskQueue.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.retries >= this.maxRetries) {
      throw new Error(`Task ${taskId} exceeded max retries`);
    }

    task.retries++;
    task.status = 'pending';
    task.assignedWorker = null;
    task.startedAt = null;
    task.failedAt = null;
    task.error = null;

    return task;
  }

  getTaskStatus(taskId) {
    const task = this.taskQueue.find(t => t.id === taskId);
    if (!task) {
      return null;
    }

    return {
      id: task.id,
      status: task.status,
      assignedWorker: task.assignedWorker,
      retries: task.retries,
      createdAt: task.createdAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      failedAt: task.failedAt,
      error: task.error
    };
  }

  getAllTasks() {
    return this.taskQueue.map(task => this.getTaskStatus(task.id));
  }

  getScanProgress() {
    const total = this.taskQueue.length;
    const completed = this.taskQueue.filter(t => t.status === 'completed').length;
    const failed = this.taskQueue.filter(t => t.status === 'failed').length;
    const running = this.taskQueue.filter(t => t.status === 'running').length;
    const pending = this.taskQueue.filter(t => t.status === 'pending').length;

    return {
      total,
      completed,
      failed,
      running,
      pending,
      progress: total > 0 ? ((completed / total) * 100).toFixed(2) : 0
    };
  }

  reset() {
    this.taskQueue = [];
    this.workers.forEach(taskData => {
      clearTimeout(taskData.timeout);
    });
    this.workers.clear();
    this.scanResults.clear();
    this.taskIdCounter = 0;
  }
}

module.exports = TaskDistributor;
