import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Optional: proxy API requests to avoid CORS issues in development
      // '/api': 'http://localhost:8080'
    }
  }
})
