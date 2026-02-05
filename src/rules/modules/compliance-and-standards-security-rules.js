const complianceAndStandardsSecurityRules = [
  {
    id: 'owasp-compliance',
    name: 'OWASP Compliance',
    severity: 'Medium',
    description: 'Application may not comply with OWASP security standards',
    recommendation: 'Ensure application complies with OWASP security standards.',
    patterns: [
      { key: 'owasp', pattern: 'owasp|Open\\s*Web\\s*Application\\s*Security\\s*Project' },
      { key: 'owasp-top-10', pattern: 'top\\s*10|injection|broken\\s*auth|sensitive\\s*data|xml\\s*external\\s*entities|broken\\s*access\\s*control|security\\s*misconfiguration|cross\\s*site\\s*scripting|insecure\\s*deserialization|using\\s*components\\s*with\\s*known\\s*vulnerabilities|insufficient\\s*logging\\s*and\\s*monitoring' }
    ]
  },
  {
    id: 'gdpr-compliance',
    name: 'GDPR Compliance',
    severity: 'Medium',
    description: 'Application may not comply with GDPR requirements',
    recommendation: 'Ensure application complies with GDPR requirements.',
    patterns: [
      { key: 'gdpr', pattern: 'gdpr|General\\s*Data\\s*Protection\\s*Regulation' },
      { key: 'data-processing', pattern: 'data\\s*processing|data\\s*controller|data\\s*processor' },
      { key: 'consent', pattern: 'consent|opt\\s*in|opt\\s*out' }
    ]
  },
  {
    id: 'ccpa-compliance',
    name: 'CCPA Compliance',
    severity: 'Medium',
    description: 'Application may not comply with CCPA requirements',
    recommendation: 'Ensure application complies with CCPA requirements.',
    patterns: [
      { key: 'ccpa', pattern: 'ccpa|California\\s*Consumer\\s*Privacy\\s*Act' },
      { key: 'privacy-rights', pattern: 'privacy\\s*rights|do\\s*not\\s*sell\\s*my\\s*personal\\s*information' }
    ]
  },
  {
    id: 'iso-27001-compliance',
    name: 'ISO 27001 Compliance',
    severity: 'Medium',
    description: 'Application may not comply with ISO 27001 requirements',
    recommendation: 'Ensure application complies with ISO 27001 requirements.',
    patterns: [
      { key: 'iso-27001', pattern: 'iso\\s*27001|information\\s*security\\s*management' },
      { key: 'risk-assessment', pattern: 'risk\\s*assessment|risk\\s*management' }
    ]
  },
  {
    id: 'nist-compliance',
    name: 'NIST Compliance',
    severity: 'Medium',
    description: 'Application may not comply with NIST requirements',
    recommendation: 'Ensure application complies with NIST requirements.',
    patterns: [
      { key: 'nist', pattern: 'nist|National\\s*Institute\\s*of\\s*Standards\\s*and\\s*Technology' },
      { key: 'cybersecurity-framework', pattern: 'cybersecurity\\s*framework|nist\\s*framework' }
    ]
  },
  {
    id: 'security-policy-compliance',
    name: 'Security Policy Compliance',
    severity: 'Medium',
    description: 'Application may not comply with organizational security policies',
    recommendation: 'Ensure application complies with organizational security policies.',
    patterns: [
      { key: 'security-policy', pattern: 'security\\s*policy|security\\s*guideline|security\\s*standard' },
      { key: 'policy-compliance', pattern: 'compliance|audit|assessment' }
    ]
  },
  {
    id: 'industry-specific-compliance',
    name: 'Industry-Specific Compliance',
    severity: 'Medium',
    description: 'Application may not comply with industry-specific requirements',
    recommendation: 'Ensure application complies with industry-specific requirements.',
    patterns: [
      { key: 'industry-compliance', pattern: 'pci\\s*dss|hipaa|sox|financial\\s*industry|healthcare\\s*industry|government\\s*industry' },
      { key: 'regulatory-compliance', pattern: 'regulatory|compliance|standard' }
    ]
  },
  {
    id: 'vue-security-best-practices',
    name: 'Vue Security Best Practices',
    severity: 'Medium',
    description: 'Application may not follow Vue security best practices',
    recommendation: 'Ensure application follows Vue security best practices.',
    patterns: [
      { key: 'vue-best-practices', pattern: 'vue\\s*best\\s*practices|vue\\s*security' },
      { key: 'vue-official-docs', pattern: 'vuejs\\.org|vue\\s*documentation' }
    ]
  },
  {
    id: 'security-audit-compliance',
    name: 'Security Audit Compliance',
    severity: 'Medium',
    description: 'Application may not pass security audits',
    recommendation: 'Ensure application passes security audits.',
    patterns: [
      { key: 'security-audit', pattern: 'security\\s*audit|penetration\\s*test|vulnerability\\s*scan' },
      { key: 'audit-finding', pattern: 'finding|issue|vulnerability|remediation' }
    ]
  },
  {
    id: 'security-training-compliance',
    name: 'Security Training Compliance',
    severity: 'Low',
    description: 'Development team may not be trained in security best practices',
    recommendation: 'Ensure development team is trained in security best practices.',
    patterns: [
      { key: 'security-training', pattern: 'security\\s*training|security\\s*awareness' },
      { key: 'security-certification', pattern: 'security\\s*certification|certified\\s*security\\s*professional' }
    ]
  }
];

module.exports = complianceAndStandardsSecurityRules;