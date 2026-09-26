---
title: "AI Agent GitHub Digest — 2026-09-27"
date: 2026-09-27
category: daily
tags: [ai-agent, github, open-source, daily, agent-platform, agent-orchestration, mcp-server]
lang: en
description: "Paperclip slots agents into an org chart; Buzz puts humans and agents in the same signed event log — two answers to the same question: how do you organize once you have more than one agent?"
tldr: "Paperclip (86.7k★) manages a fleet of agents like employees — org chart, budgets, heartbeat scheduling. Block's open-sourced Buzz (34.8k★) goes the other way, putting humans and agents in the same Nostr-signed workspace. Z.ai open-sourced ZCode, joining the club of vendors building their own coding-agent shell. mobile-mcp extends MCP tooling to real iOS/Android devices. Notable releases: Pydantic AI v2.51.0 adds OpenAI GPT-Live support and tightens realtime tool_choice / model-id matching; Claude Code v2.1.283 adds a `deniedModels` lockdown setting and `/doctor prompt-audit`."
series:
  name: "AI Agent GitHub Digest"
  order: 43
---

> 🌏 [中文版](/posts/daily/2026-09-27-ai-agent-github-digest)

## Today's Highlight

Two of today's trending repos are solving the same problem from opposite directions: what do you do once you have more agents than you can track? Paperclip slots every agent into an org chart, with a budget and an approval gate. Block's open-sourced Buzz goes the other way, putting humans and agents in the same room, on the same signed protocol, without drawing a hard line between "manager" and "employee." Same problem, one side picks hierarchy, the other picks a shared commons.

## Trending Repos

### paperclipai/paperclip ⭐ 86,759

