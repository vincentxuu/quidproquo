---
title: "OpenAI Codex Complete Plan Analysis: Agent Integration in the ChatGPT Ecosystem"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, openai-codex, pricing, gpt-5, chatgpt, model-routing]
lang: en
tldr: "Codex is tied to ChatGPT subscriptions ($20-200/mo). GPT-5.4 + mini automatic routing is the highlight, and the CLI supports dual billing via Plan mode and API Key mode."
description: "An in-depth analysis of OpenAI Codex's 2026 subscription plans, CLI billing models, GPT-5.4 model routing, multi-agent architecture, and use cases."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-openai-codex)

OpenAI Codex is not a standalone product — it is an extension of the ChatGPT ecosystem. Understanding this is key to properly evaluating its pricing and use cases. This article provides a complete breakdown of Codex's plan design, covering product positioning, subscription tiers, CLI billing, model routing, and the latest updates.

## Product Positioning

Codex's core strategy is **tying into the ChatGPT subscription**. Unlike Claude Code or Gemini CLI, which exist as independent developer tools, Codex is an agent capability within the ChatGPT ecosystem focused on code tasks.

Users can access Codex through three interfaces:

| Interface | Description |
|-----------|-------------|
| **Web App** | Built-in Codex feature within ChatGPT's web interface, used directly in conversations |
| **CLI** | Terminal agent supporting local codebase operations |
| **IDE Extension** | Editor extensions for VS Code and others, integrated into the development environment |

All three interfaces share the same subscription quota — no separate payments required. This means your ChatGPT Plus subscription also covers Codex usage.

## Subscription Plans

Codex billing is entirely dependent on your ChatGPT subscription tier. Here are the plans and their positioning:

| Plan | Monthly Cost | Codex Quota | Target Audience |
|------|-------------|-------------|-----------------|
| **Free / Go** | $0 | Limited and temporary access, restricted features | Trial users, light usage |
| **Plus** | $20/mo | ~160 messages / 3 hours (GPT-5.2) | Individual developers |
| **Pro** | $200/mo | ~6-7x the Plus quota | Heavy users, professional developers |
| **Team** | $25-30/user/mo | Shared Team-level quota | Small teams |
| **Business / Enterprise** | Custom pricing | Slack Bots, GitHub Actions integration | Enterprises, large organizations |

Key points:

- **Free / Go plan** Codex access is temporary, with no guarantee of long-term availability. Suitable for evaluation but not for daily development.
- **Plus plan**'s 160 messages / 3 hours is based on GPT-5.2. When using higher-tier models, the actual number of available messages will be lower.
- **Pro plan** offers 6-7x the Plus quota. For developers who need heavy agent usage, the per-token unit cost is significantly lower.
- **Business / Enterprise** supports Slack bot integration and GitHub Actions automation, suitable for teams that need to embed Codex into existing DevOps workflows.

## CLI Dual Billing Tracks

Codex CLI offers two billing modes, and developers can switch between them based on their use case:

### Plan Mode (Default)

Uses ChatGPT subscription quota with **no additional charges**. CLI operations deduct credits from your subscription plan, equivalent to using Codex in the ChatGPT web interface.

Suitable for everyday development tasks — fixing bugs, writing features, running code reviews. The quota is usually sufficient.

### API Key Mode

Bring your own API key, billed per token. Suitable for heavy automation, CI/CD integration, or scenarios that exceed subscription quotas.

| Model | Input (per M tokens) | Output (per M tokens) |
|-------|----------------------|----------------------|
| **codex-mini** | $1.50 | $6.00 |
| **GPT-5** | $1.25 | $10.00 |

**Prompt caching** offers a 75% discount, which is particularly advantageous for highly repetitive automation tasks (such as repeatedly analyzing the same repo in a CI pipeline).

Switching between the two modes is instant — no reinstallation or reconfiguration needed. Developers can use Plan mode (free) for daily work and switch to API Key mode when heavy automation is required.

## Built-in Model Routing

This is the most noteworthy feature of Codex's plan design. Codex does not let users manually select models; instead, it **automatically determines which model to use for each subtask**.

### Routing Mechanism

