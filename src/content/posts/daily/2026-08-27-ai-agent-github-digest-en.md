---
title: "AI Agent GitHub Digest — 2026-08-27"
date: 2026-08-27
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, coding-agent, mcp-server]
lang: en
description: "DeepSeek's open-source agent harness dsh hits nearly 200k stars in one week, pulling the 'harness layer' battle out of a crowd of startups and into big-lab territory"
tldr: "deepseek-ai/deepseek-harness (dsh) uses a Cordis plugin architecture to make models, tools, sandboxes, and memory all swappable components, hitting nearly 200k stars a week after its developer preview launch; PrimeIntellect-ai/prime-agent runs long-lived research coding tasks on a Recursive Language Model architecture, surviving terminal disconnects via a persistent IPython session; liqiwa/mcp-radar automates this very kind of digest by scanning GitHub daily for newly ranked MCP servers. On the framework side, Mastra 1.61.0 adds a crash-resilient background task queue, and ComposioHQ/composio 0.17.0 extends SSRF protection to tool-execution downloads and S3 uploads."
series:
  name: "AI Agent GitHub Digest"
  order: 12
---

> 🌏 [中文版](/posts/daily/2026-08-27-ai-agent-github-digest)

## Today's Highlights

Today's biggest signal isn't a single feature — it's scale. DeepSeek's open-source agent harness dsh went from zero to nearly 200k stars in one week, pulling the "should the harness layer be standardized" fight out of a crowd of startups and into a face-off between major labs. Meanwhile PrimeIntellect-ai/prime-agent and liqiwa/mcp-radar are filling gaps from two different directions: one bets that agents need to run for much longer, the other bets that the ecosystem is moving too fast for humans to track without automation.

## Trending Repos

### deepseek-ai/deepseek-harness ⭐ 197.7k

[GitHub](https://github.com/deepseek-ai/deepseek-harness)　·　TypeScript　·　MIT

- **What it is**: DeepSeek's officially open-sourced agent harness (CLI name `dsh`), built on the same Cordis plugin system that powers Koishi behind the scenes, turning models, tools, sandboxes, memory, and even the UI into pluggable components.
- **Why it matters**: The project's thesis is "Agent = Model + Harness" — swapping models is easy, the hard part is the execution environment around the model. dsh supports 40+ model backends and can even delegate tasks to Claude Code or Codex as sub-backends. Multiple outlets report it approaching 200k stars in its first week (GitHub doesn't publish an official growth leaderboard, so this "fastest ever" claim currently rests on third-party media counts — this post only cites the current total star count, which is directly verifiable on GitHub). The project is explicitly marked as a developer preview and can introduce breaking changes at any time.
- **Tech stack**: Cordis plugin framework + TypeScript, supports 40+ model backends and delegation to other coding agent CLIs
- **Getting started**: Medium — still in developer preview with an unstable API, best tried in a non-production environment first

---

### PrimeIntellect-ai/prime-agent ⭐ 18.6k

[GitHub](https://github.com/PrimeIntellect-ai/prime-agent)　·　TypeScript + Python　·　MIT

- **What it is**: Prime Intellect's open-source research-oriented coding agent, built around a Recursive Language Model (RLM) architecture — a persistent IPython environment serves as the primary tool, with code replacing conversation as the main interface.
- **Why it matters**: Most coding agent sessions die the moment the connection drops. prime-agent keeps a session alive with a daemon, so long-running research evaluation tasks — an overnight benchmark run, a data processing job — can keep going after you close the terminal. It also ships a `/refine` command that lets the agent edit its own supplementary prompt and memory, while deliberately keeping the base system prompt immutable so the agent can't tune itself into a bad state.
- **Tech stack**: TypeScript CLI + a persistent Python IPython execution environment, with built-in subagent delegation and inter-agent messaging
- **Getting started**: Medium — requires understanding the RLM philosophy of "code instead of conversation," which departs from typical chat-style agent CLIs

---

### liqiwa/mcp-radar ⭐ 1

[GitHub](https://github.com/liqiwa/mcp-radar)　·　Python　·　MIT

- **What it is**: A fully automated GitHub Actions pipeline that scans newly created MCP server repos every day, ranks them by a momentum score (stars/days-since-creation × 10 + forks × 2), and outputs JSON data plus a weekly Markdown report.
- **Why it matters**: The MCP server ecosystem is growing too fast for manual curation — the same kind of curation this digest itself does — to keep up. mcp-radar automates the act of discovering new MCP servers, with no external infrastructure dependency beyond GitHub Actions. Worth subscribing to if you want to track the MCP ecosystem without manually searching every day.
- **Tech stack**: GitHub Actions + a Python data pipeline, outputting a JSON API plus an RSS feed
- **Getting started**: Low — just subscribe to the [mcp.liqiwa.com](https://mcp.liqiwa.com) site or its RSS feed, no self-hosting required

## Notable Releases

### Mastra 1.61.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.61.0)

- **Key changes**: Adds a configurable graceful shutdown option for generated servers; session messages sent during an active agent run are now automatically tagged `delivery: 'while-active'`; adds an experimental experiments API (`dataset.createExperiment` / `runExperimentItem` / `submitExperimentResult` / `finalizeExperiment`) plus corresponding HTTP endpoints for external orchestrators like Temporal to call.
- **Breaking Changes**: None.
- **Impact**: If you're deploying Mastra in a containerized environment (K8s, Cloudflare Sandbox), this release's graceful shutdown option is worth wiring in to avoid tasks getting killed mid-flight during traffic cutover. Teams integrating an external workflow orchestrator can evaluate whether the new experiments API fits their manual evaluation pipeline.

---

### ComposioHQ/composio 0.17.0

[Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcore%400.17.0)

- **Key changes**: The OpenAI/Anthropic provider's tool-call helper can now execute through a specified Tool Router session, preserving the session's meta-tool context across the run; tool-execution downloads, S3 uploads, and session file transfers now all carry SSRF protection, blocking responses pointed at private/loopback addresses and re-checking every redirect hop.
- **Breaking Changes**: Custom provider subclasses that override `executeToolCall` or `handleToolCalls` now receive an additional session target parameter and need their signatures updated.
- **Impact**: If you're using Composio to act on URLs returned by third parties — download links, upload destinations — this release's SSRF protection is a free security hardening. Teams with custom provider subclasses need to add the new parameter or they'll hit type-check or runtime errors.

## Today's Takeaway

I used to assume "agent harness standardization" would be a slow-burning fight among small and mid-size startups, but dsh nearing 200k stars in a week reminded me that once a large enough model company enters, the whole lane can get reshuffled within days. DeepSeek's entry point is clever too — instead of building a closed platform of its own, it built a plugin system that can swallow Claude Code and Codex as sub-backends, competing directly on top of its rivals' own ecosystems.

## References

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- [DeepSeek Harness (dsh): Open Source Agent Runtime — The Agent Report](https://the-agent-report.com/2026/08/deepseek-harness-dsh-open-source-agent-runtime/)
- [DeepSeek Harness Broke a GitHub Growth Record — Remio](https://www.remio.ai/post/deepseek-harness-broke-a-github-growth-record-the-hard-part-starts-now)
- [PrimeIntellect-ai/prime-agent](https://github.com/PrimeIntellect-ai/prime-agent)
- [liqiwa/mcp-radar](https://github.com/liqiwa/mcp-radar)
- [Mastra 1.61.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.61.0)
- [Composio 0.17.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcore%400.17.0)
