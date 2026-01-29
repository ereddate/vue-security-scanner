const cloudServiceRules = [
  {
    id: 'cloud-storage-security',
    name: 'Cloud Storage Security',
    severity: 'High',
    description: 'Potential cloud storage security issue',
    recommendation: 'Secure cloud storage buckets with proper access controls. Use encryption for sensitive data.',
    patterns: [
      { key: 'cloud-storage', pattern: 'S3|s3|Blob|blob|Storage|storage|Bucket|bucket' },
      { key: 'public-access', pattern: 'public|publicAccess|public-read|public-write' }
    ]
  },
  {
    id: 'cloud-function-security',
    name: 'Cloud Function Security',
    severity: 'High',
    description: 'Potential cloud function security issue',
    recommendation: 'Implement proper authentication and authorization for cloud functions. Validate all inputs.',
    patterns: [
      { key: 'cloud-function', pattern: 'Function|function|Lambda|lambda|Serverless|serverless' },
      { key: 'function-trigger', pattern: 'trigger|event|http|webhook' }
    ]
  },
  {
    id: 'cloud-identity-security',
    name: 'Cloud Identity Security',
    severity: 'Critical',
    description: 'Potential cloud identity and access management security issue',
    recommendation: 'Implement least privilege principle. Rotate access keys regularly. Use temporary credentials.',
    patterns: [
      { key: 'iam', pattern: 'IAM|iam|Identity|identity|Access|access|Role|role|Policy|policy' },
      { key: 'access-key', pattern: 'AccessKey|accessKey|SecretKey|secretKey|APIKey|apiKey' }
    ]
  },
  {
    id: 'cloud-database-security',
    name: 'Cloud Database Security',
    severity: 'High',
    description: 'Potential cloud database security issue',
    recommendation: 'Secure cloud databases with proper access controls. Enable encryption at rest and in transit.',
    patterns: [
      { key: 'cloud-db', pattern: 'RDS|rds|DynamoDB|dynamodb|CosmosDB|cosmosdb|Firestore|firestore|CloudSQL|cloudsql' },
      { key: 'db-access', pattern: 'connection|connect|database|db|sql|nosql' }
    ]
  },
  {
    id: 'cloud-network-security',
    name: 'Cloud Network Security',
    severity: 'Medium',
    description: 'Potential cloud network security issue',
    recommendation: 'Implement proper network segmentation. Use VPCs, security groups, and network ACLs.',
    patterns: [
      { key: 'cloud-network', pattern: 'VPC|vpc|SecurityGroup|securityGroup|Network|network|Subnet|subnet' },
      { key: 'firewall', pattern: 'Firewall|firewall|ACL|acl|Whitelist|whitelist|Blacklist|blacklist' }
    ]
  },
  {
    id: 'cloud-monitoring-security',
    name: 'Cloud Monitoring Security',
    severity: 'Medium',
    description: 'Potential cloud monitoring security issue',
    recommendation: 'Implement proper monitoring and logging. Set up alerts for security events.',
    patterns: [
      { key: 'cloud-monitoring', pattern: 'CloudWatch|cloudwatch|Monitoring|monitoring|Logging|logging|Alert|alert' },
      { key: 'audit', pattern: 'Audit|audit|Compliance|compliance|Trail|trail' }
    ]
  },
  {
    id: 'cloud-secret-management',
    name: 'Cloud Secret Management',
    severity: 'Critical',
    description: 'Potential cloud secret management security issue',
    recommendation: 'Use cloud secret management services. Avoid hardcoding secrets in code or configuration.',
    patterns: [
      { key: 'secret-manager', pattern: 'SecretManager|secretManager|Vault|vault|KeyVault|keyVault|Secrets|secrets' },
      { key: 'hardcoded-secret', pattern: 'password|token|key|secret|auth|credential' }
    ]
  },
  {
    id: 'cloud-deployment-security',
    name: 'Cloud Deployment Security',
    severity: 'Medium',
    description: 'Potential cloud deployment security issue',
    recommendation: 'Implement secure deployment practices. Use infrastructure as code with proper security controls.',
    patterns: [
      { key: 'cloud-deployment', pattern: 'CloudFormation|cloudformation|Terraform|terraform|Deployment|deployment|Infrastructure|infrastructure' },
      { key: 'ci-cd', pattern: 'CI|CD|Jenkins|GitHub Actions|GitLab CI|CircleCI' }
    ]
  },
  {
    id: 'cloud-service-account-security',
    name: 'Cloud Service Account Security',
    severity: 'High',
    description: 'Potential cloud service account security issue',
    recommendation: 'Use service accounts with least privilege. Rotate service account keys regularly.',
    patterns: [
      { key: 'service-account', pattern: 'ServiceAccount|serviceAccount|Service|service|Account|account' },
      { key: 'key-file', pattern: 'key.json|credentials.json|service-account.json' }
    ]
  },
  {
    id: 'cloud-resource-security',
    name: 'Cloud Resource Security',
    severity: 'Medium',
    description: 'Potential cloud resource security issue',
    recommendation: 'Monitor and secure all cloud resources. Remove unused resources. Implement resource tagging.',
    patterns: [
      { key: 'cloud-resource', pattern: 'Resource|resource|Instance|instance|VM|vm|Container|container' },
      { key: 'tagging', pattern: 'Tag|tag|Label|label|Metadata|metadata' }
    ]
  }
];

module.exports = cloudServiceRules;