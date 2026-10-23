(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EnglaceLab=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 function pick(words,review,seed=0){const sorted=[...words].sort((a,b)=>{const x=review[a.id],y=review[b.id];return (x?x.due:Infinity)-(y?y.due:Infinity)||a.word.localeCompare(b.word);});if(!sorted.length)return [];const start=Math.abs(seed)*3%sorted.length;return Array.from({length:Math.min(3,sorted.length)},(_,i)=>sorted[(start+i)%sorted.length]);}
 function used(text,word){const escaped=word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|[^a-z])'+escaped+'(?=$|[^a-z])','i').test(text);}
 function grade(answer,word,confidence){const correct=answer.trim().toLowerCase()===word.trim().toLowerCase();return{correct,blindSpot:!correct&&confidence==='sure',underestimated:correct&&confidence==='unsure'};}
 return{pick,used,grade};
});
