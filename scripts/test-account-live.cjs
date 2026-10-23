'use strict';
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('community-config.js','utf8'),ctx);const cfg=ctx.window.EnglaceCommunityConfig;
async function account(body){const r=await fetch(cfg.url+'/functions/v1/englace-account',{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(45000)});const data=await r.json().catch(()=>({}));return{status:r.status,data};}
(async()=>{
 const health=await account({action:'health'});assert.ok(health.status===200&&health.data.ready,'Account backend is not ready (HTTP '+health.status+'). Check accounts.sql, Edge secrets and JWT setting.');console.log('PASS: account backend readiness.');
 const id='check_'+Date.now().toString(36)+'_'+crypto.randomBytes(2).toString('hex'),password='Aa1_'+crypto.randomBytes(20).toString('hex'),nextPassword='Bb2_'+crypto.randomBytes(20).toString('hex'),answers=Array.from({length:3},()=>crypto.randomBytes(20).toString('hex'));
 let r=await account({action:'register',id,password,answers});assert.ok(r.status===200&&r.data.registered,'Registration failed (HTTP '+r.status+').');console.log('PASS: generated test ID registered.');
 r=await account({action:'register',id,password:nextPassword,answers});assert.ok(r.status>=400,'Duplicate ID unexpectedly accepted.');console.log('PASS: duplicate ID rejected.');
 r=await account({action:'login',id:id.toUpperCase(),password});assert.ok(r.status===200&&r.data.session?.access_token,'ID/password login failed.');const token=r.data.session.access_token;console.log('PASS: ID/password login and case normalisation.');
 const feed=await fetch(cfg.url+'/rest/v1/rpc/community_feed',{method:'POST',headers:{apikey:cfg.publishableKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({p_topic:'all'}),signal:AbortSignal.timeout(25000)});assert.equal(feed.status,200,'Account cannot access community.');console.log('PASS: account session works with community permissions.');
 for(let i=0;i<3;i++){const wrong=[...answers];wrong[i]='incorrect_'+crypto.randomBytes(20).toString('hex');r=await account({action:'recover',id,password:nextPassword,answers:wrong});assert.ok(r.status>=400,'SECURITY FAILURE: incorrect answer '+i+' accepted.');}console.log('PASS: wrong answer in any of three questions rejected.');
 r=await account({action:'login',id,password});assert.ok(r.status===200&&r.data.session?.access_token,'Failed recovery changed the original password.');
 r=await account({action:'recover',id,password:nextPassword,answers});assert.ok(r.status===200&&r.data.reset,'Correct three-answer recovery failed.');
 r=await account({action:'login',id,password});assert.ok(r.status>=400,'Old password still accepted after reset.');
 r=await account({action:'login',id,password:nextPassword});assert.ok(r.status===200&&r.data.session?.access_token,'New password rejected.');console.log('PASS: correct recovery, old password invalidated, new password accepted.');
 console.log('Live account integration passed. Generated test credentials were not logged or exported; no public letters were created.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
