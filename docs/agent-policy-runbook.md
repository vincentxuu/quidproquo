# Agent Policy Runbook

Operational recipes for the `agent-policy` subsystem. The whole surface is gated by
`AGENT_POLICY_ENABLED`; per-category enforcement adds `AGENT_POLICY_BUDGET_ENFORCE`,
`AGENT_POLICY_PROVIDER_ENFORCE`, `AGENT_POLICY_QUALITY_ENFORCE`,
`AGENT_POLICY_SECURITY_ENFORCE`, and `AGENT_POLICY_HUMAN_GATES`.

## Inspect a flow run's frozen policy

At flow-run creation the resolved inheritance chain is frozen into
`policy_bindings.frozen_effective_json`. Enforcement reads only this column — it never
re-resolves inheritance mid-run — so the frozen copy is the authoritative record of what
rules governed the run.

```sql
-- Find the frozen policy for a flow run
SELECT b.binding_id, b.policy_id, b.scope, b.scope_value,
       b.frozen_effective_json, b.frozen_at
FROM policy_bindings b
WHERE b.flow_run_id = '<FLOW_RUN_ID>';

-- Inline pretty-print the policy JSON
SELECT json_extract(frozen_effective_json, '$.budget.max_cost_usd') AS max_cost_usd,
       json_extract(frozen_effective_json, '$.quality.min_sources') AS min_sources,
       json_extract(frozen_effective_json, '$.provider.allowlist') AS provider_allowlist
FROM policy_bindings WHERE flow_run_id = '<FLOW_RUN_ID>';
```

Fetch the frozen effective policy and its source chain via API (admin session required):

```bash
curl "$BASE/api/admin/policies/runs/<FLOW_RUN_ID>/effective" -b "session=$SESSION"
```

Response shape: `{ "effective": { ... }, "sourceChain": [{ "scope": "...", "policy_key": "...", "version": 1 }, ...] }`.
When no binding exists for the run, the endpoint returns `404` and the run is unpoliced.

## List recent violations by category

Violations are append-only — one row per logged / blocked / killed / gated event.
`action_taken` is one of `logged`, `blocked`, `run_killed`, `approval_gated`,
`request_retried`, `request_failed`.

```sql
SELECT category, rule_key, severity, action_taken, COUNT(*) as count,
       MAX(created_at) as last_seen
FROM policy_violations
WHERE created_at > (unixepoch() - 86400) * 1000
GROUP BY category, rule_key, severity, action_taken
ORDER BY count DESC LIMIT 20;
```

To narrow to a specific run:

```sql
SELECT violation_id, category, rule_key, severity, action_taken,
       observed_value_json, limit_value_json, created_at
FROM policy_violations
WHERE flow_run_id = '<FLOW_RUN_ID>'
ORDER BY created_at;
```

Valid `category` values: `budget`, `provider`, `quality`, `security`, `human`, `retry`.
Valid `severity` values: `warn`, `block`, `kill`.

## Override a binding for one run (emergency)

```sql
-- Update frozen_effective_json to remove a blocking rule temporarily
-- DANGEROUS: creates an audit trail gap; use only in prod emergencies
UPDATE policy_bindings
SET frozen_effective_json = json_patch(frozen_effective_json, '{"budget": {"max_cost_usd": 10}}')
WHERE flow_run_id = '<FLOW_RUN_ID>';
```

After the patch the run must be re-triggered (or its next enforcement checkpoint re-evaluated)
to pick up the updated ceiling. The old frozen value is not preserved — note the original
before patching:

```sql
SELECT frozen_effective_json FROM policy_bindings WHERE flow_run_id = '<FLOW_RUN_ID>';
```

## Rotate a reference policy to a new version

Policy definitions are immutable per `(policy_key, version)`. Editing a policy inserts a new
version row so historical bindings keep resolving to the version they were frozen against.

