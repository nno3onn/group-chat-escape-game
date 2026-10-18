# QA v14

- E06/E07: 플레이어 퇴장 후 관전 대화를 별도 spectator.messages에 보관
- 실제 room.messages에는 퇴장 후 메시지 삽입하지 않음
- 관전 안내 배너를 통해 실제 참여와 구분
- E07 강제퇴장 이벤트 직후 방 나가기 상태 반영
- 테스트: npm run test:offline
- 브라우저 E2E 및 Next.js 빌드는 별도 수행 필요
