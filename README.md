# 카톡방탈출 v49 — 시작 화면 엔딩 도감

## 적용
ZIP 안의 `src/app/Landing.tsx`와 `src/app/collection-home.css`를 프로젝트에서 동일한 경로에 복사하세요. `Landing.tsx`는 기존 파일을 덮어쓰고, `collection-home.css`는 새 파일입니다.

## 변경 범위
- 시작 화면에서도 기존 `EndingCollection` 컴포넌트를 열어 7개 엔딩 발견 현황을 확인할 수 있습니다.
- 현재 도감과 동일한 localStorage 키를 사용하므로 이전에 발견한 엔딩 수집 상태가 유지됩니다.
- 발견하지 않은 엔딩 이름은 숨깁니다.
- 게임 엔진, 선택지, 엔딩 분기, 기존 E2E 테스트 파일은 변경하지 않습니다.

## 검증
`npm run check && npm run test:offline && npm run test:e2e && npm run build:mobile`
이 ZIP은 CI/기기 테스트를 실행한 결과물이 아닙니다. GitHub에 업로드한 후 확인해 주세요.

## 추천 커밋
`feat: show ending collection on landing screen`
