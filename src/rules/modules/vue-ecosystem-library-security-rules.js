const vueEcosystemLibrarySecurityRules = [
  {
    id: 'element-plus-security',
    name: 'Element Plus Security',
    severity: 'Medium',
    description: 'Element Plus component library security issues',
    recommendation: 'Keep Element Plus updated to the latest secure version. Review component configurations for security issues.',
    patterns: [
      { key: 'element-plus-import', pattern: 'from\\s*["\']element-plus["\']' },
      { key: 'element-plus-usage', pattern: 'El[A-Z][a-z]+' },
      { key: 'element-plus-version', pattern: '"element-plus"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'ant-design-vue-security',
    name: 'Ant Design Vue Security',
    severity: 'Medium',
    description: 'Ant Design Vue component library security issues',
    recommendation: 'Keep Ant Design Vue updated to the latest secure version. Review component configurations for security issues.',
    patterns: [
      { key: 'ant-design-import', pattern: 'from\\s*["\']ant-design-vue["\']' },
      { key: 'ant-design-usage', pattern: 'a-[a-z]+|A[A-Z][a-z]+' },
      { key: 'ant-design-version', pattern: '"ant-design-vue"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'vuetify-security',
    name: 'Vuetify Security',
    severity: 'Medium',
    description: 'Vuetify component library security issues',
    recommendation: 'Keep Vuetify updated to the latest secure version. Review component configurations for security issues.',
    patterns: [
      { key: 'vuetify-import', pattern: 'from\\s*["\']vuetify["\']' },
      { key: 'vuetify-usage', pattern: 'v-[a-z]+|V[A-Z][a-z]+' },
      { key: 'vuetify-version', pattern: '"vuetify"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'naive-ui-security',
    name: 'Naive UI Security',
    severity: 'Medium',
    description: 'Naive UI component library security issues',
    recommendation: 'Keep Naive UI updated to the latest secure version. Review component configurations for security issues.',
    patterns: [
      { key: 'naive-ui-import', pattern: 'from\\s*["\']naive-ui["\']' },
      { key: 'naive-ui-usage', pattern: 'N[A-Z][a-z]+' },
      { key: 'naive-ui-version', pattern: '"naive-ui"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'vue-router-security',
    name: 'Vue Router Security',
    severity: 'Medium',
    description: 'Vue Router security issues',
    recommendation: 'Keep Vue Router updated to the latest secure version. Use proper route guards and validation.',
    patterns: [
      { key: 'vue-router-import', pattern: 'from\\s*["\']vue-router["\']' },
      { key: 'vue-router-usage', pattern: 'createRouter|useRouter|useRoute' },
      { key: 'vue-router-version', pattern: '"vue-router"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'pinia-security',
    name: 'Pinia Security',
    severity: 'Medium',
    description: 'Pinia state management security issues',
    recommendation: 'Keep Pinia updated to the latest secure version. Validate all store operations.',
    patterns: [
      { key: 'pinia-import', pattern: 'from\\s*["\']pinia["\']' },
      { key: 'pinia-usage', pattern: 'createPinia|defineStore' },
      { key: 'pinia-version', pattern: '"pinia"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'vuex-security',
    name: 'Vuex Security',
    severity: 'Medium',
    description: 'Vuex state management security issues',
    recommendation: 'Keep Vuex updated to the latest secure version. Validate all store operations.',
    patterns: [
      { key: 'vuex-import', pattern: 'from\\s*["\']vuex["\']' },
      { key: 'vuex-usage', pattern: 'createStore|useStore' },
      { key: 'vuex-version', pattern: '"vuex"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'vue-i18n-security',
    name: 'Vue i18n Security',
    severity: 'Medium',
    description: 'Vue i18n internationalization security issues',
    recommendation: 'Keep Vue i18n updated to the latest secure version. Validate all translation keys and messages.',
    patterns: [
      { key: 'vue-i18n-import', pattern: 'from\\s*["\']vue-i18n["\']' },
      { key: 'vue-i18n-usage', pattern: 'createI18n|useI18n' },
      { key: 'vue-i18n-version', pattern: '"vue-i18n"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'vue-use-security',
    name: 'VueUse Security',
    severity: 'Medium',
    description: 'VueUse utility library security issues',
    recommendation: 'Keep VueUse updated to the latest secure version. Review utility functions for security issues.',
    patterns: [
      { key: 'vue-use-import', pattern: 'from\\s*["\']@vueuse/[^"]+["\']' },
      { key: 'vue-use-usage', pattern: 'use[A-Z][a-z]+' },
      { key: 'vue-use-version', pattern: '"@vueuse/[^"]+"\\s*:\\s*"[^"]+"' }
    ]
  }
];

module.exports = vueEcosystemLibrarySecurityRules;