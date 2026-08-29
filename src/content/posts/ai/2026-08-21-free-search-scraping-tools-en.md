---
title: "Choosing Free Search, Scraping, and Browser APIs: Recurring Quotas, Trials, and Self-Hosting"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, search-api, crawler, self-hosted, pricing]
lang: en
tldr: "Free access is not one model: recurring allowances, balance top-ups, rate-limited access, one-time credits, and self-hosting have different steady-state costs."
description: "A verified comparison of recurring quotas, rate limits, one-time trials, card requirements, overages, and self-hosting costs across search, scraping, and browser APIs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-free-search-scraping-tools)

Pricing pages for search, scraping, and browser agents all like the word “Free.” Underneath, however, a plan may reset daily or monthly, restore a balance to a ceiling, impose only an RPM limit, grant credits once at signup, or simply let you download the software. Those models have completely different long-term costs.

This article does not rank search quality or repeat dozens of product descriptions. It answers an earlier question that is easier to get wrong: **will the free usage you see today return in the next period?**

The data was first collected on August 21, 2026 and updated on August 22 using official pricing pages, documentation, and public plan details. Recheck the official page and authenticated Billing screen before adopting any service.

## First, Identify the Type of Free Access

| Model | How to identify it | Examples | Best use |
|---|---|---|---|
| Recurring allowance | The provider explicitly says daily, monthly, or billing cycle | [Tavily](https://docs.tavily.com/documentation/api-credits), [SerpAPI](https://serpapi.com/pricing), [Cloudflare Browser Run](https://developers.cloudflare.com/browser-rendering/pricing/) | Sustainable low-volume services |
| Balance top-up | The remaining balance is restored to a ceiling instead of incremented by a fixed amount | [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | Search prototypes with a bounded allowance |
| Persistent rate limit | There is no monthly credit pool, only an RPM or QPS ceiling | [Jina Reader](https://jina.ai/en-US/reader/), [TinyFish Search/Fetch](https://www.tinyfish.ai/blog/search-and-fetch-are-now-free-for-every-agent-everywhere) | Low-volume content reading and agent retrieval |
| One-time trial | Signup or trial credits do not return after exhaustion | [Serper](https://serper.dev/), [You.com API](https://you.com/docs/administration/billing), [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | API validation and short benchmarks |
| Local or self-hosted | There is no SaaS quota; the cost moves to compute, proxies, and operations | [SearXNG](https://github.com/searxng/searxng), [Crawl4AI](https://github.com/unclecode/crawl4ai), [Qdrant](https://github.com/qdrant/qdrant) | Private data and stable high-volume workloads |

`$0` does not prove that an API allowance exists, and a Free plan does not prove that its quota resets monthly. Count a quota as steady-state capacity only when the provider publishes a period. Otherwise, record the reset as unknown instead of multiplying it by twelve.

## Search APIs and MCP: Check Whether the Allowance Returns

| Service | Published allowance | Card, reset, and overage behavior |
|---|---|---|
| [Exa](https://exa.ai/pricing?tab=api) | A one-time $20 signup grant, then $10 in monthly credits | No payment method required; reset date, timezone, and rollover are not published |
| [Tavily](https://docs.tavily.com/documentation/api-credits) | 1,000 credits per month | No card; endpoints and search depth consume different amounts; exact reset date and rollover are not published |
| [Firecrawl](https://www.firecrawl.dev/pricing) | 1,000 credits per month | No card; Search, Scrape, and Crawl share credits; Free credits do not roll over and normal PAYG is unavailable, so users must upgrade |
| [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | $20 at signup with a professional email; eligible accounts are topped back up to $20 monthly | Prepaid balance; zero balance returns HTTP 429; eligibility and the exact top-up date are not fully published |
| [Brave Search API](https://brave.com/search/api/) | $5 in credits automatically applied each month | A payment card is required for fraud prevention; overage uses PAYG; rollover is not published |
| [SerpAPI](https://serpapi.com/pricing) | 250 successful searches per billing cycle | Resets when a new cycle starts; cached, failed, and errored searches do not count; Free rollover is not published |
| [Parallel](https://parallel.ai/blog/free-tier-parallel) | $5 in monthly credits for eligible organizations | A card is required; credits expire at month-end and do not roll over; overage is charged at standard rates |
| [You.com free MCP](https://you.com/docs/quickstart) | 100 keyless `you-search` queries per day | Search only; Contents, Research, and Finance are excluded; reset time and timezone are not published |
| [TinyFish Search/Fetch](https://www.tinyfish.ai/pricing) | Search 30 requests/min; Fetch 150 URLs/min | No card, no monthly minimum, and usable with a $0 Wallet balance; only Agent and Browser draw from Wallet funds |

Linkup is easy to misread. The official wording says an eligible account is topped **back to $20** each month. That restores the balance to a ceiling; it does not add another $20. If $7 remains when the top-up occurs, the grant is $13. The exact top-up date is not public, so it should not be described as a month-end settlement.

Parallel has a different risk. Its recurring grant is real, but the account must have a card and usage beyond $5 is charged at standard rates. Recurring free access is not the same as a hard stop; your router still needs its own spending cap.

## Browser and Scraping Credits Use Incompatible Cost Units

| Service | Published allowance | Most important constraint |
|---|---|---|
| [Apify](https://apify.com/pricing) | $5 in prepaid platform usage per month | Actors, proxies, storage, and compute share the pool; unused allowance expires at the end of the cycle |
| [AgentQL](https://www.agentql.com/pricing) | 50 API calls per month on Starter, plus 10 browser hours | Published overage is $0.02 per call and $0.12 per browser hour; hard-stop behavior without a payment method and the exact browser-hour reset are unclear |
| [Browserbase](https://docs.browserbase.com/account/billing/plans) | Monthly allocation of 1 browser hour, 3 Agents, 1,000 Search, and 1,000 Fetch; concurrency 3 | Reset date, rollover, and Free-plan exhaustion behavior are not published clearly |
| [Diffbot](https://www.diffbot.com/pricing) | 10,000 credits per billing period | Resets when a new billing period begins; APIs consume different amounts; Free exhaustion returns 429 |
| [Bright Data Free Tier](https://docs.brightdata.com/general/account/billing-and-pricing/free-tier) | 5,000 general Free Tier credits per month, renewed on the first day of the month | Web Unlocker, SERP, Web Scraper, and Scraper Studio share the general pool; the [MCP plan](https://brightdata.com/pricing/mcp-server) separately lists 5,000 requests per month, but public material does not prove whether the pools are shared or separate |
| [Browserless](https://www.browserless.io/pricing) | 1,000 units per month, 2 concurrent browsers, and sessions up to 1 minute | A browser connection costs 1 unit per 30 seconds; residential proxy traffic costs 6 units/MB, datacenter proxy traffic 2 units/MB, and a successful CAPTCHA 10 units; rollover and exhaustion behavior are not published |
| [Cloudflare Browser Run](https://developers.cloudflare.com/browser-rendering/pricing/) | 10 browser minutes per UTC day on Workers Free; concurrency 3 | Exhaustion returns 429 until the next UTC day; Paid includes 10 hours per month, then costs $0.09/hour, with session concurrency tracked separately |
| [ZenRows](https://www.zenrows.com/pricing) | 5,000 credits per month; concurrency 5 | No card, monthly refresh, no rollover, and no Free top-up; Fetch costs 1, JavaScript 5, premium proxy 10, and both together 25 credits |
| [Browser Use Cloud](https://browser-use.com/pricing) | 10 agent tasks per month; 3 concurrent sessions | Further usage uses top-ups or PAYG; browser, proxy, and token costs are separate; whether ordinary Free signup requires a payment method is not published |

Browserless demonstrates why headline quota is not enough. Its 1,000 units do not mean 1,000 arbitrary requests: connection time, proxy bandwidth, and CAPTCHA solving can all draw from the same unit system. A short session and a high-bandwidth job therefore have very different practical capacities.

Bright Data also cannot be summarized as “every product gets 5,000.” Several scraping products share the general Free Tier pool, while the MCP page describes its monthly plan in `requests`. Public documents do not establish whether those two allowances share a pool. Verify the authenticated billing dashboard and usage response before integration.

## One-Time Credits Belong in the Adoption Budget

| Service | One-time grant | Exhaustion, expiry, or other constraint |
|---|---|---|
| [Serper](https://serper.dev/) | 2,500 signup queries | Not monthly; further usage requires a top-up |
| [You.com API](https://you.com/docs/administration/billing) | $100 in complimentary API credits for new accounts, with no card | Not monthly; add funds after exhaustion; auto top-up is opt-in and separate from the keyless MCP's 100 daily searches |
| [SearchAPI.io](https://www.searchapi.io/pricing) | 100 successful signup requests, with no card | Only HTTP 200 responses count; refresh, expiry, and the zero-balance HTTP behavior are not published |
| [ScrapingBee](https://www.scrapingbee.com/pricing/) | 1,000 API credits, with no card | JavaScript rendering defaults to 5 credits; proxy options and some APIs cost more; expiry is not published |
| [Steel Cloud](https://docs.steel.dev/overview/pricinglimits) | $30 in usage credits valid for 90 days | Browser, proxy, CAPTCHA, and Browser Tools share the balance; proxy and CAPTCHA require a $10 paid balance for verification |
| [Zyte API](https://www.zyte.com/pricing/) | $5 for 30 days or the first billing month | Only successful responses are charged; the account is suspended after exhaustion or expiry |
| [Valyu](https://www.valyu.ai/pricing) | The pricing page lists $10 at signup, while separate official material says $20 with a work email; no card | Search, Answer, Contents, and DeepResearch share the balance; published retrieval and token billing descriptions conflict, so measure the returned API cost |
| [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | 5,000 credits, with no card | The official FAQ describes them as testing credits; a Free user must upgrade after exhaustion; expiry of unused credit is not published |
| [Bocha](https://aq6ky2b8nql.feishu.cn/wiki/RWdvw557Li3IJekGeLkcDFa3n1f) | A public promotion page listed a one-time package of 1,000 calls, with a possible second package via promo code | No recurring reset; current redemption and expiry require authenticated verification. Standard Web Search is CNY 36 per 1,000 calls; CNY 3.6 per 1,000 is a promotional resource package |

A large one-time grant is still not steady-state capacity. Serper's 2,500 queries, Hyperbrowser's 5,000 credits, and You.com's $100 are useful for the first evaluation. Multiplying any of them by twelve creates a budget that does not exist.

## Rate-Limited Access and Paid APIs Do Not Belong in a Quota Table

[Jina Reader](https://jina.ai/en-US/reader/) remains available without a key at 20 RPM; anonymous Jina Search is blocked. On a first website visit, an IP-eligible user may receive an automatically generated key with 10 million noncommercial tokens. An [official maintainer clarification](https://github.com/jina-ai/reader/issues/1256) says a manually created key is expected to start at zero. That welcome balance does not refresh periodically, and its expiry is not published.

[Perplexity Search API](https://docs.perplexity.ai/docs/getting-started/pricing) has no complimentary API credits. Free, Pro, and Max consumer subscriptions do not include API usage. Search API costs $5 per 1,000 successful requests, requires prepaid credits, and blocks the API key when the balance reaches zero.

[Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview) is closed to new customers. Existing customers retain 100 queries per day until the service shuts down on January 1, 2027. Google's free, ad-supported Standard Search Element is a client-side JavaScript widget, not a backend JSON API for an agent.

[TinyFish Search/Fetch](https://www.tinyfish.ai/blog/search-and-fetch-are-now-free-for-every-agent-everywhere) follows the same persistent-rate-limit model: Search allows 30 requests/min, Fetch allows 150 URLs/min, a $0 Wallet balance still works, and failed Fetch URLs do not count. The difference from Jina is scope. TinyFish runs pages through its Chromium infrastructure and returns cleaned Markdown, JSON, or HTML, so it is closer to a complete discovery-plus-reading layer for agents than a plain article reader.

TinyFish's paid boundary is also explicit: Search and Fetch are free, while Agent costs $0.016/step and Browser costs $0.002/min. In practice, public discovery and page reading can stay on the free rate-limited path; login, clicking, form filling, and long-lived browser sessions move into Wallet billing. Handle `429` carefully: a response with `details.limit` / `details.unit` means the account hit its per-minute limit and should respect `Retry-After` or upgrade; a response without `details` may indicate upstream throttling or capacity, so retry with backoff instead of treating it as a plan-limit problem.

## Open Source Moves the Bill Somewhere Else

[AutoScraper](https://github.com/alirezamika/autoscraper), [Trafilatura](https://github.com/adbar/trafilatura), and [Readability](https://github.com/mozilla/readability) have no monthly API quota because they run in your environment. [Scrapy](https://github.com/scrapy/scrapy), SearXNG, Crawl4AI, Qdrant, and Meilisearch follow the same model at different layers of the stack.

That does not mean zero cost. A self-hosted workflow has at least five bills:

1. Compute, storage, and backups.
2. Browser CPU, memory, and concurrency.
3. Proxies, CAPTCHA handling, or remote browsers.
4. Model compute for LLM extraction and embeddings.
5. Engineering time for upgrades, alerts, and retries.

For a small tool making a few dozen requests per day, a SaaS allowance is often cheaper than maintaining a server. Self-hosting becomes attractive when data cannot leave the network, crawl volume is stable and high, or the team already operates VMs or Kubernetes.

## Three Starting Configurations You Can Use

### Validate the Need Without a Card

Use Tavily for Search and Firecrawl for Scrape; both publish recurring allowances without requiring a card. If a remote browser is necessary, use Browserless monthly units for a small test. Start with 20 fixed questions and 20 fixed URLs instead of production traffic. Save the query, URL, parameters, raw response, and verification date so the benchmark can be rerun after a provider changes its models.

### Keep Cost Behind a Fixed Ceiling

Treat a plan as a cost ceiling only when the provider explicitly documents a hard stop or you have verified a spending cap in the authenticated Billing screen. Parallel and Brave can enter PAYG after the free allowance. Your router should still check `daily_requests`, `monthly_credits`, and the task's `max_depth` before every call, then switch to a cheaper route when any limit is exceeded.

```ts
if (budget.monthlyCredits <= 0) return fallback("self-hosted-search");
if (task.depth > 2) return fail("crawl_budget_exceeded");

const result = await provider.search(query);
budget.record(result.usage);
return result;
```

### Keep Data Inside Your Network

Use [SearXNG](/posts/ai/2026-08-21-searxng-complete-guide-en) to discover public pages, [Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide-en) to fetch them, and Meilisearch or Qdrant for internal documents. This path has no vendor API quota, but you must define crawl budgets, source permissions, deletion propagation, and backups. This site's [SearXNG and Crawl4AI integration guide](/posts/ai/2026-08-21-searxng-crawl4ai-setup-en) covers public-web acquisition; private documents should not enter the same index without access controls.

## Run These Six Checks Before Choosing a Free Plan

1. Find an explicit daily, monthly, or billing-cycle statement. Record the reset as unknown when none exists.
2. Determine whether the plan increments by a fixed amount, restores a balance ceiling, imposes a rate limit, or grants credit only once.
3. Check how failed requests, retries, timeouts, proxy traffic, and browser time are charged.
4. Confirm whether exhaustion returns 429, suspends service, requires an upgrade, or enters PAYG.
5. Check whether a card is required, whether a hard spending cap exists, and whether unused credit rolls over.
6. Store the source URL, verification date, and official wording; recheck before launch and every quarter.

The most sustainable free plan is not the one with the largest headline number. It is the one whose reset rules, overage behavior, and cost unit can all be controlled in code. Search quality still requires a separate benchmark: a pricing table can tell you whether a route is affordable, not whether its results are useful.

## Update Log

- 2026-08-29: Added TinyFish Search/Fetch's persistent free rate limit, $0 Wallet boundary, Agent/Browser paid boundary, and 429 handling distinction.
- 2026-08-22: Separated recurring allowances, persistent rate limits, and one-time trials; added Search, browser, and scraping services.
- 2026-08-22: Corrected Hyperbrowser's 5,000 credits to a one-time grant and revised the quota descriptions for Exa, Linkup, AgentQL, Browserbase, Bright Data, and Jina.
- 2026-08-22: Added Perplexity and Google Custom Search JSON API as counterexamples so consumer plans and frontend widgets are not mistaken for free APIs.

## References

### Search APIs and MCP

- [Exa Pricing](https://exa.ai/pricing?tab=api)
- [Tavily API Credits](https://docs.tavily.com/documentation/api-credits)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Brave Search API](https://brave.com/search/api/)
- [SerpAPI Pricing](https://serpapi.com/pricing)
- [Parallel Pricing](https://parallel.ai/pricing)
- [Parallel Free Tier Mechanics](https://parallel.ai/blog/free-tier-parallel)
- [You.com Quickstart and Free MCP](https://you.com/docs/quickstart)
- [TinyFish Search and Fetch are now free](https://www.tinyfish.ai/blog/search-and-fetch-are-now-free-for-every-agent-everywhere)
- [TinyFish Pricing](https://www.tinyfish.ai/pricing)
- [TinyFish Developer Documentation](https://docs.tinyfish.ai/)
- [TinyFish Error Codes](https://docs.tinyfish.ai/error-codes)

### Browser, Scraping, and Rate-Limited Access

- [Apify Pricing](https://apify.com/pricing)
- [AgentQL Pricing](https://www.agentql.com/pricing)
- [Browserbase Plans](https://docs.browserbase.com/account/billing/plans)
- [Diffbot Pricing](https://www.diffbot.com/pricing)
- [Diffbot Credits](https://www.diffbot.com/docs/credits)
- [Bright Data Free Tier](https://docs.brightdata.com/general/account/billing-and-pricing/free-tier)
- [Bright Data MCP Pricing](https://brightdata.com/pricing/mcp-server)
- [Browserless Pricing](https://www.browserless.io/pricing)
- [Browserless Unit Consumption](https://docs.browserless.io/overview/unit-consumption)
- [Cloudflare Browser Run Pricing](https://developers.cloudflare.com/browser-rendering/pricing/)
- [Cloudflare Browser Rendering Limits](https://developers.cloudflare.com/browser-rendering/platform/limits/)
- [ZenRows Pricing](https://www.zenrows.com/pricing)
- [Browser Use Cloud Pricing](https://browser-use.com/pricing)
- [Jina Reader](https://jina.ai/en-US/reader/)
- [Jina Reader Issue #1256](https://github.com/jina-ai/reader/issues/1256)

### One-Time Trials and Counterexamples

- [Serper](https://serper.dev/)
- [You.com API Billing](https://you.com/docs/administration/billing)
- [SearchAPI.io Pricing](https://www.searchapi.io/pricing)
- [ScrapingBee Pricing](https://www.scrapingbee.com/pricing/)
- [ScrapingBee API Credit Cost](https://www.scrapingbee.com/documentation/#api-credit-cost)
- [Steel Pricing and Limits](https://docs.steel.dev/overview/pricinglimits)
- [Zyte Pricing](https://www.zyte.com/pricing/)
- [Zyte API Pricing Details](https://docs.zyte.com/zyte-api/pricing.html)
- [Valyu Pricing](https://www.valyu.ai/pricing)
- [Hyperbrowser Pricing](https://www.hyperbrowser.ai/pricing)
- [Hyperbrowser Credit Rules](https://www.hyperbrowser.ai/docs/pricing)
- [Bocha Free Resource Package](https://aq6ky2b8nql.feishu.cn/wiki/RWdvw557Li3IJekGeLkcDFa3n1f)
- [Bocha API Pricing](https://aq6ky2b8nql.feishu.cn/wiki/JYSbwzdPIiFnz4kDYPXcHSDrnZb)
- [Perplexity API Pricing](https://docs.perplexity.ai/docs/getting-started/pricing)
- [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview)

### Self-Hosted Tools

- [SearXNG repository](https://github.com/searxng/searxng)
- [Crawl4AI repository](https://github.com/unclecode/crawl4ai)
- [Qdrant repository](https://github.com/qdrant/qdrant)
