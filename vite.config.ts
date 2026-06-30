import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// GitHub Pages serves project sites from /<repo>/, so the production build
// needs that base path. Local dev stays at the root for convenience.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/GforceThespians/' : '/',
  plugins: [react(), tailwindcss()],
}));
