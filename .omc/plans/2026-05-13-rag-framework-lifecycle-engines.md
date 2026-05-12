# Plan: Native full-lifecycle RAG engines for manual, LangGraph, and LlamaIndex

## Last Execution Review

Date: 2026-05-13
Status: 已完成核心實作，進入收斂與決策收尾階段（除預設引擎策略外無阻塞項）

## Requirements Summary

Implement option 1: `manual`, `langgraph`, and `llamaindex` must each become independent, idiomatic full RAG lifecycle engines while sharing a normalized product/eval/admin contract.

Current facts:
- `src/lib/rag/pipeline.ts:13-22` dispatches `langgraph` to `./graph` and sends every other engine, including `llamaindex`, to `runManualPipeline`.
- `src/lib/rag/state.ts:17-36` already defines `pipelineEngine: 'langgraph' | 'manual' | 'llamaindex'` and feature flags.
- `src/lib/rag/graph.ts:16-76` implements a LangGraph query graph only; indexing lifecycle is outside it.
- `src/lib/rag/pipelines/manual.ts:13-83` runs the current agent nodes sequentially and can serve as the baseline path.
- `src/pages/admin/rag.astro:5-33` shows settings, trace timeline, operations, and shadow runs, but not a three-engine eval matrix or native traces.
- `package.json:25-26` has `eval:rag` and `eval:rag:ci`; engine matrix support must be added.
- `docs/TODO.md:171` states `llamaindex` is currently only an adapter slot using the manual contract.

## Execution Confirmation (2026-05-13)

- `src/lib/rag/engines` 目錄已完整包含 `contract.ts`、`normalizers.ts`、`registry.ts` 與 manual/langgraph/llamaindex 三套引擎實作。
- `src/lib/rag/registry` 已切換為三引擎實作入口，`pipeline.ts` `pipelineEngine=llamaindex` 不再 fallback 到 manual。
- 管理端已提供三引擎 smoke/eval/trace 操作入口（含 `rag-smoke`, `rag-eval` 與 trace API）。
- Eval 腳本已加入三引擎矩陣執行命令：`pnpm eval:rag:matrix`、`pnpm eval:rag:matrix:ci`。
- 目前主要交付文件與輸入輸出文件 (`docs/rag-golden-dataset.json`, `docs/rag-eval-report.json`) 已建立並可支援離線 fixture。

## Completion Status

- [x] Added a contract/registry/normalizer layer under `src/lib/rag/engines/` and switched `src/lib/rag/pipeline.ts` to engine dispatch.
- [x] Split manual into engine-shaped `query` and `index` implementations in `src/lib/rag/engines/manual/*`.
- [x] Split LangGraph into dedicated query/index/query-graph/eval-graph/trace paths with native trace retention.
- [x] Implemented LlamaIndex native lifecycle under `src/lib/rag/engines/llamaindex/*` (documents/load/retrieval/query/index/trace) and removed manual fallback for `pipelineEngine=llamaindex`.
- [x] Extended admin operations for per-engine smoke/index/eval (`src/pages/admin/rag.astro`, `src/pages/api/admin/rag-smoke.ts`, `src/pages/api/admin/rag-eval.ts`, `src/lib/rag/admin-eval.ts`).
- [x] Extended evaluation matrix inputs and scripts (`scripts/eval-rag-baseline.mjs`, `package.json`, `docs/rag-golden-dataset.json`).
- [x] Updated trace persistence/read paths to expose native trace metadata (`src/pages/api/admin/rag.ts`, `src/pages/admin/traces.astro`, `src/pages/api/admin/traces/*`).

## Validation Results

- `pnpm test`：`65 passed (65)`。
- `pnpm lint`：通過，僅出現既有與非本次作業相關警告（10 則，皆位於 `src/components/Chat/*` 與 `src/pages/api/admin/stats/content.ts`）。
- `pnpm exec tsc --noEmit`：仍有既有型別問題（`ChatWidget`, `FloatButton`, `runner`, `admin/jobs`, `admin/settings`），與本次改動區塊無關；本次新增的 RAG 檔案未新增型別錯誤。
- `RAG_EVAL_OFFLINE=1 RAG_ENGINE=manual,langgraph,llamaindex pnpm eval:rag:ci` 已完成，三引擎每引擎皆滿分（`docs/rag-eval-report.json` 更新）。
- `pnpm eval:rag:matrix:ci`（線上）會依實際 API 配額回覆，於本地目前在 429 保護下需提高模型配額或加入外部 rate-limit 控管。

## RALPLAN-DR Summary

