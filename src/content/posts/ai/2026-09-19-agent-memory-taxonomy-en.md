---
title: "Four Types of Memory and Six Design Axes: The Design Space of Agent Memory Systems"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, context-engineering, coala, design-taxonomy, ai-agent]
series:
  name: "AI Agent 記憶工程"
  order: 1
lang: en
tldr: "CoALA splits agent memory into working, episodic, semantic, and procedural — but the four-cell taxonomy alone doesn't explain why Claude Code uses Markdown files while Mem0 uses vectors. This post adds six independent design axes (read mode, write timing, fidelity, write authority, forgetting, scope) and a file-to-graph spectrum to map the full design space of agent memory systems in 2026."
description: "From CoALA's four memory types to six design axes and a design-philosophy spectrum, building an analytical framework for any agent memory system."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-agent-memory-taxonomy)

Same problem — an agent needs to remember a user's preferences — and three different answers: Claude Code uses a Markdown file, Mem0 uses a vector database, GitHub Copilot uses KV storage with citation verification. All three are doing "memory," but the underlying design choices are entirely different.

This isn't accidental. Agent memory is a six-dimensional design space, not a single technical problem. This post builds an analytical framework that lets you describe any memory system's design choices and judge whether it fits your scenario.

## Four types of memory: from cognitive science to agent systems

Princeton's CoALA framework ([Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427), TMLR 2024) divides agent memory into four types. This taxonomy has been cited by nearly every subsequent memory system paper and product doc — it's the de facto common vocabulary.

### Working memory: state for current reasoning

Everything inside the context window. Every turn of your conversation with Claude Code, every file it read, every command output — all of it lives here.

System counterparts: the context window itself, LangGraph checkpointer, OpenAI Agents SDK Session, AWS AgentCore events.

