const modernStorageSecurityRules = [
  {
    id: 'indexeddb-security',
    name: 'IndexedDB Security Issues',
    severity: 'Medium',
    description: 'Potential security issues with IndexedDB usage',
    recommendation: 'Validate and sanitize data stored in IndexedDB. Avoid storing sensitive information without encryption.',
    patterns: [
      { key: 'indexeddb-open', pattern: 'indexedDB\\.open' },
      { key: 'indexeddb-transaction', pattern: 'transaction\\s*=|objectStore\\s*=|add\\s*\\(|put\\s*\\(' },
      { key: 'indexeddb-sensitive-data', pattern: 'put\\s*\\([^,]*,[^,]*password|token|key|secret|auth|credential' }
    ]
  },
  {
    id: 'filesystem-access-security',
    name: 'File System Access API Security',
    severity: 'High',
    description: 'Potential security issues with File System Access API',
    recommendation: 'Validate file access permissions. Sanitize file paths and content. Avoid executing user-provided file content.',
    patterns: [
      { key: 'filesystem-show-open-picker', pattern: 'showOpenFilePicker\\s*\\(\\s*\\{' },
      { key: 'filesystem-show-save-picker', pattern: 'showSaveFilePicker\\s*\\(\\s*\\{' },
      { key: 'filesystem-show-directory-picker', pattern: 'showDirectoryPicker\\s*\\(\\s*\\{' }
    ]
  },
  {
    id: 'storage-quota-security',
    name: 'Storage Quota and Persistence Security',
    severity: 'Low',
    description: 'Potential security issues with storage quota management',
    recommendation: 'Implement proper storage quota management. Be mindful of persistent storage requests.',
    patterns: [
      { key: 'storage-persist', pattern: 'navigator\\.storage\\.persist' },
      { key: 'storage-estimate', pattern: 'navigator\\.storage\\.estimate' }
    ]
  },
  {
    id: 'storage-encryption-missing',
    name: 'Missing Encryption for Sensitive Storage',
    severity: 'High',
    description: 'Sensitive data stored in client-side storage without encryption',
    recommendation: 'Encrypt sensitive data before storing in client-side storage. Use Web Crypto API for encryption.',
    patterns: [
      { key: 'storage-sensitive-data', pattern: '(localStorage|sessionStorage|indexedDB)\\.[^.]*\\(.*password|token|key|secret|auth|credential|ssn|card' },
      { key: 'storage-no-encryption', pattern: '(localStorage|sessionStorage)\\.(setItem|setItem)\\s*\\(\\s*["\'].*["\']\\s*,\\s*[^\\s]*[^encrypt|Crypto]' }
    ]
  }
];

module.exports = modernStorageSecurityRules;