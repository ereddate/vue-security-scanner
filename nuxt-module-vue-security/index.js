const fs = require('fs');
const path = require('path');
const { SecurityScanner } = require('../src/scanner');
const IgnoreManager = require('../src/utils/ignore-manager');

// Nuxt.js 模块定义
module.exports = function VueSecurityNuxtModule(moduleOptions) {
  const options = {
    enabled: true,
    failOnError: false,
    reportLevel: 'warning',
    outputFile: null,
    ...this.options.vueSecurity,
    ...moduleOptions
  };

  if (!options.enabled) {
    return;
  }

  // 初始化扫描器
  const scannerConfig = {
    rules: options.rules || {},
    scan: {
      ignoreDirs: options.ignoreDirs || [],
      ignorePatterns: options.ignorePatterns || [],
      maxSize: options.maxSize || 10,
      maxDepth: options.maxDepth || 10
    },
    output: {
      showProgress: false, // 构建时不显示进度条
      format: 'json'
    },
    plugins: {
      enabled: true,
      directory: options.pluginsDir || path.join(__dirname, '../plugins'),
      settings: options.pluginSettings || {}
    }
  };

  const scanner = new SecurityScanner(scannerConfig);
  const ignoreManager = new IgnoreManager(this.options.srcDir || process.cwd());

  // 加载插件
  const pluginManager = require('../src/plugin-system/plugin-manager');
  pluginManager.loadPluginsFromDirectory(scannerConfig.plugins.directory)
    .catch(error => {
      console.warn('Could not load security plugins:', error.message);
    });

  // 在 Nuxt 构建过程中注册钩子
  this.nuxt.hook('build:before', async (builder) => {
    console.log('Vue Security Nuxt Module: Starting security scan...');
  });

  // 扫描页面文件
  this.nuxt.hook('builder:extendRoutes', (routes) => {
    // 对路由进行安全扫描
    routes.forEach(route => {
      if (route.component) {
        const componentPath = route.component;
        if (shouldScanFile(componentPath, ignoreManager)) {
          scanFile(componentPath, scanner, options);
        }
      }
    });
  });

  // 扫描组件
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.forEach(dir => {
      scanDirectory(dir.path, scanner, options, ignoreManager);
    });
  });

  // 扫描布局文件
  this.nuxt.hook('generate:page', async (page) => {
    if (shouldScanFile(page.route, ignoreManager)) {
      // 扫描生成的页面
      try {
        const content = await fs.promises.readFile(page.dst, 'utf-8');
        await performSecurityScan(page.dst, content, scanner, options, this.nuxt);
      } catch (error) {
        console.warn(`Could not scan generated page: ${page.dst}`, error.message);
      }
    }
  });

  // 扫描中间件
  this.nuxt.hook('modules:before', async (moduleContainer) => {
    const middlewareDir = path.join(this.options.srcDir, 'middleware');
    if (fs.existsSync(middlewareDir)) {
      await scanDirectory(middlewareDir, scanner, options, ignoreManager);
    }
  });

  // 扫描插件
  this.nuxt.hook('build:compile', async ({ name, compilers }) => {
    if (name === 'client' || name === 'server') {
      // 在编译期间扫描相关文件
      const pluginsDir = path.join(this.options.srcDir, 'plugins');
      if (fs.existsSync(pluginsDir)) {
        await scanDirectory(pluginsDir, scanner, options, ignoreManager);
      }
    }
  });
};

// 辅助函数：判断是否应扫描文件
function shouldScanFile(filePath, ignoreManager) {
  if (ignoreManager && ignoreManager.shouldIgnoreFile(filePath)) {
    return false;
  }

  // 只扫描 Vue、JS、TS 文件
  const supportedExtensions = ['.vue', '.js', '.ts'];
  return supportedExtensions.some(ext => filePath.endsWith(ext));
}

// 辅助函数：扫描单个文件
async function scanFile(filePath, scanner, options) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    await performSecurityScan(filePath, content, scanner, options);
  } catch (error) {
    console.warn(`Could not scan file: ${filePath}`, error.message);
  }
}

// 辅助函数：扫描目录
async function scanDirectory(dirPath, scanner, options, ignoreManager) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = await fs.promises.readdir(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      await scanDirectory(fullPath, scanner, options, ignoreManager); // 递归扫描子目录
    } else if (shouldScanFile(fullPath, ignoreManager)) {
      await scanFile(fullPath, scanner, options);
    }
  }
}

// 辅助函数：执行安全扫描
async function performSecurityScan(filePath, content, scanner, options, nuxtInstance = null) {
  try {
    const result = await scanner.scanFile(filePath, content);
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
        if (options.reportLevel === 'error' || 
            (options.reportLevel === 'warning' && vuln.severity !== 'Low')) {
          if (nuxtInstance) {
            nuxtInstance.callHook('vue-security:error', message);
          }
          console.error(message);
        } else {
          if (nuxtInstance) {
            nuxtInstance.callHook('vue-security:warning', message);
          }
          console.warn(message);
        }
      });

      // 如果配置了在出错时失败，则抛出错误
      if (options.failOnError) {
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

// 模块元数据
module.exports.meta = require('./package.json');