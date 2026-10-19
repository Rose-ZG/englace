'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const ROOT=__dirname;
const api=require('./ai-server.js').makeApi();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.wav':'audio/wav','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const top=new Set(['index.html','app.js','core.js','learning.js','features.js','style.css','upgrade.css','features.css','vocabulary.css','vocabulary.js','vocab-core.js','atlas.js','atlas.css','arcade.js','arcade-core.js','pet-art.js','desktop-pet.html','desktop-pet.js','desktop-pet.css','favicon.svg']);
function handler(req,res){
  if(req.url.startsWith('/api/')){api(req,res);return;}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  const rel=pathname==='/'?'index.html':pathname.slice(1);
  if((!top.has(rel)&&!/^((data|audio|docs|assets)\/[a-zA-Z0-9_.-]+)$/.test(rel))||rel.includes('..')||rel.includes('\\')){res.writeHead(404).end();return;}
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const file=path.join(ROOT,rel);
  fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end();return;}
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    let start=0,end=stat.size-1,status=200;
    if(req.headers.range){const m=req.headers.range.match(/^bytes=(\d*)-(\d*)$/);if(!m){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}if(m[1]===''){start=Math.max(0,stat.size-Number(m[2]));}else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;}
    headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
  });
}
if(require.main===module){const server=http.createServer(handler);server.on('error',err=>{if(err.code==='EADDRINUSE'){console.log('英格雷斯已在运行：http://127.0.0.1:4173');if(process.argv.includes('--open'))openBrowser();}else{console.error(err.message);process.exitCode=1;}});server.listen(4173,'127.0.0.1',()=>{console.log('Local: http://127.0.0.1:4173');if(process.argv.includes('--open'))openBrowser();});}
function openBrowser(){if(process.platform==='win32')require('node:child_process').spawn('cmd.exe',['/c','start','','http://127.0.0.1:4173'],{windowsHide:true,stdio:'ignore'});}
module.exports={handler};
