---
title: "Private-Corpus Retrieval Eval: Turning a Traditional Chinese Query Set into a Reproducible Benchmark"
date: 2026-08-22
category: ai
type: guide
tags: [rag, retrieval, evaluation, benchmark, search]
lang: en
tldr: "The repository has a 20-query Traditional Chinese/English golden dataset, but no document-level qrels, retrieval runs, raw latency data, or executable benchmark script. Reporting Recall@k, MRR, or nDCG as measured results would therefore be dishonest; this article defines the contract needed to run them reproducibly."
description: "A practical design for evaluating retrieval over a Traditional Chinese private corpus, covering qrels, Recall@k, MRR, nDCG, p50/p95 latency, error analysis, and the dataset, raw results, and scripts that must be preserved."
draft: false
series:
  name: "Private Corpus Pipeline"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-08-22-private-corpus-retrieval-eval)

This article was supposed to compare lexical, vector, and hybrid retrieval on a real Traditional Chinese corpus. The repository inspection establishes only this: `docs/rag-golden-dataset.json` contains 20 queries, and `docs/rag-golden-fixture.json` contains four candidate answers. There is no benchmark script, per-query ranked output, raw latency data, or manifest tying results to a fixed corpus snapshot.

Consequently, there is no plausible-looking winner table here. **The current deliverable is a query-set audit and a reproducible evaluation design; the benchmark has not been run.** Calling something an experiment requires preserving at least the dataset, raw results, and script so another person can recompute it against the same index.

## What the current query set can and cannot support

The 20 queries cover precise lookup, concept explanation, cross-article synthesis, English queries, and questions whose answers should not exist in the knowledge base. This is a useful shape for a Traditional Chinese private corpus: technical terms are commonly mixed across Chinese and English, and users often ask in English about Chinese content.

However, most `expected_sources` values identify only directories such as `posts/ai` or `posts/tech`. Retrieval evaluation needs document- or chunk-level relevance judgments, usually called qrels. Without knowing every relevant item for a query, we cannot measure how much was retrieved, where the first relevant item appeared, or whether highly relevant items ranked first. A fixture's `candidate_answer` is not ranked retriever output and cannot be used to reconstruct retrieval scores.

Each query first needs a minimal representation like this:

```json
{
  "query_id": "q06",
  "query": "BM25 跟 vector search 怎麼搭配？",
  "relevance": {
    "post:rag-patterns#hybrid-search": 3,
    "post:meilisearch-complete-guide#hybrid": 2,
    "post:vector-database-comparison": 1
  },
  "acl_context": { "tenant_id": "site", "principal_id": "eval-reader" },
  "query_type": "cross-post"
}
```

Use `0` for irrelevant and `1` through `3` for increasing relevance. Document IDs must be canonical ingestion IDs, not internal search-engine IDs that may change after a rebuild. If retrieval returns chunks, qrels must identify chunks. If the product later groups chunks into articles, preserve a separate document-level aggregation instead of silently changing the scoring unit.

## Five metrics answer five different questions

The [Stanford *Introduction to Information Retrieval*](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html) defines recall as the fraction of all relevant documents that were retrieved. Ranked products expose only a limited result page, so use `Recall@k`: the fraction recovered in the first `k` results. Cross-document synthesis queries depend heavily on it.

