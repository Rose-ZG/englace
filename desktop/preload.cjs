const {contextBridge,ipcRenderer}=require('electron');
const origin=process.argv.find(a=>a.startsWith('--englace-origin='))?.slice('--englace-origin='.length);
if(process.isMainFrame&&window.location.origin===origin){contextBridge.exposeInMainWorld('EnglaceDesktop',{togglePet:()=>ipcRenderer.invoke('englace:toggle-pet'),setPetVisible:value=>ipcRenderer.invoke('englace:set-pet',value===true),showMain:()=>ipcRenderer.invoke('englace:show-main'),quit:()=>ipcRenderer.invoke('englace:quit')});window.addEventListener('DOMContentLoaded',()=>ipcRenderer.send('englace:ready'));}
