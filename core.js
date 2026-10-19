(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Englace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TRACKS = [
    {id:'gaokao',name:'高考英语',short:'高考',en:'NATIONAL EXAM',level:'A2 → B1',icon:'↗',daily:15,plan:'生活情境与基础语篇 · 先抓人物、时间、地点',types:['短对话','长对话','独白'],note:'参考常见高考听力结构；各省题型、次数与安排可能不同。'},
    {id:'cet4',name:'大学英语四级',short:'四级',en:'CET-4',level:'B1 → B2',icon:'▥',daily:20,plan:'校园生活与社会话题 · 先听主旨，再定位细节',types:['短篇新闻','长对话','听力篇章'],note:'参考 CET-4：短篇新闻 7 题、长对话 8 题、听力篇章 10 题。'},
    {id:'cet6',name:'大学英语六级',short:'六级',en:'CET-6',level:'B2 → C1',icon:'◈',daily:20,plan:'观点与学术表达 · 关注态度、因果与论证',types:['长对话','听力篇章','讲座 / 讲话'],note:'参考 CET-6：长对话 8 题、听力篇章 7 题、讲座 / 讲话 10 题。'},
    {id:'ielts',name:'雅思',short:'雅思',en:'IELTS',level:'B1 → C1',icon:'◎',daily:20,plan:'生活服务与学术讨论 · 同义替换、信息定位',types:['Part 1 · 表格填空','Part 2 · 匹配','Part 3 · 多项选择','Part 4 · 笔记填空'],note:'参考 IELTS 四部分结构；本地练习支持重听，不是正式 40 题模考。'},
    {id:'toefl',name:'托福',short:'托福',en:'TOEFL · 2026',level:'B2 → C1',icon:'◉',daily:20,plan:'校园沟通与学术理解 · 目的、推断和恰当回应',types:['Listen and Choose a Response','Conversation','Announcement','Academic Talk'],note:'参考 2026 TOEFL iBT 四类听力任务；非官方题，不模拟自适应计分。'},
    {id:'postgrad',name:'考研英语',short:'考研',en:'POSTGRADUATE',level:'B2 → C1',icon:'◇',daily:20,plan:'初试词汇 + 复试听说 · 训练学术表达与研究动机',types:['复试 · 研究经历','复试 · 学术理解'],note:'考研统考英语初试不含听力。听力训练面向院校复试，由院校自行组织。'}
  ];
  const emptyProgress=()=>({known:[],review:{},answers:0,correct:0,listeningAnswers:0,listeningCorrect:0,listening:{},seconds:0,days:[],daily:{}});
  const fresh=()=>({version:2,track:'cet4',theme:'light',sound:true,agent:{name:'Echo',tone:'温柔鼓励',goal:'每天 20 分钟，稳步提高英语。'},progress:Object.fromEntries(TRACKS.map(t=>[t.id,emptyProgress()])),libraries:[]});
  const ids=new Set(TRACKS.map(t=>t.id));
  function validateState(s){
    if(!s||s.version!==2||!ids.has(s.track)||!['light','dark'].includes(s.theme)||typeof s.sound!=='boolean')throw Error('备份版本或设置无效');
    if(!s.agent||!['name','tone','goal'].every(k=>typeof s.agent[k]==='string'&&s.agent[k].length<=2000))throw Error('伙伴设置无效');
    if(!s.progress||!Array.isArray(s.libraries)||s.libraries.length>100)throw Error('学习数据无效');
    for(const t of TRACKS){const p=s.progress[t.id];if(!p||!Array.isArray(p.known)||!p.known.every(x=>typeof x==='string')||!Array.isArray(p.days)||!p.days.every(x=>typeof x==='string')||!p.review||typeof p.review!=='object'||Array.isArray(p.review)||!p.daily||typeof p.daily!=='object'||!p.listening||typeof p.listening!=='object')throw Error('进度格式无效');
      for(const k of ['seconds','answers','correct','listeningAnswers','listeningCorrect'])if(!Number.isFinite(p[k])||p[k]<0)throw Error('统计无效');
      if(p.correct>p.answers||p.listeningCorrect>p.listeningAnswers)throw Error('统计不一致');
      if(!Object.values(p.review).every(r=>r&&Number.isFinite(r.due)&&Number.isFinite(r.interval)&&r.interval>=0))throw Error('复习记录无效');
      if(!Object.values(p.daily).every(d=>d&&['words','quiz','listening'].every(k=>Number.isFinite(d[k])&&d[k]>=0)))throw Error('每日记录无效');
      if(!Object.values(p.listening).every(v=>v&&Array.isArray(v.results)&&v.results.every(x=>typeof x==='boolean')&&typeof v.at==='string'))throw Error('听力记录无效');
    }
    for(const lib of s.libraries){if(!lib||!ids.has(lib.track)||typeof lib.id!=='string'||typeof lib.name!=='string'||typeof lib.source!=='string'||!Array.isArray(lib.words)||lib.words.length>20000)throw Error('词库格式无效');lib.words=normalizeWords(lib.words);}
    return s;
  }
  const legacyWords=['approach','essential','perspective','significant','maintain','evidence','contribute','adapt','opportunity','reflect','challenge','achieve'];
  function migrate(old){const s=fresh();if(!old||typeof old!=='object')return s;const map=['gaokao','cet4','ielts','toefl','postgrad'];s.track=map[old.track]||'cet4';s.theme=old.theme==='dark'?'dark':'light';if(old.agent&&['name','tone','goal'].every(k=>typeof old.agent[k]==='string'))s.agent=old.agent;const p=s.progress[s.track];p.known=(old.known||[]).map(i=>legacyWords[i]).filter(Boolean);for(const i of old.review||[])if(legacyWords[i])p.review[legacyWords[i]]={due:0,interval:0};p.seconds=Math.max(0,Number(old.minutes)||0)*60;p.answers=Math.max(0,Number(old.answers)||0);p.correct=Math.min(p.answers,Math.max(0,Number(old.correct)||0));p.days=Array.isArray(old.days)?old.days.filter(x=>typeof x==='string'):[];return s;}
  function rateWord(p,id,known,now=Date.now()){
    p.known=p.known.filter(x=>x!==id);const previous=Object.hasOwn(p.review,id)?p.review[id]:null;
    let next;
    if(known){p.known.push(id);const interval=previous?Math.min(30,Math.max(1,previous.interval*2)):1;next={due:now+interval*86400000,interval};}
    else next={due:now+10*60000,interval:0};
    Object.defineProperty(p.review,id,{value:next,writable:true,enumerable:true,configurable:true});
  }
  function dueWords(p,words,now=Date.now()){return words.filter(w=>Object.hasOwn(p.review,w.id)&&p.review[w.id].due<=now);}
  function normalizeWords(rows){if(!Array.isArray(rows))throw Error('词库应为数组');const seen=new Set(),result=[];for(const r of rows){if(!r||typeof r.word!=='string')continue;const word=r.word.trim().toLowerCase(),meaning=String(r.meaning||r.translation||'').trim();if(!word||word.length>80||!meaning||seen.has(word))continue;seen.add(word);result.push({id:word,word,meaning:meaning.slice(0,6000),phonetic:String(r.phonetic||'').slice(0,200),definition:String(r.definition||'').slice(0,6000),example:String(r.example||'').slice(0,1500),translation:String(r.exampleTranslation||'').slice(0,1500),source:String(r.source||'本地导入').slice(0,200),frequency:Number(r.frequency)||999999});}return result;}
  function parseDelimited(text){const first=text.split(/\r?\n/)[0];const sep=first.includes('\t')?'\t':',';const rows=[];let row=[],value='',quoted=false;text=text.replace(/^\uFEFF/,'');for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(!quoted&&(c===sep||c==='\n'||c==='\r')){row.push(value);value='';if(c!==sep){if(row.some(Boolean))rows.push(row);row=[];if(c==='\r'&&text[i+1]==='\n')i++;}}else value+=c;}if(quoted)throw Error('CSV 引号未闭合');row.push(value);if(row.some(Boolean))rows.push(row);return rows;}
  function parseLibrary(text,filename){if(text.length>20000000)throw Error('词库文件请小于 20 MB');if(filename.toLowerCase().endsWith('.json')){const json=JSON.parse(text);return normalizeWords(Array.isArray(json)?json:json.words);}const rows=parseDelimited(text);if(!rows.length)throw Error('词库为空');const header=rows[0].map(s=>s.trim().toLowerCase());const hasHeader=header.includes('word')||header.includes('单词');const aliases={word:['word','单词'],meaning:['meaning','translation','释义','中文'],phonetic:['phonetic','音标'],definition:['definition'],example:['example','例句'],exampleTranslation:['exampletranslation','例句翻译']};const data=(hasHeader?rows.slice(1):rows).map(r=>{if(!hasHeader)return {word:r[0],meaning:r[1],phonetic:r[2],example:r[3]};return Object.fromEntries(Object.entries(aliases).map(([k,names])=>[k,r[header.findIndex(h=>names.includes(h))]||'']));});return normalizeWords(data);}
  function normalizeAnswer(t){return String(t).normalize('NFKC').trim().toLowerCase().replace(/[.,!?;:]+$/,'').replace(/\s+/g,' ');}
  function checkAnswer(question,answer){if(question.kind==='multi'){const a=[...new Set(answer||[])].sort(),b=[...question.answer].sort();return a.length===b.length&&a.every((v,i)=>v===b[i]);}if(question.kind==='choice'||question.kind==='match')return Number(answer)===question.answer;const s=normalizeAnswer(answer);if(question.maxWords&&s.split(' ').length>question.maxWords)return false;return question.answer.some(a=>normalizeAnswer(a)===s);}
  function parseSrt(text){const blocks=text.replace(/^\uFEFF/,'').replace(/\r/g,'').trim().split(/\n\s*\n/);const cues=[];function seconds(t){const v=t.replace(',','.').split(':').map(Number);return v[0]*3600+v[1]*60+v[2];}for(const block of blocks){const lines=block.split('\n'),idx=lines.findIndex(l=>l.includes('-->'));if(idx<0)continue;const match=lines[idx].match(/(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/);if(!match)continue;const start=seconds(match[1]),end=seconds(match[2]);const content=lines.slice(idx+1).join(' ').replace(/<[^>]*>/g,'').trim();if(end>start&&content)cues.push({start,end,text:content});}return cues.sort((a,b)=>a.start-b.start);}
  return {TRACKS,emptyProgress,fresh,validateState,migrate,rateWord,dueWords,normalizeWords,parseLibrary,parseDelimited,normalizeAnswer,checkAnswer,parseSrt};
});
