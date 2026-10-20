#!/usr/bin/env python3
"""v53 story polish: foreshadowing, chapter 4 reveal, ending callbacks. No game contracts changed."""
from pathlib import Path
import sys
path=Path('src/game/story.ts')
if not path.is_file():sys.exit('Run at repository root: src/game/story.ts missing')
s=path.read_text(encoding='utf-8')
changes=[
# Act 1: seed chat as an archive, and the quiet friend who does notice everything.
("m('taehoon','근데 이 방 원래 누가 만든 거였지?'),m('junho','ㅋㅋㅋㅋㅋㅋ')", "m('taehoon','근데 이 방 원래 누가 만든 거였지?'),m('subin','그거 예전 캡처 보면 나올 듯'),m('junho','단톡방에도 출생신고가 필요하냐 ㅋㅋ'),m('taehoon','아니 근데 진짜 기억 안 나?'),m('junho','ㅋㅋㅋㅋㅋㅋ')"),
# Act 2: distinguish first inviter from persistent room-keeper, without resolving E07 mystery.
("m('junho','근데 이번엔 진짜 나 아님'),m('junho','ㅋㅋㅋㅋ 찾았다')", "m('junho','근데 이번엔 진짜 나 아님'),m('taehoon','초대 누른 사람 찾는다고 끝날 일이 아닌 것 같은데'),m('junho','ㅋㅋㅋㅋ 찾았다')"),
("m('subin','내가 잘못 눌렀나')],[c('inviter_why'", "m('subin','내가 잘못 눌렀나'),m('taehoon','근데 왜 나갈 때마다 다른 방이 생기지?'),m('junho','그게 더 이상함 ㅋㅋ')],[c('inviter_why'"),
# Act 3: hint the real problem is not notification volume.
("m('taehoon','아니 조용한 방 아님?')],[c('quiet_stop'", "m('taehoon','아니 조용한 방 아님?'),m('junho','대화 줄인다고 방이 사라지는 건 아니네 ㅋㅋ')],[c('quiet_stop'"),
# Act 4: central reveal: individually rational actions create a collective trap.
("m('minji','얘들아 우리 이제 진짜 끝내자'),m('junho','뭘')", "m('minji','얘들아 잠깐. 우리 왜 이렇게 방이 많아졌지?'),m('junho','난 첫 번째 초대만 했어. 그건 인정'),m('subin','난 옛날 대화 찾으려고 백업방 남겼고'),m('taehoon','난 여기 말하면 한 명쯤 듣겠지 싶었음'),m('minji','난 그냥 이번엔 진짜 만날 수 있을 줄 알았지'),p(800),m('junho','잠만 그럼 각자 안 없앤 거잖아'),m('subin','맞아. 아무도 안 만든 방은 없네'),m('taehoon','그 말을 내가 1장부터 하고 있었잖아'),m('minji','그런데 정작 나가고 싶다는 애한테만 계속 이유를 물었네'),p(700),m('junho','뭐야 범인이 다섯 명임? ㅋㅋ'),m('subin','단톡방 공동명의네'),m('minji','얘들아 우리 이제 진짜 끝내자'),m('junho','뭘')"),
# Act 4 reaction branches with callback to earlier character behavior.
("m('subin','방장님 공지 좀 써줘')],undefined,'ch5_final'", "m('subin','방장님 공지 좀 써줘'),m('taehoon','나 9시 이후에만 출근 가능'),m('junho','아직도 일정 조율 중임? ㅋㅋ')],undefined,'ch5_final'"),
("m('junho','ㅋㅋ 초대 안 한다면서 초대함')],undefined,'ch5_final'", "m('junho','ㅋㅋ 초대 안 한다면서 초대함'),m('taehoon','방 이름이 거짓말을 하네')],undefined,'ch5_final'"),
("m('player','아니')],undefined,'ch5_final'", "m('player','아니'),m('junho','정리하려고 만든 방부터 정리해야겠는데'),m('subin','그럼 정리방 정리방 파자')],undefined,'ch5_final'"),
("m('minji','안 한다니까 ㅋㅋ')", "m('minji','안 한다니까 ㅋㅋ'),m('taehoon','그럼 나간 다음에 또 초대하면 안 되는 것도 알지?'),m('junho','아까 공동명의 계약 해지했잖아 ㅋㅋ')"),
# Endings: stronger narrative payoffs without changing room/events predicates.
("m('system','신입 방장 교육방에 초대되었습니다.')],undefined,undefined,'E01'", "m('system','신입 방장 교육방에 초대되었습니다.'),m('subin','방장님 OT 참석 여부 투표 부탁드립니다'),m('player','나한테 왜 자꾸 출석을 물어봐')],undefined,undefined,'E01'"),
("m('system','너는 왜 안 나가?')],undefined,undefined,'E02'", "m('system','너는 왜 안 나가?'),p(800),m('player','누가 보낸 거야 이거'),m('system','읽음 1')],undefined,undefined,'E02'"),
("m('junho','첫 출근 축하요 ㅋㅋㅋㅋ')],undefined,undefined,'E03'", "m('junho','첫 출근 축하요 ㅋㅋㅋㅋ'),m('subin','근무 장소: 모든 단톡방'),m('player','퇴사는요'),m('minji','퇴사 신청방 새로 팠어')],undefined,undefined,'E03'"),
("m('system','채팅방이 채팅방에서 퇴장했습니다.',350)],undefined,undefined,'E05'", "m('system','채팅방이 채팅방에서 퇴장했습니다.',350),p(900),m('subin','그럼 방 삭제 회의는 어디서 해?'),m('junho','단톡방이 우리보다 결단력 있네')],undefined,undefined,'E05'"),
("m('minji','근데 우리가 왜 안 잡았냐?')],undefined,undefined,'E06'", "m('minji','근데 우리가 왜 안 잡았냐?'),m('taehoon','나가게 두자고 아까 말했는데'),m('junho','태훈이 말 오늘 처음 들었냐? ㅋㅋ')],undefined,undefined,'E06'"),
("m('taehoon','아 맞다 쟤 우리 초딩 때부터 알던 애 아님?')],undefined,undefined,'E07'", "m('taehoon','아 맞다 쟤 우리 초딩 때부터 알던 애 아님?'),p(800),m('subin','헐 그럼 다시 초대해야 하나'),m('minji','안 돼!!'),m('taehoon','아 근데 이름 뭐였지')],undefined,undefined,'E07'"),
]
updates=[]
for old,new in changes:
 if new in s: continue
 n=s.count(old)
 if n!=1:sys.exit(f'STOP: expected 1 anchor, found {n}: {old[:100]} (no files changed)')
 updates.append((old,new))
for old,new in updates:s=s.replace(old,new,1)
if updates:path.write_text(s,encoding='utf-8')
print(f'v53 applied: {len(updates)} dialogue revisions (of {len(changes)})')
