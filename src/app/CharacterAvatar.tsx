type Actor='minji'|'junho'|'taehoon'|'subin';
const themes:Record<Actor,{bg:string;fg:string;name:string}>={
 minji:{bg:'#FBE3EC',fg:'#AE6683',name:'민지'},
 junho:{bg:'#DEEDFF',fg:'#5F86B7',name:'준호'},
 taehoon:{bg:'#FFEAD6',fg:'#B17D55',name:'태훈'},
 subin:{bg:'#DFF2E7',fg:'#5D9979',name:'수빈'},
};
export default function CharacterAvatar({actor,className=''}:{actor:Actor;className?:string}){
 const theme=themes[actor];
 return <span className={`character-avatar ${className}`} style={{backgroundColor:theme.bg,color:theme.fg}} role="img" aria-label={`${theme.name} 기본 프로필`}>
   <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
     <circle cx="24" cy="17.5" r="8.5" fill="currentColor" opacity=".88"/>
     <path d="M8 42c0-9.3 7.2-15 16-15s16 5.7 16 15" fill="currentColor" opacity=".88"/>
   </svg>
 </span>;
}
