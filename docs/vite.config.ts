import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/ConvertEasy/', // 🔹 Cambia esto por el nombre de tu repo en GitHub
  build: {
    outDir: 'docs' // 🔹 Generará los archivos en la carpeta "docs/"
  }
});
