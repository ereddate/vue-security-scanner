const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { ErrorHandler } = require('../utils/error-handler');

class ASTAnalyzer {
  constructor(config = {}) {
    this.config = config;
    this.enableSemanticAnalysis = config.enableSemanticAnalysis !== false;
    this.cache = new Map();
    this.parseCache = new Map();
    this.traverseCache = new Map();
    this.cacheMetadata = new Map();
    this.performanceStats = {
      parseTime: 0,
      traverseTime: 0,
      analyzeTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheEvictions: 0,
      cacheSize: 0
    };
    this.cacheConfig = {
      maxAge: config.cache?.maxAge || 3600000, // 默认1小时
      maxSize: config.cache?.maxSize || 1000, // 默认1000个缓存项
      cleanupInterval: config.cache?.cleanupInterval || 60000, // 默认1分钟
      enableFileTimeCheck: config.cache?.enableFileTimeCheck !== false,
      persistence: {
        enabled: config.cache?.persistence?.enabled !== false,
        filePath: config.cache?.persistence?.filePath || '.vue-security-scanner-cache.json',
        saveInterval: config.cache?.persistence?.saveInterval || 300000, // 默认5分钟
        maxFileSize: config.cache?.persistence?.maxFileSize || 10485760 // 默认10MB
      }
    };
    this.startCacheCleanup();
    this.startCachePersistence();
    this.loadPersistedCache();
  }

  /**
   * 开始缓存清理定时器
   */
  startCacheCleanup() {
    setInterval(() => {
      this.cleanupExpiredCache();
    }, this.cacheConfig.cleanupInterval);
  }

  /**
   * 开始缓存持久化定时器
   */
  startCachePersistence() {
    if (this.cacheConfig.persistence.enabled) {
      setInterval(() => {
        this.saveCacheToDisk();
      }, this.cacheConfig.persistence.saveInterval);
    }
  }

  /**
   * 将缓存保存到磁盘
   */
  saveCacheToDisk() {
    if (!this.cacheConfig.persistence.enabled) {
      return;
    }

    try {
      const fs = require('fs');
      const path = require('path');
      
      // 准备要持久化的缓存数据
      const cacheData = {
        version: '1.0',
        timestamp: Date.now(),
        cache: Array.from(this.cache.entries()),
        parseCache: Array.from(this.parseCache.entries()),
        traverseCache: Array.from(this.traverseCache.entries()),
        cacheMetadata: Array.from(this.cacheMetadata.entries()),
        performanceStats: this.performanceStats
      };

      // 序列化缓存数据
      const cacheJson = JSON.stringify(cacheData, null, 2);
      
      // 检查文件大小
      if (Buffer.byteLength(cacheJson) > this.cacheConfig.persistence.maxFileSize) {
        console.warn('Cache file size exceeds limit, skipping persistence');
        return;
      }

      // 确保目录存在
      const cacheFilePath = path.resolve(this.cacheConfig.persistence.filePath);
      const cacheDir = path.dirname(cacheFilePath);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // 写入缓存文件
      fs.writeFileSync(cacheFilePath, cacheJson);
      console.log(`Cache persisted to ${cacheFilePath}`);
    } catch (error) {
      console.warn('Error saving cache to disk:', error.message);
    }
  }

  /**
   * 从磁盘加载缓存
   */
  loadPersistedCache() {
    if (!this.cacheConfig.persistence.enabled) {
      return;
    }

    try {
      const fs = require('fs');
      const path = require('path');
      
      const cacheFilePath = path.resolve(this.cacheConfig.persistence.filePath);
      
      if (!fs.existsSync(cacheFilePath)) {
        return;
      }

      // 读取缓存文件
      const cacheJson = fs.readFileSync(cacheFilePath, 'utf8');
      const cacheData = JSON.parse(cacheJson);

      // 验证缓存数据
      if (!this.validateCacheFile(cacheData)) {
        console.warn('Invalid cache file, skipping load');
        return;
      }

      // 恢复缓存
      if (cacheData.cache) {
        this.cache = new Map(cacheData.cache);
      }
      if (cacheData.parseCache) {
        this.parseCache = new Map(cacheData.parseCache);
      }
      if (cacheData.traverseCache) {
        this.traverseCache = new Map(cacheData.traverseCache);
      }
      if (cacheData.cacheMetadata) {
        this.cacheMetadata = new Map(cacheData.cacheMetadata);
      }
      if (cacheData.performanceStats) {
        this.performanceStats = { ...this.performanceStats, ...cacheData.performanceStats };
      }

      this.updateCacheSize();
      console.log(`Cache loaded from ${cacheFilePath}`);
    } catch (error) {
      console.warn('Error loading cache from disk:', error.message);
    }
  }

