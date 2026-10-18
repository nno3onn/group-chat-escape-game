'use client';
import {useEffect,useRef,useState,useCallback} from 'react';
import {init,commitEvent,currentNode,visibleChoices,selectChoice,skipToBoundary,persist,restore,type Runtime,type ChatMessage} from '../game/runtime';
import {story, type Event} from '../game/story';
const SAVE='talkfail-v19';
const NAMES:Record<string,string>={minji:'민지',junho:'준호',subin:'수빈',taehoon:'태훈',player:'나',system:'시스템'};
const ENDINGS:Record<string,string>={E01:'탈출하려다 방장 됨',E02:'나 빼고 다 나감',E03:'재초대가 직업이 됨',E04:'아무도 나간 걸 몰랐다',E05:'단톡방 자체가 탈퇴함',E06:'야 얘 진짜 나갔네',E07:'너 누구세요?'};
function usePlayback(){
 const [state,setState]=useState<Runtime>(()=>init()); const [ready,setReady]=useState(false);
 const [speed,setSpeed]=useState<1|1.5>(1);const [paused,setPaused]=useState(false);const [typing,setTyping]=useState<string|null>(null);
 const [menu,setMenu]=useState(false);const [exitDialog,setExitDialog]=useState(false);const [draft,setDraft]=useState('');const [view,setView]=useState<'chat'|'list'>('chat');
 const token=useRef(0); const stateRef=useRef(state);stateRef.current=state;
 useEffect(()=>{try{const raw=localStorage.getItem(SAVE);if(raw)setState(restore(raw));}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem(SAVE,persist(state))}catch{}}},[state,ready]);
 const next=useCallback((transform:(s:Runtime)=>Runtime)=>{setState(s=>transform(s))},[]);
 useEffect(()=>{
   if(!ready||paused||state.phase!=='playing')return;
   const evt=currentNode(state).events[state.cursor] as Event|undefined;
   if(!evt){next(commitEvent);return}
   const run=++token.current;const timers:ReturnType<typeof setTimeout>[]=[];
   function later(cb:()=>void,ms:number){timers.push(setTimeout(()=>{if(run===token.current)cb()},ms))}
   if(evt.type==='message'&&evt.actor!=='system'&&evt.actor!=='player'){
     later(()=>setTyping(evt.actor),Math.max(0,evt.delayMs/speed));
     later(()=>{setTyping(null);next(commitEvent)},(evt.delayMs+(evt.typingMs??0))/speed);
   }else if(evt.type==='pause')later(()=>next(commitEvent),evt.durationMs/speed);
   else if(evt.type==='message')later(()=>next(commitEvent),evt.delayMs/speed);
   else later(()=>next(commitEvent),330/speed);
   return ()=>{token.current++;timers.forEach(clearTimeout)};
 },[state,ready,paused,speed,next]);
 const opts=visibleChoices(state);const choose=(id:string)=>{setDraft('');setMenu(false);setExitDialog(false);setPaused(false);next(s=>selectChoice(s,id));setView('chat')};
 const skip=()=>{token.current++;setTyping(null);next(s=>skipToBoundary(s));setView('chat')};
 const reset=()=>{token.current++;setTyping(null);setDraft('');setMenu(false);setExitDialog(false);setView('chat');setPaused(false);setState(init())};
 return {state,ready,speed,setSpeed,paused,setPaused,typing,opts,draft,setDraft,view,setView,menu,setMenu,exitDialog,setExitDialog,choose,skip,reset};
}
export default function Game(){
 const g=usePlayback();const {state,ready,opts}=g;
 const bottomRef=useRef<HTMLDivElement>(null);const scroller=useRef<HTMLDivElement>(null);const [nearBottom,setNearBottom]=useState(true);
 // Each newly opened room should start at the latest messages, not inherit the previous room's scroll position.
 const [selectedRoom,setSelectedRoom]=useState<string|null>(null);
 const roomId=selectedRoom && state.rooms[selectedRoom]?.joined?selectedRoom:state.currentRoomId;
 const room=roomId?state.rooms[roomId]:null;
 const observing=!!state.spectator?.active && state.currentRoomId===null && state.phase!=='completed';
 const roomMsgs=observing ? state.spectator!.messages : room?.messages??[];
 const isActiveRoom=roomId===state.currentRoomId;
 useEffect(()=>{setNearBottom(true);const el=scroller.current;if(el)el.scrollTop=el.scrollHeight;},[roomId,observing]);
 const endingDescriptions:Record<string,{status:string,quote:string,detail:string}>={
 E01:{status:'탈출 실패',quote:'분명 나가려고 들어왔는데 왜 제가 방장이죠?',detail:'조직의 핵심 인재로 발탁되었습니다.'},
 E02:{status:'탈출 실패',quote:'너네 먼저 나가봐. ...어?',detail:'모두를 보내는 데 성공했습니다. 본인 제외.'},
 E03:{status:'탈출 실패',quote:'나가는 것도 경력이 되나요?',detail:'재초대 QA 담당자로 채용되었습니다.'},
 E04:{status:'탈출 성공',quote:'아무도 당신이 나간 사실을 몰랐습니다.',detail:'사실 당신이 이 방에 있는 줄도 몰랐습니다.'},
 E05:{status:'기묘한 종료',quote:'채팅방이 채팅방에서 퇴장했습니다.',detail:'당신 대신 단톡방이 먼저 포기했습니다.'},
 E06:{status:'탈출 성공',quote:'아니 진짜 나갈 줄 알았냐고',detail:'나가도 된다고 했지만 진짜 나가도 된다는 뜻은 아니었습니다.'},
 E07:{status:'강제 퇴장',quote:'혹시 어느 분이세요?',detail:'스스로 나가지 못했습니다. 친구들이 내보냈습니다.'}
 };
 const ending=endingDescriptions[state.endingId??''];
 useEffect(()=>{const el=scroller.current;if(nearBottom && el)el.scrollTo({top:el.scrollHeight,behavior:'auto'});},[roomMsgs.length,g.typing,nearBottom,roomId,observing]);
 const actionOpts=opts.filter(c=>c.kind==='action');const replyOpts=opts.filter(c=>c.kind==='reply');
 const leaving=actionOpts.some(c=>c.id.startsWith('leave_'));
 const canLeave=state.phase==='waiting_choice' && leaving;
 function msg(m:ChatMessage){if(m.actor==='system')return <div key={m.id} className="system-msg">{m.text}</div>;const mine=m.actor==='player';return <div key={m.id} className={'msg '+(mine?'mine':'')}><div className="avatar">{mine?'':NAMES[m.actor]?.[0]}</div><div className="msg-main">{!mine&&<div className="sender">{NAMES[m.actor]}</div>}<div className="bubble">{m.text}</div></div></div>}
 if(!ready)return <div className="phone loading">채팅방 연결 중...</div>;
 return <div className="phone" aria-label="가상 단톡방 탈출 게임">
 <div className="phone-top"><div className="phone-clock">톡망함 · 게임</div><span>●●● ▰</span></div>
 {g.view==='list' && state.phase!=='completed'?<><header className="header"><button onClick={()=>g.setView('chat')} aria-label="돌아가기">‹</button><strong>채팅</strong><span className="fake">GAME</span></header><div className="rooms">{state.roomOrder.filter(k=>state.rooms[k].joined).map(k=><button key={k} className="room-line" onClick={()=>{setSelectedRoom(k);g.setView('chat')}}><span className="group-avatar">💬</span><span><strong>{state.rooms[k].title}</strong><small>{state.rooms[k].messages.at(-1)?.text??'새 채팅방'}</small></span></button>)}{state.roomOrder.every(k=>!state.rooms[k].joined)&&<p className="empty">채팅방이 없습니다. 드디어 자유...?</p>}</div><button className="text-button" onClick={()=>{setSelectedRoom(null);g.setView('chat')}}>진행 중인 이야기로 돌아가기</button></>:
 <><header className="header"><button onClick={()=>{setSelectedRoom(null);g.setView('list')}} aria-label="채팅 목록">‹</button><div className="head-title"><strong>{observing?'퇴장 후 대화 · 관전':room?.title??'채팅방을 나왔습니다'}</strong><small>가상 단톡방 · {story[state.story.nodeId]?.chapter ?? 1} / 5장</small></div><button onClick={()=>g.setMenu(true)} aria-label="채팅방 메뉴">☰</button></header>
 <div className="chat" ref={scroller} onScroll={()=>{const el=scroller.current;if(el)setNearBottom(el.scrollHeight-el.scrollTop-el.clientHeight<90)}}>
 {observing&&<div className="spectator-banner" role="status">엔딩 연출 · 이미 퇴장한 방의 대화입니다. 실제 참가 상태가 아닙니다.</div>}<div className="date-chip">오늘</div>{roomMsgs.map(msg)}
 {g.typing && isActiveRoom && !observing &&<div className="typing"><span>{NAMES[g.typing]} 입력 중</span><span className="dots">● ● ●</span></div>}
 {!room&&!observing&&<div className="system-msg">채팅방에서 나왔습니다. 새로운 초대를 기다리는 중...</div>}
 <div ref={bottomRef}/></div>
 {state.phase==='completed' && <section className={'ending-sheet ending-'+state.endingId} aria-labelledby="ending-title"><div className="ending-kicker">GAME OVER · {ending?.status}</div><div className="ending-emblem">{state.endingId==='E04'?'◌':state.endingId==='E06'?'…':state.endingId==='E07'?'?':'↩'}</div><h2 id="ending-title">{ENDINGS[state.endingId??'']}</h2><blockquote>“{ending?.quote}”</blockquote><p>{ending?.detail}</p><div className="ending-stats"><span>탈출 시도 <strong>{state.story.stats.escapeAttempts}회</strong></span><span>생성된 방 <strong>{state.story.stats.createdRooms}개</strong></span></div><small>실제 메신저와 무관한 가상 게임 결과</small></section>}
 {!nearBottom&&<button className="new-msg" onClick={()=>{setNearBottom(true);scroller.current?.scrollTo({top:scroller.current.scrollHeight,behavior:'auto'})}}>↓ 최신 메시지 보기</button>}
 <div className="composer">
 {state.phase==='completed'?<div className="ending-actions"><button onClick={()=>g.reset()}>다시 탈출하기 ↻</button><button onClick={()=>navigator.clipboard?.writeText(`카톡방탈출 — 나 좀 나가게 해줘 ㅋㅋㅋ\n${ENDINGS[state.endingId??'']}\n${ending?.detail??''}`)}>결과 복사</button></div>: !isActiveRoom?<div className="inactive-room"><span>이전 채팅방을 보는 중</span><button onClick={()=>{setSelectedRoom(null);g.setView('chat')}}>진행 중인 방으로 이동</button></div>:
 state.phase==='waiting_choice'?<>{leaving?<><p className="hint">나갈 준비 됐어?</p><button className="send" onClick={()=>g.setExitDialog(true)}>채팅방 나가기</button></>:
 <><div className="suggestions">{replyOpts.map(c=><button data-choice-id={c.id} data-choice-kind={c.kind} className={g.draft===c.id?'selected':''} key={c.id} onClick={()=>g.setDraft(c.id)}>{c.label}</button>)}{actionOpts.map(c=><button key={c.id} data-choice-id={c.id} data-choice-kind={c.kind} onClick={()=>g.choose(c.id)}>{c.label}</button>)}</div>{replyOpts.length>0&&<div className="send-bar"><div className="fake-input">{replyOpts.find(c=>c.id===g.draft)?.replyText??'답장을 선택해 주세요'}</div><button disabled={!g.draft} onClick={()=>g.choose(g.draft)} aria-label="답장 전송">➤</button></div>}</>}
 </>:<div className="controls"><span>{g.typing?'입력 중...':'메시지를 기다리는 중...'}</span><button onClick={()=>g.setPaused(!g.paused)}>{g.paused?'재생':'일시정지'}</button><button onClick={()=>g.setSpeed(g.speed===1?1.5:1)}>{g.speed}×</button><button onClick={()=>g.skip()}>건너뛰기 »</button></div>}</div></>}
 {g.menu&&<div className="shade" onClick={()=>g.setMenu(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><button onClick={()=>g.setMenu(false)}>닫기 ✕</button><h3>{room?.title??'가상 단톡방'}</h3><p>민지 · 준호 · 수빈 · 태훈 · 나</p><button onClick={()=>g.setMenu(false)}>알림 끄기 (연출)</button><button className="danger" disabled={!canLeave || roomId!==state.currentRoomId} onClick={()=>{g.setMenu(false);g.setExitDialog(true)}}>채팅방 나가기</button>{!canLeave&&<p className="hint">지금은 진행 중인 대화를 먼저 확인해 주세요.</p>}</aside></div>}
 {g.exitDialog&&<div className="shade"><div className="modal"><h3>정말 나갈 거야?</h3><p>게임 속 채팅방에서만 나가게 돼. 실제 메신저에는 영향 없어.</p>{actionOpts.filter(c=>c.id.startsWith('leave_')).map(c=><button key={c.id} data-choice-id={c.id} data-choice-kind={c.kind} className="send" onClick={()=>g.choose(c.id)}>{c.label}</button>)}<button onClick={()=>g.setExitDialog(false)}>취소</button>{!leaving&&<p className="hint">지금은 이 장면에서 나갈 수 없어. 대화를 조금 더 진행해 봐.</p>}</div></div>}
 </div>;
}
