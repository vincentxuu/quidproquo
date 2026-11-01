---
title: "Pricing Watch: OpenAI Cuts Off Cursor's Model Access Over the SpaceX Acquisition, Effective 11/12"
date: 2026-11-02
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai, cursor]
lang: en
description: "OpenAI is winding down its contract to supply models to Cursor after a change-of-control clause was triggered by SpaceX's acquisition of the coding editor, with a proposed shutoff date of 2026-11-12. Run the token math, though, and GPT-6.1 Sol and Claude Sonnet 5.5 land at the exact same standard price."
tldr: "OpenAI announced on 8/28 that it is winding down its contract to supply models to Cursor, triggered by a change-of-control clause after SpaceX acquired the coding editor. The proposed shutoff date is 2026-11-12, about 10 days from now. After that, Cursor users will need their own OpenAI API key (BYOK) to keep using GPT models, and OpenAI says future models like GPT-6.1 Astra won't be offered to Cursor at all. OpenAI cited Musk-owned companies' history of breaking contract terms as its reasoning; Cursor's CEO responded that OpenAI models account for only about 5% of its traffic and that the two companies are still talking."
series:
  name: "AI Pricing Watch"
  order: 30
---

> 🌏 [中文版](/posts/daily/2026-11-02-pricing-openai-cursor-api-access-cutoff)

## Summary

OpenAI [announced on August 28](https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/) that it is terminating its contract to supply models to the AI coding editor Cursor, after Cursor's acquisition by SpaceX triggered a change-of-control clause in their agreement. The proposed shutoff date is 2026-11-12 — about 10 days from now. This isn't a price hike or a promotion ending; it's a supply-chain trust story. OpenAI explicitly cited Musk-owned companies' history of violating its terms of service as the reason, and said future models, including the upcoming GPT-6.1 Astra, won't be made available to Cursor at all — meaning who owns a customer is now part of the model-supply calculus. Run the token math, though, and the blast radius is smaller than the headline suggests: Cursor users can keep using GPT models after the cutoff by bringing their own OpenAI API key (BYOK), and GPT-6.1 Sol's standard price happens to be identical to Claude Sonnet 5.5's. The real cost here isn't dollars — it's operational overhead and how much you trust the vendor.

## Before and After

| Item | Now | After 2026-11-12 | Change | Effective date |
|---|---|---|---|---|
| Built-in OpenAI model access in Cursor | Direct integration, billed against Cursor's own subscription allowance | Disabled; requires your own OpenAI API key (BYOK) | Access mechanism changes | 2026-11-12 |
| Availability of OpenAI's future models (e.g. GPT-6.1 Astra) in Cursor | Not yet offered | Permanently excluded once the contract ends | Permanent exclusion | From 2026-11-12 |
| GPT-6.1 Sol per-token rate (post-BYOK, direct from OpenAI) | Input $2.00 / Output $10.00 per 1M tokens | Unchanged | Flat | — |

## Cost Math

**Scenario**: a team running a coding agent inside Cursor, processing 10,000 requests a day (averaging 2,000 input tokens of code context plus 800 output tokens of suggestions/edits per request). Here's the monthly cost of staying on GPT-6.1 Sol via BYOK, switching to the same-priced Claude Sonnet 5.5, or switching to Gemini 3.8 Flash at its current promotional rate.

| | GPT-6.1 Sol (BYOK, unchanged) | Claude Sonnet 5.5 (switch) | Gemini 3.8 Flash (promo rate, switch) |
|---|---|---|---|
| Input cost/month | $1,200 | $1,200 | $450 |
| Output cost/month | $2,400 | $2,400 | $900 |
| **Total** | **$3,600** | **$3,600 (flat)** | **$1,350 (↓62.5%)** |

## Impact on Developers and Enterprises

### Who benefits most

Cursor arguably comes out ahead in the narrative: being forced toward a "we're not locked into one vendor" stance only strengthens its multi-model positioning, and Grok — an xAI product now under the same SpaceX umbrella — could pick up more default placement inside Cursor as a result. For developers, teams that already move freely between Claude, Gemini, and GPT will barely notice. The ones most exposed are individuals or small teams who've been running GPT purely through Cursor's bundled allowance without BYOK — they'll need to set up and pay for their own OpenAI API key after 11/12.

### Competitive landscape

Standard pricing for the models relevant to this story (input / output, USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Luna / Claude Haiku 5.5 (from) | $0.10 | $0.50 | Cheapest high-capability tier |
| Gemini 3.8 Flash (promo, through 2026-12-31) | $0.75 | $3.75 | Doubles to $1.50/$7.50 starting 2027-01-01 |
| **GPT-6.1 Sol** | **$2.00** | **$10.00** | The model at the center of this story |
| **Claude Sonnet 5.5** | **$2.00** | **$10.00** | Identical standard pricing to GPT-6.1 Sol |
| Claude Opus 5.5 | $4.00 | $20.00 | — |
| GPT-6 Astra | $10.00 | $50.00 | OpenAI's flagship |

### What to do

- If GPT-6.1 Sol is your primary model inside Cursor: get your own OpenAI API key before 11/12 and switch Cursor's settings to BYOK. The per-token rate doesn't change — only the billing account does.
- If you're open to reconsidering your model choice anyway: this forced migration is a good moment to run the comparison. Claude Sonnet 5.5 is a drop-in swap at the same price. If your workload leans toward simple code completion rather than heavier agentic tasks, Gemini 3.8 Flash's promotional rate saves another 62.5% — but note that price doubles on 2027-01-01.
- If your team also uses ChatGPT Work or Codex: OpenAI separately announced that starting in December, Plus/Pro/Business plans will pool usage allowance across ChatGPT and Codex. That's unrelated to the Cursor cutoff, but it lands the same month, so plan your November–December usage budget for both changes together.

## Timing Note

⚠️ **Shutoff date**: 2026-11-12 (OpenAI's proposed date, about 10 days out; OpenAI says this is the maximum notice its contract allows, and the exact date could still shift depending on negotiations with Cursor/SpaceX). After that, Cursor will no longer offer direct integration with OpenAI models — set up BYOK before then, or evaluate switching to another model.

## Today's Takeaway

On the surface, this reads like a geopolitical supply-chain rupture. But once you lay the token prices side by side, GPT-6.1 Sol and Claude Sonnet 5.5 land on exactly the same standard rate ($2/$10) — and that's not a coincidence. When flagship models converge on the same price point, the weight in a "should we switch models" decision has already shifted away from "which one's cheaper" and toward "how much BYOK/ops overhead are we willing to take on" and "do we trust this vendor." OpenAI's stated reason for cutting off access — that it can't trust SpaceX/xAI to honor its terms of service — is itself evidence that model competition now has a new variable: vendor political and trust risk, not just who wins on price per token.

## References

- [Our decision on Cursor following its acquisition by SpaceX | OpenAI](https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/)
- [OpenAI to end model access to Cursor after acquisition by SpaceX | CNBC](https://www.cnbc.com/2026/08/29/openai-cursor-spacex-model-access.html)
- [OpenAI is leaving Cursor in November — here are your 3 options | Tom's Guide](https://www.tomsguide.com/ai/openai-is-leaving-cursor-in-november-here-are-your-3-options)
- [Pricing | Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)
- [Gemini Developer API pricing | Google](https://ai.google.dev/gemini-api/docs/pricing)
- [Model Card: GPT-6.1 Sol (zh-TW only)](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)
