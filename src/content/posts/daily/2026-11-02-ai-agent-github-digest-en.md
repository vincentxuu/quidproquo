---
title: "AI Agent GitHub Digest — 2026-11-02"
date: 2026-11-02
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, computer-use, agent-skills]
lang: en
description: "A local-first desktop agent team, a computer-use tool that drives the OS through its accessibility tree, and an Uncle Bob skill that hands code-quality judgment to deterministic tools — three different gaps in agent autonomy, closed from three different angles"
tldr: "**Orkas** (⭐7.2k) is a local-first desktop AI team app: a Commander agent breaks your goal into to-dos and coordinates 16 built-in specialist agents, plus whatever CLI coding agents — Claude Code, Codex, and others — you already have installed, treated as local sessions under one roof. **vercel-labs/agent-desktop** (⭐6.5k) gives agents reliable computer use by reading the OS accessibility tree in Rust and returning a JSON snapshot with stable element refs instead of guessing from screenshots; it just picked up Linux support. **unclebob/ub-mode** (⭐6.2k) is an agent skill from Robert C. \"Uncle Bob\" Martin that hands the question of whether code is actually good to deterministic tools — crapper, dryer, mutator — instead of trusting the agent's own word for it. No major framework release today."
series:
  name: "AI Agent GitHub Digest"
  order: 79
---

> 🌏 [中文版](/posts/daily/2026-11-02-ai-agent-github-digest)

## Today's Highlight

The three entries on GitHub today each close a different gap in "agents doing more on their own" — they're not competing for the same slot. Orkas pulls multiple agents, including whatever coding CLIs you've already installed, under one desktop commander — that's the coordination layer. vercel-labs/agent-desktop lets agents stop guessing at pixels and read the OS's own accessibility tree instead — that's the operation layer. unclebob/ub-mode takes the question of whether a piece of code is actually well-written out of the agent's own hands and hands it to deterministic scoring tools like CRAP complexity and mutation testing — that's the quality-control layer. None of these three are a contest over raw model capability; they're three different answers to the same question: once capability is good enough, where does the bottleneck actually move to?

## Trending Repos

### Orkas-AI/Orkas ⭐ 7.2k

[GitHub](https://github.com/Orkas-AI/Orkas) · JavaScript + TypeScript · MIT

- **What it is**: A local-first desktop AI team app. A "Commander" agent breaks your goal into a to-do list and coordinates 16 built-in specialist agents (research, content, e-commerce, office work) — and it can also drive external CLI agents already installed on your machine, such as Claude Code, Codex, OpenCode, OpenClaw, and Hermes, treating each as a local session under the same commander.
- **Why it's worth watching**: Unlike a typical single-chat-window agent app, Orkas keeps a persistent "project" model — goals, rules, memory, and files all stick around — and supports scheduled automations (hourly, daily, weekly, monthly, with missed runs caught up within 12 hours). For anyone who already has several coding-agent CLIs installed, Orkas isn't another agent to add to the pile; it's a layer that coordinates the ones you already have. The free version ships with 500 built-in-model credits, or you can bring your own key for Claude, OpenAI, Gemini, DeepSeek, Kimi, GLM, Qwen, MiniMax, or Doubao.
- **Tech stack**: JavaScript + TypeScript desktop app, 16 built-in specialist agents, plus integration with external CLI agents (Claude Code, Codex, OpenCode, OpenClaw, Hermes).
- **Getting started**: Easy — download for macOS 12+ or Windows 10+, free credits are enough to try it out, bring-your-own-key is optional.

---

### vercel-labs/agent-desktop ⭐ 6.5k

[GitHub](https://github.com/vercel-labs/agent-desktop) · Rust · Apache-2.0

- **What it is**: A CLI plus C library that gives AI agents reliable computer use on macOS, Windows, and Linux — by reading the OS's accessibility tree (AT-SPI on Linux) instead of taking screenshots and guessing where things are on screen.
- **Why it's worth watching**: Every call returns a JSON snapshot in which every actionable UI element gets a stable `ref` ID. The agent clicks or types by ref, then re-snapshots to verify — and refs stay stable across redraws, so retries are safe instead of being a vision model's guess at pixels. v1.0.0 shipped Linux support on October 27, 2026, followed by a v1.0.2 patch on October 30. There's no embedded LLM and no GUI here — it's purely a tool: every command prints one JSON envelope and exits.
- **Tech stack**: Rust core, 60 commands (56 operational) covering observing the screen, clicking, typing, scrolling, window management, clipboard, and notifications, shipped as both a CLI and a C library.
- **Getting started**: Medium — requires accessibility permissions from the OS, and Linux needs AT-SPI support available.

---

### unclebob/ub-mode ⭐ 6.2k

[GitHub](https://github.com/unclebob/ub-mode) · Markdown (skill file) · No license stated

- **What it is**: An agent skill written by Robert C. "Uncle Bob" Martin that enforces disciplined software-engineering principles whenever an agent writes or changes code — "First Make It Work" (TDD, redesign from first principles, challenge the premise) followed by "Then Make It Right" (fix root causes, refactor), the whole flow wired to deterministic quality-gate tools.
- **Why it's worth watching**: This isn't a framework — it's just a `SKILL.md` plus a README, four commits total — but its approach is notable: instead of letting the agent declare its own code "done" and "good," it hands that judgment to separate, deterministic tools. `unclebob/crapper` scores CRAP complexity per function (must stay under 10), `unclebob/dryer` flags duplicated code at 0.8+ similarity, `unclebob/mutator` runs mutation testing to catch code that tests pass over without actually exercising, and `unclebob/uml-viewer` visualizes all of it. It's loosely based on a trimmed-down subset of `@poteto`'s `poteto-mode`/`pstack` rules. Created just last week (October 25, 2026), it's already at 6.2k stars and 344 forks.
- **Tech stack**: The `SKILL.md` convention plus four companion CLI tools (crapper, dryer, mutator, uml-viewer).
- **Getting started**: Easy — copy `SKILL.md` into your agent's skills directory (e.g. `~/.claude/skills/ub-mode/`) and invoke `/ub-mode`; the companion tools need to be installed separately for full enforcement.

## Notable Releases

No major framework releases today.

## Today's Takeaway

I used to think the bottleneck on agent autonomy mostly came down to raw model capability. These three repos made me realize it's actually split across three separate layers now: coordination (who decides how to split a big goal across which agents), operation (how an agent acts on a real OS without breaking things), and quality (how you actually know an agent's claim of having done something right is true). Each of today's picks addresses exactly one of those layers — which suggests the agent toolchain itself is specializing into more distinct roles, rather than waiting for one bigger model to solve all three at once.

## References

- [Orkas-AI/Orkas — GitHub repo](https://github.com/Orkas-AI/Orkas)
- [vercel-labs/agent-desktop — GitHub repo](https://github.com/vercel-labs/agent-desktop)
- [unclebob/ub-mode — GitHub repo](https://github.com/unclebob/ub-mode)
- [unclebob/crapper — GitHub repo](https://github.com/unclebob/crapper)
- [unclebob/dryer — GitHub repo](https://github.com/unclebob/dryer)
- [unclebob/mutator — GitHub repo](https://github.com/unclebob/mutator)
