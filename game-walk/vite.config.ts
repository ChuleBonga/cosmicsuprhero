import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base:'/play/',
  css:{postcss:{plugins:[]}},
  build:{
    target:'es2022',sourcemap:false,assetsInlineLimit:0,cssCodeSplit:true,
    rollupOptions:{
      input:{
        main:fileURLToPath(new URL('./index.html',import.meta.url)),
        movementLab:fileURLToPath(new URL('./experiments/movement/lab.html',import.meta.url)),
      },
    },
  },
  server:{host:'0.0.0.0'},
});