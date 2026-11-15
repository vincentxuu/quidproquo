---
title: "AI Agent GitHub Digest — 2026-11-03"
date: 2026-11-03
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, mcp, model-serving]
lang: en
description: "Memory layer expands to almost every coding agent, parallel worktrees stop tangling, Unreal Editor becomes an MCP toolset, and a 290B model squeezes onto a gaming GPU — today's four repos each patch a different layer of agent infrastructure"
tldr: "thedotmack/claude-mem (⭐110k) is a persistent memory-compression system for agents; today's update is less a feature than reach — it now supports Grok Bot, T3 Code, Antigravity CLI, OMP, Pi, and DeepSeek Harness, covering nearly every coding agent you can name. max-sixty/worktrunk (⭐9.9k) is a Rust CLI that collapses git worktree management into three commands, fixing the friction of typing a branch name three times just to spin up a new workspace for a parallel agent. db-lyon/ue-mcp (⭐466) exposes the entire Unreal Editor as MCP tools — of its 2,114+ actions, 830 call Epic's own native AI Toolset directly. FlashML-org/FreeToken (⭐16k) is an edge-native MoE inference engine aiming to run 290B+ frontier open-weight models at interactive speed on an ordinary gaming PC. No major framework release today."
series:
  name: "AI Agent GitHub Digest"
  order: 80
---

> 🌏 [中文版](/posts/daily/2026-11-03-ai-agent-github-digest)

## Today's Highlight

Today's four repos happen to cover four different layers of agent infrastructure: claude-mem extends the memory layer's compatibility list yet again, swallowing nearly every coding agent with a name; worktrunk fixes a collaboration-layer pain point — git worktree ceremony — for anyone running multiple agents in parallel; ue-mcp adds the operation layer by exposing the entire Unreal Editor as MCP tools; and FreeToken targets the inference layer, trying to make a 290B frontier model runnable on a regular gaming rig. None of these compete on model intelligence — they compete on how solid each layer of agent infrastructure actually is once agents are used at scale.

## Trending Repos

### thedotmack/claude-mem ⭐ 110k

