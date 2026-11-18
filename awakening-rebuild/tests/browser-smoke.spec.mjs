import {PNG} from 'pngjs';
import { test, expect } from '@playwright/test';

test.describe('Actual player journeys', () => {
  test('two decisions change accessible district states and survive reload', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The Return' })).toBeVisible();

    for (const role of ['Caretaker', 'Courier', 'Apprentice']) {
      await page.getByRole('button', { name: 'Hear ' + role }).click();
    }
    await expect(page.getByRole('heading', { name: 'Reconstruct the night' })).toBeVisible();

    const choose = async name => {
      await page.locator('.evidence-item').filter({has:page.getByRole('heading',{name})}).getByRole('button').click();
    };
    await choose('Silence');
    await choose('Refuge');
    await choose('Dispatch');
    await page.getByRole('button',{name:'Present your reconstruction'}).click();
    await expect(page.getByText(/Trust remaining: 1/)).toBeVisible();

    await page.getByRole('button',{name:'Clear order'}).click();
    await choose('Dispatch');
    await choose('Refuge');
    await choose('Silence');
    await page.getByRole('button',{name:'Present your reconstruction'}).click();
    await expect(page.getByRole('heading',{name:'The choice'})).toBeVisible();
    await page.getByRole('button',{name:'Choose: Protect the location'}).click();
    await expect(page.getByText(/Accessible destinations: hall, workshop/)).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading',{name:'A consequence, not a collectible'})).toBeVisible();
    await expect(page.getByText(/Accessible destinations: hall, workshop/)).toBeVisible();
    await page.getByRole('button',{name:'Approach Caretaker'}).click();
    await expect(page.getByRole('status')).toContainText('Caretaker:');

    await page.getByRole('button',{name:'Restart encounter'}).click();
    for(const role of ['Caretaker','Courier','Apprentice']) {
      await page.getByRole('button',{name:'Hear '+role}).click();
    }
    await choose('Dispatch');
    await choose('Refuge');
    await choose('Silence');
    await page.getByRole('button',{name:'Present your reconstruction'}).click();
    await page.getByRole('button',{name:'Choose: Disclose the record'}).click();
    await expect(page.getByText(/Accessible destinations: refuge, workshop/)).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test('keyboard access and a clean mobile viewport', async ({page}) => {
    await page.setViewportSize({width:390,height:844});
    await page.goto('/');
    await expect(page.getByRole('heading',{name:'The Return'})).toBeVisible();
    const widths=await page.evaluate(()=>({
      client:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client+1);
    const first=page.getByRole('button',{name:'Hear Caretaker'});
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText(/ACCOUNT RECORDED/).first()).toBeVisible();
    const btn=page.getByRole('button',{name:'Hear Courier'});
    const size=await btn.boundingBox();
    expect(size?.height ?? 0).toBeGreaterThanOrEqual(44);
    await page.screenshot({path:'artifacts/mobile-390.png',fullPage:true});
  });

  test('captured wide-screen first frame', async ({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto('/');
    await page.screenshot({path:'artifacts/desktop-1440.png',fullPage:true});
    await expect(page.locator('#stage')).toBeVisible();
  });
});

test.describe('Physical Arrival Quarter integration',()=>{
  async function pixelCount(page){
    const png=PNG.sync.read(await page.locator('#world-canvas').screenshot());
    const base=[png.data[0],png.data[1],png.data[2]];
    let visible=0;
    for(let y=6;y<png.height-6;y+=4)for(let x=6;x<png.width-6;x+=4){
      const i=(y*png.width+x)*4;
      if(Math.abs(png.data[i]-base[0])+
         Math.abs(png.data[i+1]-base[1])+
         Math.abs(png.data[i+2]-base[2])>75)visible++;
    }
    return visible;
  }

  test('authored 3D GLBs render; player moves and physically inspects the courier case',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setViewportSize({width:1440,height:900});
    await page.goto('/');
    await page.getByRole('button',{name:/Enter the Arrival Quarter/}).click();
    const scene=page.locator('#world-rehearsal');
    await expect(scene).toBeVisible();
    await expect(scene).toHaveAttribute('data-assets','ready',{timeout:30000});
    await expect.poll(()=>pixelCount(page),{timeout:30000}).toBeGreaterThan(1700);
    const x0=Number(await scene.getAttribute('data-player-x'));
    const z0=Number(await scene.getAttribute('data-player-z'));
    expect(x0).toBeCloseTo(14,0);
    expect(z0).toBeCloseTo(18,0);
    await page.screenshot({path:'artifacts/field-world-desktop.png'});
    // Observe the position on browser animation frames rather than coarse
    // host-side polling, which can overshoot an evidence object at low FPS.
    await page.keyboard.down('d');
    await page.waitForFunction(
      ()=>Number(document.getElementById('world-rehearsal')?.dataset.playerX)>21.65,
      null,{polling:'raf',timeout:12000}
    );
    await page.keyboard.up('d');
    await page.keyboard.down('w');
    await page.waitForFunction(
      ()=>Number(document.getElementById('world-rehearsal')?.dataset.playerZ)<6.55,
      null,{polling:'raf',timeout:12000}
    );
    await page.keyboard.up('w');
    await expect(page.getByRole('button',{name:'Inspect Courier case'})).toBeEnabled();
    await page.keyboard.press('e');
    await expect(page.locator('#world-prompt')).toContainText('Provisional Courier account');
    await expect(page.locator('#world-chronology')).toContainText('1/3');
    await expect.poll(async()=>
      Number(await scene.getAttribute('data-case-lid-angle')),
      {timeout:7000}
    ).toBeLessThan(-1.0);
    await expect(scene).toHaveAttribute('data-inspection','courier_case');
    await expect(page.getByRole('button',{name:'Return to survey'})).toBeEnabled();
    const beforeInspectionMove=Number(await scene.getAttribute('data-player-x'));
    await page.keyboard.down('d');
    await page.waitForTimeout(400);
    await page.keyboard.up('d');
    const afterInspectionMove=Number(await scene.getAttribute('data-player-x'));
    expect(afterInspectionMove).toBeCloseTo(beforeInspectionMove,1);
    await page.screenshot({path:'artifacts/field-world-courier-closeup-desktop.png'});
    await page.keyboard.press('Escape');
    await expect(scene).toHaveAttribute('data-inspection','none');
    await expect(scene).toBeVisible();
    await expect(page.getByRole('button',{name:'Inspect Courier case'})).toBeEnabled();
    await page.getByRole('button',{name:'Return to chapter'}).click();
    await expect(scene).toBeHidden();
    await expect(page.getByText('1 / 3 accounts heard')).toBeVisible();
    await page.reload();
    await expect(page.getByText('1 / 3 accounts heard')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('mobile spatial controls are accessible and render actual 3D pixels',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto('/');
    const opener=page.getByRole('button',{name:/Enter the Arrival Quarter/});
    await opener.click();
    const scene=page.locator('#world-rehearsal');
    await expect(scene).toHaveAttribute('data-assets','ready',{timeout:30000});
    await expect.poll(()=>pixelCount(page),{timeout:30000}).toBeGreaterThan(300);
    const start=Number(await scene.getAttribute('data-player-z'));
    const btn=page.getByRole('button',{name:'Move north'});
    const box=await btn.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(44);
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    await page.mouse.down();
    await page.waitForTimeout(800);
    await page.mouse.up();
    await expect.poll(async()=>Number(await scene.getAttribute('data-player-z'))).toBeLessThan(start-1.2);
    const overflow=await page.evaluate(()=>({
      client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client+1);
    await page.screenshot({path:'artifacts/field-world-mobile.png'});
    await page.getByRole('button',{name:'Return to chapter'}).click();
    await expect(scene).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('a saved disclosure changes physical hall access and receiver state',async({page})=>{
    await page.goto('/');
    for(const role of ['Caretaker','Courier','Apprentice'])await page.getByRole('button',{name:'Hear '+role}).click();
    const select=async name=>page.locator('.evidence-item').filter({
      has:page.getByRole('heading',{name})
    }).getByRole('button').click();
    await select('Dispatch');await select('Refuge');await select('Silence');
    await page.getByRole('button',{name:'Present your reconstruction'}).click();
    await page.getByRole('button',{name:'Choose: Disclose the record'}).click();
    await page.getByRole('button',{name:/Enter the Arrival Quarter/}).click();
    await expect(page.locator('#world-chronology')).toContainText('Accessible: refuge, workshop');
    await expect(page.locator('#world-status')).toContainText('Accessible: refuge, workshop');
    await page.getByRole('button',{name:'Return to chapter'}).click();
    await page.reload();
    await page.getByRole('button',{name:/Enter the Arrival Quarter/}).click();
    await expect(page.locator('#world-chronology')).toContainText('Accessible: refuge, workshop');
  });
});
