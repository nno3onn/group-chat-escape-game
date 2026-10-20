# 카톡방탈출 v50 — E04 탈출 밸런스

이번 패치는 v48 이후 정상 동작이 확인된 게임의 **E04 판정 조건만** 교체합니다. 플레이 UI 및 기존 엔딩 테스트 경로는 유지합니다.

- E04 성공: 조용히 퇴장하려는 의도 외에 **알림 문제 설명(`reason_notification`)**, **조용한 방에서 침묵 조절(`quiet_ignore` 또는 `quiet_stop`)**, **친구들이 허용하는 마무리(`ch4_polite`)** 모두 필요.
- 무조건 읽씹(`intro_ignore`, `silent_continue`)만 반복해도 E04가 되지 않음.
- 정상 E04 테스트 경로 유지. 기존 7개 엔딩 판정과 스토리 전체는 유지.
- 회귀 테스트 4개 추가; `test:offline`에 연결.

## 설치

압축을 푼 폴더에 있는 `apply_v50.py` 파일을 **기존 프로젝트 루트로 복사**하고, 함께 있는 `src/game/v50-balance.test.ts` 파일도 프로젝트 안의 같은 위치로 복사하세요.

프로젝트 폴더에서:

```bash
python3 apply_v50.py
npm run test:offline
npm run check
npm run test:e2e
```

**중요:** `apply_v50.py`는 예상한 `src/game/story.ts`의 원본 판정 코드가 다르면 중단해요. 같은 파일 전체를 덮어쓰지 않아 로컬 변경 사항을 보호하도록 만들었습니다.

CI 통과 여부는 GitHub에 반영된 뒤 확인해야 합니다.
