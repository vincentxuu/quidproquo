---
title: "Pricing Watch | Anthropic Cuts Cache Reads 75%, Google's Gemini 3.8 Flash Launches on Promo Pricing"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic, google]
lang: en
description: "Anthropic cut cache-read pricing 75% ($1.00 → $0.25/1M tokens) alongside Claude Fable 5.1. Google shipped Gemini 3.8 Flash the same week at an introductory $0.75/$3.75 that only holds through end of 2026."
tldr: "Anthropic released Claude Fable 5.1 on 9/1: base input/output pricing is unchanged at $10/$50 per million tokens, but cache reads dropped from $1.00 to $0.25 (↓75%), saving up to 45% on cache-heavy agentic workloads. Google released Gemini 3.8 Flash on 9/2 at an introductory $0.75/$3.75, good only through 2026-12-31 — standard pricing doubles to $1.50/$7.50 starting 2027-01-01."
series:
  name: "AI Pricing Watch"
  order: 8
---

> 🌏 [中文版](/posts/daily/2026-09-04-pricing-multi-vendor-pricing-changes)

## Summary of Changes

In the first week of September, both Anthropic and Google moved on pricing — but neither cut the sticker price outright. Anthropic shipped Claude Fable 5.1 with base input/output pricing untouched at $10/$50 per million tokens; the real move was on cache reads, cut from $1.00 to $0.25, a 75% drop. Google countered with a new model, Gemini 3.8 Flash, priced as a promotion: $0.75/$3.75 through the end of 2026, doubling to $1.50/$7.50 on January 1, 2027. Different tactics, same underlying signal: base token pricing has been squeezed about as far as it will go, so vendors are now competing on "how much of your context gets reused" and "how fast can we pull you in before the promo ends" — which shifts the developer's real savings lever from picking a cheaper model to designing context structure for cache hits.

## Before & After

| Item | Old | New | Change | Effective |
|---|---|---|---|---|
| Claude Fable 5.1 cache read | $1.00/1M tokens | $0.25/1M tokens | ↓75% | 2026-09-01 |
| Claude Fable 5.1 input | $10.00/1M tokens | $10.00/1M tokens | Flat | 2026-09-01 |
| Claude Fable 5.1 output | $50.00/1M tokens | $50.00/1M tokens | Flat | 2026-09-01 |
| Gemini 3.8 Flash input (promo → standard) | $0.75/1M tokens | $1.50/1M tokens | ↑100% | 2027-01-01 |
| Gemini 3.8 Flash output (promo → standard) | $3.75/1M tokens | $7.50/1M tokens | ↑100% | 2027-01-01 |

## Cost Estimate

### Scenario A: Anthropic's cache discount, heavy agentic workload

**Scenario**: A tool-heavy coding agent running 10,000 calls per day. On each call, a stable ~20,000-token block (system prompt, tool schemas, accumulated conversation history) hits the prompt cache; new dynamic content is about 300 input tokens and 400 output tokens.

| | Old pricing | New pricing | Monthly savings |
|---|---|---|---|
| Cache-read cost/mo | $6,000 | $1,500 | $4,500 |
| Non-cache input cost/mo | $900 | $900 | $0 |
| Output cost/mo | $6,000 | $6,000 | $0 |
| **Total** | **$12,900/mo** | **$8,400/mo** | **$4,500 (↓35%)** |

That's already close to the "up to 45% on highly agentic work" range Anthropic claims — the exact number moves with how much of the context is actually cache-hit.

### Scenario B: Gemini 3.8 Flash, promo vs. standard pricing

**Scenario**: A customer-service agent handling 10,000 conversations per day (average 1,500 input tokens + 500 output tokens each).

| | Promo (now – 2026-12-31) | Standard (from 2027-01-01) | Monthly increase |
|---|---|---|---|
| Input cost/mo | $337.5 | $675 | $337.5 |
| Output cost/mo | $562.5 | $1,125 | $562.5 |
| **Total** | **$900/mo** | **$1,800/mo (↑100%)** | **$900** |

