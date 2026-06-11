---
title: "The Memory Problem in Agentic Engineering: Types, Implementation, and Ownership"
date: 2026-04-20
type: guide
category: ai
tags: [agentic-engineering, memory, langmem, agent-harness, context-engineering, multi-agent]
lang: en
tldr: "Agent memory isn't a plugin — it's part of the harness itself. Pick the right memory type, estimate data volume, then decide on the technology. And finally, figure out whether you actually own that memory."
description: "Starting from three memory types — Procedural, Episodic, and Semantic — this guide breaks down memory implementation options in Agentic Engineering, including LangMem's strengths and weaknesses, memory volume estimation, and the ownership question of open-source vs. closed harnesses."
draft: false
series:
  name: "AI Agent 實戰"
  order: 7
---

> 🌏 [中文版](/posts/ai/2026-04-20-agentic-engineering-memory)

Cisco engineers published a post on the LangChain blog this April describing how they used a multi-agent collaboration system to reduce debug workflow time-to-root-cause by 93%, saving over 200 person-hours per month. Their tech stack: LangGraph + LangSmith + LangMem.

The most commonly overlooked piece is **LangMem**. People see the impressive numbers and jump straight to LangGraph, but the memory system is what enables agents to accumulate knowledge across sessions. Without it, every invocation starts with amnesia.

This post aims to walk through the memory problem in Agentic Engineering from scratch — from types, to implementation, to a more fundamental question: **do you actually own this memory?**

---

## Which Layer Does Memory Live In?

LangChain founder Harrison Chase proposed a clear three-layer model in a recent article:

```
Model Layer    → The model weights themselves (requires fine-tuning to change)
Harness Layer  → The code and fixed instructions driving the agent
Context Layer  → Externally configurable instructions and memory  ← what most people mean by "memory"
```

Using Claude Code as an example:
- **Model**: claude-sonnet
- **Harness**: Claude Code itself (512k lines when the source code leaked)
- **Context**: CLAUDE.md, /skills, mcp.json

Most "memory implementations" are solving problems at the **Context Layer**, not Model or Harness. Memory at this layer can be read, written, and evolved over time — which is exactly why tools like LangMem exist.

---

## Three Types of Memory

Before deciding on technology, first clarify what you need to store:

| Type | What It Is | Example | Suitable Retrieval Method |
|------|-----------|---------|--------------------------|
| **Procedural** | Behavioral rules and preferences | "This repo doesn't use mocks", CLAUDE.md | Load entirely into system prompt |
| **Episodic** | Timestamped events | "Last debug result was DB timeout" | Recency + relevance |
| **Semantic** | Decontextualized facts | "This team uses Postgres" | Semantic similarity |

These three types have completely different update frequencies and lifecycles:
- **Procedural**: Small in number, long-lasting, almost never expires
- **Episodic**: Generated quickly, decays after 30-90 days
- **Semantic**: Medium volume, updated only when superseded by new information

---

## Implementation Options Comparison

| Approach | Suitable Memory Types | Complexity | Ownership |
|----------|----------------------|-----------|-----------|
| **Plain text files** (CLAUDE.md / progress.txt) | Procedural | Lowest | Full |
| **Redis / KV store** | Episodic (short-term) | Low | Full |
| **Postgres + pgvector** | All three | Medium | Full |
| **LangMem** | All three | Low (pre-packaged) | Full (swappable backend) |
| **Closed APIs** (Claude Managed Agents, etc.) | All three | Lowest | **Not owned** |

The decision comes down to just two questions:

**How much memory?**
- A few hundred entries or less → Plain text or Redis is sufficient
- Tens of thousands or more → Vector search is needed

**Do you need semantic understanding?**
- "Find past cases similar to this bug" → Vector search needed
- "Find the last run log for this repo" → Key-value is enough

---

## Memory Volume Estimation

Estimation across three dimensions:

**Per-entry size**
- Procedural: 100-500 bytes
- Episodic: 1-5 KB
- Semantic: 500B-2 KB

