---
title: "Three Fixes for One Setting: When top_k Lies Across Four Layers"
date: 2026-09-19
category: ai
type: debug
tags: [agent-tools, streaming, rag, debugging, observability, context-engineering]
lang: en
tldr: "A user set retrieval top_k to 15, but the monitoring dashboard showed 5 and the streaming UI flashed 5 before jumping to 15. The same top_k value existed at four layers — LLM tool arguments, runtime, trace DB, and streaming payload — each requiring its own override. Three sequential fixes, each revealing the next layer was also wrong."
description: "Full investigation of a RAG tool's top_k setting being inconsistent across four architectural layers in an AI assistant platform: from backend override to DB persistence to streaming flash."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-topk-override-four-layer-inconsistency)

## TL;DR

An AI assistant platform added a "full retrieval range" toggle so the reranker's complete results would be returned, bypassing the LLM's self-chosen low `top_k`. The backend worked — 15 chunks came back. But the monitoring dashboard showed `top_k: 5`, and the streaming UI flashed `5` before switching to `15`. Three fixes, targeting runtime, DB, and streaming respectively, were needed to align all four layers.

## Context

The platform's RAG tool (`retrieve_text_nodes`) lets the LLM decide its own `top_k` parameter — typically 3 to 5. The problem: a reranker sorts 12 candidate chunks, but the tool truncates results to the LLM's low `top_k` before returning. In 80% of calls, the LLM chose `top_k ≤ 5`, discarding 7–10 chunks the reranker had already ranked as relevant.

To fix this, the platform added a `use_full_retrieval_range` toggle. When enabled, admins could set a configured `top_k` (e.g. 15) that overrides the LLM's choice, returning the reranker's full output.

## The Problem

After deploying the toggle, internal testing revealed three symptoms:

1. **Monitoring dashboard**: tool call records showed `top_k: 5`, not the configured 15
2. **Streaming UI**: during a conversation, the tool call card briefly displayed `top_k: 5`, then jumped to `15`
3. **Actual retrieval results**: 15 chunks returned — backend logic was correct

The backend was right, but **every user-facing surface was lying**.

## Investigation

### Layer 1: Backend Runtime

Tracing the `retrieve_text_nodes` tool's `call()` method. The incoming `tool_kwargs['top_k']` was indeed 5 — the LLM's own choice, as expected. The override happened inside tool execution, but the trace span's `tool_kwargs` was recorded **before** execution started.

**Fix**: Added `_resolve_top_k()` at the top of `call()` / `acall()` to override `tool_kwargs['top_k']` with the configured value before execution begins. After completion, updated the trace span's `tool_kwargs`.

```python
def _resolve_top_k(self, kwargs: dict) -> dict:
    if self.chatbot.use_full_retrieval_range:
        kwargs['top_k'] = self.chatbot.configured_top_k
    return kwargs
```

After deployment, trace span values were correct. But the monitoring dashboard still showed `5`.

### Layer 2: DB Persistence

The trace span was fixed, but the monitoring dashboard didn't read from the trace span — it read from `ToolCallResult`, an object written to the database after tool completion. Inspecting the construction logic: it pulled tool input from the original `ToolUseContent.input`, which was built from the LLM's response **before** the tool ran.

In other words, `ToolCallResult` recorded the LLM's original arguments, not the overridden ones.

**Fix**: Added `_patch_tool_use_input()` at `ToolCallResult` construction time, overwriting the record with the actual execution parameters.

```python
def _patch_tool_use_input(self, result: ToolCallResult) -> None:
    if hasattr(self, '_effective_kwargs'):
        result.tool_use.input.update(self._effective_kwargs)
```

After deployment, dashboard numbers were correct. But the streaming UI still flashed.

### Layer 3: Streaming Payload

The streaming UI's tool call display came from SSE (Server-Sent Events). Tracing the event flow: when the LLM returned a `tool_use` content block, the system immediately constructed a `ToolUseContent` and pushed it to the frontend — this happened **before** the tool started executing. So the frontend received the LLM's original `top_k: 5` first, and only saw the correct `15` after the tool completed and the DB was updated.

The "flash" users saw was this timing gap:

```
t=0s    SSE: tool_use { input: { top_k: 5 } }     ← LLM's original value
t=0.3s  Tool starts, override top_k=15
t=1.2s  Tool completes, DB writes top_k=15
t=1.3s  SSE: tool_result { ... }                   ← Result has 15 chunks
```

**Fix**: In `_ahandle_tool_call`, override `event.tool_kwargs['top_k']` **before** constructing `ToolUseContent`, so the streaming payload carries the correct value from the start.

```python
async def _ahandle_tool_call(self, event):
    if self.chatbot.use_full_retrieval_range:
        event.tool_kwargs['top_k'] = self.chatbot.configured_top_k
    content = ToolUseContent(input=event.tool_kwargs, ...)
    # Push to SSE
```

## Root Cause

The same `top_k` value existed at four distinct layers:

```
┌─────────────────────────────────────────────┐
│ Layer 1: LLM Tool Call Arguments            │
│   LLM decides top_k=5                       │
├─────────────────────────────────────────────┤
│ Layer 2: Tool Runtime                       │
│   _resolve_top_k() override → 15  ✅ Correct │
├─────────────────────────────────────────────┤
│ Layer 3: Streaming Payload (SSE)            │
│   ToolUseContent.input → real-time display  │
│   Fix 3: override before construction       │
├─────────────────────────────────────────────┤
│ Layer 4: Trace DB (ToolCallResult)          │
│   Monitoring dashboard data source          │
│   Fix 2: _patch_tool_use_input()            │
└─────────────────────────────────────────────┘
```

Each layer has its own construction timing:
- **Runtime** (Layer 2): during tool execution — first to be fixed
- **Streaming** (Layer 3): constructed when LLM returns `tool_use` — earlier than runtime
- **DB** (Layer 4): written after tool completion — uses a snapshot from construction time

The root cause wasn't a logic error — it was a **structural timing issue**. In streaming architectures, data flows through multiple snapshot points, and each snapshot can capture the pre-override value.

## Lessons Learned

**In streaming architectures, fixing the backend is just step one.** The same value has separate snapshots in runtime, streaming payload, and DB record. The fix must intervene before each snapshot is constructed.

Three debugging principles:

1. **Trace snapshots, not values**: If a setting shows different values on different surfaces, the issue isn't the setting itself — it's when each surface took its snapshot
2. **Streaming precedes execution**: SSE events are pushed before the tool runs. Any runtime override comes too late. The override point must be before the streaming payload is constructed
3. **Dashboard ≠ trace**: Trace spans and DB records may pull from different sources. Fixing one doesn't fix the other

A parallel case from the same day: another fix discovered that retriever initialization failures were silently swallowed by a bare `except Exception`, causing ~10% of conversations to have no knowledge base tools at all — the agent would fabricate answers from memory, and users had no idea. Both bugs share the same theme: **admin settings look correct, but runtime behavior diverges**.

## References

- [Amazon Bedrock ConverseStream API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)
- [Server-Sent Events Specification (WHATWG)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [OpenTelemetry Tracing Specification — Span](https://opentelemetry.io/docs/specs/otel/trace/api/#span)
