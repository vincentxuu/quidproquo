---
title: "Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots"
date: 2026-03-12
type: guide
category: ai
tags: [rag, hybrid-search, bm25, vector-search, rrf, embedding]
lang: en
tldr: "Vector search handles semantics; BM25 handles keywords. Combining them with RRF is what lets you handle both fuzzy queries and exact terms at the same time."
description: "A deep dive into the design principles behind Hybrid Search: BM25 full-text search, vector search, the RRF fusion algorithm, and how they come together in a real climbing community platform."
draft: false
series:
  name: "RAG 系統實戰"
  order: 3
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
  tokenize='unicode61'
);
```

FTS5 has built-in BM25 scoring, and the `unicode61` tokenizer supports multi-language Chinese tokenization. Climbing-specific terminology, route names, and crag locations all get matched precisely.

## Vector Search (Semantic Search)

Vector search converts both queries and documents into high-dimensional vectors, then measures semantic similarity using cosine similarity.

The model used is `@cf/baai/bge-m3` (1024 dimensions), which is trained multilingually and performs well on Traditional Chinese. A query like "where can I practice bouldering" can surface documents that use phrases like "boulder problem," "抱石區," or "bouldering" — all different ways of saying the same thing.

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

The engineering overhead is also manageable: BM25 is handled by SQLite FTS5 with no additional services required. The real challenge lies in the accuracy of filter extraction, which depends on the quality of the upstream NLP parsing step.

---

## References

- [Reciprocal Rank Fusion outperforms Condorcet and Individual Rank Learning Methods (Cormack et al., 2009)](https://dl.acm.org/doi/10.1145/1571941.1572114)
- [The Probabilistic Relevance Framework: BM25 and Beyond (Robertson & Zaragoza, 2009)](https://dl.acm.org/doi/abs/10.1561/1500000019)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
