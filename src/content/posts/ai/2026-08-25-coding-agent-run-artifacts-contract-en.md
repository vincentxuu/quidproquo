---
title: "Learning Design from Mature Coding Agents (20): The Run Artifacts Contract—What Makes a Run Auditable After It Ends?"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 20
tags: [coding-agent, run-artifacts, auditability, rivumi, observability]
lang: en
tldr: "After an agent run finishes, 'the model said it's done' is not evidence. Codex splits traces into a manifest + JSONL + payloads bundle, omp mirrors on-disk files into SQLite, pi indexes native session files with runs.jsonl. Rivumi picked the strictest option: six fixed files per run, the run is incomplete if any is missing, and patch review reads changes.patch—not anyone's verbal claim."
description: "Comparing source code from codex, omp, pi, opencode, and claude-code to break down three storage trade-offs for run artifacts—fixed-schema files, single JSONL, and SQLite—plus the reasoning behind rivumi's six-file contract and its improvement roadmap."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-run-artifacts-contract)

The previous post covered [testing an agent that moves](/posts/ai/2026-08-25-coding-agent-testing-a-moving-agent-en); this one tackles the question that comes after testing: when a run finishes—or dies halfway—what does it leave behind?

## The design problem

Two properties of agent runs make post-hoc auditing hard. First, runs are irreproducible: the same prompt against a non-deterministic model produces a different result the second time, so "just rerun it" is not an option. Second, verbal claims are untrustworthy: the model's final text saying "I fixed it, all tests pass" carries zero evidentiary weight on its own.

So the real question is three questions: **what do you use to reconstruct the process when debugging? What justifies trusting the conclusion when auditing? And what is the unit of comparison when running experiments?** All three share one answer—the artifacts a run leaves on disk. The differences between projects are about what gets written, in what format, and how hard the format's promises are.

## How the five projects do it

**codex** has the most layered approach. The base layer is session recording: `openai/codex/codex-rs/rollout/src/lib.rs#decode_rollout_line` defines `RolloutLine` (timestamp + ordinal + item), appended line by line to `rollout-<timestamp>-<thread_id>.jsonl` (`codex-rs/rollout/src/rollout_file_name.rs#parse`), with resume and projection sharing the same decoder. On top sits the trace bundle: `codex-rs/rollout-trace/src/bundle.rs` fixes a four-piece layout—`manifest.json` (schema version, trace id, root thread), `trace.jsonl` (append-only raw events), a `payloads/` directory for bulky raw request/response bodies (`payload.rs#RawPayloadRef` stores references only), and `state.json` (a cache written by the reducer's replay). The comment on `raw_event.rs#RawTraceEvent` says it plainly: the uniform envelope exists so "partial replay and corruption checks can run before the reducer understands the event-specific payload." Query needs are delegated separately to SQLite (`codex-rs/rollout/src/state_db.rs#init`).

**omp**'s metaharness turns "experiment → run → trace" into a unified experiment model. The key decision is stated at the top of `can1357/oh-my-pi/packages/metaharness/src/store.ts#RunStore`: **the filesystem stays the source of truth** (Harbor writes `result.json` per trial), SQLite is only a mirror, and `store.ts#syncRun` re-reads job dirs and upserts. In other words, omp wants both—fixed files on disk guarantee portability and inspectability; SQLite makes the dashboard queryable.

**pi** takes the lightweight-index route. Its eval reporter appends one line per harness run to `.eval/runs.jsonl`, recording schema version, usage, timings, and errors, then points to native Pi session JSONL attachments via `persistEvalArtifactReferences` (`badlogic/pi-mono/packages/evals/src/vitest-evals/reporter.ts#appendHarnessRunReport`). The session itself is appended entry by entry by `packages/coding-agent/src/core/session-manager.ts#SessionManager._appendEntry` into `<timestamp>_<sessionId>.jsonl`.

**opencode** is the only one of the five that is primarily SQLite-native: the v2 session layer uses drizzle tables like `SessionTable`, `MessageTable`, and `PartTable` (`sst/opencode/packages/core/src/session/sql.ts`), read through `session/store.ts`. Queries and consistency come free; the cost is that outside the server there are no raw records you can `cat` or `git diff`.

**claude-code** is the simplest: one directory per project, one `.jsonl` transcript per session (`anthropics/claude-code src/utils/listSessionsImpl.ts` scans `.jsonl` under `getProjectsDir()`), plus a one-line-per-entry `history.jsonl` for prompt history (`src/history.ts`). A single append-only file, good enough.

## rivumi's choice and how it differs

Rivumi's contract lives in `docs/progress.md` under "Required artifacts per run": every run directory contains exactly six fixed files—`request.json`, `events.jsonl`, `checkpoint.json`, `changes.patch`, `test.log`, `result.json` (the implementation also writes a seventh, `verification.json`, holding each check's exit code and output). The M1 stage doc's acceptance criteria explicitly require "all six files exist and agree about terminal state."

