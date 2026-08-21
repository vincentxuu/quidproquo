---
title: "Crawl4AI Complete Guide: From Markdown Crawling to Structured Extraction"
date: 2026-08-21
category: ai
type: guide
tags: [crawl4ai, web-scraping, crawler, llm, ollama, structured-output]
lang: en
tldr: "Crawl4AI handles retrieval after a URL is known: use JsonCssExtractionStrategy for stable DOMs, and switch to LLMExtractionStrategy only when extraction needs semantic judgment or must tolerate irregular layouts."
description: "A Crawl4AI v0.9.x guide to Markdown output, CSS and LLM extraction, an Ollama provider, CSS-first fallback, bounded deep crawling, caching, and failure handling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-crawl4ai-complete-guide)

[Crawl4AI](https://github.com/unclecode/crawl4ai) is an asynchronous crawler and scraper for AI workflows. Given a known URL, it launches a browser, retrieves the page, and returns Markdown, links, metadata, or structured JSON. It does not search the open web. If you do not know the URL yet, start with a search service or SearXNG.

This guide follows the v0.9.x documentation and the v0.9.2 interface as checked on August 21, 2026. Its spine is simple: retrieve usable content first, then transform it with the least expensive reliable method. To connect Crawl4AI to the search layer, see the [SearXNG and Crawl4AI integration guide](/posts/ai/2026-08-21-searxng-crawl4ai-setup-en).

## Crawl4AI Solves the Problem After the URL

A Crawl4AI request passes through four layers:

```text
URL
 └─ BrowserConfig: how the browser starts
     └─ CrawlerRunConfig: how this run fetches, waits, and caches
         └─ Markdown / extraction strategy: content or JSON output
             └─ CrawlResult: success, status_code, markdown, links, metadata, error
```

`BrowserConfig` controls headless mode, user agents, JavaScript, and browser lifecycle. `CrawlerRunConfig` controls extraction, caching, timeouts, and deep crawling for one run. Keeping them separate lets one browser session execute different retrieval strategies.

## Install It and Return Markdown

The shortest installation path in the official quick start is:

```bash
pip install -U crawl4ai
crawl4ai-setup
crawl4ai-doctor
```

The first request needs no extraction strategy:

```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig

async def main():
    browser = BrowserConfig(headless=True)
    run = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    async with AsyncWebCrawler(config=browser) as crawler:
        result = await crawler.arun("https://example.com", config=run)
        if not result.success:
            raise RuntimeError(f"{result.status_code}: {result.error_message}")
        print(result.markdown.raw_markdown)

asyncio.run(main())
```

The official [Quick Start](https://docs.crawl4ai.com/core/quickstart/) explains that `AsyncWebCrawler` uses Chromium by default and converts HTML into Markdown. Production code should not read `markdown` blindly. Check `success` first and preserve `status_code`, `error_message`, and the URL on failure.

## Raw Markdown and Fit Markdown Serve Different Jobs

`result.markdown.raw_markdown` is close to the complete page conversion. `fit_markdown` is the pruned result after a content filter. According to the official [Markdown Generation](https://docs.crawl4ai.com/core/markdown-generation/) guide, filtering can remove navigation, footers, and other noise, but it can also remove content near the edge of the main article.

Use them deliberately:

- Preserve raw Markdown for evidence, code, and links.
- Consider fit Markdown before sending content to an LLM or embedding model.
- Without a configured filter, do not assume `fit_markdown` exists or is better.

## Define One Output Contract First

A CSS schema and an LLM JSON Schema are different formats. The same dictionary cannot be passed to both strategies. Instead, validate both outputs with one Pydantic model:

```python
from pydantic import BaseModel, TypeAdapter

class Product(BaseModel):
    name: str
    price: str | None = None
    url: str | None = None

Products = TypeAdapter(list[Product])

def validate_products(raw: str) -> list[Product]:
    return Products.validate_json(raw)
```

This model is the downstream contract. Selectors and prompts may change without forcing storage, APIs, and tests to change with them.

## Deterministic Extraction with JsonCssExtractionStrategy

Use [JsonCssExtractionStrategy](https://docs.crawl4ai.com/extraction/no-llm-strategies/) first for stable listings, product cards, and documentation indexes. It has no model latency or token cost, and identical HTML produces repeatable output.

```python
import json
from crawl4ai import AsyncWebCrawler, CacheMode, CrawlerRunConfig
from crawl4ai import JsonCssExtractionStrategy

PRODUCT_CSS_SCHEMA = {
    "name": "Products",
    "baseSelector": "article.product",
    "fields": [
        {"name": "name", "selector": "h2", "type": "text"},
        {"name": "price", "selector": ".price", "type": "text"},
        {
            "name": "url",
            "selector": "a.details",
            "type": "attribute",
            "attribute": "href",
        },
    ],
}

async def extract_css(url: str):
    config = CrawlerRunConfig(
        cache_mode=CacheMode.ENABLED,
        extraction_strategy=JsonCssExtractionStrategy(PRODUCT_CSS_SCHEMA),
    )
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url, config=config)
    if not result.success:
        raise RuntimeError(result.error_message)
    return validate_products(result.extracted_content)
```

`baseSelector` locates repeated items and `fields` extracts text or attributes within each item. A missing selector should not immediately trigger an LLM call. Test the stored HTML fixture first to distinguish a site redesign, absent data, and JavaScript that has not loaded.

## Semantic Extraction with LLMExtractionStrategy and Ollama

Use [LLMExtractionStrategy](https://docs.crawl4ai.com/extraction/llm-strategies/) only when data is spread across prose, layouts change frequently, or a field requires semantic interpretation. Crawl4AI selects models through LiteLLM provider strings; Ollama can point at a local endpoint:

```python
from crawl4ai import LLMConfig, LLMExtractionStrategy

llm_strategy = LLMExtractionStrategy(
    llm_config=LLMConfig(
        provider="ollama/qwen3:8b",
        base_url="http://localhost:11434",
    ),
    schema=Products.json_schema(),
    extraction_type="schema",
    instruction="Extract every product. Preserve prices exactly as shown.",
    input_format="markdown",
    apply_chunking=True,
    extra_args={"temperature": 0},
)

async def extract_llm(url: str):
    config = CrawlerRunConfig(
        cache_mode=CacheMode.ENABLED,
        extraction_strategy=llm_strategy,
    )
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url, config=config)
    if not result.success:
        raise RuntimeError(result.error_message)
    return validate_products(result.extracted_content)
```

A local model removes the cloud API bill, not latency, memory usage, or malformed output. Before production, evaluate missing-field rates on fixed pages and record the model, version, and prompt. Parsing JSON successfully is not enough.

## Make the LLM a Conditional Fallback

Routing should respond to observable failure, not the idea that CSS is less intelligent:

```python
async def extract_products(url: str):
    try:
        rows = await extract_css(url)
        if rows and all(row.name.strip() for row in rows):
            return {"strategy": "css", "items": rows}
    except Exception as exc:
        css_error = str(exc)
    else:
        css_error = "empty_or_missing_required_fields"

    rows = await extract_llm(url)
    return {"strategy": "llm", "css_error": css_error, "items": rows}
```

This fallback still needs a ceiling: at most one LLM call per URL. Retry timeouts and transient service failures; preserve schema-validation failures as fixtures and repair the selector or prompt.

## Bound Deep Crawls Before They Start

The main risk in site-wide crawling is unbounded URL expansion through calendars, faceted navigation, and query parameters. The official [Deep Crawling](https://docs.crawl4ai.com/core/deep-crawling/) guide provides BFS, DFS, filter chains, and scorers. A minimum safe configuration limits domain, depth, and page count together:

```python
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy

def canonical_url(url: str) -> str:
    parts = urlsplit(url)
    query = urlencode(sorted(
        (k, v) for k, v in parse_qsl(parts.query)
        if not k.startswith("utm_")
    ))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query, ""))

config = CrawlerRunConfig(
    cache_mode=CacheMode.ENABLED,
    deep_crawl_strategy=BFSDeepCrawlStrategy(
        max_depth=2,
        max_pages=30,
        include_external=False,
    ),
)

async with AsyncWebCrawler() as crawler:
    results = await crawler.arun("https://example.com/docs", config=config)

unique = {canonical_url(result.url): result for result in results}
```

Production crawls should also use `filter_chain` to exclude login, search, calendar, and download paths. `canonical_url` is your ingestion key; it does not claim that the site declares the same canonical URL.

## Caching, Concurrency, and Failure Boundaries

Since v0.5, `CacheMode` has replaced the older boolean cache flags. Different official pages have historically described defaults differently, so these v0.9.2 examples always specify the mode: use `BYPASS` for fresh content and `ENABLED` when reuse is acceptable.

Use `arun_many()` for URL batches, but do not maximize concurrency blindly. Rate-limit per domain, honor `Retry-After` after `429`, and record HTTP errors, empty content, selector failures, and model-validation failures separately. Login requirements, CAPTCHAs, and access controls are not crawler errors that disappear after enough retries.

## When Crawl4AI Is the Wrong Tool

- For static HTML and article text only, Trafilatura or Readability is lighter.
- For large scheduled crawls with deterministic rules, Scrapy or Crawlee may offer more mature middleware.
- For forms, MFA, and multi-step interaction, use a browser agent rather than an extraction strategy.
- When the URL is unknown, search first; Crawl4AI is not a search engine.
- If you do not want to operate browsers, proxies, and workers, choose a hosted crawler and pay to reduce operational responsibility.

Crawl4AI's central tradeoff is not whether to use AI. It is the ability to keep deterministic and semantic extraction inside one crawler. Use selectors for stable DOMs and reserve models for judgments selectors cannot express. Fix the output contract, fallback conditions, and crawl budget first, or a convenient API becomes unbounded cost and irreproducible output.

## References

- [Crawl4AI repository](https://github.com/unclecode/crawl4ai)
- [Crawl4AI Quick Start](https://docs.crawl4ai.com/core/quickstart/)
- [Markdown Generation](https://docs.crawl4ai.com/core/markdown-generation/)
- [LLM-Free Extraction Strategies](https://docs.crawl4ai.com/extraction/no-llm-strategies/)
- [LLM Extraction Strategies](https://docs.crawl4ai.com/extraction/llm-strategies/)
- [Deep Crawling](https://docs.crawl4ai.com/core/deep-crawling/)
- [Cache Modes](https://docs.crawl4ai.com/core/cache-modes/)
- [Browser, Crawler and LLM Configuration](https://docs.crawl4ai.com/api/parameters/)
- [CrawlResult](https://docs.crawl4ai.com/api/crawl-result/)
