---
title: "OpenAI Codex Complete Plan Analysis: Agent Integration in the ChatGPT Ecosystem"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, openai-codex, pricing, gpt-5, chatgpt, credits]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 5
tldr: "Codex rides your ChatGPT subscription (Free / Go $8 / Plus $20 / Pro 5x $100 / Pro 20x $200), and since 2026/4/2 billing is token-based credits. The model line is GPT-5.6 Sol / Terra / Luna; GPT-5.4 and 5.4 mini retire from ChatGPT-signed-in Codex on 2026/8/31."
description: "An in-depth look at OpenAI Codex: the ChatGPT subscription tiers, token-based credit billing, the three GPT-5.6 models, the GPT-5.4 retirement timeline, and who it fits."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-openai-codex)

OpenAI Codex is not a standalone product — it is an extension of the ChatGPT ecosystem. Understanding this is key to properly evaluating its pricing and use cases. This article provides a complete breakdown of Codex's plan design, covering product positioning, subscription tiers, credit billing, and model selection.

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

Codex billing is entirely dependent on your ChatGPT subscription tier — **there is no standalone Codex plan**.

| Plan | Monthly Cost | Codex Quota | Target Audience |
|------|-------------|-------------|-----------------|
| **Free** | $0 | Limited — enough to try, not to work | Evaluation |
| **Go** | $8/mo | The cheapest real access | Light users |
| **Plus** | $20/mo | The 1x baseline | Individual developers |
| **Pro 5x** | $100/mo | 5x Plus | Heavy users who mainly code |
| **Pro 20x** | $200/mo | 20x Plus, plus the rest of the Pro bundle | Heaviest users who want the full Pro package |
| **Business** | $25/user/mo ($20 billed annually, min. 2 users) | Pooled team quota and admin controls | Small teams |
| **Enterprise / Edu** | Custom pricing | Can buy workspace credits under flexible pricing | Enterprises, education |

Key points:

- **The $100 Pro 5x tier only appeared in April 2026**, and it is the single most common source of out-of-date Codex pricing advice: any article that says "Pro is $200" without qualification predates it. Both Pro tiers give you the same model suite; the difference is the multiplier (5x vs 20x) and the rest of the Pro bundle attached to the $200 tier. If Codex is the only reason you are paying, $100 is the tier that exists for you.
- **Quotas run on a rolling five-hour window**, with local messages and cloud chats sharing that window, plus additional weekly limits.
- **Enterprise / Edu on flexible pricing have no fixed rate limits** — usage scales with credits.

## Billing Is Now Token-Based Credits

Since April 2, 2026, Codex billing changed from per-message to **aligning with API token usage**, priced in credits (extended to all existing Enterprise plans on April 23). This is the key change for understanding Codex costs — the old "how much quota does one message cost" arithmetic no longer applies.

The current rate card (credits per 1M tokens):

| Model | Input | Cached input | Output |
|-------|-------|--------------|--------|
| GPT-5.6 Sol | 125 | 12.50 | 750 |
| GPT-5.6 Terra | 50 | 5 | 300 |
| GPT-5.6 Luna | 5 | 0.5 | 30 |
| GPT-5.5 | 125 | 12.50 | 750 |
| GPT-5.5 Cyber | 312.5 | 31.25 | 1,875 |

Cached input is consistently one tenth of input, so **whether you hit the cache sets the order of magnitude of your bill**. OpenAI's own practical figure is roughly $100-200 per developer per month, with wide variance depending on model, how many instances you run in parallel, automation volume, and whether fast mode is on.

## CLI Dual Billing Tracks

Codex CLI offers two billing modes, and developers can switch between them based on their use case:

### Plan Mode (Default)

Uses ChatGPT subscription quota with **no additional charges**. CLI operations deduct credits from your subscription plan, equivalent to using Codex in the ChatGPT web interface.

Suitable for everyday development tasks — fixing bugs, writing features, running code reviews. The quota is usually sufficient.

### API Key Mode

Bring your own OpenAI API key and the whole quota system is replaced by per-token billing. Suitable for heavy automation, CI/CD integration, or scenarios that exceed subscription quotas.

On this path model availability **follows your key**, unaffected by model removals on the ChatGPT side — which matters specifically for the GPT-5.4 retirement (see below). In exchange, cloud features (GitHub code review, Slack integration, and so on) are unavailable in API key mode.

Switching between the two modes is instant — no reinstallation or reconfiguration needed. Developers can use Plan mode for daily work and switch to API Key mode when heavy automation is required.

## Model Selection: The Three GPT-5.6 Tiers

Codex's main line is now the **three models in the GPT-5.6 family**, chosen via the Power setting (Smarter ↔ Faster) rather than the old fixed "big model commands, small model executes" split:

