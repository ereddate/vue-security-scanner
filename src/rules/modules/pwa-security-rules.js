const pwaSecurityRules = [
  {
    id: 'pwa-manifest-security',
    name: 'PWA Manifest Security Issues',
    severity: 'Medium',
    description: 'Potential security issues with PWA manifest file',
    recommendation: 'Validate manifest content. Ensure icons and resources are from trusted sources. Properly configure CSP for installed apps.',
    patterns: [
      { key: 'manifest-link', pattern: '<link[^>]*rel=["\']manifest["\'][^>]*>' },
      { key: 'manifest-json', pattern: 'manifest\\.json|web\\.app\\.manifest' }
    ]
  },
  {
    id: 'pwa-offline-cache-security',
    name: 'PWA Offline Cache Security',
    severity: 'High',
    description: 'Potential security issues with offline caching in PWAs',
    recommendation: 'Validate cached content. Avoid caching sensitive information. Implement proper cache invalidation.',
    patterns: [
      { key: 'cache-storage', pattern: 'caches\\.open|caches\\.match|CacheStorage' },
      { key: 'sw-cache-all-sensitive', pattern: 'caches\\.addAll\\s*\\(\\s*\\[.*password|token|key|secret|auth|credential' }
    ]
  },
  {
    id: 'pwa-install-security',
    name: 'PWA Installation Security',
    severity: 'Medium',
    description: 'Potential security issues with PWA installation process',
    recommendation: 'Implement proper validation for install prompts. Ensure app integrity before installation.',
    patterns: [
      { key: 'beforeinstallprompt', pattern: 'window\\.addEventListener\\s*\\(\\s*["\']beforeinstallprompt["\']' },
      { key: 'deferred-install', pattern: 'deferredPrompt\\.prompt' }
    ]
  },
  {
    id: 'pwa-update-security',
    name: 'PWA Update Security',
    severity: 'Medium',
    description: 'Potential security issues with PWA update mechanism',
    recommendation: 'Validate updates from trusted sources. Implement proper update verification.',
    patterns: [
      { key: 'pwa-update-check', pattern: 'registration\\.update\\s*\\(\\s*\\)' },
      { key: 'pwa-new-version', pattern: 'registration\\.onupdatefound' }
    ]
  }
];

module.exports = pwaSecurityRules;