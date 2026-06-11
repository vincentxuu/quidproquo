---
title: "OpenClaw Session, Memory, and Compaction"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, session, memory, compaction, context-engine, pruning]
lang: en
tldr: "OpenClaw sessions support 4 DM isolation levels, Memory is stored as Markdown files, and Compaction automatically summarizes and compresses when context is nearly full."
description: "OpenClaw's Session management, DM Scope isolation, Memory mechanism, Context Window Compaction, and Session Pruning."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-session-memory)

An agent needs to remember conversations, know who it is talking to, and make trade-offs when the context window is nearly full. This post covers OpenClaw's Session management, Memory mechanism, and Compaction compression strategy.

## Session Management

### Basic Architecture

Sessions are owned by the Gateway (not the client). The UI must query the Gateway to list sessions -- it cannot read local files on its own.

Storage location: `~/.openclaw/agents/<agentId>/sessions/sessions.json`. Transcripts are in JSONL format, using a tree structure (id/parentId linking).

### Session Key Format

| Type | Key Format |
|---|---|
| Direct chat | `agent:<agentId>:direct:<peerId>` or `main` |
| Group | `agent:<agentId>:<channel>:group:<id>` |
| Cron | `cron:<jobId>` |
| Hook | `hook:<uuid>` |
| Node | `node-<nodeId>` |

### DM Scope (Isolation Level)

`session.dmScope` controls how direct messages are grouped:

| Mode | Behavior | Best For |
|---|---|---|
| `main` (default) | All DMs share one session | Personal use, cross-device continuity |
| `per-peer` | Isolated by sender | Multi-user access |
| `per-channel-peer` | Isolated by channel + sender | Multi-user inbox |
| `per-account-channel-peer` | Isolated by account + channel + sender | Multi-account setup |

**Security Warning:** If your agent receives DMs from multiple people, **do not use the default `main`**. Otherwise all users share the same conversation context, which leaks private information.

### Identity Links

Use `session.identityLinks` to map the same person across different platforms to a single identity:

```json5
{
  session: {
    identityLinks: {
      "whatsapp:+15551234567": "alice",
      "telegram:alice_t": "alice"
    }
  }
}
```

This way, when Alice sends messages from WhatsApp or Telegram, they share the same DM session.

### Session Lifecycle

- **Daily reset** -- Default at 4:00 AM (local Gateway timezone)
- **Idle reset** -- Optional sliding window; whichever expires first between this and daily reset wins
- **Manual trigger** -- `/new` (new session) and `/reset` (reset)
- **Cron job** -- Each execution creates a new session ID

### Maintenance Configuration

```json5
{
  session: {
    maintenance: {
      mode: "warn",       // warn (report only) | enforce (auto-cleanup)
      pruneAfterDays: 30,
      maxEntries: 500,
      rotationThresholdMb: 10
    }
  }
}
```

`enforce` is recommended for production environments.

```bash
# Preview cleanup
openclaw sessions cleanup --dry-run
```

### Session Tools

Agents can interact across sessions (disabled by default; requires policy configuration):

| Tool | Purpose |
|---|---|
| `sessions_list` | List available sessions |
| `sessions_history` | Retrieve transcript |
| `sessions_send` | Send message to another session |
| `sessions_spawn` | Create an isolated child session |

In sandbox environments, the agent can only see the current session and its spawned child sessions.

## Memory

OpenClaw's Memory consists of **plain Markdown files** stored in the Workspace. The model only retains what is written to disk -- it does not rely on RAM.

### Two-Layer Structure

**Daily memory** -- `memory/YYYY-MM-DD.md`, append-only. On session startup, today's and yesterday's files are loaded.

**Long-term memory** -- `MEMORY.md` (optional), stores persistent decisions and preferences. Only loaded in private sessions (not in group context).

### What Goes Where

| Store in `MEMORY.md` | Store in `memory/YYYY-MM-DD.md` |
|---|---|
| Persistent decisions | Daily notes |
| User preferences | Today's context |
| Long-term facts | Running logs |

### Memory Tools

| Tool | Function |
|---|---|
| `memory_search` | Semantic search across all memory snippets |
| `memory_get` | Retrieve a specific file/line range (returns empty string if file does not exist, no error) |

### Automatic Memory Flush

Before compaction, OpenClaw triggers a **silent agentic turn** that lets the model write important memories to disk.

