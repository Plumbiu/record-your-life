/* eslint-disable @stylistic/max-len */
import path from 'node:path'
import { compression } from 'vite-plugin-compression2'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    compression({
      deleteOriginalAssets: true,
    }),
  ],
  build: {
    minify: 'terser',
    outDir: '../record-your-life/dist/web',
    copyPublicDir: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
