---
title: "Pricing Watch | Gemini 4 Carbon/Argon's Doubling Lands Dec 1, GPT-5.6 Sol's Promo Ends Nov 30 With No New Price"
date: 2026-11-15
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, google, openai]
description: "Google pinned Gemini 4 Carbon and Argon's promo expiry to 2026-12-01, when input/output rates double. The same week, OpenAI set GPT-5.6 Sol's promo to end 2026-11-30 without announcing what comes next — two vendors converging on the same end-of-month deadline"
tldr: "Gemini 4 Carbon and Argon's promotional rate now has a confirmed expiry: 2026-12-01, when both double from $2/$10 to $4/$20 per million tokens. GPT-5.6 Sol's promo also ends on 2026-11-30, but OpenAI's own pricing page only gives the date — it hasn't published a replacement rate."
series:
  name: "AI Pricing Watch"
  order: 36
---

> :globe: [中文版](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes)

## What changed

Two promotional windows this site already flagged — both with a known price-increase mechanism but no fixed end date — just got dates, and they land in the same week. Gemini 4 Carbon's [October 29 model card](/posts/daily/2026-10-29-model-google-gemini-4-carbon-en) described the expiry as "doubles when the promo ends, date not yet announced." Google's pricing page and changelog now put a number on it: **2026-12-01**. Carbon and Argon, which share the same promotional rate card, both jump from $2.00/$10.00 to $4.00/$20.00 — a flat doubling. The same week, OpenAI tightened GPT-5.6 Sol's promo wording from an open-ended floor ("at least through November 21") to a hard stop: "available until November 30, 2026." But that page gives a date, not a number — whether the pre-August list price of $5.00/$30.00 comes back is still unknown. Both companies independently swapped one kind of uncertainty ("when does the promo end?") for another ("what does it cost after?") in the same week. (Anthropic's Claude Sonnet 4.5 retirement also lands on November 30, but we [already covered that on October 23](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement-en) — it's noted here only as a reference point on the timeline, not counted as new in this piece.)

## Before/after

| Item | Old | New | Change | Effective |
|---|---|---|---|---|
| Gemini 4 Carbon Input | $2.00/1M tokens (promo, no fixed expiry) | $4.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Carbon Output | $10.00/1M tokens (promo, no fixed expiry) | $20.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Input | $2.00/1M tokens (promo) | $4.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Output | $10.00/1M tokens (promo) | $20.00/1M tokens | ↑100% | 2026-12-01 |
| GPT-5.6 Sol Input (promo) | $4.00/1M tokens (expiry changed from "at least 11/21" to "11/30") | Not published | Unknown | After 2026-11-30 |
| GPT-5.6 Sol Output (promo) | $20.00/1M tokens (same) | Not published | Unknown | After 2026-11-30 |

## Cost math

**Scenario**: a team running Gemini 4 Carbon for security analysis and GPT-5.6 Sol for general reasoning, 2,000 tasks a day each (Carbon averaging 3,000 input + 1,000 output tokens; Sol averaging 2,000 input + 800 output tokens)

