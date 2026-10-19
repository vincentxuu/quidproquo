---
title: "Pricing Watch | Vertex AI Retires Gemini 2.5 Today, While the Gemini API Says It's Not Retired at All"
date: 2026-10-20
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, google]
description: "Google Cloud shut down gemini-2.5-pro, -flash, and -flash-lite on Vertex AI on 2026-10-20, while the Gemini developer API's own deprecation page still lists all three as having no shutdown date. Migrating the cheapest tier to its named replacement raises cost by 221%."
tldr: "On 2026-10-20, Google Cloud retired gemini-2.5-pro, gemini-2.5-flash, and gemini-2.5-flash-lite on Vertex AI (Gemini Enterprise Agent Platform) — but the Gemini developer API's own deprecation page lists the same three models as having no shutdown date announced, the same week. Which endpoint you call decides how long your model keeps working. Migrating to Google's named replacements, Gemini 2.5 Pro users actually come out ahead (input up 20%, output down 10%), Gemini 2.5 Flash users land flat, and Gemini 2.5 Flash-Lite users pay more than double."
series:
  name: "AI Pricing Watch"
  order: 25
---

> 🌏 [中文版](/posts/daily/2026-10-20-pricing-google-vertex-ai-gemini-2-5-sunset)

## Summary

On October 20, 2026 — today — Google Cloud's Vertex AI, now branded Gemini Enterprise Agent Platform, formally retired `gemini-2.5-pro`, `gemini-2.5-flash`, and `gemini-2.5-flash-lite`. The same three model IDs, on the Gemini developer API's (`ai.google.dev`) own deprecation page, are listed with "No shutdown date announced" — new projects just can't select them, and Google recommends the 3.x line instead. Two official Google documents give opposite answers about the same model name; the only variable is which endpoint you call. The cost direction is just as inconsistent: migrating to Google's own named replacements actually saves money for Gemini 2.5 Pro users, leaves Gemini 2.5 Flash users flat, and more than doubles the bill for Gemini 2.5 Flash-Lite users — the opposite of the usual "a retirement notice comes with a price cut" assumption.

## Before & After

