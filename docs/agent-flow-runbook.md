# Agent Flow Runbook

Operational reference for the `agent-flow` subsystem. All SQL runs against D1 (`wrangler d1 execute quidproquo-db`); all curl examples assume a valid session cookie.

---

## Presets

### List presets for a flow

```bash
curl -s 'https://quidproquo.cc/api/admin/flows/deep-research/presets' \
  -b "session=<token>"
```

### Create a preset

```bash
curl -s -X POST \
  'https://quidproquo.cc/api/admin/flows/deep-research/presets' \
  -b "session=<token>" \
  -H 'Content-Type: application/json' \
  -d '{
    "presetId": "quick",
    "name": "Quick Mode",
    "overrides": {
      "stepConfig": {
        "plan": {"retryPolicy": {"maxAttempts": 1}},
        "search": {"timeoutSeconds": 10}
      }
    }
  }'
```

### Delete a preset

```bash
curl -s -X DELETE \
  'https://quidproquo.cc/api/admin/flows/deep-research/presets/quick' \
  -b "session=<token>"
```

### Preset adoption tracking

```bash
wrangler d1 execute quidproquo-db --command \
  "SELECT preset_id, COUNT(*) AS runs, AVG(latency_ms) AS avg_ms
   FROM flow_runs
   WHERE flow_id = 'deep-research'
   GROUP BY preset_id
   ORDER BY runs DESC"
```

### Launch flow with preset

```bash
curl -s -X POST \
  'https://quidproquo.cc/api/admin/flows/deep-research/run' \
  -b "session=<token>" \
  -H 'Content-Type: application/json' \
  -d '{"input": {"topic": "AI trends 2025"}, "presetId": "deep"}'
```

---

## Inspect a flow run

```bash
# List recent flow runs
wrangler d1 execute quidproquo-db --command \
  "SELECT flow_run_id, flow_id, status, started_at, finished_at, error_json
   FROM flow_runs
   ORDER BY started_at DESC LIMIT 20"

# Inspect step runs for a flow run
wrangler d1 execute quidproquo-db --command \
  "SELECT step_run_id, step_id, kind, status, started_at, error_json
   FROM step_runs
   WHERE flow_run_id = '<flow_run_id>'
   ORDER BY step_order ASC"
```

---

## Budget enforcement

Budget limits are enforced after each completed step when `AGENT_POLICY_BUDGET_ENFORCE=true`.

```bash
# Check if a run was stopped by budget
wrangler d1 execute quidproquo-db --command \
  "SELECT flow_run_id, status, error_json
   FROM flow_runs
   WHERE json_extract(error_json, '$.kind') = 'budget_exceeded'
   ORDER BY started_at DESC LIMIT 10"
```

Kill-switch to disable budget enforcement without redeploying:

```
AGENT_POLICY_BUDGET_ENFORCE=false
```

---

## Rollback (`AGENT_FLOW_ENABLED=false`)

1. Open Cloudflare dashboard → Workers → `quidproquo` → Settings → Variables.
2. Set `AGENT_FLOW_ENABLED` to `false`.
3. Redeploy: `pnpm deploy`.
4. Verify: new API requests return 404 or early-exit without creating `flow_runs` rows.

---

## Resolving Pending Flow Approvals

When a flow run reaches a `human_approval` step, it pauses with `status='paused_for_approval'`.
An entry appears in `agent_approval_requests` with `scope='flow_step'`.

**List pending approvals:**
```sql
SELECT approval_id, flow_run_id, step_id, context_json, created_at
FROM agent_approval_requests
WHERE status='pending' AND scope='flow_step'
ORDER BY created_at ASC;
```

**Approve via API:**
```bash
curl -X POST https://quidproquo.cc/api/admin/agents/approvals/<approvalId>/approve \
  -b "session=<your-session-cookie>" \
  -H "Content-Type: application/json" \
  -d '{"comment": "LGTM"}'
```

**Reject:**
```bash
curl -X POST https://quidproquo.cc/api/admin/agents/approvals/<approvalId>/reject \
  -b "session=<your-session-cookie>" \
  -d '{"reason": "out of scope"}'
```

The approval store is shared between agent-os and agent-flow because both use the kernel's access module.
