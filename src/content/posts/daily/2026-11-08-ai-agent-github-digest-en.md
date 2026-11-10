---
title: "AI Agent GitHub Digest — 2026-11-08"
date: 2026-11-08
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, mcp, web-scraping, project-management]
lang: en
description: "paperclip fills the 'manage a fleet of running agents' layer, Scrapling bakes an MCP server into an established scraping framework and gains two thousand stars in a day, and hermes-agent puts an agent on your phone via Termux"
tldr: "paperclipai/paperclip (~112k stars) is an open-source agent-management app spanning Claude Code, Codex, and other harnesses; D4Vinci/Scrapling (~99k stars) built an MCP server straight into an established scraping framework and gained 1,655 stars in a single day on 11/6; NousResearch/hermes-agent (~261k stars) turns a CLI agent into a cross-platform tool with official support down to Android Termux. CrewAI 1.15.37 adds spreadsheet reading for agents and scaffolding for standalone agent projects."
series:
  name: "AI Agent GitHub Digest"
  order: 85
---

> 🌏 [中文版](/posts/daily/2026-11-08-ai-agent-github-digest)

## Today's Highlight

Today's three repos happen to land on three different layers of the agent stack, and all three are first-timers on this digest: paperclip turns "managing a fleet of running agents" into its own app; Scrapling bakes its MCP server straight into the package, so any agent can call it with one command; hermes-agent builds the agent itself into a cross-platform CLI with official support down to Android/Termux. Put together, the signal is that "can an agent run" is no longer the interesting question — "how do you manage it, how does it reach tools, and where does it live" is what's being fought over now.

```diagram
title: Four layers of the agent stack, from management to tool execution
desc: paperclip fills the top management layer, hermes-agent is the agent itself in the middle, MCP is the tool-protocol layer, and Scrapling fills the bottom layer that actually executes the tool
caption: Illustrative only — this is a simplified layering this article uses to place the three repos, not an industry-standard stack
---
<svg viewBox="0 0 600 312">
  <path class="dg-axis" d="M16 40 V272" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="16" y="28" dominant-baseline="central">fleet</text>
  <text class="dg-tag" x="16" y="288" dominant-baseline="central">call</text>

  <rect class="dg-box dg-box--accent" x="64" y="24" width="520" height="72" rx="6"/>
  <text class="dg-tag" x="80" y="51" dominant-baseline="central">L4</text>
  <text class="dg-label" x="112" y="51" dominant-baseline="central">Management</text>
  <text class="dg-sub" x="112" y="71" dominant-baseline="central">One app manages every running agent</text>
  <text class="dg-sub" x="568" y="51" text-anchor="end" dominant-baseline="central">paperclip</text>

  <rect class="dg-box" x="64" y="104" width="520" height="56" rx="6"/>
  <text class="dg-tag" x="80" y="132" dominant-baseline="central">L3</text>
  <text class="dg-label" x="112" y="132" dominant-baseline="central">Agent itself</text>
  <text class="dg-sub" x="568" y="132" text-anchor="end" dominant-baseline="central">hermes-agent・runs on your phone too</text>

  <rect class="dg-box" x="64" y="168" width="520" height="56" rx="6"/>
  <text class="dg-tag" x="80" y="196" dominant-baseline="central">L2</text>
  <text class="dg-label" x="112" y="196" dominant-baseline="central">Tool protocol</text>
  <text class="dg-sub" x="568" y="196" text-anchor="end" dominant-baseline="central">MCP・wire it once, every harness can use it</text>

  <rect class="dg-box" x="64" y="232" width="520" height="56" rx="6"/>
  <text class="dg-tag" x="80" y="260" dominant-baseline="central">L1</text>
  <text class="dg-label" x="112" y="260" dominant-baseline="central">Concrete tool</text>
  <text class="dg-sub" x="568" y="260" text-anchor="end" dominant-baseline="central">Scrapling・clears Cloudflare checks</text>
</svg>
```

## Trending Repos

### paperclipai/paperclip ⭐ ~112k

