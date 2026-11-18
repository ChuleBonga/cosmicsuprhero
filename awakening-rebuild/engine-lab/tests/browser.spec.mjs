import {test,expect} from '@playwright/test';
import path from 'node:path';

const fixture=path.resolve('test-fixtures/CesiumMan.glb');
test('loads a real licensed rigged GLB and evaluates it without approving it',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#metrics')).toContainText('PRP-001-civic-receiver-v04.glb',{timeout:30000});
  await page.locator('#asset-role').selectOption('character');
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
  await expect(page.locator('#metrics')).toContainText('PRP-001-civic-receiver-v04.glb',{timeout:30000});
  await page.locator('#model').setInputFiles({
    name:'broken.glb',mimeType:'model/gltf-binary',buffer:Buffer.from('not a glTF model')
  });
  await expect(page.locator('#status')).toContainText('GLB import failed',{timeout:12000});
  await expect(page.getByRole('heading',{name:'Asset review room.'})).toBeVisible();
});

test('asset review controls fit a narrow mobile viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.locator('#metrics')).toContainText('PRP-001-civic-receiver-v04.glb',{timeout:30000});
  await expect(page.locator('#stage-empty')).toBeHidden();
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


test('celestial continuity: cover has one sun and repeat plate has two (not a usable sky)',async({page})=>{
  await page.goto('/');
  const counts=await page.evaluate(async()=>{
    async function countLargeSuns(url){
      const image=new Image();image.src=url;await image.decode();
      const cvs=document.createElement('canvas');cvs.width=image.naturalWidth;cvs.height=image.naturalHeight;
      const ctx=cvs.getContext('2d',{willReadFrequently:true});
      if(!ctx)throw new Error('Canvas not available');
      ctx.drawImage(image,0,0);
      const {data}=ctx.getImageData(0,0,cvs.width,cvs.height);
      const n=cvs.width*cvs.height;
      const mask=new Uint8Array(n),seen=new Uint8Array(n),queue=new Int32Array(n);
      for(let i=0;i<n;i++){
        const j=i*4,r=data[j],g=data[j+1],b=data[j+2];
        if(r>180 && r>g*1.3 && r>b*2 && g>45)mask[i]=1;
      }
      let components=0;
      for(let i=0;i<n;i++){
        if(!mask[i]||seen[i])continue;
        let head=0,tail=1;queue[0]=i;seen[i]=1;
        while(head<tail){
          const p=queue[head++],x=p%cvs.width,y=Math.floor(p/cvs.width);
          const testNeighbor=(q)=>{
            if(mask[q]&&!seen[q]){seen[q]=1;queue[tail++]=q;}
          };
          if(x>0)testNeighbor(p-1);
          if(x<cvs.width-1)testNeighbor(p+1);
          if(y>0)testNeighbor(p-cvs.width);
          if(y<cvs.height-1)testNeighbor(p+cvs.width);
        }
        if(tail>3000)components++;
      }
      return components;
    }
    return [
      await countLargeSuns('/references/aa_cover_figure.webp'),
      await countLargeSuns('/references/aa_mountain_repeat.webp')
    ];
  });
  expect(counts).toEqual([1,2]);
});

test('authored project receiver imports with PBR textures and readable desktop staging',async({page})=>{
  const errors=[];
  const failedRequests=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.url().endsWith('.glb')&&response.status()>=400)failedRequests.push(response.url());});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await expect(page.locator('#metrics')).toContainText('PRP-001-civic-receiver-v04.glb',{timeout:30000});
  await expect(page.locator('#metrics')).toContainText('Textures');
  await expect(page.locator('#metrics')).toContainText('Materials');
  await expect(page.locator('#status')).toContainText('NOT APPROVED');
  const metrics=await page.locator('#metrics').textContent();
  expect(metrics).toMatch(/PRP-001/);
  await page.screenshot({path:'artifacts/PRP-001-original-civic-receiver-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Inspect original receiver'}).click();
  await expect(page.locator('#metrics')).toContainText('PRP-001-civic-receiver-v04.glb',{timeout:30000});
  expect(failedRequests).toEqual([]);
  expect(errors).toEqual([]);
});
