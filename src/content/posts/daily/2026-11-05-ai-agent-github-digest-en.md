---
title: "AI Agent GitHub Digest — 2026-11-05"
date: 2026-11-05
category: daily
tags: [ai-agent, github, open-source, daily, mcp, computer-use, reverse-engineering]
lang: en
description: "REA's reverse-engineering tool hit 430k stars in three weeks just as Anthropic started restricting reverse-engineering requests; agent-desktop doubled its stars in three days; Scrapling bolted an MCP server onto an established scraping framework — all three are building the capability first, then wiring up the agent layer"
tldr: "morluto/rea (⭐430k) wraps engines like Ghidra and Hopper into MCP tools for agents, hitting a new high in three weeks just as reports surfaced that Anthropic has started blocking some reverse-engineering requests in Claude — and even sent a takedown notice to a developer reverse-engineering Claude Code itself; vercel-labs/agent-desktop (⭐14.6k) reads the OS's native accessibility tree instead of screenshots, letting agents operate a computer, and doubled its stars in three days; D4Vinci/Scrapling (⭐96k), a year-old scraping framework, just added a native MCP server so agents can scrape without fighting anti-bot defenses themselves. No major framework release today."
series:
  name: "AI Agent GitHub Digest"
  order: 82
---

> 🌏 [中文版](/posts/daily/2026-11-05-ai-agent-github-digest)


## Today's Highlight

Today's three repos each take a different angle on the same playbook: build the underlying capability first, then wire up an MCP layer for agents — instead of building an "agent-native" tool from scratch. REA wraps existing reverse-engineering engines into MCP tools and hit 430k stars in three weeks, but the same stretch also brought Anthropic's pushback on reverse-engineering requests — attention and policy risk climbing together. agent-desktop continues the growth curve we flagged last week, doubling its stars in three days. Scrapling, a year-old scraping framework, only recently filled in the MCP piece.

## Trending Repos

### morluto/rea ⭐ 430k

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **What it is**: Wraps existing reverse-engineering engines like Ghidra and Hopper into a unified set of MCP tools, letting an agent analyze native binaries, JS/Electron apps, .NET assemblies, and Android APKs — answering "how does this feature work" with disassembly evidence attached, no source code required.
- **Why it's worth watching**: We covered this as a standalone tool back in mid-October (see [Tool of the Day: REA](/posts/daily/2026-10-13-tool-rea-en)), and it's climbed to 430k stars in three weeks since. But the same stretch brought reports that Anthropic has started blocking some reverse-engineering requests in Claude Code and Opus 5.5 — reportedly tied to a rule against "recreating a specific existing game" — and sent a takedown notice to a developer trying to reverse-engineer Claude Code itself. A tool that lets anyone reverse-engineer anything has run straight into the gray zone between commercial licensing and copyright law; Cornell Tech law professor James Grimmelmann called it a looming crisis for trade secret and copyright law.
- **Tech stack**: TypeScript wrapper + MCP server, calling into existing reverse-engineering engines like Ghidra, IDA, and Hopper
- **Getting started**: Medium — installable via `npx`, but reading the output still requires understanding disassembly, and you need to confirm the target software's license actually permits reverse engineering

---

### vercel-labs/agent-desktop ⭐ 14.6k

[GitHub](https://github.com/vercel-labs/agent-desktop)　·　Rust　·　Apache-2.0

- **What it is**: A computer-use CLI for agents that reads the component tree through macOS/Windows/Linux's native accessibility APIs, returning a JSON snapshot with stable element refs — instead of making the model guess coordinates from a screenshot.
- **Why it's worth watching**: We covered this in the [Nov 2 digest](/posts/daily/2026-11-02-ai-agent-github-digest-en) at 6.5k stars; three days later it's at 14.6k, more than doubling. The advantage of accessibility-tree-based control over screenshot-based control is that element refs stay stable, so a failed action can just be retried instead of re-identifying coordinates from scratch.
- **Tech stack**: Rust core + native accessibility APIs per platform, exposed through both a CLI and a C library
- **Getting started**: Low — installable via npm, Homebrew, or direct download, with categorized commands for observation, action, keyboard/mouse, and app management ready to go

---

### D4Vinci/Scrapling ⭐ 96k

[GitHub](https://github.com/D4Vinci/Scrapling)　·　Python　·　BSD-3-Clause

- **What it is**: A web scraping framework that handles everything from a single request to a full-scale crawl, with a built-in stealth browser for bypassing defenses like Cloudflare, CSS/XPath parsing, and an interactive shell for pulling data without writing code.
- **Why it's worth watching**: This project has been around for over a year, climbing toward 100k stars on parsing speed and anti-bot capability alone. It recently added a native MCP server, so an agent can issue a scraping command directly instead of having to work around anti-bot defenses itself. Like REA and agent-desktop, it's taking the "build the underlying capability first, then bolt on an MCP layer for agents" route.
- **Tech stack**: Python, with a built-in stealth fetcher (bypassing defenses like Cloudflare), concurrent crawling with session/proxy rotation, and a native MCP server
- **Getting started**: Low — `pip install` and the CLI or interactive shell can pull data right away; the concurrent spider setup is only needed for more advanced use

## Notable Releases

No major framework update today. CrewAI 1.15.35 (Nov 3) only updated the LiteLLM model catalog docs; LangGraph SDK 0.4.12 (Nov 3) just removed the `fairness_weight` field from `PrioritySettings` and fixed a minor stream-reconnect bug — neither clears the bar for "significant new feature or breaking change."

## Today's Takeaway

I used to score "how good is an agent tool" purely on technical capability — how many formats it can parse, how fast it runs. REA's controversy this week is a reminder that once a tool makes reverse engineering something anyone can do, the next bottleneck usually isn't technical — it's the legal line around copyright and licensing. Anthropic's restriction on reverse-engineering requests changed what this tool can actually be used for faster than any model capability upgrade has.

## References

- [morluto/rea — GitHub repo](https://github.com/morluto/rea)
- [Anthropic's Claude AI blocks video game cloning and reverse-engineering — Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/anthropics-ai-model-is-now-blocking-attempts-at-video-game-recreation-and-cloning-users-also-claim-non-malicious-generic-reverse-engineering-tasks-are-blocked)
- [Anthropic sent a takedown notice to a dev trying to reverse-engineer its coding tool — Yahoo Finance](https://finance.yahoo.com/news/anthropic-sent-takedown-notice-dev-215709151.html)
- [vercel-labs/agent-desktop — GitHub repo](https://github.com/vercel-labs/agent-desktop)
- [D4Vinci/Scrapling — GitHub repo](https://github.com/D4Vinci/Scrapling)
- [CrewAI 1.15.35 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.35)
- [LangGraph SDK 0.4.12 — Release Notes](https://github.com/langchain-ai/langgraph/releases)
