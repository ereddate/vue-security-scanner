const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TypeScriptChecker {
  constructor(config = {}) {
    this.config = config;
    this.enabled = config.enabled !== false;
    this.tsconfigPath = null;
    this.typeScriptAvailable = this.checkTypeScriptAvailable();
  }

  /**
   * 检查TypeScript是否可用
   * @returns {boolean} TypeScript是否可用
   */
  checkTypeScriptAvailable() {
    try {
      execSync('npx tsc --version', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 查找tsconfig.json文件
   * @param {string} projectPath - 项目路径
   * @returns {string|null} tsconfig.json路径
   */
  findTsconfig(projectPath) {
    const possiblePaths = [
      path.join(projectPath, 'tsconfig.json'),
      path.join(projectPath, 'tsconfig.base.json'),
      path.join(projectPath, 'tsconfig.app.json')
    ];

    for (const tsconfigPath of possiblePaths) {
      if (fs.existsSync(tsconfigPath)) {
        this.tsconfigPath = tsconfigPath;
        return tsconfigPath;
      }
    }

    return null;
  }

  /**
   * 检查项目是否使用了TypeScript
   * @param {string} projectPath - 项目路径
   * @returns {boolean} 是否使用了TypeScript
   */
  isTypeScriptProject(projectPath) {
    // 检查是否有tsconfig.json
    if (this.findTsconfig(projectPath)) {
      return true;
    }

    // 检查是否有.ts或.tsx文件
    const tsFiles = this.findTypeScriptFiles(projectPath);
    return tsFiles.length > 0;
  }

  /**
   * 查找项目中的TypeScript文件
   * @param {string} projectPath - 项目路径
   * @returns {Array<string>} TypeScript文件路径数组
   */
  findTypeScriptFiles(projectPath) {
    const tsFiles = [];
    const extensions = ['.ts', '.tsx'];

    function walk(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (file !== 'node_modules' && file !== 'dist' && file !== 'build') {
            walk(filePath);
          }
        } else if (extensions.includes(path.extname(filePath).toLowerCase())) {
          tsFiles.push(filePath);
        }
      }
    }

    try {
      walk(projectPath);
    } catch (error) {
      console.warn('Error finding TypeScript files:', error.message);
    }

    return tsFiles;
  }

  /**
   * 运行TypeScript类型检查
   * @param {string} projectPath - 项目路径
   * @returns {Array} 类型错误数组
   */
  runTypeCheck(projectPath) {
    if (!this.enabled) {
      return [];
    }

    if (!this.typeScriptAvailable) {
      console.warn('TypeScript is not available. Skipping type check.');
      return [];
    }

    if (!this.isTypeScriptProject(projectPath)) {
      return [];
    }

    try {
      console.log('Running TypeScript type check...');
      const startTime = Date.now();

      // 构建tsc命令
      let tscCommand = 'npx tsc --noEmit';
      if (this.tsconfigPath) {
        tscCommand += ` --project "${this.tsconfigPath}"`;
      }

      // 运行tsc命令
      execSync(tscCommand, {
        cwd: projectPath,
        stdio: 'pipe'
      });

      const endTime = Date.now();
      console.log(`TypeScript type check completed in ${endTime - startTime}ms`);
      return [];
    } catch (error) {
      // 解析错误输出
      const errors = this.parseTypeScriptErrors(error.stdout.toString() || error.stderr.toString());
      console.log(`Found ${errors.length} TypeScript type errors`);
      return errors;
    }
  }

  /**
   * 解析TypeScript错误输出
   * @param {string} errorOutput - 错误输出
   * @returns {Array} 解析后的错误数组
   */
  parseTypeScriptErrors(errorOutput) {
    const errors = [];
    const errorLines = errorOutput.split('\n');

    const errorRegex = /^(.*?):(\d+):(\d+):\s*(error|warning)\s*TS(\d+):\s*(.*)$/;

    for (const line of errorLines) {
      const match = line.match(errorRegex);
      if (match) {
        const [, filePath, lineStr, colStr, severity, errorCode, message] = match;
        
        errors.push({
          file: filePath,
          line: parseInt(lineStr, 10),
          column: parseInt(colStr, 10),
          severity: severity === 'error' ? 'High' : 'Medium',
          code: `TS${errorCode}`,
          message: message.trim(),
          type: 'typescript',
          ruleId: `typescript-TS${errorCode}`,
          name: `TypeScript ${severity}: TS${errorCode}`,
          description: `TypeScript ${severity}: ${message.trim()}`,
          recommendation: `Fix TypeScript ${severity} TS${errorCode}`
        });
      }
    }

    return errors;
  }

  /**
   * 将TypeScript错误转换为漏洞对象
   * @param {Array} typeErrors - TypeScript错误数组
   * @returns {Array} 漏洞对象数组
   */
  convertToVulnerabilities(typeErrors) {
    return typeErrors.map(error => ({
      ruleId: error.ruleId,
      name: error.name,
      severity: error.severity,
      description: error.description,
      recommendation: error.recommendation,
      file: error.file,
      line: error.line,
      column: error.column,
      code: error.code,
      evidence: error.message,
      confidence: 'High',
      type: 'typescript'
    }));
  }

  /**
   * 扫描项目的TypeScript类型错误
   * @param {string} projectPath - 项目路径
   * @returns {Array} 漏洞对象数组
   */
  scanTypeScript(projectPath) {
    const typeErrors = this.runTypeCheck(projectPath);
    return this.convertToVulnerabilities(typeErrors);
  }

  /**
   * 获取TypeScript配置信息
   * @param {string} projectPath - 项目路径
   * @returns {Object} TypeScript配置信息
   */
  getTypeScriptConfig(projectPath) {
    if (!this.tsconfigPath) {
      this.findTsconfig(projectPath);
    }

    if (!this.tsconfigPath) {
      return null;
    }

    try {
      const tsconfigContent = fs.readFileSync(this.tsconfigPath, 'utf8');
      return JSON.parse(tsconfigContent);
    } catch (error) {
      console.warn('Error reading tsconfig.json:', error.message);
      return null;
    }
  }
}

module.exports = TypeScriptChecker;