---
title: "Tavily and Exa Can't Be Self-Hosted: How to Build Your Own"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, self-hosted, searxng, crawl4ai, open-source, tavily, exa]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 2
tldr: "Tavily and Exa are cloud-only APIs and can't be self-hosted. What you can assemble instead is SearXNG (269 upstream engines, 82 on by default) plus Crawl4AI (78.8k stars, Apache-2.0), and the ready-made Tavily-compatible wrappers are all still double-digit-star solo projects you should not depend on. But SearXNG has no index of its own, and running it from a datacenter IP gets you empty results — those two facts decide whether self-hosting is worth it."
description: "Why Tavily and Exa can't be self-hosted, what a SearXNG + Crawl4AI self-hosted stack actually consists of, why the ready-made wrappers are not usable yet, the state of open-source attempts at Exa-style owned indexes, and the datacenter-IP problem that sinks most deployments."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-self-hosted-search-stack)

[The previous post in this series](/posts/ai/2026-05-07-ai-search-mcp-tools-en) compared the search MCP servers an agent can plug into, but it carried an unstated premise: every one of them is a cloud API, so every query travels through someone else's servers and is billed per request. This post handles the other half — if you would rather not pay, or your data cannot leave your network, can you run your own?

Short answer: **neither Tavily nor Exa has a self-hosted version**, but roughly seventy percent of what they do can be reassembled from open-source parts. The remaining thirty percent cannot, and it happens to be the expensive part.

## The conclusion first

| What you want | Feasible on your own hardware? |
|---|---|
| Tavily's "query in, clean results out" API surface | ✅ Easy — one `docker compose` |
| Semantic ranking instead of a pile of SEO spam | ✅ Easy — a small local model suffices |
| Exa-style owned index with neural retrieval | ⚠️ Open-source analogues exist, orders of magnitude smaller |
| Full-web coverage with continuous recrawling | ❌ Not reproducible |

## There really is no on-premises option

Exa's Enterprise plan offers custom indexes, custom rate limits, SLAs, SOC 2, and Zero Data Retention — all still running on Exa's cloud, with a contractual promise not to retain your queries. A third-party review puts it plainly:

> Deployment & Data Residency: A hosted SaaS API with no self hosted or on premises option, but customizable zero data retention lets regulated buyers control how long queries and data persist.
> — Agentic Index, Exa Review, 2026-06-30

Tavily is likewise API-only, with no self-hosting path in its public documentation.

The reason is on Exa's own homepage: it claims to "crawl billions of documents per day", to run vector databases at "10k+ QPS", and to be "on track to exceed Google-scale traffic and index size in 2027". That is not a shape that fits in your server room. **What you can negotiate is contractual data residency, not machines you own.**

## Layer one: SearXNG plus a fetcher is your own Tavily

An entire cluster of projects already does this, all with the same architecture: **SearXNG finds, some fetcher reads, and FastAPI wraps it as Tavily-compatible `/search` and `/extract` endpoints.**

SearXNG is the core. Per the official documentation (2026.8.20 build):

> SearXNG supports 269 search engines of which 82 are enabled by default.

In other words it maintains no index of its own; it fans queries out to Google, Bing, DuckDuckGo, Brave, Mojeek and friends, then deduplicates and merges what comes back. 35.8k stars, AGPL-3.0.

On the fetching side the usual partner is [Crawl4AI](https://github.com/unclecode/crawl4ai) (78,805 stars, Apache-2.0), Python plus Playwright, returning Markdown directly:

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com",
            config=CrawlerRunConfig(cache_mode=CacheMode.BYPASS, scan_full_page=True),
        )
        print(result.markdown)