Running on the promo is cheap, but the math is also a warning: any project that will still be running into 2027 needs to budget against the standard rate, not the introductory one.

## Impact on Developers & Enterprises

### Who Benefits Most

Anthropic's cache discount benefits agents with heavy, mostly-static context the most — long system prompts, fixed tool definitions, accumulated conversation history that repeatedly hits the cache. Cognition has already moved Devin's Opus 5 traffic to Fable 5.1 (starting with code review), crediting the cache-read pricing for making a Fable-class model economical for work it had previously kept on cheaper tiers. On the Google side, teams with tight budgets who want to lock in promo pricing now and get a long-horizon coding agent with a 1M-token context window into production before the window closes stand to gain the most.

### Competitive Landscape

Current pricing for major models (input / output, USD per 1M tokens, sorted ascending by output price):

| Model | Input | Output | Note |
|---|---|---|---|
| Gemini 3.8 Flash (promo) | $0.75 | $3.75 | Promo through 2026-12-31 |
| Claude Haiku 4.5 | $1.00 | $5.00 | Cheapest Claude tier |
| GPT-5.6 Terra | $2.00 | $12.00 | OpenAI mid-tier |
| Claude Sonnet 5 | $3.00 | $15.00 | Intro pricing expired 8/31 |
| Claude Opus 5 | $5.00 | $25.00 | Top reasoning tier |
| Claude Fable 5.1 | $10.00 | $50.00 | Cache read cut to $0.25 |

Fable 5.1's base price is still the most expensive of any mainstream model — the cache discount isn't trying to compete with Haiku or Gemini Flash on price, it's lowering the actual bill for customers who've already committed to the top tier. It's a retention play, not an acquisition play. Gemini 3.8 Flash is the opposite: a straight land-grab in the low-price Flash tier, with the price stepping up once the promo period ends.

### Action Items

- If you're running heavy agentic coding workloads on Claude Code with a stable system prompt and tool definitions: upgrade to Fable 5.1. The cache discount is unconditional savings with no extra configuration required.
- If you're evaluating Gemini 3.8 Flash: locking in now captures the promo price through year-end, but budget for the doubled standard rate starting 2027-01-01 — don't make a long-term model choice based on the introductory number alone.
- If you're weighing both: Fable 5.1 targets cost reduction for tasks that already need top-tier reasoning; Gemini 3.8 Flash targets cheap entry for long-context agent workloads. They aren't direct substitutes — pick based on the capability tier the task needs, not raw $/token.

## Expiration Notice

⏰ **Gemini 3.8 Flash promo expires**: 2026-12-31. Starting 2027-01-01, input and output pricing both double to $1.50/$7.50 per million tokens.

## Takeaway

Tracking pricing changes used to mean watching how far the base rate dropped. This time, both vendors moved around the sticker price instead: Anthropic only touched cache reads, Google used a time-boxed promo rather than a permanent cut. That's a sign base token costs have been squeezed about as far as they'll go, so vendors are now finding room in "how much of your context gets reused" and "how fast can we get you onboarded before the window closes." For developers, that shifts the real savings lever from "which model do I pick" to "how do I structure context so it actually hits the cache discount" — architecture decisions are now cost decisions.

## References

- [Introducing Claude Fable 5.1 and Claude Mythos 5.1 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [AI Weekly: Cheap Tokens, Tight Safeguards, and a Two Million GPU Order — Alex Merced](https://amdatalakehouse.substack.com/p/ai-weekly-cheap-tokens-tight-safeguards)
- [Gemini 3.8 Flash: GA Pricing, 1M Context, Benchmarks and Flash Cyber Access — AiCybr](https://aicybr.com/blog/gemini-3-8-flash-cyber-pricing-benchmarks)
- [Agent Platform Pricing — Google Cloud](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing)
