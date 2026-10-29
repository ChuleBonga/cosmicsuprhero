import { defineConfig } from 'vite';
export default defineConfig({ build:{ target:'es2022', cssCodeSplit:true, rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules/phaser')) return 'phaser-engine';}}}}, server:{host:'0.0.0.0'} });