| Model | Role | Task Type |
|-------|------|-----------|
| **GPT-5.4** | Commander | Planning, coordination, judgment, complex reasoning |
| **GPT-5.4 mini** | Executor | Well-scoped subtasks, parallel processing |

How it works:

1. GPT-5.4 receives the task and formulates an execution plan
2. Parallelizable subtasks are delegated to GPT-5.4 mini
3. GPT-5.4 mini completes subtasks and reports back
4. GPT-5.4 integrates results and makes final decisions

### Quota Calculation

**GPT-5.4 mini consumes only 30% of the GPT-5.4 quota**. This means that when the system automatically routes tasks to mini, your subscription quota lasts longer. For the Pro plan, if half of the tasks are routed to mini, the total usable task volume is roughly 35% more than using GPT-5.4 exclusively.

The key to this design is that **users do not need to intervene manually**. You do not need to decide "should this task use the large or small model" — the system decides automatically. Compared to tools that require manual model switching, this reduces cognitive overhead.

## March 2026 Update

The March 2026 update was Codex's largest version upgrade in recent times:

| Item | Details |
|------|---------|
| **Core Model** | Upgraded to GPT-5.4, replacing the previous GPT-5.2 |
| **Routing Model** | Added GPT-5.4 mini, dedicated to handling lighter subtasks |
| **Codex Security** | Entered Research Preview, capable of scanning code for security vulnerabilities |
| **Parallel Agents** | Support for multiple agents handling different tasks simultaneously |
| **Worktrees** | Support for Git worktree isolation, with each agent working on an independent branch |
| **Skills** | Ability to define reusable workflow templates |
| **Automations** | Support for automation triggers (e.g., automatic review on PR creation) |

The Parallel agents + worktrees combination is especially practical: multiple agents can work simultaneously in different git worktrees without interfering with each other. For example, one agent fixes bugs, another writes tests, and a third updates documentation — all running in parallel.

## Credit Mechanism

Codex uses a credit system rather than simple message counting. Credit consumption depends on:

- **Model used**: GPT-5.4 consumes more; GPT-5.4 mini consumes only 30%
- **Task complexity**: Tasks requiring more reasoning steps consume more credits
- **Reasoning depth**: Deep thinking mode consumes additional credits

Key rules:

1. **Subscription plans will not overbill** — once your quota is used up, you wait for the next cycle; no automatic charges are incurred
2. **Additional credits can be purchased** to supplement your quota
3. **Manually switching to GPT-5.4 mini** can extend the lifespan of your remaining quota
4. Credit consumption can be viewed in real time on the ChatGPT settings page

This design avoids the risk of "getting hit with a large bill mid-use," which is an important safeguard for budget-conscious individual developers or small teams.

## Use Cases

Codex is best suited for the following scenarios:

- **Users already in the ChatGPT ecosystem**: If you already subscribe to ChatGPT Plus or Pro, Codex is nearly zero marginal cost additional capability
- **Teams that want built-in automatic model routing**: No need to design your own routing logic; GPT-5.4 / mini automatic dispatch works out of the box
- **ChatGPT Pro users**: The $200/mo plan offers the best cost-performance ratio for agent quota, especially with the increased effective capacity from automatic routing
- **Organizations needing Enterprise integration**: Slack bot, GitHub Actions, SSO, and other enterprise features are less common in other Agent CLI tools

Less suitable scenarios: teams that require fully local models, need custom routing strategies, or are not in the OpenAI ecosystem.

## Series Articles

This article is part of the Agent CLI Subscription and Billing series. For a complete multi-tool comparison and model routing analysis, see:

**→ [Agent CLI Subscription Plans and Multi-Model Routing: A Complete Comparison](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)**

## References

- [Pricing – Codex | OpenAI Developers](https://developers.openai.com/codex/pricing)
- [Introducing Codex | OpenAI](https://openai.com/index/introducing-codex/)
- [Codex | AI Coding Partner from OpenAI](https://openai.com/codex/)
- [OpenAI Codex Pricing 2026 | Get AI Perks](https://www.getaiperks.com/en/articles/codex-pricing)
- [OpenAI Codex in March 2026: What's New | LaoZhang AI](https://blog.laozhang.ai/en/posts/openai-codex-march-2026)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
