---
title: "Learning Agent Design from Mature Coding Agents (19): Session Persistence and Crash Recovery — Rescuing State After the Agent Dies"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 19
tags: [coding-agent, session-persistence, crash-recovery, looplane, claude-code]
lang: en
tldr: "All five agents store sessions as append-only JSONL plus some form of single-writer protection, but crash recovery lives in the details: pi repairs torn tails, codex reopens and retries after write failures, and looplane picked a 'manifest first' ordering that reduces the only crash window to one repairable slot. This post dissects each project's write ordering and fail-closed conditions, all cited at file#symbol level."
description: "Comparing session persistence across pi, omp, opencode, codex, and claude-code source code: event formats, single-writer fencing, crash window analysis, and why looplane chose manifest-first writes with validated resume."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)

Evidence scope for this post: **pi** (badlogic/pi-mono), **omp** (can1357/oh-my-pi), **opencode** (sst/opencode), **codex** (openai/codex Rust workspace), and **claude-code** (community-decompiled v2.1.88; symbol names may differ from the original), compared against my own **looplane**. Every citation below was read in my local clones.

## The design problem: how do you rescue state when an agent dies mid-run?

A long-running coding agent session is a large sunk cost: dozens of model calls, hundreds of KB of tool output, approval decisions the user made along the way. After the process gets OOM-killed, the terminal closes, or the power cuts out, "just rerun it" usually isn't an option.

So the real design problem has three layers:

1. **What to write**: full conversation messages, or an event stream? An event stream lets you rebuild state by replaying (the [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) idea), but every resume pays replay costs.
2. **How to write without corrupting**: what if the crash lands mid-write? A half-appended line or a half-updated manifest reads back as garbage at resume time.
3. **Who may write**: two processes resuming the same session interleave their event streams. You need a single-writer guarantee that itself doesn't depend on any process staying alive.

The third point is the most commonly missed: if the lock lives only in memory, the crash takes the lock with it, and zombie sessions are born.

## What the five projects do

### pi: JSONL with a header line, automatic torn-tail repair

pi's harness stores each session as one JSONL file: the first line is a versioned header (`version: 4`, with id, cwd, `parentSessionId`), every following line is a mutation. Directories are organized per cwd; filenames combine a timestamp and id (`pi-mono/packages/agent/src/harness/session/jsonl/repo.ts#JsonlSessionRepo`).

The resilience logic at load time is worth stealing (`jsonl/storage.ts#JsonlSessionStorage.load`): if the last line fails to parse as syntax — the classic append-cut-in-half — pi classifies it as a torn tail and atomically publishes the valid prefix back over the file via temp file + rename (`jsonl/storage.ts#publishFileAtomically`); if the file just lacks a trailing newline, it appends one. A broken line anywhere in the middle is not a tail, so the file is rejected outright.

Fork semantics also live at the mutation layer: `state.ts#createForkMutations` supports copying either the whole tree or just the main lane up to some entry, with the new session's header recording `parentSessionId`. A fork isn't a file copy — the source state is re-encoded as the new session's mutation sequence.

