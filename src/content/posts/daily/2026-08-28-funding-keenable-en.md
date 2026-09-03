---
title: "Funding Brief｜Keenable Seed $26M"
date: 2026-08-28
category: daily
type: digest
tags: [ai-agent, funding, daily, keenable, search-api]
lang: en
description: "Founded by a former Yandex search chief, Keenable emerges from stealth with a $26M seed to build web search infrastructure built for AI agents"
tldr: "Keenable came out of stealth with a $26M seed round led by Accel, with Conviction Partners participating. The bet isn't 'search that beats Google' — it's that AI agents query the web in a fundamentally different pattern than humans do, and need retrieval infrastructure designed from scratch around that."
series:
  name: "AI Agent Funding"
  order: 14
---

> 🌏 [中文版](/posts/daily/2026-08-28-funding-keenable)

## Funding Details

| Field | Value |
|---|---|
| Company | Keenable (Keenable.ai Inc., San Francisco, US) |
| Round | Seed |
| Amount | $26M |
| Lead investor | Accel (led by partner Zhenya Loginov) |
| Follow-on | Conviction Partners, plus angel investors from Amazon, ClickHouse, Databricks, Google, Snowflake, and SpaceX/xAI |
| Valuation | Undisclosed |
| Total raised | $26M (first round, out of stealth) |
| Founded | Undisclosed (emerged from stealth in August 2026) |
| Headcount | 15 (US and Europe), plans to double by year end |

## What This Company Does

Keenable is web search infrastructure built specifically for AI agents. Its thesis: existing search tools were designed for humans making occasional queries, while AI agents query at high frequency, in machine-like patterns, at a scale that can run into the hundreds of millions of requests — a fundamentally different infrastructure problem.

Founder Andrey Styskin previously ran Yandex's search, AI, and cloud division, leading an organization of more than 7,000 people and beating Google in the Russian market twice (desktop, then mobile). Co-founder Matthias Petri comes from Amazon AGI, where he worked with Styskin on the web retrieval infrastructure behind Alexa. Together they've built an independent web index spanning more than 100 billion documents, offering a low-latency search API, page-content retrieval, and an MCP interface — already, the company claims, in production use across training and inference workflows at several unnamed AI labs and inference providers. Its next product, a "Web Query Language," aims to let AI systems combine partial answers from multiple web sources into a single response, even when no one page contains the complete answer.

## What This Funding Signals

### Implications for the Agent Ecosystem

The timing lines up with a tightening supply of traditional search APIs: Microsoft retired the Bing Search API in August 2025, replacing it with a pricier, non-drop-in "Grounding with Bing Search" offering inside Azure AI Foundry, while Google has been narrowing its Custom Search API in favor of more bundled, selective partnerships. That leaves AI companies with fewer options for web-scale search, and independent index providers like Keenable, Exa, Brave, and Tavily are stepping into the gap. If the thesis holds — that agent query patterns genuinely differ from human ones and need dedicated indexes — competition in the search-API lane (watchlist section C1) shifts from "whose results are more accurate" to "whose cost structure for machine queries is more efficient."

### What Investors Are Betting On

Accel partner Zhenya Loginov's logic is straightforward: incumbents are tightening supply of web-scale search APIs, and AI companies already have few options. But the lane is already crowded with funded players — Exa, Brave, Perplexity, Tavily. Keenable landing Accel as a seed lead rests mainly on founder pedigree: Styskin built a 200-billion-document index at Yandex and is one of the few people who has actually beaten Google in a real market. This is a classic "bet on the people, not the product yet" seed round — the company itself admits index-building costs are "painfully expensive," and the business model's durability is still unproven.

### Numbers Worth Watching

- Building an independent index of more than 100 billion documents at the seed stage is unusual — it suggests the team invested significant resources into infrastructure before raising, rather than raising first and building later.
- Secondhand reports put Keenable's high-volume pricing around $1 per 1,000 queries — if accurate, that's 5-7x cheaper than Brave or Exa — but that figure comes from secondary sources, not a published rate card, and should be treated with caution.
- A 15-person engineering team running an index that claims production use inside multiple AI labs — the gap between headcount and the stated ambition ("the next Google for AI agents") is the main execution risk this round is meant to close.

## Watchlist Status

Keenable is not yet tracked in the watchlist. Recommend adding to section C1 (Search API / Answer Engine), alongside Exa, Tavily, Brave Search, and Perplexity, with tracking focus on: an independent web index built for agent query patterns, the $26M seed (led by Accel), and the in-development Web Query Language.

## Today's Takeaway

I'd assumed the "search infrastructure for AI" lane was already carved up by Exa, Brave, Tavily, and Perplexity, leaving little room for a new seed-stage entrant. Keenable's positioning is a reminder that those companies are still competing within the frame of "helping an agent find results a human would find satisfying." Keenable's bet changes the coordinate system entirely — not more accurate search, but an index redesigned from the cost structure up, on the premise that machine query frequency and intent granularity are simply different from human search. That's a route existing search engines can't retrofit their way into, and it's the actual reason Keenable thinks it can carve out space in a crowded lane.

## References

- [Accel-backed Keenable is indexing the web for AI agents](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/) — TechCrunch
- [Our Seed Investment in Keenable: Search Infrastructure for better AI Agents](https://www.accel.com/news/our-seed-investment-in-keenable-search-infrastructure-for-better-ai-agents) — Accel (official announcement)
- [Agentic web search infrastructure startup Keenable raises $26M](https://siliconangle.com/2026/08/25/agentic-web-search-infrastructure-startup-keenable-raises-26m/) — SiliconANGLE
