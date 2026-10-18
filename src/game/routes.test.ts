import assert from 'node:assert/strict';
import {init,skipToBoundary,selectChoice,persist,restore} from './runtime.ts';
import {story} from './story.ts';
const routes = [
 ['E01',['intro_busy','leave_silent','reason_finger','finger_accept','ch4_admin','final_admin']],
 ['E02',['intro_unsure','leave_normal','reason_finger','finger_refuse','ch4_block','final_everyone']],
 ['E03',['intro_busy','leave_silent','reason_finger','finger_practice','ch4_block','final_repeat']],
 ['E04',['intro_ignore','leave_silent','reason_silence','silent_continue','ch4_silence','final_quiet']],
 ['E05',['intro_unsure','leave_normal','reason_notification','quiet_mute','ch4_delete','final_delete']],
 ['E06',['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_polite']],
 ['E07',['intro_busy','leave_normal','reason_silence','silent_identity','ch4_identity','final_identity']],
] as const;
for (const [ending,choices] of routes) {
  let state=init();
  for(const id of choices){
    state=skipToBoundary(state);
    assert.equal(state.phase,'waiting_choice',`${ending}:${id} no interaction`);
    const choice=story[state.story.nodeId].choices?.find(c=>c.id===id);
    assert(choice,`${ending}:${id} is missing`);
    state=selectChoice(state,id);
    // Every committed choice must appear once in history.
    assert.equal(state.story.history.filter(x=>x===id).length,1);
  }
  state=skipToBoundary(state);
  assert.equal(state.endingId,ending);
  assert.equal(state.phase,'completed');
  assert.equal(restore(persist(state)).endingId,ending);
  assert(!state.rooms.original.joined,`${ending} did not exit original room`);
  if(ending==='E06'||ending==='E07'){
    assert.equal(state.currentRoomId,null);
    const spectator = state.spectator;
    if (!spectator || !spectator.active) throw new Error(`${ending}: spectator scene missing`);
    assert(spectator.messages.length>0);
    for(const m of spectator.messages){
      assert.equal(m.visibility,'spectator');
      assert(!state.rooms[m.roomId].messages.some(x=>x.id===m.id));
    }
  }
  console.log(`${ending} complete, ${choices.length} interactions`);
}
