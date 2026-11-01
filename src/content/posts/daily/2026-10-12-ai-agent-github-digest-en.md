---
title: "AI Agent GitHub Digest — 2026-10-12"
date: 2026-10-12
category: daily
tags: [ai-agent, github, open-source, daily, reverse-engineering, agent-security, computer-use]
lang: en
description: "rea gains 25,585 stars in a day to top GitHub trending; agent-driven reverse engineering, autonomous pentesting, and real-iPhone control all surface the same day"
tldr: "morluto/rea (96,754★, +25,585 today) tops GitHub trending after a one-day surge, wiring agents through MCP into Hopper/Ghidra/IDA to reverse-engineer native binaries and JS/Electron apps with evidence instead of guesswork. mhtsec/ARTEX (3,121★) is a third-party backup of the project that placed first on overall score in Baidu's \"agent+\" red-vs-blue competition, letting an LLM agent run penetration tests autonomously; since Oct 7 several vendors have reported misuse, so it is covered here only to explain the risk, and we do not recommend installing or using it. zhongerxin/iPhone-use (2,983★) lets Codex drive a real iPhone over USB. rociiu/talorys (719★) deploys a personal agent into your own Cloudflare account with one command. Pydantic AI v2.55.0 drops Python 3.10 support."
series:
  name: "AI Agent GitHub Digest"
  order: 58
---

> 🌏 [中文版](/posts/daily/2026-10-12-ai-agent-github-digest)

## Today's Highlight

Today's four repos share a pattern: agents aren't staying inside the chat window anymore — they're reaching out to touch real systems. rea lets an agent reverse-engineer real binaries, and gained 25,585 stars in a single day to take the #1 spot on GitHub trending. ARTEX lets an agent run penetration tests against real network assets (which is also why it has been abused; see its entry). iPhone-use lets an agent drive your actual iPhone over USB. And talorys runs your personal agent directly inside your own Cloudflare account. The infrastructure is yours, and so is whatever the agent touches.

## Trending Repos

### morluto/rea ⭐ 96,754

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **What it is**: Wires agents (Claude Code, Codex, Cursor, etc.) through MCP into existing reverse-engineering toolchains — Hopper/Ghidra/IDA, WABT, pwntools — to analyze native binaries, JS/Electron apps, websites, and EVM bytecode, returning findings backed by evidence rather than having the LLM stare at raw assembly and guess.
- **Why it matters**: Most "agent + reverse engineering" projects just dump raw bytes at an LLM and hope for the best. rea instead puts an MCP layer over mature RE tools like Hopper and Ghidra, so the agent cites evidence and states limitations the way a senior RE engineer would before drawing a conclusion. That's also why it jumped 25,585 stars in a single day to top trending: developers finally have a tool for "figure out how this app's feature works" instead of opening Ghidra and grinding through it by hand.
- **Tech stack**: MCP SDK + Hopper/Ghidra/IDA integration + WABT (WASM) + pwntools (ELF/crash dumps)
- **Setup difficulty**: Medium — analyzing JS/Electron apps needs no extra engine, `npx rea-agents setup` just works; native binary analysis still requires your own Hopper, Ghidra, or IDA license.

---

### mhtsec/ARTEX ⭐ 3,121

