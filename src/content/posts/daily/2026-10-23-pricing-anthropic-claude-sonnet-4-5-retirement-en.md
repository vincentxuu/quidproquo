---
title: "Pricing Watch | Claude Sonnet 4.5 Retires Nov 30 — Its Replacement Is 33% Cheaper on Paper, Less in Practice"
date: 2026-10-23
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, anthropic]
description: "Anthropic retires Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) on 2026-11-30 and points developers to Claude Sonnet 5.5, priced 33% lower — but a new tokenizer eats most of that saving."
tldr: "Claude Sonnet 4.5 stops responding on the Claude API, Claude Platform on AWS, and Microsoft Foundry on 2026-11-30, with no grace period. The recommended replacement, Claude Sonnet 5.5, is 33% cheaper per token (input $3→$2, output $15→$10 per 1M tokens), but its new tokenizer produces about 30% more tokens for the same text — so the real bill usually drops 10-15%, not the sticker-price 33%."
series:
  name: "AI Pricing Watch"
  order: 27
---

> 🌏 [中文版](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement)

## What Changed

Anthropic announced it on 2026-09-30 and the clock runs out on 2026-11-30: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) retires from the Claude API, Claude Platform on AWS, and Microsoft Foundry, with no grace period after that date — requests just start failing. The named replacement, Claude Sonnet 5.5, costs 33% less per token (input $3→$2, output $15→$10 per 1M tokens), which reads like a forced migration that happens to pay for itself. It doesn't quite. Sonnet 5.5's new tokenizer produces roughly 30% more tokens for the same text, so the sticker-price discount and the discount that actually shows up on your invoice are two different numbers — the mirror image of what happened when Sonnet 5.5 launched on 09-30 and kept its list price flat while claiming a cost cut from using fewer tokens per task.

## Price Comparison

| Item | Old (Sonnet 4.5) | New (Sonnet 5.5) | Change | Retirement date |
|---|---|---|---|---|
| Input | $3.00/1M tokens | $2.00/1M tokens | ↓33% | 2026-11-30 |
| Output | $15.00/1M tokens | $10.00/1M tokens | ↓33% | 2026-11-30 |
| Cache read | $0.30/1M tokens | $0.10/1M tokens | ↓67% | 2026-11-30 |
| Cache write (1h) | $6.00/1M tokens | $4.00/1M tokens | ↓33% | 2026-11-30 |
| Batch input | $1.50/1M tokens | $1.00/1M tokens | ↓33% | 2026-11-30 |
| Batch output | $7.50/1M tokens | $5.00/1M tokens | ↓33% | 2026-11-30 |

## Cost Math

**Scenario**: A support agent handling 10,000 conversations a day (1,500 input + 500 output tokens each), still running on `claude-sonnet-4-5-20250929` and facing the Nov 30 deadline. That's roughly 450M input tokens and 150M output tokens a month.

Anthropic's migration guide flags that Sonnet 5.5's tokenizer generates about 30% more tokens for the same text, so the table below applies that offset instead of taking the list-price cut at face value:

| | Old price (Sonnet 4.5) | New price (Sonnet 5.5, token increase included) | Monthly saving |
|---|---|---|---|
| Input cost/month | $1,350 | $1,170 | $180 |
| Output cost/month | $2,250 | $1,950 | $300 |
| **Total** | **$3,600/month** | **$3,120/month** | **$480 (↓13.3%)** |

Assume token counts stay flat instead — the naive read of the list price — and the same scenario saves $1,200 (↓33.3%). That gap is exactly why budgeting off the "input down 33%, output down 33%" headline tends to disappoint once the real invoice lands.

## Impact on Developers and Businesses

### Who benefits most

Every team still calling Sonnet 4.5 has to make a call before Nov 30, and agent workloads with a high share of output tokens benefit the most directly — output pricing drops the same 33% as input, and output usually dominates an agent's total spend. But forced migration isn't automatically a savings event: if your workload leans on assistant prefills, fixed `temperature`, or thinking-budget settings, the engineering cost of migrating can show up before the savings do.

### Competitive landscape

Current standing-tier pricing across the major models (input/output, USD per 1M tokens, standard short-context rate):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | Cheapest capable model (see [09-28 Pricing Watch](/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut)) |
| Claude Haiku 4.5 | $1.00 | $5.00 | Anthropic's cheapest general-purpose model |
| GPT-6 Sol | $2.00 | $10.00 | — |
| **Claude Sonnet 5.5 (recommended replacement)** | **$2.00** | **$10.00** | Matches GPT-6 Sol exactly, 33% below the retiring Sonnet 4.5 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | Same price and tokenizer as Sonnet 4.5 — a stopgap, not Anthropic's recommended long-term pick |
| Claude Sonnet 4.5 (retiring) | $3.00 | $15.00 | API calls fail outright starting 2026-11-30 |
| Claude Opus 5.5 | $4.00 | $20.00 | — |

Sonnet 5.5's landing spot sits exactly on top of GPT-6 Sol's $2/$10 tier — this retirement doubles as a price play against OpenAI, pushing every migrating Sonnet 4.5 customer into a direct comparison with Sol.

### What to do

- Still calling `claude-sonnet-4-5-20250929` or the `claude-sonnet-4-5` alias? Schedule the migration now — after Nov 30, requests fail outright with no grace period.
- Before you migrate, measure your actual prompts with Anthropic's token-counting endpoint instead of assuming the 33% list-price cut. The new tokenizer adds roughly 30% more tokens for the same text, so a conservative estimate puts the real saving at 10-15%.
- Swapping the model ID alone isn't enough: Sonnet 5.5 returns 400 errors for assistant prefills, `thinking`'s `budget_tokens`, `temperature`/`top_p`/`top_k`, and forced tool use. Work through the rest of the migration guide's checklist before shipping.
- Need to avoid breakage without rewriting code right away? Claude Sonnet 4.6 is a same-price, same-tokenizer stopgap — but it isn't Anthropic's recommended long-term replacement, and its own retirement is only set "not sooner than 2027-02-17," which just defers the real migration rather than solving it.
- On Amazon Bedrock or Google Cloud: the Nov 30 deadline only covers Anthropic's own platforms (Claude API, Claude Platform on AWS, Microsoft Foundry). Bedrock and Vertex AI set their own schedules — check each provider's model table rather than assuming they line up with Nov 30.

## Time-Sensitive Notice

⚠️ **Retirement date**: 2026-11-30. `claude-sonnet-4-5-20250929` (and its alias `claude-sonnet-4-5`) stops responding on the Claude API, Claude Platform on AWS, and Microsoft Foundry, with no grace period. Amazon Bedrock and Google Cloud run their own schedules — check their model tables separately. Migration guide: [Claude Sonnet 5.5 Migration Guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide).

## Takeaway

A model-retirement notice usually gets filed under "ops to-do," which makes it easy to miss that it's also a pricing event. Here the replacement's list price drops 33%, which reads as pure good news — until the tokenizer change eats a big chunk of that discount, leaving the real invoice reduction at roughly a third to a half of the headline number. It's the flip side of what happened when [Sonnet 5.5 launched on 09-30](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing) holding its list price flat while claiming a cost cut from fewer tokens per task: the same lesson about list price versus actual token usage, showing up from the opposite direction twice in a row.

## References

- [Claude Platform Docs: Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Claude Platform Docs: Model pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [AionX: Claude Sonnet 4.5 Retirement: Migrate by Nov 30](https://aionx.co/claude-ai-reviews/claude-sonnet-4-5-retirement/)
