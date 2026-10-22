#!/usr/bin/env python3
"""Replay an independent owner-only matrix against both local teaching HTTP builds.
Download ticket-lab.py beside this file. Python 3.11+, stdlib. No LLM.
The runner starts only its own loopback child servers, then terminates them.
"""
import argparse
import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
from urllib.error import HTTPError
from urllib.request import Request, urlopen

# Independent oracle: do not import the target's policy implementation.
EXPECTED = {'alice': {'N-1'}, 'bob': {'N-2'}, 'carol': {'S-1'}}

def request(base, path, token=None, body=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    req = Request(base + path, data=None if body is None else json.dumps(body).encode(), headers=headers)
    try:
        with urlopen(req, timeout=3) as response:
            return response.status, json.load(response)
    except HTTPError as exc:
        return exc.code, json.load(exc)

def replay(lab, build):
    with TemporaryDirectory(prefix='ai-regression-') as tmp:
        audit = Path(tmp) / 'events.jsonl'
        child = subprocess.Popen([sys.executable, str(lab), '--port', '0', '--host', '127.0.0.1', '--target', 'defense-regression', '--build', build, '--audit', str(audit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            ready = json.loads(child.stdout.readline())
            base = ready['url']
            _, health = request(base, '/health')
            assert health['build'] == build and health['policy'] == 'same-tenant-owner'
            records = []
            for user, owned in EXPECTED.items():
                for ticket in ('N-1', 'N-2', 'S-1'):
                    status, body = request(base, '/tools/read_ticket', 'demo-' + user, {'ticket_id': ticket})
                    expected = 200 if ticket in owned else 403
                    correct_body = body.get('ticket_id') == ticket and isinstance(body.get('text'), str) if expected == 200 else set(body) == {'error'} and body['error'] == 'forbidden'
                    records.append({'case_id': f'http-{user}-{ticket}', 'actual_status': status, 'expected_status': expected, 'policy_pass': status == expected and correct_body})
            _, audit_body = request(base, '/audit', 'demo-operator')
            events = audit_body['events']
            assert len(events) == len(records)
            for event, record in zip(events, records):
                assert event['status'] == record['actual_status'] and event['build'] == build
                assert 'text' not in event and 'token' not in event
            return {'build': build, 'policy_pass': sum(r['policy_pass'] for r in records), 'total': len(records), 'audit_correlated': len(events), 'records': records}
        finally:
            child.terminate()
            try:
                child.wait(timeout=3)
            except subprocess.TimeoutExpired:
                child.kill(); child.wait()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lab', type=Path, default=Path(__file__).with_name('ticket-lab.py'))
    args = parser.parse_args()
    if not args.lab.is_file():
        raise SystemExit('Download ticket-lab.py beside this runner, or pass --lab PATH')
    results = [replay(args.lab.resolve(), build) for build in ('vulnerable-v1', 'fixed-v1')]
    for result in results:
        print(json.dumps(result, sort_keys=True))
    assert results[0]['policy_pass'] == 3, results[0]
    assert results[1]['policy_pass'] == 9, results[1]
    print('PASS: 18 HTTP requests; vulnerable=3/9 policy passes; fixed=9/9; 18 audit events correlated')

if __name__ == '__main__':
    main()
