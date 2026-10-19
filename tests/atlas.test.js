const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('expanded atlas has 48 word families and 12 topics, with safe layouts and stable edge meanings',()=>{
 const V=require('../vocab-core.js');const context=vm.createContext({V,vocabModes:[],vocabBody:()=>'',freshSpelling:()=>{},spellingPage:()=>'',graphPage:()=>'',document:{addEventListener(){}},render(){},familyIndex:0,selectedNode:0});
 vm.runInContext(fs.readFileSync('atlas.js','utf8'),context);
 assert.equal(V.families.length,48);assert.equal(vm.runInContext('atlasTopics.length',context),12);
 for(const category of ['families','topics']){const length=category==='families'?48:12;for(let i=0;i<length;i++){
  vm.runInContext(`atlasCategory='${category}';familyIndex=${i}`,context);const data=vm.runInContext('atlasData()',context);assert.equal(new Set(data.nodes.map(n=>n.word)).size,data.nodes.length);assert.ok(data.nodes.every(n=>n.word&&n.meaning&&n.type));assert.ok(data.edges.every(e=>data.nodes[e.a]&&data.nodes[e.b]&&e.label));
  for(const layout of ['tree','chain','mind','radial']){vm.runInContext(`atlasLayout='${layout}'`,context);const positions=vm.runInContext('atlasPositions(atlasData())',context);assert.equal(positions.length,data.nodes.length);assert.ok(positions.every(p=>p.x>=90&&p.x<=810&&p.y>=30&&p.y<=490),category+':'+i+':'+layout);assert.equal(JSON.stringify(vm.runInContext('atlasData().edges',context)),JSON.stringify(data.edges));}
 }}
});
