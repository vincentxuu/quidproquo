---
title: "AI Agent GitHub Digest — 2026-09-09"
date: 2026-09-09
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-verification, agent-platform]
lang: en
description: "reverify stops AI from making things up with a deterministic checker, bankmcp lets AI read your bank account — today's GitHub trending is all about making agents trustworthy"
tldr: "reverify proves deterministic verification beats asking the model to be careful, with a real binary-reverse-engineering benchmark (97% error rate, all caught); useAgent packages Claude Code/Codex into a cloud AI-coworker platform; bankmcp gives AI read-only access to European bank accounts via PSD2; headcount splits a Claude Code skill ecosystem into a 16-department company structure; Pydantic AI 2.41 and Agno 3.0.8 both shipped today"
series:
  name: "AI Agent GitHub Digest"
  order: 25
---

## Today's Highlights

Today's throughline is trust — reverify doesn't ask the model to be more careful, it hands the checking to a deterministic tool outside the model; bankmcp locks bank data access behind a read-only, self-hosted boundary; headcount solves "too many skills, which one do I install" with department boundaries instead. Three different layers, one same question: the more capable agents get, the more you need to pin down what's actually true, what they can touch, and which tool they should reach for right now.

## Trending Repos

### 2akouwu/reverify ⭐ 1,036

[GitHub](https://github.com/2akouwu/reverify)　·　Python　·　MIT

- **What it is**: An MCP server + CLI that hands every AI claim about code or binaries to a deterministic tool for verification — only what passes counts, the model doesn't get to just assert it.
- **Why it matters**: The author picked the scenario with the worst hallucination rate — binary reverse engineering — and benchmarked it: across 71 real Windows system files, the AI's textbook answer was wrong 97% of the time, and reverify caught every single one, never letting a wrong claim through (the same gate reruns in CI on Linux, macOS, and an independent aarch64 run). It also ships a `rollover` command that hands a long task off to a file and starts a fresh session, replacing lossy auto-summaries — works with Claude Code, Codex, Gemini CLI, and OpenCode.
- **Tech stack**: Python + MCP SDK, distributed as the PyPI package `reverify`
- **Getting started**: Easy — `pip install reverify` then wire it into whatever MCP client you already use; reverse-engineering workflows are the best fit out of the box, other use cases need you to define your own verification criteria

---

### useagenthq/useagent ⭐ 283

[GitHub](https://github.com/useagenthq/useagent)　·　TypeScript　·　AGPL-3.0

- **What it is**: An open-source "AI coworker" platform that wraps Claude Code, Codex, and OpenCode in cloud sandboxes, giving agents their own cloud computer, your tools, and your company context — they hand back finished work (a live site, a deck, a tested PR), not just an answer.
- **Why it matters**: Most agent platforms only solve "how do I call the model." useAgent solves "how do I let an agent safely reach company resources" — an event-sourced Postgres timeline that survives restarts, human-in-the-loop approval cards that pause destructive actions, and native Slack integration so a team can hand out work in the channels they already use. Still alpha, but the maintainers say it already runs real daily workloads.
- **Tech stack**: Bun runtime + Postgres event-sourced timeline + Daytona/Cube sandboxes
- **Getting started**: Medium — you need to stand up your own backend and sandbox infrastructure; it's not a single command you just run

---

### noskillish/bankmcp ⭐ 151

[GitHub](https://github.com/noskillish/bankmcp)　·　TypeScript　·　MIT

- **What it is**: A self-hosted, read-only MCP server that lets an AI assistant read your bank balances and transactions directly, through Enable Banking's PSD2 API covering 2,700+ European banks.
- **Why it matters**: Personal-finance agent tools usually solve data access the blunt way — screenshots the agent reads with vision, or handing your credentials to a third party. bankmcp goes through standard MCP plus PSD2 authorization instead: data stays on your own machine, balances and transactions are never stored, no telemetry is sent, and the agent only ever gets read access — it can't move money. The tradeoff is European-bank-only coverage, bounded by what Enable Banking supports.
- **Tech stack**: Node.js 24+ · npm package `bankmcp` · Enable Banking PSD2 API
- **Getting started**: Medium — you need to register an application with Enable Banking first and go through one OAuth bank-authorization flow

---

### cbrock84/headcount ⭐ 1,323

[GitHub](https://github.com/cbrock84/headcount)　·　Markdown　·　MIT

- **What it is**: Packages a Claude Code skill ecosystem as a "company" — 16 departments, 172 skills, each department independently installable.
- **Why it matters**: The usual approach bundles every skill into one package, and the bigger the project the harder it is to tell which skill should even fire. headcount solves this with department boundaries — `department:skill` naming avoids collisions, and a given question only wakes the skills in the relevant department. For anyone who wants Claude Code across a whole organization (legal, finance, security), not just engineering, this is a ready-made skeleton to copy or install directly.
- **Tech stack**: Pure Markdown skill definitions + the Claude Code plugin marketplace mechanism
- **Getting started**: Easy — `/plugin marketplace add cbrock84/headcount`, then install departments as needed

## Notable Releases

### Pydantic AI v2.41.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.41.0)

- **What changed**: Added an `openai-codex` provider that authenticates directly with a ChatGPT/Codex subscription, no separate API key needed; added a direct image-generation API via `ImageGenerator`; Anthropic's native web search usage now shows up correctly in `RequestUsage.details` and gets priced into `cost`
- **Breaking changes**: `fallback_model` on `ImageGeneration` and `XSearch` is deprecated in favor of `fallback_subagent_model` (the old parameter still works, but will be removed in the next major version)
- **Impact**: If you use pydantic-ai to call Anthropic's native web search, cost accounting gets more accurate after upgrading; anywhere you use `fallback_model`, plan to rename it before it's removed

---

### Agno v3.0.8

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.8)

- **What changed**: Added `Knowledge.read_full_page` / `aread_full_page`, which return an entire page in one bounded SQL read with revision pinning support; added `create_postgres_engine` / `create_async_postgres_engine`, factory functions that bundle shared connection-pool and JSON-serialization defaults
- **Breaking changes**: None
- **Impact**: If you use Agno's Knowledge base to read long documents, you can now replace hand-rolled pagination with the bounded read; PostgreSQL users can drop some connection-pool boilerplate

## Today's Takeaway

I used to think agent tools' trust problem was mostly about the model's own hallucination rate. Seeing reverify's benchmark changed that — making verification a deterministic layer independent of the model is what actually stops hallucinations. The model proposes, the tool signs off, and keeping those two roles separate works far better than just asking the model to "think it over before answering."

## References

- [2akouwu/reverify — GitHub](https://github.com/2akouwu/reverify)
- [useagenthq/useagent — GitHub](https://github.com/useagenthq/useagent)
- [noskillish/bankmcp — GitHub](https://github.com/noskillish/bankmcp)
- [cbrock84/headcount — GitHub](https://github.com/cbrock84/headcount)
- [Pydantic AI v2.41.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.41.0)
- [Agno v3.0.8 — Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.8)
