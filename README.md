# v48 — E04 브라우저 경로와 스토리 일치화

GitHub의 동일한 상대 경로에 두 파일을 덮어씁니다:
- `src/app/Game.tsx`
- `tests/endings.spec.ts`

## 원인
`leave_menu_ch1_intro`는 스토리 엔진에서는 `choose`로 처리되지만, 화면에서는 모든 나가기 버튼을 `leaveChat`으로 처리하여 다음 분기가 바뀌었습니다.

## 수정
- 게임 스토리의 직접 나가기 선택은 기존 확인 모달을 유지하되 확인 시 원래의 스토리 선택을 실행합니다.
- 상단 메뉴에서의 일반 나가기는 기존 `leaveChat` 동작을 유지합니다.
- Playwright 테스트에서도 E04 첫 액션 뒤 확인 모달을 누릅니다.
- 다른 엔딩 루트는 변경하지 않았습니다.

## 검증
`npm run check && npm run test:offline && npm run test:e2e`

참고: 변경 후 GitHub Actions 결과는 재실행하여 확인해야 합니다.
