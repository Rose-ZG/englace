(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EnglaceAccount=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const legacyQuestions=['你给未来自己的第一句暗语是什么？','你为一个难忘地点起的秘密别名是什么？','你专属的第三个纪念暗号是什么？'];
 const questions=['如果把一段温暖的记忆画成一幅画，你会给它取什么名字？','哪句话曾在你低落时给你力量？请写下你记住的版本。','如果给最想实现的心愿起一个只有你懂的名字，它叫什么？'];
 function questionsFor(mode,version='memorable'){return mode==='recover'&&version==='legacy'?legacyQuestions:questions;}
 function id(value){const s=String(value||'').trim().toLowerCase();if(!/^[a-z][a-z0-9_]{3,23}$/.test(s))throw Error('ID 需为 4–24 位字母、数字或下划线，且以字母开头');return s;}
 function password(value){if(typeof value!=='string'||value.length<10||value.length>128||!/[A-Za-z]/.test(value)||!/[0-9]/.test(value))throw Error('密码需为 10–128 位，包含字母和数字');return value;}
 function answers(values){if(!Array.isArray(values)||values.length!==3)throw Error('请回答三道密保问题');const a=values.map(x=>String(x).normalize('NFKC').trim().toLowerCase());if(a.some(x=>x.length<8||x.length>128)||new Set(a).size!==3)throw Error('请设置三个不同的密保答案，每个 8–128 字符；建议使用不易猜测的暗语');return a;}
 return{questions,legacyQuestions,questionsFor,id,password,answers};
});
