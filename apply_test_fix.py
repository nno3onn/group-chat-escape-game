from pathlib import Path
p=Path('tests/endings.spec.ts')
s=p.read_text()
start=s.index('async function skipToChoice(')
end=s.index('\nasync function performChoice(',start)
replacement='''async function skipToChoice(page: Page, expectedId?: string) {
  const target = expectedId
    ? page.locator(`.suggestions [data-choice-id="${expectedId}"], .modal [data-choice-id="${expectedId}"]`)
    : page.locator('.ending-sheet');
  const skipButton = page.getByRole('button', { name: /건너뛰기/ });
  for (let attempt = 0; attempt < 160; attempt++) {
    if (await target.first().isVisible().catch(() => false)) return;
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      continue;
    }
    // Do not confuse a generic choice from another node with the expected one.
    await page.waitForTimeout(100);
  }
  const visibleIds = await page.locator('.suggestions [data-choice-id]').evaluateAll(
    elements => elements.map(el => el.getAttribute('data-choice-id'))
  );
  const ending = await page.locator('.ending-sheet').getAttribute('class').catch(() => null);
  throw new Error(`Expected ${expectedId ?? 'ending'}; actual choices: ${visibleIds.join(', ') || '(none)'}; ending: ${ending ?? '(none)'}`);
}
'''
s=s[:start]+replacement+s[end:]
old='''        await skipToChoice(page);
        await performChoice(page, id);'''
new='''        await skipToChoice(page, id);
        await performChoice(page, id);'''
if old not in s: raise SystemExit('Expected loop anchor missing; file not changed')
s=s.replace(old,new,1)
p.write_text(s)
print('Patched tests/endings.spec.ts with expected-choice-aware synchronization')
