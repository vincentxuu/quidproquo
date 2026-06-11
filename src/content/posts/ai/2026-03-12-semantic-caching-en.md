---
title: "Semantic Caching: Run the RAG Pipeline Only Once for Semantically Similar Queries"
date: 2026-03-12
type: guide
category: ai
tags: [rag, semantic-cache, caching, vector-search, performance]
lang: en
tldr: "Caching doesn't have to match exact query strings -- semantically similar questions can hit the cache too, skipping the entire RAG pipeline execution."
description: "Semantic Caching design: matching cached queries via vector similarity, cosine threshold tuning, privacy considerations, and performance impact in RAG systems."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-semantic-caching)

Traditional caching matches exact strings: "How many routes are at Longdong" and "How many routes does Longdong have" are treated as two different queries, each triggering a full RAG pipeline execution.

Semantic Caching uses vector similarity for matching: **if two queries have embeddings close enough to each other, they are treated as the same question, and the cached result is returned directly**.

## How It Works

```typescript
async function checkSemanticCache(
  queryVector: number[],
  db: D1Database,
  kv: KVNamespace,
  threshold = 0.95
): Promise<CachedResult | null> {

  // Retrieve all cached embeddings from KV
  const cached = await getCachedEmbeddings(kv);

  for (const entry of cached) {
    const similarity = cosineSimilarity(queryVector, entry.embedding);

    if (similarity >= threshold) {
      return entry.result; // Cache hit
    }
  }

  return null; // Cache miss
}
```

Cache hit → skip all 17 pipeline steps, return the result directly. Latency drops from 5-8 seconds to < 100 milliseconds.

## Choosing the Threshold

A cosine similarity of 0.95 seems high, but it's reasonable in semantic space:

| Similarity | Semantic Relationship |
|------|---------|
| 1.0 | Identical sentences |
| 0.98-0.99 | Nearly identical phrasing, differing only in particles |
| 0.95-0.97 | Semantically equivalent, different expressions |
| 0.90-0.94 | Related but with notable differences |
| < 0.90 | Significantly different |

0.95 allows "How many routes are at Longdong" and "How many routes does Longdong have" to hit the same cache, but prevents "How many routes are at Longdong" and "What is the hardest route at Longdong" from being conflated.

This value can be dynamically adjusted via `ai_config` to find the optimal balance between cache hit rate and accuracy.

## Cache Storage

Cloudflare KV is used for cache storage:

```typescript
await kv.put(
  `semantic_cache:${queryHash}`,
  JSON.stringify({
    embedding: queryVector,
    result: response,
    createdAt: Date.now(),
  }),
  { expirationTtl: 3600 } // TTL: 1 hour
);
```

A 1-hour TTL is a deliberate tradeoff:
- Too short → low cache hit rate, minimal savings
- Too long → cache may become stale after data updates (routes modified, new routes added)

Climbing route information is relatively stable, so 1 hour is reasonable. If a major data update occurs, the cache can be cleared manually.

## Privacy Considerations

**Queries from logged-in users are not cached.**

Personalized query results depend on user-specific data (climbing level, history, preferences). Caching the same question for different users would return incorrect personalized results:

- User A asks "recommend routes for me" → returns 5.10 routes
- User B (advanced climber) asks the same question → also returns 5.10 → incorrect

Anonymous queries (general questions from non-logged-in users) don't have this issue and can be safely cached.

## Impact on Cache Hit Rate

Cache hit rate depends on:
1. **User behavior patterns**: climbing communities have common high-frequency questions ("What routes are at Longdong", "What's the difference between bouldering and sport climbing")
2. **Threshold setting**: lower → easier to hit, but may return imprecise answers
3. **TTL setting**: longer → larger cache pool, higher hit rate

In an early-stage climbing community with a concentrated user base, there is high overlap in frequently asked questions, making semantic caching highly effective.

## Position in the Pipeline

Semantic Cache is the **first step** in the pipeline, executed before all other steps:

```
Request
  ↓
[Semantic Cache Check] ← if hit, return immediately
  ↓ (miss)
[Query Classification]
  ↓
[... remaining 17 steps ...]
```

The cached response includes the complete `query_id`, `sources`, and `quota_info`, ensuring a consistent frontend experience -- users cannot tell whether a result is cached or freshly generated.

## Overall Takeaway

Semantic Caching is one of the lowest-cost, highest-impact performance optimizations in a RAG system. The implementation is simple (a single vector comparison), the effect is dramatic (latency drops from seconds to milliseconds), and the improvement in user experience is immediate.

The only considerations are privacy (don't cache personalized queries) and TTL settings (data update frequency). In every other respect, this is an optimization with virtually no downsides.

---

## References

- [GPTCache: An Open-Source Semantic Cache for LLM Applications Enabling Faster Answers and Cost Savings](https://aclanthology.org/2023.nlposs-1.24/)
- [MeanCache: User-Centric Semantic Caching for LLM Web Services (arXiv:2403.02694)](https://arxiv.org/abs/2403.02694)
- [Cloudflare Workers KV Documentation](https://developers.cloudflare.com/kv/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
