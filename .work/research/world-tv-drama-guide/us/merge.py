import re,json,sys,collections
import os
base=os.path.dirname(os.path.abspath(__file__))+'/'
def norm(t):
    t=t.lower().replace('&','and'); t=re.sub(r'\(.*?\)','',t); t=re.sub(r'[^a-z0-9]+',' ',t).strip()
    t=re.sub(r'^the ','',t); return t
shows={}
def add(title,year,net,tags,zh=None,genre=None,origin=None):
    k=norm(title)
    if not k: return
    s=shows.setdefault(k,{'title':title.strip(),'year':None,'net':None,'zh':None,'genre':None,'origin':None,'tags':[]})
    for f,v in (('year',year),('net',net),('zh',zh),('genre',genre),('origin',origin)):
        if v and not s[f]: s[f]=v.strip()
    s['tags']+=tags
def rows(path,start,end):
    L=open(base+path,encoding='utf-8').read().split('\n')
    sec=L[start:end]
    hdr=None
    for l in sec:
        if not l.startswith('|'): continue
        cells=[c.strip() for c in l.strip().strip('|').split('|')]
        if hdr is None: hdr=cells; continue
        if set(''.join(cells))<=set('-: '): continue
        if cells==hdr: continue
        yield dict(zip(hdr,cells))
        
def tags(s):
    t=re.findall(r'`([^`]+)`',s)
    return t if t else [x.strip() for x in re.split(r'[;；]',s) if x.strip()]
A=open(base+'candidates-awards-critics.md').read().split('\n')
i=[n for n,l in enumerate(A) if l.startswith('### 2a')][0]; j=[n for n,l in enumerate(A) if l.startswith('### 2b')][0]
for r in rows('candidates-awards-critics.md',i,j):
    add(r['English title'],r.get('first-air year'),r.get('network/platform'),tags(r['evidence tags']),genre=r.get('genre'),origin=r.get('origin'))
R=open(base+'candidates-ratings-viewing-buzz.md').read().split('\n')
i=[n for n,l in enumerate(R) if l.startswith('## 3.')][0]; j=[n for n,l in enumerate(R) if l.startswith('## 4.')][0]
hd=None
for r in rows('candidates-ratings-viewing-buzz.md',i,j):
    if hd is None: print(list(r.keys()),file=sys.stderr); hd=1
    t=[v for k,v in r.items() if 'title' in k.lower()][0]
    ev=[v for k,v in r.items() if 'evidence' in k.lower()][0]
    yr=[v for k,v in r.items() if 'year' in k.lower()]
    nt=[v for k,v in r.items() if 'network' in k.lower()]
    gn=[v for k,v in r.items() if 'genre' in k.lower()]
    add(t,yr[0] if yr else None,nt[0] if nt else None,tags(ev),genre=gn[0] if gn else None)
F=open(base+'candidates-fans-taiwan.md').read().split('\n')
i=[n for n,l in enumerate(F) if l.startswith('### 2a')][0]; j=[n for n,l in enumerate(F) if l.startswith('## 3.')][0]
for r in rows('candidates-fans-taiwan.md',i,j):
    zh=r.get('台灣譯名（來源）','')
    zh=re.split(r'[（(]',zh)[0].strip() if zh else None
    add(r['English title'],r.get('首播年'),r.get('播出網／平台'),tags(r['Evidence tags']),zh=zh)
out=[]
for k,s in shows.items():
    cats=sorted({t.strip()[0] for t in s['tags'] if t.strip()[:1] in 'ABCDEFG'})
    s['cats']=cats; out.append(s)
out.sort(key=lambda s:(-len(s['cats']),-len(s['tags']),s['title']))
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False,indent=1)
c=collections.Counter(len(s['cats']) for s in out); print(len(out),dict(sorted(c.items())))
