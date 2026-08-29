---
title: "TinyFish: Free Search and Fetch Infrastructure for AI Agents"
date: 2026-08-29
category: ai
tags: ["tinyfish", "web-scraping", "search-api", "fetch-api", "ai-agent"]
lang: en
tldr: "TinyFish provides four web APIs for AI agents: Search, Fetch, Agent, and Browser. Search and Fetch are permanently priced at $0 with no credit card requirement, making them a practical default layer for RAG and document retrieval."
description: "A practical guide to TinyFish, its four APIs, the free Search and Fetch tier, rate-limit boundaries, code examples, and how it compares with Firecrawl, Tavily, and self-hosted Playwright."
series:
  name: "搜尋與爬取實戰"
  order: 15
draft: false
---

> Chinese version: [TinyFish 介紹：為 AI Agent 設計的免費 Search 與 Fetch 基礎設施](/posts/ai/2026-08-29-tinyfish-search-fetch-free-tier)

Most AI-agent workflows start with two primitive operations: find the right URL, then read the page cleanly. TinyFish is infrastructure for exactly those two steps. In May 2026, it made its two most common APIs, Search and Fetch, free for every developer and every agent surface. The platform supports REST APIs, MCP, Python and TypeScript SDKs, CLI usage, and integrations such as n8n and Dify. One `X-API-Key` is enough to start.

This article explains what TinyFish is solving, how the API surface is designed, how the free tier actually works, and when it makes more sense than Firecrawl or a self-hosted Playwright stack.

## What TinyFish Does

The short version: TinyFish makes browsing infrastructure free, then charges for higher-level automation.

Its public platform exposes four endpoints:

- **Search**: finds URLs. `GET https://api.search.tinyfish.ai` returns rank-stable structured JSON with `title`, `snippet`, `url`, and `position`. It supports `location`, `language`, `include_domains`, `exclude_domains`, `recency_minutes`, `after_date`, `before_date`, `domain_type` (`web`, `news`, `research_paper`), and a `purpose` intent parameter.
- **Fetch**: reads pages. `POST https://api.fetch.tinyfish.ai` sends URLs through TinyFish's Chromium cluster, renders the page, strips navigation, cookie banners, scripts, and other boilerplate, then returns clean `markdown`, `html`, or `json`. It supports batches of up to 10 URLs, `ttl` caching, `include_selectors`, `exclude_selectors`, and conditional requests with `etag` and `last_modified`.
- **Agent**: operates pages. You provide a URL and a natural-language `goal`; TinyFish's hosted agent can click, fill forms, log in, and return structured results. This is billed per step.
- **Browser**: hosts browser sessions. It opens a remote browser session controllable over Playwright/CDP, useful for authenticated flows and anti-bot-sensitive workflows. This is billed per minute.

This piece focuses on Search and Fetch because those two free endpoints already cover most daily agent workloads: RAG retrieval, document checking, price monitoring, news tracking, and lightweight research.

## Why Free, And Why Rate-Limited

TinyFish does not use the common "1,000 credits per month" model for Search and Fetch. It uses per-minute rate limits. Across the official blog, docs, and pricing page, the rationale is consistent:

1. **Basic browsing should not be the paid bottleneck**: Search is the entry point for agent work. TinyFish says it can offer the free layer because it runs its own browser infrastructure and keeps latency below half a second for Search.
2. **Fairness is easier with rolling rate limits**: Monthly quotas create a familiar failure mode: plenty of room early in the month, then a hard stop near the end. TinyFish instead sets 30 Search requests per minute and 150 Fetch URLs per minute. If you exceed the limit, you get `429` plus `Retry-After`; after backing off, you can keep going.
3. **Target-site failures should not become user cost**: Fetch failures often come from DNS, anti-bot systems, `404`s, or timeouts on the target site. TinyFish reports failed URLs in `errors[]`; those failures do not consume paid balance and do not break the rest of a batch.

On the pricing page, that maps to `Search Free -- 30 requests/min -- $0.00` and `Fetch Free -- 150 urls/min -- $0.00`. The docs also state that Search and Fetch do not draw from the wallet, even when the wallet balance is `$0`.

## First Request

The signup path is `agent.tinyfish.ai/api-keys`. Create an API key, send it as `X-API-Key`, and start calling Search or Fetch. TinyFish says no credit card, monthly plan, or minimum spend is required for those two APIs. Wallet balance matters only when you use Agent or Browser.

```bash
# Search: query plus optional region and language
curl "https://api.search.tinyfish.ai?query=web+automation+tools&location=US&language=en" \
  -H "X-API-Key: $TINYFISH_API_KEY"

# Fetch: up to 10 URLs; failed URLs go into errors[] without breaking the batch
curl -X POST https://api.fetch.tinyfish.ai \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://docs.tinyfish.ai/search-api"], "format": "markdown"}'
```

The Python and TypeScript SDKs follow the same shape:

```python
from tinyfish import TinyFish
client = TinyFish()  # reads TINYFISH_API_KEY
print(client.search.query(query="web automation tools").results[0].url)
print(client.fetch.get_contents(urls=["https://www.tinyfish.ai/"]).results[0].text[:500])
```

For MCP, point the client at `https://agent.tinyfish.ai/mcp`. The agent can then decide when to search and when to fetch.

Two practical details matter in production. For article extraction, use `include_selectors: ["article"]` with `exclude_selectors: [".comments"]` when the page structure is predictable. For incremental refresh, set `include_etag_and_last_modified: true`, persist the returned `etag`, and send it back with `if_none_match`; unchanged pages can return `not_modified: true`.

## Compared With Alternatives

