#!/usr/bin/env python3
"""v52: story-only hints, no ending predicate or choice changes."""
from pathlib import Path
path=Path("src/game/story.ts")
if not path.exists():
    raise SystemExit("Run from repository root (src/game/story.ts not found).")
src=path.read_text(encoding="utf-8")
changes=[
(
"node('ch3_quiet_ignore',3,[p(1700),m('taehoon','근데 얘 아직 이 방에 있냐'),m('minji','몰라 말 걸지 마')]",
"node('ch3_quiet_ignore',3,[p(1700),m('taehoon','근데 얘 아직 이 방에 있냐'),m('minji','몰라 말 걸지 마'),m('junho','그냥 말 안 하는 거랑 나가는 거랑은 다르지 ㅋㅋ'),m('taehoon','그러니까 아무도 다시 초대 안 해야 끝나는 거 아님?')]"
),
(
"node('ch3_silent_continue',3,[p(2000),m('minji','없는 거 같긴 함'),m('junho','건들지 마')]",
"node('ch3_silent_continue',3,[p(2000),m('minji','없는 거 같긴 함'),m('junho','건들지 마'),m('taehoon','근데 나간 건 아니잖아'),m('minji','읽씹하면 괜히 더 확인하고 싶단 말이야')]"
),
(
"node('ch3_quiet_permission',3,[m('minji','ㅇㅇ 당연하지'),m('junho','ㅇㅇ 안 잡음 진짜'),m('subin','본인 자유지 뭐')]",
"node('ch3_quiet_permission',3,[m('minji','ㅇㅇ 당연하지'),m('junho','ㅇㅇ 안 잡음 진짜'),m('subin','본인 자유지 뭐'),m('junho','근데 누가 또 초대 누르면 말짱 도루묵이잖아 ㅋㅋ')]"
),
(
"m('minji','아 나 미치겠네'),cf('taehoon','그냥 보내주면 안 됨?'",
"m('minji','아 나 미치겠네'),cf('minji','근데 대답 안 하면 더 신경 쓰이긴 해','perfectSilence'),cf('junho','나가고 싶다면 다음엔 초대부터 안 하는 게 맞지','permissionGranted'),cf('taehoon','그냥 보내주면 안 됨?'"
),
(
"node('ch4_polite_after',4,[m('minji','ㅇㅇ'),m('junho','가라 가 ㅋㅋ'),m('subin','응 자유야'),m('player','나중에 뭐라 하지 마'),m('minji','안 한다니까 ㅋㅋ')]",
"node('ch4_polite_after',4,[m('minji','ㅇㅇ'),m('junho','가라 가 ㅋㅋ'),m('subin','응 자유야'),m('player','나중에 뭐라 하지 마'),m('minji','안 한다니까 ㅋㅋ'),m('taehoon','그럼 재초대도 없는 걸로?'),m('junho','그래. 각자 연락할 일 있으면 따로 하자')]"
),
]
pending=[]
for old,new in changes:
    if new in src:
        print("Already applied:", old[:46])
        continue
    count=src.count(old)
    if count!=1:
        raise SystemExit(f"STOP: expected one anchor, found {count}: {old[:80]}")
    pending.append((old,new))
for old,new in pending:
    src=src.replace(old,new,1)
if pending:
    path.write_text(src,encoding="utf-8")
    print(f"Applied {len(pending)} dialogue-only changes to {path}")
else:
    print("No changes needed (v52 already applied)")
