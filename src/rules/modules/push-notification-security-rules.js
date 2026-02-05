const pushNotificationSecurityRules = [
  {
    id: 'push-notification-config',
    name: 'Push Notification Configuration Security',
    severity: 'Medium',
    description: 'Potential security issues with push notification configuration',
    recommendation: 'Secure push notification endpoints. Validate subscription data. Use proper authentication for push services.',
    patterns: [
      { key: 'push-subscribe', pattern: 'subscription\\.endpoint' },
      { key: 'push-permission-request', pattern: 'PushManager\\.subscribe|notification\\.permission' }
    ]
  },
  {
    id: 'push-subscription-management',
    name: 'Push Subscription Management Security',
    severity: 'Medium',
    description: 'Potential security issues with push subscription management',
    recommendation: 'Secure push subscription endpoints. Validate and authenticate subscription data before sending notifications.',
    patterns: [
      { key: 'push-send-endpoint', pattern: 'fetch\\s*\\(\\s*subscription\\.endpoint' },
      { key: 'push-subscription-data', pattern: 'subscription\\.keys|subscription\\.endpoint' }
    ]
  },
  {
    id: 'push-payload-security',
    name: 'Push Payload Security',
    severity: 'High',
    description: 'Potential security issues with push notification payloads',
    recommendation: 'Sanitize and validate push notification payloads. Avoid including sensitive information in notifications.',
    patterns: [
      { key: 'push-payload-sensitive', pattern: 'payload:\\s*.*password|token|key|secret|auth|credential' },
      { key: 'push-body-sensitive', pattern: 'body:\\s*.*password|token|key|secret|auth|credential' }
    ]
  },
  {
    id: 'push-permission-persistence',
    name: 'Push Permission Persistence',
    severity: 'Low',
    description: 'Push permission persistence without user consent',
    recommendation: 'Respect user preferences and provide options to disable push notifications.',
    patterns: [
      { key: 'push-permission-storage', pattern: 'localStorage\\.setItem.*push|sessionStorage\\.setItem.*push' }
    ]
  }
];

module.exports = pushNotificationSecurityRules;