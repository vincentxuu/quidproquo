---
title: "AI Agent GitHub Digest — 2026-11-01"
date: 2026-11-01
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, browser-automation, agent-tool-use]
lang: en
description: "T3 Code folds several coding agents into one remote-control phone app, Lightpanda rewrites the headless browser in Zig and cuts memory use to 1/16 of Chromium's, and anthropics/skills breaks 180k stars this week — while Pydantic AI and Claude Code both tighten up exactly what gets sent where behind the scenes"
tldr: "**T3 Code** (⭐ 22.6k) turns an iOS/Android/desktop app into a remote control surface for multiple coding agents at once — Codex, Claude Code, Cursor, Grok Build, OpenCode, Google Antigravity. **Lightpanda** (⭐ 36k) rewrites the headless browser from scratch in Zig; its own benchmark shows memory use at roughly 1/16 of headless Chrome and page-fetch time about 9x faster. **anthropics/skills** gained 2,300 stars this week alone, crossing 185.7k — a sign Agent Skills is moving from a Claude-only feature to a format other platforms share. On the release side, **Pydantic AI v2.64.0** ships four compatibility notes that change how failed retries surface errors and how server state crosses providers, while **Claude Code v2.1.316** announces the retirement of Opus 4.8 fast mode at the end of November."
series:
  name: "AI Agent GitHub Digest"
  order: 78
---

> 🌏 [中文版](/posts/daily/2026-11-01-ai-agent-github-digest)

## Today's Highlight

Today's center of gravity on GitHub shifted from "how do we build smarter agents" to "how do we actually see and manage the agents already running." T3 Code turns your phone into a remote control surface for multiple coding agents, so you can approve a stuck long-running task from the train. anthropics/skills gained 2,300 stars this week alone, crossing 180k — a sign that the Agent Skills packaging format is moving from a Claude-only feature into a shared distribution standard across platforms. On the infrastructure side, Lightpanda rewrote the headless browser from the ground up instead of forking Chromium, cutting the hardware cost of running a fleet of browser agents by roughly 90%. And on the release side, two announcements are both about tightening details rather than adding features — Pydantic AI is now explicit about how retry failures surface as errors and whether server state can cross providers, while Claude Code gave a month's notice before retiring Opus 4.8 fast mode.

## Trending Repos

### T3 Code ⭐ 22.6k

