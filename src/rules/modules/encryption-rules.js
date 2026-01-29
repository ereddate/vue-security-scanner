const encryptionRules = [
  {
    id: 'weak-random',
    name: 'Weak Random Number Generation',
    severity: 'Medium',
    description: 'Potentially weak random number generation',
    recommendation: 'For cryptographically secure random numbers, use crypto.getRandomValues() or crypto.randomBytes() with proper callback handling.',
    patterns: [
      { key: 'math-random', pattern: 'Math\\.random\\(\\)' },
      { key: 'crypto-random', pattern: 'crypto\\.randomBytes\\([^,]*,?\\s*null\\s*,?' }
    ]
  },
  {
    id: 'weak-encryption',
    name: 'Weak Encryption',
    severity: 'High',
    description: 'Potentially weak encryption algorithm',
    recommendation: 'Use strong encryption algorithms like AES-256-GCM. Avoid MD5, SHA1, DES.',
    patterns: [
      { key: 'md5-hash', pattern: 'createHash\\s*\\(\\s*["\']md5["\']' },
      { key: 'sha1-hash', pattern: 'createHash\\s*\\(\\s*["\']sha1["\']' },
      { key: 'des-encrypt', pattern: 'createCipher\\s*\\(\\s*["\']des["\']|createDecipher\\s*\\(\\s*["\']des["\']' }
    ]
  },
  {
    id: 'insecure-random',
    name: 'Insecure Random Generation',
    severity: 'Medium',
    description: 'Potentially insecure random number generation',
    recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues() for cryptographic randomness.',
    patterns: [
      { key: 'random-bytes', pattern: 'crypto\\.randomBytes\\s*\\(\\s*[^,]*\\s*\\)\\s*\\.toString\\s*\\(\\s*["\']hex["\']' },
      { key: 'pseudo-random', pattern: 'Math\\.random\\s*\\(\\s*\\)' }
    ]
  },
  {
    id: 'missing-encryption',
    name: 'Missing Encryption',
    severity: 'High',
    description: 'Potentially missing data encryption',
    recommendation: 'Encrypt sensitive data at rest and in transit.',
    patterns: [
      { key: 'plain-text', pattern: 'localStorage\\.(setItem|getItem)\\s*\\(\\s*["\'].*password|token|secret|credit.*card|ssn' },
      { key: 'session-storage', pattern: 'sessionStorage\\.(setItem|getItem)\\s*\\(\\s*["\'].*password|token|secret' }
    ]
  },
  {
    id: 'insecure-hash',
    name: 'Insecure Hash Function',
    severity: 'Medium',
    description: 'Potentially insecure hash function',
    recommendation: 'Use strong hash functions like SHA-256 or SHA-512. Avoid MD5 and SHA1.',
    patterns: [
      { key: 'md5-function', pattern: 'md5\\s*\\(' },
      { key: 'sha1-function', pattern: 'sha1\\s*\\(' }
    ]
  },
  {
    id: 'insufficient-key-length',
    name: 'Insufficient Key Length',
    severity: 'High',
    description: 'Potentially insufficient encryption key length',
    recommendation: 'Use encryption keys with sufficient length (at least 128 bits for symmetric encryption).',
    patterns: [
      { key: 'key-generation', pattern: 'createCipher\\s*\\(|createDecipher\\s*\\(' },
      { key: 'short-key', pattern: 'key\\s*=\\s*["\'][a-zA-Z0-9]{1,15}["\']' }
    ]
  },
  {
    id: 'insecure-cipher-mode',
    name: 'Insecure Cipher Mode',
    severity: 'High',
    description: 'Potentially insecure cipher mode',
    recommendation: 'Use authenticated encryption modes like GCM or CCM. Avoid ECB mode.',
    patterns: [
      { key: 'ecb-mode', pattern: 'createCipher\\s*\\(\\s*["\'][^"\']*ecb["\']', flags: 'i' },
      { key: 'cbc-mode', pattern: 'createCipher\\s*\\(\\s*["\'][^"\']*cbc["\']', flags: 'i' }
    ]
  },
  {
    id: 'insecure-key-management',
    name: 'Insecure Key Management',
    severity: 'High',
    description: 'Potentially insecure key management',
    recommendation: 'Use secure key management practices. Avoid hardcoding keys or storing them in plain text.',
    patterns: [
      { key: 'hardcoded-key', pattern: 'key\\s*=\\s*["\'][^"\']+["\']' },
      { key: 'key-file', pattern: 'fs\\.readFileSync\\s*\\(\\s*["\'].*key["\']' }
    ]
  },
  {
    id: 'insecure-signature',
    name: 'Insecure Digital Signature',
    severity: 'High',
    description: 'Potentially insecure digital signature',
    recommendation: 'Use strong signature algorithms like RSASSA-PSS or ECDSA. Avoid RSA with PKCS#1 v1.5 padding.',
    patterns: [
      { key: 'sign', pattern: 'createSign\\s*\\(\\s*["\']sha1["\']' },
      { key: 'verify', pattern: 'createVerify\\s*\\(\\s*["\']sha1["\']' }
    ]
  }
];

module.exports = encryptionRules;