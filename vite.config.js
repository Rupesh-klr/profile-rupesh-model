import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No backend. `npm run build` emits a fully static site into /dist
// that can be hosted on any static host (Netlify, GitHub Pages, Hostinger, S3...).
export default defineConfig({
  plugins: [react()],
  // Routed app served from the domain root (public_html) with the .htaccess
  // SPA fallback. If you ever host in a sub-folder, change this to './'.
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
