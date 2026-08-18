---
title: "The OpenClaw Agent Loop: Serialization, Writer Claims, and the Fence That Stops a Stale Turn From Committing"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, agent-loop, streaming, queue, hooks, concurrency]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 11
tldr: "The agent loop is a serialized per-session run. The part worth studying is how it handles concurrency: an admitted run records an activeWriterRunId claim, every transcript write supplies expectedWriterRunId, and the commit transaction verifies the match — so a superseded run cannot commit stale data."
description: "The full lifecycle of the OpenClaw agent loop: the five-step run sequence, per-session and global queues, the writer-claim fence, the split between internal and plugin hooks with their terminal semantics, streaming, and agent.wait."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-agent-loop)

The agent loop is a **serialized, per-session run** that turns a message into actions and a reply: intake, context assembly, model inference, tool execution, streaming, persistence.

There are two entry points: the Gateway RPCs `agent` and `agent.wait`, and the CLI's `openclaw agent`.

## The run sequence

1. **The `agent` RPC** validates params, resolves the session (`sessionKey`/`sessionId`), persists session metadata, and **returns `{ runId, acceptedAt }` immediately**
2. **`agentCommand`** runs the turn: resolves model and thinking/verbose/trace defaults, loads the skills snapshot, calls `runEmbeddedAgent`, and **emits a fallback lifecycle end/error** if the embedded loop did not
3. **`runEmbeddedAgent`**: serializes runs through per-session and global queues, resolves model and auth profile, builds the session, subscribes to runtime events, streams assistant and tool deltas, **enforces the run timeout (aborting on expiry)**, and returns payloads plus usage metadata
4. **`subscribeEmbeddedAgentSession`** bridges runtime events to the `agent` stream: tool events to `stream: "tool"`, assistant deltas to `stream: "assistant"`, lifecycle to `stream: "lifecycle"` (`phase: "start" | "end" | "error"`)
5. **`agent.wait`** waits for lifecycle end/error on a `runId` and returns `{ status: ok|error|timeout, startedAt, endedAt, error? }`

The immediate return in step 1 is the key design: **acceptance and completion are separate**, so the caller gets a `runId` first and decides afterward whether to wait.

Step 3 also carries a Codex-specific guard: **an accepted Codex app-server turn that stops producing progress before a terminal event is aborted** rather than hanging.

## Serialization and concurrency

Runs are **serialized per session key** (the session lane), optionally through a global lane as well, preventing tool and session races. Messaging channels pick a queue mode (steer/followup/collect/interrupt) that feeds this lane system.

### Writer claims: the part worth studying

The problem: a session may still have an older run in flight while a newer run has superseded it. If the old run writes its results into the transcript, it clobbers the newer state.

OpenClaw's answer:

- Before streaming, an admitted run records a **durable `activeWriterRunId` claim**
- **Every transcript append or rewrite supplies `expectedWriterRunId`**
- **The synchronous commit transaction verifies it still matches the active claim**

The result: **a superseded run cannot commit stale transcript data.** Later rewrites, compaction, and truncation use the same in-transaction fence.

Two more layers sit outside it: the **SQLite writer queue** orders per-agent mutations, and the **Gateway state-directory lock** prevents another Gateway or `openclaw agent --local` process from owning the same state directory concurrently.

This is a textbook distributed-systems technique (a fencing token) applied to single-host agent execution. It is worth remembering because **any agent that allows interruption and supersession will need it.** Cancelling the old run is not enough — cancellation is asynchronous, and the write may already be in flight.

## Preparation

- The workspace is resolved and created; **sandboxed runs may redirect to a sandbox workspace root**
- Skills are loaded (or reused from a snapshot) and injected into env and prompt
- Bootstrap and context files are resolved and injected into the system prompt
- **The transcript target and writer claim are prepared before streaming starts**

The system prompt is built from OpenClaw's base prompt, the skills prompt, bootstrap context, and per-run overrides, with model-specific limits and compaction reserve tokens enforced.

## Two hook systems

An easy source of confusion, cleanly separated upstream:

**Internal hooks (Gateway hooks)** — event-driven scripts for commands and lifecycle events:

