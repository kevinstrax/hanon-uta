import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/hanon-uta/' : '/',
  plugins: [vue(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },optimizeDeps: {
    include: ['bootstrap']
  }
})
