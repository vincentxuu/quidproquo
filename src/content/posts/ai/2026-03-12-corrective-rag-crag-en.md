---
title: "CRAG: Automatically Relaxing Filters When Retrieval Comes Up Empty"
date: 2026-03-12
updated: 2026-09-03
type: guide
category: ai
tags: [rag, crag, corrective-rag, retrieval, fallback]
lang: en
tldr: "Filters too strict and getting zero results? CRAG automatically relaxes them and retries — far better than letting the LLM hallucinate an answer from general knowledge."
description: "How Corrective RAG (CRAG) works: detecting zero results, progressively relaxing filter conditions, and retrying searches to ensure the RAG pipeline still has usable context at the edges."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 23
---

> 🌏 [中文版](/posts/ai/2026-03-12-corrective-rag-crag)

RAG systems have a silent failure mode: **filters are too strict, no candidate documents pass, but the pipeline keeps running and the LLM falls back to general knowledge**.

Say a user asks "Does Longdong have any 5.14 routes?" The system correctly extracts `crag_id = longtung` and `grade_numeric ≥ 140` — but Longdong simply doesn't have routes at that grade, so the search returns nothing. If the pipeline just hands an empty context to the LLM, there are two bad outcomes:

1. The LLM honestly says "no relevant information found" → technically correct, but a poor experience (what you really want is "Longdong doesn't have any 5.14 routes")
2. The LLM hallucinates an answer from general knowledge → inaccurate

CRAG (Corrective RAG) addresses this by **detecting zero results and automatically relaxing the filters before retrying the search**.

One clarification up front, so this doesn't mislead: what follows is CRAG in **spirit**, not the paper's algorithm. The 2024 CRAG paper by Yan et al. runs a lightweight retrieval evaluator that scores retrieved documents and returns a confidence degree; depending on whether it lands in Correct / Incorrect / Ambiguous, a different knowledge action fires — an Incorrect verdict switches to large-scale web search — and a decompose-then-recompose step breaks documents into knowledge strips, drops the irrelevant ones, and reassembles the rest. The implementation here has no evaluator and no web search. It keeps only the core idea — a failed retrieval should trigger a corrective action rather than handing an empty context to the LLM — and makes that action a relaxation of structured filters. The section "Why Relax Filters Rather Than Expand the Source" below explains why web search was dropped for this domain.

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

`cragRetryCount < 1` caps retries at one — which means the relaxation ladder above is a **conceptual priority order**, while this implementation only ever runs its first rung (dropping the grade filter). To do multi-stage relaxation, raise the cap and apply the rungs in order; just note that every additional rung moves the returned documents further from what was actually asked. Without a limit at all, you could keep relaxing until no filters remain — surfacing completely irrelevant results, which is worse than failing cleanly.

## CRAG vs. Agentic RAG

CRAG is **rule-based** correction that runs automatically within the pipeline — no LLM decision-making required. Agentic RAG has the LLM actively evaluate whether retrieval was sufficient and, if not, reformulate the query and try again. They solve different problems:

| | CRAG | Agentic RAG |
|---|------|-------------|
| Trigger | Zero results | LLM judges context insufficient |
| Decision maker | Rules | LLM |
| Best for | Overly strict filters | Multi-hop reasoning |
| Latency cost | Low (one extra search) | High (multiple LLM calls) |

CRAG handles "we got nothing at all." Agentic RAG handles "we got something, but not enough."

## The Adaptive Retrieval Spectrum: Between CRAG and Agentic RAG

The table above frames CRAG and Agentic RAG as two poles — but between them sits a family of adaptive retrieval strategies, each striking a different balance between autonomy and cost:

| Method | Who decides whether to retrieve | When it triggers | Extra cost |
|---|---|---|---|
| CRAG | Rules (zero results) | After search | One extra search |
| **FLARE** | LLM confidence scores | Mid-generation | Depends on low-confidence token count |
| **Self-RAG** | Special reflection tokens | Mid-generation | Slight inference overhead (reflection tokens) |
| **Adaptive-RAG** | Classifier | At query time | One classification + corresponding path |
| Agentic RAG | LLM agent loop | After search / after generation | Multiple LLM calls |

**FLARE** (Forward-Looking Active REtrieval) monitors the LLM's confidence as it generates an answer. When the next sentence's predicted tokens drop below a confidence threshold, it assembles the low-confidence tokens into a new query, retrieves fresh documents, and feeds them back into the generation flow. The trigger granularity is finer than CRAG — instead of waiting for an entire search to return empty, FLARE intervenes mid-sentence.

**Self-RAG** goes further: during training, the model learns to emit four types of reflection tokens (`[Retrieve]`, `[IsRel]`, `[IsSup]`, `[IsUse]`) that let it decide at inference time whether to fetch documents, whether what came back is relevant, and whether the generated response is supported. No external agent loop or classifier needed — retrieval decisions are internalized into the model itself. See [Self-RAG: Letting the Model Decide When to Retrieve with Reflection Tokens](/en/posts/ai/2026-09-03-self-rag-reflection-tokens-en) for the full deep-dive.

**Adaptive-RAG** takes a different tack. A lightweight classifier at the front gate evaluates query complexity and routes it to one of three paths: no retrieval (LLM answers directly), single-pass retrieval (standard RAG), or multi-hop retrieval (iterative retrieval). Compared to CRAG's reactive correction or Agentic RAG's full agent loop, the classifier adds minimal latency — but it needs labeled training data to calibrate the routing thresholds.

These approaches aren't mutually exclusive. CRAG works well as the lowest safety net (zero-result correction). Adaptive-RAG or FLARE handles the grey zone of "we got results but aren't sure they're good enough." Agentic RAG is reserved for genuinely complex queries that demand multi-step reasoning. A mature system can stack multiple layers.

## Why Relax Filters Rather Than Expand the Source

Another approach is "if nothing comes back, search an external knowledge base (e.g., Wikipedia)." The original CRAG paper actually includes this design (Web Search fallback). But in a climbing community context, users are asking about specific crags and routes — pulling in generic climbing content from the web is more likely to mislead than help. Better to honestly communicate "this crag doesn't have routes at that grade" and show the closest relevant information instead.

Relaxing filters stays semantically coherent with the original query; results are more predictable and controlled.

## The Bigger Picture

CRAG is a safety net for your RAG pipeline. The cost is low (one extra search), but it prevents silent failures at the edges. Paired with an LLM-as-Judge groundedness score, even if the documents retrieved after relaxation are less directly relevant, the judge will penalize the groundedness score and trigger an appropriate disclaimer. Defense is multi-layered — CRAG is the first layer.

---

## Changelog

- 2026-09-03: Added "Adaptive Retrieval Spectrum" section (Self-RAG, Adaptive-RAG, FLARE) to fill the gap between CRAG and Agentic RAG; added five new references.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Corrective Retrieval Augmented Generation (2024)](https://arxiv.org/abs/2401.15884)
- [Official implementation of the CRAG paper (HuskyInSalt/CRAG)](https://github.com/HuskyInSalt/CRAG)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection — ICLR 2024](https://arxiv.org/abs/2310.11511)
- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented LLMs through Question Complexity — NAACL 2024](https://arxiv.org/abs/2403.14403)
- [Active Retrieval Augmented Generation (FLARE) — EMNLP 2023](https://arxiv.org/abs/2305.06983)
- [Lightweight Query Routing for Adaptive RAG (2026)](https://arxiv.org/abs/2604.03455)
- [RetrievalQA: Assessing Adaptive Retrieval-Augmented Generation for Short-form QA — ACL 2024](https://arxiv.org/abs/2402.16457)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
