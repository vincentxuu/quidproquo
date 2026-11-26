---
title: "AI Agent GitHub Digest — 2026-11-16"
date: 2026-11-16
category: daily
tags: [ai-agent, github, open-source, daily, mcp, multi-agent]
lang: en
description: "Three repos surged this week, and none of them are about making agents smarter — they're about giving agents a review layer, a device-control layer, and a portable memory layer"
tldr: "Plannotator (a multi-agent review workspace) gained 860 stars in 24 hours; callstack/agent-device (a device-control MCP server) and kody (a cross-agent memory cloud with a non-standard license) also surged this week; Agno v3.2.0 and pydantic-ai v2.68.0 each shipped a set of compatibility changes."
series:
  name: "AI Agent GitHub Digest"
  order: 93
---

> :globe: [中文版](/posts/daily/2026-11-16-ai-agent-github-digest)

## Today's Highlight

None of today's three breakout repos are about getting an agent to think better. Plannotator fills in a human review surface, agent-device fills in a layer for controlling real phones and simulators, and kody fills in memory and credentials that are supposed to follow you across agents. Agent reasoning already seems good enough — what's missing is the infrastructure that connects it to three things: a human who can see what it did, a real device it can touch, and a memory that doesn't disappear when you switch tools.

## Trending Repos

### backnotprop/plannotator ★ 11,728 (+860/24h)

[GitHub](https://github.com/backnotprop/plannotator)　·　TypeScript　·　Apache-2.0

- **What it is**: A local, browser-based review surface that sits between you and multiple coding agents (Claude Code, Codex, Copilot CLI, Gemini CLI, OpenCode, Kiro, Droid, Amp, and others). When an agent proposes a plan, an HTML prototype, or finishes a round of code changes, the app pops open so you can annotate, comment, and send feedback straight back to the agent with one click.
- **Why it matters**: Reviewing an agent's output used to mean scrolling through terminal text or flipping into an IDE to read diffs line by line. Plannotator pulls that step out into its own dedicated surface, and also handles diff review across Git, GitButler, Jujutsu, and Perforce. Gaining 860 stars in a single day (November 15) suggests the demand for this "review layer" is real, not speculative.
- **Stack**: A TypeScript frontend plus a local CLI/hook layer that plugs into each agent's CLI.
- **Adoption difficulty**: Medium — you need to install the matching plugin/hook for each coding agent before feedback actually flows back; it doesn't just work out of the box.

---

### callstack/agent-device ★ 5,403

[GitHub](https://github.com/callstack/agent-device)　·　TypeScript　·　MIT

- **What it is**: A device-control layer built for coding agents — a CLI, a built-in MCP server, and a Node.js API, all three letting an agent drive apps on iOS/Android/HarmonyOS simulators and real devices, tvOS/Android TV, web, macOS, and Linux.
- **Why it matters**: After an agent changes code, it usually has to guess whether the change worked from a screenshot or a log it reads itself. agent-device instead gives the agent a token-efficient accessibility snapshot and lets it act through refs and selectors, instead of feeding the model a whole screenshot to reason over. Expensify and Shopify are already using it to verify their own apps — this isn't a demo-stage toy.
- **Stack**: Node.js (22.12+ required, 24+ for web automation) plus an MCP server and drivers for multiple device platforms.
- **Adoption difficulty**: Low — `npm install -g agent-device@latest`, then `agent-device doctor` to check your setup, and you're running.

---

### kody-hq/kody ★ 961

[GitHub](https://github.com/kody-hq/kody)　·　TypeScript　·　License: Other (GitHub classifies it as NOASSERTION — not a standard open-source license)

- **What it is**: An "agent cloud" built on Cloudflare Workers and MCP, storing an agent's memory, credentials, code, and automations, with the pitch that this state travels with you across different MCP hosts (the docs name ChatGPT as the primary target).
- **Why it matters**: Most agent-memory approaches are locked to a single framework or a single host. kody deliberately leans toward a compact MCP surface — search and execute — instead of stacking up a big static tool catalog, aiming to let memory and credentials move with you when you switch agents or hosts. One thing worth flagging: GitHub lists its license field as "Other/NOASSERTION," not a standard open-source license like MIT or Apache 2.0 — read the actual license terms in the repo yourself before using it commercially.
- **Stack**: Cloudflare Workers + D1 + KV + Durable Objects, in an Nx monorepo.
- **Adoption difficulty**: Medium — `npm install && npm run dev` runs it locally, but you need to decide upfront whose Cloudflare account holds the data.

## Notable Releases

### Agno v3.2.0

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)

- **Key changes**: Super Agent no longer routes requests through manager members — it does the work itself, with Platform Builder as its only member. A2A is upgraded to the official a2a-sdk 1.x release. The Slack interface is rebuilt entirely on the Slack Bolt SDK.
- **Breaking Changes**: `OSManager.tool_call_limit` now defaults to 24 (was 8), and `num_history_runs` defaults to 5 (was 7). The A2A `/v1/message:*` and `/v1/tasks:*` routes are removed in favor of each component's own A2A endpoint. In Slack, only the person who started a run can Approve/Deny it, unless they're listed in `approvers=`.
- **Impact on you**: If you maintain both the Agno server and client, A2A and Slack need to be upgraded together — you can't upgrade just one side. Old A2A v0.3 clients still work through the compatibility layer, but direct imports of removed helpers will break.

---

### pydantic-ai v2.68.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)

- **Key changes**: Adds `OutputTokenLimitExceeded`; when a response gets cut off at `max_tokens`, `ModelFallback` now automatically retries with the next model. Adds `RequestInput`, which lets a run pause mid-execution to ask a human for approval or an answer.
- **Breaking Changes**: Text in user/tool content that looks like an "application frame" is now flagged inline instead of being escaped outright — officially filed as a compatibility note, which means the output format has changed.
- **Impact on you**: If your pipeline depends on how `ModelFallback` behaves on truncation, or parses special-looking text inside user/tool content, re-check both after upgrading to make sure the output still matches your original assumptions.

## Today's Takeaway

I used to assume the agent ecosystem was still mostly a contest over whose reasoning is sharper. Today's three breakout repos suggest the center of gravity has shifted sideways — none of them are about the model itself; all three are filling in "how does a human see what the agent did," "how does the agent touch a real device," and "how does the agent's memory stop being stuck inside one tool." kody's license field is also a useful reminder: a fast-rising repo doesn't automatically mean a clean license — read the actual terms yourself before using one commercially.

## References

- [backnotprop/plannotator](https://github.com/backnotprop/plannotator)
- [Plannotator Gains 860 Stars in 24 Hours, Surges on GitHub Trending](https://blockchain.news/news/plannotator-github-trending-surge)
- [callstack/agent-device](https://github.com/callstack/agent-device)
- [kody-hq/kody](https://github.com/kody-hq/kody)
- [Agno v3.2.0 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)
- [pydantic-ai v2.68.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)
