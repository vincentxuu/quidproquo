# Agent OS Runbook

## Trigger Surfaces

Manual runs:

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/$AGENT_ID/run \
  -b "session=..." \
  -H "Content-Type: application/json" \
  -d '{"input":{}}'
```

Cron runs:

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/scheduled \
  -H "X-Crawl-Secret: $CRAWL_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cronExpression":"0 4 * * SUN"}'
```

Queue runs:

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/$AGENT_ID/enqueue \
  -b "session=..." \
  -H "Content-Type: application/json" \
  -d '{"input":{}}'
```

## Cancel A Runaway Run

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/runs/$RUN_ID/cancel \
  -b "session=..."
```

## Approve Or Reject A Pending Action

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/approvals/$APPROVAL_ID/approve \
  -b "session=..."
```

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/approvals/$APPROVAL_ID/reject \
  -b "session=..."
```

## Inspect A Failed Run's Event Log

```sql
SELECT run_id, kind, payload_json FROM agent_run_events WHERE run_id=? ORDER BY event_id;
```

Use the admin detail endpoint for the same data through HTTP:

```bash
curl https://quidproquo.cc/api/admin/agents/runs/$RUN_ID \
  -b "session=..."
```

## Rollback A Migrated Agent

Set the per-agent flag back to false and redeploy. Keep `AGENT_OS_ENABLED` unchanged unless the whole kernel must be disabled.

```bash
# Cloudflare dashboard or wrangler env vars:
AGENT_OS_CRITIC=false
AGENT_OS_WRITER=false
AGENT_OS_RESEARCH=false
AGENT_OS_PLANNER=false
```

## R2 Memory Disable

Set `AGENT_OS_MEMORY_R2=false` and redeploy. Large memory writes will fail with `MemoryBodyTooLarge`; small inline writes remain available.

## Queue Worker Wiring

Astro's Cloudflare adapter owns the HTTP Worker entrypoint, while Cloudflare Queues call a Worker-level `queue()` handler. The Agent OS queue consumer logic therefore lives in `src/server/queue.ts` as `handleQueueBatch(batch, env, ctx)`.

Production wiring uses the thin `src/server/worker.ts` shim: `fetch` delegates to `@astrojs/cloudflare/entrypoints/server`, `queue` forwards to `handleQueueBatch`, and `scheduled` posts due cron entries to `/api/admin/agents/scheduled` with `X-Crawl-Secret`. Keep the shim small: durable logic belongs in `src/server/queue.ts` and the HTTP route, not in generated `dist/` output.

## Cron Orchestrator Wiring

Cloudflare Cron Triggers invoke the Worker's `scheduled()` handler, not arbitrary HTTP endpoints. `src/server/worker.ts` compares `controller.cron` against `scheduledAgentEntries`, then POSTs each due agent to `/api/admin/agents/scheduled`.

Workers Cron has minute-level schedules and Cloudflare-owned delivery semantics. If an agent needs finer-grained or externally observable scheduling, use a third-party orchestrator such as GitHub Actions cron or Upstash QStash to call `/api/admin/agents/scheduled` with `X-Crawl-Secret`.

## Health SQL Recipes

```sql
SELECT status, COUNT(*) FROM agent_runs WHERE started_at > unixepoch()-86400 GROUP BY status;
```

```sql
SELECT agent_id, AVG(total_cost_usd) AS avg_cost, AVG((finished_at-started_at)/1000.0) AS avg_sec FROM agent_runs WHERE finished_at IS NOT NULL AND started_at > unixepoch()-86400 GROUP BY agent_id;
```

```sql
SELECT run_id, kind, payload_json FROM agent_run_events WHERE run_id=? ORDER BY event_id;
```

```sql
SELECT approval_id, run_id, reason, created_at FROM agent_approval_requests WHERE status='pending' AND created_at < unixepoch()-86400;
```

## Cron Smoke

```bash
curl -X POST https://quidproquo.cc/api/admin/agents/scheduled \
  -H "X-Crawl-Secret: $CRAWL_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"cronExpression":"0 4 * * SUN"}'
```
