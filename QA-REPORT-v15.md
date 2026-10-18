# v15 QA 보고서

## 코드 변경
- 7개 Playwright 엔딩 테스트에서 답장형/행동형 선택 처리 분리.
- 이전 테스트는 모든 `final_`을 행동이라고 추정했고, 일반 선택은 전송 버튼을 무조건 기대했다. 이제 실제 전송 버튼 노출 여부를 검사한다.
- `routes.test.ts`가 7개 대표 시나리오를 시작부터 완주하고 저장·복원, 기존 방 퇴장, E06/E07 관전 메시지 격리를 검증한다.
- package 버전을 v15로 갱신.

## 검사 한계
- React/Next.js 및 Playwright 패키지가 npm 캐시에 없고 네트워크 설치가 불가하여 브라우저 빌드/E2E 실행은 **미실시**.
- 엔진 검사는 브라우저 렌더·스크롤·타이밍의 검증을 대체하지 않는다.

## 설치 가능한 개발 환경에서 실행
```
npm install
npm run check
npm run build
npm run test:offline
npx playwright install chromium
npm run test:e2e
```
