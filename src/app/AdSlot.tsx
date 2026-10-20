'use client';
import {useEffect,useRef} from 'react';
type Placement='start'|'ending';
const isNative=process.env.NEXT_PUBLIC_APP_TARGET==='native';
const client=isNative?undefined:process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slots={start:process.env.NEXT_PUBLIC_ADSENSE_SLOT_START,ending:process.env.NEXT_PUBLIC_ADSENSE_SLOT_END};
export default function AdSlot({placement}:{placement:Placement}){
 const mounted=useRef(false);
 const slot=isNative?undefined:slots[placement];
 useEffect(()=>{
  if(!client||!slot||mounted.current)return;
  mounted.current=true;
  try{(window as Window & {adsbygoogle?:unknown[]}).adsbygoogle ??= [];(window as Window & {adsbygoogle?:unknown[]}).adsbygoogle?.push({});}catch{mounted.current=false}
 },[slot]);
 if(!client||!slot)return null;
 return <div className="ad-slot" aria-label="광고"><span className="ad-label">광고</span><ins className="adsbygoogle" style={{display:'block'}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" /></div>;
}
