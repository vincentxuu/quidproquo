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
series:
  name: "The RAG Techniques Compendium"
  order: 42
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

These proportions shift a lot with the model and pipeline design, and this post quotes no unit prices -- **per-token rates, prompt-caching discounts, and batch discounts all keep changing, so any number hard-coded into an article will be wrong by the time you read it**. To cost out your own system, go to the official pricing pages: [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Anthropic pricing](https://www.anthropic.com/pricing), [OpenAI pricing](https://platform.openai.com/docs/pricing).

The first thing actually worth doing is measuring it in your own system: log input/output token counts per pipeline step, multiply by today's rates, and you get a per-query cost breakdown. Without that table every optimization below is guesswork. As a rough shape, LLM generation is usually the largest item, embeddings next, and vector search plus database are typically loose change -- but trust your own numbers over that sentence.

## Optimization Strategies

### 1. Semantic Caching (Highest ROI)

Return cached results directly for semantically similar queries, skipping the entire pipeline:

- Implementation cost: low (one vector comparison + KV lookup)
- Benefit: completely eliminates LLM generation cost
- Best for: scenarios with high query repetition rates

For a climbing community, questions like "what routes are at Longdong" or "how do I start climbing" repeat often enough to make caching worth it. What you save is essentially the cache hit ratio: a 30% hit rate cuts roughly 30% off generation cost. There is no universal figure here -- it depends entirely on how concentrated your users are on a handful of questions. Instrument hit ratio as a monitored metric first, then argue about what it's worth.

Details in [Semantic Caching: Run the RAG Pipeline Only Once for Semantically Similar Queries](/posts/ai/2026-03-12-semantic-caching-en).

### 2. Use the Provider's Built-in Discount Mechanisms

Before touching the architecture, check whether two "save money without changing behavior" switches are on:

- **Prompt caching**: put the system prompt, few-shot examples, and fixed knowledge blocks at the very front of the prompt and keep them byte-identical, and the repeated prefix bills at a discounted rate. The front half of a RAG prompt is usually fixed, so this is easy money. Mechanics: [Anthropic](https://docs.claude.com/en/docs/build-with-claude/prompt-caching), [OpenAI](https://platform.openai.com/docs/guides/prompt-caching), [Gemini](https://ai.google.dev/gemini-api/docs/caching).
- **Batch APIs**: anything that doesn't need a live response (summaries during a reindex, offline evaluation, batch re-runs of the Judge) can go through the batch interface, which is normally meaningfully cheaper in exchange for latency. See [OpenAI batch](https://platform.openai.com/docs/guides/batch), [Anthropic batch processing](https://docs.claude.com/en/docs/build-with-claude/batch-processing), [Workers AI Batch API](https://developers.cloudflare.com/workers-ai/features/batch-api/).

Discount levels differ per provider and get revised; read the current number off the pricing page rather than copying a percentage from any article.

### 3. Dynamic Model Selection

Choose the LLM based on query complexity -- not every query needs the most powerful model:

```typescript
// Route to a differently sized model based on query classification
const model = queryType === 'simple' || queryType === 'general-knowledge'
  ? env.MODEL_SMALL   // small model: simple definitions, general knowledge
  : env.MODEL_LARGE;  // large model: complex reasoning, recommendations
```

No model IDs are hard-coded here on purpose: the available lineup turns over every few months, and a pinned model name is the fastest-rotting thing in a codebase. Keep model IDs in configuration (environment variables or `ai_config`); both the code and this article only describe the "large / small" role. For the current menu see [Workers AI models](https://developers.cloudflare.com/workers-ai/models/) or each provider's model docs.

One size tier apart usually means a several-fold difference in unit price (check the pricing page for the actual ratio), so the lever is direct: the larger the share of queries you can safely route to the small model, the more you save. The precondition is **classification accuracy** -- misrouting a complex query to the small model pays back the savings in answer quality. Measure your classifier against a labeled query set before deciding how aggressive the routing should be.

A close relative of the same trick: a small reranker in front, a large generator behind. Let the cheap reranker cut candidates from dozens down to a top 3-5, so the expensive generation model only reads those. What you save is input tokens on the generation side, and reranking itself costs far less.

### 4. Context Length Control

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

### 5. Skip Unnecessary Steps

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

### 6. Embedding Reuse

Within a single request, compute the embedding only once and reuse it everywhere:

```typescript
// Compute early in the pipeline, store in context
ctx.queryEmbedding = await embed(ctx.query, env);

// All subsequent search paths use this embedding without recomputing
const queryResults = await searchVectorize(ctx.queryEmbedding, filter);
```

### 7. BM25 as a Pre-filter for Search

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

An ordering principle rather than a table you can copy (the savings percentages depend entirely on your traffic distribution, so someone else's numbers mean nothing for you):

1. **Do the quality-neutral ones first**: prompt caching, batch APIs, embedding reuse. These compute the same thing more cheaply; not a word of the answer changes.
2. **Then the hit-dependent ones**: semantic cache saves exactly its hit ratio, and its only quality risk is serving stale data, which TTL and privacy rules contain.
3. **Measure before shipping anything that trades quality for money**: dynamic model selection, shorter context, skipped pipeline steps. Each needs an A/B or offline evaluation number showing how much groundedness moved.
4. **Cut quality monitoring last**: sampling the Judge (say, evaluating 30% of queries) is an acceptable compromise; turning it off entirely saves loose change and costs you the ability to notice the system is broken.

## Overall Takeaway

The ROI ordering for RAG cost optimization usually runs: turn on prompt caching and batch first (quality-neutral), then semantic cache (saves exactly its hit ratio), and only then dynamic model selection (saves the most, but pays for it with classifier accuracy). The real numbers can only come out of your own token log; percentages from someone else's article are at best a hint about what's worth trying.

Other optimizations (context length control, step skipping) are fine-tuning -- limited individual impact but worthwhile in aggregate. Quality protection (Judge) should not be sacrificed lightly. The cost of running a Judge buys continuous monitoring of system quality, and the value of that monitoring far exceeds the token savings from removing it.

---

## References

- [CompactRAG: Reducing LLM Calls and Token Overhead in Multi-Hop Question Answering](https://arxiv.org/abs/2602.05728)
- [RAGO: Systematic Performance Optimization for Retrieval-Augmented Generation Serving](https://arxiv.org/abs/2503.14649)
- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach](https://arxiv.org/abs/2407.16833)
- [Towards Understanding Systems Trade-offs in Retrieval-Augmented Generation Model Inference](https://arxiv.org/abs/2412.11854)
- Official pricing and discount mechanisms (rates change; the official page is the source of truth): [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Anthropic pricing](https://www.anthropic.com/pricing), [OpenAI pricing](https://platform.openai.com/docs/pricing), [OpenAI Batch API](https://platform.openai.com/docs/guides/batch), [Anthropic Batch processing](https://docs.claude.com/en/docs/build-with-claude/batch-processing), [Workers AI Batch API](https://developers.cloudflare.com/workers-ai/features/batch-api/)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
