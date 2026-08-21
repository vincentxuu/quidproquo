---
title: "Qdrant Complete Guide: Collections, Hybrid Search, and Self-Hosted Operations"
date: 2026-08-21
category: ai
type: deep-dive
tags: [qdrant, vector-database, rag, self-hosted, hybrid-search]
lang: en
tldr: "Qdrant is not just a place to store embeddings: define the vector schema, index frequently filtered payload fields, then add dense+sparse queries, tenant boundaries, snapshots, and monitoring to build an operable retrieval service."
description: "A practical Qdrant guide covering installation, collection and payload design, dense+sparse hybrid queries, multitenancy, snapshots, and operational failure modes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-qdrant-complete-guide)

If you have not decided between Qdrant, Pinecone, Weaviate, and pgvector, start with the [vector database comparison](/posts/ai/2026-03-12-vector-database-comparison-en). This guide assumes you chose Qdrant and now need to turn “it stores embeddings” into an operable retrieval service.

Qdrant is a vector search engine, not an embedding model, document parser, or authorization system. It is good at combining vector similarity with structured filtering in one query. Chunking, tenant authorization, and the ability to reconstruct data remain application responsibilities.

## Start with the right data model

Qdrant has three basic units:

- A **collection** contains points and fixed named-vector configurations.
- A **point** has an ID, zero or more vectors, and a JSON payload.
- A **payload index** gives a filtered field a type-specific index and helps the query planner estimate candidate cardinality.

A named dense vector has one fixed dimension and distance metric within a collection. A 768-dimensional model output cannot be inserted into a 1,536-dimensional vector name. Named vectors let one point carry `dense`, `sparse`, image, or ColBERT multivectors with independent configurations.

Payload is arbitrary JSON; Qdrant does not enforce your application schema. A production ingestion boundary should validate at least:

```json
{
  "tenant_id": "tenant-a",
  "document_id": "handbook-2026",
  "chunk_id": "handbook-2026#0042",
  "source_uri": "s3://knowledge/handbook.pdf",
  "language": "en",
  "updated_at": "2026-08-21T09:00:00Z",
  "acl": ["staff", "engineering"]
}
```

`document_id` enables whole-document rebuilds and deletion, `chunk_id` supports provenance, and `tenant_id` plus `acl` become mandatory query conditions. Keeping these fields only in the source document makes later filtering and cleanup unreliable.

## Installation: Docker is a starting point, not production readiness

Qdrant recommends Docker for development and testing:

```bash
docker pull qdrant/qdrant

docker run --name qdrant \
  -p 127.0.0.1:6333:6333 \
  -v "$(pwd)/qdrant-data:/qdrant/storage" \
  qdrant/qdrant
```

Seeing the welcome message at `http://localhost:6333` only proves that the process started. Qdrant's self-hosted open-source distribution has no authentication by default and can listen on externally reachable interfaces. Before exposure, configure an API key, bind a private network, enable TLS, and separate admin, read-only, or collection-scoped credentials.

Storage has a hard boundary too. Primary Qdrant storage requires a block-level, POSIX-compatible filesystem; NFS or S3 cannot serve directly as the primary data directory. Prefer SSD/NVMe when vectors or indexes are on disk. Production also needs multi-node deployment, a load balancer, backup, monitoring, and disaster recovery. Without operators, Qdrant Cloud is more honest than treating one long-running container as a production design.

## Create a collection: dimension and distance are schema decisions

This creates dense and sparse named vectors. Four dimensions keep the example readable; replace them with the embedding model's real output dimension.

```bash
curl -X PUT 'http://localhost:6333/collections/documents' \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "dense": {"size": 4, "distance": "Cosine"}
    },
    "sparse_vectors": {
      "sparse": {"modifier": "idf"}
    }
  }'
```

Choose the distance metric required by the model, not the one with the most familiar name. Qdrant supports Cosine, Dot, Euclid, and Manhattan, and normalizes Cosine vectors on upload. Adding a named vector later does not backfill old points. Queries against that new vector name can return nothing until the data is upserted again.

## Create payload indexes before bulk ingestion

Having payload does not make filtering fast. Payload indexes are explicit, and Qdrant recommends creating them before ingestion to avoid indexing a large existing dataset later.

