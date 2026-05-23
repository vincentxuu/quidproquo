# Agent Providers — Ops Runbook

## 1. Rotate a provider credential (D1 vs env var precedence)

Credentials are resolved in this order: agent-scoped D1 row → org-wide D1 row → env var fallback.

To rotate via D1:
```sql
UPDATE provider_credentials
SET value_encrypted = '<new-value>', updated_at = unixepoch() * 1000
WHERE provider_id = 'search.tavily' AND agent_id IS NULL;
```
To rotate via env var (fallback only, lower precedence than D1 rows):
Update `TAVILY_API_KEY` in `wrangler.toml` or Cloudflare dashboard → redeploy.
D1 rows always win over env vars; delete the D1 row to force env var resolution.

## 2. Force a provider unhealthy (cron sweep override)

Insert a synthetic unhealthy health snapshot directly into D1:
```sql
INSERT INTO provider_health (snapshot_id, provider_id, observed_at, is_healthy, p50_latency_ms, p95_latency_ms, success_rate_pct, sample_size, error_json)
VALUES ('manual-' || hex(randomblob(8)), 'search.tavily', unixepoch() * 1000, 0, NULL, NULL, 0, 1, '{"message":"manual override"}');
```
The next `routeWithFallback` call will see `successRatePct = 0` and skip that provider.
To restore, wait for the 7-day rolling window to expire or insert a healthy row.

## 3. Add a new provider (file checklist)

1. Add `ProviderDefinition` entry in `src/lib/agent-providers/providers/<category>/register-defaults.ts`
2. Register it: call the register function from `kernel.ts` (already wired for llm/search/reader)
3. Add a probe URL to `PROBE_URLS` in `health-cron.ts` if the provider has an API root
4. Add the outbound domain to `wrangler.toml` under `[workers_dev]` allowed outbound if needed
5. Add the relevant flag in `src/lib/config/flags.ts` under `providers.<category>`
6. Set the flag env var in `wrangler.toml` and Cloudflare dashboard secrets for the API key

## 4. Diagnose `AllProvidersFailed` (event log spelunking)

The error carries `code = 'ALL_PROVIDERS_FAILED'` and an `errors` array with per-provider failures.
Check recent health snapshots:
```sql
SELECT provider_id, is_healthy, p50_latency_ms, success_rate_pct, error_json, datetime(observed_at / 1000, 'unixepoch') AS ts
FROM provider_health
WHERE provider_id IN ('search.tavily', 'search.exa', 'search.jina')
ORDER BY observed_at DESC
LIMIT 30;
```
Check rate-limit KV keys via Cloudflare dashboard → KV → filter `provider:rate:<id>:m:`.
If all health records show `is_healthy = 1`, the failure is likely a credential or network issue — check env vars and outbound domain allowlist.

## 5. Approve a knowledge.write or action.* request

These syscalls require human approval (configured via `approvalTtlSeconds` on the agent definition).
Pending approvals are stored in the `agent_approvals` table:
```sql
SELECT approval_id, agent_id, syscall_name, payload_json, requested_at, expires_at
FROM agent_approvals
WHERE status = 'pending'
ORDER BY requested_at DESC;
```
Approve via the Admin Console UI at `/admin/agents/approvals` or via API:
```bash
curl -X POST https://<host>/api/admin/agents/approvals/<approvalId>/approve \
  -H "Cookie: session=<token>"
```
Reject follows the same pattern with `/reject`.

## 6. Disable a provider category in an emergency (umbrella flag flip)

Set the umbrella env var to `false` in the Cloudflare dashboard and redeploy, or use a quick KV override if a feature-flag KV namespace is wired.

To disable all providers immediately:
```
AGENT_PROVIDERS_ENABLED=false   # disables boot-time registration and all routing
```

To disable only a category (e.g. all search providers):
```
AGENT_PROVIDERS_SEARCH_TAVILY=false
AGENT_PROVIDERS_SEARCH_EXA=false
AGENT_PROVIDERS_SEARCH_JINA=false
```

After changing env vars in the Cloudflare dashboard, trigger a redeployment:
```bash
pnpm deploy
```
The routing layer will fall back to the legacy path when no registered providers are enabled.
