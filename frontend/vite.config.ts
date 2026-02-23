import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In Docker dev, the backend is reachable via the service name, not localhost.
// Set API_TARGET=http://backend:3004 in docker-compose.override.yml.
const apiTarget = process.env.API_TARGET ?? 'http://localhost:3004'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5176,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/uploads': { target: apiTarget, changeOrigin: true },
    },
  },
})
