---
title: "AI Agent GitHub Digest — 2026-10-20"
date: 2026-10-20
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, agent-memory, mcp-server]
lang: en
description: "OpenHuman squeezes an agent harness down to 500 agents on a $10 VPS; agent-memory turns long-term memory back into plain, readable Markdown; a CapCut alternative ships with a built-in MCP server so agents can edit video themselves"
tldr: "**tinyhumansai/openhuman** (42,159★) is a Rust agent harness that beat six other tools on a public SWE-bench run — over 2x faster, 2.6x fewer tokens, 8x less memory and CPU than Hermes and peers — by compressing tool output, using a tiny model (Jev) to pick the right tool, and running everything on one in-process plugin bus. **tigerless-labs/agent-memory** (4,385★) stores an agent's long-term memory as plain Markdown files with a rebuildable local index — delete the index and nothing is lost — so Claude Code and Codex CLI can share one memory store. **jub0t/Concat** (9,417★) is a local-first, watermark-free open-source CapCut alternative with a built-in MCP server, letting Claude and other agents cut video directly. Release: Agno v3.1.6 lets eval Cases carry a session_id, images, and other run arguments through a full turn, and has OS Manager query its own docs instead of delegating to Platform Manager."
series:
  name: "AI Agent GitHub Digest"
  order: 66
---

> 🌏 [中文版](/posts/daily/2026-10-20-ai-agent-github-digest)

## Today's Highlight

None of today's three repos is reinventing the agent itself — each fills in a different gap in the surrounding infrastructure. OpenHuman is about running cheaply at scale, agent-memory is about remembering things long-term, and Concat takes a third path entirely: bolt MCP onto ordinary consumer software so the editing tool itself becomes something an agent can drive.

## Trending Repos

### tinyhumansai/openhuman ⭐ 42,159

[GitHub](https://github.com/tinyhumansai/openhuman)　·　Rust　·　GPL-3.0

- **What it is**: A single-process agent harness written in Rust. The same core ships as a desktop app, a terminal tool, and a headless server, and can also be embedded as a Rust library.
- **Why it matters**: Most harnesses spin up one heavy process per agent and resend the full prompt on every call. OpenHuman reworks the most expensive parts of that loop instead: a Recursive Language Model (RLM) compresses large tool outputs, a small model called Jev picks the right tool out of 1,215 candidates (86.8% top-pick accuracy versus 70.5% for keyword search), and every feature plugs into one Rust bus that loads on demand, so one stuck feature doesn't take the rest down with it. In the project's own published SWE-bench benchmark against Hermes and five other harnesses, OpenHuman finished tasks in under half the time, used 2.6x fewer tokens, and needed an eighth of the memory and CPU.
- **Stack**: Rust core + Tauri desktop shell + MCP
- **Getting started**: Easy — download the desktop build and run it, or `cargo add` it as a library.

---

### tigerless-labs/agent-memory ⭐ 4,385

[GitHub](https://github.com/tigerless-labs/agent-memory)　·　Python　·　MIT

- **What it is**: A long-term memory runtime for AI agents that stores each memory as a plain Markdown file, with a SQLite index alongside it that's just a disposable, rebuildable cache.
- **Why it matters**: Most memory tools reach for a vector database, which leaves the agent holding an opaque embedding blob it can't inspect or migrate away from. agent-memory flips that: the filesystem itself is the source of truth. Retrieval returns a path and a one-line abstract, and the agent decides how deep to read — outline, abstract, or full file — instead of having a whole chunk of text forced into context. Writes don't rely on the agent remembering to save; they fire automatically at conversation boundaries, and a separate "sleep-time" pass handles consolidation and forgetting, with any deletion requiring human confirmation. No API key is needed, and Claude Code and Codex CLI can share the same memory store.
- **Stack**: Python + SQLite FTS5 + Markdown frontmatter
- **Getting started**: Easy — a pip install, no vector database or API key to set up.

---

### jub0t/Concat ⭐ 9,417

[GitHub](https://github.com/jub0t/Concat)　·　Rust　·　AGPL-3.0

- **What it is**: A free, open-source, local-first CapCut alternative covering auto-captions, text-to-speech, background removal, keyframe animation, multi-track editing, and 4K export — no account, no uploads, no watermark.
- **Why it matters**: The feature that sets it apart from an ordinary editor is the last one — `concat --mcp` starts a built-in MCP server, plus a JSON-RPC API, so an agent like Claude can cut video directly through instructions instead of a human dragging a timeline by hand. The AI models for captions, voice, and background removal download once on first use and then work fully offline, with footage never leaving local disk.
- **Stack**: Rust engine + GPU compositor + FFmpeg + built-in MCP server
- **Getting started**: Medium — the desktop app itself installs and works immediately, but wiring up MCP for an agent takes a one-time setup following the docs; Windows builds aren't code-signed yet, so SmartScreen will flag the first run.

## Notable Releases

### Agno v3.1.6

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.6)

- **Key changes**: Eval `Case` now accepts `session_id`, `user_id`, `session_state`, `dependencies`, `metadata`, and `knowledge_filters`, and `input` can take a `Message`, so a case can attach an image or file to the turn being graded. Cases sharing a `session_id` run as consecutive turns in the same conversation. Separately, OS Manager now queries Agno's own documentation for framework questions instead of delegating to Platform Manager, and `ParallelTools` no longer loses its live SDK client or throws `RLock` copy errors when an agent or team gets copied.
- **Breaking changes**: None.
- **What it means for you**: If you're using Agno's eval suite to test multimodal input or multi-turn conversations, you can now do it at the `Case` level instead of faking a session yourself; anyone running `ParallelTools` under AgentOS should pick up the copy-error fix on upgrade.

## Today's Takeaway

I used to think the competition in the agent ecosystem was about whose framework reasons better, but today's three repos make a different case: the real polishing effort is happening around the edges — how cheaply and leanly a harness can run, how memory stays useful over the long haul without spiraling out of control, and even how an ordinary video editor can turn itself into something an agent can operate. The agent's own capability curve is already good enough; what's missing is the infrastructure layer that lets it run cheaply, durably, and under control.

## References

- [tinyhumansai/openhuman — GitHub](https://github.com/tinyhumansai/openhuman)
- [openhuman-benchmarks — swe-x86-1 results](https://github.com/tinyhumansai/openhuman-benchmarks/blob/main/results/swe-x86-1/summary.md)
- [tigerless-labs/agent-memory — GitHub](https://github.com/tigerless-labs/agent-memory)
- [jub0t/Concat — GitHub](https://github.com/jub0t/Concat)
- [jub0t/Concat — Code Signing Policy](https://github.com/jub0t/Concat/blob/main/CODE_SIGNING.md)
- [Agno v3.1.6 Release Notes — GitHub](https://github.com/agno-agi/agno/releases/tag/v3.1.6)
