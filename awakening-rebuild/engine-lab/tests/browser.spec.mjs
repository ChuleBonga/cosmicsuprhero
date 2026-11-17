import {test,expect} from '@playwright/test';
import path from 'node:path';

const fixture=path.resolve('test-fixtures/CesiumMan.glb');
test('loads a real licensed rigged GLB and evaluates it without approving it',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await page.locator('#model').setInputFiles(fixture);
  await expect(page.locator('#metrics')).toContainText('CesiumMan.glb',{timeout:30000});
  await expect(page.locator('#stage-empty')).toBeHidden();
  await expect(page.locator('#metrics')).toContainText('Skinned skeletons');
  await expect(page.locator('#metrics')).toContainText('Animation groups');
  await expect(page.locator('#status')).toContainText('NOT APPROVED',{timeout:20000});
  await page.locator('#wireframe').check();
  await expect(page.locator('#wireframe')).toBeChecked();
  await page.locator('#autoplay').uncheck();
  await expect(page.locator('#autoplay')).not.toBeChecked();
  await page.screenshot({path:'artifacts/rigged-sample-diagnostic-desktop.png',fullPage:true});
  expect(errors).toEqual([]);
});

test('rejects broken files while preserving the interactive page',async({page})=>{
  await page.goto('/');
  await page.locator('#model').setInputFiles({
    name:'broken.glb',mimeType:'model/gltf-binary',buffer:Buffer.from('not a glTF model')
  });
  await expect(page.locator('#status')).toContainText('GLB import failed',{timeout:12000});
  await expect(page.getByRole('heading',{name:'Asset review room.'})).toBeVisible();
});

test('asset review controls fit a narrow mobile viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.locator('#stage-empty')).toBeVisible();
  const emptyBounds=await page.locator('.stage').boundingBox();
  expect(emptyBounds?.height ?? Infinity).toBeLessThanOrEqual(220);
  await page.locator('#asset-role').selectOption('prop');
  await expect(page.locator('#asset-role')).toHaveValue('prop');
  const size=await page.evaluate(()=>({
    client:document.documentElement.clientWidth,
    scroll:document.documentElement.scrollWidth
  }));
  expect(size.scroll).toBeLessThanOrEqual(size.client+1);
  await page.screenshot({path:'artifacts/asset-review-mobile.png',fullPage:true});
});
test('archived artist reference plates load at correct resolution',async({page})=>{
  const responses=[];
  page.on('response',r=>{if(r.url().includes('/references/')) responses.push({url:r.url(),status:r.status()});});
  await page.goto('/');
  const images=page.locator('.reference-grid img');
  await expect(images).toHaveCount(2);
  for(const image of await images.all()){
    await image.scrollIntoViewIfNeeded();
    await expect.poll(async()=>image.evaluate(el=>el.complete && el.naturalWidth>100 && el.naturalHeight>100)).toBe(true);
  }
  expect(responses.filter(x=>x.status>=400)).toEqual([]);
  await page.screenshot({path:'artifacts/source-reference-comparison.png',fullPage:true});
});
