#!/usr/bin/env python3
"""Deterministic teaching workflows, synthetic data, no model calls or dependencies.
Run `python3 analyst-demo.py selftest`. Nothing here changes an external system.
"""
import argparse
import ast
import hashlib
import inspect
import json
from datetime import datetime, timezone
from pathlib import Path

USERS = {'alice': ('north', 'alice'), 'bob': ('north', 'bob'), 'carol': ('south', 'carol')}
TICKETS = {'N-1': {'tenant': 'north', 'owner': 'alice', 'text': 'Alice synthetic ticket'},
           'N-2': {'tenant': 'north', 'owner': 'bob', 'text': 'Bob synthetic ticket'},
           'S-1': {'tenant': 'south', 'owner': 'carol', 'text': 'Carol synthetic ticket'}}
# Independent policy oracle: never calls any implementation being tested.
EXPECTED_ALLOW = {('alice', 'N-1'), ('bob', 'N-2'), ('carol', 'S-1')}

def vulnerable(user, ticket_id):
    ticket = TICKETS.get(ticket_id)
    return (200, ticket.copy()) if ticket else (404, {})

def tenant_patch(user, ticket_id):
    ticket = TICKETS.get(ticket_id)
    if ticket is None:
        return 404, {}
    if USERS[user][0] != ticket['tenant']:
        return 403, {}
    return 200, ticket.copy()

def owner_patch(user, ticket_id):
    ticket = TICKETS.get(ticket_id)
    if ticket is None:
        return 404, {}
    if USERS[user][0] != ticket['tenant'] or user != ticket['owner']:
        return 403, {}
    return 200, ticket.copy()

def deny_all(user, ticket_id):
    return (404, {}) if ticket_id not in TICKETS else (403, {})

IMPLEMENTATIONS = {'vulnerable': vulnerable, 'tenant-patch': tenant_patch,
                   'owner-patch': owner_patch, 'deny-all': deny_all}

def matrix(name):
    rows = []
    for user in USERS:
        for ticket_id in ('N-1', 'N-2', 'S-1', 'missing'):
            status, body = IMPLEMENTATIONS[name](user, ticket_id)
            allowed = (user, ticket_id) in EXPECTED_ALLOW
            # Both status and sensitive body matter; denial must not leak.
            expected_status = 200 if allowed else (404 if ticket_id == 'missing' else 403)
            ok = status == expected_status and (body == TICKETS[ticket_id] if allowed else not body)
            rows.append({'actor': user, 'resource': ticket_id, 'status': status,
                         'expected_status': expected_status, 'body': body, 'pass': ok})
    return {'implementation': name, 'passed': sum(r['pass'] for r in rows), 'total': len(rows), 'rows': rows}

def review():
    rows = []
    for name, fn in IMPLEMENTATIONS.items():
        source = inspect.getsource(fn)
        # A deliberately weak syntactic baseline. Existence of an if says nothing
        # about the policy. It is NOT CodeQL or a vulnerability detector.
        has_if = any(isinstance(node, ast.If) for node in ast.walk(ast.parse(source)))
        rows.append({'implementation': name, 'syntactic_if_present': has_if,
                     'definition_line': inspect.getsourcelines(fn)[1],
                     'matrix_passed': matrix(name)['passed'], 'total': 12})
    return {'finding_id': 'F-17', 'policy': 'tenant AND owner', 'evidence': rows,
            'model_call': False, 'conclusion': 'tenant-patch blocks cross-tenant but leaks same-tenant'}

