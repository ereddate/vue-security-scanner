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
const serviceWorkerSecurityRules = require('./modules/service-worker-security-rules');
const webrtcSecurityRules = require('./modules/webrtc-security-rules');
const geolocationSecurityRules = require('./modules/geolocation-security-rules');
const pushNotificationSecurityRules = require('./modules/push-notification-security-rules');
const modernStorageSecurityRules = require('./modules/modern-storage-security-rules');
const otherModernApisSecurityRules = require('./modules/other-modern-apis-security-rules');
const webComponentsSecurityRules = require('./modules/web-components-security-rules');
const pwaSecurityRules = require('./modules/pwa-security-rules');
const modernJsFeaturesSecurityRules = require('./modules/modern-js-features-security-rules');
const thirdPartyIntegrationSecurityRules = require('./modules/third-party-integration-security-rules');
const performanceApisSecurityRules = require('./modules/performance-apis-security-rules');
// 添加新创建的安全规则模块
const dependencySecurityRules = require('./modules/dependency-security-rules');
const vueCliSecurityRules = require('./modules/vue-cli-security-rules');
const microfrontendSecurityRules = require('./modules/microfrontend-security-rules');
const offlineAppSecurityRules = require('./modules/offline-app-security-rules');
const backendIntegrationSecurityRules = require('./modules/backend-integration-security-rules');
const cloudDeploymentSecurityRules = require('./modules/cloud-deployment-security-rules');
const developmentToolsSecurityRules = require('./modules/development-tools-security-rules');
const testEnvironmentSecurityRules = require('./modules/test-environment-security-rules');
const i18nAndAccessibilitySecurityRules = require('./modules/i18n-and-accessibility-security-rules');
const performanceAndResourceSecurityRules = require('./modules/performance-and-resource-security-rules');
const mobileAndCrossPlatformSecurityRules = require('./modules/mobile-and-cross-platform-security-rules');
const codeQualityAndMaintenanceSecurityRules = require('./modules/code-quality-and-maintenance-security-rules');
const complianceAndStandardsSecurityRules = require('./modules/compliance-and-standards-security-rules');

// 导入中国特定规则模块
const chinaSecurityRules = require('./modules/china-security-rules');
const vueOfficialSecurityRules = require('./modules/vue-official-security-rules');
const chinaFrameworkRules = require('./modules/china-framework-rules');
const chinaEnvironmentRules = require('./modules/china-environment-rules');
const chinaApiSecurityRules = require('./modules/china-api-security-rules');

// 导入第三方安全规则集
const eslintRules = require('./modules/third-party/eslint-rules');
const owaspRules = require('./modules/third-party/owasp-rules');
const sonarQubeRules = require('./modules/third-party/sonarqube-rules');

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
  // 添加新创建的现代API安全规则
  ...serviceWorkerSecurityRules,
  ...webrtcSecurityRules,
  ...geolocationSecurityRules,
  ...pushNotificationSecurityRules,
  ...modernStorageSecurityRules,
  ...otherModernApisSecurityRules,
  // 添加额外的安全规则
  ...webComponentsSecurityRules,
  ...pwaSecurityRules,
  ...modernJsFeaturesSecurityRules,
  ...thirdPartyIntegrationSecurityRules,
  ...performanceApisSecurityRules,
  // 添加新创建的安全规则
  ...dependencySecurityRules,
  ...vueCliSecurityRules,
  ...microfrontendSecurityRules,
  ...offlineAppSecurityRules,
  ...backendIntegrationSecurityRules,
  ...cloudDeploymentSecurityRules,
  ...developmentToolsSecurityRules,
  ...testEnvironmentSecurityRules,
  ...i18nAndAccessibilitySecurityRules,
  ...performanceAndResourceSecurityRules,
  ...mobileAndCrossPlatformSecurityRules,
  ...codeQualityAndMaintenanceSecurityRules,
  ...complianceAndStandardsSecurityRules,
  // 添加中国特定规则
  ...chinaSecurityRules,
  ...vueOfficialSecurityRules,
  ...chinaFrameworkRules,
  ...chinaEnvironmentRules,
  ...chinaApiSecurityRules,
  // 添加第三方安全规则集
  ...eslintRules,
  ...owaspRules,
  ...sonarQubeRules,
  ...customRules
];

module.exports = securityRules;