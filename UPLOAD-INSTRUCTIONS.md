# GitHub 업로드 누락 수정 안내

기존 저장소에는 `src/`, `tests/`, `package.json`이 이미 올라갔으므로 **전체 소스를 재업로드하지 않아도 됩니다**.

## 필수: GitHub Actions 워크플로 1개 추가

GitHub 저장소 → Add file → Create new file

파일 이름란에 정확히 다음 경로를 입력합니다:

`.github/workflows/verify.yml`

이 패키지의 `.github/workflows/verify.yml` 파일 내용을 붙여넣고 Commit changes를 누릅니다.

**주의:** `.github`는 점(.)으로 시작하는 숨김 폴더여서, 파일을 드래그하거나 모바일에서 업로드할 때 누락될 수 있습니다. 웹 UI에서 경로를 직접 만들어야 가장 확실합니다.

파일 생성 후 확인 주소:
https://github.com/nno3onn/group-chat-escape-game/blob/master/.github/workflows/verify.yml

Actions 실행 주소:
https://github.com/nno3onn/group-chat-escape-game/actions

검사는 npm 설치, TypeScript, 오프라인 엔진, Next.js 빌드, Playwright Chromium을 포함합니다. **워크플로 파일이 존재한다고 성공한 것은 아닙니다. Actions 결과를 반드시 확인해야 합니다.**

## 확인해야 할 사항
- 루트에 `package.json`, `tsconfig.json`, `playwright.config.ts` 존재
- `src/app/`, `src/game/`, `tests/` 존재
- `.github/workflows/verify.yml` 존재
- `.gitignore` 권장 (빌드 출력, .env 제외)

Vercel 저장소 연결은 GitHub의 Vercel 앱에 이 저장소 접근 권한이 부여되어야 가능합니다. AdSense는 사이트 배포·심사 준비 뒤 적용합니다.
