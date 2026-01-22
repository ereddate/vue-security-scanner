// src/plugin-system/plugin-manager.js
// 插件管理器
const fs = require('fs');
const path = require('path');

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map(); // 存储可挂载的钩子点
  }

  /**
   * 注册插件
   * @param {string} name - 插件名称
   * @param {Object} plugin - 插件对象
   */
  registerPlugin(name, plugin) {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin with name "${name}" already registered`);
    }

    // 验证插件接口
    if (!plugin.analyze || typeof plugin.analyze !== 'function') {
      throw new Error(`Plugin "${name}" must implement analyze() method`);
    }

    this.plugins.set(name, {
      name,
      instance: plugin,
      enabled: true,
      metadata: plugin.metadata || {}
    });

    console.log(`Plugin "${name}" registered successfully`);
  }

  /**
   * 启用插件
   * @param {string} name - 插件名称
   */
  enablePlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }
    plugin.enabled = true;
  }

  /**
   * 禁用插件
   * @param {string} name - 插件名称
   */
  disablePlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }
    plugin.enabled = false;
  }

  /**
   * 运行所有启用的插件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  async runPlugins(filePath, content) {
    const allVulnerabilities = [];

    for (const [name, pluginData] of this.plugins) {
      if (pluginData.enabled) {
        try {
          const vulnerabilities = await pluginData.instance.analyze(filePath, content);
          if (Array.isArray(vulnerabilities)) {
            allVulnerabilities.push(...vulnerabilities);
          }
        } catch (error) {
          console.error(`Error running plugin "${name}":`, error.message);
        }
      }
    }

    return allVulnerabilities;
  }

  /**
   * 获取所有插件信息
   * @returns {Array} - 插件信息数组
   */
  getPluginsInfo() {
    return Array.from(this.plugins.values()).map(plugin => ({
      name: plugin.name,
      enabled: plugin.enabled,
      metadata: plugin.metadata
    }));
  }

  /**
   * 获取启用的插件数量
   * @returns {number} - 启用的插件数量
   */
  getEnabledCount() {
    return Array.from(this.plugins.values()).filter(p => p.enabled).length;
  }
  
  /**
   * 自动加载插件目录下的所有插件
   */
  async loadPluginsFromDirectory(directoryPath = './plugins') {
    const absolutePath = path.resolve(process.cwd(), directoryPath);
    
    if (!fs.existsSync(absolutePath)) {
      console.log(`Plugin directory does not exist: ${absolutePath}`);
      return;
    }
    
    const files = fs.readdirSync(absolutePath);
    
    for (const file of files) {
      if (file.endsWith('.js') && !file.startsWith('_')) {
        const pluginPath = path.join(absolutePath, file);
        try {
          const pluginModule = require(pluginPath);
          
          // 生成插件名称（基于文件名）
          const pluginName = file.replace('.js', '').replace(/[^a-zA-Z0-9]/g, '-');
          
          // 注册插件
          this.registerPlugin(pluginName, pluginModule);
          
          console.log(`Auto-loaded plugin: ${pluginName} from ${file}`);
        } catch (error) {
          console.error(`Failed to load plugin from ${file}:`, error.message);
        }
      }
    }
  }
}

// 创建单例实例
const pluginManager = new PluginManager();

module.exports = pluginManager;