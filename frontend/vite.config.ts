import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // This enables listening on all network interfaces
    strictPort: false, // Allow fallback to another port if 3000 is in use
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'mapbox-gl': 'mapbox-gl',
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "mapbox-gl/dist/mapbox-gl.css";`,
      },
    },
  }
}); 