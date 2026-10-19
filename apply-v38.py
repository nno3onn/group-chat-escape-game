#!/usr/bin/env python3
"""Apply v38 story overhaul to an existing group-chat-escape-game checkout.
Refuses mismatched source to avoid silently corrupting user changes."""
from pathlib import Path
import re, sys
root=Path(__file__).resolve().parent
story_path=root/'src/game/story.ts'
if not story_path.exists(): sys.exit('ERROR: 프로젝트 루트에 v38_apply.py를 놓고 실행해 주세요. src/game/story.ts가 없습니다.')
s=story_path.read_text()
if 'v38: unified mystery-comedy story' in s: sys.exit('v38 already applied; no changes')
if "export function deriveMemory" not in s or "node('ch4_open'" not in s: sys.exit('ERROR: v34+ 기반의 story.ts가 아닙니다. 덮어쓰지 않았습니다.')

def replace_line(node_id, func):
 global s
 pat=re.compile(r"^node\('"+re.escape(node_id)+r"'.*$", re.M)
 mt=pat.search(s)
 if not mt: raise ValueError('Missing story node: '+node_id)
 s=s[:mt.start()]+func(mt.group(0))+s[mt.end():]

def insert_event(node_id, additions):
 def apply(line):
  anchor=re.search(r"node\('"+re.escape(node_id)+r"',[1-5],\[",line)
  if not anchor: raise ValueError('Bad node syntax: '+node_id)
  return line[:anchor.end()]+additions+','+line[anchor.end():]
 replace_line(node_id,apply)

def replace_text(node_id, old, new):
 def apply(line):
  if old not in line: raise ValueError('Missing original dialogue in '+node_id+': '+old)
  return line.replace(old,new)
 replace_line(node_id,apply)

# Establish an early, coherent mystery rather than isolated re-invite gags.
replace_text('ch1_intro',"m('taehoon','나 9시에 끝난다고')","m('taehoon','근데 이 방 원래 누가 만든 거였지?')")
replace_text('ch1_available',"m('junho','ㅋㅋㅋㅋ 또 치킨 얘기')","m('junho','수빈아 택배는 나중에 확인해 ㅋㅋ')")
insert_event('ch2_left', "m('taehoon','아까 내가 하려던 얘기가 그거야'),m('junho','내가 첫 번째로 초대 누른 적은 있긴 한데'),m('junho','근데 이번엔 진짜 나 아님')")
insert_event('ch2_stayed', "m('taehoon','근데 원래 방은 누가 처음 만들었더라?'),m('subin','나 예전 단톡 사진 있는 것 같은데'),m('subin','잠깐 그거 어디 저장했지')")
insert_event('ch2_inviter', "m('junho','처음엔 내가 한 번 초대 눌렀어. 그건 미안'),m('minji','그러면 이번엔 누가 누른 거야?'),m('taehoon','그 얘길 내가 아까부터 하고 있잖아')")
insert_event('ch3_vote_intro', "m('taehoon','우리가 나가는 걸 허락해 줄 자격이 있는 거야?'),m('junho','그냥 본인이 정하면 되는 거 아님?')")
insert_event('ch3_quiet_intro', "m('subin','나 옛날 스크린샷 찾는 중인데'),m('subin','사진이 4천 장이라 좀 걸림')")
insert_event('ch3_silent_intro', "m('taehoon','잠깐, 나 처음 방 화면 캡처한 거 있는데'),m('subin','나도 있음 근데 어디 갔더라')")
insert_event('ch3_finger_intro', "m('junho','그러고 보니 나 예전에 실수로 초대한 적은 있긴 해')")
insert_event('ch4_open', "cm('minji','아니 그냥... 우리 요즘 거의 못 보잖아','boundary',1),cm('minji','여기서라도 말하면 만날 줄 알았지','minjiTrust',1),cm('junho','내가 처음에 한 번 초대하긴 했어. 그 다음은 나도 몰라','junhoSupport',1),cm('taehoon','드디어 내 말 들을 생각 있는 거야?','taehoonHeard',1),cm('subin','잠깐. 내가 옛날 단톡 사진 찾은 것 같은데','subinRapport',1)")
insert_event('ch5_final', "cm('taehoon','그때 초대 기록에 네 이름이 비어 있었다니까','taehoonHeard',2),cm('subin','사진 찾았다. 근데 이 캡처에는 네 이름이 안 보여','subinRapport',2),cm('minji','솔직히 자꾸 붙잡은 건 내가 미안해','boundary',2),cm('junho','다음에는 아무도 다시 초대 안 하기로 하자','junhoSupport',2)")
# Respect the canonical ending contracts, while paying off character seeds.
insert_event('ending_E01',"m('minji','아까 네가 정리 잘하길래... 미안')")
insert_event('ending_E02',"m('junho','정리하자고 한 게 이렇게 될 줄은 몰랐네')")
insert_event('ending_E03',"m('subin','잠깐, 이거 계속 나가는 사람 QA로 뽑으면 되겠다')")
insert_event('ending_E05',"m('subin','퇴장 신청서랑 백업방이랑 검토방까지 만들었는데')")
insert_event('ending_E06',"m('minji','우리 요즘 못 봐서 좀 붙잡고 싶었어'),m('player','그래도 내 선택은 내가 할게'),m('junho','ㅇㅇ 그건 맞지')")
insert_event('ending_E07',"m('subin','옛날 캡처에는 진짜 이름이 안 보여'),m('taehoon','근데 캡처가 잘린 거 아냐?')")
# E07's final Taehoon line remains the last message, preserving its punchline.
# New memory rules: clues should require both people for E07; mere button spamming never succeeds.
old="if(choiceId==='final_question')return mem.identityClues>=2?'E07':mem.chaos>=3?'E05':'E02';"
new="if(choiceId==='final_question')return mem.identityClues>=2 && (mem.taehoonHeard>=1 && mem.subinRapport>=1 || mem.identityClues>=3)?'E07':mem.chaos>=3?'E05':'E02';"
if old not in s: raise ValueError('v38 final resolver anchor missing')
s=s.replace(old,new)
# E04 needs a true silence interaction, not simply silent leave actions.
old="if(choiceId==='final_disappear')return mem.silence>=2?'E04':state.flags.includes('finalPermission')||mem.junhoSupport>=2?'E06':'E03';"
new="if(choiceId==='final_disappear')return mem.silence>=2 && state.history.some(x=>['silent_continue','quiet_ignore','ch4_silence'].includes(x))?'E04':state.flags.includes('finalPermission')||mem.junhoSupport>=2 && mem.boundary>=1?'E06':'E03';"
if old not in s: raise ValueError('v38 silence anchor missing')
s=s.replace(old,new)
# Make dedicated paths to gather missing rapport rather than a final random unlock.
s="// v38: unified mystery-comedy story; dialogue callbacks and ending evidence tied to player choices\n"+s
story_path.write_text(s)
print('UPDATED src/game/story.ts')
