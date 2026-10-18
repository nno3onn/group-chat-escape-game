# 배포 및 실기기 검증 체크리스트

## 실행 전제
- Node.js 22 LTS + npm 레지스트리 연결 + 실제 설치 가능한 의존성
- `npm install && npm run check && npm run test:offline && npm run build`
- `npx playwright install chromium && npm run test:e2e`
- 프로젝트는 서버 데이터베이스/로그인/AI API 키 없이 실행됨. 배포 대상·계정·도메인 선택은 사용자 결정 필요.

## 미검증 게이트 (완료라 주장 금지)
1. Next.js 프로덕션 빌드 통과 (빌드 로그 보관)
2. Playwright 실제 Chromium 전체 E2E 통과 (trace 보관)
3. 실제 iOS Safari: 320/375/390px, 시스템 글꼴 확대, 주소창 확장/축소, 스크롤, 터치, 화면 회전
4. 실제 Android Chrome: 선택지/메뉴 터치, 채팅 스크롤, 종료 카드, 재접속 복원
5. E04 이후 새로운 방·알림·관전 메시지 0건 확인, E06 자발적 탈출+관전, E07 강제 퇴장 분리
6. Lighthouse 접근성/성능 측정 및 불합격 항목 수정
7. 호스팅 선정 후 HTTPS/공개 URL/새로고침/404/모바일 접속 확인
8. 광고를 붙이는 경우 광고 표시·개인정보 처리방침·정책 별도 검토. 현재 광고 미적용

## 배포 절차 예시 (선택한 플랫폼에서 실행)
- `npm ci` 는 lock 파일을 만들어 커밋한 뒤 사용 (`npm install`로 먼저 생성)
- `npm run check && npm run test:offline && npm run build && npm run test:e2e`
- 플랫폼의 Next.js 프로젝트 새 배포 → 발급된 Preview URL에서 재검증 → 사용자 승인 후 production
- 도메인 연결은 사용자 계정에서 지정. 대외 공개를 자동으로 실행하지 않음

## 실패 시 수집할 정보
명령어, OS/Node/npm 버전, 에러 로그, Playwright trace, 휴대폰 기종/브라우저/버전, 재현 단계와 영상.
