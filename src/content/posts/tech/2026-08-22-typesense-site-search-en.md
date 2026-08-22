---
title: "Typesense Site Search: Full-Text Search You Can Treat as a Product Feature"
date: 2026-08-22
category: tech
tags: [typesense, search, full-text-search, api, self-hosted]
lang: en
type: deep-dive
tldr: "Typesense is a search server centered on instant, typo-tolerant keyword search. Collection schemas, field weights, facets and sorting are enough to build site search, with a choice between self-hosting and Typesense Cloud; Chinese fields need locale: zh, and domain terminology may require custom segmentation."
description: "A practical guide to Typesense's indexing, querying and ranking model, including an article-search collection, Chinese tokenization, deployment, security and the limits of the tool."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-typesense-site-search)

[Typesense](https://typesense.org/docs/overview/) is an open-source search server built for instant, typo-tolerant search. It is not a Google-like crawler: you extract records from a CMS, database or build artifact, push them into Typesense for indexing, and then call its Search API from your site. That boundary matters because your application still owns what becomes searchable and when the index is synchronized.

Its product position sits between Algolia and Elasticsearch / OpenSearch. It offers search-as-you-type, typo tolerance and facets out of the box like Algolia, while retaining the option to self-host like Elasticsearch. Typesense deliberately keeps its configuration surface smaller, which makes it attractive when a team wants capable site search without adopting a general search analytics platform.

## Core model: documents, collections and legible ranking

Typesense calls each searchable record a document and stores it in a collection with an explicit schema. A content site will typically index the title, summary, body, category, tags, URL and publication time. The record only needs enough data to render a result card; it does not need to duplicate the entire CMS.

Text relevance is not a single opaque score. According to the [ranking documentation](https://typesense.org/docs/guide/ranking-and-relevance.html), Typesense considers token overlap, edit distance, proximity and field weights, then breaks ties with `_text_match` and user-defined fields. A title can therefore matter more than body text, while recency only promotes an article when textual relevance is similar.

The official [feature list](https://typesense.org/docs/overview/features.html) also includes filters, facets, synonyms, curation, geo search, vector search and hybrid search. A first version of site search usually needs only keywords, highlights, a category facet and recency sorting. Add synonyms or semantic search after real query logs reveal a need.

## A minimal but useful article index

The following creates a `posts` collection. Do not omit `locale: zh` for Chinese content: without a locale, Typesense treats a field as English. The official [locale guide](https://typesense.org/docs/guide/locale.html) says `zh` covers both Simplified and Traditional Chinese and applies ICU's Chinese tokenization rules.

```bash
curl -X POST "$TYPESENSE_HOST/collections" \
  -H "X-TYPESENSE-API-KEY: $TYPESENSE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "posts",
    "fields": [
      {"name": "title", "type": "string", "locale": "zh"},
      {"name": "body", "type": "string", "locale": "zh"},
      {"name": "category", "type": "string", "facet": true},
      {"name": "tags", "type": "string[]", "facet": true},
      {"name": "published_at", "type": "int64"},
      {"name": "url", "type": "string", "index": false}
    ],
    "default_sorting_field": "published_at"
  }'
```

Next, transform each post into JSON and add it through the Documents API or bulk import. With Astro, a CI job can generate JSONL before a build and synchronize it. A database-backed site can process inserts, updates and deletes in background jobs. The browser only needs a key restricted to search actions; never expose an admin key in client code.

```ts
import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [{ host: "search.example.com", port: 443, protocol: "https" }],
  apiKey: PUBLIC_SEARCH_ONLY_KEY,
  connectionTimeoutSeconds: 2,
});

const result = await client.collections("posts").documents().search({
  q: "cloudflare search",
  query_by: "title,body,tags",
  query_by_weights: "5,2,1",
  filter_by: "category:=tech",
  facet_by: "category,tags",
  sort_by: "_text_match:desc,published_at:desc",
  highlight_fields: "title,body",
  per_page: 10,
});
```

Those parameters already encode product decisions: title matches matter most, results are limited to tech, and newer posts win when relevance is tied. Typesense returns results, but the frontend still owns debounce behavior, keyboard navigation, empty states and safe highlight rendering. An InstantSearch adapter is available if you do not want to build the UI from scratch.

## Chinese quality depends on segmentation

Setting `locale: zh` is the starting point, not a quality guarantee. Chinese has no whitespace word boundaries, and ICU's character and boundary rules do not necessarily understand product names, abbreviations or domain terminology. Phrases such as “大型語言模型,” “臺灣攀岩,” and package names mixed into Chinese text may call for different vocabulary rules.

Build a small relevance suite from real content before launch: queries, expected top results, and results that must not appear. Cover Traditional and Simplified variants, English abbreviations, typos and short terms. If default segmentation is insufficient, Typesense supports `pre_segmented_query: true`: run both indexed text and queries through your own tokenizer and give Typesense whitespace-separated tokens. Both sides must share the same rules or the query and index silently stop matching.

Typo tolerance is intuitive for Latin text but may expand one- or two-character Chinese queries too aggressively. Tune `num_typos` per field instead of disabling fuzzy matching globally. Synonyms can handle variants such as “台灣” and “臺灣” or site-specific naming, but they do not replace sound segmentation and clean source content.

## Deployment choices and operational cost

Typesense ships as a single binary without runtime dependencies and can be self-hosted through Docker or system packages. Its [production guide](https://typesense.org/docs/guide/running-in-production.html) still recommends a highly available cluster for production traffic and monitoring health, memory, CPU and latency. “Start one container” is not the entire operating model: someone remains responsible for backups, upgrades, capacity, node failures and index recovery.

Typesense Cloud runs the same core binary and API as self-hosted Typesense, while adding managed infrastructure, an administrative UI and high-availability options. The choice is not just a VM invoice; it is whether the team wants to be on call for search. A small content site that does not want a persistent service should also evaluate a build-time index such as Pagefind. Typesense becomes more valuable when content changes frequently or the product needs filters, facets, cross-collection search and finer relevance control.

## Where it fits—and where it does not

Typesense fits product catalogs, documentation, editorial archives and in-app SaaS search: structured records, read-heavy traffic, and a team that wants to control ranking with a compact parameter set. It also fits projects that value a self-hosting option but do not want to begin with the full Elasticsearch mapping, analyzer and cluster surface.

It is not a primary database, a web crawler or a solution to synchronization consistency. If the core requirement is complex log analysis, arbitrary aggregations or a mature enterprise plugin ecosystem, Elasticsearch / OpenSearch covers more ground. If a team wants a completely managed service with frontend components and operational tooling bundled together, Algolia may save more engineering time. A small static site may not need a search server at all.

The decision comes down to ownership. If you are willing to own a pipeline that transforms content into documents, synchronizes the index and tunes relevance, Typesense provides a compact, complete search core under your control. If you do not want to own that pipeline, choose a higher-level managed product instead of deciding from API simplicity alone.

## References

- [Typesense: What is Typesense?](https://typesense.org/docs/overview/)
- [Typesense: Features](https://typesense.org/docs/overview/features.html)
- [Typesense: Ranking and Relevance](https://typesense.org/docs/guide/ranking-and-relevance.html)
- [Typesense: Tips for Locale-Specific Search](https://typesense.org/docs/guide/locale.html)
- [Typesense: Running Typesense in Production](https://typesense.org/docs/guide/running-in-production.html)
- [Typesense Search API](https://typesense.org/docs/29.0/api/search.html)
- [Typesense Collections API](https://typesense.org/docs/29.0/api/collections.html)
