import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { aliases } from '../../vite.config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      ...aliases
    }
  },
  envDir: path.resolve(__dirname, '../../')
})
