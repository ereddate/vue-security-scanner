const typescriptVueIntegrationSecurityRules = [
  {
    id: 'typescript-type-safety',
    name: 'TypeScript Type Security',
    severity: 'High',
    description: 'TypeScript type safety issues that may lead to security vulnerabilities',
    recommendation: 'Avoid using "any" type and unsafe type assertions. Use proper type guards.',
    patterns: [
      { key: 'any-type', pattern: ':\s*any\b|as\s+any' },
      { key: 'unsafe-assertion', pattern: 'as\s+(string|number|boolean)\b' },
      { key: 'type-cast', pattern: '<string>|<number>|<boolean>' }
    ]
  },
  {
    id: 'typescript-any-usage',
    name: 'TypeScript Any Type Usage',
    severity: 'High',
    description: 'Usage of "any" type that can bypass TypeScript security checks',
    recommendation: 'Replace "any" type with specific types or union types. Use type guards for runtime validation.',
    patterns: [
      { key: 'any-variable', pattern: 'let\s+\w+\s*:\s*any' },
      { key: 'any-function', pattern: 'function\s+\w+\s*\([^)]*:\s*any[^)]*\)' },
      { key: 'any-return', pattern: 'function\s+\w+\s*\([^)]*\)\s*:\s*any' }
    ]
  },
  {
    id: 'typescript-type-assertion',
    name: 'TypeScript Unsafe Type Assertion',
    severity: 'High',
    description: 'Unsafe type assertions that may lead to runtime errors and security issues',
    recommendation: 'Use safe type guards instead of direct type assertions. Validate data at runtime.',
    patterns: [
      { key: 'as-assertion', pattern: 'as\s+[^\s]+' },
      { key: 'angle-bracket', pattern: '<[^>]+>\s*[^\s]' }
    ]
  },
  {
    id: 'typescript-type-conversion',
    name: 'TypeScript Type Conversion Security',
    severity: 'Medium',
    description: 'Potential security issues with type conversions',
    recommendation: 'Validate and sanitize input before type conversion. Use type guards for safe conversions.',
    patterns: [
      { key: 'parse-int', pattern: 'parseInt\s*\(' },
      { key: 'parse-float', pattern: 'parseFloat\s*\(' },
      { key: 'number-conversion', pattern: 'Number\s*\(' },
      { key: 'string-conversion', pattern: 'String\s*\(' }
    ]
  },
  {
    id: 'typescript-interface-security',
    name: 'TypeScript Interface Security',
    severity: 'Medium',
    description: 'TypeScript interface security issues',
    recommendation: 'Define strict interfaces with proper type constraints. Avoid optional properties for security-critical fields.',
    patterns: [
      { key: 'interface-def', pattern: 'interface\s+\w+' },
      { key: 'optional-property', pattern: '\w+\s*\?\s*:' }
    ]
  },
  {
    id: 'typescript-enum-security',
    name: 'TypeScript Enum Security',
    severity: 'Low',
    description: 'TypeScript enum security issues',
    recommendation: 'Use const enums or union types instead of regular enums for better type safety.',
    patterns: [
      { key: 'enum-def', pattern: 'enum\s+\w+' }
    ]
  },
  {
    id: 'typescript-generic-security',
    name: 'TypeScript Generic Security',
    severity: 'Medium',
    description: 'TypeScript generic type security issues',
    recommendation: 'Use generic constraints to ensure type safety. Avoid generic types that can accept any type.',
    patterns: [
      { key: 'generic-type', pattern: '<\w+>' },
      { key: 'generic-constraint', pattern: '<\w+\s*extends\s*\w+>' }
    ]
  },
  {
    id: 'typescript-nullish-coalescing',
    name: 'TypeScript Nullish Coalescing Security',
    severity: 'Low',
    description: 'Potential security issues with nullish coalescing',
    recommendation: 'Validate default values in nullish coalescing expressions. Avoid using user input as defaults.',
    patterns: [
      { key: 'nullish-coalescing', pattern: '\?\?\s*[^;]+' }
    ]
  }
];

module.exports = typescriptVueIntegrationSecurityRules;