  /**
   * 验证缓存文件是否有效
   * @param {Object} cacheData - 缓存数据
   * @returns {boolean} 缓存文件是否有效
   */
  validateCacheFile(cacheData) {
    if (!cacheData || !cacheData.version || !cacheData.timestamp) {
      return false;
    }

    // 检查缓存是否过期
    const now = Date.now();
    if (now - cacheData.timestamp > this.cacheConfig.maxAge) {
      return false;
    }

    return true;
  }

  /**
   * 清理过期缓存
   */
  cleanupExpiredCache() {
    const now = Date.now();
    const caches = [this.cache, this.parseCache, this.traverseCache];
    
    caches.forEach(cache => {
      const keysToDelete = [];
      for (const [key, metadata] of this.cacheMetadata.entries()) {
        if (metadata.timestamp && (now - metadata.timestamp) > this.cacheConfig.maxAge) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => {
        this.removeCacheEntry(key);
      });
    });
  }

  /**
   * 移除缓存项
   * @param {string} key - 缓存键
   */
  removeCacheEntry(key) {
    this.cache.delete(key);
    this.parseCache.delete(key);
    this.traverseCache.delete(key);
    this.cacheMetadata.delete(key);
    this.performanceStats.cacheEvictions++;
    this.updateCacheSize();
  }

  /**
   * 更新缓存大小统计
   */
  updateCacheSize() {
    this.performanceStats.cacheSize = this.cache.size + this.parseCache.size + this.traverseCache.size;
  }

  /**
   * 生成更有效的缓存键
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {string} 缓存键
   */
  generateCacheKey(filePath, content) {
    const contentHash = this.generateContentHash(content);
    const fileTime = this.getFileModificationTime(filePath);
    return `${filePath}:${fileTime}:${contentHash}`;
  }

  /**
   * 生成内容哈希
   * @param {string} content - 内容
   * @returns {string} 哈希值
   */
  generateContentHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * 获取文件修改时间
   * @param {string} filePath - 文件路径
   * @returns {number} 修改时间戳
   */
  getFileModificationTime(filePath) {
    try {
      const fs = require('fs');
      const stats = fs.statSync(filePath);
      return stats.mtimeMs;
    } catch (error) {
      return Date.now();
    }
  }

  /**
   * 检查缓存是否有效
   * @param {string} key - 缓存键
   * @param {string} filePath - 文件路径
   * @returns {boolean} 缓存是否有效
   */
  isCacheValid(key, filePath) {
    // 检查缓存是否存在
    if (!this.cacheMetadata.has(key)) {
      return false;
    }

    const metadata = this.cacheMetadata.get(key);
    const now = Date.now();

    // 检查缓存是否过期
    if (metadata.timestamp && (now - metadata.timestamp) > this.cacheConfig.maxAge) {
      return false;
    }

    // 检查文件是否被修改
    if (this.cacheConfig.enableFileTimeCheck) {
      const currentFileTime = this.getFileModificationTime(filePath);
      if (metadata.fileTime && metadata.fileTime !== currentFileTime) {
        return false;
      }
    }

    return true;
  }

  analyze(filePath, content) {
    if (!this.enableSemanticAnalysis) {
      return [];
    }

    try {
      const startTime = Date.now();
      
      // Check cache first
      const cacheKey = this.generateCacheKey(filePath, content);
      if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey, filePath)) {
        this.performanceStats.cacheHits++;
        return this.cache.get(cacheKey);
      }
      
      this.performanceStats.cacheMisses++;
      
      const ast = this.parseCode(content, filePath);
      if (!ast) {
        return [];
      }

      const vulnerabilities = [];
      
      // Optimized traversal with context
      const traverseContext = {
        filePath,
        vulnerabilities,
        analyzedNodes: new Set(),
        userInputTracked: new Map(),
        currentScope: null
      };

      // Optimized traverse with selective visitors
      const visitors = this.getOptimizedVisitors(traverseContext);
      
      const traverseStart = Date.now();
      traverse(ast, visitors);
      this.performanceStats.traverseTime += Date.now() - traverseStart;

