import {story, initialState, available, choose, type State, type Actor, type Event, type Choice, matchesConditions} from './story.ts';
export type ChatMessage={id:string;roomId:string;actor:Actor;text:string;nodeId:string;eventIndex:number};
export type ChatRoom={id:string;title:string;memberIds:Actor[];messages:ChatMessage[];joined:boolean;unread:number};
export type SpectatorMessage=ChatMessage & {visibility:'spectator'};
export type SpectatorScene={roomId:string;messages:SpectatorMessage[];active:boolean};
export type Phase='playing'|'waiting_choice'|'completed';
export type Runtime={story:State;cursor:number;phase:Phase;currentRoomId:string|null;rooms:Record<string,ChatRoom>;roomOrder:string[];polls:Record<string,string>;deliveredKeys:string[];endingId:string|null;pendingChoiceId:string|null;spectator:SpectatorScene|null};
const members:Actor[]=['player','minji','junho','subin','taehoon'];
export function init():Runtime {return {story:structuredClone(initialState),cursor:0,phase:'playing',currentRoomId:'original',rooms:{original:{id:'original',title:'주말에 뭐함',memberIds:[...members],messages:[],joined:true,unread:0}},roomOrder:['original'],polls:{},deliveredKeys:[],endingId:null,pendingChoiceId:null,spectator:null};}
export function currentNode(s:Runtime){const n=story[s.story.nodeId];if(!n)throw Error('Missing story node '+s.story.nodeId);return n;}
export function visibleChoices(s:Runtime):Choice[]{return s.phase==='waiting_choice'?(currentNode(s).choices??[]).filter(c=>available(c,s.story)):[];}
export function commitEvent(s:Runtime):Runtime {
 if(s.phase!=='playing')return s;
 const n=currentNode(s);if(s.cursor>=n.events.length)return finishNode(s);
 const index=s.cursor;const event=n.events[index];const key=`${n.id}:${index}:${s.story.history.join(',')}`;
 if(s.deliveredKeys.includes(key))return {...s,cursor:index+1};
 const rooms={...s.rooms};let currentRoomId=s.currentRoomId;let order=[...s.roomOrder];const polls={...s.polls};let storyState=s.story;let spectator=s.spectator;
 if(event.type==='message' && !matchesConditions(event.when,storyState)){/* Omit conditional dialogue without breaking cursor/replay */}
 else if(event.type==='room'){
  const eventRoomId=event.roomId==='current'?currentRoomId:event.roomId;
  if(event.operation==='create'){
   if(!rooms[event.roomId]){rooms[event.roomId]={id:event.roomId,title:event.title??event.roomId,memberIds:[...members],messages:[],joined:true,unread:0};order=[event.roomId,...order];storyState={...storyState,stats:{...storyState.stats,createdRooms:storyState.stats.createdRooms+1}};}
   rooms[event.roomId]={...rooms[event.roomId],joined:true};currentRoomId=event.roomId;
  } else if(event.operation==='enter') { if(!rooms[event.roomId])throw Error('Enter unknown room '+event.roomId);rooms[event.roomId]={...rooms[event.roomId],joined:true};currentRoomId=event.roomId; }
  else if(event.operation==='leave') { if(eventRoomId&&rooms[eventRoomId])rooms[eventRoomId]={...rooms[eventRoomId],joined:false,memberIds:rooms[eventRoomId].memberIds.filter(m=>m!=='player')}; if(currentRoomId===eventRoomId)currentRoomId=null; if((n.endingId==='E06'||n.endingId==='E07')&&eventRoomId) spectator={roomId:eventRoomId,messages:[],active:true}; }
  else if(event.operation==='rename') {if(!rooms[event.roomId])throw Error('Rename unknown room');rooms[event.roomId]={...rooms[event.roomId],title:event.title??rooms[event.roomId].title};}
 }else if(event.type==='message'){
  // Ending spectators can observe their original room even after player leaves; event belongs to the last active room.
  const observing=!!spectator?.active && currentRoomId===null;
  if(!observing && currentRoomId===null)throw Error('Message delivered without active room: '+key);
  const id=observing?spectator!.roomId:currentRoomId!;const r=rooms[id];if(!r)throw Error('Message room not found');
  const msg:ChatMessage={id:key,roomId:id,actor:event.actor,text:event.text,nodeId:n.id,eventIndex:index};
  if(observing){spectator={...spectator!,messages:[...spectator!.messages,{...msg,visibility:'spectator'}]};}else{rooms[id]={...r,messages:[...r.messages,msg],unread:r.unread+(currentRoomId===id?0:1)};}
 }else if(event.type==='poll'){polls[event.pollId]=event.title;}
 const next={...s,story:storyState,rooms,roomOrder:order,currentRoomId,polls,spectator,cursor:index+1,deliveredKeys:[...s.deliveredKeys,key]};return next.cursor>=n.events.length?finishNode(next):next;
}
export function finishNode(s:Runtime):Runtime {
 const n=currentNode(s);if(s.cursor<n.events.length)return s;
 if(n.endingId)return {...s,phase:'completed',endingId:n.endingId};
 if(n.choices?.length)return {...s,phase:'waiting_choice'};
 if(!n.nextNodeId)throw Error('Dead end '+n.id);
 return {...s,story:{...s.story,nodeId:n.nextNodeId},cursor:0,phase:'playing',pendingChoiceId:null};
}
export function selectChoice(s:Runtime,id:string):Runtime {
 if(s.phase!=='waiting_choice')throw Error('Not waiting for a choice');
 const c=visibleChoices(s).find(x=>x.id===id);if(!c)throw Error('Locked choice '+id);
 // Only actual player replies are rendered; silence and UI actions never become chat bubbles.
 let next=s;
 if(c.replyText && c.kind==='reply'){
  const roomId=s.currentRoomId??'original';const r=s.rooms[roomId];const msg:ChatMessage={id:`reply:${s.story.nodeId}:${id}:${s.story.history.join(',')}`,roomId,actor:'player',text:c.replyText,nodeId:s.story.nodeId,eventIndex:s.cursor};
  next={...s,rooms:{...s.rooms,[roomId]:{...r,messages:[...r.messages,msg]}}};
 }
 return {...next,story:choose(next.story,id),cursor:0,phase:'playing',pendingChoiceId:null};
}
/** Exit is a player action, not a story choice. It works while messages are playing. */
export function leaveChat(s:Runtime,quiet=false):Runtime {
 if(s.phase==='completed'||!s.currentRoomId||!s.rooms[s.currentRoomId]?.joined)return s;
 const chapter=currentNode(s).chapter;
 const target=chapter===1?'ch2_left':chapter<=3?'ch3_manual_leave':chapter===4?'ch4_manual_leave':'ending_E03';
 const history=[...s.story.history,quiet?'manual_leave_quiet':'manual_leave'];
 const stats={...s.story.stats,escapeAttempts:s.story.stats.escapeAttempts+1,quiet:s.story.stats.quiet+(quiet?1:0)};
 return {...s,story:{...s.story,nodeId:target,history,stats},cursor:0,phase:'playing',pendingChoiceId:null};
}
export function skipToBoundary(s:Runtime,maxEvents=500):Runtime{let next=s;for(let i=0;i<maxEvents&&next.phase==='playing';i++)next=commitEvent(next);if(next.phase==='playing')throw Error('Skip limit exceeded');return next;}
export const persist=(s:Runtime)=>JSON.stringify({schemaVersion:1,contentVersion:'v19',state:s});
export function restore(raw:string):Runtime {
 const o=JSON.parse(raw);
 if(o?.schemaVersion!==1||o?.contentVersion!=='v19')throw Error('Incompatible save');
 const s=o.state as Runtime;
 if(!s||!s.story||!story[s.story.nodeId]||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>currentNode(s).events.length)throw Error('Invalid save');
 if(!['playing','waiting_choice','completed'].includes(s.phase)||!s.rooms||typeof s.rooms!=='object'||!Array.isArray(s.roomOrder)||!Array.isArray(s.deliveredKeys)||!Array.isArray(s.story.history))throw Error('Invalid save shape');
 if(s.currentRoomId!==null&&!s.rooms[s.currentRoomId])throw Error('Invalid active room');
 if(s.roomOrder.some(id=>typeof id!=='string'||!s.rooms[id]))throw Error('Invalid room list');
 if(s.phase==='completed'&&!s.endingId)throw Error('Missing ending');
 if(s.spectator!==null){if(!s.spectator||typeof s.spectator.roomId!=='string'||!s.rooms[s.spectator.roomId]||!Array.isArray(s.spectator.messages)||typeof s.spectator.active!=='boolean')throw Error('Invalid spectator');if(s.spectator.messages.some(m=>m.roomId!==s.spectator!.roomId||m.visibility!=='spectator'))throw Error('Invalid spectator messages');}
 return s;
}
export function eventDuration(e:Event,speed=1){if(e.type==='pause')return e.durationMs/speed;if(e.type==='message')return ((e.delayMs??0)+(e.typingMs??0))/speed;return 0;}
export class PlaybackScheduler{
 private timer:ReturnType<typeof setTimeout>|null=null;private generation=0;private remaining=0;private due=0;private handler:(()=>void)|null=null;
 cancel(){this.generation++;if(this.timer!==null)clearTimeout(this.timer);this.timer=null;this.handler=null;this.remaining=0;}
 schedule(ms:number,fn:()=>void){this.cancel();const g=this.generation;this.handler=fn;this.remaining=Math.max(0,ms);this.due=Date.now()+this.remaining;this.timer=setTimeout(()=>{this.timer=null;if(g!==this.generation)return;this.handler=null;fn();},this.remaining);}
 pause(){if(this.timer===null)return;clearTimeout(this.timer);this.timer=null;this.remaining=Math.max(0,this.due-Date.now());}
 resume(){if(this.timer!==null||!this.handler)return;const fn=this.handler;this.schedule(this.remaining,fn);}
 skip(){const fn=this.handler;this.cancel();fn?.();}
 get pending(){return this.handler!==null;}
}
