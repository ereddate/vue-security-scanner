// 中国国家安全标准测试
const gb28448Test = {
  name: 'GB/T 28448 测试',
  description: '等级保护测试',
  networkSecurity: true
};

// Vue 官方安全最佳实践测试
import { ref, reactive } from 'vue';
import axios from 'axios';

const xssTest = {
  content: '<div v-html="userInput"></div>',
  userInput: 'test'
};

const csrfTest = {
  config: axios.create({
    baseURL: 'http://example.com'
  })
};

// 国内框架支持测试
import ElementPlus from 'element-plus';
import AntDesignVue from 'ant-design-vue';
import ViewUI from 'view-ui-plus';

const elementPlusTest = {
  form: '<el-form><el-input v-model="input"></el-input></el-form>',
  input: ''
};

const antDesignTest = {
  form: '<a-form><a-input v-model:value="input"></a-input></a-form>',
  input: ''
};

// 国产化环境适配测试
const chinaEnvironmentTest = {
  os: 'UOS',
  browser: '360浏览器',
  server: '浪潮服务器',
  database: '达梦数据库',
  middleware: '东方通TongWeb'
};

// 国内API和服务测试
const aliyunTest = {
  accessKeyId: 'testAccessKeyId',
  accessKeySecret: 'testAccessKeySecret',
  oss: {
    bucket: 'test-bucket',
    endpoint: 'oss-cn-beijing.aliyuncs.com'
  }
};

const tencentCloudTest = {
  SecretId: 'testSecretId',
  SecretKey: 'testSecretKey',
  cos: {
    Bucket: 'test-bucket',
    Region: 'ap-beijing'
  }
};

const wechatTest = {
  appId: 'testAppId',
  appSecret: 'testAppSecret'
};

const alipayTest = {
  appId: 'testAppId',
  privateKey: 'testPrivateKey'
};

// 网络环境测试
const networkTest = {
  cdn: '阿里云CDN',
  foreignService: 'https://fonts.googleapis.com/css',
  networkAdapter: true
};

// 安全认证测试
const certificationTest = {
  softwareCopyright: true,
  chinaCert: true
};

// 数据本地化测试
const dataLocalizationTest = {
  chinaDatacenter: '阿里云',
  dataLocalization: true
};

// 国内标准合规测试
const standardComplianceTest = {
  gbStandard: 'GB/T 28448',
  industryStandard: '金融行业标准'
};

// 国内法规合规测试
const regulatoryComplianceTest = {
  networkSecurityLaw: true,
  dataSecurityLaw: true,
  personalInfoProtectionLaw: true
};

export {
  gb28448Test,
  xssTest,
  csrfTest,
  elementPlusTest,
  antDesignTest,
  chinaEnvironmentTest,
  aliyunTest,
  tencentCloudTest,
  wechatTest,
  alipayTest,
  networkTest,
  certificationTest,
  dataLocalizationTest,
  standardComplianceTest,
  regulatoryComplianceTest
};