---
title: "AI Agent GitHub Digest — 2026-11-27"
date: 2026-11-27
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, crewai, security]
lang: en
description: "rust-anything has a coding agent rewrite a whole app into Rust section by section, verifying each step, and broke 10,000 stars in ten days; CrewAI 1.15.45 closes two auth security holes at once"
tldr: "rust-anything packages a skill that has an agent rewrite an app into Rust piece by piece, checking each piece against the original behavior; it broke 10,000 stars in ten days. opengame wires 20-plus coding agents into a pipeline that takes a game from template to publish. PiBot bundles multi-agent group chat, computer use and MCP into a local desktop app. CrewAI 1.15.45 fixes both an empty-credential auth bypass and credentials leaking across cross-origin redirects."
series:
  name: "AI Agent GitHub Digest"
  order: 104
---

> :globe: [中文版](/posts/daily/2026-11-27-ai-agent-github-digest)

## Today's Highlight

Today's new repos share a pattern: instead of another general-purpose framework, each hands a coding agent one specific, resource-heavy job. rust-anything has an agent rewrite a whole app into Rust section by section, checking each section against the original behavior. opengame wires 20-plus coding agents into a pipeline that takes a game from template to publish. PiBot bundles multi-agent group chat, computer use and MCP into a local desktop app. On the framework side, CrewAI 1.15.45 closes two auth security holes at once — rejecting empty credentials with a constant-time comparison, and no longer carrying credentials across cross-origin redirects.

## Trending Repos

### erkamyaman/rust-anything ★10,075 (shipped 11/16, broke 10k stars in ten days)

[GitHub](https://github.com/erkamyaman/rust-anything)　·　Rust　·　Apache-2.0

- **What it is**: A skill/workflow for coding agents that rewrites an app into Rust piece by piece, checking each rewritten piece against the original's behavior. It supports TypeScript, JavaScript, Python, Go, Ruby, Java, C, PHP, C#, Kotlin and PowerShell as source languages.
- **Why it's worth watching**: Rewriting a whole app into Rust by hand usually takes months, and it's hard to confirm nothing broke along the way. This tool turns "rewrite a piece, verify a piece" into a fixed pipeline an agent runs — and it broke 10,000 stars in ten days, a sign that people actually want an agent to do the Rust port automatically rather than grinding through it by hand.
- **Tech stack**: Rust toolchain + multi-language source parsing + an agent skill format compatible with Claude Code, Codex and similar coding agents
- **Getting started**: Medium — after installing the skill, you need to run the original test suite first to establish a behavior baseline before the piece-by-piece rewrite can start

---

### nexu-io/opengame ★656 (shipped 11/25)

[GitHub](https://github.com/nexu-io/opengame)　·　TypeScript　·　Apache-2.0

- **What it is**: A game-development platform for AI agents, pitched as "Unity/Unreal for agents." It ships 100-plus remixable game templates and wires 20-plus coding agents (Claude Code, Codex, DeepSeek and others) into a pipeline for building games, then publishes straight to WeChat, Douyin, TikTok, Telegram and itch.io.
- **Why it's worth watching**: Letting an agent build a game used to stop once the code was written. This platform bundles the template library, multi-agent collaboration and multi-platform publishing together, filling in the gap between "code is done" and "it's live." It broke 600 stars in one day, which says the "remix a template and ship it" demand is bigger than it looks.
- **Tech stack**: TypeScript + a multi-coding-agent integration layer + multi-platform publishing APIs
- **Getting started**: Medium — you need to learn its template format first, and publishing to a specific platform (such as WeChat mini-games) requires applying for that platform's developer account

---

### w01fb0ss/PiBot ★651 (shipped 11/21)

[GitHub](https://github.com/w01fb0ss/PiBot)　·　TypeScript　·　Apache-2.0

- **What it is**: An open-source, local-first desktop AI agent team supporting multi-agent group chat, computer use, browser control, MCP, scheduled routines and approval flows. Beyond macOS, Windows and Linux it ships an Android build too, built on top of the pi agent runtime.
- **Why it's worth watching**: Most multi-agent platforms on the market are cloud SaaS or require you to run your own server. PiBot goes straight to a local desktop app and treats "several agents in one group chat" as a first-class feature rather than something bolted on afterward. The Android build also signals that running agents locally is starting to extend to mobile.
- **Tech stack**: TypeScript + the pi agent runtime + computer-use/browser integration + MCP
- **Getting started**: Medium — install the desktop app and configure model keys first; multi-agent group chat and approval flows take a bit of time to get familiar with in the settings UI

## Notable Releases

### CrewAI 1.15.45

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.45)

- **Key changes**: Added the ability to save HTML or Markdown output as a PDF artifact. Server-side authentication now rejects empty credentials and uses a constant-time comparison to avoid timing attacks. Credentials are no longer carried across cross-origin redirects. Also fixed a Bedrock S3 upload failure under `prefer_upload` mode, and made `HyperbrowserLoadTool`'s parameters properly optional.
- **Breaking changes**: None.
- **What it means for you**: If your CrewAI deployment has an externally facing auth endpoint, or your flow does cross-origin redirects, these two security fixes are worth upgrading for first. The PDF artifact option gives anyone who needs to save agent output directly as a report an extra ready-made format.

## Today's Takeaway

I used to think "filling gaps in the agent toolchain" mostly meant infrastructure-level gaps — MCP, memory, that kind of thing. Today's examples are more direct: turning "rewrite a whole app into Rust" or "ship a game from template to store" — work that used to take a person weeks — into a standard pipeline an agent runs, not just writing code anymore. That's the same thread as the security fixes CrewAI shipped this time: once agents are actually handed heavy work and touch production systems, the underlying correctness and security requirements have to keep pace too — "ship the feature first, patch it later" doesn't hold up.

## References

- [erkamyaman/rust-anything](https://github.com/erkamyaman/rust-anything)
- [nexu-io/opengame](https://github.com/nexu-io/opengame)
- [w01fb0ss/PiBot](https://github.com/w01fb0ss/PiBot)
- [CrewAI 1.15.45 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.45)
