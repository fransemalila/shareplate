import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006,
    host: true, // This enables listening on all network interfaces
    open: true, // This will automatically open the browser
    strictPort: true // This ensures the server only uses the specified port
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