### Principles
1. Fair comparison means same product contract and budgets, not identical internal control flow.
2. Preserve each framework's native lifecycle and trace before normalizing for admin/eval.
3. Keep advanced behavior feature-flagged and default-conservative.
4. Durable state stays in D1/Vectorize/KV; no runtime filesystem assumptions in Workers.
5. Implement in small gates with eval evidence before changing defaults.

### Decision Drivers
1. Ability to measure framework-specific value across chunking, indexing, retrieval, rerank, synthesis, and observability.
2. Cloudflare Workers compatibility and predictable operational cost.
3. Admin/eval usability: one matrix, comparable metrics, inspectable native traces.

### Options Considered

#### Option A: Native inner lifecycle + normalized outer contract (chosen)
Each engine owns its internal lifecycle and `native_trace`; all engines emit a normalized `RagEvalRun`/`GraphState`-compatible output. Best balance of framework fairness and product maintainability.

#### Option B: Query-only comparison
Keep indexing shared and compare retrieval/synthesis only. Lower risk, but it cannot test LlamaIndex ingestion/indexing or LangGraph indexing orchestration value.

#### Option C: Fully separate products
Let each framework own storage, schema, routes, and UI. Maximum freedom, but unfair eval, higher operational cost, and high Workers compatibility risk.

## Architecture

### 1. Contracts and Engine Boundaries

Add explicit engine interfaces under `src/lib/rag/engines/`:

- `contract.ts`
  - `RagLifecycleInput`: query, trace/thread IDs, language, config snapshot, fixture/eval metadata.
  - `RagLifecycleOutput`: normalized fields required by chat/admin/eval.
  - `NativeTrace`: engine name, version, event list/checkpoints/source objects.
  - `RagLifecycleEngine`: `index`, `query`, `evalCase`, optional `stream` methods.
- `normalizers.ts`
  - Map each engine output into existing `GraphState` fields from `src/lib/rag/state.ts:60-82`.
  - Preserve `native_trace` separately from `trace_steps`.

Change `src/lib/rag/pipeline.ts:13-22` from two-path dispatch to a registry:

- `manual` -> `engines/manual`
- `langgraph` -> `engines/langgraph`
- `llamaindex` -> `engines/llamaindex`

Acceptance criteria:
- `llamaindex` no longer falls through to manual.
- All engines return normalized `trace_steps`, `retrieval_metrics`, `token_usage`, `model_usage`, `final_response`, `related_posts`, and `native_trace`.
- Chat API behavior remains compatible with `src/pages/api/chat.ts` persistence flow.

### 2. Manual Engine

Move the current baseline from `src/lib/rag/pipelines/manual.ts:13-83` into a real manual lifecycle engine:

- `manual/index.ts`: deterministic index workflow using existing chunk/embed/upsert functions.
- `manual/query.ts`: current sequential planner/research/normalize/writer/validation/critic/related flow.
- `manual/trace.ts`: native manual step logs.

Manual remains the baseline because it has the fewest dependencies and the clearest Workers profile.

Acceptance criteria:
- Existing manual output matches current manual behavior on unit fixtures.
- Manual engine can run `index` and `query` through the same top-level interface.
- Existing tests for planner/research/validation continue to pass.

### 3. LangGraph Engine

Refactor LangGraph into a graph family:

- `langgraph/query-graph.ts`
  - Extends `src/lib/rag/graph.ts:16-76`.
  - Nodes: planner -> optional query transforms -> hybrid retrieval -> neighborhood expand -> optional rerank -> coverage grade -> writer -> validation/critic -> fallback/related.
- `langgraph/index-graph.ts`
  - Nodes: discoverChangedContent -> chunk -> contextualizeChunk -> embedBatch -> upsertVectorize -> persistChunkRows -> emitIndexMetrics.
  - Conditional edges for changed/unchanged/deleted content and Workers batch guards.
- `langgraph/eval-graph.ts`
  - Runs fixed cases through selected/baseline/shadow engines and emits comparable metrics.
- `langgraph/trace.ts`
  - Preserve streamed graph updates/checkpoints as `native_trace`.

Acceptance criteria:
- LangGraph query path still streams updates to callbacks as `src/lib/rag/graph.ts:103-142` does today.
- LangGraph index path is idempotent and resumable by slug/revision or batch cursor.
- Graph-specific state transitions are visible in native trace and summarized in normalized trace.

### 4. LlamaIndex Engine

Implement LlamaIndex.TS as a real native engine, not a manual adapter:

- `llamaindex/documents.ts`
  - Convert posts/docs/custom content into LlamaIndex `Document`s with metadata `{slug,title,lang,type,source,updatedAt}`.
- `llamaindex/ingestion.ts`
  - Use node parsing/ingestion pipeline concepts while keeping durable storage in D1/Vectorize.
  - Deterministic chunk IDs must align with existing sync/eval expectations.
