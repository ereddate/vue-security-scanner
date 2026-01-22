/**
 * SQL注入检测插件
 * 企业级安全扫描插件，用于检测潜在的SQL注入漏洞
 */

class SqlInjectionPlugin {
  constructor() {
    this.name = 'SQL Injection Detector';
    this.description = 'Detects potential SQL injection vulnerabilities in code';
    this.version = '1.0.0';
    this.severity = 'High';
  }

  /**
   * 分析文件内容以查找SQL注入漏洞
   */
  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检查文件类型，只处理相关文件
    if (!this.isRelevantFile(filePath)) {
      return vulnerabilities;
    }

    // SQL注入检测规则
    const sqlInjectionPatterns = [
      {
        pattern: /\b(sequelize|mysql|pg|sqlite|mssql)\b.*(?:req\.|params|query|body)/g,
        description: 'Potential SQL injection through user input',
        severity: 'High'
      },
      {
        pattern: /query\s*\(\s*['"`][^'"`]*[`"'][\s+|\s*[\+]\s*]/g,
        description: 'Dynamic SQL query construction',
        severity: 'High'
      },
      {
        pattern: /execute\s*\(\s*['"`][^'"`]*[`"'][\s+|\s*[\+]\s*]/g,
        description: 'Dynamic SQL execution',
        severity: 'High'
      },
      {
        pattern: /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\s*=.*(?:req\.|params|query|body)/gi,
        description: 'Direct user input in SQL WHERE clause',
        severity: 'High'
      },
      {
        pattern: /INSERT\s+INTO\s+.*VALUES\s*\(/gi,
        description: 'SQL INSERT statement - review for input sanitization',
        severity: 'Medium'
      }
    ];

    for (const rule of sqlInjectionPatterns) {
      const matches = content.match(rule.pattern);
      if (matches) {
        matches.forEach((match, index) => {
          const lines = content.split('\n');
          let lineNumber = 0;
          
          // 找到匹配所在的行号
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(match.trim())) {
              lineNumber = i + 1;
              break;
            }
          }
          
          vulnerabilities.push({
            id: `sql-injection-${Date.now()}-${index}`,
            type: 'SQL Injection',
            severity: rule.severity,
            file: filePath,
            line: lineNumber,
            description: rule.description,
            codeSnippet: match.substring(0, 100),
            recommendation: 'Always use parameterized queries or prepared statements. Never concatenate user input directly into SQL queries.',
            plugin: this.name
          });
        });
      }
    }

    return vulnerabilities;
  }

  /**
   * 判断文件是否需要扫描
   */
  isRelevantFile(filePath) {
    const relevantExtensions = ['.js', '.ts', '.vue', '.jsx', '.tsx'];
    const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    return relevantExtensions.includes(extension);
  }
}

module.exports = new SqlInjectionPlugin();