      // Cache results with metadata
      this.cache.set(cacheKey, vulnerabilities);
      this.cacheMetadata.set(cacheKey, {
        timestamp: Date.now(),
        fileTime: this.getFileModificationTime(filePath),
        size: vulnerabilities.length,
        type: 'analysis'
      });
      
      // Limit cache size
      this.enforceCacheSizeLimit();
      
      this.updateCacheSize();
      this.performanceStats.analyzeTime += Date.now() - startTime;

      return vulnerabilities;
    } catch (error) {
      ErrorHandler.handleFileError(filePath, error);
      return [];
    }
  }

  /**
   * 强制缓存大小限制
   */
  enforceCacheSizeLimit() {
    const totalCacheSize = this.cache.size + this.parseCache.size + this.traverseCache.size;
    if (totalCacheSize > this.cacheConfig.maxSize) {
      // 按时间戳排序，删除最旧的缓存
      const sortedEntries = Array.from(this.cacheMetadata.entries())
        .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));
      
      const entriesToDelete = sortedEntries.slice(0, totalCacheSize - this.cacheConfig.maxSize);
      entriesToDelete.forEach(([key]) => {
        this.removeCacheEntry(key);
      });
    }
  }

  parseCode(content, filePath) {
    const parseStart = Date.now();
    
    // Check parse cache
    const parseCacheKey = this.generateCacheKey(`${filePath}:parse`, content);
    if (this.parseCache.has(parseCacheKey) && this.isCacheValid(parseCacheKey, filePath)) {
      this.performanceStats.cacheHits++;
      this.performanceStats.parseTime += Date.now() - parseStart;
      return this.parseCache.get(parseCacheKey);
    }

    const ext = filePath.split('.').pop().toLowerCase();
    
    // Optimized plugin selection based on file type
    const plugins = this.getOptimizedPlugins(ext);

    try {
      // Try module first
      const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: plugins,
        ranges: false, // Disable ranges for better performance
        tokens: false, // Disable tokens for better performance
        errorRecovery: true // Enable error recovery
      });
      
      // Cache successful parse
      this.parseCache.set(parseCacheKey, ast);
      this.cacheMetadata.set(parseCacheKey, {
        timestamp: Date.now(),
        fileTime: this.getFileModificationTime(filePath),
        size: 1,
        type: 'parse'
      });
      
      // Limit cache size
      this.enforceCacheSizeLimit();
      
      this.performanceStats.parseTime += Date.now() - parseStart;
      return ast;
    } catch (moduleError) {
      try {
        // Try script as fallback
        const ast = parser.parse(content, {
          sourceType: 'script',
          plugins: plugins,
          ranges: false,
          tokens: false,
          errorRecovery: true
        });
        
        // Cache successful parse
        this.parseCache.set(parseCacheKey, ast);
        this.cacheMetadata.set(parseCacheKey, {
          timestamp: Date.now(),
          fileTime: this.getFileModificationTime(filePath),
          size: 1,
          type: 'parse'
        });
        
        this.performanceStats.parseTime += Date.now() - parseStart;
        return ast;
      } catch (scriptError) {
        this.performanceStats.parseTime += Date.now() - parseStart;
        return null;
      }
    }
  }

  // Get optimized plugins based on file type
  getOptimizedPlugins(ext) {
    const basePlugins = [
      'jsx',
      'classProperties',
      'objectRestSpread',
      'functionBind',
      'dynamicImport',
      'nullishCoalescingOperator',
      'optionalChaining',
      'optionalCatchBinding',
      'topLevelAwait',
      'importMeta'
    ];

    // Add TypeScript for .ts and .tsx files
    if (ext === 'ts' || ext === 'tsx') {
      basePlugins.push('typescript');
    }

    // Add Vue-specific plugins if needed
    if (ext === 'vue') {
      basePlugins.push('vue');
    }

    return basePlugins;
  }

  // Get optimized visitors with context
  getOptimizedVisitors(context) {
    const visitors = {
      Program: (path) => {
        context.currentScope = path.scope;
      },
      CallExpression: (path) => {
        if (!context.analyzedNodes.has(path.node)) {
          context.analyzedNodes.add(path.node);
          this.analyzeCallExpression(path, context);
        }
      },
      MemberExpression: (path) => {
        if (!context.analyzedNodes.has(path.node)) {
          context.analyzedNodes.add(path.node);
          this.analyzeMemberExpression(path, context);
        }
      },
      JSXElement: (path) => {
        if (!context.analyzedNodes.has(path.node)) {
          context.analyzedNodes.add(path.node);
          this.analyzeJSXElement(path, context);
        }
      },
      AssignmentExpression: (path) => {
        if (!context.analyzedNodes.has(path.node)) {
          context.analyzedNodes.add(path.node);
          this.analyzeAssignmentExpression(path, context);
        }
      },
      VariableDeclarator: (path) => {
        if (!context.analyzedNodes.has(path.node)) {
          context.analyzedNodes.add(path.node);
          this.analyzeVariableDeclarator(path, context);
        }
      },
      ObjectProperty: (path) => {
        if (!context.analyzedNodes.has(path.node)) {
          context.analyzedNodes.add(path.node);
          this.analyzeObjectProperty(path, context);
        }
      },
      // Track user input flow
      Identifier: (path) => {
        this.trackUserInputFlow(path, context);
      }
    };

    return visitors;
  }

  analyzeCallExpression(path, context) {
    const callee = path.node.callee;
    
    if (!callee) return;

    const calleeName = this.getCalleeName(callee);

    if (this.isDangerousFunction(calleeName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const args = path.node.arguments;
      const hasUserInput = this.checkForUserInput(args, path, context);

      context.vulnerabilities.push({
        ruleId: `semantic-${calleeName}`,
        name: `Dangerous function call: ${calleeName}`,
        severity: hasUserInput ? 'High' : 'Medium',
        description: `Calling ${calleeName} with potentially unsafe data`,
        recommendation: `Avoid using ${calleeName} with user-provided data. Consider using safer alternatives.`,
        file: context.filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: calleeName,
        confidence: hasUserInput ? 'High' : 'Medium'
      });
    }

    if (this.isVulnerableAPI(calleeName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      context.vulnerabilities.push({
        ruleId: `semantic-api-${calleeName}`,
        name: `Potentially vulnerable API: ${calleeName}`,
        severity: 'Medium',
        description: `Using ${calleeName} which may have security implications`,
        recommendation: `Review the usage of ${calleeName} and ensure proper security measures are in place.`,
        file: context.filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: calleeName,
        confidence: 'Medium'
      });
    }
  }

  analyzeMemberExpression(path, context) {
    const object = path.node.object;
    const property = path.node.property;

    if (!object || !property) return;

    const objName = this.getNodeName(object);
    const propName = this.getNodeName(property);

    if (this.isDangerousPropertyAccess(objName, propName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      context.vulnerabilities.push({
        ruleId: `semantic-property-${propName}`,
        name: `Dangerous property access: ${objName}.${propName}`,
        severity: 'High',
        description: `Accessing ${propName} property which may lead to security issues`,
        recommendation: `Avoid accessing ${propName} directly. Use safer alternatives or validate input.`,
        file: context.filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: `${objName}.${propName}`,
        confidence: 'High'
      });
    }
  }

  analyzeJSXElement(path, context) {
    const openingElement = path.node.openingElement;
    
    if (!openingElement) return;

    const tagName = this.getJSXTagName(openingElement.name);

    if (this.isDangerousJSXElement(tagName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const dangerousProps = this.findDangerousJSXProps(openingElement.attributes);
      
      if (dangerousProps.length > 0) {
        context.vulnerabilities.push({
          ruleId: `semantic-jsx-${tagName}`,
          name: `Dangerous JSX element: ${tagName}`,
          severity: 'High',
          description: `Using ${tagName} with potentially dangerous props: ${dangerousProps.join(', ')}`,
          recommendation: `Avoid using ${tagName} with user-provided data. Sanitize input before rendering.`,
          file: context.filePath,
          line: line,
          column: column,
          code: this.getCodeSnippet(path),
          evidence: dangerousProps.join(', '),
          confidence: 'High'
        });
      }
    }
  }

  analyzeAssignmentExpression(path, context) {
    const left = path.node.left;
    const right = path.node.right;

    if (!left || !right) return;

    const leftName = this.getNodeName(left);

    if (this.isDangerousAssignment(leftName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const hasUserInput = this.checkForUserInput([right], path, context);

      context.vulnerabilities.push({
        ruleId: `semantic-assignment-${leftName}`,
        name: `Dangerous assignment: ${leftName}`,
        severity: hasUserInput ? 'High' : 'Medium',
        description: `Assigning to ${leftName} which may have security implications`,
        recommendation: `Validate and sanitize data before assigning to ${leftName}`,
        file: context.filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: leftName,
        confidence: hasUserInput ? 'High' : 'Medium'
      });
    }
  }

  analyzeVariableDeclarator(path, context) {
    const id = path.node.id;
    const init = path.node.init;

    if (!id || !init) return;

    const varName = this.getNodeName(id);

    if (this.isSensitiveVariableName(varName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const hasHardcodedValue = this.checkForHardcodedValue(init);

      if (hasHardcodedValue) {
        context.vulnerabilities.push({
          ruleId: 'semantic-hardcoded-secret',
          name: `Potentially hardcoded secret: ${varName}`,
          severity: 'High',
          description: `Variable ${varName} appears to contain a hardcoded secret`,
          recommendation: `Move sensitive data to environment variables or a secure vault`,
          file: context.filePath,
          line: line,
          column: column,
          code: this.getCodeSnippet(path),
          evidence: varName,
          confidence: 'High'
        });
      }
    }
  }

  analyzeObjectProperty(path, context) {
    const key = path.node.key;
    const value = path.node.value;

    if (!key || !value) return;

    const keyName = this.getNodeName(key);

    if (this.isSensitiveProperty(keyName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const hasHardcodedValue = this.checkForHardcodedValue(value);

      if (hasHardcodedValue) {
        context.vulnerabilities.push({
          ruleId: 'semantic-hardcoded-config',
          name: `Potentially hardcoded configuration: ${keyName}`,
          severity: 'High',
          description: `Property ${keyName} appears to contain a hardcoded value`,
          recommendation: `Move sensitive configuration to environment variables`,
          file: context.filePath,
          line: line,
          column: column,
          code: this.getCodeSnippet(path),
          evidence: keyName,
          confidence: 'High'
        });
      }
    }
  }

  // Track user input flow through the code
  trackUserInputFlow(path, context) {
    const node = path.node;
    if (node.type === 'Identifier') {
      const name = node.name;
      const userInputPatterns = [
        /input/i,
        /user/i,
        /data/i,
        /params/i,
        /query/i,
        /body/i,
        /req/i,
        /request/i,
        /form/i
      ];

      if (userInputPatterns.some(pattern => pattern.test(name))) {
        context.userInputTracked.set(name, true);
      }
    }
  }

  getCalleeName(callee) {
    if (callee.type === 'Identifier') {
      return callee.name;
    } else if (callee.type === 'MemberExpression') {
      const obj = this.getNodeName(callee.object);
      const prop = this.getNodeName(callee.property);
      return `${obj}.${prop}`;
    }
    return '';
  }

  getNodeName(node) {
    if (!node) return '';
    
    if (node.type === 'Identifier') {
      return node.name;
    } else if (node.type === 'MemberExpression') {
      const obj = this.getNodeName(node.object);
      const prop = this.getNodeName(node.property);
      return `${obj}.${prop}`;
    } else if (node.type === 'StringLiteral') {
      return node.value;
    } else if (node.type === 'NumericLiteral') {
      return String(node.value);
    }
    
    return '';
  }

  getJSXTagName(name) {
    if (name.type === 'JSXIdentifier') {
      return name.name;
    } else if (name.type === 'JSXMemberExpression') {
      const obj = this.getJSXTagName(name.object);
      const prop = this.getJSXTagName(name.property);
      return `${obj}.${prop}`;
    }
    return '';
  }

  isDangerousFunction(name) {
    const dangerousFunctions = [
      'eval',
      'Function',
      'setTimeout',
      'setInterval',
      'exec',
      'spawn',
      'execSync',
      'require',
      'import',
      'innerHTML',
      'outerHTML',
      'insertAdjacentHTML',
      'document.write',
      'document.writeln'
    ];

    return dangerousFunctions.some(dangerous => name.includes(dangerous));
  }

  isVulnerableAPI(name) {
    const vulnerableAPIs = [
      'fetch',
      'XMLHttpRequest',
      'axios.get',
      'axios.post',
      'axios.put',
      'axios.delete',
      'http.get',
      'http.post',
      'http.request',
      'https.get',
      'https.post',
      'https.request',
      'mysql.query',
      'pg.query',
      'mongoose.find',
      'mongoose.findOne',
      'mongoose.deleteOne',
      'mongoose.deleteMany'
    ];

    return vulnerableAPIs.some(api => name.includes(api));
  }

  isDangerousPropertyAccess(objName, propName) {
    const dangerousProps = [
      'innerHTML',
      'outerHTML',
      'insertAdjacentHTML',
      'location',
      'document',
      'window',
      'eval',
      'execScript',
      '__proto__',
      'constructor',
      'prototype'
    ];

    return dangerousProps.includes(propName);
  }

  isDangerousJSXElement(tagName) {
    const dangerousElements = [
      'div',
      'span',
      'p',
      'a',
      'button',
      'form',
      'input',
      'textarea',
      'select',
      'iframe'
    ];

    return dangerousElements.includes(tagName);
  }

  findDangerousJSXProps(attributes) {
    const dangerousProps = [];
    const dangerousPropNames = [
      'dangerouslySetInnerHTML',
      'innerHTML',
      'href',
      'src',
      'onclick',
      'onload',
      'onerror'
    ];

    attributes.forEach(attr => {
      if (attr.type === 'JSXAttribute') {
        const propName = this.getJSXAttributeName(attr.name);
        if (dangerousPropNames.includes(propName)) {
          dangerousProps.push(propName);
        }
      }
    });

    return dangerousProps;
  }

  getJSXAttributeName(name) {
    if (name.type === 'JSXIdentifier') {
      return name.name;
    }
    return '';
  }

  isDangerousAssignment(varName) {
    const dangerousVars = [
      'innerHTML',
      'outerHTML',
      'location',
      'document.cookie',
      'window.location',
      'eval'
    ];

    return dangerousVars.some(dangerous => varName.includes(dangerous));
  }

  isSensitiveVariableName(varName) {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /api[_-]?key/i,
      /private[_-]?key/i,
      /auth[_-]?token/i,
      /access[_-]?token/i,
      /session[_-]?id/i,
      /jwt/i,
      /encryption[_-]?key/i
    ];

    return sensitivePatterns.some(pattern => pattern.test(varName));
  }

  isSensitiveProperty(propName) {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /api[_-]?key/i,
      /private[_-]?key/i,
      /auth/i,
      /session/i
    ];

    return sensitivePatterns.some(pattern => pattern.test(propName));
  }

  checkForUserInput(args, path, context) {
    if (!args || args.length === 0) return false;

    for (const arg of args) {
      if (this.isLikelyUserInput(arg, path, context)) {
        return true;
      }
    }

    return false;
  }

  isLikelyUserInput(node, path, context) {
    if (!node) return false;

    if (node.type === 'Identifier') {
      // Check if this identifier was tracked as user input
      if (context.userInputTracked.has(node.name)) {
        return true;
      }

      const userInputPatterns = [
        /input/i,
        /user/i,
        /data/i,
        /params/i,
        /query/i,
        /body/i,
        /req/i,
        /request/i,
        /form/i
      ];

      return userInputPatterns.some(pattern => pattern.test(node.name));
    }

    if (node.type === 'MemberExpression') {
      const objName = this.getNodeName(node.object);
      const prop = this.getNodeName(node.property);
      
      // Check if this member expression was tracked as user input
      if (context.userInputTracked.has(objName)) {
        return true;
      }
      
      return objName.includes('req') || objName.includes('request') || prop.includes('input');
    }

    return false;
  }

  checkForHardcodedValue(node) {
    if (!node) return false;

    if (node.type === 'StringLiteral') {
      return node.value.length > 5;
    }

    if (node.type === 'NumericLiteral') {
      return true;
    }

    if (node.type === 'TemplateLiteral') {
      return node.quasis.some(quasi => quasi.value.cooked.length > 5);
    }

    return false;
  }

  getCodeSnippet(path) {
    try {
      return path.toString();
    } catch (error) {
      return '';
    }
  }

  // Get performance statistics
  getPerformanceStats() {
    return this.performanceStats;
  }

  // Clear caches to free memory
  clearCaches() {
    this.cache.clear();
    this.parseCache.clear();
    this.traverseCache.clear();
    this.cacheMetadata.clear();
    this.updateCacheSize();
    
    // 如果启用了持久化，也清理持久化文件
    if (this.cacheConfig.persistence.enabled) {
      try {
        const fs = require('fs');
        const path = require('path');
        const cacheFilePath = path.resolve(this.cacheConfig.persistence.filePath);
        if (fs.existsSync(cacheFilePath)) {
          fs.unlinkSync(cacheFilePath);
          console.log(`Cache file cleared: ${cacheFilePath}`);
        }
      } catch (error) {
        console.warn('Error clearing cache file:', error.message);
      }
    }
  }

  // Reset performance statistics
  resetPerformanceStats() {
    this.performanceStats = {
      parseTime: 0,
      traverseTime: 0,
      analyzeTime: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }
}

module.exports = ASTAnalyzer;
