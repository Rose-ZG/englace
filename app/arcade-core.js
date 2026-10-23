(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ArcadeCore=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function difficulty(time){const t=clamp(time,0,180);return{speed:190+Math.min(170,t*1.65),interval:Math.max(1.05,2-t*.009),gap:Math.max(112,185-t*.5),level:1+Math.min(9,Math.floor(t/18))};}
 function player(g,dt){const target=((g.right?1:0)-(g.left?1:0))*260;g.vx+=(target-g.vx)*(1-Math.exp(-15*dt));g.x=clamp(g.x+g.vx*dt,25,590);g.buffer=Math.max(0,g.buffer-dt);g.coyote=g.ground?.1:Math.max(0,g.coyote-dt);if(g.buffer>0&&g.coyote>0){g.vy=-470;g.ground=false;g.coyote=0;g.buffer=0;}g.vy+=1260*dt;g.y+=g.vy*dt;}
 function boundsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
 function runnerObstacle(time,random=Math.random){const d=difficulty(time),types=time<10?['spike']:time<22?['spike','crate']:time<40?['spike','crate','double']:['spike','crate','double','saw','pit'];const type=types[Math.min(types.length-1,Math.floor(random()*types.length))];const w=type==='pit'?90+Math.min(45,Math.max(0,time-40)*.35):type==='double'?76:type==='crate'?42:type==='saw'?44:34;const h=type==='crate'?48:type==='saw'?42:30;return{type,x:950,y:400-h,w,h,passed:false,speed:d.speed,phase:random()*Math.PI*2};}
 return{difficulty,player,runnerObstacle,clamp,boundsOverlap};
});
