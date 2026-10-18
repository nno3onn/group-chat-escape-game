# v13 QA — 2026-10-18

## Added
- `tests/endings.spec.ts`: seven full browser interaction routes (CH1 through E01–E07), using real choice buttons and story UI; waits for and skips animations only, never selects a story choice automatically.
- Stable `data-choice-id` attributes on reply/action/leave buttons, to decouple E2E tests from Korean copy edits.

## Executed
- `npm run test:offline`: PASS. 7/7 ending states, 1,504 graph states; runtime checks for room changes and persistence.

## Not executed
- `npm install --offline`: FAIL (`ENOTCACHED` for @playwright/test). The environment cannot install missing npm dependencies; Next.js build and browser Playwright remain UNVERIFIED.

## Known follow-up concerns
- In E06 and E07, spectator chat events after leave currently may be written to `original` room; spectator-specific overlay has yet to be implemented. Preserve explicit spectator room/channel in story event schema to avoid cross-room display errors.
- Each end-to-end scripted route should be executed in Chromium after dependencies and browsers are installed. Validate route selectors, timers and screenshots, and fix failures before claiming browser pass.
- `Playwright` iPhone device simulation uses Chromium, not iOS Safari. Real Safari requires separate WebKit/device testing.
- Add test for repeated pause/resume/1.5x toggles with controlled timer and for shared-room scroll positions.

## Commands
```
npm install
npx playwright install chromium
npm run check
npm run build
npm run test:offline
npm run test:e2e
```
