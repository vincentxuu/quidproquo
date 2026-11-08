---
title: "Pricing Watch | Claude Opus 4.8 Fast Mode Shuts Down Nov 30 — Moving to Opus 5.5 Isn't a Price Hike, It's a 20% Cut"
date: 2026-11-09
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, anthropic]
description: "Anthropic's 2026-10-30 Claude Platform release notes announced that fast mode on Claude Opus 4.8 will be removed on 2026-11-30. The recommended migration target, Claude Opus 5.5 fast mode, charges the same 2x-of-standard rate — but since Opus 5.5's standard rate is lower, the move ends up 20% cheaper"
tldr: "Fast mode on Claude Opus 4.8 (a research preview at $10/$50 per million tokens) is being removed on 2026-11-30. Anthropic's recommended replacement, Claude Opus 5.5 fast mode (now GA, at $8/$40), is cheaper even though both rates are exactly 2x their model's standard price. A 50-turn coding agent session that cost $8.00 on Opus 4.8 fast mode drops to $5.70 on Opus 5.5 fast mode — down 28.75%."
series:
  name: "AI Pricing Watch"
  order: 33
---

> 🌏 [中文版](/posts/daily/2026-11-09-pricing-anthropic-claude-opus-4-8-fast-mode-sunset)

## Summary

On 2026-10-30, Anthropic's [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) added one line: "We've deprecated fast mode for Claude Opus 4.8, with removal on November 30, 2026. After removal, requests to `claude-opus-4-8` with `speed: "fast"` will return an error." The model itself isn't retiring — standard-mode Opus 4.8 is untouched. What's being shut down is only its accelerated-inference layer. Anthropic's recommended migration target is fast mode on Claude Opus 5.5, and the counterintuitive part is this: Opus 4.8 fast mode has spent nearly a year as a research preview that requires the `fast-mode-2026-02-01` beta header to call. Opus 5.5 fast mode is already GA (generally available) — the Start, Build, and Scale usage tiers get a built-in allotment with no beta header required. The feature gets promoted from research preview to full support, and the price drops 20% at the same time — because both models' fast-mode pricing follows the same formula, standard rate × 2, and Opus 5.5's standard rate is already lower than Opus 4.8's.

## Before / After

