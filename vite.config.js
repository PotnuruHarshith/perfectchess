import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use './' if deploying to subfolder (GitHub Pages), otherwise '/' for Vercel/Netlify
});
