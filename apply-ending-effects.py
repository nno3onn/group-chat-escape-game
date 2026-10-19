from pathlib import Path

root=Path(__file__).resolve().parent
# Place this script in repository root, not in extracted directory.
game=root/'src/app/Game.tsx'
css=root/'src/app/style.css'
if not game.exists() or not css.exists():
    raise SystemExit('프로젝트 최상위 폴더(package.json 있는 위치)에서 실행하세요.')
s=game.read_text()
start=s.find("{state.phase==='completed' && <section className={'ending-sheet ending-'+state.endingId}")
end=s.find("\n {!nearBottom",start)
if start<0 or end<0:
    if 'ending-outcome-card' in s: print('이미 적용된 코드입니다.')
    else: raise SystemExit('현재 Game.tsx의 엔딩 렌더링 위치를 찾지 못했습니다. 변경 없음.')
else:
    replacement="""{state.phase==='completed' && <section className={'ending-sheet ending-'+state.endingId+' ending-result-'+(state.endingId==='E04'||state.endingId==='E06'?'success':state.endingId==='E05'?'special':state.endingId==='E07'?'kicked':'failure')} aria-labelledby=\"ending-title\"><div className=\"ending-outcome-card\" role=\"status\"><div className=\"ending-outcome-symbol\" aria-hidden=\"true\">{state.endingId==='E04'||state.endingId==='E06'?'✓':state.endingId==='E05'?'✦':state.endingId==='E07'?'!':'×'}</div><div className=\"ending-outcome-eyebrow\">{state.endingId==='E04'||state.endingId==='E06'?'MISSION CLEAR':state.endingId==='E05'?'SPECIAL ENDING':state.endingId==='E07'?'KICKED OUT':'MISSION FAILED'}</div><div className=\"ending-outcome-title\">{state.endingId==='E04'||state.endingId==='E06'?'탈출 성공!':state.endingId==='E05'?'방이 탈출했어?!':state.endingId==='E07'?'강제 퇴장!':'탈출 실패!'}</div><p className=\"ending-outcome-summary\">{state.endingId==='E04'||state.endingId==='E06'?'드디어 단톡방에서 벗어났어!':state.endingId==='E05'?'내가 아니라 채팅방이 먼저 나갔어':state.endingId==='E07'?'나간 게 아니라 쫓겨난 거야':'아직도 이 단톡방에서 못 벗어났어'}</p></div>{(state.endingId==='E04'||state.endingId==='E06')&&<div className=\"ending-fireworks\" aria-hidden=\"true\"><div className=\"ending-fireworks-burst ending-burst-left\"/><div className=\"ending-fireworks-burst ending-burst-right\"/>{Array.from({length:32},(_,i)=><i key={i} className=\"ending-confetti\" style={{'--i':i,'--x':`${(i*47)%100}%`,'--drift':`${((i*29)%160)-80}px`,'--duration':`${1.7+(i%5)*0.22}s`,'--delay':`${(i%7)*0.07}s`} as React.CSSProperties}/>)}</div>}<div className=\"ending-kicker\">GAME OVER · {ending?.status}</div><h2 id=\"ending-title\">{ENDINGS[state.endingId??'']}</h2><blockquote>“{ending?.quote}”</blockquote><p>{ending?.detail}</p><div className=\"ending-stats\"><span>탈출 시도 <strong>{state.story.stats.escapeAttempts}회</strong></span><span>생성된 방 <strong>{state.story.stats.createdRooms}개</strong></span></div><small>실제 메신저와 무관한 가상 게임 결과</small><div className=\"ending-ad-container\"><AdSlot placement=\"ending\" /></div></section>}"""
    s=s[:start]+replacement+s[end:]
    game.write_text(s)
    print('Game.tsx 성공/실패 카드 및 폭죽 연출 적용')
