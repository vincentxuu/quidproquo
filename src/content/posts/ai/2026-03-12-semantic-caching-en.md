---
title: "Semantic Caching: Run the RAG Pipeline Only Once for Semantically Similar Queries"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, semantic-cache, caching, vector-search, performance]
lang: en
tldr: "Caching doesn't have to match exact query strings -- semantically similar questions can hit the cache too, skipping the entire RAG pipeline execution."
description: "Semantic Caching design: matching cached queries via vector similarity, cosine threshold tuning, privacy considerations, and performance impact in RAG systems."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 41
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

Cache hit → skip the entire rest of the pipeline and return the result directly. Latency drops from "seconds, the cost of a full pipeline run" to "milliseconds, the cost of one vector comparison." The actual numbers depend on your pipeline length and models -- measure your own before quoting any.

> The loop above pulls every cached embedding back and scans it linearly, which only works while the cache holds tens or hundreds of entries. Two limits will bite you: Workers KV can only `list()` keys, so values must be fetched one by one ([how KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/)) -- past a certain count, reading the cache costs more than running the pipeline; and KV is eventually consistent, so a freshly written entry is not guaranteed to be readable from another region right away. Beyond roughly a thousand entries, put the cache lookup itself into a vector index (e.g. a dedicated cache namespace in [Vectorize](https://developers.cloudflare.com/vectorize/)) and replace the linear scan with top-1 + threshold.

## Choosing the Threshold

A cosine similarity of 0.95 seems high, but it's reasonable in semantic space. The table below is an intuition aid, **not a universal constant** -- similarity distributions vary a lot between embedding models (some put unrelated sentence pairs above 0.7 as a noise floor), so calibrate against your own query log:

| Similarity | Semantic Relationship |
|------|---------|
| 1.0 | Identical sentences |
| 0.98-0.99 | Nearly identical phrasing, differing only in particles |
| 0.95-0.97 | Semantically equivalent, different expressions |
| 0.90-0.94 | Related but with notable differences |
| < 0.90 | Significantly different |

0.95 allows "How many routes are at Longdong" and "How many routes does Longdong have" to hit the same cache, but prevents "How many routes are at Longdong" and "What is the hardest route at Longdong" from being conflated.

This value can be dynamically adjusted via `ai_config` to find the optimal balance between cache hit rate and accuracy. Calibration is crude but effective: take a batch of real queries, pair them up, hand-label whether each pair should share an answer, then pick the threshold whose false-hit rate you can live with.

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

## Check What the Provider Already Caches for You

Before building your own semantic cache, see how much two off-the-shelf layers already cover:

- **Prompt caching / context caching**: every major API can cache a repeated prompt prefix (system prompt, fixed knowledge blocks) on the provider side and bill hits at a discounted input rate. This is **exact prefix matching**, not semantic matching, so it saves on "sending the same long context over and over," not on "the same question asked in different words" -- the two are complementary. Mechanics and pricing live in the official docs: [Anthropic prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching), [OpenAI prompt caching](https://platform.openai.com/docs/guides/prompt-caching), [Gemini context caching](https://ai.google.dev/gemini-api/docs/caching).
- **Gateway-level caching**: if requests already go through [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/features/caching/), you can enable caching there instead of writing it yourself. The docs are explicit that this is an **exact match on the whole request**; semantic matching is still on their roadmap.
- **Off-the-shelf semantic caches at the library layer**: the Python ecosystem has had these for a while — `langchain-community`'s [`RedisSemanticCache`](https://reference.langchain.com/python/langchain-community/cache/RedisSemanticCache), `CassandraSemanticCache`, `OpenSearchSemanticCache`, `AzureCosmosDBSemanticCache`, plus GPTCache. They do exactly what the rest of this post hand-rolls: embed, then match on a similarity threshold.

So "semantic caching has to be built from scratch" is not true. The first two layers really do only recognize byte-identical input ("How many routes are at Longdong" is not byte-identical to "How many routes does Longdong have"), but the third layer exists. **What actually forces you to build it is the stack**: those implementations all live in the Python ecosystem, so on Workers and TypeScript you fall back to writing it yourself.

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
[... all remaining steps ...]
```

The cached response includes the complete `query_id`, `sources`, and `quota_info`, ensuring a consistent frontend experience -- users cannot tell whether a result is cached or freshly generated.

## Overall Takeaway

Semantic Caching is one of the lowest-cost, highest-impact performance optimizations in a RAG system. The implementation is simple (a single vector comparison), the effect is dramatic (latency drops from seconds to milliseconds), and the improvement in user experience is immediate.

Three things need watching: privacy (don't cache personalized queries), TTL (how often the underlying data changes), and the cost of the cache lookup itself -- once entries pile up, a linear scan becomes the bottleneck, so move it into a vector index. Handle those three and it stays a very high-return optimization.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [GPTCache: An Open-Source Semantic Cache for LLM Applications Enabling Faster Answers and Cost Savings](https://aclanthology.org/2023.nlposs-1.24/) -- the ideas still hold up, but [the GPTCache project itself](https://github.com/zilliztech/GPTCache) last cut release 0.1.44 in August 2024 and has seen only sporadic commits since; don't treat it as an actively maintained dependency.
- [MeanCache: User-Centric Semantic Caching for LLM Web Services (arXiv:2403.02694)](https://arxiv.org/abs/2403.02694)
- [Cloudflare Workers KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare AI Gateway: Caching](https://developers.cloudflare.com/ai-gateway/features/caching/)
- [Anthropic: Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI: Prompt caching](https://platform.openai.com/docs/guides/prompt-caching)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
