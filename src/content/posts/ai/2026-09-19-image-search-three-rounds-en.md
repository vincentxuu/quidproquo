---
title: "The Bug Photo That Wouldn't Show Up: Three Rounds of Fixing Image Search"
date: 2026-09-19
category: ai
type: debug
tags: [rag, image-search, elasticsearch, cjk, agent-tools, debugging]
lang: en
tldr: "An AI assistant platform's image search needed three rounds of fixes: pushing node_type filtering into the ES query to stop text chunks from hogging top-k slots, making filename matching deterministic instead of relying on the LLM to pass an optional parameter, and switching from Postgres icontains to ES match for CJK-aware partial matching."
description: "A three-round debugging journey taking RAG image retrieval from 'can't find it' to 'finds the right one,' covering Elasticsearch filtering strategy, LLM tool parameter design, and CJK tokenization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-image-search-three-rounds)

## TL;DR

A government agricultural agency used our AI assistant platform to look up pest photos. Results were either missing or wrong species entirely. Three rounds of fixes, each revealing a deeper problem: text chunks hogging top-k → the LLM not always passing the `file_name` parameter → [Postgres](https://www.postgresql.org/docs/current/functions-matching.html) `icontains` failing on CJK partial matching.

## Context

The platform's knowledge base supports two node types: text and image. A client uploaded a pest identification atlas — each image had a filename (e.g., `黃吹綿介殼蟲-無-生態圖-a4901.jpg`, roughly "yellow cottony cushion scale – ecological photo") and descriptive text. When a user asked "show me photos of yellow cottony cushion scale," the agent called the `image_search` tool to retrieve matching image nodes from [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).

Should be straightforward. In practice, the client reported issues three weeks running: no images returned, wrong species, or images missing entirely.

## Round 1: Text Chunks Hogging Top-k

### Problem

`image_search` results were contaminated with text nodes. The user asked for images, but text chunks filled every top-k slot.

### Investigation

The `image_search` tool shared the same underlying retrieval function as `retrieve_text_nodes`. The only difference was a post-filter — fetch top-k from ES first, then `filter(node_type == 'image')` in Python.

If top-k was 12 and 10 results were text, only 2 images survived. Worse, all 12 could be text, and images vanished completely.

### Root cause

The `node_type` filter ran **after** the ES query, not **inside** it. ES didn't know you only wanted images — it ranked by relevance, naturally putting high-matching text chunks first.

### Fix

Push the `node_type` filter into the [ES query's `filter` clause](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html):

```python
# Before: post-filter in Python
results = es_search(query, top_k=12)
images = [r for r in results if r.node_type == "image"]

# After: filter inside ES query
results = es_search(
    query,
    top_k=12,
    filters=[{"term": {"node_type": "image"}}]
)
```

All 12 slots reserved for image nodes.

### Thought it was fixed

Tests passed. The client confirmed "images are showing up now." Two days later: "some pests still don't show photos."

---

## Round 2: LLMs Don't Always Pass Your Optional Parameters

### Problem

The `image_search` tool had an optional `file_name` parameter, letting the LLM pass a precise filename for exact matching. The idea: if the user specified a particular image, filename lookup beats semantic search.

Checking the production agent's tool call logs revealed the LLM **usually didn't pass `file_name`** — even when the user's query contained enough information to infer one.

### Investigation

In the tool schema, `file_name` was marked optional. To the LLM's decision logic, optional means "may or may not pass." Whether it did depended on prompt wording and context length.

Deeper problem: the code path checked `if file_name:`, so when the LLM didn't pass it, the entire filename matching path was skipped. Pure semantic search only.

### Root cause

**Delegating a critical retrieval strategy to an optional LLM parameter** means retrieval quality depends on the LLM's tool-call behavior — which is non-deterministic.

### Fix

Make it deterministic: regardless of whether the LLM passed `file_name`, auto-detect potential filename patterns from the raw query, then run both paths (semantic search + filename match) and merge:

```python
def image_search(query: str, file_name: str | None = None):
    # Don't rely entirely on LLM passing file_name
    detected_name = auto_detect_filename(query) or file_name

    # Run both paths
    semantic_results = es_semantic_search(query, node_type="image")
    exact_results = (
        filename_match(detected_name) if detected_name else []
    )
    return merge_and_deduplicate(exact_results, semantic_results)
```

### Thought it was fixed

Image retrieval improved noticeably. Then the client reported: "searching '黃吹綿介殼蟲圖片' (yellow cottony cushion scale photo) returns nothing, but searching '黃吹綿介殼蟲' (without 'photo') works."

Two extra characters. Completely different results.

---

## Round 3: CJK Substring Matching Isn't What You Think

### Problem

User searched `黃吹綿介殼蟲圖片` ("yellow cottony cushion scale photo"). The knowledge base filename was `黃吹綿介殼蟲-無-生態圖-a4901.jpg`.

Intuitively, `黃吹綿介殼蟲` is part of the filename — should match. But it didn't.

### Investigation

Filename matching used [Postgres](https://www.postgresql.org/docs/current/functions-matching.html) `icontains` (Django ORM's `__icontains`), which translates to SQL `LIKE '%...%'`:

```sql
SELECT * FROM nodes
WHERE filename ILIKE '%黃吹綿介殼蟲圖片%'
```

The user input was `黃吹綿介殼蟲圖片` (including "圖片" meaning "photo"), but the filename didn't contain "圖片" — it had `黃吹綿介殼蟲-無-生態圖-a4901.jpg`. `ILIKE` does **exact substring matching**, not fuzzy matching. `黃吹綿介殼蟲圖片` is not a substring of the filename, so no match.

With [Elasticsearch's `match` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html), the analyzer tokenizes the query first: `黃吹綿` `介殼蟲` `圖片`. Then matches these tokens against the filename's tokens: `黃吹綿` `介殼蟲` `無` `生態圖` `a4901`. Partial token overlap scores — no need for the entire substring to match exactly.

### Root cause

**Postgres `ILIKE` does byte-level substring search with no understanding of CJK word boundaries.** For English, `icontains` usually works — spaces provide natural tokenization. Chinese has no spaces. `黃吹綿介殼蟲圖片` and `黃吹綿介殼蟲-無-生態圖` have no byte-level containment relationship.

### Fix

Replace Postgres `icontains` with [ES `match` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html), leveraging a CJK analyzer (such as the [ICU analyzer](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html) or [smartcn](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-smartcn.html)):

```python
# Before: Postgres icontains (byte-level substring)
nodes = Node.objects.filter(filename__icontains=query)

# After: ES match with CJK analyzer
results = es_client.search(
    index="knowledge_nodes",
    body={
        "query": {
            "bool": {
                "must": [
                    {"match": {"filename": query}},
                    {"term": {"node_type": "image"}}
                ]
            }
        }
    }
)
```

Search `黃吹綿介殼蟲圖片` → tokenized to `黃吹綿` `介殼蟲` `圖片` → matches `黃吹綿介殼蟲-無-生態圖-a4901.jpg` (first two tokens hit) → scored, returned.

## Why This Happened

Three rounds, each with a root cause at a different layer:

| Round | Layer | Root cause |
|---|---|---|
| 1 | ES query design | `node_type` filter placed outside query; text chunks consumed image top-k quota |
| 2 | LLM tool parameter design | Critical retrieval strategy delegated to an optional parameter the LLM doesn't always pass |
| 3 | Database matching strategy | Postgres `icontains` doesn't understand CJK word boundaries; ES `match` + tokenizer required |

They look like three independent bugs, but share a common design blind spot: **treating "search" as an atomic operation, ignoring that each layer (ES query → LLM decision → string matching) carries its own assumptions and limitations.**

## Lessons

1. **Filter at the database layer, not in post-processing code.** An ES `filter` clause and a Python list comprehension produce different results — the former shapes what enters the top-k, the latter only trims the output.
2. **Don't assume LLMs will fill optional parameters you designed for them.** If a parameter is critical to result quality, either make it required or auto-detect it server-side. Don't leave it as "may or may not pass."
3. **CJK text matching can't use English-world substring logic.** Without spaces for natural tokenization, `ILIKE '%..%'` causes severe recall loss in Chinese. ES full-text search with a CJK tokenizer is the way.

## References

- [Elasticsearch Bool Query — filter clause](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) — pushing filter conditions into the ES query
- [Elasticsearch Match Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) — the foundational full-text query type
- [Elasticsearch ICU Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html) — CJK tokenizer
- [Elasticsearch Smart Chinese Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-smartcn.html) — Chinese tokenizer
- [PostgreSQL Pattern Matching — LIKE](https://www.postgresql.org/docs/current/functions-matching.html) — how `ILIKE` works under the hood
