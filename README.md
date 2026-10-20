# 카톡방탈출 Capacitor 설정 수정

기존 프로젝트 루트의 `capacitor.config.ts`를 이 파일로 교체하세요.

**주의:** 기존 프로젝트의 appId가 `com.katokbang.escape`와 다르다면 기존 appId 값을 유지하세요.

제거 사항: Capacitor 최신 버전에서 지원하지 않는 `bundledWebRuntime` 속성.

빌드 및 iOS 동기화:

```bash
npm run build:mobile
ls out/index.html
npx cap sync ios
npx cap open ios
```

`npm run build:mobile`이 성공한 후 다음 단계를 실행하세요. 이미 생성된 `ios` 폴더에는 `npx cap add ios`를 다시 실행하지 마세요.
