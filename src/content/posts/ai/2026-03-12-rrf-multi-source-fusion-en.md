---
title: "RRF: How to Merge Multi-Source Results in RAG Systems"
date: 2026-03-12
type: guide
category: ai
tags: [rag, rrf, fusion, ranking, multi-source, retrieval]
lang: en
tldr: "BM25, vector search, HyDE, and Multi-Query each produce separate result sets -- how do you merge them sensibly? RRF uses ranks instead of scores, sidestepping the fundamental problem that scores from different systems are incomparable."
description: "The design principles behind RRF (Reciprocal Rank Fusion), how it compares to Score Normalization and Weighted Sum, and its application in multi-source RAG retrieval scenarios."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 18
---

> 🌏 [中文版](/posts/ai/2026-03-12-rrf-multi-source-fusion)

RAG systems are growing increasingly complex, and so are the sources of search results:

- The query's own embedding -> vector search results
- HyDE hypothetical document embedding -> another set of vector search results
- Multi-Query expansion into 3-5 sub-queries -> vector search results for each
- BM25 full-text search -> keyword matching results

Each source has its own result set and ranking. The question is: **how do you sensibly fuse six or seven result streams into one?**

## The Root Problem: Scores Are Incomparable

The most intuitive approach is to sum all scores and rank by total. But there's a fundamental problem: **scores from different sources have different scales**.

- Vector search cosine similarity: range 0.0 -- 1.0, with hits typically clustered around 0.7--0.9
- BM25 scores: range could be 0--50, distribution depends on corpus size and term frequency
- Cross-Encoder: range 0.0 -- 1.0, but the distribution differs from vector cosine

If you add them directly, BM25's numeric range dominates the results, and the subtle differences in vector search scores get drowned out.

### The Problem with Score Normalization

One improvement is to first apply Min-Max Normalization, scaling each source's scores to 0-1:

```
normalized = (score - min) / (max - min)
```

Then compute a weighted sum:

```
final = w1 × normalized_vector + w2 × normalized_bm25 + ...
```

This looks reasonable, but it has several issues:

1. **Min-Max is sensitive to outliers**: A single abnormally high-scoring document compresses all other documents into a very low range
2. **Weights need to be determined**: How do you set `w1`, `w2`? The optimal weights may differ across query types
3. **Is normalization meaningful?**: Does a vector score of 0.85 and a BM25 score of 0.85 represent the same degree of "good"? Not necessarily

## The RRF Solution

RRF (Reciprocal Rank Fusion) completely abandons score comparison and looks only at **ranks**:

```
RRF_score(d) = Σ 1 / (k + rank_r(d))
```

- `rank_r(d)`: The rank of document d in stream r, **starting at 1** (the original paper defines each ranking as a permutation over 1..|D|)
- `k`: Smoothing parameter; the original paper uses 60
- If a document doesn't appear in a given stream, that stream contributes 0 to the score

If your implementation produces 0-indexed ranks, write it as `1 / (k + rank + 1)` to match the paper's definition.

A document's RRF score is the sum of reciprocal ranks across all streams. **A document ranked 1st gets 1/(60+1) ~ 0.016, ranked 10th gets 1/(60+10) ~ 0.014** -- the score differences are small but ordered.

### What k=60 Means

k is a smoothing coefficient that prevents the gap between 1st and 2nd place from being too large:

| k | Rank 1 | Rank 10 | Gap |
|---|--------|---------|-----|
| 0 | 1.000 | 0.100 | 10x |
| 10 | 0.091 | 0.050 | 1.8x |
| 60 | 0.0164 | 0.0143 | 1.15x |

k=60 makes the influence of rank "gentle," preventing a single stream's top result from steamrolling results from all other streams.

The provenance of that 60 is worth stating plainly, though: Cormack et al. write that "k=60 was fixed during a pilot investigation and not altered during subsequent validation." It was never optimized across scenarios. It is a good default, not a proven optimum. Lowering k concentrates weight on the very top ranks (at the extreme, it approaches "only the first result matters"); raising it flattens the differences between ranks. If you know one stream is distinctly better than the others, a smaller k is a reasonable choice.

## Why Ranks Are More Reliable Than Scores

The core assumption behind RRF: **a search system's ranking within its own scoring range is trustworthy, but the absolute value of its scores is not**.

When BM25 says "this document ranks 3rd in keyword matching," that ranking is meaningful. But when BM25 says "this document scored 23.7," that number has no meaning whatsoever in the world of vector search.

Rank is a universal language that all search systems can speak. RRF simply leverages this universal language for fusion.

