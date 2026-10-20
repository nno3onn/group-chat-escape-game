# 카톡방탈출 v52 — 플레이 중 반응 힌트

## 반영 내용
- 계속 읽씹하면 오히려 확인 메시지가 늘어나는 이유를 등장인물의 대사로 전달
- 조용한 방에서 ‘침묵’과 ‘실제 퇴장’의 차이를 자연스럽게 알려줌
- 재초대를 중단하는 게 중요하다는 단서를 대화 속에 추가
- 퇴장 동의 분기에 후속 대사 추가
- 엔딩 판정, 선택지 ID, 분기 경로 및 UI는 수정하지 않음

## 적용
프로젝트 최상위 폴더에 apply_v52.py를 복사한 뒤:

```bash
python3 apply_v52.py
npm run check
npm run test:offline
npm run test:e2e
```

iOS에서 확인:
```bash
npm run build:mobile
npx cap sync ios
```
Xcode에서 Cmd+R.

패치는 이미 반영된 경우 중복 적용하지 않으며, 예상 코드가 달라졌다면 수정 없이 중단합니다.
**참고:** 이 ZIP의 테스트는 실행하지 않았습니다. GitHub Actions 결과를 확인해 주세요.

추천 커밋: `feat: add subtle chat hints for escape decisions`
