# Changelog

## 1.6.1 (2026-01-31)

- 更新依赖项 `vue-security-scanner` 到 ^1.6.0
- 添加性能配置选项（`performanceProfile`, `enableParallelScanning`, `enableIncrementalScanning`, `memoryLimit`）
- 添加 Vue 3.6 支持（`enableVue36Features`, `enableVaporModeScanning`）
- 添加 `exclude` 配置选项
- 修复在没有漏洞时不生成报告的问题
- 更新扫描器版本号到 1.6.0
- 添加并行规则引擎关闭功能
- 添加新的关键词（`vue3`, `vue3.6`, `vapor-mode`, `performance`, `parallel-processing`）

## 1.0.0 (2026-01-22)

- Initial release of @vue-security/nuxt
- Nuxt.js specific security scanning
- Support for pages, layouts, middleware, and plugins
- SSR security checks
- Static generation scanning