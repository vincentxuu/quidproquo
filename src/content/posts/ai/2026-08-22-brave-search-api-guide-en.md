---
title: "Brave Search API Complete Guide: An Independent Search Index for Agents"
date: 2026-08-22
category: ai
type: guide
tags: [brave-search, web-search, search-api, ai-agent]
lang: en
tldr: "Brave Search API exposes five endpoint families—Web, News, Images, Videos, and LLM Context—backed by Brave's own Web index and ranking models. Its core search is not merely a Google SERP wrapper."
description: "A practical guide to Brave's independent index, search endpoints and responses, freshness, locale, Safe Search, production validation, privacy, and the boundary with other agent search APIs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-brave-search-api-guide)

[Brave Search API](https://brave.com/search/api/) gives applications programmatic access to the Web index behind Brave Search. It does not scrape Google or Bing result pages and repackage them as JSON; Brave says its ordinary Web results use its own index and ranking models. An agent can therefore query a distinct search ranking rather than another wrapper around Google SERPs.

“Independent” should not be stretched into a claim that the entire product uses no third-party data. The official [Web Search documentation](https://api-dashboard.search.brave.com/app/documentation/web-search) explicitly says that rich results for sports, stocks, weather, and similar verticals integrate third-party APIs. The Web pages themselves are third-party content too. The precise claim is: **core Web Search uses Brave's own index and ranking models, while some enrichments can still use third-party data.**

## Choose the endpoint before writing the query

Brave provides more than one generic search route. Select by the output your application needs:

| Endpoint | Primary output | Good fit |
|---|---|---|
| [`/v1/web/search`](https://api-dashboard.search.brave.com/api-reference/web/search/get) | Ranked pages, titles, URLs, snippets, and possible additional result sections | Search interfaces, source discovery, and agents that own their post-processing |
| [`/v1/news/search`](https://api-dashboard.search.brave.com/api-reference/news/news_search/get) | News results with publication-related fields | News monitoring and recent events |
| [`/v1/images/search`](https://api-dashboard.search.brave.com/api-reference/images/image_search) | Images, thumbnails, source pages, and dimensions | Visual discovery; licensing still requires separate verification |
| [`/v1/videos/search`](https://api-dashboard.search.brave.com/api-reference/videos/video_search/get) | Video results and source information | Tutorial and video discovery |
| [`/v1/llm/context`](https://api-dashboard.search.brave.com/documentation/services/llm-context) | Text chunks grouped by URL and prepared for models | Grounding pipelines that send search content directly to an LLM |

Web Search normally exposes `title`, `url`, and `description` in `web.results`. With `extra_snippets=true`, each result can include up to five alternative snippets. LLM Context instead ranks and packages chunks for machine consumption, reducing the work required to assemble a grounding prompt. Choose Web for conventional ranked results and test LLM Context when the output is primarily model context.

## Make the smallest useful request

Create a subscription token in the dashboard and keep it in a server-side environment variable. Never embed the token in a post, browser bundle, mobile app, or public repository:

```bash
export BRAVE_SEARCH_API_KEY="replace-with-your-token"

curl --get 'https://api.search.brave.com/res/v1/web/search' \
  --data-urlencode 'q=Cloudflare Workers AI agent' \
  --data-urlencode 'count=5' \
  --data-urlencode 'country=TW' \
  --data-urlencode 'search_lang=zh-hant' \
  --data-urlencode 'safesearch=strict' \
  -H 'Accept: application/json' \
  -H "X-Subscription-Token: ${BRAVE_SEARCH_API_KEY}"
```

A Node.js backend should likewise read the environment variable and retain only the fields its downstream workflow needs:

```js
const params = new URLSearchParams({
  q: "Brave Search API independent index",
  count: "5",
  freshness: "pm",
  safesearch: "strict",
});

const response = await fetch(
  `https://api.search.brave.com/res/v1/web/search?${params}`,
  {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY,
    },
  },
);

if (!response.ok) {
  throw new Error(`Brave Search failed: ${response.status}`);
}

const body = await response.json();
const evidence = (body.web?.results ?? []).map((item) => ({
  title: item.title,
  url: item.url,
  snippet: item.description,
}));
```

This normalization layer matters. Do not make the model depend on the provider's entire response. Preserve the query, URL, title, snippet, retrieval time, and provider name so a run can be audited, replayed, or moved to another search service.

## Set freshness, locale, and Safe Search explicitly

According to the [Web Search API reference](https://api-dashboard.search.brave.com/api-reference/web/search/get), `freshness` accepts `pd`, `pw`, `pm`, and `py` for the past day, week, month, and year, plus a `YYYY-MM-DDtoYYYY-MM-DD` custom range. Page age is based on the most relevant date reported by the content, such as its publication or modification date, not necessarily when Brave fetched it. Open the source page and verify the date when checking regulations, prices, or software releases.

`country` influences the result country, `search_lang` expresses a content-language preference, and `ui_lang` controls the locale of interface strings in the response. They are not interchangeable. For a localized product, pass supported country and language values explicitly and test recall with representative queries.

Web Search defaults `safesearch` to `moderate`, while Image Search defaults to `strict`. A user-facing product should set this parameter explicitly instead of depending on a default that can change across endpoint or version. If spellcheck is enabled, record the altered query from the response so you know what the system actually searched.

## Production is more than receiving HTTP 200

Search results are candidate evidence, not factual verdicts. A production integration should at least:

1. Apply bounded exponential backoff to `429`, `5xx`, and timeout failures, with an overall deadline.
2. Paginate only when `query.more_results_available` is true instead of incrementing offsets blindly.
3. Validate the response schema, tolerate a missing `web` section or fewer results than `count`, and reject non-HTTP(S) URLs.
4. Open and cross-check primary pages for high-risk answers, preserving quotes and URLs because snippets may be truncated, stale, or missing context.
5. Treat user queries as sensitive: remove unnecessary names, account identifiers, internal codes, and confidential text before sending them.

Brave's [pricing page](https://brave.com/search/api/) charges by request volume and separates query rates and features by plan. Prices, free credits, and capacity change, so recheck the dashboard and plan page before deployment instead of freezing this article's snapshot into a purchasing model. The API reference also documents multiple error responses; clients must implement more than the success path.

## Privacy, retention, and content rights

Do not apply consumer Brave Search privacy claims directly to the API. Brave's [API privacy notice](https://api-dashboard.search.brave.com/privacy-policy), updated **2025-12-04**, says API query records are retained for at most 90 days for billing and troubleshooting. It says Brave does not collect identifiers that can link a query to an individual or device, while acknowledging that API customers may hold other data that can identify a user.

Your product must therefore disclose that queries are sent to Brave and obtain consent where applicable. The current [Search API Terms](https://api-dashboard.search.brave.com/documentation/resources/terms-of-service) assign end-user notice and consent obligations to the API customer. If zero data retention is required, do not infer it from the standard service: Brave lists Zero Data Retention as an Enterprise capability, whose scope should be confirmed contractually.

Returned URLs and snippets do not transfer rights in third-party content. Image downloads, full-page fetching, long-term storage, republication, and model training each require a separate review of plan rights and publisher terms.

## Where Serper, SerpAPI, Tavily, and Exa differ

| Tool | Core boundary | Prefer it when |
|---|---|---|
| [Brave Search API](https://brave.com/search/api/) | Brave's own index and ranking, with Web, News, Images, Videos, and LLM Context | Your agent needs a general Web source that is not a Google wrapper |
| [Serper](https://serper.dev/) | Positions itself as a Google Search API covering search, images, news, maps, shopping, and other Google result types | The product requirement is specifically to reproduce Google SERP structures |
| [SerpAPI](https://serpapi.com/) | Parses multiple search engines and vertical result types | One integration needs several established engines or specific SERP components |
| [Tavily](/posts/ai/2026-08-21-tavily-search-api-guide-en) | Adds Extract, Map, and Crawl to search | One API should discover URLs, read pages, and traverse sites |
| [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents-en) | Neural search and content retrieval for agent workflows | Queries are semantic discovery tasks and need page content rather than conventional SERPs |

This is not a quality ranking. Build a representative query set and compare source coverage, date accuracy, duplicates, latency, and cost per successful answer. If provider independence is an architectural requirement, Brave's own index is a concrete distinction. If the requirement is Google's local pack, shopping results, or a particular SERP component, Serper or SerpAPI has a closer product boundary.

## Overall

Brave Search API's clearest position is not merely “another inexpensive search API.” It lets applications use Brave's search index and ranking directly. Start with Web Search to retain auditable URLs and snippets; test LLM Context only when the model benefits from denser extracted chunks. Before production, implement freshness, locale, Safe Search, retries, data minimization, and source verification in code instead of leaving them to a prompt.

## References

- [Brave Search API product and pricing](https://brave.com/search/api/)
- [Brave Web Search documentation](https://api-dashboard.search.brave.com/app/documentation/web-search)
- [Brave Web Search API reference](https://api-dashboard.search.brave.com/api-reference/web/search/get)
- [Brave News Search API reference](https://api-dashboard.search.brave.com/api-reference/news/news_search/get)
- [Brave Image Search API reference](https://api-dashboard.search.brave.com/api-reference/images/image_search)
- [Brave Video Search API reference](https://api-dashboard.search.brave.com/api-reference/videos/video_search/get)
- [Brave LLM Context documentation](https://api-dashboard.search.brave.com/documentation/services/llm-context)
- [Brave Search independence announcement](https://brave.com/blog/search-independence/)
- [Brave Search API Privacy Notice](https://api-dashboard.search.brave.com/privacy-policy)
- [Brave Search API Terms of Use](https://api-dashboard.search.brave.com/documentation/resources/terms-of-service)
- [Serper official website](https://serper.dev/)
- [SerpAPI official website](https://serpapi.com/)
- Related posts: [Tavily Search API Complete Guide](/posts/ai/2026-08-21-tavily-search-api-guide-en), [Exa: Neural Search Built for Agents](/posts/ai/2026-08-21-exa-neural-search-for-agents-en), [Turning Search Results into Reliable Citations](/posts/ai/2026-08-22-search-results-reliable-citations-en)
