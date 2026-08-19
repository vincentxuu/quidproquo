---
title: "OpenCode Full Analysis: An Open-Source Terminal Agent Supporting 75+ Model Providers"
date: 2026-04-02
type: project
category: ai
tags: [agent-cli, opencode, open-source, terminal-agent, multi-provider, ollama]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 10
tldr: "OpenCode is a free, open-source TypeScript CLI agent (MIT, ~198K GitHub stars). It supports 75+ model providers including local Ollama, allows authentication via Copilot/ChatGPT accounts, and lets you switch models mid-session without losing context. There is also a desktop app and an official Zen gateway."
description: "OpenCode's open-source architecture, multi-provider support, the Zen gateway, authentication options, core features, comparison with Claude Code, and who it fits."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-opencode)

In the 2025-2026 boom of Agent CLIs, most tools are locked to a single model provider -- Claude Code to Anthropic, Codex CLI to OpenAI, Gemini CLI to Google. OpenCode took a different path: **fully open-source, zero vendor lock-in, supporting 75+ model providers**.

This post provides an in-depth analysis of OpenCode's architecture, pricing, core features, and its unique position within the Agent CLI ecosystem.

## Product Positioning

[OpenCode](https://github.com/anomalyco/opencode) is an open-source coding agent written in **TypeScript** and licensed under **MIT**, maintained under the [anomalyco](https://github.com/anomalyco) org. It has around **198K GitHub stars**, the highest in the agent CLI space; the project's own numbers are 950 contributors, 13,000+ commits, and 16 million developers a month.

> **⚠️ A common case of mistaken identity**: an earlier project called `opencode-ai/opencode` was written in Go with [Bubble Tea](https://github.com/charmbracelet/bubbletea), and it is not the same codebase as this OpenCode. Much of the "OpenCode is written in Go and licensed Apache-2.0" claim circulating online — including in the previous version of this post — traces back to that confusion. Go by the current repo: TypeScript, MIT.

The terminal interface is far from a bare-bones text-only experience — OpenCode offers a full TUI with panel switching, syntax highlighting, and interactive operations. It runs in the terminal but feels close to a GUI. Beyond the TUI there is now also a **desktop app** (beta, on macOS / Windows / Linux) and an IDE extension.

There are many ways to install it: `curl -fsSL https://opencode.ai/install | bash`, npm, Homebrew, scoop, pacman, and nix all work.

## Pricing Model

OpenCode itself is completely free; what you pay for is the underlying LLM usage. There are three ways to access models:

| Plan | Cost | Description |
|------|------|-------------|
| **OpenCode (the tool)** | Free (open-source) | MIT license, no usage restrictions |
| **OpenCode Zen** | Pay-as-you-go, prepaid credits | The official curated AI gateway: only models the team has tested and tuned with providers |
| **BYOM (Bring Your Own Model)** | Free, billed at provider rates | Use your own API keys, connect directly to any supported provider |
| **Copilot / ChatGPT Auth** | Free (uses existing subscription) | Log in with your GitHub Copilot or ChatGPT Plus account |

The last option is worth noting: if you already subscribe to GitHub Copilot or ChatGPT Plus, you can authenticate OpenCode directly with that account at no additional cost. This makes the switching cost virtually zero.

## Supported Providers

OpenCode supports **75+ LLM providers**, covering major cloud and local options:

- **OpenAI** (GPT-4o, o3, etc.)
- **Anthropic Claude** (Sonnet, Opus)
- **Google Gemini** (Gemini 3 series)
- **AWS Bedrock** (access multiple providers through your AWS account)
- **Azure OpenAI** (enterprise-grade deployment)
- **Groq** (ultra-low latency inference)
- **OpenRouter** (aggregated routing)
- **Ollama** (local models, fully offline)

The key capability: **switch models mid-session without losing context**. You can start a complex refactoring task with Claude Sonnet, switch to o3 when you need stronger reasoning, then switch back to Gemini for documentation generation -- the entire conversation history and working state is fully preserved.

This is hard to achieve with other Agent CLIs. Claude Code is locked to Anthropic models, Codex CLI is locked to OpenAI -- if you want to switch models, you have to start a new session.

## Core Features

### Interactive TUI

A full-featured terminal interface supporting panel splitting, live preview, and syntax highlighting. It includes a built-in **Vim-like editor**, so developers familiar with Vim keybindings can get started immediately.

### Two built-in agents plus a subagent

`Tab` switches between two built-in agents: **build** (the default, full access for development work) and **plan** (read-only, denies file edits by default and asks before running bash — ideal for exploring an unfamiliar codebase). There is also a **general** subagent for complex searches and multi-step tasks, invoked with `@general` in a message.

### Multi-Session Support

You can run multiple agent sessions in parallel on the same project. For example, one session handles frontend refactoring while another simultaneously works on backend API modifications. Sessions are isolated from each other, each maintaining its own context.

### Session Sharing

Share sessions via links so team members can see the complete conversation history and operation records. Ideal for code review or knowledge transfer.

### Persistent Storage

All session data is stored in a local **SQLite** database with no cloud dependency. Close the terminal and reopen it -- your previous sessions are still there.

### LSP Integration

OpenCode **automatically detects and configures language servers** (Language Server Protocol), giving the LLM access to type information, definition navigation, error diagnostics, and other structured data when modifying code. This is more precise than simply feeding raw source code to the model.

### Tool Integration

Like other Agent CLIs, OpenCode can execute shell commands, read and write files, and modify code. However, its tool system is designed to be more extensible -- it supports custom tool definitions.

### Privacy First

**No code or context data is stored in the cloud**. All data stays in local SQLite. Even when using OpenCode Zen routing, only API requests are forwarded -- no content is retained.

## Comparison with Claude Code

OpenCode and Claude Code are the two most closely positioned Agent CLIs, but their design philosophies are fundamentally different:

| Aspect | OpenCode | Claude Code |
|--------|----------|-------------|
| **Cost** | Free (open-source) | $20+/month (API costs) |
| **Supported Models** | 75+ providers | Anthropic models only |
| **Context Management** | Good, supports mid-session switching | More mature, sub-agent architecture |
| **Vendor Lock-in** | Zero lock-in | Locked to Anthropic |
| **License** | MIT open-source | Proprietary software |
| **Interfaces** | TUI + desktop app + IDE extension | Terminal + IDE + web |
| **Local Models** | Supported (Ollama) | Not supported |

The conclusion is clear: **if you're after the strongest agentic capability, Claude Code still leads**. Its sub-agent architecture, CLAUDE.md system, Skills, and Hooks ecosystem are all more mature. But if you prioritize **provider flexibility, cost control, or local model support**, OpenCode is currently the best choice.

## The Perfect Companion for Model Routing

OpenCode's 75+ provider support, combined with third-party model routers (such as [freerouter](https://github.com/openfreerouter/freerouter) or ruflo), can achieve maximum flexibility:

- **Cost optimization**: Route simple tasks to cheaper models, complex tasks to powerful models
- **Latency optimization**: Dynamically select providers based on response speed
- **Failover switching**: Automatically switch to backup providers when the primary one goes down
- **Mid-session switching**: OpenCode natively supports switching models mid-session, which is the key enabler for routing strategies

This combination -- OpenCode as the frontend agent + a model router as the backend dispatcher -- provides the most flexible architecture in the current Agent CLI ecosystem.

For more discussion on multi-model routing strategies, see **[Multi-Model Routing Strategies for Subscription-Based Agent CLIs](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing-en)**.

## Ideal Use Cases

OpenCode is best suited for the following types of developers and teams:

- **Those seeking provider independence**: Don't want to be locked into any single LLM provider, want the freedom to switch at any time
- **Privacy-sensitive teams**: All data stays local, nothing uploaded to the cloud
- **Local model users**: Run local models via Ollama, operate completely offline
- **Developers with existing Copilot / ChatGPT subscriptions**: Zero additional cost, use your existing account directly
- **Teams needing maximum model flexibility**: Use different models for different tasks, switch mid-session without losing context
- **Budget-conscious individual developers**: The tool itself is free, you only pay for model usage

If your need is "use the strongest model for the most complex tasks," Claude Code may be a better fit. But if your need is "use the most suitable model for each task," OpenCode's multi-provider architecture offers flexibility that other tools can't match.

## References

- [OpenCode | GitHub (anomalyco/opencode)](https://github.com/anomalyco/opencode)
- [OpenCode official site](https://opencode.ai/)
- [OpenCode Docs](https://opencode.ai/docs/)
- [OpenCode Zen documentation](https://opencode.ai/docs/zen/)
- [Models.dev (source of the provider and model list)](https://models.dev)

## Changelog

- 2026-08-18: Refreshed against the official repo and docs, correcting three substantive errors: (1) **the language is TypeScript, not Go**; (2) **the license is MIT, not Apache-2.0**; (3) the repo has long since moved off `opencode-ai/opencode` and is maintained by `anomalyco` (formerly `sst/opencode`). All three traced back to confusion with an earlier, identically named Go project, now flagged in the post. Also: stars 95K → ~198K; added the desktop app, the built-in build/plan agents and general subagent, Models.dev as the provider list source, and Zen's curation angle; removed a dead freerouter link and an outdated SWE-bench comparison
