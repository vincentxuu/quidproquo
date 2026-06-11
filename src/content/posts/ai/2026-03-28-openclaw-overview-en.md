---
title: "OpenClaw Documentation Guide: 200+ Docs — Where Do You Start?"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ai-gateway, self-hosted, documentation, guide]
lang: en
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

This series contains 36 articles organized into 12 sections. Below is a summary of each section's focus and intended audience.

### Getting Started (#1-3)

| # | Title | What You'll Learn |
|---|---|---|
| 1 | This article | Big picture, doc structure, where to start |
| 2 | Installation Guide (Part 1): Local Deployment | npm / Docker / Nix / Bun / Podman / Raspberry Pi |
| 3 | Installation Guide (Part 2): Cloud Platforms & K8s | Azure / GCP / DigitalOcean / Hetzner / Fly.io / Railway / K8s / Ansible |

**Best for:** Everyone. Install it first, ask questions later.

### Platforms (#4-5)

| # | Title | What You'll Learn |
|---|---|---|
| 4 | Desktop Platforms: macOS, Linux, Windows | OS-specific differences, WSL2 setup, macOS menu bar app |
| 5 | Mobile Platforms: iOS & Android | Mobile app installation and pairing flow |

**Best for:** Multi-device users.

### Models (#6-8)

| # | Title | What You'll Learn |
|---|---|---|
| 6 | Model Requirements & Provider Ecosystem | Overview of 35+ providers, Tool Use requirements, setup for the big three |
| 7 | More Providers: DeepSeek, Groq, Ollama, OpenRouter... | Authentication and configuration for 30+ additional providers |
| 8 | Advanced Models: Failover, Prompt Caching & Token Billing | Auth rotation, cooldown mechanisms, billing tracking |

**Best for:** Anyone choosing models, cutting costs, or ensuring high availability.

### Agent Core (#9-12)

| # | Title | What You'll Learn |
|---|---|---|
| 9 | Multi-Agent & Delegate Architecture | Multi-agent routing, binding, delegate agents |
| 10 | Agent Runtime: Workspace, System Prompt & Bootstrap | What an agent's "home" looks like and how to customize its personality |
| 11 | Agent Loop: Execution Cycle, Streaming & Queue | The complete flow of a single agent execution |
| 12 | Session, Memory & Compaction | How conversations are stored, compressed, and remembered |

**Best for:** Anyone who wants to deeply understand how the agent works. This is the heart of OpenClaw.

### Channels (#13-16)

| # | Title | What You'll Learn |
|---|---|---|
| 13 | Channel Overview: Pairing, Groups & Routing | DM/Node Pairing, group strategies, routing rules |
| 14 | Primary Channels: WhatsApp, Telegram, Discord | Complete setup for the three main channels |
| 15 | Enterprise Channels: Slack, Teams, Google Chat, Matrix | Enterprise messaging platform integration |
| 16 | Other Channels: Signal, iMessage, LINE, IRC, Nostr... | Niche but interesting channels |

**Best for:** Anyone who wants to connect AI to a specific chat platform.

### Security (#17-19)

| # | Title | What You'll Learn |
|---|---|---|
| 17 | Sandbox Mechanisms: Docker, SSH & OpenShell | Three sandbox backends, Tool Policy, Elevated escape hatch |
| 18 | Threat Model: MITRE ATLAS Security Analysis | Prompt Injection, token theft, supply chain risks |
| 19 | Access Control: Auth, Secrets & OAuth | Authentication mechanisms, secret management, Trusted Proxy |

**Best for:** Anyone who cares about security. OpenClaw lets AI execute system commands — security is not optional.

### Tools (#20-23)

| # | Title | What You'll Learn |
|---|---|---|
| 20 | Browser Control & Search Engine Integration | Browser Tool, 8 search engines, Firecrawl |
| 21 | Sub-Agents, Skills & ClawHub | Child agents, the skill system, community marketplace |
| 22 | Execution Tools: Exec, Thinking, Diffs | Command execution, deep reasoning, code patching |
| 23 | More Tools: TTS, PDF, Lobster, Reactions | Text-to-speech, PDF, Pipeline, emoji reactions |