[GitHub](https://github.com/pingdotgg/t3code) · TypeScript · MIT

- **What it is**: An "agent harness control surface" — an iOS/Android app, a web app, or an Electron desktop app that connects to the coding agents already installed and authenticated on your machine: Codex, Claude Code, Cursor, Grok Build, OpenCode, Google Antigravity. Switch between them, control them remotely, and get notified when one needs your call.
- **Why it's worth watching**: Keeping tabs on a long-running agent task used to mean staying glued to a terminal or IDE. T3 Code turns that into a cross-agent remote client — check progress and approve decisions from your phone without worrying a task is sitting there waiting for you. The authors say they built it after trying the Codex desktop app, Conductor, Claude Desktop, and Cursor Glass and finding none of them good enough; the explicit positioning is "actually open, forkable," not another closed product.
- **Tech stack**: TypeScript + Electron desktop build + native iOS/Android apps, authenticating through each CLI's existing login flow, with MCP support built in.
- **Getting started**: Medium — you need at least one underlying agent CLI (Codex, Claude Code, etc.) installed and authenticated first, then install T3 Code itself via `curl ... | sh` or your platform's package manager (Homebrew, winget, AUR, Nix).

---

### Lightpanda ⭐ 36k

[GitHub](https://github.com/lightpanda-io/browser) · Zig · AGPL-3.0

- **What it is**: A headless browser written from scratch in Zig — not a Chromium fork, not a WebKit patch — built specifically for AI agents and automation.
- **Why it's worth watching**: The project's own benchmark (fetching 933 real pages on an AWS m5.large instance) shows peak memory at just 123MB versus 2GB for headless Chrome — roughly 16x less — and total fetch time at 5 seconds versus 46 seconds, about 9x faster. For browser agents that need to run a lot of tabs in parallel (QA, bulk scraping), that gap translates directly into how many concurrent agents one machine can support.
- **Tech stack**: Zig + the V8 engine + libcurl + html5ever, with CDP (Chrome DevTools Protocol) support so Puppeteer or Playwright can plug straight in as a backend.
- **Getting started**: Medium — nightly binaries, a Homebrew tap, and Docker images are available for Linux/macOS; there's no native Windows build, so Windows users go through WSL2.

---

### anthropics/skills ⭐ 185.7k (+2.3k this week)

[GitHub](https://github.com/anthropics/skills) · Markdown + scripts · Apache-2.0 (example skills) / source-available (document skills)

- **What it is**: Anthropic's official public repository of Agent Skills examples — the `SKILL.md` format (YAML frontmatter plus instructions, with optional scripts and reference files) that Claude loads dynamically, covering creative/design work, development tooling, enterprise communication, and the actual docx/pdf/pptx/xlsx skills that power Claude's own document features.
- **Why it's worth watching**: This is one of the rare entries today that's news about scale rather than a new technique — the repo gained 2,300 stars in a single week, pushing its total past 185.7k and into the global top 44. The bigger story behind the number: the Agent Skills format itself was spun off into an open standard (agentskills.io) in late 2025, so it's no longer a Claude-only feature — other agent platforms and tools are starting to read the same `SKILL.md` format.
- **Tech stack**: `SKILL.md` (YAML frontmatter plus instructions) with optional scripts and reference files, loaded progressively — Claude only sees each skill's name and description at first, and reads the full content only once a task matches.
- **Getting started**: Easy — run `/plugin marketplace add anthropics/skills` in Claude Code, then pick which skill set to install (`document-skills` or `example-skills`).

## Notable Releases

### Pydantic AI v2.64.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.64.0)

- **Key changes**: All four compatibility notes in this release are about tightening up exactly what gets sent where. (1) When a retrying transport gives up, it now raises an explicit `ModelHTTPError` instead of silently stalling, so a fallback chain can actually take over. (2) A new `Model.accepts_server_state` means stored response/item/conversation/container IDs now get sent back only to the endpoint that originally created them, instead of being passed around freely between providers. (3) `json-repair` becomes an optional dependency, needed only by `Coder` and `RepairToolArguments`. (4) `Coder`'s tool schemas default to non-strict validation; pass `Coder(strict=True)` if you want strict checking back.
- **Breaking changes**: All four items are flagged as compatibility notes — Pydantic's own term for breaking changes. Items (1) and (2) change your existing error-handling and cross-provider state logic; item (4) loosens the strict schema validation that `Coder` tool calls previously relied on to surface errors.
- **What it means for you**: If your fallback chain relied on the old "transport gives up and silently stalls" behavior to decide when to switch models, you'll need to catch `ModelHTTPError` instead to trigger that fallback. And if you've been passing response IDs or other server state between different providers, you'll now find the receiving provider rejects them outright — you'll need to route that state per provider instead.

---

### Claude Code v2.1.316

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.316)

- **Key changes**: Added `CLAUDE_CODE_SUBAGENT_EFFORT`, letting you set a single effort level for every subagent that doesn't specify its own, instead of always inheriting the parent session's setting. The Claude apps gateway gained a shared `pooled_budget` (one monthly budget a group's members share, on top of each member's own limit) and `managed.policy_mode: layered`, which applies every matching policy in sequence rather than stopping at the first match. Several shell-related bugs were fixed, including background shell commands being left running on macOS/Linux after Claude Code exits on its own (e.g., when credentials are refused or a cloud session is archived), and bash aliases or functions with dash-prefixed names getting garbled or lost.
- **Breaking changes**: No new breaking changes, but the release formally **announces the deprecation** of Opus 4.8 fast mode — deprecated as of October 30, 2026, and removed on November 30, 2026. After removal, fast mode requests on Opus 4.8 will return an error outright instead of silently falling back to standard Opus 4.8.
- **What it means for you**: If you're using Opus 4.8 fast mode, migrate to Opus 5.5 before the end of November to keep the speedup — once the deadline passes, requests will fail outright rather than quietly slow down. Everything else here is routine bug fixes; a normal upgrade shouldn't require any code changes.

## Today's Takeaway

I used to assume that "control surfaces" and "skill distribution" were peripheral infrastructure that only gets built once the underlying agent technology has matured. Watching T3 Code and anthropics/skills both take off today flipped that assumption — model and framework capability has already outpaced our ability to actually see and manage what's running, so control surfaces and skill distribution are now just as decisive as raw model capability in determining whether an agent toolchain can actually scale.

## References

- [T3 Code — GitHub repo](https://github.com/pingdotgg/t3code)
- [T3 Code — star history](https://www.star-history.com/pingdotgg/t3code/)
- [Lightpanda — GitHub repo](https://github.com/lightpanda-io/browser)
- [Lightpanda — star history](https://www.star-history.com/lightpanda-io/browser/)
- [anthropics/skills — GitHub repo](https://github.com/anthropics/skills)
- [anthropics/skills — star history](https://www.star-history.com/anthropics/skills/)
- [Pydantic AI v2.64.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.64.0)
- [Claude Code v2.1.316 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.316)
