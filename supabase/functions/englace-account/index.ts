// Deploy as englace-account. Privileged key stays in Supabase Edge environment only.
const base=Deno.env.get('SUPABASE_URL')!,secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const origins=['https://rose-zg.github.io','http://127.0.0.1:4173','http://127.0.0.1:4174'];
const encoder=new TextEncoder();
const hex=(b:ArrayBuffer)=>Array.from(new Uint8Array(b)).map(n=>n.toString(16).padStart(2,'0')).join('');
async function hash(text:string){return hex(await crypto.subtle.digest('SHA-256',encoder.encode(text)));}
async function derive(answer:string,salt:string){const key=await crypto.subtle.importKey('raw',encoder.encode(answer),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:210000,hash:'SHA-256'},key,256));}
function equal(a:string,b:string){let diff=a.length^b.length;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^(b.charCodeAt(i)||0);return diff===0;}
async function api(path:string,method='GET',body?:unknown){const response=await fetch(base+path,{method,headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json',Prefer:'return=representation'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(20000)});const data=await response.json().catch(()=>null);if(!response.ok)throw Error('Account operation failed');return data;}
async function limit(bucket:string,n:number){const ok=await api('/rest/v1/rpc/englace_account_limit','POST',{p_bucket:bucket,p_limit:n});if(ok!==true)throw Error('Rate limited');}
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'';const headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:origins[0],'Access-Control-Allow-Headers':'apikey, content-type, authorization','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
 const reply=(body:unknown,status=200)=>Response.json(body,{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST'||(origin&&!origins.includes(origin)))return reply({error:'Request denied'},403);
 try{
  const raw=await req.text();if(raw.length>12000)return reply({error:'Request too large'},413);const data=JSON.parse(raw);
  if(data.action==='health'){await api('/rest/v1/englace_accounts?select=login_id&limit=0');return reply({ready:true,version:1});}
  const id=String(data.id||'').trim().toLowerCase();if(!/^[a-z][a-z0-9_]{3,23}$/.test(id))throw Error('Invalid input');
  const password=String(data.password||'');if(password.length<10||password.length>128||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password))throw Error('Invalid input');
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||req.headers.get('x-real-ip')||'unknown';
  await limit('ip:'+await hash(secret+':'+ip),100);await limit(data.action+':'+await hash(id),data.action==='recover'?5:20);
  const rows=await api('/rest/v1/englace_accounts?login_id=eq.'+encodeURIComponent(id)+'&select=*');const account=rows?.[0];
  if(data.action==='login'){
   if(!account)throw Error('Invalid credentials');
   const session=await api('/auth/v1/token?grant_type=password','POST',{email:account.auth_email,password});return reply({session:{access_token:session.access_token,refresh_token:session.refresh_token,expires_in:session.expires_in},id});
  }
  if(!['register','recover'].includes(data.action))throw Error('Invalid input');
  if(!Array.isArray(data.answers)||data.answers.length!==3)throw Error('Invalid answers');
  const answers=data.answers.map((x:unknown)=>String(x).normalize('NFKC').trim().toLowerCase());if(answers.some((x:string)=>x.length<8||x.length>128)||new Set(answers).size!==3)throw Error('Invalid answers');
  if(data.action==='register'){
   if(account)throw Error('Registration unavailable');
   // Never bind or modify the currently anonymous user's records without verified ownership.
   const email=crypto.randomUUID()+'@accounts.englace.invalid',salt=crypto.randomUUID();
   const hashes=await Promise.all(answers.map((a:string,i:number)=>derive(a,salt+':'+i)));
   const user=await api('/auth/v1/admin/users','POST',{email,password,email_confirm:true});const uid=user.id||user.user?.id;
   if(!uid)throw Error('Registration unavailable');
   try{await api('/rest/v1/englace_accounts','POST',{login_id:id,user_id:uid,auth_email:email,recovery_salt:salt,recovery_hashes:hashes});}catch(error){await api('/auth/v1/admin/users/'+uid,'DELETE').catch(()=>{});throw error;}
   return reply({registered:true});
  }
  const salt=account?.recovery_salt||'unknown-account-salt';const hashes=await Promise.all(answers.map((a:string,i:number)=>derive(a,salt+':'+i)));
  let verified=Boolean(account);for(let i=0;i<3;i++)verified=equal(hashes[i],account?.recovery_hashes?.[i]||'0'.repeat(64))&&verified;
  if(!verified)throw Error('Recovery unavailable');
  await api('/auth/v1/admin/users/'+account.user_id,'PUT',{password});return reply({reset:true});
 }catch{return reply({error:'操作未完成，请检查 ID、密码或三道密保答案；频繁尝试后请等待一小时。'},400);}
});
