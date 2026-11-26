---
title: "AI Agent GitHub Digest — 2026-11-26"
date: 2026-11-26
category: daily
tags: [ai-agent, github, open-source, daily, mcp, mcp-server, agent-platform, prompt-injection]
lang: en
description: "Pydantic AI 2.75 sorts workspace files by trust level as a direct answer to prompt injection; Wakeshift ships almost in lockstep as the first open-source take on the freshly merged MCP Events spec"
tldr: "pydantic-ai v2.75.0 stops dumping every workspace file straight into instructions: files below 'operator' trust now reach RepoContext, Skills and Memory through tool calls or framed data instead, a direct answer to prompt injection. Claude Code v2.1.332 opens MCP-server-provided skills to beta and adds a hook that can block inline shell commands a skill loads. New MCP servers landed the same week for workflow debugging (temporal-mcp) and event delivery (Wakeshift). AgenticOS, built on Pydantic AI, just won the 2026 Open Agentic AI Innovation Award."
series:
  name: "AI Agent GitHub Digest"
  order: 103
---

> :globe: [中文版](/posts/daily/2026-11-26-ai-agent-github-digest)

## Today's Highlight

Two things happened at once today: the MCP ecosystem kept expanding, and agent security moved a layer upstream. Pydantic AI 2.75 now sorts workspace files by trust level instead of dumping all of them into instructions — a direct answer to prompt injection. The same week, Claude Code opened MCP-server-provided skills to beta and added a hook that can block shell commands a skill tries to run inline. MCP itself is busier still: days after the MCP Events spec merged, Wakeshift shipped the first open-source implementation of it, and Temporal quietly released its own MCP server. Meanwhile AgenticOS, built on Pydantic AI, just won the 2026 Open Agentic AI Innovation Award.

## Trending Repos

### vstorm-co/agenticos ★803

