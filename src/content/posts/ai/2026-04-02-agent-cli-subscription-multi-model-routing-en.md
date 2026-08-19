---
title: "Agent CLI Subscription Plans Compared: Building a Flexible Multi-Model Routing Strategy"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, multi-model-routing, claude-code, cursor, codex, kiro, gemini-cli, opencode, llm-router, cost-optimization]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 13
tldr: "A comparison of six agent CLI subscriptions (Claude Code, Cursor CLI, Codex, Kiro, Antigravity/Gemini CLI, OpenCode) plus the multi-model routing pattern — cheap models for simple work, strong models for hard work. Nearly every one of these changed its billing in the first half of 2026; this version was re-verified on 8/18."
description: "A comprehensive comparison of subscription plans and pricing strategies for six terminal-native Agent CLIs, plus an in-depth look at Multi-Model Routing pattern implementations and architecture design."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)

In 2026, AI coding agents have evolved from "assistive tools" to "primary development drivers." This article focuses on **tools with terminal CLI agents** — coding agents that run directly in your terminal.

This article covers two things:

1. **Side-by-side comparison** of six Agent CLI subscription plans
2. **Deep dive** into Multi-Model Routing patterns — automatically routing simple tasks to cheaper models while reserving flagship models for complex tasks

## Overview of Six Agent CLI Subscription Plans

| Tool | Entry price | Heavy use | Model strategy | Best for |
|------|-------------|-----------|----------------|----------|
| **[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code-en)** | $20/mo | $100-200/mo | Manual switching across Opus / Sonnet / Haiku tiers | Deep reasoning, complex tasks |
| **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor-en)** | Free / $20/mo | $60-200/mo | Own-model pool + third-party pool | Seamless IDE ↔ CLI |
| **[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex-en)** | $8 (Go) / $20/mo | $100-200/mo | GPT-5.6 Sol / Terra / Luna | The OpenAI ecosystem |
| **[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro-en)** | Free (50 credits) | $100-200/mo | Auto mode mixes models | The AWS ecosystem |
| **[Antigravity CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en)** | Per Google AI plan | Per plan | Gemini series | The Google ecosystem |
| **[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode-en)** | Free (open source) | Pay per API use | 75+ providers, switch freely | Model freedom, vendor independence |

> **⚠️ Prices in this table have a half-life of roughly one quarter.** In the first half of 2026 nearly all six changed billing: Codex moved from per-message to token-based credits and added a $100 Pro 5x tier, Cursor split into two usage pools, Kiro added a Pro Max tier, and Gemini CLI's individual free tier disappeared outright. The figures below were verified on 2026/8/18 — check each vendor's official page before deciding.

## Positioning and Features of Each Tool

### Commercial Subscription

**[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code-en)** — Anthropic's terminal agent, strongest on reasoning depth. Pro $20/mo, Max 5x $100/mo, Max 20x $200/mo. Quota runs on a rolling five-hour window plus weekly caps, and web, desktop, mobile, and terminal **share one pool**; when it runs out you can enable usage credits at API rates instead of stopping. The subagent architecture can assign cheap models to the grunt work.

**[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor-en)** — brings the Cursor IDE agent to the terminal. Interactive TUI plus headless mode, with Plan/Ask/Agent modes. Its distinctive **Cloud Handoff** pushes a CLI conversation to a cloud agent you can pick up on mobile or web. Pro $20, Pro+ $60, Ultra $200. The billing key is **two independent pools**: generous usage of its own models (Grok 4.6/4.5, Composer 2.5), and third-party models charged at API price with $20 / $70 / $400 included per tier.

**[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex-en)** — rides the ChatGPT subscription: Go $8, Plus $20, Pro 5x $100, Pro 20x $200. Since 2026/4/2 billing is **token-based credits**. Models are the three GPT-5.6 tiers — Sol, Terra, Luna — chosen via the Power setting; **GPT-5.4 and 5.4 mini retire from ChatGPT-signed-in Codex on 2026/8/31**. The CLI supports both Plan mode (subscription quota) and API Key mode (per-token).

**[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro-en)** — from AWS, implementing the Agent Client Protocol (ACP). Free 50 credits, Pro $20/1,000, Pro+ $40/2,000, Pro Max $100/5,000, Power $200/10,000, with add-ons at $0.04/credit. Auto mode mixes models automatically; the same task costs 1.3x credits when routed through a single frontier model. Spec-driven development is the standout feature.

### Free / Open Source

**[Antigravity CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en)** — Google's terminal agent. **Note: its predecessor Gemini CLI's "1,000 free requests a day" tier ended for individual accounts on 2026/6/18**, leaving Gemini CLI with only enterprise licenses and paid API keys. Antigravity CLI is rewritten in Go, is no longer open source, and leads on async background workflows.

**[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode-en)** — open source **TypeScript** CLI, MIT licensed, ~198K GitHub stars. Supports 75+ providers (including local Ollama) and authenticates with a GitHub Copilot or ChatGPT account. The tool is free; you pay only for the models you choose, with the optional curated Zen gateway available.

## Pricing Tier Analysis

