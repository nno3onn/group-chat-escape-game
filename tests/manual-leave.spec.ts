import {test,expect} from '@playwright/test';

test('leave modal supports outside click, cancel, and leaving while a chapter 1 message is playing',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'시작하기'}).click();
 await page.getByRole('button',{name:'채팅방 메뉴'}).click();
 await page.locator('.drawer').getByRole('button',{name:'채팅방 나가기'}).click();
 await expect(page.locator('.modal')).toBeVisible();
 // Tap outside the modal: dismiss without leaving.
 await page.locator('.shade').last().click({position:{x:3,y:3}});
 await expect(page.locator('.modal')).toHaveCount(0);
 await page.getByRole('button',{name:'채팅방 메뉴'}).click();
 await page.locator('.drawer').getByRole('button',{name:'채팅방 나가기'}).click();
 await page.locator('.modal').getByRole('button',{name:'취소'}).click();
 await expect(page.locator('.modal')).toHaveCount(0);
 await page.getByRole('button',{name:'채팅방 메뉴'}).click();
 await page.locator('.drawer').getByRole('button',{name:'채팅방 나가기'}).click();
 await page.locator('.modal [data-choice-id="leave_normal"]').click();
 await expect(page.locator('.modal')).toHaveCount(0);
 for(let i=0;i<80;i++){
  const skip=page.getByRole('button',{name:/건너뛰기/});
  if(!await skip.isVisible().catch(()=>false))break;
  await skip.click();
 }
 await expect(page.locator('.head-title strong')).toContainText('복구');
 await expect(page.locator('[data-choice-id="reason_finger"]')).toBeVisible();
});