- **Recall@k** asks whether relevant material reached the candidate set. Report at least `@5` and the actual `@k` passed to the next production stage.
- **MRR** asks how early the first relevant result appears. It is especially informative for precise lookup. If the first relevant item is ranked fourth, reciprocal rank is `1/4`.
- **nDCG@k** considers both rank and graded relevance, then normalizes against the ideal ordering to a `0–1` range. The [scikit-learn documentation](https://scikit-learn.org/stable/modules/model_evaluation.html#discounted-cumulative-gain) also makes clear that DCG depends on meaningful graded relevance values.
- **Latency** preserves end-to-end wall time for every query and summarizes p50 and p95. An average hides slow queries; embedding, retrieval, and reranking should also have separate timings.
- **ACL violation count** is a hard failure, not a quality bonus. Any unauthorized document in raw output should fail a run even when its ranking metrics improve.

MRR only examines the first relevant item and cannot replace Recall. Recall ignores ordering and cannot replace nDCG. Keep the metrics side by side instead of compressing them into a custom composite score.

## Configurations to compare—and results not yet measured

The first round should vary retrieval configuration while holding the corpus snapshot, query set, ACL, top-k, machine, and warm-up policy constant:

| Run | Configuration | Recall@5 | MRR | nDCG@5 | p50 / p95 | Status |
|---|---|---:|---:|---:|---:|---|
| A | BM25 / lexical | — | — | — | — | Not run |
| B | dense vector | — | — | — | — | Not run |
| C | hybrid fusion | — | — | — | — | Not run |
| D | hybrid + reranker | — | — | — | — | Not run |

The dashes do not mean zero. They mean the repository contains no raw run from which the value can be recomputed. Every real run needs an immutable `run_id` plus the commit SHA, corpus checksum, index build ID, embedding model and version, search parameters, reranker, hardware/region, execution time, and warm-up policy.

At minimum, save this raw record for each query:

```json
{
  "run_id": "2026-08-22-hybrid-rerank-001",
  "query_id": "q06",
  "latency_ms": { "total": 0, "embed": 0, "retrieve": 0, "rerank": 0 },
  "results": [
    { "canonical_id": "...", "rank": 1, "score": 0.0, "acl_allowed": true }
  ],
  "error": null
}
```

Do not preserve only an aggregate CSV. When metric code is wrong, per-query rankings are the evidence needed for recomputation and error analysis. [NIST's `trec_eval`](https://github.com/usnistgov/trec_eval) keeps qrels separate from runs. The open-source [ranx](https://github.com/AmenRa/ranx) library can compute multiple ranking metrics, but the project script must still pin its version and parameters.

## Slices a Traditional Chinese corpus must test deliberately

An overall average can conceal language-specific failures. Twenty queries are enough for a smoke test, not for a stable product claim. An expanded set should preserve these slices:

- Natural Traditional Chinese phrasing mixed with English terms such as `BM25`, `Vectorize`, and `LangGraph`.
- Traditional/Simplified variants, full-width and half-width punctuation, case, hyphens, and whitespace.
- Exact titles, error messages, cross-document synthesis, and questions with no answer in the corpus.
- Synonyms and abbreviations, such as “向量搜尋/vector search” and “檢索增強生成/RAG.”
- Permission slices where the same query has a different gold set for each tenant, group, or principal.

Use a macro average so each query has equal weight, then report slices by query type and language. If a slice contains only one or two items, show per-query outcomes rather than dressing the tiny sample up as a mature percentage.

## Error categories lead to fixes more directly than a total score

Assign one primary cause to every miss and keep optional secondary tags. The next iteration then points to a specific layer:

| Type | How to recognize it | First fix to try |
|---|---|---|
| annotation gap | A defensible result appears, but qrels omit it | adjudicate judgments with two annotators |
| lexical miss | A term or error code never enters the candidate set | tokenizer, synonyms, field weights |
| semantic miss | A paraphrase remains absent from vector results | chunk boundaries, embeddings, language slice |
| ranking miss | Relevant material enters top-k but ranks too low | fusion weights or reranker |
| stale hit | A superseded or deleted version ranks | freshness, tombstones, rebuild |
| ACL leak | The principal cannot read a returned item | stop rollout and fix pre-filtering |
| corpus gap | The source never entered the snapshot | connector and ingestion monitoring |

Questions with no answer in the knowledge base should not be forced into Recall@k as ordinary misses. They test whether the system abstains from fabricating sources. That is retrieval abstention or answer-layer evaluation and must be reported separately from answerable queries.

## A reproducible execution sequence

1. Freeze a corpus manifest containing every canonical ID, checksum, ACL, and index version.
2. Have two annotators independently add document/chunk qrels, resolve disagreements, and version the dataset.
3. Run A–D against the same queries. Warm each configuration consistently, then preserve rankings and stage-level latency for every query.
4. Compute Recall@k, MRR, nDCG@k, and p50/p95 from qrels and raw runs; enforce ACL leakage as a separate gate.
5. Label per-query errors and create a new run after each fix. Never overwrite the old result.

The repository currently contains only part of the work before step two: queries exist, but relevance judgments are too coarse. The next honest deliverable is not a row of attractive numbers. It is qrels, a runner, and raw results. Once those three artifacts exist, the table can legitimately change from “Not run” to measured results.

## References

- [Stanford IR Book: Evaluation of unranked retrieval sets](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html)
- [scikit-learn: Discounted cumulative gain](https://scikit-learn.org/stable/modules/model_evaluation.html#discounted-cumulative-gain)
- [NIST trec_eval](https://github.com/usnistgov/trec_eval)
- [ranx ranking evaluation library](https://github.com/AmenRa/ranx)
