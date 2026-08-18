---
title: "OpenClaw Documentation Guide: 200+ Docs — Where Do You Start?"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ai-gateway, self-hosted, documentation, guide]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 1
tldr: "OpenClaw has 200+ docs. This article helps you see the big picture, understand what each section covers, and decide where to start based on your role."
description: "A complete reading guide to the OpenClaw open-source AI gateway documentation, covering a series map across 16 directories and 335 files."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-overview)

OpenClaw is an open-source, self-hosted AI gateway — a single Gateway program that connects WhatsApp, Telegram, Discord, iMessage, and 24+ other chat platforms to an AI agent. Its documentation spans **16 directories and 335 files**, covering everything from installation to threat modeling. This article is the starting point for the entire series: get the big picture first, then decide where to dive in.

## What OpenClaw Does

```
Chat App (WhatsApp / Telegram / Discord / iMessage / Slack / ...)
       ↓
   Gateway (runs locally, port 18789)
       ↓
  ┌────┼────┬────────┬──────────┬──────────┐
  AI   CLI   Web UI   macOS App   Mobile Node
Agent              (Control UI)   (iOS/Android)
```

You send a message from your phone; the Gateway routes it to an AI agent; the agent uses tools to take action (read files, run commands, open a browser, search the web), then sends the result back to your chat app. The Gateway is the sole control plane, and everything runs on your own machine.

This is not just a chatbot framework. It is a full-fledged AI agent operations system covering: multi-model provider switching, sandbox isolation, scheduled automation, a plugin ecosystem, Mobile Node integration, and enterprise-grade access control.

## Documentation Overview

| Directory | File Count | What It Covers |
|---|---|---|
| `cli/` | 48 | Usage and parameters for every CLI command |
| `tools/` | 40 | Browser control, 8 search engines, Sub-Agent, Skills, Exec, TTS, PDF... |
| `providers/` | 38 | Authentication and configuration for 35+ model providers (Anthropic, OpenAI, Google, DeepSeek, Ollama...) |
| `gateway/` | 34 | Gateway configuration, networking model, protocols, API, sandbox, secrets, remote access |
| `concepts/` | 29 | Core architectural concepts: Agent Loop, Session, Memory, Streaming, Context Engine... |
| `channels/` | 29 | Configuration for 24+ channels: WhatsApp QR pairing, Telegram Bot, Discord, Slack, Signal... |
| `install/` | 27 | npm, Docker, K8s, Nix, Bun, 9 cloud platforms, Raspberry Pi, Ansible |
| `plugins/` | 17 | Plugin SDK, architecture, Channel/Provider Plugin development, testing, publishing |
| `reference/` | 16 | AGENTS.md templates, token billing, Prompt Caching, RPC, release process |
| `platforms/` | 10 | Platform-specific notes for macOS, Linux, Windows/WSL2, iOS, Android |
| `automation/` | 9 | Cron scheduling, Webhooks, Standing Orders, Gmail PubSub, Hooks |
| `nodes/` | 9 | iOS/Android Node pairing, Camera, Audio, Voice Wake, Location |
| `help/` | 7 | FAQ, troubleshooting, debugging, environment issues |
| `web/` | 5 | Control UI, Dashboard, WebChat, TUI |
| `security/` | 3 | MITRE ATLAS threat model, formal verification |
| Root | ~12 | Pi integration architecture, auth semantics, CI, VPS, network topology |

## Series Article Map

This series contains 32 articles organized into 12 sections. Below is a summary of each section's focus and intended audience.

### Getting Started (#1-3)

| # | Title | What You'll Learn |
|---|---|---|
| 1 | This article | The big picture, doc structure, where to start |
| 2 | Installation (Part 1): Choosing Among Six Local Methods | The trade-offs, plus the npm/pnpm lifecycle-script, PATH, and OOM traps that actually stop an install |
| 3 | Installation (Part 2): Four Decisions for Cloud Deployment | Binding and auth, admin isolation, trust boundary, recoverability, and K8s probe/ConfigMap behavior |

**Best for:** Everyone. Get it installed first.

### Platforms (#4-5)

| # | Title | What You'll Learn |
|---|---|---|
| 4 | Desktop: Windows Now Has a Native Hub | Node as a hard requirement, the three Windows paths, service targets per OS |
| 5 | Mobile: Phones Are Peripherals, Not Gateways | Three-tier approval scopes, watchOS's dedicated transport, the upgrade order |

**Best for:** Multi-device users.

### Models (#6-8)

| # | Title | What You'll Learn |
|---|---|---|
| 6 | Model Requirements and the Provider Ecosystem | Provider/model/agent runtime/channel are four layers; `openai/*` does not mean Codex |
| 7 | A Category Map of 60 Providers | The real bar for local models: tool support, 16K context, and never `/v1` |
| 8 | Models, Advanced: Failover, Cooldowns, Caching | Who chose the model decides its strictness; cooldowns are 30s → 1m → 5m |

**Best for:** Anyone choosing models, cutting cost, or needing high availability.

### Agent Core (#9-12)

| # | Title | What You'll Learn |
|---|---|---|
| 9 | Multi-Agent: Persona Boundaries and Agents Spawning Agents | Where isolation really ends, plus provenance and the human gate |
| 10 | Agent Runtime: How the System Prompt Is Assembled | Three-layer assembly, the cache boundary, the Promised Work contract |
| 11 | Agent Loop: Serialization and Writer Claims | Why a superseded turn cannot write; the two hook systems |
| 12 | Sessions and Memory | Main-session convergence, incognito boundaries, four memory files, dreaming |

**Best for:** Anyone who wants to understand how the agent actually works.

### Channels (#13-16)

