# 카톡방탈출 v39 — Vercel 방문자/페이지뷰 분석

## GitHub에 적용하기

- `package.json` → 저장소 루트 `package.json`으로 교체
- `src/app/layout.tsx` → 같은 경로에 교체
- **중요:** GitHub 저장소에 `package-lock.json`이 있다면, 아래 명령을 로컬 저장소 루트에서 실행한 후 갱신된 `package-lock.json`까지 커밋하세요. 잠금파일을 갱신하지 않고 `npm ci`로 빌드하면 실패할 수 있습니다.

```bash
npm install
npm run check
npm run build
```

## Vercel에서 꼭 해야 하는 일

1. Vercel 대시보드 → `group-chat-escape-game` → Analytics → Enable.
2. 변경된 코드 배포 후 사이트 방문.
3. Analytics에서 Visitors, Pageviews, 날짜 범위 확인.

**참고:** 활성화 이후부터 데이터가 집계됩니다. 별도의 '오늘 / 전체' 숫자가 사이트 화면에 노출되는 것은 아닙니다. 조회수는 방문자 수와 다르며, 한 페이지에서 여러 판을 플레이한 경우 페이지뷰가 늘지 않을 수 있습니다. 사용자별 게임 시작/엔딩 이벤트 집계는 이 패치에 포함되지 않았습니다.
