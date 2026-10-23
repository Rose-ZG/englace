'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'ios/Englace/Web');fs.mkdirSync(out,{recursive:true});
for(const file of require('../desktop/resources.cjs').publicFiles){if(file.startsWith('download')||file.startsWith('desktop-pet'))continue;fs.copyFileSync(path.join(root,file),path.join(out,file));}
for(const dir of ['data','audio','assets']){fs.mkdirSync(path.join(out,dir),{recursive:true});for(const name of fs.readdirSync(path.join(root,dir)))if(/\.(json|txt|wav|svg|png)$/.test(name))fs.copyFileSync(path.join(root,dir,name),path.join(out,dir,name));}
fs.copyFileSync(path.join(root,'LICENSE'),path.join(out,'LICENSE'));
for(const file of ['mobile.css','mobile.js'])fs.copyFileSync(path.join(root,file),path.join(out,file));
let html=fs.readFileSync(path.join(out,'index.html'),'utf8');html=html.replace('initial-scale=1','initial-scale=1,viewport-fit=cover').replace('</head>','<link rel="stylesheet" href="mobile.css"></head>').replace('</body>','<script src="mobile.js"></script></body>');fs.writeFileSync(path.join(out,'index.html'),html);console.log('Prepared offline iOS assets: '+out);
