import type { Metadata } from 'next';
import Link from 'next/link';
import './style.css';
export const metadata: Metadata = {
 title: {default:'카톡방탈출 | 단톡방 탈출 시뮬레이터',template:'%s | 카톡방탈출'},
 description:'나 좀 나가게 해줘 ㅋㅋㅋ! 친구들과의 가상 단톡방에서 탈출을 시도하는 5개 챕터·7개 엔딩의 선택형 코미디 게임.',
 applicationName:'카톡방탈출', robots:{index:true,follow:true},
 openGraph:{title:'카톡방탈출',description:'나 좀 나가게 해줘 ㅋㅋㅋ! 7개 엔딩의 가상 단톡방 탈출 게임.',type:'website',locale:'ko_KR'}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}<footer className="site-footer"><p>카톡방탈출 · 독립 창작 가상 메신저 게임 · 실제 카카오톡 및 카카오와 무관합니다.</p><nav aria-label="사이트 안내"><Link href="/about">게임 소개</Link><Link href="/how-to-play">플레이 방법</Link><Link href="/privacy">개인정보처리방침</Link><Link href="/contact">문의</Link></nav></footer></body></html>}