Compared with the five projects, several deliberate differences:

**Fixed-schema files instead of a single JSONL.** claude-code and pi use one JSONL for everything, but rivumi wants different consumers pulling different files: someone reviewing patches opens only `changes.patch`; failure triage starts at `terminal_reason` in `result.json`; only debugging requires reading `events.jsonl`. The boundaries between the six files mirror the boundaries between six audit questions.

**The patch is the evidence.** `loop.py#_finish` re-collects the reviewable diff at teardown and writes `changes.patch`; if even the patch cannot be produced, the whole run downgrades to `failed` / `patch_artifact_failed`—never leaving behind a directory that claims success without a patch. "The model said it changed things" never enters the evidence chain; the evidence is the git diff and verification exit codes.

**Secrets stay out of artifacts.** Check subprocesses run under `runtime.py#sanitized_subprocess_env`—an allowlisted environment with an assertion guardrail—so API keys never enter an environment that `test.log` could capture. Artifacts get shared and pasted into issues; they must be clean before they are written.

**The contract holds for external runtimes too.** Even with an external backend like the Codex CLI, `external_runner.py#_finalize` still fills in the same six files plus a `backend-result.json` for the native output. Swap runtimes, keep the audit interface.

## Engineering rationale

The three storage trade-offs compress into one sentence: **JSONL buys durability, SQLite buys queryability, fixed files buy legibility.**

Append-only JSONL's core value is crash safety: die while writing line N and lines 1..N−1 remain valid. Codex's uniform `RawTraceEvent` envelope and rivumi's `events.py#EventWriter.append` (O_APPEND + fsync) are making the same bet. SQLite's value is aggregate queries—opencode and codex's state db both exist to serve "list/search/sort sessions"; but omp's design carries the key reminder: the index can be derived data, **the raw record must be a human-readable file**, so when the database corrupts or the schema evolves, what's on disk still speaks. Rivumi chose fixed files, putting legibility first; queryability is unused today (a single run doesn't need SQL), and durability is covered by `events.py#atomic_write_json`'s temp-file + rename + directory fsync.

On the academic side this connects to evaluation reproducibility: SWE-bench ([arXiv:2310.06770](https://arxiv.org/abs/2310.06770)) became a common reference point precisely because every instance has a fixed input contract and pass/fail criterion; SWE-agent ([arXiv:2405.15793](https://arxiv.org/2405.15793)) promoted the agent–computer interface to a first-class design object. A run artifacts contract extends the same idea toward operations: judgment criteria must not live inside the conversation. [Anthropic's Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) likewise lists observability as a precondition for production agents—and the minimal unit of observability is one complete record of a run.

## What can be improved

1. **No secret scanner.** The environment allowlist blocks the main channel, but tool output itself (say, `cat`-ing a file containing a key) could still carry secrets into events.jsonl. The M1 stage doc honestly lists this as a limitation; gitleaks-style artifact scanning is the next step.
2. **No experiment layer.** omp's experiment → run → trace hierarchy lets different arms of the same question be compared side by side; rivumi's runs are currently islands, compared by manually opening directories.
3. **No reduced view.** codex's reducer replays raw events into a semantic `RolloutTrace` (cached as `state.json`); rivumi's events.jsonl is raw text only, and human review cost will climb as runs grow.
4. **result.json could carry artifact checksums.** The current `artifacts` dict stores paths only; adding SHA-256 would prove "this result describes exactly these files," closing the audit chain.

The next post in the series covers headless mode and CI usage—the artifacts contract is precisely what makes headless trustworthy.

## References

- [openai/codex — codex-rs/rollout](https://github.com/openai/codex/tree/main/codex-rs/rollout) and [codex-rs/rollout-trace](https://github.com/openai/codex/tree/main/codex-rs/rollout-trace) — session recording and trace bundle format
- [can1357/oh-my-pi — packages/metaharness](https://github.com/can1357/oh-my-pi/tree/main/packages/metaharness) — experiment→run→trace model and SQLite mirroring
- [badlogic/pi-mono — packages/evals](https://github.com/badlogic/pi-mono/tree/main/packages/evals) — eval artifact conventions and the runs.jsonl index
- [sst/opencode — packages/core/src/session](https://github.com/sst/opencode/tree/main/packages/core/src/session) — SQLite-first session storage
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — official repo (ships minified bundle; quotes here from community decompiled v2.1.88)
- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) — fixed input contracts and judging criteria
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — interfaces as first-class design objects
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's engineering principles for agents
