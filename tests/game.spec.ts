import { test, expect } from '@playwright/test';

test('first chat and skip reach a user interaction', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name: /^(시작하기|이어하기)$/}).click();
  await expect(page.getByLabel('가상 단톡방 탈출 게임')).toBeVisible();
  await page.getByRole('button', {name: /건너뛰기/}).click();
  await expect(page.getByText('답장을 선택해 주세요')).toBeVisible();
  await expect(page.getByRole('button', {name:'답장 전송'})).toBeDisabled();
});

test('local progress survives reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name: /^(시작하기|이어하기)$/}).click();
  await page.getByRole('button', {name: /건너뛰기/}).click();
  await expect(page.getByText('답장을 선택해 주세요')).toBeVisible();
  await page.reload();
  await page.getByRole('button', {name: '이어하기'}).click();
  await expect(page.getByText('답장을 선택해 주세요')).toBeVisible();
});

test('narrow viewport has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({width:320,height:640});
  await page.goto('/');
  await page.getByRole('button', {name: /^(시작하기|이어하기)$/}).click();
  await expect(page.getByLabel('가상 단톡방 탈출 게임')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
});


test('pre-game info opens in a modal, without navigating away', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name:'게임 소개'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('button', {name:'모달 닫기'}).click();
  await page.getByRole('button', {name:'플레이 방법'}).click();
  await expect(page.getByRole('dialog')).toContainText('선택');
});

test('the chat screen occupies mobile viewport after starting', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.getByRole('button', {name:'시작하기'}).click();
  await expect(page.getByRole('heading',{name:'카톡방탈출'})).toHaveCount(0);
  const dims=await page.locator('.game-stage .phone').evaluate(el=>({height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width}));
  expect(dims.height).toBe(844);
  expect(dims.width).toBe(390);
});
