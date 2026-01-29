const containerSecurityRules = [
  {
    id: 'container-image-security',
    name: 'Container Image Security',
    severity: 'High',
    description: 'Potential container image security issue',
    recommendation: 'Use official base images. Scan images for vulnerabilities. Implement image signing and verification.',
    patterns: [
      { key: 'dockerfile', pattern: 'FROM\\s+[^\\s]+' },
      { key: 'image-reference', pattern: 'docker.io|gcr.io|ecr\\.aws|quay\\.io' }
    ]
  },
  {
    id: 'container-run-as-root',
    name: 'Container Running as Root',
    severity: 'High',
    description: 'Container running as root user',
    recommendation: 'Run containers as non-root users. Use USER directive in Dockerfile.',
    patterns: [
      { key: 'run-as-root', pattern: 'USER\\s+root|USER\\s+0' },
      { key: 'dockerfile', pattern: 'FROM\\s+[^\\s]+' }
    ]
  },
  {
    id: 'container-privileged',
    name: 'Privileged Container',
    severity: 'Critical',
    description: 'Container running in privileged mode',
    recommendation: 'Avoid running containers in privileged mode. Use specific capabilities instead.',
    patterns: [
      { key: 'privileged', pattern: 'privileged:\\s*true|--privileged' },
      { key: 'docker-run', pattern: 'docker\\s+run' }
    ]
  },
  {
    id: 'container-capabilities',
    name: 'Excessive Container Capabilities',
    severity: 'High',
    description: 'Container with excessive Linux capabilities',
    recommendation: 'Limit container capabilities to only those needed. Use --cap-drop=ALL and --cap-add= necessary capabilities.',
    patterns: [
      { key: 'capabilities', pattern: 'cap-add|--cap-add|CAP_\\w+' },
      { key: 'docker-run', pattern: 'docker\\s+run' }
    ]
  },
  {
    id: 'container-network-security',
    name: 'Container Network Security',
    severity: 'Medium',
    description: 'Potential container network security issue',
    recommendation: 'Use network segmentation. Avoid host networking. Implement network policies.',
    patterns: [
      { key: 'network', pattern: 'network:\\s*host|--network=host|hostNetwork:\\s*true' },
      { key: 'docker-run', pattern: 'docker\\s+run' }
    ]
  },
  {
    id: 'container-volume-security',
    name: 'Container Volume Security',
    severity: 'High',
    description: 'Potential container volume security issue',
    recommendation: 'Use named volumes. Avoid host mounts. Implement volume permissions.',
    patterns: [
      { key: 'volume', pattern: 'volume:\\s*[^\\s]+|--volume=|--mount=|volumes:\\s*[\'\"]\'\\s*:' }
    ]
  },
  {
    id: 'container-resource-limits',
    name: 'Container Resource Limits',
    severity: 'Medium',
    description: 'Container missing resource limits',
    recommendation: 'Set resource limits (CPU, memory) for containers to prevent DoS attacks.',
    patterns: [
      { key: 'resource-limits', pattern: 'cpu:\\s*|memory:\\s*|--cpus=|--memory=' },
      { key: 'docker-run', pattern: 'docker\\s+run' }
    ]
  },
  {
    id: 'container-readonly-filesystem',
    name: 'Container Read-Only Filesystem',
    severity: 'Medium',
    description: 'Container not using read-only filesystem',
    recommendation: 'Use read-only filesystem for containers when possible. Use --read-only flag.',
    patterns: [
      { key: 'readonly', pattern: 'readOnly:\\s*true|--read-only' },
      { key: 'docker-run', pattern: 'docker\\s+run' }
    ]
  },
  {
    id: 'container-healthcheck',
    name: 'Container Health Check',
    severity: 'Low',
    description: 'Container missing health check',
    recommendation: 'Implement health checks for containers to ensure proper monitoring.',
    patterns: [
      { key: 'healthcheck', pattern: 'HEALTHCHECK|healthcheck:\\s*' },
      { key: 'dockerfile', pattern: 'FROM\\s+[^\\s]+' }
    ]
  },
  {
    id: 'container-orchestration-security',
    name: 'Container Orchestration Security',
    severity: 'Medium',
    description: 'Potential container orchestration security issue',
    recommendation: 'Secure Kubernetes clusters. Implement RBAC. Use secrets management. Apply network policies.',
    patterns: [
      { key: 'orchestration', pattern: 'Kubernetes|kubernetes|Docker Swarm|docker swarm|compose|Compose' },
      { key: 'kubernetes', pattern: 'pod|deployment|service|configmap|secret' }
    ]
  }
];

module.exports = containerSecurityRules;