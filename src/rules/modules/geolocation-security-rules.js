const geolocationSecurityRules = [
  {
    id: 'geolocation-info-leakage',
    name: 'Geolocation Information Leakage',
    severity: 'Medium',
    description: 'Geolocation API may leak user location information',
    recommendation: 'Prompt user consent before accessing location. Provide clear privacy notice. Consider using less precise location when possible.',
    patterns: [
      { key: 'geolocation-get-current', pattern: 'navigator\\.geolocation\\.getCurrentPosition' },
      { key: 'geolocation-watch-position', pattern: 'navigator\\.geolocation\\.watchPosition' }
    ]
  },
  {
    id: 'geolocation-permission-abuse',
    name: 'Geolocation Permission Abuse',
    severity: 'Medium',
    description: 'Potential abuse of geolocation permissions',
    recommendation: 'Implement proper permission management. Respect user choices and provide options to disable location services.',
    patterns: [
      { key: 'geolocation-permission', pattern: 'navigator\\.permissions\\.query.*geolocation' },
      { key: 'geolocation-repeated-request', pattern: 'getCurrentPosition.*multiple|watchPosition.*multiple' }
    ]
  },
  {
    id: 'geolocation-precision-issue',
    name: 'Geolocation High Precision Issue',
    severity: 'Low',
    description: 'Geolocation API configured with high precision',
    recommendation: 'Consider using lower accuracy when high precision is not required to protect user privacy.',
    patterns: [
      { key: 'geolocation-high-accuracy', pattern: 'enableHighAccuracy:\\s*true' },
      { key: 'geolocation-timeout', pattern: 'timeout:\\s*600000' }  // 10 minutes timeout suggests persistent tracking
    ]
  },
  {
    id: 'geolocation-error-handling',
    name: 'Geolocation Error Handling',
    severity: 'Low',
    description: 'Missing proper error handling for geolocation',
    recommendation: 'Implement proper error handling for geolocation requests to handle denied permissions gracefully.',
    patterns: [
      { key: 'geolocation-no-error-handler', pattern: 'getCurrentPosition\\s*\\([^,]*\\)' }  // Only success callback, no error callback
    ]
  }
];

module.exports = geolocationSecurityRules;