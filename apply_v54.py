#!/usr/bin/env python3
"""v54: require cross-chapter preparation for E04/E06, update routes and tests."""
from pathlib import Path
files={
 'src/game/story.ts':[],
 'src/game/routes.test.ts':[],
 'src/game/escape-contract.test.ts':[],
 'tests/endings.spec.ts':[],
}
old="if(choiceId==='final_disappear')return mem.silence>=2 && mem.boundary>=1 && mem.junhoSupport>=1 && state.history.some(x=>['silent_continue','quiet_ignore'].includes(x)) && state.history.some(x=>['vote_later','vote_ask_subin','reason_permission','quiet_permission','ch4_polite'].includes(x)) && !state.history.includes('ch4_silence') && state.stats.escapeAttempts<=1?'E04':state.flags.includes('finalPermission')||mem.junhoSupport>=2 && mem.boundary>=1?'E06':'E03';"
new="""if(choiceId==='final_disappear'){
  // E04: leave only after putting the meetup on hold, explaining alerts,
  // earning silence, and getting explicit no-reinvite agreement in chapter 4.
  // Repeated ignores or a single late apology no longer grant success.
  const quietPlan=['vote_later','reason_notification','quiet_ignore','ch4_polite'].every(id=>state.history.includes(id));
  const cleanExit=state.stats.escapeAttempts<=1 && !state.history.includes('intro_ignore') && !state.history.includes('ch4_silence');
  if(quietPlan && cleanExit && mem.silence>=2 && mem.boundary>=1)return 'E04';
  // E06: must earn trust through a real chapter 1 scheduling response,
  // seek permission in chapter 2, confirm it in chapter 3 and reconfirm in chapter 4.
  const publicPlan=['vote_again','reason_permission','vote_permission','ch4_polite'].every(id=>state.history.includes(id));
  if(publicPlan && cleanExit && mem.minjiTrust>=1 && mem.junhoSupport>=1)return 'E06';
  return 'E03';
 }"""
files['src/game/story.ts'].append((old,new))
old4="['E04',['leave_menu_ch1_intro','reason_notification','quiet_ignore','ch4_polite','final_disappear']]"
new4="['E04',['intro_available','vote_later','leave_silent','reason_notification','quiet_ignore','ch4_polite','final_disappear']]"
old6="['E06',['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear']]"
new6="['E06',['intro_available','vote_again','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear']]"
files['src/game/routes.test.ts'] += [(old4,new4),(old6,new6)]
for oldp,newp in [
("E04:['leave_menu_ch1_intro','reason_notification','quiet_ignore','ch4_polite','final_disappear']", "E04:['intro_available','vote_later','leave_silent','reason_notification','quiet_ignore','ch4_polite','final_disappear']"),
("E06:['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear']", "E06:['intro_available','vote_again','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear']")]:files['src/game/escape-contract.test.ts'].append((oldp,newp))
files['tests/endings.spec.ts'] += [
("{ ending: 'E04', choices: ['leave_menu_ch1_intro','reason_notification','quiet_ignore','ch4_polite','final_disappear'] }", "{ ending: 'E04', choices: ['intro_available','vote_later','leave_silent','reason_notification','quiet_ignore','ch4_polite','final_disappear'] }"),
("{ ending: 'E06', choices: ['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear'] }", "{ ending: 'E06', choices: ['intro_available','vote_again','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear'] }")
]
# Do not mutate anything until all anchors validate.
updated={}
for filename,replacements in files.items():
 p=Path(filename)
 if not p.exists():raise SystemExit(f'MISSING {filename}; run at repository root.')
 text=p.read_text(encoding='utf8')
 for before,after in replacements:
  if after in text:continue
  if text.count(before)!=1:raise SystemExit(f'STOP: {filename} missing/ambiguous expected anchor: {before[:100]}')
  text=text.replace(before,after,1)
 updated[filename]=text
regression=Path('src/game/v54-escape-balance.test.ts')
if not regression.parent.exists():raise SystemExit('STOP: missing src/game folder')
route_file='src/game/routes.test.ts'
old_import="import './balanced-flow.test.ts';"
new_import="import './balanced-flow.test.ts';\nimport './v54-escape-balance.test.ts';"
if new_import not in updated[route_file]:
 if updated[route_file].count(old_import)!=1:raise SystemExit('STOP: routes.test import anchor missing')
 updated[route_file]=updated[route_file].replace(old_import,new_import)
for filename,content in updated.items():
 Path(filename).write_text(content,encoding='utf8')
regression.write_text("""import assert from 'node:assert/strict';
import {init, skipToBoundary, selectChoice} from './runtime.ts';

function ending(path: string[]) {
 let s=init();
 for(const id of path) {s=skipToBoundary(s); s=selectChoice(s,id)}
 return skipToBoundary(s).endingId;
}
const quiet=['intro_available','vote_later','leave_silent','reason_notification','quiet_ignore','ch4_polite','final_disappear'];
const publicPath=['intro_available','vote_again','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear'];
assert.equal(ending(quiet),'E04');
assert.equal(ending(publicPath),'E06');
// Formerly easy solutions: no chapter-one preparation, or only a late permission request.
assert.equal(ending(['leave_menu_ch1_intro','reason_notification','quiet_ignore','ch4_polite','final_disappear']),'E03');
assert.equal(ending(['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear']),'E03');
// An unplanned silence after an unrelated chapter-one response does not work.
assert.equal(ending(['intro_ignore','leave_silent','reason_notification','quiet_ignore','ch4_polite','final_disappear']),'E03');
console.log('v54: E04/E06 need cross-chapter preparation; easy routes rejected');
""",encoding='utf8')
print('v54 applied to',len(updated),'files; added',regression)
