# v18 QA report

## Changes
- Reset scroll-to-latest when changing active room or entering spectator view.
- Keep final ending presentation as the priority if the game completes while chat-list view is open.
- Prevent normal typing indicator from appearing in spectator-only scene.
- Increase mobile choice/action touch heights to 44px and adjust narrow/short screen layouts.

## Executed
- `npm run test:offline`: PASS (seven complete story ending routes, 1,504 states, E06/E07 spectator assertions).

## Not executed / not verified
- `npm install`, `npm run build`, and Playwright E2E. Next.js/React dependencies are unavailable in this network-restricted container.
- Real iOS Safari / Android Chrome manual QA.

## Next verification in a network-enabled environment
1. `npm install && npm run check && npm run build`
2. `npx playwright install chromium && npm run test:e2e`
3. Manually inspect 320px/390px layouts, completed ending after switching to room list, and scroll position when switching rooms.
