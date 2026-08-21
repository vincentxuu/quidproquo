---
title: "From Source to Index: Sync and Incremental Updates for Private Corpora"
date: 2026-08-22
category: ai
type: deep-dive
tags: [data-pipeline, rag, qdrant, meilisearch, data-sync, indexing]
lang: en
tldr: "Private-corpus sync is not periodic refetching. It requires stable canonical IDs, source versions plus checksums for change detection, idempotent upserts, and tombstones that propagate deletion through every index."
description: "The full lifecycle from private-data connectors to search indexes: change detection, version control, idempotent writes, tombstones, rebuilds, dead-letter queues, and auditable deletion propagation."
series:
  name: "Private Corpus Pipeline"
  order: 2
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-private-corpus-sync)

Connecting SharePoint, Google Drive, an internal wiki, or object storage to search is usually easy on the first full import. The second run is where things break: after a document is renamed, moved, permissioned differently, or deleted, can the index update the right copy instead of retaining a ghost duplicate?

This post covers only how data moves safely and continuously from source to index. Search ranking and RAG techniques are out of scope; see the separate guides to [Qdrant](/posts/ai/2026-08-21-qdrant-complete-guide-en) and [Meilisearch](/posts/ai/2026-08-21-meilisearch-complete-guide-en) for their query behavior.

## Treat sync as a state machine

A maintainable pipeline is not a three-step `fetch → chunk → index` script. It is a state machine that persists source state:

```text
source connector
      │ change hint / periodic scan
      ▼
source manifest ──► fetch ──► normalize ──► checksum
      │                                      │
      │ deleted                              ├─ unchanged → update checkpoint
      ▼                                      └─ changed
  tombstone                                      ▼
      │                                  versioned document
      └──────────────► outbox / queue ◄──────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              Meilisearch upsert   Qdrant upsert
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    sync ledger / audit log
```

A connector should only translate a source into a common event envelope: `upsert` or `delete`, a source cursor, a source version, and a document identifier. Parsers, chunkers, and index clients should not know about SharePoint page tokens or S3 continuation tokens. That boundary keeps an upstream API change from forcing an index-writer rewrite.

## Canonical IDs decide whether two observations are the same document

Do not use a filename or URL directly as the index primary key. Both change on moves and renames, leaving two sets of chunks for one document. Prefer a source-provided object ID that survives renames, namespaced by tenant and source:

```text
document_id = sha256(tenant_id + ":" + source_type + ":" + source_object_id)
chunk_id    = sha256(document_id + ":" + parser_version + ":" + chunk_ordinal)
```

Only fall back to a normalized path when the source has no stable ID. In that case, a move must become a deletion of the old ID plus creation of the new one. Do not put the title, modification time, or content checksum into the canonical ID: every edit would then create a new key and defeat upsert semantics.

Each manifest row should retain at least the `document_id`, source locator, source version, content checksum, pipeline versions, last-seen time, and deletion state. An index can be discarded and rebuilt; the manifest is the source of truth for sync decisions.

## Use source hints to save I/O, then let the checksum decide

