---
title: "Debugging Ask AI in Production: SSE, Traces, Cache, Checkpoints, and Shadow Runs"
date: 2026-08-30
category: ai
type: guide
tags: [rag, observability, sse, semantic-cache, langfuse]
lang: en
tldr: "One Ask AI request leaves five different evidence surfaces: public SSE, Langfuse traces, D1 logs, semantic cache, and a hidden shadow run. They expose different data, and no single surface reconstructs the complete retrieval context."
description: "A request-timeline guide to what Ask AI's SSE, Langfuse and D1 traces, semantic cache, checkpoints, and shadow mode can and cannot prove."
draft: false
series:
  name: "Ask AI in Practice"
  order: 5
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-runtime-observability)

> **Optional companion reading:** Beginners can read this article directly. For extra context, see [RAG Streaming](/posts/ai/2026-03-12-rag-streaming-sse-en), [RAG Observability](/posts/ai/2026-03-12-rag-observability-tracing-en), and [Semantic Caching](/posts/ai/2026-03-12-semantic-caching-en).

When a user reports that an answer looked wrong, Ask AI has no single file that reconstructs the entire run. Public SSE records what the user received. Langfuse and D1 store execution summaries. A semantic-cache hit may prevent the pipeline from running at all. A checkpoint may inject a summary from an earlier turn.

This article follows one request over time. The implementation centers on [`/api/chat`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts) and the [shared pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts).

## A request first resolves authority, cache, and history

After receiving `message`, the API verifies the session, applies visitor quota, and loads RAG settings, provider keys, and the thread checkpoint. `traceScope` and `cacheMode` pass through the [request policy](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/request-policy.ts): only an authenticated admin request may select evaluation tracing or `cacheMode: bypass`.

Only then does the API query the [semantic cache](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/cache.ts). A cache hit returns one `token` event containing the stored answer and a `done` event with `cached: true`. Planner, Research, Writer, Validation, and Critic do not run.

This distinction changes incident diagnosis. A cached answer without sources does not demonstrate that the new retriever missed them. It demonstrates that the user received an older stored response.

## The pipeline emits only the accepted answer

On a cache miss, the [pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts) delegates to the configured engine. The engine may produce several Writer drafts internally. The facade suppresses those intermediate `onToken` callbacks, normalizes the lifecycle output, and emits only `final_response`.

This boundary fixes a confusing UI failure. If three retries each stream a draft and the client appends token events, the browser displays three answers concatenated together. Agent-step events can still reveal repeated stages, but only the accepted response becomes answer text.

The public stream may include:

- `agent_step`: stage name, completed status, and a small summary.
- `token`: accepted answer text.
- `related`: related-reading items produced by the pipeline.
- `sources`: deduplicated sources after Validation and Critic gates.
- `done`: token usage, confidence, thread ID, cache status, and remaining quota.
- `error`: public error type and message.

It does not include raw ranked chunks, the full prompt context, every rejected draft, or the complete Critic JSON.

## Langfuse and D1 preserve execution summaries

Ask AI creates a `blog-rag` trace with pipeline engine, thread ID, cache mode, trace scope, and request start time. Completion adds duration, confidence, answer relevance, intent alignment, drift, result count, model usage, and lifecycle trace steps.

Each step is also mapped to a span. If the mapping cannot be exact, it is marked as fallback or unobserved instead of pretending every timestamp was measured. Calls through the [Langfuse adapter](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/langfuse.ts) are queued without blocking chat availability when the external observability service fails.

D1 separately stores `chat_logs` and step records. These can answer which stage repeated, how long the request took, and what the final score was. They still are not a complete model trace. Public `agent_step` events and backend trace rows are projections of a run, not an engine-state dump.

## A checkpoint can change the next query's context

The [checkpoint implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/checkpoints.ts) estimates tokens across messages, drafts, and retrieved evidence. Above the configured ratio, it stores a summary containing the latest question, answer, and coverage gaps. The next request with the same `thread_id` loads that summary.

A short follow-up such as “What about leveraged ETFs?” therefore cannot always be reproduced from its query string alone. The prior thread summary is also input. Use a new thread for a clean regression case; preserve the original thread ID when testing context contamination.

## A shadow run is hidden comparison, not the production answer

In [RAG settings](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/settings.ts), `shadowModeEnabled` defaults to `false`. When enabled, the completed primary request triggers a baseline configuration with HyDE, Multi-Query, reranking, Critic, and PageIndex disabled. Primary and shadow responses plus confidence values are written to `shadow_runs`.

All shadow callbacks are no-ops. Users never see shadow tokens, steps, or sources, and the shadow response never replaces the primary answer. A `shadow_runs` row alone does not prove that one configuration is better; that conclusion still requires a fixed dataset, scoring rules, and inspectable artifacts.

## A reproducible observation flow

After starting Astro with its normal Workers bindings, preserve the public SSE stream:

```bash
curl -N -X POST http://127.0.0.1:4321/api/chat \
  -H 'Content-Type: application/json' \
  --data '{"message":"What course articles do you have?","thread_id":"obs-clean-01"}'
```

To exclude semantic cache, use an authenticated admin session. A public request should not obtain bypass authority:

```bash
curl -N -X POST http://127.0.0.1:4321/api/chat \
  -H 'Content-Type: application/json' \
  -H 'Cookie: session=admin-session-cookie' \
  --data '{"message":"What course articles do you have?","thread_id":"obs-clean-02","traceScope":"eval","cacheMode":"bypass"}'
```

Run policy and facade tests to protect bypass authorization and final-only output:

```bash
pnpm exec vitest run \
  src/lib/conversation/pipeline.test.ts \
  src/lib/conversation/request-policy.test.ts \
  src/pages/api/chat.policy.test.ts
```

Record `cached`, thread ID, agent-step sequence, sources, done or error payload, and backend trace ID. Without those fields, a later investigation can easily misread a cache hit as retrieval failure or a public stage sequence as a full prompt trace.

## What each layer can prove

| Evidence | Can answer | Cannot answer |
|---|---|---|
| SSE | Answer, sources, and stage summaries delivered to the user | Hidden chunks and complete prompt |
| Langfuse / D1 trace | Stage, duration, scores, and configuration summary | Intermediate values that were never persisted |
| Semantic cache | Whether an old answer was reused | How the new retriever would perform |
| Checkpoint | Which history summary entered the next turn | Replay of the full original conversation |
| Shadow run | Outputs from two configurations on one request | Production switchover or long-term quality improvement |

More telemetry does not erase evidence boundaries. State which layer you have before making a diagnosis; that is more reliable than calling every log a “trace.”

## References

- [Ask AI API lifecycle and SSE](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts)
- [Shared pipeline final-response facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)
- [Semantic cache implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/cache.ts)
- [Conversation checkpoint implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/checkpoints.ts)
- [RAG runtime settings and shadow baseline](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/settings.ts)
- [Ask AI evaluation evidence boundary](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
