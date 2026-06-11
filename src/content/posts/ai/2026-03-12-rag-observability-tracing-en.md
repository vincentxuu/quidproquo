---
title: "RAG Observability: 17-Step Tracing to Turn the Black Box Transparent"
date: 2026-03-12
type: guide
category: ai
tags: [rag, observability, tracing, debugging, pipeline, monitoring]
lang: en
tldr: "The hardest part of a RAG system isn't building it — it's figuring out why a particular answer went wrong. Pipeline Tracing records every step's decisions and data so debugging has a clear trail to follow."
description: "Observability design for RAG pipelines: the data structure behind 17-step tracing, what information to record, how to use traces to pinpoint issues, and admin dashboard trace view design."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-observability-tracing)

After a RAG system goes live, a user reports "this answer is wrong" — how do you investigate?

Without observability, all you can do is guess: Did vector search retrieve the wrong documents? Was it an LLM hallucination? Were the filter conditions too strict, resulting in zero results? Did the reranker push good documents to the bottom? Any step could be the problem, but you have no way to tell which one.

RAG Tracing solves this: **record every pipeline step's inputs, outputs, and decisions so that when something goes wrong, you can reconstruct the execution process step by step**.

## Trace Data Structure

```typescript
interface PipelineTrace {
  queryId: string;
  totalDurationMs: number;

  cache: {
    hit: boolean;
    similarity?: number;  // Similarity score on cache hit
  };

  toolSelection: {
    queryType: string;
    reasoning: string;           // LLM's reasoning for classification
    sqlTemplateId?: string;
    usedFallback: boolean;       // Whether regex fallback was used
    durationMs: number;
  };

  hyde: {
    skipped: boolean;
    generatedDoc?: string;       // Generated hypothetical document (for debugging)
    durationMs?: number;
  };

  multiQuery: {
    skipped: boolean;
    subQueries?: string[];       // List of generated sub-queries
    durationMs?: number;
  };

  filterBuild: {
    extractedFilters: VectorFilter;
    usedNlp: boolean;
    nlpMethod?: string;          // LLM / regex / none
  };

  retrieval: {
    vectorCandidates: number;    // Number of vector search hits
    bm25Candidates: number;      // Number of BM25 hits
    rrfMerged: number;           // Count after RRF fusion
    cragTriggered: boolean;      // Whether relaxed retry was triggered
    relaxedFilter?: VectorFilter;
    durationMs: number;
  };

  crossEncoder: {
    skipped: boolean;
    inputCount?: number;
    outputCount?: number;        // Count remaining after threshold filtering
    threshold?: number;
    durationMs?: number;
  };

  mmr: {
    lambda: number;
    inputCount: number;
    outputCount: number;
    durationMs: number;
  };

  generation: {
    model: string;               // Which LLM was used
    promptTokens: number;
    completionTokens: number;
    injectedDocuments: string[]; // IDs of documents injected into the prompt
    durationMs: number;
  };

  judge: {
    groundedness: number;
    quality: number;
    reasoning: string;           // Judge's scoring rationale
    durationMs: number;
  };

  selfReflection: {
    triggered: boolean;
    accepted?: boolean;          // Whether the regenerated answer was adopted
    originalGroundedness?: number;
    regenGroundedness?: number;
  };
}
```

## What to Record and Why

The key is to record not just "what happened" but also "why it happened that way":

**toolSelection.reasoning**: The rationale the LLM provided when classifying the query ("This query contains counting intent, suitable for SQL template"). The classification result alone isn't enough — the reasoning helps you judge whether the classification was sound.

**toolSelection.usedFallback**: If the LLM timed out and fell back to regex classification, this will be true. Low-quality query classifications are often caused by regex fallback.

**retrieval.cragTriggered**: Whether filters were relaxed and retrieval retried due to zero results. This signal indicates the query's filter conditions may be too strict, or the database lacks content of this type.

**generation.injectedDocuments**: Which documents the LLM actually saw. If the answer is wrong, you can cross-reference these documents to determine whether the documents themselves were flawed or the LLM misinterpreted their content.

**selfReflection.accepted**: Whether the regenerated answer was adopted. If it was adopted but groundedness is still low, the problem lies in insufficient context, not the generation strategy.

