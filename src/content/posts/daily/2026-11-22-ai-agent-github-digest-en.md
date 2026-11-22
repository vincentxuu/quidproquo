---
title: "AI Agent GitHub Digest — 2026-11-22"
date: 2026-11-22
category: daily
tags: [ai-agent, github, open-source, daily, claude-code, agent-memory, mcp]
lang: en
description: "Claude Code v2.1.330 adds enterprise sign-in and a built-in charting mod; the same day, agentmemory wires one memory server into 12 different agent runtimes, turning 'memory' into a shared layer"
tldr: "Claude Code v2.1.330 adds Enterprise Admin Console sign-in and a built-in charting mod called 'easel'. agentmemory (30k stars) serves Claude Code, Codex, Copilot CLI, and a dozen other runtimes off 54 shared MCP tools. obra/superpowers growth is cooling but still holds 320k+ stars. Replit also entered the self-hosted personal-agent space with 'amuse'."
series:
  name: "AI Agent GitHub Digest"
  order: 99
---

> :globe: [中文版](/posts/daily/2026-11-22-ai-agent-github-digest)

## Today's Highlight

Yesterday's theme was "skill bundles packaging everything." Today pushes one layer deeper into infrastructure: Claude Code shipped v2.1.330 with enterprise sign-in and a built-in charting mod, and the same day, agent memory tooling produced a contender that explicitly takes the "shared layer" approach — `agentmemory` doesn't lock itself to one agent. It runs a single memory server that Claude Code, Codex CLI, Copilot CLI, and a dozen other runtimes can all read from. Put next to yesterday's skill-bundle story, both "methodology" and "memory" are converging on the same idea: become a layer every agent shares, instead of each agent reinventing its own.

## Trending Repos

### rohitg00/agentmemory ★30,517

