---
title: "ClickHouse: When PostgreSQL Analytics Queries Start Slowing Down, You Need OLAP"
date: 2026-03-27
type: guide
category: tech
tags: [clickhouse, analytics, olap, database]
lang: en
tldr: "ClickHouse is a column-oriented OLAP database that scans hundreds of millions of rows in seconds. DaoDao uses it to record user behavior events for the AI recommendation engine's feature engineering, letting PostgreSQL focus on transactional data."
description: "ClickHouse is an open-source column-oriented analytics database designed for aggregation queries over large datasets. This post covers the difference between OLAP and OLTP, ClickHouse's core design, basic SQL syntax, and why DaoDao added ClickHouse alongside PostgreSQL to handle behavioral analytics."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-clickhouse-analytics-database)

PostgreSQL is hard to beat for CRUD operations. But when you need to "aggregate all user learning behavior events over the past 30 days, group them by type, and calculate usage rates per feature," a table with millions of rows starts to hurt.

This isn't a PostgreSQL problem — it's the wrong tool for the job. PostgreSQL is an OLTP database, designed for point queries (find user by id) and writes. ClickHouse is an OLAP database, designed for aggregation queries over large datasets.

---

## OLTP vs OLAP

| | OLTP (e.g. PostgreSQL) | OLAP (e.g. ClickHouse) |
|---|---|---|
| Design goal | Transactional reads/writes | Aggregation analytics queries |
| Data storage | Row-oriented | Column-oriented |
| Query types | Point queries, JOINs | GROUP BY, SUM, COUNT |
| Writes | Row-by-row | Batch inserts |
| Best for | User data, orders, relations | Behavior events, logs, metrics |

**The key advantage of column-oriented storage**: analytics queries typically only touch a few columns (`SELECT event_type, COUNT(*) FROM events GROUP BY event_type`). Row-oriented storage must read the entire row, while column-oriented storage reads only the relevant columns — far less I/O. On top of that, data within a single column shares the same type, enabling much higher compression ratios. ClickHouse typically achieves 5–10x better compression than PostgreSQL.

---

## ClickHouse Core Features

**MergeTree Engine**: ClickHouse's default table engine. Data is merged asynchronously after insertion, sorted by primary key, making range queries highly efficient.

**Vectorized Execution**: The query engine uses SIMD instructions to process data in batches — the same operation runs on multiple rows at once, far faster than row-by-row processing.

**Distributed Queries**: ClickHouse Cluster supports sharding and replication, allowing horizontal scaling when a single node isn't enough.

**SQL Compatible**: Basic SQL syntax is close to PostgreSQL, with some ClickHouse-specific functions like `toStartOfHour()` and `quantile()`.

---

## Basic Usage

**Creating an Events Table**

```sql
CREATE TABLE user_events (
    event_id     UUID DEFAULT generateUUIDv4(),
    user_id      String,
    event_type   LowCardinality(String),  -- few distinct values; LowCardinality compresses well
    page         String,
    duration_ms  UInt32,
    created_at   DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)   -- partition by month
ORDER BY (user_id, created_at);      -- primary key / sort index
```

A few type-selection tips for ClickHouse:
- `LowCardinality(String)`: when a column has few distinct values (e.g. event_type with only a few dozen variants), this gives excellent compression
- `DateTime` vs `DateTime64`: the former is second-precision, the latter millisecond-precision
- Partitioning by month lets queries skip irrelevant partitions, speeding up "last 30 days" style queries

**Inserting Data**

```sql
-- Batch insert (most efficient with 1000+ rows at a time)
INSERT INTO user_events (user_id, event_type, page, duration_ms)
VALUES
  ('user-1', 'page_view', '/dashboard', 1200),
  ('user-2', 'click', '/goals', 300),
  ...
```

ClickHouse is not suited for row-by-row inserts (each INSERT creates a new part). Always batch your writes, or use a Buffer table as an intermediary.

**Aggregation Queries**

```sql
-- Event type usage counts over the past 7 days
SELECT
    event_type,
    COUNT(*) AS cnt,
    COUNT(DISTINCT user_id) AS unique_users
FROM user_events
WHERE created_at >= now() - INTERVAL 7 DAY
GROUP BY event_type
ORDER BY cnt DESC;

-- Daily active user trend
SELECT
    toDate(created_at) AS date,
    COUNT(DISTINCT user_id) AS dau
FROM user_events
WHERE created_at >= now() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;
```