styles="""
/* v36: prominent ending outcomes and success-only fireworks */
.game-stage .ending-sheet{position:absolute;isolation:isolate;gap:12px;padding:22px 16px 28px;align-items:center;justify-content:flex-start;overflow-y:auto}
.ending-outcome-card{width:min(100%,520px);flex-shrink:0;z-index:1;padding:22px 14px 21px;border-radius:22px;border:1px solid #e8e0d8;background:#fff;display:flex;flex-direction:column;align-items:center;gap:7px;box-shadow:0 10px 32px #2222220b}
.ending-outcome-symbol{display:grid;place-items:center;width:65px;height:65px;border-radius:50%;font-size:39px;font-weight:900;line-height:1;color:#fff;background:#90959e}
.ending-outcome-eyebrow{font-size:11px;font-weight:900;letter-spacing:.16em;color:#657174}
.ending-outcome-title{font-size:clamp(28px,5vw,38px);font-weight:900;letter-spacing:-.055em;color:#232b29}
.ending-outcome-summary{font-size:13px!important;color:#53605d!important;line-height:1.6!important}
.ending-result-success{background:#effaf3!important}
.ending-result-success .ending-outcome-card{border-color:#bbe6ce;background:#fff}
.ending-result-success .ending-outcome-symbol{background:#20a66a}
.ending-result-success .ending-outcome-eyebrow{color:#158257}
.ending-result-failure{background:#fff4f1!important}
.ending-result-failure .ending-outcome-card{border-color:#f1c9bf}
.ending-result-failure .ending-outcome-symbol{background:#d8695b}
.ending-result-failure .ending-outcome-eyebrow{color:#b55348}
.ending-result-special{background:#f5efff!important}
.ending-result-special .ending-outcome-card{border-color:#ddcef2}
.ending-result-special .ending-outcome-symbol{background:#9372ce}
.ending-result-special .ending-outcome-eyebrow{color:#7451b4}
.ending-result-kicked{background:#edf1f9!important}
.ending-result-kicked .ending-outcome-card{border-color:#cbd6ec}
.ending-result-kicked .ending-outcome-symbol{background:#607baf}
.ending-result-kicked .ending-outcome-eyebrow{color:#526d9d}
.ending-sheet>h2,.ending-sheet>blockquote,.ending-sheet>p,.ending-sheet>.ending-kicker,.ending-sheet>.ending-stats,.ending-sheet>small,.ending-sheet>.ending-ad-container{position:relative;z-index:1}
.ending-fireworks{position:absolute;inset:0;overflow:hidden;z-index:2;pointer-events:none}
.ending-confetti{position:absolute;top:-20px;left:var(--x);width:8px;height:15px;border-radius:2px;background:hsl(calc(var(--i)*49deg) 83% 62%);opacity:0;animation:ending-confetti-fall var(--duration) cubic-bezier(.24,.55,.5,1) var(--delay) 1 forwards}
.ending-confetti:nth-of-type(3n){width:6px;height:6px;border-radius:50%}
.ending-fireworks-burst{position:absolute;top:20%;width:90px;height:90px;border-radius:50%;opacity:0;background:repeating-conic-gradient(from 0deg,#ffa844 0 7deg,transparent 7deg 30deg,#38c99e 30deg 37deg,transparent 37deg 60deg);mask:radial-gradient(circle,transparent 0 27%,#000 30% 45%,transparent 49%);animation:ending-burst .75s ease-out .12s 1 forwards}
.ending-burst-left{left:5%}.ending-burst-right{right:5%;animation-delay:.32s}
@keyframes ending-confetti-fall{0%{transform:translate3d(0,-30px,0) rotate(0deg);opacity:1}82%{opacity:1}100%{transform:translate3d(var(--drift),calc(100dvh - 30px),0) rotate(690deg);opacity:0}}
@keyframes ending-burst{0%{transform:scale(.2) rotate(-35deg);opacity:0}35%{opacity:1}100%{transform:scale(1.7) rotate(35deg);opacity:0}}
@media(prefers-reduced-motion:reduce){.ending-confetti,.ending-fireworks-burst{animation:none!important;display:none!important}}
@media(max-width:420px){.game-stage .ending-sheet{padding:14px 12px 24px;gap:10px}.ending-outcome-card{padding:15px 12px}.ending-outcome-symbol{width:52px;height:52px;font-size:31px}.ending-outcome-title{font-size:29px}}
"""
c=css.read_text()
if 'v36: prominent ending outcomes' not in c:
    css.write_text(c+'\n'+styles)
    print('style.css 엔딩 결과 시각화 및 축하 효과 적용')
else: print('스타일이 이미 적용됨')
