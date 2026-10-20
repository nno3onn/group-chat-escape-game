# 카톡방탈출 Capacitor 앱 변환 키트

기존 Next.js 웹 배포는 그대로 유지하면서 Android/iOS 앱용 정적 빌드와 네이티브 프로젝트를 추가합니다.

## 1. 적용

ZIP 내부의 파일·폴더를 **기존 `group-chat-escape-game` 프로젝트 루트**에 경로 그대로 복사합니다.

- `capacitor.config.ts` 새 파일
- `next.config.mjs` 새 파일 (기존 `next.config.*`가 있다면 병합하세요)
- `scripts/build-mobile.mjs` 새 파일
- `src/app/layout.tsx` 교체 (2026-10-20 GitHub master 기준)
- `src/app/AdSlot.tsx` 교체 (앱에서 애드센스 비활성화)
- `package.json` 교체 (Capacitor 의존성과 앱 명령어 추가)
- `README.md`는 기존 프로젝트 README를 덮어쓰지 말고 `MOBILE-README.md`로 보관 권장

**이 파일은 원본 게임 전체 코드가 아닌, 원본 프로젝트에 합치는 변경 파일 묶음입니다.**

## 2. 설치

```bash
npm install
```

해당 명령어는 제공된 `package.json`에 이미 포함되어 있습니다. `npm install`로 `package-lock.json`을 최신 상태로 갱신하여 함께 커밋하세요.

## 3. 프로젝트 초기 생성 (처음 한 번)

```bash
npm run build:mobile
npx cap add android
npx cap add ios
```

- Android 개발에는 Android Studio/Android SDK/JDK 필요
- iOS 앱 빌드·서명에는 macOS/Xcode가 필요
- Windows/Linux에서는 Android만 빌드 가능합니다
- 플랫폼별 네이티브 폴더 `android/`, `ios/`는 이 명령으로 생성합니다
- 생성 이후에는 `npm run mobile:android` / `npm run mobile:ios`로 갱신 및 열기

## 4. 웹과 앱의 차이

- 일반 `npm run build`: 기존 Vercel Next.js 빌드 유지
- `npm run build:mobile`: `out/` 정적 빌드 생성, 서버 불필요
- 앱 빌드는 광고·Vercel Analytics를 비활성화합니다
- 앱 내부 게임 진행 데이터는 기존 브라우저 저장 로직을 재사용합니다
- 오프라인 상태에서는 번들된 게임 화면/스토리를 사용할 수 있지만 외부 리소스·외부 링크는 연결이 필요할 수 있습니다

## 5. 출시 전 체크리스트

1. 앱 ID `com.katokbang.escape`는 임시값입니다. 반드시 소유할 최종 앱 ID로 변경하세요.
2. 원본 스토리 7개 엔딩과 재초대 동작을 실제 기기에서 확인하세요.
3. 로딩 화면, 아이콘, 스플래시 이미지를 브랜드에 맞게 제작/적용하세요.
4. Android 백 버튼·안전 영역·키보드와 스크롤, 다크모드 테스트를 진행하세요.
5. 앱 개인정보처리방침 및 스토어 데이터 안전성 양식을 실제 수집·SDK에 맞게 작성하세요.
6. 앱 광고를 넣으려면 AdSense가 아니라 모바일용 광고 SDK/정책을 별도로 검토하세요.
7. Apple/Google 계정, 서명, 연령 등급, 스크린샷, 심사 제출은 별도 단계입니다.

## 6. 명령어로 검증

```bash
npm run test:offline
npm run check
npm run build
npm run build:mobile
npx cap doctor
```

Next 정적 export가 지원하지 않는 서버 기능이 나중에 추가되면 별도 대응이 필요합니다.

## 현재 확인 범위

GitHub의 소스 구조를 확인해 설정했습니다. 이 환경에서 전체 저장소를 내려받거나 npm 및 Android Studio/Xcode로 완전한 빌드를 수행하지 못했습니다. 실제 실행 여부는 위 명령과 실기기로 검증해야 합니다.
