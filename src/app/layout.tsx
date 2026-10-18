import type { Metadata } from 'next';
import './style.css';
export const metadata:Metadata={title:'나 좀 나가게 해줘 ㅋㅋㅋ | 단톡방 탈출',description:'나갔는데 왜 다시 초대함? 가상 단톡방 탈출 시뮬레이터.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
