import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    open: true,   // abre el navegador automáticamente al correr npm run dev
    hmr: {
      overlay: true, // muestra errores de compilación como overlay en el browser
    },
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 4173,
  },
});
