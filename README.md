# 카톡방탈출 v47 E2E 수정

GitHub Actions 39382379368에서 E04 실패 수정. `leave_menu_ch1_intro`는 모달이 아닌 일반 선택지이므로 `leave_silent`와 `leave_normal`만 확인 모달 분기로 처리합니다.

`tests/endings.spec.ts`를 같은 경로에 덮어쓴 뒤 `npm run test:e2e`를 실행하세요. 게임 코드는 수정하지 않습니다.

커밋명: `test: E04 직접 나가기 선택지 E2E 처리 수정`
