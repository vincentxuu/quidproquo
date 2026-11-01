---
title: "AI Agent GitHub Digest — 2026-10-31"
date: 2026-10-31
category: daily
tags: [ai-agent, github, open-source, daily, agent-governance, rust, agent-platform]
lang: en
description: "The same day Claude Code hard-codes write-path boundaries into every permission mode, CopilotKit/OpenBot redefines what a 'trustworthy agent' looks like with sandboxed computers and approval gates, while HKUDS/nanobot and 0xPlaygrounds/rig show the opposite move: shrinking the core instead"
tldr: "**CopilotKit/OpenBot** (⭐ 8,639) gives each AI coworker its own sandboxed computer — every browser, file, or MCP action has to clear a CEL policy gate and get logged to an audit trail before it runs, and any AG-UI agent (LangGraph, Mastra, CrewAI, and more) can plug straight in. **HKUDS/nanobot** (⭐ 49,682) packs a personal agent into a core small enough to actually read end to end, with built-in long-term memory and a dozen chat-channel integrations. **0xPlaygrounds/rig** (⭐ 9,027) bundles a Rust LLM library and a full coding-agent harness that plugs into editors like Zed into the same crate. On the release side, **Claude Code v2.1.314** adds `permissions.blockWritesOutsideWorkingDirectories`, enforcing write-path boundaries across every permission mode, plus idle conversation compaction and a batch of fixes."
series:
  name: "AI Agent GitHub Digest"
  order: 77
---

> 🌏 [中文版](/posts/daily/2026-10-31-ai-agent-github-digest)

## Today's Highlight

Claude Code v2.1.314 adds `permissions.blockWritesOutsideWorkingDirectories`, turning "writes can't leave the working directory" into a hard boundary enforced across every permission mode. The same day, CopilotKit/OpenBot — trending on GitHub — takes the same approach from a different angle: every AI coworker gets its own sandboxed computer, and every action has to clear a policy gate and get logged to an audit trail before it actually runs. That lines up with the direction Agno, Mastra, and metaharness have all been moving the past couple of days: tighten the boundary, keep the audit trail, and treat that as table stakes rather than a differentiator for any one framework — top to bottom across the whole agent toolchain. The opposite move is happening at the same time: HKUDS/nanobot shrinks a personal agent's core down to something you can actually read end to end, and 0xPlaygrounds/rig goes as far as packing a Rust LLM library and a full coding-agent harness that plugs into editors like Zed into a single crate. "More governance" and "smaller core" are both advancing on the same day.

## Trending Repos

### CopilotKit/OpenBot ⭐ 8,639

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **What it is**: An agent platform that runs on your own infrastructure with a single Docker Compose command — every "Bot" is configuration, not code. A deployment ships with two coworkers by default (General Assistant and Knowledge), and a dozen ready-made fintech-scenario roles sit in the examples folder for you to copy in directly.
- **Why it matters**: Unlike the typical "bolt a tool call onto an agent" demo, OpenBot makes governance the architecture itself — every person and every Bot gets its own sandboxed computer (its own container, its own browser profile), and every browser, file, or MCP action has to pass a CEL policy engine and get written to an audit row before it's actually carried out. Deny rules evaluate before allow, and a missing policy permits nothing. It also isn't tied to its own framework: any agent built with LangGraph, Mastra, CrewAI, Pydantic AI, or Google ADK can plug in over the AG-UI protocol, so the governance travels with the protocol instead of being locked to one stack.
- **Tech stack**: Next.js/TypeScript + Docker Compose (PostgreSQL for storage) + the AG-UI protocol + CopilotKit Intelligence for memory and threads
- **Getting started**: Medium — you'll need Docker, Bun, a CopilotKit Intelligence project (a free tier exists), and a model key; `bash scripts/start.sh` brings the whole stack up

