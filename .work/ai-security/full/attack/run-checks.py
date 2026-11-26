from pathlib import Path
import json, subprocess, sys
base=Path('.work/ai-security/full/attack')
results=[]
for mode in ('surface','hypotheses','verify','injection','loop','chain'):
 for build in ('vulnerable-v1','fixed-v1'):
  out=base/f'{mode}-{build}.json'
  p=subprocess.run([sys.executable,'public/examples/ai-security/attack-runner.py',mode,'--build',build,'--out',str(out)],capture_output=True,text=True)
  if p.returncode:raise RuntimeError(p.stderr)
  d=json.loads(p.stdout)
  assert all(e['target_id']=='lesson-target' and e['build']==build for e in d['server_audit'])
  assert len(d['server_audit'])==len(d['trace'])-1
  for e in d['trace']:
   if e['status']==403:assert set(e['body'])=={'error'}
  results.append({'mode':mode,'build':build,'requests':d['requests'],'finding':d.get('finding'),'effect':d.get('backend_effect'),'stop':d.get('stop'),'audit_events':len(d['server_audit']),'pass':True})
p=subprocess.run([sys.executable,'public/examples/ai-security/attack-runner.py','selftest'],capture_output=True,text=True,check=True)
results.append(json.loads(p.stdout))
(base/'test-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