Connectors expose different change signals. An HTTP source can retain `ETag` or `Last-Modified`, then issue the next request with `If-None-Match` or `If-Modified-Since`; an unchanged resource returns `304 Not Modified`. [MDN's conditional-request guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests) distinguishes strong and weak validators, so a weak ETag does not guarantee byte-for-byte identity.

A website connector can first inspect Sitemap `<lastmod>` values to narrow the candidate set. But the [Sitemaps protocol](https://www.sitemaps.org/protocol.html) defines the field as optional and says it should contain the page's actual modification date, not the sitemap generation time. It is therefore a hint, not the final authority. Other sources may expose change feeds, delta cursors, or object generations.

The normalized-content checksum should make the downstream recomputation decision. Remove request IDs, generation timestamps, and irrelevant navigation that change on every fetch, then hash the stable representation with SHA-256. This avoids rerunning parsing and embedding when a source revision changed but searchable text did not, while still catching sources that fail to update `lastmod`.

Also store `parser_version`, `chunker_version`, `embedding_model_version`, and `schema_version`. An unchanged content checksum still needs recomputation when a pipeline version would change the index output. Source version answers whether upstream changed; checksum answers whether normalized content changed; pipeline versions answer whether identical content produces different index records. Keep them separate.

## Idempotent upserts make retries safe

Queues commonly provide at-least-once delivery, so the same event may be processed repeatedly. A consumer must converge on the same result: stable IDs, complete payloads, version-gated writes, and checkpoint advancement only after success.

[Qdrant's upsert API](https://api.qdrant.tech/api-reference/points/upsert-points) overwrites a point with an existing point ID. [Meilisearch's add-or-update API](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents) partially updates top-level fields, while replacing a nested object in full. These semantics differ. The sync layer should produce a complete canonical document and deliberately choose replace or update rather than assuming that `upsert` means the same operation in both systems.

```python
def apply(event, ledger, indexes):
    current = ledger.get(event.document_id)
    if current and event.version <= current.applied_version:
        return "stale-or-duplicate"

    if event.op == "delete":
        indexes.delete_document_and_chunks(event.document_id)
    else:
        indexes.replace_document(event.document_id, event.payload)

    ledger.mark_applied(event.document_id, event.version, event.event_id)
```

Version comparison needs a per-document source sequence, generation, or monotonically increasing internal revision. Wall-clock timestamps from different hosts are not a safe ordering mechanism. When index writes and ledger updates cannot share a transaction, use an outbox plus a retryable reconciliation job to detect states where one index succeeded and another failed.

## A tombstone is data, not absence

"Not observed in this run" cannot immediately mean deleted. The connector may have timed out, pagination may have stopped halfway through, or a service account may have temporarily lost access to an entire folder. Deletion should come from an explicit delete event or from a set difference against the manifest only after a complete enumeration succeeds.

A tombstone should record at least `document_id`, delete version, detection time, reason, and completion state for every downstream target. Persist the tombstone first, then remove the document, chunks, vectors, and derived caches, and only then mark it complete. A mid-flight crash remains retryable, and the audit trail explains when and why data was removed.

Retaining tombstones for a period also blocks a delayed old upsert from resurrecting deleted content. Only a recreation event newer than the delete version may clear the tombstone. Deletion propagation is complete not when an API returns `200`, but when every index can verify that the `document_id` is absent and the ledger records the confirmation time.

## Rebuild beside the live index

When the parser, chunking rules, or embedding model changes substantially, updating records in place makes stale leftovers hard to detect. Build a generation-tagged index from the manifest instead:

1. Pin a rebuild-start checkpoint and write its snapshot into the new generation.
2. Capture new events during the rebuild; do not send them only to the old index.
3. Replay events after the checkpoint until lag reaches zero.
4. Validate document counts, chunk counts, sampled checksums, and tombstones, then atomically switch the read alias.
5. Retain the old generation briefly for rollback, then remove it under the retention policy.

This blue-green rebuild separates recomputation from serving. The manifest must be replayable. If a rebuild has to refetch everything from the source, permissions and content may already have changed, so the old index cannot be reproduced.

## A DLQ is a repair bench, not a trash can

Network timeouts and rate limits merit exponential-backoff retries. Malformed files, oversized objects, password-protected PDFs, and incompatible schemas will not improve on the hundredth attempt. After the retry limit, move the event to a dead-letter queue (DLQ) with its `event_id`, source locator, failed stage, error class, pipeline version, and attempt count.

[Amazon SQS documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) describes DLQs as isolation for unsuccessfully processed messages so operators can inspect the cause and redrive them. In practice, alert on both DLQ depth and oldest-message age. After fixing a parser, redrive at a controlled rate to avoid overwhelming the source or index. Deletion events deserve higher priority and separate alerts; they must not wait indefinitely behind ordinary parsing failures.

## Minimum pre-production checklist

- Does delivering the same event twice leave identical content and document counts?
- Does the canonical ID survive a rename or move?
- Does the version gate reject an older upsert that arrives late?
- Does a failed partial enumeration avoid generating mass tombstones?
- After deletion, can you verify that the document, every chunk, both indexes, and caches are empty?
- Do updates made during a rebuild survive the generation switch?
- Can operators diagnose and redrive DLQ entries, with immediate alerts for deletion failures?

The invariants are simple: **one stable identity per source object; indexes accept only the newest version; deletion is as retryable and observable as update.** Once those hold, Qdrant and Meilisearch become disposable projections rather than additional databases that cannot be reconciled.

## References

- [MDN: HTTP conditional requests for incremental source sync](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests)
- [Sitemaps.org: Sitemap protocol](https://www.sitemaps.org/protocol.html)
- [Qdrant API: Upsert points into an index](https://api.qdrant.tech/api-reference/points/upsert-points)
- [Meilisearch API: Add or update index documents](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents)
- [Amazon SQS: Using dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
