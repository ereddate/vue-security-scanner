const mobileAppSecurityRules = [
  {
    id: 'mobile-permissions',
    name: 'Mobile App Permissions',
    severity: 'Medium',
    description: 'Potential mobile app permissions issue',
    recommendation: 'Request only necessary permissions. Use runtime permission requests. Implement permission justification.',
    patterns: [
      { key: 'permissions', pattern: 'permission|permissions|ACCESS_|READ_|WRITE_|CAMERA|MICROPHONE|LOCATION' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-data-storage',
    name: 'Mobile App Data Storage',
    severity: 'Medium',
    description: 'Potential mobile app data storage security issue',
    recommendation: 'Use secure storage for sensitive data. Encrypt local storage. Avoid storing sensitive data in plaintext.',
    patterns: [
      { key: 'data-storage', pattern: 'SharedPreferences|NSUserDefaults|localStorage|sessionStorage|SQLite|Realm|Core Data' },
      { key: 'sensitive-data', pattern: 'password|token|key|secret|credential|auth' }
    ]
  },
  {
    id: 'mobile-network-communication',
    name: 'Mobile App Network Communication',
    severity: 'High',
    description: 'Potential mobile app network communication security issue',
    recommendation: 'Use HTTPS for all network communications. Implement certificate pinning. Validate server certificates.',
    patterns: [
      { key: 'network', pattern: 'HTTP|http|HTTPS|https|API|network|request|response' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-code-obfuscation',
    name: 'Mobile App Code Obfuscation',
    severity: 'Low',
    description: 'Missing or inadequate mobile app code obfuscation',
    recommendation: 'Implement code obfuscation for mobile apps. Use ProGuard for Android. Use App Transport Security for iOS.',
    patterns: [
      { key: 'obfuscation', pattern: 'obfuscate|obfuscation|ProGuard|DexGuard|App Transport Security|ATS' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-certificate-pinning',
    name: 'Mobile App Certificate Pinning',
    severity: 'Medium',
    description: 'Missing or inadequate certificate pinning',
    recommendation: 'Implement certificate pinning for mobile apps. Validate server certificates against known fingerprints.',
    patterns: [
      { key: 'certificate', pattern: 'certificate|cert|pinning|SSL|TLS|HTTPS' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-sensitive-info-leakage',
    name: 'Mobile App Sensitive Information Leakage',
    severity: 'High',
    description: 'Potential mobile app sensitive information leakage',
    recommendation: 'Avoid logging sensitive information. Implement secure logging practices. Use environment variables for secrets.',
    patterns: [
      { key: 'leakage', pattern: 'log|logging|debug|console|print|println' },
      { key: 'sensitive-data', pattern: 'password|token|key|secret|credential|auth' }
    ]
  },
  {
    id: 'mobile-anti-debugging',
    name: 'Mobile App Anti-Debugging',
    severity: 'Low',
    description: 'Missing or inadequate anti-debugging measures',
    recommendation: 'Implement anti-debugging measures for mobile apps. Detect and respond to debugging attempts.',
    patterns: [
      { key: 'debugging', pattern: 'debug|debugger|debugging|gdb|lldb|IDA Pro' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-update-mechanism',
    name: 'Mobile App Update Mechanism',
    severity: 'Medium',
    description: 'Potential mobile app update mechanism issue',
    recommendation: 'Implement secure update mechanisms. Verify update signatures. Use app store distribution channels.',
    patterns: [
      { key: 'update', pattern: 'update|upgrade|version|app store|play store|appstore|playstore' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-third-party-libraries',
    name: 'Mobile App Third-Party Libraries',
    severity: 'Medium',
    description: 'Potential mobile app third-party library security issue',
    recommendation: 'Scan third-party libraries for security vulnerabilities. Use only trusted libraries. Keep libraries updated.',
    patterns: [
      { key: 'third-party', pattern: 'library|SDK|dependency|package|module|plugin' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  },
  {
    id: 'mobile-local-storage',
    name: 'Mobile App Local Storage',
    severity: 'Medium',
    description: 'Potential mobile app local storage security issue',
    recommendation: 'Use secure local storage. Encrypt sensitive data. Implement data protection policies.',
    patterns: [
      { key: 'local-storage', pattern: 'local storage|localStorage|shared preferences|keychain|keystore' },
      { key: 'mobile-app', pattern: 'Android|iOS|mobile|app|application' }
    ]
  }
];

module.exports = mobileAppSecurityRules;