import {test, expect} from '@playwright/test';

test('ending screen is readable at 320px with no horizontal overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto('/');
 await expect(page.getByLabel('가상 단톡방 탈출 게임')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('page identifies itself as a fictional messenger',async ({page})=>{
 await page.goto('/');
 await expect(page.getByText('톡망함 · 게임')).toBeVisible();
});
