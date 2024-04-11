import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{
      '/api':{
        target: 'http://3.110.35.122:5000',
        changeOrigin:true,
      }
    }
  }
})
