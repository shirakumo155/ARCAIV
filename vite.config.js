import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  let base = "/"

  if (mode === "production") {
    base = "/ARCAIV/"
  }

  return {
    plugins: [react()],
    base: base,
  };
})