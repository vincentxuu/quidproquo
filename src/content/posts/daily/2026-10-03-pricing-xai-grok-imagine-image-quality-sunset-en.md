---
title: "Pricing Watch: xAI Retires grok-imagine-image-quality, Silently Redirects to 2.0 on Nov 2"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, pricing, daily, xai]
lang: en
description: "xAI will retire grok-imagine-image-quality on 2026-11-02. Every request gets auto-redirected to the cheaper grok-imagine-image-2.0 (quality: low) — no code change needed, but the default quality is locked to the lowest tier"
tldr: "xAI's grok-imagine-image-quality retires on 2026-11-02 (60-day notice given 9/2). After that date, every request is silently redirected to grok-imagine-image-2.0 with quality forced to low, dropping the price from $0.05 to $0.04 per image (↓20%). The catch: grok-imagine-image-2.0 itself doesn't price by quality tier — anyone who migrates proactively and explicitly sets quality: medium gets better output at the exact same price, while anyone who just waits for the redirect gets stuck on the lowest tier."
series:
  name: "AI Pricing Watch"
  order: 15
---

> 🌏 [中文版](/posts/daily/2026-10-03-pricing-xai-grok-imagine-image-quality-sunset)

## What changed

xAI gave 60 days' notice on 9/2 that `grok-imagine-image-quality` retires on 2026-11-02. The model slug keeps working, but every request gets silently rerouted to `grok-imagine-image-2.0` with `quality: "low"` forced on. Looked at purely as a price change, this is a cut — $0.05 down to $0.04 per image. The part worth paying attention to is the pricing structure itself: `grok-imagine-image-2.0` doesn't charge differently by quality tier at all — `low` and `medium` are both $0.04/image. So anyone who passively waits for the auto-redirect gets "cheaper, but permanently locked to the lowest quality setting," while anyone who migrates proactively before 11/2 and explicitly requests `quality: "medium"` gets "cheaper and better quality" — same API change, two very different outcomes depending on how you migrate.

## Before / after

| Item | Before | After | Change | Effective |
|---|---|---|---|---|
| Model slug | `grok-imagine-image-quality` | `grok-imagine-image-2.0` (quality: low, auto-redirected) | Slug kept, underlying model swapped | 2026-11-02 |
| Price per image | $0.05/image | $0.04/image | ↓20% | 2026-11-02 |
| Quality tiers available | None (single quality) | `low` / `medium` / `auto`, all priced at $0.04/image | New option, same price across tiers | Available from 2026-11-02 |
| Source images per edit request | Not supported | Up to 5 | New capability | Available from 2026-11-02 |
| New aspect ratios | 21:9 / 5:2 not supported | 21:9 / 5:2 supported | New capability | Available from 2026-11-02 |

## Cost math

**Scenario**: A team generating 1,000 marketing images/day through `grok-imagine-image-quality`, with no code changes, letting the request get passively redirected after 11/2.

| | Old price (October) | New price (November, post-redirect) | Monthly savings |
|---|---|---|---|
| Daily cost | $50 | $40 | $10 |
| **Monthly cost (×30 days)** | **$1,500** | **$1,200** | **$300 (↓20%)** |

That $300/month "savings" is bought with quality — the redirect defaults to `low`, the most basic of 2.0's three quality tiers. If the team instead migrates proactively and hardcodes `quality: "medium"`, the monthly cost is still $1,200, but they get the version where 2.0 spends more compute refining detail — at no extra cost. Waiting for the passive redirect means leaving that free quality upgrade on the table.

## Impact on developers and teams

### Who benefits most

Teams that migrate proactively before 11/2 and actually read the migration guide get the full package: lower price, quality control, multi-image editing, and the new aspect ratios. Teams that just leave the old slug alone only get the price cut — they miss the other three benefits and lose control over output quality.

### Competitive landscape

Retiring an old model slug and silently redirecting to a new one isn't new — OpenAI did something similar with a model retirement back in August — but xAI's version has a detail worth flagging: the old and new models here aren't a straightforward upgrade. Instead, the same price point gets split into multiple quality tiers, and the default was deliberately set to the lowest one. Compared to a straight price hike or cut, this "same price, different quality, lowest tier by default" pattern is a quieter way to reduce service quality without most users noticing.

### What to do

- If your code still hardcodes `grok-imagine-image-quality`: switch to `grok-imagine-image-2.0` before 11/2 and explicitly pass a `quality` value — don't let `auto` or the redirect decide for you.
- If output quality matters for your use case (marketing assets, client deliverables): set `quality: "medium"` explicitly. It costs the same $0.04/image as `low`, so there's no reason to let the default lock you into the bottom tier.
- If you're on `grok-imagine-image-pro`: it already redirects to `grok-imagine-image-quality`, which will redirect again to 2.0 on 11/2. Migrate straight to 2.0 now instead of stacking two redirects.
- The migration is a one-line change — swap the `model` field to `grok-imagine-image-2.0`. There's no reason to wait for the automatic redirect.

## Deadline reminder

⚠️ **Retirement date**: 2026-11-02. `grok-imagine-image-quality` will still accept requests after this date but gets silently redirected to `grok-imagine-image-2.0` (quality: low). Migration guide: [grok-imagine-image-quality Retirement on November 2, 2026](https://docs.x.ai/developers/migration/imagine-image-quality-nov-2).

## Takeaway

Most pricing trackers only ask "did it get more expensive or cheaper." This change is a reminder of something quieter: an auto-redirect in a retirement notice isn't the same thing as a painless upgrade — the vendor controls what the redirect defaults to, and that default isn't necessarily what's best for the user. Same new model, same price, but the team that migrates on purpose and the team that just waits can end up with meaningfully different output quality. When you see a "retiring and auto-redirecting" notice, the question isn't just "how much did the price change" — it's "what did the redirect default to, and is that default actually a good deal for me."

## References

- [xAI: grok-imagine-image-quality Retirement on November 2, 2026](https://docs.x.ai/developers/migration/imagine-image-quality-nov-2)
- [xAI: API Pricing](https://docs.x.ai/developers/pricing)
- [AI Pricing Guru: Grok Imagine Image Quality Retirement: Cost Impact](https://www.aipricing.guru/news/grok-imagine-image-quality-retirement-cost-impact)
