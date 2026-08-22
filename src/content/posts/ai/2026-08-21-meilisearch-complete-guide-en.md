---
title: "Meilisearch Complete Guide: Indexing, Chinese Search, and Tenant Security"
date: 2026-08-21
category: ai
type: deep-dive
tags: [meilisearch, full-text-search, search-engine, self-hosted, typo-tolerance, multi-tenant]
lang: en
tldr: "Meilisearch turns application data into fast, typo-tolerant full-text search; the hard parts are index settings, asynchronous tasks, Chinese tokenization, access filters, and tested recovery."
description: "A practical Meilisearch guide covering installation, indexes, documents, tasks, searchable and filterable settings, Chinese search, API keys, tenant tokens, backups, and a safe Agent tool interface."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-meilisearch-complete-guide)

[Meilisearch](https://www.meilisearch.com/docs/learn/getting_started/what_is_meilisearch) is a full-text search engine designed for application search. Once products, articles, documents, or support knowledge are synchronized into an index, it provides prefix search, typo tolerance, filters, sorting, and facets without scanning the primary database on every query.

It is not a primary database, a public-web search service for an Agent, or a vector database that retrieves only by embedding similarity. If you are still comparing the cost models of search, crawling, and self-hosted tools, start with [Choosing Free Search and Scraping Tools](/posts/ai/2026-08-21-free-search-scraping-tools-en). This guide begins after the decision to adopt Meilisearch and focuses on making it operable.

## Start with indexes, documents, and tasks

Meilisearch has a small data model, but three concepts must remain separate:

- An **index** contains searchable documents and search settings, such as `articles` or `products`.
- A **document** is a JSON object. Every document in an index uses the same primary key, such as `id`.
- A **task** tracks an asynchronous operation. Creating an index, writing or deleting documents, and changing settings normally enqueue background work.

The primary key is a synchronization contract, not merely a convenient lookup field. The [official primary-key documentation](https://www.meilisearch.com/docs/resources/internals/primary_key) explains that an index has one primary key, matching keys update existing documents, and the key cannot be changed while the index contains documents. Specify it instead of relying on inference:

```bash
curl -X POST 'http://127.0.0.1:7700/indexes' \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"uid":"articles","primaryKey":"id"}'
```

The returned `taskUid` means the request was queued. According to the [task documentation](https://www.meilisearch.com/docs/capabilities/indexing/tasks_and_batches/monitor_tasks), HTTP 202 or an `enqueued` status does not mean the operation succeeded. Deployment code must query `/tasks/{taskUid}` until it reaches `succeeded`, and preserve the error plus stop downstream work when it reaches `failed`.

```bash
curl \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  "http://127.0.0.1:7700/tasks/$TASK_UID"
```

Starting ingestion before a settings task finishes, or testing search while an ingestion task is still queued, creates a particularly confusing failure mode: the API returned no error, but the index is incomplete.

## Local installation: begin with a localhost-only smoke test

The [self-hosting guide](https://www.meilisearch.com/docs/resources/self_hosting/getting_started/install_locally) covers binaries, package managers, and Docker. This Docker command is suitable for local validation. It binds only to localhost and stores data in a dedicated volume:

```bash
docker run --rm -it \
  -p 127.0.0.1:7700:7700 \
  -e MEILI_ENV=development \
  -v "$PWD/meili_data:/meili_data" \
  getmeili/meilisearch:v1.37
```

Do not carry the development configuration into production. Pin the image version, configure a master key, protect traffic with a TLS reverse proxy, restrict network ingress, and put both the data directory and backups on durable storage. Check dump and snapshot compatibility before upgrades instead of automatically deploying `latest`.

## Search quality begins with settings

A new index searches all fields by default. That is convenient for a prototype and too broad for production. Meilisearch settings define each field's role:

- `searchableAttributes` selects full-text fields; their order also affects attribute ranking.
- `filterableAttributes` selects fields allowed in filters and facets.
- `sortableAttributes` selects fields allowed for runtime sorting.
- `displayedAttributes` limits fields returned in results.

```bash
curl -X PATCH 'http://127.0.0.1:7700/indexes/articles/settings' \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  --data '{
    "searchableAttributes": ["title", "summary", "body"],
    "filterableAttributes": ["tenant_id", "lang", "category", "published"],
    "sortableAttributes": ["published_at"],
    "displayedAttributes": ["id", "title", "summary", "url", "lang", "published_at"]
  }'
```

The [searchable-attributes guide](https://www.meilisearch.com/docs/capabilities/full_text_search/how_to/configure_searchable_attributes) notes that changing this setting triggers asynchronous reindexing. The [filtering and sorting overview](https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/overview) explains why fields must be declared in advance: the engine builds additional data structures. Do not mark every field as filterable or sortable. Doing so increases indexing and memory costs and expands the query surface you must secure.

Treat settings like database migrations. Keep them in version control, create a fresh staging index, ingest a fixed corpus, run relevance regressions, and only then switch an alias or application configuration. Editing production settings in place can create both reindexing latency and ranking changes.

## Upserts and deletions both require task tracking

`PUT /indexes/{index}/documents` adds or updates documents by primary key. `POST` adds or replaces them. `PUT` is the natural choice for partial updates, but a synchronizer should still own a complete search projection whenever possible so fields from competing producers do not become stale.

```bash
curl -X PUT 'http://127.0.0.1:7700/indexes/articles/documents' \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  --data '[{
    "id": "post_20260821_meili",
    "tenant_id": "site_public",
    "lang": "en",
    "title": "Meilisearch Complete Guide",
    "summary": "Indexing, Chinese search, and tenant security",
    "url": "/posts/ai/2026-08-21-meilisearch-complete-guide-en",
    "category": "ai",
    "published": true,
    "published_at": 1787241600
  }]'
```

The [document API](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents) also returns a task. Deletion is no exception: when an article is unpublished, an account is erased, or a tenant leaves, send the delete request and wait for completion rather than removing the record only from the primary database.

```bash
curl -X DELETE \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  'http://127.0.0.1:7700/indexes/articles/documents/post_20260821_meili'
```

A reliable synchronizer records the source revision, document ID, task UID, submission time, and final status. It also supports retries and reconciliation. Meilisearch is a derived index; a database or object store remains the source of truth.

## Tune typo tolerance by field risk

[Typo tolerance](https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/typo_tolerance_settings) is enabled by default. It is valuable for product names, article titles, and ordinary natural language, allowing results to survive a missing character or mistyped key.

Order numbers, SKUs, statute identifiers, and staff codes usually require exact matching. Disable typo tolerance for those attributes, and configure numeric handling when necessary. Otherwise `AB-1208` may retrieve another identifier that is textually close but operationally unrelated. Compare recall and false matches with a real query set after every change.

Synonyms are not a substitute for data governance. “LLM” and “large language model” may be legitimate product vocabulary, but brand names, medical terms, and legal concepts need domain review. Version synonyms with the rest of the settings.

## The zh-TW limitation is language detection, not a total lack of tokenization

Meilisearch uses the [Charabia tokenizer](https://www.meilisearch.com/docs/resources/help/language), and its supported-language table includes specialized tokenization for Chinese and Japanese. It is therefore inaccurate to say that Meilisearch has no Chinese word segmentation.

Automatic language selection is the real constraint. The [multilingual dataset guide](https://www.meilisearch.com/docs/capabilities/indexing/how_to/handle_multilingual_data) makes three important points:

1. Chinese and Japanese should not share one field because they share many characters, making tokenizer selection unreliable.
2. Very short and partial-word queries are also difficult to classify.
3. A separate index per language is the preferred design. If one index is unavoidable, separate languages into fields and use localized attributes and query locales to make the language explicit.

For zh-TW site search, I would begin with `articles_zh_tw` instead of placing Traditional Chinese, Japanese, and English prose in one `body` field. Keep `lang: "zh-TW"` in each document, constrain queries to the language, and benchmark real data: bilingual brand names, synonyms, full-width and half-width punctuation, Traditional/Simplified variants, two-character queries, and common mistakes.

Meilisearch can provide the basic tokenizer and typo-tolerance machinery, but it cannot infer Taiwanese vocabulary automatically. Pairs such as local and mainland terminology, English product names, and internal abbreviations still require synonyms, normalization, or reranking. A fixed relevance test determines whether Chinese search is ready—not the existence of “Chinese” in a support table.

## API keys and tenant tokens protect different boundaries

The [security overview](https://www.meilisearch.com/docs/capabilities/security/overview) separates three layers:

- Keep the master key and administrative API keys on the backend for indexes, settings, documents, and key management.
- A search-only key is suitable for public search without tenant isolation.
- A trusted backend generates tenant tokens that bind search access to indexes and filter rules.

In a multi-tenant product, silently adding `tenant_id = acme` in frontend code is not isolation; the caller can edit the request. Tenant-token filter rules must enforce the boundary. The [tenant-token payload documentation](https://www.meilisearch.com/docs/capabilities/security/advanced/tenant_token_payload) explains that a token is derived from a restricted parent API key and may include an expiration. Give the parent only the required actions and indexes, and never let the token outlive it.

The [API-key guide](https://www.meilisearch.com/docs/capabilities/security/how_to/manage_api_keys) leads to a straightforward policy: least privilege, scoped indexes, expiration, no admin key in browsers or mobile apps, and a rotation procedure. Search results contain stored document data as-is. Escape or sanitize content at the rendering boundary instead of expecting the search engine to prevent XSS.

## Snapshots and dumps serve different recovery goals

A self-hosted search service eventually faces disk failure, an accidental index deletion, or a version upgrade. The [backup overview](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/overview) distinguishes two mechanisms:

| Mechanism | Strength | Constraint | Best use |
|---|---|---|---|
| Snapshot | Fast, exact database copy | Loads only in the same Meilisearch version; larger file | Same-version disaster recovery |
| Dump | Portable data blueprint | Rebuilds indexes during import; slower | Upgrades, migrations, long-term retention |

The [snapshot guide](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/snapshots) also notes that a new snapshot overwrites the old file in the default directory. Scheduling creation is not enough. Copy snapshots into a separate failure domain, retain multiple generations, and run restore drills in an isolated environment.

A dump can be created with `POST /dumps` and, like other background operations, must be tracked to completion. The [dump documentation](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/dumps) positions it for migration. A safe upgrade produces and validates a dump, imports it into the target version, runs search regressions, and only then moves traffic.

## Give an Agent a narrower interface than the native API

An Agent does not need a Meilisearch admin key, the ability to choose arbitrary indexes and filters, or an unlimited `limit`. A safer tool contract can be this small:

```ts
type SearchKnowledgeInput = {
  query: string;
  category?: "docs" | "policy" | "support";
  sort?: "relevance" | "newest";
  limit?: number;
};

type SearchKnowledgeHit = {
  id: string;
  title: string;
  snippet: string;
  sourceUrl: string;
  updatedAt: string;
};
```

The backend adapter then:

1. Derives the tenant from authenticated identity instead of trusting a model-supplied `tenant_id`.
2. Maps categories and sort choices to allowlists rather than accepting arbitrary filter expressions.
3. Enforces hard limits on query length, result count, timeout, and response size.
4. Searches with a tenant token or a server-side restricted key.
5. Returns quotable snippets, source URLs, and timestamps instead of placing entire private documents in context.

Writes, deletes, settings, and backups belong to a separate controlled ingestion or operations workflow—not to a general chat Agent. If an Agent proposes new knowledge, write it to the source of truth, review it, let a synchronizer produce the search document, and wait for the task to succeed. Direct index mutation breaks deletion propagation, permissions, and auditability.

## Minimum production checklist

- The primary key is explicit, and every document ID can be rebuilt from the source of truth.
- Settings are versioned; searchable, filterable, sortable, and displayed fields are minimal sets.
- Every write, delete, settings change, and dump waits for task `succeeded`.
- zh-TW has been tested with short queries, character variants, brand names, synonyms, and mixed Chinese-English text.
- A public search key does not enforce tenant isolation; private data uses backend-enforced tenant tokens and filter rules.
- Admin keys never enter frontend code, Agent prompts, logs, or analytics events.
- Snapshots or dumps leave the host, and a restore drill has actually passed.
- The search index remains rebuildable derived data, not a transactional source of truth.

Meilisearch offers product-grade full-text search with a smaller operational surface than a large search cluster. The tradeoff is that you still own index schemas, asynchronous tasks, Chinese relevance, tenant boundaries, and disaster recovery. Define those contracts on day one and it becomes a pragmatic search component. Judge it only by the instant-search demo, and the difficult parts will appear after launch.

## References

- [What is Meilisearch?](https://www.meilisearch.com/docs/learn/getting_started/what_is_meilisearch)
- [Install Meilisearch locally](https://www.meilisearch.com/docs/resources/self_hosting/getting_started/install_locally)
- [Primary key](https://www.meilisearch.com/docs/resources/internals/primary_key)
- [Tasks and batches](https://www.meilisearch.com/docs/capabilities/indexing/tasks_and_batches/monitor_tasks)
- [Add or update documents](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents)
- [Configure searchable attributes](https://www.meilisearch.com/docs/capabilities/full_text_search/how_to/configure_searchable_attributes)
- [Filtering, sorting, and faceting](https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/overview)
- [Typo tolerance settings](https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/typo_tolerance_settings)
- [Language support](https://www.meilisearch.com/docs/resources/help/language)
- [Index multilingual datasets](https://www.meilisearch.com/docs/capabilities/indexing/how_to/handle_multilingual_data)
- [Security overview](https://www.meilisearch.com/docs/capabilities/security/overview)
- [Manage API keys](https://www.meilisearch.com/docs/capabilities/security/how_to/manage_api_keys)
- [Tenant token payload](https://www.meilisearch.com/docs/capabilities/security/advanced/tenant_token_payload)
- [Data backup overview](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/overview)
- [Snapshots](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/snapshots)
- [Dumps](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/dumps)
