---
title: "Linkup Search API Guide: From standard and deep to Structured Output"
date: 2026-08-21
category: ai
type: guide
tags: [linkup, web-search, ai-agent, search-api, structured-output]
lang: en
tldr: "Linkup separates search depth from response shape: start most agent queries with standard + searchResults, move to deep only for multi-step browsing, and treat the monthly $20 as a balance refill rather than a new $20 grant."
description: "A practical Linkup API guide covering search depth, sources and full-page content, JSON Schema, retries, prepaid balance, and the documented limits of its privacy and regional-processing claims."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-linkup-search-api-guide)

[Linkup](https://docs.linkup.so/pages/documentation/get-started/introduction) is a web search API built for AI applications. It can return more than URLs: an application can receive search context for a model, an answer with sources, or an object that follows a JSON Schema. This guide combines orientation with implementation: select the search depth, select the output, then handle full-page content, retries, and cost.

The key idea is that `depth` and `outputType` are independent axes. `depth` controls how much searching and page reading Linkup performs. `outputType` controls whether your code receives source material, a synthesized answer, or fixed fields. There is usually no reason to maximize both on the first call.

## Make the first search call

Create a Linkup API key, put it in an environment variable, and call the synchronous `/v1/search` endpoint:

```bash
export LINKUP_API_KEY='<YOUR_LINKUP_API_KEY>'

curl --request POST \
  --url https://api.linkup.so/v1/search \
  --header "Authorization: Bearer $LINKUP_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "q": "Find the official Linkup Search API documentation and summarize its three depth modes.",
    "depth": "standard",
    "outputType": "sourcedAnswer",
    "includeInlineCitations": true
  }'
```

Authentication uses `Authorization: Bearer <token>`. If you prefer a client library, install the official Python SDK:

```bash
pip install linkup-sdk
```

```python
from linkup import LinkupClient

client = LinkupClient()  # Reads LINKUP_API_KEY
response = client.search(
    query="Find the latest official release notes for Astro.",
    depth="standard",
    output_type="searchResults",
    include_domains=["astro.build"],
    max_results=5,
)
print(response)
```

## Choosing fast, standard, or deep

The [Search overview](https://docs.linkup.so/pages/documentation/endpoints/search/overview) documents three depths:

| Depth | Behavior | Good fit |
|---|---|---|
| `fast` (beta) | No LLM, query rewriting, or page reading | Low-latency, keyword-shaped lookups |
| `standard` | One agentic iteration, parallel sub-searches when useful, and one in-query URL | Most live Q&A and agent tool calls |
| `deep` | Multiple search, scraping, and evaluation iterations; later steps can reuse earlier findings | Following leads across several pages |

Use `standard` as the practical default. A query such as “NVIDIA Q4 2024 revenue” may fit `fast`. An instruction such as “find the official pricing page, read the product pages, then summarize the plans” needs `deep`. The official [best-practices guide](https://docs.linkup.so/pages/documentation/endpoints/search/best-practices) warns that `fast` treats the whole instruction as keywords; it does not understand “first A, then B.”

For `standard` and `deep`, phrase the prompt as a retrieval task. Instead of “tell me about this company,” name the pages to find, fields to extract, and desired presentation. Put time windows in `fromDate` and `toDate`, and use `includeDomains` or `excludeDomains` for source control. `includeDomains` accepts up to 100 domains.

## Three outputs for three downstream consumers

`outputType` decides who performs the final reasoning step:

- `searchResults` returns ranked sources and content snippets for your own LLM, reranker, or storage pipeline.
- `sourcedAnswer` asks Linkup to compose the answer. Enable `includeInlineCitations` when the result will be shown directly to a person.
- `structured` fills fields described by `structuredOutputSchema`, which is useful for application code.

Source objects include a name, URL, and text content. The outer response shape differs across outputs and SDK wrappers. Production code should follow the current [API reference](https://docs.linkup.so/pages/documentation/endpoints/search/reference) and SDK types instead of assuming every response has a `results` field.

When you already know the page and need its full content, do not stretch a Search snippet into a document. Call `/v1/fetch`, which returns cleaned Markdown. Enable `renderJs` only for a dynamic page:

```bash
curl --request POST \
  --url https://api.linkup.so/v1/fetch \
  --header "Authorization: Bearer $LINKUP_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "url": "https://docs.linkup.so/pages/documentation/endpoints/search/overview",
    "renderJs": false,
    "includeRawHtml": false,
    "extractImages": false
  }'
```

This creates a controllable pipeline: Search discovers candidate URLs, your code selects the pages that matter, and Fetch retrieves their full content. It is easier to manage cost and context than asking one search call to read everything.

## Deliver parseable data with JSON Schema

Set `outputType` to `structured` and provide a JSON Schema whose root type is `object`. The REST API receives `structuredOutputSchema` as a JSON string. The Python SDK also accepts a Pydantic model or a string.

```python
import json
from linkup import LinkupClient

schema = {
    "type": "object",
    "properties": {
        "product": {"type": "string"},
        "current_version": {"type": "string"},
        "release_url": {"type": "string"},
    },
    "required": ["product", "current_version", "release_url"],
}

client = LinkupClient()
response = client.search(
    query="From the official Astro website, find the current stable version and its release URL.",
    depth="standard",
    output_type="structured",
    structured_output_schema=json.dumps(schema),
    include_domains=["astro.build"],
    include_sources=True,
)
print(response)
```

A schema constrains the shape; it does not create missing evidence. Ask for the corresponding information in the query, mark essential fields as `required`, and enable `includeSources` when you need an audit trail. The official [Structured Output Guide](https://docs.linkup.so/pages/documentation/tutorials/structured-output-guide) notes that including sources changes the response wrapper, so update downstream types as well.

## Route errors before retrying

Linkup error bodies include `statusCode` and an `error` object with `code`, `message`, and `details`. The [error documentation](https://docs.linkup.so/pages/documentation/platform/errors) lists these common cases:

- `400`: invalid parameters or no search result. Change the request; do not replay it unchanged.
- `401` or `403`: key or permission failure. Stop and fix configuration.
- `429`: either exhausted balance or excessive concurrency. Check balance before choosing a refill or backoff path.
- `500`: server-side failure. A bounded exponential backoff is reasonable.

The public documentation does not promise a `Retry-After` header or prescribe a retry count. The conservative client policy here is therefore a recommendation, not a Linkup SLA: retry only transient `429` and `500` responses, add jitter, enforce a total deadline, and log every failure. Search is a paid operation, so an infinite retry loop is particularly unhelpful.

Use the balance endpoint to disambiguate a `429`:

```bash
curl --request GET \
  --url https://api.linkup.so/v1/credits/balance \
  --header "Authorization: Bearer $LINKUP_API_KEY"
```

## What “top the balance back up to $20” means

Linkup's public [pricing documentation](https://docs.linkup.so/pages/documentation/platform/pricing) says that a new account receives a $20 prepaid balance and that credits are topped back up to $20 each month. Read literally, if the balance is $3 at the refill, the refill adds $17; it is not a new $20 grant every month. If the balance is already above $20, the sentence does not establish that anything more will be added.

The public documentation does not define the refill day, expiry of unused balance, the interaction with purchased credit, or the criteria behind an “eligible account” label shown in the product UI. Do not encode the monthly refill as a guaranteed entitlement. Read `/v1/credits/balance`, alert on low balance, and confirm the rules for the specific account and contract before making a production budget commitment.

Current Search prices vary by depth and output: `standard + searchResults` costs $0.005, while `standard + sourcedAnswer/structured` costs $0.006. The corresponding `deep` calls cost $0.05 and $0.055. The documentation also says errors and no-result responses are not charged, and an empty balance produces `429`. Recheck the pricing page before launch because prices can change.

## Privacy, ZDR, and regions are separate claims

This is where summaries often overreach. Linkup's [Privacy Policy](https://www.linkup.so/privacy-policy) says that the personal data it describes is processed and stored in the EU. The current [Security and Privacy FAQ](https://docs.linkup.so/pages/security-and-privacy/faq), however, separately says that API queries may be processed across the US, EU, Canada, and APAC by default, based on load allocation. Guaranteed processing in a specified geography is available under an enterprise agreement.

The same FAQ says Zero Data Retention can be requested and is not enabled by default. When enabled, queries and results are not written to persistent storage. That is not evidence that every new account has ZDR by default, nor that a normal account automatically receives EU-only query processing. If queries may contain customer names, internal identifiers, or regulated data, verify the contracted processing region, ZDR status, and DPA before sending them.

## Overall

Linkup fits agents that want one API for ranked search context, sourced answers, structured data, and full content from a known page. The robust starting point is not “deep everywhere,” but `standard + searchResults`: keep source selection, verification, and final reasoning inside your own application, and increase depth only when the task genuinely follows leads across multiple steps.

Before production, add three guardrails: retain source URLs, distinguish balance exhaustion from concurrency when handling `429`, and verify regional processing plus ZDR as account or contract settings. Those controls matter more than an ornate search prompt.

## References

- [Linkup API introduction](https://docs.linkup.so/pages/documentation/get-started/introduction)
- [Search overview](https://docs.linkup.so/pages/documentation/endpoints/search/overview)
- [Search API reference](https://docs.linkup.so/pages/documentation/endpoints/search/reference)
- [Search best practices](https://docs.linkup.so/pages/documentation/endpoints/search/best-practices)
- [Fetch API reference](https://docs.linkup.so/pages/documentation/endpoints/fetch/reference)
- [Structured Output Guide](https://docs.linkup.so/pages/documentation/tutorials/structured-output-guide)
- [Authentication](https://docs.linkup.so/pages/documentation/platform/authentication)
- [Errors](https://docs.linkup.so/pages/documentation/platform/errors)
- [Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Credit balance API](https://docs.linkup.so/pages/documentation/endpoints/account/balance)
- [Security and Privacy FAQ](https://docs.linkup.so/pages/security-and-privacy/faq)
- [Linkup Privacy Policy](https://www.linkup.so/privacy-policy)
