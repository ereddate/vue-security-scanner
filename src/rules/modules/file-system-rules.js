const fileSystemRules = [
  {
    id: 'file-system-command-injection',
    name: 'Command Injection',
    severity: 'Critical',
    description: 'Potential command injection vulnerability',
    recommendation: 'Never execute commands with user input. Use safe APIs instead.',
    patterns: [
      { key: 'exec-sync', pattern: 'execSync\\s*\\(|exec\\s*\\(\\s*["\']' },
      { key: 'spawn-sync', pattern: 'spawnSync\\s*\\(|spawn\\s*\\(\\s*["\']' },
      { key: 'child-process', pattern: 'child_process\\.(exec|spawn)\\s*\\(' }
    ]
  },
  {
    id: 'path-traversal',
    name: 'Path Traversal',
    severity: 'High',
    description: 'Potential path traversal vulnerability',
    recommendation: 'Validate and sanitize file paths. Use path.join() and avoid user input in paths.',
    patterns: [
      { key: 'path-traversal', pattern: '\\.\\.\\/|\\.\\.\\\\|%2e%2e%2f|%2e%2e%5c' },
      { key: 'path-concat', pattern: 'path\\s*\\+\\s*req\\.|params|query|body' }
    ]
  },
  {
    id: 'insecure-file-upload',
    name: 'Insecure File Upload',
    severity: 'High',
    description: 'Potential insecure file upload',
    recommendation: 'Validate file type, size, and content. Store uploads outside web root.',
    patterns: [
      { key: 'file-upload', pattern: 'multer|formidable|busboy' },
      { key: 'file-save', pattern: '\\.mv\\s*\\(|\\.pipe\\s*\\(\\s*fs\\.createWriteStream' }
    ]
  },
  {
    id: 'file-inclusion',
    name: 'File Inclusion',
    severity: 'High',
    description: 'Potential file inclusion vulnerability',
    recommendation: 'Never include files based on user input without validation.',
    patterns: [
      { key: 'require-dynamic', pattern: 'require\\s*\\(\\s*req\\.|params|query|body' },
      { key: 'import-dynamic', pattern: 'import\\s*\\(\\s*req\\.|params|query|body' }
    ]
  },
  {
    id: 'insecure-file-permissions',
    name: 'Insecure File Permissions',
    severity: 'Medium',
    description: 'Potentially insecure file permissions',
    recommendation: 'Set appropriate file permissions. Avoid world-writable files.',
    patterns: [
      { key: 'file-write', pattern: 'fs\\.writeFileSync\\s*\\(|fs\\.writeFile\\s*\\(' },
      { key: 'chmod', pattern: 'fs\\.chmod\\s*\\(\\s*[^,]*\\s*,\\s*["\']777["\']' }
    ]
  },
  {
    id: 'insecure-file-delete',
    name: 'Insecure File Deletion',
    severity: 'Medium',
    description: 'Potentially insecure file deletion',
    recommendation: 'Validate file paths before deletion. Avoid deleting files based on user input.',
    patterns: [
      { key: 'file-delete', pattern: 'fs\\.unlinkSync\\s*\\(|fs\\.unlink\\s*\\(' },
      { key: 'rmdir', pattern: 'fs\\.rmdirSync\\s*\\(|fs\\.rmdir\\s*\\(' }
    ]
  },
  {
    id: 'insecure-file-read',
    name: 'Insecure File Reading',
    severity: 'Medium',
    description: 'Potentially insecure file reading',
    recommendation: 'Validate file paths before reading. Avoid reading files based on user input.',
    patterns: [
      { key: 'file-read', pattern: 'fs\\.readFileSync\\s*\\(|fs\\.readFile\\s*\\(' },
      { key: 'read-stream', pattern: 'fs\\.createReadStream\\s*\\(' }
    ]
  },
  {
    id: 'insecure-temp-file',
    name: 'Insecure Temporary File',
    severity: 'Medium',
    description: 'Potentially insecure temporary file usage',
    recommendation: 'Use secure temporary file creation methods. Clean up temporary files after use.',
    patterns: [
      { key: 'temp-file', pattern: 'tmp\\.|temp\\.|TemporaryDirectory' },
      { key: 'tmp-name', pattern: 'tmpName\\s*\\(|tmpnam\\s*\\(' }
    ]
  }
];

module.exports = fileSystemRules;