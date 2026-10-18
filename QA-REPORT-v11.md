# v11 QA report

## Scope
- Added full-size ending overlays for E01–E07, with differentiated copy, background, and symbols for E04 (quiet success), E06 (permitted exit followed by disappointment), and E07 (forced removal).
- Previous-room viewing now hides active story choices and offers a return to the currently progressing room.
- No ending collection feature added. Five chapters and seven endings are unchanged.

## Executed
- `npm run test:offline`: PASS — runtime smoke tests (E07, room leave/invite, save/restore, scheduler cancellation/skip).
- Ending reachability: PASS — E01 through E07 reachable; 1,504 states reported by story checker.
- TypeScript TSX syntax transpilation: PASS (no syntax diagnostics).

## Not executed
- `npm run build`, Next.js runtime, Playwright browser tests, responsive/mobile E2E tests. The environment has no cached React/Next.js packages; offline npm install fails with ENOTCACHED. A Chromium binary alone does not establish a running Next.js application.

## Next validation
1. Install dependencies with network enabled.
2. Run `npm run check && npm run build && npm run dev`.
3. Install/configure Playwright and test keyboard, mobile dimensions, timer transitions, scroll behavior and 7 real ending routes.
4. Review the actual runtime behavior of spectator endings and notification semantics visually.
