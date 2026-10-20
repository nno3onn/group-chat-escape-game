import { test, expect, type Page } from '@playwright/test';

const cases: { ending: string; choices: string[] }[] = [
  { ending: 'E01', choices: ['intro_busy','leave_silent','reason_finger','finger_accept','ch4_admin','final_responsibility'] },
  { ending: 'E02', choices: ['intro_unsure','leave_normal','reason_finger','finger_refuse','ch4_block','final_question'] },
  { ending: 'E03', choices: ['intro_busy','leave_silent','reason_finger','finger_practice','ch4_block','final_disappear'] },
  { ending: 'E04', choices: ['leave_menu_ch1_intro','reason_notification','quiet_ignore','ch4_polite','final_disappear'] },
  { ending: 'E05', choices: ['intro_unsure','leave_normal','reason_notification','quiet_mute','ch4_delete','final_responsibility'] },
  { ending: 'E06', choices: ['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear'] },
  { ending: 'E07', choices: ['intro_busy','leave_normal','reason_silence','silent_identity','ch4_identity','final_question'] },
];

// Waiting for the choice boundary must also handle a render between nodes.
// Previously the helper returned as soon as the Skip button disappeared,
// even if the next node had not yet rendered its choices.
async function skipToChoice(page: Page) {
  for (let attempt = 0; attempt < 150; attempt++) {
    const state = await Promise.race([
      page.locator('.suggestions [data-choice-id], .ending-sheet, .modal [data-choice-id]').first()
        .waitFor({ state: 'visible', timeout: 250 }).then(() => 'ready').catch(() => 'pending'),
      page.getByRole('button', { name: /건너뛰기/ })
        .waitFor({ state: 'visible', timeout: 250 }).then(() => 'skip').catch(() => 'pending'),
    ]);
    if (state === 'ready') return;
    if (state === 'skip') {
      await page.getByRole('button', { name: /건너뛰기/ }).click();
      continue;
    }
    await page.waitForTimeout(50);
  }
  throw new Error('Playback did not reach a choice or ending');
}

async function performChoice(page: Page, id: string) {
  const choice = page.locator(`.modal [data-choice-id="${id}"]`);
  if (id.startsWith('leave_')) {
    const direct = page.locator(`.suggestions [data-choice-id="${id}"]`);
    if (await direct.isVisible().catch(() => false)) await direct.click();
    else await page.getByRole('button', { name: '채팅방 나가기' }).first().click();
    await expect(choice).toBeVisible({ timeout: 10000 });
    await choice.click();
    return;
  }
  const outside = page.locator(`.suggestions [data-choice-id="${id}"]`);
  await expect(outside, `Expected choice ${id} to be visible`).toBeVisible({ timeout: 10000 });
  const kind = await outside.getAttribute('data-choice-kind');
  if (kind !== 'reply' && kind !== 'action') throw new Error(`Unknown choice kind for ${id}: ${kind}`);
  await outside.click();
  if (kind === 'reply') {
    const send = page.getByRole('button', { name: '답장 전송' });
    await expect(send).toBeEnabled();
    await send.click();
  }
}

test.describe('all seven story endings by full UI interaction', () => {
  for (const route of cases) {
    test(`${route.ending} is playable`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: '시작하기' }).click();
      for (const id of route.choices) {
        await skipToChoice(page);
        await performChoice(page, id);
      }
      await skipToChoice(page);
      await expect(page.locator(`.ending-${route.ending}`)).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: '다시 시작하기' })).toBeVisible();
    });
  }
});
