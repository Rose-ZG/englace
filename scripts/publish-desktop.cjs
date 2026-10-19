'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn,spawnSync}=require('node:child_process');
const REPO='Rose-ZG/englace';
function git(args){const r=spawnSync('git',args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error('Git verification failed.');return r.stdout.trim();}
function credential(){if(process.env.GH_TOKEN||process.env.GITHUB_TOKEN)return process.env.GH_TOKEN||process.env.GITHUB_TOKEN;const r=spawnSync('git',['credential-manager','get'],{input:'protocol=https\nhost=github.com\nusername=Rose-ZG\n\n',encoding:'utf8',env:{...process.env,GCM_INTERACTIVE:'never'},windowsHide:true});const token=r.stdout?.split(/\r?\n/).find(l=>l.startsWith('password='))?.slice(9);if(!token||r.status!==0)throw Error('GitHub release credential unavailable.');return token;}
async function hashFile(file){const hash=crypto.createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);return hash.digest('hex');}
function request(token,url,method='GET',body,file){
 const u=new URL(url);if(!['api.github.com','uploads.github.com'].includes(u.hostname)||u.protocol!=='https:')throw Error('Unexpected release API origin.');
 const quote=v=>JSON.stringify(String(v));const config=[`url = ${quote(url)}`,`request = ${quote(method)}`,`header = ${quote('Authorization: Bearer '+token)}`,`header = "Accept: application/vnd.github+json"`,`header = "X-GitHub-Api-Version: 2022-11-28"`];
 if(file){config.push('header = "Content-Type: application/octet-stream"',`upload-file = ${quote(path.resolve(file))}`);}else if(body){config.push('header = "Content-Type: application/json"',`data = ${quote(JSON.stringify(body))}`);}
 return new Promise((resolve,reject)=>{const child=spawn(process.platform==='win32'?'curl.exe':'curl',['--silent','--show-error','--connect-timeout','15','--max-time',file?'1200':'45','--retry','2','--config','-','--write-out','\n%{http_code}'],{windowsHide:true,stdio:['pipe','pipe','pipe']});let stdout='';child.stdout.on('data',c=>{stdout+=c;if(stdout.length>3000000)child.kill();});child.stderr.resume();child.on('error',()=>reject(Error('Release network client unavailable.')));child.on('close',code=>{if(code!==0)return reject(Error('GitHub release request failed before completion.'));const at=stdout.lastIndexOf('\n'),status=Number(stdout.slice(at+1));try{resolve({status,data:JSON.parse(stdout.slice(0,at))});}catch{reject(Error('Invalid response from GitHub release API.'));}});child.stdin.end(config.join('\n')+'\n');});
}
async function main(){
 process.chdir(path.resolve(__dirname,'..'));const version=require('../package.json').version,tag='v'+version,token=credential(),prefix='https://api.github.com/repos/'+REPO;
 const api=(route,method,body,file)=>request(token,route.startsWith('https://')?route:prefix+route,method,body,file);
 const repo=await api('');if(repo.status!==200||repo.data.full_name!==REPO)throw Error('Wrong release repository or missing access.');
 const commit=await api('/commits/'+tag);if(commit.status!==200||commit.data.sha!==git(['rev-parse','HEAD']))throw Error('Push the matching commit and version tag before publishing.');
 const names=[`Englace-${version}-x64-setup.exe`,`Englace-${version}-x64-portable.exe`,'SHA256SUMS.txt'];const files=[];
 for(const name of names){const file=path.resolve('release',name),size=fs.statSync(file).size;if(size<(name.endsWith('.exe')?10000000:100))throw Error('Release file is incomplete.');files.push({name,file,size,sha:await hashFile(file)});}
 const sums=fs.readFileSync('release/SHA256SUMS.txt','utf8');for(const item of files.filter(f=>f.name.endsWith('.exe')))if(!sums.includes(item.sha+'  '+item.name))throw Error('Local release checksums do not match.');
 let response=await api('/releases/tags/'+tag);let release;
 if(response.status===404){response=await api('/releases','POST',{tag_name:tag,target_commitish:commit.data.sha,name:'英格雷斯 '+tag+' · Windows 桌面版',body:fs.readFileSync('docs/RELEASE-'+tag+'.md','utf8'),draft:true,prerelease:false});if(response.status!==201)throw Error('Could not create the release draft.');release=response.data;}else if(response.status===200)release=response.data;else throw Error('Could not read release state.');
 const assets=await api('/releases/'+release.id+'/assets');if(assets.status!==200)throw Error('Could not inspect release assets.');
 for(const item of files){let asset=assets.data.find(a=>a.name===item.name);if(asset){if(asset.size!==item.size||asset.digest!=='sha256:'+item.sha)throw Error('Existing release asset differs; refusing to replace it.');console.log('Verified existing asset: '+item.name);continue;}console.log('Uploading '+item.name+' ('+Math.ceil(item.size/1048576)+' MB)…');const upload=new URL(release.upload_url.replace(/\{.*$/,''));upload.searchParams.set('name',item.name);const result=await api(upload.href,'POST',undefined,item.file);if(result.status!==201||result.data.size!==item.size||result.data.digest!=='sha256:'+item.sha)throw Error('Remote asset verification failed: '+item.name);console.log('Verified remote SHA-256: '+item.name);}
 const published=await api('/releases/'+release.id,'PATCH',{draft:false,make_latest:'true'});if(published.status!==200||published.data.draft)throw Error('Release remains a draft.');
 const receipt={url:published.data.html_url,private:repo.data.private,commit:commit.data.sha,assets:published.data.assets.map(a=>({name:a.name,size:a.size,digest:a.digest,url:a.browser_download_url}))};fs.mkdirSync('.cache',{recursive:true});fs.writeFileSync('.cache/desktop-release.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={hashFile};