[GitHub](https://github.com/paperclipai/paperclip)　·　TypeScript　·　MIT

- **What it is**: An open-source Node.js server plus React UI that manages a fleet of AI agents like employees — assigning goals, reviewing work, and tracking spend from an org chart.
- **Why it matters**: Most frameworks are about making one agent good at one task. Paperclip assumes you already have a pile of agents (OpenClaw, Codex, Claude, Cursor — bring your own) and need company-grade governance instead: an org chart, monthly budget caps, heartbeat-triggered wake-ups, approval gates. It names its own target pain point plainly: "20 simultaneous Claude Code terminals open and losing track of who's doing what."
- **Tech stack**: Node.js backend + React frontend + cross-provider agent runtime (bring-your-own-agent)
- **Getting started**: Medium — the concept (managing agents as employees) is new enough that you'll want to understand the org chart, heartbeats, and budgets before diving in

---

### block/buzz ⭐ 34,783

[GitHub](https://github.com/block/buzz)　·　Rust　·　Apache-2.0

- **What it is**: An open-source shared workspace for humans and agents from Block (Square's parent company, also behind the open-source agent Goose), built on a Nostr relay — every message, code review, and workflow step is a signed event in the same log.
- **Why it matters**: Most agent-collaboration tools bolt a chatbot onto an existing Slack or Discord. Buzz instead has agents join the workplace using the same protocol as a human — their own keypair, their own channel memberships, their own audit trail. They can open repos, send patches, review code, run workflows, even join voice huddles. It's one identity model for both humans and agents, not a separate permissions layer bolted on afterward.
- **Tech stack**: Rust + the Nostr relay protocol + NIP-34 git events
- **Getting started**: Medium — the default deployment is self-hosted (you run your own relay), and you'll need to understand Nostr's signed-event model to reason about the permission design

---

### zai-org/ZCode ⭐ 6,827

[GitHub](https://github.com/zai-org/ZCode)　·　TypeScript　·　Apache-2.0

- **What it is**: An open-source coding-agent workbench from Z.ai (the company behind the GLM models), shipping a desktop app, a browser UI, and a terminal Agent CLI all from the same repo.
- **Why it matters**: Alongside Claude Code, Codex, and Cursor, another major LLM vendor has decided to build its own coding-agent shell instead of just selling API access — a sign the coding-agent race is moving from "whose model is smarter" to "which interface do developers actually want to talk to an agent through." Shipping terminal, desktop, and browser interfaces simultaneously suggests the vendor is trying to cover every workflow at once.
- **Tech stack**: TypeScript + an Electron desktop shell + a pnpm monorepo sharing one agent runtime across CLI/Web/desktop
- **Getting started**: Medium — the documentation is currently mostly in Simplified Chinese, and bootstrapping touches several workspace packages and environment variables

---

### mobile-next/mobile-mcp ⭐ 7,236

[GitHub](https://github.com/mobile-next/mobile-mcp)　·　TypeScript　·　Apache-2.0

- **What it is**: An MCP server that lets an agent directly drive real iOS/Android devices, simulators, and emulators, supporting native app automation and data scraping.
- **Why it matters**: Most computer-use agents today stop at the browser. mobile-mcp extends the same MCP tooling to phones — reading the accessibility tree first (no vision model, no image tokens burned), falling back to screenshot-plus-coordinates only when needed. It works with Claude Code, Codex, Gemini, GitHub Copilot, and other MCP clients, and can also reach into a cloud device pool for real-device testing.
- **Tech stack**: TypeScript + the MCP SDK + iOS Accessibility API / Android adb
- **Getting started**: Medium — local mode needs Xcode/Android SDK with a running simulator or emulator; the cloud device-pool mode skips the local setup but requires connecting to Mobile Next Cloud

## Notable Releases

### Pydantic AI v2.51.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.51.0)

- **What changed**: Added OpenAI GPT-Live support (`OpenAILiveModel`), giving realtime voice another provider option; realtime sessions now expose `context_window_used`, reading either GPT-Live's reported ratio or response usage; fixed several bugs around streamed tool calls losing `provider_details`, Gemini Live re-sending images, and dropped replies losing their response id.
- **Breaking Changes**: Dated `gemini-3.8-live` model ids are now matched strictly, and `google_affective_dialog` is rejected at connect time on Gemini 3.1/3.8 Live; a realtime `tool_choice` that forces a tool call on OpenAI, Azure OpenAI, or xAI now raises `UserError` instead of being silently accepted.
- **What it means for you**: If you were matching Gemini Live model-id strings loosely, or forcing a tool call via `tool_choice` on one of these three realtime providers, both will now fail outright until you adjust to the new rules.

---

### Claude Code v2.1.283

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.283)

- **What changed**: Added the `availableModelsMatch: "exact"` and `deniedModels` managed settings, letting organizations pin or block specific model versions precisely; added `/doctor prompt-audit`, which audits CLAUDE.md files, skills, and commands for prompting patterns written for older models; fixed MCP progress notifications being dropped once a long-running tool call moved to the background, and SDK sessions losing a finished tool result when a turn ended early.
- **Breaking Changes**: None — this release is mostly new settings, a new audit tool, and a large batch of bug fixes.
- **What it means for you**: If your organization pins model versions via managed settings, `availableModelsMatch`/`deniedModels` are worth adding to your next settings review; `prompt-audit` is a quick way to catch stale prompting patterns in your own repo.

## Today's Takeaway

I used to assume that once you have more agents, the next step is naturally a smarter multi-agent framework — better routing, cheaper coordination algorithms. Paperclip and Buzz trending on the same day is a reminder that another group is solving a more basic problem: once agents multiply to the size of a company's workforce, what's missing isn't a smarter coordination algorithm — it's the org chart, the budget, the audit trail that used to only apply to managing people, now applied to agents too.

## References

- [paperclipai/paperclip](https://github.com/paperclipai/paperclip)
- [block/buzz](https://github.com/block/buzz)
- [zai-org/ZCode](https://github.com/zai-org/ZCode)
- [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)
- [Pydantic AI v2.51.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.51.0)
- [Claude Code v2.1.283 — Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.283)
