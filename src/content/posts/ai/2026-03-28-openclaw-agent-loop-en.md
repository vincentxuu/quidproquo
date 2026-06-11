---
title: "OpenClaw Agent Loop: Execution Cycle, Streaming & Queue"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, agent-loop, streaming, queue, messages, debounce]
lang: en
tldr: "A single agent execution: receive message → assemble context → model inference → tool execution → stream response → persist. Each session runs serially, with 5 queue modes supported."
description: "The complete execution flow of the OpenClaw Agent Loop, streaming chunking mechanisms, message queue strategies, and concurrency control."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-agent-loop)

The Agent Loop is the core execution engine of OpenClaw — the complete flow from receiving a message to sending a reply. This post covers how it runs, how it streams, and how it handles multiple messages arriving simultaneously.

## Complete Execution Flow

```
Message arrives → Routing/binding → Session key → Queue (if active run exists)
    ↓
RPC entry: validate params, resolve session, return runId
    ↓
Agent command execution: resolve model config, load skills, call embedded runtime
    ↓
Embedded Runtime: serial execution (per-session queue), manage timeout, return usage
    ↓
Event Bridge: transform internal events → tool events + assistant deltas + lifecycle signals
    ↓
agent.wait: block until complete, return status and timing
```

### Timeout Behavior

- `agent.wait` defaults to 30 seconds
- The agent runtime's abort timer defaults to **48 hours**

## Message Processing

### Deduplication

A short-term cache (channel + account + peer + session + messageId) is maintained to prevent duplicate agent triggers after channel disconnection and reconnection.

### Debounce

Consecutive text messages from the same sender are batched into a single agent turn. Each channel has a different debounce duration:

| Channel | Default Debounce |
|---|---|
| WhatsApp | 5000 ms |
| Slack | 1500 ms |

Media and attachments are **not affected by debounce** and trigger immediately. Control commands are also exempt.

### Body Layers

| Layer | Purpose |
|---|---|
| Body | Complete prompt text (with optional history wrapper) |
| CommandBody | Raw text, used for command parsing |
| RawBody | Legacy alias for CommandBody |

Group messages prepend a sender label in the prompt.

## Streaming and Chunking

OpenClaw has two layers of streaming:

### Block Streaming (for channels)

Splits the assistant's output into text blocks, sent as regular channel messages (not token-by-token deltas).

```json5
{
  agents: {
    defaults: {
      blockStreamingDefault: "off",  // on | off
      blockStreamingBreak: "text_end",  // text_end | message_end
      blockStreamingChunk: {
        minChars: 800,
        maxChars: 1200,
        breakPreference: "paragraph"
      }
    }
  }
}
```

Split priority: paragraph break → newline → sentence → whitespace → character-level. **Never splits inside a code fence** — it respects fence closure and reopening.

Consecutive blocks merge during idle periods (`idleMs`), and `humanDelay` adds a natural pause after the first block (800–2500 ms).

### Preview Streaming (Telegram / Discord / Slack)

Updates a temporary preview message using edits and appends during generation.

Modes: `off`, `partial` (single replaceable preview), `block` (chunked updates), `progress` (status updates + final answer).

### Reasoning Visibility

`/reasoning on|off|stream` controls whether users can see the reasoning process. Even when turned off, reasoning tokens are still consumed.

## Queue

When new messages arrive while the agent is executing, a queue strategy is needed.

### Concurrency Control

- **Session lane** — serial execution per session, preventing race conditions
- **Global lane** — global concurrency limit (`maxConcurrent`), main lane defaults to 4, subagent lane defaults to 8
- Typing indicators trigger immediately, without waiting for the queue

### 5 Queue Modes

| Mode | Behavior |
|---|---|
| `steer` | Immediately inject into the current run (inserted directly during streaming) |
| `followup` | Wait for the next agent turn |
| `collect` (default) | Merge queued messages into a single followup |
| `steer-backlog` | Immediately steer + retain as followup |
| `interrupt` | Abort the current run, execute the latest message |

### Configuration

```json5
{
  messages: {
    queue: {
      debounceMs: 1000,  // followup turn delay
      cap: 20,            // max queued messages per session
      drop: "summarize"   // overflow handling: old | new | summarize
    }
  }
}
```

Switch within chat: `/queue steer` or `/queue collect --cap 10`.

## Reply Format

Reply formatting has a hierarchical prefix configuration: global → channel → account. Threaded replies are supported, with each channel having configurable threading modes.

## Hook System

Two interception points:

| Type | Available Hooks |
|---|---|
| **Gateway hooks** | `agent:bootstrap`, `/new`, `/reset`, and other lifecycle events |
| **Plugin hooks** | `before_model_resolve`, `before_prompt_build`, `before_tool_call`, message lifecycle |

## Overall

The Agent Loop's design focuses on **serial safety + streaming experience**. Each session runs serially internally to avoid conflicts, while multiple sessions can run in parallel. Streaming splits long replies into natural blocks delivered to chat apps, and the Queue handles the scenario of "new messages arriving while the AI is still thinking."

Understanding this flow is essential to knowing what debounce, queue mode, and streaming chunk settings actually control.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/concepts/agent-loop.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-loop.md) — Agent Loop execution cycle
- [docs/concepts/streaming.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/streaming.md) — Streaming and chunking
- [docs/concepts/messages.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/messages.md) — Message processing flow
- [docs/concepts/queue.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/queue.md) — Command Queue
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/typing-indicators.md) — Typing Indicators
- [docs/concepts/retry.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/retry.md) — Retry strategies
