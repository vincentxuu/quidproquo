---
title: "Cursor CLI Complete Analysis: The All-Rounder Extending IDE Agent to the Terminal"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, cursor, pricing, cli-agent, cloud-handoff, plan-mode, tui]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 11
tldr: "Cursor CLI brings the IDE agent to the terminal with an interactive TUI and headless mode, Plan/Ask/Agent modes, Cloud Handoff, and CI/CD integration. Billing now runs on two separate usage pools: Cursor's own models (Grok 4.6/4.5, Composer 2.5) and third-party models (Pro includes $20, Pro+ $70, Ultra $400)."
description: "In-depth analysis of Cursor CLI's 2026 features, three modes (Plan/Ask/Agent), Cloud Handoff, MCP integration, CI/CD automation, and pricing plans."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-cursor)

Cursor was originally known for its built-in IDE Agent. In late 2025, it officially brought the same Agent capabilities to the terminal. The core philosophy of Cursor CLI is: **anything you can do in the IDE, you can do in the terminal**. Whether it's interactive development, CI/CD automation, or handing off tasks to the cloud to run on their own, Cursor CLI has a solution for each.

This article breaks down Cursor CLI's features, three operating modes, Cloud Handoff, CI/CD integration, and pricing plans.

## Product Positioning

Cursor CLI brings the IDE Agent to the terminal, offering two execution modes:

- **Interactive TUI** — Launches a full text-based interface in the terminal. You interact with the Agent like you would in the IDE — reviewing changes and confirming step by step. Ideal for daily development.
- **Non-interactive Print Mode** — No UI; outputs results directly to stdout. Designed for scripts and CI/CD pipelines, activated with the `--print` flag.

Supports Windows, macOS, and Linux. The goal is clear: **free the Agent from the IDE**. SSH sessions, remote servers, Docker containers, CI runners — anywhere there's a terminal, it can run.

## Core Features

### File and Shell Access

Cursor CLI can read and write files, search the entire codebase, and execute shell commands. All operations with side effects (file writes, command execution) require user confirmation by default, unless you explicitly authorize automatic execution.

### Rules and MCP Support

The CLI reads rule files from the `.cursor/rules` directory and also supports `AGENTS.md` and `CLAUDE.md` in the repo root. This means the coding standards and agent behavior preferences you've configured in the IDE also take effect in the CLI.

MCP (Model Context Protocol) server integration is fully supported, allowing the agent to call external tools and data sources.

### Multi-Model Selection

Cursor isn't locked to a single model provider. Subscription plans include access to multiple frontier models from Anthropic, OpenAI, Google Gemini, and Cursor's own models. In Auto mode, the system selects the model automatically, but you can also specify manually.

### Multi-Agent Parallel Execution

You can launch different agents simultaneously in multiple terminal windows, or run multiple tasks in parallel via Cloud Agent on the remote end. This is particularly useful when large projects need to handle multiple subtasks concurrently.

## Three Modes

Cursor CLI offers three operating modes corresponding to different use cases:

| Mode | Activation | Description | IDE Equivalent |
|------|------------|-------------|----------------|
| **Plan Mode** | `/plan` or `--mode=plan` | Plan before acting. The agent proposes a plan, asks clarifying questions, and only starts implementation after confirmation | IDE Plan mode |
| **Ask Mode** | `/ask` or `--mode=ask` | Read-only mode. Explores the codebase and answers questions but **makes no modifications** | IDE Ask mode |
| **Agent Mode** | Default mode | Full agentic capabilities: edit files, execute commands, search code, make autonomous decisions | IDE Agent mode |

**Plan Mode** is particularly suited for large refactors or when the direction is uncertain. The agent first analyzes existing code and proposes a concrete modification plan — it won't touch any files until you confirm.

**Ask Mode** is like a consultant who knows your codebase well. It reads relevant files to answer questions but never writes anything. Ideal for code review, understanding unfamiliar modules, or doing research before making changes.

**Agent Mode** is the default and the most fully-featured mode. It autonomously decides which files to read, what commands to run, and how to modify code.

## Cloud Handoff

This is one of Cursor CLI's most distinctive features. By prefixing a command with **`&`** during a conversation, you can push the current conversation context to a Cloud Agent:

```
& finish the remaining migration and tests for me
```

The Cloud Agent takes over the local conversation context and continues execution in the cloud. You can:

- Close the terminal and go do something else
- Track progress on the **cursor.com/agents** web interface
- Check results on your phone

This design bridges the **CLI ↔ Cloud** boundary. In the middle of local development and need to leave? Hand off the task to the cloud and it keeps running. Pick up where you left off from any device when you return.

## CI/CD Integration

Cursor CLI natively supports GitHub Actions integration. A typical setup flow:

1. Install Cursor CLI in the CI environment
2. Set the `CURSOR_API_KEY` environment variable
3. Call the agent in a workflow step

Three output formats are supported:

| Format | Parameter | Description | Use Case |
|--------|-----------|-------------|----------|
| **json** | `--format=json` | Single JSON object containing the final result | Programmatic parsing |
| **stream-json** | `--format=stream-json` | NDJSON streaming events | Real-time monitoring |
| **text** | `--format=text` | Human-readable plain text | Log viewing |

You can choose to let the agent run fully autonomously or restrict it to specific operations (e.g., read-only). For critical production environment operations, using restricted mode is recommended.

