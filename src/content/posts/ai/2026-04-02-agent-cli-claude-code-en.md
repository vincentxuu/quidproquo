---
title: "Claude Code Complete Breakdown: The Deep Reasoning King of Terminal Agents"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, claude-code, pricing, subagent, anthropic]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 3
tldr: "Claude Code runs from $20/mo Pro to $200/mo Max 20x. Quota is a rolling five-hour window with weekly limits on top, shared across Claude on web, desktop, mobile, and the terminal. When you run out you can switch to usage credits at standard API rates rather than stopping."
description: "An analysis of Claude Code's subscription tiers, how quota actually works, API pricing and discounts, the subagent architecture, model tiering, and cost optimization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-claude-code)

Claude Code is Anthropic's terminal-native AI coding agent. What sets it apart is that it offers both a **flat monthly subscription** and **pay-per-token API** access — and on the subscription path, running out of quota doesn't stop you dead: you can slide onto API rates mid-task.

This post breaks down the subscription tiers and how quota actually works, API token pricing, model tiering, the subagent architecture, and cost across different usage intensities.

**On model names**: this post deliberately avoids naming any one model as "the best." Anthropic ships new models on a monthly cadence, so any model ID written into an article will be wrong within months — the [official pricing page](https://claude.com/pricing) and the [Models API](https://docs.anthropic.com/en/docs/about-claude/models) are the reliable sources. What follows is the **tiering logic**, which doesn't expire.

## Subscription Plans Overview

| Plan | Monthly cost | Usage capacity | Notes |
|------|--------------|----------------|-------|
| **Free** | $0 | Limited | Everyday questions |
| **Pro** | $20/mo (~$17/mo annually, $200 up front) | At least 5x Free per 5-hour session | Small codebases, short coding sprints |
| **Max 5x** | $100/mo | 5x Pro per 5-hour session | Everyday driver |
| **Max 20x** | $200/mo | 20x Pro per 5-hour session | Power users |
| **Team** | Standard / Premium seats | Standard exceeds Pro; Premium is 5x Standard | Team management and pooling |
| **Enterprise** | Custom (annual only) | Negotiated | Enterprises |

Annual billing exists only for Pro and Team; Max is currently **monthly only**.

### How quota actually works

This is the most misunderstood part. Claude's quota is **not a fixed message count**:

- It runs on a **rolling five-hour window**, and paid plans add **weekly limits** on top (the weekly limit resets at a fixed time assigned to your account, regardless of when you started using it)
- **Claude on web, desktop, mobile, and Claude Code all draw from the same pool** — terminal work and chat work spend the same allowance
- How much you actually get depends on conversation length and complexity, which model you pick, and which features you use, so there is no fixed number of messages
- Claude Code inside IDEs (VS Code, VS Code forks like Cursor, JetBrains) counts against the same allowance

**When you hit a limit you have three options**: wait for the reset, upgrade, or turn on **usage credits** on a paid plan and keep working at standard API rates. This is where the "unlimited" framing needs correcting: a flat fee buys a large allowance, not an infinite one — but you don't get hard-stopped either.

To stay strictly inside your subscription, decline the API credit option when offered; to avoid being asked at all, authenticate with `claude login` using only your subscription.

> ⚠️ **Common trap**: if an `ANTHROPIC_API_KEY` environment variable is set on your system, Claude Code authenticates with that key **instead of your subscription** — so you get billed at API rates while your subscription allowance goes untouched. Paying for Max and still receiving an API bill is usually this.

## API Token Pricing

If you go the API route (bring your own key), or need to call Claude programmatically in CI/CD, pricing is tiered by model. For the current generation:

| Tier | Input / M tokens | Output / M tokens | Context |
|------|------------------|-------------------|---------|
| **Opus tier** (deep reasoning) | $5 | $25 | 1M |
| **Sonnet tier** (everyday driver) | $3 | $15 | 1M |
| **Haiku tier** (lightweight dispatch) | $1 | $5 | 200K |

Check the [official pricing page](https://claude.com/pricing) for exact model IDs and prices — the **relative structure** above (roughly a 5:3:1 input ratio, with output at 5x input) is far more stable than any specific model name.

There is also **fast mode**: the same model served at up to ~2.5x higher output tokens per second, priced at roughly double the standard rate, limited to top-tier models and offered as a research preview. Use it when latency actually matters.

### Discount Mechanisms

| Mechanism | Discount | Notes |
|-----------|----------|-------|
| **Prompt Caching** | **90% off** (0.1x) | Caches repeated prompt prefixes — the effect is dramatic |
| **Batch API** | **50% off** | Asynchronous batch processing for large non-urgent jobs |

Prompt caching is the most overlooked way to save money. If your system prompt or CLAUDE.md is stable, cached input tokens cost a tenth of standard rates. In Claude Code's usage pattern this is essentially automatic.

The catch is that caching is a **prefix match**: change a single byte in the prefix and everything after it is invalidated. Put volatile content (timestamps, per-request IDs) last if you want the hit rate to hold up.

## Model Selection Strategy

Claude Code lets you switch models within a session. The point isn't picking "the best" one — it's picking the one that fits the task in front of you.

### Three-tier model split

| Tier | Where it fits | Share of work |
|------|---------------|---------------|
| **Deep reasoning** (Opus tier) | Complex architecture, cross-system refactors, hard debugging | ~10-15% |
| **Everyday driver** (Sonnet tier) | General development, code review, writing tests | ~80% |
| **Lightweight dispatch** (Haiku tier) | Subagent search, format conversion, simple lookups | ~5-10% |

Opus-tier tokens cost the most, so spend them only where deep thinking genuinely pays; Sonnet tier handles 80%+ of daily work comfortably and is the sensible default; Haiku tier is cheap and fast, ideal for subagents doing the grunt work of gathering information.

**This ratio outlasts any model name.** Each new generation renames things and resets the benchmark numbers, but "a minority of tasks justify the most expensive model, most don't" doesn't change. Rather than memorizing one model's SWE-bench score, build the tiering habit — when the generation turns over you only swap names, not strategy.

One dimension that gets overlooked is **effort / thinking depth**: current models let you dial reasoning investment within a single model. Often "same model, lower effort" beats "drop to a smaller model," because you keep the model's capability ceiling and just ask it to think less.

## Subagent Architecture

Claude Code's subagent architecture is a key design for controlling costs and context length.

### How It Works

When the main session encounters a tedious but well-defined task, it can **dispatch sub-agents** to handle it. Sub-agents work in isolated contexts and return only **summarized results** to the main session.

This brings three benefits:

1. **The main context stays lean** — it won't be bloated by verbose operations like searching and file reading
2. **Lower cost** — sub-agents can be assigned to use the Haiku model (`model:haiku`)
3. **Parallel processing** — multiple sub-agents can execute different tasks simultaneously

### Typical Usage

```
Main Session (Sonnet/Opus)
  ├── Subagent 1 (Haiku) → Search all API endpoints in the codebase
  ├── Subagent 2 (Haiku) → List test file coverage
  └── Subagent 3 (Haiku) → Check dependency versions
  
  ← Three summaries returned to the main session
  → Main session makes architectural decisions based on summaries
```

This pattern is particularly effective for large monorepos. It lets the main session focus on high-value reasoning while delegating the grunt work of information gathering to cheap subagents.

## Cost Optimization: Subscription vs API

The trade-off is simple: **if you use Claude Code seriously every day, a subscription is almost certainly cheaper than pure API**. API pricing only makes sense in two cases — low volume, or programmatic invocation (CI/CD, batch processing, building your own service).

A rough check: multiply your monthly token volume by the Sonnet-tier rate ($3 / $15 per M tokens) and compare against the monthly fee. Any pattern involving several hours of daily use lands well above $200.

Two corrections that the "saved 95%!" comparisons online usually omit:

1. **Subscription quota is not unlimited.** The five-hour window plus weekly cap is a wall you will actually hit, after which you wait, upgrade, or enable usage credits at API rates. So real cost is "monthly fee + whatever spills over," not the monthly fee alone.
2. **How much you save depends on whether you use caching.** An API user with a high cache-hit rate and one with none can differ by an order of magnitude on the same work. Comparing a subscription against a *no-caching* API bill overstates the saving.

Practical advice: start on Pro, watch how often you actually hit the ceiling over a cycle or two (Settings > Usage shows it), then decide whether to move up. Usage is usually far more concentrated in a few days than people expect.

### Additional Cost-Saving Tips

- **Lean on prompt caching**: a stable CLAUDE.md and system prompt cache automatically, cutting input costs by 90%
- **Use the Batch API for non-urgent work**: code scans, bulk file formatting, and similar jobs run at 50% off
- **Assign models correctly**: don't spend Opus tokens on work a Haiku-tier model handles
- **Control context length**: use subagents to keep the main session from bloating

## Claude Code's Unique Advantages

Compared to other agent CLIs, Claude Code has several clear differentiators:

1. **Terminal-native** — no IDE required; SSH into a remote server and it just works. For terminal-first developers this is the most natural workflow.

2. **Depth of reasoning** — on tasks that require understanding complex systems and tracing multi-layer call stacks, the gap between the Opus tier and mid-tier models is visible. That's precisely why tiering pays: reserve that capability for the 10-15% that needs it.

3. **One subscription covers every surface** — web, desktop, mobile, terminal, and IDE share one allowance. No paying separately per surface; the flip side is they also drain the same pool.

4. **Hitting the limit isn't a hard stop** — paid plans can enable usage credits and continue at API rates, which is a real difference when you're against a deadline.

5. **Persistent memory** — cross-session memory lets Claude Code retain your preferences, project conventions, and past decisions. It gets better the longer you use it.

## Ideal Use Cases

Claude Code is particularly well-suited for the following workflows:

- **Complex debugging**: Tracing bugs across multiple files, requiring deep reasoning and extensive context
- **Architecture design**: System design for new features, API design, data model design
- **Multi-file refactoring**: Large-scale renames, pattern migrations, framework upgrades
- **Terminal-first developers**: People who prefer completing everything in the terminal

If your work primarily involves small-scope inline edits within an IDE, Cursor or Copilot may feel more natural. But if you need an agent that understands the entire codebase and executes multi-step tasks, Claude Code is currently the strongest option.

## References

- [Plans & Pricing | Claude by Anthropic](https://claude.com/pricing)
- [Claude Code by Anthropic | AI Coding Agent](https://claude.com/product/claude-code)
- [Use Claude Code with your Pro or Max plan | Claude Help Center](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)
- [Choose a Claude plan | Claude Help Center](https://support.claude.com/en/articles/11049762-choose-a-claude-plan)
- [What is the Max plan? | Claude Help Center](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)

## Changelog

- 2026-08-18: Refreshed against the official pricing and help pages. (1) **Removed every hardcoded model ID and benchmark figure** (the old "Opus 4.6 scores 80.9% on SWE-bench" and "Sonnet 5, codenamed Fennec, 82.1%, Dev Team multi-agent mode" claims), replaced with the Opus/Sonnet/Haiku price tiers — model names have too short a half-life to write down, as the post now explains. (2) Added how quota really works: rolling five-hour window plus weekly caps, one shared pool across all surfaces, and usage credits at API rates when you run out — correcting the original "unlimited tokens" framing. (3) Added the `ANTHROPIC_API_KEY` trap that silently bypasses subscription auth. (4) Removed the "Max saves 95% vs API" table built on a single user anecdote, replacing it with a method and the two common sources of overstatement. (5) References now point to official pages instead of second-hand pricing articles