| Model | Positioning | Where it fits |
|-------|-------------|---------------|
| **Sol** | Quality and reasoning depth first | Complex analysis, coding, research, advanced workflows |
| **Terra** | The everyday default | Strong capability with a better performance/price balance |
| **Luna** | Speed and cost first | Lightweight, high-volume work |

The default is `gpt-5.6-sol` at medium reasoning under the Power setting; move toward Smarter for deeper reasoning, toward Faster for speed and lower cost. To pin `gpt-5.6-luna` or a specific reasoning effort or speed, use Advanced. The ChatGPT desktop app, Codex CLI, and IDE extension **share one `config.toml`** — set it once, it applies to all three.

### Important: GPT-5.4 and 5.4 mini are being retired

**From August 31, 2026, GPT-5.4 and GPT-5.4 mini are removed from Codex for users signed in with a ChatGPT account.** The official replacements are GPT-5.4 → GPT-5.6 Terra, and GPT-5.4 mini → GPT-5.6 Luna.

If your scripts, `config.toml`, or `codex exec --model` commands still hardcode `gpt-5.4`, change them before 8/31, and check workspace defaults, saved model settings, and automations too. **The bring-your-own-API-key path is unaffected**, as is model availability on the OpenAI API itself.

`gpt-5.2` and `gpt-5.3-codex` were already marked deprecated in ChatGPT-signed-in mode.

## Other Capabilities

| Item | Details |
|------|---------|
| **Codex Security** | Scans code for security vulnerabilities |
| **Parallel Agents** | Multiple agents handling different tasks simultaneously |
| **Worktrees** | Git worktree isolation, each agent on its own branch |
| **Skills** | Reusable workflow templates |
| **Automations** | Automation triggers (e.g., automatic review on PR creation) |
| **GPT-5.3-Codex-Spark** | Research preview on low-latency hardware, ChatGPT Pro only, governed by a separate usage limit |

The Parallel agents + worktrees combination is especially practical: multiple agents can work simultaneously in different git worktrees without interfering with each other. For example, one agent fixes bugs, another writes tests, and a third updates documentation — all running in parallel.

## Credit Mechanism

Credit consumption depends on the model, the input/cached/output token volumes, and whether fast mode is on (fast mode burns credits at a higher rate). Image generation also burns quota roughly 3-5x faster than text on average.

Key rules:

1. **Subscription plans will not overbill** — once your quota is used up, you wait for the next cycle; no automatic charges are incurred
2. Some Plus / Pro users **can add credits** to keep working; Business / Enterprise / Edu customers on flexible pricing can buy workspace credits
3. **Switching to a cheaper model** (Terra → Luna) extends the lifespan of your remaining quota
4. Credit consumption is visible in Settings, and Codex also shows per-thread usage; where a workspace enables member cost visibility it adds an estimated dollar figure — that is a planning estimate, not an invoice

This design avoids the risk of "getting hit with a large bill mid-use," which is an important safeguard for budget-conscious individual developers or small teams.

## Use Cases

Codex is best suited for the following scenarios:

- **Users already in the ChatGPT ecosystem**: If you already subscribe to ChatGPT, Codex is nearly zero marginal cost additional capability
- **People paying only to code**: The $100 Pro 5x tier exists for exactly this, with the same model suite as the $200 tier
- **Organizations needing Enterprise integration**: Slack bot, GitHub Actions, SSO, and other enterprise features are less common in other Agent CLI tools
- **Anyone wanting consistent settings across surfaces**: desktop app, CLI, and IDE extension share one `config.toml`

Less suitable scenarios: teams that require fully local models, need custom routing strategies, or are not in the OpenAI ecosystem.

## References

- [Pricing – Codex | OpenAI Developers](https://developers.openai.com/codex/pricing)
- [Models – Codex | OpenAI Developers](https://developers.openai.com/codex/models)
- [Codex rate card | OpenAI Help Center](https://help.openai.com/en/articles/20001106-codex-rate-card)
- [Using Codex with your ChatGPT plan | OpenAI Help Center](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Introducing Codex | OpenAI](https://openai.com/index/introducing-codex/)
- [Codex | AI Coding Partner from OpenAI](https://openai.com/codex/)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)

## Changelog

- 2026-08-18: Fully refreshed against the official pricing, models, and rate card pages. (1) The plan table now includes Go ($8) and the Pro 5x ($100) tier introduced in April 2026 — the original only listed Pro at $200. (2) Billing moved from per-message to token-based credits on 2026/4/2; the rate card is now included. (3) The model line is now GPT-5.6 Sol / Terra / Luna, and **the entire "GPT-5.4 commands, mini executes, mini costs only 30% of quota" routing section has been removed** — that mechanism is no longer current, and GPT-5.4 and 5.4 mini retire from ChatGPT-signed-in Codex on 2026/8/31. (4) Removed dead reference links in favor of the official rate card and models pages
