import type {Metadata} from 'next';
import Link from 'next/link';
export const metadata:Metadata={title:'문의'};
export default function Page(){return <main className="info-page"><Link href="/" className="back-link">← 게임으로 돌아가기</Link><article className="info-card"><span className="eyebrow">카톡방탈출</span><h1>버그 제보와 의견</h1><p>게임 관련 오류와 개선 의견은 GitHub 저장소의 Issues를 통해 전달할 수 있습니다. 공개 이슈에는 이메일 주소 등 민감한 개인정보를 남기지 마세요.</p><p>광고 또는 개인정보 관련 문의도 현재는 이 저장소의 이슈를 이용할 수 있습니다. 비공개 문의 채널은 운영자가 추후 확정하면 이 페이지에 게시합니다.</p><p><a className="action-link" href="https://github.com/nno3onn/group-chat-escape-game/issues/new" target="_blank" rel="noopener noreferrer">GitHub 이슈로 문의하기 ↗</a></p></article></main>}
