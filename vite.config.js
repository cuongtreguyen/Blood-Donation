import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  optimizeDeps: {
    include: ['@ant-design/icons'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Sửa lại port nếu backend không phải 8080
    },
  },
})
