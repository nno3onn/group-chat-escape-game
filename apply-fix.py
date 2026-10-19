from pathlib import Path

root = Path(__file__).resolve().parent
# Run from a copied ZIP folder inside the repository, or with the repository as cwd.
repo = Path.cwd() if (Path.cwd()/'src/game/runtime.ts').exists() else root.parent
runtime = repo/'src/game/runtime.ts'
if not runtime.exists():
    raise SystemExit('프로젝트 루트에서 python apply-fix.py 를 실행하세요 (src/game/runtime.ts 필요)')
s = runtime.read_text(encoding='utf-8')
old = """  if(event.operation==='create'){
   if(!rooms[event.roomId]){rooms[event.roomId]={id:event.roomId,title:event.title??event.roomId,memberIds:[...members],messages:[],joined:true,unread:0};order=[event.roomId,...order];storyState={...storyState,stats:{...storyState.stats,createdRooms:storyState.stats.createdRooms+1}};}
   rooms[event.roomId]={...rooms[event.roomId],joined:true};currentRoomId=event.roomId;
"""
new = """  if(event.operation==='create'){
   // A repeated manual reinvite starts a NEW room. Reusing its ID exposed old messages.
   const roomId = (event.roomId==='manual-reinvite'||event.roomId==='final-reinvite')
    ? `${event.roomId}-${storyState.stats.escapeAttempts}` : event.roomId;
   if(!rooms[roomId]){rooms[roomId]={id:roomId,title:event.title??event.roomId,memberIds:[...members],messages:[],joined:true,unread:0};order=[roomId,...order];storyState={...storyState,stats:{...storyState.stats,createdRooms:storyState.stats.createdRooms+1}};}
   rooms[roomId]={...rooms[roomId],joined:true};currentRoomId=roomId;
"""
if old not in s:
    if 'repeated manual reinvite starts a NEW room' not in s: raise SystemExit('runtime create 코드가 예상과 다릅니다. 변경하지 않았어요.')
else:s=s.replace(old,new,1)
old2 = """ return {...s,story:{...s.story,nodeId:target,history,stats},cursor:0,phase:'playing',pendingChoiceId:null};
"""
new2 = """ // Disconnect immediately, rather than showing the previous chat until the next timed event.
 const oldRoomId=s.currentRoomId;
 const oldRoom=s.rooms[oldRoomId];
 const rooms={...s.rooms,[oldRoomId]:{...oldRoom,joined:false,memberIds:oldRoom.memberIds.filter(m=>m!=='player')}};
 return {...s,rooms,currentRoomId:null,spectator:null,story:{...s.story,nodeId:target,history,stats},cursor:0,phase:'playing',pendingChoiceId:null};
"""
if old2 not in s:
    if '// Disconnect immediately' not in s: raise SystemExit('runtime leaveChat 코드가 예상과 다릅니다. 변경하지 않았어요.')
else:s=s.replace(old2,new2,1)
runtime.write_text(s,encoding='utf-8')

# Add regression test to the existing engine test suite.
test=repo/'src/game/runtime.test.ts'
t=test.read_text(encoding='utf-8')
if 'rapid leave regression' not in t:
    t=t.replace('console.log(\'runtime smoke tests PASS:', """// rapid leave regression: leaving must hide prior history immediately and create fresh rooms.
let repeated=init();
repeated=skipToBoundary(repeated);
repeated=selectChoice(repeated,'intro_busy');
repeated=skipToBoundary(repeated);
repeated=selectChoice(repeated,'leave_normal');
repeated=skipToBoundary(repeated);
assert.equal(repeated.currentRoomId,'restore');
const {leaveChat}=await import('./runtime.ts');
const firstRoom=repeated.currentRoomId!;
repeated=leaveChat(repeated);
assert.equal(repeated.currentRoomId,null,'old messages must disappear immediately');
assert.equal(repeated.rooms[firstRoom].joined,false);
repeated=skipToBoundary(repeated);
const firstReinvite=repeated.currentRoomId!;
assert(firstReinvite.startsWith('manual-reinvite-'));
const firstMessages=repeated.rooms[firstReinvite].messages.length;
assert(firstMessages>0);
repeated=leaveChat(repeated);
assert.equal(repeated.currentRoomId,null);
repeated=skipToBoundary(repeated);
const secondReinvite=repeated.currentRoomId!;
assert(secondReinvite.startsWith('final-reinvite-'));
assert.notEqual(firstReinvite,secondReinvite);
assert.equal(repeated.rooms[firstReinvite].joined,false);
assert(repeated.rooms[secondReinvite].messages.length>0);
assert(!repeated.rooms[secondReinvite].messages.some(m=>m.nodeId==='ch3_manual_leave'),'old chapter messages must not carry over');
console.log('rapid leave regression PASS');
console.log('runtime smoke tests PASS:""",1)
    test.write_text(t,encoding='utf-8')
print('수정 완료: src/game/runtime.ts, src/game/runtime.test.ts')
