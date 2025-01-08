import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/sexsex/',
})
// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     host: '0.0.0.0', // Listen on all network interfaces
//     port: 5173, // Default Vite port
//   }
// }) 