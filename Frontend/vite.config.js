// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl, // Deployed backend URL
        changeOrigin: true,  // Backend server
      },
    },
  },
});
