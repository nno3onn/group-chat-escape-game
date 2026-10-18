# v12 QA — 2026-10-18

## Executed
- `npm run test:offline`: PASS. All 7 ending reachability checks pass; 1,504 states explored.
- Browser available at `/usr/bin/chromium`, but Next.js/React/Playwright dependencies are not installed.
- `npm install --offline --ignore-scripts`: FAILED (ENOTCACHED @types/node), so production build and Playwright tests **NOT EXECUTED**.

## Changes
- Strengthened restore shape checks (invalid room list, missing story data, inconsistent ending rejected).
- Guarded localStorage writes against storage exceptions.
- Clarified top-bar as fictional messenger rather than fake device clock.
- Added Playwright config and three mobile smoke tests (first choice, reload, horizontal overflow), **pending execution**.

## Remaining test blockers and risks
- Run `npm install`, `npm run check`, `npm run build`, `npm run test:e2e` in a connected Node environment.
- Verify Safari/WebKit separately; Chromium mobile emulation is not a replacement for device tests.
- Verify all choices through the browser, timing, room transitions, actual scrolled chat, and seven ending screens.
- Review shared message-room routing and E06/E07 spectator rendering on real browser play.