Working memory is **bounded and expensive**. Once context fills up, you must compress or discard — exactly the problem discussed in [this series' order 2](/posts/ai/2026-08-21-context-full-seven-answers-en).

### Episodic memory: experiences anchored in time

"In last Tuesday's conversation, the user said their API is deployed in us-east-1" — an experience record carrying a timestamp.

System counterparts: conversation history, Codex rollout summaries, Zep episodes (with `created_at` / `expired_at` temporal edges), AgentCore episodic strategy (including reflection), Letta recall memory.

Episodic memory preserves the "when did this happen" signal, enabling temporal reasoning ("Was that before or after the migration?"), but it also grows without bound over time.

### Semantic memory: facts detached from time

"This user prefers TypeScript." "The company's CI runs on GitHub Actions." — facts extracted from experience, not tied to a specific moment.

System counterparts: LLM-extracted facts (Mem0 memories, Memory Bank topics, ChatGPT Saved memories), entities and relationships in knowledge graphs (Graphiti, Cognee), Claude Code auto memory entries with `type: user` or `type: project`.

The core operation of semantic memory is **extraction** — identifying facts worth keeping from conversations. This extraction is itself an LLM call and introduces errors. According to the Mem0 paper ([2504.19413](https://arxiv.org/abs/2504.19413), ECAI 2025), even in controlled settings, extracted memories score only 66.9–68.4 on the LoCoMo benchmark, below the 72.9 achieved by stuffing the full conversation into context. Extraction trades completeness for space.

For a practical application of semantic memory, see [RAG Personalization: Learning User Preferences from Conversations](/posts/ai/2026-03-12-memory-personalization) (zh-TW only).

### Procedural memory: how to do things

"When you hit a TypeScript type error, run `tsc --noEmit` first." "PR titles use conventional commits format." — not facts, but behavioral rules.

System counterparts: CLAUDE.md / AGENTS.md / GEMINI.md (human-authored rule files), Devin Playbooks, Voyager's skill library, Microsoft Foundry procedural memory, OpenAI sandbox memory's `skills/` directory.

A notable 2026 trend: procedural memory is merging with Skills. Gemini CLI's Auto Memory directly generates SKILL.md candidates, Letta uses skills to replace some memory tools, and the ACE paper ([2510.04618](https://arxiv.org/abs/2510.04618), ICLR 2026) evolves playbooks with a Generator–Reflector–Curator loop. "Learning how to do things" is now treated as equally important as "remembering what happened," and the carrier format is version-controllable skill files.

## The four-cell taxonomy isn't enough

CoALA's four types tell you "what kind of information is this," but not "how does this system handle that information."

Both Mem0 and Claude Code auto memory deal in semantic memory, but Mem0 auto-extracts into a vector store while Claude Code writes Markdown files and lets the agent decide what to remember during a session. Same memory type, radically different design choices.

To describe these differences, you need six independent design axes.

## Six design axes

### Axis 1: Read mode

| Left | Right |
|---|---|
| Always-in-context (injected every turn) | On-demand retrieval (fetched only when needed) |

CLAUDE.md and Letta's core memory blocks are always in context — stable but space-consuming. Mem0 and Memory Bank memories appear only when retrieval matches — space-efficient but might miss relevant items.

Claude Code does both: the `MEMORY.md` index is injected at session start (always-in-context), while topic files are read on demand. This hybrid pattern is becoming the norm.

### Axis 2: Write timing

| Left | Right |
|---|---|
| Hot-path / inline (written during conversation) | Background (batched during idle or offline) |

Mem0's `add()` extracts in real time during conversation. Claude Code's auto memory also writes during the session.

On the other end, Codex Memories explicitly waits until 6 hours of idle time before starting extraction (per the [official docs](https://learn.chatgpt.com/docs/customization/memories), `min_rollout_idle_hours` defaults to 6, range 1–48). OpenAI, Anthropic, and Letta all adopted the term "Dreaming" in early 2026 — referring to offline background memory consolidation, tracing back to Letta's [sleep-time compute](https://arxiv.org/abs/2504.13171) concept.

Background writes avoid response latency impact; the downside is memories always lag behind the latest conversation.

### Axis 3: Fidelity × retrieval

| Left | Right |
|---|---|
| Lossless + exact (files, git) | Lossy + approximate (LLM extraction + vector retrieval) |

File-system memory (CLAUDE.md, Letta MemFS) preserves the original text — you can `grep` it, `git blame` it. Vector memory (Mem0, Memory Bank) runs through LLM extraction then embedding; the original text is gone.

Zep/Graphiti sits in between: it extracts entities and relationships into a knowledge graph but preserves bi-temporal edges (`created_at` / `expired_at` / `valid_at` / `invalid_at`), marking contradicted facts as expired rather than deleting them.

The fidelity choice directly affects debuggability. When file-based memory breaks, you can see why. When vector memory breaks, all you know is "retrieval didn't match."

### Axis 4: Write authority

| Left | Right |
|---|---|
| Agent self-manages | Human review or external process controls |

Claude Code's auto memory lets the agent decide what to remember. Mem0's `add()` is triggered by application code. Both are program-controlled with no human in the loop.

On the other end, Gemini CLI's Auto Memory places memory candidates into an inbox that users must approve. LangSmith Fleet requires per-item approval. Devin's Knowledge Suggestions auto-generate from conversation feedback but still need the user's sign-off.

This axis became especially important in 2026 because memory is a persistent prompt injection attack surface — the MINJA paper ([2503.03704](https://arxiv.org/abs/2503.03704), NeurIPS 2025) demonstrated that conversation alone can inject memories with >95% success rate. More automatic writing means a larger attack surface. This series' order 8 will dive deeper.

### Axis 5: Forgetting mechanism

| Left | Right |
|---|---|
| Hard delete (immediate removal) | Temporal expiry (preserves history but marks as expired) |

In 2025, most systems only had "manual delete." By 2026, multiple forgetting mechanisms have emerged:

- **TTL / unused expiry**: Copilot deletes memories not JIT-verified in 28 days; Codex discards after 30 days unused
- **Temporal expiry**: Graphiti's bi-temporal edges automatically expire old facts while preserving history
- **Ranking decay**: Mem0's recency decay demotes old memories in retrieval ranking
- **Re-synthesis overwrite**: Dreaming background consolidation produces new memory versions, overwriting old ones
- **Hard delete**: Mem0's `delete` / `batch_delete` / `delete_all`

But no system has implemented the Ebbinghaus-style forgetting curve proposed by the MemoryBank paper ([2305.10250](https://arxiv.org/abs/2305.10250), AAAI 2024) — dynamically adjusting decay rate based on access frequency.

### Axis 6: Scope

| Left | Right |
|---|---|
| Per-thread (single conversation) | Per-org (entire organization shares) |

```
per-thread → per-session → per-user → per-project → per-agent → per-org
```

Claude Code's auto memory is per-project (scoped to a repo) and doesn't cross users. GitHub Copilot has repo-level memory (shared by contributors with write access) plus user-level preferences. Devin's Knowledge is org-scoped. AWS AgentCore uses namespace templates `{actorId}/{sessionId}/{memoryStrategyId}` plus up to 5 custom keys, with IAM condition keys for tenant isolation.

Cross-user/team sharing is a 2026 watershed: Copilot repo-level memory, Devin org Knowledge, Gemini CLI's repo GEMINI.md via git, and Supermemory Company Brain all move toward sharing; consumer products (ChatGPT / Claude.ai) remain strictly personal.

## The design-philosophy spectrum

The six axes are analytical tools, but in practice the most common question is simpler: **who controls the shape of memory?**

From left (human-readable, version-controllable files) to right (fully automated vector/graph extraction, humans can't see the intermediate state):

```
Files as memory                                         Fully automated vector / graph memory
(human-readable, git-manageable) ◄──────────────────► (auto-extracted, opaque intermediates)
```

| Position | Representative products | Characteristic |
|---|---|---|
| Far left | CLAUDE.md / AGENTS.md / GEMINI.md, Devin Playbooks, Cursor Rules | Purely human-written procedural memory; goes into git and code review |
| Left | Claude Code auto memory, Codex Memories, OpenAI sandbox memory, Letta MemFS | Agent-written, human-readable/editable Markdown; Letta is even git-backed |
| Center-left | Gemini CLI Auto Memory inbox, LangSmith Fleet, Devin Knowledge Suggestions | Agent proposes, human approves before it takes effect |
| Center | GitHub Copilot Memory, Anthropic memory tool | Structured entries with citations or file semantics; source-verifiable |
| Center-right | LlamaIndex Memory blocks, LangGraph Store, Foundry memory, ChatGPT / Claude.ai memory | LLM-extracted facts; users can see and edit results but can't see the extraction process |
| Right | Mem0, Memory Bank, AgentCore, Supermemory | Auto-extraction + consolidation + vector retrieval; dashboard/API manageable |
| Far right | Zep / Graphiti, Cognee, MemOS | Auto-built graphs (entities / relationships / temporal edges); humans rarely edit memory content directly |

A surprising 2026 trend: **the mainstream is moving left.** The 2024–2025 narrative was "vector/graph memory replaces context," but OpenAI, Anthropic, Letta, and LangChain all independently chose Markdown files + index + progressive disclosure in early 2026. Reasons: human-readable and auditable, fits into git, compatible with prompt caching, no extra infrastructure needed. Vector/graph memory hasn't disappeared, but it has retreated to a "pluggable backend" role. This series' order 9 will analyze this trend in detail.

## How to use this framework

Next time you evaluate a memory system, try filling out this card:

```
System:       ___
Memory types: working / episodic / semantic / procedural (multi-select)
Read mode:    always-in-context ←→ on-demand
Write timing: hot-path ←→ background
Fidelity:     lossless ←→ lossy
Write auth:   agent self-manages ←→ human review
Forgetting:   hard delete / TTL / temporal expiry / decay / overwrite / none
Scope:        per-thread / session / user / project / agent / org
Spectrum:     files ←————→ vector/graph
```

The same product can land at different positions on different axes. For example, Claude Code: read mode is both always-in-context (MEMORY.md index) and on-demand (topic files read as needed); write timing is hot-path (auto-writes during session); fidelity is lossless (Markdown files); write authority is agent self-manages; forgetting is none; scope is per-project.

This is not a scorecard — no position is objectively better. File-based memory suits scenarios requiring auditability and debuggability (coding agents); vector memory suits scenarios needing large-scale semantic retrieval (customer service agents facing thousands of users). The framework's value is making you aware these choices exist, not making the choice for you.

The rest of this series uses this framework to analyze: [short-term context management](/posts/ai/2026-08-21-context-full-seven-answers-en), coding agents' long-term memory design, cloud platform memory APIs, open-source framework selection, and memory security.

## References

- [CoALA: Cognitive Architectures for Language Agents (arXiv 2309.02427, TMLR 2024)](https://arxiv.org/abs/2309.02427)
- [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory (arXiv 2504.19413, ECAI 2025)](https://arxiv.org/abs/2504.19413)
- [MINJA: Memory Injection Attacks on LLM Agents (arXiv 2503.03704, NeurIPS 2025)](https://arxiv.org/abs/2503.03704)
- [MemoryBank: Enhancing LLMs with Long-Term Memory (arXiv 2305.10250, AAAI 2024)](https://arxiv.org/abs/2305.10250)
- [ACE: Agentic Context Engineering (arXiv 2510.04618, ICLR 2026)](https://arxiv.org/abs/2510.04618)
- [Sleep-time Compute (arXiv 2504.13171)](https://arxiv.org/abs/2504.13171)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory (arXiv 2501.13956)](https://arxiv.org/abs/2501.13956)
- [Claude Code Memory — official docs](https://code.claude.com/docs/en/memory)
- [Codex Memories — official docs](https://learn.chatgpt.com/docs/customization/memories)
- [GitHub Copilot Memory concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Building an agentic memory system for GitHub Copilot — GitHub Engineering](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Gemini CLI Auto Memory — official docs](https://geminicli.com/docs/cli/auto-memory)
- [Devin Knowledge — official docs](https://docs.devin.ai/product-guides/knowledge)
- [AWS AgentCore Memory developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [Memory for agents — LangChain blog](https://blog.langchain.com/memory-for-agents/)
- [RAG Personalization: Learning User Preferences from Conversations](/posts/ai/2026-03-12-memory-personalization) (zh-TW only)
- [Seven Answers to a Full Context Window, and No Consensus](/posts/ai/2026-08-21-context-full-seven-answers-en) (in this series)