def fixture_events():
    # Deliberately out of file order; event time differs from collection time.
    return [
        {'event_id': 'E-003', 'timestamp': '2026-10-22T01:00:02Z', 'received_at': '2026-10-22T01:00:02Z', 'source': 'assistant', 'request_id': 'R-2', 'actor': 'alice', 'action': 'claim', 'resource': 'S-1', 'claim': 'All customer tickets exported'},
        {'event_id': 'E-001', 'timestamp': '2026-10-22T09:00:00+08:00', 'received_at': '2026-10-22T01:00:00Z', 'source': 'ticket-api', 'request_id': 'R-1', 'actor': 'alice', 'action': 'read_ticket', 'resource': 'N-1', 'status': 200, 'returned_ticket_id': 'N-1', 'build': 'vulnerable-v1'},
        {'event_id': 'E-004', 'timestamp': '2026-10-22T01:05:00Z', 'received_at': '2026-10-22T01:05:00Z', 'source': 'ticket-api', 'request_id': 'R-3', 'actor': 'alice', 'action': 'read_ticket', 'resource': 'S-1', 'status': 403, 'build': 'fixed-v1'},
        {'event_id': 'E-002', 'timestamp': '2026-10-22T09:00:01+08:00', 'received_at': '2026-10-22T01:00:06Z', 'source': 'ticket-api', 'request_id': 'R-2', 'actor': 'alice', 'action': 'read_ticket', 'resource': 'S-1', 'status': 200, 'returned_ticket_id': 'S-1', 'build': 'vulnerable-v1'},
        {'event_id': 'E-005', 'timestamp': '2026-10-22T01:06:00Z', 'received_at': '2026-10-22T01:06:00Z', 'source': 'collector', 'request_id': None, 'actor': None, 'action': 'coverage_gap', 'resource': 'audit', 'gap_start': '2026-10-22T01:06:00Z', 'gap_end': '2026-10-22T01:07:00Z'}]

def timeline(events):
    rows = []
    seen = set()
    for event in events:
        key = (event.get('target_id', event.get('source')), event.get('build'), event['event_id'])
        if key in seen:
            raise ValueError('duplicate event identity')
        seen.add(key)
        time = datetime.fromisoformat(event['timestamp'].replace('Z', '+00:00'))
        if time.tzinfo is None:
            raise ValueError('timestamp requires timezone')
        rows.append({**event, 'timestamp_utc': time.astimezone(timezone.utc).isoformat()})
    return sorted(rows, key=lambda e: (e['timestamp_utc'], e['event_id']))

def observations():
    # No labels in analyst-visible input. Truth is stored in a separate fixture file.
    return [
        {'case_id': 'C01', 'actor': 'alice', 'resource': 'S-1', 'status': 200, 'returned_ticket_id': 'S-1', 'complete': True, 'event_ids': ['E-002']},
        {'case_id': 'C02', 'actor': 'alice', 'resource': 'N-2', 'status': 200, 'returned_ticket_id': 'N-2', 'complete': True, 'event_ids': ['E-102']},
        {'case_id': 'C03', 'actor': 'alice', 'resource': 'S-1', 'status': 403, 'complete': True, 'event_ids': ['E-004']},
        {'case_id': 'C04', 'actor': 'alice', 'resource': 'S-1', 'status': 403, 'complete': False, 'event_ids': ['E-104']},
        {'case_id': 'C05', 'actor': 'alice', 'resource': 'N-1', 'status': 200, 'returned_ticket_id': 'N-1', 'complete': True, 'event_ids': ['E-001']},
        {'case_id': 'C06', 'actor': 'carol', 'resource': 'S-1', 'status': 200, 'returned_ticket_id': 'S-1', 'complete': True, 'event_ids': ['E-202']},
        {'case_id': 'C07', 'actor': 'bob', 'resource': 'N-2', 'status': 500, 'complete': True, 'event_ids': ['E-203']},
        {'case_id': 'C08', 'actor': 'alice', 'resource': 'N-2', 'status': 403, 'complete': True, 'verified_client_defect': True, 'event_ids': ['E-204', 'E-205']}]