| # | Title | What You'll Learn |
|---|---|---|
| 13 | Channels Overview: 31 Channels, Nearly All Plugins | "Who can trigger" and "what the model sees" are separate axes |
| 14 | Main Channels: WhatsApp, Telegram, Discord | Each channel's silent-failure mode |
| 15 | Enterprise Channels: Slack's Three Transports | Pick by deployment shape; the shared-Slack-app trap |
| 16 | Other Channels and Reef | An encrypted side channel between different people's agents |

**Best for:** Anyone connecting AI to a specific chat platform.

### Security (#17-19)

| # | Title | What You'll Learn |
|---|---|---|
| 17 | Sandboxing: Four Backends, Three Switches | `tools.exec.host` defaults to auto, so "unset means sandboxed" is false |
| 18 | Threat Model: What It Does Not Protect | The personal-assistant trust boundary and the not-a-vulnerability list |
| 19 | Access Control: SecretRef Sentinels and Limits | It removes plaintext from config, but it is not process isolation |

**Best for:** Anyone who cares about security. OpenClaw runs system commands; security is not optional.

### Tools (#20-23)

| # | Title | What You'll Learn |
|---|---|---|
| 20 | Browser and Search | Three browser profiles; search results typed as untrusted |
| 21 | Skills and Sub-Agents | Six-layer precedence; why sub-agents get no message tool |
| 22 | Exec | Turning off the file tools does not make exec read-only |
| 23 | Large Catalogs: Code Mode, Tool Search, MCP | Two answers for when tools outgrow the prompt |

**Best for:** Anyone wondering what the agent can do without burning all their tokens.

### Automation (#24-25)

| # | Title | What You'll Learn |
|---|---|---|
| 24 | Choosing Among Six Automation Mechanisms | Automations (exact) versus Heartbeat (contextual); failure semantics |
| 25 | Standing Orders | Authorization versus clock; bootstrap injects only six files |

**Best for:** Anyone scheduling work or delegating routine tasks.

### Gateway (#26-27)

| # | Title | What You'll Learn |
|---|---|---|
| 26 | Configuration and Strict Validation | An unknown key stops the Gateway booting; the three anti-clobber shapes |
| 27 | Binding, Auth, and Credential Precedence | Non-loopback forces auth; the ordering that decides which credential wins |

**Best for:** Ops engineers and anyone wanting remote access.

### Plugins (#28)

| # | Title | What You'll Learn |
|---|---|---|
| 28 | The Plugin System: Install Security and Verification | Treat installs like running code; only `inspect --runtime` proves loading |

**Best for:** Anyone extending OpenClaw.

### Interfaces (#29-30)

| # | Title | What You'll Learn |
|---|---|---|
| 29 | Nodes in Depth: Remote Execution Approval | Approval binds the plan, not later-editable fields |
| 30 | UI: Control UI, TUI, Web Chat | The session rail observes a running agent without interrupting it |

**Best for:** Everyday users operating from a browser or phone.

### Operations and Reference (#31-32)

| # | Title | What You'll Learn |
|---|---|---|
| 31 | Operations: Triage and Troubleshooting | The seven-command ladder; check the tool profile before blaming the model |
| 32 | Reference: Agent Runtime Architecture | Pi was absorbed; the built-in runtime is `openclaw` |

**Best for:** Anyone hitting problems or wanting the internal architecture.

## Which Reader Are You?

**"I just want it running"** → #1 → #2 → #14 (pick a channel) → #6 (choose a model). Four articles.

**"I want to be a daily user"** → Those four + #30 (UI) + #12 (sessions and memory) + #24 (automation).

**"I want to understand the architecture"** → #9-12 (agent core) → #32 (runtime architecture) → #17-19 (security).

**"I want to deploy to production"** → #3 (cloud) → #26-27 (Gateway) → #17-19 (security) → #31 (troubleshooting).

**"I want to develop plugins"** → #28 (plugin system) + #21 (skills) + #23 (MCP and Code Mode).

**"I care about security"** → #18 (threat model) → #17 (sandboxing) → #19 (SecretRef) → #13 (the two channel axes).

**"I want enterprise messaging"** → #13 (channels overview) → #15 (Slack/Teams) → #19 (access control) → #9 (multi-agent).

## The Big Picture

OpenClaw's documentation volume reflects its ambition: it is not just a "chatbot framework" but a complete AI agent operations system. It covers everything from model provider management and sandbox security to MITRE ATLAS threat analysis. 335 files may look daunting, but the organizational structure is clear — once you know what you need, you can quickly find the right section.

This series will break down every section in detail. Next up: installation.

## Changelog

- 2026-08-18 (second pass): After all 32 articles were revised against the current official docs, the series map was rebuilt — every title and focus line changed (for example #32 moved from "Pi integration architecture" to "Agent runtime architecture", since Pi has been absorbed into core), and the "Which Reader Are You?" routes were reordered with a new "I care about security" path.
- 2026-08-18: Corrected the series map. The series was planned as 36 articles but landed at 32 — multi-gateway and background processes, the Gateway API, a standalone plugin-building guide, and the CLI quick-reference appendix were never published separately, with multi-gateway and plugin development folded into existing articles instead. Numbering from #26 onward, the section headings, and the "Which Reader Are You?" routes have all been realigned to the articles that actually exist.

## References

This article is compiled from the following original OpenClaw documents:

- [docs/index.md](https://github.com/openclaw/openclaw/blob/main/docs/index.md) — Homepage and project overview
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/main/docs/docs.json) — Documentation site navigation structure (Mintlify config)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md) — Quick start guide
- [docs/concepts/features.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/features.md) — Complete feature list
- [docs/concepts/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md) — Core architecture
- [README.md](https://github.com/openclaw/openclaw/blob/main/README.md) — Project README