- **`agent:bootstrap`**: runs while building bootstrap files, before the system prompt is finalized — use it to add or remove bootstrap context files
- **Command hooks**: `/new`, `/reset`, `/stop`, and others

**Plugin hooks** — these run **inside** the agent loop or gateway pipeline:

| Hook | When |
|---|---|
| `before_model_resolve` | Pre-session (no `messages`), to deterministically override provider/model |
| `before_prompt_build` | After session load (with `messages`), to inject `prependContext`, `systemPrompt`, `prependSystemContext`, or `appendSystemContext` — or narrow the submitted tool surface with `toolsAllow` on supported runtimes |
| `before_agent_reply` | After inline actions, before the LLM call. **Lets a plugin claim the turn** and return a synthetic reply or silence it entirely |
| `agent_end` | After completion, with the final message list and run metadata |
| `before_compaction` / `after_compaction` | Observe or annotate compaction cycles |
| `before_tool_call` / `after_tool_call` | Intercept tool params and results |
| `tool_result_persist` | **Synchronously** transforms tool results before they are written to a transcript |
| `message_received` / `message_sending` / `message_sent` | Inbound and outbound messages |
| `session_start` / `session_end`, `gateway_start` / `gateway_stop` | Lifecycle boundaries |

One `toolsAllow` detail deserves attention: **an empty `toolsAllow` submits no optional tools, an omitted one leaves the host-resolved surface unchanged, and unsupported runtimes reject restrictive values rather than ignoring them.** "Reject if unsupported" is far safer than "ignore if unsupported" — the latter leaves you believing the tool surface was narrowed when it was not.

### Terminal semantics

The decision rules for guard hooks matter, because they determine who wins among multiple handlers:

- **`before_tool_call`**: `{ block: true }` is **terminal** and stops lower-priority handlers. `{ block: false }` is a no-op and **does not clear a prior block**
- **`message_sending`**: `{ cancel: true }` is likewise terminal; `{ cancel: false }` is a no-op that does not clear a prior cancel

In other words: **a block is one-directional — nobody can un-block someone else's block.** That is the shape a guardrail should have.

There is also a division-of-labor note: **operator-owned install allow/warn/block decisions belong in `security.installPolicy`, not `before_install`**, because only the former covers CLI install and update paths.

## Protocol invariants

Beyond the loop itself, the Gateway's WebSocket protocol has a few hard rules worth knowing:

- **The first frame must be `connect`** — any non-JSON or non-connect first frame is a hard close
- Side-effecting methods (`send`, `agent`) **require idempotency keys** for safe retries, with a short-lived server dedupe cache
- **Events are not replayed** — clients must refresh on gaps
- Exactly one Gateway controls a single Baileys session per host

## The big picture

The loop's design axis is **serialization plus provable write ordering**: one lane per session, acceptance separated from completion, writes carrying a fencing token, and hook blocks that are terminal in one direction only.

Individually these look unremarkable. Together they answer one question — **when the user says something else while the agent is still running, whose result counts?** OpenClaw's answer: the most recently admitted one, and the older one cannot even write.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: the full five-step run sequence and the "accept and return `runId` immediately" separation, the abort guard for Codex app-server turns that stop producing progress, **the writer-claim fence** (`activeWriterRunId` / `expectedWriterRunId` verified in-transaction) plus the SQLite writer queue and Gateway state-directory lock, **the split between internal and plugin hooks with the full hook table**, the `toolsAllow` behavior of rejecting rather than ignoring on unsupported runtimes, the terminal semantics of block and cancel, the `security.installPolicy` versus `before_install` division, and the protocol invariants (connect-first, idempotency keys for side-effecting methods, no event replay).

## References

This article draws on the following official OpenClaw documentation:

- [Agent loop](https://docs.openclaw.ai/concepts/agent-loop) — run sequence, queues, writer claims, hooks
- [Command queue](https://docs.openclaw.ai/concepts/queue) — queue modes and concurrency
- [Plugin hooks](https://docs.openclaw.ai/plugins/hooks) — the hook API and registration
- [Hooks](https://docs.openclaw.ai/automation/hooks) — internal Gateway hook setup
- [Gateway architecture](https://docs.openclaw.ai/concepts/architecture) — protocol and invariants
