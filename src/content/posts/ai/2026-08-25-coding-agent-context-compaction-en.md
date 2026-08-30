---
title: "Learning Design from Mature Coding Agents (26): Context Compression and Compaction — From Gap to Auditable Baseline"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 26
tags: [coding-agent, compaction, context-window, rivumi, claude-code, codex]
lang: en
tldr: "Mature-agent compaction must handle triggers, complete-turn cut points, and recovery. rivumi now has an 85% high-watermark, automatic compaction, a deterministic native-loop fallback summary, persisted checkpoints, and workspace-context reinjection. Cross-runtime fallback, model-quality summaries, and live-provider long-session validation remain open."
description: "Comparing compaction across five coding agents, then documenting Rivumi's fixed-commit baseline for automatic triggers, fallback summaries, checkpoints, and context reinjection."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-context-compaction)

Part two begins with capabilities mature agents need, then tracks how far rivumi has implemented them. First up, the most critical one — context management.

Scope note: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), and claude-code (community decompiled v2.1.88; symbol names may differ from the original). Every citation was actually grepped in local clones.

## The capability problem: a long session leaves you two bad options

Every agent turn sends the entire conversation history back to the provider. Tool results easily run to thousands of tokens, and an hour-long session can hit the context window. Once you're at the ceiling there are two roads: fail outright, or drop old content. Nobody wants the error. But "mindless dropping" is worse — the architecture constraint decided in turn 3 and the test trap discovered in turn 17 vanish without any record.

Compaction is the third road: before you hit the ceiling, hand old history to an LLM for summarization and swap it for one compact block at the front of the context. The hard part isn't "ask an LLM to summarize" — it's three things around it:

1. **When to trigger**: too early wastes money and squeezes out still-useful detail; too late means summarizing a huge chunk at once.
2. **Where to cut**: never split a tool_use/tool_result pair, or the API rejects the request outright.
3. **How to verify**: the summary is written by another model; a bad one corrupts the session's memory.

## How the five projects do it

### pi: textbook minimal implementation

The core check is one line: `pi-mono/packages/agent/src/harness/compaction/compaction.ts#shouldCompact` — `contextTokens > contextWindow - settings.reserveTokens`, with tokens estimated via a conservative character heuristic (`estimateContextTokens` even converts images to a fixed char count). Cut-point logic lives separately in `findTurnStartIndex` and `findCutPoint`: walk back to a turn boundary before cutting, guaranteeing no orphaned tool_use.

### omp: six triggers, then summaries as images

omp's fork goes much deeper. `oh-my-pi/docs/compaction.md` lists six triggers: manual `/compact`, automatic recovery after a same-model context overflow error, recovery after `stopReason === "length"`, post-turn threshold maintenance, mid-turn maintenance inside a tool loop, and idle maintenance. Compaction isn't just overflow prevention — it's part of the **error recovery path**.

More interesting is `packages/snapcompact/src/snapcompact.ts#compact`: discarded history isn't LLM-summarized. Instead it's serialized and **rendered into PNG frames** using native fonts, relying on vision models to read it back — local, deterministic, no extra text API call. Frame shapes are tuned per provider (`resolveShape`); serialization caps every tool result at `TOOL_RESULT_MAX_CHARS = 2000`.

### opencode: prune first

`opencode/packages/opencode/src/session/compaction.ts#PRUNE_MINIMUM` sets a 20,000-token minimum prune amount, while `PRUNE_PROTECT = 40_000` shields the recent segment from pruning. Tool output is uniformly truncated to 2,000 chars before entering the summary flow. The philosophy: mechanically reclaim what you can first (pruning), and only ask the LLM to summarize when that's not enough.

### codex: compaction as a first-class task

On the Rust side the whole thing is a family of dedicated modules: `codex-rs/core/src/compact.rs#run_compact_task` is the entry point, with a single compact user message capped at `COMPACT_USER_MESSAGE_MAX_TOKENS = 20_000`. Two details worth stealing:

- `codex-rs/core/src/state/auto_compact_window.rs#AutoCompactWindow` manages numbered auto-compact windows so resume can restore window state.
- The `InitialContextInjection` enum distinguishes pre-turn from mid-turn semantics: after the former, initial context is fully reinjected next turn; the latter must inject initial context just above the last real user message — because models are trained to expect the mid-turn summary as the last item in history. Protocol-level subtleties like this are invisible unless you read the source.

### claude-code: threshold engineering and circuit breakers

`src/services/compact/autoCompact.ts#getAutoCompactThreshold`: take the context window, subtract the reserved summary budget, then subtract `AUTOCOMPACT_BUFFER_TOKENS = 13_000`. Most worth stealing is the circuit breaker — `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`, with a comment stating plainly that sessions once failed thousands of times consecutively, burning roughly 250K API calls per day globally. It also has `microCompact.ts#microcompactMessages` for fine-grained microcompaction — a separate mechanism layer from full compaction.

## Academic grounding

Why do summaries work rather than just lose information? Because long contexts already degrade. [Liu et al.'s "Lost in the Middle"](https://arxiv.org/abs/2307.03172) measured markedly worse recall for information in the middle of the context — more input does not mean more memory. [Chroma's context rot research](https://research.trychroma.com/context-rot) shows performance broadly declining as context length grows. [MemGPT](https://arxiv.org/abs/2310.08560) ports OS paging concepts into LLMs: hot data in the main context, cold data in external storage, page swaps via interrupts — compaction can be seen as an engineering-simplified version of its paging strategy. Anthropic's own [context engineering article](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) also lists compaction as core technique for long-task agents.

## The baseline rivumi has now implemented

As of `2ed5efb`, this section's original claim that rivumi had no compaction is obsolete. `runtime_semantics.py` now provides a pure high-watermark policy: an eligible long-lived runtime auto-compacts at 85% of a known context window, and a failed context must fall to 70% before the trigger rearms. The TUI invokes it after a completed turn and before a queued follow-up; manual `/compact` and automatic compaction share the same lifecycle-event reducer.

The native `AgentRunner` does not rely entirely on provider APIs. Under task-token pressure, `loop.py` preserves the system/task seed and recent tail, replacing an older complete-message span with a versioned, bounded deterministic summary from `prompts.py`. It is a reproducible lossy fallback, not an LLM-authored semantic summary. The path runs `pre_compact` and `post_compact` hooks, then reinjects changed files, verification state, recent important paths, and active constraints so the agent does not forget the workspace after compression.

Compaction boundaries are durable too. `ContextCheckpoint` validates that source and retained turns do not overlap and that occupancy cannot increase. The conversation store can persist successful checkpoints as `context.compacted` events and exclude replaced material on replay. Codex app-server has a real `thread/compact/start` lifecycle; the Claude adapter explicitly refuses native compaction instead of pretending it succeeded.

## What remains open

The native fallback is mechanical: cheap and testable, but semantically weaker than a model-written summary. Automatic provider compaction covers only long-lived runtimes that advertise support and report a context window; other external runtimes still lack equivalent fallback. The largest evidence gap is a real-provider long session. Checkpoint persistence, workspace reinjection, and failure debounce are tested, but those tests are not production-parity proof across providers.

## References

- [Rivumi compaction policy and checkpoints (fixed commit)](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/runtime_semantics.py)
- [Rivumi native fallback and reinjection (fixed commit)](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)

- ["Lost in the Middle" (Liu et al., 2023)](https://arxiv.org/abs/2307.03172)
- [Context Rot (Chroma Research)](https://research.trychroma.com/context-rot)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Effective Context Engineering for AI Agents (Anthropic)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
