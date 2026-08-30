---
title: "AI Agent GitHub Digest — 2026-08-28"
date: 2026-08-28
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, agent-runtime]
lang: en
description: "Agent 'memory layers' filled two gaps at once today — claude-mem and OpenViking attack the amnesia problem from opposite directions, and the Apache Foundation adopts its first agent execution-log project"
tldr: "thedotmack/claude-mem lets context survive across sessions via compressed memory, crossing 90K stars; volcengine/OpenViking unifies memory, RAG, and skills into a virtual filesystem browsable over the viking:// protocol, up 3,078 stars this week; apache/maka enters the Apache Incubator, turning an agent's execution history into a replayable event-sourcing log; K-Dense-AI/scientific-agent-skills lets 175,000 scientists turn a general coding agent into a domain expert with 163 skills. Haystack v3.1.0 adds AgentTool for multi-agent delegation."
series:
  name: "AI Agent GitHub Digest"
  order: 13
---

> 🌏 [中文版](/posts/daily/2026-08-28-ai-agent-github-digest)

## Today's Highlights

Today's biggest theme is agent "memory/context" infrastructure filling gaps — claude-mem and OpenViking both attack the same pain point (an agent forgets what it was doing the moment its context gets compacted), one building a cross-tool memory plugin and the other a standalone context database. Meanwhile the Apache Software Foundation adopted its first agent execution-log project (apache/maka), pulling this infrastructure layer into the same governance process that incubated Kafka and Spark.

## Trending Repos

### thedotmack/claude-mem ⭐ 92,171

