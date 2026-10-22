import sys
sys.dont_write_bytecode = True
import copy
import importlib.util
import json
from pathlib import Path
spec = importlib.util.spec_from_file_location('preflight', 'public/examples/ai-security/experiment-preflight.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
base = json.loads(Path('public/examples/ai-security/experiment-manifest.json').read_text())
cases = [('valid offline record', base, True)]
for label, section, key in [('missing scope', 'scope', 'target'), ('missing success criterion', 'success', 'finding'), ('missing version', 'recipe', 'version'), ('missing automation rule', 'scope', 'automation_rule')]:
    doc = copy.deepcopy(base)
    del doc[section][key]
    cases.append((label, doc, False))
for label, section, key, value in [('forbidden automation', 'scope', 'automation', 'forbidden'), ('unknown automation', 'scope', 'automation', 'unknown'), ('empty action set', 'scope', 'allowed_actions', []), ('negative cost', 'limits', 'max_cost_usd', -1), ('boolean request limit', 'limits', 'max_requests', True), ('infinite cost', 'limits', 'max_cost_usd', float('inf')), ('blank initial state', 'recipe', 'initial_state', ' '), ('malformed mode', 'limits', 'mode', [])]:
    doc = copy.deepcopy(base)
    doc[section][key] = value
    cases.append((label, doc, False))
doc = copy.deepcopy(base)
doc['success'] = dict.fromkeys(('allowed_control', 'denied_control', 'finding'), 'same')
cases.append(('identical controls', doc, False))
doc = copy.deepcopy(base)
doc['scope']['automation'] = 'forbidden'
doc['limits']['mode'] = 'manual'
cases.append(('manual run with automation forbidden', doc, True))
cases.append(('non-object input', [], False))
for label, doc, expected in cases:
    errors = m.validate(doc)
    assert (not errors) == expected, (label, errors)
    print(f'PASS {label}: {errors or "accepted"}')
print(f'{len(cases)} cases passed; no network actions performed')
