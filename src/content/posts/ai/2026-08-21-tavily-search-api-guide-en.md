---
title: "Tavily Search API Complete Guide: Search, Extract, Map, and Crawl"
date: 2026-08-21
category: ai
type: guide
tags: [tavily, web-search, ai-agent, search-api, web-scraping]
lang: en
tldr: "Tavily exposes Search, Extract, Map, and Crawl through one web API for agents. The free plan includes 1,000 credits per month; basic, fast, and ultra-fast Search cost 1 credit each, while advanced costs 2."
description: "Start with a Tavily Search call, then learn search depth, topics, full-page extraction, Map and Crawl, downstream evidence structures, retry behavior, credits, and query-data boundaries."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-tavily-search-api-guide)

[Tavily](https://docs.tavily.com/documentation/about) is a managed web-access service for AI agents. `Search` discovers sources and returns relevant snippets, `Extract` reads known URLs, `Map` discovers URLs within a site, and `Crawl` traverses a site while extracting content. The combination of these four endpoints is its main distinction from a conventional SERP API.

This article combines product orientation and implementation. It follows one retrieval task as its scope expands: start with Search, use Extract only when full content is needed, and move to Map or Crawl only when the task covers a site. It is based on official documentation checked on August 21, 2026. I did not call the credentialed paid API; the code and fields were checked against the API references, not tested for latency, relevance, or anti-bot success.

## Start with a controlled Search

Get an API key from the [Tavily dashboard](https://app.tavily.com/), then install the official Python SDK:

```bash
pip install tavily-python
export TAVILY_API_KEY='<YOUR_TAVILY_API_KEY>'
```

```python
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.search(
    query="What is the current stable Astro release? Use official sources only.",
    search_depth="basic",
    topic="general",
    max_results=5,
    include_domains=["astro.build", "github.com/withastro"],
    include_answer=False,
    include_raw_content=False,
    include_usage=True,
)

for item in response["results"]:
    print(item["title"], item["url"], item["score"])
```

The official [Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search) shows that each result can include a title, URL, relevant content, and score. Enabling `include_usage` adds credit consumption to the response. `include_answer=False` is an important starting point: preserve sources first and let your application decide whether to generate an answer instead of binding retrieval and synthesis immediately.

## Search depth, topic, and response content

`search_depth` affects content shape, the latency tradeoff, and credits. The [official guidance](https://docs.tavily.com/documentation/best-practices/best-practices-search) currently describes four depths:

| Depth | Returned content | Good starting use |
|---|---|---|
| `ultra-fast` | One page summary per URL | Low-latency UI hints |
| `fast` | Query-reranked snippets | Speed with targeted snippets |
| `basic` | Query-reranked snippets | Most general searches |
| `advanced` | Relevant snippets from broader search | Niche, recent, or multi-faceted questions |

Do not make `advanced` an unconditional default. Run the queries your application will actually ask with `basic`, then upgrade when source coverage is insufficient. `auto_parameters=True` can select parameters automatically, but the documentation says it may raise the depth to `advanced`. Set `search_depth` explicitly when predictable cost matters.

`topic` is a separate axis. Use `general` for broad web content and `news` for recent news; the API reference also lists `finance`. Apply `time_range` for relative recency or `start_date` and `end_date` for explicit dates. Use `include_domains` to constrain retrieval to trusted sources, and `exclude_domains` when a known site adds noise.

Search returns relevant snippets by default, not necessarily a complete page. Set `include_raw_content` to `"markdown"` to add cleaned page content to the same response, or use `"text"` for plain text. Tavily's [Search best practices](https://docs.tavily.com/documentation/best-practices/best-practices-search) recommend a two-step flow for comprehensive extraction: Search for URLs, then Extract selected pages. That makes token use, failures, and credits easier to control.

## Use Extract when the URL is known

Once you know which pages matter, do not search for them again. `Extract` accepts one or more URLs and returns Markdown or plain text. Failed URLs appear separately in `failed_results`, so one failure does not need to invalidate the entire batch.

```python
pages = client.extract(
    urls=[
        "https://docs.tavily.com/documentation/api-credits",
        "https://docs.tavily.com/documentation/rate-limits",
    ],
    extract_depth="basic",
    format="markdown",
    include_usage=True,
)

for page in pages["results"]:
    print(page["url"], page["raw_content"][:500])

for failure in pages["failed_results"]:
    print("failed", failure)
```

According to the [Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract), `advanced` attempts to retrieve more data, including tables and embedded content, but can add latency. Supplying a `query` reranks extracted chunks by intent; `chunks_per_source` then controls how many chunks are returned per page. Omit `query` when preserving full pages for later chunking. Use it when a small evidence set should go directly into agent context.

## Map first, then decide whether to Crawl

`Map` and `Crawl` both traverse links from a root URL, but return different artifacts:

- `Map` returns discovered URLs. Use it to inspect site structure and reject irrelevant paths.
- `Crawl` traverses and extracts pages. Use it for documentation sites, product catalogs, or retrieval datasets.

```python
site_map = client.map(
    url="https://docs.tavily.com",
    instructions="Find API reference and best-practice pages",
    max_depth=2,
    max_breadth=20,
    limit=50,
    select_paths=[r"/documentation/.*"],
    exclude_paths=[r"/documentation/integrations/.*"],
    allow_external=False,
    include_usage=True,
)

print(site_map["results"])
```

```python
crawl = client.crawl(
    url="https://docs.tavily.com",
    instructions="Extract pages about Search, Extract, Map, and Crawl",
    max_depth=2,
    max_breadth=20,
    limit=30,
    select_paths=[r"/documentation/api-reference/endpoint/.*"],
    allow_external=False,
    extract_depth="basic",
    format="markdown",
    include_usage=True,
)
```

Both the [Map API reference](https://docs.tavily.com/documentation/api-reference/endpoint/map) and [Crawl API reference](https://docs.tavily.com/documentation/api-reference/endpoint/crawl) provide `max_depth`, `max_breadth`, `limit`, and path rules. A safe starting point uses shallow depth, a small limit, and `allow_external=False`. Inspect the Map output, then pass the same selection rules into Crawl instead of allowing an unbounded traversal from the home page.

`instructions` is not free syntactic sugar. It uses natural language to decide which pages deserve traversal, and the official credit documentation assigns a higher mapping cost when instructions are present. Prefer `select_paths` and `exclude_paths` when the site's URL structure is stable. Add instructions when regular expressions cannot express the intent.

## Do not store only the answer

Tavily can generate an answer with `include_answer`, but production workflows should preserve traceable evidence. A minimal record should retain the query, source URL, title, content snippet, and retrieval score:

```python
from dataclasses import asdict, dataclass

@dataclass
class Evidence:
    query: str
    title: str
    url: str
    content: str
    score: float | None

query = "Tavily free plan credits"
response = client.search(
    query=query,
    search_depth="basic",
    max_results=5,
    include_answer=False,
)

evidence = [
    asdict(Evidence(
        query=query,
        title=item["title"],
        url=item["url"],
        content=item["content"],
        score=item.get("score"),
    ))
    for item in response["results"]
]
```

Only then should your own model produce a conclusion and citation URLs under a fixed JSON Schema. This separates what Tavily retrieved from how a model interpreted it, and it leaves the search provider replaceable. Treat score as a ranking hint within one response, not as an accuracy measure comparable across queries.

## Route errors before retrying

The [Search error responses](https://docs.tavily.com/documentation/api-reference/endpoint/search) distinguish several conditions: `400` means invalid parameters, `401` means a missing or invalid key, `429` means excessive request rate, `432` means a plan usage limit, `433` means a pay-as-you-go limit, and `500` means a server failure. They should not share one retry policy.

- `400` and `401`: fix the request or credentials; an unchanged retry is useless.
- `429`: wait for the response's `retry-after` value, then retry with a cap.
- `432` and `433`: stop calls and alert the budget or account-management path.
- `500`: use exponential backoff with jitter and an overall deadline.

The official [rate-limit documentation](https://docs.tavily.com/documentation/rate-limits) explicitly says `429` includes `retry-after`. Batch search should still cap concurrency and attach each failure to its query, rather than allowing one exception in `asyncio.gather` to cancel the batch.

## Free credits and actual billing units

The [official credit documentation](https://docs.tavily.com/documentation/api-credits) lists 1,000 monthly credits on the free Researcher plan with no card required. Credits reset on the first day of each month. Requests stop when they are exhausted unless the account upgrades or enables billing. This is a monthly usage allowance, not an accumulating cash balance.

| Operation | Credits |
|---|---:|
| Search `basic`, `fast`, or `ultra-fast` | 1 per request |
| Search `advanced` | 2 per request |
| Extract `basic` | 1 per 5 successful URLs |
| Extract `advanced` | 2 per 5 successful URLs |
| Map without instructions | 1 per 10 successful pages |
| Map with instructions | 2 per 10 successful pages |
| Crawl | Map cost plus Extract cost |

The published pay-as-you-go price is USD 0.008 per credit. Do not estimate production cost by counting API calls alone: one Crawl accumulates charges based on successfully mapped and extracted pages. Enable `include_usage`, record the endpoint and query, then forecast from a week of representative traffic.

## The privacy policy matters more than a ZDR slogan

Tavily's [FAQ](https://docs.tavily.com/faq/faq) lists zero data retention as a security feature. Its [Privacy Policy](https://www.tavily.com/privacy), updated in November 2025, is more specific: the platform collects query data and uploaded documents to provide retrieval, and unless a contract specifies otherwise, it may use portions of query data to improve future responses. The policy also says web information may come directly from third-party indexes or through third parties.

Do not infer from the FAQ alone that every account and API key receives zero retention. If queries can contain customer names, internal identifiers, unreleased product information, or personal data, verify the contract, DPA, processing regions, and exact ZDR scope first. Until then, the safest action is to keep sensitive data out of queries.

This is also the fundamental distinction between a managed Search API and a self-hosted route. SearXNG gives you control over the intermediary and its logs, but still sends queries to enabled upstream engines. Data that cannot leave the environment belongs in your own index, not with a different cloud search vendor.

## Choosing among Tavily, Exa, Linkup, and SearXNG

| Tool | Consider it first when |
|---|---|
| [Tavily](https://docs.tavily.com/documentation/api-reference/endpoint/search) | You want one API family for search, known-page extraction, and site traversal |
| [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents-en) | Neural retrieval, a proprietary web index, and semantic page discovery matter most |
| [Linkup](/posts/ai/2026-08-21-linkup-search-api-guide-en) | You want explicit standard/deep modes or direct JSON Schema output |
| [SearXNG](/posts/ai/2026-08-21-searxng-complete-guide-en) | You want self-hosted metasearch and upstream control, and can operate full-page fetching yourself |

This is not a performance ranking. I did not run the four services against a shared query set. For selection, build a small dataset of twenty real questions and record source hits, citation quality, latency, and credits. Route sensitive queries separately so an average score cannot hide the data boundary.

## Overall

Tavily's value is not merely another search endpoint. It puts URL discovery, known-page reading, site-structure discovery, and multi-page extraction under one authentication and credit model. A robust starting configuration is basic Search, five results, no answer, and no raw content. Extract only the selected URLs. Move to Map and Crawl only when the task genuinely spans a site.

This article does not verify crawl success against specific sites or benchmark the four Search depths for latency and relevance. Those claims require a fixed query set, synchronized runs, and a reproducible scoring method; they cannot be inferred from documentation. What is verified here is the API shape, public credit model, error semantics, and officially disclosed data boundary.

## References

- [Tavily Quickstart](https://docs.tavily.com/documentation/quickstart)
- [Tavily Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search)
- [Tavily Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract)
- [Tavily Map API reference](https://docs.tavily.com/documentation/api-reference/endpoint/map)
- [Tavily Crawl API reference](https://docs.tavily.com/documentation/api-reference/endpoint/crawl)
- [Search best practices](https://docs.tavily.com/documentation/best-practices/best-practices-search)
- [Credits and pricing](https://docs.tavily.com/documentation/api-credits)
- [Rate limits](https://docs.tavily.com/documentation/rate-limits)
- [Tavily FAQ](https://docs.tavily.com/faq/faq)
- [Tavily Privacy Policy](https://www.tavily.com/privacy)
- Related: [Exa neural search API](/posts/ai/2026-08-21-exa-neural-search-for-agents-en)
- Related: [Linkup Search API complete guide](/posts/ai/2026-08-21-linkup-search-api-guide-en)
- Related: [SearXNG complete guide](/posts/ai/2026-08-21-searxng-complete-guide-en)
