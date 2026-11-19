import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests', testMatch:'browser-smoke.spec.mjs', timeout:45000,
  // GitHub's x64 Ubuntu image ships Chrome. CI avoids apt mirror failure;
  // local development keeps Playwright's pinned Chromium build.
  use:{baseURL:'http://127.0.0.1:4179',browserName:'chromium',channel:process.env.CI?'chrome':undefined,trace:'retain-on-failure'},
  webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4179',url:'http://127.0.0.1:4179',reuseExistingServer:false,timeout:60000},
  reporter:[['list'],['html',{outputFolder:'artifacts/playwright-report',open:'never'}]]
});