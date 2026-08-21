---
title: "Securing Private-Corpus Queries: ACLs, Deletion Propagation, and Freshness"
date: 2026-08-22
category: ai
type: deep-dive
tags: [private-corpus, access-control, acl, multi-tenancy, data-lineage, observability]
lang: en
tldr: "Authorization must take effect before candidate generation, while ACLs, deletion events, and source versions must propagate to every derived index; freshness needs measurable event-time SLOs too."
description: "A practical boundary for private-corpus search, from pre-filtering, post-filtering, and tenant isolation to revocation, deletion propagation, source lineage, and freshness monitoring."
draft: false
series:
  name: "Private Corpus Pipeline"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-08-22-private-corpus-access)

Putting private content in a search index does not make it safe to query. The hard case is the moment after a user leaves a group, a document becomes confidential, or a source deletes a page: the keyword index, vector index, cache, and summary copies do not update at once.

This article is about authorization and data state at query time. It does not re-explain BM25, embeddings, hybrid search, or reranking. The governing test is simple: **a result must be relevant, visible to this caller now, still exist, and be no staler than the promise you made.**

## Pre-filtering is the security boundary; post-filtering is defense in depth

A safe query starts when the backend authenticates the identity, resolves the tenant and groups, and sends authorization constraints into every candidate generator:

```text
authenticated identity
        │
        ▼
policy decision ── tenant_id + allowed principals + policy version
        │
        ├── keyword index ──┐
        ├── vector index  ──┼── merge / rank ── final authorization check ── response
        └── cache          ──┘
```

That is pre-filtering: unauthorized documents never enter the candidate set. Post-filtering checks authorization again after retrieval. It is valuable for catching synchronization delays and implementation mistakes, but it should not be the only boundary.

Post-filtering alone has three problems. First, filling the top k requires repeated over-fetching; when authorized documents are sparse, results become incomplete or latency becomes unpredictable. Second, unauthorized documents have already entered ranking, logs, traces, or caches. Even if their content is hidden, titles, scores, and document IDs can leak. Third, one response path that forgets the filter—autocomplete, export, or a debug endpoint—is enough to bypass the ACL.

The [Azure AI Search security-filter pattern](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search) shows the boundary clearly: store user or group identifiers in a filterable field and match them at query time. The documentation also warns that these principals are merely strings; this pattern does not authenticate or authorize them for the application. The query service must therefore derive constraints from a verified token, never accept a browser-supplied `tenant_id` or group list.

