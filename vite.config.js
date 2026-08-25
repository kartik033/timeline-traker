import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set `base` to your repo name if deploying to GitHub Pages, e.g. '/timeline-tracker/'.
// Leave as '/' for Netlify, Vercel, or a custom domain root deploy.
export default defineConfig({
  plugins: [react()],
  base: '/',
});