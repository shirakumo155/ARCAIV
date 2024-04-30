import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES  
        ? "ARCAIV"           
        : "./",                     
  plugins: [
    react(),
    svgr({ 
      svgrOptions: {
        // svgr options
      },
    }),],
  
})
