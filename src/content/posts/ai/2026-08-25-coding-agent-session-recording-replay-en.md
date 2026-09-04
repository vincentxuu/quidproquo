---
title: "Learning Design from Mature Coding Agents (33): Session Recording and Replay — From Event Logs to Safe Forks"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 33
tags: [coding-agent, session-replay, observability, looplane, codex, trace]
lang: en
tldr: "looplane now connects events.jsonl to a deterministic reducer, CLI timeline, canonical JSON, SDK replay, and safe event-point forks. Forking never replays prior tools or model calls; provider/live-runtime validation, redaction, and richer replay hooks remain open."
description: "Comparing session recording and replay across mature coding agents, including looplane's implemented deterministic replay, CLI, SDK, and safe-fork baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-session-recording-replay)

Part two of the series, entry 33. The previous post covered compaction; this one tackles something that looks "already done": session recording.

Scope note: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), claude-code (community-decompiled v2.1.88). Every reference below was grepped by hand in local clones.

## The capability gap: all the footage, no projector

looplane began with only the recording side: every run directory had `events.jsonl`, and conversations kept their own event streams. It can now fold events into replay state, print a timeline, and create a safe fork from a chosen sequence. The question has moved down a layer: which state can the reducer restore, how does it reject malformed logs, and how can a fork avoid repeating side effects?

Recording and replay are different capabilities. Recording tests write-side discipline (no dropped events, no slowing the main flow); replay tests **interpretation-side engineering**: who folds raw events back into an inspectable state? Which steps can be re-executed and which absolutely must not? The five projects each have designs worth stealing on both ends.

## How the five do it

### codex: observe first, interpret later

The README of `codex-rs/rollout-trace` states the key design choice up front: "observe first, interpret later." The hot path doesn't build a graph while running; it only writes ordered raw events through `codex-rs/rollout-trace/src/writer.rs#TraceWriter` into a bundle — `manifest.json`, a `trace.jsonl` event spine, and `payloads/*.json` for bulky raw evidence (full requests/responses, terminal output). Large payloads hit disk first and events keep references, so the spine stays light.

The real replay happens offline: `codex-rs/rollout-trace/src/reducer/mod.rs#replay_bundle` is a **deterministic reducer** that folds the bundle into `state.json` — not a transcript but a graph: model-visible conversation, inference_calls, tool_calls, terminals, plus `interaction_edges` (which request produced which tool call, which cell issued a nested call). The reduced cache lives next to the bundle (`bundle.rs#REDUCED_STATE_FILE_NAME`) so it isn't recomputed every time.

Three pieces of discipline worth copying wholesale: first, the whole path is opt-in via the `CODEX_ROLLOUT_TRACE_ROOT` env var, explicitly documented as not telemetry and never uploaded; second, trace writes are best-effort — "diagnostic recording must never fail the session"; third, disabled contexts accept the same calls and record nothing, so the hot path needs no branching.

On the resume side, the [session persistence post](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery-en) already covered the rollout file format; here I'll add just the execution side: `codex-rs/thread-store/src/store.rs#ThreadStore` collapses persistence into one storage-neutral trait — `resume_thread` reopens the live writer, `persist_thread` carries two durability levels via `PersistContext::Standard | TurnStart`, fork/revert both mean "same thread id, new immutable rollout file," and `ReadThreadByRolloutPathParams` can even open a thread straight from a rollout path. Recording format and access interface are one contract.

### omp: traces into a database, reports handed to models

omp's `packages/metaharness` turns "experiment → run → trace" into a unified model: a SQLite store (`src/store.ts#RunStore`) under REST/SSE APIs and a dashboard, where every benchmark adapter normalizes to the same trace shape; `GET /api/runs/:name/traces/:trace?raw=1` switches between the normalized view and native evidence.

More interesting is `scripts/trace-report.ts`: feed one trace through two cheap OpenRouter models in a map/reduce and get a narrative markdown report. In other words, the consumer of a replay isn't just humans — it can be another model. "Why did this run fail?" becomes one command.

