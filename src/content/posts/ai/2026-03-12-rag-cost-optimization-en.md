---
title: "RAG Cost Optimization: Minimizing the Cost of Every Query"
date: 2026-03-12
type: guide
category: ai
tags: [rag, cost-optimization, performance, token-budget, caching]
lang: en
tldr: "RAG system costs come from LLM tokens, Embedding APIs, and vector search. Every stage has room for cost reduction, but you need to verify that optimizations don't sacrifice too much quality."
description: "A breakdown of RAG system cost components, optimization strategies for each stage, and a decision framework for balancing quality against cost."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-cost-optimization)

The cost sources in a production RAG system are quite concrete. Understanding where costs come from at each stage is the prerequisite for targeted optimization.

## Cost Component Analysis

**LLM Generation** (usually the largest portion):
- Each query consumes prompt tokens (context + query) + completion tokens (response)
- Multiple LLM calls (Query Classification, HyDE, Multi-Query, Judge) add up

**Embedding**:
- Query embedding for each request
- HyDE hypothetical document embedding
- Multi-Query sub-query embeddings
- Embedding for each chunk during indexing (one-time, but high volume)

**Vector Search**:
- Multi-path vector search costs (query + HyDE + Multi-Query)
- Reranking (Cross-Encoder) costs

**Database**:
- BM25 full-text search
- Metadata queries
- Log writes

In a Cloudflare Workers AI environment, LLM generation typically accounts for 70-80%, Embedding for 10-15%, and the rest goes to database and Vectorize.

## Optimization Strategies

### 1. Semantic Caching (Highest ROI)

Return cached results directly for semantically similar queries, skipping the entire pipeline:

- Implementation cost: low (one vector comparison + KV lookup)
- Benefit: completely eliminates LLM generation cost
- Best for: scenarios with high query repetition rates

For a climbing community, questions like "what routes are at Longdong" or "how do I start climbing" have very high repetition rates. Cache hit rates can reach 20-30%, significantly reducing average cost.

```typescript
// Before caching: full pipeline every time, ~0.05 USD/query
// After caching: 70% misses run the pipeline, 30% hits return instantly
// Average cost reduced by 30%
```

### 2. Dynamic Model Selection

Choose the LLM based on query complexity -- not every query needs the most powerful model:

```typescript
const model = queryType === 'simple' || queryType === 'general-knowledge'
  ? 'llama-3.1-8b-instruct'   // cheap, good enough
  : 'gemma-3-12b-it';         // expensive, but necessary
```

| Model | Relative Cost | Best For |
|-------|--------------|----------|
| 8B model | 1x | Simple definitions, general knowledge |
| 12B model | 3-4x | Complex reasoning, recommendations |
| 70B+ model | 10x+ | Extremely complex (avoid if possible) |

If 40% of queries are the simple type, using a lightweight model saves 40% x (3x-1x) = 80% of model costs.

### 3. Context Length Control

LLM cost scales linearly with context length. Longer context means more prompt tokens:

```typescript
// Bad: stuffing all search results into context
const context = allDocuments.map(d => d.content).join('\n');

// Good: limiting context length
const MAX_CONTEXT_TOKENS = 3000;
const context = buildContext(selectedDocuments, MAX_CONTEXT_TOKENS);
```

Control strategies:
- Use MMR to select the top 5 most diverse documents (not top 20)
- Extract only the most relevant passages from each document (not the entire document)
- Context compression (have the LLM compress documents before sending to the generation model)

### 4. Skip Unnecessary Steps

Every pipeline step has a cost. Make sure you only run what's necessary:

```typescript
// HyDE only runs for complex queries
skipWhen: (ctx) => ctx.queryType !== 'complex'

// Multi-Query only runs for complex queries
skipWhen: (ctx) => ctx.queryType !== 'complex'

// Self-Reflection only triggers for low-quality responses
skipWhen: (ctx) => ctx.judgeResult?.quality > 2

// Judge can be set to run on only a percentage of queries (sampling evaluation)
skipWhen: (ctx) => Math.random() > 0.3  // only evaluate 30% of queries
```

Sampling evaluation for the Judge is worth considering: running Judge on every query is expensive, but as long as the sample is representative enough, 30% sampling provides sufficient monitoring.

### 5. Embedding Reuse

Within a single request, compute the embedding only once and reuse it everywhere:

```typescript
// Compute early in the pipeline, store in context
ctx.queryEmbedding = await embed(ctx.query, env);

// All subsequent search paths use this embedding without recomputing
const queryResults = await searchVectorize(ctx.queryEmbedding, filter);
```

### 6. BM25 as a Pre-filter for Search

For queries that can be precisely matched by keywords (place names, route names, difficulty levels), use BM25 for fast filtering first, then send a small set of candidates to vector search for fine ranking:

```typescript
// Replace full-table vector search
if (hasExactKeywords(query)) {
  const bm25Results = await bm25Search(query, filter);
  if (bm25Results.length >= 5) {
    // BM25 results are sufficient, skip vector search
    ctx.candidateMatches = bm25Results;
    return;
  }
}
// Otherwise continue with vector search
```

Vector search (ANN) is more expensive than BM25. Use BM25 whenever possible.

## Cost vs. Quality Trade-offs

Cost optimization doesn't mean cutting without limits. It's about finding the sweet spot of "good enough quality + acceptable cost":

```
Cost optimization decision framework:

1. Establish baseline cost and quality metrics
2. For each optimization option, evaluate:
   - How much cost is reduced (%)
   - How much quality drops (groundedness, user satisfaction)
3. Calculate the cost/quality ratio
4. Prioritize by ratio, stopping when quality decline approaches the red line
```

| Optimization | Cost Reduction | Quality Impact | Recommendation |
|-------------|---------------|----------------|----------------|
| Semantic Cache | -30% | None | Highly recommended |
| Dynamic model selection | -20% | Slight (small model for simple queries) | Highly recommended |
| Reduce context length | -15% | Moderate (may miss information) | Recommended |
| Judge sampling at 30% | -10% | Slight (reduced monitoring density) | Recommended |
| Skip Judge entirely | -13% | High (lose quality protection) | Not recommended |

## Overall Takeaway

The highest-ROI strategies for RAG cost optimization are Semantic Cache and dynamic model selection. The former completely eliminates costs for repeated queries, and the latter lets simple queries use cheaper models. Combined, these two can typically reduce average costs by 40-50% with almost no impact on overall quality.

Other optimizations (context length control, step skipping) are fine-tuning -- limited individual impact but worthwhile in aggregate. Quality protection (Judge) should not be sacrificed lightly. The cost of running a Judge buys continuous monitoring of system quality, and the value of that monitoring far exceeds the token savings from removing it.

---

## References

- [CompactRAG: Reducing LLM Calls and Token Overhead in Multi-Hop Question Answering](https://arxiv.org/abs/2602.05728)
- [RAGO: Systematic Performance Optimization for Retrieval-Augmented Generation](https://arxiv.org/abs/2503.14649)
- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach](https://arxiv.org/abs/2407.16833)
- [Towards Understanding Systems Trade-offs in Retrieval-Augmented Generation Model Inference](https://arxiv.org/abs/2412.11854)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
