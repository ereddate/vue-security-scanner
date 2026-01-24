// 文件操作安全漏洞示例文件

// 示例 1: 路径遍历攻击
export function pathTraversalAttack(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// 示例 2: 缺少文件路径验证
export function readFileWithoutValidation(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// 示例 3: 缺少文件类型验证
export function uploadFileWithoutTypeCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 4: 缺少文件大小验证
export function uploadFileWithoutSizeCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 5: 缺少文件名验证
export function uploadFileWithoutNameCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 6: 缺少文件内容验证
export function uploadFileWithoutContentCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 7: 缺少文件权限检查
export function readFileWithoutPermissionCheck(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// 示例 8: 缺少文件所有权检查
export function readFileWithoutOwnershipCheck(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// 示例 9: 缺少文件访问控制
export function readFileWithoutAccessControl(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// 示例 10: 缺少文件加密
export function readFileWithoutEncryption(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// 示例 11: Vue组件中的文件操作漏洞
export default {
  name: 'FileOperationVulnerableComponent',
  methods: {
    readFile(filePath) {
      const fs = require('fs');
      return fs.readFileSync(filePath, 'utf8');
    },
    
    writeFile(filePath, content) {
      const fs = require('fs');
      return fs.writeFileSync(filePath, content);
    },
    
    deleteFile(filePath) {
      const fs = require('fs');
      return fs.unlinkSync(filePath);
    }
  },
  
  mounted() {
    const filePath = this.$route.query.file;
    const content = this.readFile(filePath);
    console.log('File content:', content);
  }
};

// 示例 12: 缺少文件备份
export function writeFileWithoutBackup(filePath, content) {
  const fs = require('fs');
  return fs.writeFileSync(filePath, content);
}

// 示例 13: 缺少文件版本控制
export function writeFileWithoutVersion(filePath, content) {
  const fs = require('fs');
  return fs.writeFileSync(filePath, content);
}

// 示例 14: 缺少文件审计
export function writeFileWithoutAudit(filePath, content) {
  const fs = require('fs');
  return fs.writeFileSync(filePath, content);
}

// 示例 15: 缺少文件监控
export function writeFileWithoutMonitoring(filePath, content) {
  const fs = require('fs');
  return fs.writeFileSync(filePath, content);
}

// 示例 16: 缺少文件告警
export function writeFileWithoutAlert(filePath, content) {
  const fs = require('fs');
  return fs.writeFileSync(filePath, content);
}

// 示例 17: 缺少文件恢复
export function deleteFileWithoutRecovery(filePath) {
  const fs = require('fs');
  return fs.unlinkSync(filePath);
}

// 示例 18: 缺少文件归档
export function deleteFileWithoutArchive(filePath) {
  const fs = require('fs');
  return fs.unlinkSync(filePath);
}

// 示例 19: 缺少文件保留
export function deleteFileWithoutRetention(filePath) {
  const fs = require('fs');
  return fs.unlinkSync(filePath);
}

// 示例 20: 缺少文件清理
export function deleteFileWithoutCleanup(filePath) {
  const fs = require('fs');
  return fs.unlinkSync(filePath);
}

// 示例 21: 缺少文件压缩
export function writeFileWithoutCompression(filePath, content) {
  const fs = require('fs');
  return fs.writeFileSync(filePath, content);
}

// 示例 22: 缺少文件加密传输
export function uploadFileWithoutSecureTransport(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 23: 缺少文件完整性检查
export function uploadFileWithoutIntegrityCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 24: 缺少文件签名
export function uploadFileWithoutSignature(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 25: 缺少文件哈希
export function uploadFileWithoutHash(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 26: 缺少文件元数据验证
export function uploadFileWithoutMetadataCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 27: 缺少文件扩展名验证
export function uploadFileWithoutExtensionCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 28: 缺少文件MIME类型验证
export function uploadFileWithoutMIMECheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 29: 缺少文件内容类型验证
export function uploadFileWithoutContentTypeCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 30: 缺少文件编码验证
export function uploadFileWithoutEncodingCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 31: 缺少文件字符集验证
export function uploadFileWithoutCharsetCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 32: 缺少文件格式验证
export function uploadFileWithoutFormatCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 33: 缺少文件结构验证
export function uploadFileWithoutStructureCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 34: 缺少文件语法验证
export function uploadFileWithoutSyntaxCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 35: 缺少文件语义验证
export function uploadFileWithoutSemanticCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 36: 缺少文件业务逻辑验证
export function uploadFileWithoutBusinessLogicCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 37: 缺少文件安全策略验证
export function uploadFileWithoutSecurityPolicyCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 38: 缺少文件合规性验证
export function uploadFileWithoutComplianceCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 39: 缺少文件法规验证
export function uploadFileWithoutRegulationCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}

// 示例 40: 缺少文件标准验证
export function uploadFileWithoutStandardCheck(file) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/uploads', file.name);
  return fs.writeFileSync(filePath, file.data);
}