These queries over millions of rows might take seconds or even tens of seconds in PostgreSQL. ClickHouse typically handles them in a few hundred milliseconds.

---

## How DaoDao Uses ClickHouse

DaoDao's Python AI backend (`daodao-ai-backend`) uses ClickHouse specifically for behavioral analytics.

**Tracked Event Types**
- `page_view`: Page visits (which page, how long)
- `practice_start` / `practice_complete`: Start and completion of learning practices
- `goal_interaction`: Interactions on the goals page
- `social_action`: Social actions like follows, likes, and comments

**Use Case: Recommendation Engine Feature Engineering**

```python
# Celery task — periodically pulls features from ClickHouse
@app.task
def build_user_features(user_id: str):
    features = clickhouse_client.query("""
        SELECT
            COUNT(*) AS total_practices,
            AVG(duration_ms) AS avg_session_duration,
            groupArray(event_type) AS recent_actions
        FROM user_events
        WHERE user_id = %(user_id)s
          AND created_at >= now() - INTERVAL 14 DAY
    """, parameters={"user_id": user_id})

    # Cache feature vector in Redis for the recommendation engine
    redis.set(f"features:{user_id}", json.dumps(features), ex=3600)
```

**Architecture Division of Responsibility**

```
User Action
    │
    ├── Write to PostgreSQL (structured data: goals, practice records, social graph)
    │
    └── Write to ClickHouse (behavior events: page views, interactions, learning progress)
                │
        Celery Worker (feature engineering)
                │
          Recommendation Engine (Qdrant semantic search + behavioral features)
```

The boundary between PostgreSQL and ClickHouse is clear: PostgreSQL owns "what data does this user have," while ClickHouse owns "what actions has this user taken."

---

## Connecting to ClickHouse (Python)

```bash
pip install clickhouse-connect
```

```python
import clickhouse_connect

client = clickhouse_connect.get_client(
    host='localhost',
    port=8123,
    username='default',
    password='',
    database='daodao',
)

# Insert
client.insert('user_events', [
    ['user-123', 'page_view', '/dashboard', 1200],
], column_names=['user_id', 'event_type', 'page', 'duration_ms'])

# Query
result = client.query(
    "SELECT event_type, COUNT(*) FROM user_events GROUP BY event_type"
)
for row in result.result_rows:
    print(row)
```

---

## Trade-offs

**Pros**
- Extremely fast aggregation queries — billions of rows in seconds
- High compression ratio; storage costs are much lower than PostgreSQL
- Familiar SQL syntax; low learning curve
- Open source; self-hostable or available as ClickHouse Cloud

**Cons**
- UPDATE / DELETE are technically possible but slow and limited — fine for event data, which is immutable by nature, but a bad fit if your data needs frequent modification
- JOIN performance is worse than PostgreSQL; schema design should lean toward denormalization
- Row-by-row writes are inefficient; batching is required
- Not a replacement for PostgreSQL as an OLTP store — these are complementary tools

---

## When to Add ClickHouse

If your PostgreSQL analytics queries still complete in under a few hundred milliseconds, there's no urgency to add ClickHouse. Consider adding it when:

- Your events / logs table exceeds a few million rows and GROUP BY starts slowing down
- You need real-time analytics across multiple dimensions (DAU, retention rates, funnel analysis)
- Your recommendation system requires heavy behavioral feature engineering

In the early MVP stage, a single PostgreSQL is enough. Add ClickHouse when the pain is real — don't over-optimize prematurely.

---

## References

- [ClickHouse Official Docs](https://clickhouse.com/docs)
- [MergeTree Engine In Depth](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree)
- [clickhouse-connect Python Client](https://github.com/ClickHouse/clickhouse-connect)
- [ClickHouse vs PostgreSQL Comparison](https://clickhouse.com/docs/en/faq/general/columnar-database)
- [DaoDao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Full context on how ClickHouse serves as the behavioral analytics database in the AI backend, working alongside Qdrant and Celery to power the recommendation engine's feature engineering pipeline
