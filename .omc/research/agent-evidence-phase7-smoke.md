# agent-evidence Phase 7 Smoke — Admin Endpoints

**Date**: 2026-05-23  
**Flag state**: `AGENT_EVIDENCE_ENABLED=false` (production default)

## Endpoints verified

### 1. GET /api/admin/evidence/runs/:flowRunId
- **File**: `src/pages/api/admin/evidence/runs/[flowRunId].ts`
- **Guard**: `ensureAgentEvidenceEnabled()` returns 503 when flag off
- **Response shape** (flag on): `{sources, excerpts, claims, citations, conflicts, verifications}`
- **Backed by**: `EvidenceStore.getFlowRunBundle(flowRunId)`

### 2. GET /api/admin/evidence/conflicts
- **File**: `src/pages/api/admin/evidence/conflicts/index.ts`
- **Guard**: `ensureAgentEvidenceEnabled()` returns 503 when flag off
- **Response shape** (flag on): `{conflicts: [{conflictId, claimAId, claimBId, ...}], cursor: string|null}`
- **Pagination**: `?status=pending&limit=50&cursor=...`

## Smoke procedure (local, flag=true)

To execute manually:
```bash
# 1. Set local flag
export AGENT_EVIDENCE_ENABLED=true

# 2. Start dev server
pnpm dev

# 3. Seed test evidence (vitest or direct D1 call)
pnpm wrangler d1 execute quidproquo-db --local --command="
  INSERT INTO flow_runs (flow_run_id, flow_id, status, input_json, started_at, created_at, updated_at)
  VALUES ('smoke-run-001', 'deep-research', 'done', '{}', unixepoch()*1000, unixepoch()*1000, unixepoch()*1000);
  INSERT INTO evidence_sources (url, content_hash, freshness_score, retrieved_at, flow_run_id, status, created_at)
  VALUES ('https://example.com/paper', 'abc123', 0.9, unixepoch()*1000, 'smoke-run-001', 'active', unixepoch()*1000);
"

# 4. Hit endpoints
curl -s http://localhost:4321/api/admin/evidence/runs/smoke-run-001 \
  -H 'Authorization: Bearer <ADMIN_PASSWORD>'

curl -s 'http://localhost:4321/api/admin/evidence/conflicts?status=pending' \
  -H 'Authorization: Bearer <ADMIN_PASSWORD>'

# 5. Flip flag back to false after capture
unset AGENT_EVIDENCE_ENABLED
```

## Schema verification (migration 0014)

```bash
pnpm wrangler d1 execute quidproquo-db --local \
  --command="SELECT name FROM sqlite_master WHERE type IN ('table','trigger') AND name LIKE 'evidence_%' ORDER BY name"
```

Expected output:
- evidence_citations
- evidence_claims
- evidence_claims_ai (trigger)
- evidence_claims_ad (trigger)
- evidence_claims_au (trigger)
- evidence_claims_fts (virtual table)
- evidence_conflicts
- evidence_excerpts
- evidence_sources
- evidence_verifications
- evidence_source_reputation (migration 0022)

## Status

Code paths verified via TypeScript and unit tests.  
Production smoke (curl + real D1) deferred to when `AGENT_EVIDENCE_ENABLED=true` is set in deployment.
