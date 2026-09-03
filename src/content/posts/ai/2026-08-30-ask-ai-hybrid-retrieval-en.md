---
title: "How Ask AI Finds Posts: Planner, Hybrid Retrieval, and Retry"
date: 2026-08-30
category: ai
type: guide
tags: [rag, retrieval, hybrid-search, bm25, vector-search, rrf, langgraph]
lang: en
tldr: "Ask AI first extracts intent, complexity, and 1–4 search terms. It then routes across metadata, BM25, Vectorize, and RRF; a retry adds Critic gaps and disables the first-pass-only BM25 short circuit."
description: "Trace query rewriting, hybrid retrieval, RRF, weak-retrieval detection, and retry through the Ask AI Planner, Research agent, and post-search implementation."
draft: true
series:
  name: "Ask AI in Practice"
  order: 2
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-hybrid-retrieval)

> **Optional companion reading:** Beginners can read this article directly. For background concepts, pair it with [Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en), [RRF: How to Merge Multi-Source Results in RAG Systems](/posts/ai/2026-03-12-rrf-multi-source-fusion-en), and [CRAG: Automatically Relaxing Filters When Retrieval Comes Up Empty](/posts/ai/2026-03-12-corrective-rag-crag-en).

Once the indexes exist, the next question is what to query them with. A reader writes a conversational question. BM25 benefits from discriminative terms. Vector search needs a query that carries the intended meaning. A catalog request and a precise error lookup should not share identical top-k and context rules.

Ask AI does not leave all of those choices to one free-form agent. It separates them across Planner, Research, post search, and result normalization. This article follows those four layers without re-teaching the mathematics of BM25, embeddings, or RRF.

## Planner turns conversation into a search plan

[`planner.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/planner.ts) asks the model for a JSON plan containing:

- an `intent` such as factual, summary, comparison, or recommendation;
- `complexity` as simple, medium, or complex;
- `language` as `zh-TW` or `en`;
- `needs_clarification`, `subtasks`, and `specialists`;
- one to four cleaned `search_keywords`.

That plan changes downstream allocation. Recommendation queries receive a larger default post window. Complex queries can qualify for Multi-query or PageIndex. Simple queries skip the abstract index. If the model returns invalid JSON, the code falls back to factual, medium, and zh-TW instead of failing the request.

Recommendations also pass through [`query-strategy.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/query-strategy.ts). Conversational filler equivalent to “find me,” “what posts,” and “articles” is removed, so a request such as “find me RAG evaluation articles” searches closer to `RAG evaluation`. Broad catalog questions receive a separate marker that can activate metadata-only retrieval.

## Research builds a deduplicated set of query variants

[`research.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts) starts with the original question and planned subtasks, then conditionally adds variants:

1. A normal query can add the Planner's keyword query.
2. A retry can append gaps identified by Critic.
3. HyDE can add a hypothetical answer when enabled and the task is not simple.
4. Multi-query can add alternative phrasings when enabled for a complex task.

The code deduplicates those strings before searching posts, docs, and, when appropriate, the abstract index in parallel. External search runs only when search tools are enabled and the query is not a metadata-only catalog request.

One retry rule matters more than it first appears: **the second pass must not simply replay the first retrieval**. Research adds Critic gaps, while the BM25 short circuit is allowed only at `iteration === 0`. Otherwise, the same weak candidate set can return unchanged and give Writer another chance to fail with different wording.

## Post search does not always run the full hybrid path

[`search-posts.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/search-posts.ts) searches post metadata first, followed by BM25 over D1 FTS5. It then chooses a path:

```text
metadata-only catalog
  → metadata results → deduplicate by slug

precision query + at least 5 BM25 hits
  → metadata + BM25 → RRF → deduplicate by slug

other queries
  → metadata + BM25 + Vectorize → RRF → deduplicate by slug
```

Identifiers containing digits, paths, or punctuation—such as `D1` or a version string—qualify as precision queries. Only that class can skip Vectorize when BM25 returns at least five rows and the short circuit is enabled. A general conversational query still enters the vector lane even when BM25 returns results.

