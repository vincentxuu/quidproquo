---
title: "Private Corpus Search Boundaries: Decide Where Data May Go First"
date: 2026-08-22
type: deep-dive
category: ai
tags: [rag, information-retrieval, data-security, access-control, qdrant, meilisearch]
lang: en
tldr: "The first private-corpus decision is not which vector database to buy. Define data classes, trust zones, policy enforcement points, and freshness SLAs so every index, model, and observability system receives only the minimum data it is allowed to process."
description: "Design secure search over private enterprise documents by mapping threat models, component boundaries, exfiltration paths, authorization, and freshness SLAs."
draft: false
series:
  name: "Private Corpus Pipeline"
  order: 1
---

> 🌏 [中文版](/posts/ai/2026-08-22-private-corpus-boundaries)

“The data stays on the corporate network” is not a security design for private-corpus search. Once a document enters the pipeline, its content can appear in connector staging, parsed output, lexical indexes, vectors, query logs, traces, and model requests. The real boundary is whether each data type is allowed to cross each component boundary.

This series follows that data lifecycle: arrival, updates, authorized retrieval, and verified disappearance. BM25, vector search, and reranking appear only as components; retrieval techniques belong in [The RAG Techniques Compendium](/en/series/rag-techniques).

## Write four inventories before choosing components

First, classify the data. Public, internal, confidential, personal, and regulated data may be allowed in different environments. Chunks, embeddings, summaries, and query logs can preserve identifiable content, so they inherit the source sensitivity unless an explicit review says otherwise.

Second, map every resting place: originals, staging files, indexes, backups, dead-letter queues, application logs, model providers, and observability platforms. Record region, encryption, retention, deletion method, and administrators. An unanswered cell means you cannot yet claim the data stays private.

Third, identify the authority for identity and access. There must be one answer for who the user is, which tenant and groups they belong to, where document ACLs originate, and how quickly revocation takes effect. [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final) rejects implicit trust based only on network location or ownership; it protects resources and requires authentication and authorization before access.

Fourth, define freshness SLAs. A policy edit might need to become searchable within ten minutes, an employee revocation within one minute, and a legal deletion within its mandated period across indexes, caches, and backup handling. Without a deadline, “eventual consistency” merely renames an unknown delay.

## Policy enforcement is the architectural spine

```text
Source systems
  │  content + source ACL + revision
  ▼
Connector → quarantine/parser → canonical document store
                                  │
                    policy-aware indexer
                         ┌────────┴────────┐
                         ▼                 ▼
                  Meilisearch          Qdrant
                   (lexical)            (vector)
                         └────────┬────────┘
                                  ▼
User → identity → policy decision → filtered retrieval → reranker → LLM
                         │                 │              │
                         └──── audit metadata, not unrestricted content ────┘
```

Three choices in this diagram are deliberate.

The connector moves stable source IDs, revisions, ACLs, and deletion signals—not just text. Without them, downstream systems cannot distinguish an update from a duplicate, revocation, or deletion.

Authorization filters come from a trusted server using the authenticated identity. [Qdrant multitenancy](https://qdrant.tech/documentation/tutorials/multiple-partitions/) can filter a shared collection by tenant payload; [Meilisearch tenant tokens](https://www.meilisearch.com/docs/capabilities/security/overview) embed search rules in short-lived scoped credentials. These are enforcement mechanisms, not the authority for access. If a client can choose `tenant_id`, the filter is merely an optional parameter.

The reranker and LLM receive authorized candidates only. Retrieving a company-wide top 100 and filtering in application code can leak content into logs or an external model, while also damaging recall when too few candidates survive.

## Threat-model both data and instructions

At minimum, test five paths:

1. What can a stolen connector token read or inject?
2. Can a malicious indexed document influence the model through hidden instructions?
3. Can a user control tenant, ACL filters, index names, or limits?
4. Do logs, traces, errors, or dead-letter queues retain private content?
5. After revocation or deletion, do old chunks, caches, snapshots, or rebuild datasets remain retrievable?

The [OWASP RAG Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) treats ingestion through output as attack surface, while its prompt-injection guidance states that RAG does not eliminate prompt injection. Retrieved documents remain untrusted input. Isolate parsing, inspect hidden content, constrain tools and output, and do not ask a system prompt to enforce data access.

## Self-hosted, managed, or hybrid

**Self-host everything** when data cannot leave an administered environment and the team can operate keys, TLS, backups, patching, and recovery. This reduces third-party processors; it does not remove internal misconfiguration, log leakage, or excessive privileges.

**Use managed services** when contracts, residency, retention, and deletion commitments fit the policy and operations should be delegated. Evaluate the complete chain: search, embeddings, reranking, LLM, and observability.

**Use a hybrid boundary** when originals and sensitive metadata must remain controlled but approved chunks may reach a specific provider, or when lexical search stays internal while low-sensitivity data uses an external model. The cost is harder lineage, deletion, and incident investigation across boundaries.

An actionable first step is a “component × data type” matrix. Fill every cell with allow/deny, retention, encryption, administrator identity, and deletion method. Treat unknown cells as denied. That matrix is a more useful architecture decision than choosing Qdrant or Meilisearch first.

## Launch gate

- Run negative authorization tests with two tenants and one cross-group document; unauthorized content must not leave the search engine.
- Disable one user and delete one document, then measure propagation through indexes, caches, query services, and backup policy.
- Inspect logs, traces, dead-letter queues, and model requests; retain only fields required for diagnosis.
- Drill a stolen connector token, malicious document, and index outage; verify that sync can stop, credentials can be revoked, and indexes can be rebuilt from the source of truth.

This article establishes the boundary. The next turns canonical IDs, checksums, idempotent upserts, and tombstones into continuous synchronization. The third covers query authorization and deletion propagation; the last evaluates retrieval on a fixed Traditional Chinese corpus.

## References

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST SP 800-207A: Policy Enforcement and Cloud-Native Access Control](https://csrc.nist.gov/pubs/sp/800/207/a/final)
- [OWASP RAG Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
- [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [Qdrant: Configure Multitenancy](https://qdrant.tech/documentation/tutorials/multiple-partitions/)
- [Meilisearch: Security and Tenant Tokens](https://www.meilisearch.com/docs/capabilities/security/overview)
