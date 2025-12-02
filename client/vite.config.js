import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Electron
  server: {
    port: 5173,
    proxy: {
      '/stream': 'http://localhost:3001',
      '/metadata': 'http://localhost:3001',
      '/search': 'http://localhost:3001',
      '/health': 'http://localhost:3001',
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
