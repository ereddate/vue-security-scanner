const fs = require('fs');
const path = require('path');
// Try to load from main project first, fallback to peer dependency
let SecurityScanner, IgnoreManager;

try {
  // Attempt to load from main project structure
  const scannerModule = require('../src/scanner');
  SecurityScanner = scannerModule.SecurityScanner || require('../src/scanner').default || require('../src/scanner');
  IgnoreManager = require('../src/utils/ignore-manager');
} catch (e) {
  // Fallback to attempting to load from vue-security-scanner package
  try {
    const scannerModule = require('vue-security-scanner/src/scanner');
    SecurityScanner = scannerModule.SecurityScanner || require('vue-security-scanner/src/scanner').default || require('vue-security-scanner/src/scanner');
    IgnoreManager = require('vue-security-scanner/src/utils/ignore-manager');
  } catch (e2) {
    console.error('Warning: Could not load Vue Security Scanner core modules.');
    console.error('Please ensure vue-security-scanner is installed as a dependency or peer dependency.');
    throw e2;
  }
}

class VueSecurityWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      enabled: true,
      failOnError: false,
      reportLevel: 'warning', // 'error', 'warning', or 'info'
      outputFile: null,
      ...options
    };
    
    this.scanner = null;
    this.ignoreManager = null;
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }

    // 初始化扫描器
    const scannerConfig = {
      rules: this.options.rules || {},
      scan: {
        ignoreDirs: this.options.ignoreDirs || [],
        ignorePatterns: this.options.ignorePatterns || [],
        maxSize: this.options.maxSize || 10,
        maxDepth: this.options.maxDepth || 10
      },
      output: {
        showProgress: false, // 构建时不显示进度条
        format: 'json'
      },
      plugins: {
        enabled: true,
        directory: this.options.pluginsDir || path.join(__dirname, '../plugins'),
        settings: this.options.pluginSettings || {}
      }
    };

    this.scanner = new SecurityScanner(scannerConfig);
    this.ignoreManager = new IgnoreManager(process.cwd());

    // 在编译开始时加载插件
    compiler.hooks.initialize.tap('VueSecurityWebpackPlugin', () => {
      let pluginManager;

try {
  // Attempt to load from main project structure
  pluginManager = require('../src/plugin-system/plugin-manager');
} catch (e) {
  // Fallback to attempting to load from vue-security-scanner package
  try {
    pluginManager = require('vue-security-scanner/src/plugin-system/plugin-manager');
  } catch (e2) {
    console.error('Warning: Could not load Vue Security Scanner plugin manager.');
    console.error('Please ensure vue-security-scanner is installed as a dependency or peer dependency.');
    throw e2;
  }
}
      pluginManager.loadPluginsFromDirectory(scannerConfig.plugins.directory)
        .catch(error => {
          console.warn('Could not load security plugins:', error.message);
        });
    });

    // 在模块构建完成后进行安全扫描
    compiler.hooks.normalModuleFactory.tap('VueSecurityWebpackPlugin', (nmf) => {
      nmf.hooks.afterResolve.tapAsync('VueSecurityWebpackPlugin', (data, callback) => {
        const resource = data.resource;
        
        if (resource && this.shouldScanFile(resource)) {
          fs.readFile(resource, 'utf-8', (err, content) => {
            if (err) {
              console.warn(`Failed to read file for security scan: ${resource}`, err.message);
              return callback(null, data);
            }

            this.performSecurityScan(resource, content, compiler)
              .then(() => callback(null, data))
              .catch(error => {
                console.warn(`Security scan error for ${resource}:`, error.message);
                callback(null, data);
              });
          });
        } else {
          callback(null, data);
        }
      });
    });

    // 在编译结束后生成最终报告
    compiler.hooks.done.tapAsync('VueSecurityWebpackPlugin', async (stats, callback) => {
      if (this.options.outputFile) {
        await this.writeSecurityReport(this.options.outputFile, stats);
      }
      callback();
    });
  }

  shouldScanFile(filePath) {
    // 检查是否应该扫描此文件
    if (this.ignoreManager && this.ignoreManager.shouldIgnoreFile(filePath)) {
      return false;
    }

    // 只扫描 Vue、JS、TS、JSX、TSX 文件
    const supportedExtensions = ['.vue', '.js', '.ts', '.jsx', '.tsx'];
    return supportedExtensions.some(ext => filePath.endsWith(ext));
  }

  async performSecurityScan(filePath, content, compiler) {
    try {
      const result = await this.scanner.scanFile(filePath, content);
      const vulnerabilities = result.vulnerabilities || [];

      if (vulnerabilities.length > 0) {
        vulnerabilities.forEach(vuln => {
          let message = `[VUE-SECURITY] ${vuln.type} - ${vuln.severity} SEVERITY\n`;
          message += `File: ${vuln.file}\n`;
          if (vuln.line !== 'N/A') {
            message += `Line: ${vuln.line}\n`;
          }
          message += `Description: ${vuln.description}\n`;
          message += `Recommendation: ${vuln.recommendation}\n`;
          if (vuln.plugin) {
            message += `Plugin: ${vuln.plugin}\n`;
          }

          // 根据报告级别记录
          if (this.options.reportLevel === 'error' || 
              (this.options.reportLevel === 'warning' && vuln.severity !== 'Low')) {
            compiler.getInfrastructureLogger('VueSecurityWebpackPlugin').error(message);
          } else {
            compiler.getInfrastructureLogger('VueSecurityWebpackPlugin').warn(message);
          }
        });

        // 如果配置了在出错时失败，则抛出错误
        if (this.options.failOnError) {
          const highSeverityVulns = vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical');
          if (highSeverityVulns.length > 0) {
            throw new Error(`Build failed due to ${highSeverityVulns.length} high severity security vulnerabilities.`);
          }
        }
      }
    } catch (error) {
      console.warn(`Security scan error for ${filePath}:`, error.message);
    }
  }

  async writeSecurityReport(outputFile, stats) {
    // 这里可以实现将扫描结果写入文件的功能
    // 为了简洁起见，这里只记录一个简单的统计
    const report = {
      timestamp: new Date().toISOString(),
      webpackStats: {
        startTime: stats.startTime,
        endTime: stats.endTime,
        hash: stats.hash,
        assets: Object.keys(stats.compilation.assets).length,
        chunks: stats.chunks.length
      }
    };

    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`Webpack security report written to ${outputFile}`);
  }
}

module.exports = VueSecurityWebpackPlugin;