**Best for:** Anyone who wants to know what an AI agent can do.

### Automation (#24-25)

| # | Title | What You'll Learn |
|---|---|---|
| 24 | Cron, Webhooks & Event-Driven Automation | Scheduling, HTTP hooks, Gmail PubSub, polling |
| 25 | Standing Orders: Letting the Agent Act Autonomously | Authorization framework, Scope/Trigger/Escalation |

**Best for:** Anyone who wants AI to run tasks on a schedule or respond to external events.

### Gateway (#26-29)

| # | Title | What You'll Learn |
|---|---|---|
| 26 | Gateway Configuration & Hot Reload | Config file structure, live reloading, Config RPC |
| 27 | Gateway Networking: Protocols & Remote Access | Networking model, Tailscale, Bridge Protocol |
| 28 | Multi-Gateway & Background Processes | Multi-instance deployment, profile isolation, Rescue Bot |
| 29 | Gateway API: OpenAI-Compatible & Tool Calling | HTTP API, OpenResponses, RPC |

**Best for:** Ops engineers, and anyone who wants remote access or to expose an API to other systems.

### Plugins (#30-31)

| # | Title | What You'll Learn |
|---|---|---|
| 30 | Plugin Architecture & SDK Overview | Plugin system design, SDK entry points, runtime |
| 31 | Build Your Own Plugin | Channel/Provider Plugin development, testing, publishing |

**Best for:** Developers who want to extend OpenClaw's functionality.

### Interfaces (#32-33)

| # | Title | What You'll Learn |
|---|---|---|
| 32 | Mobile Nodes: Pairing, Canvas, Camera, Voice Wake | Using your phone as an AI sensory extension |
| 33 | Web UI: Control UI, Dashboard, WebChat, TUI | Features and configuration of all user interfaces |

**Best for:** Everyday users, and anyone who wants to operate from a browser or phone.

### Operations & Reference (#34-36)

| # | Title | What You'll Learn |
|---|---|---|
| 34 | Operations & Troubleshooting | Doctor, Health Check, Logging, common issues |
| 35 | Pi Integration Architecture & Reference Quick Lookup | Agent Runtime engine, various reference materials |
| Appendix | CLI Command Quick Reference | Usage for all 48 CLI commands |

**Best for:** Anyone running into issues, or anyone who wants to look up a specific command.

## Which Reader Are You?

**"I just want to get it running quickly"** → #1 → #2 → #14 (pick a channel) → #6 (choose a model). Four articles and you're done.

**"I want to be a daily user"** → The four above + #33 (Web UI) + #12 (Session) + #24 (automation scheduling).

**"I want to deeply understand the architecture"** → #9-12 (Agent Core) → #11 (Agent Loop) → #35 (Pi Integration) → #17-19 (Security).

**"I want to deploy to production"** → #3 (Cloud Platforms) → #26-29 (Gateway Operations) → #17-19 (Security) → #34 (Troubleshooting).

**"I want to develop plugins"** → #30-31 + #21 (Skills) + #22 (Exec) + #29 (API).

**"I want to integrate enterprise messaging"** → #13 (Channel Overview) → #15 (Slack/Teams) → #19 (Access Control) → #9 (Multi-Agent).

## The Big Picture

OpenClaw's documentation volume reflects its ambition: it is not just a "chatbot framework" but a complete AI agent operations system. It covers everything from model provider management and sandbox security to MITRE ATLAS threat analysis. 335 files may look daunting, but the organizational structure is clear — once you know what you need, you can quickly find the right section.

This series will break down every section in detail. Next up: installation.

## References

This article is compiled from the following original OpenClaw documents:

- [docs/index.md](https://github.com/openclaw/openclaw/blob/main/docs/index.md) — Homepage and project overview
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/main/docs/docs.json) — Documentation site navigation structure (Mintlify config)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md) — Quick start guide
- [docs/concepts/features.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/features.md) — Complete feature list
- [docs/concepts/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md) — Core architecture
- [README.md](https://github.com/openclaw/openclaw/blob/main/README.md) — Project README
