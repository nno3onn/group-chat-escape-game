# v55 - E2E 엔딩 테스트 대기 로직 수정

로그에 따르면 E02~E07은 엔딩 판정 전에 첫 선택지에서 멈췄습니다. 테스트가 아무 선택지나 표시되면 진행하도록 되어 있어 잘못된 시점을 포착할 수 있습니다.

이 패치는 `tests/endings.spec.ts`의 대기 헬퍼만 수정합니다. 게임 스토리와 엔딩 판정은 변경하지 않습니다.

## 실행

프로젝트 루트에 `apply_test_fix.py`를 복사한 뒤:

```bash
python3 apply_test_fix.py
npx playwright test tests/endings.spec.ts --reporter=line --workers=1
```

또 실패하면 메시지에 `actual choices`가 출력됩니다. 그 로그를 공유해 주세요.

커밋명: `test: 엔딩별 선택지 대기 로직 및 오류 진단 개선`
