---
title: "Scrapling Complete Guide: From Adaptive Selectors to Concurrent Spiders"
date: 2026-08-21
category: ai
type: guide
tags: [scrapling, web-scraping, crawler, browser-automation, playwright, python]
lang: en
tldr: "Scrapling puts HTTP, Playwright browsers, CSS/XPath extraction, and a Spider API behind one Python interface. Adaptive selectors save element properties and relocate a target by similarity after a layout change, but the output still needs validation."
description: "Learn Scrapling installation, fetcher selection, CSS/XPath and adaptive selectors, sessions, proxies, concurrent Spiders, failure handling, and how it differs from Crawl4AI, AgentQL, and Scrapy."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-scrapling-complete-guide)

[Scrapling](https://github.com/D4Vinci/Scrapling) is a Python web-scraping framework. Its API covers plain HTTP fetchers, Playwright-driven browsers, a CSS/XPath parser, and a Spider that schedules multiple requests. Its distinctive feature is the adaptive selector: save an element's properties, then relocate that element by similarity after a site redesign.

This is not an AI extractor that understands every field from a URL. You still define the fields, selectors, validation rules, and crawl scope. Scrapling handles page retrieval, element location, and crawl expansion; your code owns the business meaning of the data. This guide follows the official documentation and the PyPI 0.4.14 interface available on the verification date. The examples were not used to measure success rates against protected sites.

## Choose the installation layer first

The [PyPI package page](https://pypi.org/project/scrapling/) lists Python 3.10 as the minimum version. Running only `pip install scrapling` installs the parser without the dependencies for fetchers, Spiders, or the CLI. Install at least the `fetchers` extra to retrieve pages:

```bash
python -m venv .venv
source .venv/bin/activate
pip install "scrapling[fetchers]"
scrapling install
```

The final command downloads browsers and their system components. Install `scrapling[shell]` for command-line extraction and the interactive shell, or `scrapling[all]` for every extra. This distinction is an easy source of failure: the official documentation says that importing `scrapling.fetchers` after a parser-only installation raises `ModuleNotFoundError`.

The CLI is useful for confirming a URL and selector before writing a full program:

```bash
scrapling extract get "https://example.com" page.md
scrapling extract get "https://example.com" title.txt --css-selector "h1"
```

The file extension selects the representation: `.md` produces Markdown, `.txt` extracts text, and `.html` preserves HTML. Use the library or a Spider for production pipelines that need schema validation, retries, and monitoring.

## Three retrieval paths: HTTP, a regular browser, and a stealth browser

The [fetcher selection guide](https://scrapling.readthedocs.io/en/latest/fetching/choosing.html) separates retrieval into three paths:

| Type | Best fit | Main cost |
| --- | --- | --- |
| `Fetcher` / `AsyncFetcher` | HTML is already in the response, APIs, and static pages | Does not execute JavaScript |
| `DynamicFetcher` | Content appears after JavaScript, scrolling, or clicking | Launches Chromium or Chrome, increasing memory and latency |
| `StealthyFetcher` | Browser flows that need additional fingerprint handling | More complex behavior and no cross-site success guarantee |

Start with the cheapest HTTP path. A `Fetcher` response is also a selector, so you can check the status and extract data directly:

```python
from scrapling.fetchers import Fetcher

page = Fetcher.get("https://quotes.toscrape.com/")
if page.status != 200:
    raise RuntimeError(f"unexpected status: {page.status}")

quotes = [
    {
        "text": item.css(".text::text").get(),
        "author": item.css(".author::text").get(),
    }
    for item in page.css(".quote")
]
```

The same page supports CSS, XPath, text search, and a BeautifulSoup-like `find_all`. The `::text` and `::attr(href)` pseudo-elements and chained selectors resemble Scrapy and Parsel, so existing selector knowledge transfers.

Switch to `DynamicFetcher` only for JavaScript-driven pages:

```python
from scrapling.fetchers import DynamicFetcher

page = DynamicFetcher.fetch(
    "https://example.com/app",
    wait_selector="main article",
    network_idle=True,
    timeout=30_000,
)
titles = page.css("main article h2::text").getall()
```

The [DynamicFetcher documentation](https://scrapling.readthedocs.io/en/latest/fetching/dynamic.html) also supports Playwright operations through `page_action`, remote-browser connections through `cdp_url`, and proxy, cookie, locale, and timezone settings. Do not enable every wait condition by default. Persistent connections and analytics may prevent `network_idle` from settling; a `wait_selector` that represents completed content is usually a better boundary.

## How adaptive selectors work

The [adaptive scraping documentation](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html) describes a two-phase workflow, not a fuzzy replacement for every selection:

1. When a selector works, save the matched element's properties with `auto_save=True`.
2. After that selector fails, use `adaptive=True` to find the most similar element.

```python
from scrapling.fetchers import Fetcher

Fetcher.configure(adaptive=True)
page = Fetcher.get("https://example.com/products")

# Initial deployment: verify the selector before saving its match
product = page.css("article#featured-product", auto_save=True)

# After a redesign: ask Scrapling to relocate the old target
product = page.css("article#featured-product", adaptive=True)
```

Scrapling stores element properties in SQLite by default and separates records by domain and identifier. CSS and XPath methods use the selector as the default identifier, but you can provide one explicitly. Saving again overwrites the previous record. Production code therefore cannot treat `adaptive=True` as unconditional correctness. If a price panel resembles a promotion card, the closest element may still be wrong for the business field.

Validate at least the result count, required fields, and data format. A price should use an expected currency, and a product URL should remain inside an allowed domain. Stop and alert on failure instead of saving the newly selected wrong element as the next baseline. Adaptive selection reduces maintenance after small layout changes; it does not remove selector regression tests.

## Sessions, proxies, and concurrency are separate controls

A one-off `Fetcher.get()` creates a temporary session. Reuse a `FetcherSession` for multiple requests to the same site so connections, cookies, and settings persist:

```python
from scrapling.fetchers import FetcherSession

with FetcherSession(impersonate="chrome", timeout=30) as session:
    index = session.get("https://example.com/products")
    detail = session.get("https://example.com/products/1")
```

The [HTTP fetcher documentation](https://scrapling.readthedocs.io/en/latest/fetching/static.html) also provides `ProxyRotator` for rotating proxies across a session. A proxy changes the network exit; it does not repair a selector, grant login permission, or make collection lawful. Rotation is not a substitute for respecting rate limits.

Move to a Spider when the job needs a queue, deduplication, callbacks, and output:

```python
from scrapling.spiders import Spider, Response

class CatalogSpider(Spider):
    name = "catalog"
    start_urls = ["https://example.com/products"]
    allowed_domains = {"example.com"}
    robots_txt_obey = True
    concurrent_requests = 4
    concurrent_requests_per_domain = 2
    download_delay = 1.0

    async def parse(self, response: Response):
        for card in response.css("article.product"):
            yield {
                "name": card.css("h2::text").get(),
                "url": card.css("a::attr(href)").get(),
            }

        next_url = response.css("a.next::attr(href)").get()
        if next_url:
            yield response.follow(next_url, callback=self.parse)

result = CatalogSpider().start()
result.items.to_json("products.json")
```

The [Spider architecture documentation](https://scrapling.readthedocs.io/en/latest/spiders/architecture.html) says that its scheduler handles priority, request fingerprints, and deduplication, while the session manager can route requests to HTTP or browser sessions. [Advanced Spider settings](https://scrapling.readthedocs.io/en/latest/spiders/advanced.html) add global and per-domain concurrency, download delays, AutoThrottle, checkpoints, and a development cache. One important default is `robots_txt_obey = False`; turn it on explicitly when the crawl should honor robots.txt.

## Treat anti-bot bypass as a project claim

The official [StealthyFetcher documentation](https://scrapling.readthedocs.io/en/latest/fetching/stealthy.html) lists headless fingerprint patches, canvas noise, WebRTC and CDP leak handling, and automation for Cloudflare Turnstile and Interstitial pages. Those are capabilities claimed by the project, not a guarantee for every URL, region, IP address, or account.

Anti-bot outcomes depend on the target's rules, browser version, IP reputation, request cadence, cookie state, and site changes. This guide did not run a protected-site success-rate test, so it does not repeat README speed or bypass benchmarks and does not promise that StealthyFetcher solves a CAPTCHA. Technical access also does not override authorization, terms of service, robots.txt, privacy obligations, or copyright.

A more observable fallback starts with HTTP. Upgrade to `DynamicFetcher` only when JavaScript content is demonstrably missing, and evaluate `StealthyFetcher` after identifying a fingerprint-related block. At each upgrade, record the status, wait boundary, response size, and failure type. Otherwise, browser retries become expensive and difficult to debug.

## Common failures and a useful check order

- **Import failure:** verify that `scrapling[fetchers]` is installed, and run `scrapling install` for browser modes.
- **HTTP 200 with no data:** inspect whether the response contains the content. If JavaScript loads it, use a browser or a legitimately available API.
- **Browser timeout:** replace generic `network_idle` with a concrete `wait_selector`, and check whether necessary resources were blocked.
- **Wrong adaptive match:** stop writes, inspect the saved identifier, domain, and old properties, then rebuild the baseline from representative pages.
- **Rate limits after adding concurrency:** reduce per-domain concurrency, add a delay, and enable robots.txt or AutoThrottle. Adding proxies should not be the first response.
- **Lost login state:** reuse a session, validate redirects and successful login, and do not treat a login page as an empty data page.

## Choosing between Crawl4AI, AgentQL, Scrapy, and Scrapling

| Tool | Core job | When it fits better than Scrapling |
| --- | --- | --- |
| [Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide-en) | Clean pages into Markdown, then extract with CSS or an LLM | The main output is clean LLM input, or the workflow needs a built-in LLM extraction strategy |
| [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en) | Locate data or Playwright elements through semantic queries | The DOM changes often, field intent stays stable, and an external semantic-query service is acceptable |
| [Scrapy](https://docs.scrapy.org/en/latest/) | Large rule-driven crawlers with extensible middleware and pipelines | The team already has Scrapy projects, integrations, or a mature deployment workflow |
| Scrapling | Switch between HTTP, browsers, adaptive selectors, and concurrent Spiders in one Python API | The goal is deterministic extraction with less integration across separate retrieval tools |

Scrapling is not a superset of all three. Its adaptive mechanism begins with a known correct element rather than AgentQL's free-form semantic location. It can emit Markdown, but its center of gravity is not Crawl4AI's LLM-ready content pipeline. Its Spider API is inspired by Scrapy. Existing middleware and deployment integrations are not automatically portable.

## Overall tradeoff

Scrapling's main tradeoff is using one framework for parsing, HTTP, browsers, and crawl scheduling. A single-page selector can grow into a multi-page crawler, and adaptive matching can reduce maintenance after layout changes. In return, you still govern fetcher selection, browser resources, similarity errors, and polite concurrency.

Start with the CLI or `Fetcher` on one public page, define an output schema, and build fixture tests for selectors. Then try `auto_save` and `adaptive` on one non-critical field. Add sessions, a Spider, and a stealth fallback only after the single-page flow can reliably distinguish correct data, incorrect data, and missing data.

## References

- [Scrapling official repository](https://github.com/D4Vinci/Scrapling)
- [Scrapling on PyPI](https://pypi.org/project/scrapling/)
- [Choosing a fetcher](https://scrapling.readthedocs.io/en/latest/fetching/choosing.html)
- [HTTP requests and sessions](https://scrapling.readthedocs.io/en/latest/fetching/static.html)
- [DynamicFetcher](https://scrapling.readthedocs.io/en/latest/fetching/dynamic.html)
- [StealthyFetcher](https://scrapling.readthedocs.io/en/latest/fetching/stealthy.html)
- [Adaptive scraping](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html)
- [Spider architecture](https://scrapling.readthedocs.io/en/latest/spiders/architecture.html)
- [Spider advanced usage](https://scrapling.readthedocs.io/en/latest/spiders/advanced.html)
- [Scrapy official documentation](https://docs.scrapy.org/en/latest/)
