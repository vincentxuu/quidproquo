---
title: "Hermes Agent: Nous Research's Self-Improving Agent, and Its Real Relationship With OpenClaw"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, nous-research, ai-agent, self-improving, gateway, openclaw]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 1
tldr: "Hermes Agent is Nous Research's MIT-licensed agent framework, built around a learning loop: it writes its own skills, curates its memory, and searches past sessions with FTS5. It ships `hermes claw migrate` to move you off OpenClaw — but OpenClaw was not replaced, and both projects are still moving. This is the series opener: what it is, how it differs, and when not to pick it."
description: "Series opener for Hermes Agent: the architecture, what the self-improvement loop actually consists of, how the seven terminal backends and the multi-platform gateway fit together, and where the line sits versus OpenClaw, Claude Code, and LangGraph."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-intro)

Hermes Agent is [Nous Research](https://nousresearch.com/)'s open-source (MIT) agent framework. The official one-liner positions it as the only agent with a built-in learning loop:

> It's the only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions.
> — [hermes-agent README](https://github.com/NousResearch/hermes-agent)

That sentence is the skeleton of the whole project, and the cleanest way to state its difference. Everything else — many platforms, many providers, many backends — competitors can match. The learning loop is where it places its bet.

This post opens the series. The goal is not to restate the [official docs](https://hermes-agent.nousresearch.com/docs/), which change faster than any blog post can track, but to capture the **trade-offs and the failure modes**.

## The shape of it

```
Entry points
  CLI / TUI  ·  Gateway (Telegram/Discord/Slack/WhatsApp/Signal/Email)
  Desktop app  ·  Web dashboard  ·  ACP (VS Code/Zed/JetBrains)
  API server (OpenAI-compatible)  ·  Python library  ·  Batch runner
        ↓
AIAgent (run_agent.py)
  prompt assembly  ·  provider resolution (3 API modes)  ·  tool dispatch
  context compression and prompt caching
        ↓
State                         Tool backends
SQLite + FTS5 (sessions)      7 terminal · 5 browser · 4 web · MCP
MEMORY.md / USER.md           files, vision, TTS…
```

One detail up front: the README says "40+ tools" while the developer architecture page on the same docs site says "70+ tools, 28 toolsets." Numbers like these have a short half-life in this project, so this series never leans on them — check the [reference docs](https://hermes-agent.nousresearch.com/docs/reference/cli-commands) when you need an exact count.

The codebase is no longer a pure Python project either: GitHub currently reports roughly 76% Python and 20% TypeScript, the latter coming from the desktop app, the TUI frontend, and the web dashboard.

## The learning loop is four separable mechanisms

"Self-improving" sounds like one thing. It is actually four mechanisms you can disable independently — which is exactly what you need to know when one of them misbehaves:

| Mechanism | What it does | What you control |
|---|---|---|
| Autonomous skill creation | Abstracts a finished complex task into a reusable skill | `skills.write_approval` can require your sign-off before writes |
| Memory curation | Periodically nudges the agent to tidy `MEMORY.md` / `USER.md` | `write_approval` and background review notifications can be turned off |
| Session search | SQLite FTS5 full-text search plus LLM summarization for cross-session recall | Summarization runs on the auxiliary model — point it at something cheap |
| User modeling | Honcho-style dialectic user profile | **No longer built in** — it moved to a memory provider plugin you install |

That last row is the easiest trap right now. Older write-ups (including the first version of this post) describe Honcho dialectic modeling as built in. The docs now place it at `plugins/memory/honcho/` — if you don't install it, you don't have it. The same layer offers OpenViking, Mem0, Hindsight, RetainDB, ByteRover, and Supermemory as alternatives.

Skills follow the [agentskills.io](https://agentskills.io) open standard, which matters for the "how locked in am I" question: skills travel between frameworks.

## Three layers people keep conflating

The most common beginner confusion is treating these as one thing:

1. **Where you type** (CLI, TUI, Telegram, desktop, IDE)
2. **Where commands run** (local, docker, ssh, modal, daytona, vercel_sandbox, singularity — seven terminal backends)
3. **Where inference happens** (Nous Portal, OpenRouter, Anthropic, self-hosted Ollama or vLLM…)

The three are fully orthogonal. You can type in Telegram, run commands in a Modal cloud sandbox, and infer on your own vLLM. Which also means: when something breaks, first ask which layer broke. The official debugging order — `hermes doctor` → `hermes model` → `hermes setup` → `hermes sessions list` → `hermes gateway status` — is layer-by-layer elimination.

[Post 5](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends) covers layer 2; [post 3](/en/posts/ai/2026-08-18-hermes-agent-providers) covers layer 3.

## On OpenClaw: a migration path, not a succession

The first version of this post called Hermes "the official successor to OpenClaw." That was wrong, and this revision fixes it.

What is true: Hermes ships `hermes claw migrate`, and `hermes setup` auto-detects `~/.openclaw` and offers to import. It carries over SOUL.md, MEMORY.md/USER.md entries, user-created skills, the command allowlist, messaging settings, and allowlisted API keys. But OpenClaw is a separate project by a separate team and is still being developed. The README's own community section links [HermesClaw](https://github.com/AaronWong1999/hermesclaw), a bridge whose stated purpose is running "Hermes Agent and OpenClaw on the same WeChat account" — which would be pointless if one had replaced the other.

Migration details, and what does *not* come across, are in [post 10](/en/posts/ai/2026-08-18-hermes-agent-openclaw-migration). For OpenClaw itself, this site has a [full documentation series](/en/posts/ai/2026-03-28-openclaw-overview).

## Where the line sits versus Claude Code and LangGraph

| Dimension | Hermes Agent | Claude Code | LangGraph |
|---|---|---|---|
| Positioning | Personal AI operations system | Coding agent in terminal/IDE | Library for building agents |
| Residency | Gateway runs continuously, wakes on messages | Runs when you run it | You deploy it |
| Models | 20+ providers, with fallback and key rotation | Anthropic models (incl. Bedrock/Vertex) | Bring your own |
| Execution | 7 terminal backends, serverless included | Local | You deploy it |
| Skills | Auto-created plus a shared hub | Yes, human-authored | None |
| Learning loop | Built in | None | Build it yourself |

Read that table carefully. Claude Code having no learning loop is a trade-off, not a defect: memory lives in files a human maintains, buying predictability at the cost of automatic accumulation. Hermes's auto-created skills and curated memory come with the reverse cost — **your agent rewrites its own behavior**, which in any workflow that needs reproducibility is a liability rather than an asset. That is precisely why `write_approval` exists.

## When not to pick it

- **You only want to call an LLM from code.** This is a system, not an SDK. It can be [used as a Python library](https://hermes-agent.nousresearch.com/docs/), but you inherit a lot of machinery you won't use.
- **You need a team deployment.** The design still centers a single owner; the access model is roughly "who is allowed to DM this bot."
- **You need strict reproducibility.** Self-rewriting skills and memory make "same input, same output" hard. If you go ahead anyway, turn write approval on first.
- **You don't want another service to operate.** It stays resident, it schedules things, it acts on its own.

## The rest of the series

| # | Topic |
|---|---|
| 1 | This post |
| 2 | [Install and upgrade](/en/posts/ai/2026-08-18-hermes-agent-install): native Windows, Termux, Nix, rollback |
| 3 | [Model providers](/en/posts/ai/2026-08-18-hermes-agent-providers): OAuth subscriptions, routing, fallback, key pools |
| 4 | [Nous Tool Gateway](/en/posts/ai/2026-08-18-hermes-agent-tool-gateway): one subscription instead of four accounts |
| 5 | [Seven terminal backends](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends): isolation levels and the state-sync trap |
| 6 | [Memory and skills](/en/posts/ai/2026-08-18-hermes-agent-memory-skills): write approval, security scanning, Skills Hub |
| 7 | [Tools, MCP, plugins](/en/posts/ai/2026-08-18-hermes-agent-tools-plugins): toolsets and `execute_code` |
| 8 | [Gateway and scheduling](/en/posts/ai/2026-08-18-hermes-agent-gateway-cron): platforms and cron delivery |
| 9 | [Security model](/en/posts/ai/2026-08-18-hermes-agent-security): approvals, deny rules, prompt injection |
| 10 | [Migrating from OpenClaw](/en/posts/ai/2026-08-18-hermes-agent-openclaw-migration): what moves and what doesn't |

## What this replaces

This post supersedes "Hermes Agent: Nous Research's Self-Improving AI Agent," published 2026-04-05; the old URL `/posts/ai/2026-04-05-hermes-agent-intro-en` now 301-redirects here. It was fully revised against the upstream README and docs site and rewritten as the opener of a ten-post series. Four misleading claims were fixed: terminal backends went from six to seven (Vercel Sandbox was added); Honcho user modeling moved from built-in to a memory provider plugin; "93% Python" no longer holds (now ~76% Python / ~20% TypeScript); and "Hermes is the official successor to OpenClaw" was wrong — it offers a migration path while OpenClaw continues independently. Command-by-command listings were handed back to the official docs.

## References

- [Hermes Agent on GitHub](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/)
- [Nous Research](https://nousresearch.com/)
- [Nous Portal](https://portal.nousresearch.com/)
- [agentskills.io — open skill standard](https://agentskills.io)
- [Honcho — user modeling system](https://github.com/plastic-labs/honcho)
- [HermesClaw — community WeChat bridge](https://github.com/AaronWong1999/hermesclaw)
- [Atropos — Nous RL environments](https://github.com/NousResearch/Atropos)
