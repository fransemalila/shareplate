import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true // This will automatically open the browser
  },
  resolve: {
    alias: {
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