# v35: 빠른 연속 채팅방 나가기 수정

문제: 같은 재초대 방 ID를 반복 사용해 이전 메시지가 새 방에 남고, 퇴장 화면이 다음 이벤트까지 지연됨.

수정: 연속 재초대 방마다 고유 ID 사용, 나가기 클릭 즉시 이전 방 참가 상태 해제 및 채팅창 숨김, 회귀 테스트 추가.

## 적용
1. ZIP에서 `apply-fix.py`를 꺼내 기존 `group-chat-escape-game` 프로젝트 루트에 복사합니다.
2. 프로젝트 루트에서 `python3 apply-fix.py` 실행.
3. `npm run test:offline && npm run check && npm run build` 실행.
4. GitHub에 수정된 `src/game/runtime.ts`, `src/game/runtime.test.ts` 2개 파일 커밋.

기존 코드와 일치하지 않으면 스크립트는 오류를 내고 변경을 멈춥니다. 기존 채팅 기록은 내부 저장 데이터에 남더라도 퇴장한 방 화면에는 더 이상 표시되지 않습니다. E06/E07 엔딩의 퇴장 후 관전 연출은 변경하지 않습니다.
