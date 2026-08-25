---
title: "Learning Agent Design from Mature Coding Agents (2): The Shape of the Agent Loop — Event Streams, Checkpoints, Resume"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 2
tags: [coding-agent, agent-loop, rivumi, session-persistence, claude-code]
lang: en
tldr: "pi's loop is a double while-loop wrapped in an EventStream; claude-code's source openly says stop_reason is unreliable and uses tool_use blocks observed during streaming as the sole continue signal; codex models a turn as a cancellable SessionTask and records sessions with a dedicated rollout crate. rivumi chose an ordering — manifest first, JSONL second — that turns Ctrl-C into verified resumption instead of a rerun. All evidence cited at file#symbol level."
description: "Comparing pi, claude-code, and codex source code across four design axes of the agent loop: event stream shape, tool-call iteration and termination, cancellation semantics, and checkpoint/resume — plus what rivumi does differently and what still needs improving."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-agent-loop-shapes)

The [series overview](/posts/ai/2026-08-25-coding-agent-design-series-overview-en) set the rules: five sections per post, evidence at file#symbol level. The first real topic is the foundation — the agent loop.

Scope disclosure first: this post deep-dives three projects — **pi** (badlogic/pi-mono), **claude-code** (community-decompiled v2.1.88; symbol names may differ from the original), and **codex** (openai/codex Rust workspace). omp is a fork of pi with a same-shaped loop core, so I didn't re-verify it; I did not examine opencode file-by-file this round and am saying so explicitly. Every citation below was grepped in my local clones.

## The design problem: what a loop actually has to handle

"Call the LLM, run tools, repeat" is twenty lines of while-loop. The hard parts live next to it:

1. **Streaming**: model output arrives token by token; the UI wants to render as it goes, but tool-call arguments are only complete once the stream ends.
2. **Tool-call iteration**: the model returns a batch of tool_use blocks; you execute them, feed results back, and ask again. When does it end? Is stop_reason trustworthy? Should you execute tool calls from a response truncated by the token limit?
3. **Cancellation**: at the instant the user hits Ctrl-C, half a batch of tool_use may lack matching tool_result blocks — sending such history back to the provider gets rejected.
4. **Resume**: the process dies at step 37; replaying from scratch is too expensive. But resume isn't just reloading a log — you must be able to prove no side effect was mid-flight when it died.

