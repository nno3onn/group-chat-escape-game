import type {Metadata} from 'next';
import Link from 'next/link';
export const metadata:Metadata={title:'게임 소개'};
export default function Page(){return <main className="info-page"><Link href="/" className="back-link">← 게임으로 돌아가기</Link><article className="info-card"><span className="eyebrow">카톡방탈출</span><h1>카톡방탈출은 무엇인가요?</h1><p>‘카톡방탈출’은 가상의 친구 단톡방을 소재로 한 선택형 코미디 게임입니다. 나가고 싶은 플레이어가 답장을 고르고 채팅방 메뉴를 조작하며 예상 밖의 상황을 겪게 됩니다.</p><p>5개 챕터와 7개 엔딩이 준비되어 있습니다. 일부 엔딩은 실제 탈출에 성공하고, 일부는 실패하거나 강제로 퇴장당합니다. 이야기와 대화 상대는 모두 허구입니다.</p></article></main>}
