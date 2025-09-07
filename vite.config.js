import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   plugins: [react()],
   build: {
      minify: false,
      sourcemap: true,
      manifest: true,
      rollupOptions: {
         output: {
            entryFileNames: 'assets/[name].js', // Entry points (your main files)
            //   chunkFileNames: 'assets/[name].js', // Code-split chunks (automatically created)
            assetFileNames: 'assets/[name].[ext]' // Static assets (images, CSS, fonts)
         }
      }
   }
})
