---
title: "Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, hybrid-search, bm25, vector-search, rrf, embedding]
lang: en
tldr: "Vector search handles semantics; BM25 handles keywords. Combining them with RRF is what lets you handle both fuzzy queries and exact terms at the same time."
description: "A deep dive into the design principles behind Hybrid Search: BM25 full-text search, vector search, the RRF fusion algorithm, and how they come together in a real climbing community platform."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 11
---

> 🌏 [中文版](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)

Vector search has become the default choice for RAG systems, but relying on it alone has a fundamental limitation: **it's weaker than BM25 at handling exact keyword matches**.

Take a query like "Longdong 5.11a" — vector search might semantically generalize and pull in 5.10d results, while BM25 will precisely hit documents that contain both "Longdong" and "5.11a". On the other hand, a fuzzy query like "beginner-friendly crags with great views" has no clear keywords for BM25 to latch onto, but vector search can surface semantically similar results with ease.

The core idea behind Hybrid Search is: **let each method do what it's good at, then merge the results**.

## BM25 (Full-Text Search)

BM25 is an evolution of TF-IDF that scores documents based on how frequently and how rarely query terms appear. The core formula:

```
BM25(d, q) = Σ IDF(t) × (tf(t,d) × (k1+1)) / (tf(t,d) + k1 × (1 - b + b × |d|/avgdl))
```

- **IDF**: rarer terms receive higher scores
- **TF saturation**: diminishing returns as term frequency grows (`k1` controls the rate)
- **Document length normalization**: prevents longer documents from having an unfair advantage (`b` controls this)

In the NobodyClimb system, BM25 is implemented using Cloudflare D1's **FTS5 full-text index**:

```sql
CREATE VIRTUAL TABLE ai_documents_fts USING fts5(
  id UNINDEXED,
  content,
  title,
  metadata,
  tokenize='trigram'
);
```

FTS5 has built-in BM25 scoring, but **the tokenizer choice is the trap in this setup once CJK text is involved**. FTS5's default `unicode61` tokenizer only classifies characters as "separator" or "token" characters — it does no Chinese word segmentation. Han characters are token characters, so an entire run of consecutive Han characters becomes a **single token**. The practical result: a query for 龍洞 never matches a document containing 龍洞岩場, the BM25 leg silently contributes nothing, and nothing errors out — you just quietly lose recall.

The built-in FTS5 option that does handle CJK is the `trigram` tokenizer, which treats every run of three consecutive characters as a token and therefore supports substring matching. Cloudflare's D1 indexing guidance mentions trigram too, but its stated reason is `LIKE '%term%'` substring search — CJK never comes up on that page, so this is the same mechanism happening to fit, not an official endorsement for Chinese. The trade-off is a larger index and matches that straddle word boundaries. If you want true word-level segmentation, you have to segment in the application layer before writing and store a whitespace-delimited column. Whichever route you take, **test the BM25 leg with real CJK queries before shipping**.

