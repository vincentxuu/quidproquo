---
title: "How to Use Cloudflare AI Search: Data Sources, Hybrid Retrieval, and Workers Bindings"
date: 2026-08-29
type: deep-dive
category: tech
tags: [cloudflare, cloudflare-ai-search, rag, hybrid-search, vectorize, workers-ai]
lang: en
tldr: "Formerly AutoRAG, the managed search primitive: drop files into built-in storage or attach R2 and websites, auto-index with Markdown conversion plus vector and BM25, retrieve with hybrid, RRF, and reranking, and query from Workers via namespace or instance bindings, REST, or MCP."
description: "From data sources and indexing pipelines to model choices, retrieval tuning, and bindings — a complete breakdown of Cloudflare AI Search, its limits, and when to build on Vectorize instead."
series:
  name: "Cloudflare AI Stack"
  order: 5
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 23
---

> 🌏 [中文版](/posts/tech/2026-08-29-cloudflare-ai-search-guide)

If every agent needs search, do you build the vector index, the chunking and sync pipeline, and the BM25 fusion yourself — or reach for a primitive? [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/) is the latter: formerly [AutoRAG](https://blog.cloudflare.com/introducing-autorag-on-cloudflare/), now positioned as a managed search primitive. Create an instance, give it data, query it with natural language; the [R2](https://developers.cloudflare.com/r2/), [Vectorize](https://developers.cloudflare.com/vectorize/), and [Workers AI](https://developers.cloudflare.com/workers-ai/) plumbing is handled for you. This post covers how data gets in, how indexing runs, how to tune retrieval, and how to wire it from a Worker — so you can decide when to use the managed path and when to assemble your own.

## What AI Search is and why it is called a search primitive

The design pitch is literal: make "searchable" as basic as `fetch()` in [Workers](https://developers.cloudflare.com/workers/). The docs call it *the search primitive for your applications and agents* ([Overview](https://developers.cloudflare.com/ai-search/)). It is not another vector database — it is a full pipeline: upload or connect a data source → auto-index and keep it fresh → hybrid retrieval → scored chunks with sources, optionally followed by generation.

How it differs from the usual alternatives:

- **DIY on [Vectorize](https://developers.cloudflare.com/vectorize/)**: most flexible — you control chunk size, embedding model, filter extraction, and fallback — but you own crawling, [Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/), reindexing, and observability. See the on-site [Vector Database Comparison](/posts/ai/2026-03-12-vector-database-comparison-en).
- **External managed search like Azure AI Search or Algolia**: feature-complete, but with an extra hop, separate billing, and data movement out of the Cloudflare edge. AI Search wins on colocation with Workers and the [Agents SDK](https://developers.cloudflare.com/agents/).
- **The old `env.AI.autorag()`**: still works, but marked legacy. New capabilities — built-in storage, namespace bindings, cross-instance search, boost — are only on the new [Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/). The official upgrade path is [Workers binding migration](https://developers.cloudflare.com/ai-search/api/migration/workers-binding/).

Good fits: documentation and knowledge-base search, research tools for agents, per-tenant or per-agent searchable context (e.g., past resolutions per customer in support). Poor fits: teams that need custom chunking, more than five metadata fields per instance, or pinned embedding versions for offline evaluation.

## How data gets in: three sources and the indexing pipeline

AI Search ingests from three sources ([Data source](https://developers.cloudflare.com/ai-search/configuration/data-source/)):

1. **Built-in storage**: every instance ships with its own storage and vector index. Upload files via API and they are indexed — no R2 bucket to create first. This is the default since April 2026 and the right choice for dynamic per-agent instances.
2. **R2 Bucket**: attach an existing R2 bucket as the source. AI Search syncs it continuously. Use it when your corpus already lives in R2.
3. **Website**: attach a domain you own. AI Search crawls it with [Browser Rendering](https://developers.cloudflare.com/browser-rendering/) and supports `discover` and `sitemap` [Parse types](https://developers.cloudflare.com/ai-search/configuration/data-source/website/parse-types/).

File types are two-tiered: plain text (`.md`, `.json`, `.csv`, `.py`, `.go`, etc.) indexes directly; rich formats (`.pdf`, `.docx`, `.xlsx`, `.html`, `.png`/`.jpg`, etc.) go through [Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/) first — image captioning there uses Workers AI vision models and is billed separately. The per-file limit is 4 MB; oversized files are not indexed and appear in error logs.

Indexing is automatic and continuous ([Automated indexing](https://developers.cloudflare.com/ai-search/configuration/indexing/syncing/)). R2 and Website sources resync on change; built-in storage indexes on upload. The ownership shift matters: built-in files live on AI Search-managed R2 and Vectorize — you no longer need a bucket in your account. The R2 bucket that early AutoRAG created for you is no longer written to and can be removed (see [Limits & pricing history](https://developers.cloudflare.com/ai-search/platform/limits-pricing/)).

```ts
// Built-in storage: upload and index
const instance = env.AI_SEARCH.get("my-instance");
const item = await instance.items.upload("handbook.pdf", pdfBytes);
// or wait until searchable
const ready = await instance.items.uploadAndPoll("handbook.pdf", pdfBytes);
```

## Indexing and models: five stages from Markdown conversion to embedding

The pipeline is fixed; the models at each stage are configurable ([Models](https://developers.cloudflare.com/ai-search/configuration/models/)):

1. **Image to Markdown** (optional): object detection plus captioning.
2. **Embedding**: turns chunks and queries into vectors. This is the only model choice locked at instance creation.
3. **Query rewriting** (optional): an LLM reformulates the user query for better recall.
4. **Reranking** (optional): a cross-encoder re-scores fused results by semantic relevance.
5. **Generation**: produces the final answer from retrieved context. The generation model is selectable at creation and can be overridden later in the dashboard or per request.

Providers are either [Workers AI](https://developers.cloudflare.com/workers-ai/) models or external models via [AI Gateway](https://developers.cloudflare.com/ai-gateway/) with your own OpenAI or Anthropic keys ([Bring your own keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)). Attach a Gateway when creating the instance or switch it under Settings, then pick external models. "Smart Default" lets Cloudflare choose and auto-update; explicit selection pins a model but requires tracking the [Supported models](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/) lifecycle (Production → Announcement → End of life).

Trade-off: Smart Default saves ops but scores can drift on upgrade; pinning is reproducible but you must follow [Release notes](https://developers.cloudflare.com/ai-search/platform/release-note/) and deprecation notices. For Traditional Chinese, generation quality is often steadier with external models — the Gateway integration is the practical bridge.

## How to query: vector, keyword, and hybrid

Retrieval is where the recent release changed most ([Search modes](https://developers.cloudflare.com/ai-search/concepts/search-modes/), [Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/), [Keyword search](https://developers.cloudflare.com/ai-search/configuration/indexing/keyword-search/)).

- **Vector-only**: strong on intent, weak on exact terms. Searching `ERR_CONNECTION_REFUSED timeout` may return generic networking docs instead of the page that literally contains the error code.
- **Keyword-only (BM25)**: scores by term frequency, rarity, and document length — exact terms win, paraphrases lose.
- **Hybrid**: runs both in parallel and fuses. Enable with `index_method: { vector: true, keyword: true }`; fusion is `rrf` (Reciprocal Rank Fusion, by rank not score, the default) or `max` (higher of the normalized scores). [Hybrid search docs](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/) recommend `rrf` for most cases. The DIY counterpart and formula are covered in [Hybrid Search: BM25 + Vector + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en).

Tunable parameters (instance-level or per-request override):

- `keyword_tokenizer`: `porter` (stemming, `running` matches `run`) or `trigram` (substring, `conf` matches `configuration`, better for code).
- `keyword_match_mode`: `and` (all terms required) or `or` (any term).
- `reranking`: cross-encoder rerank after fusion, e.g. `@cf/baai/bge-reranker-base`.
- `query_rewrite`: rewrites the query for recall.
- `boost_by`: boosts ranking by metadata, e.g. `timestamp desc` for recency, up to 3 fields ([Filtering](https://developers.cloudflare.com/ai-search/configuration/retrieval/filtering/)).
- `filters`: filter by custom metadata with `eq`/`ne`/`gt`/`gte`/`lt`/`lte` and `and`/`or` compounds. Only the first 64 bytes of a string field are indexed — keep filterable keys short.
- `max_num_results` (1–50, default 10), `match_threshold` (0–1, default 0.4), `context_expansion` (0–3 surrounding chunks).

```ts
const instance = await env.AI_SEARCH.create({
  id: "my-instance",
  index_method: { vector: true, keyword: true },
  indexing_options: { keyword_tokenizer: "porter" },
  retrieval_options: { keyword_match_mode: "or" },
  fusion_method: "rrf",
  reranking: true,
  reranking_model: "@cf/baai/bge-reranker-base",
});

// Per-request override and boosting
const hits = await instance.search({
  messages: [{ role: "user", content: "How to fix ERR_CONNECTION_REFUSED?" }],
  ai_search_options: {
    retrieval: {
      retrieval_type: "hybrid",
      fusion_method: "rrf",
      keyword_match_mode: "or",
      max_num_results: 8,
      filters: { category: "runbook" },
      boost_by: [{ field: "timestamp", direction: "desc" }],
    },
    reranking: { enabled: true },
  },
});
```

The other key primitive is **cross-instance search**. Shared docs and per-customer history often live in separate instances; the namespace `search()` merges them into one ranked list:

```ts
// From the official support-agent example
const results = await env.SUPPORT_KB.search({
  query: "billing error",
  ai_search_options: { instance_ids: ["product-knowledge", "customer-abc123"] },
});
```

That avoids two round-trips and lets `boost_by` and `reranking` apply after the merge.

## How to connect: five interfaces and two Workers bindings

Pick the surface by who calls and when the instance is known:

| Interface | Best for | Notes |
|---|---|---|
| [Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/) | Inside Workers and Agents | Lowest latency; namespace and instance bindings |
| [REST API](https://developers.cloudflare.com/ai-search/get-started/api/) | Backend services outside Workers | Account API token with AI Search permission |
| [Wrangler CLI](https://developers.cloudflare.com/ai-search/get-started/wrangler/) | Ops and one-offs | `wrangler ai-search create/list/delete` |
| [Python SDK](https://developers.cloudflare.com/ai-search/get-started/python/) | Offline batches and pipelines | Parity with REST, good for crawlers and ETL |
| [Dashboard](https://developers.cloudflare.com/ai-search/get-started/dashboard/) | Manual setup and inspection | Pick Gateways, check index status |
| [MCP server](https://developers.cloudflare.com/ai-search/api/search/mcp/) + [UI snippets](https://developers.cloudflare.com/ai-search/api/search/mcp/) | Expose to models or websites | Every instance ships with an MCP endpoint and embeddable search |

Workers offers two bindings ([Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/)):

**Namespace binding `ai_search_namespaces`** — dynamic, for per-customer or per-agent instances:

```jsonc
// wrangler.jsonc
{
  "ai_search_namespaces": [{ "binding": "SUPPORT_KB", "namespace": "support" }],
  "ai": { "binding": "AI" }
}
```

```ts
await env.SUPPORT_KB.create({ id: `customer-${customerId}`, index_method: { vector: true, keyword: true } });
const inst = env.SUPPORT_KB.get(`customer-${customerId}`);
await inst.search({ messages: [{ role: "user", content: "What did we try last time?" }] });
```

**Instance binding `ai_search`** — static, bound to a single instance in the `default` namespace at deploy time, simplest call site:

```jsonc
{ "ai_search": [{ "binding": "MY_SEARCH", "instance_name": "my-instance" }] }
```
```ts
await env.MY_SEARCH.search({ messages: [{ role: "user", content: "What is Cloudflare?" }] });
```

The legacy `env.AI.autorag("my-rag").search({ query })` still works but takes `messages` (or `query`) plus `ai_search_options` and receives no new features. See [Workers binding migration](https://developers.cloudflare.com/ai-search/api/migration/workers-binding/) and [REST API migration](https://developers.cloudflare.com/ai-search/api/migration/rest-api/).

The recommended [Agents SDK](https://developers.cloudflare.com/agents/) pattern is to expose AI Search as a tool (see [AI Search: the search primitive for your agents](https://blog.cloudflare.com/ai-search-agent-primitive)): the model decides when to `search_knowledge_base` and when to `save_resolution` (via `uploadAndPoll` so the next turn is searchable), and uses `instance_ids` to span shared knowledge and private context.

## Limits, pricing, and when not to use it

Hard limits ([Limits & pricing](https://developers.cloudflare.com/ai-search/platform/limits-pricing/), updated 2026-08-26):

| Limit | Workers Free | Workers Paid |
|---|---|---|
| Instances per account | 100 | 5,000 |
| Namespaces per account | 100 | 100 |
| Files per instance | 100,000 | 1,000,000 (500,000 with hybrid) |
| Max file size | 4 MB | 4 MB |
| Queries per month | 20,000 | Unlimited |
| Instances per cross-instance request | 10 | 10 |
| Pages crawled per day | 500 | Unlimited |
| Custom metadata fields | 5 per instance | 5 per instance |
| Metadata per vector | 10 KiB (incl. overhead) | 10 KiB |
| Filterable string prefix | First 64 bytes | First 64 bytes |

Pricing: free within limits during open beta; [Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/) and [AI Gateway](https://developers.cloudflare.com/ai-gateway/reference/pricing/) are billed separately. Storage, vector indexing, and website crawling via [Browser Rendering](https://developers.cloudflare.com/browser-rendering/) are included. Older invoices with separate R2/Vectorize line items are pre-migration history.

When not to use it:

- You need custom chunking, overlap, or multi-granularity indexing (AI Search chunking is fixed).
- You need more than five filterable metadata fields or filtering on long strings (only the first 64 bytes are filterable).
- You need pinned embedding/reranker versions for long-horizon evaluation (Smart Default drifts; explicit choices still face the [Model lifecycle](https://developers.cloudflare.com/ai-search/configuration/models/)).
- Files frequently exceed 4 MB (e.g., scanned books) — pre-split before upload.

Conversely, if the job is "hybrid search over a corpus with exact-term hits, dynamic per-tenant instances, and minimal ops," the managed trade is compelling. The same build-vs-buy note closes the on-site [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) piece: use managed to save ops, build on Vectorize for full control over filter extraction and degradation.

## Overall

The increment is not "can do RAG" — it is "RAG without the dirty work as a primitive": built-in storage per instance, auto-sync for Website and R2 sources, hybrid retrieval with `boost_by` and `filters` tunable per request, and namespace bindings plus cross-instance search that make multi-tenant and multi-agent isolation cheap.

Start with one `ai_search` instance (minimal config), validate recall and `match_threshold`, then compare `vector` vs `keyword` vs `hybrid` with `reranking`; only move to `ai_search_namespaces` and `instance_ids` when you need tenancy. A concrete next step tonight: take a corpus you already have (e.g., `src/content/posts/`), create a test instance on a Paid account, upload 50 documents to built-in storage, query the same questions with the three retrieval types, and log `scoring_details` (`vector_score`/`keyword_score`/`fusion_method`) before choosing a default.

## References

- [Cloudflare AI Search — Overview](https://developers.cloudflare.com/ai-search/)
- [Cloudflare AI Search — Data source](https://developers.cloudflare.com/ai-search/configuration/data-source/)
- [Cloudflare AI Search — Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)
- [Cloudflare AI Search — Keyword search](https://developers.cloudflare.com/ai-search/configuration/indexing/keyword-search/)
- [Cloudflare AI Search — Models](https://developers.cloudflare.com/ai-search/configuration/models/)
- [Cloudflare AI Search — Supported models](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/)
- [Cloudflare AI Search — Limits & pricing](https://developers.cloudflare.com/ai-search/platform/limits-pricing/)
- [Cloudflare AI Search — Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/)
- [Cloudflare AI Search — Workers binding migration](https://developers.cloudflare.com/ai-search/api/migration/workers-binding/)
- [Cloudflare AI Search — REST API migration](https://developers.cloudflare.com/ai-search/api/migration/rest-api/)
- [Cloudflare Blog — AI Search: the search primitive for your agents](https://blog.cloudflare.com/ai-search-agent-primitive)
- [Cloudflare Blog — Introducing AutoRAG on Cloudflare](https://blog.cloudflare.com/introducing-autorag-on-cloudflare/)
- [Workers AI — Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)
- [Vectorize — Cloudflare Vector Database](https://developers.cloudflare.com/vectorize/)
- [Hybrid Search: BM25 + Vector + RRF](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)
- [Vector Database Comparison](/posts/ai/2026-03-12-vector-database-comparison-en)
- [The Full Cloudflare Workers AI Binding: More Than run()](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities-en)
- [Workers AI Model Selection Guide](/posts/ai/2026-08-18-workers-ai-model-guide-en)
