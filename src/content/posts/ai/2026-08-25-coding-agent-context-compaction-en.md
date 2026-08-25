---
title: "Learning Design from Mature Coding Agents (26): Context Compression and Compaction — A Capability All Five Have and rivumi Doesn't"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 26
tags: [coding-agent, compaction, context-window, rivumi, claude-code, codex]
lang: en
tldr: "claude-code computes its trigger threshold as context window minus reserved buffers and trips a circuit breaker after three consecutive failures; codex makes compaction a first-class task with protocol-aware initial-context injection; omp's snapcompact renders discarded history into PNGs for vision models to read back; pi and opencode both use turn-boundary cut points so history is never split mid-tool-call. rivumi currently has only a hard 'last 12 turns' cutoff with no summary compensation — the first gap in part two of this series."
description: "Comparing compaction implementations across pi, omp, opencode, codex, and claude-code — trigger timing, cut-point strategy, summary generation — with a design draft for rivumi."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-context-compaction)

Part two of the series begins here: each post covers one capability that all five mature projects have and rivumi doesn't. First up, the most critical one — context management.

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

## rivumi design draft

First, an honest account of current state: grepping all of `~/Projects/rivumi/src/rivumi/`, **there is no compaction mechanism**. There are only three hard bounds — `conversation.py#MAX_REPLAY_MESSAGES = 12`, `conversation.py#MAX_REPLAY_CHARS = 48_000`, `conversation.py#MAX_MESSAGE_CHARS = 16_000`. `ConversationStore.completed_turns` returns only the last 12 complete turns on the replay path; anything before turn 13 **silently disappears** — no summary, no marker, no event. `loop.py#bounded_text` merely shortens artifact previews and does nothing for conversational memory.

If we build it, the draft looks like this:

**Interface location**: add `src/rivumi/compaction.py` defining a `Compactor` protocol (`should_compact(usage) -> bool`, `summarize(turns) -> str`), implemented through the existing `ModelProvider` abstraction — the provider gateway has existed since M2, so no new dependencies.

**Data flow**: after each completed turn, estimate context size from snapshot events (pi-style character heuristics suffice); past `window - reserve`, send the target range to `summarize`, and append the summary into the JSONL as a new conversation event type (say `compaction_summary`). Replay then becomes "summary + complete turns after it". Compaction itself is persisted as an event, keeping the audit trail unbroken — fully isomorphic with rivumi's existing event-sourcing design.

**Risks and tradeoffs**:

- **External CLI backends aren't rivumi's to manage**. Since M11, rivumi's primary mode is a long-lived external session; the CLIs behind the pi/omp/codex adapters have their own compaction, and duplicating it would double-summarize. Version one should cover only the native conversation path, with external backends explicitly marked "handled by the runtime".
- **Summary quality is unverifiable**: a bad summary equals memory corruption. At minimum keep the raw summary inspectable in the event log, and allow manual intervention à la `/compact <instructions>`.
- **Cost**: every compaction costs an extra LLM call. Prune first (learn from opencode): truncate oversized tool outputs and re-measure; only summarize if still over.

## Fit with the existing architecture

The concrete impact of missing this today: any native-path session longer than 12 turns loses early decisions without a trace, and the user has no idea — nothing in the TUI marks "something was dropped here". The bare-minimum consensus among all five projects is that **compaction must be a visible, auditable boundary event** (omp's cmp entry, codex's CompactionEvent, claude-code's CompactBoundaryMessage). rivumi's existing event stream and transcript UI could already render such a boundary; what's missing is simply admitting that "hard truncation is not a strategy". This is the highest-value cell on the improvement roadmap.

## References

- ["Lost in the Middle" (Liu et al., 2023)](https://arxiv.org/abs/2307.03172)
- [Context Rot (Chroma Research)](https://research.trychroma.com/context-rot)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Effective Context Engineering for AI Agents (Anthropic)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
