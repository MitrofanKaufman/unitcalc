import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/app' }
    ]
  },
  server: {
    port: 5173,
    strictPort: false
  },
  esbuild: {
    target: 'es2022'
  }
});
