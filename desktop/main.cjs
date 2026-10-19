'use strict';
const {app,BrowserWindow,ipcMain,screen,session,dialog,shell}=require('electron');
const http=require('node:http'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),BASE='http://127.0.0.1:4174';
const smoke=process.argv.includes('--smoke-test');let mainWindow,petWindow,server,quitting=false;const readyFrames=new Set();
app.setName('Englace');const profile=smoke?path.join(ROOT,'.cache','desktop-smoke'):path.join(app.getPath('appData'),'Englace');require('node:fs').mkdirSync(profile,{recursive:true});app.setPath('userData',profile);
if(!app.requestSingleInstanceLock()){app.quit();}else{
app.on('second-instance',()=>{mainWindow?.show();mainWindow?.focus();});
app.whenReady().then(async()=>{
  const {handler}=require('../server.js');server=http.createServer(handler);
  try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4174,'127.0.0.1',resolve);});}catch{dialog.showErrorBox('英格雷斯','桌面模式端口 4174 已占用，请关闭其他桌面实例后重试。');app.quit();return;}
  session.defaultSession.setPermissionRequestHandler(async(contents,permission,callback,details)=>{
    const own=contents===mainWindow?.webContents&&details.requestingUrl?.startsWith(BASE+'/');
    const audioOnly=Array.isArray(details.mediaTypes)&&details.mediaTypes.every(t=>t==='audio');
    if(!own||permission!=='media'||!audioOnly){callback(false);return;}
    const result=await dialog.showMessageBox(mainWindow,{type:'question',buttons:['不允许','允许本次录音'],defaultId:0,cancelId:0,title:'英格雷斯 · 麦克风',message:'是否允许本次口语练习使用麦克风？',detail:'录音保存在页面内存，不自动上传。'});callback(result.response===1);
  });
  const prefs={preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,additionalArguments:['--englace-origin='+BASE]};
  mainWindow=new BrowserWindow({width:1360,height:900,minWidth:720,minHeight:560,show:!smoke,backgroundColor:'#f7f8fa',title:'英格雷斯 · Englace',webPreferences:prefs});
  const bounds=screen.getPrimaryDisplay().workArea;
  petWindow=new BrowserWindow({width:280,height:410,x:bounds.x+bounds.width-300,y:bounds.y+bounds.height-440,transparent:true,frame:false,resizable:false,alwaysOnTop:true,skipTaskbar:true,show:!smoke,hasShadow:false,webPreferences:prefs});
  function protect(win){
    win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith(BASE+'/'))event.preventDefault();});
    win.webContents.setWindowOpenHandler(({url})=>{try{const u=new URL(url);const allowed=['github.com','www.gutenberg.org','www.oxfordlearnersdictionaries.com','www.ldoceonline.com','www.pep.com.cn','durian.blender.org','www.bilibili.com','ielts.org','www.ets.org','cet.neea.edu.cn'];if(u.protocol==='https:'&&allowed.includes(u.hostname))shell.openExternal(u.href);}catch{}return {action:'deny'};});
  }protect(mainWindow);protect(petWindow);
  function trusted(event){return [mainWindow?.webContents,petWindow?.webContents].includes(event.sender)&&event.senderFrame===event.sender.mainFrame&&event.senderFrame.url.startsWith(BASE+'/');}
  ipcMain.on('englace:ready',event=>{if(trusted(event))readyFrames.add(event.sender.id);});
  ipcMain.handle('englace:toggle-pet',event=>{if(!trusted(event))return false;if(petWindow.isVisible())petWindow.hide();else petWindow.showInactive();return true;});
  ipcMain.handle('englace:set-pet',(event,visible)=>{if(!trusted(event)||typeof visible!=='boolean')return false;if(visible)petWindow.showInactive();else petWindow.hide();return true;});
  ipcMain.handle('englace:show-main',event=>{if(!trusted(event))return;mainWindow.show();mainWindow.focus();});
  ipcMain.handle('englace:quit',event=>{if(trusted(event)){quitting=true;app.quit();}});
  mainWindow.on('close',event=>{if(!quitting&&!smoke&&petWindow?.isVisible()){event.preventDefault();mainWindow.hide();}});
  await Promise.all([mainWindow.loadURL(BASE+'/'),petWindow.loadURL(BASE+'/desktop-pet.html')]);
  if(smoke){if(!readyFrames.has(mainWindow.webContents.id)||!readyFrames.has(petWindow.webContents.id))throw Error('Desktop preload bridge did not initialise.');require('node:fs').writeFileSync(path.join(ROOT,'.cache','desktop-smoke-result.json'),JSON.stringify({mainLoaded:true,petLoaded:true,mainBridgeReady:true,petBridgeReady:true,alwaysOnTop:petWindow.isAlwaysOnTop(),nodeIntegration:petWindow.webContents.getLastWebPreferences().nodeIntegration,contextIsolation:petWindow.webContents.getLastWebPreferences().contextIsolation,sandbox:petWindow.webContents.getLastWebPreferences().sandbox},null,2));console.log('Desktop smoke: main window and always-on-top pet loaded with isolated sandboxed renderers.');quitting=true;app.quit();}
}).catch(()=>{console.error('Desktop startup failed.');quitting=true;app.quit();process.exitCode=1;});
}
app.on('before-quit',()=>{quitting=true;});app.on('will-quit',()=>{server?.close();});app.on('window-all-closed',()=>app.quit());
