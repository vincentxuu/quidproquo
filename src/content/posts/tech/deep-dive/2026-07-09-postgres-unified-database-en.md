---
title: "Is PostgreSQL Really Enough? Don't Rush to Adopt Specialized Databases"
date: 2026-07-09
type: deep-dive
category: tech
tags: [postgresql, database, redis, clickhouse, architecture, pgvector]
lang: en
tldr: "Most teams don't need five databases. PostgreSQL's extension ecosystem covers caching, queues, full-text search, and vector search — but the real decision isn't 'can it do it' but 'where does ops cost cross performance needs.'"
description: "A practical assessment of the 'Just Use Postgres' movement: analyzing PostgreSQL's ability to replace Redis, Elasticsearch, MongoDB, and vector databases, with a framework for when to stick with Postgres vs. adopt specialized tools."
draft: false
---

🌏 [中文版本](/posts/tech/deep-dive/2026-07-09-postgres-unified-database)

"Just Use Postgres" has become a rallying cry in tech circles. The argument: you don't need Redis for caching, RabbitMQ for queues, Elasticsearch for search, or Pinecone for vectors — PostgreSQL handles all of it.

Is it right? For most teams, yes. But only if you understand which swaps are painless, which are workable, and which you'll regret.

---

## The Replacement Table: Not All Swaps Are Equal

The commonly shared replacement table looks like this:

| What you think you need | PostgreSQL alternative |
|---|---|
| Redis (caching) | UNLOGGED tables, materialized views |
| RabbitMQ (queues) | SKIP LOCKED, pgmq |
| Elasticsearch (search) | tsvector, pg_trgm |
| MongoDB (documents) | JSONB |
| Pinecone (vectors) | pgvector |
| InfluxDB (time-series) | TimescaleDB |
| Neo4j (graph) | Apache AGE, recursive CTEs |

The table isn't wrong, but it conflates "can do" with "works well." In practice, these replacements fall into three tiers:

### Near-painless replacements

**JSONB replacing MongoDB** — this is often an upgrade, not a compromise. You get GIN indexes, `@>` containment queries, and jsonpath, while keeping ACID transactions and JOINs. MongoDB's document model forces you to denormalize related data into single documents to avoid cross-collection queries, but real-world data relationships don't always nest cleanly. PostgreSQL lets you mix relational and document models.

**pgvector replacing dedicated vector databases** — pgvectorscale achieved 28x lower p95 latency than Pinecone on a 50M vector benchmark. For most applications, keeping vectors alongside business data in one database — queryable with a single SQL JOIN — saves far more engineering time than maintaining a sync pipeline between two systems.

**SKIP LOCKED replacing simple queues** — `SELECT ... FOR UPDATE SKIP LOCKED` is PostgreSQL's native concurrent job processing mechanism. Graphile Worker (Node.js), River (Go), and Oban (Elixir) are production-grade queue libraries built on it. For workloads of tens to hundreds of jobs per second, it's more than enough.

### Workable but with clear trade-offs

**UNLOGGED tables replacing Redis caching** — UNLOGGED tables skip the WAL for faster writes, but data is lost on crash, there's no native TTL, and no Redis sorted sets or HyperLogLog. If your caching needs are "store API responses, re-query on expiry," materialized views with `REFRESH MATERIALIZED VIEW CONCURRENTLY` are actually more robust. But if you need sub-millisecond hot reads, or tools like BullMQ that are tightly coupled to Redis data structures, PostgreSQL can't substitute.

**tsvector + pg_trgm replacing Elasticsearch** — PostgreSQL's full-text search handles blog search, product catalogs with hundreds of thousands of records, no problem. ParadeDB brings the BM25 algorithm into PostgreSQL, narrowing the gap further. But Elasticsearch's nested aggregations, cluster-level horizontal scaling, and the Kibana ecosystem — if you're doing log analytics or petabyte-scale search, PostgreSQL isn't in the same league.

**TimescaleDB replacing InfluxDB** — hypertables plus continuous aggregates are excellent for time-series data, and you keep full SQL capabilities. But TimescaleDB itself is an extension you need to maintain — it's not "just PostgreSQL," it's "PostgreSQL's extension ecosystem."

### Forced replacements you'll regret

**Apache AGE replacing Neo4j** — simple graph queries work fine, but deep multi-hop traversals across billions of edges will struggle. Recursive CTEs degrade sharply beyond 5-6 levels of depth. If your core business is a social graph or knowledge graph, PostgreSQL isn't the right tool.

**PostgreSQL replacing Kafka** — LISTEN/NOTIFY and pgmq handle simple message passing, but Kafka's log-based architecture (ordered, partitioned, replayable, multi-consumer group) is a fundamentally different thing. For high-throughput event streaming, PostgreSQL doesn't cut it.

---

## The Real Argument Is Ops Cost

The core of "Just Use Postgres" isn't that PostgreSQL beats every specialized tool — it doesn't. The core argument is: **the hidden cost of running additional systems is severely underestimated.**

Every additional database means:

- One more backup and restore pipeline to test
- One more monitoring and alerting stack to configure
- One more authentication and network security layer to manage
- One more upgrade and version compatibility path to track
- One more system the on-call engineer needs to understand at 3 AM
- One more place where data consistency between systems can break

For a five-person team, running PostgreSQL + Redis + Elasticsearch + ClickHouse means every engineer needs basic operational competence across all four systems. This isn't a technology problem — it's a staffing problem.

