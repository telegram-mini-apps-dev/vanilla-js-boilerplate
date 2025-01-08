import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/sexsex/',
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  // Add proper handling of file types
  assetsInclude: ['**/*.vue'],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
})
