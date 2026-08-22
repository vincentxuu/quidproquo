---
title: "Elasticsearch and OpenSearch: Choosing a Lucene-Based Site Search Engine"
date: 2026-08-22
category: tech
type: deep-dive
tags: [elasticsearch, opensearch, search, full-text-search, lucene, site-search]
lang: en
tldr: "Elasticsearch and OpenSearch both build text analysis, BM25, aggregations, and vector search on Lucene, but licensing, governance, hybrid-search APIs, and managed ecosystems have followed separate paths since the 2021 fork."
description: "A comparison of Elasticsearch and OpenSearch for site search, covering their shared Lucene foundation, full-text queries, aggregations, hybrid search, governance, and operational tradeoffs."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-elasticsearch-opensearch-site-search)

[Elasticsearch](https://www.elastic.co/elasticsearch) and [OpenSearch](https://opensearch.org/About/) are distributed search and analytics engines. Both can power full-text site search, filters, ranking, suggestions, and faceted navigation, as well as log and observability workloads.

They are not the same product. OpenSearch forked from the Elasticsearch and Kibana 7.10.2 codebase in 2021, and the two have evolved independently since.

For a static site with only a few hundred pages, either engine is usually excessive. They become reasonable when content changes continuously and search needs rich schemas, deliberate relevance tuning, access-control filters, or multi-node availability. The real choice is not merely whether the engine can find text. It is which governance, API, and operating model your team is prepared to own.

## Shared foundations: Lucene, analysis, and BM25

Both products use [Apache Lucene](https://lucene.apache.org/core/) underneath. Lucene is a Java search library that provides fielded full-text search, phrase and range queries, faceting, suggestions, vector nearest-neighbor search, and pluggable ranking models. Elasticsearch and OpenSearch add JSON REST APIs, shards, replicas, cluster coordination, security, and management interfaces.

Text is not compared as an untouched string. During indexing and querying, analysis runs character filters, a tokenizer, and token filters to produce terms. Word segmentation, case folding, synonyms, and stemming therefore change recall. A common site-search mistake is to tune boosts before using `_analyze` to inspect how product names, error codes, or Chinese text are tokenized.

Full-text fields normally use BM25 for scoring. BM25 accounts for term frequency within a document, rarity across the corpus, and field length. A rare error code can therefore be more discriminative than a common word. BM25 does not understand meaning, but it remains dependable for API names, model numbers, and exact technical phrases. It should be the baseline before vector retrieval is added.

## A practical site-search query

The basic Query DSL structure below works in both products. `multi_match` gives the title more weight, `filter` restricts language and publication state without affecting the relevance score, and the `terms` aggregation produces a category facet.

```http
GET posts/_search
{
  "size": 10,
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "cloudflare d1 timeout",
            "fields": ["title^3", "description^2", "body"],
            "type": "best_fields",
            "minimum_should_match": "75%"
          }
        }
      ],
      "filter": [
        { "term": { "lang": "zh-TW" } },
        { "term": { "draft": false } }
      ]
    }
  },
  "highlight": {
    "fields": { "title": {}, "body": {} }
  },
  "aggs": {
    "categories": {
      "terms": { "field": "category.keyword" }
    }
  }
}
```

This is a starting point, not a universal ranking formula. Build a representative query set, record which pages should appear near the top, and then adjust analyzers, synonyms, field weights, and fuzzy matching. Without explicit judgments, relevance tuning tends to improve only the query currently on screen.

## After the fork: different licenses and governance

In 2021, Elasticsearch source that had been under the Apache License moved to SSPL and Elastic License 2.0. OpenSearch forked from the final Apache 2.0 codebase and continues under that license.

In 2024, Elastic added the OSI-approved AGPLv3 as an option for portions of the Elasticsearch and Kibana source, while its official prebuilt distribution remains under ELv2. If you redistribute or modify the software, or expose the search engine itself as a managed service, have counsel evaluate the license of the exact source and distribution you use. “Source available” is not a sufficient conclusion.

Governance has also separated. Elastic directs Elasticsearch product development and offers self-managed, Elastic Cloud Hosted, Serverless, and Kubernetes deployment paths. OpenSearch is an independent project with technical steering and foundation governance under the Linux Foundation umbrella. It can be self-hosted and is also closely associated with Amazon OpenSearch Service. Neither background makes one engine automatically better, but it affects patch sources, plugin compatibility, support contracts, and long-term roadmaps.

## Similar capabilities, diverging interfaces

| Area | Elasticsearch | OpenSearch |
| --- | --- | --- |
| Lexical search | Query DSL, analysis, BM25, highlighting | Query DSL, analysis, BM25, highlighting |
| Filtering and analytics | Bucket, metric, and pipeline aggregations | Bucket, metric, and pipeline aggregations |
| Vector search | Dense and sparse vectors, kNN, and `semantic_text` | k-NN vectors, Neural Search, and model integrations |
| Hybrid search | Retrievers support RRF or linear combination; ES\|QL offers another multistage interface | A `hybrid` query uses search pipelines for score normalization or rank fusion |
| Operations UI | Kibana and the Elastic ecosystem | OpenSearch Dashboards and its plugin ecosystem |

Shared terminology does not imply shared APIs. Hybrid search is the clearest example: an Elasticsearch retriever example cannot simply be pasted into OpenSearch. OpenSearch expects its `hybrid` query at the top level. Its documentation also says that the query cannot be nested inside wrapper queries such as `function_score`, because doing so may fail or bypass normalization. Before an upgrade, rerun query tests against the documentation for the target product and release. A common ancestor is not a compatibility promise.

Vector search is not a free relevance upgrade, either. Embeddings add generation pipelines, vector fields, memory use, and latency. Lexical and vector scores also have different scales, so results need RRF, normalization, or reranking. For article titles, error codes, and product identifiers, carefully configured BM25, synonyms, and field weights are often more controllable than vector-only retrieval.

## Operations are the expensive part

Self-hosting either engine means owning mappings, reindexing, shards and replicas, node failures, disk watermarks, the JVM, rolling upgrades, security patches, monitoring, and snapshots. More shards are not automatically better: every shard consumes resources, and poor sizing increases query fan-out and recovery time. Replicas add read capacity and can take over after a primary-shard failure, but they are not backups. An accidental deletion is replicated too, so snapshots must live in an external repository and restores must be rehearsed.

A managed service removes some cluster work, but it does not choose schemas, analyzers, relevance judgments, or synchronization strategy for you. Confirm which product a provider actually operates, which plugins and API versions it supports, and whether snapshots remain portable across services.

## How to choose

Elasticsearch is usually the stronger fit when a team wants integration with Elastic's Search, Observability, or Security product lines; values its retrievers, `semantic_text`, or Elastic Cloud experience; and accepts the associated licensing and vendor relationship. OpenSearch is usually the stronger fit when Apache 2.0 is a firm requirement, the system already depends heavily on Amazon OpenSearch Service, or the team prefers its plugin and search-pipeline ecosystem.

Neither is a good answer to “we only need a search box for a static blog, and nobody will operate a cluster.” A build-time index such as Pagefind, a hosted site-search product, or database-native full-text search is usually simpler. Conversely, when search is a core product capability requiring near-real-time indexing, complex ACLs, facets, cross-field ranking, hybrid retrieval, and observable relevance tuning, Elasticsearch and OpenSearch deserve serious evaluation.

Do not vote on a feature checklist. Run a small proof of concept on real documents and queries. Test language analysis, top-ranked results, indexing latency, failure recovery, and upgrades. The engine whose search quality your team can maintain over time is the less expensive one.

## References

- [Apache Lucene Core](https://lucene.apache.org/core/)
- [Elasticsearch Query DSL](https://www.elastic.co/docs/explore-analyze/query-filter/languages/querydsl)
- [Elasticsearch: Build your search queries](https://www.elastic.co/docs/solutions/search/querying-for-search)
- [Elastic software licensing FAQ](https://www.elastic.co/pricing/faq/licensing/)
- [Elastic: Deploy and manage](https://www.elastic.co/docs/deploy-manage)
- [OpenSearch: About](https://opensearch.org/About/)
- [OpenSearch full-text queries](https://docs.opensearch.org/latest/query-dsl/full-text/index/)
- [OpenSearch hybrid search](https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/index/)
- [OpenSearch hybrid query limitations](https://docs.opensearch.org/latest/query-dsl/compound/hybrid/)
