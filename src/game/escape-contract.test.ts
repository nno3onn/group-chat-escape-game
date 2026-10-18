import assert from 'node:assert/strict';
import {init, skipToBoundary, selectChoice, persist, restore} from './runtime.ts';

const paths = {
 E04:['intro_ignore','leave_silent','reason_silence','silent_continue','ch4_silence','final_quiet'],
 E06:['intro_busy','leave_normal','reason_permission','vote_permission','ch4_polite','final_polite'],
 E07:['intro_busy','leave_normal','reason_silence','silent_identity','ch4_identity','final_identity'],
} as const;
for (const [ending, steps] of Object.entries(paths)) {
 let s = init();
 for (const id of steps) { s=skipToBoundary(s); s=selectChoice(s,id); }
 s=skipToBoundary(s);
 assert.equal(s.endingId,ending);
 assert.equal(s.currentRoomId,null);
 assert(Object.values(s.rooms).every(r=>!r.joined && !r.memberIds.includes('player')),`${ending}: still in a room`);
 const snapshot=JSON.stringify(s.rooms);
 const recovered=restore(persist(s));
 assert.equal(JSON.stringify(recovered.rooms),snapshot,`${ending}: unexpected re-invite after restore`);
 if(ending==='E04'){
   assert.equal(s.spectator,null);
   assert(!Object.values(s.rooms).flatMap(r=>r.messages).some(m=>m.text.includes('탈출 성공')));
 } else {
   assert(s.spectator?.active && s.spectator.messages.length>0);
   assert(s.spectator.messages.every(m=>!s.rooms[m.roomId].messages.some(actual=>actual.id===m.id)));
 }
 console.log(`${ending} exit contract PASS`);
}
