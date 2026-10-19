'use strict';
const {spawn}=require('node:child_process'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
const local=process.platform==='win32'?path.join(root,'.cache','electron-runtime','electron.exe'):null;
const extra=process.argv.slice(2).filter(a=>a==='--smoke-test');
let child;
if(local&&fs.existsSync(local))child=spawn(local,['desktop/main.cjs',...extra],{cwd:root,stdio:'inherit',windowsHide:true});
else if(process.env.npm_execpath)child=spawn(process.execPath,[process.env.npm_execpath,'exec','--yes','--package','electron@44.9.0','--','electron','desktop/main.cjs',...extra],{cwd:root,stdio:'inherit',windowsHide:true});
else{console.error('Please run npm run desktop from the project directory.');process.exitCode=1;}
if(child){child.on('error',()=>{console.error('Desktop runtime could not start. Check the Electron download and Node.js version.');process.exitCode=1;});child.on('exit',code=>{process.exitCode=code||0;});}
