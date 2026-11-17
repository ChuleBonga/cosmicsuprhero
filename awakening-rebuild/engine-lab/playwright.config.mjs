import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests',testMatch:'browser.spec.mjs',timeout:60000,
  use:{
    baseURL:'http://127.0.0.1:4178',browserName:'chromium',
    launchOptions:{args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']},
    trace:'retain-on-failure'
  },
  webServer:{
    command:'npm run dev -- --host 127.0.0.1 --port 4178',
    url:'http://127.0.0.1:4178',
    reuseExistingServer:false,timeout:90000
  },
  reporter:[['list'],['html',{outputFolder:'artifacts/report',open:'never'}]]
});