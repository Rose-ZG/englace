(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.Experience=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const themes=[['porcelain','月白瓷光','light'],['ink','曜石黑','dark'],['aurora','极光流境','dark'],['amethyst','紫晶夜航','dark'],['dawn','杏桃晨曦','light'],['forest','林间苔绿','light'],['ocean','冰川海盐','light']];
 const materials=['glass','satin','paper'],tracks=['gaokao','cet4','cet6','ielts','toefl','postgrad'],games=['runner','bird','meteor','breaker'];
 const name=value=>Array.from((typeof value==='string'?value:'').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim()).slice(0,20).join('');
 function preferences(raw={}){if(!raw||typeof raw!=='object')raw={};return{nickname:name(raw.nickname),theme:themes.some(t=>t[0]===raw.theme)?raw.theme:'porcelain',material:materials.includes(raw.material)?raw.material:'glass',motion:raw.motion!==false};}
 function history(raw){
  if(!Array.isArray(raw))return[];const ids=new Set();
  const clean=raw.filter(r=>r&&typeof r.id==='string'&&r.id.length>0&&r.id.length<100&&tracks.includes(r.track)&&games.includes(r.game)&&Number.isFinite(r.score)&&r.score>=0&&r.score<=10000000&&Number.isFinite(r.seconds)&&r.seconds>=0&&r.seconds<=1000000&&Number.isInteger(r.level)&&r.level>=1&&r.level<=100&&typeof r.at==='string'&&Number.isFinite(Date.parse(r.at))&&!ids.has(r.id)&&(ids.add(r.id),true)).map(r=>({id:r.id,name:name(r.name)||'学习者',track:r.track,game:r.game,score:Math.floor(r.score),seconds:Math.floor(r.seconds),level:r.level,at:r.at}));
  if(clean.length<=600)return clean;
  // Keep each track/game's ten best runs even as the recent-history buffer fills.
  const keep=new Set(),counts=new Map();for(const r of [...clean].sort((a,b)=>b.score-a.score||a.seconds-b.seconds||a.at.localeCompare(b.at))){const key=r.track+':'+r.game,n=counts.get(key)||0;if(n<10){keep.add(r.id);counts.set(key,n+1);}}
  for(let i=clean.length-1;i>=0&&keep.size<600;i--)keep.add(clean[i].id);
  return clean.filter(r=>keep.has(r.id));
 }
 function record(rows,row){const clean=history([row]);if(!clean.length)return history(rows);return history([...history(rows).filter(r=>r.id!==row.id),clean[0]]);}
 function ranking(rows,track,game){return history(rows).filter(r=>r.track===track&&r.game===game).sort((a,b)=>b.score-a.score||a.seconds-b.seconds||a.at.localeCompare(b.at)).slice(0,10);}
 return{themes,materials,name,preferences,history,record,ranking};
});
