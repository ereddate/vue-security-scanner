const securityRules = require('../src/rules/security-rules');

console.log('Vue Security Scanner - Rule Engine Test');
console.log('====================================\n');

console.log(`Total rules loaded: ${securityRules.length}\n`);

const testContent = `
import dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: process.env.API_KEY || 'default-api-key-12345',
  secret: process.env.SECRET || 'default-secret-abc123',
  password: process.env.PASSWORD || '123456',
  token: process.env.TOKEN || 'default-token-xyz789'
};

console.log('Config:', process.env);
console.log('API Key:', process.env.API_KEY);
`;

const envRuleIds = [
  'env-file-exposed',
  'env-sensitive-data',
  'env-client-exposure',
  'env-default-sensitive',
  'env-logging'
];

console.log('Testing environment variable rules...\n');

let matchesFound = 0;

for (const rule of securityRules) {
  if (envRuleIds.includes(rule.id)) {
    console.log(`\nTesting rule: ${rule.id} (${rule.name})`);
    console.log(`Severity: ${rule.severity}`);
    console.log(`Patterns: ${rule.patterns.length}`);
    
    for (const patternConfig of rule.patterns) {
      const { key, pattern, flags } = patternConfig;
      const regex = new RegExp(pattern, flags || 'gi');
      const matches = testContent.match(regex);
      
      if (matches) {
        console.log(`  ✓ Pattern '${key}' matched: ${matches.length} times`);
        matchesFound++;
        matches.slice(0, 2).forEach(match => {
          console.log(`    - "${match.substring(0, 50)}..."`);
        });
      } else {
        console.log(`  ✗ Pattern '${key}' no match`);
      }
    }
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Total matches found: ${matchesFound}`);
console.log(`Rules tested: ${envRuleIds.length}`);
console.log(`Rules with matches: ${matchesFound > 0 ? 'Yes' : 'No'}`);
