from pathlib import Path
p=Path('src/app/Game.tsx')
s=p.read_text()
needle=" const ending=endingDescriptions[state.endingId??''];"
assert s.count(needle)==1,'Ending insertion anchor changed'
insert=""" const ending=endingDescriptions[state.endingId??''];
 // v51: contextual, spoiler-safe recap of choices already made (no change to ending logic).
 const history=state.story.history;
 const reasonForEnding=(()=>{
  if(state.phase!=='completed')return null;
  if(state.endingId==='E04')return '알림 문제를 꺼낸 뒤 조용한 대화를 유지하고, 마지막에 퇴장 의사를 분명히 한 덕분이에요.';
  if(state.endingId==='E06')return '친구들에게 나가겠다는 뜻을 전달하고, 공개적으로 동의를 구했어요.';
  if(state.endingId==='E07')return '초대 기록과 정체에 대한 의문을 끝까지 파고들었어요.';
  if(state.endingId==='E01')return '문제를 직접 해결하려다 단톡방 관리까지 떠맡았어요.';
  if(state.endingId==='E02')return '친구들을 내보내는 데 집중한 사이, 정작 내 자리는 그대로 남았어요.';
  if(state.endingId==='E05')return '채팅방을 정리하려는 선택이 예상 밖의 혼란을 불렀어요.';
  if(state.endingId==='E03'){
   if(history.some(id=>id==='manual_leave'||id==='manual_leave_quiet'))return '나가기를 반복했지만 초대가 이어졌어요. 무작정 퇴장하기만 해서는 해결되지 않아요.';
   if(history.includes('ch4_silence')||history.includes('intro_ignore'))return '침묵만으로는 친구들의 관심을 돌리거나 재초대를 막을 수 없었어요.';
   return '퇴장 준비가 충분하지 않아 다시 초대되는 흐름을 끊지 못했어요.';
  }
  return null;
 })();"""
s=s.replace(needle,insert)
needle2='<EndingCollection achieved={state.endingId}/>'
assert s.count(needle2)==1,'Ending collection anchor changed'
s=s.replace(needle2,'{reasonForEnding&&<div className="ending-recap" role="note"><strong>내 선택이 만든 결과</strong><p>{reasonForEnding}</p></div>}'+needle2)
p.write_text(s)
css=Path('src/app/style.css')
t=css.read_text()
assert '/* v51 result recap */' not in t,'Already applied'
t+='''\n/* v51 result recap */\n.game-stage .ending-recap{width:min(100%,520px);border-radius:14px;border:1px solid #e6dfd0;background:#fffdf8;padding:13px 15px;color:#3a4547;position:relative;z-index:1}\n.game-stage .ending-recap strong{display:block;font-size:12px;letter-spacing:-.02em;margin-bottom:6px}\n.game-stage .ending-recap p{margin:0!important;font-size:12px!important;line-height:1.65!important;color:#59666a!important}\n'''
css.write_text(t)
print('v51 applied: ending recap in Game.tsx and CSS')
