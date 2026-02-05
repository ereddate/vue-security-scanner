const offlineAppSecurityRules = [
  {
    id: 'pwa-configuration',
    name: 'PWA Configuration Security',
    severity: 'Medium',
    description: 'PWA configuration may have security vulnerabilities',
    recommendation: 'Review PWA configuration for security best practices.',
    patterns: [
      { key: 'manifest-json', pattern: 'manifest\\.json' },
      { key: 'service-worker', pattern: 'service-worker\\.js|sw\\.js' }
    ]
  },
  {
    id: 'offline-data-security',
    name: 'Offline Data Security',
    severity: 'High',
    description: 'Offline data storage may have security vulnerabilities',
    recommendation: 'Implement secure offline data storage and synchronization.',
    patterns: [
      { key: 'local-storage', pattern: 'localStorage' },
      { key: 'indexed-db', pattern: 'indexedDB|IDB' },
      { key: 'web-sql', pattern: 'openDatabase' }
    ]
  },
  {
    id: 'service-worker-security',
    name: 'Service Worker Security',
    severity: 'High',
    description: 'Service workers may have security vulnerabilities',
    recommendation: 'Review service worker code for security best practices.',
    patterns: [
      { key: 'service-worker-register', pattern: 'serviceWorker\\.register' },
      { key: 'fetch-event', pattern: 'fetch\\s*event|event\\s*\\.respondWith' }
    ]
  },
  {
    id: 'cache-security',
    name: 'Cache Security',
    severity: 'Medium',
    description: 'Cache storage may have security vulnerabilities',
    recommendation: 'Implement secure cache management practices.',
    patterns: [
      { key: 'cache-api', pattern: 'caches\\.open|cache\\.add|cache\\.put' },
      { key: 'cache-storage', pattern: 'CacheStorage' }
    ]
  },
  {
    id: 'offline-sync-security',
    name: 'Offline Sync Security',
    severity: 'Medium',
    description: 'Offline data synchronization may have security vulnerabilities',
    recommendation: 'Implement secure offline data synchronization practices.',
    patterns: [
      { key: 'sync-event', pattern: 'sync\\s*event|event\\s*\\.waitUntil' },
      { key: 'background-sync', pattern: 'BackgroundSync' }
    ]
  },
  {
    id: 'pwa-install-security',
    name: 'PWA Install Security',
    severity: 'Low',
    description: 'PWA installation may have security implications',
    recommendation: 'Implement secure PWA installation practices.',
    patterns: [
      { key: 'beforeinstallprompt', pattern: 'beforeinstallprompt' },
      { key: 'prompt-event', pattern: 'prompt\\s*\\(|userChoice' }
    ]
  },
  {
    id: 'pwa-updates-security',
    name: 'PWA Updates Security',
    severity: 'Medium',
    description: 'PWA updates may have security vulnerabilities',
    recommendation: 'Implement secure PWA update practices.',
    patterns: [
      { key: 'update-event', pattern: 'updatefound|controllerchange' },
      { key: 'skip-waiting', pattern: 'skipWaiting|clients\\.claim' }
    ]
  },
  {
    id: 'pwa-permissions',
    name: 'PWA Permissions Security',
    severity: 'Medium',
    description: 'PWA permissions may have security implications',
    recommendation: 'Implement secure PWA permission handling practices.',
    patterns: [
      { key: 'permission-request', pattern: 'requestPermission|permissions\\.query' },
      { key: 'notification-permission', pattern: 'Notification\\.permission' }
    ]
  },
  {
    id: 'pwa-scope-security',
    name: 'PWA Scope Security',
    severity: 'Medium',
    description: 'PWA scope configuration may have security implications',
    recommendation: 'Implement secure PWA scope configuration.',
    patterns: [
      { key: 'scope-config', pattern: '"scope"\\s*:\\s*["\'][^"\']*["\']' },
      { key: 'start-url', pattern: '"start_url"\\s*:\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'pwa-display-mode',
    name: 'PWA Display Mode Security',
    severity: 'Low',
    description: 'PWA display mode may have security implications',
    recommendation: 'Implement secure PWA display mode configuration.',
    patterns: [
      { key: 'display-mode', pattern: '"display"\\s*:\\s*["\'][^"\']*["\']' },
      { key: 'orientation', pattern: '"orientation"\\s*:\\s*["\'][^"\']*["\']' }
    ]
  }
];

module.exports = offlineAppSecurityRules;