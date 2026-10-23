"""Extract one opening couplet per sonnet, with exact source identifiers."""
from pathlib import Path
import re, json, hashlib
text=Path('.cache/sonnets.txt').read_text(encoding='utf-8-sig')
text=text.split('*** START OF THE PROJECT GUTENBERG EBOOK')[1]
text=text.split('*** END OF THE PROJECT GUTENBERG EBOOK')[0]
parts=re.split(r'\n\s*([IVXLCDM]+)\s*\n',text)
quotes=[]
sonnet_count=0
for i in range(1,len(parts)-1,2):
    roman=parts[i]
    lines=[line.strip() for line in parts[i+1].splitlines() if line.strip()]
    if len(lines)<2: continue
    sonnet_count+=1
    for line in range(0,len(lines)-1,2):
        quotes.append({'id':'sonnet-'+roman.lower()+('' if line==0 else '-line'+str(line+1)),'text':' '.join(lines[line:line+2]),'author':'William Shakespeare','work':"Sonnets · Sonnet "+roman+' · lines '+str(line+1)+'–'+str(line+2),'source':'https://www.gutenberg.org/ebooks/1041','scene':['dawn','forest','ocean','night','garden','library'][len(quotes)%6],'note':'公版英文原文 · 原创意境配图，非原作剧照','translation':''})
assert sonnet_count==154,sonnet_count
plays=[('hamlet','Hamlet','1524',[
('To be, or not to be, that is the question.','生存还是毁灭，这是个问题。'),
('Brevity is the soul of wit.','简洁是智慧的灵魂。'),
('This above all: to thine own self be true.','最重要的是，忠于你自己。'),
('The rest is silence.','剩下的，便是沉默。'),
('There is nothing either good or bad, but thinking makes it so.','事物本无好坏，思想赋予它们意义。'),
('The lady doth protest too much, methinks.','我想，那位女士的表白未免太多了。')]),
('romeo','Romeo and Juliet','1513',[
('Parting is such sweet sorrow.','离别是这样甜蜜的忧伤。'),
('My bounty is as boundless as the sea, my love as deep.','我的慷慨如海无边，我的爱也同样深沉。'),
('Wisely and slow; they stumble that run fast.','明智而缓行，疾奔的人容易跌倒。'),
('A pair of star-crossed lovers take their life.','一对命途多舛的恋人，结束了自己的生命。')])]
for filename,work,book,excerpts in plays:
    raw=Path('.cache/'+filename+'.txt').read_text(encoding='utf-8-sig')
    normalize=lambda s: re.sub(r'[^a-z]+',' ',s.lower()).strip()
    for quote,translation in excerpts:
        if normalize(quote) not in normalize(raw): continue
        quotes.append({'id':filename+'-'+str(len(quotes)),'text':quote,'translation':translation,'author':'William Shakespeare','work':work,'source':'https://www.gutenberg.org/ebooks/'+book,'scene':['dawn','forest','ocean','night','garden','library'][len(quotes)%6],'note':'公版原作台词 · 中文为本项目学习意译 · 意境插画非剧照'})
overlay=json.loads(Path('data/quote-bilingual.json').read_text(encoding='utf-8'))
for entry in quotes:
    if entry['id'] in overlay['translations']:
        entry['translation']=overlay['translations'][entry['id']]
        entry['translationNote']='项目原创中文意译，辅助理解，非出版译本'
quotes.extend(overlay['additional'])
Path('data/quotes.json').write_text(json.dumps(quotes,ensure_ascii=False,indent=2),encoding='utf-8')
Path('data/quotes-manifest.json').write_text(json.dumps({'built':'2026-10-19','count':len(quotes),'bilingualCount':len([q for q in quotes if q.get('translation','').strip()]),'sonnets':sonnet_count,'dramaticExcerpts':len([q for q in quotes if not q['id'].startswith('sonnet-')]),'art':'Original project SVG illustrations, not film stills','sources':{name:hashlib.sha256(Path('.cache/'+name+'.txt').read_bytes()).hexdigest() for name in ['sonnets','hamlet','romeo']}},indent=2),encoding='utf-8')
print(str(len(quotes))+' attributed public-domain excerpts generated (154 sonnets in line-pairs plus verified dramatic lines).')
