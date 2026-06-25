---
title: "NobodyClimb AI Architecture: Building a 20-Node RAG Pipeline on Cloudflare Workers"
date: 2026-03-12
updated: 2026-03-27
category: tech
tags: [rag, cloudflare-workers-ai, llm, pipeline, gemma, embedding, hono, langgraph]
lang: en
tldr: "A dynamically composable RAG pipeline built on Cloudflare Workers AI (gemma-3-12b-it + bge-m3): 14 base steps + 6 LangGraph-specific nodes, with three strategy graphs (Baseline / Agentic / Plan-Execute) selected at runtime."
description: "A complete architecture writeup for the NobodyClimb AI Q&A system: model selection, 20-node pipeline design (including three LangGraph strategy graphs), PipelineEngine implementation, conditional routing, self-reflection loops, and deployment trade-offs on Cloudflare Workers."
draft: false
type: deep-dive
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)

NobodyClimb is a Taiwanese rock climbing community platform. Before we integrated AI Q&A, if a user wanted to find "which 5.10 routes are at Longdong," they had to manually browse through posts. Now they can ask the AI directly and get an answer with source links.

This post documents the architecture of the entire AI system — why we chose these models, how the pipeline is designed, and what pitfalls we hit working within Cloudflare Workers' constraints.

## Technology Choices

The entire backend runs on Cloudflare Workers using the Hono framework. For AI, we chose to stay within the Cloudflare ecosystem primarily to avoid maintaining separate AI inference infrastructure.

**LLM: `@cf/google/gemma-3-12b-it`**

Early on we used `llama-3.1-8b-instruct`, but its output quality in Chinese contexts was weak — Traditional Chinese instruction-following was particularly poor. Switching to gemma-3-12b-it was a clear improvement. At 12B parameters, it's a good fit for this use case.

**Embedding: `@cf/baai/bge-m3`**

1024-dimensional vectors, multilingual model, with the best Traditional Chinese performance among the models we evaluated. The M3 architecture supports dense retrieval, sparse retrieval, and ColBERT-style multi-vector simultaneously. We currently only use dense retrieval, but the door is open for hybrid search later.

## Pipeline Architecture

The entire query flow is designed as a modular pipeline. The base pipeline engine has 14 steps across 5 phases, plus 6 LangGraph-specific nodes — totaling **20 unique nodes** — with the strategy selected dynamically based on query complexity:

```
pre-retrieval → retrieval → post-retrieval → generation → evaluation
```