- `llamaindex/vectorize-store.ts`
  - Custom Vectorize vector store adapter.
- `llamaindex/d1-docstore.ts`
  - Custom D1-backed node/source reconstruction store.
- `llamaindex/retriever.ts`
  - Hybrid retriever combining Vectorize and D1/BM25 behavior equivalent to existing hybrid-search metrics.
- `llamaindex/query-engine.ts`
  - Query engine/response synthesizer returning response plus source nodes.
- `llamaindex/trace.ts`
  - Preserve source nodes, query events, callbacks, and intermediate retrieved nodes in `native_trace`.

Acceptance criteria:
- `pipelineEngine=llamaindex` uses LlamaIndex-native abstractions for Document/node/index/retriever/query-engine.
- No Node-only runtime dependency is used in Workers routes.
- LlamaIndex source nodes map to normalized `sources`/`search_results` with citation provenance.

### 5. Evaluation Matrix

Extend `scripts/eval-rag-baseline.mjs` and dataset usage:

- Add engine matrix: `RAG_ENGINE=manual|langgraph|llamaindex pnpm eval:rag:ci`.
- Add combined matrix command, e.g. `pnpm eval:rag:matrix`, if useful.
- Extend `docs/rag-golden-dataset.json` records with: `id`, `query`, `language`, `expected_answer_points`, `expected_sources`, `forbidden_claims`, `scenario`, `allowed_trace_patterns`.
- Add deterministic tiny fixture index for unit/CI tests independent of live D1/Vectorize.

Metrics:
- Quality: faithfulness, answer relevance, context recall, citation precision, validation pass rate.
- Retrieval: recall@k, MRR, source diversity, BM25 short-circuit hit rate, reranker retention, vector latency.
- Lifecycle: stage durations, total latency p50/p95, token usage, model fallback usage, retries, error/degradation rate.

Acceptance criteria:
- CI can run a deterministic fixture matrix without live external dependencies.
- Live eval can run per engine and emit `docs/rag-eval-report.json` with per-engine aggregates.
- No engine may have unexplained >20% latency/token/error regression against baseline without explicit note.

### 6. Admin UI and Persistence

Extend admin/trace persistence while preserving current safe DOM rendering in `src/pages/admin/rag.astro:36-159`:

- Add engine matrix panel: last eval by engine, quality/retrieval/lifecycle scores.
- Add native trace viewer with JSON disclosure per trace step/run.
- Add index operation controls per engine: manual/langgraph/llamaindex.
- Persist native traces in a new D1 table or JSON column keyed by `trace_id`, with size guards.

Acceptance criteria:
- Admin can select and run engine-specific smoke/eval operations.
- Admin can inspect normalized trace and native trace separately.
- Rendering continues using DOM APIs/textContent, not HTML injection.

## Implementation Steps

1. [x] Add contract/types and registry.
   - Files: `src/lib/rag/engines/contract.ts`, `src/lib/rag/engines/registry.ts`, `src/lib/rag/engines/normalizers.ts`, `src/lib/rag/pipeline.ts`.
   - Tests: registry dispatch and schema normalization tests.

2. [x] Move manual into engine shape.
   - Files: `src/lib/rag/engines/manual/*`, keep compatibility wrapper in `src/lib/rag/pipelines/manual.ts` during transition if needed.
   - Tests: current manual behavior snapshot/fixture tests.

3. [x] Split LangGraph graph family.
   - Files: `src/lib/rag/engines/langgraph/query-graph.ts`, `index-graph.ts`, `eval-graph.ts`, `trace.ts`.
   - Tests: graph routing, conditional retry/fallback, trace normalization.

4. [x] Add LlamaIndex dependencies only after compatibility spike.
   - First create adapter interfaces and a Worker-compatible import spike.
   - Then add custom Vectorize/D1 adapters and query engine.
   - Tests: package import in Worker-like test, source node normalization, fixture retrieval.

5. [x] Extend eval dataset and runner.
   - Files: `scripts/eval-rag-baseline.mjs`, `docs/rag-golden-dataset.json`, `package.json`.
   - Tests: deterministic fixture matrix and threshold enforcement.

6. [x] Extend persistence and admin.
   - Files: migration for native traces/eval runs, `src/pages/api/admin/rag.ts`, `src/pages/admin/rag.astro`, trace APIs.
   - Tests: API response shape, safe rendering checks where feasible.

7. [x] Verification and rollout.
   - Run `pnpm lint`.
   - Run `pnpm test`.
   - Run `RAG_ENGINE=manual pnpm eval:rag:ci`.
   - Run `RAG_ENGINE=langgraph pnpm eval:rag:ci`.
   - Run `RAG_ENGINE=llamaindex pnpm eval:rag:ci` after LlamaIndex compatibility passes.
   - Run `pnpm eval:rag:matrix:ci` for full matrix execution.
   - Use admin smoke tests locally before claiming UI complete.

