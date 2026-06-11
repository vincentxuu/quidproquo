---
title: "MMR + Popularity Weighting: Recommendations That Are Both Relevant and Diverse"
date: 2026-03-12
type: guide
category: ai
tags: [rag, mmr, diversity, reranking, popularity, recommendation]
lang: en
tldr: "Ranking purely by relevance leaves you with five documents all describing the same route. MMR strikes a balance between relevance and diversity, and layering in popularity weighting makes results even more useful."
description: "A walkthrough of the MMR (Maximal Marginal Relevance) algorithm, how to tune the λ parameter, how popularity weighting fits into the design, and how it all plays out in a climbing recommendation context."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-mmr-diversity-reranking)

After Cross-Encoder reranking, the top 5 results might all describe the same route — just pulled from different sources, each mentioning some 5.11a at Longdong in slightly different words. Every one of those documents is relevant to the query, but feeding them all into an LLM is wasteful: redundant information doesn't improve the answer, it just burns context window.

MMR (Maximal Marginal Relevance) addresses exactly this: **balancing relevance and diversity so you don't pack your context with near-duplicate documents**.

## The MMR Algorithm

MMR is a greedy selection algorithm. At each step, it picks one document from the candidate pool to add to the selected set, using this scoring rule:

```
MMR(d) = λ × relevance(d, query) - (1 - λ) × max_sim(d, already_selected)
```

- `relevance(d, query)`: how relevant the document is to the query (Cross-Encoder score)
- `max_sim(d, already_selected)`: the similarity between this document and its closest match among already-selected documents
- `λ`: weight given to relevance (0 → pure diversity, 1 → pure relevance)

**First document**: just pick the highest-relevance candidate — there's nothing in the selected set to compare against yet.

**Second document**: find the candidate with the highest MMR score among the remaining pool. A candidate that closely resembles the already-selected document will have a large `max_sim` term, pulling its MMR score down.

**Repeat** until `top_k` documents are selected or the candidate pool is exhausted.

## Similarity Calculation

For inter-document similarity, embedding cosine similarity is overkill (too expensive). Instead, this uses a lightweight metadata-based similarity score:

```typescript
function documentSimilarity(a: Document, b: Document): number {
  let score = 0;

  // Same crag → high similarity
  if (a.crag_id && a.crag_id === b.crag_id) score += 0.4;

  // Close grades (numeric difference < 5) → similar
  if (Math.abs(a.grade_numeric - b.grade_numeric) < 5) score += 0.3;

  // Same climbing type
  if (a.route_type === b.route_type) score += 0.2;

  // Same document type (route / crag / video)
  if (a.type === b.type) score += 0.1;

  return score;
}
```

This metadata-based approach is much cheaper to compute, and it maps well to climbing content: documents from the same crag are the most likely to overlap.

## What λ Controls

λ shapes the "personality" of recommendations:

| λ value | Effect | Best for |
|---------|--------|----------|
| 0.9 | Almost pure relevance | User asks a specific, focused question |
| 0.7 | Relevance-first with some diversity | General recommendations (default) |
| 0.5 | Equal weight to both | Exploratory queries |
| 0.3 | Diversity-first | "Surprise me" scenarios |

The system defaults to 0.7. It can be tuned dynamically via `ai_config` without a redeployment.

## Popularity Weighting

After MMR selection, a popularity weighting pass re-sorts the results:

```typescript
const finalScore = mmrScore + popularityWeight * popularityScore;
```

`popularityScore` is derived from a route or crag's click-through rate, ratings, and review count. The logic is straightforward: when two documents have similar MMR scores, surface the one with stronger community validation — the recommended route is more likely to actually satisfy the user.

This also patches a blind spot in embeddings: a new route (well-documented, highly rated) and a beloved classic might sit at nearly the same embedding distance from a query, but users are more likely to trust something with a track record.

## The Full Selection Pipeline

```
Candidates from Cross-Encoder ranking
        ↓
[MMR greedy selection] ← λ=0.7
        ↓
MMR-selected results (Top-K documents)
        ↓
[Popularity weighting sort]
        ↓
Final document set → LLM context generation
```

## The Bigger Picture

MMR tends to be underappreciated in RAG systems. Sending the top 10 most-relevant documents straight into an LLM versus sending 10 MMR-selected documents that cover diverse angles — the former often floods the LLM with repetitive information, while the latter gives it a broader view of the problem, leading to more complete answers.

Add popularity weighting on top, and you get recommendations that combine semantic relevance (vector search + reranking) with community validation (popularity). It's a design that finds a practical middle ground between algorithmic rigor and user experience.

---

## References

- [The Use of MMR, Diversity-Based Reranking for Reordering Documents and Producing Summaries (Carbonell & Goldstein, 1998)](https://dl.acm.org/doi/10.1145/290941.291025)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
