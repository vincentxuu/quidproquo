#!/usr/bin/env python3
"""Capture real local HTTP evidence from ticket-lab.py, no model call.
Usage: python3 analyst-http-capture.py --out NEW_DIRECTORY
Starts each build on a local ephemeral port and terminates it after capture.
"""
import argparse
import json
from pathlib import Path
import subprocess
import sys
from urllib.error import HTTPError
from urllib.request import Request, urlopen

EXPECTED = {('alice', 'N-1'), ('bob', 'N-2'), ('carol', 'S-1')}

def request(base, path, actor=None, payload=None):
    headers = {'Content-Type': 'application/json'}
    if actor:
        headers['Authorization'] = 'Bearer demo-' + actor
    req = Request(base + path, data=json.dumps(payload).encode() if payload is not None else None, headers=headers)
    try:
        with urlopen(req, timeout=5) as response:
            return response.status, json.load(response)
    except HTTPError as response:
        return response.code, json.load(response)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=False)
    lab = Path(__file__).with_name('ticket-lab.py')
    for build in ('vulnerable-v1', 'fixed-v1'):
        target = 'lesson-target-' + build
        process = subprocess.Popen([sys.executable, str(lab), '--port', '0', '--build', build, '--target', target], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            ready = json.loads(process.stdout.readline())
            base = ready['url']
            _, health = request(base, '/health')
            traces = []
            for actor in ('alice', 'bob', 'carol'):
                for resource in ('N-1', 'N-2', 'S-1'):
                    status, body = request(base, '/tools/read_ticket', actor, {'ticket_id': resource})
                    traces.append({'actor': actor, 'resource': resource, 'request': {'ticket_id': resource}, 'status': status, 'body': body})
            audit_status, audit = request(base, '/audit', 'operator')
            assert audit_status == 200 and len(audit['events']) == 9
            for trace, event in zip(traces, audit['events']):
                trace['event_id'] = event['event_id']
                trace['target_id'] = event['target_id']
                trace['build'] = build
                assert (trace['actor'], trace['resource'], trace['status']) == (event['actor'], event['resource'], event['status'])
                allowed = (trace['actor'], trace['resource']) in EXPECTED
                assert trace['status'] == (200 if build == 'vulnerable-v1' or allowed else 403)
                if build == 'fixed-v1' and not allowed:
                    assert 'text' not in trace['body']
            (args.out / (build + '-trace.json')).write_text(json.dumps({'health': health, 'traces': traces}, indent=2) + '\n')
            (args.out / (build + '-audit.json')).write_text(json.dumps(audit, indent=2) + '\n')
        finally:
            process.terminate()
            process.communicate(timeout=5)
    print(json.dumps({'http_requests_checked': 18, 'builds': 2, 'out': str(args.out), 'model_calls': 0}))

if __name__ == '__main__': main()
