---
title: "Learning Agent Design from Mature Coding Agents (27): Cross-Session Memory — Why Every Agent Starts Each Day with Amnesia"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 27
tags: [coding-agent, agent-memory, rivumi, claude-code, oh-my-pi]
lang: en
tldr: "Of the five reference projects, omp ships a full SQLite memory engine (mnemopi) with working/episodic tiers plus sleep-time consolidation, and claude-code pairs an auto memory directory with periodic LLM extraction; the other three only have manual AGENTS.md files. rivumi today can resume conversation history but has no semantic memory layer at all. This post dissects storage formats, retrieval, and write timing across the five, then proposes a rivumi design: typed memories in SQLite, extracted at bounded-task boundaries, shared across all backends."
description: "Comparing omp mnemopi, claude-code memdir/SessionMemory, and pi/opencode/codex AGENTS.md mechanisms for cross-session memory — storage, retrieval, and write gating — with a concrete design draft for rivumi."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-cross-session-memory)

Evidence base: **omp** (can1357/oh-my-pi), **claude-code** (community decompiled v2.1.88 — symbol names may differ from the official build), **pi** (badlogic/pi-mono), **opencode** (sst/opencode), **codex** (openai/codex Rust workspace), compared against my own **rivumi**. All citations were read in local clones.

## The capability problem: starting from zero every day

I work on the same machine and the same handful of projects, yet every new agent session starts blind: it doesn't know my commit conventions, doesn't remember last week's D1 batch timeout fix, and needs the project norms explained again. However long the in-session context is, it dies when the process exits.

This is a Part 2 topic: capabilities all five reference projects have that rivumi doesn't. To be precise about rivumi's current state — I grepped `~/Projects/rivumi/src/rivumi/` end to end. `conversation.py` can persist and resume conversations and `events.py` keeps an append-only event log, but there is no embedding, vector index, or semantic memory layer anywhere in the codebase. rivumi can continue an unfinished conversation; it cannot recall something learned three weeks ago.

## omp: mnemopi, a complete memory engine

omp is the only one of the five that ships memory as a standalone package. `oh-my-pi/packages/mnemopi/README.md` states it plainly: "Local SQLite memory engine." Key design decisions:

**Storage format**. `packages/mnemopi/src/types.ts#MemoryRow` stores more than content: `importance`, `veracity` (was this stated, inferred, or produced by a tool?), `recall_count`, `last_recalled`, `valid_until`, and `superseded_by`. Those last fields matter: memories expire and get replaced by newer facts rather than piling up forever. The database lives under the path from `src/config.ts#DEFAULT_DATA_DIR` (`~/.hermes/mnemopi/data`), and embeddings default to a local model, `BAAI/bge-small-en-v1.5` (`src/config.ts#DEFAULT_EMBEDDING_MODEL`) — it works offline.

**Trust weighting**. `src/config.ts#VERACITY_WEIGHT_DEFAULTS` weights sources differently: self-stated facts score highest, tool outputs are discounted. Recall ranking multiplies this coefficient in — so things the agent once got wrong don't carry the same weight as verified facts.

**Retrieval**. Beyond basic recall (`src/core/memory.ts#recall`), `polyphonic-recall.ts#PolyphonicRecallEngine` runs multi-route hybrid retrieval.

**Consolidation**. `src/core/memory.ts#sleep` performs offline consolidation: like human sleep, it solidifies short-term memory, deduplicates, and summarizes into episodic memory (the episodic tier is `types.ts#EpisodicMemoryRow`). A `dryRun` flag previews before committing.

**Integration**. omp exposes memory as agent tools rather than invisible magic: `packages/coding-agent/src/tools/memory-recall.ts#MemoryRecallTool`, `retain` in `memory-retain.ts` (writes), and `memory-reflect.ts` — the model decides when to access its own memory.

## claude-code: a memory directory plus periodic extraction

The decompiled source shows two complementary mechanisms.

**The auto memory directory (memdir)**. `src/memdir/paths.ts#getAutoMemBase` resolves the memory root; the entrypoint is a single `MEMORY.md` (`memdir.ts#ENTRYPOINT_NAME`) injected into the system prompt at startup. Individual memories are scattered Markdown files constrained to four types (`memoryTypes.ts#MEMORY_TYPES`): user (who the user is), feedback (approaches the user corrected or endorsed), project (project-level facts), and reference (external knowledge links). The comment next to the type definitions is refreshingly honest: anything derivable from code, git history, or CLAUDE.md must NOT be stored — the memory layer holds only non-derivable context.

**Two-stage retrieval**. `memoryScan.ts#scanMemoryFiles` reads only each file's frontmatter (capped around two hundred files) to build a manifest; `findRelevantMemories.ts#findRelevantMemories` then hands the manifest to a cheap Sonnet side-query that picks up to five relevant memories before their full text is read. A small model acts as the retriever — no embeddings, no vector store.

