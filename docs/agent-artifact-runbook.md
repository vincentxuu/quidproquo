# Agent Artifact Runbook

Operational reference for the `agent-artifact` subsystem. All SQL runs against D1 (`wrangler d1 execute quidproquo-db`); all curl examples assume a valid session cookie.

---

## Inspect a flow run's artifacts

```bash
# List all artifact versions produced by a flow run
wrangler d1 execute quidproquo-db --command \
  "SELECT v.version_id, v.artifact_id, v.approval_status, v.created_at,
          d.kind, d.logical_name
   FROM artifact_versions v
   JOIN artifact_definitions d ON v.artifact_id = d.artifact_id
   WHERE d.flow_run_id = '<flow_run_id>'
   ORDER BY v.created_at DESC"

# Inspect a specific version's body (inline path)
wrangler d1 execute quidproquo-db --command \
  "SELECT version_id, approval_status, length(body_text) AS inline_bytes,
          json_extract(body_ref_json, '$.r2Key') AS r2_key
   FROM artifact_versions
   WHERE version_id = '<version_id>'"

# List sections for a version
wrangler d1 execute quidproquo-db --command \
  "SELECT section_id, section_key, ordinal, heading,
          approval_status, claim_ids_json
   FROM artifact_sections
   WHERE version_id = '<version_id>'
   ORDER BY ordinal"
```

---

## Regenerate an artifact from a specific step

```bash
curl -X POST https://quidproquo.cc/api/admin/artifacts/<version_id>/regenerate \
  -b "session=<token>" \
  -H "Content-Type: application/json" \
  -d '{"fromStepId": "<step_id>"}'
```

Check the new version appeared:

```bash
wrangler d1 execute quidproquo-db --command \
  "SELECT version_id, parent_version_id, created_at
   FROM artifact_versions
   WHERE artifact_id = (SELECT artifact_id FROM artifact_versions WHERE version_id = '<original_version_id>')
   ORDER BY created_at DESC LIMIT 5"
```

---

## Export an artifact to Notion / Slack / GitHub

```bash
# Notion
curl -X POST https://quidproquo.cc/api/admin/artifacts/<version_id>/export/notion \
  -b "session=<token>" \
  -H "Content-Type: application/json" \
  -d '{"options": {"parentPageId": "<notion_page_id>", "title": "<export title>"}}'

# Slack
curl -X POST https://quidproquo.cc/api/admin/artifacts/<version_id>/export/slack \
  -b "session=<token>" \
  -H "Content-Type: application/json" \
  -d '{"options": {"channel": "#research-output"}}'

# GitHub Issue
curl -X POST https://quidproquo.cc/api/admin/artifacts/<version_id>/export/github-issue \
  -b "session=<token>" \
  -H "Content-Type: application/json" \
  -d '{"options": {"repo": "owner/repo", "labels": ["research"]}}'
```

---

## Approve / reject a pending export

```bash
# List pending exports awaiting approval
wrangler d1 execute quidproquo-db --command \
  "SELECT export_id, version_id, destination, created_at
   FROM artifact_exports
   WHERE status = 'awaiting_approval'
   ORDER BY created_at DESC LIMIT 10"

# Approve via kernel approvals endpoint
curl -X POST https://quidproquo.cc/api/admin/approvals/<approval_request_id>/approve \
  -b "session=<token>"

# Reject
curl -X POST https://quidproquo.cc/api/admin/approvals/<approval_request_id>/reject \
  -b "session=<token>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "out of scope"}'
```

---

## Diff two versions of an artifact

```bash
# Get body text for both versions
wrangler d1 execute quidproquo-db --command \
  "SELECT version_id, body_text FROM artifact_versions
   WHERE version_id IN ('<version_a>', '<version_b>')"

# If bodies are R2-offloaded, fetch via:
wrangler r2 object get quidproquo-agent-memory <r2_key> --file /tmp/artifact_body.txt
```

Section-level diff (heading + approval deltas):

```bash
wrangler d1 execute quidproquo-db --command \
  "SELECT section_key, heading, approval_status
   FROM artifact_sections WHERE version_id = '<version_a>'
   EXCEPT
   SELECT section_key, heading, approval_status
   FROM artifact_sections WHERE version_id = '<version_b>'"
```

---

## Rollback (`AGENT_ARTIFACT_ENABLED=false`)

1. Open Cloudflare dashboard → Workers → `quidproquo` → Settings → Variables.
2. Set `AGENT_ARTIFACT_ENABLED` to `false`.
3. Redeploy: `pnpm deploy`.
4. Verify: a new flow run should produce no `artifact_versions` rows.

```bash
wrangler d1 execute quidproquo-db --command \
  "SELECT COUNT(*) AS new_versions FROM artifact_versions
   WHERE created_at > <epoch_ms_after_rollback>"
```

Expected: `0`.

---

## R2 bucket inspection

```bash
# List objects in the artifact namespace
wrangler r2 object list quidproquo-agent-memory --prefix artifacts/

# Fetch a specific object
wrangler r2 object get quidproquo-agent-memory <r2_key> --file /tmp/artifact.txt
wc -c /tmp/artifact.txt   # confirm size >256KB

# Confirm small artifacts still use inline path (non-regression)
wrangler d1 execute quidproquo-db --command \
  "SELECT version_id, length(body_text) AS inline_len,
          json_extract(body_ref_json, '$.r2Key') AS r2_key
   FROM artifact_versions ORDER BY created_at DESC LIMIT 5"
# Rows with inline_len > 0 and r2_key IS NULL → inline path
# Rows with r2_key NOT NULL and inline_len < 100 → R2 path
```

---

## Export Provider Rollout Order

Flip export provider flags in this order, observing each for 48h before proceeding:

1. `AGENT_ARTIFACT_NOTION=true` — observe 48h: approval queue depth + reject rate
2. `AGENT_ARTIFACT_SLACK=true` — observe 48h: same metrics
3. `AGENT_ARTIFACT_GITHUB_ISSUE=true` — observe 48h
4. `AGENT_ARTIFACT_GITHUB_PR=true` — **observe 1 week** (highest blast radius: PR reviews are visible to external contributors)
5. `AGENT_ARTIFACT_EMAIL=true` — observe 48h

At each step, record a dashboard snapshot in `.omc/research/agent-artifact-exporter-rollout.md`.

**Emergency rollback**: set any provider flag back to `false` in Cloudflare dashboard → Worker → Variables; takes effect on next request.

**Binary exporters** (CSV, PDF, PPTX):
- `AGENT_ARTIFACT_CSV=true` — safe, local file output only
- `AGENT_ARTIFACT_PDF=true` — requires PDF generation service
- `AGENT_ARTIFACT_PPTX=true` — requires PPTX generation service
