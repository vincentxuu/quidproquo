#!/usr/bin/env python3
"""macOS OS-enforced boundary probes. Selective teaching profile, not production policy.
Only temporary synthetic files and loopback TCP are used. No packages needed.
"""
import json
import os
from pathlib import Path
import platform
import socket
import subprocess
import sys
import tempfile

def child(root, port):
    root = Path(root)
    results = {'allowed_read': (root / 'work' / 'input.txt').read_text() == 'synthetic ticket N-1'}
    (root / 'work' / 'result.txt').write_text('summary')
    results['allowed_write'] = (root / 'work' / 'result.txt').exists()
    try:
        (root / 'private.txt').read_text()
        results['outside_read_blocked'] = False
    except PermissionError:
        results['outside_read_blocked'] = True
    try:
        (root / 'protected.txt').write_text('changed')
        results['outside_write_blocked'] = False
    except PermissionError:
        results['outside_write_blocked'] = True
    try:
        with socket.create_connection(('127.0.0.1', int(port)), timeout=1):
            pass
        results['network_blocked'] = False
    except PermissionError:
        results['network_blocked'] = True
    # Connection refused/timeout is not accepted as proof of an enforced denial.
    results['parent_credential_absent'] = 'DEMO_PARENT_SECRET' not in os.environ
    results['narrow_marker_present'] = os.environ.get('DEMO_CAPABILITY') == 'N-1-read'
    print(json.dumps(results, sort_keys=True))

def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--child':
        child(sys.argv[2], sys.argv[3]); return
    if platform.system() != 'Darwin' or not Path('/usr/bin/sandbox-exec').exists():
        raise SystemExit('UNSUPPORTED: requires macOS sandbox-exec; no sandbox result claimed')
    with tempfile.TemporaryDirectory(prefix='ai-defense-') as tmp:
        root = Path(tmp).resolve()
        (root / 'work').mkdir()
        (root / 'work' / 'input.txt').write_text('synthetic ticket N-1')
        (root / 'private.txt').write_text('synthetic private fixture')
        (root / 'protected.txt').write_text('original')
        with socket.socket() as listener:
            listener.bind(('127.0.0.1', 0)); listener.listen(4)
            port = str(listener.getsockname()[1])
            command = [sys.executable, str(Path(__file__).resolve()), '--child', str(root), port]
            baseline_env = {**os.environ, 'DEMO_PARENT_SECRET': 'synthetic-only', 'DEMO_CAPABILITY': 'N-1-read'}
            baseline = json.loads(subprocess.run(command, env=baseline_env, check=True, capture_output=True, text=True, timeout=5).stdout)
            (root / 'protected.txt').write_text('original')
            # These are deliberately narrow denials so the probe can show each mechanism.
            # Remaining host paths are not comprehensively isolated by this profile.
            profile = f'(version 1)(allow default)(deny network*)(deny file-read* (literal "{root}/private.txt"))(deny file-write* (literal "{root}/protected.txt"))'
            restricted_env = {'PATH': '/usr/bin:/bin', 'DEMO_CAPABILITY': 'N-1-read'}
            restricted = json.loads(subprocess.run(['/usr/bin/sandbox-exec', '-p', profile, *command], env=restricted_env, check=True, capture_output=True, text=True, timeout=5).stdout)
        assert (root / 'protected.txt').read_text() == 'original'
        expected = {'allowed_read': True, 'allowed_write': True, 'outside_read_blocked': True, 'outside_write_blocked': True, 'network_blocked': True, 'parent_credential_absent': True, 'narrow_marker_present': True}
        assert restricted == expected, restricted
        assert not baseline['outside_read_blocked'] and not baseline['outside_write_blocked'] and not baseline['network_blocked'] and not baseline['parent_credential_absent'], baseline
        print(json.dumps({'baseline': baseline, 'restricted': restricted, 'os': platform.system(), 'scope': 'selective OS policy probes, not full host isolation'}, sort_keys=True))
        print('PASS: 7 restricted checks and 4 baseline counterchecks')

if __name__ == '__main__':
    main()
