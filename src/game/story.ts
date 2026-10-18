export type Actor = 'player'|'minji'|'junho'|'subin'|'taehoon'|'system';
export type Stat = 'escapeAttempts'|'suspicion'|'chaos'|'authority'|'quiet'|'permission'|'identity'|'createdRooms';
export type Stats = Record<Stat,number>;
export type Condition = {stat?:Stat;min?:number;flag?:string};
export type Event = {type:'message';actor:Actor;text:string;delayMs:number;typingMs?:number}|{type:'pause';durationMs:number}|{type:'room';operation:'create'|'rename'|'leave'|'enter';roomId:string;title?:string}|{type:'poll';pollId:string;title:string};
export type Choice = {id:string;label:string;replyText?:string;kind:'reply'|'action';when?:Condition[];addStats?:Partial<Stats>;addFlags?:string[];nextNodeId:string};
export type Node = {id:string;chapter:1|2|3|4|5;events:Event[];choices?:Choice[];nextNodeId?:string;endingId?:EndingId};
export type EndingId='E01'|'E02'|'E03'|'E04'|'E05'|'E06'|'E07';
export const initialStats:Stats={escapeAttempts:0,suspicion:0,chaos:0,authority:0,quiet:0,permission:0,identity:0,createdRooms:1};
export type State={nodeId:string;stats:Stats;flags:string[];history:string[]};
export const initialState:State={nodeId:'ch1_intro',stats:initialStats,flags:[],history:[]};
const m=(actor:Actor,text:string,delayMs=650):Event=>({type:'message',actor,text,delayMs,typingMs:actor==='system'?0:Math.min(950,Math.max(200,text.length*55))});
const p=(durationMs:number):Event=>({type:'pause',durationMs});
const room=(operation:'create'|'rename'|'leave'|'enter',roomId:string,title?:string):Event=>({type:'room',operation,roomId,title});
const c=(id:string,label:string,nextNodeId:string,addStats:Partial<Stats>={},addFlags:string[]=[],kind:'reply'|'action'='reply',when?:Condition[]):Choice=>({id,label,replyText:kind==='reply'?label:undefined,nextNodeId,addStats,addFlags,kind,when});
const node=(id:string,chapter:Node['chapter'],events:Event[],choices?:Choice[],nextNodeId?:string,endingId?:EndingId):Node=>({id,chapter,events,choices,nextNodeId,endingId});
const DATA:Node[]=[
node('ch1_intro',1,[m('minji','얘들아',400),m('minji','이번 주말에 뭐함'),m('junho','나 몰라'),m('subin','토요일은?'),m('minji','ㄱㅊ',350),m('junho','난 안 됨'),m('subin','?'),m('junho','아 일요일 말하는 줄'),m('minji','토요일이라니까 ㅋㅋ'),m('taehoon','뭐 잡음?'),m('junho','너 언제 들어왔냐'),m('taehoon','나 원래 있었는데'),m('minji','아 맞다 ㅋㅋ'),m('minji','너는 주말에 뭐해?')],[c('intro_busy','나 이번 주말 바쁠 듯','ch1_busy',{suspicion:1}),c('intro_unsure','나도 아직 몰라 ㅋㅋ','ch1_unsure',{chaos:1}),c('intro_ignore','읽씹하기','ch1_ignore',{suspicion:1,quiet:1},[],'action')]),
node('ch1_busy',1,[m('minji','또 바빠?'),m('junho','연예인이네 ㅋㅋ'),m('subin','그럼 다음 주로 넘겨?')],undefined,'ch1_leave'),
node('ch1_unsure',1,[m('subin','모르는 사람 3명'),m('junho','그럼 이 방 왜 있는 건데 ㅋㅋ'),m('minji','몰라 일단 냅둬 ㅋㅋ')],undefined,'ch1_leave'),
node('ch1_ignore',1,[p(1200),m('minji','야 읽었으면 대답 좀 ㅋㅋ'),m('taehoon','나도 읽씹 중'),m('junho','그걸 왜 말해 ㅋㅋ')],undefined,'ch1_leave'),
node('ch1_leave',1,[m('minji','아 그럼 날짜 투표 다시 올림?')],[c('leave_silent','조용히 나가기','ch2_left',{escapeAttempts:1,quiet:1},[],'action'),c('leave_normal','그냥 나가기','ch2_left',{escapeAttempts:1},[],'action'),c('leave_cancel','나가기 취소','ch1_cancel',{},[],'action')]),
node('ch1_cancel',1,[m('subin','ㅇㅋ 다음 주 것도 올려둠'),m('junho','아직도 여기 있었네')],undefined,'ch1_leave'),
node('ch2_left',2,[room('leave','original'),p(1200),room('create','restore','주말에 뭐함 (복구)'),m('system','준호님이 초대했습니다.'),m('junho','ㅋㅋㅋㅋ 찾았다'),m('minji','야 왜 나감'),m('subin','아 잠만 왜 나간 건데'),m('junho','취조 시작이냐 ㅋㅋ'),m('minji','아니 근데 ㄹㅇ 왜 나감?')],[c('reason_finger','손가락 미끄러짐 ㅋㅋ','ch3_finger_intro',{authority:1}),c('reason_notification','알림 너무 많아서 ㅠ','ch3_quiet_intro',{chaos:2}),c('reason_permission','나 그냥 나가면 안 돼?','ch3_vote_intro',{suspicion:2}),c('reason_silence','답장 안 하기','ch3_silent_intro',{suspicion:2},[],'action')]),
node('ch3_finger_intro',3,[m('junho','손가락이 혼자 나갔냐 ㅋㅋ'),m('subin','그럼 안 미끄러지게 해야겠네'),m('minji','ㅋㅋㅋㅋ'),m('subin','잠만 내가 테스트해봄')],[c('finger_practice','그럼 한 번 나가볼게','ch3_finger_practice',{escapeAttempts:1,chaos:2},['trainingEscape']),c('finger_refuse','교육 안 받는다고','ch3_finger_refuse',{suspicion:2,chaos:1}),c('finger_accept','아 네 알겠습니다','ch3_finger_accept',{authority:3}),c('finger_identity','나 누가 초대한 거임?','ch3_finger_identity',{identity:2},['identitySeed'])]),
node('ch3_finger_practice',3,[room('leave','restore'),room('create','practice','모의훈련 2차'),m('junho','실습 잘하네 ㅋㅋ')],undefined,'ch4_open'),
node('ch3_finger_refuse',3,[m('subin','아 교육 거부하신대'),m('minji','거부자용 교육도 있음? ㅋㅋ'),m('junho','ㅋㅋㅋㅋ')],undefined,'ch4_open'),
node('ch3_finger_accept',3,[m('subin','어? 갑자기 말 잘 듣네'),m('minji','얘 강사 시키자'),m('player','아니?')],undefined,'ch4_open'),
node('ch3_finger_identity',3,[m('junho','민지 아님?'),m('minji','난 아닌데'),m('subin','잠깐 초대 기록 어딨지')],undefined,'ch4_open'),
node('ch3_quiet_intro',3,[room('create','quiet','조용한 방'),m('minji','야 여긴 진짜 아무 말 하지 마'),m('junho','ㅇㅋ'),m('subin','확인'),m('minji','확인 ㄱㅅ'),m('taehoon','아니 조용한 방 아님?')],[c('quiet_stop','진짜 아무 말도 하지 마','ch3_quiet_stop',{quiet:2}),c('quiet_mute','걍 알림 끌게','ch3_quiet_mute',{chaos:2}),c('quiet_ignore','끝까지 읽씹','ch3_quiet_ignore',{quiet:3},['perfectSilence'],'action'),c('quiet_permission','여기선 나가도 돼?','ch3_quiet_permission',{permission:2},['permissionGranted'])]),
node('ch3_quiet_stop',3,[m('minji','ㅇㅇ'),m('junho','알았어'),m('subin','잠깐 말하지 말라고 공지 올릴게')],undefined,'ch4_open'),
node('ch3_quiet_mute',3,[m('subin','껐으면 확인 좀'),m('junho','ㅋㅋㅋㅋ 알림 껐으면 답장하래')],undefined,'ch4_open'),
node('ch3_quiet_ignore',3,[p(1700),m('taehoon','근데 얘 아직 이 방에 있냐'),m('minji','몰라 말 걸지 마')],undefined,'ch4_open'),
node('ch3_quiet_permission',3,[m('minji','ㅇㅇ 당연하지'),m('junho','ㅇㅇ 안 잡음 진짜'),m('subin','본인 자유지 뭐')],undefined,'ch4_open'),
node('ch3_vote_intro',3,[p(1100),m('minji','왜'),m('junho','?ㅋㅋㅋㅋㅋ'),m('subin','아니 뭐 나가는 건 자유지'),m('subin','근데 왜 나가는지는 말해줘야지'),{type:'poll',pollId:'leave',title:'단톡방 탈퇴 승인 여부'},m('minji','난 일단 반대'),m('junho','난 찬성인데?'),m('subin','아 너 것도 내가 반대 누름'),m('junho','그걸 왜 니 맘대로 누름 ㅋㅋ')],[c('vote_appeal','내 탈퇴를 왜 니들이 투표해','ch3_vote_appeal',{chaos:3}),c('vote_self','나도 찬성 누를래','ch3_vote_self',{chaos:2}),c('vote_stay','알겠어 안 나갈게','ch3_vote_stay',{authority:3}),c('vote_permission','너네 진짜 나가도 된다며?','ch3_vote_permission',{permission:2},['permissionGranted'])]),
node('ch3_vote_appeal',3,[m('subin','잠만 이의신청으로 넣어둘게'),m('minji','그럼 이의신청방 파자'),room('create','appeal','탈퇴 이의신청 검토위원회')],undefined,'ch4_open'),
node('ch3_vote_self',3,[m('subin','너는 당사자라 투표 못 함'),m('player','누가 정함?'),m('subin','내가 방금')],undefined,'ch4_open'),
node('ch3_vote_stay',3,[m('minji','오 그럼 된 거네'),m('subin','근데 재발방지는 누가 함?'),m('junho','얘 시키자')],undefined,'ch4_open'),
node('ch3_vote_permission',3,[m('minji','ㅇㅇ 나가도 되지'),m('junho','아무도 안 잡는다니까'),m('subin','투표는 별개지 ㅇㅇ')],undefined,'ch4_open'),
node('ch3_silent_intro',3,[p(1200),m('minji','얘 진짜 답이 없네'),m('junho','자는 거 아님?'),m('subin','잠만 얘 마지막 말한 게 언제임'),m('taehoon','근데 여기 누가 누굴 초대했냐'),m('minji','아니 다 친구잖아 ㅋㅋ')],[c('silent_continue','계속 읽씹','ch3_silent_continue',{quiet:4},['perfectSilence'],'action'),c('silent_here','나 여기 있는데','ch3_silent_here',{authority:2}),c('silent_escape','다시 나가기','ch3_silent_escape',{escapeAttempts:2,chaos:2},[],'action'),c('silent_identity','나 누군지는 알지?','ch3_silent_identity',{identity:2},['identitySeed'])]),
node('ch3_silent_continue',3,[p(2000),m('minji','없는 거 같긴 함'),m('junho','건들지 마')],undefined,'ch4_open'),
node('ch3_silent_here',3,[m('minji','아 깜짝이야'),m('subin','아 살아 있었네'),m('junho','출석체크 ㄱ')],undefined,'ch4_open'),
node('ch3_silent_escape',3,[room('leave','restore'),room('create','search','잠수 인원 수색방'),m('junho','찾음')],undefined,'ch4_open'),
node('ch3_silent_identity',3,[m('minji','갑자기?'),m('taehoon','이름은 아는데 누가 초대했더라'),m('subin','어? 초대 기록 안 뜨는데')],undefined,'ch4_open'),
node('ch4_open',4,[m('minji','얘들아 우리 이제 진짜 끝내자'),m('junho','뭘'),m('minji','얘 자꾸 나가는 거'),m('subin','아 나 방법 세 개 생각해 옴'),m('taehoon','그냥 보내주면 안 됨?'),p(950),m('minji','아 그거는'),m('subin','아니 일단 다른 방법도 들어봐')],[c('ch4_admin','내가 방장 하면 다 해결됨?','ch4_admin_after',{authority:5},['acceptedAdmin']),c('ch4_block','나 좀 초대하지 마','ch4_block_after',{chaos:3,escapeAttempts:1},['blockedInvites']),c('ch4_silence','아무도 말하지 마','ch4_silence_after',{quiet:3},['globalSilence']),c('ch4_delete','방 자체를 없애자','ch4_delete_after',{chaos:5},['roomCleanup']),c('ch4_polite','나가도 된다며 진짜 나간다?','ch4_polite_after',{permission:2},['finalPermission'],'reply',[{flag:'permissionGranted'}]),c('ch4_identity','너네 나 누군지 알기는 함?','ch4_identity_after',{identity:2},['identityDoubt'],'reply',[{flag:'identitySeed'}])]),
node('ch4_admin_after',4,[m('minji','오'),m('junho','드디어 방에 애정 생김? ㅋㅋ'),m('player','그 뜻이 아니고'),m('system','사용자가 방장으로 임명되었습니다.'),m('subin','방장님 공지 좀 써줘')],undefined,'ch5_final'),
node('ch4_block_after',4,[m('minji','ㅇㅋ'),m('subin','그럼 초대 안 하기로 했다는 방 파자'),room('create','noinvite','초대 안 하기로 약속하는 방'),m('junho','ㅋㅋ 초대 안 한다면서 초대함')],undefined,'ch5_final'),
node('ch4_silence_after',4,[m('minji','ㅇㅋ'),m('junho','ㅇㅇ'),m('subin','확인'),p(1800),m('taehoon','지금부터 말 안 하는 거임?')],undefined,'ch5_final'),
node('ch4_delete_after',4,[m('junho','그게 맞긴 함'),m('subin','그럼 일단 방 정리 회의부터'),room('create','cleanup','방 정리 회의방'),m('player','아니')],undefined,'ch5_final'),
node('ch4_polite_after',4,[m('minji','ㅇㅇ'),m('junho','가라 가 ㅋㅋ'),m('subin','응 자유야'),m('player','나중에 뭐라 하지 마'),m('minji','안 한다니까 ㅋㅋ')],undefined,'ch5_final'),
node('ch4_identity_after',4,[m('junho','갑자기 그건 왜 ㅋㅋ'),m('minji','알지 당연히'),m('player','그럼 누가 초대함?'),m('minji','준호 아님?'),m('junho','난 아닌데'),m('subin','어 나도 초대한 기록 안 보임'),p(900),m('taehoon','그럼 얘 어떻게 들어옴')],undefined,'ch5_final'),
node('ch5_final',5,[m('minji','야 진짜 이제 그만하자 ㅋㅋ'),m('junho','ㅇㅈ ㅋㅋ'),m('subin','잠만 최종 정리할게'),m('taehoon','그냥 나가게 해주자'),p(1200),m('minji','아 맞다'),m('subin','그럼 진짜 이번 한 번만 하고 끝내자')],[c('final_admin','방장 권한으로 해결하기','ending_E01',{},[],'action',[{stat:'authority',min:3}]),c('final_everyone','너네 먼저 나가 봐','ending_E02',{},[],'action'),c('final_repeat','끝까지 다시 나가기','ending_E03',{},[],'action'),c('final_quiet','아무 말 없이 나가기','ending_E04',{},[],'action',[{stat:'quiet',min:3}]),c('final_delete','방 자체를 없애기','ending_E05',{},[],'action',[{stat:'chaos',min:5}]),c('final_polite','너네 나가도 된다 했다?','ending_E06',{},[],'action',[{flag:'finalPermission'}]),c('final_identity','마지막으로 나 누군지 말해 봐','ending_E07',{},[],'action',[{flag:'identityDoubt'}])]),
node('ending_E01',5,[m('player','방장 권한으로 해결할게'),m('minji','방장님 저 먼저 나가도 됨?'),m('junho','저 먼저요'),m('subin','아 방장은 맨 마지막에 나가는 거지'),m('system','다른 멤버 4명이 채팅방을 나갔습니다.'),m('player','아 드디어'),room('create','admin-training','신입 방장 OT (37)'),m('system','신입 방장 교육방에 초대되었습니다.')],undefined,undefined,'E01'),
node('ending_E02',5,[m('player','너네 먼저 나가 봐'),m('junho','아 그럼 나 먼저'),m('system','준호님이 퇴장했습니다.'),m('system','민지님이 퇴장했습니다.'),m('system','수빈님이 퇴장했습니다.'),m('taehoon','다 나감? 그럼 나도'),m('system','태훈님이 퇴장했습니다.'),m('player','드디어 조용하다'),m('system','발신자: 나에게서 나'),m('system','너는 왜 안 나가?')],undefined,undefined,'E02'),
node('ending_E03',5,[m('player','나 계속 나갈 거야'),room('leave','restore'),room('enter','restore'),m('system','다시 초대되었습니다.'),room('leave','restore'),room('enter','restore'),m('system','다시 초대되었습니다.'),m('subin','이거 재초대 기능 테스트 가능하겠는데?'),m('minji','그럼 얘가 담당하자'),m('system','재초대 QA 담당자로 지정되었습니다.'),m('junho','첫 출근 축하요 ㅋㅋㅋㅋ')],undefined,undefined,'E03'),
node('ending_E04',5,[room('leave','restore'),p(1500),p(2000)],undefined,undefined,'E04'),
node('ending_E05',5,[m('player','이 방 자체를 없애자'),m('subin','아 잠만 백업은 하고'),room('create','backup','백업 확인방'),room('create','delete-review','방 삭제 검토방'),m('junho','ㅋㅋㅋㅋ 없앤다면서 더 늘어남'),p(1400),m('system','채팅방이 퇴장을 요청했습니다.'),m('system','채팅방: 나도 나갈래요'),p(1200),m('system','채팅방이 채팅방에서 퇴장했습니다.',350)],undefined,undefined,'E05'),
node('ending_E06',5,[m('player','오키 진짜 간다'),m('minji','ㅇㅇ'),m('junho','ㅂㅂ ㅋㅋ'),room('leave','restore'),p(1500),m('minji','와'),m('junho','왜'),p(1200),m('minji','얘 진짜 나갔네',500),m('junho','니가 가라며 ㅋㅋㅋㅋ'),m('minji','아니 진짜 갈 줄 알았냐고'),m('taehoon','다시 초대해?'),m('minji','아니 됐어'),p(1200),m('minji','근데 우리가 왜 안 잡았냐?')],undefined,undefined,'E06'),
node('ending_E07',5,[m('player','나 누군지 알기는 해?'),m('minji','알지'),m('player','그럼 말해봐'),p(1000),m('minji','잠만'),m('subin','이름은 아는데'),m('taehoon','누가 초대함?'),m('junho','난 아닌데'),p(1300),m('minji','죄송한데 누구시죠?',450),m('player','???'),m('junho','안녕하세요'),m('subin','일단 누구신지 확인이 안 돼서요'),m('system','관리자가 회원님을 내보냈습니다.'),room('leave','restore'),p(800),m('taehoon','아 맞다 쟤 우리 초딩 때부터 알던 애 아님?')],undefined,undefined,'E07')
];
export const story:Record<string,Node>=Object.fromEntries(DATA.map(n=>[n.id,n]));
export const available=(choice:Choice,state:State)=> (choice.when??[]).every(cond=>(!cond.flag||state.flags.includes(cond.flag))&&(!cond.stat||(state.stats[cond.stat]>=(cond.min??0))));
export function choose(state:State,choiceId:string):State{
 const node=story[state.nodeId];if(!node)throw Error('Unknown node '+state.nodeId);
 const choice=node.choices?.find(c=>c.id===choiceId&&available(c,state));if(!choice)throw Error('Invalid/locked choice '+choiceId);
 const stats={...state.stats};for(const [k,v] of Object.entries(choice.addStats??{}))stats[k as Stat]+=v as number;
 return {nodeId:choice.nextNodeId,stats,flags:[...new Set([...state.flags,...(choice.addFlags??[])])],history:[...state.history,choice.id]};
}
export function advance(state:State):State {const current=story[state.nodeId];if(!current?.nextNodeId)throw Error('Node cannot auto advance');return {...state,nodeId:current.nextNodeId};}
export function normalize(state:State):State {let s=state;const seen=new Set<string>();while(story[s.nodeId]?.nextNodeId){if(seen.has(s.nodeId))throw Error('Auto cycle '+s.nodeId);seen.add(s.nodeId);s=advance(s)}return s;}
