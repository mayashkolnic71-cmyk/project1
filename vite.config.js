import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        dashboard: './dashboard.html',
        activate: './activate.html',
        demo: './demo.html'
      }
    }
  }
})
