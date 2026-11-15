---
title: "AI Agent GitHub Digest — 2026-11-07"
date: 2026-11-07
category: daily
tags: [ai-agent, github, open-source, daily, mcp, computer-use]
lang: en
description: "NVIDIA gives agents a layer for deciding whether a number can be trusted, Vercel's accessibility-tree trick for computer use moves to the browser, and a new project moves it onto a real iPhone"
tldr: "NVIDIA/auto-ontology (~5.5k stars) uses MCP to hand agents a semantic layer for enterprise data they can query and verify; vercel-labs/agent-browser (~42k stars) brings agent-desktop's accessibility-tree approach — reading the page instead of guessing from screenshots — to the browser; JosssphZhou/poki hit 257 stars on day one, letting an agent operate a real iPhone. Claude Code v2.1.319 moves MCP tool calls to the background and hands part of auto mode's decision-making to the server."
series:
  name: "AI Agent GitHub Digest"
  order: 84
---

> 🌏 [中文版](/posts/daily/2026-11-07-ai-agent-github-digest)

## Today's Highlight

Past digests have tracked agents learning to operate a computer — [11/2](/posts/daily/2026-11-02-ai-agent-github-digest) and [11/5](/posts/daily/2026-11-05-ai-agent-github-digest) both covered agent-desktop. Today that line stretches in two directions at once: agent-browser brings the same "read the accessibility tree instead of guessing coordinates from a screenshot" trick back to the browser, and poki moves it onto a real iPhone. Meanwhile NVIDIA's auto-ontology is patching a different gap — when an agent pulls a number from a database, how does it know that number is right.

## Trending Repos

### NVIDIA/auto-ontology ⭐ ~5.5k (+2k on launch day)

[GitHub](https://github.com/NVIDIA/auto-ontology)　·　Python　·　Apache-2.0

- **What it is**: Auto-generates a semantic layer (an ontology) from an enterprise's existing metadata, so agents can query what the data means, whether it's safe to use, and where it came from — via MCP, CLI, or API — and check any generated query against certified definitions.
- **Why it matters**: The scariest failure mode for an agent querying a database isn't a missed lookup — it's a plausible-looking number pulled from a column that means something else. This project splits "what the data means" from "is this query result correct": it builds the semantic layer first, then validates generated SQL against certified definitions and attaches provenance for every answer. It's not accepting outside contributions right now, so NVIDIA is maintaining this semantic layer itself.
- **Stack**: Python + Postgres (semantic catalog lives alongside the data) + Better Auth (RBAC) + NVIDIA NIM / Nemotron (text-to-SQL) + Helm / Docker Compose deployment
- **Getting started**: Medium — you need an existing database and a NIM endpoint; a single-machine trial is easy, but getting value from the "validation" side means feeding in your organization's existing definitions first

---

### vercel-labs/agent-browser ⭐ ~42k (+487 this week)

[GitHub](https://github.com/vercel-labs/agent-browser)　·　Rust　·　Apache-2.0

- **What it is**: A browser-automation CLI for agents. `snapshot` reads the page as accessibility-tree text with a numbered `ref` for each element; the agent acts on a ref and takes a new snapshot to confirm the result — one shell command at a time.
- **Why it matters**: This is agent-desktop's sibling project — the same team applied the same approach to the browser first. Compared to having a model guess coordinates from a screenshot, a ref stays stable within one snapshot, and a failed click reports why (the element is hidden, disabled) instead of reporting success while nothing happened. It also attaches to an already-running Chrome via `--cdp`, or to cloud browsers like Browserbase and Browserless.
- **Stack**: Rust CLI + Chrome DevTools Protocol, driven by a background daemon that controls the browser; `agent-browser mcp` also starts an MCP server
- **Getting started**: Low — `npm install -g agent-browser`, then `agent-browser install` once to fetch Chrome for Testing

---

### JosssphZhou/poki ⭐ 257+ (launch day)

[GitHub](https://github.com/JosssphZhou/poki)　·　Rust + TypeScript　·　AGPL-3.0

- **What it is**: A local MCP server plus agent that lets an AI operate a real iPhone — not a simulator, no jailbreak, no extra hardware — bridging to the device through idevice/idb.
- **Why it matters**: The first two repos let agents operate a computer screen; poki pushes the same direction into a space almost nobody else has touched — the phone. It launched on 11/5 and picked up 257 stars on its first day. It connects directly to MCP clients like Claude Code and Codex, and can also take commands over iMessage or Telegram, effectively turning the phone into another execution environment for the agent.
- **Stack**: Native Rust bridge + idevice/idb + Node.js MCP SDK + ffmpeg (for screen streaming)
- **Getting started**: High — macOS 15+ only, needs a full Xcode install, Rust, Node 24+, and a physical iPhone; there's no way to fake this with pure software

## Notable Releases

### Claude Code v2.1.319

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.319)

- **Key changes**: When an MCP server runs a tool call as a task, Claude Code now moves it to the background right away and reports the result when it finishes, instead of blocking the current turn; a new `permissions.denyInsteadOfPrompting` setting makes a tool call that would have shown a permission prompt get denied outright so the conversation keeps going.
- **Breaking changes**: With telemetry or feature flags off (including behind an LLM gateway), a call that auto mode used to ask about or deny locally now defaults to a server-side check instead, with no fallback to the built-in classifier — keeping the old behavior requires explicitly setting `CLAUDE_CODE_AUTO_MODE_SERVER=0`.
- **What it means for you**: If you run Claude Code with telemetry or feature flags disabled — for example behind a self-hosted enterprise gateway — upgrading adds a server round-trip to auto mode's decisions. Avoiding that behavior takes an explicit environment variable; it isn't off by default.

CrewAI 1.15.36 only adds an experimental "conversational Agent session" feature plus a few small bug fixes — not enough to count as a major update. Pydantic AI v2.66.0's security patches were [already covered in the 11/5 framework-update digest](/posts/daily/2026-11-05-framework-pydantic-ai-v2.66.0), so we won't repeat them here.

## Today's Takeaway

I used to think "agents operating a computer" and "agents trusting what they query" were two unrelated technical tracks — one about execution, one about data. Putting today's three repos side by side shows they're actually patching two ends of the same gap: auto-ontology lets an agent know whether a number can be trusted, while agent-browser and poki let an agent know whether what's on screen can be clicked. Execution and data are both answering the same question from two sides: is what the agent sees real, or just what it assumes.

## References

- [NVIDIA/auto-ontology — GitHub repo](https://github.com/NVIDIA/auto-ontology)
- [NVIDIA Releases Auto Ontology — MarkTechPost](https://www.marktechpost.com/2026/11/01/nvidia-auto-ontology-open-source-semantic-layer-ai-agents/)
- [GitHub Trending November 2026 — CoddyKit (auto-ontology's star count and day-one gain)](https://www.coddykit.com/pages/blog-detail?id=5130021&slug=github-trending-november-2026-from-a-147k-star-spec-driven-toolkit-to-a-2-78-tri)
- [vercel-labs/agent-browser — GitHub repo](https://github.com/vercel-labs/agent-browser)
- [vercel-labs/agent-browser — Star History](https://www.star-history.com/vercel-labs/agent-browser/)
- [JosssphZhou/poki — GitHub repo](https://github.com/JosssphZhou/poki)
- [Daily new repos (2026-11-06): Rerun, poki — poki's day-one star count](https://github.com/yash-nandvana/ai-tools/pull/7)
- [Claude Code v2.1.319 — Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.319)
- [CrewAI 1.15.36 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.36)
