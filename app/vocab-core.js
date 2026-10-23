(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.VocabLab=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  // Explicit teaching relationships, never inferred from matching letter prefixes.
  const families=[
    ['act','行动','action|行动；行为|名词','active|积极的；活跃的|形容词','actively|积极地|副词','activity|活动|名词','actor|演员|名词','activate|激活|动词','inactive|不活跃的|反义派生'],
    ['create','创造','creation|创造；作品|名词','creative|有创造力的|形容词','creatively|创造性地|副词','creativity|创造力|名词','creator|创造者|名词'],
    ['educate','教育','education|教育|名词','educational|教育的|形容词','educator|教育工作者|名词','educated|受过教育的|形容词'],
    ['inform','告知','information|信息|名词','informative|提供有用信息的|形容词','informed|知情的|形容词','misinform|误报；误导|否定派生'],
    ['develop','发展；开发','development|发展|名词','developer|开发者|名词','developing|发展中的|形容词','developed|发达的|形容词'],
    ['produce','生产','production|生产|名词','producer|生产者|名词','productive|多产的；富有成效的|形容词','productivity|生产率|名词','product|产品|名词'],
    ['care','关心；照顾','careful|小心的|形容词','carefully|小心地|副词','careless|粗心的|反义派生','carelessly|粗心地|副词','carelessness|粗心|名词'],
    ['help','帮助','helpful|有帮助的|形容词','helpless|无助的|否定派生','helper|帮手|名词','helpfully|有帮助地|副词'],
    ['use','使用','useful|有用的|形容词','useless|无用的|反义派生','usefully|有用地|副词','reuse|重复使用|动词','user|使用者|名词'],
    ['hope','希望','hopeful|抱有希望的|形容词','hopefully|怀有希望地|副词','hopeless|没有希望的|反义派生','hopelessness|绝望|名词'],
    ['happy','快乐的','happiness|幸福|名词','happily|快乐地|副词','unhappy|不快乐的|反义派生','unhappiness|不快乐|名词'],
    ['success','成功','succeed|成功|动词','successful|成功的|形容词','successfully|成功地|副词','unsuccessful|不成功的|反义派生'],
    ['decide','决定','decision|决定|名词','decisive|果断的；决定性的|形容词','decisively|果断地|副词','indecisive|优柔寡断的|反义派生'],
    ['connect','连接','connection|连接；联系|名词','connected|相连的|形容词','disconnect|断开|反义派生','reconnect|重新连接|动词'],
    ['compete','竞争','competition|竞争；比赛|名词','competitor|竞争者|名词','competitive|有竞争力的|形容词','competitiveness|竞争力|名词'],
    ['protect','保护','protection|保护|名词','protective|保护的|形容词','protector|保护者|名词','unprotected|未受保护的|否定派生'],
    ['imagine','想象','imagination|想象力|名词','imaginative|富有想象力的|形容词','imaginary|想象中的|形容词','unimaginable|难以想象的|否定派生'],
    ['differ','不同','difference|差别|名词','different|不同的|形容词','differently|不同地|副词','indifferent|漠不关心的|词义辨析'],
    ['study','学习；研究','studies|学习；研究（第三人称或复数）|词形变化','studied|学习（过去式、过去分词）|词形变化','studying|正在学习|词形变化','student|学生|关联词'],
    ['write','写','writes|写（第三人称单数）|词形变化','wrote|写（过去式）|词形变化','written|写（过去分词）|词形变化','writing|写作|名词','writer|作家|名词'],
    ['read','阅读','reader|读者|名词','reading|阅读|名词','readable|可读的；易读的|形容词','unread|未读的|否定派生'],
    ['agree','同意','agreement|协议；同意|名词','disagree|不同意|反义派生','disagreement|分歧|名词','agreeable|令人愉快的|词义辨析'],
    ['nation','国家；民族','national|国家的|形容词','nationality|国籍|名词','international|国际的|形容词','internationally|国际上|副词'],
    ['science','科学','scientist|科学家|名词','scientific|科学的|形容词','scientifically|科学地|副词','unscientific|不科学的|否定派生']
  ].map(([word,meaning,...items])=>({word,meaning,nodes:items.map(s=>{const[word,meaning,type]=s.split('|');return{word,meaning,type};})}));
  const topics=[['learn','学习','study','研究；学习','practice','练习','knowledge','知识'],['travel','旅行','journey','旅程','destination','目的地','transport','交通运输'],['environment','环境','pollution','污染','protect','保护','sustainable','可持续的'],['communicate','交流','express','表达','language','语言','understand','理解']].map(([word,meaning,...rest])=>({word,meaning,nodes:Array.from({length:rest.length/2},(_,i)=>({word:rest[i*2],meaning:rest[i*2+1],type:'主题关联'}))}));
  const contrasts={happy:['sad','悲伤的'],success:['failure','失败'],create:['destroy','摧毁'],connect:['separate','分开'],agree:['oppose','反对'],protect:['harm','伤害'],help:['assist','帮助'],develop:['grow','发展；成长'],use:['utilize','使用'],decide:['determine','决定']};
  function graph(index,mode){const f=families[index%families.length],nodes=[{word:f.word,meaning:f.meaning,type:'中心词'},...f.nodes],edges=f.nodes.map((n,i)=>({a:0,b:i+1,label:n.type}));if(mode!=='tree'){const c=contrasts[f.word];if(c){nodes.push({word:c[0],meaning:c[1],type:['help','develop','use','decide'].includes(f.word)?'近义关联':'反义关联'});edges.push({a:0,b:nodes.length-1,label:nodes.at(-1).type});}if(mode==='network'){const topic=topics.find(t=>t.nodes.some(n=>n.word===f.word));if(topic){nodes.push({word:topic.word,meaning:topic.meaning,type:'主题关联'});edges.push({a:0,b:nodes.length-1,label:'主题关联'});}for(let i=1;i<nodes.length-1;i++)if(nodes[i].type===nodes[i+1].type)edges.push({a:i,b:i+1,label:'同类词形'});}}return{nodes,edges};}
  function revivalWords(words,review={},now=Date.now(),limit=5){const valid=[...new Map(words.filter(w=>w&&w.id&&w.word&&w.meaning).map(w=>[w.id,w])).values()];return valid.sort((a,b)=>Number(!(Object.hasOwn(review,a.id)&&review[a.id].due<=now))-Number(!(Object.hasOwn(review,b.id)&&review[b.id].due<=now))).slice(0,limit);}
  function answer(lesson,input){if(!lesson||lesson.complete||!lesson.words[lesson.index])return false;const correct=String(input).trim().toLowerCase()===lesson.words[lesson.index].word.toLowerCase();if(correct){lesson.index++;lesson.complete=lesson.index===lesson.words.length;}return correct;}
  function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
  return{families,topics,graph,revivalWords,answer,overlap};
});
