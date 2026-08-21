---
title: "SearXNG Complete Guide: Engine Tuning, JSON API, and Self-Hosted Operations"
date: 2026-08-21
category: ai
type: guide
tags: [searxng, web-search, self-hosted, docker, ai-agent]
lang: en
tldr: "SearXNG is a metasearch engine, not a crawler, and it does not own a web-wide index. Based on the official 2026.8.20 documentation, this guide covers Compose installation, settings.yml, engine selection, the JSON API, and empty-result diagnosis."
description: "A complete guide to SearXNG's query flow, Compose installation, settings.yml structure, engine selection, JSON API, datacenter networking limits, and operations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-searxng-complete-guide)

[SearXNG](https://docs.searxng.org/) is a metasearch engine: it sends one question to multiple search services and merges their results. It does not build its own web-wide index, open result pages, execute JavaScript, or extract full text. For an agent, it solves “find the URLs first,” not “read everything behind those URLs.”

This guide is based on the official documentation version `2026.8.20+487d7a96e` and the `master` source read on 2026-08-21. By the end, you will have a local SearXNG instance that returns JSON, uses a controlled engine set, and gives you enough evidence to diagnose failed searches. To pass results into a full-page fetcher, continue with the [integration guide](/posts/ai/2026-08-21-searxng-crawl4ai-setup); this post covers SearXNG alone.

## What SearXNG is—and is not

SearXNG can use general-purpose search engines, scholarly databases, package registries, media platforms, and even locally configured offline engines as upstreams. At the time of verification, the official [configured-engine list](https://docs.searxng.org/user/configured_engines.html) contained 270 engines, 83 enabled by default. That does not mean every query fans out to 83 upstreams: category, preferences, query syntax, and engine state narrow the set first.

It differs from three kinds of tools that are often conflated with it:

| Type | Owns an index | Retrieves full text | Primary responsibility |
|---|---:|---:|---|
| SearXNG metasearch | No | No | Aggregate titles, URLs, snippets, and extra fields from upstreams |
| SERP API | Usually no | Product-dependent | Operate upstream adapters, proxies, and availability for usage-based fees |
| Self-hosted search index | Yes | Content must be acquired first | Search your documents with control over lifecycle and permissions |
| Crawler/browser | No | Yes | Fetch, render, or extract an already known URL |

If data must never leave your environment, SearXNG is not the answer. It still sends queries to the upstreams you enable. Self-hosting controls the intermediary and its logs; it does not hide queries from external search services.

## How one query moves through SearXNG

The core flow fits into five stages:

```text
query
  -> select engines by category, !bang, preferences, and state
  -> call engine adapters in parallel
  -> normalize heterogeneous responses into common result fields
  -> merge duplicates and rank results
  -> emit HTML / JSON / CSV / RSS
```

Every upstream has different URLs, locale fields, and response formats, so SearXNG maintains an adapter for each service. The official [engine overview](https://docs.searxng.org/dev/engines/engine_overview.html) makes the reason explicit: no general search API works across every search engine.

Results are not merely concatenated. The [`ResultContainer` source](https://github.com/searxng/searxng/blob/master/searx/results.py) merges duplicates, records which engines found an item and at which positions, then scores it using position, occurrence count, and engine `weight`. Therefore, `weight` is a ranking signal—not a request multiplier or a guarantee that one provider always wins.

## Minimal installation and the first JSON query

You need Docker Compose and, optionally, `jq`. The current official path uses Compose templates from the main repository rather than the old `searxng-docker` project:

```bash
mkdir -p ./searxng/core-config
cd ./searxng

curl -fsSL \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/docker-compose.yml \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/.env.example

cp .env.example .env
printf '\nSEARXNG_HOST=127.0.0.1\nSEARXNG_SECRET=%s\n' \
  "$(openssl rand -hex 32)" >> .env
```

Create `core-config/settings.yml` with this minimal configuration:

```yaml
use_default_settings: true

general:
  instance_name: "Local SearXNG"
  enable_metrics: true

search:
  safe_search: 0
  default_lang: "zh-TW"
  formats:
    - html
    - json

server:
  # Compose overrides this value with SEARXNG_SECRET from .env.
  secret_key: "ultrasecretkey"
  # Safe to disable for a private instance bound to 127.0.0.1.
  # Enable it and configure Valkey before serving public traffic.
  limiter: false
  image_proxy: false

outgoing:
  request_timeout: 3.0
  max_request_timeout: 10.0

valkey:
  url: valkey://valkey:6379/0
```

`use_default_settings: true` matters: SearXNG loads its built-in defaults, then applies your overrides. Without it, you take ownership of the complete default configuration. `formats` must also contain `json`; the [Search API documentation](https://docs.searxng.org/dev/search_api.html) states that requesting a disabled format returns `403 Forbidden`.

Start and verify the instance:

```bash
docker compose up -d
docker compose ps

curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=SearXNG JSON API' \
  --data 'categories=general' \
  --data 'pageno=1' \
  --data 'format=json' \
  | jq '{query, count: (.results | length), unresponsive_engines}'
```

An array under `results` proves the minimal path. If you get a 403, do not tune engines yet. Confirm that JSON is enabled and that the limiter is not rejecting your client.

## The actual structure of settings.yml

The official [`settings.yml` documentation](https://docs.searxng.org/admin/settings/settings.html) divides configuration into several sections. Start with these five:

| Section | Scope | Common settings |
|---|---|---|
| `general` | Entire instance | Name, debug mode, metrics |
| `server` | HTTP service | `secret_key`, limiter, base URL, image proxy |
| `search` | Query defaults and failure backoff | Locale, safe search, formats, suspension |
| `outgoing` | All upstream connections | Global timeout, pools, HTTP/2, proxies |
| `engines` | One upstream | Category, timeout, weight, locale, state |

`search.default_lang` and `safe_search` are instance defaults; API parameters `language` and `safesearch` can override them per request. `outgoing.request_timeout` applies globally, while an engine-specific `timeout` overrides it. When one engine is slow, tune that engine instead of slowing the entire instance.

To narrow the default engine set while retaining upstream defaults, use `keep_only`:

```yaml
use_default_settings:
  engines:
    keep_only:
      - duckduckgo
      - wikipedia
      - arxiv
      - pubmed
      - semantic scholar
      - openalex

engines:
  - name: openalex
    disabled: false
  - name: arxiv
    timeout: 5.0
    weight: 1.2
```

Names must match your installed version. Inspect your own `/config` instead of copying names from an old post:

```bash
curl -s 'http://127.0.0.1:8080/config' \
  | jq '.engines[] | {name, shortcut, categories, enabled}'
```

## Selecting engines: more is not better

Every additional upstream adds another possible timeout, CAPTCHA, markup change, or rate limit. Choose a category from the task first, then pick a small set of complementary sources:

| Need | Initial selection | What to verify |
|---|---|---|
| General web | Pick 2–4 distinct sources from `general` | Whether your egress IP triggers CAPTCHAs; locale support |
| News and recent material | Use `news`, then engines that support `time_range` | Whether publication dates are present; not every engine honors time filters |
| Code and packages | Use `it`, favoring repository and package-index engines | Pagination; whether results are project pages or generic articles |
| Scholarly papers | `arxiv`, `pubmed`, and `semantic scholar`; enable `openalex` when needed | Subject coverage, API keys, and timeout; Google Scholar relies on more fragile page parsing |
| Images and files | Use the matching category instead of mixing it into `general` | Whether a result URL points to a page, original media, or thumbnail |
| Sources requiring an API key | Supply the key before changing `inactive` to `false` | Quota, licensing, and secret handling |

Do not confuse these three states:

- `disabled: true`: off by default, but still present in configuration and preferences; a user can enable it.
- `inactive: true`: not loaded into the available engine set; engines requiring API keys often default to this state.
- suspended: temporarily backed off at runtime after errors such as 403, 429, or CAPTCHA; this is not a static setting.

[`search.suspended_times`](https://docs.searxng.org/admin/settings/settings_search.html) controls suspension durations by error class. Setting every value to zero does not improve availability; it immediately hits an already blocked upstream again.

## The JSON API for agents

In the documented API contract for this version, search parameters include `q`, `categories`, `language`, `pageno`, `time_range`, `format`, and `safesearch`. It does **not document separate `region` or `engines` parameters**. Use a locale such as `language=zh-TW`; how precisely it maps to a region still depends on each adapter. To choose engines per request, put the official [search-syntax](https://docs.searxng.org/user/search-syntax.html) `!bang` tokens inside `q`.

A general query:

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=site:docs.searxng.org search api' \
  --data 'categories=general' \
  --data 'pageno=1' \
  --data 'format=json'
```

A Traditional Chinese locale and recent time range:

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=人工智慧治理 台灣' \
  --data 'categories=general,news' \
  --data 'language=zh-TW' \
  --data 'time_range=month' \
  --data 'safesearch=1' \
  --data 'format=json'
```

The science category restricted to three engines:

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=!arx !pub !se retrieval augmented generation evaluation' \
  --data 'categories=science' \
  --data 'language=en' \
  --data 'pageno=1' \
  --data 'format=json'
```

`time_range`, pagination, safe search, and locale only take effect where both the adapter and upstream support them. Check `/config` and the instance's Preferences page instead of assuming every engine accepts the same filters.

The JSON top level contains `query`, `results`, `answers`, `corrections`, `infoboxes`, `suggestions`, and `unresponsive_engines`, as confirmed by the official [`webutils.py`](https://github.com/searxng/searxng/blob/master/searx/webutils.py). Common fields for an ordinary result include `title`, `url`, `content`, `engines`, `positions`, `score`, and `publishedDate`, but other result types may omit them. At minimum, preserve this citation metadata:

```python
def citation_record(item: dict) -> dict:
    return {
        "title": item.get("title"),
        "url": item.get("url"),
        "snippet": item.get("content"),
        "published_at": item.get("publishedDate"),
        "engines": item.get("engines", []),
        "score": item.get("score"),
    }
```

Use `score` only to order one SearXNG response; it is not a calibrated relevance probability across queries. A URL is also only a citation candidate. Reliable citation still requires fetching the original page and checking the claim.

## Datacenter IPs are the real self-hosting constraint

SearXNG controls its own code, not how upstreams judge your egress IP. The project even documents how to use an SSH SOCKS tunnel to open a blocked engine from the server's IP and solve a CAPTCHA manually. Correct configuration does not guarantee that an upstream will serve your requests.

Common outcomes include 403, 429, CAPTCHA, parsing errors, timeouts, and apparently successful responses with no results. SearXNG records some failures in `unresponsive_engines` and suspends an engine according to its exception class. You can wait, switch engines, or route one engine through a proxy; increasing retries does not turn a block into a stable service.

This guide does not claim that a Taiwanese residential connection beats a particular datacenter by a specific percentage. That requires a controlled benchmark with a fixed date, region, query set, and request rate. The official evidence supports narrower claims: upstreams can challenge or reject server IPs, and adapter capabilities differ by engine.

## Diagnosing empty results

An empty array is not one error. Several failures look identical at first, so diagnose them in this order:

```text
HTTP status is not 200?
  ├─ 403 -> JSON format is disabled, or the limiter rejected the request
  └─ 5xx -> inspect core logs and settings.yml loading errors

HTTP 200, but results is empty?
  ├─ unresponsive_engines has entries -> handle timeout / 403 / 429 / CAPTCHA by engine
  ├─ one explicit !engine is still empty -> inspect that engine, upstream, and adapter
  ├─ removing language / time_range fixes it -> unsupported or overly narrow filters
  ├─ every engine times out -> inspect container DNS, egress, and proxy settings
  └─ only one query is empty -> broaden it, then reapply constraints one at a time
```

Reduce the response to actionable evidence first:

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=!ddg searxng' \
  --data 'format=json' \
  | jq '{count: (.results | length), unresponsive_engines}'
```

Then inspect service logs:

```bash
docker compose logs --tail=200 core
docker compose logs -f core
```

If every engine times out, test DNS inside the container:

```bash
docker compose exec core python -c \
  'import socket; print(socket.getaddrinfo("duckduckgo.com", 443))'
```

If only one engine is slow, inspect its response time under `/stats`, then adjust only its `timeout` or disable it. For 403, 429, or CAPTCHA, read the error and suspended state in `unresponsive_engines`; wait, use another source, or change that engine's network route instead of retrying forever.

## Operational boundaries and when not to use it

SearXNG is a rolling release; the official maintenance documentation says that every commit to `master` is a release. Do not track `latest` blindly in production. Pin `SEARXNG_VERSION` in `.env`, update a test instance first, and verify `/config`, three fixed queries, empty-result rate, and `unresponsive_engines`.

The Compose update path is:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

SearXNG fits teams that want control over engine mix, query logging, and cost—and can tolerate occasional upstream failures. Use something else when:

- You need a vendor-backed SLA, predictable latency, and a support window: use a commercial Search API.
- You must search private documents with ACLs, deletion, and freshness guarantees: build your own index.
- You already know the URL and need body text or JavaScript execution: use a crawler or browser.
- You need semantic similarity rather than keyword and upstream ranking: use embeddings and vector search, or a semantic search service.
- Nobody can maintain broken adapters, CAPTCHAs, and network routes: do not mistake self-hosting for zero operational cost.

The tradeoff is simple: SearXNG replaces a provider bill with your own operational responsibility. Start with a small engine set, preserve failure metadata, and expand only after it is stable.

## References

- [SearXNG documentation](https://docs.searxng.org/)
- [SearXNG container installation](https://docs.searxng.org/admin/installation-docker.html)
- [SearXNG settings.yml](https://docs.searxng.org/admin/settings/settings.html)
- [SearXNG Search API](https://docs.searxng.org/dev/search_api.html)
- [SearXNG engine settings](https://docs.searxng.org/admin/settings/settings_engines.html)
- [SearXNG configured-engine list](https://docs.searxng.org/user/configured_engines.html)
- [SearXNG ResultContainer source](https://github.com/searxng/searxng/blob/master/searx/results.py)
- [SearXNG JSON response source](https://github.com/searxng/searxng/blob/master/searx/webutils.py)
- [Answer CAPTCHA from a server IP](https://docs.searxng.org/admin/answer-captcha.html)
- [SearXNG maintenance and updates](https://docs.searxng.org/admin/update-searxng.html)
- Related: [SearXNG + Crawl4AI integration guide](/posts/ai/2026-08-21-searxng-crawl4ai-setup)
