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