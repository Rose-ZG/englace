(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EnglaceCommunity=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 function publicKey(key){if(typeof key!=='string')return false;if(/^sb_publishable_[A-Za-z0-9_-]+$/.test(key))return true;try{const part=key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(atob(part)).role==='anon';}catch{return false;}}
 function letter(raw){const name=String(raw.name||'').trim()||'匿名来信者',title=String(raw.title||'').trim(),body=String(raw.body||'').trim(),topic=String(raw.topic||'');if(name.length>24||title.length<3||title.length>100||body.length<20||body.length>5000||!['daily','study','culture','penpal'].includes(topic))throw Error('请检查名称、标题、正文长度和主题。');return{p_name:name,p_title:title,p_body:body,p_topic:topic};}
 return{publicKey,letter};
});
