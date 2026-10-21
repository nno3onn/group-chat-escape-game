#!/usr/bin/env python3
from pathlib import Path
p=Path('src/game/runtime.ts')
if not p.is_file(): raise SystemExit('프로젝트 최상위 폴더에서 실행해 주세요.')
s=p.read_text(encoding='utf-8')
old="export function visibleChoices(s:Runtime):Choice[]{return s.phase==='waiting_choice'?(currentNode(s).choices??[]).filter(c=>available(c,s.story)):[];}"
new="""/** A sent reply must not appear as a reply suggestion again in this run.
 * Exit/actions remain available; they are not sent messages.
 * Keep a fallback if filtering would remove every choice (no soft-lock).
 */
export function visibleChoices(s:Runtime):Choice[]{
 if(s.phase!=='waiting_choice')return [];
 const options=(currentNode(s).choices??[]).filter(c=>available(c,s.story));
 const sentIds=new Set(s.story.history);
 const sentTexts=new Set(Object.values(s.rooms).flatMap(room=>room.messages)
  .filter(message=>message.actor==='player'&&message.id.startsWith('reply:'))
  .map(message=>message.text));
 const fresh=options.filter(c=>c.kind!=='reply'||(!sentIds.has(c.id)&&!sentTexts.has(c.replyText??c.label)));
 return fresh.length>0?fresh:options;
}"""
if new in s:
 print('이미 v56이 적용되어 있습니다.')
elif s.count(old)!=1: raise SystemExit('예상한 기존 코드가 달라 안전하게 중단했습니다.')
else:
 p.write_text(s.replace(old,new),encoding='utf-8')
 print('v56 답장 중복 선택 제거 적용 완료')