```sql
-- Bump version on a reference policy
INSERT INTO policy_definitions (policy_key, version, body_json, description, created_at)
SELECT policy_key, version + 1, '<NEW_BODY_JSON>', description, unixepoch() * 1000
FROM policy_definitions WHERE policy_key = 'research-standard' ORDER BY version DESC LIMIT 1;
```

Future runs picking up `policy_binding: research-standard` will use the latest version.
Existing in-flight runs are not affected — their `frozen_effective_json` was captured at
creation time.

Via API (preferred — runs `validatePolicyBody` before insert):

```bash
curl -X PUT "$BASE/api/admin/policies/research-standard" \
  -b "session=$SESSION" \
  -H 'Content-Type: application/json' \
  -d '{ "label": "Research Standard v2", "body": { ... } }'
```

Confirm the new version row was inserted:

```sql
SELECT policy_id, version, label, created_at FROM policy_definitions
WHERE policy_key = 'research-standard' ORDER BY version DESC LIMIT 3;
```

## Rollback (AGENT_POLICY_ENABLED=false)

To disable the entire policy subsystem without touching flow definitions or bindings:

1. Cloudflare dashboard → Worker → **Settings** → **Variables and Secrets**
2. Set `AGENT_POLICY_ENABLED` = `false`
3. Redeploy (or trigger a new deployment)

All enforcement methods short-circuit to `{passed: true}`. Violations are not logged. Policy
bindings remain intact and fully queryable in D1; no data is lost.

To re-enable, flip back to `true` and redeploy.

Per-category rollback is available without a full disable. Turn off individual enforcement
seams with the sub-flags:

| Flag | Effect when `false` |
|------|---------------------|
| `AGENT_POLICY_BUDGET_ENFORCE` | Budget ceilings not checked; runs are never killed for cost/token/iteration overflow |
| `AGENT_POLICY_PROVIDER_ENFORCE` | Provider allowlist / denylist / region checks skipped; all providers allowed |
| `AGENT_POLICY_QUALITY_ENFORCE` | Quality gates not checked at run completion; evidence gaps are ignored |
| `AGENT_POLICY_SECURITY_ENFORCE` | Sensitive-data scanning and tool allowlist intersection skipped |
| `AGENT_POLICY_HUMAN_GATES` | Approval gates not fired; all human-gated actions proceed automatically |

Example: to turn off budget kill-switch only, set `AGENT_POLICY_BUDGET_ENFORCE=false` and
redeploy. All other categories continue enforcing.

## Investigate a budget_exceeded kill (recover partial output from R2)

When a run is killed for exceeding a budget ceiling, the in-progress output is preserved as
an R2 blob and the key is recorded in `policy_violations.partial_output_ref`.

```sql
-- Find the violation and partial output reference
SELECT v.violation_id, v.rule_key, v.observed_value_json, v.limit_value_json,
       r.error_json, r.partial_output_ref
FROM policy_violations v
JOIN flow_runs r ON r.run_id = v.flow_run_id
WHERE v.category = 'budget' AND v.action_taken = 'run_killed'
ORDER BY v.created_at DESC LIMIT 5;
```

Retrieve partial output from R2 (`partial_output_ref` is the R2 key):

```bash
# partial_output_ref is the R2 key
wrangler r2 object get quidproquo-agent-memory <PARTIAL_OUTPUT_REF> --file /tmp/partial.json
```

Inspect which rule triggered the kill:

| `rule_key` | Meaning |
|------------|---------|
| `max_cost_usd` | Cumulative LLM spend exceeded the USD ceiling |
| `max_tokens` | Total token count (in + out) exceeded the ceiling |
| `max_iterations` | Step iteration count exceeded the ceiling |
| `max_parallel_units` | Concurrent parallel unit count exceeded the ceiling |
| `max_runtime_seconds` | Wall-clock runtime exceeded the ceiling |

To confirm the observed vs limit values for the breach:

```sql
SELECT rule_key,
       json_extract(observed_value_json, '$') AS observed,
       json_extract(limit_value_json, '$') AS limit_value
FROM policy_violations
WHERE violation_id = <VIOLATION_ID>;
```

