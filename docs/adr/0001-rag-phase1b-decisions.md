# ADR 0001: RAG Phase 1B Defaults

Date: 2026-05-12

## Status

Accepted

## Context

Phase 1A already shipped a working chat pipeline. Phase 1B adds observability and strategy controls before more complexity is enabled. The repo needed explicit defaults for retrieval, cache safety, and context management so later experiments can be measured instead of guessed.

## Decisions

### Embedding model

Use `@cf/baai/bge-large-en-v1.5`.

Reasoning:

- Already integrated with Workers AI in this repo.
- Good multilingual retrieval quality for the blog's zh-TW / en mix.
- Avoids introducing another provider before baseline eval exists.

### Embed batch size

Use `50` items per embedding request batch.

Reasoning:

- Matches the Phase 1A plan.
- Reduces per-chunk overhead compared with one-request-per-chunk.
- Still small enough to avoid oversized request payloads during Workers execution.

### Hybrid retrieval fusion

Use RRF with `k = 60`.

Reasoning:

- Stable default that does not require score normalization between vector and BM25 paths.
- Makes it easy to compare retrieval variants in shadow mode because ranked lists can be fused consistently.

### BM25 short-circuit

Use `BM25_SHORT_CIRCUIT_THRESHOLD = 5`.

For `search_blog_posts` and `search_docs`, run D1 FTS5 BM25 first. If BM25 returns at least 5 candidates, skip Workers AI query embedding and Cloudflare Vectorize for that retrieval call. Otherwise, run Vectorize and merge BM25 + vector results with RRF.

Reasoning:

- Exact nouns, model names, route names, and error codes are often already well served by BM25.
- Skipping embedding + Vectorize avoids avoidable latency and external quota usage on high-confidence keyword matches.
- The threshold is high enough to avoid short-circuiting sparse matches where semantic recall still matters.
- `rag_flag_bm25_short_circuit` keeps the behavior independently toggleable and lets shadow baseline compare against full hybrid retrieval.
- Retrieval metrics record BM25 result count, vector result count, skipped-vector status, short-circuit hit rate, and observed per-path latency.

### Semantic cache threshold

Use `0.95`.

Reasoning:

- `0.90-0.94` is too risky for "related but different" user questions.
- This repo optimizes for answer correctness over aggressive cache hits.

### Reranker safety net

Use `min_keep = 3`.

Reasoning:

- Prevents over-pruning when reranking is noisy.
- Keeps enough evidence for Writer and Critic even on sparse queries.

### Context checkpoint threshold

Use `model_context_window * 0.7`.

Reasoning:

- Leaves roughly 30% headroom for generation and retries.
- More portable than a fixed token threshold when model choice changes later.

### Pipeline engine setting

Use `rag_pipeline_engine` with `langgraph` as the production default and `manual` / `llamaindex` as selectable adapter modes.

Reasoning:

- Keeps the existing LangGraph path stable while allowing engine experiments behind a setting.
- Requires all engines to preserve the same output contract: `final_response`, `search_results`, `critique`, and `token_usage`.
- Treats `llamaindex` as an adapter slot until a real implementation is justified by eval results.

### Provider and model routing

Use global defaults plus per-stage overrides:

- `rag_default_provider`
- `rag_default_model`
- `rag_stage_overrides`
- `rag_fallback_provider`
- `rag_fallback_model`

Reasoning:

- Planner, Research, Writer, and Critic have different latency/cost/quality needs.
- Stage-level routing makes experiments measurable without changing code.
- Trace metadata records provider/model choices so quality regressions can be compared after the fact.

### Search cost guardrail

Use `rag_search_daily_limit = 20` for public AI-backed search modes.

Reasoning:

- `hybrid` and `rag` search can call Workers AI embedding and Vectorize.
- Public endpoints need a cost and abuse boundary before search traffic exists.
- Keyword search remains available without consuming embedding quota.

### Timeline token accounting

Store per-step token deltas rather than cumulative token totals.

Reasoning:

- Writer and Critic nodes return cumulative `token_usage`.
- Observability timelines need per-stage costs; storing cumulative values per step would over-count.
- Delta accounting keeps the admin trace view useful for deciding where optimization matters.

### Browser rendering safety

Render search and admin data with DOM APIs and `textContent`, not `innerHTML`.

Reasoning:

- Search results include post content, retrieved chunks, and crawled document excerpts.
- Admin traces include user queries and model outputs.
- Treating all of those as untrusted strings prevents reflected and stored XSS.

### Migration policy

Do not add new production schema to an already-applied migration. Use a new migration for incremental Phase 1B admin and observability tables.

Reasoning:

- Existing environments may already have applied `0003_rag_phase1b.sql`.
- D1 will not replay modified historical migrations.
- `0004_rag_phase1b_admin_observability.sql` carries the incremental settings, `rag_trace_steps`, and `rag_admin_audit` schema.

## Consequences

- Advanced strategies can be toggled and measured independently.
- Shadow runs have a clearly defined "simple baseline" configuration.
- Eval thresholds are now documented alongside runtime defaults instead of being scattered across TODO notes.
- Public RAG search has a basic cost guardrail before real traffic.
- BM25-heavy exact queries can avoid embedding and Vectorize calls while still preserving full hybrid retrieval for sparse keyword matches.
- Admin and search UIs treat retrieved content, traces, and user queries as untrusted text.
- Timeline token metrics now represent per-stage costs rather than cumulative totals.
