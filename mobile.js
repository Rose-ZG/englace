'use strict';
if(location.protocol==='englace:'){
 const note=document.createElement('div');note.className='ios-notice';note.textContent='iPhone / iPad 离线版 · 学习记录保存在此设备；联网 AI 暂未接入。请定期导出备份。';document.querySelector('main').prepend(note);
 const original=window.fetch.bind(window);window.fetch=(input,options)=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(url.pathname.startsWith('/api/'))return Promise.resolve(new Response(JSON.stringify({error:'iOS 版暂未接入联网 AI；请使用本地辅学。'}),{status:503,headers:{'Content-Type':'application/json'}}));return original(input,options);};
}
