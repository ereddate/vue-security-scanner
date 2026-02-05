const mobileAndCrossPlatformSecurityRules = [
  {
    id: 'mobile-framework-security',
    name: 'Mobile Framework Security',
    severity: 'Medium',
    description: 'Mobile frameworks may have security vulnerabilities',
    recommendation: 'Use secure mobile frameworks and keep them updated.',
    patterns: [
      { key: 'mobile-framework', pattern: 'vue-native|quasar|nativescript|ionic|react-native' },
      { key: 'mobile-config', pattern: 'mobile|ios|android' }
    ]
  },
  {
    id: 'cross-platform-security',
    name: 'Cross-Platform Security',
    severity: 'Medium',
    description: 'Cross-platform development may have security vulnerabilities',
    recommendation: 'Review cross-platform development for security best practices.',
    patterns: [
      { key: 'cross-platform', pattern: 'cross\\s*platform|hybrid|pwa' },
      { key: 'cordova', pattern: 'cordova|phonegap' }
    ]
  },
  {
    id: 'mobile-api-security',
    name: 'Mobile API Security',
    severity: 'Medium',
    description: 'Mobile API integration may have security vulnerabilities',
    recommendation: 'Ensure mobile API integration is secure.',
    patterns: [
      { key: 'mobile-api', pattern: 'mobile\\s*api|device\\s*api' },
      { key: 'native-api', pattern: 'native\\s*api|bridge' }
    ]
  },
  {
    id: 'mobile-authentication-security',
    name: 'Mobile Authentication Security',
    severity: 'High',
    description: 'Mobile authentication may have security vulnerabilities',
    recommendation: 'Implement secure authentication for mobile applications.',
    patterns: [
      { key: 'mobile-auth', pattern: 'biometric|fingerprint|face\\s*id' },
      { key: 'auth-storage', pattern: 'keychain|keystore|secure\\s*storage' }
    ]
  },
  {
    id: 'mobile-storage-security',
    name: 'Mobile Storage Security',
    severity: 'High',
    description: 'Mobile storage may have security vulnerabilities',
    recommendation: 'Ensure mobile storage is secure.',
    patterns: [
      { key: 'mobile-storage', pattern: 'localStorage|sessionStorage|asyncStorage' },
      { key: 'file-storage', pattern: 'file\\s*system|document\\s*directory' }
    ]
  },
  {
    id: 'mobile-network-security',
    name: 'Mobile Network Security',
    severity: 'Medium',
    description: 'Mobile network communication may have security vulnerabilities',
    recommendation: 'Ensure mobile network communication is secure.',
    patterns: [
      { key: 'network-type', pattern: 'wifi|cellular|network\\s*type' },
      { key: 'offline-mode', pattern: 'offline|disconnected' }
    ]
  },
  {
    id: 'mobile-permission-security',
    name: 'Mobile Permission Security',
    severity: 'Medium',
    description: 'Mobile permissions may have security implications',
    recommendation: 'Ensure mobile permissions are properly managed.',
    patterns: [
      { key: 'permission-request', pattern: 'requestPermission|checkPermission' },
      { key: 'sensitive-permission', pattern: 'camera|microphone|location|contacts' }
    ]
  },
  {
    id: 'mobile-update-security',
    name: 'Mobile Update Security',
    severity: 'Medium',
    description: 'Mobile application updates may have security implications',
    recommendation: 'Ensure mobile application updates are secure.',
    patterns: [
      { key: 'update-check', pattern: 'checkForUpdate|forceUpdate' },
      { key: 'version-check', pattern: 'version|appVersion' }
    ]
  },
  {
    id: 'mobile-ssl-security',
    name: 'Mobile SSL Security',
    severity: 'High',
    description: 'Mobile SSL implementation may have security vulnerabilities',
    recommendation: 'Ensure mobile SSL implementation is secure.',
    patterns: [
      { key: 'ssl-config', pattern: 'ssl|tls|https' },
      { key: 'certificate', pattern: 'certificate|pinned\\s*cert' }
    ]
  },
  {
    id: 'mobile-debug-security',
    name: 'Mobile Debug Security',
    severity: 'Low',
    description: 'Mobile debugging may have security implications',
    recommendation: 'Ensure debugging is disabled in production.',
    patterns: [
      { key: 'debug-config', pattern: 'debug|DEBUG|__DEV__' },
      { key: 'console-log', pattern: 'console\\.log|console\\.debug' }
    ]
  }
];

module.exports = mobileAndCrossPlatformSecurityRules;