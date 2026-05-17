# Tasks — agent-pipelines-unify

Implementation plan. 9 phases, ~60 tasks. Ports every existing pipeline definition in `src/lib/pipelines/registry.ts` to a flow YAML, reconciles `admin_jobs` → `flow_runs`, then deletes the pipeline runtime after a grace period. Pure orchestration migration — zero business-logic change.

> **Note**: `src/lib/pipelines/` ships definitions inline in `registry.ts` (not in a `definitions/` directory as the proposal implies). Phase 2 enumerates one phase-entry per pipeline based on the registry's `pipelineDefinitions` array.

## Pre-requisite

- `agent-flow` (change #7) shipped AND **stable in production for ≥2 weeks**: the `deep-research` reference flow must have run cleanly with zero unattended failures across the observation window. Capture the proof in `.omc/research/agent-pipelines-unify-prereq.md` (run ids, failure count, p95 latency) before opening Phase 1
- `agent-foundation` (change #0) shipped — central `Env`, `flags`, `json/unauthorized/badRequest`, `nowMs/nowIso`, `requireAdmin`, `requireScheduledAuth`, settings store, central `ToolDefinition` already imported by every endpoint touched here
- `agent-flow` Phases 1–6 complete: DSL parser + runtime + step executors (`agent`, `tool_group`, `transform`, `verifier`, `artifact`, `human_approval`, `sub_flow`, `parallel`, `loop`), durable execution, presets, admin endpoints (`/api/admin/flows/...`)
- Production data captured: `wrangler d1 export quidproquo-db --remote --table=admin_jobs --output /tmp/admin_jobs-baseline.sql` AND `SELECT COUNT(*) FROM admin_jobs` recorded in `.omc/research/agent-pipelines-unify-prereq.md` as the immutable baseline for Phase 3 row-count assertions

## Flag state by phase

| Phase | `AGENT_FLOW_ENABLED` | `PIPELINES_PORTED_TO_FLOW` | per-pipeline flag (`PIPELINE_<ID>_USE_FLOW`) | `ADMIN_PIPELINES_REDIRECT_TO_FLOW` | `ADMIN_JOBS_WRITES_ENABLED` |
|---|---|---|---|---|---|
| 1 | `true` | `false` | `false` (all) | `false` | `true` |
| 2 | `true` | `false` | flips to `true` one pipeline at a time as each is ported | `false` | `true` |
| 3 | `true` | `true` (after all 13 port) | `true` (all 13) | `false` | `true` |
| 4 | `true` | `true` | `true` (all) | `true` (dual-path: legacy URL → flow) | `true` |
| 5 | `true` | `true` | `true` | `true` | `true` (4-week observation; expected writes = 0) |
| 6 | `true` | `true` | `true` | `true` | `false` (deprecation warning + grace start) |
| 7 | `true` | `true` | `true` | `true` | `false` (runner/registry/job-store deleted) |
| 8 | `true` | `true` | `true` | `true` | n/a (`admin_jobs` table dropped) |
| 9 | `true` | `true` | `true` | `true` | n/a |

---

## Phase 1 — Mapping doc + parity harness

**Goal**: Document the pipeline → flow mapping exhaustively before touching a single pipeline, and ship the per-pipeline parity test scaffold that every Phase 2 port will instantiate. No production-facing change.

**Files touched**: ~4 new (mapping doc, parity harness, fixture loader, flag block), ~2 modified (`wrangler.jsonc`, `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-flow/pipelines-parity` green (the harness runs against a fixture pipeline; each Phase 2 task adds the real pipeline cases); `pnpm tsc --noEmit` green

### 1.1 Flags + env

- [ ] 1.1.1 Add `PIPELINES_PORTED_TO_FLOW` (global kill-switch), `ADMIN_PIPELINES_REDIRECT_TO_FLOW` (URL redirector toggle), `ADMIN_JOBS_WRITES_ENABLED` (legacy write toggle; defaults `true`, flipped `false` in Phase 6), plus 13 per-pipeline flags `PIPELINE_<ID>_USE_FLOW` (one per pipeline id from `src/lib/pipelines/registry.ts`) to `wrangler.jsonc` `vars` block all defaulting to `"false"` (except `ADMIN_JOBS_WRITES_ENABLED` → `"true"`); extend central `Env` type with the 16 new fields; register the `pipelinesUnify` sub-block in `src/lib/config/flags.ts` exposing `flags.pipelinesUnify.portedToFlow`, `flags.pipelinesUnify.adminRedirect`, `flags.pipelinesUnify.adminJobsWritesEnabled`, and `flags.pipelinesUnify.useFlow(pipelineId): boolean`
  - **Files**: `wrangler.jsonc` (modify — append to `vars`), `src/lib/config/env.ts` (modify — append 16 fields), `src/lib/config/flags.ts` (modify — append `pipelinesUnify` sub-object)
  - **Pattern**: D1 (flag table); agent-flow Phase 1.1.1 (per-flow flag block style)
  - **Verify**: `pnpm wrangler types` regenerates clean; `src/lib/config/flags.test.ts` extended to assert each new flag defaults `false` (and `adminJobsWritesEnabled` defaults `true`); `flags.pipelinesUnify.useFlow('research-brief')` toggles based on `PIPELINE_RESEARCH_BRIEF_USE_FLOW`

### 1.2 Mapping doc

- [ ] 1.2.1 Create `docs/pipeline-flow-mapping.md` — one section per pipeline (13 total) listing: (a) pipeline id, (b) source `src/lib/pipelines/registry.ts` line range, (c) target flow YAML path `flows/pipelines/<id>.yaml`, (d) step-by-step mapping table (pipeline stage id → flow step id, with `kind` translation: `module` → `tool_group`, `llm` → `agent`, `api` → `tool_group`, `human_review` → `human_approval`), (e) tools allowlist preserved verbatim from `tools: [...]`, (f) inputs preserved verbatim from `inputs: [...]`, (g) artifacts preserved from `artifacts: [...]`, (h) guards translation (most map to flow-level config; `tool_allowlist` becomes the per-step `tools` array, `budget_limit` becomes the flow-level `budget` block), (i) cron trigger if any (from `src/pages/api/admin/pipelines/scheduled.ts`)
  - **Files**: `docs/pipeline-flow-mapping.md` (create — ≥260 lines)
  - **Pattern**: design decision **D2-port-mapping** (one mapping section per pipeline drives one Phase 2 port task; missing pipeline → tasks file is incomplete); mirrors `openspec/changes/agent-flow/research-brief-mapping.md` shape from agent-flow Phase 3.4.2
  - **Verify**: `grep -c "^## " docs/pipeline-flow-mapping.md` returns ≥13 (one section per pipeline); `grep -oE "^## \`[a-z-]+\`" docs/pipeline-flow-mapping.md | sort -u | wc -l` matches `grep -oE "id: '[a-z-]+'" src/lib/pipelines/registry.ts | sort -u | wc -l` (every pipeline covered, none orphaned)

### 1.3 Parity harness

- [ ] 1.3.1 Build `src/lib/agent-flow/pipelines-parity/harness.ts` — exports `runPipelineParity({ pipelineId, flowId, input, db, kernel, stubs }): Promise<ParityReport>` which (a) calls `runPipeline(db, { pipelineId, input })` from `src/lib/pipelines/runner.ts`, (b) calls `runFlow(db, { flowId, input })` from `src/lib/agent-flow/runtime/run.ts`, (c) extracts structural signatures from both — ordered step ids (mapped via the doc from 1.2.1), ordered artifact kinds, ordered tool calls (from the legacy `admin_jobs.step_logs` JSON vs flow's `flow_step_runs.outputs_json.tool_calls`), ordered source URLs cited, total LLM token spend (≤ ±15 % tolerance per design **D3-parity-tolerance**), (d) returns `{ matched: boolean, diffs: ParityDiff[] }`
  - **Files**: `src/lib/agent-flow/pipelines-parity/harness.ts` (create), `src/lib/agent-flow/pipelines-parity/types.ts` (create — `ParityReport`, `ParityDiff`)
  - **Pattern**: agent-flow Phase 3.4.1 structural-parity style (LLM nondeterminism: assert structural shape, not text equality); D3-parity-tolerance
  - **Verify**: `src/lib/agent-flow/pipelines-parity/harness.test.ts` covers (a) identical step sequences → `matched: true`, (b) divergent step ordering → `matched: false` with a `step-order` diff, (c) tool call sets differing → `matched: false` with a `tool-call-set` diff, (d) token spend within 15 % → no diff, outside 15 % → `cost-drift` diff

- [ ] 1.3.2 Build `src/lib/agent-flow/pipelines-parity/fixtures.ts` — exports `loadParityFixture(pipelineId): { input, stubs }` reading from `openspec/changes/agent-pipelines-unify/fixtures/<id>/{input.json,stubs.json}`. Each Phase 2 port task seeds the matching fixture pair before flipping its per-pipeline flag
  - **Files**: `src/lib/agent-flow/pipelines-parity/fixtures.ts` (create), `openspec/changes/agent-pipelines-unify/fixtures/.gitkeep` (create)
  - **Pattern**: fixture loader; D3-parity-tolerance (reproducible inputs)
  - **Verify**: `src/lib/agent-flow/pipelines-parity/fixtures.test.ts` covers missing-pipeline → throws with the fixture path expected; valid pipeline → returns the JSON

---

## Phase 2 — Port pipelines one-by-one

**Goal**: For each of the 13 pipelines in `src/lib/pipelines/registry.ts`, write a flow YAML, instantiate the parity harness, run the smoke, then flip the per-pipeline flag in production. Each task is independently revertible by flipping its flag back to `false`.

**Per-pipeline task template** (used by every entry below):
1. Write `flows/pipelines/<id>.yaml` mirroring the legacy stage graph one-to-one (`module` → `tool_group`, `llm` → `agent`, `api` → `tool_group`, `human_review` → `human_approval`)
2. Seed `openspec/changes/agent-pipelines-unify/fixtures/<id>/{input.json,stubs.json}` (input recorded from a recent prod run via `SELECT input_json FROM admin_jobs WHERE pipeline_id='<id>' ORDER BY started_at DESC LIMIT 1`; stubs mirror provider responses)
3. Add `src/lib/agent-flow/pipelines-parity/<id>.test.ts` calling `runPipelineParity` and asserting `matched: true`
4. Local smoke: `pnpm vitest run src/lib/agent-flow/pipelines-parity/<id>` green
5. Production smoke: flip `PIPELINE_<ID_UPPERCASE>_USE_FLOW=true`, manually trigger via `POST /api/admin/pipelines/<id>/run`, confirm the resulting `flow_runs` row reaches `done`, capture run id in `.omc/research/agent-pipelines-unify-phase2-<id>.md`
6. Keep `ADMIN_JOBS_WRITES_ENABLED=true` — every run still writes the legacy `admin_jobs` row in parallel (Phase 5 turns off legacy writes after the observation window)

**Files touched per task**: ~3 new (YAML, fixture pair, parity test) + 1 flag flip
**Verification per task**: parity test green + production run row reaches status `done` + step-ordering deep-equals the mapping doc

**Pipelines from `src/lib/pipelines/registry.ts` (13 total)** — one Phase 2 task per pipeline, ported in ascending risk order:

### 2.1 Port `content-ops` (low risk, ops)

- [ ] 2.1.1 Port `content-ops` per template. Stages: `run-content-ops(module) → write-report-artifact(module)` → flow: `run_content_ops(tool_group) → write_artifact(artifact)`. Tools: `run_content_ops`, `write_artifact`. Budget: `maxRetries:1`, `maxRuntimeMs:120_000`, `maxExternalCalls:0`. Artifact: `content-ops-report:json_report`
  - **Files**: `flows/pipelines/content-ops.yaml` (create), `openspec/changes/agent-pipelines-unify/fixtures/content-ops/{input.json,stubs.json}` (create), `src/lib/agent-flow/pipelines-parity/content-ops.test.ts` (create)
  - **Pattern**: D2-port-mapping; section "content-ops" in `docs/pipeline-flow-mapping.md`
  - **Verify**: parity test green; prod-flip smoke: `flow_runs.status='done'` with the json_report artifact; `wrangler d1 execute --remote --command="SELECT step_id, status FROM flow_step_runs WHERE flow_run_id=?"` returns 2 rows both `done`

### 2.2 Port `glossary-gap` (medium risk, maintenance, scan-only)

- [ ] 2.2.1 Port `glossary-gap` per template. Stages: `glossary-gap-scan(module) → glossary-gap-report(module)` → flow: `read_glossary_stats(tool_group) → write_artifact(artifact)`. Tools: `read_glossary_stats`, `read_post_content`, `write_artifact`. Inputs: `days:14`, `minLookupCount:3`, `topTerms:20`, `topPostsPerTerm:5`. Budget: `maxRetries:1`, `maxRuntimeMs:180_000`, `maxExternalCalls:0`
  - **Files**: `flows/pipelines/glossary-gap.yaml`, `openspec/changes/agent-pipelines-unify/fixtures/glossary-gap/{input.json,stubs.json}`, `src/lib/agent-flow/pipelines-parity/glossary-gap.test.ts` (create)
  - **Pattern**: D2-port-mapping
  - **Verify**: parity test green; production smoke: flow run completes `done`; report artifact byte-equal to legacy within 2-line whitespace diff

### 2.3 Port `series-suggestions` (medium risk, scan-only, draft_only guard)

- [ ] 2.3.1 Port `series-suggestions` per template. Stages: `series-scan(module) → series-report(module)`. Tools: `read_post_content`, `write_artifact`. Inputs: `topSeriesCount:12`, `minPostsPerSeries:2`, `maxPostsPerSeries:8`, `minSignalLength:2`. Budget: `maxRetries:1`, `maxRuntimeMs:240_000`. Guards: `draft_only` (preserved as flow-level `draft_only: true` per D2-port-mapping)
  - **Files**: `flows/pipelines/series-suggestions.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping
  - **Verify**: parity test green; production smoke `done`; existing cron `POST /api/admin/pipelines/scheduled` still hits the legacy URL (Phase 4 ships the redirector — no cron change here)

### 2.4 Port `knowledge-graph-prototype` (medium risk, scan-only)

- [ ] 2.4.1 Port `knowledge-graph-prototype` per template. Stages: `knowledge-graph-scan(module) → knowledge-graph-report(module)`. Tools: `read_post_content`, `write_artifact`. Inputs: `minEntityFrequency:2`, `topNodes:80`, `minCoOccurrence:2`, `topEdges:180`. Budget: `maxRetries:1`, `maxRuntimeMs:240_000`
  - **Files**: `flows/pipelines/knowledge-graph-prototype.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping
  - **Verify**: parity test green; production smoke `done`; graph artifact node/edge counts within ±5 % (set-level structural parity per D3-parity-tolerance)

### 2.5 Port `freshness-review` (high risk, scan-only, weekly cron)

- [ ] 2.5.1 Port `freshness-review` per template. Stages: `freshness-scan(module) → freshness-report(module)`. Tools: `read_post_content`, `write_artifact`. Inputs: `maxAgeDays:365`, `riskThreshold:40`, `categoryFilter:''`, `languageFilter:''`. Budget: `maxRetries:1`, `maxRuntimeMs:180_000`. Guards: `draft_only`. **High risk** because this drives the weekly refresh-task generation — drift here silently affects editorial calendar; require two consecutive parity runs against fresh prod inputs before flipping the flag
  - **Files**: `flows/pipelines/freshness-review.yaml`, fixtures pair (2 distinct inputs), `src/lib/agent-flow/pipelines-parity/freshness-review.test.ts` (create — parameterised over 2 fixtures)
  - **Pattern**: D2-port-mapping; D3-parity-tolerance (high-risk → double-fixture)
  - **Verify**: parity green for both fixtures; production smoke `done`; **manual editorial spot-check** of the produced refresh-task list vs. a legacy run on the same day (record in `.omc/research/agent-pipelines-unify-phase2-freshness-review.md`)

### 2.6 Port `metadata-suggestions` (medium risk, production category)

- [ ] 2.6.1 Port `metadata-suggestions` per template. Stages: `read-post(module) → metadata-suggestion(module) → metadata-suggestion-evaluation(llm)` → flow: `read_post_content(tool_group) → write_artifact(tool_group) → review_evaluation(agent)`. Tools: `read_post_content`, `write_artifact`. Input: `slug` (required). Budget: `maxRetries:1`, `maxRuntimeMs:180_000`, `maxExternalCalls:1`. Artifacts: `metadata-suggestion-report`, `metadata-suggestion-evaluation`
  - **Files**: `flows/pipelines/metadata-suggestions.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping (`llm` stage → `agent` step with `agentId: 'writer'` for the evaluation pass, per the kernel agents already registered in agent-os Phase 3.5)
  - **Verify**: parity green; production smoke `done`; both artifact kinds present

### 2.7 Port `internal-links` (medium risk, production category)

- [ ] 2.7.1 Port `internal-links` per template. Stages: `read-post → run-content-ops → link-report → internal-link-evaluation(llm)`. Tools: `read_post_content`, `run_content_ops`, `write_artifact`. Input: `slug` (required). Budget: `maxRetries:1`, `maxRuntimeMs:180_000`, `maxExternalCalls:1`. Artifacts: `internal-links-report`, `internal-link-evaluation`
  - **Files**: `flows/pipelines/internal-links.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping
  - **Verify**: parity green; production smoke `done`; link-set jaccard ≥ 0.9 vs legacy on the same post (per D3-parity-tolerance for LLM nondeterminism)

### 2.8 Port `post-quality` (low risk, deterministic checks + 1 LLM stage)

- [ ] 2.8.1 Port `post-quality` per template. Stages: `quality-check(module) → reference-check(module) → quality-evaluation(llm) → quality-report(module)`. Tools: `read_post_content`, `run_post_quality_check`, `run_reference_check`, `write_artifact`. Input: `slug` (optional). Budget: `maxRetries:1`, `maxRuntimeMs:120_000`, `maxExternalCalls:1`. Artifacts: `quality-report`, `quality-evaluation`
  - **Files**: `flows/pipelines/post-quality.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping
  - **Verify**: parity green (deterministic checks → exact equality possible for `quality-report.checks[]`); production smoke `done`

### 2.9 Port `embed-sync` (medium risk, knowledge category, write-side effect)

- [ ] 2.9.1 Port `embed-sync` per template. Stages: `embed-sync(api) → embed-report(api)`. Tools: `run_embed_sync`, `write_artifact`. Inputs: `sources:['posts','docs']`, `offset:0`, `limit:50`. Budget: `maxRetries:2`, `maxRuntimeMs:600_000`, `maxExternalCalls:1`. **Write-side effect**: uses the Vectorize binding to upsert embeddings — parity test stubs the embed call and asserts (a) the same input batch is dispatched, (b) the result artifact JSON matches; production smoke flips the flag for one batch only and confirms via `wrangler d1 execute --remote --command="SELECT COUNT(*) FROM embed_log WHERE batch_id=?"` that the upsert happened exactly once (not duplicated by the dual write)
  - **Files**: `flows/pipelines/embed-sync.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping; D4-write-side-effect-isolation (dual-path runs the side effect via the flow path; legacy `admin_jobs` row records the metadata only and skips re-dispatch — guarded by `ADMIN_JOBS_WRITES_ENABLED` legacy short-circuit)
  - **Verify**: parity green; production smoke `done` with embed count = legacy count for the same input batch

### 2.10 Port `crawl-sync` (medium risk, knowledge, dual-auth header)

- [ ] 2.10.1 Port `crawl-sync` per template. Stages: `crawl-sync(api) → crawl-report(api)`. Tools: `run_crawl_sync`, `write_artifact`. Inputs: `full:false`, `modifiedSince:number`. Budget: `maxRetries:2`, `maxRuntimeMs:600_000`, `maxExternalCalls:1`. **Auth**: invoked via `X-Crawl-Secret` header in addition to admin session — flow YAML adds `triggers: { cron: true, scheduled: true }` so `requireScheduledAuth` from agent-foundation 1.7.1 accepts both. The actual crawl HTTP request stays on the Worker endpoint with `CRAWL_SECRET` validation; this port only changes how the **job record** is created
  - **Files**: `flows/pipelines/crawl-sync.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping; agent-foundation 1.7.1 dual-auth
  - **Verify**: parity green; production smoke via `curl -X POST -H 'X-Crawl-Secret: ...' /api/admin/pipelines/crawl-sync/run` returns 200 with a `flowRunId`; legacy admin job row continues to be written (dual-path)

### 2.11 Port `youtube-brief` (high risk, external network, human_review gate)

- [ ] 2.11.1 Port `youtube-brief` per template. Stages: `youtube-brief(module) → youtube-quality(module) → youtube-reference(module) → youtube-review(human_review) → youtube-write-draft(module) → youtube-report(module)`. The `human_review` stage maps to flow's `human_approval` step (agent-flow Phase 4.3 executor). Tools: `write_draft_artifact`, `run_post_quality_check`, `run_reference_check`, `write_artifact`. Inputs: `videoUrl` (required), `language:zh-TW`, `includeTranscript:true`. Budget: `maxRetries:0`, `maxRuntimeMs:280_000`, `maxExternalCalls:2`. **High risk**: external oEmbed + timed-text fetch + writes a draft markdown file. Parity test stubs the network calls and asserts the draft markdown body shape matches; the human-approval gate is auto-approved in the parity fixture and exercised manually for the production smoke
  - **Files**: `flows/pipelines/youtube-brief.yaml`, fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping; agent-flow Phase 4.3 (`human_approval`); D4-write-side-effect-isolation (`write_draft_artifact` is the side effect — flow path owns it; legacy short-circuits)
  - **Verify**: parity green; production smoke with manual approval `done`; draft markdown frontmatter (`title`, `lang`, `tags`) deep-equals legacy

### 2.12 Port `translation` (high risk, multi-LLM, human_review gate, draft writes)

- [ ] 2.12.1 Port `translation` per template. Stages: `read-source → translate(llm) → cultural-review(llm) → native-check(llm) → quality-check → reference-check → review-gate(human_review) → write-draft → translation-report`. Maps to a 9-step flow with three `agent` steps (translate/cultural/native using kernel `writer` agent with distinct prompts) and one `human_approval` step. Tools: `read_post_content`, `write_draft_artifact`, `run_post_quality_check`, `run_reference_check`, `write_artifact`. Input: `slug` (required). Budget: `maxRetries:1`, `maxRuntimeMs:1_200_000`, `maxExternalCalls:3`. **High risk**: highest LLM-call count, only stage that actually writes user-visible draft markdown to `src/content/posts/`. Require **three** consecutive parity runs against three distinct posts before flipping the flag; capture each in `.omc/research/agent-pipelines-unify-phase2-translation.md`
  - **Files**: `flows/pipelines/translation.yaml`, `openspec/changes/agent-pipelines-unify/fixtures/translation/{input.{1,2,3}.json,stubs.{1,2,3}.json}` (3 fixture pairs), parity test parameterised over the 3 fixtures (create)
  - **Pattern**: D2-port-mapping; D3-parity-tolerance (high-risk → triple-fixture); D4-write-side-effect-isolation
  - **Verify**: parity green for all 3 fixtures; production smoke with one real post → `done` with human approval; draft markdown deep-equals legacy except LLM-nondeterministic prose (frontmatter must be exact)

### 2.13 Port `research-brief` (high risk — already largely covered by deep-research; explicit port for the standalone pipeline trigger path)

- [ ] 2.13.1 Port `research-brief` per template. Stages: `research-brief(llm) → research-quality(module) → research-reference(module) → research-review(human_review) → research-write-draft(module) → research-report(module)`. Inputs: `topic` (required), `language:zh-TW`, `researchDepth:standard`, `includeExternalSources:true`. Budget: `maxRetries:0`, `maxRuntimeMs:360_000`, `maxExternalCalls:1`. **Note**: the agent-flow `deep-research` reference flow already covers most of this logic, but the pipeline-shaped invocation path still exists — this port creates `flows/pipelines/research-brief.yaml` as a thin wrapper that may eventually be retired in favor of `deep-research` directly. The wrapper preserves the legacy pipeline input shape so admin URLs work unchanged
  - **Files**: `flows/pipelines/research-brief.yaml` (wrapper invoking deep-research as a sub-flow per agent-flow Phase 4.4 `sub_flow` step), fixtures pair, parity test (create)
  - **Pattern**: D2-port-mapping; D5-research-brief-wrapper (document in mapping doc 1.2.1 that this is a sub-flow wrapper, not a fresh port — proves the `sub_flow` step type in production)
  - **Verify**: parity green; production smoke `done`; inner deep-research run id deep-linked via `parent_flow_run_id`

### 2.14 Phase 2 exit gate

- [ ] 2.14.1 Verify all 13 per-pipeline flags `PIPELINE_<ID>_USE_FLOW` are `true` in production; flip the global `PIPELINES_PORTED_TO_FLOW=true` to enable Phase 3's data reconciliation pre-conditions; append to `progress.txt`: `agent-pipelines-unify Phase 2 complete — all 13 pipelines ported to flow with parity tests green; dual-path active`
  - **Files**: `progress.txt` (modify — append one line)
  - **Pattern**: phase-end gate
  - **Verify**: `wrangler secret list` (or dashboard) shows all 13 per-pipeline flags `true`; `tail -1 progress.txt` includes the phase line; capture timestamps in `.omc/research/agent-pipelines-unify-phase2-exit.md`

---

## Phase 3 — Data reconciliation migration `0019_admin_jobs_to_flow_runs.sql`

**Goal**: Migrate every `admin_jobs` row into `flow_runs` with `parent_kind='pipeline'` so the admin UI's history view shows uninterrupted lineage. Preserve every column. Highest-risk part of this change — dry-run + production backup + row-count assertions are mandatory.

**Files touched**: 1 new migration file, 1 verification script, runbook entry
**Verification**: row-count assertion `pre.admin_jobs_count == post.flow_runs_count_with_parent_kind_pipeline`; every legacy `admin_job` id reachable via `flow_runs.parent_kind='pipeline' AND parent_external_id=?`

### 3.1 Migration shape

- [ ] 3.1.1 Write `migrations/0019_admin_jobs_to_flow_runs.sql` — forward-only migration that (a) confirms `flow_runs` has `parent_kind TEXT` and `parent_external_id TEXT` columns (add via `ALTER TABLE` if missing — guarded with `SELECT COUNT(*) FROM pragma_table_info('flow_runs') WHERE name='parent_kind'` pattern), (b) inserts one `flow_runs` row per `admin_jobs` row preserving: `flow_run_id` (new), `flow_id = 'pipeline-' || pipeline_id` (synthetic mapping per D6-synthetic-flow-id so legacy ids never collide with real flow ids), `status` (mapped: `'pending'→'queued'`, `'running'→'running'`, `'succeeded'→'done'`, `'failed'→'failed'`, `'cancelled'→'cancelled'`), `started_at`, `finished_at`, `latency_ms`, `input_json`, `output_json`, `error_json`, `parent_kind='pipeline'`, `parent_external_id=admin_job_id` (the original row's id, preserved for round-trip lookups). Step-level logs (`step_logs` JSON array) are exploded into `flow_step_runs` rows ordered by `step_index` with `parent_flow_run_id` set. Embed two `-- ASSERT: SELECT COUNT(*) FROM admin_jobs;` and `-- ASSERT: SELECT COUNT(*) FROM flow_runs WHERE parent_kind='pipeline';` lines so the runbook script can parse them
  - **Files**: `migrations/0019_admin_jobs_to_flow_runs.sql` (create)
  - **Pattern**: agent-foundation Phase 3.1.1 (migration shape, `-- ASSERT` style); D6-synthetic-flow-id
  - **Verify**: file parses with `sqlite3 :memory:` against a seeded admin_jobs+flow_runs schema; running it twice in a row is a no-op (idempotent via `INSERT OR IGNORE` keyed on `(parent_kind, parent_external_id)`); `-- ASSERT` comments present
- [ ] 3.1.2 Append a documented down-migration recipe as a comment block: `-- DOWN: DELETE FROM flow_runs WHERE parent_kind='pipeline' AND parent_external_id IS NOT NULL; DELETE FROM flow_step_runs WHERE flow_run_id NOT IN (SELECT flow_run_id FROM flow_runs);` (admin_jobs rows are not deleted by the up migration so the down recipe just removes the imported flow_runs/flow_step_runs lineage)
  - **Files**: `migrations/0019_admin_jobs_to_flow_runs.sql` (modify — append comment)
  - **Pattern**: agent-foundation Phase 3.1.2 (down-migration as documented comment)
  - **Verify**: comment present; recipe is verbatim executable

### 3.2 Local dry-run with row-count assertions

- [ ] 3.2.1 Build `scripts/verify-0014-dry-run.mjs` — node script that (a) reads `SELECT COUNT(*) FROM admin_jobs` pre, (b) reads `SELECT SUM(json_array_length(step_logs)) FROM admin_jobs` pre (total expected `flow_step_runs` insertions), (c) applies the migration via `wrangler d1 migrations apply quidproquo-db --local`, (d) reads `SELECT COUNT(*) FROM flow_runs WHERE parent_kind='pipeline'` post and asserts equality with pre.admin_jobs_count, (e) reads `SELECT COUNT(*) FROM flow_step_runs WHERE flow_run_id IN (SELECT flow_run_id FROM flow_runs WHERE parent_kind='pipeline')` and asserts equality with pre.step_logs_total. Exits non-zero on mismatch with a diff message
  - **Files**: `scripts/verify-0014-dry-run.mjs` (create)
  - **Pattern**: agent-foundation Phase 3.2.1 (row-count assertion script style); proposal §"Risk: data preservation … lost history would be irrecoverable"
  - **Verify**: seed local D1 with `wrangler d1 execute quidproquo-db --local --command="INSERT INTO admin_jobs (pipeline_id, status, input_json, step_logs) VALUES ('test-pipeline','succeeded','{}','[{\"step\":\"a\"},{\"step\":\"b\"}]')"`; run the script; assert it prints `PASS pre=1 post=1 step_pre=2 step_post=2`
- [ ] 3.2.2 Run full test+lint+endpoint smoke after the dry-run: `pnpm vitest run && pnpm exec astro check && curl -b 'session=...' http://localhost:4321/api/admin/jobs | jq '.jobs | length'` returns the same count as before the migration (admin_jobs table preserved, plus the union with flow_runs becomes visible once the read-side union in 3.3 lands)
  - **Files**: (no new files — verification gate)
  - **Pattern**: zero-behavior-change invariant
  - **Verify**: counts match; lint/check/test green

### 3.3 Admin-jobs read-side union

- [ ] 3.3.1 Update `src/pages/api/admin/jobs/index.ts` and `src/pages/api/admin/jobs/[id].ts` to read from `flow_runs WHERE parent_kind='pipeline'` UNION `admin_jobs` (deduped on `parent_external_id`/`id`) so the admin UI shows the imported history alongside any new flow runs. After Phase 5 (no more admin_jobs writes) the union is still required to render the legacy history; after Phase 8 (admin_jobs dropped) the union simplifies to `flow_runs` only
  - **Files**: `src/pages/api/admin/jobs/index.ts` (modify), `src/pages/api/admin/jobs/[id].ts` (modify)
  - **Pattern**: D7-jobs-union-read; proposal §"admin job-list endpoint reads from both during transition"
  - **Verify**: `curl -b 'session=...' /api/admin/jobs` returns the same job ids as before the migration (imported flow_runs surface with their original `admin_job_id` via `parent_external_id`); per-id detail at `/api/admin/jobs/:id` returns 200 for both new flow runs and legacy admin_job ids

### 3.4 Production backup + apply

- [ ] 3.4.1 Capture production backup before apply: `wrangler d1 export quidproquo-db --remote --output /tmp/quidproquo-pre-0014.sql --table=admin_jobs --table=flow_runs --table=flow_step_runs`; record SHA256 of the dump in `.omc/research/agent-pipelines-unify-phase3-backup.md` alongside the apply timestamp and the pre-migration counts: `admin_jobs_count`, `sum(json_array_length(step_logs))`
  - **Files**: `.omc/research/agent-pipelines-unify-phase3-backup.md` (create)
  - **Pattern**: agent-foundation Phase 3.3.1 (production backup discipline)
  - **Verify**: backup file exists, SHA256 recorded, counts logged
- [ ] 3.4.2 Apply migration to production: `wrangler d1 migrations apply quidproquo-db --remote`; run `scripts/verify-0014-dry-run.mjs --remote` (extend the script with a `--remote` flag) and assert PASS; record post-counts in the backup note
  - **Files**: (no new files — production apply; results in `.omc/research/agent-pipelines-unify-phase3-backup.md` modify)
  - **Pattern**: agent-foundation Phase 3.3.2
  - **Verify**: script PASS against `--remote`; `curl https://quidproquo.cc/api/admin/jobs?limit=1` returns 200 with at least one job from the imported set; record `applied at: <iso>, post_count: N` in the backup note

---

## Phase 4 — Admin endpoint redirectors

**Goal**: Make every `POST /api/admin/pipelines/:id/run` URL transparently dispatch a flow run instead of a pipeline run, with payload translation. Existing URLs (and the cron jobs that hit them) stay unchanged. Gated by `ADMIN_PIPELINES_REDIRECT_TO_FLOW` flag for instant rollback.

**Files touched**: ~3 modified, 1 new (redirector module), tests
**Verification**: per-URL curl smoke confirms identical envelope; cron-driven scheduled invocations land in `flow_runs` not `admin_jobs`

### 4.1 Payload translator

- [ ] 4.1.1 Build `src/lib/pipelines/redirector.ts` — `translatePipelineToFlowInput(pipelineId, body): { flowId, input }` deriving `flowId = 'pipeline-' || pipelineId` (mirrors D6-synthetic-flow-id from migration 3.1.1) and mapping the legacy body shape (`{ inputs: {...}, options: {...} }`) to the flow input shape (`{ ...inputs, _options: options }`). Returns `null` if the pipeline id has no `flows/pipelines/<id>.yaml` registered, letting the redirector fall back to legacy
  - **Files**: `src/lib/pipelines/redirector.ts` (create)
  - **Pattern**: D6-synthetic-flow-id; D8-redirector-payload-translation
  - **Verify**: `src/lib/pipelines/redirector.test.ts` covers (a) known pipeline → returns mapped shape, (b) unknown pipeline → returns `null`, (c) extra body keys preserved under `_options`

### 4.2 Endpoint redirector wiring

- [ ] 4.2.1 Update `src/pages/api/admin/pipelines.ts` POST handler — when `flags.pipelinesUnify.adminRedirect === true` AND `flags.pipelinesUnify.useFlow(pipelineId) === true` AND `translatePipelineToFlowInput` returns non-null, dispatch via `runFlow` and return `{ jobId: flowRunId, flowRunId, redirected: true }` (preserves the `jobId` key for legacy UI clients). Otherwise fall through to the existing `runPipeline` path
  - **Files**: `src/pages/api/admin/pipelines.ts` (modify POST handler)
  - **Pattern**: D8-redirector-payload-translation; D9-flag-gated-dual-path
  - **Verify**: `curl -X POST -b 'session=...' /api/admin/pipelines/research-brief/run -d '{"inputs":{"topic":"x"}}'` returns 200 with `redirected: true` and a `flowRunId` matching a row in `flow_runs`; flipping flag off returns the legacy `jobId` shape with a row in `admin_jobs`
- [ ] 4.2.2 Update `src/pages/api/admin/pipelines/scheduled.ts` POST handler — same redirector logic; preserves the dual-auth (`X-Crawl-Secret` header OR admin session) via `requireScheduledAuth` from agent-foundation 1.7.1. Cron jobs continue to hit the same URL; the body translation is invisible to the caller
  - **Files**: `src/pages/api/admin/pipelines/scheduled.ts` (modify POST handler)
  - **Pattern**: D8-redirector-payload-translation
  - **Verify**: `curl -X POST -H 'X-Crawl-Secret: $CRAWL_SECRET' /api/admin/pipelines/scheduled -d '{"pipelineId":"series-suggestions"}'` returns 200 with `flowRunId`; capture the run id and assert a row exists in `flow_runs` with `parent_kind='pipeline'` for the cron-triggered invocation

### 4.3 Per-URL smoke test

- [ ] 4.3.1 Build `scripts/smoke-pipeline-redirectors.sh` — bash script that iterates all 13 pipeline ids and runs `curl -X POST -b 'session=$SESSION' /api/admin/pipelines/$id/run -d '{"inputs":{}}'` for each (with minimal required inputs from the fixtures dir from Phase 2); asserts 200 and a `flowRunId` in the response; prints PASS/FAIL per pipeline
  - **Files**: `scripts/smoke-pipeline-redirectors.sh` (create)
  - **Pattern**: agent-foundation Phase 5.2.1 (smoke-script style); per-URL coverage
  - **Verify**: script exits 0 with 13 PASS lines; capture output to `.omc/research/agent-pipelines-unify-phase4-smoke.log`

### 4.4 Phase 4 exit gate

- [ ] 4.4.1 Flip `ADMIN_PIPELINES_REDIRECT_TO_FLOW=true` in production env vars; redeploy; rerun the smoke script against production; append to `progress.txt`: `agent-pipelines-unify Phase 4 complete — admin endpoints redirect to flow; cron-driven invocations land in flow_runs`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: phase-end gate
  - **Verify**: production smoke PASS for all 13; `tail -1 progress.txt` matches

---

## Phase 5 — Dual-path observation window (4 weeks)

**Goal**: Run both paths in parallel for 4 weeks and observe `admin_jobs` write count trending to zero. If any new `admin_jobs` row appears (other than the legacy short-circuit metadata rows from 2.9 embed-sync and 2.10 crawl-sync), the redirector has a gap and we pause Phase 6.

**Files touched**: 1 new doc (observation log), 0 modified
**Verification**: SQL query showing `admin_jobs` writes per day = 0 for ≥28 consecutive days

### 5.1 Daily monitoring

- [ ] 5.1.1 Build `scripts/observe-admin-jobs-writes.mjs` — node script that runs `SELECT date(started_at) AS day, COUNT(*) AS writes FROM admin_jobs WHERE started_at > date('now', '-1 day') GROUP BY day` against production D1 daily (invoked by an existing cron stub or manually); appends a single line `YYYY-MM-DD writes=N` to `.omc/research/agent-pipelines-unify-phase5-observation.md`. Threshold: writes must equal 0 (or the documented legacy-short-circuit metadata count from embed-sync/crawl-sync, capped at the daily expected cron frequency)
  - **Files**: `scripts/observe-admin-jobs-writes.mjs` (create), `.omc/research/agent-pipelines-unify-phase5-observation.md` (create — header)
  - **Pattern**: D9-flag-gated-dual-path observation; proposal §"running both paths in parallel for 4 weeks before flipping the cron"
  - **Verify**: `node scripts/observe-admin-jobs-writes.mjs --remote` exits 0 and appends today's line; ad-hoc validation `wrangler d1 execute quidproquo-db --remote --command="SELECT COUNT(*) FROM admin_jobs WHERE started_at > date('now','-7 day')"` returns 0 (or the expected legacy-short-circuit count)

### 5.2 Window completion gate

- [ ] 5.2.1 After 28 consecutive daily lines with `writes=0`, assemble the observation report in `.omc/research/agent-pipelines-unify-phase5-observation.md` with: start date, end date, total observed days, max writes/day, list of any non-zero-day root causes (each must be a documented legacy-short-circuit case). Final assertion: `SELECT COUNT(*) FROM admin_jobs WHERE started_at > '<phase5-start-iso>' AND started_at < '<phase5-end-iso>'` returns 0
  - **Files**: `.omc/research/agent-pipelines-unify-phase5-observation.md` (modify — append final report)
  - **Pattern**: special verification per phase 5 task; D9 observation gate
  - **Verify**: the SQL query at the bottom of the report returns 0 (capture in the doc); append to `progress.txt`: `agent-pipelines-unify Phase 5 complete — 28-day zero-write observation passed; safe to deprecate legacy runner`

---

## Phase 6 — Deprecate `src/lib/pipelines/runner.ts`

**Goal**: Mark the pipeline runtime as deprecated, flip `ADMIN_JOBS_WRITES_ENABLED=false`, and verify no remaining caller writes to `admin_jobs`. Begin the 4-week grace period before Phase 7 deletes the runtime files.

**Files touched**: ~3 modified (runner export, registry, job-store), 1 new deprecation comment block
**Verification**: grep + lint shows zero direct callers of `runPipeline`; `admin_jobs` write count remains 0 with the new flag setting

### 6.1 Deprecation markers

- [ ] 6.1.1 Add `@deprecated` JSDoc comments on `runPipeline` in `src/lib/pipelines/runner.ts`, `listPipelines`/`getPipelineDefinition` in `src/lib/pipelines/registry.ts`, and `recordAdminJob`/`updateAdminJob` in `src/lib/pipelines/job-store.ts` with the message `@deprecated since agent-pipelines-unify Phase 6 — use src/lib/agent-flow/runtime/run.ts; this module is scheduled for deletion in Phase 7`. Enable `noUnusedExports` warnings (or equivalent) so any new import surfaces as a lint warning
  - **Files**: `src/lib/pipelines/runner.ts` (modify — add JSDoc), `src/lib/pipelines/registry.ts` (modify), `src/lib/pipelines/job-store.ts` (modify)
  - **Pattern**: standard JSDoc `@deprecated` tag with rationale + replacement pointer
  - **Verify**: `pnpm lint` warns on every existing caller (expected — phase 7 deletes those callers); `grep -rn "@deprecated" src/lib/pipelines/{runner,registry,job-store}.ts` returns ≥3 lines

### 6.2 Caller audit

- [ ] 6.2.1 Run `grep -rn "from.*pipelines/runner\|from.*pipelines/registry\|from.*pipelines/job-store" src/ --include='*.ts' --include='*.astro'` and list every remaining caller. For each: confirm the caller is either (a) the admin endpoint redirector (fine — falls through only when the flag is off, which it never is after Phase 4), (b) the admin-jobs read-side union in `src/pages/api/admin/jobs/*.ts` (fine — read-side only), or (c) a stale caller to be fixed before Phase 7
  - **Files**: `.omc/research/agent-pipelines-unify-phase6-caller-audit.md` (create — caller list with classification)
  - **Pattern**: pre-deletion safety audit
  - **Verify**: every caller classified; no `(c)` stale callers remain — fix any before proceeding

### 6.3 Flip legacy writes off

- [ ] 6.3.1 Flip `ADMIN_JOBS_WRITES_ENABLED=false` in production env vars; redeploy. The legacy `recordAdminJob` and `updateAdminJob` helpers in `job-store.ts` short-circuit to no-ops when this flag is false (add the guard in this task — guarded write per D10-flag-gated-write); run `scripts/observe-admin-jobs-writes.mjs --remote` for 7 days and confirm continues to return 0
  - **Files**: `src/lib/pipelines/job-store.ts` (modify — add `if (!flags.pipelinesUnify.adminJobsWritesEnabled) return` short-circuit at the top of every write function)
  - **Pattern**: D10-flag-gated-write
  - **Verify**: production smoke + 7-day observation log appended to `.omc/research/agent-pipelines-unify-phase5-observation.md` (continuation); append to `progress.txt`: `agent-pipelines-unify Phase 6 complete — legacy writes off, 4-week grace started`

---

## Phase 7 — Delete `src/lib/pipelines/{runner,job-store,registry}.ts`

**Goal**: After the 4-week grace from Phase 6, physically remove the deprecated files. `src/lib/pipelines/tool-registry.ts` stays as an adapter (per agent-foundation 2.9.1 it already adapts to the central registry — no longer a leaf module). Update the tool-registry test to remove pipeline-only assertions.

**Files touched**: 3 deleted, ~5 modified (callers + tool-registry test)
**Verification**: `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references` green after deletion; grep returns zero references to the deleted modules

### 7.1 Pre-deletion final caller sweep

- [ ] 7.1.1 Re-run the Phase 6.2.1 caller audit grep — assert zero callers remain outside the admin-jobs read-side union (which itself was updated in Phase 3.3.1 to query `flow_runs` first and only union with `admin_jobs` for the legacy table). If any caller remains, fix it before deletion or wait
  - **Files**: `.omc/research/agent-pipelines-unify-phase7-pre-deletion-audit.md` (create)
  - **Pattern**: pre-deletion safety audit (second pass)
  - **Verify**: `grep -rn "from.*pipelines/runner\|from.*pipelines/registry\|from.*pipelines/job-store" src/ --include='*.ts' --include='*.astro'` returns 0 lines, OR every remaining hit is documented and acceptable (e.g. the admin-jobs union endpoint reading `admin_jobs` directly via D1 SQL, not via the module)

### 7.2 Delete the three modules

- [ ] 7.2.1 `git rm src/lib/pipelines/runner.ts src/lib/pipelines/registry.ts src/lib/pipelines/job-store.ts`. Also delete now-orphaned helpers `src/lib/pipelines/context-builder.ts`, `src/lib/pipelines/translators.ts`, `src/lib/pipelines/content-utils.ts`, and the per-pipeline modules in `src/lib/pipelines/modules/*.ts` and `src/lib/pipelines/guards/*.ts` if (and only if) the Phase 7.1 audit confirms zero remaining importers — the flow YAMLs declare their behavior via tool names, so the module-level helpers should already be unreachable
  - **Files**: 3 primary deletions + N orphaned-helper deletions (audited and listed in 7.1.1)
  - **Pattern**: file deletion after grace period; agent-flow Phase 6.5.5 cleanup style
  - **Verify**: `pnpm tsc --noEmit` green (no broken imports); `pnpm vitest run` green
- [ ] 7.2.2 Keep `src/lib/pipelines/tool-registry.ts` and `src/lib/pipelines/types.ts` — `tool-registry.ts` remains as the adapter shipped in agent-foundation 2.9.1 (in case any external caller still depends on the pipeline-shape view); `types.ts` may still be imported by stale code paths surfaced by Phase 7.1 — leave both until a follow-up cleanup. Document the decision in `docs/pipeline-flow-mapping.md` epilogue
  - **Files**: `docs/pipeline-flow-mapping.md` (modify — append epilogue: "what survives the deletion")
  - **Pattern**: D11-tool-registry-adapter-survives
  - **Verify**: `src/lib/pipelines/tool-registry.ts` still exists; epilogue present

### 7.3 Tool-registry test update

- [ ] 7.3.1 Update `src/lib/pipelines/tool-registry.test.ts` — remove any assertion that depended on the now-deleted `runPipeline` / pipeline-definition imports; keep the 3 cases from agent-foundation 2.9.1 (pipeline-only listing, central listing, allowlist validation) but rewrite case (c) to validate against the flow YAMLs in `flows/pipelines/*.yaml` instead of the deleted `pipelineDefinitions` array. The adapter's pipeline-only entries become a read of flow YAML metadata where applicable
  - **Files**: `src/lib/pipelines/tool-registry.test.ts` (modify)
  - **Pattern**: D11-tool-registry-adapter-survives
  - **Verify**: `pnpm vitest run src/lib/pipelines` green with the rewritten cases; coverage report shows the adapter still tested

---

## Phase 8 — `admin_jobs` table sunset migration `0020_drop_admin_jobs.sql`

**Goal**: After 90 days of zero writes (gated on the Phase 5 observation log being extended through Phase 7's grace period — total observation ≥ 28+30+32 days), drop the `admin_jobs` table. The history rows were copied to `flow_runs` in Phase 3 so no data is lost. Update the read-side union in `src/pages/api/admin/jobs/*.ts` to drop the legacy branch.

**Files touched**: 1 new migration, ~2 modified (admin-jobs endpoints), 1 new backup note
**Verification**: 90-day zero-write proof captured in the observation log; production backup taken before drop; admin-jobs endpoints still return identical envelopes (now sourced from `flow_runs` only)

### 8.1 90-day zero-write proof

- [ ] 8.1.1 Run `wrangler d1 execute quidproquo-db --remote --command="SELECT COUNT(*) AS writes_since_phase6 FROM admin_jobs WHERE started_at > '<phase6-flip-iso>'"` and assert returns 0. Capture in `.omc/research/agent-pipelines-unify-phase8-zerowrite-proof.md` along with the start-of-observation timestamp and today's timestamp (≥90 days apart)
  - **Files**: `.omc/research/agent-pipelines-unify-phase8-zerowrite-proof.md` (create)
  - **Pattern**: proposal §"After 90 days of zero writes, the table is dropped"; special verification per phase 8
  - **Verify**: SQL returns 0; observation window ≥90 days; doc records both timestamps + the SQL output

### 8.2 Simplify the read-side union

- [ ] 8.2.1 Update `src/pages/api/admin/jobs/index.ts` and `src/pages/api/admin/jobs/[id].ts` to read from `flow_runs WHERE parent_kind='pipeline'` only (drop the UNION with `admin_jobs`). Imported history is fully visible via `parent_external_id` (from Phase 3 migration), so user-facing behavior is identical
  - **Files**: `src/pages/api/admin/jobs/index.ts` (modify), `src/pages/api/admin/jobs/[id].ts` (modify)
  - **Pattern**: D7-jobs-union-read (post-sunset simplification)
  - **Verify**: `curl -b 'session=...' /api/admin/jobs?limit=50` returns the same job ids and ordering as the pre-simplification call (verified against a captured baseline from earlier in Phase 8); the per-id endpoint still resolves legacy admin_job ids via `parent_external_id`

### 8.3 Drop migration

- [ ] 8.3.1 Write `migrations/0020_drop_admin_jobs.sql` — `DROP TABLE IF EXISTS admin_jobs;`. Append a documented restore recipe as a comment: `-- DOWN: CREATE TABLE admin_jobs (id INTEGER PRIMARY KEY, pipeline_id TEXT, status TEXT, ...); INSERT INTO admin_jobs SELECT ... FROM flow_runs WHERE parent_kind='pipeline'; -- (full schema in /tmp/quidproquo-pre-0014.sql backup from Phase 3)`. Capture pre-drop backup: `wrangler d1 export quidproquo-db --remote --output /tmp/quidproquo-pre-0015.sql --table=admin_jobs` and record SHA256 in `.omc/research/agent-pipelines-unify-phase8-backup.md`
  - **Files**: `migrations/0020_drop_admin_jobs.sql` (create), `.omc/research/agent-pipelines-unify-phase8-backup.md` (create)
  - **Pattern**: agent-foundation Phase 3.1.2 (down-migration as comment); proposal §"admin_jobs table sunset migration"
  - **Verify**: file parses with `sqlite3 :memory:` (against a seeded admin_jobs); backup captured with SHA256 recorded
- [ ] 8.3.2 Apply migration to production: `wrangler d1 migrations apply quidproquo-db --remote`; verify table absent via `wrangler d1 execute quidproquo-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name='admin_jobs'"` returns 0 rows; verify admin-jobs endpoint still returns 200 with the same job count as before the drop (history sourced from flow_runs); append to `progress.txt`: `agent-pipelines-unify Phase 8 complete — admin_jobs table dropped after 90-day zero-write proof`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: phase-end gate
  - **Verify**: SQL confirms absence; endpoint smoke confirms identical envelope; backup note finalized with apply timestamp

---

## Phase 9 — Final verification & archive

**Goal**: Run the full quality suite, validate the change against the OpenSpec spec, archive the change.

**Files touched**: `progress.txt` only
**Verification**: full suite green; openspec strict-validate passes

### 9.1 Full quality suite

- [ ] 9.1.1 Run `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build`; capture output to `.omc/research/agent-pipelines-unify-phase9-suite.log`; fix any drift
  - **Files**: (no new files — verification gate)
  - **Pattern**: zero-regression gate; agent-foundation Phase 5.1.1
  - **Verify**: each command exits 0

### 9.2 grep audit (legacy is gone)

- [ ] 9.2.1 Run the deletion audit grep set and assert each returns 0 lines:
  - `grep -rn "from.*pipelines/runner\|from.*pipelines/registry\|from.*pipelines/job-store" src/` (no remaining imports)
  - `find src/lib/pipelines -name 'runner.ts' -o -name 'registry.ts' -o -name 'job-store.ts'` (files deleted)
  - `grep -rn "INSERT INTO admin_jobs\|UPDATE admin_jobs" src/` (no remaining writers)
  - `wrangler d1 execute quidproquo-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name='admin_jobs'"` (table dropped)
  - **Files**: `.omc/research/agent-pipelines-unify-phase9-grep-audit.log` (create)
  - **Pattern**: agent-foundation Phase 5.3.1 (grep audit style)
  - **Verify**: each command returns the expected zero-line / zero-row result

### 9.3 `openspec validate agent-pipelines-unify --strict`

- [ ] 9.3.1 Run `openspec validate agent-pipelines-unify --strict` and reconcile any drift between proposal / tasks / specs and shipped behavior; confirm the three capability specs (`pipeline-flow-port`, `pipeline-runtime-deprecation`, `pipeline-jobs-reconciliation`) are present under `openspec/changes/agent-pipelines-unify/specs/`
  - **Files**: (verification gate)
  - **Pattern**: OpenSpec strict-validate flow; agent-flow Phase 6.5.3
  - **Verify**: command exits 0 with no warnings

### 9.4 Archive

- [ ] 9.4.1 Append to `progress.txt`: `agent-pipelines-unify: complete — 13 pipelines ported to flow YAMLs, runner+registry+job-store deleted, admin_jobs table dropped; single orchestrator (flow), single job table (flow_runs), single mental model`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: project convention; agent-flow Phase 6.5.4
  - **Verify**: `tail -1 progress.txt` matches; commit via `format-commit` skill per `CLAUDE.md`
- [ ] 9.4.2 Run the OpenSpec archive flow (`openspec archive agent-pipelines-unify`) once 9.3.1 passes
  - **Files**: (workflow command — archives the change directory)
  - **Pattern**: end-of-change archive
  - **Verify**: change moves from `openspec/changes/` to `openspec/archive/`; no validation warnings emitted