pi additionally ships a SQLite backend (the routing table's `packages/session-backends`) whose single-writer mechanism is a lease with a fence token: `sqlite-node/src/sqlite/storage/writer-leases.ts#acquireWriterLease` uses a single UPSERT so every lease acquisition increments `fence`, and expired leases can be stolen. The fence increases monotonically, so a stale holder returning with an old fence gets rejected — the fencing-token pattern databases have used for decades.

### omp: same fork, more paranoid atomic writes

omp is a pi fork with a shared session format but extra armor in the storage layer. The best part is `packages/coding-agent/src/session/session-storage.ts#writeTextAtomic`: on top of temp-file-plus-rename it requires a `commitGuard` — and the guard check and rename must not be separated by an await, because a concurrent synchronous rewrite could otherwise publish fresh content between check and rename, letting a stale staged body clobber the newer file. On Windows, rename can throw EPERM, and there's a whole fallback path that moves the target aside as `.bak`, swaps in, and rolls back on failure.

Two more pragmatic details: the persistence layer proactively truncates content beyond 500K characters and externalizes images into a blob store (`session-persistence.ts#MAX_PERSIST_CHARS`); and the `SessionStorage` interface explicitly defines `drain()`, letting graceful shutdown wait for async backends (Redis/SQL) to flush queued writes (`session-storage.ts#SessionStorage.drain`).

### opencode: from JSON files into SQLite

opencode walked a migration path: early on it was a directory tree with one JSON file per message (`packages/opencode/src/storage/storage.ts`), moved forward by a versioned `MIGRATIONS` array; the newer core has switched to SQLite, with the schema in `packages/core/src/session/sql.ts` — `SessionTable`, `MessageTable`, `PartTable` — plus composite indexes like `(session_id, time_created, id)`. The lesson: **storage formats always change eventually**. Writing migrations as ordered, detectable (`parseMigration` reads a version number), idempotent steps matters more than picking the perfect format the first time.

### codex: rollouts are recordings that heal their own writer

codex calls its persistence "rollout," positioned as a replayable recording. Same JSONL shape: the first line is a `SessionMetaLine` (meta plus git info, with a hand-written deserializer for backward compatibility with old formats — `codex-rs/protocol/src/protocol.rs#SessionMetaLine`), followed by the `RolloutItem` enum: `ResponseItem`, `Compacted`, `TurnContext`, `EventMsg`, etc. (`codex-rs/history/src/lib.rs#RolloutItem`).

The most distinctive engineering is self-healing on the write side: items go into a `pending_items` queue drained by a single writer task, and are removed **only after a successful write**. On I/O failure the file handle is dropped but the unwritten suffix retained, and the next barrier reopens the file and retries (`codex-rs/rollout/src/recorder.rs#RolloutWriterState.write_pending_with_recovery`). If the disk fills up temporarily or the file is locked, rollouts lose no events — they're just written late.

Single-writer uses per-thread lock files: `codex-rs/thread-store/src/local/writer_lock.rs#WriterLockCoordinator` creates `<thread_id>.lock` under `thread-writer-locks/`, cleaning stale locks before acquiring. Fork/revert semantics keep the thread id stable while creating a new immutable rollout file, whose name can encode `forked_from_id` (`recorder.rs#RolloutRecorderParams.Create`). The reader side even has a backward scanner from end-of-file, `ReverseJsonlScanner` (`rollout/src/reverse_jsonl_scanner.rs`), so finding recent events doesn't require reading the whole file.

### claude-code: append-only transcript with a uuid chain

claude-code's main transcript is one `<sessionId>.jsonl` per project directory, append-only, where each entry carries `uuid` and `parentUuid` forming a chain (`src/utils/sessionStorage.ts`). The session file is lazy: it materializes on the first user/assistant message (`sessionStorage.ts#materializeSessionFile`), so a session with no real conversation leaves no junk files.

Deletion is interesting: on tombstone receipt there's no full-file scan — instead it byte-searches `"uuid":"..."` within the last 64KB, then ftruncates and re-appends the trailing lines; older entries fall back to a full rewrite capped by a size limit (the fast/slow paths around `sessionStorage.ts#removeMessageByUuid`). At resume, `conversationRecovery.ts#loadConversationForResume` lists still-live background sessions over UDS and skips them — preventing `--continue` from attaching to a live process writing its own transcript.

Prompt history is a separate file (`history.jsonl`), written under a lockfile with retries and cleanup hooks (`src/history.ts#immediateFlushHistory`). The `src/migrations/` directory shows another migration style: rather than moving session data itself, settings and model preferences get upgraded version by version (e.g., `migrations/migrateSonnet45ToSonnet46.ts`), and the old inline history field is cleaned out in favor of the new file (`utils/config.ts#removeProjectHistory`).

## looplane's choice, and how it differs

A looplane session directory holds three things: `request.json` (the task contract), `events.jsonl` (append-only event stream), and `session.json` (a manifest containing complete resumable state: messages, usage, step count, approval history, event sequence).

**Write ordering is the core decision.** For every event, looplane first atomically writes the full resumable state and the intended sequence number into the manifest, then appends to the JSONL (`src/looplane/loop.py#_event`). That ordering defines the single crash window: dying in between leaves the manifest exactly one slot ahead of the event log. At resume, `_validate_events` replays the whole stream checking sequence contiguity, and if the manifest is precisely one ahead, repairs it (`src/looplane/session.py#claim_and_validate_resume`). Within one slot it's repairable; beyond that, data is corrupt and resume fails closed — exactly one repair path, provably.

Single-writer protection is an OS-level `flock`: `session.py#SessionStore.acquire_writer` opens `.writer.lock` with `O_NOFOLLOW`, takes `LOCK_EX | LOCK_NB`, and writes a random token into the lock file. Every save then verifies the on-disk manifest still names this writer's token before writing (`session.py#save`) — so even if the lock fails for any reason, a stale writer cannot pass the token check. flock protects against two live processes stomping each other; it does **not** protect against mid-crash torn writes or power loss. That layer is covered by atomic writes (temp file + `os.replace`, fsync of both file and directory — `src/looplane/events.py#_atomic_write`) plus full validation at resume.

The fail-closed boundary sits on side effects: if the last durable event is `tool.started` or `verification.started`, automatic resume refuses outright — you cannot prove whether that action completed (`session.py#claim_and_validate_resume`, final checks). Pending approvals are always abandoned as explicitly unexecuted actions so the model can re-request them, rather than assuming authorization survives. Resume also validates that the workspace git HEAD matches the manifest's base SHA, rejects symlinks, rejects terminal states — better to do nothing than to guess.

Compared with the five: pi/codex/claude-code all use pure event streams where resume rebuilds state by replay. looplane keeps an additional manifest for O(1) hydration, at the cost of maintaining manifest/log consistency — and write ordering plus one-slot repair compresses that cost down to a single reasonable case. On fencing, though, everyone converges: pi's SQLite fence counter, codex's lock files, looplane's flock-plus-token all solve the same problem.

## Engineering grounding

- **Atomic replacement**: writing a temp file then calling `rename` is the POSIX-guaranteed atomic swap ([rename(2)](https://man7.org/linux/man-pages/man2/rename.2.html), same filesystem). pi, omp, and looplane's atomic writes all follow this pattern.
- **fsync is not optional**: rename's atomicity says nothing about durability, and post-power-loss ordering can surprise you. [LWN's coverage of the ext4 data-loss episode](https://lwn.net/Articles/457667/) makes it clear: data survives power loss only if you explicitly fsync the file (and the directory when needed). looplane's `_atomic_write` even fsyncs the directory.
- **The WAL lesson**: SQLite achieves crash safety with an append-only write-ahead log plus checkpointing — the industrial-grade version of "event stream as truth, snapshot as accelerator" ([SQLite Atomic Commit](https://www.sqlite.org/atomiccommit.html), [WAL](https://www.sqlite.org/wal.html)). looplane's manifest/checkpoint plus JSONL is a small-scale rerun of the same move.
- **Fencing tokens**: monotonically increasing lease numbers prevent an invalidated old writer from writing again — standard distributed-leases practice, fully argued in [Martin Kleppmann: How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html). pi's fence column is a textbook implementation.
- On the academic side, recoverability of agents has little dedicated literature, but [ReAct](https://arxiv.org/abs/2210.03629)-style loops take external side effects at every step — which is exactly why exactly-once delivery can't be free and the honest answer is fail closed.

## Improvement roadmap

What looplane is missing, ranked:

1. **Torn-tail repair**. Right now a half-written last line in `events.jsonl` fails JSON parsing and fails closed — safe but inconvenient. pi's approach (last-line-syntax-error equals torn tail; atomically truncate) can be copied directly, given that appends are small single-line payloads.
2. **Write retries**. codex's pending queue with reopen-and-retry means transient I/O errors don't drop events; looplane currently fails the run outright. Wrapping EventWriter with a retry buffer is low-cost, high-return.
3. **Manifest heartbeat and staleness detection**. looplane already records `writer_heartbeat_at` but nothing consumes it; codex's stale-lock sweep and pi's expiring leases are ready-made references. With that in place, clearing leftover writers needs no human judgment.
4. **Reverse scanning**. As event streams grow, full replay at resume gets slow; codex's `ReverseJsonlScanner` hints at the path: pair periodic checkpoints with scanning backward from the tail only to the latest checkpoint.

## References

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — local clone mirrors `pi-mono/packages/agent/src/harness/session/` and `packages/session-backends/`
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — `packages/coding-agent/src/session/session-storage.ts`
- [sst/opencode](https://github.com/sst/opencode) — `packages/opencode/src/storage/`, `packages/core/src/session/sql.ts`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/rollout/`, `codex-rs/thread-store/`
- [SQLite: Atomic Commit](https://www.sqlite.org/atomiccommit.html) / [Write-Ahead Logging](https://www.sqlite.org/wal.html)
- [rename(2) — Linux man page](https://man7.org/linux/man-pages/man2/rename.2.html)
- [LWN: Ensuring data reaches disk](https://lwn.net/Articles/457667/)
- [Martin Kleppmann: How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- [Martin Fowler: Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
