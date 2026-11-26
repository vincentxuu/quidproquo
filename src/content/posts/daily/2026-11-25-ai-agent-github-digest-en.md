---
title: "AI Agent GitHub Digest — 2026-11-25"
date: 2026-11-25
category: daily
tags: [ai-agent, github, open-source, daily, mcp, mcp-server, agent-skills, agent-framework]
lang: en
description: "The new repos share one trait: each patches something an existing agent could not do, whether Rust hot-path porting, an iOS simulator, or read-only SAP queries; Mastra and the OpenAI Agents SDK both push long-running work and approvals into the framework itself"
tldr: "fast-anything reached about 4,000 stars four days after creation by having a coding agent rewrite only the slowest 5% of a program and verify identical results first; agent-sim lets AI agents drive an iOS simulator on Linux; sap-data-mcp exposes 412 read-only SAP query tools. On the framework side, Mastra core 1.86.0 and OpenAI Agents SDK v0.26.0 both shipped in late November."
series:
  name: "AI Agent GitHub Digest"
  order: 102
---

> :globe: [中文版](/posts/daily/2026-11-25-ai-agent-github-digest)

> Data basis: GitHub has no historical trending snapshots. The star counts and version details below are what the repo pages showed at the time of writing (2026-11-26), not a snapshot of November 25 itself. Creation and release dates come from GitHub's own records.

## Today's Highlight

The new repos here have one thing in common: none is yet another general-purpose agent framework. Each patches something an existing coding agent could not do. fast-anything has the agent rewrite only the slowest slice of a program and check the result itself; agent-sim lets an agent drive an iOS simulator on Linux without a Mac; sap-data-mcp lets an agent query SAP while the code has no write path at all. On the framework side, Mastra and the OpenAI Agents SDK each moved long-running execution and approvals a step further into the framework.

## Trending Repos

### EL4CTEO/fast-anything ★about 4,000

