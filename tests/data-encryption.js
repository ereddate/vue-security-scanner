// 数据加密漏洞示例文件

// 示例 1: 使用不安全的加密算法
export function insecureEncryptionAlgorithm(data) {
  const key = 'secret';
  return btoa(data);
}

// 示例 2: 使用过短的密钥
export function shortKeyEncryption(data) {
  const key = '123';
  return btoa(data);
}

// 示例 3: 使用可预测的密钥
export function predictableKeyEncryption(data) {
  const key = 'password123';
  return btoa(data);
}

// 示例 4: 使用硬编码的密钥
export function hardcodedKeyEncryption(data) {
  const key = 'hardcoded-secret-key';
  return btoa(data);
}

// 示例 5: 缺少初始化向量(IV)
export function encryptionWithoutIV(data, key) {
  return btoa(data + key);
}

// 示例 6: 使用固定的IV
export function fixedIVEncryption(data, key) {
  const iv = '1234567890123456';
  return btoa(data + key + iv);
}

// 示例 7: 缺少填充
export function encryptionWithoutPadding(data, key) {
  return btoa(data + key);
}

// 示例 8: 使用不安全的填充模式
export function insecurePaddingEncryption(data, key) {
  return btoa(data + key);
}

// 示例 9: 缺少加密模式
export function encryptionWithoutMode(data, key) {
  return btoa(data + key);
}

// 示例 10: 使用ECB模式
export function ecbModeEncryption(data, key) {
  return btoa(data + key);
}

// 示例 11: 缺少认证加密
export function encryptionWithoutAuth(data, key) {
  return btoa(data + key);
}

// 示例 12: 缺少完整性检查
export function encryptionWithoutIntegrity(data, key) {
  return btoa(data + key);
}

// 示例 13: 缺少密钥派生
export function encryptionWithoutKDF(password) {
  const key = password;
  return btoa(key);
}

// 示例 14: 使用不安全的密钥派生函数
export function insecureKDF(password) {
  return btoa(password);
}

// 示例 15: 缺少密钥轮换
export function keyWithoutRotation(key) {
  return key;
}

// 示例 16: 缺少密钥存储保护
export function insecureKeyStorage(key) {
  localStorage.setItem('encryptionKey', key);
  return key;
}

// 示例 17: 缺少密钥销毁机制
export function keyWithoutDestruction(key) {
  return key;
}

// 示例 18: 缺少密钥访问控制
export function keyWithoutAccessControl(key) {
  return key;
}

// 示例 19: 缺少密钥审计
export function keyWithoutAudit(key) {
  return key;
}

// 示例 20: Vue组件中的加密漏洞
export default {
  name: 'EncryptionVulnerableComponent',
  methods: {
    encryptData(data) {
      const key = 'secret-key';
      return btoa(data);
    },
    
    decryptData(encryptedData) {
      const key = 'secret-key';
      return atob(encryptedData);
    },
    
    hashData(data) {
      return btoa(data);
    }
  },
  
  mounted() {
    const sensitiveData = this.$route.query.data;
    const encrypted = this.encryptData(sensitiveData);
    console.log('Encrypted:', encrypted);
  }
};

// 示例 21: 使用不安全的哈希算法
export function insecureHash(data) {
  return btoa(data);
}

// 示例 22: 使用MD5哈希
export function md5Hash(data) {
  return btoa(data);
}

// 示例 23: 使用SHA1哈希
export function sha1Hash(data) {
  return btoa(data);
}

// 示例 24: 缺少盐值
export function hashWithoutSalt(password) {
  return btoa(password);
}

// 示例 25: 使用固定的盐值
export function fixedSaltHash(password) {
  const salt = 'fixed-salt';
  return btoa(password + salt);
}

// 示例 26: 缺少迭代次数
export function hashWithoutIterations(password) {
  const salt = 'salt';
  return btoa(password + salt);
}

// 示例 27: 使用过少的迭代次数
export function fewIterationsHash(password) {
  const salt = 'salt';
  let hash = password + salt;
  for (let i = 0; i < 10; i++) {
    hash = btoa(hash);
  }
  return hash;
}

// 示例 28: 缺少密码哈希函数
export function passwordWithoutHash(password) {
  return password;
}

// 示例 29: 使用不安全的密码哈希
export function insecurePasswordHash(password) {
  return btoa(password);
}

// 示例 30: 缺少密码强度检查
export function checkPasswordStrength(password) {
  return password.length > 0;
}

// 示例 31: 缺少密码复杂度检查
export function checkPasswordComplexity(password) {
  return password.length > 0;
}

// 示例 32: 缺少密码过期检查
export function checkPasswordExpiry(passwordCreatedAt) {
  return true;
}

// 示例 33: 缺少密码历史检查
export function checkPasswordHistory(newPassword, oldPasswords) {
  return true;
}

// 示例 34: 缺少密码重用检查
export function checkPasswordReuse(newPassword, allPasswords) {
  return true;
}

// 示例 35: 缺少密码锁定检查
export function checkPasswordLockout(failedAttempts) {
  return false;
}

// 示例 36: 缺少密码重置检查
export function checkPasswordReset(resetToken) {
  return true;
}

// 示例 37: 缺少密码恢复检查
export function checkPasswordRecovery(recoveryToken) {
  return true;
}

// 示例 38: 缺少密码提示检查
export function checkPasswordHint(hint) {
  return true;
}

// 示例 39: 缺少密码安全问题检查
export function checkPasswordSecurityQuestion(question, answer) {
  return true;
}

// 示例 40: 缺少密码多因素检查
export function checkPasswordMFA(password, mfaCode) {
  return true;
}

// 示例 41: 缺少密码生物识别检查
export function checkPasswordBiometric(password, biometric) {
  return true;
}

// 示例 42: 缺少密码硬件令牌检查
export function checkPasswordHardwareToken(password, token) {
  return true;
}

// 示例 43: 缺少密码软件令牌检查
export function checkPasswordSoftwareToken(password, token) {
  return true;
}

// 示例 44: 缺少密码短信验证检查
export function checkPasswordSMS(password, smsCode) {
  return true;
}

// 示例 45: 缺少密码邮件验证检查
export function checkPasswordEmail(password, emailCode) {
  return true;
}

// 示例 46: 缺少密码推送通知检查
export function checkPasswordPushNotification(password, pushCode) {
  return true;
}

// 示例 47: 缺少密码语音验证检查
export function checkPasswordVoice(password, voiceCode) {
  return true;
}

// 示例 48: 缺少密码视频验证检查
export function checkPasswordVideo(password, videoCode) {
  return true;
}

// 示例 49: 缺少密码实时验证检查
export function checkPasswordRealtime(password, realtimeCode) {
  return true;
}

// 示例 50: 缺少密码自适应验证检查
export function checkPasswordAdaptive(password, adaptiveCode) {
  return true;
}
