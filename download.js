'use strict';
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), root=document.documentElement;
 const sections=[...document.querySelectorAll('[data-reveal]')];
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}},{threshold:.12});sections.forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});}
 const canvas=document.querySelector('#constellations'),ctx=canvas.getContext('2d');
 let width=0,height=0,stars=[],frame=0,last=0,scrollDirty=true;
 function resize(){width=innerWidth;height=innerHeight;const scale=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);ctx?.setTransform(scale,0,0,scale,0,0);stars=Array.from({length:width<700?22:42},(_,i)=>({x:((i*137.51)%997)/997*width,y:((i*271.17)%991)/991*height,r:.6+(i%3)*.35,phase:i*.76}));scrollDirty=true;}
 function paint(time){if(!ctx)return;ctx.clearRect(0,0,width,height);const t=reduced.matches?0:time*.00014;for(const s of stars){const y=s.y+Math.sin(t+s.phase)*12;ctx.fillStyle=`rgba(204,229,206,${.17+.18*(1+Math.sin(t*2+s.phase))/2})`;ctx.beginPath();ctx.arc(s.x,y,s.r,0,Math.PI*2);ctx.fill();}ctx.strokeStyle='rgba(190,221,202,.045)';ctx.lineWidth=.7;for(let i=0;i<stars.length-1;i+=3){const a=stars[i],b=stars[i+1];if(Math.hypot(a.x-b.x,a.y-b.y)<200){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}
 function scroll(){const y=scrollY,max=Math.max(1,document.documentElement.scrollHeight-innerHeight);root.style.setProperty('--progress',String(Math.min(1,y/max)));root.style.setProperty('--hero-drift',`${Math.min(y*.13,95)}px`);root.style.setProperty('--ribbon-drift',`${-Math.min(y*.12,230)}px`);}
 function tick(time){frame=0;if(document.hidden)return;if(scrollDirty){scroll();scrollDirty=false;}if(!reduced.matches&&time-last>32){paint(time);last=time;}if(!reduced.matches)frame=requestAnimationFrame(tick);}
 function wake(){if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);}
 addEventListener('scroll',()=>{scrollDirty=true;wake();},{passive:true});addEventListener('resize',()=>{resize();paint(0);wake();},{passive:true});
 reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;paint(0);wake();});resize();paint(0);wake();

 // Original ambient composition: slow extended chords and a sparse pentatonic melody.
 // Audio starts only after a user gesture; no media files or third-party requests.
 const button=document.querySelector('#ambient-toggle'),label=document.querySelector('#ambient-label'),volume=document.querySelector('#ambient-volume'),status=document.querySelector('#ambient-status');
 let audio,bus,filter,timer,playing=false,starting=false,step=0,next=0;const voices=new Set();
 const chords=[[48,55,59,62],[45,52,55,59],[41,48,52,55],[43,50,57,62]],melody=[76,79,83,86,83,79,74,79,76,81,84,88,86,83,79,74],beat=60/66;
 function tone(note,at,duration,gain){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=440*2**((note-69)/12);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(gain,at+.12);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(filter);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};o.start(at);o.stop(at+duration+.05);}
 function schedule(){if(!playing||document.hidden)return;while(next<audio.currentTime+.3){const n=step++;if(n%8===0)chords[Math.floor(n/8)%4].forEach((note,i)=>tone(note,next+i*.06,beat*7,.11));if(n%2===0)tone(melody[Math.floor(n/2)%melody.length],next,beat*2.8,.12);next+=beat;}}
 function stop(){playing=false;clearInterval(timer);timer=null;if(bus)bus.gain.setTargetAtTime(0,audio.currentTime,.035);for(const o of voices){try{o.stop(audio.currentTime+.18);}catch{}}voices.clear();if(audio&&audio.state!=='closed')setTimeout(()=>{if(!playing)audio.suspend().catch(()=>{});},220);button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','播放背景音乐');label.textContent='开启氛围音乐';status.textContent='背景音乐已暂停';}
 button.addEventListener('click',async()=>{if(starting)return;if(playing){stop();return;}starting=true;try{if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unsupported');audio=new Audio();bus=audio.createGain();filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2300;filter.connect(bus);bus.connect(audio.destination);}await audio.resume();bus.gain.value=Number(volume.value)/100*.55;playing=true;step=0;next=audio.currentTime+.08;schedule();timer=setInterval(schedule,120);button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','暂停背景音乐');label.textContent='氛围音乐已开启';status.textContent='正在播放原创氛围音乐 Orbit';}catch{stop();status.textContent='当前浏览器无法播放音乐，请稍后重试';label.textContent='点击重试音乐';}finally{starting=false;}});
 volume.addEventListener('input',()=>{if(bus)bus.gain.setTargetAtTime(Number(volume.value)/100*.55,audio.currentTime,.12);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;if(playing)stop();}else{scrollDirty=true;wake();}});
 addEventListener('pagehide',()=>{stop();cancelAnimationFrame(frame);});
})();