[GitHub](https://github.com/EL4CTEO/fast-anything)　·　Rust　·　MIT

- **What it is**: A command-line tool plus MCP server that profiles your Python, Node or Ruby app, picks the slowest function, has your coding agent port only that piece to Rust, checks the port gives identical results, and swaps it in. The swap is fully reversible.
- **Why it matters**: Most "rewrite it in Rust" proposals mean redoing the whole project. This one narrows the scope to the hottest function and requires a replay of recorded real calls first; nothing is enabled unless every case matches, and a port that turns out slower than the original is not enabled either. The README's measured example is a Python fuzzy-dedupe going from 4.91s to 42ms (116x), but those figures come from the author's own machine and examples, not an independent test.
- **Tech stack**: Rust (about 70% of the code) + per-language bridges such as PyO3 and napi-rs + MCP server
- **Difficulty**: Medium. You need a Rust toolchain and a coding agent such as Claude Code or Codex.
- **Timeline**: Created November 21, already at v0.8.8 by November 25; the page shows about 4,000 stars and 289 forks.

---

### INK-Q/agy-fast ★about 1,500

[GitHub](https://github.com/INK-Q/agy-fast)　·　TypeScript　·　MIT

- **What it is**: A local MCP plugin for Google Antigravity (CLI, desktop and IDE) that batches scattered searches, symbol outlines, multi-file edits and build checks into single calls, and injects one workspace snapshot per session.
- **Why it matters**: It saves quota by taking fewer round trips rather than switching models. The README publishes its method: 10 days of real coding transcripts, 14 baseline main sessions (5,771 turns) against 7 agy-fast main sessions (901 turns). Under standard weighting quota drops 31.5%, and 25.8% under a more conservative cache discount. Note the small sample (only 7 agy-fast sessions) and that the data was compiled by the author.
- **Tech stack**: TypeScript + MCP, zero external dependencies
- **Difficulty**: Low. It is a local plugin and needs no extra service.
- **Timeline**: Created November 19; latest release v0.3.1 (November 24).

---

### Developing-Gamer/agent-sim ★about 600

[GitHub](https://github.com/Developing-Gamer/agent-sim)　·　Rust　·　Apache-2.0 (x86Sim patches follow GPL-3.0-or-later)

- **What it is**: Lets an AI agent drive an iOS simulator on an ordinary Linux machine, with no Mac and no GPU. x86Sim does the simulation underneath; agent-sim is the agent layer on top.
- **Why it matters**: The README lists MCP tools including `snapshot`, `tap`, `type`, `scroll`, `swipe`, `launch` and `screenshot`, so an agent can operate and verify an iOS app from the cloud or CI. The author says plainly it is at an early stage: XCUITest suites are not supported yet, and real-device behavior such as camera, push, signing and DRM cannot be judged with it.
- **Tech stack**: Rust + Shell + C, built on x86Sim
- **Difficulty**: High. It needs x86-64 Ubuntu 24.04 with 8+ CPUs, 16 GB of memory and 60 GB of free disk.
- **Timeline**: Created November 21; v0.1.0 released November 23.

---

### w1ccc/sap-data-mcp ★about 160

[GitHub](https://github.com/w1ccc/sap-data-mcp)　·　Python　·　MIT

- **What it is**: Three read-only MCP servers that let an AI assistant query SAP S/4HANA through RFC/BAPI, private-cloud OData and public-cloud released APIs, with 412 read-only tools registered across 8 standard modules including MM, SD, FI and CO.
- **Why it matters**: The biggest worry in connecting enterprise systems to agents is writes, and this project builds the limit into its structure: RFC calls go through an allowlist of 98 standard read functions, HTTP sends only fixed GET requests (the sole POST fetches an OAuth token), every call is logged to a local JSONL file, and passwords stay in a local `.env` and never pass through the AI. The README also states it is not an official SAP product, and what you can query depends on which services the target system enables and your account's permissions.
- **Tech stack**: Python + PyRFC / SAP NW RFC SDK + OData V2/V4
- **Difficulty**: High. It needs a reachable SAP system, account permissions and, for the RFC variant, the SAP SDK.
- **Timeline**: Created November 20; v0.2.0 released November 22. The star count is small; this is an early-stage project.

## Notable Releases

### OpenAI Agents SDK for Python v0.26.0

[Release Notes](https://github.com/openai/openai-agents-python/releases)

- **Key changes**: Docker sandbox mounts move to `DockerVolumeMountStrategy`, and storage such as S3 Files must be mounted on the Docker host and granted through a trusted `SandboxPathGrant`. An input guardrail tripwire now also stops queued function tools; to check input before any tool starts, set `run_in_parallel=False`. When MCP metadata keys conflict, explicit call metadata wins, then `tool_meta_resolver`, then discovery defaults.
- **Breaking changes**: Per the Docker mounts section of the release notes, switch to the new mount strategy and create a fresh session with the updated manifest. A custom `TraceProvider` must report its real state through `is_disabled()` for server-side traces to work.
- **What it means for you**: If you mount external storage into Docker sandboxes, change the mounts per the notes before upgrading, and if you have custom tracing, add `is_disabled()`. The same page also lists v1.0.0-alpha.2 (November 23, pre-release), which adds resuming conversations and pending approvals across workers and warns to upgrade checkpoint readers before writers; it is still alpha.

---

### Mastra core 1.86.0

[Release Notes](https://github.com/mastra-ai/mastra/releases)

- **Key changes**: Dataset experiments can run as crash-safe, resumable jobs with `durable: true`; a native durable Agent execution engine can be selected through `durable.executionEngine`; `createChannelTools()` and a Slack toolset make chat integrations channels-first.
- **Breaking changes**: Yes. `get_process_output` no longer supports `wait: true` (use `waitSeconds`, 1 to 300); the MCP boundary field `projectId` in `@mastra/mcp-apps-components` is renamed `project`; `@mastra/playground-ui` traces components have major API changes.
- **What it means for you**: If anything calls `get_process_output`, replace `wait: true` before upgrading; if you customized traces screens in playground-ui, budget time for the API changes.

## Takeaway

I assumed new projects in the agent ecosystem would cluster around bigger frameworks, but these repos mostly fill gaps: fast-anything fills performance, agent-sim fills platform support, sap-data-mcp fills the safety boundary for enterprise systems. Each also states its verifiable limits up front, such as the read-only allowlist, verify-before-enable, and admitting it cannot replace real-device testing. For someone deciding whether to try them, that is easier to judge than a loud claim to do everything.

## References

- [EL4CTEO/fast-anything](https://github.com/EL4CTEO/fast-anything)
- [INK-Q/agy-fast](https://github.com/INK-Q/agy-fast)
- [Developing-Gamer/agent-sim](https://github.com/Developing-Gamer/agent-sim)
- [w1ccc/sap-data-mcp](https://github.com/w1ccc/sap-data-mcp)
- [OpenAI Agents SDK for Python releases](https://github.com/openai/openai-agents-python/releases)
- [Mastra releases](https://github.com/mastra-ai/mastra/releases)
