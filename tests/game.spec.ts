import { test, expect } from '@playwright/test';

test('first chat and skip reach a user interaction', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('가상 단톡방 탈출 게임')).toBeVisible();
  await page.getByRole('button', {name: /건너뛰기/}).click();
  await expect(page.getByText('답장을 선택해 주세요')).toBeVisible();
  await expect(page.getByRole('button', {name:'답장 전송'})).toBeDisabled();
});

test('local progress survives reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name: /건너뛰기/}).click();
  await expect(page.getByText('답장을 선택해 주세요')).toBeVisible();
  await page.reload();
  await expect(page.getByText('답장을 선택해 주세요')).toBeVisible();
});

test('narrow viewport has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({width:320,height:640});
  await page.goto('/');
  await expect(page.getByLabel('가상 단톡방 탈출 게임')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
});
