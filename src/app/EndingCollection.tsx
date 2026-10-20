'use client';
import {useEffect,useState} from 'react';
const labels=['탈출하려다 방장 됨','나 빼고 다 나감','재초대가 직업이 됨','아무도 나간 걸 몰랐다','단톡방 자체가 탈퇴함','야 얘 진짜 나갔네','너 누구세요?'];
const KEY='katok-ending-collection-v1';
export default function EndingCollection({achieved}:{achieved:string|null}){
 const [found,setFound]=useState<string[]>([]);
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');const ids=Array.isArray(saved)?saved.filter((s):s is string=>typeof s==='string'):[];const next=[...new Set([...ids,...(achieved?[achieved]:[])])];setFound(next);localStorage.setItem(KEY,JSON.stringify(next))}
  catch{if(achieved)setFound([achieved])}
 },[achieved]);
 return <div className="ending-collection"><button className="collection-trigger" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>엔딩 도감 <strong>{found.length}/7</strong> {open?'접기 ▲':'보기 ▼'}</button>{open&&<div className="collection-grid">{labels.map((label,i)=>{const id=`E0${i+1}`;const unlocked=found.includes(id);return <div className={'collection-entry'+(unlocked?' unlocked':'')} key={id}><span>{unlocked?`✓ ${id}`:`🔒 ${id}`}</span><strong>{unlocked?label:'아직 발견하지 못한 엔딩'}</strong></div>})}</div>}</div>
}
