---
title: "Query Classification: Teaching Your RAG System How to Answer Each Question"
date: 2026-03-12
type: guide
category: ai
tags: [rag, query-classification, adaptive-routing, tool-selection, llm]
lang: en
tldr: "Not every question needs full RAG. Classify queries with an LLM first, then route to the right execution path — saving cost and improving accuracy."
description: "A guide to Query Classification design: 6 query types, routing strategies, dynamic model selection, and how to make your pipeline automatically adapt its execution path based on query intent."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 16
---

> 🌏 [中文版](/posts/ai/2026-03-12-query-classification-adaptive-routing)

One of the most common inefficiencies in RAG systems is running every query through the full vector search + LLM generation pipeline — even when most queries don't need it.

"What's 2+2?" doesn't require retrieving any documents. "How many routes are at Longdong?" doesn't need semantic search — a direct database query is enough. "What is rock climbing?" is general knowledge the LLM can answer on its own.

Query Classification sits at the very front of the pipeline. It **identifies the nature of a query first, then decides how to handle it downstream**. This single decision has the biggest impact on overall performance and cost.

## 6 Query Types

```
simple             → Single, clear-cut question (names, places, definitions)
complex            → Queries requiring reasoning, comparison, or recommendation
general-knowledge  → Common knowledge that doesn't need a climbing database
sql                → Exact stats or counts ("how many routes have I completed?")
hybrid             → SQL for candidates + LLM for recommendations ("suggest routes at my level")
clarification-needed → Ambiguous intent — needs the user to clarify
```

## How Classification Works

Use LLM Tool Calling (Function Calling) to force the model to select the correct tool:

```typescript
const tools = [{
  name: "classify_query",
  description: "Analyze the query and select the most appropriate handling strategy",
  parameters: {
    query_type: {
      enum: ["simple", "complex", "general-knowledge", "sql", "hybrid", "clarification-needed"]
    },
    reasoning: "string",       // Classification rationale (for tracing)
    sql_template_id: "string", // Filled in for SQL queries
    clarification_options: [], // Options to present for clarification
  }
}];
```

Rather than producing free-form text, the LLM is forced to call a tool, ensuring the output is structured and parseable. Having the model explain its reasoning also makes tracing and debugging much easier.

If the LLM call fails (timeout or parse error), fall back to regex rules:

```typescript
// Fallback regex classification
if (/幾條|幾次|多少|count|how many/i.test(query)) return 'sql';
if (/是什麼|定義|介紹/i.test(query)) return 'simple';
// Everything else → 'complex'
```

## Routing Strategy

The classification result determines which execution path the pipeline takes:

| Type | Execution Path |
|------|----------------|
| `simple` | embedding → hybrid search → lightweight LLM generation |
| `complex` | HyDE + Multi-Query + hybrid search → reranking → MMR → large-model generation → Judge |
| `general-knowledge` | Skip all retrieval → answer directly with LLM |
| `sql` | Execute SQL template → lightweight LLM to format answer → early return |
| `hybrid` | SQL for candidates → vector search supplement → large-model recommendation generation |
| `clarification-needed` | Assemble clarification options → return to user |

Every step in the pipeline has a `skipWhen` condition that automatically skips irrelevant steps based on `queryType`:

```typescript
{
  name: "hyde",
  skipWhen: (ctx) => ctx.queryType !== "complex",
  execute: async (ctx) => { /* HyDE logic */ }
},
{
  name: "text-to-sql",
  skipWhen: (ctx) => !["sql", "hybrid"].includes(ctx.queryType),
  execute: async (ctx) => { /* SQL logic */ }
}
```

This design keeps the pipeline linear — no manual branching logic needed. Each step manages its own skip condition, keeping classification results and step logic cleanly decoupled.

If you're using a framework instead of hand-rolling the pipeline, note that the `RouterChain` shown in older LangChain tutorials now lives in `langchain-classic` and is no longer the recommended path. The core package offers branching primitives like `RunnableBranch` and `RouterRunnable`, and the current official guidance for multi-way routing is to do it in LangGraph with `Command` (single destination) or `Send` (parallel fan-out) — see the [LangChain router architecture docs](https://docs.langchain.com/oss/python/langchain/multi-agent/router). The concept is identical to this article (classify first, then dispatch); only the dispatch vehicle changed.

## Dynamic Model Selection

The classification result also determines which LLM to use:

```typescript
const effectiveLlmModel =
  ["simple", "general-knowledge"].includes(queryType)
    ? MODELS.small   // Lightweight, low cost — for answers that mostly copy context
    : MODELS.large;  // Only when reasoning, comparison, or long-form structure is needed
```

The specific model IDs don't matter and shouldn't be hardcoded into an article — this layer gets replaced by something cheaper or stronger every few months. What matters is the trade-off itself: **the classification result exists to decide whether a question is worth spending a big model on**. Answers for `simple` and `general-knowledge` mostly copy or paraphrase context, so a small model suffices; `complex` and `hybrid` need comparison, reasoning, and long-form structure, which is where the big model earns its cost. In high-traffic scenarios, this dynamic selection meaningfully reduces token costs and average latency.

In practice, pull the model IDs out into a single config constant (like `MODELS.small` / `MODELS.large` above) so swapping models touches one place. For what's actually available, check your platform's model catalog directly — e.g. [Cloudflare Workers AI models](https://developers.cloudflare.com/workers-ai/models/).

## Handling `clarification-needed`

When query intent is ambiguous, the system doesn't guess — it returns clarification options directly:

```
Q: Recommend some routes

Clarification options:
  A. Recommend beginner routes at Longdong
  B. Recommend routes suited to my current level
  C. Recommend recently popular routes
  D. Recommend routes good for groups
```

This is a far better experience than guessing wrong and generating an irrelevant answer — and it avoids burning LLM tokens on a bad response.

## The Big Picture

Query Classification is the core of adaptive RAG. Different questions have different optimal solutions; forcing every query through a fixed pipeline is wasteful by design. Get the classification right, and every downstream step runs on the correct track. Get it wrong, and no amount of optimization further down the pipeline will save you.

Key design principles for this layer:
1. Use LLM Tool Calling to guarantee structured output
2. Always have a regex fallback to prevent LLM timeouts from killing the entire request
3. `skipWhen` keeps the pipeline decoupled — classification results stay separate from step logic
4. Dynamic model selection is the lowest-hanging fruit for cost optimization

---

## References

- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity](https://arxiv.org/abs/2403.14403)
- [SymRAG: Efficient Neuro-Symbolic Retrieval Through Adaptive Query Routing](https://arxiv.org/abs/2506.12981)
- [RAGRouter: Learning to Route Queries to Multiple Retrieval-Augmented Language Models](https://arxiv.org/abs/2505.23052)
- [Context Awareness Gate For Retrieval Augmented Generation](https://arxiv.org/abs/2411.16133)
- [Router architecture and dispatch primitives — official LangChain docs](https://docs.langchain.com/oss/python/langchain/multi-agent/router)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) (zh-TW only)
