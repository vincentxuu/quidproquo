# Agent Console — Operational Runbook

## Launch a Flow

1. Navigate to `/admin/console` and select a flow from the card list.
2. Click "Launch" → the launcher page at `/admin/console/runs/launch?flowId=<id>` opens.
3. Optionally select a preset (quick / deep / custom). The preset summary panel appears when `?presetId=<id>` is appended, showing provider routing, retry policy, and budget overrides.
4. Submit → creates a flow run via `POST /api/admin/flows/<id>/run`.

## Cancel a Run

```bash
curl -X POST https://quidproquo.cc/api/admin/flows/<flowId>/runs/<runId>/cancel \
  -b "session=<cookie>"
```

Or use the Cancel button in the Run Timeline page.

## Approve / Reject an Action

When a run pauses at a `human_approval` step:
1. Open `/admin/console/runs/<runId>` — the timeline shows a "Pending Approval" banner.
2. Click Approve or Reject.
3. Or via API:
```bash
curl -X POST .../api/admin/agents/approvals/<approvalId>/approve -b "session=<cookie>"
```

## Retry a Failed Step

From the Run Timeline page, click "Retry" on any failed step. This calls:
```bash
POST /api/admin/flows/<flowId>/runs/<runId>/retry-step { "stepId": "<step>" }
```

## Edit a Flow (YAML vs Visual)

- **YAML mode**: edit `flows/<id>.yaml` directly and redeploy.
- **Visual mode**: open `/admin/console/flows/<id>/edit` (requires `AGENT_CONSOLE_FLOW_EDITOR=true`).

## Add a New User / Assign Roles

Requires `AGENT_CONSOLE_RBAC=true`. Use:
```sql
INSERT INTO console_user_roles (user_id, role, granted_by) VALUES (?, 'admin', ?);
```

## Read the Cost Dashboard

Navigate to `/admin/console/cost` (requires `AGENT_CONSOLE_COST_DASHBOARD=true`).
Key query:
```sql
SELECT agent_id, sum(cost_usd) total, avg(cost_usd) avg_cost
FROM agent_tool_calls WHERE created_at > unixepoch()-86400*7 GROUP BY agent_id;
```

## Backfill Cost Rollups

```bash
curl -X POST .../api/admin/console/cost/backfill?days=90 -b "session=<cookie>"
```

## Diagnose a Slow Page

1. Check Cloudflare Workers analytics for D1 query latency.
2. Run `EXPLAIN QUERY PLAN` on slow queries via `wrangler d1 execute`.
3. Add indexes if missing (see migration notes).