### opencode: three portable ideas from a testing tool

http-recorder itself is a testing tool (the testing post covered its cassette format), but three of its ideas apply directly to production diagnosis:

- **Automatic mode selection**: `recorder.ts#resolveAutoMode` — always replay in CI; locally, replay if a cassette exists, record otherwise. One codebase, mode decided by environment.
- **Redact before persisting**: `cassette.ts#UnsafeCassetteError` refuses to write when likely secrets are detected. Recordings eventually get shared, so redaction must happen at write time.
- **Diff on mismatch**: `matching.ts#requestDiff` prints expected-vs-received differences when replay fails, instead of just saying "mismatch."

### pi: replay safety as a first-class concern

pi requires every tool to declare a re-execution policy: `pi-mono/packages/agent/src/harness/agent-harness.ts#HarnessTool` carries `replay?: "never" | "safe"` — read-only tools mark safe, side-effecting tools mark never. The declaration flows into telemetry (`telemetry.ts`, the `pi.tool.replay` attribute). This answers replay's most commonly dodged question: **can tools be re-executed during replay?** Without such markers you either never dare re-run anything (replay degrades into reading) or always dare (duplicate side effects).

### claude-code: event replay for SDK consumers

A small but concrete case: in SDK mode, the `--replay-user-messages` flag re-emits user messages received on stdin back to stdout (`main.tsx#effectiveReplayUserMessages`), letting stream-json downstream consumers catch up after reconnecting. Replay doesn't have to mean re-running the agent; sometimes it just means **delivering the event stream reliably to consumers**.

## Engineering rationale

"Record raw events, interpret later" is the standard [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) argument: the event stream is the immutable source of truth, and every projection (state, reports, debug views) is folded afterwards — re-runnable with new logic anytime, which is why codex can rebuild state.json with a newer reducer without re-running sessions. Deterministic record-and-replay has mature predecessors in systems debugging: [rr](https://rr-project.org/) made multi-threaded bug hunting nearly single-step cheap by "record once, replay forever," and VCR-style HTTP tools like [VCR.py](https://vcrpy.readthedocs.io/) proved that recorded interactions + matching rules + diff diagnostics generalize well. metaharness adds one more layer: once traces live in structured storage, LLMs become a new class of consumers — the same direction as automated log analysis.

## The baseline now implemented in looplane

`session_replay.py` implements the reducer as a bounded pure function. It rejects oversized events, duplicate sequences, and ID drift, then produces `ReplayState` and stable canonical JSON. `looplane sessions --replay` prints a compact timeline, `--replay-json` serves machine-readable output, and the SDK exports `replay_run_events()`.

Forking uses safe semantics. `--fork-from-event` and `fork_run_at_event()` create a new workspace from an event prefix and the recorded base commit. The seed explicitly records `side_effects_replayed: false`; prior tools, checks, subprocesses, model calls, and commits never run again.

This is not an arbitrary side-effect replay platform. Provider/live-runtime paths still need real runs, while export redaction, replay-specific hooks, and richer causal graphs remain open. The supported claim is deterministic restoration, inspection, and safe forking.

## References

- [looplane `session_replay.py` at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/session_replay.py)
- [looplane SDK replay/fork documentation at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/docs/sdk.md)

- [openai/codex — codex-rs/rollout-trace](https://github.com/openai/codex/tree/main/codex-rs/rollout-trace)
- [openai/codex — codex-rs/thread-store](https://github.com/openai/codex/tree/main/codex-rs/thread-store)
- [can1357/oh-my-pi — packages/metaharness](https://github.com/can1357/oh-my-pi/tree/main/packages/metaharness)
- [sst/opencode — packages/http-recorder](https://github.com/sst/opencode/tree/dev/packages/http-recorder)
- [badlogic/pi-mono — packages/agent](https://github.com/badlogic/pi-mono/tree/main/packages/agent)
- [Martin Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [rr — record and replay debugger](https://rr-project.org/)
- [VCR.py](https://vcrpy.readthedocs.io/)
