---
title: "CRAG: Automatically Relaxing Filters When Retrieval Comes Up Empty"
date: 2026-03-12
type: guide
category: ai
tags: [rag, crag, corrective-rag, retrieval, fallback]
lang: en
tldr: "Filters too strict and getting zero results? CRAG automatically relaxes them and retries — far better than letting the LLM hallucinate an answer from general knowledge."
description: "How Corrective RAG (CRAG) works: detecting zero results, progressively relaxing filter conditions, and retrying searches to ensure the RAG pipeline still has usable context at the edges."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-corrective-rag-crag)

RAG systems have a silent failure mode: **filters are too strict, no candidate documents pass, but the pipeline keeps running and the LLM falls back to general knowledge**.

Say a user asks "Does Longdong have any 5.14 routes?" The system correctly extracts `crag_id = longtung` and `grade_numeric ≥ 140` — but Longdong simply doesn't have routes at that grade, so the search returns nothing. If the pipeline just hands an empty context to the LLM, there are two bad outcomes:

1. The LLM honestly says "no relevant information found" → technically correct, but a poor experience (what you really want is "Longdong doesn't have any 5.14 routes")
2. The LLM hallucinates an answer from general knowledge → inaccurate

CRAG (Corrective RAG) addresses this by **detecting zero results and automatically relaxing the filters before retrying the search**.

## Relaxation Strategy

Not all filters carry the same weight. Location filters (crag, area) usually represent the user's core intent and shouldn't be discarded lightly. Grade filters and route-type filters are often secondary constraints — relaxing those is the more sensible move.

The relaxation order looks like this:

```
Original filter: { crag_id: 'longtung', grade_numeric: { gte: 140 }, route_type: 'sport' }
    ↓ zero results
Step 1: drop grade_numeric filter
    { crag_id: 'longtung', route_type: 'sport' }
    ↓ still zero results
Step 2: drop route_type filter
    { crag_id: 'longtung' }
    ↓ results found → continue
```

Location filters (`crag_id`, `area_id`, `region`) are preserved until the very end. When a user asks about Longdong, they want information about Longdong — returning data from some other crag just because this one had no results would miss the point entirely.

## Implementation

```typescript
async function hybridSearchWithCRAG(ctx: PipelineContext): Promise<SearchResult[]> {
  let filter = buildFilter(ctx);
  let results = await hybridSearch(ctx.queryVector, filter);

  // Zero results and there are still conditions we can relax
  if (results.length === 0 && ctx.cragRetryCount < 1) {
    ctx.cragRetryCount++;

    // Remove grade filter, keep location
    const relaxedFilter = removeGradeFilter(filter);
    results = await hybridSearch(ctx.queryVector, relaxedFilter);

    // Record to trace
    ctx.trace.retrieval.crag_triggered = true;
    ctx.trace.retrieval.relaxed_filter = relaxedFilter;
  }

  return results;
}
```

`cragRetryCount < 1` caps retries at one. Without a limit, you could theoretically keep relaxing until no filters remain — but that risks surfacing completely irrelevant results, which is worse than failing cleanly.

## CRAG vs. Agentic RAG

CRAG is **rule-based** correction that runs automatically within the pipeline — no LLM decision-making required. Agentic RAG has the LLM actively evaluate whether retrieval was sufficient and, if not, reformulate the query and try again. They solve different problems:

| | CRAG | Agentic RAG |
|---|------|-------------|
| Trigger | Zero results | LLM judges context insufficient |
| Decision maker | Rules | LLM |
| Best for | Overly strict filters | Multi-hop reasoning |
| Latency cost | Low (one extra search) | High (multiple LLM calls) |

CRAG handles "we got nothing at all." Agentic RAG handles "we got something, but not enough."

## Why Relax Filters Rather Than Expand the Source

Another approach is "if nothing comes back, search an external knowledge base (e.g., Wikipedia)." The original CRAG paper actually includes this design (Web Search fallback). But in a climbing community context, users are asking about specific crags and routes — pulling in generic climbing content from the web is more likely to mislead than help. Better to honestly communicate "this crag doesn't have routes at that grade" and show the closest relevant information instead.

Relaxing filters stays semantically coherent with the original query; results are more predictable and controlled.

## The Bigger Picture

CRAG is a safety net for your RAG pipeline. The cost is low (one extra search), but it prevents silent failures at the edges. Paired with an LLM-as-Judge groundedness score, even if the documents retrieved after relaxation are less directly relevant, the judge will penalize the groundedness score and trigger an appropriate disclaimer. Defense is multi-layered — CRAG is the first layer.

---

## References

- [Corrective Retrieval Augmented Generation (2024)](https://arxiv.org/abs/2401.15884)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
