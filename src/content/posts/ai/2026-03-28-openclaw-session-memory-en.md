---
title: "OpenClaw Sessions and Memory: One Rolling Conversation, Plus Four Files That Get Written to Disk"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, session, memory, compaction, main-session, incognito, dreaming]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 12
tldr: "By default every DM lands in one main session, and group activity and background work report back into it. Memory is entirely Markdown on disk — the model only remembers what gets saved, with no hidden state. But if more than one person can DM your agent, DM isolation is something you have to turn on."
description: "OpenClaw's session routing and memory layers: how the main session converges activity, the dmScope and groupScope matrices, the boundaries of incognito sessions, reset policies, the four memory files, dreaming distillation, and memory import."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-session-memory)

This layer answers two questions: **which conversation does an inbound message belong to**, and **what survives after the conversation ends**.

## The main session: one rolling conversation

OpenClaw is a **personal agent** first. Out of the box, every DM you send — Telegram, WhatsApp, iMessage, Slack DMs, the web app, anywhere — lands in **one rolling conversation**. Ask on your phone, follow up on your laptop, same context.

Underneath it is an ordinary session with the default key `agent:<id>:main`. What makes it special is that **the rest of the system treats it as the agent's root**:

- **Group activity flows in.** Group and room sessions stay isolated by default, but under the default DM scope the main session **watches them**. Activity queues as compact notices — **coalesced per conversation, never one wake-up per message** — which the agent sees on its next run (your next message, or a scheduled heartbeat)
- **Background work reports back.** Sub-agents and spawned sessions announce results to the session that started them
- **Heartbeats target the main session**, which is what gives it awareness when you have not written anything

## DM scope: isolation is mandatory with multiple people

By default all DMs share one session, which is fine for a single user. The warning upstream is blunt:

> If multiple people can message your agent, **enable DM isolation**. Without it, all users share the same conversation context, so Alice's private messages would be visible to Bob.

| `session.dmScope` | Behavior |
|---|---|
| `main` (default) | All DMs share the main session |
| `per-peer` | Isolate by sender, across channels |
| `per-channel-peer` | Isolate by channel + sender (**recommended**) |
| `per-account-channel-peer` | Isolate by account + channel + sender |

`openclaw security audit` recommends isolation when it detects multiple DM senders. Conversely, if the same person reaches you from several channels, `session.identityLinks` maps their identities to one canonical peer id so they share a session.

**Enabling isolation also turns off two things**: the main session's group watching, and cross-conversation memory recall (which then defaults off).

## Group scope and per-binding overrides

`session.groupScope` defaults to `per-group`. Setting `main` routes groups, rooms, and channels into the main conversation.

More useful is a **single-binding override** — letting just one team room join the rolling conversation:

```json5
{
  bindings: [{
    agentId: "main",
    match: { channel: "slack", peer: { kind: "channel", id: "C0123TEAM" } },
    session: { groupScope: "main" },
  }],
}
```

The binding override wins over the global value. Note that it **changes session-key selection only** — DM routing, mention gating, delivery context, and replies to the source room are unchanged.

## Incognito sessions

Added after March, and available only from the Control UI's **New thread** screen — turn on **Incognito** before starting the thread. Its session entry, transcript, and compaction state live **in process memory rather than on disk**, disappear when the Gateway restarts, skip the automatic memory flush, and create no transcript archive on reset or delete.

But the boundaries are stated clearly, and this part deserves quoting in full:

- **Incognito does not restrict the agent's normal tools.** An explicit request to save information, or any tool-driven file write, can still persist data outside the incognito store
- **Your configured model provider still processes the messages you send**
- Diagnostic logging is unchanged, and OpenClaw still records content-free audit metadata such as HMAC references
- On multi-user gateways, incognito threads are visible only to admin-scope connections — **this protects them from storage and other gateway-mediated users, not from the gateway owner or process operator**, who can always observe live sessions

In short: it means "not on disk," not "nobody can see it."

## Session lifecycle

**No automatic reset by default** — sessions keep the same `sessionId` while compaction manages the growing active context.

| Mode | Behavior |
|---|---|
| `none` (default) | No automatic reset |
| `daily` | A new session at a configured local hour (`atHour`, default 4) |
| `idle` | A new session after `idleMinutes` of inactivity |
| Manual | `/new` or `/reset` in chat (`/new <model>` also switches models) |

Two details that bite: **daily freshness is based on when the current `sessionId` started, not on later metadata writes**; and **idle freshness is based on the last real user or channel interaction — heartbeat, cron, and exec system events do not keep the session alive.** When both are configured, whichever expires first wins.

There is a thoughtful touch on reset: **queued system-event notices for the old session are discarded**, so stale background updates are not prepended to the new session's first prompt.

A reset assigns a new live session id but **the previous SQLite transcript stays searchable under the same main-session key**.

There is also a capacity rule: when an agent's physical database, WAL, and session artifacts exceed the disk budget (**default 10 GB**), OpenClaw extracts the oldest unreferenced history into **a verified compressed archive** before removing its rows. **Live, routed, and in-flight sessions are never budget victims.**

## Memory: four files, all Markdown

The docs put it plainly: **the model only remembers what gets saved to disk; there is no hidden state.**