```bash
curl -X PUT 'http://localhost:6333/collections/documents/index?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{
    "field_name": "tenant_id",
    "field_schema": {"type": "keyword", "is_tenant": true}
  }'

curl -X PUT 'http://localhost:6333/collections/documents/index?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "document_id", "field_schema": "keyword"}'

curl -X PUT 'http://localhost:6333/collections/documents/index?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "updated_at", "field_schema": "datetime"}'
```

Index only fields used by filters. Every index costs memory and disk, so indexing speculative metadata turns a possible future need into a guaranteed current cost. Keep field types consistent as well: a keyword condition does not silently coerce an integer payload value, and the visible symptom may simply be zero results.

## Make upserts, updates, and deletion repeatable

Point IDs should be stable and derived from source identity—for example, a UUID v5 over `tenant_id + document_id + chunk_id`. Re-running ingestion then overwrites the same point instead of creating duplicate chunks.

```bash
curl -X PUT 'http://localhost:6333/collections/documents/points?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{
    "points": [{
      "id": "7d0b14f9-25ba-56c7-b473-d450a67f33b2",
      "vector": {
        "dense": [0.12, 0.08, 0.44, 0.31],
        "sparse": {"indices": [12, 81, 405], "values": [0.7, 1.1, 0.5]}
      },
      "payload": {
        "tenant_id": "tenant-a",
        "document_id": "handbook-2026",
        "chunk_id": "handbook-2026#0042",
        "language": "en",
        "updated_at": "2026-08-21T09:00:00Z"
      }
    }]
  }'
```

Point mutations are first written to the WAL and then applied by the service; the API can respond before application completes. Use `wait=true` when an ingestion job needs explicit confirmation, but do not turn per-point synchronous waits into a throughput strategy. Batch upserts, persist checkpoints, and retry failures with stable IDs.

Delete a whole source with both tenant and document filters rather than a remembered list of point IDs:

```bash
curl -X POST 'http://localhost:6333/collections/documents/points/delete?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{
    "filter": {"must": [
      {"key": "tenant_id", "match": {"value": "tenant-a"}},
      {"key": "document_id", "match": {"value": "handbook-2026"}}
    ]}
  }'
```

## Filtering belongs inside retrieval

Qdrant filters combine `must`, `should`, and `must_not` conditions. A trusted server should inject tenant and ACL conditions from the authenticated session into the same query. Never let the client choose the tenant freely, and do not retrieve a top 100 before filtering in application code: that can lose relevant authorized candidates and allows unauthorized payload to leave the database boundary.

A dense query looks like this:

```http
POST /collections/documents/points/query
{
  "query": [0.18, 0.05, 0.49, 0.28],
  "using": "dense",
  "filter": {
    "must": [
      {"key": "tenant_id", "match": {"value": "tenant-a"}},
      {"key": "acl", "match": {"any": ["staff"]}}
    ]
  },
  "limit": 10,
  "with_payload": true
}
```

## Dense plus sparse: fuse two candidate sets

Dense vectors capture semantic similarity. Sparse vectors retain exact signals such as product names, part numbers, error codes, and rare terms. Qdrant hybrid queries use `prefetch` to retrieve candidates from both spaces, then fuse them with RRF or DBSF.

```http
POST /collections/documents/points/query
{
  "prefetch": [
    {
      "query": {"indices": [12, 81], "values": [0.8, 1.2]},
      "using": "sparse",
      "filter": {"must": [{"key": "tenant_id", "match": {"value": "tenant-a"}}]},
      "limit": 50
    },
    {
      "query": [0.18, 0.05, 0.49, 0.28],
      "using": "dense",
      "filter": {"must": [{"key": "tenant_id", "match": {"value": "tenant-a"}}]},
      "limit": 50
    }
  ],
  "query": {"fusion": "rrf"},
  "limit": 10,
  "with_payload": true
}
```

RRF fuses ranks and does not require dense and sparse scores to share a scale, making it a safe starting point without an evaluation set. DBSF normalizes score distributions before fusion and is useful when you trust the raw scores. Avoid adding raw scores with a fixed alpha unless you have validated it on your own queries. Keep `prefetch.limit` above the final limit so the fusion stage has enough candidates to rerank.

## Multitenancy: partitioning is not authorization

Many small tenants usually share a collection and use an indexed `tenant_id` payload. Large tenants can move to user-defined shards, while tiered multitenancy places small shared and large dedicated tenants in one collection. A collection per tenant looks clean but has per-collection overhead and rarely scales well to a large tenant count.

