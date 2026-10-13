---
title: "Pricing Watch | Claude Sonnet 4 Hits Bedrock EOL Today — Region-Locked Teams Pay 10% More"
date: 2026-10-14
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, anthropic]
description: "Claude Sonnet 4 retired on the Claude API back on 6/15, but Amazon Bedrock only reaches its End-of-Life today (10/14). The recommended replacement, Sonnet 4.6, keeps the same global-endpoint price — but region-locked endpoints now carry a 10% premium Sonnet 4 never had."
tldr: "Claude Sonnet 4 (`anthropic.claude-sonnet-4-20250514-v1:0`) reaches End-of-Life on Amazon Bedrock today, a full 4 months after it retired on Anthropic's own Claude API (2026-06-15). Every call to it now fails outright. The recommended replacement, Claude Sonnet 4.6, costs exactly the same on the default global endpoint ($3 input / $15 output per MTok) — so migrating is free if you're not region-locked. But Sonnet 4.6 belongs to the post-4.5 generation, which carries a 10% premium on region-locked and multi-region endpoints — a line item Sonnet 4 never had. Migrate for compliance reasons and your bill quietly goes up 10%."
series:
  name: "AI Pricing Watch"
  order: 22
---

> 🌏 [中文版](/posts/daily/2026-10-14-pricing-anthropic-claude-sonnet-4-bedrock-eol)

## Summary

The model ID `claude-sonnet-4-20250514` has now died twice. The first time was 2026-06-15, when it retired on Anthropic's own Claude API. The second is today: Amazon Bedrock runs its own lifecycle policy, independent of Anthropic's API schedule, and that policy gave Sonnet 4 four extra months on Bedrock before landing on an End-of-Life date of 2026-10-14. AWS's own Legacy policy is explicit about this — partner platforms (Bedrock, Google Cloud) set their own retirement schedules, not Anthropic's. What actually makes this worth tracking isn't "a model got switched off" — it's that the recommended replacement, Claude Sonnet 4.6, costs exactly the same per token on Bedrock, *unless* your team is on a region-locked endpoint for compliance reasons. In that case, a charge that simply didn't exist for Sonnet 4 now adds 10% to the bill.

## Before / After

| Item | Before (Claude Sonnet 4, Bedrock) | After (Claude Sonnet 4.6, Bedrock — recommended replacement) | Change | Effective |
|---|---|---|---|---|
| Bedrock status | Legacy (since 2026-04-14) → EOL | Active | Removed | 2026-10-14 |
| Context window | 200K tokens | 1M tokens | 5x larger | — |
| Global endpoint — Input | $3.00/1M tokens | $3.00/1M tokens | No change | — |
| Global endpoint — Output | $15.00/1M tokens | $15.00/1M tokens | No change | — |
| Region-locked / multi-region surcharge | N/A (Sonnet 4 predates the global/regional split — no such line item) | +10% premium | New charge | Applies from 2026-10-14, once you migrate |
| Region-locked endpoint — Input (effective) | $3.00/1M tokens | $3.30/1M tokens | ↑10% | Same as above |
| Region-locked endpoint — Output (effective) | $15.00/1M tokens | $16.50/1M tokens | ↑10% | Same as above |

The regional surcharge isn't specific to Sonnet 4.6 — Anthropic's own pricing docs state the 10% premium applies to "Claude Sonnet 4.5 and all later models," while Claude Opus 4.1 and earlier models keep their original pricing structure. Sonnet 4 just happens to predate the rule, so it never had a regional premium option at all. Migrate to any currently-active model and a region-locked endpoint will carry this 10% no matter which one you pick.

## Cost Math

**Scenario**: an agent handling 10,000 customer-support conversations a day (averaging 1,500 input tokens + 500 output tokens each), previously running on Claude Sonnet 4.

| | Before (Sonnet 4, Bedrock) | After (Sonnet 4.6, global endpoint) | After (Sonnet 4.6, region-locked endpoint) |
|---|---|---|---|
| Input cost/month (450M tokens) | $1,350 | $1,350 | $1,485 |
| Output cost/month (150M tokens) | $2,250 | $2,250 | $2,475 |
| **Total** | **$3,600/month** | **$3,600/month (0%)** | **$3,960/month (+10%, +$360)** |