[GitHub](https://github.com/paperclipai/paperclip)　·　TypeScript　·　MIT

- **What it is**: An open-source "agent project management" app for a fleet of agents already running inside a company — task assignment, progress, spend, and approval workflows — with native support for Claude Code, Codex, Gemini CLI, Cursor, Pi, OpenCode, and OpenClaw.
- **Why it matters**: Today's other two repos both add capability to agents (tools, devices); paperclip fills an entirely different layer — once agents are actually treated like coworkers, who manages the fleet. It defines its own ACPX (Agent Communication Protocol Extended) protocol alongside standard MCP for connecting external services (Slack, a GitHub review bot, Notion, Railway, and more). Launched in March 2026, it crossed 110k stars in eight months — a sign that "managing agents" is becoming as big a need as writing them.
- **Stack**: Node.js + React + an embedded PostgreSQL database (set up automatically by `npx`, no extra configuration) + dual MCP/ACPX protocol support
- **Getting started**: Low — `npx paperclipai@latest onboard --yes` starts the UI and API locally; self-hosting is free, and a hosted cloud option is still on the roadmap

---

### D4Vinci/Scrapling ⭐ ~99k (+1,655 on 11/6)

[GitHub](https://github.com/D4Vinci/Scrapling)　·　Python　·　BSD-3-Clause

- **What it is**: A Python scraping framework that launched in October 2024. This update makes "built for agents" a first-class feature — it adds a built-in MCP server and an Agent Skill, so Claude Code and other agents can call it directly without a custom wrapper.
- **Why it matters**: Three fetchers cover everything from simple requests to the hardest cases — a stealth HTTP client that spoofs TLS fingerprints and can speak HTTP/3, a real Chromium instance through Playwright, and StealthyFetcher, which claims to clear Cloudflare's Turnstile and Interstitial checks. What pushed it onto the trending page this time was packaging the MCP server directly into the library — it gained 1,655 stars in a single day on 11/6. That suggests what the agent ecosystem is missing isn't scraping technology itself, but the layer that lets an agent call it directly.
- **Stack**: Python + Playwright + a custom TLS/HTTP3 fingerprinting layer + a built-in MCP server (the `scrapling[ai]` extra)
- **Getting started**: Low — `pip install "scrapling[ai]"`, then `scrapling install` to fetch browser dependencies, then start the MCP server with `uvx scrapling mcp` or the official `ghcr.io` container

---

### NousResearch/hermes-agent ⭐ ~261k

[GitHub](https://github.com/NousResearch/hermes-agent)　·　Python　·　MIT

- **What it is**: Hermes, a cross-platform CLI agent. One install covers model selection, a gateway (entry points through messaging apps like Telegram and Discord), parallel subagent execution, and a setup wizard. It runs on Linux, macOS, and Windows, and even ships a signed APT repository for Android/Termux.
- **Why it matters**: Most coding-agent CLIs stop at the desktop; hermes-agent treats the phone as officially supported too, with a stable channel and a prerelease canary channel — turning "an agent you carry with you" into an official feature instead of something the community has to hack together. It ships `computer-use-linux`, an MCP server that turns Linux desktop control (AT-SPI, Wayland/X11 input, window targeting) into a tool the agent can call directly, with no separate project needed.
- **Stack**: Python CLI + Node.js (gateway) + the official `computer-use-linux` MCP server + a signed Termux APT repository
- **Getting started**: Low — after installing, run `hermes setup --portal`; one OAuth flow unlocks all four Tool Gateway tools: web search, image generation, TTS, and browser

## Notable Releases

### CrewAI 1.15.37

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.37)

- **Key changes**: Adds the ability for agents to read spreadsheets directly (`crewai-files`), plus a command to scaffold and load standalone agent projects.
- **Breaking changes**: None.
- **What it means for you**: If you were writing custom code to feed Excel/CSV data to an agent, `crewai-files` now handles that out of the box; if you want to spin up a standalone agent project that isn't tied to an existing crew, there's now an official scaffold command for that too.

LangGraph SDK only added `strict_resume` and a `StreamMode` extension today, and Composio's CLI update is still on a beta channel — neither clears the bar for a major update. Claude Code v2.1.319 was [already covered in yesterday's digest](/posts/daily/2026-11-07-ai-agent-github-digest), so we won't repeat it here.

## Today's Takeaway

I used to think "the agent ecosystem" was mostly about which model or framework is smarter, but none of today's three repos is competing on that axis. They fill a management layer, a tool-protocol layer, and a device layer — all infrastructure that only grows once agents are genuinely in use, not experimented with. It's the same signal as claude-mem widening its harness-compatibility list on 11/3, just approached from three completely different angles today.

## References

- [paperclipai/paperclip — GitHub repo](https://github.com/paperclipai/paperclip)
- [GitHub Trending November 2026: paperclip's 110K-star milestone — CoddyKit](https://www.coddykit.com/pages/blog-detail?id=5130017&slug=github-trending-november-2026-from-a-110k-star-agent-management-platform-to-a-38)
- [D4Vinci/Scrapling — GitHub repo](https://github.com/D4Vinci/Scrapling)
- [Agent Tools Today (6 Nov 2026): Scrapling's day-one star gain — munderdiffl.in](https://munderdiffl.in/blog/agent-tools-today-2026-11-06/)
- [NousResearch/hermes-agent — GitHub repo](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent official docs (Termux / Tool Gateway)](https://hermes-agent.nousresearch.com/docs)
- [CrewAI 1.15.37 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.37)