[GitHub](https://github.com/thedotmack/claude-mem)　·　TypeScript　·　Apache-2.0

- **What it is**: A persistent memory-compression system for agents like Claude Code. It automatically captures tool-call observations from each session, compresses them into semantic summaries with AI, and injects the relevant context back at the start of the next session, so the agent remembers what it already did across sessions.
- **Why it matters**: Today's update isn't a new feature so much as reach. Beyond Claude Code, it now supports Grok Bot, OpenCode 2, T3 Code (which manages both Codex and Claude Code as providers), Antigravity CLI, OMP (Oh My Pi), Pi, and DeepSeek Harness — wiring nearly every coding agent you can name into the same memory layer. Installation lets you pick the hosted memory service (30-day free trial) or bring your own OpenRouter/Gemini/Anthropic key.
- **Tech stack**: TypeScript + npm package, captures events via each harness's hook mechanism or by watching log files, hosted memory service plus a BYOK mode.
- **Getting started**: Easy — `npx claude-mem install` is a one-liner, and it runs without signing in if you pass `--provider` explicitly or set `CLAUDE_MEM_ONLINE_OPTIN=false`.

---

### max-sixty/worktrunk ⭐ 9.9k

[GitHub](https://github.com/max-sixty/worktrunk)　·　Rust　·　MIT OR Apache-2.0

- **What it is**: A CLI that makes git worktree management — giving each agent its own working directory so they don't clobber each other's files — as easy as working with branches.
- **Why it matters**: Spinning up a new worktree with native git requires typing the branch name three times (`git worktree add -b feat ../repo.feat`, then `cd ../repo.feat`), which gets tedious fast once you're running 5-10 agents in parallel. Worktrunk collapses that into three core commands, plus hooks for automating local workflows and copy-on-write build caches so each worktree doesn't need a full rebuild. Released less than a year ago, it's already near 10k stars; the maintainer calls it the most popular git worktree manager around.
- **Tech stack**: Rust core, docs at worktrunk.dev, built-in CI/Codecov integration.
- **Getting started**: Moderate — you need to understand git worktrees first, but once installed, three commands replace a string of native git operations.

---

### db-lyon/ue-mcp ⭐ 466

[GitHub](https://github.com/db-lyon/ue-mcp)　·　C++ + TypeScript　·　MIT

- **What it is**: An MCP server that lets AI assistants read and write the Unreal Engine editor directly over the MCP protocol — blueprints, materials, levels, animation, VFX, landscape, PCG, audio, UI, physics, navigation, AI, StateTree, GAS, networking, Sequencer, and the build pipeline are all operable in plain English.
- **Why it matters**: 30 tool categories, 2,114+ actions — 1,284+ of them written by ue-mcp itself, with the other 830 calling Epic's own native AI Toolset Registry built into UE 5.8+ directly, rather than re-wrapping it. The architecture is a TypeScript/Node.js MCP server bridging over WebSocket + JSON-RPC to a C++ bridge plugin installed inside the Unreal Editor; filesystem reads (INI config, C++ headers, asset listings) work without even opening the editor, so an agent can explore a project before deciding whether to actually touch anything. This fills in Unreal as the latest game-engine MCP server, following Blender and Unity.
- **Tech stack**: C++ bridge plugin (inside the editor) + TypeScript/Node.js MCP server, WebSocket JSON-RPC bridging, a YAML flow engine for multi-step workflows, extensible via an npm plugin system.
- **Getting started**: Moderate — `npx ue-mcp init` auto-detects the `.uproject`, deploys the C++ bridge plugin, and configures the MCP client, but you need to restart the editor once for the bridge plugin to take effect; a failed plugin compile is the most common snag.

---

### FlashML-org/FreeToken ⭐ 16k

[GitHub](https://github.com/FlashML-org/FreeToken)　·　Python　·　Apache-2.0

- **What it is**: An edge-native Mixture-of-Experts (MoE) inference engine aiming to run 290B+ parameter frontier open-weight models (DeepSeek-V4-Flash, Qwen3.6-35B-A3B, GLM-5.2, and others) at interactive speed on an ordinary gaming PC.
- **Why it matters**: It treats GPU, CPU, host memory, and interconnects as one elastic inference platform — bandwidth-adaptive CPU-GPU co-execution, full-layer double-buffered prefill streaming, and global LRU expert caching, plus "semantic-aware caching" so common agentic edits like tool calls and thinking-block edits don't force a full KV-cache recompute. It exposes an Anthropic/OpenAI-compatible API that coding agents like Codex, Claude Code, and OpenCode can plug into directly. The team has real systems pedigree — the paper's authors include Databricks' Matei Zaharia and UC Berkeley's Ion Stoica (an original author of Spark and Ray) — and the project openly credits SGLang's mini-sglang as its starting point.
- **Tech stack**: Python with uv for packaging; a desktop app ships a GUI for Windows/Linux; native support for NVIDIA RTX 30/40/50-series consumer GPUs.
- **Getting started**: Moderate — the desktop app is download-and-run, the CLI needs a uv environment, and it currently only supports NVIDIA consumer GPUs.

## Notable Releases

No major framework update today. Among the 13 B2 watchlist frameworks, crewAI's 1.15.34 (released 11-01) falls inside the 48-hour window but only documents the migration notes for an agent-executor removal that already shipped in 1.15.29, rather than introducing a new breaking change in this release; its other additions (`crewai skill search`, `run --inputs`) already appeared in 1.15.33. Haystack's v2.31.1-rc1 (11-02) just raises the floor on two transitive dependencies (`anyio`, `certifi`) to patch upstream CVEs — a security fix, not a framework feature change. The rest of the watchlist (langgraph, pydantic-ai, agno, claude-code, composio, etc.) are either outside the window or pure patch-version bumps.

## Today's Takeaway

I used to think MCP servers mostly fought their battles in the cloud — wrapping Notion, Slack, Gmail. But ue-mcp having 830 of its 2,114+ actions call Epic's own native tools directly is a reminder that MCP is heading toward exposing an entire heavyweight desktop application's existing API surface wholesale, not just saving you from writing one more API wrapper.

## References

- [thedotmack/claude-mem — GitHub repo](https://github.com/thedotmack/claude-mem)
- [thedotmack/claude-mem — README](https://raw.githubusercontent.com/thedotmack/claude-mem/main/README.md)
- [max-sixty/worktrunk — GitHub repo](https://github.com/max-sixty/worktrunk)
- [max-sixty/worktrunk — README](https://raw.githubusercontent.com/max-sixty/worktrunk/main/README.md)
- [db-lyon/ue-mcp — GitHub repo](https://github.com/db-lyon/ue-mcp)
- [db-lyon/ue-mcp — README](https://raw.githubusercontent.com/db-lyon/ue-mcp/main/README.md)
- [FlashML-org/FreeToken — GitHub repo](https://github.com/FlashML-org/FreeToken)
- [FreeToken paper (arXiv 2608.16157)](https://arxiv.org/abs/2608.16157)
- [crewAIInc/crewAI 1.15.34 release notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.34)
- [deepset-ai/haystack v2.31.1-rc1 release notes](https://github.com/deepset-ai/haystack/releases/tag/v2.31.1-rc1)
