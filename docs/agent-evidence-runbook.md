# Agent Evidence Runbook

Operational recipes for the `agent-evidence` subsystem. The whole surface is gated by
`AGENT_EVIDENCE_ENABLED`; R2 body offload adds `AGENT_EVIDENCE_R2_BLOBS`; NLI-based
conflict detection adds `AGENT_EVIDENCE_NLI_CONFLICTS`.

## Inspect a flow run's provenance chain

List every source document fetched during a run:

```sql
-- List all sources for a flow run
SELECT source_id, url, domain, retrieved_at FROM evidence_sources 
WHERE flow_run_id = '<FLOW_RUN_ID>' ORDER BY retrieved_at;

-- List claims with their confidence scores
SELECT claim_id, claim_text, confidence, claim_hash FROM evidence_claims 
WHERE flow_run_id = '<FLOW_RUN_ID>' ORDER BY confidence DESC;

-- Full provenance chain: claim → citation → excerpt → source
SELECT c.claim_id, c.claim_text, ex.text AS excerpt_text, s.url, s.url AS domain
FROM evidence_claims c
JOIN evidence_citations ci ON ci.claim_id = c.claim_id
JOIN evidence_excerpts ex ON ex.excerpt_id = ci.excerpt_id
JOIN evidence_sources s ON s.source_id = ex.source_id
WHERE c.flow_run_id = '<FLOW_RUN_ID>';
```

Fetch the full provenance summary via API (admin session required):

```bash
curl "$BASE/api/admin/evidence/runs/<FLOW_RUN_ID>" -b "session=$SESSION"
```

Response includes sources, claims, citations, and the verification result (if any) for the run.

## Review pending conflicts

Conflicts are detected contradictions between two claims within the same flow run.
`detected_by` is one of `rule:numeric`, `rule:negation`, or `nli` (NLI behind
`AGENT_EVIDENCE_NLI_CONFLICTS`).

```sql
SELECT conflict_id, claim_a_id, claim_b_id, detected_by, confidence_delta, status
FROM evidence_conflicts 
WHERE status = 'pending' ORDER BY created_at DESC LIMIT 20;
```

```bash
curl "$BASE/api/admin/evidence/conflicts?status=pending&limit=20" -b "session=$SESSION"
```

To resolve manually, update the status directly in D1:

```sql
UPDATE evidence_conflicts
SET status = 'approved', resolved_by = 'operator:<email>', updated_at = unixepoch() * 1000
WHERE conflict_id = <ID>;
```

Valid statuses: `pending`, `approved`, `rejected`, `expired`.

When a conflict is routed through the kernel approval gate, `approval_id` is populated and
resolution flows through `POST /api/admin/agents/approvals/<APPROVAL_ID>/approve` (same
endpoint as agent-os approvals).

## Override a source domain's reputation

Domain reputation scores are stored in `evidence_source_reputation` (migration 0022).
Scores range `[0.0, 1.0]`; lower scores reduce claim confidence for sources from that domain.

Check the current score for a domain:

```sql
-- Check current score
SELECT domain, score, updated_at FROM evidence_source_reputation WHERE domain = '<DOMAIN>';
```

Override via API (admin session required):

```bash
curl -X POST "$BASE/api/admin/evidence/reputation/<DOMAIN>" \
  -b "session=$SESSION" \
  -H 'Content-Type: application/json' \
  -d '{"score": 0.2}'
```

After overriding, re-run extraction on any flows that sourced documents from this domain so
the updated score is applied to their claims.

## Disable evidence for one flow

In the flow YAML, set `evidence.enabled: false` (or remove the `evidence` block entirely):

```yaml
# flow definition (excerpt)
evidence:
  enabled: false
```

Re-deploy or re-load the flow definition. Evidence collection stops immediately on the next
run; historical evidence rows remain fully queryable in D1.

To re-enable, restore `evidence.enabled: true` (or add the block back) and redeploy.

## Rollback (AGENT_EVIDENCE_ENABLED=false)

To disable the entire evidence subsystem without touching flow definitions:

1. Cloudflare dashboard → Worker → **Settings** → **Variables and Secrets**
2. Set `AGENT_EVIDENCE_ENABLED` = `false`
3. Redeploy (or trigger a new deployment)

All evidence API endpoints (`/api/admin/evidence/*`) return **503** while the flag is off.
Evidence tables in D1 remain intact; no data is lost.

To re-enable, flip back to `true` and redeploy.

Sub-flags follow the same pattern:

| Flag | Effect when false |
|------|-------------------|
| `AGENT_EVIDENCE_R2_BLOBS` | Bodies stored inline in D1 only; R2 offload skipped |
| `AGENT_EVIDENCE_NLI_CONFLICTS` | Conflict detection uses rule-based methods only; NLI skipped |

## R2 bucket inspection

Evidence bodies larger than 256 KB are offloaded to R2 under the `evidence/` prefix
(requires `AGENT_EVIDENCE_R2_BLOBS=true`).

```bash
# List recent evidence blobs
wrangler r2 object list quidproquo-agent-memory --prefix evidence/ --limit 10

# Retrieve a specific blob (use source_id and flow_run_id from SQL query above)
wrangler r2 object get quidproquo-agent-memory evidence/<FLOW_RUN_ID>/<SOURCE_ID> --file /tmp/evidence-body.txt
wc -c /tmp/evidence-body.txt
```

Check which sources were offloaded to R2 vs stored inline:

```sql
SELECT source_id, length(body_text) AS inline_len, 
       json_extract(body_ref, '$.r2Key') AS r2_key
FROM evidence_sources 
WHERE flow_run_id = '<FLOW_RUN_ID>'
ORDER BY created_at DESC LIMIT 10;
```

Rows with a non-null `r2_key` have their body in R2; rows with a non-null `inline_len` store
the body directly in `body_text`. A row may have neither if the source was archived before
the body was written.