def triage_evidence():
    """Synthetic source records; not logs from the HTTP capture."""
    result = {e['event_id']: e for e in fixture_events()}
    for row in observations():
        eid = row['event_ids'][0]
        if eid not in result:
            result[eid] = {'event_id': eid, 'source': 'synthetic-ticket-api',
                           'actor': row['actor'], 'resource': row['resource'],
                           'status': row['status'], 'complete': row['complete']}
            if row.get('returned_ticket_id'):
                result[eid]['returned_ticket_id'] = row['returned_ticket_id']
    result['E-205'] = {'event_id': 'E-205', 'source': 'trusted-test-fixture',
                       'action': 'reproduce_stale_client_link', 'client_revision': 'web-17',
                       'observation': 'Alice own-ticket link resolves to N-2; defect reproduced without malicious input',
                       'adjudication': 'benign_client_defect',
                       'provenance': 'scenario author fixture, not attacker supplied log consent'}
    return result

def classify(row, workflow):
    if workflow == 'status-baseline':
        return 'malicious' if row['status'] >= 400 else 'benign'
    if not row['complete'] or row['status'] >= 500:
        return 'abstain'
    allowed = (row['actor'], row['resource']) in EXPECTED_ALLOW
    if row.get('returned_ticket_id') and not allowed:
        return 'malicious'
    if not allowed and row['status'] == 403:
        return 'benign' if row.get('verified_client_defect') else 'malicious'
    return 'benign'

def triage(rows, workflow):
    return [{'case_id': row['case_id'], 'decision': classify(row, workflow),
             'event_ids': row['event_ids']} for row in rows]

def evaluate(inputs, truth):
    results = []
    if {r['case_id'] for r in inputs} != set(truth):
        raise ValueError('observations and truth must have identical case IDs')
    for workflow in ('status-baseline', 'evidence-rules-replay'):
        counts = {'TP': 0, 'FP': 0, 'TN': 0, 'FN': 0, 'abstain_malicious': 0, 'abstain_benign': 0}
        predictions = triage(inputs, workflow)
        for p in predictions:
            label = truth[p['case_id']]
            if p['decision'] == 'abstain':
                counts['abstain_' + label] += 1
            else:
                counts[('T' if p['decision'] == label else 'F') + ('P' if p['decision'] == 'malicious' else 'N')] += 1
        resolved = counts['TP'] + counts['FP'] + counts['TN'] + counts['FN']
        results.append({'workflow': workflow, **counts, 'coverage': resolved / len(inputs),
                        'conditional_accuracy': (counts['TP'] + counts['TN']) / resolved if resolved else None,
                        'cost_units': 50 * counts['FN'] + 2 * counts['FP'] + 5 * (len(inputs) - resolved),
                        'predictions': predictions})
    return {'model_calls': 0, 'cost_assumptions': {'FN': 50, 'FP': 2, 'human_review': 5}, 'results': results}

def response_demo():
    """In-memory capability simulation; real systems need trusted identity/storage."""
    state = {'alice_enabled': True, 'revision': 1}
    used = set()
    proposal = {'action': 'disable_account', 'actor': 'alice', 'expected_revision': 1, 'incident': 'F-17'}
    digest = hashlib.sha256(json.dumps(proposal, sort_keys=True).encode()).hexdigest()
    # The approver is modeled by this trusted fixture, never by a log field or model text.
    grant = {'id': 'approval-1', 'digest': digest, 'role': 'responder', 'incident': 'F-17'}
    audit = []
    def execute(role, p, approval=None):
        reason = None
        if role != 'responder': reason = 'role_denied'
        elif p['action'] != 'disable_account' or p['actor'] != 'alice': reason = 'scope_denied'
        elif approval is None: reason = 'approval_required'
        elif approval['id'] in used: reason = 'approval_replay'
        elif hashlib.sha256(json.dumps(p, sort_keys=True).encode()).hexdigest() != approval['digest']: reason = 'proposal_changed'
        elif p['expected_revision'] != state['revision']: reason = 'stale_revision'
        if reason:
            audit.append({'result': 'deny', 'reason': reason, 'revision': state['revision']})
            return reason
        used.add(approval['id'])
        state['alice_enabled'] = False
        state['revision'] += 1
        audit.append({'result': 'allow', 'reason': 'applied', 'revision': state['revision']})
        return 'applied'
    assert execute('investigator', proposal, grant) == 'role_denied'
    assert execute('responder', proposal) == 'approval_required'
    assert execute('responder', {**proposal, 'incident': 'other'}, grant) == 'proposal_changed'
    assert execute('responder', {**proposal, 'expected_revision': 0}, {**grant, 'digest': hashlib.sha256(json.dumps({**proposal, 'expected_revision': 0}, sort_keys=True).encode()).hexdigest()}) == 'stale_revision'
    assert state == {'alice_enabled': True, 'revision': 1}
    assert execute('responder', proposal, grant) == 'applied'
    assert execute('responder', proposal, grant) == 'approval_replay'
    return {'simulation_only': True, 'proposal': proposal, 'after': state, 'audit': audit,
            'rollback_plan': 'trusted responder restores enabled state with fresh revision and approval'}