| File | Role |
|---|---|
| `USER.md` (optional) | The compact **user-model layer**: stable preferences, communication style, relationships, active-project context, written as directives with observed-date and active/superseded metadata. Loaded at session start with its own small budget |
| `MEMORY.md` | Long-term memory: durable non-profile facts and decisions, loaded at session start. **Not a transcript, daily log, or exhaustive archive** |
| `memory/YYYY-MM-DD.md` | The working layer: detailed daily notes, observations, session summaries. **Indexed for `memory_search` and `memory_get`, but not injected into the bootstrap prompt every turn** |
| `DREAMS.md` (optional) | Dream Diary and dreaming sweep summaries for human review |

To make it remember something, just say so — "Remember that I prefer TypeScript" — and it writes the note to the right file.

**`USER.md` has one writing rule worth noting**: when a preference changes, **supersede it in place rather than appending a contradictory active directive.** That avoids the hard-to-debug state where old and new preferences are both live.

**Distillation is automatic**: useful material from daily notes is distilled into `MEMORY.md` by the default **dreaming** sweep. The default heartbeat prompt **performs no memory maintenance on its own**.

**When `MEMORY.md` outgrows its budget**, OpenClaw keeps the file on disk intact but **truncates the copy injected into context**. Treat that as a signal to move detail into `memory/*.md`, keep a durable summary in `MEMORY.md`, or raise the bootstrap limits. Use `/context list`, `/context detail`, or `openclaw doctor` to see raw vs. injected sizes and truncation status.

## Action-sensitive memories

An insightful section. Most memories are ordinary notes, but some affect what the agent **should do later** — and for those, capture **when it is safe to act**, not just the fact.

Capture that boundary when a note involves approval or permission requirements, temporary constraints, handoffs to another session or person, expiry conditions, safe-to-act timing, source authority, or instructions to avoid a tempting action.

A good one makes clear **what changes future behavior, under what condition it applies, when it expires or what unlocks action, what to avoid, and who the source is.**

The upstream example:

```md
The API migration is being designed in another session. Future turns should
not edit the API implementation from this thread; use findings here only as
design input until the migration plan lands.
```

With a line you must keep: **memory can preserve approval context, but it does not enforce policy.** Hard operational controls come from approval settings, sandboxing, and scheduled tasks.

## Memory tools and engines

Three tools: `memory_search` (semantic search that works even when wording differs), `memory_get` (a specific file or line range), and `intent` (create, list, or explicitly cancel **event-conditioned standing intents**; time-based reminders still use scheduled tasks).

**Memory engines are now swappable plugins**: the default `memory-core` is SQLite-based with keyword, vector, and hybrid search and no extra dependencies. There are also an AI-native cross-session engine with user modeling and multi-agent awareness, and a LanceDB-backed option.

With an embedding provider configured, search is **hybrid** (vector similarity plus keyword matching for exact terms like IDs and code symbols). OpenAI embeddings are the default; `memory.search.provider` can select Gemini, Voyage, Mistral, Bedrock, DeepInfra, local GGUF, Ollama, LM Studio, and more.

## Importing memory from other coding assistants

The Control UI's **Settings → Import Memory** imports local memory from Codex, Claude Code, and Hermes.

It **copies only Markdown memory** — from Codex, the consolidated `MEMORY.md` and `memory_summary.md` under `~/.codex/memories` (**raw rollout and transcript files are not imported**); from Claude Code, Markdown in each project's auto-memory directory (**project instructions, sessions, settings, and credentials are excluded**); from Hermes, `MEMORY.md` and `USER.md` from the detected home.

Imported files stay **separate under `memory/imports/<source>/`**, indexed for search but **not merged into the agent's bootstrap `MEMORY.md`**, and the source files are left unchanged.

## The big picture

The philosophy here is **explicitness**: memory is Markdown you can read and edit, session convergence is written in config, and even incognito states what it does and does not protect.

But explicit is not the same as a safe default. The one decision to make deliberately is this: **if more than one person can DM this agent, `session.dmScope` must change.** The default is built for a single user, and its failure mode is showing one person's private messages to another.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **how the main session converges activity** (coalesced group notices, background work reporting back, heartbeats targeting it), the four `dmScope` modes and the fact that isolation also disables group watching and cross-conversation recall, per-binding `groupScope` overrides, **incognito sessions** with their explicit boundaries (tools unrestricted, the provider still processes messages, no protection from the gateway owner), reset freshness rules (system events do not extend idle timers) and discarded stale notices, and the **10 GB disk budget with verified compressed archiving**. On memory: the `USER.md` and `DREAMS.md` files, the supersede-in-place rule, **dreaming handling distillation while heartbeat does no memory maintenance**, truncation of the injected `MEMORY.md` copy, **action-sensitive memories** and the line that memory does not enforce policy, the `intent` tool, plugin-based memory engines with hybrid search providers, and the scope and isolation of memory imports from Codex, Claude Code, and Hermes.

## References

This article draws on the following official OpenClaw documentation:

- [Session management](https://docs.openclaw.ai/concepts/session) — routing, scopes, incognito, resets
- [The main session](https://docs.openclaw.ai/concepts/main-session) — convergence and the disk budget
- [Memory overview](https://docs.openclaw.ai/concepts/memory) — the four files, tools, engines, imports
- [Dreaming](https://docs.openclaw.ai/concepts/dreaming) — the background distillation sweep
- [Memory search](https://docs.openclaw.ai/concepts/memory-search) — hybrid search and provider setup