If your deployment has no data-residency requirement and runs on the default global endpoint, this migration is free — you just pick up a 5x larger context window for the same token price. But if you're in finance, healthcare, or any sector required to pin inference traffic to a specific region, the migration itself converts a price you previously had no choice about into a $360/month increase at this usage level.

## Impact for Developers and Teams

### Who benefits, who takes the hit

Teams on the default global endpoint migrate at essentially zero cost and pick up a free 200K → 1M context window upgrade — the clearest winners here. The ones who take a real hit are teams that were already on region-locked endpoints for compliance and hadn't yet moved their traffic off Sonnet 4 — they're not being pushed to migrate by a weaker model, they're being pushed by a hard EOL cutoff with zero grace period to wait for a cheaper pricing window.

### Competitive landscape

This specific event doesn't reshuffle cross-vendor pricing rankings, but it surfaces a hidden-cost pattern worth knowing:

| Platform | Regional pricing |
|---|---|
| Claude API (Anthropic direct) | No regional surcharge; data residency is priced separately under Data Residency Pricing |
| Bedrock / Vertex, pre-Sonnet-4.5 models | No global/regional split; single flat price |
| Bedrock / Vertex, Sonnet 4.5 and later | Global endpoint at list price; region-locked / multi-region endpoints +10% |

If your team is weighing "call Claude API directly" against "call Claude through Bedrock/Vertex," this table is worth a fresh look — if you need region pinning anyway, the Claude API's own data-residency pricing option might beat Bedrock's 10% regional premium outright, so it's worth re-running the comparison.

### Recommendations

- Still calling `anthropic.claude-sonnet-4-20250514-v1:0`? Requests fail outright as of today, with no grace period — confirm production traffic has fully moved to a replacement model.
- On the global endpoint with no compliance constraint: move straight to Claude Sonnet 4.6. Same token price, bigger context window, no reason not to.
- Need a region-locked endpoint for compliance: run the 10% math above first, then decide whether to absorb it or re-evaluate Claude API's data-residency pricing as a cheaper alternative.
- Routing through a third-party gateway (LiteLLM, OpenRouter, etc.) into Bedrock: check whether any fallback rules still point at Sonnet 4 — post-EOL, those fallbacks will throw errors instead of degrading gracefully.

## Time-Sensitive Notice

⚠️ **Sunset date**: 2026-10-14 (today). Claude Sonnet 4 (`anthropic.claude-sonnet-4-20250514-v1:0`) is removed from every AWS region; all requests now fail. Migration guide: [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations).

## Today's Takeaway

Most model retirements this series has logged come with a single timeline and a single cutoff date. Claude Sonnet 4 is a reminder that the same model ID can run on entirely independent lifecycles across platforms — it died on the Claude API in June, on Bedrock in October, and Google Cloud may well run its own separate schedule. The more useful lesson is that "the price didn't change" doesn't mean "the cost didn't change": the per-token rate here is identical, but endpoint type (global vs. regional) is its own independent pricing axis, and an old model doesn't automatically inherit a new policy that was introduced after it launched. Checking a token-price table during a migration isn't enough — you also need to confirm whether the endpoint type you actually use just got pulled into a new pricing rule.

## References

- [Model lifecycle (Legacy) | Amazon Bedrock official docs (source of the EOL date)](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle-legacy.html)
- [Model deprecations | Claude Platform Docs (Claude API retirement timeline)](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Pricing | Claude Platform Docs (model pricing and the cloud-platform regional-premium rule)](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude on Amazon Bedrock (Legacy) | Claude Platform Docs (global vs. regional endpoints)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy)
- [Your AI Stack Has an Expiration Date: Model Sunsets Are the New Patch Tuesday | Security Boulevard](https://securityboulevard.com/2026/10/your-ai-stack-has-an-expiration-date-model-sunsets-are-the-new-patch-tuesday/)
