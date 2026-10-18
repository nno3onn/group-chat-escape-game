import assert from 'node:assert/strict';
import { init, commitEvent, currentNode, visibleChoices, selectChoice, skipToBoundary } from './runtime.ts';
import { story } from './story.ts';

for (const [nodeId, node] of Object.entries(story)) {
  assert.ok(node.events.every(e => e.type !== 'message' || typeof e.text === 'string'), `${nodeId}: invalid messages`);
  const choiceIds = node.choices?.map(c=>c.id) ?? [];
  assert.equal(new Set(choiceIds).size, choiceIds.length, `${nodeId}: duplicate choice`);
  for (const c of node.choices??[]) assert.ok(story[c.nextNodeId], `${nodeId}: missing target ${c.nextNodeId}`);
  if(node.nextNodeId) assert.ok(story[node.nextNodeId], `${nodeId}: missing next ${node.nextNodeId}`);
}
// Confirm E04 never injects a post-leave message into a detached room.
let game=init();
const route=['intro_ignore','leave_silent','reason_silence','silent_continue','ch4_silence','final_quiet'];
for(const id of route){game=skipToBoundary(game);assert.ok(visibleChoices(game).some(c=>c.id===id));game=selectChoice(game,id)}
while(game.phase==='playing') game=commitEvent(game);
assert.equal(game.endingId,'E04');
assert.equal(game.currentRoomId,null);
assert.equal(game.spectator,null);
assert.equal(game.rooms.restore.joined,false);
const full=Object.values(game.rooms).flatMap(x=>x.messages).map(x=>x.text).join(' ');
assert.ok(!full.includes('탈출 성공. 사실 당신이'), 'E04 result must not be delivered as a message');
console.log(`PREFLIGHT PASS: ${Object.keys(story).length} nodes, E04 detached-room check`);