```
┌─────────────────────────────────────────────────────────────────┐
│ Pre-Retrieval                                                    │
│  semantic-cache → tool-selection → hyde → multi-query           │
│  → filter-build                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Retrieval                                                        │
│  embedding → hybrid-search                                       │
├─────────────────────────────────────────────────────────────────┤
│ Post-Retrieval                                                   │
│  cross-encoder → mmr → popularity-rerank                        │
├─────────────────────────────────────────────────────────────────┤
│ Generation                                                       │
│  llm-generation                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Evaluation                                                       │
│  judge → self-reflection                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Design Logic for Each Step

**semantic-cache**: Runs a semantic cache check at the very front of the pipeline. If a semantically similar historical query exists, it fires `earlyReturn` to skip all subsequent steps and return the cached result.

**tool-selection**: Classifies the query type (`climbing-knowledge` / `general-knowledge`). General knowledge queries (e.g., "how do I care for climbing shoes") go straight to the LLM for a direct answer, bypassing all RAG steps to avoid wasting retrieval resources.

**HyDE (Hypothetical Document Embeddings)**: Uses the LLM to first generate a hypothetical answer document, then uses that document for vector search. This technique works well when there's a semantic gap between the query and the documents — for example, a casual phrasing matched against formal route descriptions.

**multi-query**: Expands the original query into 3–5 sub-queries from different angles, searches them independently, then takes the union to improve recall.

**filter-build**: Uses NLP to detect structured conditions in the query (difficulty grade, location, route type) and converts them into metadata filters for the search step. For example, "5.10 at Longdong" → `{ location: 'Longdong', grade: { min: '5.10a', max: '5.10d' } }`.

**cross-encoder**: Reranks candidate documents retrieved by the bi-encoder using a cross-encoder. Skips when the candidate count is ≤ 1 (handled internally within the step, not via the engine's `skipWhen`).

**MMR (Maximal Marginal Relevance)**: Balances relevance and diversity to avoid returning documents with highly similar content.

**judge**: LLM-as-judge evaluates the quality of generated answers (correctness, relevance, groundedness) and writes results to the trace for admin monitoring.

**self-reflection**: Calculates the groundedness score of the answer. If it falls below the threshold (0.5), triggers `loopBack` to re-run retrieval. Defaults to a maximum of 2 loops (`max_pipeline_loops` defaults to 2, range 1–3) to prevent infinite loops.

### PipelineStep Interface

Every step implements the same interface:

```typescript
interface PipelineStep {
  id: string                    // kebab-case unique identifier
  name: string                  // display name
  description: string
  phase: PipelinePhase          // pre-retrieval | retrieval | post-retrieval | generation | evaluation
  defaultEnabled: boolean
  defaultOrder: number
  requires: string[]            // fields the step expects from ctx
  provides: string[]            // fields the step writes into ctx after execution
  skipWhen?: SkipCondition[]    // conditional routing
  execute(ctx: PipelineContext): Promise<PipelineContext>
}
```

Steps pass state through `PipelineContext` without depending on each other directly, making them easy to test in isolation and compose dynamically.

## Three Advanced Mechanisms

### 1. Conditional Routing (skipWhen)

The engine evaluates `skipWhen` conditions before calling a step's `execute()`. If the condition is met, the step is skipped. This centralizes routing logic in the engine rather than scattering it across individual steps.

```typescript
// After tool-selection classifies a query as general-knowledge,
// all subsequent RAG steps are automatically skipped
skipWhen: [{ field: 'queryType', operator: 'eq', value: 'general-knowledge' }]
```

The skip reason is written to `ctx.trace.pipeline_execution` for easy debugging.

### 2. Looping Pattern

When `self-reflection` detects poor answer quality, it can set `ctx.loopBack` to instruct the engine to jump back to a specified phase and re-execute. A safety limit (`max_pipeline_loops`, default 2, range 1–3) prevents infinite loops.

```
Round 1: retrieval → post-retrieval → generation → evaluation
self-reflection: groundedness = 0.3 < 0.5, sets loopBack → retrieval

