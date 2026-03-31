import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {                        // 👈 注意：这里是 /api
        target: 'http://localhost:3000',
        changeOrigin: true
        // 移除 rewrite，保持 /api 前缀
      }
    }
  }
})