[GitHub](https://github.com/thedotmack/claude-mem) · TypeScript · Apache-2.0

- **What it is**: a plugin that gives coding agents like Claude Code, Codex, and Gemini CLI "cross-session memory" — when a session ends, it automatically compresses tool calls and conversation into semantic summaries stored in a local database, then injects them back into context on the next startup.
- **Why it's worth a look**: agent CLI tools have no long-term memory on their own — every time you reopen a terminal, or every time context gets compacted, whatever project understanding the agent had built up is gone. claude-mem solves this at the hook layer without replacing the underlying agent, and it supports seven or eight mainstream CLIs at once — Claude Code, OpenClaw, Codex, Gemini, Hermes, Copilot, OpenCode, and more — effectively turning memory into a shared cross-tool layer. Over 90K stars and 8,000+ forks show just how widespread this pain point is.
- **Tech Stack**: TypeScript + ChromaDB vector storage + SQLite
- **Getting Started**: Low — `npx claude-mem install` sets it up on Claude Code in one command, and OpenCode, Antigravity, and other CLIs have their own install flags too.

---

### volcengine/OpenViking ⭐ 33,902 (+3,078 this week)

[GitHub](https://github.com/volcengine/OpenViking) · Go + Rust + TypeScript · AGPL-3.0

- **What it is**: an "agent context database" open-sourced by ByteDance's Volcengine, folding memory, knowledge base (RAG), and skills into a single virtual filesystem called `viking://`, letting an agent browse its own context with `ls`, `tree`, and `find` instead of querying an opaque vector store.
- **Why it's worth a look**: most agent memory schemes (embedding + vector retrieval) are opaque to the agent itself — it only gets back retrieval results, never sees how its memory is organized. OpenViking makes the memory structure explicit as a file tree, letting the agent actively explore and organize its own context the way it would operate a filesystem — the same direction as the "filesystem as context" idea circulating in agent harness circles lately, except OpenViking builds it as infrastructure independent of any single harness. Up 3,078 stars this week, among the fastest-growing projects in this category.
- **Tech Stack**: Go + Rust core with Python/TypeScript SDKs
- **Getting Started**: Medium — requires standing up your own context-database service; documentation is currently mostly in Chinese, with English/Japanese docs still being filled in.

---

### apache/maka ⭐ 2,552 (steady growth since entering Apache Incubator)

[GitHub](https://github.com/apache/maka) · TypeScript + Rust · Apache-2.0

- **What it is**: a local-first agent workspace that entered the Apache Incubator on 8/13, writing every model message, tool call, tool result, and permission decision to an append-only log — using event sourcing to make the entire agent execution history replayable and auditable.
- **Why it's worth a look**: this is the first agent-runtime project to enter the Apache Foundation's incubator — this kind of "agent execution log" infrastructure has previously lived in personal repos or startups. Maka pulls it into the same governance process that incubated Kafka, Spark, and Airflow. The core design principle is that a model's memory can be lossy (context gets compacted), but the workspace's record cannot be — you can search it, retry from it, or branch a new session off any point in the log, and precisely audit which permission decision authorized which tool call.
- **Tech Stack**: TypeScript + Rust (Electron desktop shell + Rust sandbox boundary) + SQLite
- **Getting Started**: Medium — currently only a public desktop build for macOS Apple Silicon; data format and CLI commands are still in flux.

---

### K-Dense-AI/scientific-agent-skills ⭐ 34,790 (+498 today)

[GitHub](https://github.com/K-Dense-AI/scientific-agent-skills) · Python · MIT

- **What it is**: packages 163 "common scientist workflows" (running bioinformatics analysis, looking up drug interactions, computing material properties) into the standard Agent Skills format, plus wrappers for access to 100+ scientific databases, turning general coding agents like Claude Code, Cursor, and Codex into instant domain experts.
- **Why it's worth a look**: this is one of the first vertical applications of the Agent Skills standard to reach "175,000 scientists actively using it" scale, proving the skills mechanism isn't just for programmers writing code — package domain knowledge and tool calls correctly, and the same agent can cross straight into biology, chemistry, or drug development. For teams building scientific tooling, this is a live case study in how to design skills that people actually use.
- **Tech Stack**: Python + the Agent Skills standard (agentskills.io spec)
- **Getting Started**: Low — `pip install`, or drop the skills directory straight into Claude Code's or Cursor's skills folder.

## Notable Releases

### Haystack v3.1.0

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)

- **Key changes**: adds `AgentTool`, which wraps a Haystack `Agent` as a `Tool` another `Agent` can call (only the final reply is visible to the caller, so intermediate steps don't flood the caller's context); `Agent` gains an `exit_reason` output that clearly reports whether it exited via a text reply, a tool triggering an exit condition, or hitting `max_agent_steps`; and a new `HAYSTACK_UNSAFE_DESERIALIZATION` environment variable that can disable deserialization safety checks for an entire process at once.
- **Breaking Changes**: `exit_reason` is now a reserved `Agent` state key — if a custom `state_schema` also uses that name, initialization now raises a `ValueError`; `agent.state_schema` now returns the raw schema as passed in, no longer including internally managed fields, so reading the full schema requires the new `agent.resolved_state_schema`.
- **What it means for you**: if your pipeline stores custom_filters for deserialization, upgrading means either keep passing `unsafe=True` at `load` time as before, or evaluate whether to flip the process-wide `HAYSTACK_UNSAFE_DESERIALIZATION` switch — the latter unconditionally trusts and executes any tool/agent state passed in by a caller, expanding the deserialization attack surface from "at load time" to "at request time," a point the official release notes specifically flag as a warning.

---

### GitHub MCP Server 1.11.0

[Release Notes](https://github.com/github/github-mcp-server/releases/tag/v1.11.0)

- **Key changes**: OAuth authorization now does per-call scope checks, so each tool call only requests the GitHub permissions it actually needs; fixed CORS issues with browser OAuth and made the authorization server URL configurable; added an atomic "create parent issue + sub-issue in one call" operation; STDIO transport now also supports HTTP ETag conditional requests, cutting down redundant data transfer.
- **Breaking Changes**: none — officially flagged as a feature and compatibility enhancement, non-breaking.
- **What it means for you**: if your agent workflow uses GitHub MCP Server to manage issues and PRs, this release tightens "each tool call gets only the minimum permission it needs" even further, automatically shrinking the agent's attack surface; anyone running local integrations over STDIO can also shave off some latency via ETag caching.

## Today's Takeaway

I used to assume agent memory/context would stay a fragmented "everyone wires up their own vector database" situation indefinitely. But today claude-mem and OpenViking demonstrated two converging paths at once — one a cross-tool memory plugin, the other a context database independent of any single harness — showing this layer is growing toward having its own product form, rather than staying forever parasitic as an internal module inside each agent framework.

## References

- [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- [volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- [apache/maka](https://github.com/apache/maka)
- [Apache Maka: Agent Infrastructure Grows Up — Clauday](https://clauday.com/article/e8ce3356-f853-47d0-b666-2fd2d0dfb313)
- [Apache Maka Project Incubation Status — Apache Incubator](https://incubator.apache.org/projects/maka.html)
- [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)
- [Haystack v3.1.0 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)
- [GitHub MCP Server 1.11.0 Release Notes](https://github.com/github/github-mcp-server/releases/tag/v1.11.0)