Round 2: retrieval → post-retrieval → generation → evaluation
self-reflection: groundedness = 0.7, passes, done
```

### 3. Branching + Fusion

Supports parallel branch execution using `Promise.all()` to run multiple search paths concurrently, with a fusion step merging the results. The primary use case is running vector search and BM25 full-text search in parallel, then merging rankings with RRF (Reciprocal Rank Fusion).

## LangGraph Strategy Layer

The base pipeline engine handles "straight-line" query flows. But queries of varying complexity need different retrieval strategies — simple questions don't need all 14 steps, and complex ones may require multiple iterations. LangGraph sits on top of the pipeline engine and provides three strategy graphs:

### Baseline Graph (15 nodes)

The standard flow, suitable for most queries. Covers the 14 base pipeline steps plus **memoryExtractor** (extracts user preferences from the conversation and writes them to long-term memory).

### Agentic Graph (12 nodes)

Suited for complex queries requiring multiple retrieval rounds. The key addition is two nodes — **agenticDecision** and **agenticRetrieve**: agenticDecision uses the LLM to judge whether the current information is sufficient to answer the question; if not, it triggers agenticRetrieve to fetch more, cycling up to 5 times.

### Plan-Execute Graph (8 nodes)

Suited for compound queries that need to be broken into sub-tasks (e.g., "compare 5.10 routes at Longdong vs. Beitou"). Adds three nodes — **planning**, **executePlanStep**, and **synthesis**: planning decomposes the problem into sub-tasks, executePlanStep executes them one by one, and synthesis merges the results.

### Complete List of 20 Unique Nodes

| # | Node | Source | Description |
|---|------|--------|-------------|
| 1 | semantic-cache | Pipeline | Semantic cache check |
| 2 | tool-selection | Pipeline | Query type classification |
| 3 | hyde | Pipeline | Hypothetical document generation |
| 4 | multi-query | Pipeline | Multi-angle query expansion |
| 5 | filter-build | Pipeline | Structured condition extraction |
| 6 | embedding | Pipeline | Vectorization |
| 7 | hybrid-search | Pipeline | Vector + BM25 hybrid search |
| 8 | text-to-sql | Pipeline | Direct SQL query |
| 9 | cross-encoder | Pipeline | Precision reranking |
| 10 | mmr | Pipeline | Diversity selection |
| 11 | popularity-rerank | Pipeline | Popularity-weighted reranking |
| 12 | llm-generation | Pipeline | LLM answer generation |
| 13 | judge | Pipeline | Quality evaluation |
| 14 | self-reflection | Pipeline | Loop back and retry on low quality |
| 15 | memoryExtractor | LangGraph | Conversational memory extraction |
| 16 | agenticDecision | LangGraph | Multi-round retrieval decision |
| 17 | agenticRetrieve | LangGraph | Adaptive re-retrieval |
| 18 | planning | LangGraph | Sub-task decomposition |
| 19 | executePlanStep | LangGraph | Sub-task execution |
| 20 | synthesis | LangGraph | Multi-result merging |

Strategy selection is handled automatically by the tool-selection node based on query complexity — users don't need to specify it manually.

## Configuration and Observability

Step enable/disable status and ordering for the pipeline are stored in the `ai_config` table in D1. Admins can adjust them dynamically from a UI without redeploying. Dependency validation runs at save time (e.g., disabling `embedding` while `hybrid-search` is still enabled will be rejected).

Every query records a full execution trace:

```json
{
  "pipeline_execution": [
    { "id": "semantic-cache", "duration_ms": 12, "skipped": false },
    { "id": "tool-selection", "duration_ms": 340, "skipped": false },
    { "id": "hyde", "duration_ms": 890, "skipped": false },
    { "id": "hybrid-search", "duration_ms": 45, "skipped": false },
    ...
  ],
  "loop_history": [],
  "total_duration_ms": 2340
}
```

The admin dashboard can view the complete 17-step execution trace for every query, including the input, decision rationale, and output for each step.

## Trade-offs on Cloudflare Workers

**Benefits**: No AI infrastructure to manage. Both gemma and bge-m3 are called directly via the `env.AI` binding — as simple as calling D1.

**Constraints**: Workers have CPU time limits, and the pipeline includes multiple LLM calls (HyDE, LLM generation, judge). We manage this with sensible step-disable configurations: HyDE is only enabled in production for complex queries, and judge writes asynchronously without blocking the response.

**SSE Streaming**: `POST /api/v1/ai/ask?stream=true` uses Hono's `streamSSE` helper to push LLM tokens to the frontend incrementally. Quota is refunded on disconnect.

## Overall

The core trade-off in this architecture is flexibility vs. complexity. The pipeline engine combined with dynamic configuration makes it fast to experiment with different step combinations, but a 13-step dependency graph also carries a relatively high maintenance cost.

This approach works well when: the domain knowledge has clear boundaries (climbing routes, crag info), you need to combine Chinese NLP filtering with vector search, and you have enough trace infrastructure to support continuous tuning.

It's probably not worth replicating if: you don't have admin trace infrastructure, your team isn't familiar with RAG tuning, or your query types are simple enough that a basic top-k + LLM generation setup would do the job.

## References

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Google Gemma Models](https://ai.google.dev/gemma)
- [BAAI/bge-m3 Model](https://huggingface.co/BAAI/bge-m3)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [HyDE: Hypothetical Document Embeddings Paper](https://arxiv.org/abs/2212.10496)
- [Maximal Marginal Relevance (MMR)](https://www.cs.cmu.edu/~jgc/publication/The_Use_MMR_Diversity_Based_LTMIR_1998.pdf)
- [Reciprocal Rank Fusion (RRF)](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)
- [Corrective RAG Paper](https://arxiv.org/abs/2401.15884)
- [Hono Framework Documentation](https://hono.dev/)
- [NobodyClimb Technical Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Platform-wide architecture and Cloudflare-first strategy
