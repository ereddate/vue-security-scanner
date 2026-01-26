const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { ErrorHandler } = require('../utils/error-handler');

class ASTAnalyzer {
  constructor(config = {}) {
    this.config = config;
    this.enableSemanticAnalysis = config.enableSemanticAnalysis !== false;
  }

  analyze(filePath, content) {
    if (!this.enableSemanticAnalysis) {
      return [];
    }

    try {
      const ast = this.parseCode(content, filePath);
      if (!ast) {
        return [];
      }

      const vulnerabilities = [];

      traverse(ast, {
        CallExpression: (path) => this.analyzeCallExpression(path, filePath, vulnerabilities),
        MemberExpression: (path) => this.analyzeMemberExpression(path, filePath, vulnerabilities),
        JSXElement: (path) => this.analyzeJSXElement(path, filePath, vulnerabilities),
        AssignmentExpression: (path) => this.analyzeAssignmentExpression(path, filePath, vulnerabilities),
        VariableDeclarator: (path) => this.analyzeVariableDeclarator(path, filePath, vulnerabilities),
        ObjectProperty: (path) => this.analyzeObjectProperty(path, filePath, vulnerabilities)
      });

      return vulnerabilities;
    } catch (error) {
      ErrorHandler.handleFileError(filePath, error);
      return [];
    }
  }

  parseCode(content, filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    
    const plugins = [
      'jsx',
      'classProperties',
      'objectRestSpread',
      'functionBind',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'dynamicImport',
      'nullishCoalescingOperator',
      'optionalChaining',
      'bigInt',
      'optionalCatchBinding',
      'throwExpressions',
      'topLevelAwait',
      'classPrivateProperties',
      'classPrivateMethods',
      'importMeta',
      'numericSeparator',
      'logicalAssignmentOperators',
      'decimal'
    ];

    if (ext === 'ts' || ext === 'tsx') {
      plugins.push('typescript');
    }

    try {
      return parser.parse(content, {
        sourceType: 'module',
        plugins: plugins
      });
    } catch (error) {
      try {
        return parser.parse(content, {
          sourceType: 'script',
          plugins: plugins
        });
      } catch (scriptError) {
        return null;
      }
    }
  }

