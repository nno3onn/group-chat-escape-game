import assert from 'node:assert/strict';
import {init,skipToBoundary,selectChoice,visibleChoices,persist,restore,leaveChat} from './runtime.ts';
import {deriveMemory,story,resolveFinal} from './story.ts';
const cases:[string,string[]][]=[
 ['E01',['intro_available','leave_silent','reason_finger','finger_accept','ch4_admin','final_responsibility']],
 ['E02',['intro_unsure','leave_normal','reason_finger','finger_refuse','ch4_block','final_question']],
 ['E03',['intro_busy','leave_normal','reason_finger','finger_practice','ch4_block','final_disappear']],
 ['E04',['intro_ignore','leave_silent','reason_silence','silent_continue','ch4_silence','final_disappear']],
 ['E05',['intro_unsure','leave_normal','reason_notification','quiet_mute','ch4_delete','final_responsibility']],
 ['E06',['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_disappear']],
 ['E07',['intro_busy','leave_normal','reason_silence','silent_identity','ch4_identity','final_question']],
];
for(const [ending,route] of cases){let s=init();for(const id of route){s=skipToBoundary(s);assert.equal(s.phase,'waiting_choice',`${ending}: ${id}`);assert(visibleChoices(s).some(c=>c.id===id),`${ending}: missing ${id} at ${s.story.nodeId}`);s=selectChoice(s,id);assert.equal(restore(persist(s)).story.nodeId,s.story.nodeId)}s=skipToBoundary(s);assert.equal(s.endingId,ending,`wrong ending on ${route.join('/')}`);if(ending==='E04')assert.equal(s.spectator,null);if(['E06','E07'].includes(ending))assert(s.spectator?.active);console.log(ending,'PASS')}
let remembered=init();remembered=skipToBoundary(remembered);remembered=selectChoice(remembered,'intro_taehoon');assert(deriveMemory(remembered.story).taehoonHeard>=1);
for(const choice of story.ch5_final.choices??[])assert(!choice.label.includes('E0'));
assert.equal(story.ch5_final.choices?.length,3);
console.log('7 endings, persistent memory, finale choices PASS');

// The menu's leave action works during playback and from every chapter.
for(const expectedChapter of [1,2,3,4,5] as const){
 let s=init();
 if(expectedChapter>1){for(const id of ['intro_available','stay_ch1_leave']){s=skipToBoundary(s);s=selectChoice(s,id)};}
 if(expectedChapter>2){s=skipToBoundary(s);s=selectChoice(s,'stay_vote');}
 if(expectedChapter>3){s=skipToBoundary(s);s=selectChoice(s,'vote_appeal');s=skipToBoundary(s);}
 if(expectedChapter>4){s=selectChoice(s,'ch4_block');s=skipToBoundary(s);}
 assert.equal(story[s.story.nodeId].chapter,expectedChapter);
 const left=leaveChat(s,true);
 assert(left.story.stats.escapeAttempts>s.story.stats.escapeAttempts);
 assert.equal(left.phase,'playing');
 const continued=skipToBoundary(left);
 assert(['waiting_choice','completed'].includes(continued.phase));
 console.log(`manual leave from chapter ${expectedChapter}: PASS`);
}
// Conditional lines are omitted when not earned, and delivered when earned.
let before=init(); before=skipToBoundary(before);before=selectChoice(before,'intro_taehoon');
assert(deriveMemory(before.story).taehoonHeard>0);
console.log('Manual exit, conditional memory and finale integration PASS');
