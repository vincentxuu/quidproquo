---
title: "Pricing Watch: Microsoft Foundry's Retirement Clock Runs on Its Own Schedule"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, pricing, daily, microsoft, anthropic, mistral]
lang: en
description: "Microsoft Foundry sets its own retirement dates for third-party models, independent of the vendor: Claude Haiku 4.5 retires on Foundry in two weeks while Anthropic still lists it as active, and Mistral Medium 3 and Ministral 3B stayed GA on Foundry for 100 days to nearly a year after Mistral itself retired them."
tldr: "Microsoft Foundry's model retirement schedule doesn't track the vendor's own clock. Claude Haiku 4.5 is scheduled to retire on Foundry on 2026-11-15 (two weeks out, with no replacement listed), even though Anthropic's own Claude API, AWS, and Google Cloud still mark it Active. The reverse happened with Mistral Medium 3 (retired on Mistral's own platform 2026-08-31) and Ministral 3B (retired 2025-12-31): Foundry kept both at GA until 2026-12-09, 100 and 343 days after the vendor pulled the plug. Anthropic's own docs say Foundry \"follows the Claude API lifecycle schedule,\" but the actual dates don't match."
series:
  name: "AI Pricing Watch"
  order: 29
---

> 🌏 [中文版](/posts/daily/2026-10-31-pricing-azure-foundry-claude-haiku-mistral-retirement-mismatch)

## Summary

Microsoft Foundry's [model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule) quietly reveals something the vendor docs don't spell out: the retirement date for a third-party model on Foundry has nothing to do with the vendor's own timeline. Claude Haiku 4.5 is scheduled to retire on Foundry on 2026-11-15 — two weeks from now — with the Replacement column left blank. Check [Anthropic's own model deprecations page](https://platform.claude.com/docs/en/about-claude/model-deprecations) the same day, and Haiku 4.5 is still listed Active; Anthropic hasn't even issued a deprecation notice. Run it the other way, and Mistral Medium 3 (`mistral-medium-2505`) and Ministral 3B (`ministral-3b-2410`) were already pulled from [Mistral's own retirement table](https://docs.mistral.ai/models) — on 2026-08-31 and 2025-12-31, respectively — while Foundry kept listing both as "GA" until 2026-12-09, 100 and 343 days after the vendor retired them. What makes this worse: Anthropic's own documentation states that Foundry "follows the Claude API lifecycle schedule." The Haiku 4.5 case proves the two don't match. Same root cause — Foundry sets its own schedule, not the vendor's — pointing in opposite directions: one model forces you off two weeks early, the other keeps you on (and exposed, with no upstream maintenance) for nearly a year.

## Before and After

| Model | Vendor (Anthropic/Mistral) status | Microsoft Foundry status | Gap | Foundry effective date |
|---|---|---|---|---|
| Claude Haiku 4.5 | Active; Anthropic has not announced retirement (earliest-possible date of 2026-10-15 has passed with no notice) | Retirement scheduled; Replacement column blank | Foundry retires it ahead of the vendor | 2026-11-15 |
| Mistral Medium 3 (`mistral-medium-2505`) | Retired (deprecated 2026-05-22 → retired 2026-08-31) | Still GA; listed replacement is Mistral Medium 3.5 | Foundry lags the vendor by 100 days | 2026-12-09 |
| Ministral 3B (`ministral-3b-2410`) | Retired (deprecated 2025-12-02 → retired 2025-12-31) | Still GA | Foundry lags the vendor by 343 days (nearly a year) | 2026-12-09 |

## Cost Math

**Scenario**: A classification/routing agent running Claude Haiku 4.5 on Microsoft Foundry, handling 10,000 support conversations a day (1,500 input tokens + 500 output tokens per conversation on average — roughly 450M input and 150M output tokens a month). After the 11/15 retirement, Foundry lists no replacement, but Anthropic's current Haiku generation, Claude Haiku 5.5 (shipped 10/7), is deployable on Foundry too and is the obvious successor.

| | Claude Haiku 4.5 (old, Foundry) | Claude Haiku 5.5 (new, also deployable on Foundry) | Monthly savings |
|---|---|---|---|
| Input cost/month | $450 | $45 | $405 |
| Output cost/month | $750 | $75 | $675 |
| **Total** | **$1,200/month** | **$120/month (↓90%)** | **$1,080** |

Haiku 5.5's rate here applies to prompts under 100,000 tokens (this scenario's 2,000-token conversations are well under that threshold); longer prompts move to a higher tier. This forced migration ends up cutting the bill by 90%, but that's purely because Anthropic cut the price on this generation of Haiku — it has nothing to do with Microsoft Foundry's retirement schedule itself.

