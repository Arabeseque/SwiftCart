import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * Vite 配置文件
 * [CONCEPT] 使用 Vite 进行开发和构建
 * [PERF] 优化构建配置和代码分割
 */
export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    // Sentry 错误监控插件
    sentryVitePlugin({
      org: "other-sn",
      project: "business"
    }),
    // 打包分析插件，生成分析报告
    visualizer({
      open: true, // 自动打开分析报告
      gzipSize: true, // 显示 gzip 大小
      brotliSize: true, // 显示 brotli 大小
      filename: 'dist/stats.html' // 分析报告输出路径
    })
  ],

  build: {
    sourcemap: true,
    // 构建目标环境
    target: 'esnext',
    // Material Web Components 配置
    rollupOptions: {
      // 确保正确处理 lit 和 Material Web Components
      external: [/^@material\/web\//]
    },
    // NOTE:L 性能优化 代码压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console 和 debugger
        drop_console: true,
        drop_debugger: true
      }
    },

    // 静态资源处理
    assetsDir: 'assets',
    // chunks 大小警告限制，默认 500kb
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 预加载配置
    modulePreload: {
      polyfill: true
    }
  },

  // 开发服务器配置
  server: {
    port: 3000,
    // 启用 HMR
    hmr: true,
    // 优化预构建
    optimizeDeps: {
      include: ['vue', 'pinia', 'echarts', 'crypto-js', 'lodash']
    }
  },

  // 性能优化配置
  optimizeDeps: {
    // NOTE: 预构建依赖项
    include: ['echarts', 'lodash'],
    // 排除不需要预构建的依赖
    exclude: []
  }
})