| Item | Old (Claude Opus 4.8 fast mode, research preview) | New (Claude Opus 5.5 fast mode, GA) | Change | Effective |
|---|---|---|---|---|
| Input | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-11-30 |
| Output | $50.00/1M tokens | $40.00/1M tokens | ↓20% | 2026-11-30 |
| Cache hit (stacks on top of fast-mode rate, per Anthropic's own wording) | $1.00/1M tokens (10% cache multiplier) | $0.40/1M tokens (5% cache multiplier) | ↓60% | 2026-11-30 |
| Access requirement | Needs `fast-mode-2026-02-01` beta header | No beta header; built into usage-tier allotment | Research preview → GA | Opus 4.8 fast mode unusable from 2026-11-30 |

(For reference: the two models' standard rates — no fast mode — are $5.00/$25.00 for Claude Opus 4.8 and $4.00/$20.00 for Claude Opus 5.5. Fast mode on both is exactly 2x the standard rate.)

Fast mode doesn't work with the Batch API and can't stack with a Priority Tier commitment; what you get in exchange is up to 2.5x higher output tokens per second (time-to-first-token is unaffected). If a caller leaning on `speed: "fast"` for latency-sensitive work — in-IDE completions, streaming voice/agent flows — doesn't migrate in time, every request after 2026-11-30 won't just slow down, it will fail outright.

## Cost Math

**Scenario**: continuing Data Studios' benchmark workload from this week — a 50-turn coding agent session, with 40,000 input tokens per turn (35,000 of them cache hits) plus 1,500 output tokens per turn.

| | Opus 4.8 fast mode (shutting down 11/30) | Opus 5.5 fast mode (migration target) | Opus 5.5 standard mode (no fast mode, for reference) |
|---|---|---|---|
| Per session | $8.00 | $5.70 (↓28.75%) | $2.85 (↓64.4%, but gives up fast mode's up-to-2.5x output speed) |
| 1,000 sessions/month | $8,000.00 | $5,700.00 (↓28.75%) | $2,850.00 (↓64.4%) |

The math: the 5,000 uncached input tokens per turn bill at the fast-mode base rate, the 35,000 cached tokens bill at cache-multiplier × fast-mode base rate, and the 1,500 output tokens bill at the fast-mode output rate, summed across 50 turns. A team that does nothing but get forced off Opus 4.8 fast mode already sees its bill drop nearly 30%.

## Impact on Developers/Enterprises

### Who benefits most

Teams running fast mode for interactive coding agents — in-IDE live suggestions, long streaming conversations — benefit most, since this migration stacks two wins at once: a 20% lower unit price, and a promotion from research preview to full GA support with built-in usage-tier allotment, which is a more stable footing than staying on Opus 4.8's research-preview status.

### Competitive landscape

Pull the "accelerated inference layer" out on its own and every vendor is running the same formula — standard rate × a fixed multiplier — just with different multipliers and different standard rates underneath:

| Model / tier | Standard rate (Input/Output) | Accelerated-tier rate (Input/Output) | Multiplier |
|---|---|---|---|
| GPT-6.1 Sol (OpenAI Fast, formerly Priority) | $2.00/$10.00 | $4.00/$20.00 | 2x |
| **Claude Opus 5.5 fast mode** | **$4.00/$20.00** | **$8.00/$40.00** | **2x** |
| Claude Opus 4.8 fast mode (shutting down) | $5.00/$25.00 | $10.00/$50.00 | 2x |
| GPT-6 Astra (OpenAI Fast, formerly Priority) | $10.00/$50.00 | $20.00/$100.00 | 2x |

OpenAI simply renamed its old Priority processing tier to Fast mode on 2026-07-30, and it's also 2x standard. The two vendors' accelerated-tier pricing mechanics are nearly identical, which means Anthropic's "price cut" here isn't a renegotiated multiplier on the accelerated tier — it's the same multiplier applied to a cheaper model generation. Riding the model generation forward beats trying to negotiate a discount on the accelerated tier itself.

### Action items

- If you're calling `claude-opus-4-8` with `speed: "fast"`: migrate before 2026-11-30 — past that date requests simply fail, they don't degrade. Migrating also cuts your unit price 20%, so there's no reason to wait until the last day
- If you're still carrying the `fast-mode-2026-02-01` beta-header plumbing: you can drop that code entirely once you're on Opus 5.5 — GA features don't need it
- If your agent session has a high cache-hit rate (87.5% in the scenario above): pay more attention to the cache-multiplier change (10% → 5%) than to the base-rate change (20%) — for high-cache-hit workloads, the cache-side savings (60%) outweigh the base-rate savings
- If you never used fast mode and only run standard mode: this change doesn't affect you — the standard rates for Opus 4.8 and Opus 5.5 haven't moved

## Time-Sensitive Notice

⚠️ **Shutdown date**: 2026-11-30. Fast mode on Claude Opus 4.8 is removed on this date; `speed: "fast"` requests will return an error afterward. Migration guide: [Migrating to Claude Opus 5.5 from Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide#migrating-from-claude-opus-4-8).

## Today's Takeaway

This shutdown notice made something clear: Anthropic's fast mode has never been an independently priced acceleration service — it's a derived rate, standard price × a fixed 2x, and OpenAI's Fast mode (formerly Priority) runs the same logic. That means tracking the accelerated tier's price moves isn't about checking whether the accelerated tier itself got a discount — it's about checking which model generation it's riding on. When the model generation moves forward and the standard rate drops, the accelerated-tier bill drops automatically, with no separate "we cut accelerated-tier pricing" announcement needed. This echoes what we noticed in our 11/4 report on the Gemini 2.5 Pro reroute — a shutdown notice that, again, didn't turn into a price hike. But the mechanism is different: that case was Google routing traffic to a cheaper new model; this one is the same pricing formula stacked on top of a cheaper new model. Both paths lead to "shutdown = cheaper," but that's not something to assume holds for every sunset notice — each one still needs its own check.

## References

- [Anthropic: Claude Platform release notes (official 2026-10-30 entry announcing the Opus 4.8 fast-mode shutdown and the 2026-11-30 removal date)](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic: Fast mode (official feature page, with the Opus 5.5/Opus 4.8 fast-mode rate table and shutdown warning)](https://platform.claude.com/docs/en/build-with-claude/fast-mode)
- [Anthropic: Model pricing (official pricing page, Claude Opus 5.5/Opus 4.8 standard rates and cache multipliers)](https://platform.claude.com/docs/en/about-claude/pricing)
- [Anthropic: Model deprecations (official model lifecycle page)](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Data Studios: AI API pricing this week — GPT-6 Cyber, Gemini Omni 1.2 Flash, Opus 4.8 fast mode (2026-11-06 report, confirming the session cost-math baseline and cross-checking the figures)](https://www.datastudios.org/post/ai-api-pricing-this-week-gpt-6-cyber-gemini-omni-1-2-flash-opus-4-8-fast-mode)
- [CostGoat: OpenAI ChatGPT API Pricing Calculator (confirms OpenAI's Fast mode = 2x Standard)](https://costgoat.com/pricing/openai-api)
- [This series, 11/4: Gemini 2.5 Pro/Flash finally get a Developer API shutdown date](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset-en)