## Time Breakdown

```typescript
interface TokenBreakdown {
  embeddingMs: number;      // Embedding computation time
  retrievalMs: number;      // Search + RRF time
  rerankingMs: number;      // Cross-encoder time
  generationMs: number;     // LLM generation time
  judgeMs: number;          // Judge scoring time
  overheadMs: number;       // Other (routing, DB writes, etc.)
  totalMs: number;
}
```

The time breakdown gives optimization a direction: if most time is spent on `generationMs`, switch to a lighter model or shorten the context; if it's `rerankingMs`, consider reducing the candidate count; if it's `embeddingMs`, check whether parallelization has issues.

## Storage Design

Traces are stored as JSON in the `pipeline_trace` table:

```sql
CREATE TABLE pipeline_trace (
  id          TEXT PRIMARY KEY,
  query_log_id TEXT NOT NULL,  -- Links to ai_query_logs
  trace_data  TEXT NOT NULL,   -- Full trace in JSON format
  created_at  INTEGER NOT NULL
);
```

The reason for choosing JSON over normalized tables: the trace structure evolves as the pipeline changes, and JSON doesn't require migrations. The admin dashboard parses JSON fields directly when querying.

When query volume is high, only the last 30 days of traces are retained, with older ones cleaned up periodically:

```sql
DELETE FROM pipeline_trace
WHERE created_at < unixepoch() - 30 * 86400;
```

## Admin Dashboard Trace View

The admin AI Log page renders trace data as a timeline view:

```
Query: What 5.11 routes are at Longdong?        Total: 6.2s

[Cache]           Miss                                 0ms
[Query Classify]  complex (confidence 0.92)           380ms
[HyDE]            Generated hypothetical doc (89 chars) 820ms
[Multi-Query]     Generated 3 sub-queries             610ms
[Filter Build]    crag_id=longtung, grade>=110         45ms
[Hybrid Search]   Vector 18 + BM25 12 → RRF 22       340ms
[Cross-Encoder]   22 → 8 (threshold 0.5)              290ms
[MMR]             8 → 5 (lambda=0.7)                   12ms
[LLM Generation]  Gemma-3-12b, 1240 tokens          3,840ms
[Judge]           groundedness 0.87, quality 3        510ms
[Self-Reflection] Not triggered (quality > 2)           0ms
[Output Guard]    Passed                                8ms
```

Each step can be expanded to show detailed data (generated hypothetical document content, sub-query list, injected document list).

## Using Traces to Pinpoint Issues

**Problem: Irrelevant answer**
1. Check `toolSelection.queryType`: Was the classification correct?
2. Check `filterBuild.extractedFilters`: Were the filter conditions correct?
3. Check `retrieval.vectorCandidates` + `bm25Candidates`: Were any results found?
4. Check `generation.injectedDocuments`: Were the documents the LLM saw actually the right ones?

**Problem: Hallucinated answer**
1. Check `judge.groundedness`: Is it below 0.6?
2. Check `generation.injectedDocuments`: Do these documents contain relevant content?
3. Check `retrieval.cragTriggered`: Did CRAG relax filters, bringing in irrelevant documents?

**Problem: Slow answer**
1. Check `tokenBreakdown`: Which step took the most time?
2. Check `judge.durationMs`: Is the Judge slowing down the critical path? (Judge should be async)
3. Check `generation.promptTokens`: Is the context too long?

## The Big Picture

Observability is the critical gap between a RAG system that "runs" and one that's "operable." Without traces, every issue requires guesswork; with traces, problems can almost always be pinpointed to a specific step.

When designing traces, recording "decision rationale" is more valuable than recording "execution results." Results can often be inferred from the answer itself — rationale is the key to debugging. Why did the LLM classify the query this way? Why did CRAG trigger? Why didn't Self-Reflection adopt the new answer? The answers to all these questions live in the trace.

---

## References

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry Semantic Conventions for GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OpenLLMetry - OpenTelemetry for LLM Applications (GitHub)](https://github.com/traceloop/openllmetry)
- [Langfuse - Open Source LLM Observability](https://langfuse.com/docs)
- [AgentOps: Enabling Observability of LLM Agents (arXiv:2411.05285)](https://arxiv.org/abs/2411.05285)
