import { defineConfig } from 'vite';
export default defineConfig({
  base: '/',
  css:{postcss:{plugins:[]}}, // Keep legacy Observatory Tailwind/PostCSS config out of the game preview
  build:{target:'es2020',cssCodeSplit:true,reportCompressedSize:true,rollupOptions:{output:{manualChunks:{'phaser-engine':['phaser']}}}},
});