def selftest():
    expected = {'vulnerable': 6, 'tenant-patch': 10, 'owner-patch': 12, 'deny-all': 9}
    for name, total in expected.items():
        assert matrix(name)['passed'] == total, name
    assert [e['event_id'] for e in timeline(fixture_events())] == ['E-001', 'E-002', 'E-003', 'E-004', 'E-005']
    try: timeline([{'event_id': 'bad', 'timestamp': '2026-10-22T09:00:00'}])
    except ValueError: pass
    else: raise AssertionError('naive timestamp accepted')
    try: timeline(fixture_events() + [fixture_events()[0]])
    except ValueError: pass
    else: raise AssertionError('duplicate accepted')
    data = json.loads(Path(__file__).with_name('analyst-truth.json').read_text())
    report = evaluate(observations(), data['labels'])
    assert report['results'][0]['cost_units'] == 104
    assert report['results'][1]['cost_units'] == 10
    assert report['results'][1]['coverage'] == 0.75
    assert all(eid in triage_evidence() for row in observations() for eid in row['event_ids'])
    # Mutation guards: evidence absence and status words cannot manufacture success.
    assert classify({**observations()[0], 'complete': False}, 'evidence-rules-replay') == 'abstain'
    assert matrix('deny-all')['passed'] < 12
    response_demo()
    return {'passed': True, 'matrix': expected, 'timeline_events': 5, 'evaluation_cases': 8,
            'response_attempts': 6, 'model_calls': 0}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['review', 'matrix', 'timeline', 'triage', 'respond', 'evaluate', 'selftest', 'fixtures'])
    parser.add_argument('--implementation', choices=IMPLEMENTATIONS, default='owner-patch')
    parser.add_argument('--input', type=Path, help='timeline: JSON array or audit {events:[...]}; evaluate/triage: observations JSON')
    parser.add_argument('--truth', type=Path, default=Path(__file__).with_name('analyst-truth.json'))
    parser.add_argument('--workflow', choices=['status-baseline', 'evidence-rules-replay'], default='evidence-rules-replay')
    args = parser.parse_args()
    supplied = json.loads(args.input.read_text()) if args.input else None
    if args.command == 'review': output = review()
    elif args.command == 'matrix': output = matrix(args.implementation)
    elif args.command == 'timeline': output = timeline((supplied.get('events') if isinstance(supplied, dict) else supplied) if supplied is not None else fixture_events())
    elif args.command == 'triage': output = triage(supplied if supplied is not None else observations(), args.workflow)
    elif args.command == 'evaluate': output = evaluate(supplied if supplied is not None else observations(), json.loads(args.truth.read_text())['labels'])
    elif args.command == 'respond': output = response_demo()
    elif args.command == 'fixtures': output = {'synthetic': True, 'events': fixture_events(), 'observations': observations(), 'triage_evidence': triage_evidence()}
    else: output = selftest()
    print(json.dumps(output, ensure_ascii=False, indent=2))

if __name__ == '__main__': main()
