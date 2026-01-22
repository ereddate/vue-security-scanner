// 示例：如何在Vite项目中使用Vue安全插件
// vite.config.js

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSecurityPlugin from 'vite-plugin-vue-security';

export default defineConfig({
  plugins: [
    // 启用Vue安全扫描插件
    vueSecurityPlugin({
      enabled: true,           // 启用安全扫描
      failOnError: false,      // 发现安全问题时不中断构建
      reportLevel: 'warning',  // 报告级别：'error', 'warning', 或 'info'
      outputFile: './security-report.json', // 安全报告输出文件
      exclude: [              // 排除扫描的文件模式
        'node_modules',
        'dist',
        'public'
      ]
    }),
    
    // Vue插件
    vue()
  ],
  
  // 其他Vite配置...
});