'use strict';
// The atlas combines morphology and curated semantic domains; layouts never change edge meaning.
let atlasLayout='mind',atlasCategory='families',atlasSearch='',spellRevealed=false;
const extraFamilies=[
 ['employ','雇用','employment|就业|名词','employer|雇主|名词','employee|雇员|名词','unemployment|失业|否定派生'],
 ['manage','管理；设法完成','management|管理|名词','manager|经理|名词','manageable|可处理的|形容词'],
 ['organize','组织','organization|组织|名词','organizer|组织者|名词','organized|有条理的|形容词','reorganize|重新组织|动词'],
 ['communicate','交流','communication|交流|名词','communicative|健谈的；交际的|形容词','communicator|交流者|名词'],
 ['consider','考虑','consideration|考虑|名词','considerate|体贴的|形容词','considerable|相当大的|词义辨析','reconsider|重新考虑|动词'],
 ['respond','回应','response|回应|名词','responsive|反应迅速的|形容词','respondent|受访者|名词'],
 ['analyze','分析','analysis|分析|名词','analytical|分析的|形容词','analyst|分析师|名词'],
 ['explain','解释','explanation|解释|名词','explanatory|解释性的|形容词','unexplained|未解释的|否定派生'],
 ['perform','表演；执行','performance|表演；表现|名词','performer|表演者|名词','performing|表演的|形容词'],
 ['express','表达','expression|表达|名词','expressive|富于表现力的|形容词','expressively|富于表情地|副词'],
 ['describe','描述','description|描述|名词','descriptive|描述性的|形容词','undescribed|尚未描述的|否定派生'],
 ['attract','吸引','attraction|吸引力；景点|名词','attractive|有吸引力的|形容词','attractively|迷人地|副词'],
 ['improve','改善','improvement|改善|名词','improved|改良的|形容词','unimproved|未改善的|否定派生'],
 ['invent','发明','invention|发明|名词','inventor|发明家|名词','inventive|善于发明的|形容词'],
 ['invest','投资','investment|投资|名词','investor|投资者|名词','reinvest|再投资|动词'],
 ['explore','探索','exploration|探索|名词','explorer|探险家|名词','exploratory|探索性的|形容词'],
 ['adapt','适应；改编','adaptation|适应；改编|名词','adaptable|适应性强的|形容词','adaptive|适应的|形容词'],
 ['relate','联系；叙述','relation|关系|名词','relationship|关系|名词','related|有关的|形容词','unrelated|无关的|否定派生'],
 ['observe','观察','observation|观察|名词','observer|观察者|名词','observable|可观察的|形容词'],
 ['achieve','实现','achievement|成就|名词','achievable|可实现的|形容词','achiever|成功者|名词'],
 ['believe','相信','belief|信念|名词','believable|可信的|形容词','unbelievable|难以置信的|否定派生'],
 ['comfort','安慰；舒适','comfortable|舒适的|形容词','comfortably|舒适地|副词','uncomfortable|不舒适的|否定派生'],
 ['responsible','负责任的','responsibility|责任|名词','responsibly|负责任地|副词','irresponsible|不负责任的|否定派生'],
 ['equal','相等的','equality|平等|名词','equally|同样地|副词','unequal|不相等的|否定派生']
];
for(const [word,meaning,...items] of extraFamilies)V.families.push({word,meaning,nodes:items.map(s=>{const[word,meaning,type]=s.split('|');return{word,meaning,type};})});
const atlasTopics=[
 ['education','教育','curriculum|课程','assessment|评估','literacy|读写能力','scholarship|奖学金','tuition|学费','qualification|资格'],
 ['environment','环境','biodiversity|生物多样性','conservation|保护','emission|排放','renewable|可再生的','ecosystem|生态系统','sustainability|可持续性'],
 ['technology','科技','innovation|创新','automation|自动化','algorithm|算法','privacy|隐私','digital|数字的','device|设备'],
 ['economy','经济','inflation|通货膨胀','investment|投资','consumption|消费','revenue|收入','enterprise|企业','employment|就业'],
 ['health','健康','nutrition|营养','prevention|预防','diagnosis|诊断','recovery|康复','wellbeing|身心健康','symptom|症状'],
 ['society','社会','community|社区','diversity|多样性','equality|平等','welfare|福利','migration|迁移','identity|身份认同'],
 ['research','研究','hypothesis|假设','evidence|证据','methodology|研究方法','variable|变量','analysis|分析','conclusion|结论'],
 ['travel','旅行','itinerary|行程','accommodation|住宿','destination|目的地','departure|出发','reservation|预订','landmark|地标'],
 ['emotion','情感','gratitude|感激','anxiety|焦虑','enthusiasm|热情','empathy|共情','confidence|信心','resilience|韧性'],
 ['argument','论证','claim|论点','reason|理由','example|例子','counterargument|反方论点','rebuttal|反驳','conclusion|结论'],
 ['literature','文学','narrative|叙事','metaphor|隐喻','character|人物','setting|背景','theme|主题','imagery|意象'],
 ['workplace','职场','collaboration|协作','leadership|领导力','deadline|截止日期','negotiation|协商','productivity|生产效率','promotion|晋升']
].map(([word,meaning,...items])=>({word,meaning,nodes:items.map(s=>{const[word,meaning]=s.split('|');return{word,meaning,type:'主题关联'};})}));
const atlasLayouts=[['mind','思维导图'],['tree','树状'],['chain','链表'],['radial','星环关系网']];
vocabModes.splice(1,3,['atlas','词汇宇宙']);
const oldVocabBody=vocabBody;vocabBody=function(){if(vocabMode==='atlas')return graphPage();return oldVocabBody().replace('data-vmode="tree"','data-vmode="atlas"').replace('三种视角，串联记忆','进入你的词汇宇宙').replace('两款高难度原创小游戏','四款原创渐进式小游戏');};
function atlasList(){return atlasCategory==='topics'?atlasTopics:V.families;}
function atlasData(){if(atlasCategory==='topics'){const f=atlasTopics[familyIndex%atlasTopics.length];return{nodes:[{word:f.word,meaning:f.meaning,type:'中心主题'},...f.nodes],edges:f.nodes.map((_,i)=>({a:0,b:i+1,label:'主题关联'}))};}return V.graph(familyIndex,'network');}
function atlasPositions(g){const count=g.nodes.length;if(atlasLayout==='chain')return g.nodes.map((_,i)=>({x:120+i%4*220,y:110+Math.floor(i/4)*145}));if(atlasLayout==='tree')return g.nodes.map((_,i)=>!i?{x:450,y:65}:{x:110+(i-1)%4*225,y:210+Math.floor((i-1)/4)*160});if(atlasLayout==='mind')return g.nodes.map((_,i)=>{if(!i)return{x:450,y:260};const left=i%2===0,rank=Math.floor((i-1)/2),total=Math.ceil((count-1)/2);return{x:left?135:765,y:70+rank*(380/Math.max(1,total-1))};});return g.nodes.map((_,i)=>!i?{x:450,y:260}:{x:450+Math.cos((i-1)*Math.PI*2/(count-1)-Math.PI/2)*305,y:260+Math.sin((i-1)*Math.PI*2/(count-1)-Math.PI/2)*200});}
graphPage=function(){const g=atlasData(),pts=atlasPositions(g),list=atlasList(),wordSet=new Set(allWords().map(w=>w.word.toLowerCase())),total=V.families.reduce((n,f)=>n+f.nodes.length+1,0)+atlasTopics.reduce((n,f)=>n+f.nodes.length+1,0);return `<section class="atlas-banner"><div class="atlas-orbits" aria-hidden="true"><i></i><i></i><i></i><b>e·</b></div><span class="vocab-badge">THE WORD UNIVERSE / 词汇宇宙</span><h2>每一个词，<br>都与更大的世界相连。</h2><p>把孤立的记忆，变成可以探索的星图。</p><div class="atlas-stats"><span><b>${V.families.length}</b> 精选词族</span><span><b>${atlasTopics.length}</b> 主题星群</span><span><b>${total}</b> 节点词条</span></div></section><div class="atlas-console"><div class="vocab-toolbar"><label>关系内容 <select id="atlas-category"><option value="families" ${atlasCategory==='families'?'selected':''}>派生与词族</option><option value="topics" ${atlasCategory==='topics'?'selected':''}>考试与生活主题</option></select></label><label>展示形式 <select id="atlas-layout">${atlasLayouts.map(([id,name])=>`<option value="${id}" ${atlasLayout===id?'selected':''}>${name}</option>`).join('')}</select></label><label>查找词群 <input id="atlas-search" value="${esc(atlasSearch)}" placeholder="英文或中文" autocomplete="off"></label></div><div class="atlas-clusters">${list.map((f,i)=>({f,i})).filter(({f})=>(f.word+f.meaning+f.nodes.map(n=>n.word+n.meaning).join('')).toLowerCase().includes(atlasSearch.toLowerCase())).map(({f,i})=>`<button class="${i===familyIndex?'selected':''}" data-atlas-family="${i}"><strong>${esc(f.word)}</strong><small>${esc(f.meaning)}</small></button>`).join('')||'<p>没有匹配词群，试试其他关键词。</p>'}</div><div class="atlas-map"><svg viewBox="0 0 900 520" role="group" aria-label="${esc(atlasLayouts.find(x=>x[0]===atlasLayout)[1])}词汇关系图"><defs><radialGradient id="atlas-glow"><stop stop-color="#a6ebc0" stop-opacity=".2"/><stop offset="1" stop-color="#a6ebc0" stop-opacity="0"/></radialGradient></defs><circle cx="450" cy="260" r="245" fill="url(#atlas-glow)"/>${g.edges.map(e=>{const a=pts[e.a],b=pts[e.b];return `<path class="atlas-edge" d="M${a.x} ${a.y} C${(a.x+b.x)/2} ${a.y} ${(a.x+b.x)/2} ${b.y} ${b.x} ${b.y}"/><text class="atlas-edge-label" x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2-8}" text-anchor="middle">${esc(e.label)}</text>`;}).join('')}${atlasLayout==='chain'?pts.slice(1).map((b,i)=>`<path class="atlas-chain" d="M${pts[i].x} ${pts[i].y+32}L${b.x} ${b.y+32}"/>`).join(''):''}${g.nodes.map((n,i)=>`<g role="button" tabindex="0" data-vnode="${i}" aria-label="${esc(n.word+'，'+n.meaning)}" class="atlas-node ${i===0?'atlas-center':''} ${i===selectedNode?'selected':''}" transform="translate(${pts[i].x-90} ${pts[i].y-30})"><rect width="180" height="60" rx="19"/><text x="90" y="25" text-anchor="middle" font-size="${n.word.length>14?12:16}">${esc(n.word)}</text><text class="atlas-node-sub" x="90" y="45" text-anchor="middle">${wordSet.has(n.word)?'本区':'拓展'} · ${esc(n.type)}</text></g>`).join('')}</svg></div><div id="vocab-node-detail" class="vocab-node-detail">${nodeDetail(g.nodes[Math.min(selectedNode,g.nodes.length-1)])}</div><p class="vocab-muted">实线表示标注的词义关系；链表的虚线仅表示浏览顺序。内容为教学编排，非完整词源或自动语义推理。拓展词不自动计入本区掌握率。</p></div>`;};
const originalFreshSpelling=freshSpelling;freshSpelling=function(){spellRevealed=false;originalFreshSpelling();};
spellingPage=function(){if(!spellWords.length)freshSpelling();const w=spellWords[spellIndex];if(!w)return `<section class="panel vocab-spelling"><h2>这一组，已经记得更牢。</h2><p>完成 ${spellWords.length} 个单词的主动提取</p><button class="primary" data-vspell-new>再练一组</button></section>`;return `<section class="panel vocab-spelling"><span class="vocab-badge">ACTIVE RECALL / ${spellIndex+1} OF ${spellWords.length}</span><h2>${esc(brief(w))}</h2><p class="vocab-muted">写出对应英文 · ${w.word.length} 个字符</p>${spellRevealed?`<div class="spell-solution"><small>正确单词</small><h3>${esc(w.word)}</h3><p>${esc(w.phonetic||'')}</p><p>${esc(w.meaning)}</p>${w.example?`<blockquote>${esc(w.example)}</blockquote>`:''}<p class="vocab-muted">已加入复习。看完后遮住答案，再独立拼写一次。</p><button class="primary" data-spell-hide>遮住答案，重新回忆</button></div>`:`<form id="vocab-spell-form"><input class="vocab-answer" name="answer" aria-label="英文拼写" autocomplete="off" autocapitalize="off" spellcheck="false" required ${spellDone?'disabled':''}><br>${spellDone?'<button type="button" class="primary" data-vspell-next>下一个 ↗</button>':'<button class="primary">检查拼写</button> <button type="button" class="secondary" data-spell-show>查看正确单词</button> <button type="button" class="secondary" data-vhint>提示</button>'}</form><p id="vocab-result" class="vocab-result" aria-live="polite">${spellDone?`正确 · ${esc(w.word)}`:''}</p>`}</section>`;};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if('spellShow'in b.dataset){spellRevealed=true;E.rateWord(progress(),spellWords[spellIndex].id,false);save();vocabRefresh();}if('spellHide'in b.dataset){spellRevealed=false;vocabRefresh();$('#vocab-spell-form input')?.focus();}if(b.dataset.atlasFamily!==undefined){familyIndex=Number(b.dataset.atlasFamily);selectedNode=0;vocabRefresh();chirp();}});
document.addEventListener('change',e=>{if(e.target.id==='atlas-layout'){atlasLayout=e.target.value;vocabRefresh();}if(e.target.id==='atlas-category'){atlasCategory=e.target.value;familyIndex=0;selectedNode=0;atlasSearch='';vocabRefresh();}});
document.addEventListener('input',e=>{if(e.target.id==='atlas-search'){atlasSearch=e.target.value;const start=e.target.selectionStart;vocabRefresh();const input=$('#atlas-search');input.focus();input.setSelectionRange(start,start);}});
render();
