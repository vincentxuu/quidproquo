---
title: "Kiro (AWS) Complete Analysis: The Spec-Driven Agentic IDE"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, kiro, aws, pricing, auto-mode, specs, hooks, bedrock]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 13
tldr: "Kiro has five tiers: Free 50 credits, Pro $20/1,000, Pro+ $40/2,000, Pro Max $100/5,000, and Power $200/10,000, with add-on credits at $0.04. Auto mode mixes models to cut cost (the same task costs 1.3x credits via Sonnet), and the spec-driven flow turns vibe coding into traceable, structured development."
description: "An in-depth analysis of AWS Kiro's 2026 pricing plans, Auto mode, Spec-Driven development, Agent Hooks, autonomous agents, and AWS ecosystem integration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-kiro)

Kiro is an Agentic IDE from AWS, built on Code OSS (the open-source foundation of VS Code). Its core philosophy is to move developers from casual "vibe coding" into a **structured spec-driven development workflow**, while retaining the flexibility of AI assistance. During the preview phase, over 250,000 developers have used it, with the underlying infrastructure running on Amazon Bedrock.

This article starts from pricing and breaks down Kiro's core mechanisms one by one, helping you decide whether it's the right fit for your team.

> This article is a sub-entry of [The Complete Guide to Agent CLI Subscriptions and Multi-Model Routing](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing-en).

## Pricing Plans

Kiro offers five tiers, billed in credits:

| Plan | Monthly | Credits/mo | Add-on credits | Best for |
|------|---------|-----------|----------------|----------|
| **Free** | $0 | 50 (perpetual) | Not available | Trying it out, light use |
| **Pro** | $20/user | 1,000 | $0.04/credit | Everyday developers |
| **Pro+** | $40/user | 2,000 | $0.04/credit | Heavy users, autonomous agents |
| **Pro Max** | $100/user | 5,000 | $0.04/credit | Intensive individual use |
| **Power** | $200/user | 10,000 | $0.04/credit | Full team adoption |

Key observations:

- **Credits are consumed fractionally, metered to 0.01**, so simple edits and short prompts can cost less than one credit — the headline credit count stretches further than it looks.
- **First upgrade to a paid plan** (via social login or AWS Builder ID) earns a $20 account credit; first-time access also grants 500 bonus credits usable within 14 days.
- **Add-on credit rules**: $5 minimum (125 credits), $100 maximum per pack, up to 5 packs at a time, expiring 12 months from purchase and rolling over month to month. Consumption order is **plan credits first, then add-ons**, earliest-expiring pack first. When both run out, usage pauses until you buy more or the cycle resets.
- **Overage is disabled by default** and must be switched on in Settings. Once on, it stays on as long as you remain on a paid plan; dropping to Free disables it again.
- **GovCloud regions are priced differently** — an easily missed hidden cost during evaluation.
- **Startup program**: eligible startups can get up to a year of Pro+ free, which is compelling for early teams.

## Available models

| Plan | Models |
|------|--------|
| **Free** (social login or AWS Builder ID) | Claude Sonnet 4.5 plus open-weight models such as Qwen3 Coder Next, DeepSeek v3.2, and MiniMax 2.1, subject to rate limits |
| **Paid plans** | The above plus premium models: Auto, Claude Sonnet 4.6, and Claude Opus 4.8 |

Not every premium model is available in every country or region.

## Auto Mode: Intelligent Model Routing

Auto mode is Kiro's default mode and one of its most distinctive features. Rather than locking you into a single model, it **automatically selects the most appropriate model based on prompt intent**.

### How It Works

1. **Intent detection**: Analyzes the complexity and type of your prompt
2. **Model routing**: Mixes frontier models (e.g., Sonnet 4.5) with specialized models
3. **Cache optimization**: Reuses responses from similar requests to reduce credit consumption

### Credit Consumption Logic

| Prompt Type | Consumption | Example |
|-------------|-------------|---------|
| Simple Q&A, completions | < 1 credit | "What does this function do?" |
| Medium complexity | ~1 credit | Refactoring a module |
| Complex multi-step | > 1 credit | Cross-file architectural changes |

You can also manually select a specific model and bypass Auto routing — but the **cost difference is real**: Amazon's own figure is that a task consuming X credits under Auto costs 1.3X when run through Sonnet. That's why Auto is the default.

Model IDs turn over between generations (the current premium tier is Sonnet 4.6 and Opus 4.8), so pick by tier: a cheap fast model for chores, a mid-tier for daily work, the flagship reserved for genuinely complex tasks.

The value of Auto mode is this: **you don't need to decide which model to use yourself**. For most developers, letting the system decide automatically actually saves more credits than manual selection.

## Spec-Driven Development: From Vibe Coding to Structured Development

This is the most fundamental difference between Kiro and other AI IDEs. Most tools let you throw a prompt and generate code directly. Kiro inserts a **formal specification process** in between.

### Three-Phase Workflow

