import re,sys,glob,os
MAP={'01':'01','02':'02','03':'03','04':'04','05':'05','06':'06','07':'07','08':'08','09':'09','10':'10','11':'11','12':'12','13':'13','14':'14','16':'15','18':'16','20':'17'}
def norm(s): return re.sub(r'[^a-z0-9 ]+',' ',s.lower().replace('’',"'")).split()
for f in sorted([x for x in glob.glob('src/content/posts/ai/2026-10-12-stanford-cs229-lecture-*.md') if not x.endswith('-en.md')]):
    lec=re.search(r'lecture-(\d\d)',f).group(1)
    tf=glob.glob(f'.work/cs229-spring2026/txt/{MAP[lec]}-*.txt')[0]
    T=' '.join(norm(re.sub(r'\[\d\d:\d\d:\d\d\]','',open(tf).read())))
    body=open(f).read()
    body=body.split('---',2)[2]
    quotes=re.findall(r'["“「]([A-Za-z][^"”」\n]{24,}?)["”」]',body)
    bad=[]
    for q in quotes:
        parts=[p for p in re.split(r'\.\.\.|…|\[[^\]]*\]',q) if len(norm(p))>=4]
        for p in parts:
            if ' '.join(norm(p)) not in T: bad.append(p.strip()[:110])
    emb=re.findall(r'^url: (\S+)',body,re.M); st=re.search(r'^\*\*影片狀態：已附影片。\*\*',body,re.M)
    pos_emb=body.find('```youtube'); pos_h2=body.find('\n## ')
    print(f"L{lec} chars={len(body)} quotes={len(quotes)} bad={len(bad)} status={'ok' if st else 'MISSING'} embedBeforeH2={0<pos_emb<pos_h2} url={emb[:1]}")
    for b in bad: print('   NOT FOUND:',b)
