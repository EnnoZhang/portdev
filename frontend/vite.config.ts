import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 开发用完整 bundler；生产构建用 runtime-only，避免打包进编译器触发 CSP 的 unsafe-eval 限制
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