  analyzeCallExpression(path, filePath, vulnerabilities) {
    const callee = path.node.callee;
    
    if (!callee) return;

    const calleeName = this.getCalleeName(callee);

    if (this.isDangerousFunction(calleeName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const args = path.node.arguments;
      const hasUserInput = this.checkForUserInput(args, path);

      vulnerabilities.push({
        ruleId: `semantic-${calleeName}`,
        name: `Dangerous function call: ${calleeName}`,
        severity: hasUserInput ? 'High' : 'Medium',
        description: `Calling ${calleeName} with potentially unsafe data`,
        recommendation: `Avoid using ${calleeName} with user-provided data. Consider using safer alternatives.`,
        file: filePath,
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
      
      vulnerabilities.push({
        ruleId: `semantic-api-${calleeName}`,
        name: `Potentially vulnerable API: ${calleeName}`,
        severity: 'Medium',
        description: `Using ${calleeName} which may have security implications`,
        recommendation: `Review the usage of ${calleeName} and ensure proper security measures are in place.`,
        file: filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: calleeName,
        confidence: 'Medium'
      });
    }
  }

  analyzeMemberExpression(path, filePath, vulnerabilities) {
    const object = path.node.object;
    const property = path.node.property;

    if (!object || !property) return;

    const objName = this.getNodeName(object);
    const propName = this.getNodeName(property);

    if (this.isDangerousPropertyAccess(objName, propName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      vulnerabilities.push({
        ruleId: `semantic-property-${propName}`,
        name: `Dangerous property access: ${objName}.${propName}`,
        severity: 'High',
        description: `Accessing ${propName} property which may lead to security issues`,
        recommendation: `Avoid accessing ${propName} directly. Use safer alternatives or validate input.`,
        file: filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: `${objName}.${propName}`,
        confidence: 'High'
      });
    }
  }

  analyzeJSXElement(path, filePath, vulnerabilities) {
    const openingElement = path.node.openingElement;
    
    if (!openingElement) return;

    const tagName = this.getJSXTagName(openingElement.name);

    if (this.isDangerousJSXElement(tagName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const dangerousProps = this.findDangerousJSXProps(openingElement.attributes);
      
      if (dangerousProps.length > 0) {
        vulnerabilities.push({
          ruleId: `semantic-jsx-${tagName}`,
          name: `Dangerous JSX element: ${tagName}`,
          severity: 'High',
          description: `Using ${tagName} with potentially dangerous props: ${dangerousProps.join(', ')}`,
          recommendation: `Avoid using ${tagName} with user-provided data. Sanitize input before rendering.`,
          file: filePath,
          line: line,
          column: column,
          code: this.getCodeSnippet(path),
          evidence: dangerousProps.join(', '),
          confidence: 'High'
        });
      }
    }
  }

  analyzeAssignmentExpression(path, filePath, vulnerabilities) {
    const left = path.node.left;
    const right = path.node.right;

    if (!left || !right) return;

    const leftName = this.getNodeName(left);

    if (this.isDangerousAssignment(leftName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const hasUserInput = this.checkForUserInput([right], path);

      vulnerabilities.push({
        ruleId: `semantic-assignment-${leftName}`,
        name: `Dangerous assignment: ${leftName}`,
        severity: hasUserInput ? 'High' : 'Medium',
        description: `Assigning to ${leftName} which may have security implications`,
        recommendation: `Validate and sanitize data before assigning to ${leftName}`,
        file: filePath,
        line: line,
        column: column,
        code: this.getCodeSnippet(path),
        evidence: leftName,
        confidence: hasUserInput ? 'High' : 'Medium'
      });
    }
  }

  analyzeVariableDeclarator(path, filePath, vulnerabilities) {
    const id = path.node.id;
    const init = path.node.init;

    if (!id || !init) return;

    const varName = this.getNodeName(id);

    if (this.isSensitiveVariableName(varName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const hasHardcodedValue = this.checkForHardcodedValue(init);

      if (hasHardcodedValue) {
        vulnerabilities.push({
          ruleId: 'semantic-hardcoded-secret',
          name: `Potentially hardcoded secret: ${varName}`,
          severity: 'High',
          description: `Variable ${varName} appears to contain a hardcoded secret`,
          recommendation: `Move sensitive data to environment variables or a secure vault`,
          file: filePath,
          line: line,
          column: column,
          code: this.getCodeSnippet(path),
          evidence: varName,
          confidence: 'High'
        });
      }
    }
  }

  analyzeObjectProperty(path, filePath, vulnerabilities) {
    const key = path.node.key;
    const value = path.node.value;

    if (!key || !value) return;

    const keyName = this.getNodeName(key);

    if (this.isSensitiveProperty(keyName)) {
      const line = path.node.loc?.start?.line || 0;
      const column = path.node.loc?.start?.column || 0;
      
      const hasHardcodedValue = this.checkForHardcodedValue(value);

      if (hasHardcodedValue) {
        vulnerabilities.push({
          ruleId: 'semantic-hardcoded-config',
          name: `Potentially hardcoded configuration: ${keyName}`,
          severity: 'High',
          description: `Property ${keyName} appears to contain a hardcoded value`,
          recommendation: `Move sensitive configuration to environment variables`,
          file: filePath,
          line: line,
          column: column,
          code: this.getCodeSnippet(path),
          evidence: keyName,
          confidence: 'High'
        });
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

  checkForUserInput(args, path) {
    if (!args || args.length === 0) return false;

    for (const arg of args) {
      if (this.isLikelyUserInput(arg, path)) {
        return true;
      }
    }

    return false;
  }

  isLikelyUserInput(node, path) {
    if (!node) return false;

    if (node.type === 'Identifier') {
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
}

module.exports = ASTAnalyzer;
