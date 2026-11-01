import React from 'react';
import {AbsoluteFill,Sequence,OffthreadVideo,staticFile,useCurrentFrame,interpolate} from 'remotion';
import {BRAND,EPISODE,Scene} from './episode';
const SCENE_FRAMES=255;
// Set true after the matching MP4 clips have been added to public/assets/.
const ENABLE_FOOTAGE=false;
const Card:React.FC<{scene:Scene;index:number}> = ({scene,index})=>{
 const frame=useCurrentFrame(); const opacity=interpolate(frame,[0,16],[0,1],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:`linear-gradient(145deg,${BRAND.navy},#071522)`}}>
 {ENABLE_FOOTAGE && scene.asset ? <OffthreadVideo src={staticFile(scene.asset)} muted style={{width:'100%',height:'100%',objectFit:'cover',opacity:.68}} /> : null}
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,10,18,.12),rgba(3,10,18,.92))'}}/>
 <AbsoluteFill style={{padding:'110px 76px 130px',justifyContent:'space-between',opacity}}>
 <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Arial',fontSize:28,fontWeight:800,color:BRAND.white}}><span>ABIDIN AI</span><span style={{color:BRAND.orange}}>{scene.label}</span></div>
 <div><div style={{width:100,height:10,background:BRAND.orange,marginBottom:28}}/><div style={{fontFamily:'Arial',fontSize:68,lineHeight:1.08,fontWeight:900,color:BRAND.white}}>{scene.overlay}</div><div style={{fontFamily:'Arial',fontSize:34,lineHeight:1.35,color:'#F3F6F9',marginTop:32}}>{scene.narration}</div>
 {scene.kind==='product'?<div style={{marginTop:34,padding:30,border:`2px solid ${BRAND.orange}`,borderRadius:24,background:'#102B46',color:BRAND.white,fontSize:25}}><b>{EPISODE.affiliate.productName}</b><p>{EPISODE.affiliate.productPrice}</p><p>{EPISODE.affiliate.cta}</p><small>{EPISODE.affiliate.disclosure}</small></div>:null}
 </div>
 <div style={{fontFamily:'Arial',fontSize:22,color:'#D8E2EC'}}>EDUKASI • DOKUMENTER <span style={{float:'right'}}>{index+1}/{EPISODE.scenes.length}</span></div>
 </AbsoluteFill></AbsoluteFill>;
};
export const AbidinEpisode:React.FC=()=> <AbsoluteFill>{EPISODE.scenes.map((s,i)=><Sequence key={s.id} from={i*SCENE_FRAMES} durationInFrames={SCENE_FRAMES}><Card scene={s} index={i}/></Sequence>)}</AbsoluteFill>;