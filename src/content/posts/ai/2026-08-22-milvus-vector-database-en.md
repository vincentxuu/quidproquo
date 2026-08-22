---
title: "Milvus Vector Database Deep Dive: Segments, Indexes, and Distributed Operations"
date: 2026-08-22
category: ai
type: deep-dive
tags: [milvus, vector-database, rag, self-hosted, similarity-search]
lang: en
tldr: "Milvus separates real-time ingestion, historical queries, index building, and persistence into independently scalable components. It fits large, continuously updated retrieval services, but smaller projects often pay too much operational complexity for that architecture."
description: "A practical deep dive into Milvus segments and disaggregated architecture, PyMilvus ingestion and search, vector and scalar indexes, metadata filtering, backup, monitoring, and selection tradeoffs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-milvus-vector-database)

[Milvus](https://milvus.io/docs/architecture_overview.md) is an open-source database built for vector similarity search. It stores embeddings for text, images, or other content alongside primary keys and structured metadata, then provides approximate nearest-neighbor search, filtering, and hybrid retrieval. It is not an embedding model, and it does not decide how your application chunks documents or which data a user may access.

Milvus is defined less by a single ANN algorithm than by its separation of storage, compute, and control planes. A Standalone deployment can serve a small workload on one machine. At larger scale, Cluster mode can expand ingestion, query, and offline indexing workers independently. If you are still selecting a product, start with the [vector database comparison](/posts/ai/2026-03-12-vector-database-comparison-en).

This guide follows the lifecycle of a record: core architecture, ingestion and queries, indexes and metadata filtering, deployment and operations, and finally the workloads for which Milvus is—or is not—a good fit.

## Core architecture: collections become segments

Applications see collections, schemas, and entities. Inside Milvus, segments are the units that carry data and indexes. New records enter growing segments. After persistence, they become immutable sealed segments. Each sealed segment can receive its own index and be assigned to Query Nodes, so a new record does not require rebuilding an index for the entire collection.

The [official architecture documentation](https://milvus.io/docs/architecture_overview.md) describes four layers:

- Proxies receive requests and reduce results returned by multiple nodes.
- The Coordinator maintains topology, scheduling, and consistency as the control plane.
- Streaming Nodes handle the WAL, growing data, and real-time queries; Query Nodes search sealed data; Data Nodes run compaction and index construction.
- etcd stores metadata, object storage holds binlogs and index files, and the WAL preserves changes that have not yet become sealed segments.

```text
Application / PyMilvus
          |
        Proxy
          |
      Coordinator
       /    |    \
Streaming  Query  Data Node
   Node    Node   (index / compact)
       \     |     /
       WAL + etcd + object storage
```

This split suits asymmetric workloads. You can add Query Nodes when reads grow or Data Nodes when index jobs become a bottleneck, instead of scaling the whole database together. The cost is equally direct: responsibilities hidden inside a single-process database become multiple components that must be observed, backed up, and upgraded.

## Ingestion and queries: design for reconstruction

A RAG collection should retain a stable primary key, document and chunk identifiers, tenant boundaries, source text, and the vector. Avoid putting every attribute into an unconstrained dynamic field. Model frequently filtered metadata with explicit types so you can add scalar indexes, reject invalid values, and delete documents reliably.

The example below uses the `MilvusClient` API recommended by the current documentation. Four-dimensional vectors keep the sample readable; production code must use the embedding model's actual dimension and its recommended distance metric.

```python
from pymilvus import DataType, MilvusClient

client = MilvusClient(uri="http://localhost:19530", token="root:Milvus")

schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("chunk_id", DataType.VARCHAR, is_primary=True, max_length=128)
schema.add_field("tenant_id", DataType.VARCHAR, max_length=64)
schema.add_field("document_id", DataType.VARCHAR, max_length=128)
schema.add_field("text", DataType.VARCHAR, max_length=4096)
schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=4)

indexes = client.prepare_index_params()
indexes.add_index(
    field_name="embedding",
    index_type="HNSW",
    metric_type="COSINE",
    params={"M": 16, "efConstruction": 200},
)
indexes.add_index(field_name="tenant_id", index_type="INVERTED")
indexes.add_index(field_name="document_id", index_type="INVERTED")

client.create_collection(
    collection_name="knowledge_chunks",
    schema=schema,
    index_params=indexes,
)
```

Derive the primary key deterministically from `tenant_id + document_id + chunk position`. A rerun can then upsert the same entity rather than duplicate it, while document deletion can locate all chunks through `tenant_id` and `document_id` instead of leaving orphaned vectors.

```python
rows = [{
    "chunk_id": "tenant-a:handbook-2026:0042",
    "tenant_id": "tenant-a",
    "document_id": "handbook-2026",
    "text": "Refund requests must be submitted within fourteen days of purchase.",
    "embedding": [0.12, 0.08, 0.44, 0.31],
}]

client.upsert(collection_name="knowledge_chunks", data=rows)

hits = client.search(
    collection_name="knowledge_chunks",
    data=[[0.18, 0.05, 0.49, 0.28]],
    anns_field="embedding",
    filter='tenant_id == "tenant-a"',
    limit=5,
    output_fields=["document_id", "text"],
    consistency_level="Session",
    search_params={"metric_type": "COSINE", "params": {"ef": 64}},
)
```

A completed write does not mean every reader immediately sees the same state. Milvus [offers Strong, Bounded, Session, and Eventually consistency](https://milvus.io/docs/consistency.md), with Bounded as the default. Session is useful when one client must read its own writes. Strong fits tests or strict freshness requirements, at the cost of waiting for the latest timestamp. Do not use `flush()` as a per-record synchronization button: it advances growing segments toward sealed storage, while consistency settings govern visibility.

## Indexes and metadata filtering: measure recall before tuning speed

Milvus offers many vector indexes, but the initial decision can stay simple. Use FLAT for small datasets or an exact baseline. Start with HNSW when the dataset fits memory and low latency matters. Evaluate IVF, quantization, or disk-based indexes when data grows or memory becomes constrained. The [official index guide](https://milvus.io/docs/index-explained.md) stresses that indexes add build time, storage, and query-time memory, while approximate search trades recall for speed.

Do not copy index parameters blindly. HNSW's `M`, `efConstruction`, and query-time `ef`, or IVF's `nlist` and `nprobe`, need evaluation against your own queries, filter distribution, and top-k. Track recall, p95 latency, memory, and build time. When the embedding model or metric changes, build and evaluate a new collection, then switch an alias; do not mix two embedding generations in one field.

Metadata filtering should not happen after retrieval in application code. Milvus parses the filter into a plan and generates a bitset per segment so vector search only considers matching candidates. Frequently used fields such as `tenant_id`, `language`, and `updated_at` therefore deserve a [scalar index](https://milvus.io/docs/scalar_index.md). A trusted backend must inject authorization filters into every search. A browser must not choose its own tenant, and unauthorized rows must never be fetched before filtering.

## Deployment and operations: Standalone is an entry point, not a smaller Cluster

Milvus Lite works for local experiments, while Docker Compose Standalone is convenient for integration environments. Production Cluster deployments commonly use Kubernetes and scale Proxy, Streaming Node, Query Node, and Data Node separately. The documentation calls out an important boundary: [Standalone cannot currently be upgraded online into Cluster](https://milvus.io/docs/main_components.md). If high availability or horizontal scaling is imminent, plan migration and reconstruction instead of assuming a mode switch.

Before launch, put at least these duties in the runbook:

- Monitor read and write latency, errors, growing and sealed segments, compaction, index jobs, Query Node memory, and the health of etcd, WAL, and object storage.
- Restrict ingress with a private network, TLS, and authentication. Never hand default connection credentials to a frontend.
- Back up source documents, embedding and chunking versions, and ingestion checkpoints, and use [Milvus Backup](https://milvus.io/docs/milvus_backup_overview.md) for collection metadata and segments.
- Restore regularly into another collection, run real searches, and verify row counts. A backup file alone does not prove recoverability.
- Read compatibility matrices before upgrades. Milvus Backup restores have directional version constraints, and changing the WAL backend is not an ordinary rolling upgrade.

Disaggregated storage does not remove capacity planning. Object storage provides persistence, but Query Nodes still load or cache the fields and indexes needed for search. Rich metadata, HNSW graphs, and additional replicas all consume memory. Load tests must represent real filter ratios and cold starts, not only warmed, unfiltered queries.

## When Milvus fits—and when it does not

Milvus fits workloads where vector volume keeps growing, ingestion and search happen concurrently, read and write capacity must scale independently, and the team already operates Kubernetes and distributed storage. It is also compelling when several vector index families, scalar filtering, and hybrid retrieval need to live in one dedicated service.

It is a poor fit for a personal project with a few tens of thousands of chunks, a small team without SRE capacity, or a system whose primary need remains relational transactions and SQL joins. Chroma, LanceDB, or a managed service will usually be lighter for the first two cases. If PostgreSQL already owns the data and vector search is secondary, pgvector can avoid another synchronization and authorization model.

The real question is not whether Milvus can handle the workload, but whether the workload is large enough to justify a separate distributed retrieval system. When it is, segments, independent workers, and shared storage provide a clear scaling path. When it is not, benchmark recall and latency on the same query set before accepting the operational cost.

## References

- [Milvus Architecture Overview](https://milvus.io/docs/architecture_overview.md)
- [Milvus Data Processing](https://milvus.io/docs/data_processing.md)
- [Milvus Schema Design](https://milvus.io/docs/schema_design.md)
- [Milvus Index Explained](https://milvus.io/docs/index-explained.md)
- [Milvus Scalar Index](https://milvus.io/docs/scalar_index.md)
- [Milvus Consistency](https://milvus.io/docs/consistency.md)
- [Milvus Main Components and Deployment Modes](https://milvus.io/docs/main_components.md)
- [Milvus Backup](https://milvus.io/docs/milvus_backup_overview.md)
- [Milvus GitHub Repository](https://github.com/milvus-io/milvus)
- [Vector Database Comparison](/posts/ai/2026-03-12-vector-database-comparison-en)