| Item | Old (Vertex AI, retired today) | New (Google's recommended replacement) | Change | Effective |
|---|---|---|---|---|
| Gemini 2.5 Pro Input (≤200K) | $1.25/1M tokens | Gemini 3.5 Flash: $1.50/1M tokens | ↑20% | 2026-10-20 |
| Gemini 2.5 Pro Output (≤200K) | $10.00/1M tokens | Gemini 3.5 Flash: $9.00/1M tokens | ↓10% | 2026-10-20 |
| Gemini 2.5 Flash Input | $0.30/1M tokens | Gemini 3.5 Flash-Lite: $0.30/1M tokens | flat | 2026-10-20 |
| Gemini 2.5 Flash Output | $2.50/1M tokens | Gemini 3.5 Flash-Lite: $2.50/1M tokens | flat | 2026-10-20 |
| Gemini 2.5 Flash-Lite Input | $0.10/1M tokens | Gemini 3.1 Flash-Lite: $0.25/1M tokens | ↑150% | 2026-10-20 |
| Gemini 2.5 Flash-Lite Output | $0.40/1M tokens | Gemini 3.1 Flash-Lite: $1.50/1M tokens | ↑275% | 2026-10-20 |

Google's Vertex AI lifecycle page lists more than one replacement for each retired model: `gemini-2.5-pro` can move to `gemini-3.8-flash` or `gemini-3.5-flash`; `gemini-2.5-flash` to `gemini-3.8-flash` or `gemini-3.5-flash-lite`; `gemini-2.5-flash-lite` to `gemini-3.8-flash`, `gemini-3.1-flash-lite`, or a self-hosted Gemma 4. The table above picks the option at the matching price tier, not the one Google lists first, `gemini-3.8-flash`. Move every retired model to `gemini-3.8-flash` instead — promotional price $0.75/$3.75, rising to $1.50/$7.50 after 2026-12-31 — and the increases on the Flash and Flash-Lite rows get considerably worse.

## Cost Scenario

**Scenario**: an agent handling 10,000 customer-service conversations a day (1,500 input tokens and 500 output tokens each, on average), currently running on Gemini 2.5 Flash-Lite, migrating to Gemini 3.1 Flash-Lite — Google's same-tier recommended replacement.

| | Gemini 2.5 Flash-Lite (old) | Gemini 3.1 Flash-Lite (new) | Monthly increase |
|---|---|---|---|
| Input cost/month (450M tokens) | $45.00 | $112.50 | $67.50 |
| Output cost/month (150M tokens) | $60.00 | $225.00 | $165.00 |
| **Total** | **$105.00/month** | **$337.50/month** | **$232.50 (↑221%)** |

That table only covers the forced migration that takes effect today; it doesn't account for Flash-Lite's free daily quota on the Gemini API (1,500 free requests a day), which most production Vertex AI workloads blow past anyway — so most teams feel the full increase. Run the same traffic on Gemini 2.5 Pro instead, and migrating to Gemini 3.5 Flash tells the opposite story: input cost rises from $562.50/month to $675.00/month (↑20%), but output cost falls from $1,500.00/month to $1,350.00/month (↓10%), netting out to roughly flat ($2,062.50 → $2,025.00, ↓1.8%).

## Impact on Developers and Enterprises

### Who benefits most

Teams running heavy reasoning work on Gemini 2.5 Pro come out ahead here — migrating to Gemini 3.5 Flash costs almost nothing extra and lands them on a newer, faster model generation. Teams running high-volume, low-complexity work on Gemini 2.5 Flash-Lite — classification, simple extraction, support-ticket routing — take the biggest hit: that tier only worked because the per-token price was low enough to run at volume, and the forced migration doubles to nearly quadruples that price, which can break the underlying cost model entirely.

### How the competitive landscape shifts

Where the replacement models land in the current pricing ranking (USD per 1M tokens, snapshot dated 2026-10-19):

| Model | Input | Output | Note |
|---|---|---|---|
| Gemini 2.5 Flash-Lite (retired) | $0.10 | $0.40 | No longer reachable on Vertex AI as of today |
| **Gemini 3.1 Flash-Lite (successor)** | **$0.25** | **$1.50** | Now Google's cheapest Gemini 3.x text model |
| Gemini 3.5 Flash-Lite | $0.30 | $2.50 | Same-tier replacement for 2.5 Flash |
| GPT-6 Luna | $0.10 | $0.50 | OpenAI's entry model — still cheaper than 3.1 Flash-Lite |
| Claude Haiku 5.5 | $0.10 | $0.50 | Matches GPT-6 Luna — still cheaper than 3.1 Flash-Lite |
| Gemini 3.5 Flash | $1.50 | $9.00 | Same-tier replacement for 2.5 Pro |
| Gemini 3.8 Flash | $0.75 / $1.50 | $3.75 / $7.50 | Promotional through 2026-12-31, then rises |

This retirement pushes Google's own entry-tier floor from $0.10/$0.40 (2.5 Flash-Lite) up to $0.25/$1.50 (3.1 Flash-Lite), while OpenAI's GPT-6 Luna and Anthropic's Claude Haiku 5.5 both stay at $0.10/$0.50. The retirement hands the ultra-cheap entry-model segment to the competition.

### Recommended actions

- Check which endpoint you're actually calling first. Hit the Gemini API directly (`generativelanguage.googleapis.com`) and nothing breaks today, but new projects already can't select the old models, so migration is coming eventually. Hit Vertex AI or the Gemini Enterprise Agent Platform and requests to these three models fail outright starting today.
- Teams running high volume on 2.5 Flash-Lite should run a cost projection against real traffic before migrating — the increase can exceed 2x — and evaluate cutting call volume (bigger caches, batched requests) or offloading part of the traffic to a self-hosted open model (Gemma 4) alongside the migration.
- Teams on 2.5 Pro can migrate directly, and should re-run their eval suite while they're at it: 3.5 Flash targets "Flash speed, near-Pro capability," so complex-task performance may not fully match the old Pro tier.
- Don't treat "no shutdown date announced" on the Gemini API page as a safety guarantee. INFRO's roundup of these dates points out that Gemini API dates are the earliest possible shutdown date, and actual announcements often land abruptly — this exact Vertex AI retirement moved from "no earlier than October 16" in June 2026 to a final date of October 20.

## Sunset Notice

⚠️ **Shutdown date**: 2026-10-20 (today). `gemini-2.5-pro`, `gemini-2.5-flash`, and `gemini-2.5-flash-lite` are fully retired on Vertex AI / Gemini Enterprise Agent Platform; requests after this point fail outright. Google states the timeline "may be extended, but won't be moved to an earlier date." Migration guide: [Model versions and lifecycle](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions).

## Today's Takeaway

The same model ID gets contradictory answers from Google's own two documents: the Vertex AI lifecycle page says "retired today," while the Gemini API's deprecation page, updated the same week, says "no shutdown date announced." Tracking deprecations used to mean checking whether a model name showed up on a shutdown list. This one is a reminder to ask a second question — which endpoint am I actually calling — because the same model card can live on a completely different timeline depending on which cloud surface serves it. The cost direction is the bigger surprise: a forced migration is supposed to come with a consolation discount, but only the Pro tier got one here. The Flash-Lite tier, the one that depended most on a rock-bottom per-token price to make sense at volume, went up 221%. Retirement doesn't mean a price cut — each tier has to be checked on its own.

## References

- [Model versions and lifecycle | Gemini Enterprise Agent Platform (official: Vertex AI shutdown date 2026-10-20, with the replacement-model table)](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Gemini deprecations | Gemini API (official: gemini-2.5-pro/flash/flash-lite listed as "No shutdown date announced")](https://ai.google.dev/gemini-api/docs/deprecations)
- [Gemini Developer API pricing (official: 2.5 Pro/Flash/Flash-Lite and 3.x pricing)](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini 2.5 on Vertex AI Retires October 20: What to Switch To (and What It Costs) | Medium](https://medium.com/@shtse8/gemini-2-5-on-vertex-ai-retires-october-20-what-to-switch-to-and-what-it-costs-b56dd29479bd)
- [Vertex AI Shutdowns This Week: Gemini 2.5 on October 20, 16 Open Models on October 21 | DevelopersDigest](https://www.developersdigest.tech/blog/vertex-ai-shutdowns-october-2026)
- [AI model deprecation calendar: OpenAI, Anthropic, Google | INFRO (on the Gemini API vs. Vertex AI date discrepancy)](https://infro.io/blog/ai-model-deprecation-calendar)
