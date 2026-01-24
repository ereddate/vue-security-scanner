const customRules = [
  {
    id: 'custom-api-key',
    name: 'Custom API Key',
    severity: 'High',
    description: '检测自定义API密钥泄露',
    recommendation: '将API密钥移至环境变量或使用密钥管理服务',
    patterns: [
      { key: 'api-key', pattern: '(API_KEY|APIKEY|api_key|apikey)\\s*=\\s*["\'][^"\']+["\']' },
      { key: 'api-key-const', pattern: 'const\\s+(API_KEY|APIKEY|api_key|apikey)\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'custom-secret-key',
    name: 'Custom Secret Key',
    severity: 'High',
    description: '检测自定义密钥泄露',
    recommendation: '将密钥移至环境变量或使用密钥管理服务',
    patterns: [
      { key: 'secret-key', pattern: '(SECRET_KEY|SECRETKEY|secret_key|secretkey)\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'custom-database-url',
    name: 'Custom Database URL',
    severity: 'High',
    description: '检测数据库连接字符串泄露',
    recommendation: '将数据库连接字符串移至环境变量',
    patterns: [
      { key: 'database-url', pattern: '(DATABASE_URL|DB_URL|DATABASEURL)\\s*=\\s*["\']?(mysql|postgres|mongodb)://[^"\']+["\']?' },
      { key: 'database-connection', pattern: '(mysql|postgres|mongodb)://[^"\'\\s:]+"' }
    ]
  },
  {
    id: 'custom-aws-key',
    name: 'AWS Access Key',
    severity: 'High',
    description: '检测AWS访问密钥泄露',
    recommendation: '使用IAM角色或AWS Secrets Manager管理密钥',
    patterns: [
      { key: 'aws-access-key', pattern: 'AKIA[0-9A-Z]{16}' },
      { key: 'aws-secret-key', pattern: '(AWS_SECRET_ACCESS_KEY|aws_secret_access_key)\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'custom-jwt-secret',
    name: 'JWT Secret',
    severity: 'High',
    description: '检测JWT密钥泄露',
    recommendation: '将JWT密钥移至环境变量',
    patterns: [
      { key: 'jwt-secret', pattern: '(JWT_SECRET|jwt_secret|JWTSECRET)\\s*=\\s*["\'][^"\']+["\"]' }
    ]
  },
  {
    id: 'custom-encryption-key',
    name: 'Encryption Key',
    severity: 'High',
    description: '检测加密密钥泄露',
    recommendation: '使用密钥管理服务管理加密密钥',
    patterns: [
      { key: 'encryption-key', pattern: '(ENCRYPTION_KEY|ENCRYPTIONKEY|encryption_key)\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'custom-private-key',
    name: 'Private Key',
    severity: 'High',
    description: '检测私钥泄露',
    recommendation: '私钥不应出现在代码中，使用密钥管理服务',
    patterns: [
      { key: 'private-key', pattern: '-----BEGIN\\s+(RSA\\s+)?PRIVATE\\s+KEY-----' }
    ]
  },
  {
    id: 'custom-oauth-token',
    name: 'OAuth Token',
    severity: 'High',
    description: '检测OAuth令牌泄露',
    recommendation: '使用OAuth流程动态获取令牌，不要硬编码',
    patterns: [
      { key: 'oauth-token', pattern: '(oauth_token|access_token|refresh_token)\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'custom-stripe-key',
    name: 'Stripe API Key',
    severity: 'High',
    description: '检测Stripe API密钥泄露',
    recommendation: '使用环境变量管理Stripe密钥',
    patterns: [
      { key: 'stripe-key', pattern: 'sk_(live|test)_[0-9a-zA-Z]{24,}' }
    ]
  },
  {
    id: 'custom-firebase-key',
    name: 'Firebase API Key',
    severity: 'High',
    description: '检测Firebase API密钥泄露',
    recommendation: '使用Firebase配置文件或环境变量',
    patterns: [
      { key: 'firebase-key', pattern: 'AIza[0-9A-Za-z\\-_]{35}' }
    ]
  },
  {
    id: 'custom-github-token',
    name: 'GitHub Token',
    severity: 'High',
    description: '检测GitHub令牌泄露',
    recommendation: '使用GitHub Secrets或环境变量',
    patterns: [
      { key: 'github-token', pattern: 'ghp_[a-zA-Z0-9]{36}' },
      { key: 'github-oauth', pattern: 'github_oauth_[a-zA-Z0-9]{22}' }
    ]
  },
  {
    id: 'custom-slack-token',
    name: 'Slack Token',
    severity: 'High',
    description: '检测Slack令牌泄露',
    recommendation: '使用Slack应用配置或环境变量',
    patterns: [
      { key: 'slack-token', pattern: 'xox[baprs]-[a-zA-Z0-9-]+' }
    ]
  },
  {
    id: 'custom-twilio-key',
    name: 'Twilio API Key',
    severity: 'High',
    description: '检测Twilio API密钥泄露',
    recommendation: '使用环境变量管理Twilio密钥',
    patterns: [
      { key: 'twilio-sid', pattern: 'AC[a-z0-9]{32}' },
      { key: 'twilio-token', pattern: '[a-z0-9]{32}' }
    ]
  },
  {
    id: 'custom-sendgrid-key',
    name: 'SendGrid API Key',
    severity: 'High',
    description: '检测SendGrid API密钥泄露',
    recommendation: '使用环境变量管理SendGrid密钥',
    patterns: [
      { key: 'sendgrid-key', pattern: 'SG\\.[a-zA-Z0-9_-]{22}\\.[a-zA-Z0-9_-]{43}' }
    ]
  },
  {
    id: 'custom-heroku-key',
    name: 'Heroku API Key',
    severity: 'High',
    description: '检测Heroku API密钥泄露',
    recommendation: '使用Heroku配置变量',
    patterns: [
      { key: 'heroku-key', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' }
    ]
  },
  {
    id: 'custom-internal-endpoint',
    name: 'Internal Endpoint',
    severity: 'Medium',
    description: '检测内部端点硬编码',
    recommendation: '使用配置化的端点URL',
    patterns: [
      { key: 'internal-api', pattern: '(https?://)?(api|internal|localhost|127\\.0\\.0\\.1)(:[0-9]+)?/api' }
    ]
  },
  {
    id: 'custom-debug-mode',
    name: 'Debug Mode Enabled',
    severity: 'Low',
    description: '检测调试模式启用',
    recommendation: '生产环境应禁用调试模式',
    patterns: [
      { key: 'debug-mode', pattern: '(DEBUG|debug)\\s*=\\s*true' },
      { key: 'debug-flag', pattern: '--debug|--verbose' }
    ]
  },
  {
    id: 'custom-console-log',
    name: 'Console Log in Production',
    severity: 'Low',
    description: '检测生产环境中的console.log',
    recommendation: '移除或使用日志库替代console.log',
    patterns: [
      { key: 'console-log', pattern: 'console\\.(log|debug|info|warn|error)\\s*\\(' }
    ]
  },
  {
    id: 'custom-todo-comment',
    name: 'TODO Comment',
    severity: 'Low',
    description: '检测TODO注释',
    recommendation: '完成TODO任务或移除注释',
    patterns: [
      { key: 'todo-comment', pattern: '//\\s*TODO|/\\*\\s*TODO' }
    ]
  },
  {
    id: 'custom-fixme-comment',
    name: 'FIXME Comment',
    severity: 'Low',
    description: '检测FIXME注释',
    recommendation: '修复FIXME标记的问题',
    patterns: [
      { key: 'fixme-comment', pattern: '//\\s*FIXME|/\\*\\s*FIXME' }
    ]
  }
];

module.exports = customRules;
