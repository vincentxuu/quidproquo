---
title: "Pricing Watch | OpenAI Sets January 14, 2027 as the API Sunset Date for GPT-4o and GPT-4.1"
date: 2026-10-16
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, openai]
description: "OpenAI notified developers on 2026-10-14 that GPT-4o, GPT-4o mini, GPT-4.1, and GPT-4.1 mini will leave the API on 2027-01-14. The recommended replacement, gpt-6-luna, cuts list prices by up to 96% but adds reasoning latency and token-count variance."
tldr: "OpenAI told developers on October 14 that GPT-4o, GPT-4o mini, GPT-4.1, and GPT-4.1 mini — plus every fine-tune built on them — leave the API on January 14, 2027. The named replacement is gpt-6-luna. On list price, GPT-4o's input rate drops from $2.50 to $0.10 per million tokens (down 96%) and output from $10.00 to $0.50 (down 95%). But gpt-6-luna is a reasoning model: at its default medium effort it generates reasoning tokens billed as output, and Chat Completions only supports function calling when effort is set to none. The real savings end up smaller than the sticker price suggests."
series:
  name: "AI Pricing Watch"
  order: 23
---

> 🌏 [中文版](/posts/daily/2026-10-16-pricing-openai-gpt-4o-gpt-4-1-api-sunset)

## Summary

On October 14, 2026, OpenAI notified API developers that five model snapshots — GPT-4o, GPT-4o mini, GPT-4.1, and GPT-4.1 mini, along with every fine-tune built on them — will leave the API on January 14, 2027. OpenAI names exactly one recommended replacement: gpt-6-luna. These were the default models that chatbot builders and automation platforms shipped before GPT-5 arrived in August 2025. That means the teams affected aren't the ones still watching the model list — they're the ones who wired up an integration in 2024 and never touched it again. OpenAI gives three months' notice here, half of the "at least six months" minimum its own policy page sets for generally available models, and the page doesn't explain why this batch got the shorter window.

## Before & After

| Item | Old | New (recommended replacement: gpt-6-luna) | Change | Effective |
|---|---|---|---|---|
| GPT-4o Input | $2.50/1M tokens | $0.10/1M tokens | ↓96% | 2027-01-14 |
| GPT-4o Output | $10.00/1M tokens | $0.50/1M tokens | ↓95% | 2027-01-14 |
| GPT-4o mini Input | $0.15/1M tokens | $0.10/1M tokens | ↓33% | 2027-01-14 |
| GPT-4o mini Output | $0.60/1M tokens | $0.50/1M tokens | ↓17% | 2027-01-14 |
| GPT-4.1 Input | $2.00/1M tokens | $0.10/1M tokens | ↓95% | 2027-01-14 |
| GPT-4.1 Output | $8.00/1M tokens | $0.50/1M tokens | ↓94% | 2027-01-14 |
| GPT-4.1 mini Input | $0.40/1M tokens | $0.10/1M tokens | ↓75% | 2027-01-14 |
| GPT-4.1 mini Output | $1.60/1M tokens | $0.50/1M tokens | ↓69% | 2027-01-14 |

gpt-6-luna charges 2x the input rate and 1.5x the output rate once a request passes 272K input tokens, so don't apply the base rates above to long documents or long conversation histories. Context also grows from GPT-4o's 128K and GPT-4.1's 1,047,576 tokens to a unified 1,050,000, and max output rises from the 16,384–32,768 range to 128,000.

## Cost Scenario

**Scenario**: an agent handling 10,000 customer-service conversations a day (1,500 input tokens and 500 output tokens each, on average), currently running on GPT-4o, migrating to gpt-6-luna with reasoning effort set to none to keep output behavior close to the old model.

| | GPT-4o (old) | gpt-6-luna (new) | Monthly savings |
|---|---|---|---|
| Input cost/month (450M tokens) | $1,125 | $45 | $1,080 |
| Output cost/month (150M tokens) | $1,500 | $75 | $1,425 |
| **Total** | **$2,625/month** | **$120/month** | **$2,505 (↓95.4%)** |

That table assumes effort none and roughly the same output token count as the old model. Leave gpt-6-luna at its default medium effort instead, and it generates a block of reasoning text before the actual answer — billed as output, out of the same token budget. The real savings come in below 95.4%, and replies take longer to start.

## Impact on Developers and Enterprises

### Who benefits most

