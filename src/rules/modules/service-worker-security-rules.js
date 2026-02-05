const serviceWorkerSecurityRules = [
  {
    id: 'sw-registration-context',
    name: 'Service Worker Registration in Non-Secure Context',
    severity: 'High',
    description: 'Service Worker registered in non-secure context (HTTP instead of HTTPS)',
    recommendation: 'Register Service Workers only in secure contexts (HTTPS). Service Workers should be registered over HTTPS to prevent interception and tampering.',
    patterns: [
      { key: 'sw-register-http', pattern: 'navigator\\.serviceWorker\\.register\\s*\\(\\s*["\'][^"\']*http://[^"\']*["\']' }
    ]
  },
  {
    id: 'sw-cache-poisoning',
    name: 'Potential Service Worker Cache Poisoning',
    severity: 'High',
    description: 'Service Worker may be vulnerable to cache poisoning attacks',
    recommendation: 'Validate and sanitize cached responses. Avoid caching untrusted content. Implement proper cache validation mechanisms.',
    patterns: [
      { key: 'sw-cache-put', pattern: 'caches\\.open\\s*\\(.*\\.put\\s*\\(' },
      { key: 'sw-cache-add', pattern: 'caches\\.add\\s*\\(.*fetch' },
      { key: 'sw-cache-all', pattern: 'caches\\.addAll\\s*\\(\\s*\\[' }
    ]
  },
  {
    id: 'sw-request-interception',
    name: 'Service Worker Request Interception',
    severity: 'High',
    description: 'Service Worker intercepting sensitive requests',
    recommendation: 'Carefully validate intercepted requests. Ensure sensitive data is not exposed through Service Worker interception.',
    patterns: [
      { key: 'sw-fetch-event', pattern: 'self\\.addEventListener\\s*\\(\\s*["\']fetch["\']' },
      { key: 'sw-request-modify', pattern: 'event\\.request\\s*=|event\\.respondWith' }
    ]
  },
  {
    id: 'sw-update-security',
    name: 'Service Worker Update Security',
    severity: 'Medium',
    description: 'Potential security issues in Service Worker update process',
    recommendation: 'Ensure Service Worker updates are validated and come from trusted sources. Implement proper update verification.',
    patterns: [
      { key: 'sw-update', pattern: 'updateViaCache|forceUpdateOnLoad' }
    ]
  },
  {
    id: 'sw-scope-escalation',
    name: 'Service Worker Scope Escalation',
    severity: 'High',
    description: 'Service Worker registered with overly broad scope',
    recommendation: 'Register Service Workers with minimal required scope to limit their reach and impact.',
    patterns: [
      { key: 'sw-broad-scope', pattern: 'navigator\\.serviceWorker\\.register\\s*\\(.*scope:\\s*["\']/["\']' }
    ]
  },
  {
    id: 'sw-sync-security',
    name: 'Service Worker Background Sync Security',
    severity: 'Medium',
    description: 'Potential security issues with background sync operations',
    recommendation: 'Validate data synced in background. Ensure sensitive data is properly protected during sync operations.',
    patterns: [
      { key: 'sw-background-sync', pattern: 'sync\\.register|periodicSync\\.register' }
    ]
  },
  {
    id: 'sw-message-security',
    name: 'Service Worker Message Security',
    severity: 'Medium',
    description: 'Potential security issues with Service Worker messaging',
    recommendation: 'Validate and sanitize messages sent to/from Service Workers. Implement proper origin verification.',
    patterns: [
      { key: 'sw-postmessage', pattern: 'controller\\.postMessage|navigator\\.serviceWorker\\.controller' },
      { key: 'sw-message-listener', pattern: 'self\\.addEventListener\\s*\\(\\s*["\']message["\']' }
    ]
  }
];

module.exports = serviceWorkerSecurityRules;