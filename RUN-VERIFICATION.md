# 검증 환경 확보 및 실행

## 준비 상태
- Node.js 22 기반 Linux GitHub Actions 설정 `.github/workflows/verify.yml` 추가.
- 푸시/PR/수동 실행 시 의존성 설치 → 타입 검사 → 엔진 테스트 → 프로덕션 빌드 → Chromium E2E 순서로 실행.
- 실패 시 Playwright trace 및 스크린샷을 GitHub Actions 아티팩트로 보관.
- **현재 이 채팅 환경에서 원격 CI가 실행된 것은 아님.** 저장소에 올려야 실행됨.
- package-lock.json이 없으므로 최초 CI에서 `npm install` 사용. CI 첫 성공 후 lockfile을 커밋하고 `npm ci`로 바꾸면 재현성 향상.

## 사용자 측 최소 절차
1. 비공개 GitHub 저장소를 만들고 이 패키지의 압축을 풀어 모든 파일(숨김 `.github` 포함)을 푸시한다.
2. GitHub 저장소 Actions → `Verify game` → Run workflow에서 수동 실행하거나 push 결과를 확인한다.
3. 실패하면 Logs와 `browser-qa-evidence` 아티팩트를 확인하고 코드 수정 후 재실행한다.
4. 모든 CI 테스트 통과 후에만 Vercel에 해당 저장소를 연결해 Preview 배포한다.
5. 실제 iPhone Safari/Android Chrome 검증은 별도 실기기 점검이 필요하다.

## 아직 완료되지 않은 검증
Next.js 빌드, 브라우저 E2E, 모바일 실기기, 공개 배포는 **미완료**. 이 문서 및 CI 워크플로가 실행 가능한 환경의 준비이며 성공 기록은 아니다.
