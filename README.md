# 카톡방탈출 아이콘 에셋 수정본 v42

이 ZIP은 사용자가 지정한 노란색 채팅 아이콘 기준으로 모바일 앱 에셋을 교체하기 위한 파일입니다.

## 포함 파일
- assets/icon.png
- assets/icon-foreground.png
- assets/icon-background.png
- assets/splash.png

## 적용 방법
1. 기존 프로젝트 루트에 `assets/` 폴더를 덮어쓰기 합니다.
2. 아래 명령어를 실행합니다.

```bash
npx @capacitor/assets generate --assetPath assets
npx cap sync
```

## 권장 커밋명
```
feat: 모바일 앱 아이콘 및 스플래시를 노란 채팅 아이콘으로 교체
```