Workloads with a low output ratio and simple tasks — classification, extraction, fixed-format conversion — benefit the most, because they can set effort to none and capture close to the full discount in the table without eating the reasoning latency. Teams that built GPT-4o into a customer-service bot valued for being fast and terse will see the opposite if they migrate with the default reasoning left on: replies slow down, and token counts stop matching the monitoring thresholds tuned for the old model.

### How the competitive landscape shifts

Here's where gpt-6-luna lands in the current entry-tier pricing ranking (USD per 1M tokens, snapshot dated 2026-10-15):

| Model | Input | Output | Note |
|---|---|---|---|
| **GPT-6 Luna (migration target)** | **$0.10** | **$0.50** | OpenAI's cheapest text model |
| Claude Haiku 5.5 | $0.10 | $0.50 | Exact match for GPT-6 Luna |
| Gemini 3.8 Flash | $0.75 | $3.75 | Promotional price through 2026-12-31, then $1.50/$7.50 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | Mid-tier flagship |
| GPT-6.1 Sol | $2.00 | $10.00 | Mid-tier flagship, matches Sonnet 5.5 |
| GPT-6 Astra | $10.00 | $50.00 | OpenAI's most expensive flagship |

GPT-6 Luna and Claude Haiku 5.5 now sit at exactly the same price — the first time the two labs' cheapest production-grade models have matched dollar for dollar. GPT-4o mini and GPT-4.1 mini used to trail Claude's Haiku line on price. This sunset notice effectively pulls OpenAI's entry tier level with Anthropic's.

### Recommended actions

- Query the `shutdown_date` field on the List models endpoint (`GET /v1/models`) for every model ID you call. A non-null value means it belongs on your migration list — faster than digging through usage dashboards.
- Third-party tools (chatbot builders, automation platforms) often hide the model choice behind a dropdown, and sometimes hold the API key themselves. Open each one and check which model it actually uses; where a vendor hides the model, ask them in writing for the model name and their own migration timeline.
- For calls that only classify, extract, or reformat: set reasoning effort to none, stay on Chat Completions, and swap the model — no architecture change needed.
- For calls that need tool use and want to keep reasoning: move to the Responses API with the default effort. More engineering work, usually a better result.
- Teams with existing fine-tunes: new fine-tuning jobs on these base models stop on January 6, 2027 — eight days before the shutdown itself. Retrain before that date if you need to.
- Two earlier dates in the same family are easy to miss: `gpt-4o-2024-05-13` (the original GPT-4o snapshot) and `gpt-4.1-nano` both shut down on October 23, 2026, with gpt-5.6-sol or gpt-5.6-luna as the recommended replacement — not gpt-6-luna, because that notice predates the GPT-6 line. Check for both IDs in the same inventory pass.

## Sunset Notice

⚠️ **Shutdown date**: 2027-01-14. GPT-4o (`gpt-4o-2024-08-06`, `gpt-4o-2024-11-20`), GPT-4o mini (`gpt-4o-mini-2024-07-18`), GPT-4.1 (`gpt-4.1-2025-04-14`), GPT-4.1 mini (`gpt-4.1-mini-2025-04-14`), and all their fine-tunes leave the API entirely; requests after that date fail outright. Migration guide: [OpenAI Deprecations](https://developers.openai.com/api/docs/deprecations).

## Today's Takeaway

This notice gives three months, half the six-month minimum OpenAI's own policy page sets for generally available models — and the page never explains why GPT-4o and GPT-4.1, both clearly "generally available" by any normal reading, got the shorter window. Tracking deprecations used to mean assuming the published notice period was a floor. This one is a reminder that a policy document states a minimum guarantee, not a guarantee of practice. The actual safeguard is a scheduled check against the `shutdown_date` field, not trust that OpenAI will always give the full six months.

## References

- [Deprecations | OpenAI API (the original shutdown notice)](https://developers.openai.com/api/docs/deprecations)
- [GPT-4o and GPT-4.1 Leave OpenAI's API on January 14, 2027 | Digital Applied](https://www.digitalapplied.com/blog/gpt-4o-gpt-4-1-api-shutdown-january-2027)
- [AI Token Prices 2026 — AI Model Pricing Compared | AI Pricing Guru (same-day snapshot for gpt-6-luna, Claude Haiku 5.5, Gemini 3.8 Flash, and others)](https://www.aipricing.guru/pricing/)
