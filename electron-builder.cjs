'use strict';
const fs=require('node:fs'),path=require('node:path');
const localRuntime=path.join(__dirname,'.cache','electron-runtime');
const {packagedFiles}=require('./desktop/resources.cjs');
module.exports={
 appId:'com.rosezg.englace',productName:'英格雷斯',executableName:'Englace',electronVersion:'44.9.0',
 directories:{output:'release',buildResources:'build'},asar:true,compression:'normal',npmRebuild:false,toolsets:{nsis:'1.2.1'},
 files:packagedFiles,
 ...(fs.existsSync(path.join(localRuntime,'electron.exe'))?{electronDist:localRuntime}:{}),
 win:{icon:'build/icon.ico',target:[{target:'nsis',arch:['x64']},{target:'portable',arch:['x64']}]},
 nsis:{artifactName:'Englace-${version}-${arch}-setup.exe',oneClick:true,perMachine:false,allowElevation:false,createDesktopShortcut:true,createStartMenuShortcut:true,shortcutName:'英格雷斯',deleteAppDataOnUninstall:false,runAfterFinish:true,installerLanguages:['zh_CN','en_US'],displayLanguageSelector:false,packElevateHelper:false},
 portable:{artifactName:'Englace-${version}-${arch}-portable.exe',requestExecutionLevel:'user'},
 publish:null
};