## Practical Effects of Multi-Source Fusion

In NobodyClimb's search scenario, complex queries can trigger up to 6 parallel search streams:

```
Stream 1: query embedding   -> vector search
Stream 2: HyDE embedding    -> vector search
Stream 3: sub_query_1 embedding -> vector search
Stream 4: sub_query_2 embedding -> vector search
Stream 5: sub_query_3 embedding -> vector search
Stream 6: BM25 full-text search
```

A document that appears in all 6 streams with high ranks will have an RRF score far exceeding one that appears in only 1-2 streams:

```
Document A (ranked 1st in all 6 streams): 6 × 1/(60+1) ~ 0.098
Document B (ranked 1st in only 1 stream): 1 × 1/(60+1) ~ 0.016
```

This property is intuitive: **the more different search perspectives that consider a document relevant, the more likely it truly is relevant**.

## Limitations of RRF

RRF is not a silver bullet. Several known weaknesses:

**1. It ignores score gaps**

In vector search, the gap between rank 1 (0.95) and rank 2 (0.60) is huge, but in RRF the difference is only `1/(61) - 1/(62) ~ 0.0003`. If that score gap is a meaningful signal, RRF discards it.

**2. Not all streams are equal in quality**

If one search stream is low quality (e.g., Multi-Query generated an off-topic sub-query), its results still participate in RRF and may introduce noise. The remedy: apply quality filtering after Multi-Query generation, discarding sub-queries that deviate too far from the original query's semantics before they enter the search pipeline.

**3. Not a precision ceiling**

RRF's selling point is zero training cost, not best-in-class fusion accuracy. Bruch, Gai & Ingber (*An Analysis of Fusion Functions for Hybrid Retrieval*, TOIS 2023) systematically compared RRF against a convex combination of normalized scores, and found the convex combination outperforms RRF both in-domain and out-of-domain, while needing only a small set of training examples to tune its single parameter to a target domain; the same study finds RRF sensitive to its k parameter. In other words: if you have labelled data and are willing to tune weights per domain, weighted score fusion is worth trying. Without labelled data, RRF remains the least-effort default.

**4. Computational complexity**

More streams means more candidates to merge. With 6 streams each returning Top-20, there are up to 120 candidates (typically 30-50 after deduplication). The subsequent Cross-Encoder Reranking must score each candidate, and candidate count affects Reranker latency.

In practice, the Cross-Encoder runs after RRF on only the Top-N (e.g., 30) candidates for fine-grained ranking, not all 120.

## Position in the Overall Architecture

```
[Multi-Source Search Results]
  ├ Vector search (query)   -> [d1, d3, d7, ...]
  ├ Vector search (HyDE)    -> [d2, d1, d5, ...]
  ├ Vector search (sub_q1)  -> [d3, d1, d9, ...]
  ├ Vector search (sub_q2)  -> [d7, d4, d1, ...]
  └ BM25                    -> [d1, d6, d3, ...]
                               ↓
                          [RRF Fusion]
                               ↓
                        Merged & Ranked List
                               ↓
                      [Cross-Encoder Reranking]
                               ↓
                           Final Top-K
```

RRF serves as the first-pass coarse ranking (aggregating multi-source signals), while Cross-Encoder serves as the second-pass fine ranking (precise relevance scoring). They play different roles, and both are indispensable.

## Overall Takeaway

The design philosophy of RRF is **pragmatism**: rather than trying to "align" scores from different systems (which is mathematically difficult and questionable in meaning), it uses rank -- a more reliable signal. The implementation is also extremely simple, with a single parameter k whose default is good enough to ship.

The cost is that it throws away everything the scores encoded -- an explicit trade-off, not a free lunch. When you do have labelled data, tuned score fusion still beats it.

This approach of "reducing a complex problem to its core" is a common trait of many good designs.

---

## References

- [Reciprocal Rank Fusion outperforms Condorcet and Individual Rank Learning Methods (Cormack, Clarke & Buettcher, SIGIR 2009)](https://dl.acm.org/doi/10.1145/1571941.1572114) ([author-hosted PDF](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf))
- [An Analysis of Fusion Functions for Hybrid Retrieval (Bruch, Gai & Ingber, TOIS 2023)](https://arxiv.org/abs/2210.11934)
- [RAG-Fusion: a New Take on Retrieval-Augmented Generation](https://arxiv.org/abs/2402.03367)
- [Large-Scale Validation and Analysis of Interleaved Search Evaluation (Chapelle et al., 2012)](https://www.cs.cornell.edu/~tj/publications/chapelle_etal_12a.pdf)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
