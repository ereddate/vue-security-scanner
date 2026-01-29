const businessLogicSecurityRules = [
  {
    id: 'business-flow-bypass',
    name: 'Business Flow Bypass',
    severity: 'High',
    description: 'Potential business flow bypass vulnerability',
    recommendation: 'Implement server-side validation of business processes. Use state machines for complex workflows. Verify all steps in business processes.',
    patterns: [
      { key: 'flow-bypass', pattern: 'skip|bypass|jump|skipStep|bypassStep|direct|shortcut' },
      { key: 'business-process', pattern: 'process|workflow|step|stage|status|state' }
    ]
  },
  {
    id: 'business-logic-privilege-escalation',
    name: 'Business Logic Privilege Escalation',
    severity: 'Critical',
    description: 'Potential business logic privilege escalation vulnerability',
    recommendation: 'Implement proper authorization checks for all business operations. Use role-based access control. Validate user permissions at every stage.',
    patterns: [
      { key: 'privilege', pattern: 'admin|superuser|root|elevated|privilege|permission|role' },
      { key: 'escalation', pattern: 'escalate|promote|upgrade|grant|assign|changeRole' }
    ]
  },
  {
    id: 'data-validation',
    name: 'Business Data Validation',
    severity: 'High',
    description: 'Missing or inadequate business data validation',
    recommendation: 'Implement comprehensive data validation for all business inputs. Validate data types, ranges, formats, and business rules.',
    patterns: [
      { key: 'validation', pattern: 'validate|validation|check|verify|sanitize' },
      { key: 'business-data', pattern: 'price|quantity|amount|discount|total|order|payment|user' }
    ]
  },
  {
    id: 'business-logic-vulnerability',
    name: 'Generic Business Logic Vulnerability',
    severity: 'Medium',
    description: 'Potential business logic vulnerability',
    recommendation: 'Review business logic for security issues. Test edge cases and unusual input combinations. Implement defensive programming practices.',
    patterns: [
      { key: 'business-logic', pattern: 'business logic|business rule|business process|workflow' },
      { key: 'vulnerability', pattern: 'vulnerability|issue|problem|bug|exploit' }
    ]
  },
  {
    id: 'business-rule-violation',
    name: 'Business Rule Violation',
    severity: 'Medium',
    description: 'Potential business rule violation',
    recommendation: 'Implement server-side enforcement of business rules. Validate all business operations against defined rules.',
    patterns: [
      { key: 'rule', pattern: 'rule|policy|regulation|requirement|constraint' },
      { key: 'violation', pattern: 'violate|bypass|circumvent|ignore|override' }
    ]
  },
  {
    id: 'resource-exhaustion',
    name: 'Business Logic Resource Exhaustion',
    severity: 'Medium',
    description: 'Potential resource exhaustion via business logic',
    recommendation: 'Implement rate limiting for business operations. Set reasonable limits on resource usage. Monitor for unusual activity patterns.',
    patterns: [
      { key: 'resource', pattern: 'resource|limit|quota|throttle|rate|usage' },
      { key: 'exhaustion', pattern: 'exhaust|deplete|consume|max|overflow' }
    ]
  },
  {
    id: 'concurrency-issue',
    name: 'Business Logic Concurrency Issue',
    severity: 'Medium',
    description: 'Potential concurrency issue in business logic',
    recommendation: 'Implement proper concurrency control. Use transactions for critical operations. Handle race conditions gracefully.',
    patterns: [
      { key: 'concurrency', pattern: 'concurrent|parallel|simultaneous|race|transaction' },
      { key: 'business-operation', pattern: 'operation|update|modify|delete|create' }
    ]
  },
  {
    id: 'transaction-management',
    name: 'Transaction Management Issue',
    severity: 'High',
    description: 'Potential transaction management issue',
    recommendation: 'Use atomic transactions for critical business operations. Implement proper error handling and rollback mechanisms.',
    patterns: [
      { key: 'transaction', pattern: 'transaction|atomic|rollback|commit|begin|end' },
      { key: 'management', pattern: 'management|control|coordination|synchronization' }
    ]
  },
  {
    id: 'business-data-leakage',
    name: 'Business Data Leakage',
    severity: 'High',
    description: 'Potential business data leakage',
    recommendation: 'Implement proper data access controls. Encrypt sensitive business data. Audit access to critical business information.',
    patterns: [
      { key: 'data-leakage', pattern: 'leak|expose|reveal|disclose|dump|log' },
      { key: 'business-data', pattern: 'customer|client|user|account|financial|personal|confidential' }
    ]
  },
  {
    id: 'business-logic-backdoor',
    name: 'Business Logic Backdoor',
    severity: 'Critical',
    description: 'Potential business logic backdoor',
    recommendation: 'Review code for unauthorized access mechanisms. Implement code reviews and security scanning. Remove all backdoors and debugging endpoints.',
    patterns: [
      { key: 'backdoor', pattern: 'backdoor|secret|hidden|debug|test|admin|bypass' },
      { key: 'access', pattern: 'access|entry|login|authenticate|authorize' }
    ]
  }
];

module.exports = businessLogicSecurityRules;