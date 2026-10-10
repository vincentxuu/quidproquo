---
title: "AI Agent GitHub Digest — 2026-10-11"
date: 2026-10-11
category: daily
tags: [ai-agent, github, open-source, daily, mcp-server, agent-platform, model-inference]
lang: en
description: "Appwrite repositions itself as a cloud built for agents, and sglang's trending run shows agentic workloads are now a first-class optimization target for inference frameworks; Agno v3.1.2 ships conversation compaction and a Codex adapter"
tldr: "appwrite/appwrite (57,624★) pivots from a developer backend-as-a-service to a cloud that exposes an MCP interface agents can call directly. DeusData/codebase-memory-mcp (46,293★) replaces embedding-based RAG with an AST-plus-knowledge-graph MCP server that indexes an entire codebase into a single queryable binary. Yeachan-Heo/oh-my-claudecode (39,768★) bolts the multi-agent team orchestration layer Claude Code doesn't ship natively. sgl-project/sglang (36,965★) is trending because agentic workloads — not single-turn chat — are now what inference frameworks optimize for first. Agno v3.1.2 adds Conversation Compaction to fold old turns into a summary, plus a new Codex External Agent adapter."
series:
  name: "AI Agent GitHub Digest"
  order: 57
---

> 🌏 [中文版](/posts/daily/2026-10-11-ai-agent-github-digest)

## Today's Highlight

Three of today's four repos are infrastructure-layer moves: Appwrite repositioned itself from a developer backend into a "cloud for agents," codebase-memory-mcp swaps embedding-based RAG for a knowledge graph to index source code, and sglang's inference framework is now optimizing for agentic workloads instead of single-turn chat. Only oh-my-claudecode sits at the application layer, as a multi-agent orchestration tool. Infrastructure vendors are starting to actively redesign their interfaces for agents, rather than just waiting to be called.

## Trending Repos

### appwrite/appwrite ⭐ 57,624

[GitHub](https://github.com/appwrite/appwrite) · TypeScript · BSD-3-Clause

- **What it is**: Originally an open-source backend-as-a-service for developers (Auth, Database, Storage, Functions, Messaging, Realtime), now repositioned as "the open-source cloud for agents and developers," exposing an MCP interface so AI agents can call the same services directly.
- **Why it matters**: Most agent frameworks (LangGraph, CrewAI, and the like) still require you to wire up your own database, auth, and file storage. Appwrite packages that infrastructure and layers MCP on top, so an agent can just call "create this user" or "store this file" without first learning each service's SDK — removing one layer of "what backend do I pick" decision-making for anyone prototyping an agent SaaS.
- **Tech stack**: Appwrite's own Function runtime + an MCP gateway + multi-language SDKs
- **Getting started**: Medium — self-hosting needs Docker/Kubernetes, but Appwrite's cloud offering lets you connect directly without running your own infrastructure.

---

### DeusData/codebase-memory-mcp ⭐ 46,293

[GitHub](https://github.com/DeusData/codebase-memory-mcp) · C · MIT

- **What it is**: An MCP server that indexes an entire codebase into a persistent knowledge graph, with sub-millisecond queries across 158 languages, shipped as a single static binary with zero dependencies — the project claims a 99% reduction in tokens versus dumping raw source files straight into context.
- **Why it matters**: Most "codebase RAG" tools make you stand up your own vector database and manage an embedding pipeline. This one replaces embedding-based retrieval with AST parsing (via tree-sitter) plus knowledge-graph queries, and ships as one binary you just run — a more direct fix for coding-agent users who don't want to maintain extra infrastructure.
- **Tech stack**: Tree-sitter AST parsing + a knowledge graph queried with Cypher + SQLite storage, all in a single C binary
- **Getting started**: Low — download the binary for your platform, run the install script, and register it as an MCP server in Claude Code, Cursor, Codex, or similar.

---

### Yeachan-Heo/oh-my-claudecode ⭐ 39,768

[GitHub](https://github.com/Yeachan-Heo/oh-my-claudecode) · TypeScript · MIT

- **What it is**: A multi-agent orchestration layer for Claude Code built around a "teams-first" model — a single task can be split across multiple sub-agents running in parallel — with a companion oh-my-codex project for Codex users.
- **Why it matters**: Claude Code's native subagent mechanism requires you to hand-write the configuration for any team-style workflow. This project packages ready-made team templates and parallel-execution logic, and has grown to nearly 40k stars in about nine months — a sign that "add multi-agent orchestration on top of Claude Code" is itself a sizeable demand.
- **Tech stack**: TypeScript, packaged as an npm module wrapping Claude Code's subagent/hook API
- **Getting started**: Low — install globally via npm and run a single setup command to get going.

---

### sgl-project/sglang ⭐ 36,965

[GitHub](https://github.com/sgl-project/sglang) · Python · Apache-2.0

- **What it is**: An open-source inference framework for LLMs and multimodal models, optimized for agentic workloads, large-scale serving, and RL rollouts, with a built-in SGLang Diffusion engine for image and video generation.
- **Why it matters**: Its return to Trending reflects how "agentic workloads" — large numbers of parallel, short requests with long-context caching — have become a priority optimization target for inference frameworks, rather than the single-turn chat pattern they were originally built for. It's one of the few inference engines, alongside vLLM, seeing heavy production adoption at this scale.
- **Tech stack**: Python + a custom RadixAttention prefix cache + CUDA kernel optimizations
- **Getting started**: Medium — `uv pip install sglang` gets a single machine running, but getting full performance typically needs a GPU cluster.

## Notable Releases

### Agno v3.1.2

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.2)

- **What changed**: Adds Conversation Compaction (`Agent(compaction=True)`), which folds older turns of a long conversation into a summary stored in a new `agno_compactions` table — the original messages are never rewritten, so the full conversation can always be restored. Adds `CodexAgent`, an adapter that brings OpenAI Codex in as an external agent alongside the existing Claude Agent SDK, LangGraph, and DSPy adapters. Adds a `HyDE` query transformer that searches a knowledge base using a hypothetical answer instead of the raw question. Adds `AgentOS(cors=CORSConfig(...))`, applying one CORS policy across preflight requests, public run/cancel endpoints, WebSockets, and MCP aliases.
- **Breaking Changes**: None listed explicitly — both Compaction and the new adapters are opt-in additions that leave default behavior unchanged.
- **Impact for you**: If your agent sessions keep running into context-window limits, Compaction solves it without writing your own summarization logic. If your team uses both Claude Code and Codex, the CodexAgent adapter lets you call both through the same Agno interface.

## Today's Takeaway

I used to assume most innovation in the agent ecosystem happened at the application layer — new frameworks, new skills. But three of today's four trending repos are actually infrastructure-layer moves: a database backend, a codebase index, and an inference engine are all redesigning their own interfaces for agents. Infrastructure vendors aren't just waiting for agents to call them anymore — they're treating MCP and agent workloads as a first-class target to optimize for.

## References

- [appwrite/appwrite](https://github.com/appwrite/appwrite)
- [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)
- [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)
- [sgl-project/sglang](https://github.com/sgl-project/sglang)
- [Agno v3.1.2 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.2)