The [ReAct](https://arxiv.org/abs/2210.03629) paper's interleaved reasoning-and-acting pattern is the academic prototype of this loop, but the paper's loop never has to handle Ctrl-C or a power cut. All the engineering difficulty is in those four items.

## How the reference projects do it

### pi: the minimal loop as a textbook

The entire core is `pi-mono/packages/agent/src/agent-loop.ts#agentLoop`, one function returning `EventStream<AgentEvent, AgentMessage[]>`. Inside, `runLoop` is a double while-loop: the inner one runs "stream a response → collect toolCalls → execute → append results", the outer handles queued follow-up messages. The event stream is a fixed discriminated union (`types.ts#AgentEvent`): `agent_start`, `turn_start`, `message_start/update/end`, `tool_execution_start/update/end`, `turn_end`, `agent_end`.

Details worth stealing:

- **Finish-reason defense**: when `streamAssistantResponse` sees `stopReason === "length"`, it executes nothing and routes every tool call through `failToolCallsFromTruncatedMessage` instead — streamed tool-call arguments go through a best-effort JSON salvage parser, so truncated arguments that "look valid" are the most dangerous case.
- **Cancellation is not an exception path**: an `AbortSignal` threads through every tool; the sequential execution loop checks `signal.aborted` between calls and breaks, keeping completed results in the transcript.
- **A dedicated retry entry point**: `agentLoopContinue` adds no new message and only requires the last context message to be user or toolResult — built for retrying a failed turn.

### claude-code: a state machine that distrusts stop_reason

`src/query.ts#query` is an async generator yielding stream events and Messages, returning a `Terminal` (with `reason: 'aborted_streaming' | 'model_error' | ...`). The body, `queryLoop`, maintains a `State` object whose `transition: Continue | undefined` field records why the previous iteration continued — an explicit state-machine transition log.

Two comments in this file are, to me, the most important in the whole codebase:

- Near line 554, it states outright: `stop_reason === 'tool_use'` is unreliable and not always set correctly; the real continue signal is **whether any tool_use block actually arrived during streaming** (the `toolUseBlocks` array). A production-grade lesson: protocol fields and reality diverge.
- On abort it calls `yieldMissingToolResultBlocks`, synthesizing an `is_error: true` tool_result for every unmatched tool_use. Without this, interrupted history goes back to the API containing orphaned tool_use blocks and fails outright.

It also caps max_output_tokens recovery attempts (`MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3`) — even automatic retries need an endpoint.

### codex: turns as tasks, recording as infrastructure

The Rust side separates concerns more cleanly. `codex-rs/core/src/tasks/regular.rs#RegularTask::run` emits a `TurnStarted` event, then loops calling `run_turn` until the `input_queue` has no pending input — text typed mid-turn becomes the next turn's input rather than an interruption. The actual sampling loop lives in `codex-rs/core/src/session/turn.rs#run_turn`: pre-sampling compact, hooks, `capture_step_context`, then the request, all carrying a `CancellationToken` so cancellation takes effect at every await point.

Persistence is its own crate, `codex-rs/rollout`: `recorder.rs#RolloutRecorder` records sessions as JSONL, with `RolloutRecorder::resume` rebuilding directly from a file; `reverse_jsonl_scanner.rs#ReverseJsonlScanner` is a read-only scanner starting from the tail that can freeze a "prefix up to this byte offset" — resume only needs the tail, never the full history. This is append-only-log-as-source-of-truth taken all the way.

## rivumi's choice: write ordering is crash semantics

rivumi's main loop lives in `src/rivumi/loop.py#AgentRunner.run`, plainer in shape than all three above: a single while-loop that checks the cancel flag and remaining wall-time at each step boundary, executing tool calls one by one. No parallel tool execution, no mid-turn steering — M1's scope demanded provable correctness first.

Persistence is where I diverged from all three. Every `_event` call (`loop.py#_event`) does two things in fixed order:

1. Write the **complete resumable state** (messages, usage, step, repeated-action fingerprint, event sequence) into the `session.json` manifest;
2. Only then append the JSONL record to `events.jsonl`.

This ordering creates exactly one known crash window — the manifest one sequence ahead of the JSONL — and `src/rivumi/session.py#SessionStore.claim_and_validate_resume` repairs precisely that (rewinding the manifest by one) while refusing everything else. In particular, if the last durable event is `tool.started` or `verification.started`, resume fails closed: you cannot prove whether that side effect completed, and guessing beats refusing only in fiction. The workspace is validated too: the Git root must exist and HEAD must equal the pinned base_sha, otherwise you'd be continuing on the wrong code.

The checkpoint itself is `checkpoint.json`, written by `loop.py#_checkpoint` via `events.py#atomic_write_json` (temp file + rename + directory fsync). `loop.py#AgentRunner.resume` is strict hydration: provider/model/protocol must match, the event sequence must be contiguous — and it conservatively sets `_made_changes` back to True, because the workspace may hold unfinished modifications and the final verification gate must stay armed. If an approval was hanging when the process died, `_reconcile_interrupted_approval` records it as a failed `ToolObservation` plus an `approval.abandoned` event so the model can request it again, rather than silently honoring a stale approval.

Where this diverges furthest from an idealized ReAct-style loop is exactly in these "things papers don't write down": [Anthropic's engineering report Building effective agents](https://www.anthropic.com/research/building-effective-agents) says it plainly — agent reliability comes from harness engineering, not prompts. My verification gate follows the same principle: even if the model already ran the tests itself, the harness reruns every declared check before declaring success, feeding failure output back as untrusted text.

## What could still improve

1. **No streaming**. pi's `message_update` events and codex's per-item streaming UI both rest on streaming; rivumi currently waits for the whole response before persisting, which hurts interactivity and forfeits detect-tool-calls-as-they-stream.
2. **Checkpoint cost is O(entire history)**. Every event rewrites the whole manifest; long sessions will slow down. Codex's rollout approach — append-only JSONL plus a reverse scanner reading only the tail — is a ready-made upgrade path.
3. **No parallel tools**. pi supports parallel batches in `executeToolCalls` (unless a tool declares sequential); read-only tools would benefit immediately.
4. **Coarse cancellation**. rivumi's cancel only takes effect at step boundaries; a running tool is bounded only by timeout. AbortSignal-style immediate propagation is worth adding.

Next post in the series: workspace isolation and path policy — the other safety line outside the loop.

## References

- [badlogic/pi-mono — packages/agent](https://github.com/badlogic/pi-mono/tree/main/packages/agent) — minimal agent loop and event stream
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — official repo (ships minified bundle; citations here come from community decompiled v2.1.88)
- [openai/codex — codex-rs/core](https://github.com/openai/codex/tree/main/codex-rs/core) and [codex-rs/rollout](https://github.com/openai/codex/tree/main/codex-rs/rollout) — task-based turns and session recording
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — the prototype interleaved loop
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's agent engineering principles
