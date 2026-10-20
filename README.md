# 카톡방탈출 v45 · iOS 개선 + 탈출 밸런스

## 수정 파일 (기존 경로에 그대로 덮어쓰기)
- src/game/story.ts: E04 성공 조건 강화 (관계·경계·타이밍 필요)
- src/app/Game.tsx: 중복 문구 제거, 엔딩 도감 연결, 소리·진동 설정
- src/app/EndingCollection.tsx: 7개 엔딩 발견 기록 브라우저/앱 로컬 저장
- src/app/style.css: 모바일 엔딩 간격과 버튼 색상 정리
- assets/*: 사용자가 확정한 노란 채팅 아이콘 리소스

## 적용
ZIP을 프로젝트 루트에 병합하세요. 새로운 파일 `EndingCollection.tsx`도 필수입니다. `src/game/runtime.ts`는 변경하지 않습니다.

````bash
npm install
npm run test:offline
npm run check
npm run build:mobile
npx @capacitor/assets generate --ios --assetPath assets
npx cap sync ios
npx cap open ios
````

- Xcode: Product > Clean Build Folder 후 iPhone 시뮬레이터에서 Cmd+R
- 설정: 채팅방 메뉴에서 메시지 소리·진동을 켜거나 끌 수 있습니다. iOS 웹뷰의 진동 API는 지원되지 않을 수 있습니다.
- 엔딩 도감: 엔딩 결과 화면에서 펼쳐 볼 수 있습니다. 다른 기기로 자동 동기화되지 않습니다.
- 앱 아이콘: Xcode의 AppIcon 에셋 적용 여부까지 확인하세요. Capacitor assets 생성 및 Xcode 재설치가 필요할 수 있습니다.
- 오프라인/실기기 테스트: 별도 수동 검증이 필요하며 이 환경에서 수행되지 않았습니다.

## 주의
이 ZIP은 최신 GitHub 기준 스토리·UI에 대한 수정본입니다. 로컬에서 추가 변경이 있다면 먼저 백업/비교하세요. 앱 번들 및 네이티브 프로젝트 자체는 포함하지 않습니다.