| Phase | Output | Purpose |
|-------|--------|---------|
| **Requirements** | User stories, acceptance criteria | Clearly define "what to build" |
| **Design** | Technical design document | Decide "how to build it," including architectural decisions and trade-offs |
| **Tasks** | Structured task list | Break down into executable steps |

### Why This Matters

- **Traceability**: Every decision is documented — no more black-box generation.
- **Fewer iterations**: Structured context lets AI complete more complex tasks in fewer round trips.
- **Team collaboration**: Spec documents can be reviewed, version-controlled, and shared — no longer trapped in someone's chat history.
- **Reasoning transparency**: Explicitly documents the AI's reasoning process and the rationale behind design decisions.

This isn't adding process overhead — it's **making explicit** the decisions that were previously hidden in prompt back-and-forth.

## Agent Hooks: Local CI/CD Automation

Agent Hooks is Kiro's event-driven automation system, conceptually similar to **GitHub Actions, but running in your local development environment**.

### Trigger Events

| Trigger Event | Description |
|---------------|-------------|
| **File Save** | Triggered when a file is saved |
| **File Create** | Triggered when a new file is created |
| **File Delete** | Triggered when a file is deleted |
| **Pre Tool Use** | Intercepts before an Agent executes a tool — can block or modify the operation |
| **Post Tool Use** | Triggered after an Agent executes a tool — suitable for logging, formatting, documentation updates |

### Practical Scenarios

- **Test sync**: Automatically generate corresponding test files when adding components
- **Documentation updates**: Automatically update README or OpenAPI spec when APIs change
- **i18n**: Automatically create translation keys when new strings are added
- **Git assistant**: Automatically check formatting and lint before commits
- **Compliance checks**: Pre Tool Use intercepts unsafe operations
- **Code style**: Post Tool Use automatically applies formatters

Hooks are written in natural language and can be shared with the team via version control. This means team development standards are no longer just conventions written in documentation — they become **conventions that are automatically enforced**.

## Autopilot vs Supervised Mode

| Mode | How It Works | Use Cases |
|------|-------------|-----------|
| **Supervised** | Each operation requires manual confirmation | Sensitive changes, learning phase |
| **Autopilot** | Multi-step changes without individual approvals | Batch operations on known patterns |

### Autonomous Agents (Pro+ and Above)

The Pro+ and Power plans unlock **autonomous agents** with the following capabilities:

- **Cross-repo operations**: Not limited to a single project
- **Persistent context**: Remembers previous conversations and decisions across sessions
- **Learning from review feedback**: Adjusts subsequent behavior based on your modification suggestions
- **Long-running execution**: Can work continuously for days with minimal human intervention

This means you can assign a complex task to an Agent, come back the next day to review the results — without needing to watch over it the entire time.

## CLI and Ecosystem Integration

Kiro's CLI implements the **Agent Client Protocol (ACP)**, a standardized agent communication protocol that enables integration with different IDEs.

### Editor Support

- VS Code (native, built on Code OSS)
- JetBrains family
- Zed

### Development Tool Integration

- **MCP support**: Connects to Model Context Protocol-compatible toolchains
- **Steering Files**: Project-level AI behavior configuration files
- **Native AWS integration**: Seamless connectivity with Lambda, CDK, CloudFormation, and CodeCatalyst

For heavy AWS users, Kiro is currently the only AI development tool where **the entire chain from IDE to deployment stays within the AWS ecosystem**.

## Best-Fit Scenarios

Kiro is best suited for the following teams:

- **AWS-centric tech stacks**: The native integration with Lambda, CDK, and CloudFormation is unmatched.
- **Teams needing structured development workflows**: Spec-Driven development ensures AI assistance is no longer a black box.
- **Teams that value automated development standards**: Agent Hooks turn team conventions into executable automation.
- **Individual developers wanting a free plan**: 50 credits permanently free, combined with Auto mode optimization, is more than sufficient for light usage.
- **Startups**: The Startup plan offers up to one year of Pro+ for free — a very substantial benefit.

## References

- [Pricing - Kiro](https://kiro.dev/pricing/)
- [Billing for individuals - Kiro Docs](https://kiro.dev/docs/billing/)
- [Usage beyond plan limits - Kiro Docs](https://kiro.dev/docs/billing/add-on-credits/)
- [Kiro FAQ](https://kiro.dev/faq/)

## Changelog

- 2026-08-18: Refreshed against the official pricing and billing docs. (1) Added the **Pro Max tier ($100 / 5,000 credits)** and corrected Power's allowance (15,000 → **10,000**). (2) Added the full add-on credit rules ($5 minimum, $100 per pack, 5 packs max, 12-month expiry, rollover, plan credits consumed first) and the easily missed fact that overage is off by default. (3) Added fractional billing (metered to 0.01) and the $20 first-upgrade credit. (4) Replaced the outdated manual model list with a Free/paid comparison (Free gets Sonnet 4.5 plus open-weight models; paid adds Auto / Sonnet 4.6 / Opus 4.8). (5) Added Amazon's Auto vs Sonnet cost ratio (1.3x)
