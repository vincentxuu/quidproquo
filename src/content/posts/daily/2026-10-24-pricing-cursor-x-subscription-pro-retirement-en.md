---
title: "Pricing Watch: Cursor's $20 Pro Plan Retires Into The X Subscription"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, pricing, daily, cursor]
lang: en
description: "Cursor replaced its new-signup pricing with xAI's shared X Subscription on 2026-10-12. The $20 Pro plan is gone for new users, the floor to reach Claude/GPT/Gemini moves to Premium at $30, and the $8 Plus tier excludes third-party models entirely."
tldr: "Cursor switched new-signup pricing to The X Subscription on 10/12: Free, Plus $8 (Grok only), Premium $30, Super $100, Ultra $200. The old $20 Pro plan is grandfathered for existing subscribers only. New users who want Claude/GPT/Gemini now need Premium at $30 (up 50% from Pro's $20); third-party model token rates are unchanged, still billed separately at API list price."
series:
  name: "AI Pricing Watch"
  order: 28
---

> 🌏 [中文版](/posts/daily/2026-10-24-pricing-cursor-x-subscription-pro-retirement)

## Summary

On October 12, 2026, Cursor swapped out its entire new-signup price list: the $20/month Pro plan disappeared from the signup flow, replaced by five tiers shared with xAI's Grok — The X Subscription (Free, Plus $8, Premium $30, Super $100, Ultra $200). This isn't just a price hike. It folds a developer-tool subscription into a consumer social-platform subscription stack. Two months after SpaceX completed its acquisition of Cursor, new users who want to touch Claude, GPT, or Gemini inside the editor now face a floor of $30 instead of $20, and the cheapest $8 tier excludes every third-party model outright — Grok only. Existing subscribers keep their Hobby/Pro/Pro+/Teams plans, but unless they switch, what they see as "Cursor pricing" is now a completely different system from what new users see.

## Before and After

| Item | Before (pre-10/12 Pro, grandfathered only) | After (Premium, The X Subscription) | Change | Effective |
|---|---|---|---|---|
| Monthly price | $20/month | $30/month | ↑50% | 2026-10-12 |
| Floor to reach Claude/GPT/Gemini | $20/month (included in Pro) | $30/month (Premium; the $8 Plus tier can't touch them at all) | One tier higher | 2026-10-12 |
| Third-party model usage pool | Counted against an "Other Models" pool | Not counted against any pool — must be purchased separately per the pricing page | Pool no longer covers third-party models | 2026-10-12 |
| Cloud agents / Bugbot / Origin code hosting | Included in Pro | Requires Premium | Same features, higher entry price | 2026-10-12 |
| Teams seat price | Standard $40 / Premium $120 per seat/month | Premium/Super/Ultra seats at the same price as individual plans, from $30 | Lower in most cases | 2026-10-12 |

## Cost Math

**Scenario**: a developer who codes daily in Cursor with Claude Sonnet 5.5, running roughly 20M input + 8M output tokens a month through Cursor (Claude Sonnet 5.5's rate in Cursor is $2.00/1M input and $10.00/1M output regardless of subscription tier).

| | Old (Pro $20 + Claude usage) | New (Premium $30 + Claude usage) | Monthly increase |
|---|---|---|---|
| Subscription | $20 | $30 | $10 |
| Claude Sonnet 5.5 usage | $120 | $120 | $0 |
| **Total** | **$140/month** | **$150/month** | **$10 (↑7.1%)** |

For a developer already using Claude heavily, the increase is only about 7% — third-party models were always billed pass-through at API list price, and that rate hasn't changed. What actually got repriced is the *eligibility floor*: $20 used to be enough to use Claude at all under Pro; now reaching any non-Grok model starts at $30, and the cheapest $8 tier removes Claude/GPT/Gemini access entirely. Light users who previously stayed near $20 and used Claude only occasionally will feel a sharper increase than this table shows.

## Impact on Developers and Teams

### Who benefits most

Users who already code with Grok and also want X Premium+'s social features come out ahead — xAI's own framing is that Premium's $30 bundles what used to be $90/month across SuperGrok, Cursor Pro, and X Premium+. But that persona is different from the typical Cursor user who just wants a good AI coding agent, and it's the former group this repricing actually benefits.

### Competitive landscape

Entry-level pricing floors across major AI coding agent subscriptions (USD/month):

| Tool | Entry paid tier | What's included |
|---|---|---|
| Cursor Plus | $8 | Grok models only, no third-party models |
| Cursor Premium | $30 | Grok + third-party models (billed at API list price) + cloud agents + Bugbot |
| Claude Code (Max 5x) | $100 | Claude model usage, includes Claude Code |
| Claude Code (Max 20x) | $200 | Claude model usage, includes Claude Code |

Cursor's Super ($100) and Ultra ($200) land right on Claude Max's two price points, but what they buy is more Grok usage headroom, not Claude usage. Getting genuinely all-in heavy model usage still requires a large subscription on either side — the paths just differ.

### Recommendations

- New users who want Claude or GPT in Cursor: budget for Premium at $30 from the start. Don't be lured by the $8 Plus tier — it can't reach third-party models at any price.
- Existing Pro ($20) subscribers: no action needed for now, the old plan is still grandfathered. But watch for Cursor's help center and pricing page diverging — new features may land on the new tiers first.
- Teams on the old seat structure: re-run the seat math. The new Teams seats match individual pricing (from $30), which Cursor says is cheaper than the old $40/$120 structure, but factor in the Cursor Token Rate — an extra $0.25 per million tokens on third-party model requests.
- Developers who mostly use Claude/GPT and rarely touch Grok: this change just costs you $10/month more in subscription fees — token rates are unchanged. No need to switch tools urgently, but it's worth re-comparing a direct Claude Code subscription for simplicity.

## Timing Note

⚠️ **Plan change**: since 2026-10-12, new users can only sign up for one of the five X Subscription tiers. The old Hobby/Pro/Pro+/Teams plans remain available to existing subscribers only, with no announced end date — assume it could be withdrawn at any time.

## Today's Takeaway

The detail easiest to miss in this repricing isn't how much the price went up — it's that *eligibility itself* got redefined. Using Claude or GPT in Cursor used to be a matter of "pay a bit more in API fees." Now it's "pay $30 to even qualify, then talk about API fees." The $8 Plus tier isn't a price increase — it's an entire tier of demand deleted from the menu. Tracking AI tool pricing tends to focus on the numbers that changed, but who's allowed to use something at all is sometimes the more durable fact to record.

## References

- [Cursor Pricing (official pricing page)](https://cursor.com/pricing)
- [Cursor Pricing 2026: X Subscription Tiers and Usage Limits | Fello AI](https://felloai.com/cursor-pricing/)
- [Cursor Pricing 2026: The $20 Pro Plan Is Gone | DevTools Review](https://devtoolsreview.com/pricing/cursor-pricing/)
