import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // This import is crucial for v4
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  // Here, we are initializing the tailwindcss() plugin
  plugins: [react(), tailwindcss()], 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})