[GitHub](https://github.com/mhtsec/ARTEX)　·　Go　·　AGPL-3.0

- **What it is**: An AI autonomous penetration-testing system (Go backend, Next.js frontend) where an agent runs asset discovery, vulnerability hunting, and traffic recording on its own, with human-in-the-loop interception and approval; the project placed first on overall score (7th on the live range) in Baidu's "agent+" red-vs-blue competition, and this repo is a third-party source-code backup, not the author's official release.
- **Provenance and misuse risk (read first)**: CrowdStrike's Oct 7 report says an attacker used ARTEX with multiple LLMs against South Korean financial institutions (see the [security alert](/posts/daily/2026-10-08-security-artex-ai-pentest-korea-banks-en)); the author announced on Oct 8 that the public version went closed-source, and Microsoft, Recorded Future, Zscaler and AhnLab have since reported further misuse, while mirrors and forks of unverifiable provenance keep circulating. It is listed here to explain the risk, not to encourage installing or using it.
- **Why it matters**: It shows "agents doing security testing" scoring well in a competition, not just demos — built-in ScopeSentry asset sync, an asset coverage graph, and detailed approval records make for a far more complete pipeline than just pointing an agent at a target with a prompt. The original Docker image source, `autumn27/artex`, was pulled from Docker Hub, and what circulates now is community images of unverifiable origin, which is exactly the supply-chain risk.
- **Tech stack**: Go (single binary with embedded frontend) + Next.js + PostgreSQL + Anthropic/OpenAI API-driven exploration
- **Setup difficulty**: Not assessed. The project has a record of misuse and its official version is gone, so this site gives no install or usage advice; security teams should focus on access control for exposed systems and behavioral anomaly detection.

---

### zhongerxin/iPhone-use ⭐ 2,983

[GitHub](https://github.com/zhongerxin/iPhone-use)　·　Python　·　MIT

- **What it is**: Lets Codex operate your real iPhone over USB — opening apps, reading pages, tapping, scrolling, typing, organizing lists — while mirroring the phone's screen live in a sidebar.
- **Why it matters**: Most "computer use" agent tooling stops at the browser or desktop (browser-use, computer-use, and similar virtual environments). This one connects to a physical iOS device through Appium's WebDriverAgent, signaling that the next step for agent control is real phones, not just emulators or web pages. It anonymously reports usage telemetry by default (launches, tool calls, error categories — no screen content or input text), which you can disable via an environment variable.
- **Tech stack**: WebDriverAgent (WDA) + a local Python MCP server + USB forwarding
- **Setup difficulty**: High — requires a full Xcode install, signing WDA with your own Apple developer account, and keeping the phone unlocked and trusted for the duration of the USB connection — noticeably more involved than installing a typical MCP server.

---

### rociiu/talorys ⭐ 719

[GitHub](https://github.com/rociiu/talorys)　·　TypeScript　·　MIT

- **What it is**: One command (`npx create-talorys@latest`) deploys a personal AI agent into your own Cloudflare account, with built-in chat, memory, tasks, notes, and scheduled reminders.
- **Why it matters**: Unlike most SaaS-wrapped AI assistants, talorys runs on Cloudflare Workers AI and Durable Objects under your own account — no telemetry, single-user, and fits inside Cloudflare's free tier. It's a rare case in the "self-hosted personal agent" niche that actually ships one-command deployment.
- **Tech stack**: Cloudflare Workers + Durable Objects + Workers AI + React
- **Setup difficulty**: Low — one `npx create-talorys@latest` command deploys it, and it runs within the free tier.

## Notable Releases

### Pydantic AI v2.55.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)

- **Key changes**: Every package now requires Python 3.11 or newer; adds recording of tool requests made by harness capabilities like `ExaSearch`, `YouSearch`, and `LocalStack` under durable execution, so those calls can be tracked on replay too.
- **Breaking changes**: Drops Python 3.10 support — environments still on 3.10 will silently resolve to pydantic-ai 2.54.0 or earlier instead of raising an error.
- **What it means for you**: If your CI or deployment still runs Python 3.10, upgrade the runtime before upgrading pydantic-ai — otherwise you'll silently end up on an old version missing this release's features, with no warning.

## Today's Takeaway

I used to think "agents controlling physical devices" was still stuck at browser automation. But iPhone-use wires straight into WebDriverAgent to drive a real iPhone, and the reason rea gained 25,585 stars in a day to top GitHub is "help me figure out how this app's feature works" — which made me realize the agent frontier isn't about chatting better, it's about whether an agent can actually reach past your computer into a real system.

## Update Log

- 2026-10-24: Added provenance and misuse-risk warnings for ARTEX based on primary reports from CrowdStrike, Microsoft, AhnLab and others: CrowdStrike's Oct 7 report, the author's Oct 8 move to closed source, and that this repo is a third-party backup. "Champion" is now "first on overall score", and the description of how to install it was removed so the entry no longer encourages installing or using it.

## References

- [morluto/rea](https://github.com/morluto/rea)
- [GitHub Trending (2026-10-12)](https://github.com/trending?since=daily)
- [mhtsec/ARTEX](https://github.com/mhtsec/ARTEX)
- [zhongerxin/iPhone-use](https://github.com/zhongerxin/iPhone-use)
- [rociiu/talorys](https://github.com/rociiu/talorys)
- [Pydantic AI v2.55.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)
