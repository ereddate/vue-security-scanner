const customRules = require('./custom-rules');

// 导入分类规则模块
const xssRules = require('./modules/xss-rules');
const secretsRules = require('./modules/secrets-rules');
const vueSpecificRules = require('./modules/vue-specific-rules');
const sqlInjectionRules = require('./modules/sql-injection-rules');
const csrfRules = require('./modules/csrf-rules');
const memoryLeakRules = require('./modules/memory-leak-rules');
const cookieRules = require('./modules/cookie-rules');
const httpHeaderRules = require('./modules/http-header-rules');
const dependencyRules = require('./modules/dependency-rules');
const domSecurityRules = require('./modules/dom-security-rules');
const ssrRules = require('./modules/ssr-rules');
const authenticationRules = require('./modules/authentication-rules');
const injectionRules = require('./modules/injection-rules');
const fileSystemRules = require('./modules/file-system-rules');
const networkRules = require('./modules/network-rules');
const encryptionRules = require('./modules/encryption-rules');
const inputRules = require('./modules/input-rules');
const apiSecurityRules = require('./modules/api-security-rules');
const supplyChainRules = require('./modules/supply-chain-rules');
const cloudServiceRules = require('./modules/cloud-service-rules');
const containerSecurityRules = require('./modules/container-security-rules');
const devopsSecurityRules = require('./modules/devops-security-rules');
const complianceSecurityRules = require('./modules/compliance-security-rules');
const businessLogicSecurityRules = require('./modules/business-logic-security-rules');
const securityMonitoringRules = require('./modules/security-monitoring-rules');
const mobileAppSecurityRules = require('./modules/mobile-app-security-rules');
const webassemblySecurityRules = require('./modules/webassembly-security-rules');

// 导入中国特定规则模块
const chinaSecurityRules = require('./modules/china-security-rules');
const vueOfficialSecurityRules = require('./modules/vue-official-security-rules');
const chinaFrameworkRules = require('./modules/china-framework-rules');
const chinaEnvironmentRules = require('./modules/china-environment-rules');
const chinaApiSecurityRules = require('./modules/china-api-security-rules');

// 合并所有规则
const securityRules = [
  ...xssRules,
  ...secretsRules,
  ...vueSpecificRules,
  ...sqlInjectionRules,
  ...csrfRules,
  ...memoryLeakRules,
  ...cookieRules,
  ...httpHeaderRules,
  ...dependencyRules,
  ...domSecurityRules,
  ...ssrRules,
  ...authenticationRules,
  ...injectionRules,
  ...fileSystemRules,
  ...networkRules,
  ...encryptionRules,
  ...inputRules,
  ...apiSecurityRules,
  ...supplyChainRules,
  ...cloudServiceRules,
  ...containerSecurityRules,
  ...devopsSecurityRules,
  ...complianceSecurityRules,
  ...businessLogicSecurityRules,
  ...securityMonitoringRules,
  ...mobileAppSecurityRules,
  ...webassemblySecurityRules,
  // 添加中国特定规则
  ...chinaSecurityRules,
  ...vueOfficialSecurityRules,
  ...chinaFrameworkRules,
  ...chinaEnvironmentRules,
  ...chinaApiSecurityRules,
  ...customRules
];

module.exports = securityRules;