asyncio.run(main())
```

Remember to run `crawl4ai-setup` after installing — it provisions the Playwright browser, and skipping it means your first `arun()` fails with no Chromium found. For sites with stable markup, write a CSS schema with `JsonCssExtractionStrategy` at zero token cost; reach for `LLMExtractionStrategy` only when the markup varies, and point its provider at Ollama if you want the whole chain to stay inside your network.

The other option is self-hosting [Firecrawl](https://docs.firecrawl.dev/contributing/self-host) (170k stars, AGPL-3.0), though the official self-hosting docs are blunt about what is missing:

> Screenshots or page actions: Not available in the default stack. Fetch and Playwright both report no support; both require Fire-engine.

The Fire-engine anti-bot layer, screenshots, and page actions are all outside the default stack. Licensing matters too — AGPL means your integration code must be open-sourced if you offer it as a network service, compared in more detail in [the scraping tools landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en).

### The ready-made wrappers are not mature yet

Searching GitHub turns up a batch of "open-source Tavily alternatives" that package the whole stack, but **this layer is broadly immature** — most are solo projects with single- to double-digit star counts and no second maintainer. Fine to read for the architecture, not fine for production.

The most credible one is [searcharvester](https://github.com/vakovalskii/searcharvester) (256 stars, AGPL-3.0): one `docker compose up` brings up SearXNG plus trafilatura, it adds a `/research` deep-research endpoint, and it ships a prebuilt GHCR image. Even so, 256 stars means you should be prepared to maintain it yourself.

The underlying components, by contrast, all have real communities — SearXNG (35.8k), Crawl4AI (78.8k), [trafilatura](https://github.com/adbar/trafilatura) (6,673 stars, Apache-2.0). **The glue that joins those three is under three hundred lines, and writing it yourself is more controllable than depending on a wrapper that may stop being updated at any time.**

## Layer two: trying to reproduce Exa's owned index

Exa's real differentiator is not the API shape but the index it crawls itself and searches with embeddings. Open-source analogues do exist, but look at their actual state first:

- **[DawnSearch](https://github.com/dawn-search/dawnsearch)**: closest in design — indexes Common Crawl, embeds with all-MiniLM-L6-v2, uses USearch for vector search, written in Rust as a distributed P2P network. But it has **14 stars and its last push was 2023-08-14**. It is a dead project, useful only as a design reference.
- **[Marginalia Search](https://github.com/MarginaliaSearch/MarginaliaSearch)** (1,917 stars, Java): alive, still updated as of 2026-07. It explicitly supports running as your own white-label engine — the README says it "can both be run as a copy of Marginalia Search, or as a white-label search engine for your own data". The hardware bar is stated honestly: 32GB RAM will run it, but a production-like setup wants enterprise SSDs plus several extra terabytes for crawl data.
- **[YaCy](https://github.com/yacy/yacy_search_server)** (4,013 stars): the veteran P2P search engine, which can also be cut off from the network to serve as a pure intranet search appliance.

The shared hard limit is **freshness**. Common Crawl is a snapshot; crawling yourself is bounded by your bandwidth and your IP. You end up with an index whose semantic retrieval is decent but whose contents are stale — and continuous recrawling is precisely Exa's selling point. **The first thing a self-hosted version loses is the thing you were trying to buy.**

## Two problems that decide whether it pays off

**SearXNG has no index of its own.** It is a metasearch layer that still hits Google and Bing. So what "self-hosted" buys you is that queries do not pass through Tavily or Exa, are not metered, and are not rate-limited — **the upstream engines still see your query strings**. If your motivation is that query contents must not leave, this does not solve it; that requirement calls for indexing your own corpus.

**Nobody filters what you fetch.** A cloud API at least applies a layer of cleaning; once you self-host, what SearXNG returns and what Crawl4AI fetches lands in your agent's context as raw external content — and instructions hidden in a page get executed as instructions. This is not unique to self-hosting, but self-hosting makes you the only layer of defense. For where to draw that line, see [the same crack running through agent security](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en) — especially the lethal trifecta screen: private data, untrusted content, and outbound communication in one session means trouble.

**Datacenter IPs get shut out.** This is where most deployments fail. Someone who ran both variants wrote:

> Search engines treat datacenter IPs as presumed-guilty. From a hyperscaler range (AWS, GCP, the big Hetzner/OVH pools) SearXNG starts handing back empty results within a handful of queries; from a residential IP you look like a person.
> — Jingbiao, "Giving an Agent a Search Engine It Actually Owns", 2026-06-20

A small always-on box at home (mini-PC, NAS) on a residential IP works far better than a VPS. Insisting on the cloud means budgeting for a residential proxy and its upkeep, which frequently costs more than the Tavily bill it replaced. The fetching side has the same problem; for what to do once you are blocked, see [the Cloudflare bypass guide](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent-en).

## The overall shape

```
                  ┌─────────────┐
  query ─────────▶│   Your API   │  Tavily-compatible /search /extract
                  └──────┬──────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
     ┌─────────────┐          ┌──────────────┐
     │  SearXNG    │          │  Crawl4AI    │
     │ 269 engines │          │  Playwright  │
     └──────┬──────┘          └──────┬───────┘
            │                        │
            ▼                        ▼
   Google / Bing / DDG …      target sites (Markdown out)
   ⚠ queries still leave      ⚠ datacenter IPs get blocked

            └────────┬───────────────┘
                     ▼
        local reranker (FlashRank / model2vec)
                     ▼
        optional: Ollama summaries, nothing leaves the network