**Write timing is threshold-gated**. `services/SessionMemory/sessionMemoryUtils.ts#DEFAULT_SESSION_MEMORY_CONFIG` defines three thresholds: roughly 10k accumulated tokens before first initialization, then re-extraction only after another ~5000 tokens of growth AND several tool calls since last time. The implementation notes in `sessionMemory.ts#shouldExtractMemory` are explicit: the token threshold is always required to prevent over-extraction, and extraction prefers natural conversation breaks with no pending tool calls so it never interrupts active work. The actual extraction runs in `services/extractMemories/extractMemories.ts#executeExtractMemories` — a permission-restricted subprocess allowed to write only inside the memory directory.

## The other three: does AGENTS.md count as memory?

pi, opencode, and codex have no automatic memory layer, but they have a close relative: project instruction files.

- **pi**: `pi-mono/packages/coding-agent/src/core/resource-loader.ts#loadProjectContextFiles` discovers `AGENTS.override.md`, `AGENTS.md`, and `CLAUDE.md` in order and injects them into context.
- **opencode**: `packages/opencode/src/session/instruction.ts` supports both global and project-level AGENTS.md, even falling back to `~/.claude/CLAUDE.md`.
- **codex**: the most refined treatment — `codex-rs/core/src/context/world_state/agents_md.rs` treats AGENTS.md as versioned world state, notifying the model via diffs when the file changes ("previous instructions no longer apply").

Honest boundary discussion: these are **manual memory** — a human decides what's worth recording and maintains it; the author of the write loop is a person, not the agent. That solves "carry context across sessions" but not "the agent learning from its own experience." claude-code's memdir type annotations draw exactly this line: CLAUDE.md belongs on the derivable side and shouldn't be duplicated into memory. Strictly speaking, only two of the five ship automatic memory — but both point the same direction: **memories should be typed, writes throttled, and retrieval cheaper than the main model**.

## Academic grounding

The best-known starting point is [Generative Agents](https://arxiv.org/abs/2304.03442) (Park et al., 2023): twenty-five simulated townsfolk share a memory stream where retrieval scores recency × importance × relevance, and an LLM reflects higher-level conclusions out of raw records. omp's importance/veracity fields and claude-code's periodic extraction are both engineering variants of that architecture. [MemGPT](https://arxiv.org/abs/2310.08560) argues the other side: instead of bolting on a vector store, give the agent an explicit tiered memory interface (main context / external storage) it accesses through calls — which is precisely omp's `retain`/`recall` tools.

## A design draft for rivumi

Synthesizing the two implementations, here's how I'd slice rivumi's memory layer:

1. **Storage**: one SQLite file (`~/.rivumi/memory.db`), schema borrowed from mnemopi in miniature: `content`, `memory_type` (adopting claude-code's four-way split), `importance`, `veracity`, `superseded_by`. No embeddings in v1 — claude-code proves a frontmatter manifest plus a small-model picker is enough, and rivumi already has a provider abstraction for calling a cheap model.
2. **Write timing**: hook the end of a bounded task in `loop.py`. Only after a run completes and verification passes does one extraction subtask fire, prompted with a single question: "What from this run is worth remembering next time and not derivable from the repo?" Throttling comes for free — no need for claude-code's token-threshold state machine.
3. **Retrieval timing**: when `conversation.py` opens a new conversation, scan the manifest and inject it into the system prompt. No mid-conversation dynamic recall; behavior stays predictable.
4. **Governance**: memory files live under rivumi's artifact directory, with `forget` and `superseded_by` as first-class citizens — wrong memories must be explicitly retractable, which is why the veracity field exists.

## Fitting into the existing architecture

Three deliberate choices here. First, the memory layer sits in rivumi's harness itself, not in any backend: since M13, rivumi drives both native runtimes and external adapters for pi/omp/codex/opencode (external CLIs even run with `--no-session-persistence`), so memory implemented at harness level works uniformly across backends — a structural advantage none of the five has. Second, extraction fires only at task boundaries, consistent with rivumi's append-only, replayable event philosophy: an extraction result is just another event, recoverable by replay if corrupted. Third, refusing embeddings in v1 isn't laziness, it's deferred complexity: once memory volume exceeds what one scannable manifest handles, a vector index enters, and mnemopi's hybrid retrieval is the ready-made blueprint.

## References

- [can1357/oh-my-pi — packages/mnemopi](https://github.com/can1357/oh-my-pi/tree/main/packages/mnemopi) — full source of the SQLite memory engine
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — official repo; memdir/SessionMemory citations come from community-decompiled v2.1.88
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — AGENTS.md loading in `resource-loader.ts`
- [sst/opencode](https://github.com/sst/opencode) — `session/instruction.ts`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/core/src/context/world_state/agents_md.rs`
- [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442) — memory stream and three-factor retrieval
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — tiered memory interfaces
- [agents.md](https://agents.md/) — public convention for AGENTS.md