[GitHub](https://github.com/rohitg00/agentmemory)　·　TypeScript　·　Apache-2.0

- **What it is**: A memory server that runs locally and uses hooks plus MCP to help coding agents remember past sessions, decisions, and bug fixes — recall works across different agents, not just the one that wrote the memory.
- **Why it matters**: Most agent-memory tools lock themselves to a single runtime (often just Claude Code). This one goes the other way and builds a neutral layer instead — 54 MCP tools and 12 automatic hooks serve Claude Code, GitHub Copilot CLI, Codex CLI, Cursor, Gemini CLI, and more at once, so switching agents doesn't mean starting memory from zero. In keyless mode it falls back to BM25 keyword search, so you don't need an embedding provider just to get started.
- **Tech stack**: Node.js service + MCP server (54 tools) + an optional local embedding model (`Xenova/all-MiniLM-L6-v2`) for semantic search + a hybrid knowledge-graph retrieval layer, with zero external database dependencies by design
- **Getting started**: Easy — `npx -y @agentmemory/agentmemory@latest` starts the service in one command; keyless mode needs no API key at all

---

### obra/superpowers ★323,562

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **What it is**: A full software-development methodology — clarify the spec first, break it into a plan, strict red/green TDD, YAGNI — packaged as an installable skill for Claude Code, Codex, Cursor, and other harnesses. Once installed, the agent pushes back and makes you nail down the spec before it writes anything.
- **Why it matters**: It got passed yesterday by the similar `mattpocock/skills` (329k vs 324k stars), but today both repos' daily gains slowed to the hundreds, not the thousands they were posting earlier. That suggests the skill-bundle format itself may be past its steepest adoption curve — the competition is shifting from who can rack up installs fastest to who actually keeps users around.
- **Tech stack**: Shell scripts + Markdown skill definitions, compatible with 15+ agent harnesses including Claude Code, Antigravity, Codex CLI/App, Cursor, and Gemini CLI
- **Getting started**: Medium — the skill itself installs fast, but it only pays off if you actually follow its "write the spec, then plan, then code" workflow; installing it alone doesn't automatically make you faster

---

### elementalsouls/Claude-BugHunter ★15,662 (+~1,800/day)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT

- **What it is**: Packages 83 bug-bounty and red-team skills, 15 slash commands, and attack patterns curated from 681 publicly disclosed reports across 24 vulnerability classes — plus enterprise identity and infrastructure attack chains — into a Claude Code skill bundle.
- **Why it matters**: Second day running near the top of the gain charts, adding nearly 1,800 more stars today — demand for "years of vulnerability knowledge packaged as an installable skill" keeps growing rather than fading as a one-day novelty. Worth flagging for readers: the project is sponsored by two security vendors, ApiSmart and ThreatWatch360, so it's still worth independently checking how current any specific attack chain is before relying on it.
- **Tech stack**: Claude Code Skills system + Burp Suite MCP integration; skills trigger automatically based on what you describe, no manual invocation needed
- **Getting started**: Medium — installs in one step, but you need to correctly scope the engagement and get authorization before pointing it at a real target

---

### replit/amuse ★123 (2 days old)

[GitHub](https://github.com/replit/amuse)　·　TypeScript　·　Apache-2.0

- **What it is**: A self-hosted personal AI agent published from Replit's own account — it browses the web live, handles reminders and background monitoring, turns goals into step-by-step plans, stores memory as plain text files, and asks for approval before it sends, submits, or pays for anything.
- **Why it matters**: The star count is still small (123 after two days), but the reason it's worth including is the source — this is Replit's official account, not a side project, which says a cloud-IDE company is now extending its product line into "a personal assistant that runs on your own machine," putting it in direct contrast with consumer agent products from OpenAI and Google. It only needs your own OpenAI key — no Replit account or hosted service required.
- **Tech stack**: Node.js 22.9+ / pnpm + PostgreSQL + an embedded Chromium for the live browser + OpenAI (`gpt-6.2-sol` as the main model, `gpt-6-luna` for quick steps, `gpt-image-2` for image generation)
- **Getting started**: Medium — `docker compose up` starts the service in one line, but you need your own OpenAI API key and have to set your own daily usage limit

## Notable Releases

### Claude Code v2.1.330

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.330)

- **Key changes**: Signing in can now apply the settings of an organization managed in Anthropic's Enterprise Admin Console, automatically picking up that org's cloud provider or gateway. Added a built-in mod called "easel" that draws charts automatically when asked or under MCP metrics results (Pro/Max, and Team/Enterprise depending on plan, on macOS/Linux) — turn it off in `/config` if you don't want it. `/tasks` integration and several self-hosted runner metrics and notices were also added, including a heads-up when a plugin's repository isn't in scope for the session.
- **Breaking changes**: None.
- **Impact**: Enterprise accounts no longer need to manually apply org settings after signing in. If you don't want charts drawn automatically, turn off easel in `/config`. Teams running self-hosted runners can read the new metrics directly to see delays from work order to runner pickup.

## Today's Takeaway

I used to assume agent-memory tooling was always something a framework built in as a feature of its own. Today made it clear that it's already being split out into a neutral service that serves a dozen agent runtimes at once — the same logic as skill bundles: the winner isn't the framework itself, it's whoever turns a capability (methodology, memory) into a layer every tool can plug into.

## References

- [rohitg00/agentmemory - GitHub](https://github.com/rohitg00/agentmemory)
- [obra/superpowers - GitHub](https://github.com/obra/superpowers)
- [obra/superpowers v7.0.2 release notes](https://github.com/obra/superpowers/releases/tag/v7.0.2)
- [mattpocock/skills (source for the comparison star count)](https://github.com/mattpocock/skills)
- [elementalsouls/Claude-BugHunter - GitHub](https://github.com/elementalsouls/Claude-BugHunter)
- [replit/amuse - GitHub](https://github.com/replit/amuse)
- [Claude Code v2.1.330 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.330)
