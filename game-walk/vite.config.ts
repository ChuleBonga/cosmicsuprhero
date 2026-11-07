import { defineConfig } from 'vite';
export default defineConfig({
  base: '/play/',
  css: { postcss: { plugins: [] } },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    rollupOptions: { input: {
      main: 'index.html',
      movementLab: 'experiments/movement/lab.html',
      firstPersonStudy: 'experiments/first-person/index.html',
    }},
  },
  server: { host: '0.0.0.0' },
});
