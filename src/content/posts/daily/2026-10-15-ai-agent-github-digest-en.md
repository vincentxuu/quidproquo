---
title: "AI Agent GitHub Digest — 2026-10-15"
date: 2026-10-15
category: daily
tags: [ai-agent, github, open-source, daily]
lang: en
description: "The most interesting things on today's trending list aren't yet more agent frameworks but tools that audit, bill and finish agent work — the ecosystem is filling in what happens after the agent is done"
tldr: "iFixAi (27,424★, +2,109 today) audits whether agents follow business rules with 60 inspections; HyperFrames (63,713★, +1,089) lets agents write HTML and render reproducible MP4s; Apify MCP Server (11,251★) v0.18 drops the legacy SSE transport and supports x402 payments; Soup (9,034★) claims 8B fine-tuning on a 4 GB laptop GPU, and from v0.76.0 settings that never took effect now block loading. Releases: Pydantic AI v2.56.0, Mastra 1.77.0, Claude Code v2.1.299."
series:
  name: "AI Agent GitHub Digest"
  order: 61
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-ai-agent-github-digest)

## Today's Highlight

Beyond REA and context-mode, which keep holding the top of trending, what climbed today is tooling for after the work is done: iFixAi audits whether agents follow business rules, HyperFrames turns agent-written HTML into reproducible video, and Apify's MCP server lets agents pay for scrapers themselves. On the framework side, Pydantic AI and Mastra both spent the same day shoring up sandboxes and durable execution.

## Trending Repos

### ifixai-ai/iFixAi ⭐ 27,424 (+2,109)
[GitHub](https://github.com/ifixai-ai/iFixAi)　·　Python　·　Apache-2.0

- **What it is**: An agent auditing tool that checks not latency or token use but whether the agent does its job according to business KPIs and organizational rules, with results in under 120 seconds by its own claim.
- **Why it matters**: Most eval and red-team tools measure technical capability; iFixAi makes business policy the thing under test. Its Policy Lab searches for the shortest harmful sequence of individually permitted actions. Grading can be self-graded, one independent judge, or a multi-judge ensemble; 10 inspections run by default and `--full-run` runs all 60.
- **Stack**: Python CLI supporting most model providers, also runnable as a plugin or skill in Claude Code, Codex, Cursor and others
- **Getting started**: Low — `pip install "ifixai[openai]"`, `ifixai setup`, `ifixai run`

---

### heygen-com/hyperframes ⭐ 63,713 (+1,089)
[GitHub](https://github.com/heygen-com/hyperframes)　·　TypeScript　·　Apache-2.0

- **What it is**: An open-source framework that renders HTML, CSS, media and seekable animations into deterministic MP4s, built for coding agents.
- **Why it matters**: Video generation is usually a black-box model. HyperFrames goes the other way: the agent writes HTML and the framework renders it frame by frame, so the same input always yields the same output, and you can lint, preview and change one line to re-render. It ships 21 skills covering planning, animation, media and rendering.
- **Stack**: TypeScript/Node.js CLI, used through a Claude Code plugin or `npx skills add`
- **Getting started**: Low — install the Claude Code plugin and prompt with `/hyperframes`

---

### apify/apify-mcp-server ⭐ 11,251 (+233)
[GitHub](https://github.com/apify/apify-mcp-server)　·　TypeScript　·　MIT

- **What it is**: An MCP server that lets agents call any Actor (scraper or automation) in the Apify Store as an MCP tool, with a hosted version at mcp.apify.com.
- **Why it matters**: One server connects thousands of scrapers across social media, search, maps and e-commerce. The payment model is worth noting: buy a token, or pay per request via x402, so the agent pays for its own tool runs. The v0.18 line removed the legacy SSE endpoint; clients still on `/sse` need to move to Streamable HTTP.
- **Stack**: TypeScript, MCP Streamable HTTP, Apify API
- **Getting started**: Low — the hosted version only needs an Apify token

---

### MakazhanAlpamys/Soup ⭐ 9,034 (+247)
[GitHub](https://github.com/MakazhanAlpamys/Soup)　·　Python　·　Apache-2.0

- **What it is**: A CLI that fine-tunes and post-trains LLMs from one YAML file and one command.
- **Why it matters**: The author claims layer streaming (the frozen base stays out of VRAM and is fed to the GPU one layer at a time) makes it possible to fine-tune Llama-3.1-8B on a 4 GB laptop GPU, with a Colab T4 notebook to verify it yourself; the feature is still beta. From v0.76.0, options that were validated but never actually applied now block loading, so older configs may stop working — run `soup doctor` before upgrading.
- **Stack**: Python, QLoRA, NF4 quantization
- **Getting started**: Medium — you need a GPU and training data, but no distributed setup

## Notable Releases

### Pydantic AI v2.56.0
[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0)

- **Key changes**: `SmolSandbox` runs harness capabilities in a local microVM; `PGTaskDurability` provides Postgres-backed durable execution; `Skills` can be layered
- **Breaking changes**: None flagged; compatibility note: `BrowserUse` now defaults to the host model and telemetry is opt-in
- **What it means for you**: projects using BrowserUse should check model and cost after upgrading; see today's [framework update](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0-en)

---

### Mastra @mastra/core@1.77.0
[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0)

- **Key changes**: Factory sandbox provider contract (Docker/E2B/Platform); run fencing across a dozen storage backends; two-way links between MCP client and server traces
- **Breaking changes**: `@mastra/server` workflow routes can no longer start internal workflows; durable agents must use agent routes
- **What it means for you**: services calling workflow routes directly need changes first; see today's [framework update](/posts/daily/2026-10-15-framework-mastra-1.77.0-en)

---

### Claude Code v2.1.299
[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)

- **Key changes**: conversations over 200K tokens idle for about 54 minutes are compacted before the prompt cache expires; `claude plugin eval` can exclude specific built-in tools
- **Breaking changes**: None
- **What it means for you**: fixes sandboxed commands being able to write into a `--plugin-dir` folder that is later loaded outside the sandbox; upgrade soon if you develop from a plugin directory

## Today's Takeaway

I thought agent eval tools competed on measurement accuracy. iFixAi treating business policy as the thing under test — and searching for harmful combinations of permitted actions — exposes a different gap: an agent with all-green technical metrics can still break company rules through a chain of perfectly legal steps.

## References

- [ifixai-ai/iFixAi — GitHub](https://github.com/ifixai-ai/iFixAi)
- [heygen-com/hyperframes — GitHub](https://github.com/heygen-com/hyperframes)
- [apify/apify-mcp-server — GitHub](https://github.com/apify/apify-mcp-server)
- [MakazhanAlpamys/Soup — GitHub](https://github.com/MakazhanAlpamys/Soup)
- [GitHub Trending (daily)](https://github.com/trending?since=daily)
- [Pydantic AI v2.56.0 — GitHub Releases](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0)
- [Mastra @mastra/core@1.77.0 — GitHub Releases](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0)
- [Claude Code v2.1.299 — GitHub Releases](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)