The most overlooked cost is **data synchronization**. When your search index lives in Elasticsearch, primary data in PostgreSQL, and cache in Redis, you're perpetually debugging "why does search show stale data." Put it all in one database, write with one transaction, and this entire category of bugs disappears.

---

## How Others Have Done It

A few cases worth studying:

**Instacart** migrated product search from Elasticsearch back to PostgreSQL + pgvector + ts_rank — 10x reduction in write workload, 80% cost savings, and 6% fewer dead-end searches. They found Elasticsearch's operational complexity far exceeded its search quality advantage.

**Supabase** built their entire platform on PostgreSQL — vector search, auth, realtime, edge functions, all powered by PostgreSQL's extension ecosystem.

Someone on HN shared running a single PostgreSQL instance with 4 billion records using partitioning and partial indexes — the company got acquired, so they agreed PostgreSQL was indeed enough.

On the other side: **OpenAI** added Azure Cosmos DB alongside PostgreSQL because 800 million ChatGPT users' write volume exceeded what PostgreSQL's single-writer architecture could handle. Reads scaled fine with ~50 read replicas, but writes couldn't scale horizontally.

The key point: OpenAI pushed PostgreSQL until it actually broke, then added a new system. They knew exactly where the bottleneck was and why they needed to switch.

---

## Decision Framework: When to Keep Pushing PostgreSQL

When making the call, ask three questions:

### 1. Is the bottleneck real or imagined?

"We might need to handle heavy search traffic someday" isn't a reason to add Elasticsearch. Start with PostgreSQL's tsvector, run it in production, and when it actually slows down — with concrete query plans and latency numbers to analyze — then evaluate alternatives.

### 2. Is the new system solving a PostgreSQL limitation, or a usage problem?

Many cases of "PostgreSQL is too slow" trace back to:
- Missing appropriate indexes
- Poorly written queries (N+1, unnecessary JOINs)
- No connection pooling (PgBouncer)
- No proper partitioning

Before adding a new system, make sure you're using the current one correctly.

### 3. Can your team afford the ops burden?

If you have a dedicated DBA or SRE, the marginal cost of adding a specialized database is lower. But if you're a three-person full-stack team, every additional system means everyone needs to learn one more thing, and on-call complexity doubles.

---

## The 0.3% Trap

Only about 0.3% of projects ever reach webscale. But teams routinely architect for that 0.3% during technology selection.

There's a name for this: **resume-driven development**. You pick Kafka not because you need event streaming, but because you want Kafka on your resume. You pick microservices not because your team is large enough to need independent deployments, but because microservices sound impressive.

Notion runs on "boring" technology. Instagram's early architecture was PostgreSQL + Redis + Memcached. Netflix's innovation is in video streaming and recommendation algorithms, not database selection.

Spend your innovation budget on your core product. Use the most boring, most battle-tested option for infrastructure.

---

## Where PostgreSQL Genuinely Falls Short

In fairness, here are PostgreSQL's hard limits:

| Scenario | Why PostgreSQL isn't enough | Use instead |
|---|---|---|
| Sustained >1,500 writes/sec and growing | Single-writer architecture, can't horizontally scale writes | CockroachDB, Cassandra, DynamoDB |
| Aggregate analytics over billions of rows | Lacks cross-node intra-query parallelism | ClickHouse, DuckDB, Snowflake |
| Sub-millisecond hot reads | Disk I/O latency can't match pure in-memory | Redis |
| Global multi-region active-active | Not designed for distributed deployment | CockroachDB, Spanner |
| High-throughput event streaming | LISTEN/NOTIFY isn't log-based architecture | Kafka, Redpanda |

Note that these are very specific conditions. If your write volume is tens per second, data is in the tens of millions of rows, and users are in a single region, you won't hit any of these limits.

---

## Conclusion

"PostgreSQL is enough" is correct for 95% of teams — but the point isn't how powerful PostgreSQL is. The point is you don't need those specialized tools yet.

Practical advice:

1. **Start with PostgreSQL**, using JSONB, tsvector, and pgvector from day one
2. **Wait for concrete bottleneck data**, not imagined future needs
3. **When adding a specialized tool, have a clear isolation reason** — workload conflict (OLTP vs OLAP), ecosystem lock-in (BullMQ → Redis), or hard performance limits
4. **For every new system, ask: who operates it? When it crashes at 3 AM, who fixes it?**

A closing quote from POSETTE 2025 Postgres Conference:

> PostgreSQL is the best because it's good enough for the task you didn't know you had.

Start with PostgreSQL. When you actually need something else, you'll know — because you'll have data, not guesses.

## References

- [Just Use Postgres for Everything](https://www.amazingcto.com/postgres-for-everything/) — Amazing CTO
- [You Don't Need All Those Databases](https://www.postgresql.org/about/news/posette-2025/) — POSETTE 2025 Postgres Conference
- [pgvectorscale: 28x lower p95 latency than Pinecone](https://www.timescale.com/blog/pgvector-is-now-as-fast-as-pinecone-at-75-less-cost/) — Timescale
- [Instacart: Migrating from Elasticsearch to PostgreSQL](https://tech.instacart.com/) — Instacart Engineering
- [ClickHouse: When PostgreSQL Analytics Queries Slow Down](/posts/tech/2026-03-27-clickhouse-analytics-database-en) — quidproquo
- [Redis Primer: Cache, Session, Pub/Sub](/posts/tech/2026-03-27-redis-cache-queue-overview-en) — quidproquo
