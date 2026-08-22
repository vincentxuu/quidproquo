---
title: "pgvector Deep Dive: Bringing Vector Search Back into PostgreSQL"
date: 2026-08-22
category: ai
type: deep-dive
tags: [pgvector, vector-database, postgresql, rag, embedding]
lang: en
tldr: "pgvector is a PostgreSQL extension, not a standalone vector database. It adds exact and approximate vector search to the same data model, transactions, and operations stack, while leaving index tuning and horizontal scaling as PostgreSQL concerns."
description: "A practical deep dive into pgvector data modeling, transactions, ingestion, distance queries, HNSW, IVFFlat, iterative scans, filtering, and production operations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-pgvector-guide)

[pgvector](https://github.com/pgvector/pgvector) is a PostgreSQL extension, not a separate vector database. After installing it, you still connect to PostgreSQL, create ordinary tables, and write SQL. The extension adds vector data types, distance operators, and two approximate nearest-neighbor indexes: HNSW and IVFFlat.

That distinction defines its value. A product, tenant, authorization rule, source document, and embedding can live in the same row. Relational data and vectors can change in the same transaction. There is no second vector store to synchronize, and the existing PostgreSQL approach to permissions, backups, replication, and observability remains available.

The inverse is equally important: pgvector does not turn PostgreSQL into a distributed vector-search engine by default. Sharding, capacity planning, vacuuming, index rebuilds, and high availability remain PostgreSQL architecture problems. If you are still surveying the landscape, start with the site's [vector database comparison](/posts/ai/2026-03-12-vector-database-comparison-en), then decide whether avoiding another system matters more than the scaling features of a dedicated engine.

## Data model: vectors become transactional data

pgvector provides `vector`, half-precision `halfvec`, binary `bit`, and `sparsevec` types. These are PostgreSQL column types rather than opaque objects in an external service, so they can coexist with foreign keys, unique constraints, JSONB, row-level security, and conventional indexes.

```sql
CREATE EXTENSION vector;

CREATE TABLE documents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id bigint NOT NULL,
  source_url text NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL,
  UNIQUE (tenant_id, source_url)
);

CREATE INDEX documents_tenant_id_idx ON documents (tenant_id);
```

PostgreSQL's [`CREATE EXTENSION`](https://www.postgresql.org/docs/current/extend-extensions.html) manages an extension's types, functions, and index access methods as a related set of objects. The pgvector [README](https://github.com/pgvector/pgvector/blob/master/README.md?plain=1) currently demonstrates version 0.8.6 and supports PostgreSQL 13 and later. Production deployments should pin the extension version they actually run instead of tracking `master`.

The transaction boundary is the more consequential feature. An application can insert a document and its embedding in one commit; if either operation fails, both roll back. This removes the dual-write state in which primary data has changed but an external vector index has not caught up.

```sql
BEGIN;

INSERT INTO documents (tenant_id, source_url, content, embedding)
VALUES (42, 'https://example.com/a', '...', $1)
ON CONFLICT (tenant_id, source_url) DO UPDATE
SET content = EXCLUDED.content,
    embedding = EXCLUDED.embedding;

COMMIT;
```

## Ingestion and querying: keep exact search as a baseline

For an initial bulk load, use binary `COPY` and build indexes after the data is loaded, as the official README recommends. Routine changes use ordinary `INSERT`, `UPDATE`, `DELETE`, or upsert operations and flow through PostgreSQL's write-ahead log.

Without an approximate index, pgvector performs exact nearest-neighbor search. That is useful for smaller datasets, workloads requiring full recall, and—crucially—a test oracle:

```sql
SELECT id, content,
       embedding <=> $1::vector AS cosine_distance
FROM documents
WHERE tenant_id = 42
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

`<->` computes L2 distance, `<#>` negative inner product, and `<=>` cosine distance. A query needs a distance expression in ascending `ORDER BY` with `LIMIT` for the planner to consider the matching vector index. The metric is a contract with the embedding model and its normalization scheme, not a database preference. Test both latency and recall with representative queries.

The practical move is to save exact results before adding an approximate index. Whenever an index parameter changes, compare top-k overlap using the same query set instead of celebrating a faster isolated query.

## HNSW, IVFFlat, and filtering

HNSW builds a multilayer graph and requires no training step. The official documentation describes a stronger speed-recall tradeoff in general, with slower builds and higher memory use. IVFFlat partitions vectors into lists. It builds faster and uses less memory, but should be created after data exists and requires calibration of `lists` and query-time `probes`.

```sql
CREATE INDEX CONCURRENTLY documents_embedding_hnsw_idx
ON documents USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- An alternative when memory is constrained and recall will be calibrated
CREATE INDEX CONCURRENTLY documents_embedding_ivfflat_idx
ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

Both are approximate nearest-neighbor indexes, so results can differ from an exact scan after the index is added. HNSW exposes `hnsw.ef_search` for its query candidate list; IVFFlat exposes `ivfflat.probes` for the number of lists searched. Raising either generally performs more work and may improve recall. No single default fits every distribution.

Filtering is the common trap. For approximate indexes, pgvector scans the vector index and applies the `WHERE` filter afterward. If a tenant predicate retains only a small fraction of candidates, a `LIMIT 10` query may return fewer than ten rows. The pgvector [0.8.0 changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md#080-2024-10-30) introduced iterative index scans, allowing the index to continue scanning when filtering leaves too few results, until it has enough rows or reaches a configured ceiling.

```sql
BEGIN;
SET LOCAL hnsw.iterative_scan = relaxed_order;
SET LOCAL hnsw.ef_search = 100;

WITH candidates AS MATERIALIZED (
  SELECT id, content, embedding <=> $1::vector AS distance
  FROM documents
  WHERE tenant_id = 42
  ORDER BY distance
  LIMIT 10
)
SELECT * FROM candidates
ORDER BY distance + 0;
COMMIT;
```

`strict_order` preserves exact distance ordering. `relaxed_order` permits slight disorder for better recall, after which a materialized CTE can restore the final order. A stable, highly selective predicate may also suit a partial index. With many filter combinations, benchmark ordinary B-tree filters, partitioning, and iterative scans together. A B-tree on `tenant_id` does not guarantee that the planner will pre-filter rows before traversing HNSW.

## Deployment and operations: inherit PostgreSQL, including its work

pgvector uses WAL, so it participates in PostgreSQL replication and point-in-time recovery. That does not mean installing an extension creates high availability. You still need to test restores, ensure standby hosts carry compatible extension files, and plan an upgrade sequence in which `CREATE EXTENSION` or `ALTER EXTENSION` can find the required versions.

Use `CREATE INDEX CONCURRENTLY` for initial production indexing to avoid the write blocking of a regular index build. Bulk-load first and index afterward. When queries slow down, start with:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id
FROM documents
WHERE tenant_id = 42
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

Monitoring needs two layers: use `pg_stat_statements` for latency and call volume, and use an offline query set comparing ANN output with exact scans for recall. HNSW vacuuming can be slow; the project recommends concurrently reindexing first when necessary, then vacuuming. Index size, dead tuples, WAL volume, and the in-memory working set all belong in capacity planning.

The official [PostgreSQL 18 release announcement](https://www.postgresql.org/about/news/postgresql-18-released-3142/) added asynchronous I/O and richer `EXPLAIN ANALYZE` details for buffers, WAL, and reads. These are PostgreSQL-wide capabilities, not a promise that every pgvector query receives a fixed speedup. Validate upgrades against your own data and query plans.

## When pgvector fits—and when it does not

pgvector fits when product data already lives in PostgreSQL; vectors must change atomically with authorization, tenants, inventory, or document versions; the team wants to retain SQL, backup, and monitoring practices; and the workload fits within a PostgreSQL cluster and its read replicas. In that setting, eliminating dual writes and a second operational surface can matter more than the highest benchmarked ANN throughput.

Warning signs point the other way: vectors are the primary data rather than an attached column; the workload needs automatic cross-node sharding and continual expansion; operations depend on a dedicated engine's distributed index lifecycle; or representative filter and multi-vector queries cannot meet targets within PostgreSQL planner and index constraints. At that point, evaluate a dedicated vector database instead of using a larger `work_mem` setting to postpone the architecture decision.

The useful selection test is concrete: build a pgvector trial with the real schema, filter selectivity, and embeddings. Preserve exact search as the recall baseline. Measure HNSW and IVFFlat on write cost, p95 latency, recall, index size, and rebuild time. If it meets the target, you gain a column type and an index—not another data platform to operate.

## References

- [pgvector README](https://github.com/pgvector/pgvector/blob/master/README.md?plain=1)
- [pgvector changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md)
- [PostgreSQL: Packaging Related Objects into an Extension](https://www.postgresql.org/docs/current/extend-extensions.html)
- [PostgreSQL: Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [PostgreSQL: Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL 18 Released](https://www.postgresql.org/about/news/postgresql-18-released-3142/)
- [Vector Database Selection: Pinecone, Weaviate, Qdrant, or Vectorize?](/posts/ai/2026-03-12-vector-database-comparison-en)