Isolation has two layers:

1. **Data and search boundaries:** an `is_tenant: true` payload index, a tenant filter on every query, and dedicated shards or collections where necessary.
2. **Access control:** private networking, TLS, API keys, and collection-scoped permissions. The backend injects filters; browsers and end users never receive an administrative key.

Shared sparse/BM25 collections have another boundary: shard-wide IDF statistics can let one tenant's term frequencies affect another tenant's ranking. With the IDF modifier, Qdrant can scope the IDF corpus to a tenant filter. That improves ranking isolation but still does not replace authorization.

## A snapshot is backup material, not the whole recovery plan

Create a collection snapshot through the API:

```bash
curl -X POST 'http://localhost:6333/collections/documents/snapshots?wait=true'
```

Copy snapshots off the node to object storage and regularly perform an actual restore drill. The target must currently use the same minor Qdrant version as the source, or at most one minor version higher. It also needs about twice the collection size in free disk during restore because the snapshot and restored data coexist.

Snapshots cover Qdrant state only. A reproducible RAG system must separately preserve source documents, chunking version, dense and sparse model identifiers, vector dimensions, payload schema, collection configuration, and ingestion checkpoints. A vector backup without knowing which model generated it cannot be updated safely.

## Common production failure modes

| Symptom | Likely cause | First action |
|---|---|---|
| Upsert returns 400 | Vector name or dimension differs from collection schema | Inspect collection schema and embedding output |
| Known data returns no results | Payload type mismatch, wrong tenant filter, or a new vector name was never backfilled | Retrieve a point and inspect its actual vectors and payload |
| Filtering becomes slow | Missing or wrongly typed payload index | Inspect collection indexes and create the right one |
| Fresh data appears intermittently | `indexed_only` excludes an unoptimized segment | Inspect optimizer state and query parameters |
| Latency and disk use spike during ingestion | Segment merging, indexing, or too many payload indexes | Watch optimizer, CPU, I/O, and segment metrics |
| Snapshot restore fails | Minor-version mismatch or insufficient disk | Build a compatible target and reserve about 2× disk |
| Cross-tenant data appears | Client-controlled filters or a shared admin key | Enforce filters server-side and reduce key scope |
| Public clients can read and write | Self-hosted Qdrant has no authentication by default | Isolate the network immediately, then add API keys and TLS |

Scrape `/metrics` from every node and use `/healthz`, `/livez`, and `/readyz` for their distinct health checks. HTTP 200 alone is insufficient. Track query latency and errors, point/vector counts, active replicas, optimizer backlog, CPU, memory, and disk I/O. Production strict mode can also reject unindexed filters, oversized batches, and excessive query complexity before they exhaust resources.

## The tradeoff

Qdrant's value is not zero operations. It places vectors, payload-aware filtering, sparse retrieval, and query fusion in one system. A sound adoption order is: lock the data and vector schema, create payload indexes, evaluate dense, sparse, and fusion on representative queries, then add tenant enforcement, restore drills, security, and monitoring.

If you only need a modest vector workload beside an existing Postgres deployment, pgvector may be cheaper operationally. If nobody wants the on-call responsibilities above, a managed service is the better design. Choosing self-hosted Qdrant means choosing both its retrieval capabilities and its operational obligations.

## References

- [Qdrant Installation](https://qdrant.tech/documentation/installation/)
- [Collections](https://qdrant.tech/documentation/manage-data/collections/)
- [Vectors](https://qdrant.tech/documentation/manage-data/vectors/)
- [Points](https://qdrant.tech/documentation/manage-data/points/)
- [Payload](https://qdrant.tech/documentation/manage-data/payload/)
- [Indexing](https://qdrant.tech/documentation/manage-data/indexing/)
- [Filtering](https://qdrant.tech/documentation/search/filtering/)
- [Hybrid Queries](https://qdrant.tech/documentation/search/hybrid-queries/)
- [Multitenancy](https://qdrant.tech/documentation/manage-data/multitenancy/)
- [Snapshots](https://qdrant.tech/documentation/snapshots/)
- [Migration and Recovery](https://qdrant.tech/documentation/migration-recovery-options/)
- [Security](https://qdrant.tech/documentation/security/)
- [Monitoring](https://qdrant.tech/documentation/operations/monitoring/)
- [Optimizer](https://qdrant.tech/documentation/operations/optimizer/)
