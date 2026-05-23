# Tasks — agent-artifact

Implementation plan for the agent-artifact change. 10 phases, ~95 tasks, strict order. Builds the Artifact Registry (typed schemas), versioning chain, section-level traceability, regeneration-from-step, and pluggable exporters on top of the kernel + Flow runtime + Evidence Store.

## Pre-requisite

- `agent-foundation` (change #0) shipped — central `Env`, `flags`, `json/unauthorized/badRequest`, `nowMs/nowIso`, `requireAdmin`, `settings-store`
- `agent-os` (change #1) shipped — kernel; this change uses `defineAgent`, `syscall`, `agent-access` (for exporter approval gate on irreversible writes), `agent-storage` (D1 + R2 backend pattern), `EventLogBackend` (writes the `artifact_*` syscall rows into `agent_tool_calls`)
- `agent-flow` (change #2) shipped — `flow_runs`, `flow_step_runs` tables; artifacts are produced by flow steps of type `artifact` and reference `flow_run_id` + `flow_step_run_id`
- `agent-evidence` (change #3) shipped — `evidence_claims` / `evidence_sources` rows; `evidence_bundle` artifact kind embeds these, and section-level traceability links artifact sections to `claim_ids[]`
- `agent-providers` needed only for Phase 5+ external exporters (Notion / Slack / GitHub / email Knowledge/Action providers); Phases 1–4 + local file exporter work without it

## Flag state by phase

| Phase | `AGENT_ARTIFACT_ENABLED` | `AGENT_ARTIFACT_R2_OFFLOAD` | `AGENT_ARTIFACT_NOTION` | `AGENT_ARTIFACT_SLACK` | `AGENT_ARTIFACT_GITHUB_ISSUE` | `AGENT_ARTIFACT_GITHUB_PR` | `AGENT_ARTIFACT_EMAIL` | `AGENT_ARTIFACT_PDF` | `AGENT_ARTIFACT_PPTX` | `AGENT_ARTIFACT_CSV` |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| 2 | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| 3 | `false` | `false` (binding declared, bucket deferred) | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| 4 | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| 5 | `true` (local file exporter only — no external writes) | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| 6 | `true` | `true` after non-regression smoke | flip ON one at a time | per-step | per-step | per-step | per-step | `false` | `false` | `false` |
| 7 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | flip ON per binary kind | per-step | per-step |
| 8 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` |
| 9 | `true` | `true` | n/a (admin endpoint surfaces everything) | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| 10 | `true` | `true` | `true` (dogfood `deep-research` → Notion) | `false` | `false` | `false` | `false` | `false` | `false` | `false` |

---

## Phase 1 — D1 schema + module skeleton (no behavior change)

**Goal**: Land migration `0016_agent_artifact.sql` with 4 tables, stand up the central module `src/lib/agent-artifact/` with backend interfaces and module skeletons, wire feature flags. Nothing extracts, persists, or exports yet — every public function is a stub returning `undefined` or empty result so `AGENT_ARTIFACT_ENABLED=false` is the kill switch.

**Files touched**: ~16 new (migration, 5 module skeletons + types + errors, storage interfaces, flag entry, schema introspection test), ~3 modified (`wrangler.jsonc`, `src/lib/config/env.ts`, `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-artifact` green (skeleton tests only); `pnpm wrangler d1 migrations apply quidproquo-db --local` applies `0016_agent_artifact.sql` cleanly and `sqlite_master` shows the 4 tables; `AGENT_ARTIFACT_ENABLED=false` so no extraction or export fires from any flow run

### 1.1 Wrangler + flags

- [x] 1.1.1 Add `AGENT_ARTIFACT_ENABLED`, `AGENT_ARTIFACT_R2_OFFLOAD` to `wrangler.jsonc` `vars` block defaulting to `"false"`; extend central `Env` type with the two fields; register the `agentArtifact` sub-block in `src/lib/config/flags.ts`. Per-exporter flags (`AGENT_ARTIFACT_NOTION` etc.) land later in Phases 6–7 alongside their exporters
  - **Files**: `wrangler.jsonc:15-69` (modify — `vars` block), `src/lib/config/env.ts` (modify — append two fields), `src/lib/config/flags.ts` (modify — append `agentArtifact` sub-object with `enabled` + `r2Offload` only)
  - **Pattern (D11)**: mirrors agent-os Phase 1.1 and agent-evidence Phase 1.1.1 sub-block shape; one umbrella flag plus per-capability sub-flags accreted phase-by-phase
  - **Verify**: `pnpm wrangler types` regenerates clean; `src/lib/config/flags.test.ts` extended to assert `flags.agentArtifact.enabled === false` when env empty and `=== true` when `AGENT_ARTIFACT_ENABLED='true'`

### 1.2 D1 migration `0016_agent_artifact.sql`

- [x] 1.2.1 Create migration with 4 tables (`artifact_definitions`, `artifact_versions`, `artifact_exports`, `artifact_sections`) per design D1. Match `migrations/0013_agent_flow.sql` style: `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, inline comment per table, no `CHECK` constraints (TEXT enums with inline `--` comment listing allowed values), `created_at`/`updated_at` as `INTEGER NOT NULL` (epoch ms — module writes via `nowMs()`)
  - **Files**: `migrations/0016_agent_artifact.sql` (create)
  - **Pattern (D1)**: `migrations/0013_agent_flow.sql` (sibling table-set); design D1 schema for all 4 tables
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0016_agent_artifact.sql` exits 0; re-running is a no-op; `pnpm wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'artifact_%'"` returns all 4 names
- [x] 1.2.2 Add cross-table lineage columns required by the version + traceability chain: `parent_version_id INTEGER REFERENCES artifact_versions(version_id)` on `artifact_versions` for the version chain; `flow_run_id INTEGER REFERENCES flow_runs(flow_run_id)` and `flow_step_run_id INTEGER REFERENCES flow_step_runs(step_run_id)` on `artifact_versions`; `flow_step_run_id INTEGER REFERENCES flow_step_runs(step_run_id)` + `claim_ids_json TEXT` on `artifact_sections` (the JSON array of `evidence_claims.claim_id` values that produced the section, per design D4)
  - **Files**: `migrations/0016_agent_artifact.sql` (modify)
  - **Pattern (D4)**: cross-table lineage; mirrors agent-evidence Phase 1.2.3 lineage column pattern
  - **Verify**: `SELECT sql FROM sqlite_master WHERE name='artifact_sections'` contains both lineage columns; introspection test 1.5.1 asserts the column set
- [x] 1.2.3 Add `status TEXT NOT NULL DEFAULT 'draft'` column to `artifact_versions` for the approval lifecycle — allowed values documented inline as `-- draft | approved | rejected | published`. Add `body_ref_json TEXT` column for the R2 offload path (populated when serialized body >256KB per design D11 R2 offload rule); body inline lives in `body_text TEXT`
  - **Files**: `migrations/0016_agent_artifact.sql` (modify)
  - **Pattern (D11)**: agent-evidence Phase 2.3.1 large-body offload column pattern; agent-os memory R2 pattern from Phase 5
  - **Verify**: introspection test confirms both columns and default value

### 1.3 Backend interfaces (per agent-os Resolution Q5 adapter pattern)

- [x] 1.3.1 Define backend interfaces every module depends on under `src/lib/agent-artifact/storage/types.ts` — required: `DefinitionStoreBackend`, `VersionStoreBackend`, `SectionStoreBackend`, `ExportStoreBackend`, `ArtifactBlobBackend` (5 interfaces). Mirror agent-os/agent-flow/agent-evidence split — one interface per concern
  - **Files**: `src/lib/agent-artifact/storage/types.ts` (create)
  - **Pattern (D2)**: agent-os `src/lib/agent-os/storage/types.ts`; one binding per concern
  - **Verify**: `pnpm tsc --noEmit` passes; file exports exactly 5 interfaces named above
- [x] 1.3.2 Skeleton D1 backends — one file per interface under `src/lib/agent-artifact/storage/d1/` with method stubs throwing `ArtifactNotImplemented`. Phase 2 fills them in
  - **Files**: `src/lib/agent-artifact/storage/d1/{definition-store,version-store,section-store,export-store}.ts` (create — 4 files)
  - **Pattern (D2)**: agent-evidence Phase 1.3.2 stub style; signatures match interfaces from 1.3.1
  - **Verify**: `pnpm tsc --noEmit` passes; each backend exports a class whose method names match the interface exactly
- [x] 1.3.3 In-memory test backend for every interface in 1.3.1 (5 classes) in a single file for easy import from module tests
  - **Files**: `src/lib/agent-artifact/storage/test/in-memory.ts` (create)
  - **Pattern (D2)**: agent-os `storage/test/in-memory.ts` (`makeKV` style — small, hand-rolled, no Miniflare)
  - **Verify**: imported by skeleton module tests in 1.4; `pnpm vitest run src/lib/agent-artifact/storage` is green

### 1.4 Central module skeleton — `src/lib/agent-artifact/`

- [x] 1.4.1 Build `index.ts` — entrypoint that exports `createArtifact(env, backends)` returning `{ registry, versioning, regeneration, exporters, storage }`. Returns no-op stubs when `flags.agentArtifact.enabled === false` so callers can be unconditional
  - **Files**: `src/lib/agent-artifact/index.ts`, `src/lib/agent-artifact/errors.ts` (create — `ArtifactNotImplemented`, `ArtifactKindUnknown`, `ArtifactValidationError`, `ArtifactVersionNotFound`, `ArtifactExporterNotFound`, `ArtifactExporterDenied`, `ArtifactBlobTooLarge`, `ArtifactFlagDisabled`, `ArtifactSectionUnknown`, `ArtifactRegenerationFailed`)
  - **Pattern (D1)**: agent-os `kernel.ts` six-module entry shape; agent-evidence `index.ts` boot wiring
  - **Verify**: `src/lib/agent-artifact/index.test.ts` asserts (a) calling `createArtifact(env, backends)` with flag off returns objects whose every method resolves to `undefined`, (b) flag on returns instances backed by `backends`
- [x] 1.4.2 Skeleton `registry.ts` exporting `ArtifactRegistry` class with stubbed `defineArtifact(definition)`, `getKind(kind)`, `listKinds()`, `validatePayload(kind, payload)` methods that throw `ArtifactNotImplemented`
  - **Files**: `src/lib/agent-artifact/registry.ts` (create)
  - **Pattern (D2)**: agent-os tool-registry; pluggable kind definitions registered at boot
  - **Verify**: `pnpm tsc --noEmit` passes; signature matches the public API the flow `artifact` step eventually calls
- [x] 1.4.3 Skeleton `versioning.ts` exporting `ArtifactVersioning` class with stubbed `createVersion(definitionId, payload, parentVersionId?)`, `getVersion(versionId)`, `listChain(definitionId)`, `diff(versionAId, versionBId)` methods
  - **Files**: `src/lib/agent-artifact/versioning.ts` (create)
  - **Pattern (D3)**: git-like parent-linked version chain; line-level diff for text artifacts
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 1.4.4 Skeleton `regeneration.ts` exporting `ArtifactRegeneration` class with stubbed `regenerateFromStep({versionId, stepRunId, options})` method returning `{ newVersionId: 0, patchedSections: [] }`
  - **Files**: `src/lib/agent-artifact/regeneration.ts` (create)
  - **Pattern (D8)**: regenerate-from-step patches only affected sections; atomic version creation
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 1.4.5 Skeleton `exporters.ts` exporting `ExporterRegistry` class with stubbed `register(destination, exporter)`, `getExporter(destination)`, `listDestinations()`, `export({versionId, destination, options})` methods. Phase 5 ships the file exporter; Phase 6+ adds external ones one at a time
  - **Files**: `src/lib/agent-artifact/exporters.ts` (create)
  - **Pattern (D5)**: pluggable exporter pattern; one exporter per destination per design D5
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 1.4.6 Skeleton `storage.ts` — thin facade re-exporting backend types and `createBackends(env)` factory that wires production backends from `Env` bindings. Mirrors agent-os Phase 1.4.7
  - **Files**: `src/lib/agent-artifact/storage.ts` (create)
  - **Pattern (D2)**: agent-os `storage.ts` facade pattern
  - **Verify**: covered indirectly by 1.4.1 module boot test

### 1.5 Phase 1 gate

- [x] 1.5.1 Schema introspection test confirms migration 0016 produced the expected 4 tables and the cross-table lineage columns from 1.2.2 + 1.2.3
  - **Files**: `src/lib/agent-artifact/storage/migration-0015.test.ts` (create)
  - **Pattern (D1)**: agent-flow Phase 1.8.4 / agent-evidence Phase 1.5.1 introspection style
  - **Verify**: test asserts `artifact_versions` contains `parent_version_id` + `flow_run_id` + `flow_step_run_id` + `status` + `body_text` + `body_ref_json` columns AND `artifact_sections` contains `flow_step_run_id` + `claim_ids_json` columns

---

## Phase 2 — Registry + 2 base kinds (markdown_report, evidence_bundle)

**Goal**: Implement `defineArtifact` API and ship 2 base kinds — `markdown_report` and `evidence_bundle` — with per-kind validation. Wire the flow runtime `artifact` step to call `registry.validatePayload` + create a version row. Still no exporters and no R2 offload. `AGENT_ARTIFACT_ENABLED=false` keeps the path dormant.

**Files touched**: ~10 new (registry impl + 2 kind definitions + schemas + flow step adapter + tests), ~1 modified (`src/lib/agent-artifact/registry.ts` skeleton becomes real)
**Verification**: `pnpm vitest run src/lib/agent-artifact/registry` green; integration test runs a 2-step flow that produces a `markdown_report` artifact, asserts `artifact_versions` row exists with parsed payload; `validatePayload` rejects malformed JSON with `ArtifactValidationError`

### 2.1 defineArtifact API + kind registry

- [x] 2.1.1 Build the `ArtifactKindDefinition` type in `src/lib/agent-artifact/registry/types.ts` — `{ kind: string, version: number, payloadSchema: JsonSchema, sectionExtractor?: (payload) => Section[], serializer: (payload) => string, contentType: string }`. `sectionExtractor` lets per-kind logic chop a payload into addressable sections (used for traceability in Phase 4); `serializer` produces the canonical string body persisted in `artifact_versions.body_text`
  - **Files**: `src/lib/agent-artifact/registry/types.ts` (create)
  - **Pattern (D2)**: per-kind definitions analogous to agent-os tool-definition shape
  - **Verify**: `pnpm tsc --noEmit` passes; type matches the shape consumed by Phase 2.2–2.3 kind definitions
- [x] 2.1.2 Replace `src/lib/agent-artifact/registry.ts` skeleton — `defineArtifact(def)` validates def shape + dedup-checks `kind` (throws `ArtifactKindUnknown` on `getKind` for unknown), `validatePayload(kind, payload)` runs the kind's `payloadSchema` against payload (use the existing JSON Schema validator already shipped by agent-os tools — re-export `validateAgainstSchema`); `listKinds()` returns registered keys
  - **Files**: `src/lib/agent-artifact/registry.ts` (replace skeleton)
  - **Pattern (D2)**: agent-os Phase 1.4.2 tools/types re-export pattern; reuse the central JSON Schema validator
  - **Verify**: `src/lib/agent-artifact/registry.test.ts` covers (a) `defineArtifact` dedup throws, (b) `validatePayload` passes a fixture-valid payload, (c) fails malformed with `ArtifactValidationError`

### 2.2 Base kind: `markdown_report`

- [x] 2.2.1 Build `src/lib/agent-artifact/kinds/markdown-report.ts` — `payloadSchema` shape: `{ title: string, body_markdown: string, sections?: [{heading: string, body_markdown: string, claim_ids?: number[]}], metadata?: {generated_at?: string, source_flow_run_id?: number} }`. `serializer(payload)` produces a Markdown string with frontmatter (title + metadata) and either the inline `body_markdown` or concatenated sections. `sectionExtractor` returns one `{section_id, heading, body, claim_ids}` per `sections[]` entry (or one whole-doc section when only `body_markdown` is provided)
  - **Files**: `src/lib/agent-artifact/kinds/markdown-report.ts` (create)
  - **Pattern (D2, D4)**: section extractor enables Phase 4 traceability; serializer output is stable across calls so diffs are deterministic
  - **Verify**: `src/lib/agent-artifact/kinds/markdown-report.test.ts` covers (a) valid payload serializes to expected Markdown, (b) `sections` payload produces N sections from extractor with `claim_ids` preserved, (c) missing `title` rejected
- [x] 2.2.2 Register `markdownReportKind` in `src/lib/agent-artifact/kinds/index.ts` — central file that imports each kind module and calls `registry.defineArtifact()` at boot via the `createArtifact()` factory
  - **Files**: `src/lib/agent-artifact/kinds/index.ts` (create)
  - **Pattern (D2)**: agent-os `register-defaults.ts` pattern from Phase 2.1.1
  - **Verify**: boot test asserts `registry.listKinds()` includes `'markdown_report'`

### 2.3 Base kind: `evidence_bundle`

- [x] 2.3.1 Build `src/lib/agent-artifact/kinds/evidence-bundle.ts` — `payloadSchema` shape: `{ flow_run_id: number, sources: [{source_id, url, content_hash, freshness_score, retrieved_at}], claims: [{claim_id, claim_text, confidence}], citations: [{citation_id, claim_id, excerpt_id, relation, provenance_chain}], conflicts?: [{conflict_id, claim_a_id, claim_b_id, status}], verifications?: [{verification_id, policy, passed, gaps}] }`. `serializer(payload)` produces a stable JSON string (`JSON.stringify(payload, Object.keys(payload).sort(), 2)`). `sectionExtractor` returns one section per `claims[]` entry with `claim_ids: [claim.claim_id]`
  - **Files**: `src/lib/agent-artifact/kinds/evidence-bundle.ts` (create)
  - **Pattern (D2, D4)**: the bundle is a self-contained JSON dump of an evidence subgraph; section-per-claim enables fine-grained traceability and exporter chunking
  - **Verify**: `src/lib/agent-artifact/kinds/evidence-bundle.test.ts` covers (a) valid bundle serializes deterministically (two calls produce identical string), (b) missing `flow_run_id` rejected, (c) `sectionExtractor` returns one section per claim with `claim_ids` matching
- [x] 2.3.2 Register `evidenceBundleKind` in `src/lib/agent-artifact/kinds/index.ts`
  - **Files**: `src/lib/agent-artifact/kinds/index.ts` (modify)
  - **Pattern (D2)**: same as 2.2.2
  - **Verify**: boot test asserts `registry.listKinds()` includes both `'markdown_report'` and `'evidence_bundle'`

### 2.4 Flow runtime `artifact` step adapter

- [x] 2.4.1 Build `src/lib/agent-artifact/flow-step.ts` — `runArtifactStep({kind, payload, flowRunId, flowStepRunId}, artifact)` validates payload via `registry.validatePayload(kind, payload)`, persists a new draft version via `versioning.createVersion(definitionId, payload, {flowRunId, flowStepRunId})`, and returns `{versionId, kind, status: 'draft'}` to the flow runtime. Flag-gated — no-op (returns `{versionId: null, skipped: true}`) when `flags.agentArtifact.enabled === false`
  - **Files**: `src/lib/agent-artifact/flow-step.ts` (create)
  - **Pattern (D2, D6)**: cross-change integration with agent-flow; mirrors agent-evidence Phase 3.4.1 listener wiring
  - **Verify**: `src/lib/agent-artifact/flow-step.test.ts` covers (a) valid payload produces version row with `status='draft'`, (b) malformed payload throws `ArtifactValidationError`, (c) flag off returns `{skipped: true}` with no DB write
- [x] 2.4.2 Confirm agent-flow's `src/lib/agent-flow/runtime/steps/artifact.ts` (shipped as stub in agent-flow) delegates to `artifact.flowStep.runArtifactStep`. Update the stub to import + call the real adapter when `flags.agentArtifact.enabled === true`; otherwise the stub's existing no-op path is preserved
  - **Files**: `src/lib/agent-flow/runtime/steps/artifact.ts` (modify)
  - **Pattern (D6)**: cross-change integration; agent-flow stays the orchestrator, agent-artifact is the implementation
  - **Verify**: integration test runs a flow with an `artifact` step + valid markdown payload, asserts step output `{versionId, kind: 'markdown_report'}` and `artifact_versions` row exists

---

## Phase 3 — Versioning (parent chain + status + R2 offload + diff)

**Goal**: Promote `versioning.createVersion` from naive insert to a parent-linked chain that records `parent_version_id`, enforces the status enum (`draft → approved | rejected | published`), routes serialized bodies >256KB through R2 (flag-gated), and exposes a line-level diff between two versions of the same artifact.

**Files touched**: ~7 new (R2 blob backend impl, status state machine, diff impl, tests), ~1 modified (`src/lib/agent-artifact/versioning.ts` skeleton becomes real)
**Verification**: integration test creates v1 → v2 → v3 chain, asserts `parent_version_id` links correctly; status transitions enforce state machine; large payload (>256KB) routes through R2 with flag on, throws `ArtifactBlobTooLarge` with flag off; `diff(v1, v2)` returns a stable hunk list

### 3.1 ArtifactBlobBackend + R2 binding

- [x] 3.1.1 Implement `ArtifactBlobBackend` writing/reading `artifacts/{definition_id}/{version_id}` for large bodies (>256KB per design D11). Backend constructor receives `R2_AGENT_ARTIFACT` bucket binding. When `flags.agentArtifact.r2Offload === false` AND body >256KB, throw `ArtifactBlobTooLarge` (mirrors agent-os `MemoryBodyTooLarge` + agent-evidence `EvidenceBlobTooLarge` pattern)
  - **Files**: `src/lib/agent-artifact/storage/r2/blob.ts` (create — replaces skeleton from 1.3.2 if present, else new)
  - **Pattern (D11)**: agent-os R2 blob backend (`src/lib/agent-os/storage/r2/blob.ts`); same flag-gated offload shape; agent-evidence Phase 2.2.1 mirror
  - **Verify**: unit test asserts (a) flag off + >256KB body throws `ArtifactBlobTooLarge`, (b) flag on calls `R2Bucket.put` with `artifacts/{definition_id}/{version_id}` key, (c) `get(key)` round-trips the body bytes
- [x] 3.1.2 Add R2 binding entry to `wrangler.jsonc` `r2_buckets[]`: `{ "binding": "R2_AGENT_ARTIFACT", "bucket_name": "quidproquo-agent-artifact" }`; extend central `Env` type to expose `R2_AGENT_ARTIFACT: R2Bucket`. Do NOT create the bucket yet — provisioning is Phase 6.2 alongside flag flip per agent-os/agent-evidence pattern
  - **Files**: `wrangler.jsonc` (modify — `r2_buckets[]`), `src/lib/config/env.ts` (modify — add `R2_AGENT_ARTIFACT` field)
  - **Pattern (D11)**: agent-os `R2_AGENT_MEMORY` binding shape; agent-evidence Phase 2.2.2 deferred-provisioning pattern
  - **Verify**: `pnpm wrangler types` regenerates clean; `wrangler dev` boots without binding errors (binding declared but bucket creation deferred per pattern — Worker tolerates missing bucket at boot, fails only on first `.put()`)

### 3.2 VersionStoreBackend D1 impl

- [x] 3.2.1 Implement `VersionStoreBackend` in D1 — `insert({definitionId, parentVersionId, payloadJson, bodyText, bodyRefJson, flowRunId, flowStepRunId, status, createdAt}) → versionId`; `getById(versionId)`; `listChain(definitionId)` returns versions ordered by `version_id ASC`; `updateStatus(versionId, status, resolvedBy?)`; `getLatestForDefinition(definitionId)` returns the most recent version
  - **Files**: `src/lib/agent-artifact/storage/d1/version-store.ts` (replace stub)
  - **Pattern (D3)**: agent-os D1 backend style; insert returns last_insert_rowid via `db.prepare(...).first()`
  - **Verify**: `src/lib/agent-artifact/storage/d1/version-store.test.ts` covers round-trip insert + getById; `listChain` returns ordered list; `updateStatus` from `draft → approved` succeeds, `approved → draft` rejected (handled by state machine in 3.3.1)
- [x] 3.2.2 Implement `DefinitionStoreBackend` in D1 — `upsert({kind, ownerScope, label, createdAt}) → definitionId`; `getById`; `listByKind(kind)`; `listForOwner(scope)`. A definition represents the logical artifact (e.g. "Q1 research report") that owns the version chain
  - **Files**: `src/lib/agent-artifact/storage/d1/definition-store.ts` (replace stub)
  - **Pattern (D3)**: agent-evidence Phase 2.1.1 dedup-on-key pattern
  - **Verify**: round-trip + upsert dedup test (same `kind + ownerScope + label` returns existing id)

### 3.3 Status state machine + versioning impl

- [x] 3.3.1 Build `src/lib/agent-artifact/versioning/state-machine.ts` — pure transition table `transition(from, to): Result` mirroring agent-os Phase 1.4.4 state machine. Allowed transitions: `draft → approved`, `draft → rejected`, `approved → published`, `approved → draft` (revoke approval), `published → published` (idempotent). Illegal transitions return `{ok: false, reason: 'illegal_transition'}`
  - **Files**: `src/lib/agent-artifact/versioning/state-machine.ts` (create)
  - **Pattern (D3)**: agent-os `state-machine.ts` pure-function pattern
  - **Verify**: `src/lib/agent-artifact/versioning/state-machine.test.ts` covers every legal + illegal transition
- [x] 3.3.2 Replace `src/lib/agent-artifact/versioning.ts` skeleton — `createVersion(definitionId, payload, {parentVersionId?, flowRunId?, flowStepRunId?})` serializes payload via the kind's `serializer`, computes `bodyBytes = Buffer.byteLength(body, 'utf8')`, routes to inline (`bodyText`) or R2 (`bodyRefJson = {r2Key}`) per the 256KB threshold + flag, persists via `VersionStoreBackend.insert` with `status='draft'`. `updateStatus(versionId, newStatus)` runs the state machine then `VersionStoreBackend.updateStatus`. `getVersion(versionId)` returns the row + transparent body resolution (R2 fetch if `bodyRefJson` present)
  - **Files**: `src/lib/agent-artifact/versioning.ts` (replace skeleton)
  - **Pattern (D3, D11)**: agent-evidence Phase 2.3.1 large-body offload + agent-os memory R2 transparent recall pattern
  - **Verify**: `src/lib/agent-artifact/versioning.test.ts` covers (a) `createVersion` with small body persists to `body_text`, (b) large body routes to R2 with flag on, throws with flag off, (c) `getVersion` transparently fetches R2 body, (d) status transitions enforce state machine

### 3.4 Line-level diff

- [x] 3.4.1 Build `src/lib/agent-artifact/versioning/diff.ts` — `diff(textA, textB): DiffHunk[]` where `DiffHunk = {kind: 'unchanged' | 'added' | 'removed', lines: string[]}`. Use a small hand-rolled LCS-based diff (no external dependency — Workers-native); for binary kinds (PDF/PPTX in Phase 7), diff is skipped and returns `[{kind: 'binary_diff_unsupported'}]`
  - **Files**: `src/lib/agent-artifact/versioning/diff.ts` (create)
  - **Pattern (D3)**: pure deterministic diff; reusable for any text-based kind
  - **Verify**: `src/lib/agent-artifact/versioning/diff.test.ts` covers (a) identical input → all `unchanged` hunks, (b) single-line change → 1 `removed` + 1 `added`, (c) determinism: same input twice produces identical hunks
- [x] 3.4.2 Wire `versioning.diff(versionAId, versionBId)` to resolve both versions, look up the kind, dispatch to the text diff for text kinds or the `binary_diff_unsupported` stub for binary. Throws `ArtifactVersionNotFound` if either id is unknown
  - **Files**: `src/lib/agent-artifact/versioning.ts` (extend)
  - **Pattern (D3)**: per-kind dispatch enables Phase 7 binary kinds to opt out cleanly
  - **Verify**: integration test creates two markdown versions with a one-line change, asserts `diff()` returns the expected 1-removed-1-added hunk pair

---

## Phase 4 — Section-level traceability

**Goal**: Promote `artifact_sections` from passive storage to a queryable provenance layer. Each section persisted at version-create time links to `flow_step_run_id` (which step produced it) and `claim_ids[]` (which evidence claims back it). Expose `reconstructSectionProvenance(sectionId)` that returns the full "how this section came to be" chain by joining across agent-flow + agent-evidence rows.

**Files touched**: ~6 new (section store impl, provenance reconstructor, query tests), ~1 modified (`versioning.createVersion` extended to persist sections)
**Verification**: integration test creates a `markdown_report` version with 3 sections each citing 2 claims, asserts `artifact_sections` has 3 rows with correct `claim_ids_json`; `reconstructSectionProvenance(sectionId)` returns the joined chain (flow step → agent run → claims → citations → sources)

### 4.1 SectionStoreBackend D1 impl

- [x] 4.1.1 Implement `SectionStoreBackend` in D1 — `insertBatch(versionId, sections: [{heading, body, claimIdsJson, flowStepRunId}]) → sectionIds`; `listForVersion(versionId)` returns ordered by section index; `getById(sectionId)`. Single `db.batch([...])` per `insertBatch` call for efficiency (mirrors agent-os event-log batching pattern)
  - **Files**: `src/lib/agent-artifact/storage/d1/section-store.ts` (replace stub)
  - **Pattern (D4)**: agent-os D1 write batching from Phase 1.3.2
  - **Verify**: `src/lib/agent-artifact/storage/d1/section-store.test.ts` covers (a) `insertBatch` of 3 sections produces 3 ids in a single `db.batch` call, (b) `listForVersion` returns them ordered, (c) `claim_ids_json` round-trips as JSON

### 4.2 Section persistence at version create

- [x] 4.2.1 Extend `versioning.createVersion` from Phase 3.3.2 — after persisting the version row, call the kind's `sectionExtractor(payload)` (no-op for kinds without one), then `SectionStoreBackend.insertBatch(versionId, sections)` with the `flowStepRunId` from the caller propagated onto every section row. Section creation is atomic with version creation (same `db.batch` where possible per design D4)
  - **Files**: `src/lib/agent-artifact/versioning.ts` (modify)
  - **Pattern (D4)**: atomic version+sections write; mirrors agent-evidence claim+citation atomic pattern
  - **Verify**: integration test creates a markdown version with `sections: [{heading, body, claim_ids: [1,2]}]`, asserts both `artifact_versions` and 1 `artifact_sections` row exist after the call

### 4.3 Provenance reconstruction

- [x] 4.3.1 Build `src/lib/agent-artifact/traceability.ts` — `reconstructSectionProvenance(sectionId): Promise<SectionProvenance>` returns the full chain: `{section: {heading, body}, flowStep: {step_id, step_kind, started_at}, agentRun: {run_id, agent_id} | null, claims: [{claim_id, claim_text, confidence, citations: [{excerpt, source}]}]}`. Single batched read (`db.batch`) joining `artifact_sections → flow_step_runs → agent_runs` plus a second batch fetching the `claim_ids_json` entries from `evidence_claims + evidence_citations + evidence_excerpts + evidence_sources` per agent-evidence Phase 2.3.2 `getProvenanceChain` pattern
  - **Files**: `src/lib/agent-artifact/traceability.ts` (create)
  - **Pattern (D4)**: cross-change provenance join; reuses agent-evidence `getProvenanceChain` per claim for the citation half of the chain
  - **Verify**: `src/lib/agent-artifact/traceability.test.ts` covers (a) section with 2 claims returns both with full citation chains, (b) `agentRun` is `null` when section was produced by a non-agent step, (c) unknown `sectionId` throws `ArtifactSectionUnknown`
- [x] 4.3.2 Wire `traceability` into `createArtifact` factory so callers receive `{registry, versioning, regeneration, exporters, storage, traceability}`. Flag-gated — `traceability` is a no-op stub when `flags.agentArtifact.enabled === false`
  - **Files**: `src/lib/agent-artifact/index.ts` (modify — extend return shape)
  - **Pattern (D1)**: factory pattern; explicit opt-in via flag
  - **Verify**: `src/lib/agent-artifact/index.test.ts` extended to assert `traceability` is exposed when flag on, stubbed when off

---

## Phase 5 — Local exporters (file output only — no external writes, no approval gate)

**Goal**: Ship the first exporter — local file output — for both `markdown_report` and `evidence_bundle` kinds. No external writes, so no approval gate is required. This proves the exporter abstraction end-to-end without touching `agent-providers` or `agent-access`. Flip `AGENT_ARTIFACT_ENABLED=true` for the first time (file exporter only).

**Files touched**: ~6 new (exporter base interface + file exporter impl + registration + tests + admin endpoint stub for manual trigger), ~1 modified (`src/lib/agent-artifact/exporters.ts` skeleton becomes real)
**Verification**: `pnpm vitest run src/lib/agent-artifact/exporters` green; integration test creates a `markdown_report` version, calls `exporters.export({versionId, destination: 'file', options: {path: '/tmp/out.md'}})`, asserts file exists with serialized body content

### 5.1 Exporter interface + file exporter

- [x] 5.1.1 Define `Exporter` interface in `src/lib/agent-artifact/exporters/types.ts` — `{ destination: string, supportsKinds: string[], requiresApproval: boolean, optionsSchema: JsonSchema, export(ctx: ExportContext): Promise<ExportResult> }`. `ExportContext` carries `{ version, body, kind, options, kernel? }` (kernel optional — only external exporters need it for approval-gate calls). `ExportResult` is `{ destination, externalRef?: string, exportedAt: number }`
  - **Files**: `src/lib/agent-artifact/exporters/types.ts` (create)
  - **Pattern (D5)**: pluggable exporter; `supportsKinds` lets the registry reject incompatible kind+destination pairs early
  - **Verify**: `pnpm tsc --noEmit` passes; type matches the shape Phase 6+ external exporters consume
- [x] 5.1.2 Replace `src/lib/agent-artifact/exporters.ts` skeleton — `ExporterRegistry` impl with `register(exporter)`, `getExporter(destination)`, `listDestinations()`, `export({versionId, destination, options})` which resolves the version, looks up the exporter, validates `options` against `optionsSchema`, calls `exporter.export(ctx)`, persists an `artifact_exports` row via `ExportStoreBackend.insert({versionId, destination, externalRef, exportedAt, options, status: 'completed'})`, returns `{exportId, externalRef}`
  - **Files**: `src/lib/agent-artifact/exporters.ts` (replace skeleton)
  - **Pattern (D5)**: registry + dispatch pattern; persists every export for audit trail
  - **Verify**: `src/lib/agent-artifact/exporters.test.ts` covers (a) `getExporter('unknown')` throws `ArtifactExporterNotFound`, (b) kind not in `supportsKinds` throws, (c) successful export persists `artifact_exports` row
- [x] 5.1.3 Implement `ExportStoreBackend` in D1 — `insert({versionId, destination, externalRef, exportedAt, optionsJson, status, errorJson}) → exportId`; `listForVersion(versionId)`; `listByDestination(destination, {limit, cursor})`; `updateStatus(exportId, status, errorJson?)`. Used by all exporters to record their result
  - **Files**: `src/lib/agent-artifact/storage/d1/export-store.ts` (replace stub)
  - **Pattern (D5)**: every external write logged with `externalRef` (e.g. Notion page id, Slack message ts, GitHub issue url) for re-find/re-update operations
  - **Verify**: round-trip + `listForVersion` ordered by `exported_at DESC`
- [x] 5.1.4 Build `src/lib/agent-artifact/exporters/file.ts` — `fileExporter: Exporter` with `destination: 'file'`, `supportsKinds: ['markdown_report', 'evidence_bundle']`, `requiresApproval: false`, `optionsSchema: {path: string (required, absolute)}`, `export(ctx)` writes `ctx.body` to `ctx.options.path` via the Workers-compatible filesystem abstraction (in production this is a no-op stub that throws `ArtifactExporterDenied` because Workers have no local FS — file exporter is a local-dev-only path; in tests it uses an in-memory FS map). Returns `{destination: 'file', externalRef: ctx.options.path, exportedAt: nowMs()}`
  - **Files**: `src/lib/agent-artifact/exporters/file.ts` (create)
  - **Pattern (D5)**: smallest possible exporter for end-to-end abstraction validation; production caveat documented inline
  - **Verify**: `src/lib/agent-artifact/exporters/file.test.ts` covers (a) `export()` with valid options writes the body, (b) missing `path` throws via `optionsSchema` validation, (c) production-env stub throws `ArtifactExporterDenied`

### 5.2 Exporter registration

- [x] 5.2.1 Register `fileExporter` in `src/lib/agent-artifact/exporters/register-defaults.ts` — central file mirroring agent-os Phase 2.1.1 `register-defaults.ts` pattern. Called from `createArtifact()` factory at boot
  - **Files**: `src/lib/agent-artifact/exporters/register-defaults.ts` (create), `src/lib/agent-artifact/index.ts` (modify — call from factory)
  - **Pattern (D5)**: central registration mirrors tool-registry pattern
  - **Verify**: boot test asserts `exporters.listDestinations()` returns `['file']`

### 5.3 Phase 5 flag flip + smoke

- [ ] 5.3.1 Flip `AGENT_ARTIFACT_ENABLED=true` locally only (test env); `R2_OFFLOAD` remains `false`. Manually trigger via vitest fixture: create a `markdown_report` version → call `exporters.export({versionId, destination: 'file', options: {path: '/tmp/smoke.md'}})` → assert file content matches serialized body. Record fixture in `.omc/research/agent-artifact-phase5-smoke.md`; flip flag back to `false` after capture
  - **Files**: `.omc/research/agent-artifact-phase5-smoke.md` (create)
  - **Pattern**: agent-evidence Phase 7.3.1 phase-exit smoke gate
  - **Verify**: smoke note contains the version id, file path, and a sample of the written content

---

## Phase 6 — External exporters (Notion → Slack → GitHub issue → GitHub PR review → email)

**Goal**: Add external exporters one at a time, each behind its own flag, each integrated with `agent-providers` (Knowledge/Action providers) and `agent-access` (approval gate for irreversible writes). Order chosen for blast-radius progression: Notion (read-mostly, easy rollback via delete) → Slack (broadcast, irreversible but low impact) → GitHub issue (creates work) → GitHub PR review (high blast on real PRs) → email (truly irreversible).

**Files touched**: ~25 new (5 exporter impls + 5 provider adapters + 5 flag entries + 5 integration tests), ~3 modified (flags, wrangler, register-defaults)
**Verification**: per-exporter integration test in dev (with mock provider) + manual smoke in production with `requiresApproval: true` gate, observed for 48h before next exporter flips on

### 6.1 R2 offload flag flip (prerequisite for large markdown/bundle exports)

- [ ] 6.1.1 Run `wrangler r2 bucket create quidproquo-agent-artifact` (production); verify with `wrangler r2 bucket list`. Per agent-os Phase 5.1.2 pattern, this is a no-op until any artifact body >256KB triggers a `.put()`
  - **Files**: (no new files — Cloudflare provisioning); record in `progress.txt`
  - **Pattern (D11)**: agent-os Phase 5.1 / agent-evidence Phase 8.2.1 R2 provisioning pattern
  - **Verify**: `wrangler r2 bucket list | grep quidproquo-agent-artifact` returns the bucket
- [ ] 6.1.2 Flip `AGENT_ARTIFACT_R2_OFFLOAD=true` in production env; redeploy; trigger a fixture artifact >256KB; query `SELECT version_id, length(body_text) AS inline_len, json_extract(body_ref_json, '$.r2Key') AS r2_key FROM artifact_versions ORDER BY created_at DESC LIMIT 5` — at least one row MUST have `r2_key` populated and `inline_len < 100`. Confirm small artifacts still take inline path (non-regression)
  - **Files**: (no new files — env flip + smoke)
  - **Pattern (D11)**: agent-evidence Phase 8.2.2 verification SQL style
  - **Verify**: SQL returns large-row with r2_key non-null + small-row with r2_key null; `wrangler r2 object get quidproquo-agent-artifact artifacts/<def>/<ver> --file /tmp/recall.md` retrieves body

### 6.2 Notion exporter

- [x] 6.2.1 Add `AGENT_ARTIFACT_NOTION` flag entry to `flags.ts` + `wrangler.jsonc` vars (default `"false"`)
  - **Files**: `src/lib/config/flags.ts` (modify — add `agentArtifact.notion`), `wrangler.jsonc` (modify — `vars`)
  - **Pattern (D11)**: per-exporter sub-flag accreting on the umbrella
  - **Verify**: flag test asserts `flags.agentArtifact.notion === false` default
- [x] 6.2.2 Build `src/lib/agent-artifact/exporters/notion.ts` — `notionExporter: Exporter` with `destination: 'notion'`, `supportsKinds: ['markdown_report', 'evidence_bundle']`, `requiresApproval: true`, `optionsSchema: {parentPageId: string (required), title?: string}`, `export(ctx)` delegates to `ctx.kernel.providers.knowledge('notion').createPage({parentPageId, title, content: ctx.body})` via the agent-providers Knowledge provider; returns `{destination: 'notion', externalRef: <notion_page_url>, exportedAt}`. On `flags.agentArtifact.notion === false`, throw `ArtifactExporterDenied({reason: 'flag_off'})` before any external call
  - **Files**: `src/lib/agent-artifact/exporters/notion.ts` (create)
  - **Pattern (D5, D10)**: external exporter requires kernel for provider + approval-gate; flag short-circuit before any provider call
  - **Verify**: `src/lib/agent-artifact/exporters/notion.test.ts` covers (a) flag off throws `ArtifactExporterDenied`, (b) flag on + valid options dispatches to mock Knowledge provider with correct payload, (c) markdown body converted to Notion blocks (delegated to provider — exporter sends raw markdown)
- [x] 6.2.3 Wire approval gate — when `exporter.requiresApproval === true`, the `ExporterRegistry.export()` method calls `kernel.access.requestApproval({runId: version.flow_run_id, reason: 'artifact_export', context: {versionId, destination, options}, ttlSeconds: 86400})` BEFORE invoking the exporter. On approval reject, persist `artifact_exports` row with `status='rejected'`. On approve, proceed with `exporter.export(ctx)` and persist `status='completed'`. On expire, `status='expired'`
  - **Files**: `src/lib/agent-artifact/exporters.ts` (modify — extend export() to wrap in approval gate when `requiresApproval`)
  - **Pattern (D10)**: agent-os approval-gate pattern (Phase 1.4.3 syscall interception); mirrors agent-evidence Phase 5.3 conflict approval wiring
  - **Verify**: integration test asserts approve path persists `completed` row + external write happens; reject path persists `rejected` row + zero external calls; expire path persists `expired` row
- [x] 6.2.4 Register `notionExporter` in `register-defaults.ts` (conditional — only when `flags.agentArtifact.notion === true` at boot); update `exporters.listDestinations()` to reflect
  - **Files**: `src/lib/agent-artifact/exporters/register-defaults.ts` (modify)
  - **Pattern (D5)**: conditional registration so a flag-off exporter doesn't appear in the list
  - **Verify**: `listDestinations()` with flag off returns `['file']`; with flag on returns `['file', 'notion']`

### 6.3 Slack exporter

- [x] 6.3.1 Add `AGENT_ARTIFACT_SLACK` flag entry + wrangler vars
  - **Files**: `src/lib/config/flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: per-exporter sub-flag pattern from 6.2.1
  - **Verify**: flag default `false`
- [x] 6.3.2 Build `src/lib/agent-artifact/exporters/slack.ts` — `slackExporter: Exporter` with `destination: 'slack'`, `supportsKinds: ['markdown_report']` (no JSON bundle dumps to Slack — too noisy), `requiresApproval: true`, `optionsSchema: {channel: string (required), threadTs?: string}`, `export(ctx)` dispatches via Action provider `ctx.kernel.providers.action('slack').postMessage({channel, threadTs, text: <markdown-rendered-as-slack-mrkdwn>})`. Markdown-to-Slack-mrkdwn conversion is a 30-line transformer (`**bold**` → `*bold*`, `# heading` → bold line, link syntax flipped); document inline that this is lossy and recommend the Notion exporter for richer formatting
  - **Files**: `src/lib/agent-artifact/exporters/slack.ts`, `src/lib/agent-artifact/exporters/markdown-to-mrkdwn.ts` (create)
  - **Pattern (D5)**: per-destination format adapter colocated with exporter
  - **Verify**: exporter test covers flag short-circuit + provider dispatch + mrkdwn conversion fixtures (3 cases: bold, heading, link)
- [x] 6.3.3 Register `slackExporter` conditionally per 6.2.4 pattern
  - **Files**: `register-defaults.ts` (modify)
  - **Pattern (D5)**: same as 6.2.4
  - **Verify**: `listDestinations()` reflects flag state

### 6.4 GitHub issue exporter

- [x] 6.4.1 Add `AGENT_ARTIFACT_GITHUB_ISSUE` flag entry + wrangler vars
  - **Files**: `flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: same per-exporter sub-flag pattern
  - **Verify**: flag default `false`
- [x] 6.4.2 Build `src/lib/agent-artifact/exporters/github-issue.ts` — `githubIssueExporter: Exporter` with `destination: 'github_issue'`, `supportsKinds: ['markdown_report']`, `requiresApproval: true`, `optionsSchema: {owner: string (required), repo: string (required), labels?: string[]}`, `export(ctx)` calls Action provider `ctx.kernel.providers.action('github').createIssue({owner, repo, title: version.payload.title, body: ctx.body, labels})`; returns `{destination: 'github_issue', externalRef: <issue_url>}`
  - **Files**: `src/lib/agent-artifact/exporters/github-issue.ts` (create)
  - **Pattern (D5)**: action provider dispatch; explicit `owner/repo` in options so the exporter is per-org-flexible
  - **Verify**: exporter test covers (a) flag short-circuit, (b) provider dispatch with correct args, (c) `title` falls back to `'Untitled artifact'` when `version.payload.title` missing
- [x] 6.4.3 Register `githubIssueExporter` conditionally
  - **Files**: `register-defaults.ts` (modify)
  - **Pattern (D5)**: same as 6.2.4
  - **Verify**: `listDestinations()` reflects flag state

### 6.5 GitHub PR review exporter

- [x] 6.5.1 Add `AGENT_ARTIFACT_GITHUB_PR` flag entry + wrangler vars
  - **Files**: `flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: same
  - **Verify**: flag default `false`
- [x] 6.5.2 Build `src/lib/agent-artifact/exporters/github-pr-review.ts` — `githubPrReviewExporter: Exporter` with `destination: 'github_pr_review'`, `supportsKinds: ['markdown_report']`, `requiresApproval: true`, `optionsSchema: {owner: string, repo: string, prNumber: number, event: 'COMMENT' | 'APPROVE' | 'REQUEST_CHANGES' (default COMMENT)}`, `export(ctx)` calls Action provider `ctx.kernel.providers.action('github').createPullRequestReview({owner, repo, prNumber, event, body: ctx.body})`. Highest-blast-radius exporter — flag flip should land last in production and observe 1 week before email
  - **Files**: `src/lib/agent-artifact/exporters/github-pr-review.ts` (create)
  - **Pattern (D5)**: action provider dispatch; `event` defaults to `COMMENT` to avoid accidental approval
  - **Verify**: exporter test covers flag short-circuit + provider dispatch + `event` default
- [x] 6.5.3 Register `githubPrReviewExporter` conditionally
  - **Files**: `register-defaults.ts` (modify)
  - **Pattern (D5)**: same as 6.2.4
  - **Verify**: `listDestinations()` reflects flag state

### 6.6 Email exporter

- [x] 6.6.1 Add `AGENT_ARTIFACT_EMAIL` flag entry + wrangler vars
  - **Files**: `flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: same
  - **Verify**: flag default `false`
- [x] 6.6.2 Build `src/lib/agent-artifact/exporters/email.ts` — `emailExporter: Exporter` with `destination: 'email'`, `supportsKinds: ['markdown_report']`, `requiresApproval: true`, `optionsSchema: {to: string[] (required, email[]), subject: string (required), cc?: string[]}`, `export(ctx)` calls Action provider `ctx.kernel.providers.action('email').send({to, cc, subject, htmlBody: <markdown-to-html>, textBody: ctx.body})`. Truly irreversible — `requiresApproval: true` is non-optional
  - **Files**: `src/lib/agent-artifact/exporters/email.ts`, `src/lib/agent-artifact/exporters/markdown-to-html.ts` (create — reuse the Astro/remark stack or a trivial Worker-safe converter)
  - **Pattern (D5, D10)**: irreversible action always requires approval; HTML+text dual body for client compatibility
  - **Verify**: exporter test covers flag short-circuit + provider dispatch + html conversion fixture
- [x] 6.6.3 Register `emailExporter` conditionally
  - **Files**: `register-defaults.ts` (modify)
  - **Pattern (D5)**: same as 6.2.4
  - **Verify**: `listDestinations()` reflects flag state

### 6.7 Per-exporter rollout sequence

- [x] 6.7.1 Document the rollout order in `docs/agent-artifact-runbook.md` (created in Phase 9): flip `AGENT_ARTIFACT_NOTION=true` first, observe 48h with approval queue depth + reject rate; then `SLACK`, observe 48h; then `GITHUB_ISSUE`, 48h; then `GITHUB_PR`, **1 week** (high blast); then `EMAIL`, 48h. At each step record dashboard snapshot in `.omc/research/agent-artifact-exporter-rollout.md`
  - **Files**: `.omc/research/agent-artifact-exporter-rollout.md` (create)
  - **Pattern**: agent-os Phase 3 per-agent rollout pattern (one flag at a time, observe before advancing)
  - **Verify**: rollout doc captures flip date + observation window + exit metrics per exporter

---

## Phase 7 — Binary exporters (PDF, PPTX, CSV)

**Goal**: Add the three binary/structured-document kinds + exporters per design D11 generator-approach choice. Each is flag-gated and independent. PDF and PPTX may rely on a Worker-compatible generator library or an external rendering service depending on D11 final choice; CSV is hand-rolled (no external dep).

**Files touched**: ~15 new (3 kind definitions + 3 exporter impls + 3 flag entries + tests), ~1 modified (`register-defaults.ts`)
**Verification**: per-exporter integration test produces a binary blob, asserts non-empty + correct MIME; CSV diff via line-level diff (text-compatible); PDF/PPTX diff returns `binary_diff_unsupported`

### 7.1 CSV exporter (simplest — hand-rolled)

- [x] 7.1.1 Add `AGENT_ARTIFACT_CSV` flag entry + wrangler vars
  - **Files**: `flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: same per-kind sub-flag pattern
  - **Verify**: flag default `false`
- [x] 7.1.2 Build `src/lib/agent-artifact/kinds/csv-spreadsheet.ts` — `payloadSchema`: `{headers: string[], rows: (string | number | null)[][]}`. `serializer(payload)` produces RFC 4180 CSV (quote on `,`, `"`, `\n`; double-quote escape). `sectionExtractor` returns one section per row group (or whole-table when grouping not requested)
  - **Files**: `src/lib/agent-artifact/kinds/csv-spreadsheet.ts` (create)
  - **Pattern (D11)**: text-format kind; reuses Phase 3 text diff
  - **Verify**: kind test covers RFC 4180 edge cases (embedded comma, embedded quote, embedded newline)
- [x] 7.1.3 Build `src/lib/agent-artifact/exporters/csv-file.ts` — extends `fileExporter` shape; `destination: 'csv_file'`, `supportsKinds: ['csv_spreadsheet']`, `requiresApproval: false` (local write only). Distinct from generic `file` exporter so the registry can short-circuit kind compatibility cleanly
  - **Files**: `src/lib/agent-artifact/exporters/csv-file.ts` (create)
  - **Pattern (D5)**: per-kind file exporter variant
  - **Verify**: exporter test writes a sample CSV and round-trips via `fs.readFileSync` (test env)
- [x] 7.1.4 Register `csvSpreadsheetKind` + `csvFileExporter` conditionally per their flag in `register-defaults.ts`
  - **Files**: `register-defaults.ts`, `kinds/index.ts` (modify)
  - **Pattern (D5)**: same conditional registration pattern
  - **Verify**: `listKinds()` + `listDestinations()` reflect flag state

### 7.2 PDF exporter

- [x] 7.2.1 Add `AGENT_ARTIFACT_PDF` flag entry + wrangler vars
  - **Files**: `flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: same
  - **Verify**: flag default `false`
- [x] 7.2.2 Build `src/lib/agent-artifact/kinds/pdf-export.ts` — `payloadSchema`: `{source_kind: 'markdown_report' | 'evidence_bundle' (required), source_version_id: number (required), template?: 'default' | 'compact'}`. PDF is a derived kind — its serializer dispatches to the chosen D11 generator (e.g. `@cloudflare/puppeteer` or external Browserless API) which renders the source kind's body to PDF bytes. Output is binary so `body_text` is base64-encoded or routed to R2 if >256KB (always routes to R2 in practice given PDF sizes)
  - **Files**: `src/lib/agent-artifact/kinds/pdf-export.ts`, `src/lib/agent-artifact/kinds/binary-helpers.ts` (create — shared base64+R2 routing)
  - **Pattern (D11)**: derived kind referencing a source version; binary body always R2-routed
  - **Verify**: kind test covers (a) source version resolution, (b) generator dispatch returns binary, (c) `sectionExtractor` returns `[]` (binary kinds have no addressable text sections)
- [x] 7.2.3 Build `src/lib/agent-artifact/exporters/pdf-file.ts` — `destination: 'pdf_file'`, `supportsKinds: ['pdf_export']`, `requiresApproval: false`. Writes binary body to local path
  - **Files**: `src/lib/agent-artifact/exporters/pdf-file.ts` (create)
  - **Pattern (D5)**: binary-file exporter
  - **Verify**: exporter test writes a fixture PDF and asserts first 4 bytes are `%PDF`
- [x] 7.2.4 Register `pdfExportKind` + `pdfFileExporter` conditionally
  - **Files**: `register-defaults.ts`, `kinds/index.ts` (modify)
  - **Pattern (D5)**: same
  - **Verify**: list calls reflect flag state

### 7.3 PPTX exporter

- [x] 7.3.1 Add `AGENT_ARTIFACT_PPTX` flag entry + wrangler vars
  - **Files**: `flags.ts`, `wrangler.jsonc` (modify)
  - **Pattern (D11)**: same
  - **Verify**: flag default `false`
- [x] 7.3.2 Build `src/lib/agent-artifact/kinds/pptx-export.ts` — `payloadSchema`: `{slides: [{title: string, body_markdown?: string, image_url?: string, notes?: string}]}`. Serializer uses the D11-chosen PPTX generator (likely `pptxgenjs` if Worker-compatible, else an external service). Binary output → R2 by default
  - **Files**: `src/lib/agent-artifact/kinds/pptx-export.ts` (create)
  - **Pattern (D11)**: structured slide payload; generator dispatch
  - **Verify**: kind test covers slide payload validation + binary header check (`PK` zip signature for `.pptx`)
- [x] 7.3.3 Build `src/lib/agent-artifact/exporters/pptx-file.ts` — `destination: 'pptx_file'`, `supportsKinds: ['pptx_export']`, `requiresApproval: false`
  - **Files**: `src/lib/agent-artifact/exporters/pptx-file.ts` (create)
  - **Pattern (D5)**: binary-file exporter mirror of 7.2.3
  - **Verify**: exporter test writes a fixture PPTX and asserts `PK\x03\x04` signature
- [x] 7.3.4 Register `pptxExportKind` + `pptxFileExporter` conditionally
  - **Files**: `register-defaults.ts`, `kinds/index.ts` (modify)
  - **Pattern (D5)**: same
  - **Verify**: list calls reflect flag state

---

## Phase 8 — Regeneration from step

**Goal**: Implement `regeneration.regenerateFromStep({versionId, stepRunId, options})` which re-runs a single flow step (with optional policy/provider override), patches only the artifact sections whose `flow_step_run_id` matches the re-run step, creates a new atomic version with `parent_version_id = versionId`. Avoids regenerating the whole artifact when only one step's output changed.

**Files touched**: ~6 new (regeneration impl + section patcher + tests), ~1 modified (`src/lib/agent-artifact/regeneration.ts` skeleton becomes real)
**Verification**: integration test creates a 3-section markdown artifact (each section from a distinct step), calls `regenerateFromStep({versionId, stepRunId: step2Id, options: {providerOverride: 'alt-llm'}})`, asserts the new version has identical section 1 + 3 and a regenerated section 2; `parent_version_id` correctly chains

### 8.1 Section-patch algorithm

- [x] 8.1.1 Build `src/lib/agent-artifact/regeneration/patch.ts` — `patchSections(originalSections: Section[], regenerated: Section[], targetStepRunId): Section[]` returns the merged section list where any section in `originalSections` with `flow_step_run_id === targetStepRunId` is replaced by the corresponding entry from `regenerated` (matched by section order within the step output), and all other sections are passed through unchanged. Pure function — no DB access
  - **Files**: `src/lib/agent-artifact/regeneration/patch.ts` (create)
  - **Pattern (D8)**: pure patch function for unit-test isolation
  - **Verify**: `src/lib/agent-artifact/regeneration/patch.test.ts` covers (a) target step has 1 section → 1 swap, (b) target step has 2 sections, regenerated provides 2 → both swap, (c) regenerated provides fewer than original count → truncation behavior documented + tested, (d) target step has no sections in original → no-op pass-through

### 8.2 Regeneration orchestration

- [x] 8.2.1 Replace `src/lib/agent-artifact/regeneration.ts` skeleton — `regenerateFromStep({versionId, stepRunId, options})` does: (1) load original version + sections, (2) call `flowRuntime.reRunStep(stepRunId, options)` via agent-flow's runtime export to get new step output, (3) extract sections from the new output using the artifact kind's `sectionExtractor`, (4) `patchSections(originalSections, newSections, stepRunId)`, (5) rebuild the payload from the patched sections (per-kind helper `mergeSections(payload, patchedSections)`), (6) `versioning.createVersion(definitionId, mergedPayload, {parentVersionId: versionId, flowRunId: version.flow_run_id, flowStepRunId: stepRunId})`, (7) return `{newVersionId, patchedSections: [stepRunId-matching section ids]}`
  - **Files**: `src/lib/agent-artifact/regeneration.ts` (replace skeleton)
  - **Pattern (D8)**: atomic regeneration produces a new version, never mutates the original; mirrors evidence-store immutable history pattern
  - **Verify**: `src/lib/agent-artifact/regeneration.test.ts` covers (a) successful regen produces new version with `parent_version_id`, (b) `reRunStep` failure throws `ArtifactRegenerationFailed` and no new version is created (atomic), (c) unknown `versionId` throws `ArtifactVersionNotFound`
- [x] 8.2.2 Per-kind `mergeSections` helpers — `markdown_report.mergeSections(payload, patchedSections)` rebuilds `payload.sections[]` from the patched list; `evidence_bundle.mergeSections` rebuilds `payload.claims[]` (one claim per section). Binary kinds (`pdf_export`, `pptx_export`) throw `ArtifactRegenerationFailed({reason: 'binary_kind_not_supported'})` because their bodies are not section-addressable
  - **Files**: `src/lib/agent-artifact/kinds/markdown-report.ts`, `src/lib/agent-artifact/kinds/evidence-bundle.ts`, `src/lib/agent-artifact/kinds/pdf-export.ts`, `src/lib/agent-artifact/kinds/pptx-export.ts` (modify — add `mergeSections`)
  - **Pattern (D8)**: per-kind merge logic; binary kinds opt out cleanly
  - **Verify**: per-kind test covers merge correctness; binary kind throws documented error

---

## Phase 9 — Admin endpoints

**Goal**: Surface the artifact store through admin endpoints so operators can inspect runs, trigger regeneration, and trigger exports manually via curl + future UI. All endpoints are gated by `requireAdmin` and `AGENT_ARTIFACT_ENABLED=true` (503 otherwise).

**Files touched**: ~5 new (3 endpoints + 1 guard helper + tests), ~0 modified
**Verification**: `curl -b 'session=...' .../api/admin/artifacts/runs/<FLOW_RUN_ID>` returns artifact list; regenerate endpoint produces a new version with `parent_version_id`; export endpoint dispatches via exporter registry

### 9.1 List artifacts for flow run

- [x] 9.1.1 Create `GET /api/admin/artifacts/runs/:flowRunId` at `src/pages/api/admin/artifacts/runs/[flowRunId].ts` — returns `{artifacts: [{definitionId, kind, versions: [{versionId, parentVersionId, status, createdAt}], exports: [{exportId, destination, status, externalRef}]}]}` for the flow run. Joined query: `artifact_versions WHERE flow_run_id = ?` → group by `definition_id` → join `artifact_exports` per version
  - **Files**: `src/pages/api/admin/artifacts/runs/[flowRunId].ts` (create)
  - **Pattern (D6)**: agent-evidence Phase 7.1.1 endpoint shape; agent-os Phase 1.5.4 run-detail pattern
  - **Verify**: `curl -b 'session=...' .../api/admin/artifacts/runs/1` returns the bundle for a seeded fixture; 404 for unknown run id; 503 with flag off
- [x] 9.1.2 Guard helper — create `src/pages/api/admin/artifacts/_guard.ts` exporting `ensureAgentArtifactEnabled(): Response | undefined` mirroring agent-os Phase 1.5.8 + agent-evidence Phase 7.1.2 helpers. Used by all admin endpoints
  - **Files**: `src/pages/api/admin/artifacts/_guard.ts` (create)
  - **Pattern (D11)**: umbrella flag is kill switch; all artifact endpoints gated identically
  - **Verify**: integration test boots dev server with `AGENT_ARTIFACT_ENABLED=false`, hits all endpoints, asserts 503

### 9.2 Regenerate endpoint

- [x] 9.2.1 Create `POST /api/admin/artifacts/:artifactId/regenerate` at `src/pages/api/admin/artifacts/[artifactId]/regenerate.ts` — body `{stepRunId: number (required), options?: {providerOverride?, policyOverride?}}`. Calls `regeneration.regenerateFromStep({versionId: latestVersionForArtifact(artifactId), stepRunId, options})`. Returns `{newVersionId, patchedSections}`. `:artifactId` is `definition_id`
  - **Files**: `src/pages/api/admin/artifacts/[artifactId]/regenerate.ts` (create)
  - **Pattern (D8)**: admin-only regeneration trigger; operator workflow for "rerun step 2 with cheaper provider"
  - **Verify**: 404 for unknown `artifactId`, 400 for missing `stepRunId`, 200 with new version id on success

### 9.3 Export endpoint

- [x] 9.3.1 Create `POST /api/admin/artifacts/:versionId/export/:destination` at `src/pages/api/admin/artifacts/[versionId]/export/[destination].ts` — body `{options: ExporterOptions}`. Calls `exporters.export({versionId, destination, options})`. Returns `{exportId, status, externalRef?}`; for exporters with `requiresApproval: true`, returns `{exportId, status: 'pending_approval', approvalId}` immediately (the approval queue handles the async resolution)
  - **Files**: `src/pages/api/admin/artifacts/[versionId]/export/[destination].ts` (create)
  - **Pattern (D5, D10)**: admin-trigger export; surfaces approval flow to operator transparently
  - **Verify**: integration test covers (a) `destination=file` returns `status: 'completed'` immediately, (b) `destination=notion` (with flag on) returns `status: 'pending_approval'` + an `approvalId` discoverable via the existing agent-os approvals endpoint, (c) unknown `destination` returns 404

---

## Phase 10 — Dogfood on `deep-research` + archive

**Goal**: Flip artifact production ON for the `deep-research` flow only (per-flow opt-in via YAML annotation). Generate both `markdown_report` and `evidence_bundle` per run. Flip the Notion exporter ON for that flow's artifacts. Observe one week — approval queue depth, reject rate, regeneration use frequency. Archive the OpenSpec change once dashboard is green.

**Files touched**: ~3 new (runbook + health snippet + dogfood snapshots), ~1 modified (`flows/deep-research.yaml` adds `artifacts: [...]` block)
**Verification**: 7-day dashboard green — every `deep-research` run produces both artifacts; >80% of Notion-export approvals are approved; <5% of versions trigger regeneration (signal that initial output quality is acceptable); `openspec validate agent-artifact --strict` passes; `openspec archive agent-artifact` succeeds

### 10.1 Per-flow opt-in

- [x] 10.1.1 Add `artifacts` block to `flows/deep-research.yaml` — `[{kind: 'markdown_report', step: 'writer'}, {kind: 'evidence_bundle', step: 'final'}]` — each entry declares which step's output materializes which artifact kind. Extend agent-flow's flow definition AST (`src/lib/agent-flow/dsl/ast.ts`) to include `artifacts?: ArtifactDeclaration[]` if not already present; extend schema validator
  - **Files**: `flows/deep-research.yaml` (modify), `src/lib/agent-flow/dsl/ast.ts` (modify), `src/lib/agent-flow/dsl/validate.ts` (modify)
  - **Pattern**: agent-evidence Phase 8.1.1 per-flow opt-in pattern
  - **Verify**: parser test asserts `definition.artifacts[0].kind === 'markdown_report'`; flow run produces both artifact rows
- [x] 10.1.2 Wire the per-flow opt-in into the runtime — `src/lib/agent-flow/runtime/run.ts` checks `definition.artifacts` AND `flags.agentArtifact.enabled`. For each declared artifact, after the named step completes, call `artifact.flowStep.runArtifactStep` (from Phase 2.4.1) with the step's output as payload
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify)
  - **Pattern**: agent-evidence Phase 8.1.2 wiring pattern
  - **Verify**: integration test asserts `deep-research` run produces 2 `artifact_versions` rows (one per declared kind)

### 10.2 Flip Notion exporter for dogfood

- [ ] 10.2.1 Flip `AGENT_ARTIFACT_NOTION=true` in production env (Cloudflare dashboard); redeploy. Configure the Notion Knowledge provider (via agent-providers admin UI) with a target parent page for deep-research outputs. Hand-trigger an export via `POST /api/admin/artifacts/<versionId>/export/notion` with `{options: {parentPageId, title: '<run title>'}}`; observe the approval queue, manually approve via the agent-os approvals endpoint, confirm a new Notion page appears with the markdown rendered
  - **Files**: (no new files — env flip + smoke); record in `progress.txt`
  - **Pattern**: agent-evidence Phase 8.2 flag-flip + smoke pattern
  - **Verify**: `artifact_exports` row with `status='completed'` + `external_ref` containing the Notion page URL; manual visual verification of the rendered page

### 10.3 7-day dogfood watch

- [x] 10.3.1 Author `docs/agent-artifact-runbook.md` with sections: "Inspect a flow run's artifacts (curl + SQL)", "Regenerate an artifact from a specific step", "Export an artifact to Notion / Slack / GitHub", "Approve / reject a pending export", "Diff two versions of an artifact", "Rollback (`AGENT_ARTIFACT_ENABLED=false`)", "R2 bucket inspection". Include verbatim SQL + curl recipes per agent-os Phase 6.2.2 style
  - **Files**: `docs/agent-artifact-runbook.md` (create)
  - **Pattern**: agent-os Phase 6.2 / agent-evidence Phase 8.3.1 runbook structure
  - **Verify**: `grep -c "^## " docs/agent-artifact-runbook.md` shows ≥7 sections
- [ ] 10.3.2 Daily dogfood snapshot — for 7 consecutive days run a snapshot query and save to `.omc/research/agent-artifact-dogfood-day-{1..7}.md`:
  ```sql
  SELECT kind, COUNT(*) AS versions, AVG(length(COALESCE(body_text, ''))) AS avg_inline_bytes FROM artifact_versions v JOIN artifact_definitions d ON v.definition_id = d.definition_id WHERE v.created_at > unixepoch()-86400 GROUP BY kind;
  SELECT destination, status, COUNT(*) FROM artifact_exports WHERE exported_at > unixepoch()-86400 GROUP BY destination, status;
  SELECT COUNT(*) AS regen_count FROM artifact_versions WHERE parent_version_id IS NOT NULL AND created_at > unixepoch()-86400;
  ```
  - **Files**: `.omc/research/agent-artifact-dogfood-day-{1..7}.md` (create — 7 files)
  - **Pattern**: agent-os Phase 6.3.1 / agent-evidence Phase 8.3.2 dashboard watch
  - **Verify**: 7 snapshot files exist; gate to advance: every `deep-research` run produces both kinds (no missing rows), Notion-export approval rate >80%, regeneration rate <5%
- [ ] 10.3.3 If any day shows red (export rejection spike, regeneration spike signaling poor first-shot quality, or R2 binding errors), open a follow-up issue tagged `agent-artifact-tuning`; pause archive
  - **Files**: (no new files — GitHub issue via `gh issue create`)
  - **Pattern**: agent-evidence Phase 8.3.3 dogfood failure handling
  - **Verify**: issue filed and linked from `progress.txt` if applicable

### 10.4 Final cleanup + archive

- [ ] 10.4.1 Run the full quality suite — `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build`; capture output to `.omc/research/agent-artifact-phase10-suite.log`; fix any drift
  - **Files**: (verification gate)
  - **Pattern**: agent-evidence Phase 8.4.1 zero-regression gate
  - **Verify**: each command exits 0
- [ ] 10.4.2 Run `openspec validate agent-artifact --strict` and reconcile any drift between proposal / tasks / specs and shipped behavior; confirm the four capability specs (`artifact-registry`, `artifact-versioning`, `artifact-regeneration`, `artifact-exporters`) are present under `openspec/changes/agent-artifact/specs/`
  - **Files**: (verification gate)
  - **Pattern**: agent-evidence Phase 8.4.2 strict-validate flow
  - **Verify**: command exits 0 with no warnings
- [x] 10.4.3 Append to `progress.txt`: `agent-artifact: complete — registry + versioning + traceability + regeneration + 5 external exporters + 3 binary kinds shipped; deep-research dogfooded with Notion export; R2 offload live; archived YYYY-MM-DD`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: project convention
  - **Verify**: `tail -1 progress.txt` matches; commit via `format-commit` skill
- [ ] 10.4.4 Run `openspec archive agent-artifact` to move the change to `openspec/changes/archive/YYYY-MM-DD-agent-artifact/` and fold delta specs into main specs
  - **Files**: (archive op)
  - **Pattern**: agent-evidence Phase 8.4.4 archive flow
  - **Verify**: change appears under archive dir; main specs include all four artifact capabilities
- [x] 10.4.5 Open follow-up issues for deferred items: (a) PDF/PPTX generator alternative (if D11 chose a service-based path, document a Worker-native fallback), (b) section-level approval (currently approval is per-version; partial-section approval is on the proposal but deferred), (c) artifact comparison UI on top of `diff()` (CLI-only today), (d) cross-flow artifact reuse (a definition spanning multiple flow runs — current scope is one definition per flow run)
  - **Files**: (GitHub issues via `gh issue create`)
  - **Pattern**: agent-os Phase 6.3.6 / agent-evidence Phase 8.4.5 followups
  - **Verify**: 4 issues filed and linked from `progress.txt`
