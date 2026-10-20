# 카톡방탈출 v51 — 엔딩 원인 설명

기존 테스트를 통과한 v50 이후 코드에서 엔딩 결과 설명만 추가하는 패치입니다.

1. ZIP에서 `apply_v51.py`를 프로젝트 루트로 복사합니다.
2. `python3 apply_v51.py`를 실행합니다.
3. `npm run check && npm run test:offline && npm run test:e2e`를 실행합니다.
4. 모바일 반영 시 `npm run build:mobile && npx cap sync ios`를 실행합니다.

바뀌는 파일: `src/app/Game.tsx`, `src/app/style.css`.
스토리 판정, 7개 엔딩 경로, 플레이백 로직은 변경하지 않습니다.
기존 엔딩 카드 아래에 선택에 따른 결과를 짧게 알려주는 안내문을 추가합니다.
이미 적용된 코드나 달라진 소스에서는 anchor 검증에 실패해 중단합니다.
추천 커밋: `feat: explain player choices on ending results`
