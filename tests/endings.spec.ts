import { test, expect } from '@playwright/test';

const cases: { ending: string; choices: string[] }[] = [
  { ending: 'E01', choices: ['intro_busy','leave_silent','reason_finger','finger_accept','ch4_admin','final_admin'] },
  { ending: 'E02', choices: ['intro_unsure','leave_normal','reason_finger','finger_refuse','ch4_block','final_everyone'] },
  { ending: 'E03', choices: ['intro_busy','leave_silent','reason_finger','finger_practice','ch4_block','final_repeat'] },
  { ending: 'E04', choices: ['intro_ignore','leave_silent','reason_silence','silent_continue','ch4_silence','final_quiet'] },
  { ending: 'E05', choices: ['intro_unsure','leave_normal','reason_notification','quiet_mute','ch4_delete','final_delete'] },
  { ending: 'E06', choices: ['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_polite'] },
  { ending: 'E07', choices: ['intro_busy','leave_normal','reason_silence','silent_identity','ch4_identity','final_identity'] },
];

async function skipToChoice(page: import('@playwright/test').Page) {
  for (let attempt = 0; attempt < 120; attempt++) {
    const skip = page.getByRole('button', { name: /건너뛰기/ });
    if (await skip.isVisible().catch(() => false)) {
      await skip.click();
      continue;
    }
    return;
  }
  throw new Error('Playback did not reach an interaction boundary');
}

async function performChoice(page: import('@playwright/test').Page, id: string) {
  const choice = page.locator(`.modal [data-choice-id="${id}"]`);
  if (id.startsWith('leave_')) {
    const direct = page.locator(`.suggestions [data-choice-id="${id}"]`);
    if (await direct.isVisible().catch(() => false)) await direct.click();
    else await page.getByRole('button',{name:'채팅방 나가기'}).first().click();
    await expect(choice).toBeVisible();
    await choice.click();
    return;
  }
  const outside = page.locator(`.suggestions [data-choice-id="${id}"]`);
  await expect(outside).toBeVisible();
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
      await page.getByRole('button', {name: '시작하기'}).click();
      for (const id of route.choices) {
        await skipToChoice(page);
        await performChoice(page, id);
      }
      await skipToChoice(page);
      await expect(page.locator(`.ending-${route.ending}`)).toBeVisible();
      await expect(page.getByRole('button', { name: '다시 시작하기' })).toBeVisible();
    });
  }
});
