import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './style.css';
export const metadata: Metadata = {
 title: {default:'카톡방탈출 | 단톡방 탈출 시뮬레이터',template:'%s | 카톡방탈출'},
 description:'나 좀 나가게 해줘! 친구들과의 가상 단톡방에서 탈출을 시도하는 5개 챕터·7개 엔딩의 선택형 코미디 게임.',
 metadataBase:new URL('https://group-chat-escape-game.vercel.app'),
 applicationName:'카톡방탈출', robots:{index:true,follow:true},
 openGraph:{title:'카톡방탈출 | 나 좀 나가게 해줘',description:'나가도 다시 초대되는 단톡방. 5개 챕터와 7개 엔딩의 선택형 코미디 게임.',type:'website',locale:'ko_KR',siteName:'카톡방탈출',images:[{url:'/og-card.png',width:1200,height:630,alt:'카톡방탈출 — 나 좀 나가게 해줘, 선택형 단톡방 탈출 게임'}]},
 twitter:{card:'summary_large_image',title:'카톡방탈출 | 나 좀 나가게 해줘',description:'친구들과의 단톡방에서 과연 탈출할 수 있을까?',images:['/og-card.png']}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{process.env.NEXT_PUBLIC_ADSENSE_CLIENT&&<Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`} crossOrigin="anonymous"/>}{children}<footer className="site-footer"><p>카톡방탈출 · 독립 창작 가상 메신저 게임 · 실제 카카오톡 및 카카오와 무관합니다.</p><nav aria-label="사이트 안내"><Link href="/about">게임 소개</Link><Link href="/how-to-play">플레이 방법</Link><Link href="/privacy">개인정보처리방침</Link><Link href="/contact">문의</Link></nav></footer></body></html>}
