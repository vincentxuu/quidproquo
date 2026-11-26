from pathlib import Path
import json,re
base=Path('.work/ai-security/full/attack')
rows=[]
number=0
for f in sorted((base/'raw').glob('fetch-*.json')):
 data=json.loads(f.read_text())
 for block in data['content']:
  if block['type']=='text':
   text=block['text']
   starts=list(re.finditer(r'(?m)^# [^\n]+\nURL: [^\n]+\n',text))
   for i,start in enumerate(starts):
    part=text[start.start():starts[i+1].start() if i+1<len(starts) else len(text)]
    part=part.split('\nError fetching ',1)[0].rstrip()+'\n'
    url=re.search(r'^URL: (.+)$',part,re.M).group(1)
    number+=1;name=f'source-{number}.md'
    (base/'raw'/name).write_text(part)
    rows.append({'url':url,'source_type':'official','read_status':'read','tried':f'Exa full text from {f.name}; header+URL delimited rather than split on body H1; sequential complete review','raw':name,'characters':len(part),'scope':'qualitative mechanisms; no model efficacy figures'})
(base/'sources.jsonl').write_text('\n'.join(json.dumps(r,ensure_ascii=False) for r in rows)+'\n')
print(json.dumps(rows,ensure_ascii=False,indent=2))
