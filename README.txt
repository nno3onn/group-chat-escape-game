카톡방탈출 v36 — 성공/실패 엔딩 시각화 및 폭죽 효과

1. ZIP의 apply-ending-effects.py를 프로젝트 최상위 폴더(package.json 위치)에 복사합니다.
2. python3 apply-ending-effects.py 실행
3. npm run check && npm run test:offline && npm run build 실행
4. 변경된 src/app/Game.tsx 및 src/app/style.css를 커밋합니다.

E04/E06: 초록 성공 카드 및 폭죽. E01~E03: 빨간 실패 카드. E05: 보라 특수 엔딩. E07: 파란 강제 퇴장.
폭죽은 CSS만 사용하며 접근성 설정에서 동작 줄이기를 켜면 자동 중단됩니다.
게임 데이터 및 판정 로직은 수정하지 않습니다.