**Generation rate** (conservative estimate)
```
100 DAU × 3 sessions/user × 5 entries/session
= 1,500 entries/day = 45,000 entries/month
```

**Vector storage conversion**
```
1 memory entry ≈ 1 vector (1536 dimensions) = 6 KB (vector) + 2 KB (original text) ≈ 8 KB
500K entries = 4 GB
```

At this scale, pgvector is more than sufficient — no need for dedicated vector DBs like Pinecone or Qdrant.

**The most commonly overlooked problem isn't storage space — it's retrieval precision degrading as volume grows.** Once memory exceeds 10K entries, vector search results start mixing in irrelevant memories. At that point you need:
- Metadata filters (restrict by user_id, time range)
- Memory decay (reduce weight of older Episodic memories)
- Summary compression (merge multiple Episodic entries into a single Semantic one)

---

## What Does LangMem Solve?

LangMem is an open-source library (Apache 2.0, free) that is essentially **a wrapper around vector DB + automatic summarization**.

What it handles for you:
- Semantic search (built-in vector store, swappable backend)
- Automatic deduplication and merging
- LLM-powered automatic memory extraction from conversations
- Compressing multiple Episodic entries into Semantic ones

What it doesn't handle:
- Metadata filter schema design (you have to do this yourself)
- Memory decay weighting (no built-in mechanism)
- Consistency issues with concurrent multi-agent writes

**Practical scale**: For under 50K entries with a single user/agent, LangMem works out of the box. Beyond that volume or with multi-tenancy, you need to build governance logic on top.

On cost, LangMem itself is free, but it calls an LLM to extract memories at the end of each session:

```
100 users × 3 sessions/day × ~1K tokens/call
= 300K tokens/day
≈ ~$0.1/day with Claude Haiku
```

Using a cheap model for memory extraction and an expensive model for the main task is standard practice.

---

## When to Update Memory

Memory isn't just passively stored and retrieved — it can actively evolve:

**Online updates (hot path)**: The agent decides to update memory mid-execution. Suitable for Episodic (real-time events).

**Offline updates (offline job)**: Batch-extract insights after processing a set of traces. Suitable for Procedural (rule updates). OpenClaw calls this "Dreaming" — the agent automatically reviews its history during idle time, updates its long-term memory, and starts smarter next time.

---

## The Memory Ownership Problem

This is the core warning Harrison Chase raised in "Your harness, your memory," and the point most easily overlooked:

> "Memory isn't a plugin — it's part of the harness itself."

Here's the problem:
- Use **Claude Managed Agents** (Anthropic API) → Memory lives entirely on Anthropic's servers; you can't see it or take it with you
- Use **Codex** (OpenAI) → Compressed summaries are encrypted; unusable outside the OpenAI ecosystem
- Use **open-source harness** (LangGraph + self-hosted store) → Memory is entirely in your hands

This isn't just a technical choice — it's a business decision. Memory is the asset that makes agents better over time; it's the accumulation of your users' preferences, work habits, and past decisions. **Putting this asset on someone else's platform means handing them your deepest lock-in leverage.**

Closed APIs get you started quickly, but your memory is locked in. Open-source harnesses require self-maintenance, but the memory truly belongs to you.

---

## The Big Picture

The memory problem in Agentic Engineering doesn't end with picking a memory library.

The correct order of thinking is:

1. **Determine memory types**: Do you need to store rules (Procedural), events (Episodic), or facts (Semantic)?
2. **Estimate data volume**: A few hundred entries work with text files; tens of thousands and above need vector search
3. **Choose an implementation**: LangMem is a good starting point, but not the finish line
4. **Consider ownership**: The harness you choose determines how much control you have over your memory

Memory makes agents better over time — but only if you truly own it.

---

## References

- [Agentic Engineering: How Swarms of AI Agents Are Redefining Software Engineering](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [Your harness, your memory — Harrison Chase](https://www.langchain.com/blog/your-harness-your-memory)
- [Continual learning for AI agents — Harrison Chase](https://www.langchain.com/blog/continual-learning-for-ai-agents)
- [Building effective agents — Anthropic](https://www.anthropic.com/research/building-effective-agents)
