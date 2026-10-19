'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function audit(file=path.resolve('release/win-unpacked/resources/app.asar')){
 const asar=require('@electron/asar'),list=asar.listPackage(file).map(n=>n.replaceAll('\\','/').replace(/^\//,''));
 for(const resource of require('../desktop/resources.cjs').publicFiles)assert.ok(list.includes(resource),'Missing public asset '+resource);
 for(const resource of ['desktop/main.cjs','desktop/preload.cjs','desktop/resources.cjs','server.js','ai-server.js','data/ECDICT-LICENSE.txt'])assert.ok(list.includes(resource),'Missing runtime file '+resource);
 for(const track of ['gaokao','cet4','cet6','ielts','toefl','postgrad'])assert.ok(list.includes('data/'+track+'.json'));
 assert.equal(list.filter(n=>/^audio\/.*\.wav$/.test(n)).length,19);
 assert.ok(!list.some(n=>/(^|\/)(\.cache|\.git|node_modules|tests|recordings|avatars-private)(\/|$)|\.env|\.backup\.json$/.test(n)),'Private/development files in app archive');
 const pkg=JSON.parse(asar.extractFile(file,'package.json').toString());assert.equal(pkg.main,'desktop/main.cjs');assert.equal(pkg.version,require('../package.json').version);
 console.log('Packaged archive audit passed: '+list.filter(n=>!fs.existsSync(n)||fs.statSync(n).isFile()).length+' entries checked, no private/development directories.');return{entries:list.length,version:pkg.version};
}
if(require.main===module){try{audit(process.argv[2]);}catch(error){console.error(error.message);process.exitCode=1;}}
module.exports={audit};
