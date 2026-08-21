---
title: "Firecrawl Complete Guide: Choosing Scrape, Crawl, Map, and Structured Extraction"
date: 2026-08-21
category: ai
type: guide
tags: [firecrawl, web-scraping, crawler, structured-output, self-hosted, python]
lang: en
tldr: "Firecrawl puts single-page scraping, site discovery, whole-site crawling, and JSON extraction behind one API. Cloud removes browser, proxy, and worker operations; self-hosting gives infrastructure control, but not the complete Cloud feature set."
description: "Implement Firecrawl v2 Scrape, Crawl, Map, and JSON Schema extraction, then evaluate Cloud credits, self-hosting gaps, AGPL-3.0 boundaries, and the tradeoff against Crawl4AI."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-firecrawl-complete-guide)

[Firecrawl](https://docs.firecrawl.dev/advanced-scraping-guide) is a Web Data API. Give it a URL and it can return Markdown, links, HTML, screenshots, or structured JSON. Give it a domain and it can discover URLs first or crawl content across multiple pages. Its main difference from a crawler library is not merely another Markdown converter: it packages browsers, caching, proxies, job queues, and an API service together.

This guide reflects the Firecrawl v2 documentation checked on August 21, 2026. The examples use the official Python SDK and REST API, but I did not spend Firecrawl Cloud credits or start the full self-hosted stack. Endpoint shapes, quotas, and self-hosted capabilities below are documentation checks, not measured success rates or anti-bot tests.

## Choose the endpoint from the job

The common endpoint names answer different questions:

| Job | Endpoint | Result | Typical use |
|---|---|---|---|
| One known page, content needed | `scrape` | Markdown, HTML, links, JSON, and more | RAG ingestion, page parsing |
| A known URL list, processed in bulk | batch scrape | A scrape result for each URL | Recurring product or directory updates |
| A known site, unknown page inventory | `map` | A URL list | Scope review and crawl allowlists |
| Follow links and retrieve site content | `crawl` | An asynchronous job with page results | Documentation and knowledge-base imports |

`extract` needs a qualification. Firecrawl still exposes a multi-page structured extraction endpoint, but the official [extractor decision guide](https://docs.firecrawl.dev/developer-guides/usage-guides/choosing-the-data-extractor) marks it as “Use `/agent` instead.” For one known URL, use `scrape` in JSON mode. For cross-page discovery and extraction, new projects should evaluate `agent` instead of treating `/extract` as the default because an older tutorial does.

## Scrape: keep source material before transforming it

The shortest Python SDK path is:

```bash
pip install firecrawl-py
export FIRECRAWL_API_KEY="fc-YOUR-API-KEY"
```

```python
from firecrawl import Firecrawl

app = Firecrawl()
result = app.scrape(
    "https://example.com",
    formats=["markdown", "links"],
    only_main_content=True,
)

print(result.markdown)
print(result.metadata.status_code)
```

Markdown is the default format. Other choices include `html`, `rawHtml`, `links`, `images`, `summary`, and screenshots. `onlyMainContent` removes navigation and footers by default. Turn it off explicitly when you need full-page evidence; content removed by the filter is not automatically irrelevant.

Caching also needs an explicit policy. The advanced guide documents a two-day default for `maxAge`; set it to `0` when freshness requires a new fetch. Keep caching when pages rarely change to reduce repeated retrieval and latency. In either case, an ingestion pipeline should preserve `sourceURL`, HTTP status, retrieval time, and a content hash instead of storing only cleaned Markdown.

## Turn one page into a contract with JSON Schema

When the data is already on one known page, JSON mode avoids a separate scrape-then-LLM integration. A Pydantic model can generate the schema:

```python
from pydantic import BaseModel
from firecrawl import Firecrawl

class Product(BaseModel):
    name: str
    price: str | None = None
    in_stock: bool | None = None

app = Firecrawl()
result = app.scrape(
    "https://example.com/product/42",
    formats=[{
        "type": "json",
        "prompt": "Extract the product exactly as displayed.",
        "schema": Product.model_json_schema(),
    }],
)

product = Product.model_validate(result.json)
```

A schema constrains output shape; it does not prove correctness. A price may lose its currency, inventory may live behind an unopened component, and a model may mistake marketing copy for a field value. Validate types and required fields, and retain the source before sending records downstream. If stable DOM selectors can express the extraction, an LLM charge on every page may be unnecessary.

## Map: review scope before starting a Crawl

`map` discovers URLs without retrieving every page body. Use it to inspect the paths a crawl would encounter:

```bash
curl -X POST https://api.firecrawl.dev/v2/map \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "search": "api reference",
    "limit": 100
  }'
```

Store the result and sample account pages, search pages, calendars, and duplicate URLs with query parameters. If only a small allowlist matters, use batch scrape. A site root is not a sufficient reason to launch an open-ended crawl.

## Crawl: every asynchronous job needs a ceiling

`crawl` creates a job, discovers links, and applies scrape options to each page:

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "includePaths": ["^/guides/.*$", "^/reference/.*$"],
    "excludePaths": ["^/account/.*$"],
    "maxDiscoveryDepth": 2,
    "limit": 100,
    "scrapeOptions": {"formats": ["markdown"]}
  }'
```

Use the returned `id` with `GET /v2/crawl/{id}`. A response can contain a `next` URL while the job is in progress or when results exceed the response size, so consumers must not assume that the first payload is complete.

Do not omit `limit`. According to the official [Billing documentation](https://docs.firecrawl.dev/billing), crawl performs a pre-flight check against the requested limit. The default ceiling is 10,000 pages, so an account with fewer credits can receive `402` even when the target site would ultimately yield far fewer pages. Start with 20 or 100, inspect URL distribution, and expand deliberately.

## Cloud costs and failure boundaries

At the check date, base billing is one credit per scraped or crawled page and one credit per map call. JSON format adds four credits per page. A request can still be charged when Firecrawl infrastructure successfully processes it but the target returns `403` or `404`. Inspect `metadata.statusCode` before retrying instead of treating every empty result as transient.

Free accounts currently receive 1,000 credits. The official [Rate Limits](https://docs.firecrawl.dev/rate-limits) page lists 10 scrape and map requests per minute, two crawl requests per minute, and two concurrent browsers for the Free plan. Plans change; production capacity must come from the dashboard and queue status, not a snapshot copied from this article.

At minimum, separate these error classes:

- `402`: insufficient credits or crawl pre-flight capacity; reduce the limit or address the plan instead of retrying immediately.
- `429`: rate, concurrency, or queue limits; respect wait information and use exponential backoff.
- Target `401`, `403`, or `404`: repeated requests usually do not change access policy or a missing page.
- Firecrawl timeout or `5xx`: bounded transient retries are appropriate, with the job ID retained for diagnosis.

## Self-hosting is not “free Cloud”

The official [open-source versus Cloud comparison](https://docs.firecrawl.dev/contributing/open-source-or-cloud) draws a concrete boundary. The default self-hosted stack includes core scrape, crawl, map, search, fetch, and Playwright processing. LLM-backed formats need an OpenAI-compatible provider or Ollama. Agent, Browser, Interact, dashboards, enterprise controls, and some advanced anti-bot paths are Cloud capabilities; matching endpoint names do not imply identical support.

The self-host quickstart uses Docker Compose and serves the API on `localhost:3002`. The official [self-hosting guide](https://docs.firecrawl.dev/contributing/self-host) also says its evaluation setup disables authentication and does not provide durable storage, TLS, or high availability. Production still needs authentication, network controls, persistence, backups, monitoring, capacity planning, and upgrade and recovery procedures.

The main Firecrawl project is licensed under [AGPL-3.0](https://github.com/firecrawl/firecrawl/blob/main/LICENSE). That does not mean “commercial use prohibited,” nor can it be reduced to “calling the API open-sources your application.” However, AGPL section 13 addresses offering corresponding source when users interact over a network with a modified covered program. Whether components form a covered work and what obligations apply depend on the actual deployment and modifications. Have counsel review the architecture; a blog post is not a licensing opinion.

## Firecrawl or Crawl4AI

| Decision axis | Firecrawl Cloud | Self-hosted Firecrawl | Crawl4AI |
|---|---|---|---|
| Shortest path | Call an API after getting a key | Operate a multi-service stack first | Start a browser inside Python |
| Operations | Provider handles the main infrastructure | You own API, workers, queues, and data services | You own the program, browser, and concurrency |
| Structured extraction | Managed JSON mode and agent | Bring a model; support varies by service | CSS and LLM strategies live in code |
| Best fit | Shared API with less infrastructure work | Source and infrastructure control | Extraction policy controlled in a Python codebase |

The [Crawl4AI complete guide](/en/posts/ai/2026-08-21-crawl4ai-complete-guide) shows the code-first alternative: CSS-first extraction, LLM fallback, browser configuration, and extraction strategy can all be tested with the application. Firecrawl Cloud instead turns retrieval into a shared service across languages and agents. For a small set of known URLs, Crawl4AI is often more direct. For a shared API, asynchronous jobs, site crawling, and managed infrastructure, Firecrawl can exchange credits for operations time.

A useful first decision is small and repeatable: choose 20 fixed URLs and record Firecrawl status, Markdown, and credit use; run the same set through the crawler you already operate. Compare missing pages, latency, manual intervention, and operations time—not merely whether both produced Markdown.

## References

- [Firecrawl Advanced Scraping Guide](https://docs.firecrawl.dev/advanced-scraping-guide)
- [Firecrawl Python quickstart](https://docs.firecrawl.dev/quickstarts/python)
- [Choosing the Data Extractor](https://docs.firecrawl.dev/developer-guides/usage-guides/choosing-the-data-extractor)
- [Firecrawl Billing](https://docs.firecrawl.dev/billing)
- [Firecrawl Rate Limits](https://docs.firecrawl.dev/rate-limits)
- [Open source or Firecrawl Cloud](https://docs.firecrawl.dev/contributing/open-source-or-cloud)
- [Self-hosting Firecrawl](https://docs.firecrawl.dev/contributing/self-host)
- [Firecrawl AGPL-3.0 license](https://github.com/firecrawl/firecrawl/blob/main/LICENSE)
- [On this site: Crawl4AI Complete Guide](/en/posts/ai/2026-08-21-crawl4ai-complete-guide)
