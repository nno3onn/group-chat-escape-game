'use client';
import {useEffect,useState} from 'react';
import Game from './Game';
import AdSlot from './AdSlot';
import CharacterAvatar from './CharacterAvatar';

type Topic='how'|'about'|null;
export default function Landing(){
 const [started,setStarted]=useState(false);
 const [topic,setTopic]=useState<Topic>(null);
 const [gameKey,setGameKey]=useState(0);
 useEffect(()=>{if(!topic)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setTopic(null)};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[topic]);
 const startGame=()=>{try{localStorage.removeItem('talkfail-v19')}catch{}setGameKey(v=>v+1);setStarted(true)};
 if(started)return <main className="game-stage"><Game key={gameKey} onHome={()=>setStarted(false)}/></main>;
 return <main className="landing">
   <section className="hero" aria-labelledby="game-title">
    <div className="eyebrow">인터랙티브 단톡방 코미디 · 5장 / 7개 엔딩</div>
    <div className="hero-icon" aria-hidden="true"><span>···</span></div>
    <h1 id="game-title">카톡방탈출</h1>
    <p className="hero-subtitle">나 좀 나가게 해줘</p>
    <p className="hero-desc">친구들은 왜 자꾸 다시 초대하는 걸까?<br/>대답을 고르고, 채팅방에서 탈출해 봐.</p>
    <div className="face-row" aria-label="등장인물: 민지, 준호, 태훈, 수빈">
      <CharacterAvatar actor="minji" className="face"/><CharacterAvatar actor="junho" className="face"/><CharacterAvatar actor="taehoon" className="face"/><CharacterAvatar actor="subin" className="face"/>
    </div>
    <div className="hero-buttons">
       <button className="primary-button" onClick={startGame}>시작하기 <span aria-hidden="true">→</span></button>
    </div>
    <div className="hero-links"><button onClick={()=>setTopic('how')}>플레이 방법</button><span aria-hidden="true">·</span><button onClick={()=>setTopic('about')}>게임 소개</button></div>
   </section>
   <section className="landing-ad" aria-label="광고 위치"><AdSlot placement="start" /></section>
   <p className="landing-note">설치·로그인 없이 플레이 · 시작할 때마다 처음부터 진행</p>
   {topic&&<div className="dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setTopic(null)}}><section className="info-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-head"><strong id="dialog-title">{topic==='how'?'플레이 방법':'게임 소개'}</strong><button autoFocus aria-label="모달 닫기" onClick={()=>setTopic(null)}>✕</button></div>{topic==='how'?<div className="dialog-body"><p>친구들의 가상 단톡방에서 나갈 방법을 찾아보세요.</p><ol><li>도착하는 메시지를 읽어 보세요.</li><li>화면 아래에서 답장 또는 행동을 선택하세요.</li><li>선택한 말과 행동에 따라 친구들의 반응이 달라져요.</li><li>채팅방 나가기 메뉴도 이용할 수 있어요.</li><li>총 5개 챕터, 7개 엔딩이 있어요.</li></ol><p>시작하기를 누르면 항상 첫 장면부터 진행됩니다.</p></div>:<div className="dialog-body"><p><strong>카톡방탈출</strong>은 친구들의 단체 채팅방에서 빠져나가려는 플레이어의 이야기예요.</p><p>민지는 자꾸 다시 초대하고, 준호는 나가도 된다고 해요. 태훈의 말에는 아무도 대꾸하지 않고, 수빈은 불러도 답이 없다가 자기 할 말만 해요.</p><p>5개 챕터와 7개 결말이 있는 선택형 코미디 게임이며, 등장인물과 대화는 모두 허구입니다.</p><p>실제 카카오톡 및 카카오와 무관한 독립 창작 게임입니다.</p></div>}<button className="dialog-done" onClick={()=>setTopic(null)}>확인</button></section></div>}
 </main>
}
