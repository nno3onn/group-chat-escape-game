# v17 QA report (2026-10-18)

## Verified in this environment
- `npm run test:offline`: PASS. All seven representative ending routes complete; spectator tests for E06/E07 pass.
- Source review: message list scroll now targets its scroll container rather than calling `scrollIntoView`, preventing unintended parent-page scroll during automated chat.
- Source review: skip invalidates the active playback generation before committing queued events.
- Playback effect cleanup no longer sets React state during cleanup; new effect owns typing display.

## Not verified
- `npm install`: BLOCKED by DNS EAI_AGAIN to registry.npmjs.org.
- Next.js build, TypeScript full type check with React types, and Playwright E2E: NOT RUN.
- Real mobile Safari, Android Chrome, actual pacing and scroll visuals: NOT TESTED.

## Next steps in connected developer machine
1. `npm install`
2. `npm run check && npm run build && npm run test:offline`
3. `npx playwright install chromium && npm run test:e2e`
4. Review actual game scroll and animations on real mobile browsers; resolve any failures before claiming browser pass.
