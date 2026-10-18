# v16 QA 결과 (2026-10-18)

## 실제 실행
- `npm run test:offline`: 통과. 7개 엔딩 대표 경로 완주, 1,504개 상태 탐색, 퇴장/재초대/관전 메시지 검증.
- `npm install --offline --ignore-scripts`: 실패(`ENOTCACHED`, @playwright/test 미캐시).
- `tsc --noEmit`: 전체 실패. react, next, @types/node, @playwright/test 등 필요한 패키지가 없음. 결과를 실제 프로젝트 타입 검증 실패로 단정할 수 없음.
- `npm run build`, `npm run test:e2e`: 패키지 설치가 불가능해 미실행.

## 수정 사항
- `tsconfig.json`의 `allowImportingTsExtensions: true` 추가: `.ts` 경로 임포트 설정 정합성 해결.
- `routes.test.ts`의 spectator null 검사 명시.

## 남은 차단 요소
1. 네트워크 접근 가능한 개발 환경에서 `npm install` 후 `npm run check`, `npm run build`, `npx playwright install chromium`, `npm run test:e2e` 순으로 실행.
2. E06/E07 관전 UI의 브라우저 렌더링과 스크롤, 저장/복구, 메시지 재생 타이밍은 검증되지 않음.
3. 모바일 Safari 실기기 테스트 필요.

**주의:** v16은 빌드/E2E 완료 버전이 아니며 오프라인 엔진만 검증됨.