Both layers can coexist: pre-filter in candidate generators, then a final authorization check before returning results. The latter should fail closed; a timeout from the authorization service must not turn “unknown” into “allow.” [NIST SP 800-207](https://doi.org/10.6028/NIST.SP.800-207) states the broader principle: resource authorization is dynamic, strictly enforced before access, and informed by continuously collected access and asset state.

## ACL failures usually live in copies and defaults

Private search ACL failures rarely come from a sophisticated algorithm. They happen because one derived copy dropped its permissions:

- The document has an ACL, but its chunks do not.
- The keyword index has `allowed_group_ids`; the vector index does not.
- The document ACL changed, but the query cache still uses an old group set in its key.
- An empty ACL means “public” even though the connector simply failed to fetch permissions.
- A user leaves a group, but a long-lived token or local membership cache still carries the old membership.

The safe default is the opposite: a record missing its tenant, ACL, source version, or policy version must not enter a serving index. Every chunk, summary, and attachment inherits the source document's authorization fields and retains its derivation relationship. An ACL update must be able to find every copy through the canonical document ID.

ACL data has a freshness problem too. [Azure AI Search document-level access control](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview) explicitly says that queries compare token permissions with permission metadata already stored in the index. Source ACL changes appear only after an indexer run, push update, or source-specific refresh. Verifying a fresh caller token is therefore insufficient; the document-side ACL copy also needs a bounded synchronization delay.

Nested groups and inherited permissions should not be improvised from strings at request time. The [Google Zanzibar paper](https://www.usenix.org/conference/atc19/presentation/pang) frames the “new enemy” problem: a user revokes another person's access and then writes new content; a stale snapshot must not let the revoked reader see that later content. Zanzibar uses external consistency, snapshot reads, and consistency tokens to preserve causal order between ACL and content updates. Most teams do not need to reproduce Zanzibar, but they should assign monotonic versions to ACLs and content so a query service can reject an index snapshot older than its required policy version.

## Multi-tenant isolation cannot depend on an optional filter

A shared collection can reduce cost, but a trusted backend must inject `tenant_id`, and every query path must enforce it. [Qdrant's multitenancy documentation](https://qdrant.tech/documentation/guides/multiple-partitions/) describes the basic shared-collection pattern: put a tenant field in each point's payload and filter on it, with dedicated shards available for larger tenants.

That filter partitions data; it is not a complete authorization system. The application must still control who may name each tenant, and batch query, recommend, scroll, count, and administrative APIs must pass through the same query gateway. A cache key needs at least the tenant, the principal or an equivalent hash of the authorization set, and the policy version. Otherwise identical query text can reuse another user's results.

Choose isolation strength by risk. A shared collection with mandatory filters may suit ordinary internal teams. Regulatory, encryption-key, or contractual boundaries may call for a tenant-specific collection, cluster, or account. At every level, run negative tests: create same-named documents in two tenants and exercise every query API, checking that results, counts, facets, and error messages reveal nothing across tenants.

## Deletion is a workflow, not an API response

Deleting from the primary index is not enough when a source removes a document. Treat deletion as a stateful event:

```text
source deleted / access revoked
  → tombstone recorded
  → keyword copies deleted
  → vector chunks deleted
  → summaries, caches, exports invalidated
  → search visibility verified
  → retention purge completed
```

A tombstone carries the canonical document ID, source, source version, event time, and reason. Each consumer records its offset or completion time; retries must be idempotent. A temporarily unreachable source should not turn every missing item into a deletion, because a connector outage would become a mass purge. An explicit revocation, by contrast, is a security event that belongs on a high-priority queue with a shorter visibility window.

An HTTP 200 from a delete API does not necessarily mean the result is gone from search. The [OpenSearch Delete Document API](https://docs.opensearch.org/latest/api-reference/document-apis/delete-document/) explains that a deletion becomes searchable only after an index refresh by default; `refresh=wait_for` waits until the change is visible. That gives three distinct timestamps: deletion accepted, no longer searchable, and removed from storage and backups according to retention policy. Monitoring and external commitments must say which one they mean.

## Source lineage tells you what else must be deleted

Every searchable record should answer: which source object produced it, which connector run handled it, which parser and schema version were used, which content and ACL versions it represents, and which chunks or summaries it derived. Without that lineage, deletion falls back to text matching or full rebuilds, and an operator cannot explain why a result remains stale.

The [OpenLineage API](https://openlineage.io/apidocs/openapi/) models processing lineage through run, job, input dataset, and output dataset events. A private-corpus pipeline does not have to deploy OpenLineage to use the same model: give each synchronization run a unique ID, record START and COMPLETE or FAIL, and connect each input source version to all output IDs. End users need not see this metadata, but operators must be able to trace one search hit through the entire path.

## A freshness SLO measures event time, not whether a schedule ran

“Synchronizes every five minutes” is not a freshness SLO. Measure end-to-end delay from a source event to query-visible state:

- **Content lag:** source modification time to the new version becoming searchable.
- **ACL lag:** source revocation time to denial on every query path.
- **Deletion lag:** source deletion time to absence from every serving index and cache.
- **Run health:** last successful connector time, consecutive failures, dead-letter count, and backlog age.
- **Version skew:** version differences among keyword, vector, summary, and ACL copies.

Set an SLO for each source based on risk. Directory memberships and revocations may need to take effect within minutes; product manuals may tolerate longer delay. Alert on a high percentile of lag and the age of the oldest incomplete event, not just an average. Averages hide the handful of deletions stuck for hours.

Finally, add a canary. Periodically create a document visible only to a test group, verify that an authorized user can find it and an unauthorized user cannot, then revoke and delete it while timing every index and cache. This one test exercises ACLs, deletion propagation, and freshness together. It is stronger evidence than a green connector dashboard.

## Overall

Private-corpus query safety depends on synchronized state, not on hiding a result in the last UI layer. Put tenant and ACL constraints into pre-filtered candidate generation and reinforce them with a final check. Treat revocations and deletions as high-priority events that propagate through every copy. Use canonical IDs, run IDs, and versions for source lineage. Then verify the promise with end-to-end lag.

One useful action tonight: pick a protected document, list every copy in the keyword index, vector index, summaries, caches, and exports, then revoke access once and time it. Any copy you cannot find and any interval you cannot measure is a real security gap in the pipeline.

## References

- [Microsoft Learn: Document-level access control in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)
- [Microsoft Learn: Security filters for trimming results in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)
- [NIST SP 800-207: Zero Trust Architecture](https://doi.org/10.6028/NIST.SP.800-207)
- [USENIX ATC 2019: Zanzibar: Google's Consistent, Global Authorization System](https://www.usenix.org/conference/atc19/presentation/pang)
- [Qdrant: Multitenancy](https://qdrant.tech/documentation/guides/multiple-partitions/)
- [OpenSearch: Delete Document API](https://docs.opensearch.org/latest/api-reference/document-apis/delete-document/)
- [OpenLineage API documentation](https://openlineage.io/apidocs/openapi/)