| | November (current promo rate) | December (Carbon's confirmed new rate; Sol assumed to revert to its pre-August $5/$30 list price) | Monthly delta |
|---|---|---|---|
| Gemini 4 Carbon /month | $960 | $1,920 | +$960 (↑100%) |
| GPT-5.6 Sol /month | $1,440 | $2,040 (hypothetical — no official new price) | +$600 (↑42%, hypothetical) |
| **Total** | **$2,400/month** | **$3,960/month (with the Sol assumption)** | **+$1,560 (↑65%, with the Sol assumption)** |

The Carbon number is firm — the new December rate is already on the official pricing page. The Sol number is a guess: it uses OpenAI's pre-August list price of $5.00/$30.00 as an upper bound for "what happens if the promo just ends without a replacement." The actual rate could be lower (an extended promo) or could stay at $4/$20 pending an announcement. Treat it as a budgeting ceiling, not an official figure.

## Impact on developers and teams

### Who takes the biggest hit

Teams running Carbon or Argon as a primary model at volume feel this first — a 100% increase with no grace period; it applies the moment December 1 arrives, unlike vendors who route old model IDs to new rates gradually. GPT-5.6 Sol poses a different kind of risk: not a confirmed increase, but genuine uncertainty about whether there will be one and by how much — which is harder to budget around than a known number, even a bad one.

### Competitive landscape

Leading model pricing after December 1 (input / output, USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| Claude Fable 5.2 | $8.00 | $40.00 | Cut 20% on 11/9 — see [our 11/13 coverage](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut-en) |
| Claude Mythos 5.2 | $8.00 | $40.00 | Restricted to verified security partners |
| Claude Opus 5.5 | $4.00 | $20.00 | — |
| **Gemini 4 Carbon (from 12/1)** | **$4.00** | **$20.00** | Promo ends; roughly matches Opus 5.5 on Artificial Analysis's Intelligence Index |
| **Gemini 4 Argon (from 12/1)** | **$4.00** | **$20.00** | Promo ends; noticeably behind Opus 5.5 on AA's score at the same price |
| GPT-5.6 Sol (before 11/30) | $4.00 | $20.00 | Price after expiry unknown |
| GPT-6.1 Sol | $2.00 | $10.00 | No expiry; OpenAI's named replacement for GPT-5/o3 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |

After December 1, Carbon and Argon's list prices land exactly on Claude Opus 5.5's. But third-party benchmark site Artificial Analysis's Intelligence Index shows Argon scoring noticeably below Opus 5.5 at that same $4/$20 rate, while Carbon lands roughly even. The "security-benchmark edge at an equal price" case that the promotional rate made easy to argue gets weaker once the price actually matches.

### What to do

- If you're running Gemini 4 Carbon or Argon: budget for the doubling before December 1 and don't assume the promo extends — Google gave a hard expiry this time, not the open-ended "at least through" wording from earlier rounds
- If you're a heavy GPT-5.6 Sol user: OpenAI's own deprecations page already names GPT-6.1 Sol ($2/$10, no expiry) as the replacement for GPT-5/o3 — evaluate the switch now rather than waiting to see Sol's post-11/30 price. Switching now saves at least half; waiting might change nothing
- If you're running Carbon specifically for security workflows: once it matches Opus 5.5's price on December 1, rerun your eval against the table above to confirm the security-capability premium still holds up

## Deadlines to watch

:clock: **Promo expiry (Gemini 4 Carbon/Argon)**: 2026-12-01. Input and output both jump from $2.00/$10.00 to $4.00/$20.00 — the new rate is already published on the official pricing page and changelog, with no grace period.

:clock: **Promo expiry (GPT-5.6 Sol)**: 2026-11-30. Price after that date is unconfirmed — OpenAI only updated the expiry wording (from "at least through 11/21" to "until 11/30") and hasn't published what comes next.

## Today's takeaway

The notable move from both vendors this week isn't the price change — it's converting a fuzzy deadline into a fixed one, and that's worth remembering on its own. When Carbon shipped on October 29, its promo expiry was simply "not announced," which left no way to plan a budget around it. Now the increase is confirmed at 100%, but at least the date is known, which is plannable. GPT-5.6 Sol is the mirror-image half-step: the date is fixed, the number still isn't — publishing the "when" without the "how much" is actually easier to watch for than publishing nothing at all, because it signals the vendor has already decided something changes on that date and just hasn't decided what. That kind of in-between state rarely lasts long, so it's worth checking the official page again right around November 30.

## References

- [OpenAI: API Pricing (official pricing page, GPT-5.6 Sol promo expiry wording)](https://developers.openai.com/api/docs/pricing)
- [OpenAI: Model deprecations (official page naming GPT-6.1 Sol as the GPT-5/o3 replacement)](https://developers.openai.com/api/docs/deprecations)
- [Anthropic: Model deprecations (official page confirming Claude Sonnet 4.5's 2026-11-30 retirement)](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Anthropic: Models overview (official model lineup with current rates)](https://platform.claude.com/docs/en/models/overview)
- [tokencost.app: LLM API Price Changes, November 2026: The Dec 1 Cliff (2026-11-14, compiles and links to Google/OpenAI/Anthropic's own pricing and deprecation pages)](https://tokencost.app/blog/llm-api-price-changes-november-2026)
