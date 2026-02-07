const vueI18nDeepSecurityRules = [
  {
    id: 'vue-i18n-injection',
    name: 'Vue i18n Message Injection',
    severity: 'High',
    description: 'Vue i18n message injection vulnerability',
    recommendation: 'Validate and sanitize i18n message keys and parameters. Use proper escaping for message content.',
    patterns: [
      { key: 'i18n-variable', pattern: '\\$t\\s*\\(\\s*[^"\'`][^)]*\\)' },
      { key: 'i18n-template', pattern: '\\$t\\s*\\(\\s*`[^`]*\\\\\\$\\{[^}]+\\}[^`]*`\\s*\\)' },
      { key: 'i18n-user-input', pattern: 't\\s*\\(\\s*[^"\'`][^)]*\\)' }
    ]
  },
  {
    id: 'vue-i18n-message-format',
    name: 'Vue i18n Message Format Security',
    severity: 'Medium',
    description: 'Potential security issues with i18n message formats',
    recommendation: 'Use safe message formats. Avoid raw HTML in messages. Validate message parameters.',
    patterns: [
      { key: 'i18n-html', pattern: '\\$t\\s*\\(\\s*[^)]*\\{[^}]*\\}[^)]*\\)' },
      { key: 'i18n-raw', pattern: '\\$t\\s*\\(\\s*[^)]*,\\s*\\{[^}]*raw:?\\s*true[^}]*\\}\\s*\\)' },
      { key: 'i18n-format', pattern: 'format\\s*\\(\\s*[^"\'`][^)]*\\)' }
    ]
  },
  {
    id: 'vue-i18n-locale-switching',
    name: 'Vue i18n Locale Switching Security',
    severity: 'Medium',
    description: 'Potential security issues with locale switching',
    recommendation: 'Validate locale values before switching. Use whitelisted locales only. Avoid user-controlled locale values.',
    patterns: [
      { key: 'locale-switch', pattern: 'locale\\s*=\\s*[^"\']+|setLocale\\s*\\(' },
      { key: 'locale-user-input', pattern: 'setLocale\\s*\\(\\s*[^"\'`][^)]*\\)' },
      { key: 'i18n-config', pattern: 'createI18n\\s*\\(\\s*\\{[^}]+\\}\\s*\\)' }
    ]
  },
  {
    id: 'vue-i18n-message-loading',
    name: 'Vue i18n Message Loading Security',
    severity: 'High',
    description: 'Potential security issues with dynamic message loading',
    recommendation: 'Validate message files before loading. Use static message files. Avoid loading messages from remote sources.',
    patterns: [
      { key: 'dynamic-message', pattern: 'loadMessages\\s*\\(|messages\\s*:?\\s*[^\\{]+' },
      { key: 'remote-message', pattern: 'import\\s*\\(\\s*[^"\'`][^)]*\\)\\s*.*messages' },
      { key: 'message-http', pattern: 'fetch\\s*\\(\\s*[^"\'`][^)]*\\)\\s*.*messages' }
    ]
  },
  {
    id: 'vue-i18n-pluralization',
    name: 'Vue i18n Pluralization Security',
    severity: 'Low',
    description: 'Potential security issues with i18n pluralization',
    recommendation: 'Validate pluralization parameters. Use safe pluralization rules. Avoid user-controlled pluralization values.',
    patterns: [
      { key: 'pluralization', pattern: '\\$t\\s*\\(\\s*[^)]*\\{[^}]*count[^}]*\\}[^)]*\\)' },
      { key: 'i18n-plural', pattern: 'plural\\s*:|n\\s*:' },
      { key: 'plural-user-input', pattern: 'count\\s*:?\\s*[^"\'`]+' }
    ]
  },
  {
    id: 'vue-i18n-date-format',
    name: 'Vue i18n Date Format Security',
    severity: 'Low',
    description: 'Potential security issues with i18n date formatting',
    recommendation: 'Validate date values before formatting. Use safe date formats. Avoid user-controlled date format strings.',
    patterns: [
      { key: 'date-format', pattern: 'formatDate\\s*\\(|\\$d\\s*\\(' },
      { key: 'date-user-input', pattern: 'formatDate\\s*\\(\\s*[^"\'`][^,]+,[^"\'`][^)]*\\)' },
      { key: 'time-format', pattern: 'formatTime\\s*\\(|\\$t\\s*\\(\\s*[^)]*time[^)]*\\)' }
    ]
  },
  {
    id: 'vue-i18n-number-format',
    name: 'Vue i18n Number Format Security',
    severity: 'Low',
    description: 'Potential security issues with i18n number formatting',
    recommendation: 'Validate number values before formatting. Use safe number formats. Avoid user-controlled number format strings.',
    patterns: [
      { key: 'number-format', pattern: 'formatNumber\\s*\\(|\\$n\\s*\\(' },
      { key: 'number-user-input', pattern: 'formatNumber\\s*\\(\\s*[^"\'`][^,]+,[^"\'`][^)]*\\)' },
      { key: 'currency-format', pattern: 'formatCurrency\\s*\\(|\\$t\\s*\\(\\s*[^)]*currency[^)]*\\)' }
    ]
  }
];

module.exports = vueI18nDeepSecurityRules;