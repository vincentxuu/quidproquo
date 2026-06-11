---
title: "Modular RAG Pipeline: Designing RAG as a Composable DAG"
date: 2026-03-12
type: deep-dive
category: ai
tags: [rag, pipeline, architecture, modular, dag, cloudflare-workers]
lang: en
tldr: "RAG doesn't have to be a rigid three-step process. It's a set of steps that can be dynamically enabled, skipped, or reordered. Pipeline as Code lets the system adapt its behavior without redeployment."
description: "Architectural design of a Modular RAG Pipeline: Step Registry, skipWhen conditional routing, dynamic configuration, PipelineContext state management, and implementation considerations on Cloudflare Workers."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-modular-rag-pipeline-architecture)

A lot of RAG systems are built the same way: one big function that sequentially runs query parsing, vector search, reranking, and generation, with a tangle of if-else branches in between. This works fine when the system is simple, but as you add more steps — HyDE, Multi-Query, CRAG, Self-Reflection — that big function turns into an unmaintainable ball of mud.

The Modular Pipeline design breaks each RAG step into an independent module and uses a Pipeline Engine to orchestrate them. The core idea draws from the concept of a Directed Acyclic Graph (DAG): **steps are nodes, dependencies are edges, and the engine executes them in order while passing state along**.

## Step Structure

Each pipeline step is an object implementing a fixed interface:

```typescript
interface PipelineStep {
  name: string;
  skipWhen?: (ctx: PipelineContext) => boolean;
  timeout?: number;  // milliseconds, per-step timeout
  execute: (ctx: PipelineContext, env: Env) => Promise<void>;
}
```

A concrete step looks like this:

```typescript
const hydeStep: PipelineStep = {
  name: "hyde",
  skipWhen: (ctx) => ctx.queryType !== "complex",
  timeout: 3000,
  execute: async (ctx, env) => {
    const hypoDoc = await generateHypotheticalDoc(ctx.query, env);
    ctx.hydeEmbedding = await embed(hypoDoc, env);
    ctx.trace.hyde = { generated: hypoDoc, durationMs: /* ... */ };
  },
};
```

`skipWhen` is the key to this design: each step decides for itself whether to run, so you don't need branching logic scattered throughout the engine. The result of Query Classification (`ctx.queryType`) lets each step automatically take the right path.

## Step Registry

All steps register with the Registry at startup, and the Engine retrieves an ordered list of steps from it:

```typescript
const registry = new PipelineStepRegistry();

registry.register(semanticCacheStep);    // 1
registry.register(quotaCheckStep);       // 2
registry.register(toolSelectionStep);    // 3
registry.register(textToSqlStep);        // 4
registry.register(hydeStep);             // 5
registry.register(multiQueryStep);       // 6
registry.register(filterBuildStep);      // 7
registry.register(embeddingStep);        // 8
registry.register(hybridSearchStep);     // 9
registry.register(crossEncoderStep);     // 10
registry.register(mmrStep);              // 11
registry.register(popularityRerankStep); // 12
registry.register(llmGenerationStep);    // 13
registry.register(judgeStep);            // 14
registry.register(selfReflectionStep);   // 15
registry.register(guardrailsOutputStep); // 16
registry.register(memoryExtractionStep); // 17
```

Adding a new step only requires writing a new step object and adding one line to the Registry — no changes to the Engine itself.

## Pipeline Engine

The Engine's core logic is remarkably simple:

```typescript
class PipelineEngine {
  async run(ctx: PipelineContext, env: Env): Promise<void> {
    const steps = this.registry.getSteps();

    for (const step of steps) {
      // Dynamic config: admins can disable a step from the dashboard
      const isEnabled = ctx.config.steps[step.name]?.enabled ?? true;
      if (!isEnabled) continue;

      // skipWhen: the step decides for itself whether to run
      if (step.skipWhen?.(ctx)) continue;

      // Execute with timeout
      await withTimeout(
        step.execute(ctx, env),
        step.timeout ?? ctx.config.defaultStepTimeout
      );
    }
  }
}
```

In practice you'd add timeout handling, error isolation (a failing step shouldn't bring down the whole pipeline), trace recording, and so on — but the core logic is just this loop.

## PipelineContext: A Single State Object

All steps share one `PipelineContext`, passing information between them by mutating the context:

```typescript
interface PipelineContext {
  // Input
  query: string;
  userId?: string;
  config: AIConfig;

  // Query analysis results
  queryType: "simple" | "complex" | "sql" | "hybrid" | "general-knowledge" | "clarification-needed";
  sqlTemplateId?: string;

  // Vector search
  queryEmbedding?: number[];
  hydeEmbedding?: number[];
  expandedQueries?: string[];
  vectorFilter?: VectorFilter;

  // Search results
  candidateMatches: SearchResult[];

  // Generation
  context: string;        // assembled context string
  messages: Message[];    // LLM messages array
  response?: AIResponse;

  // Quality evaluation
  judgeResult?: JudgeResult;

  // Observability
  trace: PipelineTrace;
  tokenBreakdown: TokenBreakdown;

  // Quota
  quotaDeducted: boolean;
  cragRetryCount: number;
}
```

A single state object makes debugging intuitive: when something goes wrong, printing the entire context shows exactly what each step did. It also makes testing easier: you can set up a context at a specific state and test a step's behavior in isolation.

## Dynamic Configuration

Step enable/disable states and various thresholds are stored in the `ai_config` database table and can be adjusted in real time through the Admin UI:

```json
{
  "steps": {
    "hyde": { "enabled": true },
    "multi_query": { "enabled": true },
    "cross_encoder": { "enabled": true },
    "self_reflection": { "enabled": false }  // temporarily disabled
  },
  "reranker_relevance_threshold": 0.5,
  "mmr_lambda": 0.7,
  "rag_strategy": "plan-execute"
}
```

This lets you change system behavior without redeployment:
- Disable a broken step as a live hotfix
- Tune threshold parameters for A/B testing
- Switch RAG strategies (baseline / plan-execute / agentic)

## Cloudflare Workers Constraints

Running the Pipeline on Cloudflare Workers comes with a few things to keep in mind:

**CPU time limits**: Workers have a CPU time cap (not wall-clock time). Waiting on I/O (LLM API calls) doesn't consume CPU, but be mindful of embedding computation and heavy string processing.

**Parallelism done right**: I/O across multiple steps should use `Promise.all()` for concurrency — not sequential `await` chains:

```typescript
// Correct: run in parallel
const [queryEmbedding, hydeDoc] = await Promise.all([
  embed(query, env),
  generateHyDE(query, env),
]);

// Wrong: sequential, wastes time
const queryEmbedding = await embed(query, env);
const hydeDoc = await generateHyDE(query, env);
```

**The purpose of `ctx.waitUntil()`**: Non-critical work (memory extraction, Contextual Retrieval updates) can use `waitUntil()` to continue executing after the response is returned, without blocking the user.

## In Summary

The Modular Pipeline solves the **maintainability** problem in RAG systems. As you add more steps, a modular design is far easier to maintain than a single monolithic function; dynamic configuration is more flexible than tweaking parameters through redeployment; `skipWhen` is cleaner than screens full of if-else.

The core trade-off in this architecture: you add a layer of abstraction (Pipeline Engine, Step Registry), and in exchange you get testability, configurability, and observability. For a RAG system that keeps evolving, that trade-off is worth it.

---

## References

- [Modular RAG: Transforming RAG Systems into LEGO-like Reconfigurable Frameworks (2024)](https://arxiv.org/abs/2407.21059)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
