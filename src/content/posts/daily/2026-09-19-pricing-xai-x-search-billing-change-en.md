---
title: "Pricing Watch | xAI Switches X Search Billing to Per-Post on 9/21, Away from Flat Per-Call"
date: 2026-09-19
category: daily
type: digest
tags: [ai-agent, pricing, daily, xai]
lang: en
description: "Starting 2026-09-21, xAI's Grok API bills the X Search tool by posts and profiles actually returned ($5/1k posts, $10/1k profiles) instead of a flat $5 per 1,000 calls. Parent and quoted posts in a thread count too, so heavy users could see bills go up, not down."
tldr: "xAI's official pricing docs announced that starting 2026-09-21 12:00 PT, the Grok API's `x_search` tool switches from a flat $5 per 1,000 tool calls to $5 per 1,000 posts fetched plus $10 per 1,000 user profiles fetched — and parent/quoted posts returned inside a thread count toward that total. Other tools like `web_search` and `code_execution` stay at a flat $5 per 1,000 calls. Light queries that return only a handful of results are barely affected, but social-monitoring agents that pull full threads and average dozens of posts per query could see their bill go up, not down."
series:
  name: "AI Pricing Watch"
  order: 10
---

> 🌏 [中文版](/posts/daily/2026-09-19-pricing-xai-x-search-billing-change)

## Summary of Changes

xAI added a warning to the Tools Pricing section of its own API pricing docs: starting 2026-09-21 at 12:00 PM PT, the Grok API's `x_search` tool — used to search X posts, user profiles, and threads — drops its flat $5-per-1,000-calls rate in favor of $5 per 1,000 posts fetched plus $10 per 1,000 user profiles fetched. Parent and quoted posts pulled in alongside a thread count toward that total too. This isn't a model token price change — it's a redesign of how tool-call billing itself works, moving from "charge per query" to "charge per amount of data the query returns." Other tools in the same doc, like `web_search` and `code_execution`, keep their flat $5-per-1,000-calls rate; only `x_search` changed. In effect, xAI is shifting the cost of "one X Search query can surface an entire thread" from its own books onto developers.

## Before & After

| Item | Old | New | Effective |
|---|---|---|---|
| X Search (`x_search`) billing model | $5 per 1,000 tool calls (regardless of result count) | $5 per 1,000 posts fetched + $10 per 1,000 user profiles fetched | 2026-09-21 12:00 PT |
| What counts | Number of calls | Every post returned by a search or thread fetch (including parent/quoted posts), every profile returned by a user search | 2026-09-21 12:00 PT |
| Web Search (`web_search`) | $5 per 1,000 calls | Unchanged, $5 | — |
| Code Execution (`code_execution`) | $5 per 1,000 calls | Unchanged, $5 | — |
| File Attachments (`attachment_search`) | $10 per 1,000 calls | Unchanged, $10 | — |

## Cost Estimate

**Scenario**: A brand-monitoring agent on X that runs 2,000 `x_search` queries a day, averaging 15 posts returned per query (including parent/quoted posts pulled in from threads) plus 1 user profile — a common pattern for social monitoring, since making sense of a single post often means pulling in the whole surrounding thread.

| | Old billing ($5/1k calls) | New billing ($5/1k posts + $10/1k profiles) | Difference |
|---|---|---|---|
| Daily volume | 2,000 calls | 30,000 posts + 2,000 profiles | — |
| Daily cost | $10.00 | $150.00 + $20.00 = $170.00 | +$160.00/day |
| **Monthly cost (×30)** | **$300.00** | **$5,100.00** | **+$4,800.00 (↑1,600%)** |

That multiplier is extremely sensitive to how many results the average query returns. A workload that pulls only 3–5 posts per query and skips full-thread fetches would see a much smaller gap — possibly close to a wash. But any use case that needs full thread context can easily rack up dozens of posts per query, and at that point the bill scales with how much data comes back, not how many times you asked.

## Impact on Developers & Enterprises

### Who Wins, Who Takes the Hit

The hardest hit are social-listening and trend-analysis agents that use `x_search` to pull full thread context — the query count stays the same, but the bill is now set by how long the threads are, not how often you search. On the flip side, lightweight use cases — checking whether an account posted recently, or whether a keyword got mentioned — already return few results per call, and could end up cheaper under the new model than the old flat $5/1k rate.

### The Real Signal: Per-Query to Per-Data-Volume

The more interesting part of this change isn't the dollar amount — it's the direction. xAI just moved `x_search` from billing tied to query behavior to billing tied to how much data a query surfaces, which runs counter to how most AI vendors still price their search tools (flat per-call), and notably, xAI didn't apply the same change to its own `web_search` or `code_execution` tools this time. For developers, the lever for controlling cost shifts from "call the API less" to "ask for less data" — this tool now needs the same kind of usage discipline teams already apply to token budgets, just applied to "how many posts and profiles does this query actually need."

### Action Items

- If your agent uses `x_search` to pull full threads: before 9/21, check whether you actually need parent/quoted posts included, or whether the core post alone is enough — that decision now directly sets your bill under the new pricing.
- If you're only doing light single-post or single-account lookups: run the numbers against your current traffic pattern first. The new model may well be cheaper for you, and there's no need to rearchitect anything.
- If you run a high-volume social-monitoring service: estimate the monthly delta before 9/21 using your existing traffic (posts ÷ 1,000 × $5 + profiles ÷ 1,000 × $10), then decide whether to adjust query strategy or cap result counts once you see the exposure.

## Expiration Notice

⏰ **Effective date**: 2026-09-21 12:00 PT. From that point, `x_search` bills under the new model ($5 per 1,000 posts, $10 per 1,000 profiles). `web_search`, `code_execution`, and other tools stay at their existing flat rates.

## Takeaway

Pricing-change tracking usually assumes "a billing mechanism change" means a model's token price moved. This one changed the dimension the tool bills on instead — from "how many times you queried" to "how much data the query returned." That makes it much harder to answer "is this better or worse for me" with one sentence, because the same feature can be a price cut and a price hike at once depending on usage: with call count held constant, the direction of your bill now hinges entirely on a number that never used to show up on an invoice — average results returned per query. Tools billed this way need to be managed the same way teams already manage token spend, just with "query granularity" as the new variable to watch.

## References

- [Pricing | xAI Docs (original X Search billing announcement, Tools Pricing section)](https://docs.x.ai/developers/pricing)
- [Grok Pricing in 2026: API Costs and Calculator | Cognee](https://www.cognee.ai/grok-api-pricing)
- [Grok API: Pricing, Models, Features & How to Use? | Supergok](https://supergok.com/grok-api/)
