import json,urllib.request,urllib.error
urls=['https://portswigger.net/web-security','https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter','https://portswigger.net/web-security/llm-attacks/lab-indirect-prompt-injection']
rows=[]
for url in urls:
 row={'url':url}
 for method in ['HEAD','GET']:
  req=urllib.request.Request(url,method=method,headers={'user-agent':'quidproquo-link-check/1.0 (+https://quidproquo.cc)'})
  try:
   with urllib.request.urlopen(req,timeout=20) as r:row[method]={'status':r.status,'final_url':r.url,'content_type':r.headers.get('content-type')}
  except urllib.error.HTTPError as e:row[method]={'status':e.code,'final_url':e.url}
 rows.append(row)
open('.work/ai-security/full/link-head-get-metadata.json','w').write(json.dumps(rows,indent=2)+'\n')
print(json.dumps(rows,indent=2))
