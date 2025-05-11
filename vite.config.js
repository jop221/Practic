import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? './' : '/',
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:5000',
      '/tasks': 'http://localhost:5000',
    },
  },
}));
