---
title: "Pricing Watch | Gemini 2.5 Pro/Flash Finally Get a Developer API Shutdown Date: Dec 1 Auto-Reroute, and the Bill Might Go Down"
date: 2026-11-04
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, google]
description: "Google's 2026-11-02 Gemini API release notes finally set a Developer API shutdown date (2026-12-01) for gemini-2.5-pro and gemini-2.5-flash. Past that date, requests auto-reroute and get billed at the new model's rates — and 2.5 Pro users end up paying 13% less than before, even after the new model's own promo ends"
tldr: "On 2026-11-02, Google's Gemini API release notes set a Developer API shutdown date (2026-12-01) for gemini-2.5-pro and gemini-2.5-flash. Past that date, requests auto-reroute and bill at the new model's rates. Gemini 2.5 Pro users land on gemini-3.8-flash and still pay 13% less than before even after 3.8 Flash's own promo ends on 2027-01-01. Gemini 2.5 Flash users land on gemini-3.5-flash-lite at an unchanged price. Our 10/20 report flagged that the Developer API's deprecation page listed 'no shutdown date' for all three 2.5 models at the time — Google has now filled that gap in."
series:
  name: "AI Pricing Watch"
  order: 32
---

> 🌏 [中文版](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset)

## Summary

Our [10/20 report](/posts/daily/2026-10-20-pricing-google-vertex-ai-gemini-2-5-sunset) pointed out that Vertex AI had already shut down `gemini-2.5-pro`, `gemini-2.5-flash`, and `gemini-2.5-flash-lite`, while the same three models on the Gemini Developer API ([`ai.google.dev`'s deprecations page](https://ai.google.dev/gemini-api/docs/deprecations)) still listed "no shutdown date announced." Two weeks later, on 2026-11-02, Google closed that gap in the Gemini API release notes: `gemini-2.5-pro` and `gemini-2.5-flash` now have a Developer API shutdown date of December 1, 2026. Past that date, the endpoints don't just disappear — requests auto-reroute to a newer model and get billed at that model's rates. `gemini-2.5-pro` routes to `gemini-3.8-flash`; `gemini-2.5-flash` routes to `gemini-3.5-flash-lite`. `gemini-2.5-flash-lite` is unaffected — Google still lists it as "no shutdown date announced, available until further notice." The counterintuitive part is the direction of the change: 2.5 Pro users get rerouted to 3.8 Flash, and even after 3.8 Flash's own promotional pricing ends on January 1, 2027, the standard rate is still cheaper than the original 2.5 Pro price. 2.5 Flash users get rerouted to 3.5 Flash-Lite at a price that's identical, down to the decimal. This time, "deprecation" didn't turn into a price hike.

## Before / After

| Item | Old (gemini-2.5-pro standard rate) | New (rerouted to gemini-3.8-flash, 2026-12-01 to 2026-12-31 promo rate) | Change | Effective |
|---|---|---|---|---|
| Input (≤200K tokens) | $1.25/1M tokens | $0.75/1M tokens | ↓40% | 2026-12-01 |
| Output (≤200K tokens) | $10.00/1M tokens | $3.75/1M tokens | ↓62.5% | 2026-12-01 |
| Input (standard rate from 2027-01-01) | $1.25/1M tokens | $1.50/1M tokens | ↑20% | 2027-01-01 |
| Output (standard rate from 2027-01-01) | $10.00/1M tokens | $7.50/1M tokens | ↓25% | 2027-01-01 |

| Item | Old (gemini-2.5-flash) | New (rerouted to gemini-3.5-flash-lite) | Change | Effective |
|---|---|---|---|---|
| Input | $0.30/1M tokens | $0.30/1M tokens | No change | 2026-12-01 |
| Output | $2.50/1M tokens | $2.50/1M tokens | No change | 2026-12-01 |
| Context Caching | $0.03/1M tokens | $0.03/1M tokens | No change | 2026-12-01 |

The reroute only applies to existing accounts that have actively called these two models before — Google's own wording is "access through the API is limited to existing users who have actively used it in the past," and new projects can no longer select 2.5 Pro or 2.5 Flash in Google AI Studio. Google also warns that 3.8 Flash and 3.5 Flash-Lite carry breaking changes in sampling parameters, `thinking_budget`, function-response ID matching, and PDF token billing — read the [official migration guide](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8#migrate-to-gemini-3-8-flash) before the reroute date; this isn't a transparent swap of just the model name.

## Cost Math

**Scenario**: an agent handling 10,000 customer-service conversations a day (averaging 1,500 input tokens + 500 output tokens each), compared separately for teams currently on 2.5 Pro and 2.5 Flash.

| | gemini-2.5-pro (old rate) | Rerouted to 3.8 Flash (December promo rate) | Rerouted to 3.8 Flash (standard rate from 2027-01) |
|---|---|---|---|
| Input cost/month (450M tokens) | $562.50 | $337.50 | $675.00 |
| Output cost/month (150M tokens) | $1,500.00 | $562.50 | $1,125.00 |
| **Total** | **$2,062.50** | **$900.00 (↓56.4%)** | **$1,800.00 (↓12.7%)** |

| | gemini-2.5-flash (old rate) | Rerouted to 3.5 Flash-Lite |
|---|---|---|
| Input cost/month (450M tokens) | $135.00 | $135.00 |
| Output cost/month (150M tokens) | $375.00 | $375.00 |
| **Total** | **$510.00** | **$510.00 (no change)** |

2.5 Pro users don't need to optimize anything — just letting the auto-reroute happen cuts the December bill by 56% and leaves it, even after the promo ends the following January, 12.7% below the original 2.5 Pro price. Compare that to our 10/20 report, where Vertex AI's 2.5 Flash-Lite migration more than doubled costs — this time the Developer API's reroute runs in exactly the opposite direction.

## Impact on Developers/Enterprises

### Who benefits most

Teams running long-output, reasoning-heavy workloads on 2.5 Pro — long-form report generation, multi-step agents — benefit the most, since the output-price cut (↓62.5% in December, still ↓25% after January) dwarfs the input-price change, and those are exactly the workloads with the highest output-token share. Teams on 2.5 Flash see no cost change, but since the reroute is mandatory, they still need to run an API compatibility pass to confirm `thinking_budget` and function-calling behavior haven't silently shifted output quality.

### Competitive landscape

Putting the rerouted Gemini models back into the main model pricing ranking (USD/1M tokens, all standard rates):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Luna / Claude Haiku 5.5 (from) | $0.10 | $0.50 | Cheapest high-capability tier |
| Gemini 3.5 Flash-Lite (2.5 Flash's reroute target) | $0.30 | $2.50 | Unchanged after reroute |
| GPT-6.1 Terra | $1.00 | $5.00 | — |
| Gemini 3.8 Flash (2026-12 promo rate, 2.5 Pro's reroute target) | $0.75 | $3.75 | Promo through 2026-12-31 |
| **Claude Sonnet 5.5** | **$2.00** | **$10.00** | — |
| Gemini 3.8 Flash (standard rate from 2027-01-01) | $1.50 | $7.50 | — |
| Claude Opus 5.5 | $4.00 | $20.00 | — |

Wherever the clock lands, 2.5 Pro users who get passively rerouted end up with an output price far below Claude Sonnet 5.5's — the opposite of the usual script where a deprecated model only gets replaced by something more expensive or worse. This time Google used a newer, cheaper model to absorb the old model's existing user base.

### Action items

- If you're on `gemini-2.5-pro`: don't rush to find an alternative — the reroute's post-change cost is already lower than the original price. But run a small-traffic test against 3.8 Flash before 12/1 to check output quality and the breaking-change list, rather than discovering a function-calling behavior shift on reroute day
- If you're on `gemini-2.5-flash`: cost stays the same, but run the same compatibility test before 12/1 — pay particular attention to whether the PDF input token-billing change affects your cost estimates
- If you're on `gemini-2.5-flash-lite`: you're unaffected this time, but don't forget its Vertex AI replacement (our 10/20 report) more than doubled costs — the two entry points run fully independent policies, and the Developer API's lenient treatment here doesn't carry over to Vertex AI

## Time-Sensitive Notice

⚠️ **Shutdown date**: 2026-12-01. From this date, API requests to `gemini-2.5-pro` and `gemini-2.5-flash` will automatically reroute to `gemini-3.8-flash` and `gemini-3.5-flash-lite` respectively and bill at the new rates. Migration guide: [Gemini 3.8 Flash migration guide](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8#migrate-to-gemini-3-8-flash).

## Today's Takeaway

When we flagged the gap on 10/20 — Vertex AI and the Developer API giving different shutdown dates for the same model — we expected Google to close it by eventually making affected users accept a worse or pricier replacement, the way the 10/20 report's 2.5 Flash-Lite migration more than doubled costs. Instead, the models that finally got a shutdown date got quietly rerouted to a cheaper one. The lesson isn't just "track how much prices went up" — the same company can run opposite deprecation policies on different models at the same time, so each model needs its own check; last time's conclusion doesn't carry over to this one.

## References

- [Google: Gemini deprecations (official deprecation page, with the 2026-12-01 shutdown date and reroute rules for gemini-2.5-pro/gemini-2.5-flash)](https://ai.google.dev/gemini-api/docs/deprecations)
- [Google: Gemini Developer API pricing (official pricing page, current and post-promo rates for gemini-3.8-flash/gemini-3.5-flash-lite)](https://ai.google.dev/gemini-api/docs/pricing)
- [Google: What's new in Gemini 3.8 (official migration guide and promo expiration date)](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8)
- [Data Studios: Gemini 2.5 Pro and 2.5 Flash API reroute to 3.8 Flash and 3.5 Flash-Lite on December 1 (2026-11-02 report confirming the release-notes publish date)](https://www.datastudios.org/post/gemini-api-reroutes-gemini-2-5-pro-2-5-flash-december-1-3-8-flash-3-5-flash-lite)
- [This series, 10/20: Vertex AI shut down the entire Gemini 2.5 lineup today, but the Gemini API still says "not deprecated yet"](/posts/daily/2026-10-20-pricing-google-vertex-ai-gemini-2-5-sunset-en)
- [This series, 10/17: Google filled in Gemini 4 Argon's promo expiration date](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline-en)
