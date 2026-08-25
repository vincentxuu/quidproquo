---
title: "Learning Design from Mature Coding Agents (33): Session Recording and Replay — Recorded, but Never Played Back"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 33
tags: [coding-agent, session-replay, observability, rivumi, codex, trace]
lang: en
tldr: "codex's rollout-trace splits 'observing' from 'interpreting': the hot path only writes a raw event spine, and a deterministic reducer replays it into a state graph afterwards. omp's metaharness puts every run's trace into SQLite with a dashboard, then lets cheap models turn traces into narrative reports. pi makes every tool declare replay safety as safe or never. rivumi has all the JSONL material — but nothing that can actually play it back."
description: "Comparing how codex, omp, opencode, pi, and claude-code implement session recording and replay; distilling observe-first design, trace storage, and re-execution policy into a design draft for rivumi."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-session-recording-replay)

Part two of the series, entry 33. The previous post covered compaction; this one tackles something that looks "already done": session recording.

Scope note: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), claude-code (community-decompiled v2.1.88). Every reference below was grepped by hand in local clones.

## The capability gap: all the footage, no projector

rivumi already records diligently. Every run directory gets an `events.jsonl` (`loop.py#EventWriter`), conversations keep their own event streams, and crash recovery runs on these same files. The problem is the tapes can only be **read by eyeball after the fact**: replaying a run, pausing before the third tool call to inspect the state at that moment, or asking "which request produced this garbage output" — no command does any of it.

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

## A design draft for rivumi

Honest current state: `events.jsonl` is ordered, sequenced, and immutable thanks to frozen pydantic models (`events.py#RunEvent`) — the material quality passes. What's missing is three things: a folder, a viewer, and a re-execution policy.

**Folder**: a new `src/rivumi/replay.py`. The core move is extracting the state transitions currently scattered across `loop.py` into pure-function reducers shared by both live and replay paths — a direct translation of codex's observe-first split. `rivumi replay <run_id>` scans the stream first; if a `.state.json` cache beside it is newer than the events, use it (learning from `REDUCED_STATE_FILE_NAME`); otherwise fold offline and write back.

**Viewer**: version one doesn't need a web dashboard. The existing `transcript_export.py` already renders events into text transcripts; replay only adds timeline navigation on top — jump to event N, expand the full context around a tool call. A `--report` flag goes through the provider gateway to have a cheap model generate a narrative report (learning from metaharness's trace-report); this step is nearly free since the gateway already exists.

**Re-execution policy**: add a `replay: Literal["safe", "never"]` field to tool definitions in `tools.py` (copying pi). Replay gets two tiers — read-only inspection always available; step-through re-execution restricted to safe tools, while never tools show their recorded result annotated "not re-run."

**Redaction**: every export/share path passes through a sensitive-content masking layer first (adopting `UnsafeCassetteError`'s stance: block, don't warn). rivumi has none today; the testing post already called this out.

## Fitting the existing architecture

The good news: this gap needs no architectural change, only a new module. The event spine (`events.py#EventWriter`) stays; `conversation.py#completed_turns` replay semantics (history reconstruction for the provider) and this article's replay (diagnostic playback for humans) are separate concerns that don't interfere; external CLI backends' runtimes record themselves, so rivumi-layer replay covers only what the adapters observed — scoped honestly. Entry point: a `/replay <run_id>` slash command alongside the existing export commands.

Priority-wise, the folder comes first: it's the only piece where nothing else exists without it. Viewer and report can wait until one real debugging session reveals where the pain actually is.

## References

- [openai/codex — codex-rs/rollout-trace](https://github.com/openai/codex/tree/main/codex-rs/rollout-trace)
- [openai/codex — codex-rs/thread-store](https://github.com/openai/codex/tree/main/codex-rs/thread-store)
- [can1357/oh-my-pi — packages/metaharness](https://github.com/can1357/oh-my-pi/tree/main/packages/metaharness)
- [sst/opencode — packages/http-recorder](https://github.com/sst/opencode/tree/dev/packages/http-recorder)
- [badlogic/pi-mono — packages/agent](https://github.com/badlogic/pi-mono/tree/main/packages/agent)
- [Martin Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [rr — record and replay debugger](https://rr-project.org/)
- [VCR.py](https://vcrpy.readthedocs.io/)
