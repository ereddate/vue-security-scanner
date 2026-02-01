const fs = require('fs');
const path = require('path');

class ResultAggregator {
  constructor(config = {}) {
    this.config = config;
    this.storagePath = config.storagePath || path.join(process.cwd(), '.vue-security-data');
    this.ensureStorageDirectory();
  }

  ensureStorageDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async saveScanResult(scanId, result) {
    const filePath = path.join(this.storagePath, `${scanId}.json`);
    const data = {
      scanId,
      ...result,
      savedAt: new Date().toISOString()
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Scan result saved: ${filePath}`);

    await this.updateIndex(scanId, result);
    return filePath;
  }

  async updateIndex(scanId, result) {
    const indexPath = path.join(this.storagePath, 'index.json');
    let index = [];

    if (fs.existsSync(indexPath)) {
      index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }

    const indexEntry = {
      scanId,
      scannedAt: result.scannedAt,
      summary: result.summary,
      projectPath: result.projectPath,
      workers: result.workers
    };

    index.push(indexEntry);

    index.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));

    const maxIndexSize = this.config.maxIndexSize || 1000;
    if (index.length > maxIndexSize) {
      index = index.slice(0, maxIndexSize);
    }

    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }

  async getScanResult(scanId) {
    const filePath = path.join(this.storagePath, `${scanId}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Scan result not found: ${scanId}`);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  async getAllScanResults(limit = 100, offset = 0) {
    const indexPath = path.join(this.storagePath, 'index.json');

    if (!fs.existsSync(indexPath)) {
      return [];
    }

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return index.slice(offset, offset + limit);
  }

  async getScanResultsByDateRange(startDate, endDate) {
    const index = await this.getAllScanResults(10000);

    return index.filter(entry => {
      const scannedAt = new Date(entry.scannedAt);
      return scannedAt >= new Date(startDate) && scannedAt <= new Date(endDate);
    });
  }

  async getScanResultsByProject(projectPath) {
    const index = await this.getAllScanResults(10000);

    return index.filter(entry => {
      return entry.projectPath === projectPath;
    });
  }

  async getTrendAnalysis(days = 30) {
    const index = await this.getAllScanResults(10000);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentScans = index.filter(entry => {
      return new Date(entry.scannedAt) >= cutoffDate;
    });

    const trend = recentScans.map(entry => ({
      date: entry.scannedAt.split('T')[0],
      totalVulnerabilities: entry.summary.totalVulnerabilities,
      highSeverity: entry.summary.highSeverity,
      mediumSeverity: entry.summary.mediumSeverity,
      lowSeverity: entry.summary.lowSeverity
    }));

    const aggregated = {};

    trend.forEach(entry => {
      if (!aggregated[entry.date]) {
        aggregated[entry.date] = {
          date: entry.date,
          totalVulnerabilities: 0,
          highSeverity: 0,
          mediumSeverity: 0,
          lowSeverity: 0,
          scans: 0
        };
      }

      aggregated[entry.date].totalVulnerabilities += entry.totalVulnerabilities;
      aggregated[entry.date].highSeverity += entry.highSeverity;
      aggregated[entry.date].mediumSeverity += entry.mediumSeverity;
      aggregated[entry.date].lowSeverity += entry.lowSeverity;
      aggregated[entry.date].scans++;
    });

    return Object.values(aggregated).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getVulnerabilityStatistics() {
    const index = await this.getAllScanResults(10000);

    const stats = {
      totalScans: index.length,
      totalVulnerabilities: 0,
      totalHighSeverity: 0,
      totalMediumSeverity: 0,
      totalLowSeverity: 0,
      avgVulnerabilitiesPerScan: 0,
      mostVulnerableProjects: [],
      vulnerabilityTrend: []
    };

    index.forEach(entry => {
      stats.totalVulnerabilities += entry.summary.totalVulnerabilities;
      stats.totalHighSeverity += entry.summary.highSeverity;
      stats.totalMediumSeverity += entry.summary.mediumSeverity;
      stats.totalLowSeverity += entry.summary.lowSeverity;
    });

    if (stats.totalScans > 0) {
      stats.avgVulnerabilitiesPerScan = (stats.totalVulnerabilities / stats.totalScans).toFixed(2);
    }

    const projectVulns = {};
    index.forEach(entry => {
      const projectPath = entry.projectPath || 'unknown';
      if (!projectVulns[projectPath]) {
        projectVulns[projectPath] = 0;
      }
      projectVulns[projectPath] += entry.summary.totalVulnerabilities;
    });

    stats.mostVulnerableProjects = Object.entries(projectVulns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([projectPath, count]) => ({ projectPath, count }));

    stats.vulnerabilityTrend = await this.getTrendAnalysis(30);

    return stats;
  }

  async deleteScanResult(scanId) {
    const filePath = path.join(this.storagePath, `${scanId}.json`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Scan result deleted: ${scanId}`);
    } else {
      console.log(`Scan result file not found: ${scanId}, but removing from index`);
    }

    await this.removeFromIndex(scanId);
  }

  async removeFromIndex(scanId) {
    const indexPath = path.join(this.storagePath, 'index.json');

    if (!fs.existsSync(indexPath)) {
      return;
    }

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const filteredIndex = index.filter(entry => entry.scanId !== scanId);

    fs.writeFileSync(indexPath, JSON.stringify(filteredIndex, null, 2));
  }

  async cleanupOldResults(daysToKeep = 90) {
    const index = await this.getAllScanResults(10000);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldScans = index.filter(entry => {
      return new Date(entry.scannedAt) < cutoffDate;
    });

    console.log(`Found ${oldScans.length} old scan results to clean up`);

    for (const scan of oldScans) {
      try {
        await this.deleteScanResult(scan.scanId);
      } catch (error) {
        console.error(`Error deleting scan ${scan.scanId}:`, error.message);
      }
    }

    return oldScans.length;
  }
}

module.exports = ResultAggregator;
