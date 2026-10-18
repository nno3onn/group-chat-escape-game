import assert from 'node:assert/strict';
import {init,skipToBoundary,selectChoice} from './runtime.ts';
import {story} from './story.ts';
const newPaths=[
 ['intro_nine','nine_yes'],['intro_taehoon','tae_late','nine_food','food_chicken'],
 ['intro_nine','nine_yes'],
 ['intro_available','vote_late','nine_yes'],
 ['intro_busy','vote_again','followup_food','food_meat'],
 ['intro_busy','vote_again','followup_subin','ping_continue'],
 ['intro_busy','vote_again','followup_pause','pause_yes','tomorrow_hold'],
 ['intro_busy','vote_again','followup_pause','pause_reply','end_stay','wait_mute'],
 ['intro_busy','vote_again','followup_pause','pause_reply','end_stay','wait_yes','last_taehoon','listen_again'],
 ['intro_busy','vote_again','followup_pause','pause_reply','end_stay','wait_yes','last_reply','reply_goodnight'],
 ['intro_busy','leave_normal','reason_tired','tired_mute','quiet_taehun'],
 ['intro_busy','leave_normal','reason_ask','inviter_record'],
 ['intro_busy','leave_normal','reason_finger','finger_subin'],
 ['intro_busy','leave_normal','reason_permission','vote_subin'],
 ['intro_busy','leave_normal','reason_silence','silent_joke'],
 ['intro_busy','leave_normal','reason_finger','finger_accept','ch4_taehoon'],
];
for(const route of newPaths){
 let state=init();
 for(const id of route){
  state=skipToBoundary(state);
  assert.equal(state.phase,'waiting_choice',`${id}: no choices`);
  const choice=story[state.story.nodeId].choices?.find(x=>x.id===id);
  assert(choice,`missing ${id} in ${state.story.nodeId}`);
  state=selectChoice(state,id);
 }
 state=skipToBoundary(state);
 assert(['waiting_choice','completed'].includes(state.phase));
}
console.log(`${newPaths.length} new conversation paths passed`);
