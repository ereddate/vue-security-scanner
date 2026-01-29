const securityMonitoringRules = [
  {
    id: 'security-event-monitoring',
    name: 'Security Event Monitoring',
    severity: 'Medium',
    description: 'Missing or inadequate security event monitoring',
    recommendation: 'Implement comprehensive security event monitoring. Log all security-relevant events. Use a SIEM solution for centralized logging.',
    patterns: [
      { key: 'security-event', pattern: 'security event|security incident|breach|attack|intrusion' },
      { key: 'monitoring', pattern: 'monitor|monitoring|detect|detection|alert|alerting' }
    ]
  },
  {
    id: 'security-logging',
    name: 'Security Logging',
    severity: 'Medium',
    description: 'Missing or inadequate security logging',
    recommendation: 'Implement comprehensive security logging. Log authentication events, access control decisions, and security-relevant operations.',
    patterns: [
      { key: 'logging', pattern: 'log|logging|logger|audit|audit trail' },
      { key: 'security-operation', pattern: 'authenticate|authorize|access|modify|delete|create' }
    ]
  },
  {
    id: 'security-alerting',
    name: 'Security Alerting',
    severity: 'Medium',
    description: 'Missing or inadequate security alerting',
    recommendation: 'Implement security alerting for critical events. Configure alert thresholds and escalation paths. Test alerting mechanisms regularly.',
    patterns: [
      { key: 'alerting', pattern: 'alert|alerting|notification|notify|escalation' },
      { key: 'security-event', pattern: 'security event|incident|breach|attack' }
    ]
  },
  {
    id: 'incident-response',
    name: 'Incident Response',
    severity: 'Medium',
    description: 'Missing or inadequate incident response procedures',
    recommendation: 'Develop and test incident response procedures. Establish an incident response team. Create an incident response playbook.',
    patterns: [
      { key: 'incident', pattern: 'incident|incident response|breach response|security incident' },
      { key: 'response', pattern: 'response|procedure|playbook|plan|team' }
    ]
  },
  {
    id: 'security-monitoring-tools',
    name: 'Security Monitoring Tools',
    severity: 'Low',
    description: 'Missing or inadequate security monitoring tools',
    recommendation: 'Deploy security monitoring tools. Use SIEM, IDS/IPS, and endpoint detection solutions. Integrate tools with existing systems.',
    patterns: [
      { key: 'monitoring-tool', pattern: 'SIEM|IDS|IPS|EDR|endpoint detection|security monitoring|log management' },
      { key: 'tool-deployment', pattern: 'deploy|implement|install|configure|integrate' }
    ]
  },
  {
    id: 'security-metrics',
    name: 'Security Metrics',
    severity: 'Low',
    description: 'Missing or inadequate security metrics',
    recommendation: 'Define and track security metrics. Measure security posture over time. Use metrics to drive security improvements.',
    patterns: [
      { key: 'metrics', pattern: 'metric|metrics|measure|measurement|KPI|key performance indicator' },
      { key: 'security-metric', pattern: 'security metric|security posture|security score|incident count' }
    ]
  },
  {
    id: 'security-dashboard',
    name: 'Security Dashboard',
    severity: 'Low',
    description: 'Missing or inadequate security dashboard',
    recommendation: 'Implement security dashboards for visibility. Display key security metrics and alerts. Use dashboards for security reporting.',
    patterns: [
      { key: 'dashboard', pattern: 'dashboard|dashboarding|visualization|monitoring dashboard' },
      { key: 'security-data', pattern: 'security data|security metrics|security alerts' }
    ]
  },
  {
    id: 'security-auditing',
    name: 'Security Auditing',
    severity: 'Medium',
    description: 'Missing or inadequate security auditing',
    recommendation: 'Conduct regular security audits. Test security controls and procedures. Document audit findings and remediation plans.',
    patterns: [
      { key: 'audit', pattern: 'audit|auditing|security audit|compliance audit' },
      { key: 'audit-procedure', pattern: 'procedure|test|assess|evaluate|review' }
    ]
  },
  {
    id: 'security-incident-simulation',
    name: 'Security Incident Simulation',
    severity: 'Low',
    description: 'Missing or inadequate security incident simulation',
    recommendation: 'Conduct regular security incident simulations. Test incident response procedures. Use simulations to improve security readiness.',
    patterns: [
      { key: 'simulation', pattern: 'simulate|simulation|tabletop|exercise|drill' },
      { key: 'incident', pattern: 'incident|security incident|breach|attack' }
    ]
  },
  {
    id: 'security-response-automation',
    name: 'Security Response Automation',
    severity: 'Low',
    description: 'Missing or inadequate security response automation',
    recommendation: 'Implement security response automation. Automate routine security tasks. Use playbooks for consistent response.',
    patterns: [
      { key: 'automation', pattern: 'automate|automation|script|playbook|workflow' },
      { key: 'response', pattern: 'response|incident response|security response|remediation' }
    ]
  }
];

module.exports = securityMonitoringRules;