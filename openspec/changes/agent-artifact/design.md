## Context

After `agent-foundation` (#0), `agent-os` (#1), `agent-providers` (#2), `agent-flow` (#3), `agent-evidence` (#4 in the evidence numbering — slotted before policy), and `agent-policy` (#5) land, the platform has:

- A kernel (`src/lib/agent-os/`) that runs agents, mediates syscalls, persists telemetry, and operates an approval gate via `agent_approval_requests`
- A provider router (`src/lib/agent-providers/`) that resolves abstract syscalls to concrete vendors, including a five-category split (`llm`, `search`, `reader`, `knowledge`, `action`) where Action providers are gated through the kernel approval mechanism
- A flow runtime (`src/lib/agent-flow/`) that compiles YAML flow definitions into kernel sub-runs, with one of its nine step types being `artifact` — today a placeholder that writes `agent_run_events` `kind='artifact'` and nothing more
- An evidence layer (`src/lib/agent-evidence/`) that extracts and persists Source → Excerpt → Claim → Citation graphs per flow run, exposes `EvidenceQueryAPI`, and produces an Evidence Bundle JSON via `GET /api/admin/evidence/runs/:flowRunId/bundle`

What the platform does **not** have is a place where flow output **lives**. Today, the only output a flow produces is "the final state object" — readable from `flow_runs.output_json`, scrollable in the run-detail page, and nowhere else. There is no notion of "the markdown report for this run", "version 2 of that report after re-running the verify step", "the same report exported to a Notion page", or "the partial-approval state where sections 1–3 are signed off but section 4 is still in review". The Gateway Console plan (§4.7) lists eight initial artifact types as load-bearing for the product story; the proposal here expands that to nine, including the `evidence_bundle` shape that consumes the new `EvidenceQueryAPI`.

`agent-artifact` is the layer that turns flow output into a typed, versioned, exportable, regeneratable, partially-approvable object. It consumes the kernel (storage + access manager), the flow runtime (`artifact` step produces artifacts at end-of-step), the evidence layer (sections trace to claims), and the provider layer (exporters delegate writes to Knowledge / Action providers). It does **not** invent its own approval mechanism, its own provider model, or its own evidence shape — every one of those is delegated to the change that owns it.

**Stakeholders.**
- **Admin operator** (primary) — wants every flow run to produce a typed artifact, review it before export, partially approve sections, and ship to Notion / Slack / GitHub without leaving the console
- **Quality reviewer** (secondary) — wants line-level diff between two versions of the same report (e.g. "what changed when we re-ran `verify` with stricter coverage threshold?") and the provenance chain into evidence behind every paragraph
- **Flow author** — wants to declare `type: artifact, artifact_type: markdown_report` in YAML and have the runtime do the rest

**Constraints.**
1. **No regression of flow runtime.** The flow runtime's `artifact` step keeps its declared shape; this change turns the placeholder into a real implementation
2. **Evidence is read-only.** Artifact sections reference claim/source ids; this change never writes to evidence tables
3. **External writes go through providers.** Notion / Slack / GitHub destinations resolve via `agent-providers` Knowledge / Action categories — no parallel HTTP-client tier
4. **Approval gate is the kernel's.** Export approvals create `agent_approval_requests` rows; section-level approval is a row on `artifact_sections`, not a parallel approval table
5. **Flag-gated rollout.** Umbrella `AGENT_ARTIFACT_ENABLED=false` makes the entire surface dark; per-type and per-exporter flags layer on top

## Goals / Non-Goals

**Goals**
- Typed artifact registry with nine kinds (`markdown_report`, `evidence_bundle`, `notion_page`, `slack_draft`, `github_issue`, `github_pr_review`, `csv_spreadsheet`, `pdf_export`, `pptx_export`), each backed by a Zod schema
- D1 persistence with four new tables (`artifact_definitions`, `artifact_versions`, `artifact_exports`, `artifact_sections`) in one migration `0016_agent_artifact.sql`
- Version chain per `(flow_id, inputs_hash)` — every run produces a new `artifact_versions` row with `parent_version_id` linking to predecessor; no destructive overwrite
- R2 offload for large artifact bodies (PDF, PPTX, large Markdown) using the existing `R2_AGENT_MEMORY` bucket under an `artifact/` prefix, threshold 256KB to match `agent-evidence` D10
- Section-level traceability: each `artifact_sections` row links to `(flow_step_run_id, claim_ids[])` so any paragraph can be reconstructed
- Regenerate-from-step API that re-runs a single flow step and patches affected sections, producing a new version
- Line-level diff between any two versions of the same artifact, rendered server-side via an existing diff library
- Pluggable exporter interface — one per destination, gated by kernel `agent-access` approval, delegated to Knowledge / Action providers for the external call
- Section-level approval workflow on top of whole-artifact approval (statuses: `draft | approved | rejected | published`)
- Reference exporter set (Markdown → file, Markdown → Notion, Markdown → Slack, Markdown → GitHub comment) live behind individual flags

**Non-Goals**
- Rich artifact editing UI — `agent-console` (#7) owns the editor; this change exposes JSON / Markdown endpoints
- New approval surface — reuses kernel `agent_approval_requests` mechanism (agent-os D9)
- New provider tier — reuses `agent-providers` Knowledge / Action categories
- New evidence linking schema — references existing `evidence_claims.claim_id` and `evidence_sources.source_id` directly
- Auto-generated narrative artifact templates (e.g. "make me a sales-deck PPTX from this evidence bundle") — out of scope; templates are a v2 concern
- Migration of `runPipeline` artifacts into this system — `agent-pipelines-unify` (#8) ports them in a follow-up
- Real-time collaborative editing or diff-conflict resolution; artifacts are immutable once a version is materialized

## Decisions

### D1: Nine artifact types — each a typed schema, not a JSON blob

**Decision.** Nine artifact kinds, each with a per-kind Zod schema that lives in `src/lib/agent-artifact/kinds/<kind>.ts`. The artifact body for a given version is one validated payload; cross-kind unification is rejected.

| Kind | Body shape | Storage | Primary exporter |
|---|---|---|---|
| `markdown_report` | `{ frontmatter, sections: Section[], rendered_markdown }` where each section has `id`, `heading`, `body_markdown`, optional `claim_ids[]`, `flow_step_run_id` | inline if < 256KB, R2 otherwise | file, Notion, Slack, GitHub comment |
| `evidence_bundle` | The exact JSON shape `EvidenceQueryAPI.bundle()` returns (sources, excerpts, claims, citations, conflicts, reputation snapshot) | inline (typically 5–50KB) | file |
| `notion_page` | `{ blocks: NotionBlock[], properties: NotionProperties, parent_id }` — Notion-native block tree | inline | Notion (write) |
| `slack_draft` | `{ blocks: SlackBlock[], text_fallback, attachments[] }` — Slack Block Kit | inline | Slack (write) |
| `github_issue` | `{ title, body_markdown, labels[], assignees[], milestone? }` | inline | GitHub Issues API |
| `github_pr_review` | `{ pr_url, summary_markdown, line_comments[], overall_verdict: 'approve'\|'request_changes'\|'comment' }` | inline | GitHub PR Review API |
| `csv_spreadsheet` | `{ columns: string[], rows: Cell[][], delimiter, encoding }` plus body text | inline if < 256KB, R2 otherwise | file |
| `pdf_export` | `{ source_markdown_artifact_id, page_count, byte_size, mime_type: 'application/pdf' }` — body is always R2 blob | always R2 | file |
| `pptx_export` | `{ source_outline, slide_count, byte_size, mime_type: 'application/vnd.openxmlformats...' }` — body is always R2 blob | always R2 | file |

**Why per-kind schemas, not a blob.** Each kind has different validation rules (Notion blocks have nested children with type constraints; Slack Block Kit has a 50-block limit; PDF body is bytes not JSON). A unified `body_json: unknown` would push every validation to the exporter, the diff view, the section parser. Per-kind schemas at the registry boundary mean every consumer (exporter, diff, section traceability) has a typed surface.

**Why nine and not eight.** The proposal calls out the eight Gateway Console types plus `evidence_bundle`. Including the bundle as a first-class artifact (rather than a `markdown_report` attachment) makes "ship the evidence bundle to GitHub Pages" or "publish the bundle alongside the report" trivial — both are just exporters.

**Alternatives considered.**
- *Single `artifact_body_json` blob with discriminator* — rejected: replicates the pipeline-tool-registry mistake; no schema enforcement; exporters become parser graveyards
- *Auto-derive Notion / Slack / GitHub kinds from `markdown_report`* — rejected for v1: each destination has structural constraints (Slack 50-block cap, Notion block-nesting rules, GitHub Markdown flavor) that make the lossy conversion happen at exporter time, not at type-system time; v2 can add `from_markdown` factories per kind
- *Drop `pptx_export` from v1* — rejected: listed in the proposal; flag-gated so it ships dark until the generator is chosen (see Open Question Q1)

### D2: D1 schema — four new tables, migration `0016_agent_artifact.sql`

**Decision.** Four tables; migration slots after `agent-evidence`'s `0014_agent_evidence.sql`. Same denormalization pattern: hot read columns duplicated for query speed, foreign keys for integrity.

```sql
-- 0016_agent_artifact.sql

CREATE TABLE artifact_definitions (
  artifact_id TEXT PRIMARY KEY,                -- UUID; one per (flow_id, kind, logical_name)
  flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  kind TEXT NOT NULL CHECK (kind IN (
    'markdown_report','evidence_bundle','notion_page','slack_draft',
    'github_issue','github_pr_review','csv_spreadsheet','pdf_export','pptx_export'
  )),
  logical_name TEXT NOT NULL,                  -- e.g. "deep-research/final-report"
  inputs_hash TEXT NOT NULL,                   -- sha256 of canonicalized flow inputs that uniquely identify this chain
  latest_version_id TEXT,                      -- nullable until first version materializes
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (flow_id, kind, logical_name, inputs_hash)
);
CREATE INDEX idx_artifact_definitions_flow ON artifact_definitions(flow_id, kind);

CREATE TABLE artifact_versions (
  version_id TEXT PRIMARY KEY,                 -- UUID
  artifact_id TEXT NOT NULL REFERENCES artifact_definitions(artifact_id),
  parent_version_id TEXT REFERENCES artifact_versions(version_id),  -- git-like history
  flow_run_id TEXT NOT NULL REFERENCES flow_runs(flow_run_id),
  org_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,             -- monotonic per artifact_id
  kind TEXT NOT NULL,                          -- denormalized from definition for fast filtering
  body_inline TEXT,                            -- JSON or text body when < 256KB
  body_blob_uri TEXT,                          -- R2 key when body offloaded
  body_byte_size INTEGER NOT NULL,             -- total body size before storage decision
  body_content_hash TEXT NOT NULL,             -- sha256 of canonicalized body; identifies identical re-runs
  approval_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (approval_status IN ('draft','approved','rejected','published')),
  resolved_by TEXT,                            -- admin user id that flipped to approved/rejected
  resolved_at INTEGER,
  generated_by_step_id TEXT,                   -- the flow step that produced this version
  regenerated_from_step_id TEXT,               -- when this is a regenerate-from-step result
  created_at INTEGER NOT NULL,
  CHECK ((body_inline IS NULL) <> (body_blob_uri IS NULL)),  -- XOR: never both
  UNIQUE (artifact_id, version_number)
);
CREATE INDEX idx_artifact_versions_artifact ON artifact_versions(artifact_id, version_number DESC);
CREATE INDEX idx_artifact_versions_run ON artifact_versions(flow_run_id);
CREATE INDEX idx_artifact_versions_status ON artifact_versions(approval_status, created_at DESC);

CREATE TABLE artifact_sections (
  section_id TEXT PRIMARY KEY,                 -- UUID
  version_id TEXT NOT NULL REFERENCES artifact_versions(version_id),
  artifact_id TEXT NOT NULL REFERENCES artifact_definitions(artifact_id),  -- denormalized for org-scope queries
  org_id TEXT NOT NULL,
  section_key TEXT NOT NULL,                   -- stable id ("introduction", "findings.0", ...)
  ordinal INTEGER NOT NULL,                    -- render order
  heading TEXT,
  body_text TEXT,                              -- the section's content as text (for diff)
  body_json TEXT,                              -- kind-specific structured body (Notion blocks, etc.)
  flow_step_run_id TEXT REFERENCES flow_step_runs(step_run_id),  -- which step wrote this section
  claim_ids_json TEXT,                         -- JSON array of evidence_claims.claim_id
  source_ids_json TEXT,                        -- JSON array of evidence_sources.source_id (rollup for fast read)
  approval_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (approval_status IN ('draft','approved','rejected')),
  resolved_by TEXT,
  resolved_at INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE (version_id, section_key)
);
CREATE INDEX idx_artifact_sections_version ON artifact_sections(version_id, ordinal);
CREATE INDEX idx_artifact_sections_step ON artifact_sections(flow_step_run_id);

CREATE TABLE artifact_exports (
  export_id TEXT PRIMARY KEY,                  -- UUID
  version_id TEXT NOT NULL REFERENCES artifact_versions(version_id),
  artifact_id TEXT NOT NULL REFERENCES artifact_definitions(artifact_id),
  org_id TEXT NOT NULL,
  exporter_id TEXT NOT NULL,                   -- 'file','notion','slack','github_issue','github_pr_review','pdf','pptx'
  target_config_json TEXT NOT NULL,            -- destination params (channel id, page parent id, repo path, ...)
  approval_request_id TEXT REFERENCES agent_approval_requests(approval_id),
  external_id TEXT,                            -- destination-returned id (Notion page id, Slack ts, GitHub issue number, ...)
  provider_call_ids_json TEXT,                 -- JSON array of agent_tool_calls.call_id used by the exporter
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','awaiting_approval','running','succeeded','failed','cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error_json TEXT,
  requested_at INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX idx_artifact_exports_version ON artifact_exports(version_id);
CREATE INDEX idx_artifact_exports_status ON artifact_exports(status, requested_at DESC);
```

**Why four tables.** Definitions track the logical artifact identity (one chain per flow + inputs); versions hold immutable bodies with parent links; sections decompose a version for traceability and partial approval; exports track destination-side state. Collapsing any pair loses queryability — e.g. exports on the version row would force `latest_version_id` joins for every export listing.

**Why `inputs_hash` on the definition row.** A flow run with different inputs is conceptually a different artifact chain (re-running `deep-research` on topic X is unrelated to running it on topic Y). Hashing canonicalized inputs gives a stable identity; same-input re-runs append to the existing chain via `parent_version_id`.

**Alternatives considered.**
- *One `artifacts` table with `body_json` blob and JSON sections array* — rejected per D1 rationale; no FK enforcement on sections → flow_step_runs link
- *Reuse evidence tables for sections* — rejected: evidence has its own lifecycle (extraction is async, sections are deterministic from step output); coupling drags both layers
- *Store body inline always (no R2)* — rejected: PDF / PPTX exports routinely exceed 1MB D1 row limit

### D3: Versioning — git-like chain per `(flow_id, inputs_hash)`, monotonic version numbers

**Decision.** Versioning lives at the `artifact_versions` table. Each new run on an existing `(flow_id, kind, logical_name, inputs_hash)` tuple appends a new row with `version_number = max + 1` and `parent_version_id` set to the previous latest. Identical re-runs (same `body_content_hash` as parent) are deduplicated: no new version, just a `agent_run_events` `kind='artifact_unchanged'` entry recording the no-op.

```typescript
async function materializeVersion(
  ctx: SyscallContext,
  artifactId: string,
  body: ArtifactBody,
  generatedByStepId: string
): Promise<ArtifactVersion> {
  const def = await loadDefinition(artifactId)
  const parent = def.latest_version_id ? await loadVersion(def.latest_version_id) : null
  const contentHash = sha256(canonicalize(body))
  if (parent && parent.body_content_hash === contentHash) {
    await ctx.emit('artifact_unchanged', { artifactId, parentVersionId: parent.version_id })
    return parent
  }
  const versionNumber = parent ? parent.version_number + 1 : 1
  const { inline, blobUri, byteSize } = await placeBody(body)
  const versionId = uuid()
  await db.batch([
    insertVersion({ versionId, artifactId, parentVersionId: parent?.version_id, versionNumber, ... }),
    insertSections(splitIntoSections(body, generatedByStepId)),
    updateDefinitionLatest(artifactId, versionId),
  ])
  return loadVersion(versionId)
}
```

**Why monotonic numbers, not hashes.** Hashes are stable identifiers; numbers are reviewable handles (`v3 vs v4` reads better than `9f0a... vs b21c...`). Both live on the row — hash for dedup logic, number for UX. Matches `agent-flow` D5 versioning rationale.

**Why `parent_version_id` and not just version number.** The number is monotonic within a chain; the parent link lets the diff view (D7) walk arbitrary version pairs and the regenerate API (D6) record provenance ("this version was a regenerate of `v3.step_id=verify`"). A flat number alone can't express "v5 is a fork from v3" if branching is ever added.

**Inputs hashing.** `inputs_hash = sha256(canonicalize(flow_inputs_subset))` where the subset is declared per flow in the YAML (`artifact_identity_inputs: [topic, audience]`) — defaults to all flow inputs if unspecified. Canonicalization sorts keys and normalizes whitespace. Inputs not in the subset (e.g. `freshness_days`) don't fragment the chain; this is what makes re-running the same research with a different freshness window append rather than fork.

**Alternatives considered.**
- *Always overwrite — single row per `(artifact_id)`* — rejected: destroys history; can't diff; can't audit "what did we ship last week"
- *SHA-only version identifier in URL* — rejected: human-unfriendly; per D5 in agent-flow
- *Branch / merge UX (full git semantics)* — rejected for v1: complexity explosion; linear chains cover every observed need; revisit if a use case appears

### D4: R2 storage — reuse `R2_AGENT_MEMORY` bucket, `artifact/` prefix, 256KB threshold

**Decision.** Mirror `agent-evidence` D10 exactly. Inline body when `byteSize < 256KB`; otherwise write to R2 at key:

```
artifact/{flow_run_id}/{artifact_id}/{version_id}/body.{ext}
```

Where `ext` is `md` for markdown, `json` for structured, `pdf` / `pptx` / `csv` for binary kinds. `body_inline` is the body text (for text kinds, ready to render) or `NULL` (for binary kinds where inline would be base64-bloat); `body_blob_uri` is the R2 key or `NULL`. The schema enforces XOR (`CHECK ((body_inline IS NULL) <> (body_blob_uri IS NULL))`).

| Kind | Default storage path | Threshold behavior |
|---|---|---|
| `markdown_report` | inline | R2 above 256KB |
| `evidence_bundle` | inline | R2 above 256KB (rare in practice; bundles are typically 5–50KB) |
| `notion_page`, `slack_draft`, `github_issue`, `github_pr_review` | inline (structured JSON; small) | R2 above 256KB |
| `csv_spreadsheet` | inline | R2 above 256KB |
| `pdf_export`, `pptx_export` | always R2 | binary kinds never inline |

**Why the existing bucket.** Provisioning a new R2 bucket per change adds an operational tier and a billing line. Prefix-namespacing (`artifact/` vs evidence's `evidence/`) gives the same isolation. Matches `agent-evidence` D10 rationale.

**Why 256KB.** Same threshold as `agent-memory` (`agent-os` D2) and `agent-evidence` (D10). Operators reason about one blob policy across the platform. D1's 1MB row limit leaves headroom for sibling columns.

**Read helper.** `loadVersionBody(version)` returns `version.body_inline ?? r2Get(version.body_blob_uri)`. Callers don't branch on storage.

**Alternatives considered.**
- *New `R2_AGENT_ARTIFACTS` bucket* — rejected per existing pattern; bucket count adds infra cost without isolation benefit
- *Always R2* — rejected: tiny bodies (Slack draft is ~2KB) pay the R2 lookup latency for no win
- *Compress before inline decision* — rejected for v1; revisit if D1 storage cost shows up

### D5: Section-level traceability — sections reference `(flow_step_run_id, claim_ids[])`

**Decision.** Every artifact section row records exactly which flow step wrote it and which evidence claims (if any) it cites. This makes the per-paragraph provenance chain queryable without re-parsing the artifact body:

```sql
SELECT
  s.section_id, s.section_key, s.heading, s.body_text, s.ordinal,
  s.flow_step_run_id, fsr.step_id, fsr.step_type, fsr.agent_run_id,
  json_each.value AS claim_id
FROM artifact_sections s
LEFT JOIN flow_step_runs fsr ON fsr.step_run_id = s.flow_step_run_id
LEFT JOIN json_each(s.claim_ids_json)
WHERE s.version_id = ?
  AND s.org_id = ?
ORDER BY s.ordinal;
```

Joined with `agent-evidence`'s `EvidenceQueryAPI.getClaim(claim_id)`, the result powers "click on a paragraph in the rendered report → see the step that produced it → see every claim it cites → drill into each claim's source excerpts". This is the "how did this paragraph come to be?" UX from the Gateway Console plan.

**How sections get populated.** A `markdown_report` body is split at section boundaries (markdown H2 or explicit `<!-- section: id -->` comments) at materialization time. The splitter is one of:
- **Explicit** — the flow `artifact` step output declares `sections: [{ key, heading, body, claim_ids, flow_step_run_id }]`
- **Heuristic** — the splitter reads H2 headings as section boundaries; `claim_ids` is harvested from the section body by matching `[^claim:abc123]` footnote markers (the citation syntax `agent-evidence` writes when an agent cites a claim) and looking up the corresponding `claim_id`; `flow_step_run_id` is the step that owns the artifact step's input

Non-markdown kinds map their natural decomposition: `notion_page` sections = top-level blocks; `evidence_bundle` sections = each entity-kind group (sources / claims / conflicts / etc); structured kinds (Slack draft, GitHub PR review) typically materialize as one section since they have no internal partition that would meaningfully approve separately.

**Why per-section claim ids and not whole-version.** Two reasons. (1) Section approval (D10) needs to know which claims a reviewer is approving when they approve section 3 but not section 4. (2) When regenerate-from-step (D6) replaces section 3, the evidence linkage for sections 1–2 must remain intact; per-section storage makes this a row update, not a diff-merge.

**Alternatives considered.**
- *Whole-version claim list, no sections* — rejected: kills partial approval and per-paragraph drill-down
- *Reconstruct sections at read time by parsing the body* — rejected: parsing is lossy (heading-only sections vs nested blocks) and slow; storing the decomposition pays once at write
- *Section as a separate document type with own version chain* — rejected: section identity is per-version, not standalone; coupling sections to versions is correct

### D6: Regenerate-from-step — re-run one step, patch affected sections, new version

**Decision.** A new endpoint `POST /api/admin/artifacts/:artifactId/regenerate` takes `{ stepId, policyOverrides?, providerOverrides? }`. The kernel:

1. Loads the latest version's source flow run id and the compiled flow AST
2. Re-runs the named step via the flow runtime in **patch mode** (per agent-flow runtime; runs only the named step with the captured state from the previous run as input)
3. Per agent-policy / agent-providers (#5, #2), applies `policyOverrides` (e.g. stricter coverage threshold) and `providerOverrides` (e.g. swap LLM provider) for this step only
4. Collects the new step output, identifies which sections of the artifact were owned by that step (`WHERE flow_step_run_id = <old step run id>`), regenerates those sections from the new output
5. Composes a new version: unchanged sections cloned forward, affected sections replaced, `regenerated_from_step_id = <stepId>`, `parent_version_id = <previous latest>`, new `version_number`
6. Materializes via the same code path as D3

```typescript
async function regenerateFromStep(input: {
  artifactId: string
  stepId: string
  policyOverrides?: PolicyOverrides
  providerOverrides?: ProviderOverrides
}): Promise<ArtifactVersion> {
  const def = await loadDefinition(input.artifactId)
  const prev = await loadVersion(def.latest_version_id!)
  const flowRun = await loadFlowRun(prev.flow_run_id)
  const newStepOutput = await flowRuntime.runOneStep(flowRun, input.stepId, {
    policyOverrides: input.policyOverrides,
    providerOverrides: input.providerOverrides,
  })
  const oldSections = await loadSections(prev.version_id)
  const patchedSections = oldSections.map(s =>
    s.flow_step_run_id === prevStepRunIdFor(input.stepId, prev.version_id)
      ? regenerateSection(s, newStepOutput)
      : s
  )
  const newBody = composeArtifactBody(prev.kind, patchedSections)
  return materializeVersion(ctx, input.artifactId, newBody, input.stepId, {
    regeneratedFromStepId: input.stepId,
  })
}
```

**Why not "regenerate the whole artifact"?** Cost. Re-running `deep-research` end-to-end to change one citation in the verifier output is wasteful — the search and synthesis steps were fine. Patch-mode aligns with the "git-like history" framing: a regenerate is a focused commit, not a rebase.

**Boundaries with policy/providers.** Overrides here are **per-call**, not persistent. The previous policy/provider binding for the rest of the flow is unchanged; only this step's call(s) get the override. This is a deliberate division: persistent changes happen in the flow YAML or policy YAML, regenerate-from-step is an exploratory tool.

**Alternatives considered.**
- *Regenerate by re-running the whole flow with new state* — rejected: defeats the cost-saving purpose
- *Regenerate as an in-place edit of the existing version* — rejected: destroys the audit trail and the diff path
- *Regenerate as a branch (different `parent_version_id` than the latest)* — deferred: linear chain is enough for v1; branching can be added without schema change if the use case appears (every version already has `parent_version_id`)

### D7: Diff view — line-level, server-side rendered, existing diff library

**Decision.** `GET /api/admin/artifacts/versions/:a/diff/:b` returns a structured diff payload between two `artifact_versions` rows of the same `artifact_id`. Implementation uses the `diff` npm package (`Myers` algorithm, already in the wider Node ecosystem; chosen for its small bundle footprint vs `diff-match-patch`). The response shape:

```typescript
interface ArtifactDiff {
  artifact_id: string
  from: { version_id: string; version_number: number; created_at: number }
  to: { version_id: string; version_number: number; created_at: number }
  kind: ArtifactKind
  sections: Array<{
    section_key: string
    change: 'added' | 'removed' | 'modified' | 'unchanged'
    heading_diff?: DiffHunk[]    // when modified
    body_diff?: DiffHunk[]        // when modified
    claim_ids_changed?: { added: string[]; removed: string[] }
  }>
  body_diff_summary: { lines_added: number; lines_removed: number }
}
```

Diffs are computed per section (using section keys as alignment anchors) and then per body within matched sections. Unmatched section keys are emitted as `added` / `removed`. The body diff for text kinds (`markdown_report`, `csv_spreadsheet` rendered) is a standard line diff; for structured kinds (`notion_page`, `slack_draft`), the diff is computed on a canonicalized JSON serialization (sorted keys, normalized whitespace) — this gives operators a readable text diff even for block-tree kinds without requiring a block-aware visual diff engine.

**Why server-side.** Browsers can't read R2 directly (no public bucket exposure for artifacts); the diff endpoint loads both bodies inside the Worker, runs the diff, returns the structured payload. The console renders the diff with its existing markdown / JSON viewer — no new client-side diff library.

**Performance.** R8 risk addresses large-artifact diff cost: a 1MB body diffed against another 1MB body using Myers is ~50ms in V8. For artifacts > 5MB, the endpoint returns a `summary_only: true` response with line-counts but no hunks; full diff is opt-in via `?force_full=true` with a 10s timeout.

**Alternatives considered.**
- *Client-side diff* — rejected: doubles the bytes shipped to the browser (both bodies); duplicates the diff logic outside the audit boundary
- *`diff-match-patch` (Google's) for richer semantic diff* — rejected: 100KB+ bundle hit, marginally better output for prose; revisit if Myers output proves unreadable in practice
- *Tree-diff for structured kinds (Notion blocks)* — rejected for v1: implementation cost dwarfs the benefit; canonical JSON diff is good enough until operators ask for more

### D8: Exporter interface — pluggable per destination, kernel approval gate

**Decision.** Each destination is a typed exporter under `src/lib/agent-artifact/exporters/<destination>.ts`, exporting `createXExporter()` returning a frozen object that conforms to:

```typescript
export interface ArtifactExporter<TConfig, TArtifactKind extends ArtifactKind> {
  readonly id: string                                  // 'file' | 'notion' | 'slack' | 'github_issue' | ...
  readonly supportedKinds: TArtifactKind[]              // declared at registration
  readonly irreversible: boolean                       // true for Notion/Slack/GitHub writes
  validateConfig(config: unknown): TConfig             // Zod-validated target config
  async export(args: {
    ctx: SyscallContext
    version: ArtifactVersion
    body: ArtifactBody
    config: TConfig
  }): Promise<{
    externalId: string
    providerCallIds: number[]                          // links to agent_tool_calls rows
    metadata?: Record<string, unknown>
  }>
}
```

**Flow.**
1. Admin (or flow `artifact` step) calls `POST /api/admin/artifacts/versions/:id/export` with `{ exporter_id, target_config }`
2. The export orchestrator validates the version is `approved` (per D10 — exporters refuse to ship `draft` / `rejected` versions unless explicit `force: true` is passed by an authorized admin)
3. If `exporter.irreversible`, the orchestrator creates an `agent_approval_requests` row with the operator's intended action; the export row transitions to `awaiting_approval`
4. Upon approval, the orchestrator runs the exporter; the exporter delegates the actual external call to a Knowledge / Action provider via the kernel's `ctx.syscall(...)` (D9)
5. On success, `external_id` and `provider_call_ids_json` are written; status → `succeeded`; on failure, error is captured and retry policy (Open Question Q3) applies

**Why pluggable.** Each destination has unique config (Notion needs `database_id` + `parent_page_id`; Slack needs `channel_id`; GitHub needs `owner/repo`). A single "ExporterRunner" with a switch statement reproduces the pipeline-runner anti-pattern (`agent-flow` Context); per-destination files with a uniform interface keep the orchestrator dumb.

**Why kernel approval, not exporter-local.** Approvals are a cross-cutting concern; if every exporter rolled its own, the admin "pending approvals" inbox would be split across N sources. The kernel mechanism from `agent-os` D9 already handles this for syscalls; exporters use the same primitive.

**Alternatives considered.**
- *Single switch-case orchestrator* — rejected per `agent-flow` Context anti-pattern
- *Exporter as a step type in flow YAML* — rejected: exports happen after artifact materialization and approval, not as part of the flow run; conflating the two breaks the "draft → review → publish" cadence
- *Exporters as separate microservices* — rejected: violates the constraint that external writes go through `agent-providers`; double routing for no gain

### D9: Exporter dependency on `agent-providers` — every external call is a syscall

**Decision.** No exporter implements raw HTTP. Each delegates its destination-side call to a registered provider:

| Exporter | Provider category | Provider id | Syscall |
|---|---|---|---|
| `file` | n/a (writes to R2 bucket directly via `R2_AGENT_MEMORY`) | n/a | none — file is the trivial exporter that materializes the body in R2 |
| `notion` | Knowledge (write) | `notion` | `knowledge.write` with operation `pages.create` or `pages.update` |
| `slack` | Action | `slack` | `action.execute` with operation `chat.postMessage` (or `chat.update` for edits) |
| `github_issue` | Action | `github` | `action.execute` with operation `issues.create` |
| `github_pr_review` | Action | `github` | `action.execute` with operation `pulls.createReview` |
| `pdf_export` | Action or built-in (see Open Question Q1) | `pdf-generator` | `action.execute` with operation `generate.pdf`; output bytes stored to R2 by exporter |
| `pptx_export` | Action or built-in (see Open Question Q1) | `pptx-generator` | `action.execute` with operation `generate.pptx` |
| `csv_spreadsheet` | n/a — `file` exporter handles CSV inline | n/a | none |

**Why every external call routes through providers.** Three reasons: (1) credential management lives in `provider_credentials` (agent-providers D3), not in artifact code; (2) action providers carry the `irreversible: true` flag that gates kernel approval (agent-providers D9); (3) telemetry — every external call writes a row to `agent_tool_calls` with cost / latency / fallback index, so artifact exports inherit the same observability as any other syscall.

**Boundary with provider router.** The exporter knows the provider id and the operation it wants; the provider router knows how to authenticate and call. The exporter passes the artifact body / structured representation; the provider adapter handles the destination-specific format conversion (Markdown → Notion blocks happens inside the Notion knowledge provider when the operation is `pages.create_from_markdown`).

**Alternatives considered.**
- *Exporters use the SDK directly (bypass providers)* — rejected: duplicates credentials, breaks approval gate, splits telemetry
- *Providers do the section parsing / artifact transformation* — rejected: that's a destination-format concern, not an authentication / routing concern; transformation lives in the exporter

### D10: Approval status — whole-artifact and per-section, statuses `draft | approved | rejected | published`

**Decision.** Two parallel approval surfaces:

1. **Version-level** — `artifact_versions.approval_status` carries one of four states. Lifecycle: `draft` (initial) → `approved` (admin approves the whole artifact) or `rejected` (admin sends back). `published` is set when at least one export to a destination has succeeded (set by the export orchestrator, not directly by the admin).
2. **Section-level** — `artifact_sections.approval_status` carries `draft | approved | rejected`. An admin can approve sections individually; the version's status is computed: if all sections are `approved`, the version is automatically eligible for `approved` (admin still confirms with one click); if any section is `rejected`, the version cannot be `approved` until the rejected section is fixed (typically via D6 regenerate-from-step).

The two surfaces don't interlock automatically — section-level is a finer-grained tool, version-level is the gate exporters check. An admin can skip sections and approve the whole version (`force: true` on the version approve endpoint). A section-by-section workflow exists for high-stakes artifacts.

**Endpoints.**
- `POST /api/admin/artifacts/versions/:id/approve` — flips version status, records `resolved_by` / `resolved_at`
- `POST /api/admin/artifacts/versions/:id/reject` — same shape with a `reason` field stored in an `agent_run_events` row
- `POST /api/admin/artifacts/sections/:id/approve` and `.../reject` — per-section equivalents
- `GET /api/admin/artifacts/versions/:id/approval-summary` — returns `{ total, approved, rejected, draft }` section counts and the version's effective gate state

**Why `published` is exporter-set, not admin-set.** A reviewer approving the report doesn't ship it; only the export step does. Conflating the two would make "approve" feel destructive ("did clicking this just post to Slack?"). The lifecycle `draft → approved → published` is a clear two-step.

**Alternatives considered.**
- *Single status only, no per-section approval* — rejected: kills the high-stakes workflow where Section 1 is fine but Section 4 needs another verifier run
- *Per-section status only, derive version status* — rejected: requires every artifact to have meaningful section breakdown; structured kinds (Slack draft) where a single section is the whole artifact would still need a version-level flow
- *Polymorphic status enum (`partially_approved`)* — rejected: derivable from section counts; adds states without adding power

### D11: Feature flags — umbrella + per-type + per-exporter

**Decision.** Three layers of flags, added to `src/lib/config/flags.ts`:

```typescript
agentArtifact: {
  enabled: boolEnv('AGENT_ARTIFACT_ENABLED', false),

  // Per artifact type
  markdownReport: boolEnv('AGENT_ARTIFACT_MARKDOWN_REPORT', false),
  evidenceBundle: boolEnv('AGENT_ARTIFACT_EVIDENCE_BUNDLE', false),
  notionPage: boolEnv('AGENT_ARTIFACT_NOTION', false),
  slackDraft: boolEnv('AGENT_ARTIFACT_SLACK', false),
  githubIssue: boolEnv('AGENT_ARTIFACT_GITHUB_ISSUE', false),
  githubPrReview: boolEnv('AGENT_ARTIFACT_GITHUB_PR_REVIEW', false),
  csvSpreadsheet: boolEnv('AGENT_ARTIFACT_CSV', false),
  pdfExport: boolEnv('AGENT_ARTIFACT_PDF', false),
  pptxExport: boolEnv('AGENT_ARTIFACT_PPTX', false),

  // Per exporter destination (separate axis from kind — same kind can ship to multiple destinations)
  exporters: {
    file: boolEnv('AGENT_ARTIFACT_EXPORTER_FILE', false),
    notion: boolEnv('AGENT_ARTIFACT_EXPORTER_NOTION', false),
    slack: boolEnv('AGENT_ARTIFACT_EXPORTER_SLACK', false),
    githubIssue: boolEnv('AGENT_ARTIFACT_EXPORTER_GITHUB_ISSUE', false),
    githubPrReview: boolEnv('AGENT_ARTIFACT_EXPORTER_GITHUB_PR_REVIEW', false),
    pdf: boolEnv('AGENT_ARTIFACT_EXPORTER_PDF', false),
    pptx: boolEnv('AGENT_ARTIFACT_EXPORTER_PPTX', false),
  },
}
```

**Three axes:** umbrella + kind + exporter. The kind flag gates whether that artifact body can be materialized at all (so a flow declaring `artifact_type: pdf_export` with `AGENT_ARTIFACT_PDF=false` fails at compile-time); the exporter flag gates whether that destination is reachable. The two are deliberately orthogonal: `markdown_report` might be on (so reports materialize) while `notion` exporter is off (so they can't ship to Notion yet).

**Per-flow opt-out.** A flow YAML can declare `artifact: { extract: false }` at the top level to suppress artifact materialization for that flow; same pattern as `agent-evidence` D11.

**Alternatives considered.** Single umbrella flag rejected per CLAUDE.md mandate. Per-kind-only (no per-exporter axis) rejected: ships destinations together that have different blast radii (Slack < Notion < GitHub).

### D12: Migration path — markdown + evidence_bundle first, exporters one at a time

**Decision.** Six-step rollout. Initial two artifact types cover the existing `runPipeline.artifacts` array semantics that today's pipeline runner produces; subsequent steps add exporters and richer kinds. The `agent-pipelines-unify` follow-up change (#8) ports legacy pipeline `artifacts` rows onto this system mechanically once the v1 surface is stable.

**Step 1 — Schema + registry stubs (no flow integration).**
- D1 migration `0016_agent_artifact.sql`
- `src/lib/agent-artifact/{repo,api,kinds/<kind>}.ts` — readers/writers and per-kind Zod schemas for `markdown_report` and `evidence_bundle` (the two initial kinds)
- Register `AGENT_ARTIFACT_*` flags
- Read API (`GET /api/admin/artifacts`, `GET /api/admin/artifacts/:id/versions`, `GET /api/admin/artifacts/versions/:id`) returns empty results when flag off
- **Rollback.** Drop migration; delete directory.

**Step 2 — Flow integration for `markdown_report` + `evidence_bundle`.**
- `src/lib/agent-flow/runtime/steps/artifact.ts` swaps the placeholder for a real `materializeVersion` call
- `deep-research` reference flow updated: existing `export` step becomes the working `markdown_report` materializer; new `bundle_export` step adds `evidence_bundle` materialization
- Section splitting (heuristic) implemented for markdown reports
- **Rollback.** Set `AGENT_ARTIFACT_ENABLED=false` and `AGENT_ARTIFACT_MARKDOWN_REPORT=false`; the artifact step writes an `agent_run_events` `kind='artifact'` placeholder as before.

**Step 3 — Approval workflow + diff endpoint.**
- Version-level approve / reject endpoints
- Section-level approve / reject endpoints
- `GET .../diff/:b` endpoint (D7)
- `agent-console` (#7 — placeholder dependency) is the eventual UI; v1 ships JSON endpoints only
- **Rollback.** Approval endpoints return 404 when umbrella flag off; rows stay `draft`.

**Step 4 — First exporter: file (no external dependency).**
- `src/lib/agent-artifact/exporters/file.ts` — writes the body to R2 under a configurable target prefix
- Used by `deep-research` to publish the rendered report to a public preview URL
- **Rollback.** Disable `AGENT_ARTIFACT_EXPORTER_FILE=false`; existing export rows remain but no new exports.

**Step 5 — Approval-gated exporters: Slack → Notion → GitHub.**
- One exporter per PR, in this order (smallest blast radius first, matching `agent-providers` D11 Action sub-ordering)
- Each exporter validates against the irreversible-approval flow before going live
- Dry-run mode per exporter (`config.dryRun: true`) — logs the payload without calling out
- Per-destination flag stays off until each is exercised in dev against three different artifacts
- **Rollback.** Per-exporter flag off; export rows stuck in `awaiting_approval` resolve via the kernel's `approval_expired` path.

**Step 6 — PDF and PPTX exporters.**
- Resolution to Open Question Q1 (PDF generator choice) needs to land first
- Exporter writes to R2 as `pdf_export` or `pptx_export` version body
- **Rollback.** Per-type flag (`AGENT_ARTIFACT_PDF`) off; flow YAML referencing the kind fails compile-time.

**Step 7 (follow-up, separate change `agent-pipelines-unify`).**
- Port `runPipeline.artifacts` array entries onto this system
- Backfill old pipeline runs into `artifact_versions` (one version per historical run, parent links from sequencing)
- Lives outside this change; mentioned here so the migration path is complete

**Pre-merge verification per step.** `pnpm lint`, `pnpm build` (with `astro check`), `pnpm test`, `pnpm check:references`, plus manual smoke of the affected exporter / kind in local dev.

## Risks / Trade-offs

### R1: R2 cost for large blobs
**Risk.** PDF and PPTX exports of long reports easily hit 5–20MB each. A dogfood run rate of a few flows per day producing 5–10 versions per flow accumulates GB-scale storage over months; R2 storage cost grows linearly.
**Mitigation.** (a) Inline-vs-blob threshold (256KB) keeps small artifacts off R2. (b) Archive policy (Open Question Q2) for versions older than N days — soft-archive at 180 days, hard-delete blobs at 365 days, mirroring `agent-evidence` D10 / Q4. (c) Per-flow override (`artifact.retention_days`) for high-value artifacts that need indefinite retention. (d) PDF / PPTX bodies are byte-for-byte cacheable across identical re-runs (`body_content_hash` collision); the dedup short-circuit in D3 means identical re-runs never write a new blob.

### R2: Version chain unbounded growth
**Risk.** A flow regenerated 200 times produces 200 versions; admin UI listing pages get heavy; D1 row count balloons.
**Mitigation.** (a) Document a pruning policy (Open Question Q2) — defaults to "keep all approved + published versions plus the last 20 drafts per chain"; drafts older than 30 days are purgable. (b) Pruning is opt-in via a daily cron; deletion writes a tombstone (`agent_run_events` `kind='artifact_pruned'`) for audit. (c) UI lists are paginated by `version_number DESC`; default page size 25.

### R3: Exporter approval bottleneck
**Risk.** Every action exporter requires kernel approval (D8) — a high-throughput flow producing 10 Slack messages per minute creates 10 approval requests per minute; operator inbox floods.
**Mitigation.** (a) Per-exporter `approval_scope: 'channel' | 'session' | 'per_call'` (matches `agent-providers` D9 Slack example). Channel-scope approval covers all messages to a channel within a TTL window (default 1h). (b) Approval batching: pending requests for the same exporter / config dedup into one approval covering N pending exports. (c) Documented "approval fatigue" runbook: if a flow's approval-to-success ratio drops below 0.5, the flow is flagged for review and either gets an auto-approval policy (via `agent-policy` rules — out of scope here) or the underlying flow is restructured.

### R4: PDF / PPTX generation infrastructure (Workers limits)
**Risk.** PDF generation typically requires headless browser rendering or a layout engine; PPTX requires the OOXML / `python-pptx` ecosystem. Cloudflare Workers has tight CPU and memory limits; running either inside a Worker is unlikely to fit. External services (Browserless, Adobe API, Aspose) add billing and credentials.
**Mitigation.** (a) Open Question Q1 explicitly tracks the choice. (b) PDF / PPTX exporters ship dark (`AGENT_ARTIFACT_PDF=false`) until the generator decision is made and tested. (c) Cloudflare Browser Rendering API (rolled out 2025) is the leading candidate for PDF — it runs Chrome inside Cloudflare's edge; "render markdown → HTML → PDF" is a documented pattern. PPTX is harder; an external service (Aspose Cloud or a self-hosted `python-pptx` Worker on Fly.io) is the likely path. (d) Both kinds are decoupled from the rest of the change — flipping their flag on later does not require migrating existing data.

### R5: Section traceability breaking on regenerate
**Risk.** Regenerate-from-step (D6) patches sections that were owned by the re-run step. If the regenerated step's output structure differs from the previous (different section count, different headings), the patcher can't deterministically map old sections to new; the version may end up with phantom sections or lost claim links.
**Mitigation.** (a) Section keys are stable identifiers (semantic slugs from heading text + ordinal). When a regenerate produces a different set of keys, the patcher applies a 3-way diff (old version sections × new step output sections × manual overrides) and surfaces the unresolved diff to the admin for confirmation before materializing the new version. (b) For unresolved cases, the safe default is "replace the entire owned-by-step section group with the new step output"; this preserves correctness at the cost of a coarser diff. (c) The regenerate endpoint accepts an explicit `section_mapping_override` parameter for the admin to dictate the mapping when the heuristic isn't sufficient.

### R6: GitHub / Slack / Notion API rate limits
**Risk.** Each destination has its own rate limit (Slack: 1 message/sec/channel; GitHub: 5000 req/h/installation; Notion: 3 req/sec). A burst of exports hits the ceiling; exporter calls fail.
**Mitigation.** (a) Exporters delegate to `agent-providers` Action providers (D9); the provider router carries per-provider concurrency caps (agent-providers Q2) and 429-retry handling (agent-providers D4). (b) The export orchestrator queues exports per (exporter_id, target_config_signature) — at most one in-flight per Slack channel, per GitHub repo, per Notion database. (c) Exponential-backoff retry on 429 (default 3 attempts, max delay 30s) is the exporter-side policy; deeper recovery (cool-down + admin notification on persistent failure) is documented in the operations runbook.

### R7: Diff view performance on large artifacts
**Risk.** Two 5MB markdown reports diffed line-by-line via Myers in V8 can take 1–2 seconds and ~50MB working memory inside a Worker. Concurrent diff requests starve other handlers.
**Mitigation.** (a) Size threshold: artifacts > 1MB get a `summary_only` diff by default (counts only); full diff opt-in via `?force_full=true` with a 10s timeout. (b) Diff is computed on canonicalized form (whitespace-normalized) which often reduces working size by 20–30%. (c) Result caching: identical `(version_a_id, version_b_id, mode)` requests cache the diff payload in KV for 24h. (d) For artifacts > 5MB, the endpoint returns a 413 with guidance to use the section-level diff (`GET .../diff/:b?section=<key>`) which diffs one section at a time.

### R8: Concurrent regenerate on the same artifact creates parallel version chains
**Risk.** Two admins click "regenerate from step X" on the same artifact simultaneously; both observe `latest_version_id = v3` and both produce `v4` rows pointing at `v3` as parent; one of the inserts fails on the unique `(artifact_id, version_number)` constraint, the user sees an error, and the database has a dangling sub-run.
**Mitigation.** (a) The `UNIQUE (artifact_id, version_number)` constraint on `artifact_versions` is the correctness floor — the database refuses the second insert. (b) The regenerate handler wraps the version-number computation + insert in a D1 transaction with a SELECT FOR UPDATE on the `artifact_definitions` row; one regenerate at a time per artifact. (c) The losing client gets a `409 Conflict` with the winning version id and can choose to fork from the new latest or abort. (d) UI surfaces a "regenerate in progress" indicator polled from the definition row to prevent the second click in normal flow.

## Migration Plan

Six ordered steps, each a single PR, each flag-gated, with documented rollback. Step 1–2 establish the foundation and dogfood the simplest artifact types on `deep-research`. Step 3 adds the review surface. Steps 4–6 ship exporters in increasing blast-radius order. A seventh follow-up change (`agent-pipelines-unify`) ports legacy pipeline artifacts onto this system and lives outside this change.

**Step 1 — Schema + registry stubs (Markdown + Evidence Bundle kinds only).**
- D1 migration `0016_agent_artifact.sql` (D2)
- `src/lib/agent-artifact/{repo,api,kinds/{markdown-report,evidence-bundle}}.ts` — D1 writers/readers + Zod schemas for the two initial kinds
- Register `AGENT_ARTIFACT_*` flag entries in `src/lib/config/flags.ts`
- Admin read endpoints: `GET /api/admin/artifacts`, `.../artifacts/:id/versions`, `.../artifacts/versions/:id`
- Vitest tests for repo CRUD via in-memory backend (matches `agent-os` Resolution Q5 pattern); per-kind schema validation tests with fixtures
- **Rollback.** Drop migration; remove directory.

**Step 2 — Flow integration for `markdown_report` + `evidence_bundle`.**
- `src/lib/agent-flow/runtime/steps/artifact.ts` — replaces the agent-flow D2 placeholder with `materializeVersion()` invocation
- Section splitter (D5 heuristic: H2 boundaries + footnote-marker claim harvest)
- `deep-research` reference flow YAML updated: existing `export` step uses the new materializer; a `bundle_export` step is added that consumes `EvidenceQueryAPI.bundle(flow_run_id)` and writes an `evidence_bundle` artifact
- Integration test: run `deep-research`, assert both artifacts materialize, sections carry `claim_ids[]` linking to evidence rows, version chain shows `version_number=1`
- **Rollback.** `AGENT_ARTIFACT_ENABLED=false`; artifact step returns to placeholder.

**Step 3 — Approval workflow, diff endpoint, regenerate-from-step.**
- Version-level approve/reject endpoints (`POST .../versions/:id/{approve,reject}`)
- Section-level approve/reject endpoints (`POST .../sections/:id/{approve,reject}`)
- Approval summary endpoint (`GET .../versions/:id/approval-summary`)
- Diff endpoint (`GET .../versions/:a/diff/:b`) — D7
- Regenerate endpoint (`POST .../artifacts/:id/regenerate`) — D6
- Concurrent-regenerate handling (R8): transactional version-number allocation
- Vitest tests for state transitions, partial-approval semantics, diff payloads against fixture pairs
- **Rollback.** Endpoints return 404 when umbrella flag off; rows remain `draft`.

**Step 4 — File exporter (no external dependency).**
- `src/lib/agent-artifact/exporters/file.ts` — writes body to R2 at configurable prefix; no approval required (file exporter does not have `irreversible: true`)
- Export endpoint: `POST .../artifacts/versions/:id/export`
- `deep-research` reference flow's `markdown_report` artifact gets a default file export config pointing at a `R2_AGENT_MEMORY` prefix for preview hosting
- Vitest tests for body placement, target-config validation
- **Rollback.** `AGENT_ARTIFACT_EXPORTER_FILE=false`; existing exports remain queryable but no new exports.

**Step 5 — Approval-gated exporters: Slack → Notion → GitHub.**
- One exporter per PR in this order (matches `agent-providers` D11 Action sub-ordering by blast radius)
- Each exporter validates the kernel approval flow with at least three production exports before its flag goes live
- Slack first (`AGENT_ARTIFACT_EXPORTER_SLACK`): exporter posts the `markdown_report` body (truncated + linked back to R2 file export) to a configurable channel, gated by kernel approval (`agent-providers` Slack action provider's `irreversible: true`)
- Notion next (`AGENT_ARTIFACT_EXPORTER_NOTION`): exporter creates or updates a Notion page using the `notion` knowledge provider's `pages.create_from_markdown` operation
- GitHub last (`AGENT_ARTIFACT_EXPORTER_GITHUB_ISSUE`, `AGENT_ARTIFACT_EXPORTER_GITHUB_PR_REVIEW`): exporters create issues / PR reviews via the `github` action provider
- Each exporter has `dryRun: true` config for staging
- **Rollback.** Per-exporter flag off; pending exports time out via kernel approval-expired path.

**Step 6 — PDF and PPTX exporters (requires Open Question Q1 resolution).**
- PDF generator chosen (Cloudflare Browser Rendering API is the leading v1 candidate)
- `src/lib/agent-artifact/exporters/pdf.ts` — renders Markdown → HTML → PDF, writes PDF bytes to R2 as a `pdf_export` version body
- `pptx_export` defers to an external service decision (likely Aspose Cloud or a self-hosted Workers-compatible renderer); ships dark until selection
- **Rollback.** `AGENT_ARTIFACT_PDF=false` / `AGENT_ARTIFACT_PPTX=false`; flow YAML referencing those kinds fails compile-time validation.

**Step 7 (follow-up, `agent-pipelines-unify` change #8).**
- Out of scope for this change
- Ports `runPipeline.artifacts` array semantics onto `artifact_versions` rows; backfills historical pipeline runs (one version per run, parent links from run sequencing)
- Decommissions the pipeline runner's artifact array once flows + this system cover every pipeline use case

**Pre-merge verification per step (matches `agent-evidence` Step 7).**
- `pnpm lint` — oxlint clean
- `pnpm build` — astro check + production build
- `pnpm test` — new vitest suite + existing tests
- `pnpm check:references` — internal cross-references unchanged
- Manual smoke: trigger `deep-research`, materialize artifact, render in admin endpoint, run one exporter end-to-end against a staging destination

**Rollback strategy.** Every step is gated by a flag. The umbrella flag (`AGENT_ARTIFACT_ENABLED=false`) halts all materialization. Per-kind and per-exporter flags allow surgical disable. D1 rows are preserved on rollback (no destructive operation); R2 blobs accumulate until the archive policy (R1, Open Question Q2) lands.

## Open Questions

### Q1: PDF generator choice — Cloudflare Browser Rendering vs external vs hybrid?

**Discussion.** Three viable options:
- *Cloudflare Browser Rendering API (Workers-native).* Pros: same platform, no new credentials, latency stays inside Cloudflare. Cons: rendering quality for prose with footnotes / TOC is decent but not best-in-class; bound to Cloudflare's roadmap; pricing per session.
- *External service (Browserless, Adobe PDF Services, PDFShift).* Pros: typically higher rendering quality; mature; well-supported templates. Cons: another credentials story (handled by `agent-providers` D8 OAuth or service-account); per-page pricing; additional latency.
- *Hybrid — Markdown → HTML via a Workers function, then ship HTML to an external "HTML-to-PDF" service.* Splits cost: cheap HTML rendering in Workers, expensive PDF only when needed. Most flexible; most complexity.

**Default if probe inconclusive.** Cloudflare Browser Rendering API for v1 (resolution lands in Step 6). Document the decision; flag-gated rollout means an external service can swap in later without schema change (the `pdf_export` kind body is the same regardless of generator). PPTX is harder — no Cloudflare-native option exists; default plan is to defer PPTX exporter to v1.1 and select an external service then.

### Q2: Version chain pruning policy — keep all, keep N latest, or time-based?

**Discussion.** Unbounded version chains balloon D1 row count and R2 storage. Pruning is destructive (you can never recover a deleted version) so the default should be conservative.

**Default if probe inconclusive.** **Keep all approved + published versions indefinitely; prune drafts older than 30 days (default), keeping the last 20 drafts per chain regardless of age.** Pruning is opt-in via a daily cron + per-flow override (`artifact.retention.draft_days`, `artifact.retention.keep_n_drafts`). Pruning writes a tombstone (`agent_run_events` `kind='artifact_version_pruned'` with the deleted version's metadata) for audit. Hard-archive of R2 blobs follows `agent-evidence` D10 / Q4 pattern: blobs for archived versions move to a cheaper R2 tier or are deleted at 365 days.

### Q3: Export retry policy on external failure — per-exporter or per-destination-type?

**Discussion.** Slack returning 429 should retry with exponential backoff; Notion returning 5xx should retry; GitHub returning a permanent 403 (token scope insufficient) should not retry. The transient-vs-permanent classification depends on the destination, not the exporter abstraction.

**Default if probe inconclusive.** **Delegate retry classification to the `agent-providers` Action / Knowledge provider** (matches `agent-providers` D4 retry triggers). The exporter declares a maximum attempt count (default 3 for irreversible exporters, 1 for action-category writes where re-execution may double-post); the provider router runs the actual retry logic with its retry-class set. On permanent failure, the export row's status flips to `failed`; the admin can manually re-export from the version once the underlying issue is fixed (e.g. updated OAuth scopes). On transient exhaustion, the row flips to `failed` with `last_error_json.retryable=true`; a manual retry endpoint (`POST .../exports/:id/retry`) re-attempts without creating a new export row.

### Q4: Per-section vs whole-artifact approval workflow — when does each apply?

**Discussion.** Section-level approval (D10) shines for long-form `markdown_report` artifacts where reviewers want to sign off in pieces. It adds UI complexity to structured kinds (`slack_draft`, `notion_page`) where the "sections" are technical (block trees) rather than semantic (paragraph groups).

**Default if probe inconclusive.** **Per-kind decision documented in the kind schema:**
- `markdown_report`, `evidence_bundle`, `csv_spreadsheet` — section-level approval ON by default (these have meaningful semantic decomposition)
- `notion_page`, `slack_draft`, `github_issue`, `github_pr_review` — section-level approval OFF by default (single section = whole artifact); admins approve at the version level only
- `pdf_export`, `pptx_export` — derived from their source markdown / outline artifact's approval state (you can't approve a PDF independently of the report it was generated from); the export orchestrator refuses to materialize the PDF if the source artifact isn't approved

The kind-level default is overridable per-artifact via the artifact step config in flow YAML (`approval: { level: 'version' | 'section' }`). UX: the admin console hides the section-approval tab when the per-kind default is `version` to avoid showing affordances that lead nowhere.