### Free Tier: How Far Can You Go?

| Tool | Free allowance | Limits |
|------|----------------|--------|
| OpenCode | Unlimited (open source) | Bring your own API key, or use an existing Copilot / ChatGPT account |
| Kiro CLI | 50 credits (perpetual) | Fractional billing stretches it, but once gone it's gone |
| Codex CLI | ChatGPT Free's limited allowance | Enough to try, not to work; the practical entry is the $8 Go plan |
| Cursor CLI | Hobby plan | Limited agent requests, access to Composer |
| Antigravity / Gemini CLI | ❌ | **The individual free tier ended 2026/6/18** |

This row shrank noticeably in the first half of 2026 — the most generous option disappeared entirely. The only genuinely sustainable zero-cost path left is the open source, bring-your-own-key route.

### $20/month: Mainstream Tier

Claude Code Pro, Cursor Pro, Codex Plus, and Kiro Pro all sit here, but you get quite different things: Claude Code gives you five-hour-window quota from a shared pool, Cursor gives generous own-model usage plus $20 of third-party models, Codex gives 1x baseline credits, Kiro gives 1,000 credits. **Same price, different goods** — what matters is whether your work falls into the part each one makes cheap.

### $100-200/month: Heavy Usage

| Plan | Price | What you get |
|------|-------|--------------|
| Cursor Pro+ | $60 | $70 of included third-party model usage |
| Claude Code Max 5x | $100 | 5x Pro quota |
| Codex Pro 5x | $100 | 5x Plus, the coding-focused tier |
| Kiro Pro Max | $100 | 5,000 credits |
| Claude Code Max 20x | $200 | 20x Pro quota |
| Cursor Ultra | $200 | $400 of included third-party model usage |
| Codex Pro 20x | $200 | 20x Plus plus the full Pro bundle |
| Kiro Power | $200 | 10,000 credits |

The $100 tier got crowded in the first half of 2026 — both Codex and Kiro added one, where previously only Claude Code Max 5x sat there. If your usage falls between "Pro isn't enough" and "$200 is too much," you have more options than six months ago.

## Multi-Model Routing: Core Concepts

### Why Do You Need Model Routing?

Not every task needs Opus. In practice:

- **~70% of tasks**: Simple queries, formatting, fixing typos → Haiku is sufficient
- **~15-20% of tasks**: Day-to-day development, code review → Sonnet is optimal
- **~10-15% of tasks**: Architecture design, multi-file refactoring, complex debugging → Requires Opus

Blindly using flagship models for everything means 70% of your spending is wasted.

### Three-Tier Model Architecture

Practice has shown that **three tiers** is the optimal balance (more than three adds complexity without meaningful gains):

```
┌─────────────────────────────────────────┐
│  Tier 3: Deep Mode                      │
│  Each vendor's flagship (Opus / Sol tier)│
│  Architecture decisions, multi-file     │
│  refactoring, novel problem solving     │
│  ~$15-30 / M tokens                    │
├─────────────────────────────────────────┤
│  Tier 2: Standard Mode                  │
│  Each vendor's mid tier (Sonnet/Terra)  │
│  Daily development, research,           │
│  content generation                     │
│  ~$3-8 / M tokens                      │
├─────────────────────────────────────────┤
│  Tier 1: Quick Mode                     │
│  Each vendor's light tier (Haiku/Luna)  │
│  Heartbeat, quick lookups,              │
│  classification                         │
│  ~$0.5-1 / M tokens                    │
└─────────────────────────────────────────┘
```

### Routing Evaluation Dimensions

Dimensions used by mainstream routers:

1. **Token count**: Longer prompts typically indicate complex tasks
2. **Code presence**: Tasks containing code usually require stronger reasoning
3. **Reasoning markers**: Keywords like "why", "analyze", "design", "architect"
4. **Technical term density**: High density suggests specialized tasks
5. **Context length**: Tasks requiring understanding of large contexts need stronger models
6. **Output quality sensitivity**: User-facing output demands higher quality

### Routing Strategies

**Budget Ladder**:

```
1. Start with Tier 1
2. Validate output quality
3. Quality insufficient → upgrade to Tier 2 and retry
4. Still insufficient → upgrade to Tier 3
```

Best for: data extraction, labeling, short responses, and other tasks where quality is verifiable.

**Classifier Routing**:

```
1. Classifier analyzes request complexity (< 1ms)
2. Routes directly to corresponding tier
3. No retries needed
```

Best for: scenarios demanding real-time responses.

### The Order of Magnitude of Savings

Routing tools advertise savings in the **40-85%** range, but the real number depends heavily on your task mix — if your work is already concentrated in genuinely hard tasks, routing saves little.

Note that such figures are usually computed against a "run everything on the flagship" baseline, which was never a rational way to work in the first place. **The more honest question isn't "how much can routing save," it's "what fraction of my tasks don't actually need the flagship"** — measure that first, then decide whether routing is worth the added system complexity.

## Routing Mechanisms Across CLIs

### Built-in Automatic Routing

