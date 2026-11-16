---
title: "AI Agent GitHub Digest — 2026-11-17"
date: 2026-11-17
category: daily
tags: [ai-agent, github, open-source, daily, mcp, browser-automation, rpa]
lang: en
description: "CopilotKit spins its AG-UI governance layer out into OpenBot; browser-use 1.0.6 defaults to a model that costs 15x more"
tldr: "CopilotKit's OpenBot turns 'one isolated computer plus a governance layer per agent' into its own project; browser-use 1.0.6 switches its default model to BU 4.0, pushing a single task's cost from $0.0014 to $0.022."
series:
  name: "AI Agent GitHub Digest"
  order: 94
---

> 🌏 [中文版](/posts/daily/2026-11-17-ai-agent-github-digest)

## Today's Highlight

No single breakout story today, but three different projects are converging on the same theme: control and auditability. CopilotKit split its agent sandbox-and-governance logic out into its own OpenBot project, iFLYTEK turned RPA into something an agent can call directly, and the official MCP org keeps quietly growing its server registry. Meanwhile browser-use 1.0.6 made its default model 15x more expensive — a reminder that "not specifying a model" has a cost of its own.

## Trending Repos

### CopilotKit/OpenBot ⭐ 12,552

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **What it is**: Spins "give every AI agent its own computer" into a standalone project — an isolated browser, file system and toolset per agent, with every action checked against a governance layer before it runs and logged after it runs.
- **Why it matters**: It's built on AG-UI, an open protocol CopilotKit itself created, so it isn't locked to one agent framework — an existing agent can plug into this governance layer without a rewrite. Against months of talk about tightening agent permissions, this turns the abstract principle into something you can actually run.
- **Stack**: AG-UI protocol + browser automation + filesystem sandboxing
- **Setup difficulty**: Medium — you need an AG-UI-compatible agent before you can attach the governance layer

---

### iflytek/astron-rpa ⭐ 5,258

[GitHub](https://github.com/iflytek/astron-rpa)　·　Python　·　Apache-2.0

- **What it is**: An open-source RPA suite from iFLYTEK built to be "agent-ready" — instead of the usual click-and-record RPA interface for humans, it's designed so an AI agent can call the RPA engine directly to drive real desktop applications.
- **Why it matters**: Most RPA tools are recording-based interfaces built for people; this one flips that and packages RPA as a tool an agent can invoke (it even lists `mcp` as a topic), filling in desktop automation as a piece of the agent toolkit. For the mountain of legacy systems that only expose a GUI, this kind of bridge is a lot cheaper than rewriting an API.
- **Stack**: Python + MCP integration + on-premise deployment
- **Setup difficulty**: Medium — self-hosted, on-prem deployment adds a layer of setup beyond a cloud SaaS

---

### modelcontextprotocol/registry ⭐ 7,470

[GitHub](https://github.com/modelcontextprotocol/registry)　·　Go　·　NOASSERTION (maintained by the official org)

- **What it is**: MCP's official "community-driven registry" — it doesn't store server code itself, but each MCP server's `server.json`: name, package location, how to run it, and discovery metadata.
- **Why it matters**: The MCP ecosystem has had servers springing up everywhere with no central directory; this registry wants to be the npm/PyPI-style index for them. It just shipped icon display and search-performance improvements this week, a sign the official org is pushing it from "usable" toward "infrastructure you can depend on."
- **Stack**: Go + PostgreSQL + Docker (`ghcr.io/modelcontextprotocol/registry`)
- **Setup difficulty**: Low — one `docker run` gets you a local instance to query

## Notable Releases

### browser-use 1.0.6

[Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.6)

- **Key changes**: `Agent(task)` and `ChatBrowserUse()` now default to `bu-4.0` instead of `bu-fast`; a first run without a key opens Browser Use's login page and continues after approval; cloud browsers now print a live-view link.
- **Breaking changes**: No code-level breaking change, but a major default-behavior shift — BU 4.0 tokens cost 15 times as much as `bu-fast` ($1.80/$9.00 vs. $0.12/$0.60 per 1M input/output tokens), and it runs at high reasoning by default instead of medium. In the maintainers' own test case, a simple task's cost jumped from $0.0014 to $0.022.
- **Impact**: If your code doesn't explicitly pass an `llm` argument, your bill quietly gets 15x+ more expensive after upgrading. Pass `llm='bu-fast'` to keep the previous model and price, or `llm='bu-4.0-mini'` for simple tasks at lower cost.

## Today's Takeaway

The real story in the browser-use release isn't the model upgrade itself — it's the act of changing a default. When a tool swaps its default model from a cheap option to a flagship one that costs 15x more, every production deployment that never pinned a model explicitly gets a silent price hike. That's also why release notes from Agno, LlamaIndex and others increasingly carry lines like "BREAKING: raise requires-python" or explicit version pins — the ecosystem is learning to treat default behavior as part of the API contract that needs to be communicated, not a detail that can be changed on a whim.

## References

- [CopilotKit/OpenBot - GitHub](https://github.com/CopilotKit/OpenBot)
- [iflytek/astron-rpa - GitHub](https://github.com/iflytek/astron-rpa)
- [modelcontextprotocol/registry - GitHub](https://github.com/modelcontextprotocol/registry)
- [browser-use 1.0.6 Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.6)
- [browser-use pricing](https://docs.browser-use.com/open-source/models)