Trigger condition: token estimate approaches `contextWindow - reserveTokensFloor - softThresholdTokens`.

Configured under `agents.defaults.compaction.memoryFlush`. Skipped when the Workspace is read-only.

### Vector Search

Supports hybrid search: BM25 keyword + vector similarity. Multiple embedding providers are available (OpenAI, Gemini, Voyage, Mistral, Ollama).

## Compaction

The context window has a limit. When a conversation grows too long, OpenClaw summarizes old messages into a single compact summary entry.

### Compaction vs. Pruning

| | Compaction | Pruning |
|---|---|---|
| What it does | Creates a summary, writes to session JSONL | Temporarily removes old tool results |
| Persisted | Yes | No, in-memory only, per-request |
| Trigger | Context approaching limit | Cache TTL expired |

### Auto vs. Manual

**Auto-compaction:** Triggers automatically when context is nearly full. The user sees `🧹 Auto-compaction complete`.

**Manual:** `/compact` or `/compact Focus on decisions and open questions` (with instructions).

### Configuration

```json5
{
  agents: {
    defaults: {
      compaction: {
        model: "openrouter/anthropic/claude-sonnet-4-6",  // Can use a different model for summarization
        identifierPolicy: "strict",  // strict | off | custom
        memoryFlush: { /* ... */ }
      }
    }
  }
}
```

Using a different model for summarization is particularly useful -- when the primary model is a local small model, you can use a more powerful cloud model for summaries.

### OpenAI Server-Side Compaction

If you are using OpenAI with both `store` and `context_management` enabled, OpenAI's server-side compaction runs in parallel with OpenClaw's local compaction.

## Session Pruning

Pruning is a lightweight alternative to compaction -- it temporarily trims old tool results before an LLM call without modifying the session file.

### Trigger Condition

`mode: "cache-ttl"` + the last Anthropic API call exceeds the TTL duration.

### Effect

Only `toolResult` messages are pruned; all user and assistant messages are preserved.

Two strategies:
- **Soft-trim** -- Keeps the beginning and end, inserts ellipsis in the middle
- **Hard-clear** -- Replaces the entire tool result with a placeholder

Protected content: image blocks + the most recent 3 assistant messages (configurable).

### Why It Matters

Prompt caching has a TTL. After a session sits idle beyond the TTL, the next request re-caches the entire prompt. Pruning old tool output first can significantly reduce `cacheWrite` tokens.

```json5
{
  contextPruning: {
    mode: "cache-ttl",
    ttl: "5m"  // default
  }
}
```

## Context Engine

The Context Engine is a pluggable component that controls how OpenClaw assembles model context.

Four lifecycle hooks:

| Hook | What It Does |
|---|---|
| Ingest | Processes new messages, stores them in a custom data store |
| Assemble | Assembles an ordered message set within the token budget |
| Compact | Summarizes old history |
| After Turn | Persists state, background compaction |

The built-in `legacy` engine preserves the original behavior. Plugin developers can build custom engines (e.g., DAG summary, vector retrieval) and enable them via `plugins.slots.contextEngine`.

`ownsCompaction: true` means the engine fully manages compaction; when `false`, Pi's auto-compaction runs in parallel with the engine.

## Putting It All Together

Session, Memory, and Compaction are tightly interconnected:

1. **Session** defines conversation boundaries (who is talking to whom in which session)
2. **Memory** provides persistent recall across sessions (Markdown written to disk)
3. **Compaction** handles context pressure within a session (summarizing old conversations)

Configure DM Scope properly to ensure isolation, enable Memory Flush to prevent important information from being lost during compaction, and combine with Pruning to optimize token costs.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/concepts/session.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session.md) -- Session Management
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session-tool.md) -- Session Tools
- [docs/concepts/session-pruning.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session-pruning.md) -- Session Pruning
- [docs/concepts/memory.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory.md) -- Memory Mechanism
- [docs/concepts/compaction.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/compaction.md) -- Compaction
- [docs/concepts/context.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/context.md) -- Context Concepts
- [docs/concepts/context-engine.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/context-engine.md) -- Context Engine
- [docs/reference/session-management-compaction.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/session-management-compaction.md) -- Session Management and Compaction Reference
- [docs/reference/memory-config.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/memory-config.md) -- Memory Configuration Reference