- **[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro-en)**: Auto mode combines frontier and specialized models with intent detection and caching; AWS's own figure is that the same task costs 1.3x credits through a single frontier model
- **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor-en)**: Auto mode picks models for you; **Cursor Router** is rolling out (Teams / Enterprise first, individual plans a few months behind)

> This section previously listed "Codex: GPT-5.4 plans, mini executes, mini costs only 30% of quota." That is no longer how Codex works — you now choose among the three GPT-5.6 tiers via the Power setting rather than relying on a fixed large/small split.

### Manual Switching Supported

- **[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code-en)**: switch between Opus / Sonnet / Haiku tiers, paired with the subagent architecture
- **[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex-en)**: pick among GPT-5.6 Sol / Terra / Luna via the Power setting, or use Advanced to pin a model and reasoning effort
- **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor-en)**: pin any third-party frontier model — but note it draws from the third-party pool

### Full Freedom of Choice

- **[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode-en)**: 75+ providers, switch models mid-session without losing context, most flexible when paired with third-party routers

## Open Source Routing Tools

For detailed coverage, see **[Multi-Model Routing Open Source Tools & Implementations](/posts/ai/2026-04-02-multi-model-routing-opensource-tools-en)**. Here are the highlights:

| Tool | Features | GitHub |
|------|----------|--------|
| **ruflo** | Claude-specific orchestration platform with built-in task analysis | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) |
| **claw-router** | 14-dimension weighted scorer, < 1ms decisions | [iblai/claw-router](https://github.com/iblai/claw-router) |
| **freerouter** | Self-hosted router with manual override via `/max` | [openfreerouter/freerouter](https://github.com/openfreerouter/freerouter) |
| **agent-router** | Multi-agent intelligent routing with load balancing | [dabit3/agent-router](https://github.com/dabit3/agent-router) |
| **llm-router** | NVIDIA official blueprint with intent analysis | [NVIDIA-AI-Blueprints/llm-router](https://github.com/NVIDIA-AI-Blueprints/llm-router) |

## Designing Your Own Multi-Model Switching System

If you want to build your own, here is the recommended architecture:

```
User Request
    │
    ▼
┌──────────────┐
│  Classifier  │  ← 14-dimension scoring (< 1ms)
│  (Haiku)     │
└──────┬───────┘
       │
   ┌───┴───┐
   ▼       ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐
│Quick │ │ Std  │ │ Deep │
│Haiku │ │Sonnet│ │ Opus │
└──────┘ └──────┘ └──────┘
```

### Key Design Principles

1. **Auto + manual override**: Automatic decisions by default, but allow commands like `/max`, `/quick` to force specific tiers
2. **Three tiers is enough**: Simple → Medium → Complex; more than three adds complexity for no real gain
3. **Use the cheapest model for the classifier**: Classification itself shouldn't cost much
4. **Monitor and adjust**: Track usage ratios per tier and continuously tune classification thresholds

## Conclusion

The 2026 Agent CLI market has matured to the point where "choices aren't lacking — strategy is."

**Start at zero cost**: Gemini CLI (1,000 req/day free) or OpenCode (open source + bring your own API) are the best entry points.

**Professional use**: Claude Code Max ($100/mo unlimited + Opus) or Codex Pro ($200/mo + built-in routing).

**Maximum flexibility**: OpenCode + third-party router (freerouter / ruflo), freely switching between 75+ models.

Regardless of which plan you choose, the core principle remains: **use the right model for the right task.**

---

## References

- [Plans & Pricing | Claude by Anthropic](https://claude.com/pricing)
- [Pricing – Codex | OpenAI Developers](https://developers.openai.com/codex/pricing)
- [Codex rate card | OpenAI Help Center](https://help.openai.com/en/articles/20001106-codex-rate-card)
- [Cursor · Pricing](https://cursor.com/pricing)
- [Models & Pricing | Cursor Docs](https://cursor.com/docs/models-and-pricing)
- [Pricing - Kiro](https://kiro.dev/pricing/)
- [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [OpenCode | GitHub](https://github.com/anomalyco/opencode)

## Changelog

- 2026-08-18: Nearly all six vendors changed billing in the first half of 2026, so the whole post was recomputed against official pages. (1) **Gemini CLI's individual free tier ended 6/18**; that slot is now Antigravity CLI, and the free-tier analysis marks the row as gone. (2) Codex gains Go $8 and Pro 5x $100, billing is now token-based credits, and models are the three GPT-5.6 tiers — **the no-longer-current "GPT-5.4 + mini at 30% quota" routing description was removed**. (3) Cursor is now two usage pools (own models / third-party $20-$400), with the rolling-out Cursor Router noted. (4) Kiro gains Pro Max $100 and Power's allowance is corrected (15,000 → 10,000). (5) Claude Code's "unlimited" framing is replaced by the real mechanism: five-hour window, weekly caps, usage credits. (6) Hardcoded model IDs removed from the three-tier diagram. (7) Fixed the renamed `iblai/claw-router`. (8) The "cost savings examples" table quoted figures to the dollar with no verifiable source; it is replaced with an order-of-magnitude discussion and a more useful question to ask