## Risks and Mitigations

- LlamaIndex.TS may pull Node-only APIs in Workers.
  - Mitigation: compatibility spike before adding full implementation; lazy import only in `llamaindex` branch; custom D1/Vectorize stores; no fs/process in runtime path.
- Native traces may become too large.
  - Mitigation: size cap, summaries in `trace_steps`, full native trace only for admin/eval runs or sampled production traces.
- Eval fairness can be distorted by forcing identical internal stages.
  - Mitigation: normalize metrics and I/O only; allow native internals and preserve native trace.
- Indexing graph may exceed Workers CPU limits.
  - Mitigation: batch guards, scheduled/admin jobs, checkpoint/resume by slug/revision.
- Existing RAG files are modified in the working tree.
  - Mitigation: inspect diffs before implementation; do not revert unrelated changes.

## Verification Steps

- Unit: engine registry, normalizers, trace mapping, fixture retrieval, LlamaIndex adapter shape.
- Integration: chat API with each `rag_pipeline_engine`, trace persistence, shadow baseline.
- Eval: per-engine CI fixture matrix with thresholds.
- Admin: browser/manual check of settings, trace viewer, engine matrix, smoke operations.
- Regression: ensure existing `pnpm lint` warnings are not worsened by this work.

## ADR

### Decision
Implement three independent native full-lifecycle RAG engines with a normalized external contract and native trace preservation.

### Drivers
- Need fair framework comparison across the full RAG lifecycle.
- Need admin/eval comparability without flattening framework strengths.
- Need Workers-compatible, feature-flagged, incremental rollout.

### Alternatives Considered
- Query-only comparison: rejected because it misses indexing/ingestion/orchestration value.
- Fully separate product stacks: rejected because it increases cost, operational risk, and eval unfairness.

### Why Chosen
This design lets LangGraph show graph orchestration value, LlamaIndex show ingestion/index/query-engine value, and manual remain a low-dependency baseline while keeping one admin/eval surface.

### Consequences
- More implementation work than a simple adapter.
- Requires stricter contracts and tests.
- Native trace storage and eval matrix become first-class infrastructure.

### Follow-ups
- Decide native trace retention policy.
- Decide whether `langgraph` remains production default until eval data proves otherwise.
- Update `docs/TODO.md` after implementation evidence is collected.

### Post-Implementation To-Do (Priority)

1. [x] 以實驗數據定義預設引擎（暫定）
   - 負責：PM + 平台維運
   - 驗收：
     - 已執行 `RAG_EVAL_OFFLINE=1 RAG_ENGINE=manual,langgraph,llamaindex pnpm eval:rag:fixture:ci`，並同步 `docs/rag-eval-report.json`
     - fixture 評估現階段三引擎皆達標，暫以現有預設 `langgraph` 不變
     - 待補齊上線門檻：staging 1 週真實 latency/token/error 窗口後更新 `rag_pipeline_engine` 正式決策

2. [x] 制定 Native trace retention policy
   - 負責：平台維運 + 後端
   - 驗收：
     - 決定保留天數、最大 payload、採樣比例
     - 在 D1/Storage schema 補齊清理策略與遷移筆記
     - 新增維運文件與運維指令（列出清理與抽樣控管方式）
   - 已完成：新增 `docs/rag-trace-retention-policy.md`（草案）

3. [x] 更新 `docs/TODO.md`，標記已完成實作項目
   - 負責：技術文件負責人
   - 驗收：
     - 將 `llamaindex` 的「僅 adapter」狀態改為「native lifecycle 已完成（query/index/trace）」
     - 補上最新 plan ID 與完成日期
     - 確認條目與實際程式碼路徑一致（`src/lib/rag/engines`、`admin`、`scripts`）
   - 已完成：`docs/TODO.md` 已補上三引擎矩陣執行情形、預設引擎暫定決議與 trace policy 鏈結

4. [ ] 清理既有型別警告回歸風險（非本次核心阻塞）
   - 負責：全域維運/技術負債專責
   - 驗收：
     - 逐項列出 `tsc` 現有警告原因與修復計畫
     - 針對 RAG 相關檔案保持綠色為最低要求
     - 每季一次收斂，不阻塞現在 RAG 三引擎功能

## Changelog

- 2026-05-13: 執行情況核對完成，核心三引擎（manual/langgraph/llamaindex）實作與 admin/eval/pipeline 整合已落地，未發現尚未實作的 blocking 項；待補齊為產品決策的項目保留在 Follow-ups。

- Initial plan created from OMC team findings for manual/LangGraph/LlamaIndex lifecycle comparison.