```diagram
title: CopilotKit/OpenBot's governance gateway
desc: A user's message goes through the Server to a Bot; any tool call the Bot wants to make has to clear the Gateway's CEL policy check first, the decision gets written to a PostgreSQL audit log, and only an allowed action reaches that Bot's own sandboxed computer.
caption: Simplified: only the "allowed and executed" path is drawn. When the policy denies an action, the Gateway reports the rule name back to the Bot instead and never sends the action to the sandboxed computer.
---
<svg viewBox="0 0 800 400">
  <path class="dg-line" d="M132 216 H168" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M296 216 H332" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M448 216 H484" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M636 216 H664" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M560 268 V320" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M232 252 V292 Q232 300 240 300 H322 Q330 300 330 308 V320" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="188" width="112" height="56" rx="6"/>
  <text class="dg-label" x="76" y="216" text-anchor="middle" dominant-baseline="central">User</text>

  <rect class="dg-box" x="168" y="180" width="128" height="72" rx="6"/>
  <text class="dg-label" x="232" y="206" text-anchor="middle" dominant-baseline="central">Server</text>
  <text class="dg-sub" x="232" y="228" text-anchor="middle" dominant-baseline="central">sends this turn</text>

  <rect class="dg-box" x="332" y="180" width="116" height="72" rx="6"/>
  <text class="dg-label" x="390" y="206" text-anchor="middle" dominant-baseline="central">Bot</text>
  <text class="dg-sub" x="390" y="228" text-anchor="middle" dominant-baseline="central">AG-UI endpoint</text>

  <rect class="dg-box dg-box--accent" x="484" y="164" width="152" height="104" rx="6"/>
  <text class="dg-label" x="560" y="204" text-anchor="middle" dominant-baseline="central">Gateway</text>
  <text class="dg-sub" x="560" y="226" text-anchor="middle" dominant-baseline="central">CEL policy engine</text>

  <rect class="dg-box" x="664" y="180" width="124" height="72" rx="6"/>
  <text class="dg-label" x="726" y="206" text-anchor="middle" dominant-baseline="central">Sandbox</text>
  <text class="dg-sub" x="726" y="228" text-anchor="middle" dominant-baseline="central">browser / files</text>

  <rect class="dg-box dg-box--store" x="480" y="320" width="160" height="56" rx="6"/>
  <text class="dg-label" x="560" y="340" text-anchor="middle" dominant-baseline="central">PostgreSQL</text>
  <text class="dg-sub" x="560" y="358" text-anchor="middle" dominant-baseline="central">audit log + decisions</text>

  <rect class="dg-box dg-box--store" x="212" y="320" width="236" height="56" rx="6"/>
  <text class="dg-label" x="330" y="340" text-anchor="middle" dominant-baseline="central">CopilotKit Intelligence</text>
  <text class="dg-sub" x="330" y="358" text-anchor="middle" dominant-baseline="central">threads / long-term memory</text>

  <text class="dg-edge" x="466" y="204" text-anchor="middle" dominant-baseline="central">tool call</text>
  <text class="dg-edge" x="650" y="204" text-anchor="middle" dominant-baseline="central">if allowed</text>
  <text class="dg-edge" x="570" y="294" dominant-baseline="central">audit write</text>
  <text class="dg-edge" x="281" y="288" text-anchor="middle" dominant-baseline="central">threads / memory</text>
</svg>
```

---

### HKUDS/nanobot ⭐ 49,682

