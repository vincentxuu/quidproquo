---
title: "Framework Update | Agno 3.0.5"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.0.5 turns Knowledge's embedding failures from 'silently marked success' into 'honestly reported failure' — a release that fixes a data-integrity contract"
tldr: "Agno 3.0.5 highlights: (1) Knowledge ingestion no longer swallows embedding failures — a new partial status sits between completed and failed, and embedders raise EmbeddingError instead of returning an empty vector; (2) Breaking: code catching ModelProviderError around Bedrock embedding failures stops working — switch to EmbeddingError — and the content status API returns 404 for missing content again; (3) adds an opt-in embedding retry, a GandrTools text-to-speech toolkit, an llmman model provider, and an embed_before_replace guard that stops a failed re-ingest from wiping existing data."
series:
  name: "AI Framework Changelog"
  order: 12
---

> 🌏 [中文版](/posts/daily/2026-09-02-framework-agno-3.0.5)

## Version Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.0.5 |
| Previous | v3.0.4 |
| Release Date | 2026-09-01 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.5) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.0k |

## Why This Release Matters

[The previous entry (3.0.2)](/en/posts/daily/2026-08-31-framework-agno-3.0.2-en) covered Agno publishing its own Agents/Teams/Toolkits as MCP tools. 3.0.5 goes back to fix something more fundamental: the data-integrity contract of Knowledge (RAG) ingestion. Until now, Agno had a dangerous default — if a single chunk's embedding call failed, the whole piece of content could still end up marked `completed`, and you'd only find out the index was incomplete when a query came back missing an answer. 3.0.5 makes that failure visible: `ContentStatus` gains a `partial` state meaning "partially indexed, searchable but incomplete," and embedders now raise on failure instead of silently returning an empty result. For any downstream logic that treated Knowledge's `completed` status as "this data can be trusted," that status has effectively been lying until now.

## Key Changes

- **`partial` content status**: new `ContentStatus.PARTIAL` for content where some chunks embedded and others didn't — searchable but incomplete, no longer forced into the `completed`/`failed` binary → downstream logic can handle "partially indexed" content separately, e.g. prompting a re-run or flagging it for follow-up
- **Opt-in embedding retry** (off by default): `Knowledge(max_embedding_retries=3, embedding_retry_backoff=1.0)` retries a failed chunk embedding automatically → authentication failures ignore the retry setting and fail immediately (the same rejected credential won't succeed on a retry), and each retry re-embeds the entire document rather than just the failed chunk, so weigh the cost
- **`GandrTools` text-to-speech toolkit**: new integration with the Gandr TTS API → one more built-in voice-output option without hand-rolling an API wrapper
- **`llmman` model provider**: new model provider integration → one more optional inference backend
- **Actionable failure messages**: embedding failure messages now name the chunk count, embedder, failure reason, and a recovery step, replacing the generic "Could not insert embedding" → less guesswork when debugging a failed ingest
- **`embed_before_replace` guard**: on re-ingestion, new content is embedded successfully before old content is deleted, and a failure aborts before any deletion happens → closes a potential data-loss path where a failed re-embed could previously leave a document with zero chunks
- **`MCPTools` accepts static `headers=`**: connect-time auth headers can be passed directly on the `url=` path without constructing a `StreamableHTTPClientParams` → shorter auth setup for Streamable HTTP/SSE

## Breaking Changes

- **Embedding failures now raise instead of returning empty**: the `ContentStatus` API (`/openapi.json`) changes from `["processing","completed","failed"]` to `["processing","completed","partial","failed"]`; calling a vector DB's `search()` directly now raises on failure instead of returning `[]` (`Knowledge.search()` itself is unaffected and still returns no results)
  - Impact: any code that treated "empty search results" and "backend error" as the same case needs to catch the new exception separately; no schema migration is required (the status column was already `varchar`)
- **AWS Bedrock embedding failures now raise `EmbeddingError`, not `ModelProviderError`**: existing `except ModelProviderError` blocks around Bedrock embedding stop catching, and the error propagates instead
  - Impact: any project wrapping Bedrock embedding calls in `except ModelProviderError` must switch to `except EmbeddingError`
- **`GET /knowledge/content/{id}/status` returns 404 for missing or non-owned content**: previously returned 200 with `status: "failed"`, which was easy to misread as "content exists but embedding failed"
  - Impact: any frontend or integration code using this endpoint to check content existence must treat 404 as "doesn't exist," not "embedding failed"
- **`skip_if_exists=True` no longer skips `failed`/`partial` content**: only genuinely `completed` content is skipped; `failed` or `partial` content gets re-embedded
  - Impact: batch ingestion pipelines relying on `skip_if_exists` for idempotency may see longer re-run times (but improved correctness — content that previously stalled halfway is no longer mistaken for done)

## Migration Guide

### Upgrading from 3.0.4 to 3.0.5

```bash
pip install --upgrade agno==3.0.5
```

Update the exception type for Bedrock embedding handling:

```python
# Old (3.0.4 and earlier)
from agno.exceptions import ModelProviderError

try:
    embedder.get_embedding(text)
except ModelProviderError:
    handle_embedding_failure()

# New (3.0.5, Bedrock embedding failures)
from agno.exceptions import EmbeddingError

try:
    embedder.get_embedding(text)
except EmbeddingError:
    handle_embedding_failure()
```

Handle the new `partial` status:

```python
from agno.knowledge.types import ContentStatus

content = knowledge.get_content(content_id)
if content.status == ContentStatus.PARTIAL:
    # Some chunks failed to index — searchable but incomplete
    notify_incomplete_ingestion(content_id)
elif content.status == ContentStatus.COMPLETED:
    mark_ready(content_id)
```

Enable automatic retries where needed, keeping in mind each retry re-embeds the whole document:

```python
knowledge = Knowledge(
    max_embedding_retries=3,
    embedding_retry_backoff=1.0,
)
```

## How It Compares to Other Frameworks

The previous entry in this series covered Haystack v3.1.0 solving "the conversation gets too long" via `CompactionHook`. Agno 3.0.5 solves the opposite-looking-but-related problem: "the data looks complete when it isn't." Both belong to the same class of Agent-system bug — the kind that doesn't crash outright but quietly erodes correctness. Compared to shipping new features, fixes that make failure states honest matter more for framework maturity: whether a RAG pipeline is trustworthy isn't about how smoothly it runs on the happy path, but whether it tells the truth when something breaks.

## Today's Takeaway

I used to think RAG correctness issues mostly came from retrieval ranking or chunking strategy. Seeing Agno fix "embedding failures get swallowed while the status still says completed" made it clear the more fundamental risk sits earlier in the pipeline: if the failure status coming out of ingestion isn't trustworthy, everything downstream that assumes "this knowledge base is fully indexed" is built on a false foundation. Evaluating an Agent framework's Knowledge/RAG module should start with whether its failure states are honest, not just how good retrieval quality looks on paper.

## References

- [Agno v3.0.5 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.5)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.4 — GitHub Release (previous version)](https://github.com/agno-agi/agno/releases/tag/v3.0.4)
- [Agno 3.0.2 — previous framework update](/en/posts/daily/2026-08-31-framework-agno-3.0.2-en)