Partial output is only preserved when `AGENT_POLICY_ENABLED=true` AND
`AGENT_OS_MEMORY_R2=true`. When R2 is off, partial output is dropped and
`partial_output_ref` will be `NULL`.

## Approve a pending human gate

Human approval gates fire when `AGENT_POLICY_HUMAN_GATES=true` and a `human` policy is
bound to the flow run. While a gate is pending the flow run sits in `paused`. Approvals
share the kernel's `agent_approval_requests` queue with `agent-os` and `agent-evidence`.

Find pending approvals:

```sql
SELECT approval_id, run_id, reason, context_json, status, expires_at
FROM agent_approval_requests
WHERE status = 'pending' ORDER BY created_at DESC LIMIT 10;
```

`context_json` records the gate mode and action that triggered the gate:

```sql
SELECT json_extract(context_json, '$.mode') AS mode,
       json_extract(context_json, '$.action') AS action,
       json_extract(context_json, '$.stepId') AS step_id
FROM agent_approval_requests
WHERE approval_id = <APPROVAL_ID>;
```

Resolve via API (admin session required):

```bash
# Approve
curl -X POST "$BASE/api/admin/agents/approvals/<APPROVAL_ID>/approve" -b "session=$SESSION"

# Reject — flow run transitions to failed with reason='approval_rejected'
curl -X POST "$BASE/api/admin/agents/approvals/<APPROVAL_ID>/reject" -b "session=$SESSION"
```

For `edit_on_approval` mode, include the reviewed payload:

```bash
curl -X POST "$BASE/api/admin/agents/approvals/<APPROVAL_ID>/approve" \
  -b "session=$SESSION" \
  -H 'Content-Type: application/json' \
  -d '{ "editedPayload": { ... } }'
```

The edited payload replaces the agent's pending output before the run continues.

Expired approvals (`status='expired'`) are treated as rejections — the associated step is
marked failed and the flow run fails. Check for expired gates:

```sql
SELECT approval_id, run_id, expires_at
FROM agent_approval_requests
WHERE status = 'pending' AND expires_at < unixepoch() * 1000
ORDER BY expires_at LIMIT 10;
```

## Tune research-standard after dogfood signals

After running `deep-research` flows under `research-standard` for several days, use violation
telemetry to identify which rule keys have high false-positive rates and adjust thresholds
before rotating to a new version.

```sql
-- Check violation rate by rule_key for research-standard runs
SELECT v.rule_key, COUNT(*) as violations, COUNT(DISTINCT v.flow_run_id) as affected_runs
FROM policy_violations v
JOIN policy_bindings b ON b.flow_run_id = v.flow_run_id
WHERE b.policy_id = (SELECT policy_id FROM policy_definitions WHERE policy_key = 'research-standard' ORDER BY version DESC LIMIT 1)
  AND v.created_at > (unixepoch() - 7 * 86400) * 1000
GROUP BY v.rule_key ORDER BY violations DESC;
```

Drill into a specific rule to see the distribution of observed values:

```sql
SELECT json_extract(observed_value_json, '$') AS observed,
       json_extract(limit_value_json, '$') AS limit_value,
       COUNT(*) as count
FROM policy_violations
WHERE rule_key = 'min_sources'
  AND created_at > (unixepoch() - 7 * 86400) * 1000
GROUP BY observed ORDER BY count DESC;
```

Compare human-gate approval rate to detect gate fatigue:

```sql
SELECT action_taken, COUNT(*) as count
FROM policy_violations
WHERE category = 'human'
  AND created_at > (unixepoch() - 7 * 86400) * 1000
GROUP BY action_taken;
```

Target state: `approval_gated` rate stays below 30 gates / 100 runs; `run_killed` budget
events stay below 5 / 100 runs; quality `warn` rate below 50%.

Once thresholds are adjusted, rotate `research-standard` to a new version (see "Rotate a
reference policy to a new version" above) and re-run a representative sample of
`deep-research` flows to confirm the signal improves.
