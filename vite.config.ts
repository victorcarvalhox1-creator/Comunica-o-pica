import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Isso permite que o código acesse process.env.API_KEY sem quebrar no navegador
    'process.env': process.env
  }
});