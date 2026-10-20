# 카톡방탈출 v41 — Android/iOS 앱 아이콘 및 시작 화면

## 전제
기존 저장소에 v40 Capacitor 설정이 적용되어 있어야 합니다. 이 ZIP은 **추가 에셋 폴더**만 제공하며 웹용 `src/app` 코드를 덮어쓰지 않습니다.

## 파일
- `assets/icon.png`: 전체 아이콘 1024×1024
- `assets/icon-foreground.png`: Android 적응형 아이콘 전경 (투명)
- `assets/icon-background.png`: Android 적응형 아이콘 배경
- `assets/splash.png`: 스플래시 원본 2732×2732

## 적용
프로젝트 최상위에 `assets/` 폴더를 복사한 뒤 아래를 실행하세요.

```bash
npm install
npm run build:mobile
npx cap add android  # 최초 한 번만. 이미 android/가 있으면 생략
npx cap add ios      # 최초 한 번만. 이미 ios/가 있으면 생략
npx @capacitor/assets generate --assetPath assets
npx cap sync
npx cap open android  # Android Studio
# 또는 npx cap open ios (macOS + Xcode)
```

`@capacitor/assets` 명령은 플랫폼 프로젝트가 존재해야 아이콘과 스플래시를 적용할 수 있습니다. 기기나 에뮬레이터에서 시작 화면·마스킹을 직접 확인하세요.

## 주의
- 기존 웹 배포와 스토리·게임 UI는 변경하지 않습니다.
- 에셋을 만들었지만 실제 네이티브 빌드와 기기 테스트는 수행하지 않았습니다.
- Capacitor 기본 스플래시는 iOS/Android 버전에 따라 표시 방식이 달라질 수 있습니다.
- 스토어 게시용 스크린샷, Apple·Google 개발자 계정 및 서명은 별도로 필요합니다.
- 다음 단계는 엔딩 도감·선택 시 진동·메시지 사운드입니다.
