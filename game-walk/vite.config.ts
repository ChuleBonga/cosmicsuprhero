import { defineConfig } from 'vite';
export default defineConfig({base:'/play/',css:{postcss:{plugins:[]}},build:{target:'es2022',sourcemap:false,assetsInlineLimit:0,cssCodeSplit:true},server:{host:'0.0.0.0'}});