[`hybrid-search.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/hybrid-search.ts) merges ranks with RRF instead of comparing raw BM25 and cosine scores. Each active list contributes `1 / (60 + rank)`, and the result is normalized to a 0–1 scale. The resulting `relevance_score` is a fused ranking signal. It is not a claim that a model judged the result “80% factually relevant.”

## Normalize Results decides whether the evidence is usable

Research merges post, doc, abstract, and possible external results. Recommendation intent deduplicates at the post level and applies `postLimit`; ordinary factual retrieval preserves chunk-level candidates.

[`normalize-results.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/normalize-results.ts) aligns ranking scores and marks retrieval weak when the highest comparable score is below `0.4`. When reranking is enabled, it also mixes query-token overlap into the score and applies MMR for diversity.

The current defaults keep HyDE, Multi-query, and reranking disabled while enabling the BM25 short circuit. The repository shows that the optional lanes exist and have tests. Their existence is not evidence that every production query uses them.

## Test routing instead of guessing it

```sh
pnpm exec vitest run \
  src/lib/retrieval/agents/planner.parity.test.ts \
  src/lib/retrieval/agents/research.parity.test.ts \
  src/lib/retrieval/query-strategy.test.ts \
  src/lib/retrieval/tools/hybrid-search.test.ts
```

These tests cover the Planner contract, recommendation-query cleanup, retrieval changes on retry, post-level deduplication, result caps, and the RRF and short-circuit helpers. They do not query production D1 or Vectorize, and they do not produce a live ranked list.

To inspect the current defaults, check the code rather than inferring them from this article:

```sh
rg -n "hydeEnabled|multiQueryEnabled|rerankerEnabled|bm25ShortCircuitEnabled" \
  src/lib/retrieval/settings.ts src/lib/retrieval/state.ts
```

## Evidence boundary

The repository establishes how queries are composed, when Vectorize can be skipped, and how fusion and retry work. Static code cannot establish production index contents, live recall, or latency for each lane.

Most importantly, `search_results` is a candidate evidence set for Writer, not the complete set of relevant posts on the site. Top-k, deduplication, and the context window all narrow the population. The next article examines how much of that set Writer receives and why it may cite only URLs contained in it.

## Why Not Just Stuff Everything into Long Context

Ask AI uses hybrid retrieval instead of stuffing all site content into a long context window, and recent research supports this architectural choice. Self-Route (Zhao et al., EMNLP 2024) proposes routing queries by type: fact-lookup queries perform better with RAG, while cross-passage reasoning queries benefit from long context. Ask AI's Planner already does something similar—`intent` and `complexity` determine which retrieval lanes activate.

NVIDIA's OP-RAG (Wu et al., 2024) further demonstrates that even when the context window can hold all documents, RAG retains an advantage in token efficiency—there is no need to pay the inference cost of processing the entire corpus for every query. Xu et al. (2024) reach a complementary conclusion in their systematic comparison: the two approaches supplement rather than replace each other, and hybrid architectures (small document sets in context + large corpora via retrieval) tend to perform best.

For Ask AI, with 1,600+ posts, stuffing everything into context would be technically possible but economically unreasonable per query. Hybrid retrieval keeps most queries processing only top-k chunks, making both cost and latency manageable.

## Update Log

- 2026-09-03: Added "Why Not Just Stuff Everything into Long Context" section with Self-Route, OP-RAG, and Long Context vs RAG references

## References

- [Ask AI Planner](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/planner.ts)
- [Research agent](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts)
- [Recommendation query strategy](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/query-strategy.ts)
- [Post search implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/search-posts.ts)
- [Hybrid search and RRF helpers](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/hybrid-search.ts)
- [Result normalization](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/normalize-results.ts)
- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach (Self-Route)](https://arxiv.org/abs/2407.16833) — Zhao et al., EMNLP 2024
- [In Defense of RAG in the Era of Long-Context Language Models (OP-RAG)](https://arxiv.org/abs/2409.01666) — Wu et al., NVIDIA, 2024
- [Long Context vs. RAG for LLMs: An Evaluation and Revisits](https://arxiv.org/abs/2501.01880) — Xu et al., 2024