## Impact on Developers and Teams

### Who's most exposed

Teams running these models through Microsoft Foundry — rather than calling Anthropic or Mistral's APIs directly — especially anyone who reads the "GA" tag in the Foundry console as proof the vendor is still maintaining the model. On Foundry's own lifecycle vocabulary, GA only means "generally available for use," not "the vendor is still updating it."

### The mismatch cuts both ways

This isn't a single story about a vendor rushing you to migrate. Claude Haiku 4.5 is the case where Foundry moves faster than the vendor: Anthropic hasn't even announced a deprecation, yet Foundry has already locked in a hard retirement date two weeks out, with no replacement named, leaving you to find one yourself in Anthropic's current model lineup. The two Mistral models go the other way: the vendor stopped maintaining them somewhere between three months and nearly a year ago, and Foundry has kept billing for them and serving them the whole time under a "generally available" label that gives no hint any of this happened — no upstream security fixes, no behavior improvements, for however long that gap runs.

### What to do

- **Running Claude Haiku 4.5 on Foundry**: validate Claude Haiku 5.5's output quality before 11/15 — don't wait for Foundry to name a replacement, because it won't. Haiku 5.5 uses the newer tokenizer introduced with Claude 4.7 and later, which produces roughly 30% more tokens for the same text, but this post's cost math shows that even accounting for that, the new bill is roughly a tenth of the old one.
- **Running Mistral Medium 3 or Ministral 3B on Foundry**: don't take "GA" at face value. Assume you're running a model the vendor stopped maintaining months to nearly a year ago, and plan the move to Mistral Medium 3.5 (Mistral's own listed replacement) well before the 12/9 deadline instead of waiting for it.
- **Running the same model across Anthropic's API, Bedrock, Google Cloud, and Microsoft Foundry**: don't assume one lifecycle document covers every platform — even Anthropic's own docs get this wrong here. Check each platform's own retirement schedule page separately, and when two dates disagree, go with the one on the page for the platform you're actually calling.

## Timing Note

⚠️ **Claude Haiku 4.5 retirement on Microsoft Foundry**: 2026-11-15 (about two weeks out). Foundry's own retirement schedule lists no replacement; Anthropic's own platforms (Claude API, Bedrock, Google Cloud) still mark Haiku 4.5 Active with no retirement announced. Suggested migration target: [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview).

⚠️ **Mistral Medium 3 / Ministral 3B retirement on Microsoft Foundry**: 2026-12-09. Both models have gone without upstream maintenance on Mistral's own platform for 100 days and 343 days, respectively, while still running on Foundry. Suggested migration target: Mistral Medium 3.5.

## Today's Takeaway

I used to assume sunset announcements follow one direction: the vendor announces first, and the cloud platform follows a bit later to wrap things up. This Foundry retirement table has two models pointing in opposite directions at once — Claude Haiku 4.5 retires on Foundry before Anthropic has even announced anything, while the two Mistral models lingered on Foundry for the better part of a year after the vendor was done with them. "Follows the vendor's schedule" turns out to be a claim in Microsoft's own documentation, not something you can actually schedule around. Tracking model lifecycles now means treating "the vendor's own schedule" and "each cloud platform's own schedule" as two separate documents to cross-check — missing either one can mean missing the date that actually matters.

## References

- [Model retirement schedule | Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule)
- [Model deprecations | Anthropic](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Models Overview | Mistral Docs](https://docs.mistral.ai/models)
- [Pricing | Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)
- [AI API changes in October 2026: what to act on, and when | INFRO](https://infro.io/blog/ai-api-changes-october-2026)
