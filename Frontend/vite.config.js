// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://a-new-story-backend-4jyi.onrender.com', // Deployed backend URL
        changeOrigin: true,  // Backend server
      },
    },
  },
});
