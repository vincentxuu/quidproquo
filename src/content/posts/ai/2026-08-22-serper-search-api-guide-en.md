---
title: "Serper Search API Guide: Turn Google Results into Agent-Ready JSON"
date: 2026-08-22
category: ai
type: guide
tags: [serper, web-search, search-api, ai-agent]
lang: en
tldr: "Serper is a third-party Google SERP API: one POST request returns structured JSON such as organic, knowledgeGraph, and peopleAlsoAsk, but production code still needs optional-field validation, URL checks, retries, and source verification."
description: "A practical Serper Search API guide covering requests, result shapes, location and language, pagination, production validation, and boundaries with SerpAPI, Brave, Tavily, and Exa."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-serper-search-api-guide)

[Serper](https://serper.dev/) is a third-party Google SERP API. Your application sends a query to Serper; Serper obtains the Google Search Engine Results Page and turns organic results, the knowledge graph, People Also Ask, and other page sections into JSON.

That positioning matters: Serper **does not operate its own search index**, nor is it a semantic engine that indexes web pages itself. It is a programmable access layer for Google results. This makes it useful when an agent needs Google's result shape, while also making the response dependent on the query, locale, and current SERP layout.

This guide follows one request through the production path: send the request, recognize result shapes, control locale and pagination, and validate everything before it reaches a model. The information was checked on August 22, 2026. The examples follow Serper's official site and API playground; I did not benchmark latency or result quality with a paid account.

## Send the first Search request

Create an API key in the Serper dashboard and store it in a server-side environment variable. Never put the key in frontend code, examples, logs, or a Git repository.

```bash
export SERPER_API_KEY='<YOUR_SERPER_API_KEY>'
```

Search uses `POST https://google.serper.dev/search`, with at least `q` in the JSON body. This Node.js example requires no extra package:

```js
const response = await fetch("https://google.serper.dev/search", {
  method: "POST",
  headers: {
    "X-API-KEY": process.env.SERPER_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    q: "Astro content collections official documentation",
    gl: "tw",
    hl: "zh-tw",
    num: 10,
    page: 1,
  }),
});

if (!response.ok) {
  throw new Error(`Serper request failed: ${response.status}`);
}

const data = await response.json();
console.log(data.organic?.map(({ title, link }) => ({ title, link })));
```

`X-API-KEY` is a credential. Add it only in a server, worker, or controlled backend job. A direct browser request exposes it through developer tools. If a frontend needs search, call your own backend endpoint and have the backend forward only approved parameters.

## Result shapes: never assume every section exists

The Search example on [Serper's official site](https://serper.dev/) shows several top-level sections:

- `organic`: standard web results, commonly containing `title`, `link`, `snippet`, and `position`; some entries also carry `date`, `attributes`, or `sitelinks`.
- `knowledgeGraph`: Google's knowledge graph, which may contain a title, type, website, description, image, and attributes.
- `peopleAlsoAsk`: related questions with possible snippets, titles, and source links.
- `relatedSearches`: follow-up query strings.

Other endpoints have different primary arrays: `/images` returns `images`, while `/news` returns `news`. The official site also lists Maps, Places, Videos, Shopping, Scholar, Patents, and Autocomplete. These are distinct SERP types and should not be forced into one TypeScript interface.

For agents, `organic` is usually the most useful section. “Common,” however, does not mean “required.” A result may lack a snippet, an entire response may lack a knowledge graph, and Google can change its layout. Normalize the payload into your own minimal type before giving it to a model:

```ts
type SearchEvidence = {
  title: string;
  url: string;
  snippet?: string;
  position?: number;
};

function normalizeOrganic(payload: unknown): SearchEvidence[] {
  if (!payload || typeof payload !== "object") return [];
  const organic = (payload as { organic?: unknown }).organic;
  if (!Array.isArray(organic)) return [];

  return organic.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.title !== "string" || typeof row.link !== "string") return [];

    try {
      const url = new URL(row.link);
      if (url.protocol !== "https:" && url.protocol !== "http:") return [];
      return [{
        title: row.title,
        url: url.toString(),
        snippet: typeof row.snippet === "string" ? row.snippet : undefined,
        position: typeof row.position === "number" ? row.position : undefined,
      }];
    } catch {
      return [];
    }
  });
}
```

This conversion also reduces context use: the model receives only the fields needed for the task, not an entire SERP payload full of image URLs and unrelated attributes.

## Test location, language, and pagination together

There is no single global version of a search result. `gl` controls country or region, while `hl` controls interface language; use `location` when you need a more specific geographic context. For Traditional Chinese results in Taiwan, start with `gl: "tw"` and `hl: "zh-tw"`, then test the cities your product actually serves.

These values are not decoration. Local businesses, news, shopping, and ambiguous brand names can produce materially different results by location. In production, map each supported locale to an allowlisted parameter set instead of letting an agent invent arbitrary strings:

```ts
const searchLocales = {
  "zh-TW": { gl: "tw", hl: "zh-tw", location: "Taiwan" },
  "en-US": { gl: "us", hl: "en", location: "United States" },
} as const;
```

Use `page` to move beyond the first page and `num` to request a result count. Do not implement an unbounded “continue until empty” loop. An agent can spend a large query budget on an underspecified task, and later pages are often less useful. Fetch page one first; request another page only when evidence is insufficient and the task budget allows it.

Deduplicate pages with normalized URLs, not titles. Remove known tracking parameters such as `utm_*` and normalize host casing before comparing canonical URLs. Do not strip every query parameter: documentation versions and article identifiers can legitimately live in the query string.

## Production validation: a successful search is not verified evidence

HTTP 200 means Serper returned data. It does not mean the data is ready to support an answer. Production code needs at least four layers:

1. **Input limits:** cap query length, `num`, page count, and supported locales; reject empty queries.
2. **Response validation:** treat every SERP section as optional and accept only valid HTTP(S) URLs and correctly typed fields.
3. **Operational resilience:** retry network errors and retryable statuses with exponential backoff and jitter; do not blindly retry validation, authorization, or credit failures.
4. **Evidence handling:** use SERP snippets to select sources. For quotations, numbers, or full context, fetch the source page and store its URL, retrieval time, and actual supporting passage.

Caching is a product decision. Serper's FAQ says it queries Google in real time and does not cache results; that describes the provider, not a prohibition on application caching. Short-lived caching can suppress duplicate agent calls. News and price queries need shorter TTLs, and answers should show when retrieval occurred.

The privacy boundary matters too: query strings go to a third-party service. Do not concatenate names, email addresses, internal customer IDs, or unreleased project details into a query. Remove identifiers first. If the query itself is sensitive, do not send it to an external search API.

## Boundaries with SerpAPI, Brave, Tavily, and Exa

This is not an abstract scorecard. Start by identifying the data source and output shape you actually need:

| Tool | Core boundary | Start here when… |
|---|---|---|
| [Serper](https://serper.dev/) | Third-party Google SERP API returning normalized result sections | “I want simple JSON from Google results.” |
| [SerpAPI](https://serpapi.com/search-api) | SERP API with documentation for multiple engines and many engine-specific controls | “I need multiple engines or detailed control over a SERP vertical.” |
| [Brave Search API](https://api-dashboard.search.brave.com/app/documentation) | Search API backed by Brave's own web index | “I do not want Google SERPs as my data source.” |
| [Tavily](https://docs.tavily.com/documentation/about) | Agent-oriented Search, Extract, Map, and Crawl workflow | “I want one service to discover URLs, extract pages, and traverse sites.” |
| [Exa](https://docs.exa.ai/reference/search) | Own index and semantic/neural retrieval with page content delivery | “My query is a conceptual description, not just Google keywords.” |

Serper's advantage is a small, direct interface with the familiar shape of Google results. Its limitation is the same boundary: it is not a full-page extractor, it does not verify sources, and it does not offer the alternate perspective of an independent index. If the next agent step always reads pages, use Serper as the discovery layer and add a constrained fetch or extraction layer.

Pricing, credits, and latency change quickly. They are deliberately not part of the selection verdict here. As of August 22, 2026, Serper's official site lists top-up tiers, per-tier queries per second, and a typical response-time claim. Recheck the [current official offer](https://serper.dev/) before purchasing, then benchmark latency and result quality with your own query set.

## Overall

When the requirement is specifically “turn Google result pages into JSON an agent can process,” Serper is a clean starting point. A minimum production implementation should not dump `organic` directly into an LLM. Fix the locale and query budget, validate optional fields, normalize URLs, and fetch only the pages that need to support claims.

If the real requirement is full-page research, semantic discovery, or independence from Google SERPs, choose Tavily, Exa, or Brave at the architecture stage instead of expecting a SERP API to become a crawler, index, and fact checker. Continue with this site's [Tavily Search API guide](/posts/ai/2026-08-21-tavily-search-api-guide-en), [Exa neural search guide](/posts/ai/2026-08-21-exa-neural-search-for-agents-en), and [guide to writing agent search queries](/posts/ai/2026-08-22-agent-search-query-writing-en).

## References

- [Serper official site, API examples, endpoint types, plans, and FAQ](https://serper.dev/)
- [SerpAPI official Search API documentation](https://serpapi.com/search-api)
- [Brave Search API official documentation](https://api-dashboard.search.brave.com/app/documentation)
- [Tavily official documentation: About](https://docs.tavily.com/documentation/about)
- [Exa Search API official documentation](https://docs.exa.ai/reference/search)
