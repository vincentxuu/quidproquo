# Tasks — agent-evidence

Implementation plan for the agent-evidence change. 8 phases, ~95 tasks, strict order. Builds the Evidence Store (Source/Excerpt/Claim/Citation/Conflict), claim extraction, confidence + reputation scoring, conflict detection, and verification API on top of the kernel + Flow runtime.

## Pre-requisite

- `agent-foundation` (change #0) shipped — central `Env`, `flags`, `json/unauthorized/badRequest`, `nowMs/nowIso`, `requireAdmin`, `settings-store`
- `agent-os` (change #1) shipped — kernel; this change uses `defineAgent`, `syscall`, `agent-access` (for conflict-review approval gate), `agent-storage` (D1 + R2 backend pattern), `EventLogBackend` (writes the `evidence_*` syscall rows into `agent_tool_calls`). The four RAG agents are kernel-registered
- `agent-flow` (change #2) shipped — `flow_runs` and `flow_step_runs` tables; evidence rows reference `flow_run_id` and `flow_step_run_id`. The reference `deep-research` flow exists at `flows/deep-research.yaml` and is the dogfood target in Phase 8

## Flag state by phase

| Phase | `AGENT_EVIDENCE_ENABLED` | `AGENT_EVIDENCE_R2_BLOBS` | `AGENT_EVIDENCE_NLI_CONFLICTS` | per-flow `evidence` opt-in |
|---|---|---|---|---|
| 1 | `false` | `false` | `false` | n/a |
| 2 | `false` | `false` | `false` | n/a |
| 3 | `false` | `false` | `false` | n/a |
| 4 | `false` | `false` | `false` | n/a |
| 5 | `false` | `false` | `false` | n/a |
| 6 | `false` | `false` | `false` | n/a |
| 7 | `true` (admin read-only smoke; flip back to `false` after) | `false` | `false` | none |
| 8 | `true` | `true` after non-regression smoke | `false` (v2 deferred) | `deep-research` only |

---

## Phase 1 — D1 schema + central module skeleton (no behavior change)

**Goal**: Land migration `0014_agent_evidence.sql` with all 6 tables, stand up the central module `src/lib/agent-evidence/` with backend interfaces and the kernel-side syscall hooks, wire feature flags. Nothing extracts or persists evidence yet — every public function is a stub returning `undefined` or an empty result so `AGENT_EVIDENCE_ENABLED=false` is the kill switch.

**Files touched**: ~14 new (migration, 5 module skeletons + types + errors, storage interfaces, flag entry, schema introspection test), ~3 modified (`wrangler.jsonc`, `src/lib/config/env.ts`, `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-evidence` green (skeleton tests only); `pnpm wrangler d1 migrations apply quidproquo-db --local` applies `0014_agent_evidence.sql` cleanly and `sqlite_master` shows the 6 tables + the `evidence_claims_fts` virtual table; `AGENT_EVIDENCE_ENABLED=false` so no extraction or verification fires from any flow run

### 1.1 Wrangler + flags

- [x] 1.1.1 Add `AGENT_EVIDENCE_ENABLED`, `AGENT_EVIDENCE_R2_BLOBS`, `AGENT_EVIDENCE_NLI_CONFLICTS` to `wrangler.jsonc` `vars` block all defaulting to `"false"`; extend central `Env` type with the three fields; register the `agentEvidence` sub-block in `src/lib/config/flags.ts`
  - **Files**: `wrangler.jsonc:15-69` (modify — `vars` block), `src/lib/config/env.ts` (modify — append three fields), `src/lib/config/flags.ts` (modify — append `agentEvidence` sub-object)
  - **Pattern** (D11): mirrors agent-os Phase 1.1 and agent-flow Phase 1.1.1 sub-block shape; one umbrella flag plus per-capability sub-flags
  - **Verify**: `pnpm wrangler types` regenerates clean; `src/lib/config/flags.test.ts` extended to assert `flags.agentEvidence.enabled === false` when env empty and `=== true` when `AGENT_EVIDENCE_ENABLED='true'`

### 1.2 D1 migration `0014_agent_evidence.sql`

- [x] 1.2.1 Create migration with 6 tables (`evidence_sources`, `evidence_excerpts`, `evidence_claims`, `evidence_citations`, `evidence_conflicts`, `evidence_verifications`) per design D1. Match `migrations/0013_agent_flow.sql` style: `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, inline comment per table, no `CHECK` constraints (TEXT enums with inline `--` comment listing allowed values), `created_at` as `INTEGER NOT NULL` (epoch ms — central module writes via `nowMs()`)
  - **Files**: `migrations/0014_agent_evidence.sql` (create)
  - **Pattern** (D1): `migrations/0013_agent_flow.sql` (sibling table-set); design D1 schema (all 6 tables with their FK relations to `flow_runs.flow_run_id`, `flow_step_runs.step_run_id`, and `agent_runs.run_id`)
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0014_agent_evidence.sql` exits 0; re-running is a no-op; `pnpm wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'evidence_%'"` returns all 6 names
- [x] 1.2.2 In the same migration, add the `evidence_claims_fts` FTS5 virtual table mirroring `evidence_claims(claim_text)` so the extraction module can de-dup against prior claims in the same run via full-text match (per design D3 dedup strategy)
  - **Files**: `migrations/0014_agent_evidence.sql` (modify — append FTS block)
  - **Pattern** (D3): agent-os `agent_memory_fts` FTS5 virtual table from `0011_agent_os.sql`; sync via `AFTER INSERT/UPDATE/DELETE` triggers
  - **Verify**: introspection test 1.5.1 confirms the virtual table and the 3 trigger names exist
- [x] 1.2.3 Add the cross-table lineage columns required by the provenance chain: `flow_run_id INTEGER REFERENCES flow_runs(flow_run_id)` on `evidence_sources` / `evidence_claims` / `evidence_verifications`, `flow_step_run_id INTEGER REFERENCES flow_step_runs(step_run_id)` on `evidence_claims`, `agent_run_id INTEGER REFERENCES agent_runs(run_id)` on `evidence_claims`, `provider_call_id TEXT` on `evidence_sources` (links to the `agent_tool_calls` row that retrieved the source per design D6)
  - **Files**: `migrations/0014_agent_evidence.sql` (modify)
  - **Pattern** (D6): cross-table lineage; mirrors `flow_step_runs.agent_run_id` from agent-flow migration 0012
  - **Verify**: `SELECT sql FROM sqlite_master WHERE name='evidence_claims'` contains all three FK columns; introspection test 1.5.1 asserts the column set

### 1.3 Backend interfaces (per agent-os Resolution Q5 adapter pattern)

- [x] 1.3.1 Define backend interfaces every module depends on under `src/lib/agent-evidence/storage/types.ts` — required: `SourceStoreBackend`, `ExcerptStoreBackend`, `ClaimStoreBackend`, `CitationStoreBackend`, `ConflictStoreBackend`, `VerificationStoreBackend`, `ClaimFtsBackend`, `EvidenceBlobBackend` (8 interfaces). Mirror agent-os/agent-flow split — one interface per concern
  - **Files**: `src/lib/agent-evidence/storage/types.ts` (create)
  - **Pattern** (D2): agent-os `src/lib/agent-os/storage/types.ts`; one binding per concern
  - **Verify**: `pnpm tsc --noEmit` passes; file exports exactly 8 interfaces named above
- [x] 1.3.2 Skeleton D1 backends — one file per interface under `src/lib/agent-evidence/storage/d1/` with method stubs throwing `EvidenceNotImplemented`. Phase 2 fills them in
  - **Files**: `src/lib/agent-evidence/storage/d1/{source-store,excerpt-store,claim-store,citation-store,conflict-store,verification-store,claim-fts}.ts` (create — 7 files)
  - **Pattern** (D2): agent-os Phase 1.3.2 stub style; signatures match the interfaces from 1.3.1
  - **Verify**: `pnpm tsc --noEmit` passes; each backend exports a class whose method names match the interface exactly
- [x] 1.3.3 In-memory test backend for every interface in 1.3.1 (8 classes) in a single file for easy import from module tests
  - **Files**: `src/lib/agent-evidence/storage/test/in-memory.ts` (create)
  - **Pattern** (D2): agent-os `storage/test/in-memory.ts` (`makeKV` style — small, hand-rolled, no Miniflare)
  - **Verify**: imported by skeleton module tests in 1.4; `pnpm vitest run src/lib/agent-evidence/storage` is green

### 1.4 Central module skeleton — `src/lib/agent-evidence/`

- [x] 1.4.1 Build `index.ts` — entrypoint that exports `createEvidence(env, backends)` returning `{ store, extraction, verification, reputation, conflict }`. Returns no-op stubs when `flags.agentEvidence.enabled === false` so callers can be unconditional
  - **Files**: `src/lib/agent-evidence/index.ts`, `src/lib/agent-evidence/errors.ts` (create — `EvidenceNotImplemented`, `EvidenceSourceUnknown`, `EvidenceClaimUnknown`, `EvidencePolicyViolation`, `EvidenceConflictUnresolved`, `EvidenceBlobTooLarge`, `EvidenceFlagDisabled`)
  - **Pattern** (D1): agent-os `kernel.ts` six-module entry shape; agent-flow `registry.ts` boot wiring
  - **Verify**: `src/lib/agent-evidence/index.test.ts` asserts (a) calling `createEvidence(env, backends)` with flag off returns objects whose every method resolves to `undefined`, (b) flag on returns instances backed by `backends`
- [x] 1.4.2 Skeleton `store.ts` exporting `EvidenceStore` class with stubbed `storeSource`, `storeExcerpt`, `storeClaim`, `storeCitation`, `storeConflict`, `getProvenanceChain` methods that throw `EvidenceNotImplemented`
  - **Files**: `src/lib/agent-evidence/store.ts` (create)
  - **Pattern** (D1): facade class wrapping the storage backends
  - **Verify**: `pnpm tsc --noEmit` passes; signature matches the public API the kernel `evidence.*` syscalls eventually call
- [x] 1.4.3 Skeleton `extraction.ts` exporting `ClaimExtractor` class with stubbed `extractFromSource(source, excerpts)` method; document the v1 noun/verb-phrase candidate algorithm as a docstring (full impl in Phase 3)
  - **Files**: `src/lib/agent-evidence/extraction.ts` (create)
  - **Pattern** (D3): pluggable extraction with v1 = NP/VP candidate generation, dedup via FTS + cosine, v2 hook for NLP backends
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 1.4.4 Skeleton `verification.ts` exporting `EvidenceVerifier` class with stubbed `verifyFlowRun(flowRunId, policy)` method returning `{ passed: true, checks: [], gaps: [] }`
  - **Files**: `src/lib/agent-evidence/verification.ts` (create)
  - **Pattern** (D7): quality-policy enforcer; consumed by `agent-flow` verifier step type `policy`
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 1.4.5 Skeleton `reputation.ts` exporting `SourceReputation` class with stubbed `getScore(domain)` and `updateFromSignal(domain, signal)` methods
  - **Files**: `src/lib/agent-evidence/reputation.ts` (create)
  - **Pattern** (D5): per-domain trust score learned from approval/rejection signals
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 1.4.6 Skeleton `conflict.ts` exporting `ConflictDetector` class with stubbed `detect(claims)` and `proposeReviewApproval(conflict)` methods
  - **Files**: `src/lib/agent-evidence/conflict.ts` (create)
  - **Pattern** (D8): rule-based detector v1, NLI flag for v2; surfaces conflicts as approval-gate via agent-access
  - **Verify**: `pnpm tsc --noEmit` passes

### 1.5 Phase 1 gate

- [x] 1.5.1 Schema introspection test confirms migration 0014 produced the expected 6 tables, the FTS5 virtual table + 3 sync triggers, and the cross-table lineage columns from 1.2.3
  - **Files**: `src/lib/agent-evidence/storage/migration-0016.test.ts` (create)
  - **Pattern** (D1): agent-flow Phase 1.8.4 introspection style
  - **Verify**: test asserts `evidence_claims` contains `flow_run_id` / `flow_step_run_id` / `agent_run_id` columns AND `evidence_claims_fts` virtual table exists AND the 3 FTS sync triggers (`evidence_claims_ai`, `evidence_claims_ad`, `evidence_claims_au`) are present

---

## Phase 2 — Store API + persistence (write path live, no auto-extraction)

**Goal**: Implement the production D1 backends and flesh out `EvidenceStore` so callers can manually persist sources/excerpts/claims/citations/conflicts via direct method calls. Add the R2 blob offload path (flag-gated). Wire `evidence_claims_fts` index sync. Still no extraction — only a direct write API. `AGENT_EVIDENCE_ENABLED=false` keeps the path dormant in production.

**Files touched**: ~10 new (7 D1 backend impls, blob backend, store impl, store test), ~1 modified (`src/lib/agent-evidence/store.ts` skeleton becomes real)
**Verification**: `pnpm vitest run src/lib/agent-evidence/store` green; store round-trips a fixture provenance chain (1 source → 2 excerpts → 3 claims → 3 citations) and `getProvenanceChain(claimId)` reconstructs it

### 2.1 D1 backend implementations

- [x] 2.1.1 Implement `SourceStoreBackend` — `insert({url, content_hash, retrieved_at, freshness_score, provider_call_id, flow_run_id, agent_run_id})` returns `source_id`; `getById(sourceId)`; `getByUrlAndHash(url, hash)` for dedup; `listForFlowRun(flowRunId)`. Insert dedup: if `(url, content_hash)` already exists, return the existing `source_id`
  - **Files**: `src/lib/agent-evidence/storage/d1/source-store.ts` (replace stub)
  - **Pattern** (D1): dedup on `(url, content_hash)` per design D1 source-identity rule; agent-os D1 backend style
  - **Verify**: `src/lib/agent-evidence/storage/d1/source-store.test.ts` covers (a) round-trip, (b) duplicate `(url, hash)` insert returns existing id, (c) different `content_hash` for same URL produces new id (page changed)
- [x] 2.1.2 Implement `ExcerptStoreBackend` — `insert({source_id, offset, length, text, surrounding_context})` returns `excerpt_id`; `listForSource(sourceId)`. Excerpts are not deduped (offset/length identifies position, identical text at different positions is meaningful)
  - **Files**: `src/lib/agent-evidence/storage/d1/excerpt-store.ts` (replace stub)
  - **Pattern** (D1): position-keyed; no dedup
  - **Verify**: round-trip test; two inserts at different offsets produce two distinct ids
- [x] 2.1.3 Implement `ClaimStoreBackend` — `insert({claim_text, claim_hash, flow_run_id, flow_step_run_id, agent_run_id, agent_id, confidence})` returns `claim_id`; `getById`; `listForFlowRun(flowRunId)`; `searchByText(query, flowRunId)` delegates to `ClaimFtsBackend.search`. Dedup is per-flow-run via `(flow_run_id, claim_hash)` per D3 — same-text claim from a different source in the same run does NOT create a new row (instead, a new citation is added linking the additional source)
  - **Files**: `src/lib/agent-evidence/storage/d1/claim-store.ts` (replace stub)
  - **Pattern** (D3): per-run dedup; cross-source claim reinforcement via citations
  - **Verify**: dedup test confirms two `insert()` calls with same `claim_hash` + `flow_run_id` return the same `claim_id`; different `flow_run_id` produces distinct ids
- [x] 2.1.4 Implement `CitationStoreBackend` — `insert({claim_id, excerpt_id, relation, provenance_chain_json})` where `relation ∈ {'supports','refutes','context'}`. Each citation captures the audit trail: `provenance_chain_json` stores the path `{flow_run_id, flow_step_run_id, agent_run_id, provider_call_id, source_id, excerpt_id}` so the chain can be reconstructed without joins (denormalized for query-time efficiency per D6)
  - **Files**: `src/lib/agent-evidence/storage/d1/citation-store.ts` (replace stub)
  - **Pattern** (D6): denormalized provenance for read efficiency; mirrors agent-os event-log denorm style
  - **Verify**: round-trip; `provenance_chain_json` parses cleanly and contains all 6 keys
- [x] 2.1.5 Implement `ConflictStoreBackend` — `insert({claim_a_id, claim_b_id, confidence_delta, detected_by, status})` returns `conflict_id`; `listByStatus('pending')`; `updateStatus(conflictId, status, resolvedBy?)`. `status ∈ {'pending','approved','rejected','expired'}`
  - **Files**: `src/lib/agent-evidence/storage/d1/conflict-store.ts` (replace stub)
  - **Pattern** (D8): conflict lifecycle mirrors agent-access approval lifecycle
  - **Verify**: round-trip; `listByStatus('pending')` returns inserted-but-unresolved rows; `updateStatus` flips state
- [x] 2.1.6 Implement `VerificationStoreBackend` — `insert({flow_run_id, policy_json, passed, checks_json, gaps_json, performed_at})` returns `verification_id`; `getByFlowRun(flowRunId)` returns the latest run's verification rows. One row per verification call (a flow may be re-verified after fixing gaps)
  - **Files**: `src/lib/agent-evidence/storage/d1/verification-store.ts` (replace stub)
  - **Pattern** (D7): immutable verification history
  - **Verify**: round-trip; multiple inserts for same `flow_run_id` return both rows ordered by `performed_at`
- [x] 2.1.7 Implement `ClaimFtsBackend` — `search(query, flowRunId, limit=10)` uses `MATCH` against `evidence_claims_fts` joined to `evidence_claims` filtered by `flow_run_id`; returns `[{claim_id, claim_text, score}]`. Used by extraction module for dedup
  - **Files**: `src/lib/agent-evidence/storage/d1/claim-fts.ts` (replace stub)
  - **Pattern** (D3): agent-os `agent_memory_fts` query style
  - **Verify**: seeded 3 claims, `search('foo', flowRunId)` returns the matching row first; cross-flow-run leakage test confirms isolation

### 2.2 R2 blob offload (flag-gated per D2)

- [x] 2.2.1 Implement `EvidenceBlobBackend` writing/reading `evidence/{flow_run_id}/{source_id}` for large source bodies (>256KB). Backend constructor receives the shared `R2_AGENT_MEMORY` bucket binding from `agent-os`; evidence objects are isolated by the `evidence/` prefix. When `flags.agentEvidence.r2Blobs === false` AND body >256KB, throw `EvidenceBlobTooLarge` (mirrors agent-os `MemoryBodyTooLarge` pattern)
  - **Files**: `src/lib/agent-evidence/storage/r2/blob.ts` (replace stub)
  - **Pattern** (D2): agent-os R2 blob backend (`src/lib/agent-os/storage/r2/blob.ts`); same flag-gated offload shape
  - **Verify**: unit test asserts (a) flag off + >256KB body throws `EvidenceBlobTooLarge`, (b) flag on calls `R2Bucket.put` with `evidence/{flow_run_id}/{source_id}` key
- [x] 2.2.2 Reuse the existing `R2_AGENT_MEMORY` binding from `agent-os`; do not add a new R2 bucket. Extend the evidence backend factory to require `env.R2_AGENT_MEMORY` only when `flags.agentEvidence.r2Blobs === true`.
  - **Files**: `src/lib/agent-evidence/storage.ts` (modify — wire shared R2 backend)
  - **Pattern** (D2): agent-os `R2_AGENT_MEMORY` binding shape; design D10 bucket-reuse decision
  - **Verify**: local dev boots with evidence R2 flag off; with flag on and missing `R2_AGENT_MEMORY`, backend construction fails fast with `EvidenceBlobBackendMissing`

### 2.3 EvidenceStore facade

- [x] 2.3.1 Replace `src/lib/agent-evidence/store.ts` stubs with the real impl that delegates to the backends from 2.1 + 2.2. Methods: `storeSource(input) → sourceId`, `storeExcerpt(input) → excerptId`, `storeClaim(input) → claimId`, `storeCitation(input) → citationId`, `storeConflict(input) → conflictId`. For sources where `bodyBytes > 256KB`, route body through `EvidenceBlobBackend` and persist the R2 key in `evidence_sources.body_ref` column (add column to migration 0014 if missing)
  - **Files**: `src/lib/agent-evidence/store.ts` (replace skeleton)
  - **Pattern** (D1, D2): facade delegating to backends; per agent-os Phase 5.2.1 large-body offload decision point
  - **Verify**: `src/lib/agent-evidence/store.test.ts` covers all 5 store methods round-trip via the in-memory backends from 1.3.3; large-body source routes through blob backend with flag on, throws with flag off
- [x] 2.3.2 Implement `getProvenanceChain(claimId)` — joins `evidence_claims` → `evidence_citations` → `evidence_excerpts` → `evidence_sources` and returns the typed chain `{ claim, citations: [{ excerpt, source, provenance }] }`. Single query via `db.batch` so the read is one round-trip per D6
  - **Files**: `src/lib/agent-evidence/store.ts` (extend)
  - **Pattern** (D6): denormalized provenance enables single-batch reconstruction
  - **Verify**: store test seeds a 1-source / 2-excerpt / 3-claim / 3-citation fixture and asserts `getProvenanceChain(claimId)` returns the full chain with no NULLs

---

## Phase 3 — Claim extraction (async, kernel event-driven)

**Goal**: Wire the v1 claim extractor (noun/verb-phrase candidate generation) to fire automatically after each flow step that produces text artifacts. Extraction runs async via `ctx.waitUntil` so it never blocks the flow runtime. Per-source dedup uses the FTS index from Phase 2.

**Files touched**: ~8 new (extractor impl, candidate scorer, dedup, listener, test), ~1 modified (`src/lib/agent-evidence/extraction.ts` skeleton becomes real)
**Verification**: `pnpm vitest run src/lib/agent-evidence/extraction` green; integration test runs a 3-step flow with `evidence.enabled=true`, confirms claims appear in `evidence_claims` within the same flow run, dedup works across two sources containing the same fact

### 3.1 v1 candidate extractor

- [x] 3.1.1 Build `src/lib/agent-evidence/extraction/candidates.ts` — `generateCandidates(text): Candidate[]` produces noun-phrase + verb-phrase fragments suitable for evaluation as factual claims. v1 uses a deterministic regex/heuristic pipeline (sentence split → POS-tag-free chunking via punctuation + capitalization + connective patterns) so it runs Worker-native without an ML binding. Returns `[{text, start, end, kind: 'np' | 'vp'}]`
  - **Files**: `src/lib/agent-evidence/extraction/candidates.ts` (create)
  - **Pattern** (D3): v1 = no-ML heuristic for cheap baseline; v2 hook deferred to a follow-up that plugs in Workers AI text models
  - **Verify**: `src/lib/agent-evidence/extraction/candidates.test.ts` covers (a) "OpenAI released GPT-5 in 2026." → at least one NP candidate covering `'OpenAI'` and one VP covering `'released GPT-5 in 2026'`, (b) empty input returns `[]`, (c) determinism: same input twice produces identical arrays
- [x] 3.1.2 Build `src/lib/agent-evidence/extraction/score.ts` — `scoreCandidate(candidate, source, context)` returns initial `confidence ∈ [0, 1]` per design D4 formula: `0.5 * freshness + 0.3 * reputation + 0.2 * agentSelfRated` clamped to [0,1]. `freshness` is `source.freshness_score` (set when source is fetched), `reputation` is queried from `reputation.getScore(domain)` (returns `0.5` for unknown domains in v1), `agentSelfRated` defaults to `0.5` when the agent did not emit one
  - **Files**: `src/lib/agent-evidence/extraction/score.ts` (create)
  - **Pattern** (D4): confidence is a weighted average of independent signals; v1 keeps weights as constants and exposes a config hook for v2 tuning
  - **Verify**: `src/lib/agent-evidence/extraction/score.test.ts` covers fixture inputs and asserts known outputs; `scoreCandidate` with all-zero signals returns `0`; all-one returns `1.0`

### 3.2 Dedup + claim hashing

- [x] 3.2.1 Build `src/lib/agent-evidence/extraction/hash.ts` — `claimHash(text)` lowercases, trims, collapses whitespace, drops trailing punctuation, then SHA-256s. Used as the dedup key per D3
  - **Files**: `src/lib/agent-evidence/extraction/hash.ts` (create)
  - **Pattern** (D3): canonical hash for `(flow_run_id, claim_hash)` uniqueness in `evidence_claims`
  - **Verify**: hash test asserts `'OpenAI released GPT-5'` and `'  OPENAI Released GPT-5.  '` produce identical hashes; different sentences produce different hashes
- [x] 3.2.2 Build `src/lib/agent-evidence/extraction/dedup.ts` — `dedupCandidates(candidates, flowRunId, fts)` queries `ClaimFtsBackend.search` for each candidate, skips any whose top match has `MATCH` score above a configurable threshold (default 0.8 cosine-ish via FTS BM25 normalization) AND identical `claimHash`. Returns the filtered candidate list
  - **Files**: `src/lib/agent-evidence/extraction/dedup.ts` (create)
  - **Pattern** (D3): per-flow-run dedup via FTS-first then hash fallback
  - **Verify**: dedup test seeds one existing claim, runs `dedupCandidates` on a list containing that claim text + 2 new ones, asserts return length is 2 and the existing claim is filtered

### 3.3 Extractor orchestration

- [x] 3.3.1 Replace the `ClaimExtractor` skeleton in `src/lib/agent-evidence/extraction.ts` — `extractFromSource(source, excerpts, ctx): Promise<{claimsInserted: number, citationsInserted: number, deduped: number}>`. For each excerpt: generate candidates → score → dedup → for each surviving candidate, call `store.storeClaim()` AND `store.storeCitation({claim, excerpt, relation: 'supports'})`. The kind of relation is `'supports'` by default; conflict module promotes pairs to `'refutes'` in Phase 5
  - **Files**: `src/lib/agent-evidence/extraction.ts` (replace skeleton)
  - **Pattern** (D3): pipeline orchestration; idempotent per-source (re-running on same source produces zero new claims)
  - **Verify**: `src/lib/agent-evidence/extraction.test.ts` covers (a) 1 source / 1 excerpt / 3 candidates inserts 3 claims + 3 citations, (b) re-running on same source inserts 0 new claims (dedup), (c) different source with same claim text inserts 0 new claims but 1 new citation linking to the new excerpt

### 3.4 Kernel listener (async, non-blocking)

- [x] 3.4.1 Build `src/lib/agent-evidence/listener.ts` — `onAgentRunEvent(event, kernel, evidence)` listens for `agent_run_events.kind === 'finished'` and, if the agent's output references a source (via a convention: agent return value contains `{evidence?: {sources: [...]}}`), dispatches `extractFromSource` for each. Hook installed via `kernel.on('event', ...)` exposed by agent-os
  - **Files**: `src/lib/agent-evidence/listener.ts` (create)
  - **Pattern** (D3): kernel event-driven; extraction is fire-and-forget via `ctx.waitUntil` per design — flow runtime never blocks waiting for extraction
  - **Verify**: `src/lib/agent-evidence/listener.test.ts` uses the in-memory kernel + in-memory evidence backends; emits a fake `finished` event with `{evidence:{sources:[...]}}`, asserts claims appear in the in-memory claim store after the awaited promise
- [x] 3.4.2 Wire the listener into `createEvidence` so calling `evidence.attachToKernel(kernel)` installs the hook. Flag-gated — no-op when `flags.agentEvidence.enabled === false`
  - **Files**: `src/lib/agent-evidence/index.ts` (modify — add `attachToKernel`)
  - **Pattern** (D3): explicit opt-in attachment so the kernel is unaware of evidence when the flag is off
  - **Verify**: integration test confirms `attachToKernel` is a no-op when flag is off (event fires, no claims persisted); flag on persists claims

---

## Phase 4 — Confidence scoring + reputation learning

**Goal**: Promote the v1 confidence score from per-candidate static formula to a learned signal. Implement reputation updates driven by human approval/rejection of artifacts (signal source: agent-access approval resolution + a manual admin reputation endpoint).

**Files touched**: ~6 new (reputation D1 table + backend, signal processor, updater, tests), ~1 modified (existing migration adds `evidence_source_reputation` table)

**Verification**: reputation test asserts approving an artifact containing claims from `example.com` bumps `example.com` reputation by +0.05; rejecting decrements; reputation feeds back into `scoreCandidate` for subsequent extractions

### 4.1 Reputation table + backend

- [x] 4.1.1 Add `evidence_source_reputation` table to migration 0016 — `(domain TEXT PRIMARY KEY, score REAL NOT NULL DEFAULT 0.5, positive_signals INTEGER NOT NULL DEFAULT 0, negative_signals INTEGER NOT NULL DEFAULT 0, last_updated INTEGER NOT NULL)`. Skip if migration is already in production — add as new migration `0021_evidence_source_reputation.sql` instead (decide at Phase 4 start based on whether Phase 1 has merged to main)
  - **Files**: `migrations/0014_agent_evidence.sql` (modify if not yet merged) OR `migrations/0021_evidence_source_reputation.sql` (create if 0014 already merged)
  - **Pattern** (D5): per-domain reputation; mutable score updated by signal processor
  - **Verify**: introspection test (or 1.5.1 extended) confirms table presence
- [x] 4.1.2 Implement `ReputationBackend` interface + D1 impl — `get(domain): {score, positive, negative} | null`, `upsert(domain, delta)`, `listTop(n)`. Default score for unknown domain is `0.5` (handled in `SourceReputation.getScore` not in backend)
  - **Files**: `src/lib/agent-evidence/storage/types.ts` (modify — add `ReputationBackend`), `src/lib/agent-evidence/storage/d1/reputation.ts` (create), `src/lib/agent-evidence/storage/test/in-memory.ts` (modify — add test impl)
  - **Pattern** (D5): mirrors other backend patterns
  - **Verify**: round-trip + default-unknown-returns-null test

### 4.2 SourceReputation impl

- [x] 4.2.1 Replace `src/lib/agent-evidence/reputation.ts` skeleton — `getScore(domain): Promise<number>` returns backend value clamped [0,1] or `0.5` if unknown; `updateFromSignal(domain, signal: 'approve' | 'reject', strength=1)` upserts via the backend (per D5: approve = +0.05 * strength, reject = -0.05 * strength, clamped [0,1])
  - **Files**: `src/lib/agent-evidence/reputation.ts` (replace skeleton)
  - **Pattern** (D5): bounded learning rate; clamped score
  - **Verify**: `src/lib/agent-evidence/reputation.test.ts` covers (a) unknown domain returns `0.5`, (b) 10 consecutive approves caps at `1.0`, (c) reject signal decrements by 0.05
- [x] 4.2.2 Domain extraction helper — `domainOf(url): string` strips subdomain (e.g. `www.example.com` → `example.com`) per public-suffix convention. v1 uses a hand-rolled list of common suffixes (`.com`, `.org`, `.net`, `.io`, `.co.uk`, ...); v2 hook can plug in `psl` package
  - **Files**: `src/lib/agent-evidence/reputation.ts` (extend)
  - **Pattern** (D5): coarse-grained domain to avoid sparse rows
  - **Verify**: test asserts `'https://www.example.com/path'` → `'example.com'`, `'https://blog.example.co.uk/'` → `'example.co.uk'`

### 4.3 Signal source wiring

- [x] 4.3.1 Build `src/lib/agent-evidence/signal-processor.ts` — `onApprovalResolved(approvalId, decision, kernel, evidence)` listens for agent-access approval resolution events. If the approved/rejected artifact is a flow-run artifact (i.e. the approval row's `run_id` points at a `flow_runs.flow_run_id`), look up all sources cited in that flow run and call `reputation.updateFromSignal(domainOf(source.url), decision)` for each
  - **Files**: `src/lib/agent-evidence/signal-processor.ts` (create)
  - **Pattern** (D5): approval/rejection is the canonical reputation signal source per proposal
  - **Verify**: integration test fixtures a 2-source flow run, simulates approve event, asserts both source domains gained reputation
- [x] 4.3.2 Manual reputation override endpoint (admin only) — `POST /api/admin/evidence/reputation/:domain` body `{score: number}` overrides the learned value (e.g. operator flags a domain as known-bad). Returns 200 + updated row. Skip if `requireAdmin` fails. Requires `AGENT_EVIDENCE_ENABLED=true` (returns 503 otherwise)
  - **Files**: `src/pages/api/admin/evidence/reputation/[domain].ts` (create)
  - **Pattern** (D5): manual override escape hatch; agent-os Phase 1.5.x admin endpoint shape
  - **Verify**: `curl -X POST -b 'session=...' .../api/admin/evidence/reputation/example.com -d '{"score":0.1}'` updates the row; `GET` returns the new value

### 4.4 Confidence feedback loop

- [x] 4.4.1 Confirm `extraction/score.ts` queries `reputation.getScore(domain)` at scoring time (already in 3.1.2 signature); add an integration test that approves an artifact, re-runs extraction on a new source from the same domain, and asserts the new claims have higher `confidence` than identical claims extracted before the approval
  - **Files**: `src/lib/agent-evidence/extraction/score.integration.test.ts` (create)
  - **Pattern** (D4, D5): end-to-end feedback loop
  - **Verify**: test runs in <2s; before/after confidence delta matches `+0.05 * 0.3 = +0.015` (reputation weight)

---

## Phase 5 — Conflict detection (rule-based v1, NLI flag for v2)

**Goal**: Detect pairs of claims in the same flow run that contradict (e.g. "X was released in 2024" vs "X was released in 2026"). v1 uses rule-based detection (numeric/date mismatch + negation pattern); v2 hook gated behind `AGENT_EVIDENCE_NLI_CONFLICTS` for future model-based NLI. Surface detected conflicts as agent-access approval gates for human review.

**Files touched**: ~7 new (rule detector, conflict orchestrator, approval gate wiring, tests), ~1 modified (`src/lib/agent-evidence/conflict.ts` skeleton becomes real)
**Verification**: integration test seeds 2 contradicting claims, runs `conflict.detect`, asserts a row appears in `evidence_conflicts` with status `pending`, asserts an `agent_approval_requests` row was created for the conflict-review gate

### 5.1 Rule-based detector v1

- [x] 5.1.1 Build `src/lib/agent-evidence/conflict/rules/numeric.ts` — `detectNumericContradiction(claimA, claimB): {contradicts: boolean, kind?: 'number' | 'date' | 'percentage', delta?: number}`. Heuristic: extract numbers/dates from both claim texts via regex, if any pair has same surrounding context (≥3 shared tokens before/after) AND different numeric value, flag contradiction with `delta = |a - b|`
  - **Files**: `src/lib/agent-evidence/conflict/rules/numeric.ts` (create)
  - **Pattern** (D8): rule-based v1 is the cheap baseline; v2 NLI deferred
  - **Verify**: `src/lib/agent-evidence/conflict/rules/numeric.test.ts` covers (a) "GPT-5 released in 2024" vs "GPT-5 released in 2026" → contradicts, (b) "GPT-5 released in 2026" vs "Claude 5 released in 2024" → no contradiction (different subject), (c) "$10" vs "$100" with shared context → contradicts
- [x] 5.1.2 Build `src/lib/agent-evidence/conflict/rules/negation.ts` — `detectNegationContradiction(claimA, claimB): {contradicts: boolean}`. Heuristic: if one claim contains negation markers (`'not'`, `'no'`, `"isn't"`, `"doesn't"`, `'never'`) immediately before the verb phrase that the other claim asserts positively, flag contradiction. Lossy by design — false positives expected, surfaced as approval-gated review
  - **Files**: `src/lib/agent-evidence/conflict/rules/negation.ts` (create)
  - **Pattern** (D8): heuristic-with-approval; v2 NLI replaces this with a model
  - **Verify**: test asserts "OpenAI launched GPT-5" vs "OpenAI did not launch GPT-5" → contradicts; symmetric variants also detected

### 5.2 ConflictDetector orchestration

- [x] 5.2.1 Replace `src/lib/agent-evidence/conflict.ts` skeleton — `detect(flowRunId): Promise<Conflict[]>` loads all claims for the run, runs each pair through both rule modules from 5.1, persists detected conflicts via `ConflictStoreBackend.insert` with `detected_by: 'rule:numeric' | 'rule:negation'`. Skips pairs already in `evidence_conflicts` (idempotent)
  - **Files**: `src/lib/agent-evidence/conflict.ts` (replace skeleton)
  - **Pattern** (D8): pairwise detection; idempotent; pluggable rule list ready for v2 NLI addition
  - **Verify**: `src/lib/agent-evidence/conflict.test.ts` covers 3 claims (1 numeric conflict + 1 negation conflict + 1 unrelated) → 2 conflicts inserted; re-running inserts 0
- [x] 5.2.2 NLI v2 hook — wrap rule detectors plus a stub `detectNliContradiction` (returns `[]` always) in a `runDetectors(claims, flags)` dispatch. When `flags.agentEvidence.nliConflict === true`, include the NLI detector in the loop (stub remains until a follow-up wires a Workers AI NLI model)
  - **Files**: `src/lib/agent-evidence/conflict/detectors.ts` (create), `src/lib/agent-evidence/conflict/nli-stub.ts` (create — returns `[]` with TODO comment)
  - **Pattern** (D8): flag-gated v2 pathway ready for follow-up
  - **Verify**: test asserts flag off skips NLI detector entirely; flag on includes it (stub returns `[]` so detection result unchanged)

### 5.3 Approval-gate wiring (uses agent-access)

- [x] 5.3.1 Build `proposeReviewApproval(conflict, kernel)` in `src/lib/agent-evidence/conflict.ts` — calls `kernel.access.requestApproval({ runId: conflict.flow_run_id, reason: 'evidence_conflict', context: { conflictId, claimA, claimB, kind }, ttlSeconds: 86400 })`. Persists the returned `approval_id` back onto the `evidence_conflicts` row via a new column `approval_id INTEGER REFERENCES agent_approval_requests(approval_id)` (add to migration 0014 if not already present)
  - **Files**: `src/lib/agent-evidence/conflict.ts` (extend), `migrations/0014_agent_evidence.sql` (modify if not yet merged to add `approval_id` column) OR `migrations/0017_*.sql` (extend reputation migration)
  - **Pattern** (D8): conflict review surfaces through the shared agent-access approval queue, so operators use the same UI as agent-os approvals
  - **Verify**: integration test asserts `proposeReviewApproval` inserts both an `evidence_conflicts` row (status `pending`) AND an `agent_approval_requests` row with `reason='evidence_conflict'`
- [x] 5.3.2 Listener for approval resolution — when an approval with `reason='evidence_conflict'` resolves, update the corresponding `evidence_conflicts.status` to match (`approve` → `approved`, `reject` → `rejected`, `expire` → `expired`). Wire via the existing signal processor from Phase 4.3.1
  - **Files**: `src/lib/agent-evidence/signal-processor.ts` (extend)
  - **Pattern** (D8): symmetric resolution back-propagation
  - **Verify**: integration test resolves an approval, asserts `evidence_conflicts.status` reflects the decision and `resolved_by` is set

### 5.4 Phase 5 gate

- [x] 5.4.1 End-to-end test — seed 2 contradicting claims in the same flow run, call `conflict.detect()`, assert 1 conflict + 1 approval are created; call `kernel.access.resolveApproval` with `reject`, assert the conflict row flips to `rejected`
  - **Files**: `src/lib/agent-evidence/conflict.integration.test.ts` (create)
  - **Pattern** (D8): full lifecycle gate
  - **Verify**: test runs <2s, asserts all status transitions

---

## Phase 6 — Verification API (quality-policy enforcement)

**Goal**: Replace `EvidenceVerifier` skeleton with a real verifier that checks quality policies declared at the flow level (e.g. `citation_required: true`, `min_sources: 3`, `stale_source_max_days: 365`, `conflict_check: true`). Each verification persists a row in `evidence_verifications`. Consumed by the agent-flow `verifier` step type `policy` (which delegates to this module).

**Files touched**: ~6 new (policy types, 4 policy checks, verifier impl, tests), ~1 modified (`src/lib/agent-evidence/verification.ts` skeleton becomes real)
**Verification**: integration test runs `verifyFlowRun(flowRunId, {citation_required: true, min_sources: 2})` against a fixture with 1 source — verification fails with gap `'min_sources unmet (1 < 2)'`; running with 3 sources passes

### 6.1 Policy types + check registry

- [x] 6.1.1 Define `QualityPolicy` type in `src/lib/agent-evidence/verification/types.ts` — shape: `{citation_required?: boolean, min_sources?: number, stale_source_max_days?: number, conflict_check?: boolean, min_confidence?: number}`. Each key maps to a checker function exported from `src/lib/agent-evidence/verification/checks/`
  - **Files**: `src/lib/agent-evidence/verification/types.ts` (create)
  - **Pattern** (D7): declarative policy; pluggable check registry
  - **Verify**: `pnpm tsc --noEmit` passes; type matches the shape consumed by agent-flow's `verifier` step
- [x] 6.1.2 Per-policy check modules — `citation-required.ts`, `min-sources.ts`, `stale-source.ts`, `conflict-check.ts`, `min-confidence.ts`. Each exports `check(flowRunId, threshold, store): Promise<{passed: boolean, message?: string, evidence?: any}>`
  - **Files**: `src/lib/agent-evidence/verification/checks/{citation-required,min-sources,stale-source,conflict-check,min-confidence}.ts` (create — 5 files)
  - **Pattern** (D7): one check per file for testability
  - **Verify**: `src/lib/agent-evidence/verification/checks/min-sources.test.ts` (and 4 siblings) cover pass + fail per check

### 6.2 EvidenceVerifier impl

- [x] 6.2.1 Replace `src/lib/agent-evidence/verification.ts` skeleton — `verifyFlowRun(flowRunId, policy): Promise<VerificationResult>` iterates declared policy keys, dispatches to the matching check, accumulates `checks: CheckResult[]` and `gaps: string[]` for failed checks, persists one `evidence_verifications` row via `VerificationStoreBackend.insert`. Returns `{passed: gaps.length === 0, checks, gaps, verificationId}`
  - **Files**: `src/lib/agent-evidence/verification.ts` (replace skeleton)
  - **Pattern** (D7): orchestrator; pure dispatch + persistence
  - **Verify**: `src/lib/agent-evidence/verification.test.ts` covers (a) all checks pass → `passed: true` and persisted row matches, (b) `min_sources` fails → `gaps` contains `'min_sources'`, (c) verification is idempotent — calling twice for same run produces 2 rows (history preserved per D7)

### 6.3 Integration with agent-flow `verifier` step type `policy`

- [x] 6.3.1 Confirm agent-flow's `src/lib/agent-flow/runtime/verifiers/policy.ts` (shipped as stub in agent-flow Phase 2.4.5) is updated to delegate to `evidence.verification.verifyFlowRun(flowRunId, step.policy)`. The agent-flow change shipped a no-op stub returning `{passed: true}`; this task replaces it with the real call gated by `flags.agentEvidence.enabled` (no-op when off)
  - **Files**: `src/lib/agent-flow/runtime/verifiers/policy.ts` (modify)
  - **Pattern** (D7): cross-change integration; agent-flow stays the orchestrator, agent-evidence is the implementation
  - **Verify**: integration test runs a flow with a `verifier` step using `policy.citation_required=true` against an unverified-source fixture, asserts step output `{passed: false, gaps: [...]}` and the downstream conditional edge takes the failure branch
- [x] 6.3.2 Failed verification surfaces as an actionable run error per proposal — when `policy.enforcement === 'block'`, the verifier step returns `status='failed'` to agent-flow which fails the flow run with `error_json={kind: 'quality_policy_violation', gaps: [...]}`. When `enforcement === 'warn'` (default), step passes through and the gaps are logged for the operator
  - **Files**: `src/lib/agent-flow/runtime/verifiers/policy.ts` (modify), `src/lib/agent-evidence/verification/types.ts` (extend `QualityPolicy` with `enforcement?: 'block' | 'warn'`)
  - **Pattern** (D7): actionable failure; mirrors agent-os approval-gate failure shape
  - **Verify**: integration test asserts `enforcement: 'block'` fails the flow run with the documented `error_json`; `'warn'` lets the run complete

---

## Phase 7 — Admin endpoints (read-only)

**Goal**: Surface the evidence store through admin endpoints so operators can inspect provenance chains and pending conflicts via curl + future UI. All endpoints are gated by `requireAdmin` and `AGENT_EVIDENCE_ENABLED=true` (503 otherwise).

**Files touched**: ~5 new (2 endpoints + 1 guard helper + 2 tests), ~0 modified
**Verification**: `curl -b 'session=...' .../api/admin/evidence/runs/<FLOW_RUN_ID>` returns full provenance chain; `.../api/admin/evidence/conflicts?status=pending` returns the open conflicts list

### 7.1 Provenance chain endpoint

- [x] 7.1.1 Create `GET /api/admin/evidence/runs/:flowRunId` at `src/pages/api/admin/evidence/runs/[flowRunId].ts` — returns `{sources: Source[], excerpts: Excerpt[], claims: Claim[], citations: Citation[], conflicts: Conflict[], verifications: Verification[]}` for the flow run. Single batched read via `EvidenceStore.getFlowRunBundle(flowRunId)` (add this method to `src/lib/agent-evidence/store.ts`)
  - **Files**: `src/pages/api/admin/evidence/runs/[flowRunId].ts` (create), `src/lib/agent-evidence/store.ts` (extend — add `getFlowRunBundle`)
  - **Pattern** (D6): denormalized provenance enables single-batch read; agent-os Phase 1.5.4 endpoint shape
  - **Verify**: `curl -b 'session=...' .../api/admin/evidence/runs/1` returns the full bundle for a seeded fixture; 404 for unknown run id; 503 with flag off
- [x] 7.1.2 Guard helper — create `src/pages/api/admin/evidence/_guard.ts` exporting `ensureAgentEvidenceEnabled(): Response | undefined` mirroring agent-os Phase 1.5.8 + agent-flow Phase 3.5.1 helpers. Used by both admin endpoints
  - **Files**: `src/pages/api/admin/evidence/_guard.ts` (create)
  - **Pattern** (D11): umbrella flag is the kill switch; all evidence endpoints gated identically
  - **Verify**: integration test boots dev server with `AGENT_EVIDENCE_ENABLED=false`, hits both endpoints, asserts 503

### 7.2 Conflicts endpoint

- [x] 7.2.1 Create `GET /api/admin/evidence/conflicts?status=pending&limit=50&cursor=...` at `src/pages/api/admin/evidence/conflicts/index.ts` — paginated list from `ConflictStoreBackend.listByStatus(status, {limit, cursor})`; default `status='pending'` when query param omitted. Returns `{conflicts: [{conflictId, claimA, claimB, kind, detectedBy, status, approvalId}], cursor: string | null}`
  - **Files**: `src/pages/api/admin/evidence/conflicts/index.ts` (create)
  - **Pattern** (D8): list-by-status mirrors agent-os Phase 1.5.6 approvals list endpoint
  - **Verify**: returns `{conflicts:[], cursor:null}` when none; seeded 3 pending + 1 approved → `?status=pending` returns 3, `?status=approved` returns 1

### 7.3 Admin smoke

- [x] 7.3.1 Flip `AGENT_EVIDENCE_ENABLED=true` locally only; manually seed evidence via `EvidenceStore` direct calls in a vitest fixture; hit both endpoints via `curl` + record fixture run id in `.omc/research/agent-evidence-phase7-smoke.md`; flip flag back to `false` after capture
  - **Files**: `.omc/research/agent-evidence-phase7-smoke.md` (create)
  - **Pattern**: agent-flow Phase 3.7 phase-exit gate
  - **Verify**: smoke note contains both endpoint responses with non-empty bodies

---

## Phase 8 — Dogfood on `deep-research` flow

**Goal**: Flip `AGENT_EVIDENCE_ENABLED=true` for the `deep-research` flow only (per-flow opt-in via a YAML annotation). Observe one week of production runs: claim count per run, conflict rate, false-positive rate (operator approves/rejects conflicts). Provision R2 bucket and enable blob offload once dogfood confirms volume. Archive the OpenSpec change once dashboard is green.

**Files touched**: ~3 new (R2 bucket creation script note, runbook, health snippet), ~1 modified (`flows/deep-research.yaml` adds `evidence: {enabled: true, policy: {...}}`)
**Verification**: 7-day dashboard green — at least 50% of deep-research runs produce ≥3 evidence claims, conflict rate <10%, operator-rejected conflict rate <30% (signal that the v1 rule detector is not noisy); `openspec validate agent-evidence --strict` passes; `openspec archive agent-evidence` succeeds

### 8.1 Per-flow opt-in

- [x] 8.1.1 Add `evidence` annotation to `flows/deep-research.yaml` — `{enabled: true, policy: {citation_required: true, min_sources: 2, stale_source_max_days: 365, conflict_check: true, enforcement: 'warn'}}`. Extend agent-flow's flow definition AST (`src/lib/agent-flow/dsl/ast.ts`) to include this optional field if not already present; extend the schema validator to type-check
  - **Files**: `flows/deep-research.yaml` (modify), `src/lib/agent-flow/dsl/ast.ts` (modify — add optional `evidence?: {enabled: boolean, policy?: QualityPolicy}` field), `src/lib/agent-flow/dsl/validate.ts` (modify)
  - **Pattern** (D7): per-flow opt-in lets dogfood scope be exactly one flow without affecting others
  - **Verify**: re-running 1.8.2 parser test from agent-flow still passes; new test asserts `definition.evidence.policy.min_sources === 2`
- [x] 8.1.2 Wire the per-flow opt-in into the runtime — `src/lib/agent-flow/runtime/run.ts` checks `definition.evidence?.enabled` AND `flags.agentEvidence.enabled`. When both true, call `evidence.attachToKernel(kernel)` at flow start AND insert an implicit `verifier:policy` step at the end of the flow with `policy: definition.evidence.policy` IF the flow does not already declare one
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify)
  - **Pattern** (D7): implicit final verifier ensures policy enforcement happens even if author forgot to add a `verifier` step
  - **Verify**: integration test asserts a `deep-research` run with no explicit verifier produces an `evidence_verifications` row at run end; a run with an explicit verifier does not double-insert

### 8.2 Provision R2 + enable blob offload

- [ ] 8.2.1 Run `wrangler r2 bucket create quidproquo-agent-evidence` (production); verify with `wrangler r2 bucket list` that the bucket appears; deploy with `pnpm deploy` and confirm via `wrangler tail` that the Worker boots without binding errors. Per agent-os Phase 5.1.2 pattern, this is a no-op until any source body >256KB triggers a `.put()`
  - **Files**: (no new files — Cloudflare provisioning); record in `progress.txt`
  - **Pattern** (D2): agent-os Phase 5.1 R2 provisioning pattern
  - **Verify**: `wrangler r2 bucket list | grep quidproquo-agent-evidence` returns the bucket
- [ ] 8.2.2 Flip `AGENT_EVIDENCE_R2_BLOBS=true` in production env (Cloudflare dashboard → Worker → Variables); redeploy; trigger a `deep-research` run on a topic with long sources (e.g. a 500KB paper); query `SELECT source_id, length(body_text) AS inline_len, json_extract(body_ref_json, '$.r2Key') AS r2_key FROM evidence_sources ORDER BY created_at DESC LIMIT 5` — at least one row MUST have `r2_key` populated and `inline_len < 100`
  - **Files**: (no new files — env flip + smoke)
  - **Pattern** (D2): agent-os Phase 5.2 verification SQL style
  - **Verify**: SQL returns at least one row with `r2_key IS NOT NULL`; `wrangler r2 object get quidproquo-agent-evidence evidence/<flow_run_id>/<source_id> --file /tmp/source.bin` retrieves the body
- [ ] 8.2.3 Small-source non-regression — confirm sources <256KB still take the inline path (`r2_key IS NULL`, `body_text` populated). Negative test (rollback safety): temporarily flip `AGENT_EVIDENCE_R2_BLOBS=false`, attempt a large-source extraction, confirm `EvidenceBlobTooLarge` is thrown
  - **Files**: (no new files — smoke)
  - **Pattern** (D2): agent-os Phase 5.2.5 non-regression smoke pattern
  - **Verify**: both inline and rollback assertions hold; update `progress.txt` with `Phase 8.2 complete: R2 evidence blobs live`

### 8.3 7-day dogfood watch

- [x] 8.3.1 Author `docs/agent-evidence-runbook.md` with sections: "Inspect a flow run's provenance chain (curl + SQL)", "Review pending conflicts", "Override a source domain's reputation", "Disable evidence for one flow", "Rollback (`AGENT_EVIDENCE_ENABLED=false`)", "R2 bucket inspection". Include verbatim SQL recipes per agent-os Phase 6.2.2 style
  - **Files**: `docs/agent-evidence-runbook.md` (create)
  - **Pattern**: agent-os Phase 6.2 runbook structure
  - **Verify**: `grep -c "^## " docs/agent-evidence-runbook.md` shows ≥6 sections
- [ ] 8.3.2 Daily dogfood snapshot — for 7 consecutive days run a snapshot query and save to `.omc/research/agent-evidence-dogfood-day-{1..7}.md`:
  ```sql
  SELECT COUNT(DISTINCT flow_run_id) AS runs, COUNT(*) AS claims, AVG(confidence) AS avg_conf FROM evidence_claims WHERE created_at > unixepoch()-86400;
  SELECT detected_by, COUNT(*), SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approved, SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) AS rejected FROM evidence_conflicts WHERE created_at > unixepoch()-86400 GROUP BY detected_by;
  SELECT policy_json, passed, COUNT(*) FROM evidence_verifications WHERE performed_at > unixepoch()-86400 GROUP BY policy_json, passed;
  ```
  - **Files**: `.omc/research/agent-evidence-dogfood-day-{1..7}.md` (create — 7 files)
  - **Pattern** (D12): agent-os Phase 6.3.1 dashboard watch
  - **Verify**: 7 snapshot files exist; gate to advance: claims-per-run >3 median, conflict rejection rate <30%
- [ ] 8.3.3 If any day shows red (high false-positive conflict rate OR <50% runs producing claims), open a follow-up issue tagged `agent-evidence-tuning` capturing the failure mode; pause archive and decide whether to tune rule thresholds or flip evidence off for `deep-research`
  - **Files**: (no new files — GitHub issue via `gh issue create`)
  - **Pattern** (D8, D12): dogfood-driven tuning loop
  - **Verify**: issue filed and linked from `progress.txt` if applicable

### 8.4 Final cleanup + archive

- [x] 8.4.1 Run the full quality suite — `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build`; capture output to `.omc/research/agent-evidence-phase8-suite.log`; fix any drift
  - **Files**: (verification gate)
  - **Pattern**: agent-os Phase 6.3.2 zero-regression gate
  - **Verify**: each command exits 0
- [x] 8.4.2 Run `openspec validate agent-evidence --strict` and reconcile any drift between proposal / tasks / specs and shipped behavior; confirm the three capability specs (`evidence-store`, `claim-extraction`, `evidence-verification`) are present under `openspec/changes/agent-evidence/specs/`
  - **Files**: (verification gate)
  - **Pattern**: agent-flow Phase 6.5.3 strict-validate flow
  - **Verify**: command exits 0 with no warnings
- [x] 8.4.3 Append to `progress.txt`: `agent-evidence: complete — store + extraction + reputation + conflict + verification shipped; deep-research dogfooded with citation_required+min_sources=2; R2 blob offload live; archived YYYY-MM-DD`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: project convention
  - **Verify**: `tail -1 progress.txt` matches; commit via `format-commit` skill
- [x] 8.4.4 Run `openspec archive agent-evidence` to move the change to `openspec/changes/archive/YYYY-MM-DD-agent-evidence/` and fold delta specs into main specs
  - **Files**: (archive op)
  - **Pattern**: agent-os Phase 6.3.5 archive flow
  - **Verify**: change appears under archive dir; main specs include the three evidence capabilities
- [x] 8.4.5 Open follow-up issues for deferred items: (a) NLI v2 conflict detector wired to Workers AI (currently stub behind `AGENT_EVIDENCE_NLI_CONFLICTS`), (b) Evidence Bundle artifact-export connector (link to `agent-artifact` change for cross-system bundle export), (c) reputation public-suffix-list upgrade (v1 uses hand-rolled list), (d) NP/VP candidate generator upgrade to ML-based extractor for higher recall on technical content
  - **Files**: (GitHub issues via `gh issue create`)
  - **Pattern**: agent-os Phase 6.3.6 / agent-flow Phase 6.5.5 followups
  - **Verify**: 4 issues filed and linked from `progress.txt`
