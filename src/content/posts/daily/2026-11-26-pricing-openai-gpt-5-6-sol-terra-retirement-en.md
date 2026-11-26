---
title: "Pricing Watch: OpenAI Retires GPT-5.6 Sol/Terra on Dec 23, Codex Users Cut Costs in Half by Moving to GPT-6.2 Sol"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: en
description: "OpenAI's official ChatGPT X account announced that GPT-5.6 Sol will be retired from ChatGPT Chat/Work/Codex on 2026-12-23, with GPT-5.6 Terra leaving Work/Codex the same day — but the official API deprecations page hasn't listed either model ID yet"
tldr: "OpenAI's ChatGPT account announced GPT-5.6 Sol and Terra will be retired from Chat/Work/Codex on 2026-12-23, pointing users to the Nov 17 GPT-6.2 Sol release as the replacement — same spec, half the price ($4/$20 to $2/$10 per 1M tokens). Terra has no named replacement, and the official API deprecations page still doesn't list either model ID."
series:
  name: "AI Pricing Watch"
  order: 41
---

> :globe: [中文版](/posts/daily/2026-11-26-pricing-openai-gpt-5-6-sol-terra-retirement)

## Summary

OpenAI's official ChatGPT account on X posted a casually worded but substantively heavy announcement on 11/23: "Every model has its day in the sun. For GPT-5.6, it's time to set. On December 23, we're deprecating GPT-5.6 Sol in Chat, and GPT-5.6 Sol and Terra in Work and Codex." The same post bundled two things together: GPT-6.2 Sol expanding to the ChatGPT Chat tab (previously only in Work and Codex since its 11/17 launch), and a hard retirement date for two GPT-5.6-generation models. Checking the official pricing page shows GPT-6.2 Sol's list price ($2/$10 per 1M tokens) is exactly half of GPT-5.6 Sol's current promotional price ($4/$20) — so the retirement notice doubles as a price-cut notice, but only for Sol. Terra got no named successor at all. More notably, this retirement date only appears in the product-side announcement; a check of [OpenAI's official API deprecations page](https://developers.openai.com/api/docs/deprecations) shows `gpt-5.6-sol` and `gpt-5.6-terra` aren't listed there yet — if you call these models directly through the API rather than through the ChatGPT interface, there's no official documentation confirming whether this announcement even applies to you.

```diagram
title: GPT-5.6 Sol/Terra retirement timeline
desc: GPT-6.2 Sol launched in Work/Codex on 11/17, expanded to Chat on 11/23 with the Dec 23 retirement of GPT-5.6 Sol/Terra announced the same day; 11/30 was GPT-5.6 Sol's original promo-price expiry, falling between the announcement and the retirement.
caption: Dates are in 2026. Scale roughly 1 day ≈ 14.17px, starting from 11/17 (x=90).
step: 11/17 GPT-6.2 Sol launches in Work/Codex
step: 11/23 GPT-6.2 Sol expands to Chat; Dec 23 retirement of GPT-5.6 Sol/Terra announced same day
step: 11/30 GPT-5.6 Sol's original promo-price expiry (no post-promo price announced)
step: 12/23 GPT-5.6 Sol/Terra fully retired (Chat/Work/Codex)
---
<svg viewBox="0 0 700 320">
  <path class="dg-axis" d="M90 170H600"/>

  <rect class="dg-band" x="175" y="286" width="425" height="24"/>
  <text class="dg-small" x="387" y="298" text-anchor="middle" dominant-baseline="central">30-day notice window</text>

  <g data-step="1">
    <line class="dg-rule" x1="90" y1="122" x2="90" y2="164"/>
    <circle class="dg-dot" cx="90" cy="170" r="4"/>
    <text class="dg-label" x="90" y="86" text-anchor="middle" dominant-baseline="central">GPT-6.2 Sol launches</text>
    <text class="dg-sub" x="90" y="108" text-anchor="middle" dominant-baseline="central">11/17 · Work/Codex</text>
  </g>
  <g data-step="2">
    <line class="dg-rule" x1="175" y1="176" x2="175" y2="218"/>
    <circle class="dg-dot dg-dot--accent" cx="175" cy="170" r="6"/>
    <text class="dg-label dg-text--accent" x="175" y="232" text-anchor="middle" dominant-baseline="central">Expands to Chat</text>
    <text class="dg-sub" x="175" y="254" text-anchor="middle" dominant-baseline="central">11/23 · Dec 23 retirement announced</text>
  </g>
  <g data-step="3">
    <line class="dg-rule" x1="274" y1="122" x2="274" y2="164"/>
    <circle class="dg-dot" cx="274" cy="170" r="4"/>
    <text class="dg-label" x="274" y="86" text-anchor="middle" dominant-baseline="central">Sol promo price expires</text>
    <text class="dg-sub" x="274" y="108" text-anchor="middle" dominant-baseline="central">11/30 · No new price announced</text>
  </g>
  <g data-step="4">
    <line class="dg-rule" x1="600" y1="176" x2="600" y2="218"/>
    <circle class="dg-dot dg-dot--accent" cx="600" cy="170" r="6"/>
    <text class="dg-label dg-text--accent" x="600" y="232" text-anchor="middle" dominant-baseline="central">Fully retired</text>
    <text class="dg-sub" x="600" y="254" text-anchor="middle" dominant-baseline="central">12/23 · Chat/Work/Codex</text>
  </g>
</svg>
```

## Before / After

| Item | Before (through 12/23) | After (recommended migration target) | Change | Effective date |
|---|---|---|---|---|
| GPT-5.6 Sol Input | $4.00/1M tokens (promo) | GPT-6.2 Sol: $2.00/1M tokens | ↓50% | 2026-12-23 |
| GPT-5.6 Sol Output | $20.00/1M tokens (promo) | GPT-6.2 Sol: $10.00/1M tokens | ↓50% | 2026-12-23 |
| GPT-5.6 Sol Cached Input | $0.40/1M tokens | GPT-6.2 Sol: $0.10/1M tokens | ↓75% | 2026-12-23 |
| GPT-5.6 Terra Input | $2.00/1M tokens | No replacement named | — | 2026-12-23 |
| GPT-5.6 Terra Output | $12.00/1M tokens | No replacement named | — | 2026-12-23 |

The official [API Pricing page](https://developers.openai.com/api/docs/pricing) carries a footnote under the `gpt-5.6-sol` row: "GPT-5.6 Sol's promotional pricing is available until November 30, 2026." We flagged this same expiry date in our [11/15 report](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes), where OpenAI gave only the expiry date without a post-promo price. The retirement date (12/23) now overtakes that open question: in the 23 days after the promo expires, OpenAI may simply never publish a new standard price, because the model is about to disappear anyway.

## Cost Projection

**Scenario**: A team running GPT-5.6 Sol through Codex for code generation and review, 2,000 requests/day (averaging 3,000 input tokens + 1,000 output tokens per request), over 30 days.

| | GPT-5.6 Sol (current promo price) | GPT-6.2 Sol (after migration) | Monthly savings |
|---|---|---|---|
| Input cost/month (180M tokens) | $720.00 | $360.00 | $360.00 |
| Output cost/month (60M tokens) | $1,200.00 | $600.00 | $600.00 |
| **Total** | **$1,920.00/month** | **$960.00/month** | **$960.00 (↓50%)** |

This projection deliberately uses the promo price as the baseline rather than a hypothetical "standard price," because OpenAI has never published what GPT-5.6 Sol's standard rate would be. In other words, regardless of whether GPT-5.6 Sol would have jumped to a higher price for a brief window after 11/30 before retiring, switching the model string to `gpt-6.2-sol` now is a guaranteed 50% saving — no need to wait for an uncertain interim price announcement.

## Impact on Developers and Enterprises

### Who benefits most

Teams running production workloads on GPT-5.6 Sol through Codex or ChatGPT Work benefit most directly — this is a case where OpenAI proactively bundled retirement with a price cut, unlike the GPT-5/o3 shutdown we covered on 11/16, where the mini tier's "replacement" model actually cost 150%-300% more. As long as you can absorb the migration-testing cost, there's no "upgrade means price hike" trap at the Sol tier this time.

### Competitive landscape

Price ranking for mid-tier models after migration (input / output, USD per 1M tokens):

| Model | Input | Output | Notes |
|---|---|---|---|
| GPT-6.1 Terra | $1.00 | $5.00 | Current Terra tier; not the model named as Terra's replacement |
| **GPT-6.2 Sol (after migration)** | **$2.00** | **$10.00** | Recommended replacement for GPT-5.6 Sol, same price as Claude Sonnet 5.5 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |
| GPT-5.6 Terra (current, retiring) | $2.00 | $12.00 | Input matches the Sol tier, output falls between Sol and Terra, with no clean match |

The awkward part of this table is exactly where GPT-5.6 Terra lands after retirement — its input price sits at Sol's level, while its output price is cheaper than Sol but pricier than Terra, fitting neither cleanly. That may be why OpenAI didn't name a direct replacement this time: neither GPT-6.1 Terra nor GPT-6 Luna lines up perfectly with Terra's current positioning.

### Recommendations

- If you're running GPT-5.6 Sol through Codex or ChatGPT Work: switch your model string to `gpt-6.2-sol` now and cut costs in half, instead of waiting to be forced to migrate on 12/23 — run a regression pass on your own tasks first
- If you're running GPT-5.6 Terra: don't assume OpenAI will default you to `gpt-6.1-terra` or `gpt-6-luna` as the replacement — neither was named this time, so test both candidates against your own eval set to see which lands closest to Terra's current quality/price trade-off
- If you're calling `gpt-5.6-sol` or `gpt-5.6-terra` through the raw API rather than the ChatGPT interface: check the [official deprecations page](https://developers.openai.com/api/docs/deprecations) to see whether these model IDs have been added — as of this writing they haven't, which suggests this announcement's scope may be limited to ChatGPT's product surfaces and may not automatically extend to raw API calls

## Sunset Notice

:warning: **Retirement date**: 2026-12-23. GPT-5.6 Sol will be retired from ChatGPT Chat, Work, and Codex; GPT-5.6 Terra will be retired from Work and Codex. The official post includes no additional migration-guide link and makes no statement about the scope of impact on raw API calls.

## Today's Takeaway

The most interesting part of this announcement isn't a price cut or hike — it's the gap between the retirement date and the promo-expiry date. The promo expiry (11/30) sits after the announcement and before the retirement (12/23), caught in between: if you were only watching for "how much will it go up after the promo ends," you'd wait forever, because OpenAI never intended to publish a new standard price at that point — the model simply disappears 23 days later. The longer you track pricing changes, the more you notice that "what question did this announcement resolve" matters more than "what number did this announcement publish." This one resolved the open question from our 11/15 report — "what's the post-promo price" — and the answer wasn't a number, it was "that question stops mattering." It's also worth noting that the official product announcement and the API deprecations page aren't in sync, which is itself a field worth actively checking rather than assuming the two always match.

## References

- [ChatGPT's official post on X (original announcement, 12/23 retirement of GPT-5.6 Sol/Terra)](https://x.com/ChatGPT/status/2124981905380569283)
- [9to5Mac: ChatGPT expands GPT-6.2 Sol as OpenAI sets retirement date for two models](https://9to5mac.com/2026/11/23/chatgpt-expands-gpt-6-2-sol-as-openai-sets-retirement-date-for-two-models/)
- [OpenAI: API Pricing (official pricing page, current rates and promo footnote for GPT-5.6 Sol/Terra/GPT-6.2 Sol)](https://developers.openai.com/api/docs/pricing)
- [OpenAI: Deprecations (official API deprecation list; gpt-5.6-sol/gpt-5.6-terra not listed as of this check)](https://developers.openai.com/api/docs/deprecations)
- [This series, 11/15: Gemini 4 Carbon/Argon's expiry date confirmed; GPT-5.6 Sol's promo ends 11/30 with no new price](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes-en)
- [This series, 11/16: OpenAI retires the entire GPT-5/o3 family on 12/11](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en)
