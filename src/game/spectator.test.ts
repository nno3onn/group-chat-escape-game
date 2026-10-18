import {init,skipToBoundary,selectChoice,commitEvent} from './runtime.ts';
import {story,initialState} from './story.ts';
import assert from 'node:assert/strict';
for (const id of ['E06','E07']) {
  let s=init();s={...s,story:{...s.story,nodeId:`ending_${id}`},cursor:0,phase:'playing',currentRoomId:'restore',rooms:{...s.rooms,restore:{id:'restore',title:'복구방',memberIds:['player','minji','junho','subin','taehoon'],messages:[],joined:true,unread:0}},roomOrder:['restore','original']};
  while(s.phase==='playing')s=commitEvent(s);
  assert.equal(s.endingId,id);
  assert.equal(s.rooms.restore.joined,false);
  assert.equal(s.rooms.restore.memberIds.includes('player'),false);
  assert(s.spectator?.messages.length);
  const spectatorIds=new Set(s.spectator!.messages.map(x=>x.id));
  assert(!s.rooms.restore.messages.some(m=>spectatorIds.has(m.id)));
  assert(s.spectator!.messages.every(m=>m.visibility==='spectator'));
  console.log(id,'spectator',s.spectator!.messages.length,'PASS');
}
