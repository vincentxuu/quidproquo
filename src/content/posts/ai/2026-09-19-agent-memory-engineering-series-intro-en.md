---
title: "Series Guide: AI Agent Memory Engineering"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, context-engineering, ai-agent, series-intro]
lang: en
tldr: "Agent memory is not one feature — it is at least four distinct engineering problems: working, episodic, semantic, and procedural. This ten-part series walks through the full design space, from taxonomy to coding agent implementations, platform APIs, open-source frameworks, security attack surfaces, and 2026 trend analysis."
description: "Series guide for AI Agent Memory Engineering: why memory is the core challenge in agent engineering, what each of the ten posts covers, and suggested reading order."
series:
  name: "AI Agent 記憶工程"
  order: 0
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)

You spend an afternoon coding with Claude Code and tell it to remember that "this repo uses pytest, not unittest." The next day you open a new session, and it asks what test framework you prefer.

You chat three rounds with your company's customer service bot and mention you are on the enterprise plan. On the fourth round you ask about billing, and it replies: "Which plan are you on?"

Your coding agent fixes five bugs perfectly in one session, but the fix for the sixth overwrites the third. The earlier conversation is still in context — but the context is so long that the model's attention has scattered.

These are three different ways agent memory breaks:

1. **Cross-session amnesia** — what it learned last time is gone next time
2. **Within-session forgetting** — information mentioned earlier in the same conversation gets dropped
3. **Memory interference** — the information is there, but buried under so much context that it produces incorrect behavior

They have different root causes and different solutions. Stuffing everything into the context window is not the answer — [Chroma's 2025 controlled study](https://research.trychroma.com/evaluating-chunking) showed that even when it fits, a full context degrades model performance. And according to [Princeton's CoALA framework](https://arxiv.org/abs/2309.02427) (TMLR 2024), agent memory needs to be designed across at least four categories: working (current reasoning state), episodic (time-specific experiences), semantic (time-independent facts), and procedural (knowledge of how to do things).

This series covers the full design space of agent memory in ten posts.

## Series roadmap

| # | Topic | What you get |
|---|---|---|
| **0 (this post)** | Series guide | Problem framing and reading map |
| **1** | Four memory types and six design axes | A taxonomy — CoALA's four memory categories and six independent design axes (retrieval mode, write timing, fidelity, write-access ownership, forgetting mechanism, scope) for describing any memory system's design choices |
| **2** | [Seven Answers to a Full Context Window, and No Consensus](/en/posts/ai/2026-08-21-context-full-seven-answers-en) | Short-term memory (working memory) — comparing context management strategies across Anthropic, Amp, Cursor, Manus, and five other vendors |
| **3** | How six coding agents remember things | Long-term memory, tool side — memory design and trade-offs in Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot, and Devin |
| **4** | Memory APIs across five clouds | Long-term memory, platform side — dissecting OpenAI Agents SDK, Anthropic Managed Agents, Google Memory Bank, AWS AgentCore, and Microsoft Foundry |
| **5** | Choosing an open-source memory framework | Long-term memory, open-source side — positioning and selection criteria for Mem0, Zep/Graphiti, Letta, LangGraph, LlamaIndex Memory, Cognee, and Supermemory |
| **6** | [Mem0 Complete Guide](/en/posts/ai/2026-08-22-mem0-agent-memory-en) | Deep dive — representative of the vector-extraction approach, from write pipeline to tenant isolation |
| **7** | [OpenViking: Agent Memory as a Virtual Filesystem](/en/posts/ai/2026-08-22-openviking-agent-memory-en) | Deep dive — representative of the filesystem approach, three-tier loading averaging 550 tokens per retrieval |
| **8** | The attack surface of agent memory | Security — SpAIware persistent exfiltration, MINJA conversational injection (>95% success rate), Bedrock memory poisoning, and the two defensive approaches the industry has adopted |
| **9** | Where agent memory systems are headed in 2026 | Trends — files beating vectors, write access returning to humans, Dreaming as the new keyword, and the reality of broken benchmarks |

## Reading suggestions

**In order**: Posts 0–9 follow a designed learning arc — first acquire the taxonomy (1), then walk through short-term to long-term memory (2–5), deep-dive into two representative systems (6–7), and finally consider security and trends (8–9).

**Skip around**: If you already know the memory categories, jump to the layer you care about:
- **Using** a coding agent → post 3
- **Building** an agent application → posts 4, 5
- **Choosing** a memory framework → posts 5, 6, 7
- **Evaluating** security risks → post 8
- **Tracking** where things are going → post 9

## What this series does not cover

- RAG retrieval strategies and chunking details — that is a separate topic; for where personalized RAG intersects with memory, see [RAG Personalization: Learning User Preferences from Conversations](/en/posts/ai/2026-03-12-memory-personalization-en)
- Model-architecture-level memory (Titans, MIRAS, and similar research on building memory modules inside the model) — this series focuses on system-level memory engineering
- Low-level session persistence (JSONL formats, crash recovery) — that is covered in [Session Persistence and Crash Recovery](/en/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery-en)

## A spoiler

The most surprising trend in agent memory in 2026 is the **shift toward files**. The 2024–2025 narrative was "vector databases and knowledge graphs will replace the context window," but OpenAI (Codex Memories, sandbox memory), Anthropic (auto memory, memory tool), and Letta (Context Repositories) all independently chose Markdown files plus an index plus progressive disclosure in the first half of 2026. The reasons are practical: human-readable and auditable, compatible with git, friendly to prompt caching, no extra infrastructure required.

Vector and graph memory have not disappeared, but they have retreated to the role of pluggable backends. That story deserves a full analysis — which is what post 9 is for.

Start with the taxonomy in post 1.

## References

- [CoALA: Cognitive Architectures for Language Agents (arXiv 2309.02427, TMLR 2024)](https://arxiv.org/abs/2309.02427)
- [Chroma — Evaluating Chunking Strategies for Retrieval (2025)](https://research.trychroma.com/evaluating-chunking)
- [MINJA: Memory Injection Attacks on LLM Agents (arXiv 2503.03704, NeurIPS 2025)](https://arxiv.org/abs/2503.03704)
- [SpAIware: Persistent Data Exfiltration via ChatGPT Memory — Johann Rehberger (2024-09)](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
- [Anthropic — Effective context engineering for AI agents (2025-09)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI — Building reliable agents: memory & compaction cookbook (2026-05-01)](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)
- [Letta — Context Repositories / Next Phase blog (2026-02/03)](https://www.letta.com/blog)
- [Seven Answers to a Full Context Window](/en/posts/ai/2026-08-21-context-full-seven-answers-en)
- [Mem0 Complete Guide](/en/posts/ai/2026-08-22-mem0-agent-memory-en)
- [OpenViking: Agent Memory as a Virtual Filesystem](/en/posts/ai/2026-08-22-openviking-agent-memory-en)
- [RAG Personalization: Learning User Preferences from Conversations](/en/posts/ai/2026-03-12-memory-personalization-en)
- [Session Persistence and Crash Recovery](/en/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery-en)
