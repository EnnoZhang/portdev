import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 开发用完整 bundler；生产用 runtime-only，避免在严格 CSP（如 Railway HTTPS）下触发 eval / new Function
export default defineConfig(({ command }) => ({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => false,
      }
    }
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: command === 'serve'
          ? 'vue/dist/vue.esm-bundler.js'
          : 'vue/dist/vue.runtime.esm-bundler.js',
      // 主页使用 vue-i18n；完整包含 JIT 消息编译，会违反 script-src（无 unsafe-eval）。后台入口未用 i18n。
      'vue-i18n': command === 'serve'
          ? 'vue-i18n'
          : 'vue-i18n/dist/vue-i18n.runtime.mjs',
    },
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}))
