import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Alias para imports limpios
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  build: {
    // Mejorar compatibilidad con navegadores móviles más antiguos
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari12'],
    // Generar sourcemaps para debugging en producción
    sourcemap: true,
    // Optimizar chunks para mejor carga
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          charts: ['recharts'],
          utils: ['lodash', 'axios']
        }
      }
    }
  },

  // Optimizaciones
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'lodash']
  }
})