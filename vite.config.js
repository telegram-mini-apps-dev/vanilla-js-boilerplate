import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl';


// https://vite.dev/config/
export default defineConfig({
  base: '/sexsex/',
  plugins: [vue(), basicSsl()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mecord-beta.2tianxin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
