const chinaFrameworkRules = [
  {
    id: 'element-plus-security',
    name: 'Element Plus 框架安全检测',
    severity: 'Medium',
    description: 'Element Plus 框架使用中的潜在安全问题',
    recommendation: '确保 Element Plus 组件的使用符合安全最佳实践，特别是表单输入验证、弹窗内容安全和表格数据处理等方面。',
    patterns: [
      { key: 'element-plus', pattern: 'element-plus|ElementPlus|@element-plus' },
      { key: 'el-form', pattern: '<el-form|<ElForm' },
      { key: 'el-input', pattern: '<el-input|<ElInput' }
    ]
  },
  {
    id: 'ant-design-vue-security',
    name: 'Ant Design Vue 框架安全检测',
    severity: 'Medium',
    description: 'Ant Design Vue 框架使用中的潜在安全问题',
    recommendation: '确保 Ant Design Vue 组件的使用符合安全最佳实践，特别是表单验证、Modal 内容安全和 Table 数据处理等方面。',
    patterns: [
      { key: 'ant-design-vue', pattern: 'ant-design-vue|AntDesignVue|@ant-design' },
      { key: 'a-form', pattern: '<a-form|<AForm' },
      { key: 'a-input', pattern: '<a-input|<AInput' }
    ]
  },
  {
    id: 'vue-element-admin-security',
    name: 'Vue Element Admin 框架安全检测',
    severity: 'Medium',
    description: 'Vue Element Admin 框架使用中的潜在安全问题',
    recommendation: '确保 Vue Element Admin 的使用符合安全最佳实践，特别是权限管理、路由配置和 API 调用等方面。',
    patterns: [
      { key: 'vue-element-admin', pattern: 'vue-element-admin|@vue-element-admin' },
      { key: 'permission', pattern: 'permission|roles|权限' },
      { key: 'router-config', pattern: 'router\.js|router\.ts|路由' }
    ]
  },
  {
    id: 'iview-security',
    name: 'iView/View UI 框架安全检测',
    severity: 'Medium',
    description: 'iView/View UI 框架使用中的潜在安全问题',
    recommendation: '确保 iView/View UI 组件的使用符合安全最佳实践，特别是表单验证、Modal 内容安全和 Table 数据处理等方面。',
    patterns: [
      { key: 'iview', pattern: 'iview|View UI|@iview' },
      { key: 'i-form', pattern: '<i-form|<IForm' },
      { key: 'i-input', pattern: '<i-input|<IInput' }
    ]
  },
  {
    id: 'naive-ui-security',
    name: 'Naive UI 框架安全检测',
    severity: 'Medium',
    description: 'Naive UI 框架使用中的潜在安全问题',
    recommendation: '确保 Naive UI 组件的使用符合安全最佳实践，特别是表单验证、Dialog 内容安全和 Table 数据处理等方面。',
    patterns: [
      { key: 'naive-ui', pattern: 'naive-ui|NaiveUI|@naive-ui' },
      { key: 'n-form', pattern: '<n-form|<NForm' },
      { key: 'n-input', pattern: '<n-input|<NInput' }
    ]
  },
  {
    id: 'arco-design-security',
    name: 'Arco Design 框架安全检测',
    severity: 'Medium',
    description: 'Arco Design 框架使用中的潜在安全问题',
    recommendation: '确保 Arco Design 组件的使用符合安全最佳实践，特别是表单验证、Modal 内容安全和 Table 数据处理等方面。',
    patterns: [
      { key: 'arco-design', pattern: 'arco-design|ArcoDesign|@arco-design' },
      { key: 'a-form', pattern: '<a-form|<AForm' },
      { key: 'a-input', pattern: '<a-input|<AInput' }
    ]
  },
  {
    id: 'tencent-qiankun-security',
    name: '腾讯 Qiankun 微前端框架安全检测',
    severity: 'High',
    description: 'Qiankun 微前端框架使用中的潜在安全问题',
    recommendation: '确保 Qiankun 微前端框架的使用符合安全最佳实践，特别是应用隔离、通信安全和路由配置等方面。',
    patterns: [
      { key: 'qiankun', pattern: 'qiankun|@umijs/plugin-qiankun|微前端' },
      { key: 'register-micro-app', pattern: 'registerMicroApps|start\(\)' },
      { key: 'micro-app', pattern: 'micro-app|子应用' }
    ]
  },
  {
    id: 'baidu-semi-ui-security',
    name: '百度 Semi UI 框架安全检测',
    severity: 'Medium',
    description: 'Semi UI 框架使用中的潜在安全问题',
    recommendation: '确保 Semi UI 组件的使用符合安全最佳实践，特别是表单验证、Modal 内容安全和 Table 数据处理等方面。',
    patterns: [
      { key: 'semi-ui', pattern: 'semi-ui|SemiUI|@douyinfe/semi-ui' },
      { key: 'semi-form', pattern: '<SemiForm|<semi-form' },
      { key: 'semi-input', pattern: '<SemiInput|<semi-input' }
    ]
  },
  {
    id: 'bytedance-lyra-security',
    name: '字节跳动 Lyra 框架安全检测',
    severity: 'Medium',
    description: 'Lyra 框架使用中的潜在安全问题',
    recommendation: '确保 Lyra 框架的使用符合安全最佳实践，特别是状态管理、路由配置和 API 调用等方面。',
    patterns: [
      { key: 'lyra', pattern: 'lyra|@byted/lyra' },
      { key: 'lyra-create', pattern: 'createLyra|LyraApp' },
      { key: 'lyra-router', pattern: 'lyra-router|路由' }
    ]
  },
  {
    id: 'china-framework-input-validation',
    name: '国内框架输入验证安全检测',
    severity: 'High',
    description: '国内框架使用中输入验证的潜在安全问题',
    recommendation: '确保国内框架的表单输入验证符合安全最佳实践，对所有用户输入进行严格的验证和清理，防止注入攻击。',
    patterns: [
      { key: 'form-validate', pattern: 'validate|rules|验证|规则' },
      { key: 'input', pattern: 'input|表单|form' },
      { key: 'model', pattern: 'v-model|:model|双向绑定' }
    ]
  },
  {
    id: 'china-framework-modal-security',
    name: '国内框架弹窗安全检测',
    severity: 'Medium',
    description: '国内框架弹窗使用中的潜在安全问题',
    recommendation: '确保国内框架的弹窗内容符合安全最佳实践，特别是动态内容的安全处理，防止 XSS 攻击。',
    patterns: [
      { key: 'modal', pattern: 'modal|dialog|弹窗|对话框' },
      { key: 'content', pattern: 'content|html|内容' },
      { key: 'template', pattern: 'template|slot|模板|插槽' }
    ]
  },
  {
    id: 'china-framework-table-security',
    name: '国内框架表格安全检测',
    severity: 'Medium',
    description: '国内框架表格使用中的潜在安全问题',
    recommendation: '确保国内框架的表格数据处理符合安全最佳实践，特别是排序、筛选和分页等功能的安全处理，防止注入攻击。',
    patterns: [
      { key: 'table', pattern: 'table|表格' },
      { key: 'sort', pattern: 'sort|order|排序' },
      { key: 'filter', pattern: 'filter|筛选|搜索' }
    ]
  },
  {
    id: 'china-framework-upload-security',
    name: '国内框架文件上传安全检测',
    severity: 'High',
    description: '国内框架文件上传使用中的潜在安全问题',
    recommendation: '确保国内框架的文件上传功能符合安全最佳实践，特别是文件类型验证、大小限制和内容检测等方面，防止恶意文件上传。',
    patterns: [
      { key: 'upload', pattern: 'upload|上传' },
      { key: 'file', pattern: 'file|文件' },
      { key: 'before-upload', pattern: 'beforeUpload|before-upload|上传前' }
    ]
  },
  {
    id: 'china-framework-tree-security',
    name: '国内框架树形组件安全检测',
    severity: 'Medium',
    description: '国内框架树形组件使用中的潜在安全问题',
    recommendation: '确保国内框架的树形组件使用符合安全最佳实践，特别是节点数据的验证和处理，防止注入攻击。',
    patterns: [
      { key: 'tree', pattern: 'tree|树形' },
      { key: 'node', pattern: 'node|节点' },
      { key: 'data', pattern: 'data|数据' }
    ]
  },
  {
    id: 'china-framework-select-security',
    name: '国内框架选择器安全检测',
    severity: 'Medium',
    description: '国内框架选择器使用中的潜在安全问题',
    recommendation: '确保国内框架的选择器使用符合安全最佳实践，特别是选项数据的验证和处理，防止注入攻击。',
    patterns: [
      { key: 'select', pattern: 'select|选择器' },
      { key: 'option', pattern: 'option|选项' },
      { key: 'multiple', pattern: 'multiple|多选' }
    ]
  }
];

module.exports = chinaFrameworkRules;