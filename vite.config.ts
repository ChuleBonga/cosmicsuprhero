import { defineConfig } from 'vite';
export default defineConfig({
  base: '/',
  build:{target:'es2020',cssCodeSplit:true,reportCompressedSize:true,rollupOptions:{output:{manualChunks:{'phaser-engine':['phaser']}}}},
});
