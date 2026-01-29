const complianceSecurityRules = [
  {
    id: 'gdpr-compliance',
    name: 'GDPR Compliance',
    severity: 'High',
    description: 'Potential GDPR compliance issue',
    recommendation: 'Implement data minimization, purpose limitation, and user consent management. Provide data subject rights functionality.',
    patterns: [
      { key: 'gdpr', pattern: 'GDPR|General Data Protection Regulation|data protection|privacy' },
      { key: 'personal-data', pattern: 'personal data|personal information|PII|personally identifiable information' }
    ]
  },
  {
    id: 'ccpa-compliance',
    name: 'CCPA/CPRA Compliance',
    severity: 'High',
    description: 'Potential CCPA/CPRA compliance issue',
    recommendation: 'Implement consumer privacy rights. Provide opt-out mechanisms. Disclose data collection practices.',
    patterns: [
      { key: 'ccpa', pattern: 'CCPA|CPRA|California Consumer Privacy Act|California Privacy Rights Act' },
      { key: 'privacy', pattern: 'privacy|data collection|consumer rights' }
    ]
  },
  {
    id: 'hipaa-compliance',
    name: 'HIPAA Compliance',
    severity: 'Critical',
    description: 'Potential HIPAA compliance issue',
    recommendation: 'Implement safeguards for protected health information (PHI). Use encryption for PHI. Train employees on HIPAA requirements.',
    patterns: [
      { key: 'hipaa', pattern: 'HIPAA|Health Insurance Portability and Accountability Act' },
      { key: 'phi', pattern: 'PHI|protected health information|medical record|health data' }
    ]
  },
  {
    id: 'pci-dss-compliance',
    name: 'PCI DSS Compliance',
    severity: 'Critical',
    description: 'Potential PCI DSS compliance issue',
    recommendation: 'Implement PCI DSS requirements for payment card data. Use tokenization. Maintain secure systems and networks.',
    patterns: [
      { key: 'pci', pattern: 'PCI DSS|Payment Card Industry|credit card|debit card' },
      { key: 'card-data', pattern: 'card number|CVV|expiration date|payment data' }
    ]
  },
  {
    id: 'iso-27001-compliance',
    name: 'ISO 27001 Compliance',
    severity: 'Medium',
    description: 'Potential ISO 27001 compliance issue',
    recommendation: 'Implement information security management system (ISMS) based on ISO 27001 standards.',
    patterns: [
      { key: 'iso', pattern: 'ISO 27001|ISMS|information security management' },
      { key: 'security-policy', pattern: 'security policy|risk assessment|control objectives' }
    ]
  },
  {
    id: 'nist-compliance',
    name: 'NIST Compliance',
    severity: 'Medium',
    description: 'Potential NIST compliance issue',
    recommendation: 'Follow NIST cybersecurity framework guidelines. Implement security controls based on NIST standards.',
    patterns: [
      { key: 'nist', pattern: 'NIST|National Institute of Standards and Technology|cybersecurity framework' },
      { key: 'security-framework', pattern: 'security framework|security controls|risk management' }
    ]
  },
  {
    id: 'data-breach-notification',
    name: 'Data Breach Notification',
    severity: 'High',
    description: 'Potential data breach notification compliance issue',
    recommendation: 'Implement data breach detection and notification procedures. Comply with breach notification laws.',
    patterns: [
      { key: 'breach', pattern: 'data breach|security incident|breach notification' },
      { key: 'notification', pattern: 'notify|notification|breach report' }
    ]
  },
  {
    id: 'privacy-by-design',
    name: 'Privacy by Design',
    severity: 'Medium',
    description: 'Missing privacy by design principles',
    recommendation: 'Implement privacy by design principles. Consider privacy in system architecture and design.',
    patterns: [
      { key: 'privacy-design', pattern: 'privacy by design|privacy by default|privacy engineering' },
      { key: 'system-design', pattern: 'system design|architecture|software design' }
    ]
  },
  {
    id: 'consent-management',
    name: 'User Consent Management',
    severity: 'Medium',
    description: 'Potential user consent management issue',
    recommendation: 'Implement explicit user consent for data collection and processing. Provide granular consent options.',
    patterns: [
      { key: 'consent', pattern: 'consent|opt-in|opt-out|permission' },
      { key: 'data-collection', pattern: 'data collection|data processing|tracking' }
    ]
  },
  {
    id: 'data-retention',
    name: 'Data Retention Policy',
    severity: 'Medium',
    description: 'Missing or inadequate data retention policy',
    recommendation: 'Implement data retention policies. Automatically delete data when no longer needed.',
    patterns: [
      { key: 'retention', pattern: 'data retention|retention policy|data deletion' },
      { key: 'policy', pattern: 'policy|compliance|data management' }
    ]
  }
];

module.exports = complianceSecurityRules;