| Option | Free-tier boundary | Strengths | Tradeoffs |
|---|---|---|---|
| **TinyFish Search/Fetch** | Usable with a $0 wallet, no monthly total quota, 30 req/min plus 150 URLs/min, failed URLs are free | Agent-friendly cleaned Markdown, batch Fetch, selector extraction, steady rate-limited usage | Hard `429` limit; you need queues and backoff for high volume |
| **Firecrawl** | Roughly 1,000 credits/month; search and scrape consume credits | Full-site crawling, structured extraction, self-hostable AGPL option | Higher cost for frequent retrieval; lower success on bot-protected pages in TinyFish's own comparison |
| **Tavily / Exa / Brave Search** | Usually monthly quotas or per-thousand pricing, with strong tuning controls | Research search, live news, domain weighting, depth controls | Sustained zero-cost usage is harder |
| **Self-hosted Playwright + proxy** | No API bill, high operational cost | Fully custom rendering and anti-bot strategy | You own anti-bot handling, IP rotation, cleanup, and token hygiene |

TinyFish's main difference is where cleanup happens. Navigation, scripts, cookie banners, and other boilerplate are removed before the result enters the context window, which reduces wasted tokens and custom cleaning code.

## Good Fit And Bad Fit

- **Good fit**: coding-agent documentation retrieval, RAG pipelines, price or earnings monitoring, news and paper tracking, student projects, independent developers without credit cards, and teams whose current bottleneck is "find it and read it cleanly."
- **Bad fit**: flows that start behind a login wall or require form filling, which fit the paid Agent API better; long-lived stealth browser sessions, which fit Browser; enterprise procurement that needs a legal commitment that pricing will never change.

## Is It Really Free?

Cross-checking the official blog, docs, and pricing page gives a clear boundary:

- **Free scope**: the blog says Search and Fetch are free for developers, agents, and surfaces; the docs say Search and Fetch are free.
- **Works at $0 balance**: the docs and blog both say Search and Fetch remain available even when the wallet balance is `$0.00`.
- **No card or plan required**: TinyFish says no credit card, monthly plan, or minimum spend is required. The minimum $10 top-up applies when you run paid Agent or Browser workloads.
- **Rate limits**: Search is limited to 30 requests per minute; Fetch is limited to 150 URLs per minute.
- **Rate, not monthly volume**: there is no monthly quota for Search and Fetch. `429` responses include rate-limit headers and `Retry-After`; after backing off, usage can continue.
- **Failed URLs are free**: failed Fetch URLs are reported through `errors[]` and do not count against cost.
- **No trial-expiry wording**: TinyFish has described Search and Fetch as free since its May 2026 announcement. The official text does not frame it as a limited trial.
- **Paid boundary is clear**: Agent and Browser draw from wallet balance. Older credit-era behavior and newer dollar-wallet errors may both matter when handling `402` or `403` responses.

## Limits And Practical Advice

- **Rate limits are hard boundaries**: high-volume jobs need queues and exponential backoff. For batches, spacing requests by one or two seconds is a reasonable starting point.
- **Fetch has batch and timeout limits**: a batch can include up to 10 URLs. One URL can run up to 110 seconds on the backend; the whole batch has a 120-second CDN ceiling. Set client timeouts around 150 seconds.
- **Route errors differently**: `402` should appear only on paid Agent or Browser usage. `429` with `details` usually means the per-minute limit was hit; `429` without `details` can mean upstream throttling or capacity pressure, so backoff is the right response.
- **API key is still required**: no key returns `401 MISSING_API_KEY`. A `$0` wallet balance does not block Search or Fetch.

## Bottom Line

TinyFish splits browsing from automation as a business model. Browsing is free within rate limits; automation pays for model, agent, and browser-session cost. For developers, the decision is not "do I have to pay before my agent can search?" The better question is whether the bottleneck is finding and reading pages or actually operating inside them. The former is free. The latter is where the paid APIs begin.

If your agent is still answering from model memory or relying on custom Playwright scripts for basic document lookup, Search and Fetch are a low-cost default retrieval layer.

> This article is part of the "搜尋與爬取實戰" series. For a broader free-tier comparison, see [Free Search, Scraping, and Browser APIs: How to Choose](/en/posts/ai/2026-08-21-free-search-scraping-tools-en), which compares quotas, reset rules, and overage behavior across providers.

---

## References

- [Search and Fetch are now FREE for every agent, everywhere!](https://www.tinyfish.ai/blog/search-and-fetch-are-now-free-for-every-agent-everywhere)
- [TinyFish Developer Documentation](https://docs.tinyfish.ai/)
- [Search API](https://docs.tinyfish.ai/search-api)
- [Fetch API](https://docs.tinyfish.ai/fetch-api)
- [Search API Reference](https://docs.tinyfish.ai/search-api/reference)
- [Fetch API Reference](https://docs.tinyfish.ai/fetch-api/reference)
- [Pricing](https://www.tinyfish.ai/pricing)
- [Error Codes](https://docs.tinyfish.ai/error-codes)
- [tinyfish-cookbook](https://github.com/tinyfish-io/tinyfish-cookbook)
- [TinyFish: The Best Free Firecrawl Alternative for AI Agents in 2026](https://www.bitdoze.com/tinyfish-free-firecrawl-alternative/)
- [Free Web Search for AI Coding Agents: TinyFish Setup Guide](https://bitdoze.com/tinyfish-free-search-coding-agents)
- [TinyFish makes Search and Fetch APIs free for all developers](https://testingcatalog.com/tinyfish-makes-search-and-fetch-apis-free-for-all-developers)
