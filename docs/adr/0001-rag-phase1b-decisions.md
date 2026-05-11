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

## Consequences

- Advanced strategies can be toggled and measured independently.
- Shadow runs have a clearly defined "simple baseline" configuration.
- Eval thresholds are now documented alongside runtime defaults instead of being scattered across TODO notes.