[GitHub](https://github.com/HKUDS/nanobot)　·　Python　·　MIT

- **What it is**: An "ultra-lightweight, self-hosted" personal AI agent framework from HKU's Data Science Lab — usable from a browser, a terminal, or a chat app, with Telegram, Discord, Slack, WeChat, Mattermost, Linear, and more built in directly.
- **Why it matters**: The same team's DeepTutor (which this site [covered yesterday](/posts/daily/2026-10-30-ai-agent-github-digest-en)) goes deep on one vertical; nanobot takes the opposite tack and shrinks the core instead — long-term memory, scheduled long-running tasks, MCP integration, and multi-model fallback are all built in, but the codebase stays small enough to actually read start to finish, rather than chasing platform breadth. For anyone who just wants a personal assistant that plugs into the chat channels they already use and remembers things, without swallowing an entire enterprise framework, this is a more practical starting point.
- **Tech stack**: Python 3.11+ core + a built-in WebUI/TUI + MCP client + an OpenAI-compatible API
- **Getting started**: Easy — a one-line install script (`curl ... | sh`) opens a browser to walk you through model-key setup; there's even a dedicated guide for people with zero terminal experience

---

### 0xPlaygrounds/rig ⭐ 9,027

[GitHub](https://github.com/0xPlaygrounds/rig)　·　Rust　·　MIT

- **What it is**: A Rust crate that plays two roles at once — an LLM application library for developers (20+ model providers, 10+ vector stores behind one interface), and a complete harness you can run directly as a terminal coding agent.
- **Why it matters**: Most tools pick either "library" or "coding agent" and stop there; rig stacks both on top of each other. The bottom layer is provider-neutral completion/embedding/tool contracts; the top layer is an agent kernel built on Bevy's ECS where "everything is a plugin" — sign-in, the terminal view, even individual tools can be swapped out or removed. The latest release adds `rig acp`, letting it act as the backend agent for editors like Zed that support ACP (Agent Client Protocol) — one native Rust implementation now covers both "write an agent application" and "be someone else's agent backend."
- **Tech stack**: Rust + Bevy ECS (the agent kernel) + the Tokio async runtime + optional WASM compile targets
- **Getting started**: Medium — `cargo install rig` gets you a terminal agent fast, but customizing providers, vector stores, or plugins means getting comfortable with Rust and Bevy's ECS concepts

## Notable Releases

### Claude Code v2.1.314

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.314)

- **Key changes**: Adds `permissions.blockWritesOutsideWorkingDirectories`, so Write, Edit, and NotebookEdit refuse to write outside the working directory under any permission mode; VS Code and Claude Desktop's Code tab gain idle compaction — a 200K+ token conversation left idle gets summarized first, and the summary is used on your next message if the prompt cache has already expired; the Claude apps gateway's Bedrock upstream adds `guardrail_trace`, which logs which Amazon Bedrock guardrail rule blocked a request (without logging the blocked content itself).
- **Breaking changes**: None flagged explicitly — mostly fixes to existing behavior plus new opt-in features.
- **What it means for you**: If your team needs a hard guarantee that an agent can never write outside the project directory, `blockWritesOutsideWorkingDirectories` is worth turning on first. If you regularly run long conversations that fill up context, idle compaction saves you the manual `/compact` step. Everything else here fixes existing bugs — Bedrock conversations with many images failing, Microsoft Foundry not finding a matching model, MCP logout not actually logging out — and shouldn't require any code changes to adopt.

## Today's Takeaway

I used to think "governance by default" was something only new agent-platform startups did, as a way to differentiate from everyone else's "ship first, harden later." But seeing Claude Code itself turn write-path boundaries into a rule enforced across every permission mode made it click: this has moved from "a framework's differentiating feature" to "something even the lowest-level single CLI has to add." Governance isn't the property of any one layer anymore — the entire agent toolchain, from multi-agent platforms at the top down to a single coding CLI at the bottom, is converging on the same direction at the same time.

## References

- [CopilotKit/OpenBot — GitHub repo](https://github.com/CopilotKit/OpenBot)
- [HKUDS/nanobot — GitHub repo](https://github.com/HKUDS/nanobot)
- [0xPlaygrounds/rig — GitHub repo](https://github.com/0xPlaygrounds/rig)
- [Claude Code v2.1.314 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.314)
- [HKUDS/DeepTutor coverage (2026-10-30 digest)](/posts/daily/2026-10-30-ai-agent-github-digest-en)