[GitHub](https://github.com/vstorm-co/agenticos)　·　Python (Pydantic AI)　·　Apache-2.0

- **What it is**: An open-source, self-hosted enterprise AI agent platform — teams run a shared chat, RAG, skills, a real browser, 4,700+ MCP servers, budgets, approvals and an audit trail on their own servers. It's pitched as a self-hosted alternative to ChatGPT Enterprise.
- **Why it matters**: Unlike most agent platforms, AgenticOS puts Claude Code and Codex inside a team's shared chat room, so colleagues and agents work in the same conversation instead of separate windows. It just won the 2026 Open Agentic AI Innovation Award, with the organizers specifically citing its adoption of AGENTS.md and its MCP integration.
- **Tech stack**: Pydantic AI + localized READMEs (Polish, German, Spanish) + desktop/mobile clients
- **Learning curve**: Medium — self-hosting needs your own server and model keys, but the install flow is ready to go

---

### temporalio/temporal-mcp ★9 (released Sep 18, still pre-release)

[GitHub](https://github.com/temporalio/temporal-mcp)　·　Go　·　MIT

- **What it is**: Temporal's own MCP server, letting agents query a Temporal workflow's state, event history, and a task queue's pollers and backlog. Read-only by default, with an opt-in to let an agent start workflows too.
- **Why it matters**: "Is this workflow stuck?" or "which runs failed in the last hour?" used to mean an engineer opening the Temporal UI themselves; now an agent can answer by querying the Visibility API directly. Temporal building this in-house, rather than leaving it to the community, signals that workflow orchestration is also settling on a permission model of "agents can look, but not touch by default."
- **Tech stack**: Go + Temporal Visibility API + OIDC (for the centrally hosted deployment)
- **Learning curve**: Medium — one command for a single developer, but connecting your own namespace means writing YAML config, and production needs OIDC auth

---

### experientiallabs/experiential ★18,559

[GitHub](https://github.com/experientiallabs/experiential)　·　Python　·　Apache-2.0

- **What it is**: An open-source LLM gateway that puts hosted, BYOK and local models behind one OpenAI-compatible API, lets you control which models a user or agent can use for what purpose and how much they can spend, and turns production traffic into a custom router or specialized model.
- **Why it matters**: Most LLM gateways stop at "forward the request and track the bill." Experiential goes a step further, turning real traffic into training data so a team can eventually swap in its own tuned, cheaper router instead of staying locked to a cloud provider's default routing. Its star count climbed to 18.5k in half a year, which says the cost-of-models pain point is bigger than it looks.
- **Tech stack**: Python (native data plane) + OpenAI/Anthropic Messages-compatible API + OpenTelemetry traffic capture
- **Learning curve**: Low — `pip install experiential` and one command starts a local gateway; production use just needs provider keys

---

### wakeshift/server ★2 (published Nov 23)

[GitHub](https://github.com/wakeshift/server)　·　TypeScript / Node.js　·　Apache-2.0

- **What it is**: Lets an MCP server "wake" the agents using it — your backend calls `emit()` on an event, and the subscribed conversation wakes up with it. Agents that support the standard MCP Events (SEP-3415) get it natively; agents that don't yet, like Claude Code, Codex and Cursor, get woken through Wakeshift's own per-agent bridges.
- **Why it matters**: The MCP Events spec only merged days ago and almost no agent supports it yet. Wakeshift is effectively an adapter for the whole ecosystem, turning any webhook — GitHub, Stripe, CI — into an event that wakes an agent, with no handler to write. It's one of the few open-source implementations already running against a spec this fresh.
- **Tech stack**: Node.js/TypeScript + Docker Compose + official SDKs (TypeScript, Python, Go)
- **Learning curve**: Medium — self-hosting needs Docker, but there's also a hosted version to try first

## Notable Releases

### Pydantic AI v2.75.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)

- **Key changes**: Workspace files read by `RepoContext`, `Skills` and `Memory` now flow through different channels depending on trust level. Files at `'operator'` authority (the default) still go straight into instructions as before; files below that level now reach the model through file tools (`RepoContext`), through `list_skills`/`load_skill` tool calls (`Skills`), or as attached framed data (`Memory`) — never mixed unconditionally into instructions. Separately, an empty or unparseable model response now raises its own `ModelEmptyResponseError`/`ModelInvalidResponseError`, so `FallbackModel` can fall back on it by default.
- **Breaking changes**: Yes. Runs on a durable engine like Temporal or DBOS will log one extra `realpath` workspace call after upgrading, so let in-flight runs finish or use worker versioning before upgrading. Code that catches `except UnexpectedModelBehavior` after `except ModelAPIError` will behave differently — the two new error classes inherit from both, but the `ModelAPIError` clause listed first now catches them.
- **What it means for you**: If your agent reads from a directory users can write to — arbitrary files in a repo, memory a user dropped in — this release directly lowers the risk of file content being executed as instructions, and is worth prioritizing. Check your exception-handling order and your durable-run upgrade timing first.

---

### Claude Code v2.1.332 (with v2.1.331)

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.332)

- **Key changes**: MCP servers can now provide skills to Claude Code (beta), shown as `server:skill` in the `/` menu. A new `PreSkillShellCommand` hook can refuse a skill or command's inline shell commands before they load. A batch of hangs and runaway-memory bugs around hooks and compaction were fixed, including hooks that print output without end and oversized logs that overflowed context.
- **Breaking changes**: None, but worth noting: on 2.1.331 and earlier, a settings file that already names `PreSkillShellCommand` opens a dialog at startup — that's expected, not a bug.
- **What it means for you**: If your workflow lets skills or MCP servers run arbitrary shell commands, these two releases patch the same gap from both ends — more controllable skill sources (MCP-provided skills) and a way to block suspicious inline commands before they run. Worth setting up `PreSkillShellCommand` after upgrading.

## Today's Takeaway

I used to think agent security was mostly a downstream job — screening what the model outputs, blocking dangerous tool calls. But what Pydantic AI did here is upstream sorting: the same workspace file, depending on who put it there, now travels through one of three different channels — instructions, tool calls, or framed data — instead of all being poured into the prompt without distinction. Next to Claude Code's new `PreSkillShellCommand` hook from the same week, these are really two construction sites on the same idea: one fixes how content gets into context, the other fixes it again right before execution.

## References

- [vstorm-co/agenticos](https://github.com/vstorm-co/agenticos)
- [AgenticOS — 2026 Open Agentic AI Innovation Award announcement](https://aaif.io/blog/winners-of-the-first-aaif-annual-technical-excellence-awards)
- [temporalio/temporal-mcp](https://github.com/temporalio/temporal-mcp)
- [experientiallabs/experiential](https://github.com/experientiallabs/experiential)
- [wakeshift/server](https://github.com/wakeshift/server)
- [Wakeshift — discussion of the MCP Events spec (SEP-3415)](https://news.ycombinator.com/item?id=50634239)
- [Pydantic AI v2.75.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)
- [Claude Code v2.1.332 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.332)
- [Claude Code v2.1.331 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.331)
