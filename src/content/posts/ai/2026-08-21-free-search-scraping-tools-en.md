---
title: "Choosing Free Search and Scraping Tools: Monthly Quotas, Trials, and Self-Hosting Costs"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, search-api, crawler, self-hosted, pricing]
lang: en
tldr: "Free plans fall into at least four models: recurring quotas, balance top-ups, one-time trials, and self-hosted software. Treating all four as a free tier produces the wrong long-term cost."
description: "A practical guide to the free plans behind search APIs, crawlers, browsers, and extraction tools, including resets, overages, card requirements, and self-hosting costs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-free-search-scraping-tools)

Pricing pages for search, scraping, and browser agents all like the word “Free.” Underneath, however, a plan may reset every month, grant credit only once, top a balance back up to a fixed amount, or merely let you download and run the software yourself. Those models have completely different long-term costs.

This article does not rank search quality or rewrite dozens of tool READMEs. It answers an earlier question that is easier to get wrong: **will the free usage you see today still exist next month?** Prices and quotas below were checked on August 21, 2026. Recheck the official pricing page before adopting any service.

## Separate the Four Meanings of Free

| Model | What it actually means | Examples | Best use |
|---|---|---|---|
| Recurring quota | A fixed allowance returns each billing period | [Tavily](https://docs.tavily.com/documentation/api-credits), [Firecrawl](https://www.firecrawl.dev/pricing), [SerpAPI](https://serpapi.com/pricing) | Sustainable low-volume services |
| Balance top-up | The remaining balance is restored to a ceiling rather than incremented | [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | Search prototypes with a bounded budget |
| One-time trial | Signup credits or limited-time access that does not return | [Serper](https://serper.dev/), [Zyte](https://www.zyte.com/pricing/), [Typesense Cloud](https://cloud-help.typesense.org/article/how-does-the-free-tier-work) | API validation and short benchmarks |
| Local or self-hosted | You run the software and receive no vendor API bill | [SearXNG](https://github.com/searxng/searxng), [Crawl4AI](https://github.com/unclecode/crawl4ai), [Qdrant](https://github.com/qdrant/qdrant) | Private data and stable workloads |

“$0/month” is not necessarily another kind of free. Some services charge no subscription but still require prepaid credits before the first request. That is a pay-as-you-go entry point, not a recurring allowance.

## Search APIs: Check Whether the Allowance Returns

When a workflow starts by sending a query to a search API, the first pricing question is not the per-request rate. It is how the free usage recovers.

| Service | Published free plan | Important constraint |
|---|---|---|
| [Exa](https://exa.ai/pricing?tab=api) | $10 in monthly credits plus a separate signup grant | Do not include signup credit in every month |
| [Tavily](https://docs.tavily.com/documentation/api-credits) | 1,000 monthly credits without a card | Endpoints and search depth consume different amounts |
| [Firecrawl](https://www.firecrawl.dev/pricing) | 1,000 monthly credits without a card | Search, scrape, and crawl share credits; unused credit does not roll over |
| [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | Eligible accounts have their prepaid balance topped back up to $20 monthly | Full requirements for professional email and `eligible accounts` are not public |
| [Brave Search API](https://brave.com/search/api/) | $5 in monthly credits | A card is required for fraud prevention |
| [Serper](https://serper.dev/) | 2,500 one-time signup queries | Not monthly; usage requires a top-up after exhaustion |
| [SerpAPI](https://serpapi.com/pricing) | 250 searches per month | Only successful searches count |

Linkup is the easiest one to misread. Its official wording says an eligible account is “top[ped] up back to $20” every month. That restores the balance to $20; it does not add $20 on top. If $7 remains at the end of a cycle, the next top-up is $13, not $20. The service uses prepaid credit and returns HTTP 429 at zero balance instead of creating an unbounded overage bill.

Another trap is a large one-time grant that looks better than a smaller recurring plan. Serper's 2,500 queries are useful for an initial evaluation, but multiplying 2,500 by twelve produces a fictitious annual capacity. Trials belong in the adoption budget, not steady-state capacity.

## Crawling, Extraction, and Browser Quotas Often Share a Pool

After discovering a URL, a workflow may still need a crawler, content extractor, or remote browser. Their units vary: requests, pages, credits, browser hours, or successful results.

| Service | Published free plan | What to verify |
|---|---|---|
| [Apify](https://apify.com/pricing) | $5 of platform usage per month | Actors, proxies, storage, and compute may draw from the same pool |
| [AgentQL](https://www.agentql.com/pricing) | 50 API calls per month on Starter; a separate trial includes 300 calls | Public pages do not fully specify card requirements, a hard cap, or browser-hour resets |
| [Browserbase](https://www.browserbase.com/pricing) | The Free plan lists browser time, agent runs, Search, and Fetch usage | Confirm session concurrency and product quotas in the current dashboard |
| [Diffbot](https://www.diffbot.com/pricing) | 10,000 monthly credits without a card | Extraction APIs may consume credits at different rates |
| [Jina Reader](https://jina.ai/en-US/reader/) | Basic keyless Reader access is rate-limited; new keys receive a separate one-time token grant | The token grant is not monthly |

AgentQL shows why Trial and Starter must not be merged into one row. The 300 calls belong to the trial; the persistent $0 Starter allowance is 50 calls per month. Its pricing page also lists included remote-browser time and an overage rate, but does not publicly spell out whether an account without payment details hard-stops or must upgrade. Before scheduling recurring jobs, verify the spending controls in the authenticated Billing screen rather than inferring “cannot charge” from `$0/monthly`.

Bright Data cannot be represented by one platform-wide number either. Its [Web Scraper](https://brightdata.com/pricing/web-scraper) and [MCP Server](https://brightdata.com/pricing/mcp-server) publish separate free allowances. The company's [billing FAQ](https://docs.brightdata.com/general/account/billing-and-pricing/faqs) also says that some Proxy and Web Unlocker capabilities may be restricted for personal-email accounts without a payment method. Free usage in one product does not make all proxy traffic under the account free.

## Open Source Moves the Bill Somewhere Else

[AutoScraper](https://github.com/alirezamika/autoscraper), [Trafilatura](https://github.com/adbar/trafilatura), and [Readability](https://github.com/mozilla/readability) do not have a monthly API quota because they are libraries executed in your environment. [Scrapy](https://github.com/scrapy/scrapy), SearXNG, Crawl4AI, Qdrant, and Meilisearch follow the same model at different layers of the stack.

That does not mean zero cost. A self-hosted pipeline has at least five bills:

1. Compute, storage, and backups.
2. CPU, memory, and concurrency for browsers.
3. Proxies, CAPTCHA handling, or remote browsers.
4. Model compute for LLM extraction and embeddings.
5. Engineering time for upgrades, alerts, and retries.

For a small tool making a few dozen requests per day, a SaaS allowance is often cheaper than maintaining a server. Self-hosting becomes attractive when data cannot leave the network, crawl volume is stable and high, or the team already operates VMs or Kubernetes.

## Three Starting Configurations You Can Use

### Validate the Need Without a Card

Use Tavily for search and Firecrawl for scraping; both publish recurring allowances without requiring a card. Start with 20 fixed questions and 20 fixed URLs instead of production traffic. Save queries, URLs, parameters, raw responses, and the observation date so the benchmark can be rerun after a provider changes its models.

### Keep Cost Behind a Hard Ceiling

Prefer plans that stop at exhaustion, then enforce a second daily budget inside your router. Do not rely only on a vendor dashboard. Before each call, check `daily_requests`, `monthly_credits`, and the task's `max_depth`. Return a recognizable budget error and choose a cheaper route when any limit is exceeded.

```ts
if (budget.monthlyCredits <= 0) return fallback("self-hosted-search");
if (task.depth > 2) return fail("crawl_budget_exceeded");

const result = await provider.search(query);
budget.record(result.usage);
return result;
```

### Keep Data Inside Your Network

Use [SearXNG](/posts/ai/2026-08-21-searxng-complete-guide-en) to discover public pages, [Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide-en) to fetch them, and Meilisearch or Qdrant for internal documents. This path has no vendor API quota, but you must define crawl budgets, access control, deletion propagation, and backups yourself. This site's [SearXNG and Crawl4AI integration guide](/posts/ai/2026-08-21-searxng-crawl4ai-setup-en) covers public-web acquisition; private documents should not be dropped into the same index without access controls.

## Run These Six Checks Before Choosing a Free Plan

1. Find `/month`, the trial duration, and credit expiry on the official pricing page.
2. Determine whether the plan adds a fixed amount or merely restores a balance ceiling.
3. Check whether failures, retries, and timeouts are billable.
4. Confirm whether exhaustion returns 429, suspends service, or enters pay-as-you-go billing.
5. Check whether a card is required and whether a hard spending cap exists.
6. Store the verification date in the decision record, then recheck before launch and every quarter.

The most sustainable free plan is not the one with the largest headline number. It is the one whose reset rules, overage behavior, and cost unit can all be controlled in code. Search quality still requires a separate benchmark: a pricing table can tell you whether a route is affordable, not whether its results are usable.

## References

- [Exa Pricing](https://exa.ai/pricing?tab=api)
- [Tavily API Credits](https://docs.tavily.com/documentation/api-credits)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Brave Search API](https://brave.com/search/api/)
- [Serper Pricing](https://serper.dev/)
- [SerpAPI Pricing](https://serpapi.com/pricing)
- [Apify Pricing](https://apify.com/pricing)
- [AgentQL Pricing](https://www.agentql.com/pricing)
- [Browserbase Pricing](https://www.browserbase.com/pricing)
- [Diffbot Pricing](https://www.diffbot.com/pricing)
- [Jina Reader](https://jina.ai/en-US/reader/)
- [Bright Data Billing and Pricing FAQ](https://docs.brightdata.com/general/account/billing-and-pricing/faqs)
- [SearXNG repository](https://github.com/searxng/searxng)
- [Crawl4AI repository](https://github.com/unclecode/crawl4ai)
- [Qdrant repository](https://github.com/qdrant/qdrant)
