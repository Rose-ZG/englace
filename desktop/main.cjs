'use strict';
const {app,BrowserWindow,ipcMain,screen,session,dialog,shell,Menu,Tray,nativeImage}=require('electron');
const http=require('node:http'),path=require('node:path'),fs=require('node:fs');
const ROOT=path.resolve(__dirname,'..'),smoke=process.argv.includes('--smoke-test');
let BASE='',mainWindow,petWindow,server,tray,quitting=false;
const readyFrames=new Set(),smokeFrames=new Map(),rendererErrors=[];
const smokeOutput=process.argv.find(a=>a.startsWith('--smoke-output='))?.slice('--smoke-output='.length);
app.setName('Englace');app.setAppUserModelId('com.rosezg.englace');
const profile=smoke?path.join(app.getPath('temp'),'englace-smoke-'+process.pid):path.join(app.getPath('appData'),'Englace');
fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);
function ownURL(url){try{return new URL(url).origin===BASE;}catch{return false;}}
function showMain(){if(!mainWindow||mainWindow.isDestroyed())return;if(mainWindow.isMinimized())mainWindow.restore();mainWindow.show();mainWindow.focus();}
function togglePet(){if(petWindow.isVisible())petWindow.hide();else petWindow.showInactive();}
function exit(){quitting=true;app.quit();}
function trusted(event){return [mainWindow?.webContents,petWindow?.webContents].includes(event.sender)&&event.senderFrame===event.sender.mainFrame&&ownURL(event.senderFrame.url);}
function protect(win){
 win.webContents.on('will-navigate',(event,url)=>{if(!ownURL(url))event.preventDefault();});
 win.webContents.setWindowOpenHandler(({url})=>{try{const u=new URL(url),allowed=['github.com','www.gutenberg.org','www.oxfordlearnersdictionaries.com','www.ldoceonline.com','www.pep.com.cn','durian.blender.org','www.bilibili.com','ielts.org','www.ets.org','cet.neea.edu.cn'];if(u.protocol==='https:'&&allowed.includes(u.hostname))shell.openExternal(u.href);}catch{}return{action:'deny'};});
 win.webContents.on('console-message',details=>{if(smoke&&details.level==='error')rendererErrors.push({line:details.lineNumber,source:path.basename(details.sourceId||'renderer')});});
 win.webContents.on('render-process-gone',()=>{if(smoke)rendererErrors.push({source:'renderer-exited'});});
}
if(!app.requestSingleInstanceLock()){app.quit();}else{
 app.on('second-instance',showMain);
 app.whenReady().then(async()=>{
  if(smoke)setTimeout(()=>{console.error('Desktop smoke timed out.');process.exitCode=1;exit();},30000).unref();
  const {handler}=require('../server.js');server=http.createServer(handler);
  try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(smoke?0:4174,'127.0.0.1',resolve);});}
  catch{if(smoke)throw Error('Local server could not start.');dialog.showErrorBox('英格雷斯','本机端口 4174 已被占用。请退出旧版英格雷斯后重新打开，学习数据会保留。');exit();return;}
  BASE='http://127.0.0.1:'+server.address().port;
  session.defaultSession.setPermissionRequestHandler(async(contents,permission,callback,details)=>{
   const own=contents===mainWindow?.webContents&&ownURL(details.requestingUrl);
   const audioOnly=Array.isArray(details.mediaTypes)&&details.mediaTypes.length>0&&details.mediaTypes.every(t=>t==='audio');
   if(!own||permission!=='media'||!audioOnly){callback(false);return;}
   const answer=await dialog.showMessageBox(mainWindow,{type:'question',buttons:['不允许','允许本次录音'],defaultId:0,cancelId:0,title:'英格雷斯 · 麦克风',message:'是否允许本次口语练习使用麦克风？',detail:'录音留在当前页面，不自动上传。'});callback(answer.response===1);
  });
  const icon=path.join(ROOT,'assets','app-icon.png');
  const prefs={preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,additionalArguments:['--englace-origin='+BASE,...(smoke?['--englace-smoke']:[])]};
  mainWindow=new BrowserWindow({width:1360,height:900,minWidth:720,minHeight:560,show:false,icon,backgroundColor:'#f4f5f1',title:'英格雷斯 · Englace',webPreferences:prefs});
  const bounds=screen.getPrimaryDisplay().workArea;
  petWindow=new BrowserWindow({width:280,height:410,x:bounds.x+bounds.width-300,y:bounds.y+bounds.height-440,transparent:true,frame:false,resizable:false,alwaysOnTop:true,skipTaskbar:true,show:false,icon,hasShadow:false,webPreferences:prefs});
  protect(mainWindow);protect(petWindow);
  ipcMain.on('englace:ready',event=>{if(trusted(event))readyFrames.add(event.sender.id);});
  ipcMain.on('englace:smoke-ready',(event,result)=>{if(smoke&&trusted(event))smokeFrames.set(event.sender.id,result);});
  ipcMain.handle('englace:toggle-pet',event=>{if(!trusted(event))return false;togglePet();return true;});
  ipcMain.handle('englace:set-pet',(event,visible)=>{if(!trusted(event)||typeof visible!=='boolean')return false;if(!smoke){if(visible)petWindow.showInactive();else petWindow.hide();}return true;});
  ipcMain.handle('englace:show-main',event=>{if(trusted(event))showMain();});
  ipcMain.handle('englace:quit',event=>{if(trusted(event))exit();});
  if(!smoke){
   const releaseURL='https://github.com/Rose-ZG/englace/releases/latest';
   const menu=[{label:'英格雷斯',submenu:[{label:'学习首页',click:showMain},{label:'显示 / 收起桌宠',click:togglePet},{type:'separator'},{label:'下载新版本',click:()=>shell.openExternal(releaseURL)},{label:'关于英格雷斯',click:()=>dialog.showMessageBox(mainWindow,{type:'info',title:'英格雷斯',message:'英格雷斯 · '+app.getVersion(),detail:'无需账号，本机学习。学习数据保存在本机用户档案中；卸载应用默认保留学习档案。'})},{type:'separator'},{label:'退出应用',accelerator:'Alt+F4',click:exit}]},{label:'视图',submenu:[{role:'reload'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'}]}];
   Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
   tray=new Tray(nativeImage.createFromPath(icon).resize({width:24,height:24}));tray.setToolTip('英格雷斯 · 继续你的英语之旅');tray.setContextMenu(Menu.buildFromTemplate([{label:'打开学习窗口',click:showMain},{label:'显示 / 收起桌宠',click:togglePet},{type:'separator'},{label:'退出英格雷斯',click:exit}]));tray.on('double-click',showMain);
  }
  mainWindow.on('close',event=>{if(!quitting&&!smoke){if(petWindow?.isVisible()){event.preventDefault();mainWindow.hide();}else exit();}});
  await Promise.all([mainWindow.loadURL(BASE+'/'),petWindow.loadURL(BASE+'/desktop-pet.html')]);
  if(smoke){
   const until=Date.now()+12000;while(smokeFrames.size<2&&Date.now()<until)await new Promise(r=>setTimeout(r,50));
   const main=smokeFrames.get(mainWindow.webContents.id),pet=smokeFrames.get(petWindow.webContents.id);
   if(!main?.homeReady||!main.directionReady||!pet?.petReady||rendererErrors.length||readyFrames.size!==2)throw Error('A renderer or preload did not initialise.');
   for(const file of ['experience.js','arcade-audio.js','data/cet4.json','assets/app-icon.png']){const response=await fetch(BASE+'/'+file);if(!response.ok)throw Error('Bundled asset missing.');await response.arrayBuffer();}
   const api=await fetch(BASE+'/api/session');if(!api.ok)throw Error('Local API failed.');
   const result={packaged:app.isPackaged,version:app.getVersion(),mainLoaded:true,petLoaded:true,homeReady:main.homeReady,directionReady:main.directionReady,mainBridgeReady:true,petBridgeReady:true,apiReady:true,rendererErrors:rendererErrors.length,alwaysOnTop:petWindow.isAlwaysOnTop(),nodeIntegration:false,contextIsolation:true,sandbox:true};
   const out=smokeOutput?path.resolve(smokeOutput):path.join(profile,'result.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2));console.log('Desktop smoke passed: bundled UI, pet, assets, API and sandbox loaded.');exit();
  }else showMain();
 }).catch(()=>{console.error('Desktop startup failed.');process.exitCode=1;exit();});
}
app.on('before-quit',()=>{quitting=true;});app.on('will-quit',()=>{if(server?.listening)server.close();tray?.destroy();});app.on('window-all-closed',()=>app.quit());