```

## Overall

Whether self-hosting pays off depends on which motivation you actually have:

- **You just do not want to pay or be rate-limited** → SearXNG + Crawl4AI on a small box with a residential IP. Best value by a wide margin.
- **You want the feel of semantic ranking** → add a local reranker and you have eighty percent of it, without imitating Exa's scale.
- **Your data cannot leave** → self-hosted search will not save you, because the queries still reach the upstream engines. Index your own corpus instead.
- **You need to beat hard anti-bot targets and want an SLA** → pay. Exa Enterprise's ZDR plus a DPA covers most compliance requirements, whereas self-hosting means owning the proxy and blocking problems yourself.

If you decide to build it, the next post is the step-by-step: [SearXNG + Crawl4AI, from zero to Claude Code](/posts/ai/2026-08-21-searxng-crawl4ai-setup-en).

The trade-off in one line: **you can own the interface and you can own the fetching, but you cannot own the index.** Work out which layer you actually need before starting that docker compose.

The next post returns to the tools themselves — how to choose among [34 open-source scrapers](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en); wiring all of it into a full research pipeline is covered in [the Local Deep Research walkthrough](/posts/ai/2026-05-08-local-deep-research-walkthrough-en).

## References

- [Crawl4AI](https://github.com/unclecode/crawl4ai) — 78,805 stars, Apache-2.0 (checked 2026-08-21)
- [SearXNG](https://github.com/searxng/searxng) — 35,834 stars, AGPL-3.0
- [SearXNG Configured Engines](https://docs.searxng.org/user/configured_engines.html) — 269 engines, 82 enabled by default
- [Firecrawl self-hosting docs](https://docs.firecrawl.dev/contributing/self-host) — self-hosted feature support table
- [trafilatura](https://github.com/adbar/trafilatura) — main-content extraction library
- [searcharvester](https://github.com/vakovalskii/searcharvester) — Tavily-compatible self-hosted API (256 stars, AGPL-3.0)
- [Marginalia Search](https://github.com/MarginaliaSearch/MarginaliaSearch) — self-hostable white-label search engine
- [YaCy](https://github.com/yacy/yacy_search_server) — P2P search engine and intranet search appliance
- [DawnSearch](https://github.com/dawn-search/dawnsearch) — Common Crawl semantic search (abandoned 2023)
- [Exa Pricing](https://exa.ai/pricing) — rates and Enterprise plan contents
- [Exa Enterprise](https://exa.ai/enterprise) — custom index and deployment details
- [Agentic Index: Exa Review](https://agenticindex.io/vendors/exa) — third-party deployment-option assessment
- [Giving an Agent a Search Engine It Actually Owns](https://jingbiao.me/2026/06/20/online-research/) — measured difference between datacenter and residential IPs
- On this site: [Search MCP Tools for AI Agents](/posts/ai/2026-05-07-ai-search-mcp-tools-en)
- On this site: [AI Web Scraping Tools Landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en)
- On this site: [Complete Guide to Bypassing Cloudflare Anti-Bot for AI Agents](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent-en)
- On this site: [Local Deep Research Walkthrough](/posts/ai/2026-05-08-local-deep-research-walkthrough-en)
