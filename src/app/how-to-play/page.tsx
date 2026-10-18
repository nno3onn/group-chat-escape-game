import type {Metadata} from 'next';
import Link from 'next/link';
export const metadata:Metadata={title:'플레이 방법'};
export default function Page(){return <main className="info-page"><Link href="/" className="back-link">← 게임으로 돌아가기</Link><article className="info-card"><span className="eyebrow">카톡방탈출</span><h1>이렇게 탈출해 보세요</h1><p>친구들의 메시지가 하나씩 나타납니다. 선택지가 나오면 답장을 선택하고 전송하거나, 행동 버튼을 눌러 이야기의 흐름을 결정하세요.</p><p>채팅방 나가기 버튼이 활성화되는 장면에서는 메뉴를 이용해 탈출을 시도할 수 있습니다. 재초대와 관전은 게임 안에서만 일어나는 연출입니다. 일시정지·재생 속도 변경·건너뛰기 기능을 이용할 수 있습니다.</p></article></main>}
