---
title: "How a Question Moves Through Ask AI: UI, API, Agents, and Source Cards"
date: 2026-08-30
category: ai
type: guide
tags: [rag, ai-agent, langgraph, sse, retrieval, cloudflare-workers]
lang: en
tldr: "Ask AI splits one question across the UI, `/api/chat`, Planner, Research, Writer, Validation, Critic, and Related stages. Answer text, displayed sources, and related-reading cards come from separate paths with separate gates."
description: "Trace a question through the actual quidproquo Ask AI implementation, from the chat UI and SSE API to the RAG pipeline, final answer, displayed sources, and related-reading cards."
draft: true
series:
  name: "Ask AI in Practice"
  order: 0
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-pipeline-overview)

> **Optional companion reading:** Beginners can read this article directly. For background concepts, pair it with [Three Generations of RAG: From Naive to Modular](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution-en) and [Modular RAG Pipeline: Designing RAG as a Composable DAG](/posts/ai/2026-03-12-modular-rag-pipeline-architecture-en).

Ask AI does more than search a few posts and hand them to a model. After a reader submits a question, the request passes through quota checks, caching, query planning, retrieval, writing, structural validation, content review, and a source-display gate. The answer, displayed sources, and related-reading cards are not three renderings of the same object.

This opening article maps those responsibilities. Later entries will inspect indexing, hybrid retrieval, the Writer, validation, and observability. Here, the question is narrower: **after the reader presses Send, which component owns each decision?**

## From the chat component to `/api/chat`

[`ChatWidget`](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/ChatWidget.tsx) posts the question and `thread_id` to `/api/chat`, then parses the SSE stream block by block. Each event updates a different part of the message:

- `token` appends answer text.
- `agent_step` exposes progress such as Planner, Research, and Writer.
- `sources` becomes the displayed reference list.
- `related` becomes the related-reading list.
- `done` closes the stream and carries confidence, usage, and remaining quota.

[`MessageList`](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/MessageList.tsx) renders those fields as Markdown and two link sections. A missing source section therefore does not necessarily mean Research found zero chunks. A later quality gate may have withheld the links. Likewise, a related-reading card does not prove that the Writer saw that post as evidence; the Related stage runs a separate query.

## The API applies request policy before running RAG

[`src/pages/api/chat.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts) is the boundary between HTTP and the RAG lifecycle. It validates the message, admin session, public quota, and cache policy before loading RAG settings, provider keys, and the conversation checkpoint.

When the semantic cache hits, the API returns the cached response and a `done` event. It does not rerun Research, and that path does not emit fresh `sources` or `agent_step` events. A retrieval evaluation must therefore avoid treating a cache hit as evidence from a new retrieval run.

Without a hit, the API calls the shared [`runPipeline`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts) facade. The facade selects the configured `langgraph`, `manual`, or `llamaindex` engine and normalizes the result into one `GraphState`. It suppresses draft tokens emitted inside an engine and publishes only `final_response`. That boundary prevents retries from concatenating several Writer drafts into one apparently coherent answer.

## The agents a question can pass through

The default LangGraph route is explicit in [`graph.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/graph.ts):

```text
Planner
  → Research
    → Normalize Results
      → Writer
        → Deterministic Validation
          → Critic
            ├─ pass → Related
            ├─ retry available → Research
            └─ retry budget exhausted → Fallback → Related
```

Each stage owns a distinct decision:

1. **Planner** assigns intent, complexity, and language, then extracts search terms.
2. **Research** searches posts, docs, abstracts, or external sources and fills `search_results`.
3. **Normalize Results** aligns ranking scores, detects weak retrieval, and optionally reranks.
4. **Writer** drafts from a bounded evidence context.
5. **Validation** checks Markdown, citation URLs, and Mermaid structure.
6. **Critic** reviews relevance, intent alignment, drift, and unsupported claims.
7. **Related** runs another Vectorize query for up to three unused posts.

Planner can end the run when a question needs clarification or is off topic. Validation or Critic can send the graph back to Research. This diagram is a control-flow map, not a claim that every production request traverses every node.

## Answer, sources, and related reading are separate outputs

After the pipeline returns, the API calls [`shouldExposeRetrievedLinks`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts). Non-empty retrieval is only the first condition: Validation and Critic must also have no failure. The API then deduplicates accepted sources by `source_url` before sending them.

[`relatedPostsNode`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/related-posts.ts) uses the same quality gate, but queries Vectorize again with the original question. It excludes slugs already used by Research and returns at most three posts.

| UI section | Origin | What it establishes |
|---|---|---|
| Answer | Normalized `final_response` | The text the system ultimately accepted and emitted |
| Sources | Gated `search_results` | These URLs existed in the current retrieval state |
| Related reading | A separate Related query | Additional recommendations, not necessarily Writer context |

## Run the smallest useful checks

These tests need neither a production request nor model credentials:

```sh
pnpm exec vitest run \
  src/lib/conversation/pipeline.test.ts \
  src/lib/retrieval/presentation.test.ts \
  src/components/Chat/AgentSteps.test.ts
```

They verify that the shared facade emits only the accepted final answer, that the source gate follows its boolean contract, and that the UI distinguishes article count from evidence-chunk count. They do not verify current Cloudflare bindings, production D1 or Vectorize contents, or provider availability.

## Evidence boundary

This article describes the **implementation contract** visible in the repository and its tests. It does not claim that every feature flag is enabled in production, or that a shadow pipeline, local test, or available adapter currently affects public traffic.

The public SSE surface exposes answers, displayed sources, related items, and stage status. It does not expose the Writer's complete context, raw ranked chunks, or every Critic field. A `Research completed` event proves that a status event was emitted; it is not enough to reconstruct all evidence used in that run.

The next article moves upstream: how one Markdown post becomes searchable through both D1 FTS5 and Vectorize.

## References

- [Ask AI chat API](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts)
- [Conversation pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)
- [LangGraph pipeline](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/graph.ts)
- [ChatWidget SSE consumer](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/ChatWidget.tsx)
- [MessageList answer and link sections](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/MessageList.tsx)
- [Retrieved-link presentation gate](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts)
- [Related-posts node](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/related-posts.ts)