## Pricing

| Plan | Monthly | Included third-party model usage | Notes |
|------|---------|----------------------------------|-------|
| **Hobby** | Free | None | Limited agent requests, access to Composer |
| **Pro** | $20/mo | $20 | Entry point for individuals |
| **Pro+** | $60/mo | $70 | Daily agent users |
| **Ultra** | $200/mo | $400 | Agent power users |
| **Teams Standard** | $40/user/mo | Team allowance | Team collaboration |
| **Teams Premium** | $120/user/mo | 5x Standard | Heavy teams |
| **Enterprise** | Contact sales | Pooled usage | SCIM, audit logs, invoicing |
| **Start** (India only) | ₹649/mo, tax inclusive | None | Covers the Cursor Models pool only |

### Two usage pools

The key to the billing model is that there are **two independent pools**, each resetting with your monthly billing cycle:

| Pool | Contents | Pricing |
|------|----------|---------|
| **Cursor Models** | Cursor's own models: Grok 4.6, Grok 4.5, Composer 2.5 | Generous included usage on every plan |
| **Other Models** | Third-party frontier models | Charged at the model's API price; plans include the allowance above, with the option to buy more |

The intent is clear: **using Cursor's own models barely touches your budget; using someone else's is where the money goes.** Composer 2.5 is priced at $0.50 / $2.50 per M tokens (input / output), or $3 / $15 in fast mode; Grok 4.6 is $2 / $6, or $4 / $12 fast. The Grok models are jointly trained by Cursor and SpaceXAI.

Cursor's own spend guidance: daily Tab users generally stay within $20; light agent users usually stay inside the included allowance; daily agent users typically land at $60-100/mo total; power users running multiple agents or automation often exceed $200/mo.

Teams and Enterprise plans also carry a **Cursor Token Rate**: $0.25 per million tokens on top of model API pricing when you select a third-party model. Cursor's own models and Auto Cost are exempt.

**Cursor Router** is rolling out: Teams and Enterprise first (Enterprise starts with it off; an admin must opt in), with individual plans a few months behind. It works across the Agents window, editor, CLI, SDK, and iOS app.

## January 2026 Update

Cursor CLI received a wave of important updates in early 2026:

- **Plan Mode** — New planning mode: design the approach before implementation
- **Ask Mode** — New read-only exploration mode
- **Cloud Handoff** — Push local conversations to Cloud Agent for continuation
- **Enhanced MCP Integration** — Support for auto callback, `/mcp list` interactive menu
- **Diff Highlighting** — Word-level precision change highlighting for easier review

## Background Agents

Beyond Cloud Handoff, Cursor also offers **Background Agents** — fully autonomous agents that execute entirely in the cloud:

- Automatically clone your repo to a cloud environment
- Complete tasks independently and submit a **Pull Request**
- Run up to **8 parallel agents** simultaneously
- Billed separately, requires **MAX mode** (20% surcharge)

Background Agents are ideal for tasks you don't need to monitor in real time but want completed automatically, such as batch refactoring, automated bug fixes, or large-scale code migrations.

## Market Position

The figures below are public information from February 2026 and have not been updated since — treat them as a snapshot of that moment:

- **$2B ARR** (Annual Recurring Revenue)
- **2 million** total users
- **1 million** paid users
- **1 million** DAU (Daily Active Users)
- **Half of Fortune 500** companies adopted

These numbers make Cursor one of the fastest-growing products in the AI coding tool market. Extending from IDE to CLI to Cloud Agent, Cursor is building a complete AI developer platform.

## Use Cases

Cursor CLI is particularly well-suited for the following groups:

- **Developers already using Cursor IDE** — The CLI extends your familiar Agent experience to the terminal, with shared rules and settings
- **Teams needing unified IDE + CLI experience** — Same tools, same rules, seamless switching between IDE and terminal
- **CI/CD automation needs** — Native GitHub Actions support, multiple output formats, ready to integrate into existing pipelines
- **Long-running task scenarios** — Cloud Handoff means you don't have to keep watching the terminal; tasks can continue in the background or cloud

If you're a pure terminal user who doesn't use an IDE, Claude Code or Gemini CLI might better fit your workflow. But if your work spans both IDE and terminal, Cursor CLI offers the most complete cross-scenario integration available today.

## References

- [Cursor · Pricing](https://cursor.com/pricing)
- [Models & Pricing | Cursor Docs](https://cursor.com/docs/models-and-pricing)
- [Cursor Composer](https://cursor.com/composer)
- [Cursor CLI](https://cursor.com/cli)

## Changelog

- 2026-08-18: Refreshed against the official pricing pages. (1) The plan table now shows Pro+'s actual included allowance ($70, not $60), Teams Premium ($120/user), and the India-only Start plan, and drops Hobby's no-longer-accurate "2,000 completions + 50 slow premium requests." (2) **Rewrote the billing mechanism** — there are now two independent pools, Cursor Models and Other Models; the old "unlimited Auto mode + credit pool" description is no longer accurate. (3) Added actual Composer 2.5 and Grok 4.6 rates, Cursor's own spend guidance, the Teams/Enterprise Cursor Token Rate, and the rolling-out Cursor Router. (4) Marked the market-position figures as a February 2026 snapshot; removed Gemini CLI as a suggested alternative since its individual service ended
