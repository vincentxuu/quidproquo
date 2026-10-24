"""Independent wire-level checks for the synthetic teaching target."""
from contextlib import contextmanager
from datetime import datetime
import json
from pathlib import Path
import select
import subprocess
import sys
import tempfile
from urllib.error import HTTPError
from urllib.request import Request, urlopen

SCRIPT=Path('public/examples/ai-security/ticket-lab.py').resolve()
@contextmanager
def target(build, audit):
    p=subprocess.Popen([sys.executable,str(SCRIPT),'--port','0','--build',build,'--audit',str(audit)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    try:
        if not select.select([p.stdout],[],[],5)[0]:raise RuntimeError('server did not become ready')
        ready=json.loads(p.stdout.readline());yield ready['url']
    finally:
        p.terminate()
        try:p.wait(timeout=3)
        except subprocess.TimeoutExpired:p.kill();p.wait(timeout=3)

def call(base, path, session=None, payload=None):
    headers={'Content-Type':'application/json'}
    if session:headers['Authorization']='Bearer '+session
    req=Request(base+path,data=None if payload is None else json.dumps(payload).encode(),headers=headers)
    try:r=urlopen(req,timeout=3)
    except HTTPError as e:r=e
    with r:return r.status,json.loads(r.read())

def main():
    total=0
    with tempfile.TemporaryDirectory(prefix='ai-security-wire-') as td:
        for build in ['vulnerable-v1','fixed-v1']:
            audit=Path(td)/f'{build}.jsonl'
            with target(build,audit) as base:
                code,health=call(base,'/health');assert code==200 and health['build']==build and health['target_id']=='lesson-target'
                rows=[('demo-alice',{'ticket_id':'N-1'},200,'North: printer repair'),
                      ('demo-alice',{'ticket_id':'N-2'},403 if build=='fixed-v1' else 200,'North: laptop repair'),
                      ('demo-alice',{'ticket_id':'S-1'},403 if build=='fixed-v1' else 200,'South: billing query'),
                      ('demo-bob',{'ticket_id':'N-2'},200,'North: laptop repair'),
                      ('demo-carol',{'ticket_id':'S-1'},200,'South: billing query'),
                      (None,{'ticket_id':'N-1'},401,None),
                      ('demo-alice',{'ticket_id':'missing'},404,None),
                      ('demo-alice',{'ticket_id':'S-1','user_id':'carol'},400,None),
                      ('demo-alice',{'ticket_id':['S-1']},400,None)]
                for session,payload,expected,text in rows:
                    code,body=call(base,'/tools/read_ticket',session,payload);assert code==expected,(build,payload,code,expected)
                    if code==200:assert body['text']==text and body['ticket_id']==payload['ticket_id']
                    else:assert set(body)=={'error'}
                    total+=1
                assert call(base,'/audit','demo-alice')[0]==403
                code,body=call(base,'/audit','demo-operator');assert code==200 and len(body['events'])==9
                for i,event in enumerate(body['events'],1):
                    assert event['event_id']==f'evt-{i:06d}' and event['build']==build
                    assert datetime.fromisoformat(event['timestamp']).utcoffset().total_seconds()==0
                    assert 'text' not in event and 'Authorization' not in event and 'session' not in event
                stored=[json.loads(line) for line in audit.read_text().splitlines()];assert stored==body['events']
            print(f'PASS {build}: 9 actual HTTP authorization cases, health, operator audit, UTC and redaction')
    print(f'PASS: {total} actual HTTP cases across vulnerable and fixed targets')
if __name__=='__main__':main()
