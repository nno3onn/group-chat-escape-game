# 카톡방탈출 v22 — 파스텔 기본 프로필 및 OG 카드

v21에 포함된 기존 게임과 신규 분기, 7개 엔딩을 모두 유지합니다.

변경 사항:
- 캐릭터마다 파스텔 색상 배경 + 독립 제작 사람 실루엣 SVG
- 메인 랜딩의 4명 프로필도 동일한 실루엣 적용
- 공유 미리보기용 1200×630 PNG (`public/og-card.png`)
- Open Graph 및 Twitter Card 메타데이터

압축을 풀고 `katokbang-redesign-ready/` 내부의 파일과 폴더를 GitHub 저장소 **루트에 병합 업로드**하세요. 기존 CI 파일 `.github/workflows/ci.yml`을 삭제하지 마세요.

추천 커밋명: `feat: 파스텔 기본 프로필 및 OG 공유 이미지 적용`

Google AdSense 설정을 변경하지 않았습니다. 공개 대표 주소가 다르면 `src/app/layout.tsx`의 `metadataBase` URL을 실제 도메인으로 변경하세요.