- [SQLite FTS5: Trigram Tokenizer](https://sqlite.org/fts5.html#the_trigram_tokenizer)
- [Cloudflare D1: Use indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/)

## Vector Search (Semantic Search)

Vector search converts both queries and documents into high-dimensional vectors, then measures semantic similarity using cosine similarity.

The choice here is a multilingual embedding model on Workers AI (this system uses `@cf/baai/bge-m3`). Only two selection criteria really matter: **it has to handle Traditional Chinese, and its dimensionality has to match what is already in the index** — swapping models means rebuilding the whole index, a cost far larger than the differences you were weighing at selection time. The Workers AI catalog and its dimensions keep changing, so treat the [official model list](https://developers.cloudflare.com/workers-ai/models/) as the source of truth.

A query like "where can I practice bouldering" can surface documents that use phrases like "boulder problem," "抱石區," or "bouldering" — all different ways of saying the same thing.

The search pipeline:

```
Query → Embedding (BGE-M3) → Vector → Vectorize (cosine search) → Top-K candidates
```

Cloudflare Vectorize manages the vector index, with support for `namespace` partitioning and metadata filtering to avoid full-table scans.

## Parallel Execution, Multiple Search Lanes

The implementation kicks off **multiple search lanes in parallel**, firing them simultaneously:

```typescript
const [vectorResults, bm25Results] = await Promise.all([
  searchVectorize(queryVector, filter, topK),
  searchBM25(query, filter, topK),
]);
```

Each lane retrieves Top-K results (typically 20), which are then fed into RRF for fusion.

## RRF (Reciprocal Rank Fusion)

RRF is a classic algorithm for merging ranked results from multiple sources. It doesn't rely on raw scores — it only cares about **rank position**:

```
RRF_score(d) = Σ 1 / (K + rank_i(d) + 1)
```

- `K`: smoothing parameter (typically 60) to prevent extreme rank positions from causing score spikes
- `rank_i(d)`: the rank of document d in the i-th result set
- Documents that appear in multiple lanes accumulate scores

The beauty of this design is that it's **model-agnostic**: there's no need to normalize scores across sources (BM25 scores and cosine similarities are on completely different scales) — you merge by rank alone.

```typescript
function rrf(results: SearchResult[][], k = 60): RankedResult[] {
  const scores = new Map<string, number>();

  for (const resultSet of results) {
    resultSet.forEach((doc, index) => {
      const prev = scores.get(doc.id) ?? 0;
      scores.set(doc.id, prev + 1 / (k + index + 1));
    });
  }

  return [...scores.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({ id, score }));
}
```

## Metadata Filtering

Before searching, metadata filters are extracted from the query semantics to narrow the search scope:

| Field | Description | Example |
|-------|-------------|---------|
| `grade_numeric` | Numeric difficulty (5.10a → 100) | `{ gte: 90, lte: 110 }` |
| `crag_id` / `area_id` | Crag / area | `{ eq: "longtung" }` |
| `route_type` | Type (sport, trad, boulder) | `{ eq: "sport" }` |
| `type` | Document type (route / crag / video) | `{ eq: "route" }` |

Filters are applied to both the vector search (natively supported by Vectorize) and BM25 (via WHERE clause), keeping both result sets consistent.

## Fallback Strategy

The Embedding API occasionally times out (a limitation of Cloudflare Workers AI), so the system includes graceful degradation:

- Embedding timeout or failure → **fall back to BM25 results only**, no service interruption
- BM25 failure (rare) → fall back to vector search results only

This ensures queries still return results even when one lane goes down.

## Overall Architecture

```
User Query
    ↓
[Filter Extraction] ← NLP extracts grade / location / type
    ↓
    ├→ [BGE-M3 Embedding] → [Vectorize] → Vector Results
    │
    └→ [D1 FTS5 BM25]                 → BM25 Results

                         ↓ both lanes run in parallel
                       [RRF Fusion]
                         ↓
                   Merged Candidates
                         ↓
               [Cross-Encoder Reranking]
```

## Putting It All Together

Hybrid Search is fundamentally about **complementary recall and precision**. Vector search provides semantic coverage; BM25 provides keyword precision; RRF fuses them neutrally using rank position. This combination shines in domains like climbing, where you have dense specialized terminology (route grades, crag names, technical terms) alongside natural-language intent ("good for beginners," "scenic views") — it consistently outperforms either approach alone.

The engineering overhead is also manageable: BM25 is handled by SQLite FTS5 with no additional services required. The real challenges are two: **the accuracy of filter extraction** (which depends on the quality of the upstream NLP parsing step) and **the CJK tokenizer choice** (see above — get it wrong and the BM25 leg quietly dies).

One more trade-off worth naming is build-vs-buy. Cloudflare's AI Search now ships hybrid search out of the box: vector and BM25 run in parallel and are fused with RRF (or max), with the tokenizer and fusion method configurable. If all you need is "hybrid search over a pile of documents," the managed route saves a lot of operational work. What the hand-rolled version buys you is full control over filter extraction, the degradation strategy, and how many legs go into RRF. See [AI Search: Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/).

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Reciprocal Rank Fusion outperforms Condorcet and Individual Rank Learning Methods (Cormack et al., 2009)](https://dl.acm.org/doi/10.1145/1571941.1572114)
- [The Probabilistic Relevance Framework: BM25 and Beyond (Robertson & Zaragoza, 2009)](https://dl.acm.org/doi/abs/10.1561/1500000019)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
