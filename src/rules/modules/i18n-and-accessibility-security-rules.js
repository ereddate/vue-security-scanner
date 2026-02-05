const i18nAndAccessibilitySecurityRules = [
  {
    id: 'i18n-implementation-security',
    name: 'i18n Implementation Security',
    severity: 'Medium',
    description: 'Internationalization implementation may have security vulnerabilities',
    recommendation: 'Review i18n implementation for security best practices.',
    patterns: [
      { key: 'i18n-config', pattern: 'i18n|vue-i18n|intl|internationalization' },
      { key: 'locale-config', pattern: 'locale|language|translation' }
    ]
  },
  {
    id: 'localization-string-security',
    name: 'Localization String Security',
    severity: 'Medium',
    description: 'Localization strings may have security vulnerabilities',
    recommendation: 'Ensure localization strings are properly sanitized.',
    patterns: [
      { key: 'localization-string', pattern: 't\(|$t\(|translate\(' },
      { key: 'locale-file', pattern: 'messages\\.js|locales|translations' }
    ]
  },
  {
    id: 'accessibility-security',
    name: 'Accessibility Security',
    severity: 'Low',
    description: 'Accessibility implementation may have security implications',
    recommendation: 'Review accessibility implementation for security best practices.',
    patterns: [
      { key: 'aria-attributes', pattern: 'aria-|role\\s*=\\s*[\"\'][^\"\']*[\"\\\']' },
      { key: 'accessibility-config', pattern: 'accessibility|a11y' }
    ]
  },
  {
    id: 'keyboard-navigation-security',
    name: 'Keyboard Navigation Security',
    severity: 'Low',
    description: 'Keyboard navigation implementation may have security implications',
    recommendation: 'Ensure keyboard navigation is properly implemented.',
    patterns: [
      { key: 'keyboard-event', pattern: 'keydown|keyup|keypress' },
      { key: 'tabindex', pattern: 'tabindex\\s*=\\s*[\"\'][^\"\']*[\"\\\']' }
    ]
  },
  {
    id: 'screen-reader-security',
    name: 'Screen Reader Security',
    severity: 'Low',
    description: 'Screen reader implementation may have security implications',
    recommendation: 'Ensure screen reader compatibility is properly implemented.',
    patterns: [
      { key: 'screen-reader-text', pattern: 'sr-only|screen\\s*reader\\s*only' },
      { key: 'aria-label', pattern: 'aria-label\\s*=\\s*[\"\'][^\"\']*[\"\\\']' }
    ]
  },
  {
    id: 'color-contrast-security',
    name: 'Color Contrast Security',
    severity: 'Low',
    description: 'Color contrast implementation may have security implications',
    recommendation: 'Ensure color contrast meets accessibility standards.',
    patterns: [
      { key: 'color-config', pattern: 'color|contrast|theme' },
      { key: 'css-color', pattern: '#[0-9a-fA-F]{3,6}|rgb\\(|rgba\\(' }
    ]
  },
  {
    id: 'font-size-security',
    name: 'Font Size Security',
    severity: 'Low',
    description: 'Font size implementation may have security implications',
    recommendation: 'Ensure font sizes are accessible and properly implemented.',
    patterns: [
      { key: 'font-size', pattern: 'font-size|text-size|rem|em|px' },
      { key: 'responsive-text', pattern: 'responsive\\s*text|text\\s*scale' }
    ]
  },
  {
    id: 'form-accessibility-security',
    name: 'Form Accessibility Security',
    severity: 'Medium',
    description: 'Form accessibility implementation may have security implications',
    recommendation: 'Ensure forms are accessible and properly implemented.',
    patterns: [
      { key: 'form-label', pattern: '<label|for\\s*=\\s*[\"\'][^\"\']*[\"\\\']' },
      { key: 'input-aria', pattern: 'aria-required|aria-invalid|aria-describedby' }
    ]
  },
  {
    id: 'media-accessibility-security',
    name: 'Media Accessibility Security',
    severity: 'Low',
    description: 'Media accessibility implementation may have security implications',
    recommendation: 'Ensure media elements are accessible and properly implemented.',
    patterns: [
      { key: 'alt-text', pattern: 'alt\\s*=\\s*[\"\'][^\"\']*[\"\\\']' },
      { key: 'captions', pattern: 'caption|subtitles|transcript' }
    ]
  },
  {
    id: 'responsive-design-security',
    name: 'Responsive Design Security',
    severity: 'Low',
    description: 'Responsive design implementation may have security implications',
    recommendation: 'Ensure responsive design is properly implemented.',
    patterns: [
      { key: 'media-query', pattern: '@media\\s*\(' },
      { key: 'responsive-config', pattern: 'responsive|mobile|tablet|desktop' }
    ]
  }
];

module.exports = i18nAndAccessibilitySecurityRules;