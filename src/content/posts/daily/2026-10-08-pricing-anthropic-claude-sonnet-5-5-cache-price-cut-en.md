---
title: "Pricing Watch | Claude Sonnet 5.5's Cache-Hit Price Cut in Half, $0.20 to $0.10"
date: 2026-10-08
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, anthropic]
description: "On 10/7 Anthropic cut Claude Sonnet 5.5's prompt-cache-hit price from $0.20 to $0.10 per 1M tokens, a 50% cut; input, output, and cache-write prices are unchanged"
tldr: "On 2026-10-07, Anthropic cut Claude Sonnet 5.5's cache-read (cache-hit) price from $0.20 to $0.10 per 1M tokens — down from 10% of the input price to 5% — effective the same day. Input ($2), output ($10), and cache writes (5-minute $2.50, 1-hour $4) are unchanged. This is the first real price change for Sonnet 5.5 since its 9/29 launch: at launch Anthropic insisted the headline rates hadn't moved and the savings came entirely from using fewer tokens per task."
series:
  name: "AI Pricing Watch"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-10-08-pricing-anthropic-claude-sonnet-5-5-cache-price-cut)

## Summary

In its official release notes dated 2026-10-07, Anthropic cut Claude Sonnet 5.5's prompt-cache-hit price from $0.20 to $0.10 per 1M tokens, moving the discount ratio from 10% of the input price to 5% — the same ratio Opus 5.5 shipped with two weeks earlier. Input, output, and cache-write prices are all unchanged. This one is worth flagging specifically because Sonnet 5.5's headline rates were identical to its predecessor Sonnet 5 at launch on 9/29 (as this site noted on 9/30); Anthropic credited the "costs up to 30% less" claim entirely to using fewer tokens per task, not to a price cut. This is the model's first genuine rate change since launch, and it targets the exact line item that dominates agent and coding workload bills: repeated long-context reads.

## Before/After

| Item | Old | New | Change | Effective date |
|---|---|---|---|---|
| Sonnet 5.5 Input | $2.00/1M tokens | $2.00/1M tokens | Unchanged | - |
| Sonnet 5.5 Output | $10.00/1M tokens | $10.00/1M tokens | Unchanged | - |
| Sonnet 5.5 Cache Read (cache hit) | $0.20/1M tokens | $0.10/1M tokens | ↓50% | 2026-10-07 |
| Sonnet 5.5 Cache Write (5-minute) | $2.50/1M tokens | $2.50/1M tokens | Unchanged | 2026-10-07 |
| Sonnet 5.5 Cache Write (1-hour) | $4.00/1M tokens | $4.00/1M tokens | Unchanged | 2026-10-07 |

## Cost Simulation

**Scenario**: A coding agent that resends a 100K-token cached codebase context on every request, plus 2,000 fresh input tokens and 800 output tokens per turn, running 500 requests/day.

| | Old pricing | New pricing | Monthly savings |
|---|---|---|---|
| Cache-read cost/month (100K × 500 × 30 days = 1,500M tokens) | $300.00 | $150.00 | $150.00 |
| Fresh input cost/month (2K × 500 × 30 = 30M tokens) | $60.00 | $60.00 | $0 |
| Output cost/month (0.8K × 500 × 30 = 12M tokens) | $120.00 | $120.00 | $0 |
| **Total** | **$480.00/month** | **$330.00/month** | **$150.00 (↓31%)** |

Cache reads went from 62.5% of the bill ($300/$480) to 45% ($150/$330) — confirming what Anthropic itself said when it cut Opus 5.5's cache price: cache reads are the dominant cost line for agent and coding workloads, and cutting that single line moves the total bill more than trimming input or output rates would.

## Impact for Developers and Enterprises

### Who benefits most

Workloads that lean heavily on prompt caching benefit most directly: coding agents that resend an entire codebase or tool definitions on every turn, support bots with long conversation histories, and RAG systems that repeatedly re-read the same retrieved context. These scenarios typically see cache-hit token volume 10-50x higher than fresh input, so halving the cache rate moves the total bill far more than cutting input or output prices would. Single-turn chat or simple Q&A that barely touches the cache sees almost no effect.

### Competitive landscape

Lining up the cache discount ratio (cache-hit price ÷ standard input price) across major models:

| Model | Cache discount | Cache-hit price | Standard input price |
|---|---|---|---|
| DeepSeek deepseek-flash (peak hours) | 98% | $0.006 | $0.30 |
| **Claude Sonnet 5.5 (new)** | **95%** | **$0.10** | **$2.00** |
| Claude Opus 5.5 | 95% | $0.20 | $4.00 |
| GPT-6.1 Sol | 95% | $0.10 | $2.00 |
| Claude Fable 5.1 | 97.5% | $0.25 | $10.00 |
| Google Gemini 3.8 Flash | 90% | $0.075 | $0.75 |
| Grok 4.7 | 75% | $0.50 | $2.00 |

After the cut, Sonnet 5.5's cache discount ratio moves from trailing GPT-6.1 Sol (10% vs. 5%) to matching it. Both models share the same $2 standard input price and now the same $0.10 cache-hit price, so for cache-heavy agents the remaining cost gap between the two comes down almost entirely to output pricing (both $10, a wash) and actual per-task token efficiency — the cache-discount gap is gone.

### Action items

- If your agent resends a large, fixed context (system prompt, tool definitions, codebase snippets) on every turn: you get this cut automatically, no code changes needed — Anthropic adjusted the published rate unilaterally
- If you're choosing between Sonnet 5.5 and GPT-6.1 Sol for a cache-heavy workload: with the cache discount ratio now tied, compare per-task token efficiency at equal output pricing instead of weighing the cache line
- If your workload is short conversations with low cache-hit rates: this cut has limited effect on your bill, no need to change model choice over it
- When re-running your monthly budget, keep cache-read and fresh-input as separate line items — lumping them together understates how much this change actually moves cache-heavy workloads

## Today's Takeaway

Anthropic went out of its way at Sonnet 5.5's late-September launch to say the headline rates hadn't moved and the savings came purely from token efficiency — then cut the cache rate in half less than two weeks later. That pattern — ship on an "efficiency, not a price cut" narrative, watch how the market reacts (especially to competitors like GPT-6.1 Sol with a better cache discount ratio), then follow up with an actual rate cut — looks like it's becoming standard playbook. For anyone tracking pricing, "this isn't a price cut" in a launch announcement may now have a shelf life measured in days, not months.

## References

- [Anthropic Release Notes: 2026-10-07 prompt cache read price cut](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic: official pricing page (Prompt caching pricing)](https://platform.claude.com/docs/en/about-claude/pricing)
- [This site's earlier coverage: Sonnet 5.5 launched at identical rates to Sonnet 5](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing-en)
